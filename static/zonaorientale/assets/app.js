import {
  db,
  auth,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "./firebase.js";

import {
  COLLECTIONS,
  COMPETITION_TYPES,
  COMPETITION_FORMATS,
  COMPETITION_STATUSES,
  DEFAULT_COMPETITIONS,
  MATCH_STATUSES,
  STANDARD_KNOCKOUT_MATCHDAYS,
  STADIUM_LEVELS,
  ADMIN_PANEL_IDS,
  LISTONE_COLUMNS,
  DEFAULT_HIDDEN_LISTONE_COLUMNS
} from "./js/core/constants.js";
import { state } from "./js/core/state.js";
import { $, $$ } from "./js/core/dom.js";
import { escapeHtml, byText, normalizeKey, downloadJson } from "./js/core/utils.js";
import { loadCollection } from "./js/data/firestore-service.js";
import { loadListoniData, loadRostersData, loadCompetitionCalendarData } from "./js/data/static-files-service.js";
import { ensureMobilePageScrollHandle } from "./js/mobile/mobile-scrollbar.js";
import { setupMobileTables } from "./js/mobile/mobile-tables.js?v=85";
import { setupAdaptiveMobileViewport } from "./js/mobile/mobile-viewport.js";

const LISTONE_MOBILE_DEFAULT_HIDDEN_COLUMNS_V82 = [
  "quotationInitial",
  "quotationDiff",
  "quotationCurrentMantra",
  "quotationInitialMantra",
  "quotationDiffMantra",
  "fvm",
  "fvmMantra",
  "rosterRole",
  "rosterCost",
  "sourceSheet"
];

for (const key of LISTONE_MOBILE_DEFAULT_HIDDEN_COLUMNS_V82) {
  state.hiddenListoneColumns.add(key);
}

import {
  renderBoldMarkdown,
  getTodayIsoDate,
  safeFileName,
  showMessage,
  setError,
  setLoadingText,
  getLabel,
  parseDecimalValue,
  makeIdPart,
  getInitials,
  isBase64Logo,
  normalizeLogoPath,
  getLogoPathForInput,
  renderTeamLogo,
  readLogoFileAsDataUrl
} from "./js/core/ui.js";
import {
  formatStadium,
  formatListoneNumber,
  formatFm,
  getRosterRoleSortValue,
  sortRosterPlayersByRole
} from "./js/core/formatters.js";
import {
  formatSeasonShortLabel,
  getTeamDisplayName
} from "./js/domain/entities.js";
import {
  normalizePlayerName,
  normalizeRosterKey,
  getRosterAliasKeys,
  mapStaticRosterPlayers
} from "./js/domain/rosters.js";
import {
  FM_MOVEMENT_TYPES,
  getFmMovementLabel,
  renderFmMovementTypeBadge
} from "./js/domain/fm-movements.js";
import {
  getCompetitionStatusClass,
  requestStatusLabel,
  requestTypeLabel,
  newsTopicLabelV48
} from "./js/domain/labels.js";
import { getDashboardNewsPreview } from "./js/domain/news.js";
import {
  getListoneValue,
  compareListoneValues
} from "./js/domain/listone.js";
import {
  getMatchSerieAMatchday,
  getCompetitionShortCode,
  formatMatchStage,
  formatMatchResult
} from "./js/domain/matches.js";
import {
  loadXlsxLibrary,
  abbreviateRealTeam,
  parseListoneSheetRows
} from "./js/admin/listone-converter.js";


function getRosterSnapshotForSeason(seasonId = getCurrentSeasonId()) {
  const seasonal = state.rosters.filter((item) => item.seasonId === seasonId);
  return seasonal[0] || state.rosters[0] || null;
}

function buildRosterPlayerIndex(seasonId = getCurrentSeasonId()) {
  const snapshot = getRosterSnapshotForSeason(seasonId);
  const index = new Map();
  if (!snapshot) return index;

  snapshot.rosters.forEach((roster) => {
    (roster.players || []).forEach((player) => {
      index.set(normalizeKey(player.playerName), {
        ...player,
        fantasyRoster: roster.name
      });
    });
  });
  return index;
}

function enrichListoneWithRosters(listone) {
  if (!listone) return null;
  const rosterIndex = buildRosterPlayerIndex(listone.seasonId || getCurrentSeasonId());
  if (!rosterIndex.size) return listone;

  return {
    ...listone,
    players: (listone.players || []).map((player) => {
      if (player.fantasyRoster) return player;
      const rosterPlayer = rosterIndex.get(normalizeKey(player.playerName));
      if (!rosterPlayer) return { ...player, fantasyRoster: "Svincolati" };
      return {
        ...player,
        fantasyRoster: rosterPlayer.fantasyRoster,
        rosterRole: rosterPlayer.role || player.rosterRole || "",
        rosterCost: rosterPlayer.cost ?? player.rosterCost ?? ""
      };
    })
  };
}

function getRosterForSeasonTeam(seasonTeam) {
  const snapshot = getRosterSnapshotForSeason(seasonTeam?.seasonId || getCurrentSeasonId());
  if (!snapshot || !seasonTeam) return null;
  const target = normalizeKey(seasonTeam.name || "");
  return snapshot.rosters.find((roster) => normalizeKey(roster.name) === target) || null;
}

async function loadData() {
  const entries = await Promise.all(
    COLLECTIONS.map(async (name) => [name, await loadCollection(name)])
  );
  state.raw = Object.fromEntries(entries);
  await loadListoniData();
  await loadRostersData();
  sortData();
  renderAll();
}

function sortData() {
  state.raw.seasons.sort((a, b) => String(b.id).localeCompare(String(a.id), "it"));
  state.raw.presidents.sort(byText("name"));
  state.raw.teams.sort(byText("canonicalName"));
  state.raw.seasonTeams.sort((a, b) => {
    const seasonCompare = String(b.seasonId || "").localeCompare(String(a.seasonId || ""), "it");
    if (seasonCompare) return seasonCompare;
    return String(a.name || "").localeCompare(String(b.name || ""), "it");
  });
  state.raw.competitions.sort((a, b) => {
    const seasonCompare = String(b.seasonId || "").localeCompare(String(a.seasonId || ""), "it");
    if (seasonCompare) return seasonCompare;
    return String(a.name || "").localeCompare(String(b.name || ""), "it");
  });
  state.raw.competitionMatches.sort(compareMatchesForDisplay);
  state.raw.fifaRankings.sort((a, b) => Number(b.score || 0) - Number(a.score || 0));
  state.raw.competitionResults.sort((a, b) => {
    const competitionCompare = String(a.competitionId || "").localeCompare(String(b.competitionId || ""), "it");
    if (competitionCompare) return competitionCompare;
    return Number(a.position || 999) - Number(b.position || 999);
  });
}

function buildMaps() {
  return {
    presidentsById: new Map(state.raw.presidents.map((item) => [item.id, item])),
    teamsById: new Map(state.raw.teams.map((item) => [item.id, item])),
    seasonsById: new Map(state.raw.seasons.map((item) => [item.id, item])),
    seasonTeamsById: new Map(state.raw.seasonTeams.map((item) => [item.id, item])),
    competitionsById: new Map(state.raw.competitions.map((item) => [item.id, item])),
    stadiumsBySeasonTeamId: new Map(state.raw.stadiums.map((item) => [item.seasonTeamId, item])),
    fifaRankingsByTeamId: new Map(state.raw.fifaRankings.map((item) => [item.teamId, item]))
  };
}

function getLeagueSettings() {
  return state.raw.leagueSettings.find((item) => item.id === "main") || state.raw.leagueSettings[0] || null;
}

function getDefaultSeasonId() {
  const league = getLeagueSettings();
  if (league?.currentSeasonId) return league.currentSeasonId;
  const current = state.raw.seasons.find((season) => season.isCurrent);
  if (current) return current.id;
  return state.raw.seasons[0]?.id || "";
}

function getCurrentSeasonId() {
  if (state.selectedSeasonId) return state.selectedSeasonId;
  return getDefaultSeasonId();
}

function getFirstSeasonId() {
  return state.raw.seasons[0]?.id || "";
}

function getValidSeasonSelection(key) {
  const currentValue = state[key];
  if (currentValue && state.raw.seasons.some((season) => season.id === currentValue)) {
    return currentValue;
  }

  const fallback = getFirstSeasonId();
  state[key] = fallback;
  return fallback;
}

function getSeasonName(id) {
  const { seasonsById } = buildMaps();
  return seasonsById.get(id)?.name || id || "-";
}

function getPresidentNames(ids = []) {
  const { presidentsById } = buildMaps();
  const names = ids
    .map((id) => presidentsById.get(id)?.name)
    .filter(Boolean);
  return names.length ? names.join(", ") : "-";
}

function getSeasonTeamsForSeason(seasonId) {
  return state.raw.seasonTeams.filter((seasonTeam) => seasonTeam.seasonId === seasonId);
}

function getSeasonTeamById(seasonTeamId) {
  const { seasonTeamsById } = buildMaps();
  return seasonTeamsById.get(seasonTeamId) || null;
}

function getSeasonTeamDisplayName(seasonTeamId) {
  const seasonTeam = getSeasonTeamById(seasonTeamId);
  if (!seasonTeam) return "-";
  return seasonTeam.name || getTeamDisplayName(buildMaps().teamsById.get(seasonTeam.teamId));
}

function renderSeasonTeamNameWithLogo(seasonTeamId, options = {}) {
  const { strong = true, className = "", textClass = "" } = options;
  const seasonTeam = getSeasonTeamById(seasonTeamId);
  const name = getSeasonTeamDisplayName(seasonTeamId);
  const logo = getSeasonTeamLogo(seasonTeam);
  const safeTextClass = escapeHtml(textClass);
  const text = strong
    ? `<strong class="${safeTextClass}">${escapeHtml(name)}</strong>`
    : `<span class="${safeTextClass}">${escapeHtml(name)}</span>`;

  return `<span class="club-name-with-logo ${escapeHtml(className)}">${renderTeamLogo(name, logo)}${text}</span>`;
}

function renderTeamNameWithLogo(team, options = {}) {
  const { strong = true, className = "" } = options;
  const name = getTeamDisplayName(team);
  const text = strong
    ? `<strong>${escapeHtml(name)}</strong>`
    : `<span>${escapeHtml(name)}</span>`;

  return `<span class="club-name-with-logo ${escapeHtml(className)}">${renderTeamLogo(name, team?.logo || "")}${text}</span>`;
}

function getSeasonTeamLogo(seasonTeam) {
  if (!seasonTeam) return "";
  const { teamsById } = buildMaps();
  const team = teamsById.get(seasonTeam.teamId);
  return seasonTeam.logo || team?.logo || "";
}

function getSeasonTeamPresidentNames(seasonTeam) {
  return getPresidentNames(seasonTeam?.presidentIds || []);
}

function getCompetitionResults(competitionId) {
  return state.raw.competitionResults
    .filter((result) => result.competitionId === competitionId)
    .sort((a, b) => Number(a.position || 999) - Number(b.position || 999));
}

function isRankingCompetition(competition) {
  return competition?.format === "CLASSIFICA" || competition?.type === "CAMPIONATO";
}

function getParticipantsCount(seasonId) {
  const { seasonsById } = buildMaps();
  const configured = Number(seasonsById.get(seasonId)?.participantCount || 0);
  const actual = getSeasonTeamsForSeason(seasonId).length;
  return configured || actual;
}

function getHonorRollRow(seasonId) {
  return state.raw.honorRoll.find((row) => row.id === seasonId || row.seasonId === seasonId) || null;
}

function getCompetitionForHonorCell(seasonId, competitionType) {
  return state.raw.competitions.find((competition) =>
    competition.seasonId === seasonId && competition.type === competitionType
  ) || null;
}

function isCompetitionNotDisputed(seasonId, competitionType) {
  return getCompetitionForHonorCell(seasonId, competitionType)?.status === "NON_DISPUTATA";
}

function renderNotDisputedBadge() {
  return `<span class="status status-muted">Non disputata</span>`;
}

function renderHonorCell(seasonId, competitionType, seasonTeamId) {
  if (seasonTeamId) return renderSeasonTeamNameWithLogo(seasonTeamId);
  if (isCompetitionNotDisputed(seasonId, competitionType)) return renderNotDisputedBadge();
  return "-";
}

function getWinnerLabel(competition) {
  const results = getCompetitionResults(competition.id);
  const winner = results.find((result) => Number(result.position) === 1);
  const second = results.find((result) => Number(result.position) === 2);

  if (!winner) return "Nessun risultato inserito";

  if (isRankingCompetition(competition)) {
    return `Vincitore ${getSeasonTeamDisplayName(winner.seasonTeamId)}`;
  }

  const secondText = second ? ` · 2° ${getSeasonTeamDisplayName(second.seasonTeamId)}` : "";
  return `Vincitore: ${getSeasonTeamDisplayName(winner.seasonTeamId)}`;
}

function renderWinnerLabelHtml(competition, options = {}) {
  const { highlightWinner = false, withLogo = false } = options;
  const results = getCompetitionResults(competition.id);
  const winner = results.find((result) => Number(result.position) === 1);
  const second = results.find((result) => Number(result.position) === 2);

  if (!winner) return "Nessun risultato inserito";

  const winnerName = getSeasonTeamDisplayName(winner.seasonTeamId);
  const winnerHtml = withLogo
    ? renderSeasonTeamNameWithLogo(winner.seasonTeamId, { textClass: highlightWinner ? "text-success" : "" })
    : `<strong class="${highlightWinner ? "text-success" : ""}">${escapeHtml(winnerName)}</strong>`;

  if (isRankingCompetition(competition)) {
    return `Vincitore ${winnerHtml}`;
  }

  const secondHtml = second
    ? ` · 2° ${withLogo ? renderSeasonTeamNameWithLogo(second.seasonTeamId) : escapeHtml(getSeasonTeamDisplayName(second.seasonTeamId))}`
    : "";

  return `Vincitore: ${winnerHtml}`;
}

function buildPalmares() {
  const { seasonTeamsById, teamsById } = buildMaps();
  const buckets = {
    CAMPIONATO: new Map(),
    COPPA_ITALIA: new Map(),
    CHAMPIONS_LEAGUE: new Map(),
    PLAYOFF: new Map()
  };

  function addWin(type, seasonTeamId) {
    if (!seasonTeamId || !buckets[type]) return;
    const seasonTeam = seasonTeamsById.get(seasonTeamId);
    if (!seasonTeam) return;
    const team = teamsById.get(seasonTeam.teamId);
    if (!team) return;
    const current = buckets[type].get(team.id) || {
      teamId: team.id,
      teamName: team.canonicalName || seasonTeam.name || team.id,
      wins: 0
    };
    current.wins += 1;
    buckets[type].set(team.id, current);
  }

  state.raw.honorRoll.forEach((row) => {
    addWin("CAMPIONATO", row.championItalySeasonTeamId);
    addWin("COPPA_ITALIA", row.coppaItaliaWinnerSeasonTeamId);
    addWin("CHAMPIONS_LEAGUE", row.championsLeagueWinnerSeasonTeamId);
    addWin("PLAYOFF", row.playoffWinnerSeasonTeamId);
  });

  return Object.fromEntries(
    Object.entries(buckets).map(([type, map]) => [
      type,
      Array.from(map.values()).sort((a, b) => b.wins - a.wins || a.teamName.localeCompare(b.teamName, "it"))
    ])
  );
}

function getStadiumForSeasonTeam(seasonTeamId) {
  return state.raw.stadiums.find((stadium) => stadium.seasonTeamId === seasonTeamId) || null;
}


function getCompetitionNameForMatch(match) {
  const { competitionsById } = buildMaps();
  return competitionsById.get(match?.competitionId)?.name || match?.competitionId || "";
}

function getCompetitionShortCodeById(competitionId) {
  const { competitionsById } = buildMaps();
  return getCompetitionShortCode(competitionsById.get(competitionId));
}

function compareMatchesForDisplay(a, b) {
  const competitionCompare = getCompetitionNameForMatch(a).localeCompare(getCompetitionNameForMatch(b), "it");
  if (competitionCompare) return competitionCompare;

  const dateCompare = String(b.matchDate || "").localeCompare(String(a.matchDate || ""), "it");
  if (dateCompare) return dateCompare;

  const serieACompare = getMatchSerieAMatchday(b) - getMatchSerieAMatchday(a);
  if (serieACompare) return serieACompare;

  return String(b.matchday || "").localeCompare(String(a.matchday || ""), "it");
}

function sortMatchesForDisplay(matches) {
  return [...matches].sort(compareMatchesForDisplay);
}

function getCompetitionMatches(competitionId) {
  return sortMatchesForDisplay(
    state.raw.competitionMatches.filter((match) => match.competitionId === competitionId)
  );
}

function renderMatchRows(matches, emptyText = "Nessuna partita inserita.") {
  const sortedMatches = sortMatchesForDisplay(matches);
  if (!sortedMatches.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;

  return `
    <div class="table-wrap match-table-wrap">
      <table>
        <thead>
          <tr><th>Fase</th><th>Partita</th><th>Data</th><th class="number">Risultato</th></tr>
        </thead>
        <tbody>
          ${sortedMatches.map((match) => `
            <tr>
              <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
              <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
              <td data-label="Data">${escapeHtml(match.matchDate || "-")}</td>
              <td data-label="Risultato" class="number">${escapeHtml(formatMatchResult(match))}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function renderDashboardCalendar(seasonId) {
  const target = document.getElementById("dashboardCalendar");
  if (!target) return;

  const competitions = state.raw.competitions.filter((competition) => competition.seasonId === seasonId);
  const groups = competitions
    .map((competition) => {
      const matches = isRankingCompetition(competition)
        ? getNextChampionshipMatches(competition)
        : getCupScheduleMatches(competition);

      return {
        competition,
        label: isRankingCompetition(competition) ? "Prossima giornata" : "Programmazione coppa",
        matches
      };
    })
    .filter((group) => group.matches.length);

  if (!groups.length) {
    target.innerHTML = `<p class="muted">Nessuna partita programmata o giocata per questa stagione.</p>`;
    return;
  }

  target.innerHTML = groups.map((group) => `
    <details class="dashboard-calendar-group dashboard-subsection" open>
      <summary>
        <span>
          <strong>${escapeHtml(group.competition.name)}</strong>
          <small>${escapeHtml(group.label)}</small>
        </span>
        <span class="button button-secondary button-small details-toggle-label" aria-hidden="true">Ingrandisci/Riduci</span>
      </summary>
      <div class="table-wrap match-table-wrap dashboard-calendar-table-wrap">
        <table class="dashboard-calendar-table">
          <thead>
            <tr>
              <th>Fase</th>
              <th>Partita</th>
              <th>Data</th>
              <th class="number">Risultato</th>
            </tr>
          </thead>
          <tbody>
            ${group.matches.map((match) => `
              <tr>
                <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
                <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
                <td data-label="Data">${escapeHtml(match.matchDate || "-")}</td>
                <td data-label="Risultato" class="number">${escapeHtml(formatMatchResult(match))}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </details>`).join("");
}

function renderStadiumsPublic() {
  const target = document.getElementById("stadiumsList");
  if (!target) return;

  const seasonId = getCurrentSeasonId();
  const seasonTeamIds = new Set(getSeasonTeamsForSeason(seasonId).map((seasonTeam) => seasonTeam.id));
  const stadiums = state.raw.stadiums.filter((stadium) => seasonTeamIds.has(stadium.seasonTeamId));

  target.innerHTML = stadiums.length
    ? stadiums.map((stadium) => `
      <div class="stadium-item">
        <div>
          ${renderSeasonTeamNameWithLogo(stadium.seasonTeamId)}
          <span>${escapeHtml(stadium.name || "Stadio senza nome")}</span>
        </div>
        <strong>Livello ${escapeHtml(stadium.level ?? 0)}</strong>
      </div>`).join("")
    : `<p class="muted">Nessuno stadio inserito per questa stagione.</p>`;
}

function buildFifaRanking() {
  const { teamsById } = buildMaps();

  return state.raw.fifaRankings
    .map((ranking) => {
      const team = teamsById.get(ranking.teamId);
      return {
        ...ranking,
        team,
        teamName: team?.canonicalName || ranking.teamName || ranking.teamId || "-",
        score: parseDecimalValue(ranking.score) ?? 0
      };
    })
    .sort((a, b) => b.score - a.score || a.teamName.localeCompare(b.teamName, "it"))
    .map((ranking, index) => ({
      ...ranking,
      position: index + 1
    }));
}

function renderFifaRankingPublic() {
  const ranking = buildFifaRanking();

  if (!ranking.length) return `<p class="muted">Nessun punteggio FIFA inserito.</p>`;

  return `
    <div class="table-wrap fifa-ranking-table-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Squadra</th><th class="number">Punteggio</th></tr>
        </thead>
        <tbody>
          ${ranking.map((item) => `
            <tr>
              <td data-label="#">${item.position}</td>
              <td data-label="Squadra"><span class="club-name-with-logo">${renderTeamLogo(item.teamName, item.team?.logo)}<strong>${escapeHtml(item.teamName)}</strong></span></td>
              <td data-label="Punteggio" class="number"><strong>${escapeHtml(item.score)}</strong></td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function getPlayedMatchesForCompetition(competition) {
  return sortMatchesForDisplay(
    state.raw.competitionMatches.filter((match) => match.competitionId === competition.id && match.status === "GIOCATA")
  );
}

function getUpcomingMatchesForCompetition(competition) {
  return sortMatchesForDisplay(
    state.raw.competitionMatches.filter((match) => match.competitionId === competition.id && match.status !== "GIOCATA")
  );
}

function getLatestChampionshipMatches(competition) {
  const playedMatches = getPlayedMatchesForCompetition(competition);
  if (!playedMatches.length) return [];

  const first = playedMatches[0];
  const serieAMatchday = getMatchSerieAMatchday(first);
  if (serieAMatchday) {
    return playedMatches.filter((match) => getMatchSerieAMatchday(match) === serieAMatchday);
  }

  if (first.matchday) {
    return playedMatches.filter((match) => match.matchday === first.matchday);
  }

  return playedMatches.filter((match) => match.matchDate === first.matchDate);
}

function getNextChampionshipMatches(competition) {
  const upcomingMatches = getUpcomingMatchesForCompetition(competition);
  if (!upcomingMatches.length) return [];

  const first = upcomingMatches[upcomingMatches.length - 1] || upcomingMatches[0];
  const serieAMatchday = getMatchSerieAMatchday(first);
  if (serieAMatchday) {
    return upcomingMatches.filter((match) => getMatchSerieAMatchday(match) === serieAMatchday);
  }

  if (first.matchday) {
    return upcomingMatches.filter((match) => match.matchday === first.matchday);
  }

  return upcomingMatches.filter((match) => match.matchDate === first.matchDate);
}

function getCupScheduleMatches(competition) {
  return sortMatchesForDisplay(
    state.raw.competitionMatches.filter((match) => match.competitionId === competition.id)
  );
}

function getFinalMatchesForCompetition(competition) {
  const finalMatches = getPlayedMatchesForCompetition(competition).filter((match) => /finale|finalissima/i.test(match.matchday || ""));
  if (finalMatches.length) return finalMatches;
  return [];
}

function renderCompactMatchLines(matches) {
  if (!matches.length) return "";

  return `
    <div class="compact-match-lines">
      ${sortMatchesForDisplay(matches).map((match) => `
        <div class="compact-match-line">
          <span>${renderStaticMatchTeamNameV101(match, "home", { strong: false })} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}</span>
          <strong>${escapeHtml(formatMatchResult(match))}</strong>
        </div>`).join("")}
    </div>`;
}

function renderDashboardCompetitionSummary(competition) {
  if (isRankingCompetition(competition)) {
    const latestMatches = getLatestChampionshipMatches(competition);
    if (latestMatches.length) {
      const label = `Ultima giornata ${latestMatches[0].matchday || latestMatches[0].matchDate || "giocata"}`;
      return `<div class="dashboard-competition-summary"><span class="muted">${escapeHtml(label)}</span>${renderCompactMatchLines(latestMatches)}</div>`;
    }
    return `<div class="dashboard-competition-summary">${renderWinnerLabelHtml(competition, { highlightWinner: true, withLogo: true })}</div>`;
  }

  return `<div class="dashboard-competition-summary">${renderWinnerLabelHtml(competition, { highlightWinner: true, withLogo: true })}</div>`;
}



function renderAll() {
  renderLeagueHeader();
  renderSeasonSelectors();
  renderDashboard();
  renderCompetitionsPublic();
  renderPlaceholderPages();
  renderTeamsTable();
  renderStadiumsPublic();
  renderAdminArea();
  setupCollapsibleSections();
}

function renderLeagueHeader() {
  const league = getLeagueSettings();
  const title = document.querySelector("h1");
  if (title && league?.name) title.textContent = league.name;

  const subtitle = document.querySelector(".subtitle");
  if (subtitle && league?.subtitle) subtitle.textContent = league.subtitle;
}

function renderSeasonSelectors() {
  if (!state.selectedSeasonId) state.selectedSeasonId = getDefaultSeasonId();
  const seasonId = getCurrentSeasonId();
  const selects = [
    document.getElementById("globalSeasonSelect")
  ].filter(Boolean);

  for (const select of selects) {
    select.innerHTML = state.raw.seasons
      .map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name || season.id)}</option>`)
      .join("");
    select.value = seasonId;
  }

}

function renderDashboard() {
  const seasonId = getCurrentSeasonId();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const competitions = state.raw.competitions.filter((competition) => competition.seasonId === seasonId);

  const metricClubs = document.getElementById("metricClubs");
  const metricTotalFm = document.getElementById("metricTotalFm");
  const metricAlerts = document.getElementById("metricAlerts");

  if (metricClubs) metricClubs.textContent = String(seasonTeams.length || getParticipantsCount(seasonId) || 0);
  if (metricTotalFm) metricTotalFm.textContent = "- (medio -)";
  if (metricAlerts) metricAlerts.textContent = String(competitions.filter((competition) => competition.status === "ATTIVA").length);

  const standings = document.getElementById("dashboardStandings");
  if (standings) {
    standings.innerHTML = competitions.length
      ? competitions.map((competition) => `
        <details class="stack-item dashboard-subsection dashboard-competition-subsection" open>
          <summary>
            <span>
              <strong>${escapeHtml(getCompetitionPublicDisplayNameV110(competition))}</strong>
              <small class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</small>
            </span>
            <span class="button button-secondary button-small details-toggle-label" aria-hidden="true">Ingrandisci/Riduci</span>
          </summary>
          ${renderDashboardCompetitionSummary(competition)}
        </details>`).join("")
      : `<p class="muted">Nessuna competizione inserita per questa stagione.</p>`;
  }

  renderDashboardCalendar(seasonId);
}

function renderTeamsTable() {
  const tableBody = document.getElementById("clubsTableBody");
  if (!tableBody) return;

  const seasonId = getCurrentSeasonId();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const { teamsById } = buildMaps();

  if (!seasonTeams.length) {
    tableBody.innerHTML = `<tr><td colspan="7" class="muted center">Nessuna squadra associata a ${escapeHtml(seasonId || "questa stagione")}.</td></tr>`;
    return;
  }

  tableBody.innerHTML = seasonTeams.map((seasonTeam, index) => {
    const team = teamsById.get(seasonTeam.teamId);
    const stadium = getStadiumForSeasonTeam(seasonTeam.id);
    const statusClass = seasonTeam.isHistorical ? "status-muted" : "status-ok";
    const statusText = seasonTeam.isHistorical ? "Storica" : "Partecipante";
    const displayName = seasonTeam.name || getTeamDisplayName(team);
    const logo = renderTeamLogo(displayName, getSeasonTeamLogo(seasonTeam));
    const canonicalName = team?.canonicalName || "";
    const canonicalLine = canonicalName && canonicalName !== displayName
      ? `<small class="muted">${escapeHtml(canonicalName)}</small>`
      : "";

    return `
      <tr>
        <td data-label="#">${index + 1}</td>
        <td data-label="Club">
          <span class="club-name-with-logo">${logo}<strong>${escapeHtml(displayName)}</strong></span>
          ${canonicalLine}
        </td>
        <td data-label="Presidente">${escapeHtml(getSeasonTeamPresidentNames(seasonTeam))}</td>
        <td data-label="Saldo FM" class="number">-</td>
        <td data-label="Rosa" class="number">${escapeHtml(getRosterForSeasonTeam(seasonTeam)?.playerCount ?? getRosterForSeasonTeam(seasonTeam)?.players?.length ?? "-")}</td>
        <td data-label="Stadio" class="number">${escapeHtml(formatStadium(stadium))}</td>
        <td data-label="Stato"><span class="status ${statusClass}">${statusText}</span></td>
      </tr>`;
  }).join("");
}

function renderCompetitionResultsPublic(competition) {
  const results = getCompetitionResults(competition.id);
  if (!results.length) return `<p class="muted">Risultati non ancora inseriti.</p>`;

  if (!isRankingCompetition(competition)) {
    const winner = results.find((result) => Number(result.position) === 1);
    const second = results.find((result) => Number(result.position) === 2);
    return `
      <div class="podium-mini-grid">
        <div class="podium-mini-item"><span>Vincitore</span>${winner ? renderSeasonTeamNameWithLogo(winner.seasonTeamId) : "-"}</div>
        <div class="podium-mini-item"><span>Secondo</span>${second ? renderSeasonTeamNameWithLogo(second.seasonTeamId) : "-"}</div>
      </div>`;
  }

  return `
    <div class="table-wrap compact-table result-table-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Squadra</th><th class="number">Punti</th><th class="number">G</th><th class="number">FPT</th></tr>
        </thead>
        <tbody>
          ${results.map((result) => `
            <tr>
              <td data-label="#">${escapeHtml(result.position || "")}</td>
              <td data-label="Squadra">${renderSeasonTeamNameWithLogo(result.seasonTeamId)}</td>
              <td data-label="Punti" class="number">${escapeHtml(result.points ?? "-")}</td>
              <td data-label="G" class="number">${escapeHtml(result.played ?? "-")}</td>
              <td data-label="FPT" class="number">${escapeHtml(result.fantapoints ?? "-")}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function renderCompetitionMatchesPublic(competition) {
  const matches = getCompetitionMatches(competition.id);
  const playedMatches = sortMatchesForDisplay(matches.filter((match) => match.status === "GIOCATA")).slice(0, 5);
  const scheduledMatches = sortMatchesForDisplay(matches.filter((match) => match.status === "DA_GIOCARE")).slice(0, 5);

  if (!playedMatches.length && !scheduledMatches.length) {
    return `<p class="muted">Nessuna partita inserita per questa competizione.</p>`;
  }

  return `
    <div class="competition-matches-public">
      ${playedMatches.length ? `
        <div class="detail-section compact-detail-section">
          <h4>Ultime partite disputate</h4>
          ${renderMatchRows(playedMatches, "Nessuna partita disputata.")}
        </div>` : ""}
      ${scheduledMatches.length ? `
        <div class="detail-section compact-detail-section">
          <h4>Partite programmate</h4>
          ${renderMatchRows(scheduledMatches, "Nessuna partita programmata.")}
        </div>` : ""}
    </div>`;
}

function renderCompetitionsPublic() {
  const list = document.getElementById("competitionsList");
  if (!list) return;

  const seasonId = getCurrentSeasonId();
  const competitions = state.raw.competitions.filter((competition) => competition.seasonId === seasonId);

  if (!competitions.length) {
    list.innerHTML = `<p class="muted">Nessuna competizione inserita per ${escapeHtml(seasonId || "la stagione selezionata")}.</p>`;
    return;
  }

  list.innerHTML = competitions.map((competition) => `
    <article class="competition-card">
      <div class="competition-card-header">
        <div>
          <h3>${escapeHtml(competition.name)}</h3>
        </div>
        <span class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</span>
      </div>
      ${competition.notes ? `<p>${escapeHtml(competition.notes)}</p>` : ""}
      ${renderCompetitionResultsPublic(competition)}
      ${renderCompetitionMatchesPublic(competition)}
    </article>
  `).join("");
}

function renderHonorSummary() {
  const target = document.getElementById("honorSummary");
  if (!target) return;

  const rows = state.raw.seasons.map((season) => {
    const honor = getHonorRollRow(season.id) || {};
    return `
      <tr>
        <td data-label="Stagione"><strong>${escapeHtml(formatSeasonShortLabel(season))}</strong></td>
        <td data-label="Campione">${renderHonorCell(season.id, "CAMPIONATO", honor.championItalySeasonTeamId)}</td>
        <td data-label="2° posto">${renderHonorCell(season.id, "CAMPIONATO", honor.secondPlaceSeasonTeamId)}</td>
        <td data-label="3° posto">${renderHonorCell(season.id, "CAMPIONATO", honor.thirdPlaceSeasonTeamId)}</td>
        <td data-label="Coppa Italia">${renderHonorCell(season.id, "COPPA_ITALIA", honor.coppaItaliaWinnerSeasonTeamId)}</td>
        <td data-label="Champions">${renderHonorCell(season.id, "CHAMPIONS_LEAGUE", honor.championsLeagueWinnerSeasonTeamId)}</td>
        <td data-label="Playoff">${renderHonorCell(season.id, "PLAYOFF", honor.playoffWinnerSeasonTeamId)}</td>
      </tr>`;
  }).join("");

  const palmares = buildPalmares();
  const palmaresHtml = Object.entries(palmares)
    .filter(([type]) => type !== "PLAYOFF")
    .map(([type, items]) => {
      const rows = items.map((item, index) => `
        <tr>
          <td data-label="#" class="number">${index + 1}</td>
          <td data-label="Squadra">${renderTeamNameWithLogo(buildMaps().teamsById.get(item.teamId) || { canonicalName: item.teamName })}</td>
          <td data-label="Titoli" class="number"><strong>${item.wins}</strong></td>
        </tr>`).join("") || `<tr><td colspan="3" class="muted center">Nessun vincitore ancora inserito.</td></tr>`;

      return `
        <div class="compact-card palmares-competition-card">
          <div class="compact-card-header">
            <div>
              <h3>${escapeHtml(getLabel(COMPETITION_TYPES, type))}</h3>
              <p class="muted">Titoli vinti per squadra</p>
            </div>
          </div>
          <div class="table-wrap palmares-table-wrap">
            <table class="palmares-table">
              <thead>
                <tr><th class="number">#</th><th>Squadra</th><th class="number">Titoli</th></tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>`;
    }).join("");

  target.innerHTML = `
    <div class="table-wrap honor-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Stagione</th><th>Campione d'Italia</th><th>2°</th><th>3°</th><th>Coppa Italia</th><th>Champions</th><th>Playoff</th>
          </tr>
        </thead>
        <tbody>${rows || `<tr><td colspan="7" class="muted center">Nessuna stagione inserita.</td></tr>`}</tbody>
      </table>
    </div>
    <div class="detail-section">
      <h3>Palmarès per competizione</h3>
      <div class="palmares-grid">${palmaresHtml}</div>
    </div>
    <div class="detail-section">
      <h3>FIFA Ranking</h3>
      ${renderFifaRankingPublic()}
    </div>`;
}

function compareListoniByDateDescV99(a, b) {
  const dateCompare = String(b.loadedAt || b.meta?.loadedAt || b.id || "").localeCompare(
    String(a.loadedAt || a.meta?.loadedAt || a.id || ""),
    "it"
  );
  if (dateCompare) return dateCompare;
  return String(b.id || "").localeCompare(String(a.id || ""), "it");
}

function getListoniForCurrentSeason() {
  const seasonId = getCurrentSeasonId();
  if (!seasonId) return [];
  return state.listoni
    .filter((listone) => String(listone.seasonId || listone.meta?.seasonId || "") === String(seasonId))
    .sort(compareListoniByDateDescV99);
}

function getSelectedListone() {
  const available = getListoniForCurrentSeason();
  if (!available.length) {
    state.selectedListoneId = "";
    return null;
  }

  if (state.selectedListoneId) {
    const selected = available.find((listone) => listone.id === state.selectedListoneId);
    if (selected) return enrichListoneWithRosters(selected);
  }

  const latest = available[0];
  state.selectedListoneId = latest.id;
  return enrichListoneWithRosters(latest);
}

function getCurrentListone() {
  return getSelectedListone();
}

function renderListoneSelect(listone) {
  const select = document.getElementById("listoneSeasonFilter");
  if (!select) return;

  const available = getListoniForCurrentSeason();
  select.innerHTML = available.length
    ? available.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.loadedAt || item.id)} · ${escapeHtml(item.label || item.id)}</option>`).join("")
    : `<option value="">Nessun listone</option>`;

  select.value = listone?.id || "";
}


function getListoneVisibleColumns() {
  return LISTONE_COLUMNS.filter((column) => !state.hiddenListoneColumns.has(column.key));
}

function getFreeAgentsVisibleColumns() {
  return getListoneVisibleColumns().filter((column) => column.key !== "fantasyRoster");
}

function getSortedFreeAgents(listone) {
  if (!listone) return [];
  const sortColumn = LISTONE_COLUMNS.find((column) => column.key === state.freeAgentsSort.key) || LISTONE_COLUMNS.find((column) => column.key === "playerName");
  const direction = state.freeAgentsSort.direction === "desc" ? -1 : 1;

  return (listone.players || [])
    .filter((player) => !player.fantasyRoster || player.fantasyRoster === "Svincolati")
    .sort((a, b) => direction * compareListoneValues(a, b, sortColumn));
}

function renderFreeAgentsHeader(freeAgentsVisibleColumns) {
  return `
    <tr>
      ${freeAgentsVisibleColumns.map((column) => {
        const active = state.freeAgentsSort.key === column.key;
        const indicator = active ? (state.freeAgentsSort.direction === "asc" ? " ▲" : " ▼") : "";
        return `<th class="listone-col-${escapeHtml(column.key)} ${column.numeric ? "number" : ""}"><button class="table-sort" type="button" data-free-agents-sort-key="${escapeHtml(column.key)}">${escapeHtml(column.label)}${indicator}</button></th>`;
      }).join("")}
    </tr>`;
}

function getCheckedListoneStatusFilters() {
  const checked = Array.from(document.querySelectorAll('[data-listone-status-filter]:checked')).map((input) => input.dataset.listoneStatusFilter);
  return new Set(checked.length ? checked : ["inListone", "asteriscato", "svincolati"]);
}

function getCheckedListoneRoleFilters() {
  const checked = Array.from(document.querySelectorAll('[data-listone-role-filter]:checked')).map((input) => input.dataset.listoneRoleFilter);
  return new Set(checked.length ? checked : ["P", "D", "C", "A"]);
}

function isListonePlayerFreeAgent(player) {
  const roster = String(player?.fantasyRoster || "").trim();
  return !roster || roster.toLowerCase() === "svincolati";
}

function isListonePlayerAsterisk(player) {
  return player?.statusCode === "ASTERISCATO" || String(player?.status || "").toLowerCase().includes("aster");
}

function getFilteredListonePlayers(listone) {
  if (!listone) return [];
  const selectedRoles = getCheckedListoneRoleFilters();
  const selectedStatuses = getCheckedListoneStatusFilters();
  const search = String(document.getElementById("listoneSearch")?.value || "").trim().toLowerCase();

  const filtered = (listone.players || []).filter((player) => {
    const playerRole = String(player.classicRole || "").toUpperCase();
    if (selectedRoles.size && !selectedRoles.has(playerRole)) return false;

    const isAsterisk = isListonePlayerAsterisk(player);
    const isFreeAgent = isListonePlayerFreeAgent(player);
    const isActiveListone = !isAsterisk;
    const matchesStatus =
      (isActiveListone && selectedStatuses.has("inListone")) ||
      (isAsterisk && selectedStatuses.has("asteriscato")) ||
      (isFreeAgent && selectedStatuses.has("svincolati"));

    if (!matchesStatus) return false;
    if (!search) return true;

    const haystack = LISTONE_COLUMNS
      .map((column) => getListoneValue(player, column.key))
      .join(" ")
      .toLowerCase();

    return haystack.includes(search);
  });

  const sortColumn = LISTONE_COLUMNS.find((column) => column.key === state.listoneSort.key) || LISTONE_COLUMNS.find((column) => column.key === "playerName");
  const direction = state.listoneSort.direction === "desc" ? -1 : 1;

  return filtered.sort((a, b) => direction * compareListoneValues(a, b, sortColumn));
}

function renderListoneColumnControls() {
  const target = document.getElementById("listoneColumnControls");
  if (!target) return;

  target.innerHTML = `
    <details class="column-visibility-control">
      <summary><strong>Campi visibili</strong><span>Mostra/nascondi colonne</span></summary>
      <div class="column-toggle-grid">
        ${LISTONE_COLUMNS.map((column) => `
          <label class="checkbox-label column-toggle-item">
            <input type="checkbox" data-listone-column="${escapeHtml(column.key)}" ${state.hiddenListoneColumns.has(column.key) ? "" : "checked"} />
            ${escapeHtml(column.label)}
          </label>`).join("")}
      </div>
    </details>`;
}


const FANTACALCIO_TEAM_SLUGS_V89 = {
  ATA: "atalanta",
  BOL: "bologna",
  CAG: "cagliari",
  COM: "como",
  CRE: "cremonese",
  EMP: "empoli",
  FIO: "fiorentina",
  GEN: "genoa",
  INT: "inter",
  JUV: "juventus",
  LAZ: "lazio",
  LEC: "lecce",
  MIL: "milan",
  MON: "monza",
  NAP: "napoli",
  PAR: "parma",
  PIS: "pisa",
  ROM: "roma",
  SAL: "salernitana",
  SAM: "sampdoria",
  SAS: "sassuolo",
  SPE: "spezia",
  TOR: "torino",
  UDI: "udinese",
  VEN: "venezia",
  VER: "verona"
};

function slugifyFantacalcioPlayerNameV89(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildFantacalcioPlayerUrl(player) {
  const id = player?.fantacalcioId || player?.fantacalcio_id || player?.idFantacalcio;
  if (!id) return "";
  const teamCode = String(player?.realTeam || player?.real_team || "").trim().toUpperCase();
  const teamSlug = FANTACALCIO_TEAM_SLUGS_V89[teamCode] || teamCode.toLowerCase();
  const playerSlug = slugifyFantacalcioPlayerNameV89(player?.playerName || player?.player_name || "giocatore");
  if (!teamSlug || !playerSlug) return "";
  return `https://www.fantacalcio.it/serie-a/squadre/${teamSlug}/${playerSlug}/${encodeURIComponent(id)}`;
}

function renderListoneCell(player, column) {
  const value = getListoneValue(player, column.key);

  if (column.key === "playerName") {
    const playerUrl = buildFantacalcioPlayerUrl(player);
    const playerName = escapeHtml(value || "-");
    if (!playerUrl) return `<strong>${playerName}</strong>`;
    const pageUrl = `./player.html?url=${encodeURIComponent(playerUrl)}&name=${encodeURIComponent(value || "Giocatore")}`;
    return `<a class="link-button listone-player-link" href="${pageUrl}" target="_blank" rel="noopener"><strong>${playerName}</strong></a>`;
  }

  if (column.key === "classicRole") {
    const role = value || "-";
    const mantra = String(player.mantraRoles || "").trim();
    return `${escapeHtml(role)}${mantra ? ` <span class="muted role-extra">(${escapeHtml(mantra)})</span>` : ""}`;
  }

  if (column.key === "realTeam") {
    return `<span class="team-code">${escapeHtml(value || "-")}</span>`;
  }

  if (column.key === "status") {
    const isAsterisk = player.statusCode === "ASTERISCATO" || String(player.status || "").toLowerCase().includes("aster");
    const statusClass = isAsterisk ? "status-warning" : "status-ok";
    return `<span class="status ${statusClass}">${escapeHtml(value || "In listone")}</span>`;
  }

  if (column.key === "fantasyRoster") {
    return `<span class="${value === "Svincolati" ? "text-warning" : ""}">${escapeHtml(value || "Svincolati")}</span>`;
  }

  return column.numeric ? formatListoneNumber(value) : escapeHtml(value || "-");
}

function renderListonePublic() {
  const tbody = document.getElementById("listoneTableBody");
  const metaText = document.getElementById("listoneMetaText");
  const freeAgentsBody = document.getElementById("freeAgentsTableBody");
  const freeAgentsMeta = document.getElementById("freeAgentsMetaText");
  const listone = getSelectedListone();

  renderListoneSelect(listone);
  renderListoneColumnControls();

  if (!tbody) return;

  const visibleColumns = getListoneVisibleColumns();
  const table = tbody.closest("table");
  const thead = table?.querySelector("thead");
  if (thead) {
    thead.innerHTML = `
      <tr>
        ${visibleColumns.map((column) => {
          const active = state.listoneSort.key === column.key;
          const indicator = active ? (state.listoneSort.direction === "asc" ? " ▲" : " ▼") : "";
          return `<th class="listone-col-${escapeHtml(column.key)} ${column.numeric ? "number" : ""}"><button class="table-sort" type="button" data-listone-sort-key="${escapeHtml(column.key)}">${escapeHtml(column.label)}${indicator}</button></th>`;
        }).join("")}
      </tr>`;
  }

  if (!listone) {
    const seasonName = getSeasonName(getCurrentSeasonId()) || getCurrentSeasonId() || "selezionata";
    tbody.innerHTML = `<tr><td colspan="${visibleColumns.length || 1}" class="muted center">Nessun listone caricato per la stagione selezionata.</td></tr>`;
    if (metaText) metaText.textContent = `Nessun listone caricato per la stagione ${seasonName}.`;
    if (freeAgentsBody) {
      const freeAgentsTable = freeAgentsBody.closest("table");
      const freeAgentsThead = freeAgentsTable?.querySelector("thead");
      const freeAgentsVisibleColumns = getFreeAgentsVisibleColumns();
      if (freeAgentsThead) freeAgentsThead.innerHTML = renderFreeAgentsHeader(freeAgentsVisibleColumns);
      freeAgentsBody.innerHTML = `<tr><td colspan="${freeAgentsVisibleColumns.length || 1}" class="muted center">Svincolati non disponibili.</td></tr>`;
    }
    return;
  }

  const players = getFilteredListonePlayers(listone);
  const activeRows = Number(listone.activeRows ?? listone.meta?.activeRows ?? 0);
  const asteriskRows = Number(listone.asteriskRows ?? listone.meta?.asteriskRows ?? 0);
  const rosteredRows = Number(listone.rosteredRows ?? listone.meta?.rosteredRows ?? 0);
  const freeAgentRows = Number(listone.freeAgentRows ?? listone.meta?.freeAgentRows ?? 0);

  if (metaText) {
    metaText.textContent = `Listone ${listone.loadedAt || listone.id} · ${listone.label || ""} · ${listone.players.length} giocatori (${activeRows} in listone, ${asteriskRows} asteriscati, ${rosteredRows || "-"} in rosa, ${freeAgentRows || "-"} svincolati)`;
  }

  tbody.innerHTML = players.length
    ? players.map((player) => `
        <tr>
          ${visibleColumns.map((column) => `
            <td data-label="${escapeHtml(column.label)}" class="listone-col-${escapeHtml(column.key)} ${column.numeric ? "number" : ""}">${renderListoneCell(player, column)}</td>`).join("")}
        </tr>`).join("")
    : `<tr><td colspan="${visibleColumns.length || 1}" class="muted center">Nessun giocatore trovato con i filtri selezionati.</td></tr>`;

  const freeAgentsVisibleColumns = getFreeAgentsVisibleColumns();
  const freeAgents = getSortedFreeAgents(listone);

  if (freeAgentsMeta) freeAgentsMeta.textContent = `${freeAgents.length} giocatori senza rosa nel listone selezionato.`;
  if (freeAgentsBody) {
    const freeAgentsTable = freeAgentsBody.closest("table");
    const freeAgentsThead = freeAgentsTable?.querySelector("thead");
    if (freeAgentsThead) freeAgentsThead.innerHTML = renderFreeAgentsHeader(freeAgentsVisibleColumns);

    freeAgentsBody.innerHTML = freeAgents.length
      ? freeAgents.map((player) => `
          <tr>
            ${freeAgentsVisibleColumns.map((column) => `
              <td data-label="${escapeHtml(column.label)}" class="listone-col-${escapeHtml(column.key)} ${column.numeric ? "number" : ""}">${renderListoneCell(player, column)}</td>`).join("")}
          </tr>`).join("")
      : `<tr><td colspan="${freeAgentsVisibleColumns.length || 1}" class="muted center">Nessuno svincolato nel listone selezionato.</td></tr>`;
  }
}

function renderClubRostersPublic() {
  const tableBody = document.getElementById("marketActivityTableBody");
  const clubFilter = document.getElementById("marketClubFilter");
  if (!tableBody) return;

  const seasonId = getCurrentSeasonId();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const snapshot = getRosterSnapshotForSeason(seasonId);
  const search = String(document.getElementById("marketSearch")?.value || "").trim().toLowerCase();
  const selectedClub = state.selectedClubRosterFilter || clubFilter?.value || "all";

  if (clubFilter) {
    const currentValue = selectedClub;
    clubFilter.innerHTML = `<option value="all">Tutti i club</option>${seasonTeams.map((seasonTeam) => `<option value="${escapeHtml(seasonTeam.id)}">${escapeHtml(seasonTeam.name || seasonTeam.id)}</option>`).join("")}`;
    clubFilter.value = currentValue;
  }

  if (!snapshot) {
    tableBody.innerHTML = `<tr><td colspan="5" class="muted center">Nessun file rose disponibile per questa stagione.</td></tr>`;
    return;
  }

  const rows = [];
  seasonTeams.forEach((seasonTeam) => {
    if (selectedClub !== "all" && selectedClub !== seasonTeam.id) return;
    const roster = getRosterForSeasonTeam(seasonTeam);
    (roster?.players || []).forEach((player) => {
      const haystack = [seasonTeam.name, player.playerName, player.realTeam, player.role, player.cost].join(" ").toLowerCase();
      if (search && !haystack.includes(search)) return;
      rows.push({ seasonTeam, player });
    });
  });

  tableBody.innerHTML = rows.length
    ? rows.map(({ seasonTeam, player }) => `
      <tr>
        <td data-label="Club">${renderSeasonTeamNameWithLogo(seasonTeam.id)}</td>
        <td data-label="Ruolo">${escapeHtml(player.role || "-")}</td>
        <td data-label="Giocatore"><strong>${escapeHtml(player.playerName || "-")}</strong></td>
        <td data-label="Squadra"><span class="team-code">${escapeHtml(player.realTeam || "-")}</span></td>
        <td data-label="Costo" class="number">${formatListoneNumber(player.cost)}</td>
      </tr>`).join("")
    : `<tr><td colspan="5" class="muted center">Nessun giocatore trovato con i filtri selezionati.</td></tr>`;
}

function renderPlaceholderPages() {
  setLoadingText("newsList", "Modulo News non ancora collegato.");
  renderListonePublic();
  renderHonorSummary();
  renderClubRostersPublic();
  setLoadingText("movementsList", "I movimenti FM sono visualizzati nella sezione Rose.");
  renderStadiumsPublic();
}

function setupNavigation() {
  function setPage(pageName) {
    state.currentPage = pageName || "dashboard";

    document.querySelectorAll(".app-page").forEach((page) => {
      page.classList.toggle("is-active", page.dataset.page === state.currentPage);
    });

    document.querySelectorAll("[data-page-link]").forEach((link) => {
      link.classList.toggle("active", link.dataset.pageLink === state.currentPage);
    });

    closeMobileMoreMenu();
    updateMobileNavState();

    if (state.currentPage === "admin" && !state.isAdmin) {
      const dialog = document.getElementById("loginDialog");
      if (dialog?.showModal) dialog.showModal();
      else alert("Accedi come admin per continuare.");
      setPage("dashboard");
    }
  }

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setPage(link.dataset.pageLink);
      window.location.hash = link.dataset.pageLink;
    });
  });

  const startHash = window.location.hash.replace("#", "") || "dashboard";
  const startPage = startHash === "finance" ? "regolamento" : startHash;
  if (startHash === "finance") window.history.replaceState(null, "", "#regolamento");
  setPage(startPage);
}

function closeMobileMoreMenu() {
  const backdrop = document.getElementById("mobileMoreBackdrop");
  const sheet = document.getElementById("mobileMoreSheet");
  const button = document.getElementById("mobileMoreBtn");

  backdrop?.classList.add("hidden");
  sheet?.classList.add("hidden");
  button?.setAttribute("aria-expanded", "false");
}

function openMobileMoreMenu() {
  const backdrop = document.getElementById("mobileMoreBackdrop");
  const sheet = document.getElementById("mobileMoreSheet");
  const button = document.getElementById("mobileMoreBtn");

  backdrop?.classList.remove("hidden");
  sheet?.classList.remove("hidden");
  button?.setAttribute("aria-expanded", "true");
}

function toggleMobileMoreMenu() {
  const sheet = document.getElementById("mobileMoreSheet");
  if (!sheet || sheet.classList.contains("hidden")) {
    openMobileMoreMenu();
  } else {
    closeMobileMoreMenu();
  }
}

function updateMobileNavState() {
  const directMobilePages = new Set(["dashboard", "clubs", "competitions", "honor"]);
  const moreButton = document.getElementById("mobileMoreBtn");
  moreButton?.classList.toggle("active", !directMobilePages.has(state.currentPage));
}

function updateMobileUxClass() {
  const isMobileLike = window.matchMedia("(max-width: 900px), (hover: none) and (pointer: coarse)").matches;
  document.body.classList.toggle("is-mobile-ux", isMobileLike);
}

function setupMobileNavigation() {
  const moreButton = document.getElementById("mobileMoreBtn");
  const closeButton = document.getElementById("mobileMoreClose");
  const backdrop = document.getElementById("mobileMoreBackdrop");
  const sheet = document.getElementById("mobileMoreSheet");

  moreButton?.addEventListener("click", toggleMobileMoreMenu);
  closeButton?.addEventListener("click", closeMobileMoreMenu);
  backdrop?.addEventListener("click", closeMobileMoreMenu);
  sheet?.querySelectorAll("[data-page-link]").forEach((link) => {
    link.addEventListener("click", closeMobileMoreMenu);
  });

  updateMobileUxClass();
  updateMobileNavState();
  window.addEventListener("resize", updateMobileUxClass);
}

function setupAuth() {
  const openLoginBtn = document.getElementById("openLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginDialog = document.getElementById("loginDialog");
  const loginForm = document.getElementById("loginForm");
  const closeLoginBtn = document.getElementById("closeLoginBtn");

  openLoginBtn?.addEventListener("click", () => {
    if (loginDialog?.showModal) loginDialog.showModal();
  });

  closeLoginBtn?.addEventListener("click", () => {
    loginDialog?.close();
  });

  logoutBtn?.addEventListener("click", async () => {
    await signOut(auth);
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;

    showMessage("loginStatus", "Accesso in corso...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      loginDialog?.close();
      loginForm.reset();
    } catch (error) {
      console.error(error);
      showMessage("loginStatus", "Login non riuscito. Controlla email e password.", true);
    }
  });

  onAuthStateChanged(auth, async (user) => {
    state.user = user;
    state.isAdmin = false;

    if (user) {
      try {
        const adminSnapshot = await getDoc(doc(db, "admins", user.uid));
        state.isAdmin = adminSnapshot.exists();
        if (!state.isAdmin) {
          showMessage("loginStatus", `Utente autenticato ma non presente nella raccolta admins. UID: ${user.uid}`, true);
        }
      } catch (error) {
        console.error(error);
        const code = error?.code ? `${error.code}: ` : "";
        showMessage("loginStatus", `Login riuscito, ma controllo admin fallito. ${code}${error.message || error}`, true);
      }
    }

    updateAdminVisibility();
    renderAdminArea();
  });
}

function updateAdminVisibility() {
  const openLoginBtn = document.getElementById("openLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminPanel = document.getElementById("adminPanel");
  const adminLinks = document.querySelectorAll(".nav-link-admin");

  openLoginBtn?.classList.toggle("hidden", state.isAdmin);
  logoutBtn?.classList.toggle("hidden", !state.isAdmin);
  adminPanel?.classList.toggle("admin-locked", !state.isAdmin);

  adminLinks.forEach((link) => {
    link.classList.toggle("hidden", !state.isAdmin);
  });
}


function getCollapsePanelKey(panel, index) {
  if (panel.dataset.collapseKey) return panel.dataset.collapseKey;
  const page = panel.closest(".app-page")?.dataset.page || "page";
  const explicitId = panel.id || panel.getAttribute("aria-labelledby") || `section-${index}`;
  const key = `content-${page}-${explicitId}`;
  panel.dataset.collapseKey = key;
  return key;
}

function setContentPanelCollapsed(panel, key, isCollapsed) {
  panel.classList.toggle("section-is-collapsed", isCollapsed);
  if (isCollapsed) state.collapsedContentPanels.add(key);
  else state.collapsedContentPanels.delete(key);

  const button = panel.querySelector(`[data-content-toggle-panel="${CSS.escape(key)}"]`);
  if (button) button.textContent = isCollapsed ? "Ingrandisci" : "Riduci";
}

function toggleContentPanel(key) {
  const panel = document.querySelector(`[data-collapse-key="${CSS.escape(key)}"]`);
  if (!panel) return;
  setContentPanelCollapsed(panel, key, !panel.classList.contains("section-is-collapsed"));
}

function setupCollapsibleSections() {
  const panels = $$(`
    .app-page:not([data-page="admin"]) > .panel,
    .app-page:not([data-page="admin"]) .grid-two > .panel,
    .app-page:not([data-page="admin"]) .single-panel-layout > .panel,
    .app-page:not([data-page="admin"]) .competition-card,
    .app-page:not([data-page="admin"]) .news-card,
    .app-page:not([data-page="admin"]) .compact-card
  `);

  panels.forEach((panel, index) => {
    if (panel.classList.contains("admin-collapsible-panel")) return;

    const key = getCollapsePanelKey(panel, index);
    panel.classList.add("content-collapsible-panel");

    const header = panel.querySelector(":scope > .panel-header, :scope > .news-card-header, :scope > .competition-card-header, :scope > .compact-card-header");
    if (!header) return;

    let actions = header.querySelector(":scope > .panel-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "panel-actions";
      header.appendChild(actions);
    }

    let button = actions.querySelector(`[data-content-toggle-panel="${CSS.escape(key)}"]`);
    if (!button) {
      button = document.createElement("button");
      button.className = "button button-secondary button-small section-toggle-button";
      button.type = "button";
      button.dataset.contentTogglePanel = key;
      button.addEventListener("click", () => toggleContentPanel(key));
      actions.appendChild(button);
    }

    setContentPanelCollapsed(panel, key, state.collapsedContentPanels.has(key));
  });
}

function renderAdminArea() {
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;

  if (!state.isAdmin) {
    adminPanel.innerHTML = `
      <div class="page-heading">
        <div>
          <p class="eyebrow">Area riservata</p>
          <h2 id="adminTitle">Admin</h2>
          <p>Accedi come amministratore per modificare stagioni, presidenti, squadre e competizioni.</p>
        </div>
      </div>`;
    return;
  }

  adminPanel.innerHTML = `
    <div class="page-heading">
      <div>
        <p class="eyebrow">Area riservata</p>
        <h2 id="adminTitle">Admin</h2>
        <p>Gestione Firebase: stagioni, presidenti, squadre stagionali, competizioni e risultati.</p>
      </div>
    </div>

    ${renderSeasonAdminPanel()}
    ${renderPresidentAdminPanel()}
    ${renderTeamAdminPanel()}
    ${renderSeasonTeamAdminPanel()}
    ${renderStadiumAdminPanel()}
    ${renderCompetitionAdminPanel()}
    ${renderCompetitionMatchesAdminPanel()}
    ${renderCompetitionResultsAdminPanel()}
    ${renderFifaRankingAdminPanel()}
    ${renderListoneToolsAdminPanel()}
    ${renderPublicSnapshotsAdminPanel()}
    ${renderBackupAdminPanel()}
  `;

  attachAdminHandlers();
}

function renderAdminPanel(panelId, eyebrow, title, description, bodyHtml) {
  const isCollapsed = state.collapsedAdminPanels.has(panelId);
  return `
    <article class="panel admin-collapsible-panel ${isCollapsed ? "is-collapsed" : ""}" id="${panelId}">
      <div class="panel-header">
        <div>
          <p class="eyebrow">${escapeHtml(eyebrow)}</p>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(description)}</p>
        </div>
        <div class="panel-actions">
          <button class="button button-secondary button-small" type="button" data-admin-toggle-panel="${escapeHtml(panelId)}">
            ${isCollapsed ? "Ingrandisci" : "Riduci"}
          </button>
        </div>
      </div>
      ${bodyHtml}
    </article>`;
}

function renderSeasonAdminPanel() {
  const rows = state.raw.seasons.map((season) => `
    <div class="admin-list-item">
      <span>
        <strong>${escapeHtml(season.name || season.id)}</strong>
        <small>${escapeHtml(season.id)}${season.isCurrent ? " · stagione corrente" : ""} · Squadre previste: ${escapeHtml(season.participantCount ?? "-")}</small>
      </span>
      <span>
        <button class="button button-secondary button-small" type="button" data-admin-edit-season="${escapeHtml(season.id)}">Modifica</button>
        <button class="button button-danger button-small" type="button" data-admin-delete-season="${escapeHtml(season.id)}">Elimina</button>
      </span>
    </div>
  `).join("") || `<p class="muted admin-empty-message">Nessuna stagione inserita.</p>`;

  return renderAdminPanel("adminSeasonsPanel", "Firebase", "Stagioni", "Crea o modifica le stagioni della lega.", `
      <form id="adminSeasonForm" class="form-grid">
        <label>
          ID stagione
          <input id="adminSeasonId" class="input" type="text" placeholder="Es. 2025-2026" required />
          <small class="field-hint">Usalo come ID documento Firestore. Esempio: 2025-2026.</small>
        </label>
        <label>
          Nome stagione
          <input id="adminSeasonName" class="input" type="text" placeholder="Es. Stagione 2025-2026" required />
        </label>
        <label>
          Data inizio
          <input id="adminSeasonStartsOn" class="input" type="date" />
        </label>
        <label>
          Data fine
          <input id="adminSeasonEndsOn" class="input" type="date" />
        </label>
        <label>
          Numero squadre partecipanti
          <input id="adminSeasonParticipantCount" class="input" type="number" min="0" step="1" placeholder="Es. 10" />
        </label>
        <label class="checkbox-label">
          <input id="adminSeasonIsCurrent" type="checkbox" />
          Stagione corrente
        </label>
        <div class="form-actions span-2">
          <button class="button button-primary" type="submit">Salva stagione</button>
          <button id="adminSeasonReset" class="button button-secondary" type="button">Nuova</button>
          <span id="adminSeasonStatus" class="form-status"></span>
        </div>
      </form>

      <details class="admin-edit-section" open>
        <summary><strong>Stagioni esistenti</strong><span>${state.raw.seasons.length}</span></summary>
        <div class="admin-list">${rows}</div>
      </details>
  `);
}

function renderPresidentAdminPanel() {
  const rows = state.raw.presidents.map((president) => `
    <div class="admin-list-item">
      <span>
        <strong>${escapeHtml(president.name || president.id)}</strong>
        <small>${president.isActive === false ? "storico/non attivo" : "attivo"}${president.notes ? ` · ${escapeHtml(president.notes)}` : ""}</small>
      </span>
      <span>
        <button class="button button-secondary button-small" type="button" data-admin-edit-president="${escapeHtml(president.id)}">Modifica</button>
        <button class="button button-danger button-small" type="button" data-admin-delete-president="${escapeHtml(president.id)}">Elimina</button>
      </span>
    </div>
  `).join("") || `<p class="muted admin-empty-message">Nessun presidente inserito.</p>`;

  return renderAdminPanel("adminPresidentsPanel", "Firebase", "Presidenti", "Anagrafica dei presidenti. Un presidente può essere collegato a una o più squadre.", `
      <form id="adminPresidentForm" class="form-grid">
        <input id="adminPresidentId" type="hidden" />
        <label>
          Nome presidente
          <input id="adminPresidentName" class="input" type="text" placeholder="Es. Mario Rossi" required />
        </label>
        <label>
          Note
          <input id="adminPresidentNotes" class="input" type="text" placeholder="Opzionale" />
        </label>
        <label class="checkbox-label span-2">
          <input id="adminPresidentIsActive" type="checkbox" checked />
          Presidente attivo
        </label>
        <div class="form-actions span-2">
          <button class="button button-primary" type="submit">Salva presidente</button>
          <button id="adminPresidentReset" class="button button-secondary" type="button">Nuovo</button>
          <span id="adminPresidentStatus" class="form-status"></span>
        </div>
      </form>

      <details class="admin-edit-section" open>
        <summary><strong>Presidenti esistenti</strong><span>${state.raw.presidents.length}</span></summary>
        <div class="admin-list">${rows}</div>
      </details>
  `);
}

function renderTeamAdminPanel() {
  const presidentOptions = state.raw.presidents.map((president) => `
    <option value="${escapeHtml(president.id)}">${escapeHtml(president.name || president.id)}</option>
  `).join("");

  const rows = state.raw.teams.map((team) => `
    <div class="admin-list-item">
      <span>
        <strong class="club-name-with-logo">${renderTeamLogo(team.canonicalName, team.logo)}${escapeHtml(getTeamDisplayName(team))}</strong>
        <small>${team.isCurrent === false ? "squadra storica" : "squadra attuale"} · Presidenti attuali: ${escapeHtml(getPresidentNames(team.currentPresidentIds || []))}</small>
      </span>
      <span>
        <button class="button button-secondary button-small" type="button" data-admin-edit-team="${escapeHtml(team.id)}">Modifica</button>
        <button class="button button-danger button-small" type="button" data-admin-delete-team="${escapeHtml(team.id)}">Elimina</button>
      </span>
    </div>
  `).join("") || `<p class="muted admin-empty-message">Nessuna squadra inserita.</p>`;

  return renderAdminPanel("adminTeamsPanel", "Firebase", "Squadre", "Inserisci squadre attuali o storiche, presidenti attuali e logo tondo.", `
      <form id="adminTeamForm" class="form-grid">
        <input id="adminTeamId" type="hidden" />
        <label>
          Nome squadra
          <input id="adminTeamName" class="input" type="text" placeholder="Es. Real Pastena" required />
        </label>
        <label>
          Logo squadra
          <input id="adminTeamLogoValue" class="input" type="text" placeholder="Es. real-pastena.png oppure assets/logos/real-pastena.png" />
          <small class="field-hint">Inserisci il nome del file già presente in <code>assets/logos/</code>. Non salviamo più immagini base64 su Firebase.</small>
        </label>
        <div class="logo-admin-preview" id="adminTeamLogoPreview">
          ${renderTeamLogo("Squadra", "", "club-logo-lg")}
          <span class="muted small">Anteprima logo</span>
        </div>
        <label class="checkbox-label">
          <input id="adminTeamRemoveLogo" type="checkbox" />
          Rimuovi logo
        </label>
        <label class="span-2">
          Presidente/i attuale/i
          <select id="adminTeamPresidentIds" class="input" multiple size="5">
            ${presidentOptions}
          </select>
          <small class="field-hint">Usa Cmd/Ctrl per selezionare più presidenti.</small>
        </label>
        <label class="span-2">
          Note
          <input id="adminTeamNotes" class="input" type="text" placeholder="Opzionale" />
        </label>
        <label class="checkbox-label">
          <input id="adminTeamIsCurrent" type="checkbox" checked />
          Squadra attuale
        </label>
        <div class="form-actions span-2">
          <button class="button button-primary" type="submit">Salva squadra</button>
          <button id="adminTeamReset" class="button button-secondary" type="button">Nuova</button>
          <span id="adminTeamStatus" class="form-status"></span>
        </div>
      </form>

      <div class="form-actions admin-maintenance-actions">
        <button id="adminClearBase64Logos" class="button button-secondary" type="button">Rimuovi immagini base64 da Firebase</button>
        <small class="muted">Cancella i vecchi loghi salvati come base64 da squadre e squadre stagionali.</small>
      </div>

      <details class="admin-edit-section" open>
        <summary><strong>Squadre esistenti</strong><span>${state.raw.teams.length}</span></summary>
        <div class="admin-list">${rows}</div>
      </details>
  `);
}

function renderSeasonTeamAdminPanel() {
  const selectedSeasonId = getValidSeasonSelection("selectedAdminSeasonTeamSeasonId");

  const seasonOptions = state.raw.seasons.map((season) => `
    <option value="${escapeHtml(season.id)}" ${season.id === selectedSeasonId ? "selected" : ""}>${escapeHtml(season.name || season.id)}</option>
  `).join("");

  const teamOptions = state.raw.teams.map((team) => `
    <option value="${escapeHtml(team.id)}">${escapeHtml(team.canonicalName || team.id)}</option>
  `).join("");

  const presidentOptions = state.raw.presidents.map((president) => `
    <option value="${escapeHtml(president.id)}">${escapeHtml(president.name || president.id)}</option>
  `).join("");

  const { teamsById } = buildMaps();
  const filteredSeasonTeams = state.raw.seasonTeams.filter((seasonTeam) => seasonTeam.seasonId === selectedSeasonId);
  const rows = filteredSeasonTeams.map((seasonTeam) => {
    const team = teamsById.get(seasonTeam.teamId);
    return `
      <div class="admin-list-item">
        <span>
          <strong class="club-name-with-logo">${renderTeamLogo(seasonTeam.name || getTeamDisplayName(team), getSeasonTeamLogo(seasonTeam))}${escapeHtml(seasonTeam.name || getTeamDisplayName(team))}</strong>
          <small>${escapeHtml(getSeasonName(seasonTeam.seasonId))} · Squadra madre: ${escapeHtml(getTeamDisplayName(team))} · Presidenti: ${escapeHtml(getSeasonTeamPresidentNames(seasonTeam))}</small>
        </span>
        <span>
          <button class="button button-secondary button-small" type="button" data-admin-edit-season-team="${escapeHtml(seasonTeam.id)}">Modifica</button>
          <button class="button button-danger button-small" type="button" data-admin-delete-season-team="${escapeHtml(seasonTeam.id)}">Elimina</button>
        </span>
      </div>`;
  }).join("") || `<p class="muted admin-empty-message">Nessuna squadra associata alla stagione selezionata.</p>`;

  return renderAdminPanel("adminSeasonTeamsPanel", "Firebase", "Squadre per stagione", "Associa le squadre alle stagioni. Una squadra associata a una stagione partecipa automaticamente a tutte le competizioni di quella stagione.", `
      <form id="adminSeasonTeamForm" class="form-grid">
        <input id="adminSeasonTeamId" type="hidden" />
        <label>
          Stagione
          <select id="adminSeasonTeamSeasonId" class="input" required>
            ${seasonOptions}
          </select>
        </label>
        <label>
          Squadra madre
          <select id="adminSeasonTeamTeamId" class="input" required>
            ${teamOptions}
          </select>
        </label>
        <label>
          Nome squadra nella stagione
          <input id="adminSeasonTeamName" class="input" type="text" placeholder="Es. Real Pastena 2025" required />
          <small class="field-hint">Serve per gestire cambi nome nel tempo.</small>
        </label>
        <label>
          Logo stagionale opzionale
          <input id="adminSeasonTeamLogoValue" class="input" type="text" placeholder="Es. real-pastena-2025.png oppure assets/logos/real-pastena-2025.png" />
          <small class="field-hint">Se lo lasci vuoto usa il logo della squadra madre. Inserisci solo file/path, non base64.</small>
        </label>
        <div class="logo-admin-preview" id="adminSeasonTeamLogoPreview">
          ${renderTeamLogo("Squadra", "", "club-logo-lg")}
          <span class="muted small">Anteprima logo stagionale</span>
        </div>
        <label class="checkbox-label">
          <input id="adminSeasonTeamRemoveLogo" type="checkbox" />
          Rimuovi logo stagionale
        </label>
        <label class="span-2">
          Presidente/i in quella stagione
          <select id="adminSeasonTeamPresidentIds" class="input" multiple size="5">
            ${presidentOptions}
          </select>
          <small class="field-hint">Di default eredita il/i presidente/i attuale/i della squadra madre. Puoi modificarli per lo storico.</small>
        </label>
        <label class="checkbox-label span-2">
          <input id="adminSeasonTeamIsHistorical" type="checkbox" />
          Squadra storica/non più attuale in quella stagione
        </label>
        <div class="form-actions span-2">
          <button class="button button-primary" type="submit">Salva associazione</button>
          <button id="adminSeasonTeamReset" class="button button-secondary" type="button">Nuova</button>
          <span id="adminSeasonTeamStatus" class="form-status"></span>
        </div>
      </form>

      <details class="admin-edit-section" open>
        <summary><strong>Squadre associate alla stagione selezionata</strong><span>${filteredSeasonTeams.length}</span></summary>
        <div class="admin-list">${rows}</div>
      </details>
  `);
}
function renderCompetitionAdminPanel() {
  const selectedSeasonId = getValidSeasonSelection("selectedAdminCompetitionSeasonId");

  const seasonOptions = state.raw.seasons.map((season) => `
    <option value="${escapeHtml(season.id)}" ${season.id === selectedSeasonId ? "selected" : ""}>${escapeHtml(season.name || season.id)}</option>
  `).join("");

  const typeOptions = COMPETITION_TYPES.map((type) => `
    <option value="${escapeHtml(type.value)}">${escapeHtml(type.label)}</option>
  `).join("");

  const formatOptions = COMPETITION_FORMATS.map((format) => `
    <option value="${escapeHtml(format.value)}">${escapeHtml(format.label)}</option>
  `).join("");

  const statusOptions = COMPETITION_STATUSES.map((status) => `
    <option value="${escapeHtml(status.value)}">${escapeHtml(status.label)}</option>
  `).join("");

  const filteredCompetitions = state.raw.competitions.filter((competition) => competition.seasonId === selectedSeasonId);
  const rows = filteredCompetitions.map((competition) => `
    <div class="admin-list-item">
      <span>
        <strong>${escapeHtml(competition.name || competition.id)}</strong>
        <small>${escapeHtml(getSeasonName(competition.seasonId))} · ${escapeHtml(getLabel(COMPETITION_TYPES, competition.type))} · ${escapeHtml(getLabel(COMPETITION_FORMATS, competition.format))}</small>
      </span>
      <span>
        <span class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</span>
        <button class="button button-secondary button-small" type="button" data-admin-edit-competition="${escapeHtml(competition.id)}">Modifica</button>
        <button class="button button-danger button-small" type="button" data-admin-delete-competition="${escapeHtml(competition.id)}">Elimina</button>
      </span>
    </div>
  `).join("") || `<p class="muted admin-empty-message">Nessuna competizione inserita per la stagione selezionata.</p>`;

  return renderAdminPanel("adminCompetitionsPanel", "Firebase", "Competizioni", "Crea competizioni per stagione: Campionato, Champion's League, Coppa Italia, Playoff o altre.", `
      <form id="adminCompetitionForm" class="form-grid">
        <input id="adminCompetitionId" type="hidden" />
        <label>
          Stagione
          <select id="adminCompetitionSeasonId" class="input" required>
            ${seasonOptions}
          </select>
        </label>
        <label>
          Nome competizione
          <input id="adminCompetitionName" class="input" type="text" placeholder="Es. Campionato" required />
        </label>
        <label>
          Trofeo / tipo
          <select id="adminCompetitionType" class="input" required>
            ${typeOptions}
          </select>
        </label>
        <label>
          Formula
          <select id="adminCompetitionFormat" class="input" required>
            ${formatOptions}
          </select>
        </label>
        <label>
          Stato
          <select id="adminCompetitionStatus" class="input" required>
            ${statusOptions}
          </select>
        </label>
        <label class="span-2">
          Note
          <input id="adminCompetitionNotes" class="input" type="text" placeholder="Opzionale" />
        </label>
        <div class="form-actions span-2">
          <button class="button button-primary" type="submit">Salva competizione</button>
          <button id="adminCompetitionReset" class="button button-secondary" type="button">Nuova</button>
          <button id="adminCompetitionCreateDefaults" class="button button-secondary" type="button">Crea competizioni standard</button>
          <span id="adminCompetitionStatusText" class="form-status"></span>
        </div>
      </form>

      <details class="admin-edit-section" open>
        <summary><strong>Competizioni della stagione selezionata</strong><span>${filteredCompetitions.length}</span></summary>
        <div class="admin-list">${rows}</div>
      </details>
  `);
}
function renderCompetitionResultsAdminPanel() {
  const selectedSeasonId = getValidSeasonSelection("selectedAdminResultsSeasonId");

  const seasonOptions = state.raw.seasons.map((season) => `
    <option value="${escapeHtml(season.id)}" ${season.id === selectedSeasonId ? "selected" : ""}>${escapeHtml(season.name || season.id)}</option>
  `).join("");

  const concluded = state.raw.competitions.filter((competition) => competition.status === "CONCLUSA" && competition.seasonId === selectedSeasonId);
  const selectedId = state.selectedResultCompetitionId && concluded.some((competition) => competition.id === state.selectedResultCompetitionId)
    ? state.selectedResultCompetitionId
    : concluded[0]?.id || "";
  state.selectedResultCompetitionId = selectedId;

  const competitionOptions = concluded.map((competition) => `
    <option value="${escapeHtml(competition.id)}" ${competition.id === selectedId ? "selected" : ""}>
      ${escapeHtml(competition.name)}
    </option>
  `).join("");

  const body = `
    <form id="adminCompetitionResultsForm" class="form-grid">
      <label>
        Stagione
        <select id="adminCompetitionResultsSeasonId" class="input" required>
          ${seasonOptions}
        </select>
      </label>
      <label>
        Competizione conclusa
        <select id="adminCompetitionResultsCompetitionId" class="input" ${concluded.length ? "required" : "disabled"}>
          ${competitionOptions}
        </select>
        <small class="field-hint">I risultati si possono inserire solo per competizioni con stato Conclusa.</small>
      </label>
      <div id="adminCompetitionResultsEditor" class="span-2">
        ${concluded.length ? renderCompetitionResultsEditor(selectedId) : `<p class="muted">Nessuna competizione conclusa per la stagione selezionata. Prima imposta una competizione su <strong>Conclusa</strong>.</p>`}
      </div>
      <div class="form-actions span-2">
        <button class="button button-primary" type="submit" ${concluded.length ? "" : "disabled"}>Salva risultati e aggiorna albo</button>
        <span id="adminCompetitionResultsStatus" class="form-status"></span>
      </div>
    </form>`;

  return renderAdminPanel("adminCompetitionResultsPanel", "Firebase", "Risultati competizioni", "Inserisci classifiche o finali. Questi dati alimentano automaticamente Albo d'oro e Palmarès.", body);
}
function renderCompetitionResultsEditor(competitionId) {
  const competition = state.raw.competitions.find((item) => item.id === competitionId);
  if (!competition) return `<p class="muted">Seleziona una competizione.</p>`;

  const seasonTeams = getSeasonTeamsForSeason(competition.seasonId);
  if (!seasonTeams.length) {
    return `<p class="muted">Nessuna squadra associata alla stagione ${escapeHtml(competition.seasonId)}. Inseriscile nella sezione “Squadre per stagione”.</p>`;
  }

  const currentResults = getCompetitionResults(competition.id);
  const resultsByPosition = new Map(currentResults.map((result) => [Number(result.position), result]));
  const teamOptions = (selectedId = "") => `
    <option value="">Seleziona squadra</option>
    ${seasonTeams.map((seasonTeam) => `
      <option value="${escapeHtml(seasonTeam.id)}" ${seasonTeam.id === selectedId ? "selected" : ""}>${escapeHtml(seasonTeam.name)}</option>
    `).join("")}`;

  if (!isRankingCompetition(competition)) {
    const winner = resultsByPosition.get(1);
    const second = resultsByPosition.get(2);
    return `
      <div class="compact-card result-editor-card">
        <h3>${escapeHtml(competition.name)}</h3>
        <p class="muted">Formula a gironi/eliminazione: inserisci vincitore e secondo classificato.</p>
        <div class="form-grid">
          <label>
            Vincitore
            <select class="input" data-result-position="1" data-result-team>
              ${teamOptions(winner?.seasonTeamId || "")}
            </select>
          </label>
          <label>
            Secondo
            <select class="input" data-result-position="2" data-result-team>
              ${teamOptions(second?.seasonTeamId || "")}
            </select>
          </label>
        </div>
      </div>`;
  }

  const expectedRows = Math.max(getParticipantsCount(competition.seasonId), seasonTeams.length, currentResults.length);
  const rows = Array.from({ length: expectedRows }, (_, index) => {
    const position = index + 1;
    const result = resultsByPosition.get(position) || {};
    return `
      <tr>
        <td data-label="#" class="number">${position}</td>
        <td data-label="Squadra">
          <select class="input" data-result-position="${position}" data-result-team>
            ${teamOptions(result.seasonTeamId || "")}
          </select>
        </td>
        <td data-label="Punti" class="number"><input class="input" type="number" step="0.5" value="${escapeHtml(result.points ?? "")}" data-result-position="${position}" data-result-points /></td>
        <td data-label="G" class="number"><input class="input" type="number" step="1" value="${escapeHtml(result.played ?? "")}" data-result-position="${position}" data-result-played /></td>
        <td data-label="FPT" class="number"><input class="input" type="number" step="0.5" value="${escapeHtml(result.fantapoints ?? "")}" data-result-position="${position}" data-result-fantapoints /></td>
      </tr>`;
  }).join("");

  return `
    <div class="compact-card result-editor-card">
      <h3>${escapeHtml(competition.name)}</h3>
      <p class="muted">Competizione a classifica: inserisci dal primo all'ultimo posto.</p>
      <div class="table-wrap result-admin-table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Squadra</th><th class="number">Punti</th><th class="number">G</th><th class="number">FPT</th></tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

function renderStadiumAdminPanel() {
  const selectedSeasonId = getValidSeasonSelection("selectedAdminStadiumSeasonId");
  const seasonTeamsForSelectedSeason = state.raw.seasonTeams.filter((seasonTeam) => seasonTeam.seasonId === selectedSeasonId);
  const seasonTeamIdsForSelectedSeason = new Set(seasonTeamsForSelectedSeason.map((seasonTeam) => seasonTeam.id));

  const seasonOptions = state.raw.seasons.map((season) => `
    <option value="${escapeHtml(season.id)}" ${season.id === selectedSeasonId ? "selected" : ""}>${escapeHtml(season.name || season.id)}</option>
  `).join("");

  const seasonTeamOptions = seasonTeamsForSelectedSeason.map((seasonTeam) => `
    <option value="${escapeHtml(seasonTeam.id)}">${escapeHtml(seasonTeam.name || seasonTeam.id)}</option>
  `).join("");

  const levelOptions = STADIUM_LEVELS.map((level) => `
    <option value="${level.value}">${escapeHtml(level.label)}</option>
  `).join("");

  const filteredStadiums = state.raw.stadiums.filter((stadium) => seasonTeamIdsForSelectedSeason.has(stadium.seasonTeamId));
  const rows = filteredStadiums.map((stadium) => `
    <div class="admin-list-item">
      <span>
        <strong>${escapeHtml(getSeasonTeamDisplayName(stadium.seasonTeamId))}</strong>
        <small>${escapeHtml(stadium.name || "Stadio senza nome")} · Livello ${escapeHtml(stadium.level ?? 0)}</small>
      </span>
      <span>
        <button class="button button-secondary button-small" type="button" data-admin-edit-stadium="${escapeHtml(stadium.id)}">Modifica</button>
        <button class="button button-danger button-small" type="button" data-admin-delete-stadium="${escapeHtml(stadium.id)}">Elimina</button>
      </span>
    </div>
  `).join("") || `<p class="muted admin-empty-message">Nessuno stadio inserito per la stagione selezionata.</p>`;

  return renderAdminPanel("adminStadiumsPanel", "Firebase", "Stadi", "Imposta nome e livello dello stadio per ogni squadra in una determinata stagione.", `
      <form id="adminStadiumForm" class="form-grid">
        <input id="adminStadiumId" type="hidden" />
        <label>
          Stagione
          <select id="adminStadiumSeasonId" class="input" required>
            ${seasonOptions}
          </select>
        </label>
        <label>
          Squadra nella stagione
          <select id="adminStadiumSeasonTeamId" class="input" required>
            ${seasonTeamOptions}
          </select>
        </label>
        <label>
          Nome stadio
          <input id="adminStadiumName" class="input" type="text" placeholder="Es. Arechi Stadium" />
        </label>
        <label>
          Livello
          <select id="adminStadiumLevel" class="input" required>
            ${levelOptions}
          </select>
        </label>
        <div class="form-actions span-2">
          <button class="button button-primary" type="submit">Salva stadio</button>
          <button id="adminStadiumReset" class="button button-secondary" type="button">Nuovo</button>
          <span id="adminStadiumStatus" class="form-status"></span>
        </div>
      </form>

      <details class="admin-edit-section" open>
        <summary><strong>Stadi della stagione selezionata</strong><span>${filteredStadiums.length}</span></summary>
        <div class="admin-list">${rows}</div>
      </details>
  `);
}
function renderCompetitionMatchesAdminPanel() {
  const selectedSeasonId = getValidSeasonSelection("selectedAdminMatchSeasonId");
  const competitionsForSelectedSeason = state.raw.competitions.filter((competition) => competition.seasonId === selectedSeasonId);

  const selectedCompetitionId = state.selectedMatchCompetitionId && competitionsForSelectedSeason.some((competition) => competition.id === state.selectedMatchCompetitionId)
    ? state.selectedMatchCompetitionId
    : competitionsForSelectedSeason[0]?.id || "";
  state.selectedMatchCompetitionId = selectedCompetitionId;

  const seasonOptions = state.raw.seasons.map((season) => `
    <option value="${escapeHtml(season.id)}" ${season.id === selectedSeasonId ? "selected" : ""}>${escapeHtml(season.name || season.id)}</option>
  `).join("");

  const competitionOptions = competitionsForSelectedSeason.map((competition) => `
    <option value="${escapeHtml(competition.id)}" ${competition.id === selectedCompetitionId ? "selected" : ""}>${escapeHtml(competition.name)}</option>
  `).join("");

  const statusOptions = MATCH_STATUSES.map((status) => `
    <option value="${escapeHtml(status.value)}">${escapeHtml(status.label)}</option>
  `).join("");

  const matchdayOptions = STANDARD_KNOCKOUT_MATCHDAYS.map((matchday) => `
    <option value="${escapeHtml(matchday)}"></option>
  `).join("");

  const { competitionsById } = buildMaps();
  const matchesForSelectedCompetition = sortMatchesForDisplay(state.raw.competitionMatches.filter((match) => {
    const matchSeasonId = match.seasonId || competitionsById.get(match.competitionId)?.seasonId || "";
    return matchSeasonId === selectedSeasonId && (!selectedCompetitionId || match.competitionId === selectedCompetitionId);
  }));

  const matchdayValues = Array.from(new Set(
    matchesForSelectedCompetition
      .map((match) => match.matchday || "")
      .filter(Boolean)
  )).sort((a, b) => b.localeCompare(a, "it", { numeric: true }));

  const selectedMatchdayFilter = state.selectedAdminMatchdayFilter && matchdayValues.includes(state.selectedAdminMatchdayFilter)
    ? state.selectedAdminMatchdayFilter
    : "";
  state.selectedAdminMatchdayFilter = selectedMatchdayFilter;

  const matchdayFilterOptions = [`<option value="">Tutte le fasi/giornate</option>`, ...matchdayValues.map((matchday) => `
    <option value="${escapeHtml(matchday)}" ${matchday === selectedMatchdayFilter ? "selected" : ""}>${escapeHtml(matchday)}</option>
  `)].join("");

  const filteredMatches = selectedMatchdayFilter
    ? matchesForSelectedCompetition.filter((match) => (match.matchday || "") === selectedMatchdayFilter)
    : matchesForSelectedCompetition;

  const rows = filteredMatches.map((match) => {
    const competition = competitionsById.get(match.competitionId);
    return `
      <div class="admin-list-item">
        <span>
          <strong>${escapeHtml(getSeasonName(competition?.seasonId || match.seasonId))} · ${escapeHtml(competition?.name || match.competitionId)}</strong>
          <small><strong>Fase/giornata:</strong> ${escapeHtml(formatMatchStage(match))}${getMatchSerieAMatchday(match) ? ` · Serie A: ${escapeHtml(getMatchSerieAMatchday(match))}` : ""} · ${escapeHtml(match.matchDate || "-")} · ${escapeHtml(getSeasonTeamDisplayName(match.homeSeasonTeamId))} - ${escapeHtml(getSeasonTeamDisplayName(match.awaySeasonTeamId))} · ${escapeHtml(formatMatchResult(match))}</small>
        </span>
        <span>
          <span class="status ${match.status === "GIOCATA" ? "status-ok" : "status-warning"}">${escapeHtml(getLabel(MATCH_STATUSES, match.status))}</span>
          <button class="button button-secondary button-small" type="button" data-admin-edit-match="${escapeHtml(match.id)}">Modifica</button>
          <button class="button button-danger button-small" type="button" data-admin-delete-match="${escapeHtml(match.id)}">Elimina</button>
        </span>
      </div>`;
  }).join("") || `<p class="muted admin-empty-message">Nessuna partita trovata per stagione, competizione e fase/giornata selezionate.</p>`;

  return renderAdminPanel("adminCompetitionMatchesPanel", "Firebase", "Partite competizioni", "Inserisci calendario e risultati delle partite. Le partite possono essere Da giocare o Giocate.", `
      <form id="adminCompetitionMatchesForm" class="form-grid">
        <input id="adminCompetitionMatchId" type="hidden" />
        <label>
          Stagione
          <select id="adminCompetitionMatchSeasonId" class="input" required>
            ${seasonOptions}
          </select>
        </label>
        <label>
          Competizione
          <select id="adminCompetitionMatchCompetitionId" class="input" required>
            ${competitionOptions}
          </select>
        </label>
        <label>
          Filtro elenco fase/giornata
          <select id="adminCompetitionMatchdayFilter" class="input">
            ${matchdayFilterOptions}
          </select>
          <small class="field-hint">La lista sotto viene filtrata per stagione, competizione e fase/giornata.</small>
        </label>
        <label>
          Fase
          <input id="adminCompetitionMatchday" class="input" type="text" list="adminCompetitionMatchdayOptions" placeholder="Es. Giornata 1 oppure QF - Andata" required />
          <datalist id="adminCompetitionMatchdayOptions">${matchdayOptions}</datalist>
          <small class="field-hint">Per competizioni a gironi puoi usare QF/SF/Finale/Finalissima o scrivere una giornata libera.</small>
        </label>
        <label>
          Data
          <input id="adminCompetitionMatchDate" class="input" type="date" />
        </label>
        <label>
          Giornata Serie A reale
          <input id="adminCompetitionMatchSerieAMatchday" class="input" type="number" min="1" step="1" placeholder="Es. 12" />
        </label>
        <label>
          Squadra casa
          <select id="adminCompetitionMatchHome" class="input" required></select>
        </label>
        <label>
          Squadra trasferta
          <select id="adminCompetitionMatchAway" class="input" required></select>
        </label>
        <label>
          Stato partita
          <select id="adminCompetitionMatchStatus" class="input" required>
            ${statusOptions}
          </select>
        </label>
        <label>
          Gol casa
          <input id="adminCompetitionMatchHomeGoals" class="input" type="number" min="0" step="1" />
        </label>
        <label>
          Gol trasferta
          <input id="adminCompetitionMatchAwayGoals" class="input" type="number" min="0" step="1" />
        </label>
        <label>
          FP casa
          <input id="adminCompetitionMatchHomeScore" class="input" type="number" step="0.5" />
        </label>
        <label>
          FP trasferta
          <input id="adminCompetitionMatchAwayScore" class="input" type="number" step="0.5" />
        </label>
        <label class="span-2">
          Note
          <input id="adminCompetitionMatchNotes" class="input" type="text" placeholder="Opzionale" />
        </label>
        <div class="form-actions span-2">
          <button class="button button-primary" type="submit" ${competitionsForSelectedSeason.length ? "" : "disabled"}>Salva partita</button>
          <button id="adminCompetitionMatchReset" class="button button-secondary" type="button">Nuova</button>
          <span id="adminCompetitionMatchStatusText" class="form-status"></span>
        </div>
      </form>

      <details class="admin-edit-section" open>
        <summary><strong>Partite filtrate</strong><span>${filteredMatches.length}</span></summary>
        <div class="admin-list">${rows}</div>
      </details>
  `);
}
function renderFifaRankingAdminPanel() {
  const teamOptions = state.raw.teams.map((team) => `
    <option value="${escapeHtml(team.id)}">${escapeHtml(team.canonicalName || team.id)}</option>
  `).join("");

  const rows = buildFifaRanking().map((ranking) => `
    <div class="admin-list-item">
      <span>
        <strong>${ranking.position}. ${escapeHtml(ranking.teamName)}</strong>
        <small>Punteggio: ${escapeHtml(ranking.score)}</small>
      </span>
      <span>
        <button class="button button-secondary button-small" type="button" data-admin-edit-fifa="${escapeHtml(ranking.id)}">Modifica</button>
        <button class="button button-danger button-small" type="button" data-admin-delete-fifa="${escapeHtml(ranking.id)}">Elimina</button>
      </span>
    </div>
  `).join("") || `<p class="muted admin-empty-message">Nessuna voce FIFA Ranking inserita.</p>`;

  return renderAdminPanel("adminFifaRankingPanel", "Firebase", "FIFA Ranking", "Inserisci manualmente il punteggio FIFA di ogni squadra. La posizione è calcolata dal punteggio più alto al più basso.", `
      <form id="adminFifaRankingForm" class="form-grid">
        <input id="adminFifaRankingId" type="hidden" />
        <label>
          Squadra
          <select id="adminFifaRankingTeamId" class="input" required>
            ${teamOptions}
          </select>
        </label>
        <label>
          Punteggio
          <input id="adminFifaRankingScore" class="input" type="text" inputmode="decimal" placeholder="Es. 1234,56" required />
        </label>
        <label class="span-2">
          Note
          <input id="adminFifaRankingNotes" class="input" type="text" placeholder="Opzionale" />
        </label>
        <div class="form-actions span-2">
          <button class="button button-primary" type="submit">Salva ranking</button>
          <button id="adminFifaRankingReset" class="button button-secondary" type="button">Nuovo</button>
          <span id="adminFifaRankingStatus" class="form-status"></span>
        </div>
      </form>

      <details class="admin-edit-section" open>
        <summary><strong>Classifica FIFA</strong><span>${state.raw.fifaRankings.length}</span></summary>
        <div class="admin-list">${rows}</div>
      </details>
  `);
}



function renderListoneToolsAdminPanel() {
  const seasonOptions = state.raw.seasons.map((season) => `
    <option value="${escapeHtml(season.id)}">${escapeHtml(season.name || season.id)}</option>
  `).join("");

  return renderAdminPanel("adminListoneToolsPanel", "File statici", "Converti listone Excel", "Carica un Excel Fantacalcio e scarica il JSON pronto da salvare in assets/listoni. Il sito mostrerà sempre l'ultimo listone indicato nel manifest.", `
    <form id="adminListoneConverterForm" class="form-grid">
      <label>
        Stagione
        <select id="adminListoneSeasonId" class="input" required>${seasonOptions}</select>
      </label>
      <label>
        Data listone
        <input id="adminListoneDate" class="input" type="date" value="${escapeHtml(getTodayIsoDate())}" required />
      </label>
      <label class="span-2">
        Label
        <input id="adminListoneLabel" class="input" type="text" placeholder="Es. Quotazioni Fantacalcio Stagione 2025/26" />
      </label>
      <label class="span-2">
        File Excel listone
        <input id="adminListoneFile" class="input" type="file" accept=".xlsx,.xls" required />
        <small class="field-hint">Il file non viene caricato su Firebase: viene convertito nel browser e scaricato come JSON.</small>
      </label>
      <div class="form-actions span-2">
        <button class="button button-primary" type="submit">Converti e scarica JSON</button>
        <span id="adminListoneConverterStatus" class="form-status"></span>
      </div>
    </form>
    <div id="adminListoneConverterReport" class="import-report hidden"></div>
  `);
}

function renderBackupAdminPanel() {
  return renderAdminPanel("adminBackupPanel", "Backup", "Download dati Firebase", "Scarica uno snapshot JSON delle raccolte Firestore usate dal sito.", `
    <div class="form-actions">
      <button id="adminDownloadFirebaseBackup" class="button button-primary" type="button">Scarica backup Firebase</button>
      <span id="adminBackupStatus" class="form-status"></span>
    </div>
    <small class="field-hint">Il backup include: ${escapeHtml(COLLECTIONS.join(", "))}.</small>
  `);
}

function attachAdminHandlers() {
  const seasonForm = document.getElementById("adminSeasonForm");
  const presidentForm = document.getElementById("adminPresidentForm");
  const teamForm = document.getElementById("adminTeamForm");
  const seasonTeamForm = document.getElementById("adminSeasonTeamForm");
  const stadiumForm = document.getElementById("adminStadiumForm");
  const competitionForm = document.getElementById("adminCompetitionForm");
  const competitionMatchesForm = document.getElementById("adminCompetitionMatchesForm");
  const competitionResultsForm = document.getElementById("adminCompetitionResultsForm");
  const fifaRankingForm = document.getElementById("adminFifaRankingForm");
  const listoneConverterForm = document.getElementById("adminListoneConverterForm");

  seasonForm?.addEventListener("submit", saveSeason);
  presidentForm?.addEventListener("submit", savePresident);
  teamForm?.addEventListener("submit", saveTeam);
  seasonTeamForm?.addEventListener("submit", saveSeasonTeam);
  stadiumForm?.addEventListener("submit", saveStadium);
  competitionForm?.addEventListener("submit", saveCompetition);
  competitionMatchesForm?.addEventListener("submit", saveCompetitionMatch);
  competitionResultsForm?.addEventListener("submit", saveCompetitionResults);
  fifaRankingForm?.addEventListener("submit", saveFifaRanking);
  listoneConverterForm?.addEventListener("submit", handleListoneConverterSubmit);
  document.getElementById("adminDownloadFirebaseBackup")?.addEventListener("click", downloadFirebaseBackup);

  document.getElementById("adminSeasonReset")?.addEventListener("click", resetSeasonForm);
  document.getElementById("adminPresidentReset")?.addEventListener("click", resetPresidentForm);
  document.getElementById("adminTeamReset")?.addEventListener("click", resetTeamForm);
  document.getElementById("adminSeasonTeamReset")?.addEventListener("click", resetSeasonTeamForm);
  document.getElementById("adminStadiumReset")?.addEventListener("click", resetStadiumForm);
  document.getElementById("adminCompetitionReset")?.addEventListener("click", resetCompetitionForm);
  document.getElementById("adminCompetitionMatchReset")?.addEventListener("click", resetCompetitionMatchForm);
  document.getElementById("adminFifaRankingReset")?.addEventListener("click", resetFifaRankingForm);
  document.getElementById("adminCompetitionCreateDefaults")?.addEventListener("click", createDefaultCompetitions);

  document.getElementById("adminTeamName")?.addEventListener("input", updateTeamLogoPreview);
  document.getElementById("adminTeamRemoveLogo")?.addEventListener("change", () => {
    if (document.getElementById("adminTeamRemoveLogo").checked) {
      document.getElementById("adminTeamLogoValue").value = "";
    }
    updateTeamLogoPreview();
  });
  document.getElementById("adminTeamLogoValue")?.addEventListener("input", updateTeamLogoPreview);
  document.getElementById("adminClearBase64Logos")?.addEventListener("click", clearBase64LogosFromFirebase);
  updateTeamLogoPreview();

  document.getElementById("adminSeasonTeamSeasonId")?.addEventListener("change", (event) => {
    state.selectedAdminSeasonTeamSeasonId = event.target.value;
    renderAdminArea();
  });
  document.getElementById("adminSeasonTeamTeamId")?.addEventListener("change", () => fillSeasonTeamDefaultsFromTeam({ force: true }));
  document.getElementById("adminSeasonTeamName")?.addEventListener("input", updateSeasonTeamLogoPreview);
  document.getElementById("adminSeasonTeamRemoveLogo")?.addEventListener("change", () => {
    if (document.getElementById("adminSeasonTeamRemoveLogo").checked) {
      document.getElementById("adminSeasonTeamLogoValue").value = "";
    }
    updateSeasonTeamLogoPreview();
  });
  document.getElementById("adminSeasonTeamLogoValue")?.addEventListener("input", updateSeasonTeamLogoPreview);
  fillSeasonTeamDefaultsFromTeam();
  updateSeasonTeamLogoPreview();

  document.getElementById("adminStadiumSeasonId")?.addEventListener("change", (event) => {
    state.selectedAdminStadiumSeasonId = event.target.value;
    renderAdminArea();
  });

  document.getElementById("adminCompetitionSeasonId")?.addEventListener("change", (event) => {
    state.selectedAdminCompetitionSeasonId = event.target.value;
    renderAdminArea();
  });

  document.getElementById("adminCompetitionMatchSeasonId")?.addEventListener("change", (event) => {
    state.selectedAdminMatchSeasonId = event.target.value;
    state.selectedMatchCompetitionId = "";
    state.selectedAdminMatchdayFilter = "";
    renderAdminArea();
  });
  document.getElementById("adminCompetitionMatchCompetitionId")?.addEventListener("change", (event) => {
    state.selectedMatchCompetitionId = event.target.value;
    state.selectedAdminMatchdayFilter = "";
    renderAdminArea();
  });
  document.getElementById("adminCompetitionMatchdayFilter")?.addEventListener("change", (event) => {
    state.selectedAdminMatchdayFilter = event.target.value;
    renderAdminArea();
  });
  updateCompetitionMatchTeamOptions();

  document.getElementById("adminCompetitionResultsSeasonId")?.addEventListener("change", (event) => {
    state.selectedAdminResultsSeasonId = event.target.value;
    state.selectedResultCompetitionId = "";
    renderAdminArea();
  });
  document.getElementById("adminCompetitionResultsCompetitionId")?.addEventListener("change", (event) => {
    state.selectedResultCompetitionId = event.target.value;
    const editor = document.getElementById("adminCompetitionResultsEditor");
    if (editor) editor.innerHTML = renderCompetitionResultsEditor(state.selectedResultCompetitionId);
  });

  document.querySelectorAll("[data-admin-toggle-panel]").forEach((button) => {
    button.addEventListener("click", () => toggleAdminPanel(button.dataset.adminTogglePanel));
  });

  document.querySelectorAll("[data-admin-edit-season]").forEach((button) => {
    button.addEventListener("click", () => editSeason(button.dataset.adminEditSeason));
  });
  document.querySelectorAll("[data-admin-delete-season]").forEach((button) => {
    button.addEventListener("click", () => deleteDocument("seasons", button.dataset.adminDeleteSeason, "stagione"));
  });

  document.querySelectorAll("[data-admin-edit-president]").forEach((button) => {
    button.addEventListener("click", () => editPresident(button.dataset.adminEditPresident));
  });
  document.querySelectorAll("[data-admin-delete-president]").forEach((button) => {
    button.addEventListener("click", () => deleteDocument("presidents", button.dataset.adminDeletePresident, "presidente"));
  });

  document.querySelectorAll("[data-admin-edit-team]").forEach((button) => {
    button.addEventListener("click", () => editTeam(button.dataset.adminEditTeam));
  });
  document.querySelectorAll("[data-admin-delete-team]").forEach((button) => {
    button.addEventListener("click", () => deleteDocument("teams", button.dataset.adminDeleteTeam, "squadra"));
  });

  document.querySelectorAll("[data-admin-edit-season-team]").forEach((button) => {
    button.addEventListener("click", () => editSeasonTeam(button.dataset.adminEditSeasonTeam));
  });
  document.querySelectorAll("[data-admin-delete-season-team]").forEach((button) => {
    button.addEventListener("click", () => deleteDocument("seasonTeams", button.dataset.adminDeleteSeasonTeam, "associazione squadra/stagione"));
  });

  document.querySelectorAll("[data-admin-edit-stadium]").forEach((button) => {
    button.addEventListener("click", () => editStadium(button.dataset.adminEditStadium));
  });
  document.querySelectorAll("[data-admin-delete-stadium]").forEach((button) => {
    button.addEventListener("click", () => deleteDocument("stadiums", button.dataset.adminDeleteStadium, "stadio"));
  });

  document.querySelectorAll("[data-admin-edit-competition]").forEach((button) => {
    button.addEventListener("click", () => editCompetition(button.dataset.adminEditCompetition));
  });
  document.querySelectorAll("[data-admin-delete-competition]").forEach((button) => {
    button.addEventListener("click", () => deleteDocument("competitions", button.dataset.adminDeleteCompetition, "competizione"));
  });

  document.querySelectorAll("[data-admin-edit-match]").forEach((button) => {
    button.addEventListener("click", () => editCompetitionMatch(button.dataset.adminEditMatch));
  });
  document.querySelectorAll("[data-admin-delete-match]").forEach((button) => {
    button.addEventListener("click", () => deleteDocument("competitionMatches", button.dataset.adminDeleteMatch, "partita"));
  });

  document.querySelectorAll("[data-admin-edit-fifa]").forEach((button) => {
    button.addEventListener("click", () => editFifaRanking(button.dataset.adminEditFifa));
  });
  document.querySelectorAll("[data-admin-delete-fifa]").forEach((button) => {
    button.addEventListener("click", () => deleteDocument("fifaRankings", button.dataset.adminDeleteFifa, "voce FIFA ranking"));
  });
}

function toggleAdminPanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const isCollapsed = !panel.classList.contains("is-collapsed");
  panel.classList.toggle("is-collapsed", isCollapsed);

  if (isCollapsed) state.collapsedAdminPanels.add(panelId);
  else state.collapsedAdminPanels.delete(panelId);

  const button = panel.querySelector("[data-admin-toggle-panel]");
  if (button) button.textContent = isCollapsed ? "Ingrandisci" : "Riduci";
}

function expandAdminPanel(panelId) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  panel.classList.remove("is-collapsed");
  state.collapsedAdminPanels.delete(panelId);

  const button = panel.querySelector("[data-admin-toggle-panel]");
  if (button) button.textContent = "Riduci";
}

async function handleTeamLogoFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    showMessage("adminTeamStatus", "Caricamento logo...");
    const dataUrl = await readLogoFileAsDataUrl(file);
    document.getElementById("adminTeamLogoValue").value = dataUrl;
    document.getElementById("adminTeamRemoveLogo").checked = false;
    updateTeamLogoPreview();
    showMessage("adminTeamStatus", "Logo caricato. Ricorda di salvare la squadra.");
  } catch (error) {
    console.error(error);
    showMessage("adminTeamStatus", "Errore nel caricamento logo.", true);
  }
}

function updateTeamLogoPreview() {
  const preview = document.getElementById("adminTeamLogoPreview");
  if (!preview) return;

  const name = document.getElementById("adminTeamName")?.value || "Squadra";
  const removeLogo = document.getElementById("adminTeamRemoveLogo")?.checked;
  const logo = removeLogo ? "" : document.getElementById("adminTeamLogoValue")?.value;

  preview.innerHTML = `
    ${renderTeamLogo(name, logo, "club-logo-lg")}
    <span class="muted small">${logo ? "Logo da file statico" : "Placeholder: prime due lettere"}</span>
  `;
}

function fillSeasonTeamDefaultsFromTeam(options = {}) {
  const { force = false } = options;
  const teamId = document.getElementById("adminSeasonTeamTeamId")?.value;
  const { teamsById } = buildMaps();
  const team = teamsById.get(teamId);
  if (!team) {
    updateSeasonTeamLogoPreview();
    return;
  }

  const nameInput = document.getElementById("adminSeasonTeamName");
  if (nameInput && (force || !nameInput.value)) {
    nameInput.value = team.canonicalName || "";
  }

  const presidentSelect = document.getElementById("adminSeasonTeamPresidentIds");
  const currentPresidentIds = new Set(team.currentPresidentIds || []);
  const hasSelectedPresidents = presidentSelect
    ? Array.from(presidentSelect.selectedOptions).length > 0
    : false;

  if (presidentSelect && (force || !hasSelectedPresidents)) {
    Array.from(presidentSelect.options).forEach((option) => {
      option.selected = currentPresidentIds.has(option.value);
    });
  }

  updateSeasonTeamLogoPreview();
}

async function handleSeasonTeamLogoFileChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    showMessage("adminSeasonTeamStatus", "Caricamento logo...");
    const dataUrl = await readLogoFileAsDataUrl(file);
    document.getElementById("adminSeasonTeamLogoValue").value = dataUrl;
    document.getElementById("adminSeasonTeamRemoveLogo").checked = false;
    updateSeasonTeamLogoPreview();
    showMessage("adminSeasonTeamStatus", "Logo caricato. Ricorda di salvare l'associazione.");
  } catch (error) {
    console.error(error);
    showMessage("adminSeasonTeamStatus", "Errore nel caricamento logo.", true);
  }
}

function updateSeasonTeamLogoPreview() {
  const preview = document.getElementById("adminSeasonTeamLogoPreview");
  if (!preview) return;

  const name = document.getElementById("adminSeasonTeamName")?.value || "Squadra";
  const removeLogo = document.getElementById("adminSeasonTeamRemoveLogo")?.checked;
  const logoValue = removeLogo ? "" : document.getElementById("adminSeasonTeamLogoValue")?.value;
  const teamId = document.getElementById("adminSeasonTeamTeamId")?.value;
  const teamLogo = getLogoPathForInput(buildMaps().teamsById.get(teamId)?.logo || "");
  const logo = logoValue || teamLogo;

  preview.innerHTML = `
    ${renderTeamLogo(name, logo, "club-logo-lg")}
    <span class="muted small">${logoValue ? "Logo stagionale da file statico" : teamLogo ? "Logo ereditato dalla squadra madre" : "Placeholder: prime due lettere"}</span>
  `;
}

async function clearBase64LogosFromFirebase() {
  const teamsWithBase64 = state.raw.teams.filter((team) => isBase64Logo(team.logo));
  const seasonTeamsWithBase64 = state.raw.seasonTeams.filter((seasonTeam) => isBase64Logo(seasonTeam.logo));
  const total = teamsWithBase64.length + seasonTeamsWithBase64.length;

  if (!total) {
    showMessage("adminTeamStatus", "Nessun logo base64 da rimuovere.");
    return;
  }

  const confirmed = window.confirm(`Rimuovere ${total} logo base64 da Firebase? I file statici in assets/logos/ non vengono toccati.`);
  if (!confirmed) return;

  try {
    showMessage("adminTeamStatus", "Rimozione loghi base64 in corso...");

    await Promise.all([
      ...teamsWithBase64.map((team) => setDoc(doc(db, "teams", team.id), { logo: "", updatedAt: serverTimestamp() }, { merge: true })),
      ...seasonTeamsWithBase64.map((seasonTeam) => setDoc(doc(db, "seasonTeams", seasonTeam.id), { logo: "", updatedAt: serverTimestamp() }, { merge: true }))
    ]);

    showMessage("adminTeamStatus", `Rimossi ${total} logo base64 da Firebase.`);
    await loadData();
  } catch (error) {
    console.error(error);
    showMessage("adminTeamStatus", "Errore durante la rimozione dei loghi base64.", true);
  }
}

async function saveSeason(event) {
  event.preventDefault();
  const id = document.getElementById("adminSeasonId").value.trim();
  if (!id) return;

  const payload = {
    name: document.getElementById("adminSeasonName").value.trim() || id,
    startsOn: document.getElementById("adminSeasonStartsOn").value || "",
    endsOn: document.getElementById("adminSeasonEndsOn").value || "",
    isCurrent: document.getElementById("adminSeasonIsCurrent").checked,
    participantCount: Number(document.getElementById("adminSeasonParticipantCount")?.value || 0),
    updatedAt: serverTimestamp()
  };

  try {
    showMessage("adminSeasonStatus", "Salvataggio...");

    if (payload.isCurrent) {
      await Promise.all(
        state.raw.seasons
          .filter((season) => season.id !== id && season.isCurrent)
          .map((season) => setDoc(doc(db, "seasons", season.id), { isCurrent: false, updatedAt: serverTimestamp() }, { merge: true }))
      );
    }

    const exists = state.raw.seasons.some((season) => season.id === id);
    const savePayload = exists
      ? payload
      : { ...payload, createdAt: serverTimestamp() };

    await setDoc(doc(db, "seasons", id), savePayload, { merge: true });

    showMessage("adminSeasonStatus", "Stagione salvata.");
    resetSeasonForm();
    await loadData();
  } catch (error) {
    console.error(error);
    showMessage("adminSeasonStatus", "Errore salvataggio stagione.", true);
  }
}

async function savePresident(event) {
  event.preventDefault();
  const id = document.getElementById("adminPresidentId").value.trim();

  const payload = {
    name: document.getElementById("adminPresidentName").value.trim(),
    notes: document.getElementById("adminPresidentNotes").value.trim(),
    isActive: document.getElementById("adminPresidentIsActive").checked,
    updatedAt: serverTimestamp()
  };

  if (!payload.name) return;

  try {
    showMessage("adminPresidentStatus", "Salvataggio...");

    if (id) {
      await setDoc(doc(db, "presidents", id), payload, { merge: true });
    } else {
      await addDoc(collection(db, "presidents"), {
        ...payload,
        createdAt: serverTimestamp()
      });
    }

    showMessage("adminPresidentStatus", "Presidente salvato.");
    resetPresidentForm();
    await loadData();
  } catch (error) {
    console.error(error);
    showMessage("adminPresidentStatus", "Errore salvataggio presidente.", true);
  }
}

async function saveTeam(event) {
  event.preventDefault();
  const id = document.getElementById("adminTeamId").value.trim();

  const selectedPresidentIds = Array.from(document.getElementById("adminTeamPresidentIds").selectedOptions)
    .map((option) => option.value);

  const removeLogo = document.getElementById("adminTeamRemoveLogo").checked;
  const payload = {
    canonicalName: document.getElementById("adminTeamName").value.trim(),
    logo: removeLogo ? "" : normalizeLogoPath(document.getElementById("adminTeamLogoValue").value),
    currentPresidentIds: selectedPresidentIds,
    notes: document.getElementById("adminTeamNotes").value.trim(),
    isCurrent: document.getElementById("adminTeamIsCurrent").checked,
    updatedAt: serverTimestamp()
  };

  if (!payload.canonicalName) return;

  try {
    showMessage("adminTeamStatus", "Salvataggio...");

    if (id) {
      await setDoc(doc(db, "teams", id), payload, { merge: true });
    } else {
      await addDoc(collection(db, "teams"), {
        ...payload,
        createdAt: serverTimestamp()
      });
    }

    showMessage("adminTeamStatus", "Squadra salvata.");
    resetTeamForm();
    await loadData();
  } catch (error) {
    console.error(error);
    showMessage("adminTeamStatus", "Errore salvataggio squadra.", true);
  }
}

async function saveSeasonTeam(event) {
  event.preventDefault();

  const existingId = document.getElementById("adminSeasonTeamId").value.trim();
  const seasonId = document.getElementById("adminSeasonTeamSeasonId").value;
  const teamId = document.getElementById("adminSeasonTeamTeamId").value;
  const selectedPresidentIds = Array.from(document.getElementById("adminSeasonTeamPresidentIds").selectedOptions)
    .map((option) => option.value);
  const removeLogo = document.getElementById("adminSeasonTeamRemoveLogo").checked;
  const payload = {
    seasonId,
    teamId,
    name: document.getElementById("adminSeasonTeamName").value.trim(),
    logo: removeLogo ? "" : normalizeLogoPath(document.getElementById("adminSeasonTeamLogoValue").value),
    presidentIds: selectedPresidentIds,
    isHistorical: document.getElementById("adminSeasonTeamIsHistorical").checked,
    updatedAt: serverTimestamp()
  };

  if (!payload.seasonId || !payload.teamId || !payload.name) return;

  const id = existingId || `${makeIdPart(payload.seasonId)}_${makeIdPart(payload.teamId)}`;

  try {
    showMessage("adminSeasonTeamStatus", "Salvataggio...");
    const savePayload = existingId ? payload : { ...payload, createdAt: serverTimestamp() };
    await setDoc(doc(db, "seasonTeams", id), savePayload, { merge: true });

    showMessage("adminSeasonTeamStatus", "Associazione squadra/stagione salvata.");
    resetSeasonTeamForm();
    await loadData();
  } catch (error) {
    console.error(error);
    showMessage("adminSeasonTeamStatus", "Errore salvataggio associazione.", true);
  }
}

async function saveCompetition(event) {
  event.preventDefault();
  const id = document.getElementById("adminCompetitionId").value.trim();

  const payload = {
    seasonId: document.getElementById("adminCompetitionSeasonId").value,
    name: document.getElementById("adminCompetitionName").value.trim(),
    type: document.getElementById("adminCompetitionType").value,
    format: document.getElementById("adminCompetitionFormat").value,
    status: document.getElementById("adminCompetitionStatus").value,
    notes: document.getElementById("adminCompetitionNotes").value.trim(),
    knockoutPhases: document.getElementById("adminCompetitionFormat").value === "GIRONI_KO"
      ? ["QUARTI", "SEMIFINALI", "FINALE"]
      : [],
    updatedAt: serverTimestamp()
  };

  if (!payload.seasonId || !payload.name) return;

  try {
    showMessage("adminCompetitionStatusText", "Salvataggio...");

    if (id) {
      await setDoc(doc(db, "competitions", id), payload, { merge: true });
    } else {
      await addDoc(collection(db, "competitions"), {
        ...payload,
        createdAt: serverTimestamp()
      });
    }

    showMessage("adminCompetitionStatusText", "Competizione salvata.");
    resetCompetitionForm();
    await loadData();
  } catch (error) {
    console.error(error);
    showMessage("adminCompetitionStatusText", "Errore salvataggio competizione.", true);
  }
}

async function createDefaultCompetitions() {
  const seasonId = document.getElementById("adminCompetitionSeasonId")?.value || getCurrentSeasonId();
  if (!seasonId) {
    showMessage("adminCompetitionStatusText", "Crea prima almeno una stagione.", true);
    return;
  }

  try {
    showMessage("adminCompetitionStatusText", "Creazione competizioni standard...");

    await Promise.all(DEFAULT_COMPETITIONS.map((competition) => {
      const id = `${makeIdPart(seasonId)}_${competition.idSuffix}`;
      return setDoc(doc(db, "competitions", id), {
        seasonId,
        name: competition.name,
        type: competition.type,
        format: competition.format,
        status: competition.status,
        knockoutPhases: competition.format === "GIRONI_KO" ? ["QUARTI", "SEMIFINALI", "FINALE"] : [],
        notes: "",
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      }, { merge: true });
    }));

    showMessage("adminCompetitionStatusText", "Competizioni standard create.");
    await loadData();
  } catch (error) {
    console.error(error);
    showMessage("adminCompetitionStatusText", "Errore creazione competizioni standard.", true);
  }
}

async function saveCompetitionResults(event) {
  event.preventDefault();
  const competitionId = document.getElementById("adminCompetitionResultsCompetitionId")?.value;
  const competition = state.raw.competitions.find((item) => item.id === competitionId);
  if (!competition) return;

  const rows = [];
  document.querySelectorAll("[data-result-team]").forEach((select) => {
    const position = Number(select.dataset.resultPosition);
    const seasonTeamId = select.value;
    if (!position || !seasonTeamId) return;

    const pointsInput = document.querySelector(`[data-result-points][data-result-position="${position}"]`);
    const playedInput = document.querySelector(`[data-result-played][data-result-position="${position}"]`);
    const fantapointsInput = document.querySelector(`[data-result-fantapoints][data-result-position="${position}"]`);

    rows.push({
      competitionId,
      seasonId: competition.seasonId,
      seasonTeamId,
      position,
      points: pointsInput?.value === "" || !pointsInput ? null : Number(pointsInput.value),
      played: playedInput?.value === "" || !playedInput ? null : Number(playedInput.value),
      fantapoints: fantapointsInput?.value === "" || !fantapointsInput ? null : Number(fantapointsInput.value),
      updatedAt: serverTimestamp()
    });
  });

  if (!rows.length) {
    showMessage("adminCompetitionResultsStatus", "Inserisci almeno una squadra.", true);
    return;
  }

  const duplicateTeams = rows.some((row, index) => rows.findIndex((other) => other.seasonTeamId === row.seasonTeamId) !== index);
  if (duplicateTeams) {
    showMessage("adminCompetitionResultsStatus", "Una squadra è stata selezionata più volte.", true);
    return;
  }

  try {
    showMessage("adminCompetitionResultsStatus", "Salvataggio risultati...");

    await Promise.all(
      state.raw.competitionResults
        .filter((result) => result.competitionId === competitionId)
        .map((result) => deleteDoc(doc(db, "competitionResults", result.id)))
    );

    await Promise.all(rows.map((row) => setDoc(
      doc(db, "competitionResults", `${makeIdPart(competitionId)}_${row.position}`),
      { ...row, createdAt: serverTimestamp() },
      { merge: true }
    )));

    await syncHonorRollForCompetition(competition, rows);

    showMessage("adminCompetitionResultsStatus", "Risultati salvati e albo aggiornato.");
    await loadData();
  } catch (error) {
    console.error(error);
    showMessage("adminCompetitionResultsStatus", "Errore salvataggio risultati.", true);
  }
}

async function syncHonorRollForCompetition(competition, rows) {
  const byPosition = new Map(rows.map((row) => [Number(row.position), row.seasonTeamId]));
  const payload = {
    seasonId: competition.seasonId,
    updatedAt: serverTimestamp()
  };

  if (competition.type === "CAMPIONATO") {
    payload.championItalySeasonTeamId = byPosition.get(1) || null;
    payload.secondPlaceSeasonTeamId = byPosition.get(2) || null;
    payload.thirdPlaceSeasonTeamId = byPosition.get(3) || null;
  }

  if (competition.type === "COPPA_ITALIA") {
    payload.coppaItaliaWinnerSeasonTeamId = byPosition.get(1) || null;
  }

  if (competition.type === "CHAMPIONS_LEAGUE") {
    payload.championsLeagueWinnerSeasonTeamId = byPosition.get(1) || null;
  }

  if (competition.type === "PLAYOFF") {
    payload.playoffWinnerSeasonTeamId = byPosition.get(1) || null;
  }

  await setDoc(doc(db, "honorRoll", competition.seasonId), payload, { merge: true });
}

function updateCompetitionMatchTeamOptions(selectedHomeId = "", selectedAwayId = "") {
  const competitionId = document.getElementById("adminCompetitionMatchCompetitionId")?.value;
  const competition = state.raw.competitions.find((item) => item.id === competitionId);
  const seasonTeams = competition ? getSeasonTeamsForSeason(competition.seasonId) : [];

  const makeOptions = (selectedId) => `
    <option value="">Seleziona squadra</option>
    ${seasonTeams.map((seasonTeam) => `
      <option value="${escapeHtml(seasonTeam.id)}" ${seasonTeam.id === selectedId ? "selected" : ""}>${escapeHtml(seasonTeam.name || seasonTeam.id)}</option>
    `).join("")}`;

  const home = document.getElementById("adminCompetitionMatchHome");
  const away = document.getElementById("adminCompetitionMatchAway");
  if (home) home.innerHTML = makeOptions(selectedHomeId || home.value);
  if (away) away.innerHTML = makeOptions(selectedAwayId || away.value);
}

function nullableNumberFromInput(id) {
  return parseDecimalValue(document.getElementById(id)?.value);
}

async function saveStadium(event) {
  event.preventDefault();
  const existingId = document.getElementById("adminStadiumId").value.trim();
  const seasonTeamId = document.getElementById("adminStadiumSeasonTeamId").value;

  const payload = {
    seasonTeamId,
    name: document.getElementById("adminStadiumName").value.trim(),
    level: Number(document.getElementById("adminStadiumLevel").value || 0),
    updatedAt: serverTimestamp()
  };

  if (!payload.seasonTeamId) return;

  const id = existingId || `stadium_${makeIdPart(seasonTeamId)}`;

  try {
    showMessage("adminStadiumStatus", "Salvataggio...");
    await setDoc(doc(db, "stadiums", id), existingId ? payload : {
      ...payload,
      createdAt: serverTimestamp()
    }, { merge: true });
    showMessage("adminStadiumStatus", "Stadio salvato.");
    resetStadiumForm();
    await loadData();
  } catch (error) {
    console.error(error);
    showMessage("adminStadiumStatus", "Errore salvataggio stadio.", true);
  }
}

async function saveCompetitionMatch(event) {
  event.preventDefault();
  const existingId = document.getElementById("adminCompetitionMatchId").value.trim();
  const competitionId = document.getElementById("adminCompetitionMatchCompetitionId").value;
  const competition = state.raw.competitions.find((item) => item.id === competitionId);
  if (!competition) return;

  const payload = {
    competitionId,
    seasonId: competition.seasonId,
    matchday: document.getElementById("adminCompetitionMatchday").value.trim(),
    matchDate: document.getElementById("adminCompetitionMatchDate").value || "",
    serieAMatchday: nullableNumberFromInput("adminCompetitionMatchSerieAMatchday"),
    homeSeasonTeamId: document.getElementById("adminCompetitionMatchHome").value,
    awaySeasonTeamId: document.getElementById("adminCompetitionMatchAway").value,
    status: document.getElementById("adminCompetitionMatchStatus").value,
    homeGoals: nullableNumberFromInput("adminCompetitionMatchHomeGoals"),
    awayGoals: nullableNumberFromInput("adminCompetitionMatchAwayGoals"),
    homeScore: nullableNumberFromInput("adminCompetitionMatchHomeScore"),
    awayScore: nullableNumberFromInput("adminCompetitionMatchAwayScore"),
    notes: document.getElementById("adminCompetitionMatchNotes").value.trim(),
    updatedAt: serverTimestamp()
  };

  if (!payload.matchday || !payload.homeSeasonTeamId || !payload.awaySeasonTeamId) return;
  if (payload.homeSeasonTeamId === payload.awaySeasonTeamId) {
    showMessage("adminCompetitionMatchStatusText", "Casa e trasferta non possono essere la stessa squadra.", true);
    return;
  }

  const id = existingId || `${makeIdPart(competitionId)}_${makeIdPart(payload.matchday)}_${makeIdPart(payload.homeSeasonTeamId)}_${makeIdPart(payload.awaySeasonTeamId)}`;

  try {
    showMessage("adminCompetitionMatchStatusText", "Salvataggio...");
    await setDoc(doc(db, "competitionMatches", id), existingId ? payload : {
      ...payload,
      createdAt: serverTimestamp()
    }, { merge: true });
    showMessage("adminCompetitionMatchStatusText", "Partita salvata.");
    state.selectedAdminMatchSeasonId = payload.seasonId;
    state.selectedMatchCompetitionId = payload.competitionId;
    state.selectedAdminMatchdayFilter = payload.matchday || "";
    resetCompetitionMatchForm();
    await loadData();
  } catch (error) {
    console.error(error);
    showMessage("adminCompetitionMatchStatusText", "Errore salvataggio partita.", true);
  }
}

async function saveFifaRanking(event) {
  event.preventDefault();
  const existingId = document.getElementById("adminFifaRankingId").value.trim();
  const teamId = document.getElementById("adminFifaRankingTeamId").value;

  const score = nullableNumberFromInput("adminFifaRankingScore");
  if (score === null) {
    showMessage("adminFifaRankingStatus", "Inserisci un punteggio valido. Puoi usare la virgola o il punto.", true);
    return;
  }

  const payload = {
    teamId,
    score,
    notes: document.getElementById("adminFifaRankingNotes").value.trim(),
    updatedAt: serverTimestamp()
  };

  if (!payload.teamId) return;

  const id = existingId || `fifa_${makeIdPart(teamId)}`;

  try {
    showMessage("adminFifaRankingStatus", "Salvataggio...");
    await setDoc(doc(db, "fifaRankings", id), existingId ? payload : {
      ...payload,
      createdAt: serverTimestamp()
    }, { merge: true });
    showMessage("adminFifaRankingStatus", "FIFA Ranking salvato.");
    resetFifaRankingForm();
    await loadData();
  } catch (error) {
    console.error(error);
    showMessage("adminFifaRankingStatus", "Errore salvataggio FIFA Ranking.", true);
  }
}

function editStadium(id) {
  const stadium = state.raw.stadiums.find((item) => item.id === id);
  if (!stadium) return;

  expandAdminPanel("adminStadiumsPanel");
  document.getElementById("adminStadiumId").value = stadium.id;
  document.getElementById("adminStadiumSeasonTeamId").value = stadium.seasonTeamId || "";
  document.getElementById("adminStadiumName").value = stadium.name || "";
  document.getElementById("adminStadiumLevel").value = String(stadium.level ?? 0);
  document.getElementById("adminStadiumsPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function editCompetitionMatch(id) {
  const match = state.raw.competitionMatches.find((item) => item.id === id);
  if (!match) return;

  expandAdminPanel("adminCompetitionMatchesPanel");
  document.getElementById("adminCompetitionMatchId").value = match.id;
  document.getElementById("adminCompetitionMatchCompetitionId").value = match.competitionId || "";
  updateCompetitionMatchTeamOptions(match.homeSeasonTeamId || "", match.awaySeasonTeamId || "");
  document.getElementById("adminCompetitionMatchday").value = match.matchday || "";
  document.getElementById("adminCompetitionMatchDate").value = match.matchDate || "";
  document.getElementById("adminCompetitionMatchSerieAMatchday").value = match.serieAMatchday ?? match.realSerieAMatchday ?? match.serieAGiornata ?? "";
  document.getElementById("adminCompetitionMatchStatus").value = match.status || "DA_GIOCARE";
  document.getElementById("adminCompetitionMatchHomeGoals").value = match.homeGoals ?? "";
  document.getElementById("adminCompetitionMatchAwayGoals").value = match.awayGoals ?? "";
  document.getElementById("adminCompetitionMatchHomeScore").value = match.homeScore ?? "";
  document.getElementById("adminCompetitionMatchAwayScore").value = match.awayScore ?? "";
  document.getElementById("adminCompetitionMatchNotes").value = match.notes || "";
  document.getElementById("adminCompetitionMatchesPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function editFifaRanking(id) {
  const ranking = state.raw.fifaRankings.find((item) => item.id === id);
  if (!ranking) return;

  expandAdminPanel("adminFifaRankingPanel");
  document.getElementById("adminFifaRankingId").value = ranking.id;
  document.getElementById("adminFifaRankingTeamId").value = ranking.teamId || "";
  document.getElementById("adminFifaRankingScore").value = ranking.score ?? "";
  document.getElementById("adminFifaRankingNotes").value = ranking.notes || "";
  document.getElementById("adminFifaRankingPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetStadiumForm() {
  document.getElementById("adminStadiumForm")?.reset();
  const idInput = document.getElementById("adminStadiumId");
  if (idInput) idInput.value = "";
  const levelInput = document.getElementById("adminStadiumLevel");
  if (levelInput) levelInput.value = "0";
  showMessage("adminStadiumStatus", "");
}

function resetCompetitionMatchForm() {
  document.getElementById("adminCompetitionMatchesForm")?.reset();
  const idInput = document.getElementById("adminCompetitionMatchId");
  if (idInput) idInput.value = "";
  const statusInput = document.getElementById("adminCompetitionMatchStatus");
  if (statusInput) statusInput.value = "DA_GIOCARE";
  updateCompetitionMatchTeamOptions();
  showMessage("adminCompetitionMatchStatusText", "");
}

function resetFifaRankingForm() {
  document.getElementById("adminFifaRankingForm")?.reset();
  const idInput = document.getElementById("adminFifaRankingId");
  if (idInput) idInput.value = "";
  showMessage("adminFifaRankingStatus", "");
}


function editSeason(id) {
  const season = state.raw.seasons.find((item) => item.id === id);
  if (!season) return;

  expandAdminPanel("adminSeasonsPanel");
  document.getElementById("adminSeasonId").value = season.id;
  document.getElementById("adminSeasonId").readOnly = true;
  document.getElementById("adminSeasonName").value = season.name || "";
  document.getElementById("adminSeasonStartsOn").value = season.startsOn || "";
  document.getElementById("adminSeasonEndsOn").value = season.endsOn || "";
  document.getElementById("adminSeasonParticipantCount").value = season.participantCount || "";
  document.getElementById("adminSeasonIsCurrent").checked = Boolean(season.isCurrent);
  document.getElementById("adminSeasonsPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function editPresident(id) {
  const president = state.raw.presidents.find((item) => item.id === id);
  if (!president) return;

  expandAdminPanel("adminPresidentsPanel");
  document.getElementById("adminPresidentId").value = president.id;
  document.getElementById("adminPresidentName").value = president.name || "";
  document.getElementById("adminPresidentNotes").value = president.notes || "";
  document.getElementById("adminPresidentIsActive").checked = president.isActive !== false;
  document.getElementById("adminPresidentsPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function editTeam(id) {
  const team = state.raw.teams.find((item) => item.id === id);
  if (!team) return;

  expandAdminPanel("adminTeamsPanel");
  document.getElementById("adminTeamId").value = team.id;
  document.getElementById("adminTeamName").value = team.canonicalName || "";
  document.getElementById("adminTeamLogoValue").value = getLogoPathForInput(team.logo || "");
  document.getElementById("adminTeamRemoveLogo").checked = false;
  document.getElementById("adminTeamNotes").value = team.notes || "";
  document.getElementById("adminTeamIsCurrent").checked = team.isCurrent !== false;

  const selected = new Set(team.currentPresidentIds || []);
  Array.from(document.getElementById("adminTeamPresidentIds").options).forEach((option) => {
    option.selected = selected.has(option.value);
  });

  updateTeamLogoPreview();
  document.getElementById("adminTeamsPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function editSeasonTeam(id) {
  const seasonTeam = state.raw.seasonTeams.find((item) => item.id === id);
  if (!seasonTeam) return;

  expandAdminPanel("adminSeasonTeamsPanel");
  document.getElementById("adminSeasonTeamId").value = seasonTeam.id;
  document.getElementById("adminSeasonTeamSeasonId").value = seasonTeam.seasonId || getCurrentSeasonId();
  document.getElementById("adminSeasonTeamTeamId").value = seasonTeam.teamId || "";
  document.getElementById("adminSeasonTeamName").value = seasonTeam.name || "";
  document.getElementById("adminSeasonTeamLogoValue").value = getLogoPathForInput(seasonTeam.logo || "");
  document.getElementById("adminSeasonTeamRemoveLogo").checked = false;
  document.getElementById("adminSeasonTeamIsHistorical").checked = Boolean(seasonTeam.isHistorical);

  const selected = new Set(seasonTeam.presidentIds || []);
  Array.from(document.getElementById("adminSeasonTeamPresidentIds").options).forEach((option) => {
    option.selected = selected.has(option.value);
  });

  updateSeasonTeamLogoPreview();
  document.getElementById("adminSeasonTeamsPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function editCompetition(id) {
  const competition = state.raw.competitions.find((item) => item.id === id);
  if (!competition) return;

  expandAdminPanel("adminCompetitionsPanel");
  document.getElementById("adminCompetitionId").value = competition.id;
  document.getElementById("adminCompetitionSeasonId").value = competition.seasonId || getCurrentSeasonId();
  document.getElementById("adminCompetitionName").value = competition.name || "";
  document.getElementById("adminCompetitionType").value = competition.type || "ALTRO";
  document.getElementById("adminCompetitionFormat").value = competition.format || "CLASSIFICA";
  document.getElementById("adminCompetitionStatus").value = competition.status || "PROGRAMMATA";
  document.getElementById("adminCompetitionNotes").value = competition.notes || "";
  document.getElementById("adminCompetitionsPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetSeasonForm() {
  const form = document.getElementById("adminSeasonForm");
  form?.reset();
  const idInput = document.getElementById("adminSeasonId");
  if (idInput) idInput.readOnly = false;
  showMessage("adminSeasonStatus", "");
}

function resetPresidentForm() {
  document.getElementById("adminPresidentForm")?.reset();
  const idInput = document.getElementById("adminPresidentId");
  if (idInput) idInput.value = "";
  const activeInput = document.getElementById("adminPresidentIsActive");
  if (activeInput) activeInput.checked = true;
  showMessage("adminPresidentStatus", "");
}

function resetTeamForm() {
  document.getElementById("adminTeamForm")?.reset();
  const idInput = document.getElementById("adminTeamId");
  if (idInput) idInput.value = "";
  const activeInput = document.getElementById("adminTeamIsCurrent");
  if (activeInput) activeInput.checked = true;
  const logoInput = document.getElementById("adminTeamLogoValue");
  if (logoInput) logoInput.value = "";
  updateTeamLogoPreview();
  showMessage("adminTeamStatus", "");
}

function resetSeasonTeamForm() {
  document.getElementById("adminSeasonTeamForm")?.reset();
  const idInput = document.getElementById("adminSeasonTeamId");
  if (idInput) idInput.value = "";
  const logoInput = document.getElementById("adminSeasonTeamLogoValue");
  if (logoInput) logoInput.value = "";
  fillSeasonTeamDefaultsFromTeam({ force: true });
  updateSeasonTeamLogoPreview();
  showMessage("adminSeasonTeamStatus", "");
}

function resetCompetitionForm() {
  document.getElementById("adminCompetitionForm")?.reset();
  const idInput = document.getElementById("adminCompetitionId");
  if (idInput) idInput.value = "";
  const seasonInput = document.getElementById("adminCompetitionSeasonId");
  if (seasonInput) seasonInput.value = getCurrentSeasonId();
  const statusInput = document.getElementById("adminCompetitionStatus");
  if (statusInput) statusInput.value = "PROGRAMMATA";
  showMessage("adminCompetitionStatusText", "");
}



async function handleListoneConverterSubmit(event) {
  event.preventDefault();
  const file = document.getElementById("adminListoneFile")?.files?.[0];
  if (!file) return;

  try {
    showMessage("adminListoneConverterStatus", "Conversione in corso...");
    const XLSX = await loadXlsxLibrary();
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const rowsFromSheet = (name) => workbook.Sheets[name]
      ? XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: "" })
      : [];

    const activePlayers = parseListoneSheetRows(rowsFromSheet("Tutti"), "Tutti", "In listone", "IN_LISTONE");
    const asteriskPlayers = parseListoneSheetRows(rowsFromSheet("Ceduti"), "Ceduti", "asteriscato", "ASTERISCATO");
    const players = [...activePlayers, ...asteriskPlayers];

    const seasonId = document.getElementById("adminListoneSeasonId")?.value || getCurrentSeasonId();
    const loadedAt = document.getElementById("adminListoneDate")?.value || getTodayIsoDate();
    const label = document.getElementById("adminListoneLabel")?.value || `Listone ${loadedAt}`;
    const id = loadedAt;
    const payload = {
      meta: {
        id,
        seasonId,
        label,
        loadedAt,
        sourceFile: file.name,
        rows: players.length,
        activeRows: activePlayers.length,
        asteriskRows: asteriskPlayers.length,
        fields: LISTONE_COLUMNS.map((column) => column.key).concat(["fantacalcioId"])
      },
      players
    };

    downloadJson(payload, `${safeFileName(id)}.json`);
    const manifestEntry = {
      id,
      seasonId,
      label,
      loadedAt,
      file: `${safeFileName(id)}.json`,
      rows: players.length,
      activeRows: activePlayers.length,
      asteriskRows: asteriskPlayers.length
    };

    const report = document.getElementById("adminListoneConverterReport");
    if (report) {
      report.classList.remove("hidden");
      report.innerHTML = `
        <h3>JSON generato</h3>
        <p>Giocatori: <strong>${players.length}</strong> (${activePlayers.length} in listone, ${asteriskPlayers.length} asteriscati).</p>
        <p>Aggiungi il file scaricato in <code>static/zonaorientale/assets/listoni/</code> e aggiorna <code>manifest.json</code> con questa voce:</p>
        <pre>${escapeHtml(JSON.stringify(manifestEntry, null, 2))}</pre>`;
    }
    showMessage("adminListoneConverterStatus", "JSON scaricato.");
  } catch (error) {
    console.error(error);
    showMessage("adminListoneConverterStatus", error.message || "Errore durante la conversione.", true);
  }
}

async function downloadFirebaseBackup() {
  try {
    showMessage("adminBackupStatus", "Preparazione backup...");
    const collections = {};
    for (const collectionName of COLLECTIONS) {
      const snapshot = await getDocs(collection(db, collectionName));
      collections[collectionName] = snapshot.docs.map((documentSnapshot) => ({
        id: documentSnapshot.id,
        ...documentSnapshot.data()
      }));
    }
    downloadJson({ exportedAt: new Date().toISOString(), collections }, `zonaorientale-firebase-backup-${getTodayIsoDate()}.json`);
    showMessage("adminBackupStatus", "Backup scaricato.");
  } catch (error) {
    console.error(error);
    showMessage("adminBackupStatus", "Errore durante il backup Firebase.", true);
  }
}

async function deleteDocument(collectionName, id, label) {
  const confirmed = window.confirm(`Confermi eliminazione ${label}?`);
  if (!confirmed) return;

  try {
    await deleteDoc(doc(db, collectionName, id));
    await loadData();
  } catch (error) {
    console.error(error);
    setError(`Errore durante l'eliminazione di ${label}.`);
  }
}

function setupListoneEvents() {
  document.getElementById("listoneSeasonFilter")?.addEventListener("change", (event) => {
    state.selectedListoneId = event.target.value;
    renderListonePublic();
  });
  document.getElementById("listoneSearch")?.addEventListener("input", renderListonePublic);
  document.addEventListener("click", (event) => {
    const sortButton = event.target.closest("[data-listone-sort-key]");
    if (!sortButton) return;
    const key = sortButton.dataset.listoneSortKey;
    if (state.listoneSort.key === key) {
      state.listoneSort.direction = state.listoneSort.direction === "asc" ? "desc" : "asc";
    } else {
      state.listoneSort = { key, direction: "asc" };
    }
    renderListonePublic();
  });
  document.addEventListener("click", (event) => {
    const sortButton = event.target.closest("[data-free-agents-sort-key]");
    if (!sortButton) return;
    const key = sortButton.dataset.freeAgentsSortKey;
    if (state.freeAgentsSort.key === key) {
      state.freeAgentsSort.direction = state.freeAgentsSort.direction === "asc" ? "desc" : "asc";
    } else {
      state.freeAgentsSort = { key, direction: "asc" };
    }
    renderListonePublic();
  });
  document.addEventListener("change", (event) => {
    if (event.target.closest("[data-listone-status-filter], [data-listone-role-filter]")) {
      renderListonePublic();
    }
  });
  document.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-listone-column]");
    if (!checkbox) return;
    const key = checkbox.dataset.listoneColumn;
    if (checkbox.checked) state.hiddenListoneColumns.delete(key);
    else state.hiddenListoneColumns.add(key);
    renderListonePublic();
  });
}

function setupClubRosterEvents() {
  document.getElementById("marketClubFilter")?.addEventListener("change", (event) => {
    state.selectedClubRosterFilter = event.target.value;
    renderClubRostersPublic();
  });
  document.getElementById("marketSearch")?.addEventListener("input", renderClubRostersPublic);
}

function setupSeasonSelectorEvents() {
  const handleChange = (event) => {
    state.selectedSeasonId = event.target.value;
    renderSeasonSelectors();
    renderDashboard();
    renderTeamsTable();
    renderClubRostersPublic();
    renderCompetitionsPublic();
    renderStadiumsPublic();
    state.selectedListoneId = "";
    renderListonePublic();
  };

  ["globalSeasonSelect"].forEach((id) => {
    const select = document.getElementById(id);
    select?.addEventListener("change", handleChange);
  });
}


/* V18 - Dynamic rosters and FM movements.
   Listone snapshots stay as static files; mutable rosters and FM balances live in Firestore. */
if (!COLLECTIONS.includes("rosterEntries")) COLLECTIONS.push("rosterEntries");
if (!COLLECTIONS.includes("fmMovements")) COLLECTIONS.push("fmMovements");
if (!ADMIN_PANEL_IDS.includes("adminRosterMovementsPanel")) ADMIN_PANEL_IDS.push("adminRosterMovementsPanel");
if (state.collapsedAdminPanels && typeof state.collapsedAdminPanels.add === "function") {
  state.collapsedAdminPanels.add("adminRosterMovementsPanel");
}
state.expandedRosterClubIds = state.expandedRosterClubIds || new Set();
state.selectedAdminRosterSeasonId = state.selectedAdminRosterSeasonId || "";

function hasFirebaseRostersForSeason(seasonId) {
  return (state.raw.rosterEntries || []).some((entry) => entry.seasonId === seasonId && entry.status !== "REMOVED");
}

function getActiveRosterEntriesForSeasonTeam(seasonTeamId) {
  const seasonTeam = getSeasonTeamById(seasonTeamId);
  const seasonId = seasonTeam?.seasonId || getCurrentSeasonId();
  const firebaseEntries = (state.raw.rosterEntries || [])
    .filter((entry) => entry.seasonId === seasonId && entry.seasonTeamId === seasonTeamId && entry.status !== "REMOVED")
    .sort((a, b) => String(a.playerName || "").localeCompare(String(b.playerName || ""), "it"));

  if (firebaseEntries.length) {
    return firebaseEntries;
  }

  const staticRoster = getStaticRosterForSeasonTeam(seasonTeam);
  return mapStaticRosterPlayers(staticRoster, seasonId, seasonTeamId);
}

function getStaticRosterForSeasonTeam(seasonTeam) {
  const snapshot = getRosterSnapshotForSeason(seasonTeam?.seasonId || getCurrentSeasonId());
  if (!snapshot || !seasonTeam) return null;

  const targetKeys = new Set(getRosterAliasKeys(seasonTeam));
  if (!targetKeys.size) return null;

  return snapshot.rosters.find((roster) => {
    const rosterKeys = [normalizeKey(roster.name), normalizeRosterKey(roster.name)].filter(Boolean);
    return rosterKeys.some((key) => targetKeys.has(key));
  }) || null;
}

getRosterForSeasonTeam = function getRosterForSeasonTeamV18(seasonTeam) {
  if (!seasonTeam) return null;
  const players = getActiveRosterEntriesForSeasonTeam(seasonTeam.id);
  return {
    id: seasonTeam.id,
    name: seasonTeam.name,
    playerCount: players.length,
    players
  };
};

buildRosterPlayerIndex = function buildRosterPlayerIndexV18(seasonId = getCurrentSeasonId()) {
  const index = new Map();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  seasonTeams.forEach((seasonTeam) => {
    const roster = getRosterForSeasonTeam(seasonTeam);
    (roster?.players || []).forEach((player) => {
      index.set(normalizePlayerName(player.playerName), {
        ...player,
        fantasyRoster: seasonTeam.name || getSeasonTeamDisplayName(seasonTeam.id),
        rosterRole: player.rosterRole || player.role || player.classicRole || "",
        rosterCost: player.cost ?? player.rosterCost ?? ""
      });
    });
  });
  return index;
};

function getFmMovementsForSeasonTeam(seasonTeamId) {
  const seasonTeam = getSeasonTeamById(seasonTeamId);
  const seasonId = seasonTeam?.seasonId || getCurrentSeasonId();
  return (state.raw.fmMovements || [])
    .filter((movement) => movement.seasonId === seasonId && movement.seasonTeamId === seasonTeamId)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""), "it"));
}

function getTeamFmBalance(seasonTeamId) {
  return getFmMovementsForSeasonTeam(seasonTeamId)
    .reduce((sum, movement) => sum + Number(movement.amount || 0), 0);
}

function getSeasonFmStats(seasonId) {
  const teams = getSeasonTeamsForSeason(seasonId);
  const balances = teams.map((seasonTeam) => getTeamFmBalance(seasonTeam.id));
  const total = balances.reduce((sum, value) => sum + value, 0);
  const average = balances.length ? total / balances.length : 0;
  return { total, average };
}




function getRosterSortValue(player, key) {
  if (!player) return "";
  if (key === "role") return getRosterRoleSortValue(player);
  if (key === "playerName") return String(player.playerName || "");
  if (key === "realTeam") return String(player.realTeam || "");
  if (key === "quotationCurrent") return Number(getRosterPlayerQuotationCurrent(player) || 0);
  if (key === "cost") return Number(player.cost || 0);
  return String(player[key] || "");
}

function getRosterRoleDisplay(player) {
  const role = String(player.rosterRole || player.classicRole || player.role || "-").trim() || "-";
  const listonePlayer = player?.mantraRoles ? null : findListonePlayerForRosterPlayer(player);
  const mantra = String(player.mantraRoles || listonePlayer?.mantraRoles || listonePlayer?.mantra_roles || "").trim();
  return `${escapeHtml(role)}${mantra ? ` <span class="muted role-extra">(${escapeHtml(mantra)})</span>` : ""}`;
}

function findListonePlayerForRosterPlayer(player) {
  const name = normalizePlayerName(player?.playerName || player?.name || "");
  if (!name) return null;
  const listone = getCurrentListone?.();
  return (listone?.players || []).find((item) => normalizePlayerName(item.playerName) === name) || null;
}

function getRosterPlayerQuotationCurrent(player) {
  const direct = player?.quotationCurrent ?? player?.quotation_current ?? player?.qtA ?? player?.qta;
  if (direct !== undefined && direct !== null && direct !== "") return direct;
  const listonePlayer = findListonePlayerForRosterPlayer(player);
  return listonePlayer?.quotationCurrent ?? listonePlayer?.quotation_current ?? "";
}

function renderPresidentStack(namesText) {
  const names = String(namesText || "")
    .split(/,|&| e /i)
    .map((name) => name.trim())
    .filter(Boolean);
  if (!names.length) return "-";
  return `<span class="president-stack">${names.map((name, index) => `<span class="president-stack-item">${escapeHtml(name)}${index < names.length - 1 ? `<span class="president-comma">, </span>` : ""}</span>`).join("")}</span>`;
}

function sortRosterPlayersForDisplay(players) {
  const key = state.rosterSort?.key || "role";
  const direction = state.rosterSort?.direction === "desc" ? -1 : 1;
  return [...players].sort((a, b) => {
    let valueA = getRosterSortValue(a, key);
    let valueB = getRosterSortValue(b, key);
    let diff;
    if (typeof valueA === "number" || typeof valueB === "number") diff = Number(valueA || 0) - Number(valueB || 0);
    else diff = String(valueA || "").localeCompare(String(valueB || ""), "it", { sensitivity: "base", numeric: true });
    if (diff) return direction * diff;
    return String(a.playerName || "").localeCompare(String(b.playerName || ""), "it", { sensitivity: "base" });
  });
}

function renderRosterSortButton(key, label, numeric = false) {
  const active = state.rosterSort?.key === key;
  const indicator = active ? (state.rosterSort.direction === "asc" ? " ▲" : " ▼") : "";
  return `<button class="table-sort" type="button" data-roster-sort-key="${escapeHtml(key)}">${escapeHtml(label)}${indicator}</button>`;
}

function renderRosterPlayerTable(players) {
  if (!players.length) return `<p class="muted">Nessun giocatore in rosa.</p>`;
  return `
    <div class="table-wrap mobile-tabular-wrap roster-table-wrap roster-inline-table-wrap">
      <table class="mobile-tabular roster-main-table roster-player-table">
        <thead>
          <tr>
            <th class="roster-col-player">${renderRosterSortButton("playerName", "Giocatore")}</th>
            <th class="roster-col-role">${renderRosterSortButton("role", "R (RM)")}</th>
            <th class="roster-col-team">${renderRosterSortButton("realTeam", "Sq")}</th>
            <th class="number roster-col-cost">${renderRosterSortButton("cost", "Costo", true)}</th>
            <th class="number roster-col-qta">${renderRosterSortButton("quotationCurrent", "Qt.A", true)}</th>
          </tr>
        </thead>
        <tbody>
          ${sortRosterPlayersForDisplay(players).map((player) => `
            <tr>
              <td data-label="Giocatore" class="roster-col-player"><strong>${escapeHtml(player.playerName || "-")}</strong></td>
              <td data-label="R (RM)" class="roster-col-role">${getRosterRoleDisplay(player)}</td>
              <td data-label="Sq" class="roster-col-team">${escapeHtml(player.realTeam || "-")}</td>
              <td data-label="Costo" class="number roster-col-cost">${escapeHtml(player.cost ?? "-")}</td>
              <td data-label="Qt.A" class="number roster-col-qta">${formatListoneNumber(getRosterPlayerQuotationCurrent(player))}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

renderTeamsTable = function renderTeamsTableV23() {
  const cards = document.getElementById("rosterClubCards");
  const legacyTableBody = document.getElementById("clubsTableBody");
  const seasonId = getCurrentSeasonId();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const { teamsById } = buildMaps();

  if (!cards && !legacyTableBody) return;

  if (!seasonTeams.length) {
    const empty = `<p class="muted">Nessuna squadra associata a ${escapeHtml(seasonId || "questa stagione")}.</p>`;
    if (cards) cards.innerHTML = empty;
    if (legacyTableBody) legacyTableBody.innerHTML = `<tr><td colspan="7" class="muted center">Nessuna squadra associata a ${escapeHtml(seasonId || "questa stagione")}.</td></tr>`;
    return;
  }

  if (cards) {
    cards.classList.add("roster-table-container");
    cards.innerHTML = `
      <div class="table-wrap mobile-tabular-wrap roster-season-table-wrap">
        <table class="mobile-tabular roster-season-table">
          <thead>
            <tr>
              <th>Rosa</th>
              <th>Presidenti</th>
              <th class="number">FM</th>
              <th class="number">Gioc.</th>
              <th>Stadio</th>
              <th>Azione</th>
            </tr>
          </thead>
          <tbody>
            ${seasonTeams.map((seasonTeam) => {
              const team = teamsById.get(seasonTeam.teamId);
              const roster = getRosterForSeasonTeam(seasonTeam);
              const stadium = getStadiumForSeasonTeam(seasonTeam.id);
              const balance = getTeamFmBalance(seasonTeam.id);
              const isExpanded = state.expandedRosterClubIds.has(seasonTeam.id);
              const displayName = seasonTeam.name || getTeamDisplayName(team);
              return `
                <tr class="roster-team-row ${isExpanded ? "is-expanded" : ""}">
                  <td data-label="Rosa" class="roster-team-name">${renderSeasonTeamNameWithLogo(seasonTeam.id)}</td>
                  <td data-label="Presidenti">${renderPresidentStack(getSeasonTeamPresidentNames(seasonTeam))}</td>
                  <td data-label="FM" class="number"><strong>${escapeHtml(formatFm(balance))}</strong></td>
                  <td data-label="Gioc." class="number">${escapeHtml(roster?.playerCount ?? 0)}</td>
                  <td data-label="Stadio">${escapeHtml(formatStadium(stadium))}</td>
                  <td data-label="Azione"><button class="button button-secondary button-small" type="button" data-toggle-roster-club="${escapeHtml(seasonTeam.id)}" aria-expanded="${isExpanded ? "true" : "false"}">${isExpanded ? "Riduci" : "Ingrandisci"}</button></td>
                </tr>
                ${isExpanded ? `<tr class="roster-detail-row">
                  <td colspan="6">${renderRosterPlayerTable(roster?.players || [])}</td>
                </tr>` : ""}`;
            }).join("")}
          </tbody>
        </table>
      </div>`;
  }

  if (legacyTableBody) {
    legacyTableBody.innerHTML = seasonTeams.map((seasonTeam, index) => {
      const team = teamsById.get(seasonTeam.teamId);
      const displayName = seasonTeam.name || getTeamDisplayName(team);
      const balance = getTeamFmBalance(seasonTeam.id);
      const roster = getRosterForSeasonTeam(seasonTeam);
      return `
        <tr>
          <td data-label="#">${index + 1}</td>
          <td data-label="Club">${renderSeasonTeamNameWithLogo(seasonTeam.id)}</td>
          <td data-label="Presidente">${escapeHtml(getSeasonTeamPresidentNames(seasonTeam))}</td>
          <td data-label="Saldo FM" class="number">${escapeHtml(formatFm(balance))}</td>
          <td data-label="Rosa" class="number">${escapeHtml(roster?.playerCount ?? 0)}</td>
          <td data-label="Stadio" class="number">${escapeHtml(formatStadium(getStadiumForSeasonTeam(seasonTeam.id)))}</td>
          <td data-label="Stato"><span class="status ${seasonTeam.isHistorical ? "status-muted" : "status-ok"}">${seasonTeam.isHistorical ? "Storica" : "Partecipante"}</span></td>
        </tr>`;
    }).join("");
  }
};

renderClubRostersPublic = function renderClubRostersPublicV18() {
  const tableBody = document.getElementById("marketActivityTableBody");
  const clubFilter = document.getElementById("marketClubFilter");
  const searchInput = document.getElementById("marketSearch");
  if (!tableBody) return;

  const seasonId = getCurrentSeasonId();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const selectedClub = state.selectedClubRosterFilter || clubFilter?.value || "all";
  const searchTerm = normalizeKey(searchInput?.value || "");

  if (clubFilter) {
    const currentValue = selectedClub;
    clubFilter.innerHTML = `<option value="all">Tutte le rose</option>${seasonTeams.map((seasonTeam) => `<option value="${escapeHtml(seasonTeam.id)}">${escapeHtml(seasonTeam.name || seasonTeam.id)}</option>`).join("")}`;
    clubFilter.value = seasonTeams.some((seasonTeam) => seasonTeam.id === currentValue) ? currentValue : "all";
  }

  const movements = (state.raw.fmMovements || [])
    .filter((movement) => movement.seasonId === seasonId)
    .filter((movement) => selectedClub === "all" || movement.seasonTeamId === selectedClub || movement.targetSeasonTeamId === selectedClub)
    .filter((movement) => {
      if (!searchTerm) return true;
      return normalizeKey([
        getSeasonTeamDisplayName(movement.seasonTeamId),
        getSeasonTeamDisplayName(movement.targetSeasonTeamId),
        getFmMovementLabel(movement.type),
        movement.playerName,
        movement.description
      ].join(" ")).includes(searchTerm);
    })
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""), "it"));

  if (!movements.length) {
    tableBody.innerHTML = `<tr><td colspan="6" class="muted center">Nessun movimento FM per questa stagione.</td></tr>`;
    return;
  }

  tableBody.innerHTML = movements.map((movement) => `
    <tr>
      <td data-label="Data">${escapeHtml(movement.date || "-")}</td>
      <td data-label="Rosa">${renderSeasonTeamNameWithLogo(movement.seasonTeamId, { strong: false })}</td>
      <td data-label="Tipo"><span class="status status-muted">${escapeHtml(getFmMovementLabel(movement.type))}</span></td>
      <td data-label="Giocatore">${escapeHtml(movement.playerName || "-")}${movement.targetSeasonTeamId ? `<small class="muted"> → ${escapeHtml(getSeasonTeamDisplayName(movement.targetSeasonTeamId))}</small>` : ""}</td>
      <td data-label="FM" class="number ${Number(movement.amount || 0) >= 0 ? "text-success" : "text-danger"}"><strong>${escapeHtml(formatFm(movement.amount))}</strong></td>
      <td data-label="Note">${escapeHtml(movement.description || "-")}</td>
    </tr>`).join("");
};

function getPlayersForAdminMovement(seasonId, seasonTeamId) {
  if (!seasonTeamId) return [];
  const roster = getRosterForSeasonTeam({ id: seasonTeamId, seasonId });
  return sortRosterPlayersForDisplay(roster?.players || []);
}

function renderRosterMovementsAdminPanel() {
  if (!state.selectedAdminRosterSeasonId) state.selectedAdminRosterSeasonId = getCurrentSeasonId();
  const selectedSeasonId = getValidSeasonSelection("selectedAdminRosterSeasonId") || getCurrentSeasonId();
  const seasonOptions = state.raw.seasons.map((season) => `<option value="${escapeHtml(season.id)}" ${season.id === selectedSeasonId ? "selected" : ""}>${escapeHtml(season.name || season.id)}</option>`).join("");
  const seasonTeams = getSeasonTeamsForSeason(selectedSeasonId);
  if (!state.selectedAdminMovementSeasonTeamId || !seasonTeams.some((seasonTeam) => seasonTeam.id === state.selectedAdminMovementSeasonTeamId)) {
    state.selectedAdminMovementSeasonTeamId = seasonTeams[0]?.id || "";
  }
  const selectedSeasonTeamId = state.selectedAdminMovementSeasonTeamId;
  const teamOptions = seasonTeams.map((seasonTeam) => `<option value="${escapeHtml(seasonTeam.id)}" ${seasonTeam.id === selectedSeasonTeamId ? "selected" : ""}>${escapeHtml(seasonTeam.name || seasonTeam.id)}</option>`).join("");
  const movementOptions = FM_MOVEMENT_TYPES.map((type) => `<option value="${escapeHtml(type.value)}">${escapeHtml(type.label)}</option>`).join("");
  const rosterPlayers = getPlayersForAdminMovement(selectedSeasonId, selectedSeasonTeamId);
  const playerOptions = rosterPlayers.map((player) => `<option value="${escapeHtml(player.playerName || "")}"></option>`).join("");
  const movements = (state.raw.fmMovements || [])
    .filter((movement) => movement.seasonId === selectedSeasonId)
    .filter((movement) => !selectedSeasonTeamId || movement.seasonTeamId === selectedSeasonTeamId || movement.targetSeasonTeamId === selectedSeasonTeamId)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""), "it"));
  const rosterEntryCount = (state.raw.rosterEntries || []).filter((entry) => entry.seasonId === selectedSeasonId && (!selectedSeasonTeamId || entry.seasonTeamId === selectedSeasonTeamId) && entry.status !== "REMOVED").length;

  const movementRows = movements.map((movement) => `
    <div class="admin-list-item">
      <span>
        <strong>${escapeHtml(movement.date || "-")} · ${escapeHtml(getFmMovementLabel(movement.type))} · ${escapeHtml(formatFm(movement.amount))}</strong>
        <small>${escapeHtml(getSeasonTeamDisplayName(movement.seasonTeamId))}${movement.targetSeasonTeamId ? ` → ${escapeHtml(getSeasonTeamDisplayName(movement.targetSeasonTeamId))}` : ""}${movement.playerName ? ` · ${escapeHtml(movement.playerName)}` : ""}${movement.description ? ` · ${escapeHtml(movement.description)}` : ""}</small>
      </span>
      <span>
        <button class="button button-danger button-small" type="button" data-admin-delete-fm-movement="${escapeHtml(movement.id)}">Elimina</button>
      </span>
    </div>`).join("") || `<p class="muted admin-empty-message">Nessun movimento FM per la rosa selezionata.</p>`;

  return renderAdminPanel("adminRosterMovementsPanel", "Firebase", "Rose e movimenti FM", "Gestisci rose modificabili, acquisti, vendite, svincoli, scambi e saldi fantamilioni.", `
    <form id="adminImportStaticRostersForm" class="form-grid">
      <label>
        Stagione
        <select id="adminRosterMovementSeasonId" class="input" required>${seasonOptions}</select>
      </label>
      <div class="form-actions">
        <button class="button button-secondary" type="submit">Inizializza rose dal file statico</button>
        <span id="adminImportStaticRostersStatus" class="form-status"></span>
      </div>
      <small class="field-hint span-2">Usalo una sola volta per portare le rose Excel statiche in Firebase. Dopo, le modifiche avvengono tramite movimenti.</small>
    </form>

    <hr class="soft-separator" />

    <form id="adminFmMovementForm" class="form-grid">
      <label>
        Stagione
        <select id="adminFmMovementSeasonId" class="input" required>${seasonOptions}</select>
      </label>
      <label>
        Rosa
        <select id="adminFmMovementSeasonTeamId" class="input" required>${teamOptions}</select>
      </label>
      <label>
        Tipo movimento
        <select id="adminFmMovementType" class="input" required>${movementOptions}</select>
      </label>
      <label>
        Data
        <input id="adminFmMovementDate" class="input" type="date" value="${escapeHtml(getTodayIsoDate())}" />
      </label>
      <label class="movement-player-field">
        Giocatore
        <input id="adminFmMovementPlayerName" class="input" type="text" placeholder="Nome giocatore" list="adminRosterPlayers" autocomplete="off" />
      </label>
      <label class="movement-player-field">
        Squadra reale
        <input id="adminFmMovementRealTeam" class="input" type="text" placeholder="Es. NAP" />
      </label>
      <label class="movement-player-field">
        Ruolo
        <input id="adminFmMovementRole" class="input" type="text" placeholder="Es. A oppure Pc" />
      </label>
      <label class="movement-target-field">
        Rosa destinazione
        <select id="adminFmMovementTargetSeasonTeamId" class="input">
          <option value="">Nessuna</option>${teamOptions}
        </select>
      </label>
      <label>
        FM
        <input id="adminFmMovementAmount" class="input" type="text" inputmode="decimal" placeholder="Es. 50 oppure -12,5" />
        <small class="field-hint">Acquisto/penalità vengono salvati come uscita se inserisci un valore positivo.</small>
      </label>
      <label class="span-2">
        Note
        <input id="adminFmMovementDescription" class="input" type="text" placeholder="Descrizione movimento" />
      </label>
      <datalist id="adminRosterPlayers">${playerOptions}</datalist>
      <div class="form-actions span-2">
        <button class="button button-primary" type="submit">Salva movimento</button>
        <span id="adminFmMovementStatus" class="form-status"></span>
      </div>
    </form>

    <details class="admin-edit-section" open>
      <summary><strong>Movimenti della rosa selezionata</strong><span>${movements.length} movimenti · ${rosterEntryCount} giocatori in rosa</span></summary>
      <div class="admin-list">${movementRows}</div>
    </details>
  `);
}

const renderAdminAreaV17 = renderAdminArea;
renderAdminArea = function renderAdminAreaV18() {
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;
  if (!state.isAdmin) {
    adminPanel.innerHTML = `
      <div class="page-heading">
        <div>
          <p class="eyebrow">Area riservata</p>
          <h2 id="adminTitle">Admin</h2>
          <p>Accedi come amministratore per modificare stagioni, presidenti, rose, movimenti, competizioni e risultati.</p>
        </div>
      </div>`;
    return;
  }

  adminPanel.innerHTML = `
    <div class="page-heading">
      <div>
        <p class="eyebrow">Area riservata</p>
        <h2 id="adminTitle">Admin</h2>
        <p>Gestione Firebase: stagioni, squadre, rose modificabili, movimenti FM, competizioni e risultati.</p>
      </div>
    </div>
    ${renderSeasonAdminPanel()}
    ${renderPresidentAdminPanel()}
    ${renderTeamAdminPanel()}
    ${renderSeasonTeamAdminPanel()}
    ${renderRosterMovementsAdminPanel()}
    ${renderStadiumAdminPanel()}
    ${renderCompetitionAdminPanel()}
    ${renderCompetitionMatchesAdminPanel()}
    ${renderCompetitionResultsAdminPanel()}
    ${renderFifaRankingAdminPanel()}
    ${renderListoneToolsAdminPanel()}
    ${renderPublicSnapshotsAdminPanel()}
    ${renderBackupAdminPanel()}
  `;
  attachAdminHandlers();
};

async function importStaticRostersToFirebase(event) {
  event.preventDefault();
  const seasonId = document.getElementById("adminRosterMovementSeasonId")?.value || getCurrentSeasonId();
  const snapshot = getRosterSnapshotForSeason(seasonId);
  if (!snapshot) {
    showMessage("adminImportStaticRostersStatus", "Nessun file rose statico disponibile per questa stagione.", true);
    return;
  }

  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  let imported = 0;
  let skipped = 0;
  showMessage("adminImportStaticRostersStatus", "Import in corso...");

  for (const roster of snapshot.rosters || []) {
    const seasonTeam = seasonTeams.find((item) => normalizeKey(item.name) === normalizeKey(roster.name));
    if (!seasonTeam) {
      skipped += (roster.players || []).length;
      continue;
    }

    for (const player of roster.players || []) {
      const docId = `${makeIdPart(seasonId)}_${makeIdPart(seasonTeam.id)}_${makeIdPart(player.playerName)}`;
      await setDoc(doc(db, "rosterEntries", docId), {
        seasonId,
        seasonTeamId: seasonTeam.id,
        playerName: player.playerName || "",
        realTeam: player.realTeam || "",
        rosterRole: player.role || player.rosterRole || "",
        classicRole: player.role || player.classicRole || "",
        mantraRoles: player.mantraRoles || "",
        cost: player.cost ?? "",
        status: "ACTIVE",
        source: "static-roster-import",
        createdAt: serverTimestamp()
      }, { merge: true });
      imported += 1;
    }
  }

  showMessage("adminImportStaticRostersStatus", `Import completato: ${imported} giocatori importati, ${skipped} non associati.`);
  await loadData();
  expandAdminPanel("adminRosterMovementsPanel");
}

function findRosterEntryForPlayer(seasonId, seasonTeamId, playerName) {
  const target = normalizePlayerName(playerName);
  return (state.raw.rosterEntries || []).find((entry) =>
    entry.seasonId === seasonId &&
    entry.seasonTeamId === seasonTeamId &&
    entry.status !== "REMOVED" &&
    normalizePlayerName(entry.playerName) === target
  ) || null;
}

async function applyRosterSideEffectForMovement(payload) {
  const type = payload.type;
  const playerName = payload.playerName;
  if (!playerName) return;

  if (type === "ACQUISTO") {
    const docId = `${makeIdPart(payload.seasonId)}_${makeIdPart(payload.seasonTeamId)}_${makeIdPart(playerName)}`;
    await setDoc(doc(db, "rosterEntries", docId), {
      seasonId: payload.seasonId,
      seasonTeamId: payload.seasonTeamId,
      playerName,
      realTeam: payload.realTeam || "",
      rosterRole: payload.rosterRole || "",
      classicRole: payload.rosterRole || "",
      mantraRoles: payload.mantraRoles || "",
      cost: Math.abs(Number(payload.amount || 0)),
      status: "ACTIVE",
      source: "movement-acquisto",
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });
    return;
  }

  const existing = findRosterEntryForPlayer(payload.seasonId, payload.seasonTeamId, playerName);
  if (!existing) return;

  if (type === "VENDITA" || type === "SVINCOLO") {
    await setDoc(doc(db, "rosterEntries", existing.id), {
      ...existing,
      status: "REMOVED",
      removedAt: serverTimestamp(),
      removedByMovementType: type
    }, { merge: true });
  }

  if (type === "SCAMBIO" && payload.targetSeasonTeamId) {
    await setDoc(doc(db, "rosterEntries", existing.id), {
      ...existing,
      seasonTeamId: payload.targetSeasonTeamId,
      updatedAt: serverTimestamp(),
      source: "movement-scambio"
    }, { merge: true });
  }
}

async function saveFmMovement(event) {
  event.preventDefault();
  try {
    const seasonId = document.getElementById("adminFmMovementSeasonId")?.value || getCurrentSeasonId();
    const seasonTeamId = document.getElementById("adminFmMovementSeasonTeamId")?.value || "";
    const type = document.getElementById("adminFmMovementType")?.value || "ALTRO";
    let amount = parseDecimalValue(document.getElementById("adminFmMovementAmount")?.value || "0") || 0;
    if (["ACQUISTO", "PENALITA"].includes(type) && amount > 0) amount = -amount;
    if (["VENDITA", "SVINCOLO", "BONUS", "INITIAL_BUDGET"].includes(type) && amount < 0) amount = Math.abs(amount);

    const payload = {
      seasonId,
      seasonTeamId,
      targetSeasonTeamId: document.getElementById("adminFmMovementTargetSeasonTeamId")?.value || "",
      type,
      date: document.getElementById("adminFmMovementDate")?.value || getTodayIsoDate(),
      amount,
      playerName: document.getElementById("adminFmMovementPlayerName")?.value.trim() || "",
      realTeam: abbreviateRealTeam(document.getElementById("adminFmMovementRealTeam")?.value || ""),
      rosterRole: document.getElementById("adminFmMovementRole")?.value.trim() || "",
      mantraRoles: document.getElementById("adminFmMovementRole")?.value.trim() || "",
      description: document.getElementById("adminFmMovementDescription")?.value.trim() || "",
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, "fmMovements"), payload);
    await applyRosterSideEffectForMovement(payload);
    showMessage("adminFmMovementStatus", "Movimento salvato.");
    await loadData();
    expandAdminPanel("adminRosterMovementsPanel");
  } catch (error) {
    console.error(error);
    showMessage("adminFmMovementStatus", "Errore durante il salvataggio del movimento.", true);
  }
}

function updateMovementFieldVisibility() {
  const type = document.getElementById("adminFmMovementType")?.value || "ALTRO";
  const spec = FM_MOVEMENT_TYPES.find((item) => item.value === type) || {};
  document.querySelectorAll(".movement-player-field").forEach((element) => element.classList.toggle("hidden", !spec.player));
  document.querySelectorAll(".movement-target-field").forEach((element) => element.classList.toggle("hidden", !spec.target));
}


function updateAdminMovementPlayerFields() {
  const seasonId = document.getElementById("adminFmMovementSeasonId")?.value || getCurrentSeasonId();
  const seasonTeamId = document.getElementById("adminFmMovementSeasonTeamId")?.value || state.selectedAdminMovementSeasonTeamId || "";
  const playerName = document.getElementById("adminFmMovementPlayerName")?.value || "";
  const target = normalizePlayerName(playerName);
  if (!target) return;
  const rosterPlayers = getPlayersForAdminMovement(seasonId, seasonTeamId);
  const rosterPlayer = rosterPlayers.find((player) => normalizePlayerName(player.playerName) === target);
  const listonePlayer = getCurrentListone()?.players?.find((player) => normalizePlayerName(player.playerName) === target);
  const player = rosterPlayer || listonePlayer;
  if (!player) return;
  const realTeamInput = document.getElementById("adminFmMovementRealTeam");
  const roleInput = document.getElementById("adminFmMovementRole");
  if (realTeamInput) realTeamInput.value = abbreviateRealTeam(player.realTeam || realTeamInput.value || "");
  if (roleInput) roleInput.value = player.rosterRole || player.classicRole || player.role || player.mantraRoles || roleInput.value || "";
}

const attachAdminHandlersV17 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV18() {
  attachAdminHandlersV17();
  document.getElementById("adminImportStaticRostersForm")?.addEventListener("submit", importStaticRostersToFirebase);
  document.getElementById("adminFmMovementForm")?.addEventListener("submit", saveFmMovement);
  document.getElementById("adminFmMovementType")?.addEventListener("change", updateMovementFieldVisibility);
  document.getElementById("adminRosterMovementSeasonId")?.addEventListener("change", (event) => {
    state.selectedAdminRosterSeasonId = event.target.value;
    renderAdminArea();
  });
  document.getElementById("adminFmMovementSeasonId")?.addEventListener("change", (event) => {
    state.selectedAdminRosterSeasonId = event.target.value;
    state.selectedAdminMovementSeasonTeamId = "";
    renderAdminArea();
  });
  document.getElementById("adminFmMovementSeasonTeamId")?.addEventListener("change", (event) => {
    state.selectedAdminMovementSeasonTeamId = event.target.value;
    renderAdminArea();
  });
  document.getElementById("adminFmMovementPlayerName")?.addEventListener("input", updateAdminMovementPlayerFields);
  document.getElementById("adminFmMovementPlayerName")?.addEventListener("change", updateAdminMovementPlayerFields);
  document.querySelectorAll("[data-admin-delete-fm-movement]").forEach((button) => {
    button.addEventListener("click", () => deleteDocument("fmMovements", button.dataset.adminDeleteFmMovement, "movimento FM"));
  });
  updateMovementFieldVisibility();
};

setupClubRosterEvents = function setupClubRosterEventsV18() {
  document.getElementById("marketClubFilter")?.addEventListener("change", (event) => {
    state.selectedClubRosterFilter = event.target.value;
    renderClubRostersPublic();
  });
  document.getElementById("marketSearch")?.addEventListener("input", renderClubRostersPublic);
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-toggle-roster-club]");
    if (!button) return;
    const id = button.dataset.toggleRosterClub;
    if (state.expandedRosterClubIds.has(id)) state.expandedRosterClubIds.delete(id);
    else state.expandedRosterClubIds.add(id);
    renderTeamsTable();
  });
};

const renderDashboardV17 = renderDashboard;
renderDashboard = function renderDashboardV18() {
  renderDashboardV17();
  const seasonId = getCurrentSeasonId();
  const stats = getSeasonFmStats(seasonId);
  const metricTotalFm = document.getElementById("metricTotalFm");
  if (metricTotalFm) metricTotalFm.textContent = `${formatFm(stats.total)} (medio ${formatFm(stats.average)})`;
};

async function initializeAppUi() {
  setupNavigation();
  setupMobileNavigation();
  setupAuth();
  setupSeasonSelectorEvents();
  setupListoneEvents();
  setupClubRosterEvents();
  updateAdminVisibility();

  const loginHelpText = document.querySelector("#loginDialog .muted");
  if (loginHelpText) loginHelpText.textContent = "Accedi con l'utente creato in Firebase Authentication.";

  try {
    await loadData();
    setError("");
  } catch (error) {
    console.error(error);
    const code = error?.code ? `${error.code} - ` : "";
    const message = error?.message || String(error);
    setError(`Non riesco a leggere Firestore. ${code}${message}`);
  }
}


const updateMobileUxClassBase = updateMobileUxClass;
updateMobileUxClass = function updateMobileUxClassV23() {
  const displayMode = localStorage.getItem("zonaOrientaleDisplayMode") || "auto";
  const isMobileLike = window.matchMedia("(max-width: 900px), (hover: none) and (pointer: coarse)").matches;
  document.body.classList.toggle("is-mobile-ux", displayMode !== "desktop" && isMobileLike);
  document.body.classList.toggle("is-desktop-forced", displayMode === "desktop");
  const toggleButtons = document.querySelectorAll("[data-display-mode-toggle]");
  toggleButtons.forEach((button) => {
    button.textContent = displayMode === "desktop" ? "Passa a vista mobile" : "Passa a vista desktop";
  });
};

function injectDisplayModeToggle() {
  const sheet = document.getElementById("mobileMoreSheet");
  if (sheet && !sheet.querySelector("[data-display-mode-toggle]")) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mobile-more-link display-mode-toggle";
    button.dataset.displayModeToggle = "true";
    button.textContent = "Passa a vista desktop";
    sheet.appendChild(button);
  }

  if (!document.getElementById("floatingDisplayModeToggle")) {
    const floating = document.createElement("button");
    floating.id = "floatingDisplayModeToggle";
    floating.type = "button";
    floating.className = "display-mode-floating";
    floating.dataset.displayModeToggle = "true";
    floating.textContent = "Passa a vista mobile";
    document.body.appendChild(floating);
  }

  document.querySelectorAll("[data-display-mode-toggle]").forEach((button) => {
    if (button.dataset.boundDisplayModeToggle) return;
    button.dataset.boundDisplayModeToggle = "true";
    button.addEventListener("click", () => {
      const current = localStorage.getItem("zonaOrientaleDisplayMode") || "auto";
      localStorage.setItem("zonaOrientaleDisplayMode", current === "desktop" ? "auto" : "desktop");
      closeMobileMoreMenu();
      updateMobileUxClass();
    });
  });
  updateMobileUxClass();
}

document.addEventListener("click", (event) => {
  const rosterSortButton = event.target.closest("[data-roster-sort-key]");
  if (rosterSortButton) {
    const key = rosterSortButton.dataset.rosterSortKey;
    if (state.rosterSort.key === key) {
      state.rosterSort.direction = state.rosterSort.direction === "asc" ? "desc" : "asc";
    } else {
      state.rosterSort = { key, direction: "asc" };
    }
    renderTeamsTable();
  }
});



/* V33 - Compact honor snapshot avoids Firestore 1 MiB document limit.
   V32 - Public Firestore snapshots to reduce reads.
   Public pages can read lightweight snapshots:
   - publicSeasonSnapshots/{seasonId}: Dashboard, competitions, stadiums, rosters/movements summaries.
   - publicSnapshots/honor: Albo d'Oro, palmares and FIFA Ranking.
   Admin still loads granular collections for editing. */
if (!ADMIN_PANEL_IDS.includes("adminPublicSnapshotsPanel")) ADMIN_PANEL_IDS.push("adminPublicSnapshotsPanel");
if (state.collapsedAdminPanels && typeof state.collapsedAdminPanels.add === "function") {
  state.collapsedAdminPanels.add("adminPublicSnapshotsPanel");
}
state.publicSeasonSnapshots = state.publicSeasonSnapshots || {};
state.publicHonorSnapshot = state.publicHonorSnapshot || null;
state.hasFullData = Boolean(state.hasFullData);
state.usedPublicSnapshots = false;

function makeEmptyRawDataV32() {
  const raw = Object.fromEntries(COLLECTIONS.map((name) => [name, []]));
  raw.leagueSettings = raw.leagueSettings || [];
  raw.seasons = raw.seasons || [];
  raw.presidents = raw.presidents || [];
  raw.teams = raw.teams || [];
  raw.seasonTeams = raw.seasonTeams || [];
  raw.stadiums = raw.stadiums || [];
  raw.competitions = raw.competitions || [];
  raw.competitionMatches = raw.competitionMatches || [];
  raw.competitionResults = raw.competitionResults || [];
  raw.honorRoll = raw.honorRoll || [];
  raw.fifaRankings = raw.fifaRankings || [];
  raw.rosterEntries = raw.rosterEntries || [];
  raw.fmMovements = raw.fmMovements || [];
  return raw;
}

async function getDocumentIfExistsV32(collectionName, documentId) {
  try {
    const snapshot = await getDoc(doc(db, collectionName, documentId));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    const code = error?.code ? `${error.code}: ` : "";
    error.message = `Errore lettura documento ${collectionName}/${documentId}. ${code}${error.message || error}`;
    throw error;
  }
}

async function loadPublicSeasonSnapshotV32(seasonId) {
  if (!seasonId) return null;
  if (state.publicSeasonSnapshots[seasonId]) return state.publicSeasonSnapshots[seasonId];
  const snapshot = await getDocumentIfExistsV32("publicSeasonSnapshots", seasonId);
  if (snapshot) state.publicSeasonSnapshots[seasonId] = snapshot;
  return snapshot;
}

async function loadPublicHonorSnapshotV32() {
  if (state.publicHonorSnapshot) return state.publicHonorSnapshot;
  const snapshot = await getDocumentIfExistsV32("publicSnapshots", "honor");
  if (snapshot) state.publicHonorSnapshot = snapshot;
  return snapshot;
}

function applyPublicSeasonSnapshotV32(snapshot) {
  if (!snapshot) return false;
  state.raw.presidents = Array.isArray(snapshot.presidents) ? snapshot.presidents : [];
  state.raw.teams = Array.isArray(snapshot.teams) ? snapshot.teams : [];
  state.raw.seasonTeams = Array.isArray(snapshot.seasonTeams) ? snapshot.seasonTeams : [];
  state.raw.stadiums = Array.isArray(snapshot.stadiums) ? snapshot.stadiums : [];
  state.raw.competitions = Array.isArray(snapshot.competitions) ? snapshot.competitions : [];
  state.raw.competitionMatches = Array.isArray(snapshot.competitionMatches) ? snapshot.competitionMatches : [];
  state.raw.competitionResults = Array.isArray(snapshot.competitionResults) ? snapshot.competitionResults : [];
  state.raw.rosterEntries = Array.isArray(snapshot.rosterEntries) ? snapshot.rosterEntries : [];
  state.raw.fmMovements = Array.isArray(snapshot.fmMovements) ? snapshot.fmMovements : [];
  state.raw.fifaRankings = [];
  state.raw.honorRoll = [];
  state.usedPublicSnapshots = true;
  return true;
}

async function loadFullDataV32(options = {}) {
  const { render = true } = options;
  const entries = await Promise.all(
    COLLECTIONS.map(async (name) => [name, await loadCollection(name)])
  );
  state.raw = Object.assign(makeEmptyRawDataV32(), Object.fromEntries(entries));
  state.hasFullData = true;
  state.usedPublicSnapshots = false;
  await loadListoniData();
  await loadRostersData();
  sortData();
  if (render) renderAll();
}

async function loadPublicDataV32() {
  state.raw = makeEmptyRawDataV32();
  state.raw.leagueSettings = await loadCollection("leagueSettings");
  state.raw.seasons = await loadCollection("seasons");

  if (!state.selectedSeasonId) state.selectedSeasonId = getDefaultSeasonId();
  const seasonId = getCurrentSeasonId();
  const seasonSnapshot = await loadPublicSeasonSnapshotV32(seasonId);
  const honorSnapshot = await loadPublicHonorSnapshotV32();

  if (!seasonSnapshot || !honorSnapshot) {
    console.warn("Snapshot pubblici mancanti: uso lettura completa Firestore come fallback.");
    await loadFullDataV32({ render: false });
  } else {
    applyPublicSeasonSnapshotV32(seasonSnapshot);
    state.publicHonorSnapshot = honorSnapshot;
    state.hasFullData = false;
    await loadListoniData();
    await loadRostersData();
    sortData();
  }
  renderAll();
}

loadData = async function loadDataV32() {
  if (state.isAdmin) {
    await loadFullDataV32({ render: true });
    return;
  }
  await loadPublicDataV32();
};

setupSeasonSelectorEvents = function setupSeasonSelectorEventsV32() {
  const handleChange = async (event) => {
    state.selectedSeasonId = event.target.value;
    state.selectedListoneId = "";
    if (!state.hasFullData && !state.isAdmin) {
      const snapshot = await loadPublicSeasonSnapshotV32(state.selectedSeasonId);
      if (snapshot) {
        applyPublicSeasonSnapshotV32(snapshot);
        await loadListoniData();
        await loadRostersData();
        sortData();
        renderAll();
        return;
      }
      await loadFullDataV32({ render: true });
      return;
    }
    renderAll();
  };

  ["globalSeasonSelect"].forEach((id) => {
    const select = document.getElementById(id);
    select?.addEventListener("change", (event) => {
      handleChange(event).catch((error) => {
        console.error(error);
        setError(`Cambio stagione non riuscito. ${error?.message || error}`);
      });
    });
  });
};

setupAuth = function setupAuthV32() {
  const openLoginBtn = document.getElementById("openLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginDialog = document.getElementById("loginDialog");
  const loginForm = document.getElementById("loginForm");
  const closeLoginBtn = document.getElementById("closeLoginBtn");

  openLoginBtn?.addEventListener("click", () => {
    if (loginDialog?.showModal) loginDialog.showModal();
  });

  closeLoginBtn?.addEventListener("click", () => loginDialog?.close());

  logoutBtn?.addEventListener("click", async () => {
    await signOut(auth);
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;
    showMessage("loginStatus", "Accesso in corso...");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      loginDialog?.close();
      loginForm.reset();
    } catch (error) {
      console.error(error);
      showMessage("loginStatus", "Login non riuscito. Controlla email e password.", true);
    }
  });

  onAuthStateChanged(auth, async (user) => {
    state.user = user;
    state.isAdmin = false;

    if (user) {
      try {
        const adminSnapshot = await getDoc(doc(db, "admins", user.uid));
        state.isAdmin = adminSnapshot.exists();
        if (!state.isAdmin) {
          showMessage("loginStatus", `Utente autenticato ma non presente nella raccolta admins. UID: ${user.uid}`, true);
        }
      } catch (error) {
        console.error(error);
        const code = error?.code ? `${error.code}: ` : "";
        showMessage("loginStatus", `Login riuscito, ma controllo admin fallito. ${code}${error.message || error}`, true);
      }
    }

    updateAdminVisibility();

    if (state.isAdmin && !state.hasFullData) {
      try {
        await loadFullDataV32({ render: true });
      } catch (error) {
        console.error(error);
        setError(`Non riesco a caricare i dati admin. ${error?.message || error}`);
      }
    } else if (!state.isAdmin && state.hasFullData) {
      state.hasFullData = false;
      await loadPublicDataV32();
    } else {
      renderAdminArea();
    }
  });
};

function getSnapshotRosterEntriesForSeasonTeamV37(seasonTeam) {
  if (!seasonTeam) return [];
  const seasonId = seasonTeam.seasonId || getCurrentSeasonId();
  const seasonTeamId = seasonTeam.id;
  const firebaseEntries = (state.raw.rosterEntries || [])
    .filter((entry) => entry.seasonId === seasonId && entry.seasonTeamId === seasonTeamId && entry.status !== "REMOVED")
    .map((entry) => ({ ...entry, source: entry.source || "firebase-roster" }));

  if (firebaseEntries.length) return firebaseEntries;

  const staticRoster = getStaticRosterForSeasonTeam(seasonTeam);
  return mapStaticRosterPlayers(staticRoster, seasonId, seasonTeamId);
}

function buildPublicSeasonSnapshotV32(seasonId) {
  const seasonTeams = state.raw.seasonTeams.filter((item) => item.seasonId === seasonId);
  const seasonTeamIds = new Set(seasonTeams.map((item) => item.id));
  const teamIds = new Set(seasonTeams.map((item) => item.teamId).filter(Boolean));
  const presidentIds = new Set();
  seasonTeams.forEach((item) => (item.presidentIds || []).forEach((id) => presidentIds.add(id)));

  const competitions = state.raw.competitions.filter((item) => item.seasonId === seasonId);
  const competitionIds = new Set(competitions.map((item) => item.id));

  const stadiums = state.raw.stadiums.filter((item) => seasonTeamIds.has(item.seasonTeamId));
  const competitionMatches = state.raw.competitionMatches.filter((item) => competitionIds.has(item.competitionId));
  const competitionResults = state.raw.competitionResults.filter((item) => competitionIds.has(item.competitionId));
  const rosterEntries = seasonTeams.flatMap((seasonTeam) => getSnapshotRosterEntriesForSeasonTeamV37(seasonTeam));
  const fmMovements = (state.raw.fmMovements || []).filter((item) => item.seasonId === seasonId);

  rosterEntries.forEach((item) => {
    if (item.seasonTeamId) seasonTeamIds.add(item.seasonTeamId);
  });
  fmMovements.forEach((item) => {
    if (item.seasonTeamId) seasonTeamIds.add(item.seasonTeamId);
  });

  return {
    id: seasonId,
    seasonId,
    generatedAt: new Date().toISOString(),
    teams: state.raw.teams.filter((item) => teamIds.has(item.id)),
    presidents: state.raw.presidents.filter((item) => presidentIds.has(item.id)),
    seasonTeams,
    stadiums,
    competitions,
    competitionMatches,
    competitionResults,
    rosterEntries,
    fmMovements,
    metrics: {
      clubs: seasonTeams.length || getParticipantsCount(seasonId),
      fm: getSeasonFmStats(seasonId)
    }
  };
}

function compactLogoForSnapshotV33(logo) {
  const logoPath = normalizeLogoPath(logo);
  if (!logoPath || logoPath.length > 5000) return "";
  return logoPath;
}

function buildHonorTeamCellV32(seasonId, competitionType, seasonTeamId) {
  if (seasonTeamId) {
    const seasonTeam = getSeasonTeamById(seasonTeamId);
    return {
      kind: "team",
      seasonTeamId,
      teamId: seasonTeam?.teamId || "",
      label: getSeasonTeamDisplayName(seasonTeamId),
      logo: compactLogoForSnapshotV33(getSeasonTeamLogo(seasonTeam))
    };
  }
  if (isCompetitionNotDisputed(seasonId, competitionType)) {
    return { kind: "status", status: "NON_DISPUTATA", label: "Non disputata" };
  }
  return { kind: "empty", label: "-" };
}

function buildHonorSnapshotV32() {
  const { teamsById } = buildMaps();
  const palmares = buildPalmares();
  const palmaresWithLogos = Object.fromEntries(Object.entries(palmares).map(([type, items]) => [
    type,
    items.map((item) => {
      const team = teamsById.get(item.teamId);
      return { ...item, logo: compactLogoForSnapshotV33(team?.logo || "") };
    })
  ]));

  return {
    id: "honor",
    generatedAt: new Date().toISOString(),
    honorRows: state.raw.seasons.map((season) => {
      const honor = getHonorRollRow(season.id) || {};
      return {
        seasonId: season.id,
        seasonLabel: formatSeasonShortLabel(season),
        championItaly: buildHonorTeamCellV32(season.id, "CAMPIONATO", honor.championItalySeasonTeamId),
        secondPlace: buildHonorTeamCellV32(season.id, "CAMPIONATO", honor.secondPlaceSeasonTeamId),
        thirdPlace: buildHonorTeamCellV32(season.id, "CAMPIONATO", honor.thirdPlaceSeasonTeamId),
        coppaItalia: buildHonorTeamCellV32(season.id, "COPPA_ITALIA", honor.coppaItaliaWinnerSeasonTeamId),
        championsLeague: buildHonorTeamCellV32(season.id, "CHAMPIONS_LEAGUE", honor.championsLeagueWinnerSeasonTeamId),
        playoff: buildHonorTeamCellV32(season.id, "PLAYOFF", honor.playoffWinnerSeasonTeamId)
      };
    }),
    palmares: palmaresWithLogos,
    fifaRanking: buildFifaRanking().map((item) => ({
      teamId: item.teamId,
      teamName: item.teamName,
      points: item.score,
      position: item.position,
      logo: compactLogoForSnapshotV33(item.team?.logo || "")
    }))
  };
}

async function savePublicSnapshotsV32(event) {
  event?.preventDefault?.();
  try {
    showMessage("adminPublicSnapshotsStatus", "Generazione snapshot in corso...");
    if (!state.hasFullData) await loadFullDataV32({ render: false });

    for (const season of state.raw.seasons) {
      const snapshot = buildPublicSeasonSnapshotV32(season.id);
      await setDoc(doc(db, "publicSeasonSnapshots", season.id), snapshot);
      state.publicSeasonSnapshots[season.id] = snapshot;
    }

    const honorSnapshot = buildHonorSnapshotV32();
    const honorSize = new Blob([JSON.stringify(honorSnapshot)]).size;
    if (honorSize > 900000) {
      throw new Error(`Snapshot Albo d'Oro ancora troppo grande (${Math.round(honorSize / 1024)} KB). Riduci loghi base64 o genera snapshot divisi.`);
    }
    await setDoc(doc(db, "publicSnapshots", "honor"), honorSnapshot);
    state.publicHonorSnapshot = honorSnapshot;

    showMessage("adminPublicSnapshotsStatus", `Snapshot pubblici aggiornati: ${state.raw.seasons.length} stagioni + albo d'oro compatto (${Math.round(honorSize / 1024)} KB).`);
    renderAdminArea();
  } catch (error) {
    console.error(error);
    showMessage("adminPublicSnapshotsStatus", `Errore snapshot: ${error?.message || error}`, true);
  }
}

function renderPublicSnapshotsAdminPanel() {
  const generated = state.publicHonorSnapshot?.generatedAt || "-";
  return renderAdminPanel("adminPublicSnapshotsPanel", "Ottimizzazione", "Snapshot pubblici", "Genera documenti leggeri per ridurre le letture Firebase del sito pubblico.", `
    <div class="form-actions">
      <button id="adminGeneratePublicSnapshots" class="button button-primary" type="button">Aggiorna snapshot pubblici</button>
      <span id="adminPublicSnapshotsStatus" class="form-status"></span>
    </div>
    <small class="field-hint">Crea/aggiorna publicSeasonSnapshots/{stagione} e publicSnapshots/honor. Ultimo honor snapshot caricato: ${escapeHtml(generated)}.</small>
  `);
}

function renderHonorSnapshotCellV32(cell) {
  if (!cell || cell.kind === "empty") return "-";
  if (cell.kind === "status") return `<span class="status status-muted">${escapeHtml(cell.label || "Non disputata")}</span>`;
  if (cell.kind === "team") return `<span class="club-name-with-logo">${renderTeamLogo(cell.label, cell.logo)}<strong>${escapeHtml(cell.label || "-")}</strong></span>`;
  return escapeHtml(cell.label || "-");
}

const renderHonorSummaryBeforeV32 = renderHonorSummary;
renderHonorSummary = function renderHonorSummaryV32() {
  const target = document.getElementById("honorSummary");
  if (!target) return;
  const snapshot = state.publicHonorSnapshot;
  if (!snapshot || state.hasFullData) {
    return renderHonorSummaryBeforeV32();
  }

  const rows = (snapshot.honorRows || []).map((row) => `
    <tr>
      <td data-label="Stagione"><strong>${escapeHtml(row.seasonLabel || row.seasonId || "-")}</strong></td>
      <td data-label="Campione">${renderHonorSnapshotCellV32(row.championItaly)}</td>
      <td data-label="2° posto">${renderHonorSnapshotCellV32(row.secondPlace)}</td>
      <td data-label="3° posto">${renderHonorSnapshotCellV32(row.thirdPlace)}</td>
      <td data-label="Coppa Italia">${renderHonorSnapshotCellV32(row.coppaItalia)}</td>
      <td data-label="Champions">${renderHonorSnapshotCellV32(row.championsLeague)}</td>
      <td data-label="Playoff">${renderHonorSnapshotCellV32(row.playoff)}</td>
    </tr>`).join("");

  const palmaresHtml = Object.entries(snapshot.palmares || {})
    .filter(([type]) => type !== "PLAYOFF")
    .map(([type, items]) => {
      const body = (items || []).map((item, index) => `
        <tr>
          <td data-label="#" class="number">${index + 1}</td>
          <td data-label="Squadra"><span class="club-name-with-logo">${renderTeamLogo(item.teamName, item.logo)}<strong>${escapeHtml(item.teamName || "-")}</strong></span></td>
          <td data-label="Titoli" class="number"><strong>${escapeHtml(item.wins ?? 0)}</strong></td>
        </tr>`).join("") || `<tr><td colspan="3" class="muted center">Nessun vincitore ancora inserito.</td></tr>`;
      return `
        <div class="compact-card palmares-competition-card">
          <div class="compact-card-header">
            <div>
              <h3>${escapeHtml(getLabel(COMPETITION_TYPES, type))}</h3>
              <p class="muted">Titoli vinti per squadra</p>
            </div>
          </div>
          <div class="table-wrap palmares-table-wrap">
            <table class="palmares-table">
              <thead><tr><th class="number">#</th><th>Squadra</th><th class="number">Titoli</th></tr></thead>
              <tbody>${body}</tbody>
            </table>
          </div>
        </div>`;
    }).join("");

  const rankingRows = (snapshot.fifaRanking || []).map((item) => `
    <tr>
      <td data-label="#">${escapeHtml(item.position || "")}</td>
      <td data-label="Squadra"><span class="club-name-with-logo">${renderTeamLogo(item.teamName, item.logo)}<strong>${escapeHtml(item.teamName || "-")}</strong></span></td>
      <td data-label="Punteggio" class="number"><strong>${escapeHtml(item.points ?? "-")}</strong></td>
    </tr>`).join("") || `<tr><td colspan="3" class="muted center">Nessun punteggio FIFA inserito.</td></tr>`;

  target.innerHTML = `
    <div class="table-wrap honor-table-wrap">
      <table>
        <thead><tr><th>Stagione</th><th>Campione d'Italia</th><th>2°</th><th>3°</th><th>Coppa Italia</th><th>Champions</th><th>Playoff</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="7" class="muted center">Nessuna stagione inserita.</td></tr>`}</tbody>
      </table>
    </div>
    <div class="detail-section">
      <h3>Palmarès per competizione</h3>
      <div class="palmares-grid">${palmaresHtml}</div>
    </div>
    <div class="detail-section">
      <h3>FIFA Ranking</h3>
      <div class="table-wrap fifa-ranking-table-wrap">
        <table>
          <thead><tr><th>#</th><th>Squadra</th><th class="number">Punteggio</th></tr></thead>
          <tbody>${rankingRows}</tbody>
        </table>
      </div>
    </div>`;
};

const attachAdminHandlersBeforeV32 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV32() {
  attachAdminHandlersBeforeV32();
  document.getElementById("adminGeneratePublicSnapshots")?.addEventListener("click", savePublicSnapshotsV32);
};


/* V34 - snapshot-first public site, president registration/approval, team requests and team profile pages. */
["news", "pendingUsers", "teamUsers", "teamRequests", "publicTeamSnapshots"].forEach((name) => {
  if (!COLLECTIONS.includes(name)) COLLECTIONS.push(name);
});
["adminPendingUsersPanel", "adminTeamRequestsPanel"].forEach((panelId) => {
  if (!ADMIN_PANEL_IDS.includes(panelId)) ADMIN_PANEL_IDS.push(panelId);
  state.collapsedAdminPanels?.add?.(panelId);
});
state.currentTeamUser = null;
state.currentPendingUser = null;
state.teamSnapshotCache = state.teamSnapshotCache || {};
state.teamProfileSeasonTeamId = "";
state.publicSnapshotsRequired = true;

function makeEmptyRawDataV34() {
  const raw = makeEmptyRawDataV32();
  raw.news = raw.news || [];
  raw.pendingUsers = raw.pendingUsers || [];
  raw.teamUsers = raw.teamUsers || [];
  raw.teamRequests = raw.teamRequests || [];
  raw.publicTeamSnapshots = raw.publicTeamSnapshots || [];
  return raw;
}

function getApprovedTeamUser() {
  return state.currentTeamUser?.status === "ACTIVE" ? state.currentTeamUser : null;
}

function getCurrentUserDisplayName() {
  return state.user?.displayName || state.currentTeamUser?.displayName || state.currentPendingUser?.displayName || state.user?.email || "Utente";
}

function isEmailPasswordUserV34(user = state.user) {
  return Boolean(user?.providerData?.some((provider) => provider.providerId === "password"));
}

function ensureV34Dom() {
  const desktopNav = document.querySelector(".app-nav");
  if (desktopNav && !desktopNav.querySelector('[data-page-link="teamarea"]')) {
    const link = document.createElement("a");
    link.href = "#teamarea";
    link.className = "nav-link nav-link-team-area hidden";
    link.dataset.pageLink = "teamarea";
    link.textContent = "Area squadra";
    const adminLink = desktopNav.querySelector("#adminNavLink");
    desktopNav.insertBefore(link, adminLink || null);
  }

  const mobileSheet = document.getElementById("mobileMoreSheet");
  if (mobileSheet && !mobileSheet.querySelector('[data-page-link="teamarea"]')) {
    const link = document.createElement("a");
    link.href = "#teamarea";
    link.className = "mobile-more-link nav-link-team-area hidden";
    link.dataset.pageLink = "teamarea";
    link.textContent = "Area squadra";
    const adminLink = mobileSheet.querySelector('[data-page-link="admin"]');
    mobileSheet.insertBefore(link, adminLink || null);
  }

  const main = document.querySelector("main.app-main");
  const adminPanel = document.getElementById("adminPanel");
  if (main && !document.querySelector('[data-page="teamarea"]')) {
    const section = document.createElement("section");
    section.className = "app-page";
    section.dataset.page = "teamarea";
    section.setAttribute("aria-labelledby", "teamAreaTitle");
    section.innerHTML = `
      <div class="page-heading">
        <div>
          <p class="eyebrow">Presidente</p>
          <h2 id="teamAreaTitle">Area squadra</h2>
          <p>Richieste operative, comunicati e movimenti proposti dal presidente approvato.</p>
        </div>
      </div>
      <div id="teamAreaBody"><p class="muted">Accedi per usare l'area squadra.</p></div>`;
    main.insertBefore(section, adminPanel || null);
  }

  if (!document.getElementById("teamProfileDialog")) {
    const dialog = document.createElement("dialog");
    dialog.id = "teamProfileDialog";
    dialog.className = "login-dialog team-profile-dialog";
    dialog.innerHTML = `
      <div class="login-card team-profile-card">
        <button id="closeTeamProfileBtn" class="dialog-close" type="button" aria-label="Chiudi">×</button>
        <p class="eyebrow">Scheda squadra</p>
        <h2 id="teamProfileTitle">Squadra</h2>
        <div id="teamProfileBody" class="team-profile-body"><p class="muted">Caricamento...</p></div>
      </div>`;
    document.body.appendChild(dialog);
    document.getElementById("closeTeamProfileBtn")?.addEventListener("click", () => dialog.close());
  }

  enhanceLoginDialogV34();
}

function enhanceLoginDialogV34() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm || loginForm.dataset.v34Enhanced) return;
  loginForm.dataset.v34Enhanced = "true";
  const passwordLabel = document.getElementById("loginPassword")?.closest("label");
  if (passwordLabel) {
    passwordLabel.insertAdjacentHTML("beforebegin", `
      <label>
        Nome visualizzato <span class="muted">(solo registrazione)</span>
        <input id="registerDisplayName" class="input" type="text" autocomplete="name" placeholder="Es. Mario Rossi" />
      </label>`);
  }
  const submitButton = loginForm.querySelector('button[type="submit"]');
  submitButton?.insertAdjacentHTML("afterend", `
    <button id="registerEmailBtn" class="button button-secondary full-width" type="button">Registrati con email</button>
    <button id="sendVerificationAgainBtn" class="button button-secondary full-width" type="button">Invia di nuovo verifica email</button>
    <button id="loginGoogleBtn" class="button button-secondary full-width" type="button">Accedi con Google</button>
    <small class="field-hint">Gli utenti presidenti vengono approvati dall'admin prima di poter inviare richieste squadra.</small>`);
}

function updateUserVisibilityV34() {
  const approved = Boolean(getApprovedTeamUser());
  document.querySelectorAll(".nav-link-team-area").forEach((link) => link.classList.toggle("hidden", !approved));
  const openLoginBtn = document.getElementById("openLoginBtn");
  if (openLoginBtn && !state.isAdmin) {
    openLoginBtn.textContent = state.user ? "Account" : "Accedi / Registrati";
    openLoginBtn.classList.remove("hidden");
  }
  renderUserAreaV34();
}

async function upsertPendingUserV34(user, status = "PENDING") {
  if (!user?.uid) return;
  const payload = {
    email: user.email || "",
    displayName: user.displayName || document.getElementById("registerDisplayName")?.value.trim() || user.email || "",
    status,
    providerIds: (user.providerData || []).map((provider) => provider.providerId),
    emailVerified: Boolean(user.emailVerified),
    updatedAt: serverTimestamp()
  };
  const existing = await getDoc(doc(db, "pendingUsers", user.uid)).catch(() => null);
  if (!existing?.exists?.()) payload.createdAt = serverTimestamp();
  await setDoc(doc(db, "pendingUsers", user.uid), payload, { merge: true });
  state.currentPendingUser = { id: user.uid, ...payload, updatedAt: new Date().toISOString() };
}

setupAuth = function setupAuthV34() {
  ensureV34Dom();
  const openLoginBtn = document.getElementById("openLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginDialog = document.getElementById("loginDialog");
  const loginForm = document.getElementById("loginForm");
  const closeLoginBtn = document.getElementById("closeLoginBtn");

  openLoginBtn?.addEventListener("click", () => {
    if (loginDialog?.showModal) loginDialog.showModal();
  });
  closeLoginBtn?.addEventListener("click", () => loginDialog?.close());
  logoutBtn?.addEventListener("click", async () => signOut(auth));

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;
    showMessage("loginStatus", "Accesso in corso...");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      loginDialog?.close();
    } catch (error) {
      console.error(error);
      showMessage("loginStatus", "Login non riuscito. Controlla email e password.", true);
    }
  });

  document.getElementById("registerEmailBtn")?.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;
    const displayName = document.getElementById("registerDisplayName")?.value.trim() || email;
    if (!email || !password) {
      showMessage("loginStatus", "Inserisci email e password per registrarti.", true);
      return;
    }
    try {
      showMessage("loginStatus", "Registrazione in corso...");
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) await updateProfile(credential.user, { displayName });
      await sendEmailVerification(credential.user);
      await upsertPendingUserV34(credential.user, "EMAIL_NOT_VERIFIED");
      showMessage("loginStatus", "Registrazione completata. Controlla la mail e verifica l'indirizzo prima dell'approvazione admin.");
    } catch (error) {
      console.error(error);
      showMessage("loginStatus", error?.message || "Registrazione non riuscita.", true);
    }
  });

  document.getElementById("sendVerificationAgainBtn")?.addEventListener("click", async () => {
    try {
      if (!auth.currentUser) {
        showMessage("loginStatus", "Accedi prima di richiedere una nuova verifica.", true);
        return;
      }
      await sendEmailVerification(auth.currentUser);
      showMessage("loginStatus", "Email di verifica inviata nuovamente.");
    } catch (error) {
      console.error(error);
      showMessage("loginStatus", "Non riesco a inviare la verifica email.", true);
    }
  });

  document.getElementById("loginGoogleBtn")?.addEventListener("click", async () => {
    try {
      showMessage("loginStatus", "Accesso Google in corso...");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await upsertPendingUserV34(result.user, "PENDING");
      loginDialog?.close();
    } catch (error) {
      console.error(error);
      showMessage("loginStatus", error?.message || "Accesso Google non riuscito.", true);
    }
  });

  onAuthStateChanged(auth, async (user) => {
    state.user = user;
    state.isAdmin = false;
    state.currentTeamUser = null;
    state.currentPendingUser = null;

    if (user) {
      try {
        try {
          const adminSnapshot = await getDoc(doc(db, "admins", user.uid));
          state.isAdmin = adminSnapshot.exists();
        } catch (adminError) {
          // Gli utenti presidente non hanno necessariamente un documento admins/{uid}.
          // Se la lettura viene negata dalle rules, non deve bloccare il controllo account.
          if (adminError?.code === "permission-denied") {
            state.isAdmin = false;
          } else {
            throw adminError;
          }
        }

        if (!state.isAdmin) {
          const teamSnapshot = await getDoc(doc(db, "teamUsers", user.uid)).catch(() => null);
          if (teamSnapshot?.exists?.()) state.currentTeamUser = { id: teamSnapshot.id, ...teamSnapshot.data() };

          const pendingSnapshot = await getDoc(doc(db, "pendingUsers", user.uid)).catch(() => null);
          if (pendingSnapshot?.exists?.()) state.currentPendingUser = { id: pendingSnapshot.id, ...pendingSnapshot.data() };

          if (!state.currentTeamUser && !state.currentPendingUser) {
            if (isEmailPasswordUserV34(user) && !user.emailVerified) await upsertPendingUserV34(user, "EMAIL_NOT_VERIFIED");
            else await upsertPendingUserV34(user, "PENDING");
          } else if (state.currentPendingUser?.status === "EMAIL_NOT_VERIFIED" && user.emailVerified) {
            await upsertPendingUserV34(user, "PENDING");
          }
        }
      } catch (error) {
        console.error(error);
        showMessage("loginStatus", `Controllo account fallito. ${error?.message || error}`, true);
      }
    }

    updateAdminVisibility();
    updateUserVisibilityV34();

    if (state.isAdmin && !state.hasFullData) {
      try {
        await loadFullDataV32({ render: true });
      } catch (error) {
        console.error(error);
        setError(`Non riesco a caricare i dati admin. ${error?.message || error}`);
      }
    } else if (!state.isAdmin && state.hasFullData) {
      state.hasFullData = false;
      await loadPublicDataV34();
    } else {
      renderAdminArea();
      renderUserAreaV34();
    }
  });
};

const updateAdminVisibilityBeforeV34 = updateAdminVisibility;
updateAdminVisibility = function updateAdminVisibilityV34() {
  updateAdminVisibilityBeforeV34();
  updateUserVisibilityV34();
};

async function loadPublicDataV34() {
  state.raw = makeEmptyRawDataV34();
  state.raw.leagueSettings = await loadCollection("leagueSettings");
  state.raw.seasons = await loadCollection("seasons");
  if (!state.selectedSeasonId) state.selectedSeasonId = getDefaultSeasonId();

  const seasonId = getCurrentSeasonId();
  const seasonSnapshot = await loadPublicSeasonSnapshotV32(seasonId);
  const honorSnapshot = await loadPublicHonorSnapshotV32();
  await loadListoniData();
  await loadRostersData();

  if (!seasonSnapshot || !honorSnapshot) {
    state.usedPublicSnapshots = false;
    sortData();
    renderAll();
    setError(`Snapshot pubblici mancanti per ${seasonId}. Accedi come admin e aggiorna gli snapshot pubblici.`);
    return;
  }

  applyPublicSeasonSnapshotV32(seasonSnapshot);
  state.raw.news = Array.isArray(seasonSnapshot.news) ? seasonSnapshot.news : [];
  mergeStaticCompetitionCalendarsForSeasonV101(seasonId);
  state.publicHonorSnapshot = honorSnapshot;
  state.hasFullData = false;
  sortData();
  renderAll();
  setError("");
}

loadData = async function loadDataV34() {
  if (state.isAdmin) return loadFullDataV32({ render: true });
  return loadPublicDataV34();
};

setupSeasonSelectorEvents = function setupSeasonSelectorEventsV34() {
  const handleChange = async (event) => {
    state.selectedSeasonId = event.target.value;
    state.selectedListoneId = "";
    if (!state.hasFullData && !state.isAdmin) {
      const snapshot = await loadPublicSeasonSnapshotV32(state.selectedSeasonId);
      await loadListoniData();
      await loadRostersData();
      if (snapshot) {
        applyPublicSeasonSnapshotV32(snapshot);
        state.raw.news = Array.isArray(snapshot.news) ? snapshot.news : [];
        sortData();
        renderAll();
        setError("");
      } else {
        state.raw = makeEmptyRawDataV34();
        state.raw.leagueSettings = await loadCollection("leagueSettings");
        state.raw.seasons = await loadCollection("seasons");
        sortData();
        renderAll();
        setError(`Snapshot pubblico mancante per ${state.selectedSeasonId}.`);
      }
      return;
    }
    renderAll();
  };
  document.getElementById("globalSeasonSelect")?.addEventListener("change", (event) => {
    handleChange(event).catch((error) => {
      console.error(error);
      setError(`Cambio stagione non riuscito. ${error?.message || error}`);
    });
  });
};

function renderNewsPublicV34() {
  const target = document.getElementById("newsList");
  if (!target) return;
  const rows = getVisibleNewsForSeasonV79(30);

  target.innerHTML = rows.length ? rows.map((news, index) => `
    <details class="news-card-details" ${index === 0 ? "open" : ""}>
      <summary class="news-card-summary">
        <div>
          <small>${escapeHtml(getNewsTopicTextV79(news))}</small>
          <h3>${escapeHtml(news.title || "Comunicato")}</h3>
          ${news.seasonTeamId ? `<small>${renderSeasonTeamNameWithLogo(news.seasonTeamId, { strong: false })}</small>` : ""}
        </div>
        <small>${escapeHtml(formatNewsDateTimeV79(getNewsRawDateValueV79(news)))}</small>
      </summary>
      <div class="news-card-detail-body">
        <p class="news-body-preserve">${renderBoldMarkdown(news.body || "")}</p>
      </div>
    </details>`).join("") : `<p class="muted">Nessun comunicato pubblicato.</p>`;
}

const renderPlaceholderPagesBeforeV34 = renderPlaceholderPages;
renderPlaceholderPages = function renderPlaceholderPagesV34() {
  renderNewsPublicV34();
  renderListonePublic();
  renderHonorSummary();
  renderClubRostersPublic();
  setLoadingText("movementsList", "I movimenti FM sono visualizzati nella sezione Rose.");
  renderStadiumsPublic();
};

function renderUserAreaV34() {
  const target = document.getElementById("teamAreaBody");
  if (!target) return;
  const approved = getApprovedTeamUser();
  if (!state.user) {
    target.innerHTML = `<section class="panel"><p class="muted">Accedi o registrati come presidente per inviare richieste squadra.</p></section>`;
    return;
  }
  if (!approved) {
    const status = state.currentPendingUser?.status || (isEmailPasswordUserV34() && !state.user.emailVerified ? "EMAIL_NOT_VERIFIED" : "PENDING");
    target.innerHTML = `
      <section class="panel">
        <div class="panel-header compact"><div><h2>Account in attesa</h2><p>Il tuo account non è ancora associato a una squadra.</p></div></div>
        <p><strong>${escapeHtml(getCurrentUserDisplayName())}</strong> · ${escapeHtml(state.user.email || "")}</p>
        <p><span class="status status-warning">${escapeHtml(requestStatusLabel(status))}</span></p>
        ${status === "EMAIL_NOT_VERIFIED" ? `<p class="muted">Verifica la mail ricevuta da Firebase, poi ricarica questa pagina.</p>` : `<p class="muted">Un admin dovrà approvare l'account e associarlo alla squadra.</p>`}
      </section>`;
    return;
  }

  const seasonTeamName = getSeasonTeamDisplayName(approved.seasonTeamId) || approved.teamName || "Squadra";
  target.innerHTML = `
    <section class="panel">
      <div class="panel-header compact"><div><h2>${escapeHtml(seasonTeamName)}</h2><p>Invia richieste operative all'admin. I dati ufficiali cambiano solo dopo approvazione.</p></div></div>
      <div class="cards-grid user-request-grid">
        <article class="metric-card"><span class="metric-label">Utente</span><strong>${escapeHtml(getCurrentUserDisplayName())}</strong></article>
        <article class="metric-card"><span class="metric-label">Ruolo</span><strong>Presidente</strong></article>
        <article class="metric-card"><span class="metric-label">Stato</span><strong>Attivo</strong></article>
      </div>
    </section>

    <section class="grid-two user-actions-grid">
      <article class="panel">
        <div class="panel-header compact"><div><h2>Proponi movimento FM</h2><p>Bonus, rettifiche o altri movimenti da far approvare.</p></div></div>
        <form id="teamFmRequestForm" class="form-grid">
          <label>Tipo movimento<select id="teamFmRequestType" class="input"><option value="BONUS">Bonus</option><option value="RETTIFICA">Rettifica</option><option value="ALTRO">Altro</option></select></label>
          <label>Importo FM<input id="teamFmRequestAmount" class="input" type="text" inputmode="decimal" placeholder="Es. 10,5" required /></label>
          <label class="span-2">Giocatore <span class="muted">(opzionale)</span><input id="teamFmRequestPlayer" class="input" type="text" /></label>
          <label class="span-2">Descrizione<textarea id="teamFmRequestDescription" class="input textarea" rows="3" required></textarea></label>
          <div class="form-actions span-2"><button class="button button-primary" type="submit">Invia proposta</button><span id="teamFmRequestStatus" class="form-status"></span></div>
        </form>
      </article>

      <article class="panel">
        <div class="panel-header compact"><div><h2>Richiedi acquisto/svincolo</h2><p>La richiesta verrà valutata dall'admin.</p></div></div>
        <form id="teamMarketRequestForm" class="form-grid">
          <label>Tipo<select id="teamMarketRequestType" class="input"><option value="PLAYER_BUY_REQUEST">Acquisto</option><option value="PLAYER_RELEASE_REQUEST">Svincolo</option><option value="PLAYER_TRADE_REQUEST">Scambio</option></select></label>
          <label>Costo/Rimborso FM<input id="teamMarketRequestAmount" class="input" type="text" inputmode="decimal" /></label>
          <label class="span-2">Giocatore<input id="teamMarketRequestPlayer" class="input" type="text" required /></label>
          <label>Squadra reale<input id="teamMarketRequestRealTeam" class="input" type="text" /></label>
          <label>Ruolo<input id="teamMarketRequestRole" class="input" type="text" /></label>
          <label class="span-2">Note<textarea id="teamMarketRequestNotes" class="input textarea" rows="3"></textarea></label>
          <div class="form-actions span-2"><button class="button button-primary" type="submit">Invia richiesta</button><span id="teamMarketRequestStatus" class="form-status"></span></div>
        </form>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header compact"><div><h2>Invia comunicato squadra</h2><p>Il comunicato sarà pubblicato in News e nella pagina squadra dopo approvazione.</p></div></div>
      <form id="teamNewsRequestForm" class="form-grid">
        <label class="span-2">Titolo<input id="teamNewsRequestTitle" class="input" type="text" required /></label>
        <label class="span-2">Testo<textarea id="teamNewsRequestBody" class="input textarea" rows="5" required></textarea></label>
        <div class="form-actions span-2"><button class="button button-primary" type="submit">Invia comunicato</button><span id="teamNewsRequestStatus" class="form-status"></span></div>
      </form>
    </section>`;
  attachUserAreaHandlersV34();
}

function buildBaseTeamRequestPayloadV34(type) {
  const approved = getApprovedTeamUser();
  if (!state.user || !approved) throw new Error("Utente non approvato.");
  return {
    type,
    status: "PENDING",
    createdBy: state.user.uid,
    createdByEmail: state.user.email || "",
    createdByName: getCurrentUserDisplayName(),
    presidentId: approved.presidentId || "",
    teamId: approved.teamId || "",
    seasonTeamId: approved.seasonTeamId || "",
    seasonId: approved.seasonId || getCurrentSeasonId(),
    createdAt: serverTimestamp()
  };
}

async function submitTeamRequestV34(type, data, statusElementId) {
  try {
    const payload = { ...buildBaseTeamRequestPayloadV34(type), ...data };
    await addDoc(collection(db, "teamRequests"), payload);
    showMessage(statusElementId, "Richiesta inviata all'admin.");
  } catch (error) {
    console.error(error);
    showMessage(statusElementId, error?.message || "Errore durante l'invio.", true);
  }
}

function attachUserAreaHandlersV34() {
  document.getElementById("teamFmRequestForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    submitTeamRequestV34("FM_MOVEMENT", {
      movementType: document.getElementById("teamFmRequestType")?.value || "ALTRO",
      amount: parseDecimalValue(document.getElementById("teamFmRequestAmount")?.value || "0") || 0,
      playerName: document.getElementById("teamFmRequestPlayer")?.value.trim() || "",
      description: document.getElementById("teamFmRequestDescription")?.value.trim() || ""
    }, "teamFmRequestStatus");
    event.target.reset();
  });

  document.getElementById("teamMarketRequestForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const type = document.getElementById("teamMarketRequestType")?.value || "PLAYER_BUY_REQUEST";
    submitTeamRequestV34(type, {
      amount: parseDecimalValue(document.getElementById("teamMarketRequestAmount")?.value || "") || null,
      playerName: document.getElementById("teamMarketRequestPlayer")?.value.trim() || "",
      realTeam: abbreviateRealTeam(document.getElementById("teamMarketRequestRealTeam")?.value || ""),
      rosterRole: document.getElementById("teamMarketRequestRole")?.value.trim() || "",
      notes: document.getElementById("teamMarketRequestNotes")?.value.trim() || ""
    }, "teamMarketRequestStatus");
    event.target.reset();
  });

  document.getElementById("teamNewsRequestForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    submitTeamRequestV34("TEAM_NEWS", {
      title: document.getElementById("teamNewsRequestTitle")?.value.trim() || "Comunicato squadra",
      body: document.getElementById("teamNewsRequestBody")?.value || ""
    }, "teamNewsRequestStatus");
    event.target.reset();
  });
}



/* V79 - News datetime, admin scroll helpers and transfer communications. */
function getNewsRawDateValueV79(news) {
  return news?.publishedAt || news?.createdAt || "";
}

function timestampToDateV79(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "object") {
    if (typeof value.toDate === "function") {
      const date = value.toDate();
      return Number.isNaN(date.getTime()) ? null : date;
    }
    if (Number.isFinite(value.seconds)) return new Date(value.seconds * 1000);
  }
  if (typeof value === "string") {
    const cleaned = value.trim();
    if (!cleaned) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return new Date(`${cleaned}T00:00:00`);
    const date = new Date(cleaned);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  return null;
}

function getNewsSortTimeV79(news) {
  const date = timestampToDateV79(getNewsRawDateValueV79(news));
  return date ? date.getTime() : 0;
}

function padDatePartV79(value) {
  return String(value).padStart(2, "0");
}

function getNowLocalDateTimeInputValueV79(date = new Date()) {
  return [
    date.getFullYear(),
    padDatePartV79(date.getMonth() + 1),
    padDatePartV79(date.getDate())
  ].join("-") + "T" + [
    padDatePartV79(date.getHours()),
    padDatePartV79(date.getMinutes())
  ].join(":");
}

function toNewsDateTimeInputValueV79(value) {
  const date = timestampToDateV79(value);
  return date ? getNowLocalDateTimeInputValueV79(date) : getNowLocalDateTimeInputValueV79();
}

function normalizeNewsPublishedAtV79(value) {
  const raw = String(value || "").trim();
  if (!raw) return getNowLocalDateTimeInputValueV79();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const now = new Date();
    return `${raw}T${padDatePartV79(now.getHours())}:${padDatePartV79(now.getMinutes())}`;
  }
  return raw;
}

function formatNewsDateTimeV79(value) {
  const date = timestampToDateV79(value);
  if (!date) return String(value || "");
  return date.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getNewsTopicTextV79(news) {
  return news?.topic === "COMUNICATO_SQUADRA" ? "Comunicato squadra" : (news?.topic || "News");
}

function getVisibleNewsForSeasonV79(limit = 30) {
  const seasonId = getCurrentSeasonId();
  return (state.raw.news || [])
    .filter((item) => !item.seasonId || item.seasonId === seasonId)
    .sort((a, b) => getNewsSortTimeV79(b) - getNewsSortTimeV79(a))
    .slice(0, limit);
}


/* V48 - Admin diretto per news e comunicati. */
function renderNewsAdminPanelV48() {
  const currentSeasonId = getCurrentSeasonId();
  const seasonOptions = (state.raw.seasons || []).map((season) => `
    <option value="${escapeHtml(season.id)}" ${season.id === currentSeasonId ? "selected" : ""}>${escapeHtml(season.name || season.id)}</option>
  `).join("");
  const seasonTeamOptions = (state.raw.seasonTeams || [])
    .filter((seasonTeam) => !currentSeasonId || seasonTeam.seasonId === currentSeasonId)
    .map((seasonTeam) => `<option value="${escapeHtml(seasonTeam.id)}">${escapeHtml(seasonTeam.name || seasonTeam.id)}</option>`)
    .join("");
  const rows = (state.raw.news || [])
    .slice()
    .sort((a, b) => getNewsSortTimeV79(b) - getNewsSortTimeV79(a))
    .slice(0, 40)
    .map((item) => {
      const teamName = item.seasonTeamId ? getSeasonTeamDisplayName(item.seasonTeamId) : "";
      return `
        <div class="admin-list-item">
          <span>
            <strong>${escapeHtml(item.title || "Comunicato")}</strong>
            <small>${escapeHtml(newsTopicLabelV48(item.topic))}${teamName ? ` · ${escapeHtml(teamName)}` : ""} · ${escapeHtml(formatNewsDateTimeV79(getNewsRawDateValueV79(item)))}</small>
            <small class="admin-news-preview">${escapeHtml(String(item.body || "").slice(0, 140))}${String(item.body || "").length > 140 ? "..." : ""}</small>
          </span>
          <span>
            <button class="button button-secondary button-small" type="button" data-admin-edit-news="${escapeHtml(item.id)}">Modifica</button>
            <button class="button button-danger button-small" type="button" data-admin-delete-news="${escapeHtml(item.id)}">Elimina</button>
          </span>
        </div>`;
    }).join("") || `<p class="muted admin-empty-message">Nessun comunicato pubblicato.</p>`;

  const body = `
    <form id="adminNewsForm" class="form-grid">
      <input id="adminNewsId" type="hidden" />
      <label>
        Titolo
        <input id="adminNewsTitle" class="input" type="text" placeholder="Es. Comunicato ufficiale" required />
      </label>
      <label>
        Argomento
        <select id="adminNewsTopic" class="input" required>
          <option value="GENERALE">Generale</option>
          <option value="COMPETIZIONE">Competizione</option>
          <option value="COMUNICATO_SQUADRA">Comunicato squadra</option>
        </select>
      </label>
      <label>
        Stagione
        <select id="adminNewsSeasonId" class="input">
          <option value="">Nessuna / tutte</option>
          ${seasonOptions}
        </select>
      </label>
      <label>
        Squadra collegata <span class="muted">(opzionale)</span>
        <select id="adminNewsSeasonTeamId" class="input">
          <option value="">Nessuna squadra</option>
          ${seasonTeamOptions}
        </select>
      </label>
      <label>
        Data pubblicazione
        <input id="adminNewsPublishedAt" class="input" type="datetime-local" value="${escapeHtml(getNowLocalDateTimeInputValueV79())}" />
      </label>
      <label class="span-2">
        Testo
        <textarea id="adminNewsBody" class="input textarea" rows="5" placeholder="Scrivi il comunicato..." required></textarea>
      </label>
      <div class="form-actions span-2">
        <button class="button button-primary" type="submit">Salva comunicato</button>
        <button id="adminNewsReset" class="button button-secondary" type="button">Nuovo</button>
        <span id="adminNewsStatus" class="form-status"></span>
      </div>
    </form>
    <details class="admin-edit-section" open>
      <summary><strong>Comunicati pubblicati</strong><span>Ultimi 40</span></summary>
      <div class="admin-list">${rows}</div>
    </details>`;
  return renderAdminPanel("adminNewsPanel", "Comunicazioni", "News e comunicati", "Pubblica comunicati generali, comunicati competizione o comunicati ufficiali delle squadre.", body);
}

async function saveAdminNewsV48(event) {
  event.preventDefault();
  const id = document.getElementById("adminNewsId")?.value || "";
  const seasonTeamId = document.getElementById("adminNewsSeasonTeamId")?.value || "";
  const seasonTeam = getSeasonTeamById(seasonTeamId);
  const payload = {
    title: document.getElementById("adminNewsTitle")?.value.trim() || "Comunicato",
    body: document.getElementById("adminNewsBody")?.value || "",
    topic: document.getElementById("adminNewsTopic")?.value || "GENERALE",
    seasonId: document.getElementById("adminNewsSeasonId")?.value || seasonTeam?.seasonId || getCurrentSeasonId(),
    teamId: seasonTeam?.teamId || "",
    seasonTeamId,
    publishedAt: normalizeNewsPublishedAtV79(document.getElementById("adminNewsPublishedAt")?.value || ""),
    updatedAt: serverTimestamp()
  };
  try {
    const status = document.getElementById("adminNewsStatus");
    if (status) status.textContent = "Salvataggio...";
    if (id) {
      await setDoc(doc(db, "news", id), payload, { merge: true });
    } else {
      await addDoc(collection(db, "news"), { ...payload, createdAt: serverTimestamp(), createdBy: state.user?.uid || "" });
    }
    if (status) status.textContent = "Comunicato salvato. Aggiorna gli snapshot pubblici per mostrarlo subito nel sito.";
    resetAdminNewsFormV48();
    await loadFullDataV32({ render: true });
    expandAdminPanel("adminNewsPanel");
  } catch (error) {
    console.error(error);
    const status = document.getElementById("adminNewsStatus");
    if (status) status.textContent = `Errore: ${error.message}`;
  }
}

function resetAdminNewsFormV48() {
  document.getElementById("adminNewsId") && (document.getElementById("adminNewsId").value = "");
  document.getElementById("adminNewsTitle") && (document.getElementById("adminNewsTitle").value = "");
  document.getElementById("adminNewsTopic") && (document.getElementById("adminNewsTopic").value = "GENERALE");
  document.getElementById("adminNewsSeasonId") && (document.getElementById("adminNewsSeasonId").value = getCurrentSeasonId());
  document.getElementById("adminNewsSeasonTeamId") && (document.getElementById("adminNewsSeasonTeamId").value = "");
  document.getElementById("adminNewsPublishedAt") && (document.getElementById("adminNewsPublishedAt").value = getNowLocalDateTimeInputValueV79());
  document.getElementById("adminNewsBody") && (document.getElementById("adminNewsBody").value = "");
  document.getElementById("adminNewsStatus") && (document.getElementById("adminNewsStatus").textContent = "");
}

function editAdminNewsV48(newsId) {
  const item = (state.raw.news || []).find((row) => row.id === newsId);
  if (!item) return;
  expandAdminPanel("adminNewsPanel");
  document.getElementById("adminNewsId") && (document.getElementById("adminNewsId").value = item.id || "");
  document.getElementById("adminNewsTitle") && (document.getElementById("adminNewsTitle").value = item.title || "");
  document.getElementById("adminNewsTopic") && (document.getElementById("adminNewsTopic").value = item.topic || "GENERALE");
  document.getElementById("adminNewsSeasonId") && (document.getElementById("adminNewsSeasonId").value = item.seasonId || getCurrentSeasonId());
  document.getElementById("adminNewsSeasonTeamId") && (document.getElementById("adminNewsSeasonTeamId").value = item.seasonTeamId || "");
  document.getElementById("adminNewsPublishedAt") && (document.getElementById("adminNewsPublishedAt").value = toNewsDateTimeInputValueV79(item.publishedAt || item.createdAt));
  document.getElementById("adminNewsBody") && (document.getElementById("adminNewsBody").value = item.body || "");
  document.getElementById("adminNewsStatus") && (document.getElementById("adminNewsStatus").textContent = "Modifica comunicato esistente.");
}

async function deleteAdminNewsV48(newsId) {
  if (!newsId) return;
  if (!confirm("Eliminare questo comunicato?")) return;
  await deleteDoc(doc(db, "news", newsId));
  await loadFullDataV32({ render: true });
  expandAdminPanel("adminNewsPanel");
}

const renderAdminAreaBeforeV34 = renderAdminArea;
renderAdminArea = function renderAdminAreaV34() {
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;
  if (!state.isAdmin) return renderAdminAreaBeforeV34();

  adminPanel.innerHTML = `
    <div class="page-heading">
      <div>
        <p class="eyebrow">Area riservata</p>
        <h2 id="adminTitle">Admin</h2>
        <p>Gestione Firebase: dati ufficiali, utenti presidenti, richieste e snapshot pubblici.</p>
      </div>
    </div>
    ${renderPendingUsersAdminPanelV34()}
    ${renderTeamRequestsAdminPanelV34()}
    ${renderNewsAdminPanelV48()}
    ${renderSeasonAdminPanel()}
    ${renderPresidentAdminPanel()}
    ${renderTeamAdminPanel()}
    ${renderSeasonTeamAdminPanel()}
    ${renderRosterMovementsAdminPanel()}
    ${renderStadiumAdminPanel()}
    ${renderCompetitionAdminPanel()}
    ${renderCompetitionMatchesAdminPanel()}
    ${renderCompetitionResultsAdminPanel()}
    ${renderFifaRankingAdminPanel()}
    ${renderListoneToolsAdminPanel()}
    ${renderPublicSnapshotsAdminPanelV34()}
    ${renderBackupAdminPanel()}
  `;
  attachAdminHandlers();
};

function renderPendingUsersAdminPanelV34() {
  const pending = (state.raw.pendingUsers || []).filter((item) => item.status !== "APPROVED");
  const presidentOptions = state.raw.presidents.map((president) => `<option value="${escapeHtml(president.id)}">${escapeHtml(president.name || president.id)}</option>`).join("");
  const teamOptions = state.raw.teams.map((team) => `<option value="${escapeHtml(team.id)}">${escapeHtml(team.canonicalName || team.id)}</option>`).join("");
  const seasonTeamOptions = state.raw.seasonTeams.map((seasonTeam) => `<option value="${escapeHtml(seasonTeam.id)}">${escapeHtml(seasonTeam.seasonId)} · ${escapeHtml(seasonTeam.name || seasonTeam.id)}</option>`).join("");
  const rows = pending.map((user) => `
    <div class="admin-list-item admin-user-approval-item">
      <span>
        <strong>${escapeHtml(user.displayName || user.email || user.id)}</strong>
        <small>${escapeHtml(user.email || "")} · ${escapeHtml(requestStatusLabel(user.status))}</small>
      </span>
      <span class="admin-approval-controls">
        <select class="input" id="approvePresident_${escapeHtml(user.id)}"><option value="">Presidente...</option>${presidentOptions}</select>
        <select class="input" id="approveTeam_${escapeHtml(user.id)}"><option value="">Squadra madre...</option>${teamOptions}</select>
        <select class="input" id="approveSeasonTeam_${escapeHtml(user.id)}"><option value="">Rosa/stagione...</option>${seasonTeamOptions}</select>
        <button class="button button-primary button-small" type="button" data-approve-user="${escapeHtml(user.id)}">Approva</button>
        <button class="button button-danger button-small" type="button" data-reject-user="${escapeHtml(user.id)}">Rifiuta</button>
      </span>
    </div>`).join("") || `<p class="muted admin-empty-message">Nessun utente in attesa.</p>`;
  return renderAdminPanel("adminPendingUsersPanel", "Utenti", "Accetta utenti", "Approva i presidenti registrati e associali alla squadra/rosa corretta.", `<div class="admin-list">${rows}</div>`);
}

function renderTeamRequestsAdminPanelV34() {
  const requests = (state.raw.teamRequests || []).sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  const rows = requests.map((request) => `
    <div class="admin-list-item">
      <span>
        <strong>${escapeHtml(requestTypeLabel(request.type))} · ${escapeHtml(getSeasonTeamDisplayName(request.seasonTeamId))}</strong>
        <small>${escapeHtml(request.createdByName || request.createdByEmail || request.createdBy || "")} · ${escapeHtml(requestStatusLabel(request.status))}</small>
        <small>${escapeHtml(request.title || request.playerName || request.description || request.body || request.notes || "")}</small>
      </span>
      <span>
        ${request.status === "PENDING" ? `<button class="button button-primary button-small" type="button" data-approve-request="${escapeHtml(request.id)}">Approva</button><button class="button button-danger button-small" type="button" data-reject-request="${escapeHtml(request.id)}">Rifiuta</button>` : `<span class="status status-muted">${escapeHtml(requestStatusLabel(request.status))}</span>`}
      </span>
    </div>`).join("") || `<p class="muted admin-empty-message">Nessuna richiesta presidente.</p>`;
  return renderAdminPanel("adminTeamRequestsPanel", "Presidenti", "Richieste presidenti", "Approva o rifiuta movimenti, comunicati, acquisti e svincoli richiesti dai presidenti.", `<div class="admin-list">${rows}</div>`);
}

async function approvePendingUserV34(uid) {
  const pending = state.raw.pendingUsers.find((item) => item.id === uid) || {};
  const presidentId = document.getElementById(`approvePresident_${uid}`)?.value || "";
  const teamId = document.getElementById(`approveTeam_${uid}`)?.value || "";
  const seasonTeamId = document.getElementById(`approveSeasonTeam_${uid}`)?.value || "";
  const seasonTeam = getSeasonTeamById(seasonTeamId);
  if (!teamId || !seasonTeamId) {
    alert("Seleziona squadra madre e rosa/stagione.");
    return;
  }
  await setDoc(doc(db, "teamUsers", uid), {
    email: pending.email || "",
    displayName: pending.displayName || pending.email || uid,
    role: "team",
    presidentId,
    teamId,
    seasonTeamId,
    seasonId: seasonTeam?.seasonId || getCurrentSeasonId(),
    status: "ACTIVE",
    approvedAt: serverTimestamp(),
    approvedBy: state.user?.uid || ""
  }, { merge: true });
  await setDoc(doc(db, "pendingUsers", uid), { status: "APPROVED", approvedAt: serverTimestamp(), approvedBy: state.user?.uid || "" }, { merge: true });
  await loadFullDataV32({ render: true });
  expandAdminPanel("adminPendingUsersPanel");
}

async function rejectPendingUserV34(uid) {
  await setDoc(doc(db, "pendingUsers", uid), { status: "REJECTED", rejectedAt: serverTimestamp(), rejectedBy: state.user?.uid || "" }, { merge: true });
  await loadFullDataV32({ render: true });
  expandAdminPanel("adminPendingUsersPanel");
}

async function approveTeamRequestV34(requestId) {
  const request = state.raw.teamRequests.find((item) => item.id === requestId);
  if (!request) return;
  if (request.type === "TEAM_NEWS") {
    await addDoc(collection(db, "news"), {
      title: request.title || "Comunicato squadra",
      body: request.body || "",
      topic: "COMUNICATO_SQUADRA",
      seasonId: request.seasonId || getCurrentSeasonId(),
      teamId: request.teamId || "",
      seasonTeamId: request.seasonTeamId || "",
      authorUid: request.createdBy || "",
      publishedAt: getNowLocalDateTimeInputValueV79(),
      createdAt: serverTimestamp()
    });
  } else if (request.type === "FM_MOVEMENT") {
    await addDoc(collection(db, "fmMovements"), {
      seasonId: request.seasonId || getCurrentSeasonId(),
      seasonTeamId: request.seasonTeamId || "",
      type: request.movementType || "ALTRO",
      date: getTodayIsoDate(),
      amount: Number(request.amount || 0),
      playerName: request.playerName || "",
      description: request.description || "Movimento proposto dal presidente",
      createdAt: serverTimestamp()
    });
  } else if (request.type === "PLAYER_BUY_REQUEST") {
    const docId = `${makeIdPart(request.seasonId)}_${makeIdPart(request.seasonTeamId)}_${makeIdPart(request.playerName)}`;
    await setDoc(doc(db, "rosterEntries", docId), {
      seasonId: request.seasonId || getCurrentSeasonId(),
      seasonTeamId: request.seasonTeamId || "",
      playerName: request.playerName || "",
      realTeam: request.realTeam || "",
      rosterRole: request.rosterRole || "",
      cost: Number(request.amount || 0),
      status: "ACTIVE",
      updatedAt: serverTimestamp()
    }, { merge: true });
    await addDoc(collection(db, "fmMovements"), {
      seasonId: request.seasonId || getCurrentSeasonId(),
      seasonTeamId: request.seasonTeamId || "",
      type: "ACQUISTO",
      date: getTodayIsoDate(),
      amount: -Math.abs(Number(request.amount || 0)),
      playerName: request.playerName || "",
      description: "Acquisto approvato da richiesta presidente",
      createdAt: serverTimestamp()
    });
  } else if (request.type === "PLAYER_RELEASE_REQUEST") {
    await addDoc(collection(db, "fmMovements"), {
      seasonId: request.seasonId || getCurrentSeasonId(),
      seasonTeamId: request.seasonTeamId || "",
      type: "SVINCOLO",
      date: getTodayIsoDate(),
      amount: Math.abs(Number(request.amount || 0)),
      playerName: request.playerName || "",
      description: "Svincolo approvato da richiesta presidente",
      createdAt: serverTimestamp()
    });
  }
  await setDoc(doc(db, "teamRequests", requestId), { status: "APPROVED", approvedAt: serverTimestamp(), approvedBy: state.user?.uid || "" }, { merge: true });
  await loadFullDataV32({ render: true });
  expandAdminPanel("adminTeamRequestsPanel");
}

async function rejectTeamRequestV34(requestId) {
  await setDoc(doc(db, "teamRequests", requestId), { status: "REJECTED", rejectedAt: serverTimestamp(), rejectedBy: state.user?.uid || "" }, { merge: true });
  await loadFullDataV32({ render: true });
  expandAdminPanel("adminTeamRequestsPanel");
}

const attachAdminHandlersBeforeV34 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV34() {
  attachAdminHandlersBeforeV34();
  document.querySelectorAll("[data-approve-user]").forEach((button) => button.addEventListener("click", () => approvePendingUserV34(button.dataset.approveUser)));
  document.querySelectorAll("[data-reject-user]").forEach((button) => button.addEventListener("click", () => rejectPendingUserV34(button.dataset.rejectUser)));
  document.querySelectorAll("[data-approve-request]").forEach((button) => button.addEventListener("click", () => approveTeamRequestV34(button.dataset.approveRequest)));
  document.querySelectorAll("[data-reject-request]").forEach((button) => button.addEventListener("click", () => rejectTeamRequestV34(button.dataset.rejectRequest)));
  document.getElementById("adminNewsForm")?.addEventListener("submit", saveAdminNewsV48);
  document.getElementById("adminNewsReset")?.addEventListener("click", resetAdminNewsFormV48);
  document.querySelectorAll("[data-admin-edit-news]").forEach((button) => button.addEventListener("click", () => editAdminNewsV48(button.dataset.adminEditNews)));
  document.querySelectorAll("[data-admin-delete-news]").forEach((button) => button.addEventListener("click", () => deleteAdminNewsV48(button.dataset.adminDeleteNews)));
  document.getElementById("adminGenerateSelectedSeasonSnapshot")?.addEventListener("click", () => saveSelectedSeasonSnapshotV34());
  document.getElementById("adminGenerateAllSeasonSnapshots")?.addEventListener("click", () => saveAllSeasonSnapshotsV34());
  document.getElementById("adminGenerateHonorSnapshot")?.addEventListener("click", () => saveHonorSnapshotV34());
  document.getElementById("adminGenerateTeamSnapshots")?.addEventListener("click", () => saveAllTeamSnapshotsV34());
  document.getElementById("adminGenerateEverythingSnapshots")?.addEventListener("click", () => saveEverythingSnapshotsV34());
};

function buildPublicSeasonSnapshotV34(seasonId) {
  const snapshot = buildPublicSeasonSnapshotV32(seasonId);
  snapshot.news = (state.raw.news || [])
    .filter((item) => !item.seasonId || item.seasonId === seasonId)
    .sort((a, b) => getNewsSortTimeV79(b) - getNewsSortTimeV79(a))
    .slice(0, 40)
    .map((item) => ({
      id: item.id,
      title: item.title || "",
      body: item.body || "",
      topic: item.topic || "",
      seasonId: item.seasonId || "",
      teamId: item.teamId || "",
      seasonTeamId: item.seasonTeamId || "",
      publishedAt: item.publishedAt || ""
    }));
  snapshot.snapshotVersion = 34;
  return snapshot;
}

function buildTeamPalmaresV34(teamId) {
  const items = [];
  (state.raw.honorRoll || []).forEach((row) => {
    [
      ["Campione d'Italia", row.championItalySeasonTeamId],
      ["2° posto", row.secondPlaceSeasonTeamId],
      ["3° posto", row.thirdPlaceSeasonTeamId],
      ["Coppa Italia", row.coppaItaliaWinnerSeasonTeamId],
      ["Champion's League", row.championsLeagueWinnerSeasonTeamId],
      ["Playoff", row.playoffWinnerSeasonTeamId]
    ].forEach(([label, seasonTeamId]) => {
      const seasonTeam = getSeasonTeamById(seasonTeamId);
      if (seasonTeam?.teamId === teamId) items.push({ seasonId: row.seasonId, seasonLabel: formatSeasonShortLabel({ id: row.seasonId }), label });
    });
  });
  return items;
}


function compareRosterPlayersV34(a, b) {
  const roleCompare = getRosterRoleSortValue(a) - getRosterRoleSortValue(b);
  if (roleCompare) return roleCompare;
  return String(a.playerName || "").localeCompare(String(b.playerName || ""), "it");
}

function getFmBalanceForSeasonTeam(seasonTeamId) {
  return getTeamFmBalance(seasonTeamId);
}

function buildPublicTeamSnapshotV34(seasonTeam) {
  const team = buildMaps().teamsById.get(seasonTeam.teamId);
  const seasonTeamId = seasonTeam.id;
  const seasonId = seasonTeam.seasonId;
  const competitionsForSeason = (state.raw.competitions || []).filter((competition) => competition.seasonId === seasonId);
  const competitionsById = new Map(competitionsForSeason.map((competition) => [competition.id, competition]));
  const competitionIds = new Set(competitionsForSeason.map((competition) => competition.id));
  const matches = (state.raw.competitionMatches || [])
    .filter((match) => competitionIds.has(match.competitionId) && (match.homeSeasonTeamId === seasonTeamId || match.awaySeasonTeamId === seasonTeamId))
    .sort(compareMatchesForDisplay)
    .slice(0, 12)
    .map((match) => ({
      ...match,
      competitionCode: getCompetitionShortCode(competitionsById.get(match.competitionId))
    }));
  return {
    id: `${seasonId}_${seasonTeam.teamId}`,
    generatedAt: new Date().toISOString(),
    seasonId,
    teamId: seasonTeam.teamId,
    seasonTeamId,
    teamName: seasonTeam.name || team?.canonicalName || "Squadra",
    canonicalName: team?.canonicalName || "",
    logo: compactLogoForSnapshotV33(getSeasonTeamLogo(seasonTeam)),
    presidents: getSeasonTeamPresidentNames(seasonTeam),
    stadium: getStadiumForSeasonTeam(seasonTeamId) || null,
    fmBalance: getFmBalanceForSeasonTeam(seasonTeamId),
    rosterEntries: getSnapshotRosterEntriesForSeasonTeamV37(seasonTeam),
    recentMovements: (state.raw.fmMovements || []).filter((movement) => movement.seasonTeamId === seasonTeamId).sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, 15),
    recentNews: (state.raw.news || []).filter((news) => news.seasonTeamId === seasonTeamId || news.teamId === seasonTeam.teamId).sort((a, b) => getNewsSortTimeV79(b) - getNewsSortTimeV79(a)).slice(0, 10),
    palmares: buildTeamPalmaresV34(seasonTeam.teamId),
    recentMatches: matches
  };
}

async function saveSeasonSnapshotByIdV34(seasonId) {
  const snapshot = buildPublicSeasonSnapshotV34(seasonId);
  await setDoc(doc(db, "publicSeasonSnapshots", seasonId), snapshot);
  state.publicSeasonSnapshots[seasonId] = snapshot;
  return snapshot;
}

async function saveSelectedSeasonSnapshotV34() {
  try {
    showMessage("adminPublicSnapshotsStatus", "Aggiornamento stagione selezionata...");
    if (!state.hasFullData) await loadFullDataV32({ render: false });
    const seasonId = getCurrentSeasonId();
    await saveSeasonSnapshotByIdV34(seasonId);
    showMessage("adminPublicSnapshotsStatus", `Snapshot ${seasonId} aggiornato.`);
  } catch (error) {
    console.error(error);
    showMessage("adminPublicSnapshotsStatus", `Errore: ${error?.message || error}`, true);
  }
}

async function saveAllSeasonSnapshotsV34() {
  if (!state.hasFullData) await loadFullDataV32({ render: false });
  for (const season of state.raw.seasons) await saveSeasonSnapshotByIdV34(season.id);
  showMessage("adminPublicSnapshotsStatus", `Snapshot stagioni aggiornati: ${state.raw.seasons.length}.`);
}

async function saveHonorSnapshotV34() {
  if (!state.hasFullData) await loadFullDataV32({ render: false });
  const honorSnapshot = buildHonorSnapshotV32();
  const honorSize = new Blob([JSON.stringify(honorSnapshot)]).size;
  if (honorSize > 900000) throw new Error(`Snapshot Albo/FIFA troppo grande (${Math.round(honorSize / 1024)} KB).`);
  await setDoc(doc(db, "publicSnapshots", "honor"), honorSnapshot);
  state.publicHonorSnapshot = honorSnapshot;
  showMessage("adminPublicSnapshotsStatus", `Snapshot Albo/FIFA aggiornato (${Math.round(honorSize / 1024)} KB).`);
}

async function saveAllTeamSnapshotsV34() {
  if (!state.hasFullData) await loadFullDataV32({ render: false });
  const seasonTeams = state.raw.seasonTeams || [];
  for (const seasonTeam of seasonTeams) {
    const snapshot = buildPublicTeamSnapshotV34(seasonTeam);
    await setDoc(doc(db, "publicTeamSnapshots", snapshot.id), snapshot);
    state.teamSnapshotCache[snapshot.id] = snapshot;
  }
  showMessage("adminPublicSnapshotsStatus", `Snapshot squadra aggiornati: ${seasonTeams.length}.`);
}

async function saveEverythingSnapshotsV34() {
  try {
    showMessage("adminPublicSnapshotsStatus", "Aggiornamento completo in corso...");
    if (!state.hasFullData) await loadFullDataV32({ render: false });
    await saveAllSeasonSnapshotsV34();
    await saveHonorSnapshotV34();
    await saveAllTeamSnapshotsV34();
    showMessage("adminPublicSnapshotsStatus", "Tutti gli snapshot pubblici sono aggiornati.");
  } catch (error) {
    console.error(error);
    showMessage("adminPublicSnapshotsStatus", `Errore snapshot: ${error?.message || error}`, true);
  }
}

function renderPublicSnapshotsAdminPanelV34() {
  const generated = state.publicHonorSnapshot?.generatedAt || "-";
  const seasonId = getCurrentSeasonId();
  return renderAdminPanel("adminPublicSnapshotsPanel", "Ottimizzazione", "Snapshot pubblici", "Genera documenti leggeri. Il sito pubblico legge questi snapshot invece delle raccolte complete.", `
    <div class="snapshot-actions-grid">
      <button id="adminGenerateSelectedSeasonSnapshot" class="button button-primary" type="button">Aggiorna stagione selezionata (${escapeHtml(seasonId || "-")})</button>
      <button id="adminGenerateAllSeasonSnapshots" class="button button-secondary" type="button">Aggiorna tutte le stagioni</button>
      <button id="adminGenerateHonorSnapshot" class="button button-secondary" type="button">Aggiorna Albo/FIFA</button>
      <button id="adminGenerateTeamSnapshots" class="button button-secondary" type="button">Aggiorna schede squadra</button>
      <button id="adminGenerateEverythingSnapshots" class="button button-primary" type="button">Aggiorna tutto</button>
    </div>
    <p id="adminPublicSnapshotsStatus" class="form-status"></p>
    <small class="field-hint">Ultimo honor snapshot caricato: ${escapeHtml(generated)}. Se aggiorni dati ufficiali, rigenera gli snapshot.</small>`);
}

async function loadTeamSnapshotV34(seasonTeamId) {
  const seasonTeam = getSeasonTeamById(seasonTeamId);
  if (!seasonTeam) return null;
  const snapshotId = `${seasonTeam.seasonId}_${seasonTeam.teamId}`;
  if (state.teamSnapshotCache[snapshotId]) return state.teamSnapshotCache[snapshotId];
  const snapshot = await getDocumentIfExistsV32("publicTeamSnapshots", snapshotId).catch(() => null);
  if (snapshot) {
    state.teamSnapshotCache[snapshotId] = snapshot;
    return snapshot;
  }
  if (state.hasFullData) return buildPublicTeamSnapshotV34(seasonTeam);
  return null;
}

function formatMatchSummaryV34(match) {
  const home = getSeasonTeamDisplayName(match.homeSeasonTeamId);
  const away = getSeasonTeamDisplayName(match.awaySeasonTeamId);
  const result = match.status === "GIOCATA" ? `${match.homeGoals ?? "-"}-${match.awayGoals ?? "-"}` : "Da giocare";
  return `${match.matchday || "-"} · ${home} - ${away} · ${result}`;
}

let openTeamProfile = null;

async function openTeamProfileV34(seasonTeamId) {
  ensureV34Dom();
  const dialog = document.getElementById("teamProfileDialog");
  const title = document.getElementById("teamProfileTitle");
  const body = document.getElementById("teamProfileBody");
  if (!dialog || !body) return;
  if (title) title.textContent = getSeasonTeamDisplayName(seasonTeamId);
  body.innerHTML = `<p class="muted">Caricamento scheda squadra...</p>`;
  dialog.showModal?.();
  const snapshot = await loadTeamSnapshotV34(seasonTeamId);
  if (!snapshot) {
    body.innerHTML = `<p class="muted">Scheda squadra non ancora generata. Accedi come admin e aggiorna gli snapshot squadra.</p>`;
    return;
  }
  const rosterRows = (snapshot.rosterEntries || []).sort(compareRosterPlayersV34).map((player) => `
    <tr><td data-label="Giocatore" class="team-profile-player-cell"><strong>${escapeHtml(player.playerName || "-")}</strong></td><td data-label="R (RM)" class="team-profile-role-cell">${getRosterRoleDisplay(player)}</td><td data-label="Sq" class="team-profile-team-cell">${escapeHtml(player.realTeam || "-")}</td><td data-label="Costo" class="number team-profile-cost-cell">${formatListoneNumber(player.cost)}</td><td data-label="Qt.A" class="number team-profile-qta-cell">${formatListoneNumber(getRosterPlayerQuotationCurrent(player))}</td></tr>`).join("") || `<tr><td colspan="5" class="muted center">Rosa non disponibile.</td></tr>`;
  const palmaresRows = (snapshot.palmares || []).map((item) => `<tr><td>${escapeHtml(item.seasonLabel || item.seasonId)}</td><td>${escapeHtml(item.label)}</td></tr>`).join("") || `<tr><td colspan="2" class="muted center">Nessun titolo/piazzamento.</td></tr>`;
  const movementRows = (snapshot.recentMovements || []).map((movement) => `<tr><td>${escapeHtml(movement.date || "-")}</td><td>${renderFmMovementTypeBadge(movement.type)}</td><td>${escapeHtml(movement.playerName || "-")}</td><td class="number">${formatFm(movement.amount || 0)}</td></tr>`).join("") || `<tr><td colspan="4" class="muted center">Nessun movimento recente.</td></tr>`;
  const newsHtml = (snapshot.recentNews || []).map((news) => `<article class="compact-card"><h3>${escapeHtml(news.title || "Comunicato")}</h3><p class="news-body-preserve">${renderBoldMarkdown(news.body || "")}</p><small class="muted">${escapeHtml(formatNewsDateTimeV79(getNewsRawDateValueV79(news)))}</small></article>`).join("") || `<p class="muted">Nessun comunicato squadra.</p>`;
  const matchesRows = (snapshot.recentMatches || []).map((match) => `
    <tr>
      <td>${escapeHtml(match.competitionCode || getCompetitionShortCodeById(match.competitionId))}</td>
      <td>${escapeHtml(formatMatchStage(match))}</td>
      <td>${escapeHtml(getSeasonTeamDisplayName(match.homeSeasonTeamId))} - ${escapeHtml(getSeasonTeamDisplayName(match.awaySeasonTeamId))}</td>
      <td>${escapeHtml(formatMatchResult(match))}</td>
    </tr>`).join("") || `<tr><td colspan="4" class="muted center">Nessuna partita recente.</td></tr>`;

  body.innerHTML = `
    <div class="team-profile-header team-profile-header-stacked">
      ${renderTeamLogo(snapshot.teamName, snapshot.logo, "club-logo-lg")}
      <div class="team-profile-title-block"><h3>${escapeHtml(snapshot.teamName || "Squadra")}</h3><p class="muted team-profile-meta-line">Presidenti: ${escapeHtml(snapshot.presidents || "-")}</p><p class="muted team-profile-meta-line">Saldo FM: ${formatFm(snapshot.fmBalance || 0)}</p><p class="muted team-profile-meta-line">Stadio: ${escapeHtml(formatStadium(snapshot.stadium))}</p></div>
    </div>
    <div class="detail-section"><h3>Rosa</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-roster-wrap"><table class="mobile-tabular team-profile-roster-table"><thead><tr><th>Giocatore</th><th>R (RM)</th><th class="number">Qt.A</th><th>Sq</th><th class="number">Costo</th></tr></thead><tbody>${rosterRows}</tbody></table></div></div>
    <div class="detail-section"><h3>Palmarès squadra</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-palmares-wrap"><table class="mobile-tabular team-profile-palmares-table"><thead><tr><th>Stagione</th><th>Risultato</th></tr></thead><tbody>${palmaresRows}</tbody></table></div></div>
    <div class="detail-section"><h3>Ultimi movimenti</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap"><table class="mobile-tabular team-profile-movements-table"><thead><tr><th>Data</th><th>Tipo</th><th>Giocatore</th><th class="number">FM</th></tr></thead><tbody>${movementRows}</tbody></table></div></div>
    <div class="detail-section"><h3>Ultimi comunicati</h3>${newsHtml}</div>
    <div class="detail-section"><h3>Ultime partite</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-matches-wrap"><table class="mobile-tabular team-profile-matches-table"><thead><tr><th>Comp.</th><th>Fase</th><th>Partita</th><th>Ris.</th></tr></thead><tbody>${matchesRows}</tbody></table></div></div>`;
}

const renderSeasonTeamNameWithLogoBeforeV34 = renderSeasonTeamNameWithLogo;
renderSeasonTeamNameWithLogo = function renderSeasonTeamNameWithLogoV34(seasonTeamId, options = {}) {
  const html = renderSeasonTeamNameWithLogoBeforeV34(seasonTeamId, options);
  if (!seasonTeamId || options.noLink) return html;
  return `<button class="team-profile-link" type="button" data-open-team-profile="${escapeHtml(seasonTeamId)}">${html}</button>`;
};

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-team-profile]");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  openTeamProfileV34(button.dataset.openTeamProfile);
}, true);

const renderAllBeforeV34 = renderAll;
renderAll = function renderAllV34() {
  ensureV34Dom();
  renderAllBeforeV34();
  renderUserAreaV34();
  updateUserVisibilityV34();
};


// V51: startup moved to the very end of the file so every version patch
// below can override handlers before the app is initialized.

/* V27 - Robust mobile roster toggles.
   Keep rosters collapsed by default on first mobile render and handle roster toggle
   clicks in capture phase so the button cannot be swallowed by table scroll/tap quirks. */
const renderTeamsTableBeforeV27 = renderTeamsTable;
renderTeamsTable = function renderTeamsTableV27() {
  const isMobileLike = window.matchMedia("(max-width: 900px), (hover: none) and (pointer: coarse)").matches;
  const displayMode = localStorage.getItem("zonaOrientaleDisplayMode") || "auto";
  if (isMobileLike && displayMode !== "desktop" && !state.didResetMobileRosterExpansionV27) {
    state.expandedRosterClubIds = new Set();
    state.didResetMobileRosterExpansionV27 = true;
  }
  return renderTeamsTableBeforeV27();
};

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-toggle-roster-club]");
  if (!button) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const id = button.dataset.toggleRosterClub;
  if (!id) return;
  if (state.expandedRosterClubIds.has(id)) {
    state.expandedRosterClubIds.delete(id);
  } else {
    const isMobileLike = window.matchMedia("(max-width: 900px), (hover: none) and (pointer: coarse)").matches;
    const displayMode = localStorage.getItem("zonaOrientaleDisplayMode") || "auto";
    if (isMobileLike && displayMode !== "desktop") {
      state.expandedRosterClubIds = new Set([id]);
    } else {
      state.expandedRosterClubIds.add(id);
    }
  }
  renderTeamsTable();
}, true);


/* V29 - UI refinements: mobile table overlap, dashboard podium labels and toggle labels. */
function normalizeToggleLabelsV29() {
  document.querySelectorAll("details .details-toggle-label").forEach((label) => {
    const details = label.closest("details");
    label.textContent = details?.open ? "Riduci" : "Espandi";
  });

  document.querySelectorAll("[data-toggle-roster-club]").forEach((button) => {
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.textContent = expanded ? "Riduci" : "Espandi";
  });

  document.querySelectorAll("[data-content-toggle-panel]").forEach((button) => {
    const key = button.dataset.contentTogglePanel;
    const panel = key ? document.querySelector(`[data-collapse-key="${CSS.escape(key)}"]`) : button.closest(".content-collapsible-panel");
    button.textContent = panel?.classList.contains("section-is-collapsed") ? "Espandi" : "Riduci";
  });

  document.querySelectorAll("[data-admin-toggle-panel]").forEach((button) => {
    const panel = button.closest(".admin-collapsible-panel");
    button.textContent = panel?.classList.contains("is-collapsed") ? "Espandi" : "Riduci";
  });
}

const renderWinnerLabelHtmlBeforeV29 = renderWinnerLabelHtml;
renderWinnerLabelHtml = function renderWinnerLabelHtmlV29(competition, options = {}) {
  if (!options.highlightWinner || isRankingCompetition(competition)) {
    return renderWinnerLabelHtmlBeforeV29(competition, options);
  }

  const { withLogo = false } = options;
  const results = getCompetitionResults(competition.id);
  const winner = results.find((result) => Number(result.position) === 1);

  if (!winner) return "Nessun risultato inserito";

  const winnerHtml = withLogo
    ? renderSeasonTeamNameWithLogo(winner.seasonTeamId, { textClass: "text-success" })
    : `<strong class="text-success">${escapeHtml(getSeasonTeamDisplayName(winner.seasonTeamId))}</strong>`;

  return `
    <div class="dashboard-podium-lines">
      <div><span class="muted">Vincitore:</span> ${winnerHtml}</div>
    </div>`;
};

const renderDashboardBeforeV29 = renderDashboard;
renderDashboard = function renderDashboardV29() {
  const result = renderDashboardBeforeV29();
  normalizeToggleLabelsV29();
  return result;
};

const renderTeamsTableBeforeV29 = renderTeamsTable;
renderTeamsTable = function renderTeamsTableV29() {
  const result = renderTeamsTableBeforeV29();
  normalizeToggleLabelsV29();
  return result;
};

const renderListonePublicBeforeV29 = renderListonePublic;
renderListonePublic = function renderListonePublicV29() {
  const result = renderListonePublicBeforeV29();
  normalizeToggleLabelsV29();
  return result;
};

document.addEventListener("toggle", (event) => {
  if (event.target instanceof HTMLDetailsElement) {
    normalizeToggleLabelsV29();
  }
}, true);

document.addEventListener("click", () => {
  window.setTimeout(normalizeToggleLabelsV29, 0);
}, true);

window.setTimeout(normalizeToggleLabelsV29, 0);


/* V37 - Snapshot rosters use static fallback when Firebase roster entries are missing.
   This keeps teams with only static imported rosters visible in public snapshots and team profiles. */

/* V40 - Roster column order, dashboard winner-only labels and stronger sticky roster columns. */
function renderRosterPlayerTableV40(players) {
  if (!players.length) return `<p class="muted">Nessun giocatore in rosa.</p>`;
  return `
    <div class="table-wrap mobile-tabular-wrap roster-table-wrap roster-inline-table-wrap">
      <table class="mobile-tabular roster-main-table roster-player-table roster-sticky-table">
        <thead>
          <tr>
            <th class="roster-col-player">${renderRosterSortButton("playerName", "Giocatore")}</th>
            <th class="roster-col-role">${renderRosterSortButton("role", "R (RM)")}</th>
            <th class="roster-col-team">${renderRosterSortButton("realTeam", "Sq")}</th>
            <th class="number roster-col-cost">${renderRosterSortButton("cost", "Costo", true)}</th>
            <th class="number roster-col-qta">${renderRosterSortButton("quotationCurrent", "Qt.A", true)}</th>
          </tr>
        </thead>
        <tbody>
          ${sortRosterPlayersForDisplay(players).map((player) => `
            <tr>
              <td data-label="Giocatore" class="roster-col-player"><strong>${escapeHtml(player.playerName || "-")}</strong></td>
              <td data-label="R (RM)" class="roster-col-role">${getRosterRoleDisplay(player)}</td>
              <td data-label="Sq" class="roster-col-team">${escapeHtml(player.realTeam || "-")}</td>
              <td data-label="Costo" class="number roster-col-cost">${escapeHtml(player.cost ?? "-")}</td>
              <td data-label="Qt.A" class="number roster-col-qta">${formatListoneNumber(getRosterPlayerQuotationCurrent(player))}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

renderRosterPlayerTable = renderRosterPlayerTableV40;

const openTeamProfileBeforeV40 = openTeamProfileV34;
openTeamProfileV34 = async function openTeamProfileV40(seasonTeamId) {
  ensureV34Dom();
  const dialog = document.getElementById("teamProfileDialog");
  const title = document.getElementById("teamProfileTitle");
  const body = document.getElementById("teamProfileBody");
  if (!dialog || !body) return;
  if (title) title.textContent = getSeasonTeamDisplayName(seasonTeamId);
  body.innerHTML = `<p class="muted">Caricamento scheda squadra...</p>`;
  dialog.showModal?.();
  const snapshot = await loadTeamSnapshotV34(seasonTeamId);
  if (!snapshot) {
    body.innerHTML = `<p class="muted">Scheda squadra non ancora generata. Accedi come admin e aggiorna gli snapshot squadra.</p>`;
    return;
  }

  const rosterRows = (snapshot.rosterEntries || []).sort(compareRosterPlayersV34).map((player) => `
    <tr>
      <td data-label="Giocatore" class="team-profile-player-cell"><strong>${escapeHtml(player.playerName || "-")}</strong></td>
      <td data-label="R (RM)" class="team-profile-role-cell">${getRosterRoleDisplay(player)}</td>
      <td data-label="Sq" class="team-profile-team-cell">${escapeHtml(player.realTeam || "-")}</td>
      <td data-label="Costo" class="number team-profile-cost-cell">${formatListoneNumber(player.cost)}</td>
      <td data-label="Qt.A" class="number team-profile-qta-cell">${formatListoneNumber(getRosterPlayerQuotationCurrent(player))}</td>
    </tr>`).join("") || `<tr><td colspan="5" class="muted center">Rosa non disponibile.</td></tr>`;
  const palmaresRows = (snapshot.palmares || []).map((item) => `<tr><td>${escapeHtml(item.seasonLabel || item.seasonId)}</td><td>${escapeHtml(item.label)}</td></tr>`).join("") || `<tr><td colspan="2" class="muted center">Nessun titolo/piazzamento.</td></tr>`;
  const movementRows = (snapshot.recentMovements || []).map((movement) => `<tr><td>${escapeHtml(movement.date || "-")}</td><td>${renderFmMovementTypeBadge(movement.type)}</td><td>${escapeHtml(movement.playerName || "-")}</td><td class="number">${formatFm(movement.amount || 0)}</td></tr>`).join("") || `<tr><td colspan="4" class="muted center">Nessun movimento recente.</td></tr>`;
  const newsHtml = (snapshot.recentNews || []).map((news) => `<article class="compact-card"><h3>${escapeHtml(news.title || "Comunicato")}</h3><p class="news-body-preserve">${renderBoldMarkdown(news.body || "")}</p><small class="muted">${escapeHtml(formatNewsDateTimeV79(getNewsRawDateValueV79(news)))}</small></article>`).join("") || `<p class="muted">Nessun comunicato squadra.</p>`;
  const matchesRows = (snapshot.recentMatches || []).map((match) => `
    <tr>
      <td>${escapeHtml(match.competitionCode || getCompetitionShortCodeById(match.competitionId))}</td>
      <td>${escapeHtml(formatMatchStage(match))}</td>
      <td>${escapeHtml(getSeasonTeamDisplayName(match.homeSeasonTeamId))} - ${escapeHtml(getSeasonTeamDisplayName(match.awaySeasonTeamId))}</td>
      <td>${escapeHtml(formatMatchResult(match))}</td>
    </tr>`).join("") || `<tr><td colspan="4" class="muted center">Nessuna partita recente.</td></tr>`;

  body.innerHTML = `
    <div class="team-profile-header team-profile-header-stacked">
      ${renderTeamLogo(snapshot.teamName, snapshot.logo, "club-logo-lg")}
      <div class="team-profile-title-block"><h3>${escapeHtml(snapshot.teamName || "Squadra")}</h3><p class="muted team-profile-meta-line">Presidenti: ${escapeHtml(snapshot.presidents || "-")}</p><p class="muted team-profile-meta-line">Saldo FM: ${formatFm(snapshot.fmBalance || 0)}</p><p class="muted team-profile-meta-line">Stadio: ${escapeHtml(formatStadium(snapshot.stadium))}</p></div>
    </div>
    <div class="detail-section"><h3>Rosa</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-roster-wrap"><table class="mobile-tabular team-profile-roster-table roster-sticky-table"><thead><tr><th>Giocatore</th><th>R (RM)</th><th>Sq</th><th class="number">Costo</th><th class="number">Qt.A</th></tr></thead><tbody>${rosterRows}</tbody></table></div></div>
    <div class="detail-section"><h3>Palmarès squadra</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-palmares-wrap"><table class="mobile-tabular team-profile-palmares-table"><thead><tr><th>Stagione</th><th>Risultato</th></tr></thead><tbody>${palmaresRows}</tbody></table></div></div>
    <div class="detail-section"><h3>Ultimi movimenti</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap"><table class="mobile-tabular team-profile-movements-table"><thead><tr><th>Data</th><th>Tipo</th><th>Giocatore</th><th class="number">FM</th></tr></thead><tbody>${movementRows}</tbody></table></div></div>
    <div class="detail-section"><h3>Ultimi comunicati</h3>${newsHtml}</div>
    <div class="detail-section"><h3>Ultime partite</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-matches-wrap"><table class="mobile-tabular team-profile-matches-table"><thead><tr><th>Comp.</th><th>Fase</th><th>Partita</th><th>Ris.</th></tr></thead><tbody>${matchesRows}</tbody></table></div></div>`;
};

openTeamProfile = openTeamProfileV34;

const renderWinnerLabelHtmlBeforeV40 = renderWinnerLabelHtml;
renderWinnerLabelHtml = function renderWinnerLabelHtmlV40(competition, options = {}) {
  if (!options.highlightWinner || isRankingCompetition(competition)) {
    return renderWinnerLabelHtmlBeforeV40(competition, options);
  }

  const { withLogo = false } = options;
  const results = getCompetitionResults(competition.id);
  const winner = results.find((result) => Number(result.position) === 1);

  if (!winner) return "Nessun risultato inserito";

  const winnerHtml = withLogo
    ? renderSeasonTeamNameWithLogo(winner.seasonTeamId, { textClass: "text-success" })
    : `<strong class="text-success">${escapeHtml(getSeasonTeamDisplayName(winner.seasonTeamId))}</strong>`;

  return `<div class="dashboard-podium-lines"><div><span class="muted">Vincitore:</span> ${winnerHtml}</div></div>`;
};

const renderDashboardBeforeV40 = renderDashboard;
renderDashboard = function renderDashboardV40() {
  const result = renderDashboardBeforeV40();
  normalizeToggleLabelsV29?.();
  return result;
};
/* V42 - Team profile as a real page and dashboard latest news. */
function ensureTeamProfilePageV42() {
  ensureV34Dom?.();

  const desktopNav = document.querySelector('.app-nav');
  if (desktopNav && !desktopNav.querySelector('[data-page-link="teamprofile"]')) {
    const link = document.createElement('a');
    link.href = '#teamprofile';
    link.className = 'nav-link nav-link-team-profile hidden';
    link.dataset.pageLink = 'teamprofile';
    link.textContent = 'La mia squadra';
    const teamAreaLink = desktopNav.querySelector('[data-page-link="teamarea"]');
    const adminLink = desktopNav.querySelector('#adminNavLink');
    desktopNav.insertBefore(link, teamAreaLink || adminLink || null);
  }

  const mobileSheet = document.getElementById('mobileMoreSheet');
  if (mobileSheet && !mobileSheet.querySelector('[data-page-link="teamprofile"]')) {
    const link = document.createElement('a');
    link.href = '#teamprofile';
    link.className = 'mobile-more-link nav-link-team-profile hidden';
    link.dataset.pageLink = 'teamprofile';
    link.textContent = 'La mia squadra';
    const teamAreaLink = mobileSheet.querySelector('[data-page-link="teamarea"]');
    const adminLink = mobileSheet.querySelector('[data-page-link="admin"]');
    mobileSheet.insertBefore(link, teamAreaLink || adminLink || null);
  }

  document.querySelectorAll('[data-page-link="teamarea"]').forEach((link) => {
    if (link.textContent.trim() === 'Area squadra') link.textContent = 'Richieste';
  });

  const main = document.querySelector('main.app-main');
  const adminPanel = document.getElementById('adminPanel');
  if (main && !document.querySelector('[data-page="teamprofile"]')) {
    const section = document.createElement('section');
    section.className = 'app-page team-profile-page';
    section.dataset.page = 'teamprofile';
    section.setAttribute('aria-labelledby', 'teamProfilePageTitle');
    section.innerHTML = `
      <div class="page-heading team-profile-page-heading">
        <div>
          <p class="eyebrow">Profilo squadra</p>
          <h2 id="teamProfilePageTitle">Scheda squadra</h2>
          <p>Rosa, palmarès, ultimi movimenti, comunicati e partite della squadra selezionata.</p>
        </div>
      </div>
      <div id="teamProfilePageBody" class="team-profile-page-body">
        <section class="panel"><p class="muted">Seleziona una squadra per aprire il profilo.</p></section>
      </div>`;
    main.insertBefore(section, adminPanel || null);
  }
}

function setAppPageV42(pageName) {
  const targetPage = pageName || 'dashboard';
  state.currentPage = targetPage;
  document.querySelectorAll('.app-page').forEach((page) => {
    page.classList.toggle('is-active', page.dataset.page === targetPage);
  });
  document.querySelectorAll('[data-page-link]').forEach((link) => {
    link.classList.toggle('active', link.dataset.pageLink === targetPage);
  });
  closeMobileMoreMenu?.();
  updateMobileNavState?.();
  if (window.location.hash !== `#${targetPage}`) {
    window.history.pushState(null, '', `#${targetPage}`);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getCurrentUserSeasonTeamIdV42() {
  const approved = getApprovedTeamUser?.();
  return approved?.seasonTeamId || state.activeTeamProfileSeasonTeamId || '';
}

function renderTeamProfileContentV42(snapshot) {
  if (!snapshot) {
    return `<section class="panel"><p class="muted">Scheda squadra non ancora generata. Accedi come admin e aggiorna gli snapshot squadra.</p></section>`;
  }

  const rosterRows = (snapshot.rosterEntries || []).sort(compareRosterPlayersV34).map((player) => `
    <tr>
      <td data-label="Giocatore" class="team-profile-player-cell"><strong>${escapeHtml(player.playerName || '-')}</strong></td>
      <td data-label="R (RM)" class="team-profile-role-cell">${getRosterRoleDisplay(player)}</td>
      <td data-label="Sq" class="team-profile-team-cell">${escapeHtml(player.realTeam || '-')}</td>
      <td data-label="Costo" class="number team-profile-cost-cell">${formatListoneNumber(player.cost)}</td>
      <td data-label="Qt.A" class="number team-profile-qta-cell">${formatListoneNumber(getRosterPlayerQuotationCurrent(player))}</td>
    </tr>`).join('') || `<tr><td colspan="5" class="muted center">Rosa non disponibile.</td></tr>`;

  const palmaresRows = (snapshot.palmares || []).map((item) => `
    <tr><td>${escapeHtml(item.seasonLabel || item.seasonId)}</td><td>${escapeHtml(item.label)}</td></tr>`).join('') || `<tr><td colspan="2" class="muted center">Nessun titolo/piazzamento.</td></tr>`;

  const movementRows = (snapshot.recentMovements || []).map((movement) => `
    <tr><td>${escapeHtml(movement.date || '-')}</td><td>${renderFmMovementTypeBadge(movement.type)}</td><td>${escapeHtml(movement.playerName || '-')}</td><td class="number">${formatFm(movement.amount || 0)}</td></tr>`).join('') || `<tr><td colspan="4" class="muted center">Nessun movimento recente.</td></tr>`;

  const newsHtml = (snapshot.recentNews || []).map((news) => `
    <article class="compact-card team-profile-news-card">
      <h3>${escapeHtml(news.title || 'Comunicato')}</h3>
      <p class="news-body-preserve">${renderBoldMarkdown(news.body || '')}</p>
      <small class="muted">${escapeHtml(formatNewsDateTimeV79(getNewsRawDateValueV79(news)))}</small>
    </article>`).join('') || `<p class="muted">Nessun comunicato squadra.</p>`;

  const matchesRows = (snapshot.recentMatches || []).map((match) => `
    <tr>
      <td>${escapeHtml(match.competitionCode || getCompetitionShortCodeById(match.competitionId))}</td>
      <td>${escapeHtml(formatMatchStage(match))}</td>
      <td>${escapeHtml(getSeasonTeamDisplayName(match.homeSeasonTeamId))} - ${escapeHtml(getSeasonTeamDisplayName(match.awaySeasonTeamId))}</td>
      <td>${escapeHtml(formatMatchResult(match))}</td>
    </tr>`).join('') || `<tr><td colspan="4" class="muted center">Nessuna partita recente.</td></tr>`;

  const isOwner = getApprovedTeamUser?.()?.seasonTeamId === snapshot.seasonTeamId;

  return `
    <section class="panel team-profile-hero-panel">
      <div class="team-profile-header team-profile-header-stacked team-profile-page-hero">
        ${renderTeamLogo(snapshot.teamName, snapshot.logo, 'club-logo-lg')}
        <div class="team-profile-title-block">
          <h3>${escapeHtml(snapshot.teamName || 'Squadra')}</h3>
          <p class="muted team-profile-meta-line">Presidenti: ${escapeHtml(snapshot.presidents || '-')}</p>
          <p class="muted team-profile-meta-line">Saldo FM: ${formatFm(snapshot.fmBalance || 0)}</p>
          <p class="muted team-profile-meta-line">Stadio: ${escapeHtml(formatStadium(snapshot.stadium))}</p>
        </div>
      </div>
    </section>

    <section class="panel detail-section"><h3>Rosa</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-roster-wrap"><table class="mobile-tabular team-profile-roster-table roster-sticky-table"><thead><tr><th>Giocatore</th><th>R (RM)</th><th>Sq</th><th class="number">Costo</th><th class="number">Qt.A</th></tr></thead><tbody>${rosterRows}</tbody></table></div></section>
    <section class="panel detail-section"><h3>Palmarès squadra</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-palmares-wrap"><table class="mobile-tabular team-profile-palmares-table"><thead><tr><th>Stagione</th><th>Risultato</th></tr></thead><tbody>${palmaresRows}</tbody></table></div></section>
    <section class="panel detail-section"><h3>Ultimi movimenti</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap"><table class="mobile-tabular team-profile-movements-table"><thead><tr><th>Data</th><th>Tipo</th><th>Giocatore</th><th class="number">FM</th></tr></thead><tbody>${movementRows}</tbody></table></div></section>
    <section class="panel detail-section"><h3>Ultimi comunicati</h3><div class="team-profile-news-list">${newsHtml}</div></section>
    <section class="panel detail-section"><h3>Ultime partite</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-matches-wrap"><table class="mobile-tabular team-profile-matches-table"><thead><tr><th>Comp.</th><th>Fase</th><th>Partita</th><th>Ris.</th></tr></thead><tbody>${matchesRows}</tbody></table></div></section>`;
}

async function openTeamProfilePageV42(seasonTeamId) {
  ensureTeamProfilePageV42();
  const selectedSeasonTeamId = seasonTeamId || getCurrentUserSeasonTeamIdV42();
  state.activeTeamProfileSeasonTeamId = selectedSeasonTeamId;
  const title = document.getElementById('teamProfilePageTitle');
  const body = document.getElementById('teamProfilePageBody');
  if (!body) return;
  if (title) title.textContent = getSeasonTeamDisplayName(selectedSeasonTeamId) || 'Scheda squadra';
  body.innerHTML = `<section class="panel"><p class="muted">Caricamento scheda squadra...</p></section>`;
  setAppPageV42('teamprofile');
  const snapshot = await loadTeamSnapshotV34(selectedSeasonTeamId);
  if (title) title.textContent = snapshot?.teamName || getSeasonTeamDisplayName(selectedSeasonTeamId) || 'Scheda squadra';
  body.innerHTML = renderTeamProfileContentV42(snapshot);
}

openTeamProfileV34 = function openTeamProfileV42(seasonTeamId) {
  openTeamProfilePageV42(seasonTeamId).catch((error) => {
    console.error(error);
    setError(`Non riesco ad aprire la pagina squadra. ${error?.message || error}`);
  });
};
openTeamProfile = openTeamProfileV34;

function renderDashboardNewsV42() {
  const dashboardPage = document.querySelector('[data-page="dashboard"]');
  const metrics = dashboardPage?.querySelector('[aria-label="Indicatori principali"]');
  if (!dashboardPage || !metrics) return;

  let panel = document.getElementById('dashboardNewsPanel');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'dashboardNewsPanel';
    panel.className = 'panel dashboard-news-panel';
    panel.innerHTML = `
      <div class="panel-header compact">
        <div>
          <h2>Ultime news e comunicati</h2>
          <p>Le ultime 5 comunicazioni pubblicate nella stagione selezionata.</p>
        </div>
        <div class="panel-actions dashboard-news-header-actions">
          <button class="button button-secondary button-small" type="button" data-v42-page-link="news">Vedi tutte</button>
        </div>
      </div>
      <div id="dashboardNewsList" class="dashboard-news-list"><p class="muted">Caricamento...</p></div>`;
  }

  if (panel.nextElementSibling !== metrics) {
    metrics.insertAdjacentElement('beforebegin', panel);
  }

  const target = document.getElementById('dashboardNewsList');
  if (!target) return;
  const rows = getVisibleNewsForSeasonV79(5);

  target.innerHTML = rows.length ? rows.map((news) => {
    const preview = getDashboardNewsPreview(news.body || '', 190);
    return `
      <article class="dashboard-news-card">
        <div class="dashboard-news-main">
          <small class="muted">${escapeHtml(getNewsTopicTextV79(news))}</small>
          <h3>${escapeHtml(news.title || 'Comunicato')}</h3>
          ${news.seasonTeamId ? `<button class="link-button dashboard-news-team-link" type="button" data-open-team-profile="${escapeHtml(news.seasonTeamId)}">${renderSeasonTeamNameWithLogo(news.seasonTeamId, { strong: false, noLink: true })}</button>` : ''}
          ${preview ? `<p class="dashboard-news-preview news-body-preserve">${renderBoldMarkdown(preview)}</p>` : ''}
        </div>
        <div class="dashboard-news-side">
          <small class="muted">${escapeHtml(formatNewsDateTimeV79(getNewsRawDateValueV79(news)))}</small>
          <button class="button button-secondary button-small" type="button" data-v42-page-link="news">Leggi</button>
        </div>
      </article>`;
  }).join('') : `<p class="muted">Nessuna news pubblicata.</p>`;
}

const renderDashboardBeforeV42 = renderDashboard;
renderDashboard = function renderDashboardV42() {
  const result = renderDashboardBeforeV42();
  renderDashboardNewsV42();
  return result;
};

const renderAllBeforeV42 = renderAll;
renderAll = function renderAllV42() {
  ensureTeamProfilePageV42();
  const result = renderAllBeforeV42();
  renderDashboardNewsV42();
  updateUserVisibilityV42();
  return result;
};

const updateUserVisibilityBeforeV42 = updateUserVisibilityV34;
function updateUserVisibilityV42() {
  updateUserVisibilityBeforeV42?.();
  const approved = getApprovedTeamUser?.();
  document.querySelectorAll('.nav-link-team-profile').forEach((link) => {
    link.classList.toggle('hidden', !approved);
    link.textContent = 'La mia squadra';
  });
}
updateUserVisibilityV34 = updateUserVisibilityV42;

const renderUserAreaBeforeV42 = renderUserAreaV34;
renderUserAreaV34 = function renderUserAreaV42() {
  renderUserAreaBeforeV42();
  const approved = getApprovedTeamUser?.();
  const target = document.getElementById('teamAreaBody');
  if (!approved || !target || target.dataset.v42ProfileLink) return;
  target.dataset.v42ProfileLink = 'true';
  const firstPanel = target.querySelector('.panel');
  firstPanel?.insertAdjacentHTML('beforeend', `
    <div class="team-area-profile-action">
      <button class="button button-secondary" type="button" data-open-team-profile="${escapeHtml(approved.seasonTeamId)}">Apri pagina squadra</button>
    </div>`);
};

function handlePageLinkV42(event) {
  const customButton = event.target.closest('[data-v42-page-link]');
  if (customButton) {
    event.preventDefault();
    const page = customButton.dataset.v42PageLink;
    if (page === 'teamprofile') {
      openTeamProfilePageV42(getCurrentUserSeasonTeamIdV42()).catch(console.error);
    } else {
      setAppPageV42(page);
    }
    return;
  }

  const profileNav = event.target.closest('[data-page-link="teamprofile"]');
  if (profileNav) {
    event.preventDefault();
    openTeamProfilePageV42(getCurrentUserSeasonTeamIdV42()).catch(console.error);
    return;
  }

  const dynamicNav = event.target.closest('[data-page-link="teamarea"]');
  if (dynamicNav && dynamicNav.classList.contains('nav-link-team-area')) {
    event.preventDefault();
    setAppPageV42('teamarea');
  }
}
document.addEventListener('click', handlePageLinkV42, true);

window.addEventListener('hashchange', () => {
  const page = window.location.hash.replace('#', '');
  if (page === 'teamprofile') {
    openTeamProfilePageV42(getCurrentUserSeasonTeamIdV42()).catch(console.error);
  }
});

ensureTeamProfilePageV42();

/* V43 - Team profile uses a real hash route based on the team name.
   Clicking a team opens zonaorientale/#nome-squadra instead of the generic #teamprofile. */
function slugifyTeamProfileV43(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' e ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'squadra';
}

function getTeamProfileSlugV43(seasonTeamId) {
  const name = getSeasonTeamDisplayName(seasonTeamId);
  const slug = slugifyTeamProfileV43(name);
  return slug || String(seasonTeamId || 'squadra');
}

function getSeasonTeamIdFromSlugV43(rawSlug) {
  const slug = slugifyTeamProfileV43(decodeURIComponent(String(rawSlug || '').replace(/^#/, '')));
  if (!slug) return '';

  const selectedSeasonId = getCurrentSeasonId?.() || '';
  const seasonTeams = [...(state.raw.seasonTeams || [])];
  const ordered = seasonTeams.sort((a, b) => {
    const aScore = a.seasonId === selectedSeasonId ? 0 : 1;
    const bScore = b.seasonId === selectedSeasonId ? 0 : 1;
    return aScore - bScore;
  });

  const match = ordered.find((seasonTeam) => getTeamProfileSlugV43(seasonTeam.id) === slug);
  return match?.id || '';
}

function isKnownStaticHashV43(hashValue) {
  return new Set([
    'dashboard',
    'news',
    'clubs',
    'listone',
    'competitions',
    'honor',
    'finance',
    'regolamento',
    'admin',
    'teamarea',
    'teamprofile'
  ]).has(hashValue);
}

function activateTeamProfilePageV43(seasonTeamId, options = {}) {
  ensureTeamProfilePageV42?.();
  state.currentPage = 'teamprofile';
  state.activeTeamProfileSeasonTeamId = seasonTeamId;

  document.querySelectorAll('.app-page').forEach((page) => {
    page.classList.toggle('is-active', page.dataset.page === 'teamprofile');
  });

  document.querySelectorAll('[data-page-link]').forEach((link) => {
    link.classList.toggle('active', link.dataset.pageLink === 'teamprofile');
  });

  closeMobileMoreMenu?.();
  updateMobileNavState?.();

  if (options.pushHash !== false) {
    const nextHash = `#${getTeamProfileSlugV43(seasonTeamId)}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
  }

  if (options.scroll !== false) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

openTeamProfilePageV42 = async function openTeamProfilePageV43(seasonTeamId, options = {}) {
  ensureTeamProfilePageV42?.();
  const selectedSeasonTeamId = seasonTeamId || getCurrentUserSeasonTeamIdV42?.() || '';
  if (!selectedSeasonTeamId) {
    setError?.('Nessuna squadra selezionata.');
    return;
  }

  const title = document.getElementById('teamProfilePageTitle');
  const body = document.getElementById('teamProfilePageBody');
  if (!body) return;

  activateTeamProfilePageV43(selectedSeasonTeamId, options);

  if (title) title.textContent = getSeasonTeamDisplayName(selectedSeasonTeamId) || 'Profilo squadra';
  body.innerHTML = `<section class="panel"><p class="muted">Caricamento profilo squadra...</p></section>`;

  const snapshot = await loadTeamSnapshotV34(selectedSeasonTeamId);
  if (title) title.textContent = snapshot?.teamName || getSeasonTeamDisplayName(selectedSeasonTeamId) || 'Profilo squadra';
  body.innerHTML = renderTeamProfileContentV42(snapshot);
};

openTeamProfileV34 = function openTeamProfileV43(seasonTeamId) {
  openTeamProfilePageV42(seasonTeamId, { pushHash: true }).catch((error) => {
    console.error(error);
    setError?.(`Non riesco ad aprire la pagina squadra. ${error?.message || error}`);
  });
};
openTeamProfile = openTeamProfileV34;

const renderSeasonTeamNameWithLogoBeforeV43 = renderSeasonTeamNameWithLogo;
renderSeasonTeamNameWithLogo = function renderSeasonTeamNameWithLogoV43(seasonTeamId, options = {}) {
  const html = renderSeasonTeamNameWithLogoBeforeV43(seasonTeamId, { ...options, noLink: true });
  if (!seasonTeamId || options.noLink) return html;
  const slug = getTeamProfileSlugV43(seasonTeamId);
  return `<a class="team-profile-link" href="#${escapeHtml(slug)}" data-open-team-profile="${escapeHtml(seasonTeamId)}">${html}</a>`;
};

function routeTeamHashV43(options = {}) {
  const rawHash = decodeURIComponent(window.location.hash.replace(/^#/, '') || '');
  if (!rawHash || isKnownStaticHashV43(rawHash)) {
    if (rawHash === 'teamprofile') {
      const ownTeamId = getCurrentUserSeasonTeamIdV42?.();
      if (ownTeamId) {
        openTeamProfilePageV42(ownTeamId, { pushHash: true, scroll: options.scroll !== false }).catch(console.error);
      }
    }
    return false;
  }

  const seasonTeamId = getSeasonTeamIdFromSlugV43(rawHash);
  if (!seasonTeamId) return false;

  const normalizedHash = slugifyTeamProfileV43(rawHash);
  const currentKey = `${normalizedHash}:${seasonTeamId}`;
  if (!options.force && state.lastTeamRouteKeyV43 === currentKey && state.currentPage === 'teamprofile') {
    return true;
  }
  state.lastTeamRouteKeyV43 = currentKey;

  openTeamProfilePageV42(seasonTeamId, { pushHash: false, scroll: options.scroll !== false }).catch(console.error);
  return true;
}

const renderAllBeforeV43 = renderAll;
renderAll = function renderAllV43() {
  const result = renderAllBeforeV43();
  setTimeout(() => routeTeamHashV43({ scroll: false }), 0);
  return result;
};

const updateUserVisibilityBeforeV43 = updateUserVisibilityV34;
function updateUserVisibilityV43() {
  updateUserVisibilityBeforeV43?.();
  const approved = getApprovedTeamUser?.();
  document.querySelectorAll('.nav-link-team-profile').forEach((link) => {
    link.classList.toggle('hidden', !approved);
    link.textContent = 'La mia squadra';
    if (approved?.seasonTeamId) {
      link.setAttribute('href', `#${getTeamProfileSlugV43(approved.seasonTeamId)}`);
    }
  });
}
updateUserVisibilityV34 = updateUserVisibilityV43;

window.addEventListener('hashchange', () => {
  routeTeamHashV43({ force: true });
});

setTimeout(() => routeTeamHashV43({ force: true, scroll: false }), 250);

setupMobileTables();
setupAdaptiveMobileViewport({
  getUpdateMobileUxClass: () => updateMobileUxClass,
  setUpdateMobileUxClass: (nextUpdateMobileUxClass) => {
    updateMobileUxClass = nextUpdateMobileUxClass;
  }
});

/* V50 - Season rollover and transfer communication emails. */
(function setupV50SeasonRolloverAndTransferEmails() {
  if (typeof ADMIN_PANEL_IDS !== "undefined" && !ADMIN_PANEL_IDS.includes("adminSeasonRolloverPanel")) {
    ADMIN_PANEL_IDS.push("adminSeasonRolloverPanel");
    state.collapsedAdminPanels?.add?.("adminSeasonRolloverPanel");
  }

  function safeIdPart(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || "item";
  }

  function renderSeasonRolloverAdminPanelV50() {
    const seasonOptions = (state.raw.seasons || [])
      .map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name || season.id)}</option>`)
      .join("");
    const defaultSource = getCurrentSeasonId() || (state.raw.seasons || [])[0]?.id || "";
    const defaultTarget = inferNextSeasonIdV50(defaultSource);

    return renderAdminPanel("adminSeasonRolloverPanel", "Stagioni", "Riversa stagione", "Crea una nuova stagione partendo da squadre, presidenti, rose, stadi, utenti e saldi della stagione precedente.", `
      <form id="seasonRolloverFormV50" class="form-grid">
        <label>Stagione origine
          <select id="rolloverSourceSeasonV50" class="input" required>${seasonOptions}</select>
        </label>
        <label>Stagione destinazione
          <input id="rolloverTargetSeasonV50" class="input" type="text" value="${escapeHtml(defaultTarget)}" placeholder="Es. 2026-2027" required />
        </label>
        <label>Nome nuova stagione
          <input id="rolloverTargetNameV50" class="input" type="text" value="${escapeHtml(defaultTarget ? `Stagione ${defaultTarget}` : "")}" />
        </label>
        <label>Budget iniziale se reset
          <input id="rolloverInitialBudgetV50" class="input" type="text" inputmode="decimal" value="500" />
        </label>
        <label class="checkbox-label"><input id="rolloverCopySeasonTeamsV50" type="checkbox" checked /> Copia squadre stagionali, presidenti e loghi</label>
        <label class="checkbox-label"><input id="rolloverCopyStadiumsV50" type="checkbox" checked /> Copia stadi</label>
        <label class="checkbox-label"><input id="rolloverCopyRostersV50" type="checkbox" checked /> Copia rose</label>
        <label class="checkbox-label"><input id="rolloverCopyBalancesV50" type="checkbox" checked /> Mantieni saldo FM finale</label>
        <label class="checkbox-label"><input id="rolloverCopyUsersV50" type="checkbox" checked /> Copia utenti squadra approvati</label>
        <label class="checkbox-label"><input id="rolloverGenerateCompetitionsV50" type="checkbox" checked /> Genera competizioni standard</label>
        <div class="form-actions span-2">
          <button class="button button-primary" type="submit">Riversa stagione</button>
          <span id="seasonRolloverStatusV50" class="form-status"></span>
        </div>
      </form>
      <small class="field-hint">Dopo il riversamento rigenera gli snapshot pubblici. I presidenti anagrafici non vengono duplicati: vengono collegati alla nuova squadra stagionale.</small>
    `);
  }

  function inferNextSeasonIdV50(sourceSeasonId) {
    const match = String(sourceSeasonId || "").match(/(\d{4})\D+(\d{4})/);
    if (!match) return "";
    return `${Number(match[1]) + 1}-${Number(match[2]) + 1}`;
  }

  async function saveDefaultCompetitionsV50(targetSeasonId) {
    const defaults = [
      { id: `${targetSeasonId}_campionato`, name: "Campionato", type: "REGULAR_SEASON", formula: "CLASSIFICA", status: "PLANNED" },
      { id: `${targetSeasonId}_coppa_italia`, name: "Coppa Italia", type: "COPPA_ITALIA", formula: "GIRONI_KO", status: "PLANNED" },
      { id: `${targetSeasonId}_champions`, name: "Champions League", type: "CHAMPIONS", formula: "GIRONI_KO", status: "PLANNED" },
      { id: `${targetSeasonId}_playoff`, name: "Playoff", type: "PLAYOFF", formula: "GIRONI_KO", status: "PLANNED" }
    ];
    for (const competition of defaults) {
      await setDoc(doc(db, "competitions", competition.id), {
        seasonId: targetSeasonId,
        name: competition.name,
        type: competition.type,
        formula: competition.formula,
        status: competition.status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    }
    return defaults.length;
  }

  async function handleSeasonRolloverV50(event) {
    event.preventDefault();
    const sourceSeasonId = document.getElementById("rolloverSourceSeasonV50")?.value || "";
    const targetSeasonId = document.getElementById("rolloverTargetSeasonV50")?.value.trim() || "";
    const targetName = document.getElementById("rolloverTargetNameV50")?.value.trim() || `Stagione ${targetSeasonId}`;
    const initialBudget = parseDecimalValue(document.getElementById("rolloverInitialBudgetV50")?.value || "500") || 0;
    const copySeasonTeams = document.getElementById("rolloverCopySeasonTeamsV50")?.checked;
    const copyStadiums = document.getElementById("rolloverCopyStadiumsV50")?.checked;
    const copyRosters = document.getElementById("rolloverCopyRostersV50")?.checked;
    const copyBalances = document.getElementById("rolloverCopyBalancesV50")?.checked;
    const copyUsers = document.getElementById("rolloverCopyUsersV50")?.checked;
    const generateCompetitions = document.getElementById("rolloverGenerateCompetitionsV50")?.checked;

    if (!sourceSeasonId || !targetSeasonId) {
      showMessage("seasonRolloverStatusV50", "Indica stagione origine e destinazione.", true);
      return;
    }
    if (sourceSeasonId === targetSeasonId) {
      showMessage("seasonRolloverStatusV50", "La stagione destinazione deve essere diversa dall'origine.", true);
      return;
    }

    try {
      showMessage("seasonRolloverStatusV50", "Riversamento in corso...");
      if (!state.hasFullData) await loadFullDataV32({ render: false });

      await setDoc(doc(db, "seasons", targetSeasonId), {
        id: targetSeasonId,
        name: targetName,
        isCurrent: false,
        participantCount: (state.raw.seasonTeams || []).filter((item) => item.seasonId === sourceSeasonId).length,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      const sourceSeasonTeams = (state.raw.seasonTeams || []).filter((item) => item.seasonId === sourceSeasonId);
      const sourceToTargetSeasonTeamId = new Map();
      let seasonTeamsCreated = 0;
      let stadiumsCreated = 0;
      let rostersCreated = 0;
      let movementsCreated = 0;
      let usersUpdated = 0;
      let competitionsCreated = 0;

      if (copySeasonTeams) {
        for (const seasonTeam of sourceSeasonTeams) {
          const targetId = `${safeIdPart(targetSeasonId)}_${safeIdPart(seasonTeam.teamId || seasonTeam.id)}`;
          sourceToTargetSeasonTeamId.set(seasonTeam.id, targetId);
          const payload = {
            ...seasonTeam,
            id: targetId,
            seasonId: targetSeasonId,
            previousSeasonTeamId: seasonTeam.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };
          delete payload.createdAtText;
          await setDoc(doc(db, "seasonTeams", targetId), payload, { merge: true });
          seasonTeamsCreated += 1;
        }
      }

      if (copyStadiums) {
        for (const stadium of state.raw.stadiums || []) {
          const targetSeasonTeamId = sourceToTargetSeasonTeamId.get(stadium.seasonTeamId);
          if (!targetSeasonTeamId) continue;
          const targetId = `${safeIdPart(targetSeasonId)}_${safeIdPart(targetSeasonTeamId)}_stadium`;
          await setDoc(doc(db, "stadiums", targetId), {
            ...stadium,
            id: targetId,
            seasonId: targetSeasonId,
            seasonTeamId: targetSeasonTeamId,
            previousStadiumId: stadium.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }, { merge: true });
          stadiumsCreated += 1;
        }
      }

      if (copyRosters) {
        for (const entry of state.raw.rosterEntries || []) {
          if (entry.seasonId !== sourceSeasonId) continue;
          const targetSeasonTeamId = sourceToTargetSeasonTeamId.get(entry.seasonTeamId);
          if (!targetSeasonTeamId) continue;
          const targetId = `${safeIdPart(targetSeasonId)}_${safeIdPart(targetSeasonTeamId)}_${safeIdPart(entry.playerName || entry.id)}`;
          await setDoc(doc(db, "rosterEntries", targetId), {
            ...entry,
            id: targetId,
            seasonId: targetSeasonId,
            seasonTeamId: targetSeasonTeamId,
            previousRosterEntryId: entry.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          }, { merge: true });
          rostersCreated += 1;
        }
      }

      for (const sourceSeasonTeam of sourceSeasonTeams) {
        const targetSeasonTeamId = sourceToTargetSeasonTeamId.get(sourceSeasonTeam.id);
        if (!targetSeasonTeamId) continue;
        const amount = copyBalances ? getTeamFmBalance(sourceSeasonTeam.id) : initialBudget;
        const movementId = `${safeIdPart(targetSeasonId)}_${safeIdPart(targetSeasonTeamId)}_initial_budget`;
        await setDoc(doc(db, "fmMovements", movementId), {
          id: movementId,
          seasonId: targetSeasonId,
          seasonTeamId: targetSeasonTeamId,
          type: "INITIAL_BUDGET",
          amount,
          date: new Date().toISOString().slice(0, 10),
          description: copyBalances ? "Saldo riversato dalla stagione precedente" : "Budget iniziale nuova stagione",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true });
        movementsCreated += 1;
      }

      if (copyUsers) {
        for (const teamUser of state.raw.teamUsers || []) {
          if (teamUser.status !== "ACTIVE") continue;
          const targetSeasonTeamId = sourceToTargetSeasonTeamId.get(teamUser.seasonTeamId);
          if (!targetSeasonTeamId) continue;
          await setDoc(doc(db, "teamUsers", teamUser.id), {
            ...teamUser,
            seasonId: targetSeasonId,
            seasonTeamId: targetSeasonTeamId,
            previousSeasonTeamId: teamUser.seasonTeamId,
            updatedAt: serverTimestamp()
          }, { merge: true });
          usersUpdated += 1;
        }
      }

      if (generateCompetitions) competitionsCreated = await saveDefaultCompetitionsV50(targetSeasonId);

      await loadFullDataV32({ render: true });
      expandAdminPanel("adminSeasonRolloverPanel");
      showMessage("seasonRolloverStatusV50", `Riversamento completato: ${seasonTeamsCreated} squadre, ${stadiumsCreated} stadi, ${rostersCreated} giocatori, ${movementsCreated} saldi, ${usersUpdated} utenti, ${competitionsCreated} competizioni.`);
    } catch (error) {
      console.error(error);
      showMessage("seasonRolloverStatusV50", error?.message || "Errore durante il riversamento.", true);
    }
  }

  async function sendTransferCommunicationEmailV50(payload) {
    const emailModule = await import("./emailjs.js");
    const teamName = getSeasonTeamDisplayName(payload.seasonTeamId) || payload.teamName || "Squadra";
    await emailModule.sendTransferEmail({
      to_email: "caparrotti86@yahoo.it",
      team_name: teamName,
      president_name: payload.createdByName || getCurrentUserDisplayName(),
      title: payload.title || "Comunicato avvenuto scambio",
      message: payload.body || payload.message || "",
      created_at: new Date().toLocaleString("it-IT"),
      subject: `Comunicato avvenuto scambio ${teamName}`
    });
  }

  function enhanceTransferCommunicationFormV50() {
    const target = document.getElementById("teamAreaBody");
    const approved = typeof getApprovedTeamUser === "function" ? getApprovedTeamUser() : null;
    if (!target || !approved || document.getElementById("teamTransferCommunicationFormV50")) return;
    const newsPanel = document.getElementById("teamNewsRequestForm")?.closest("section, article");
    const html = `
      <section class="panel">
        <div class="panel-header compact"><div><h2>Comunicato avvenuto scambio</h2><p>Invia un comunicato alla lega via email e salvalo tra le richieste.</p></div></div>
        <form id="teamTransferCommunicationFormV50" class="form-grid">
          <label class="span-2">Titolo<input id="teamTransferTitleV50" class="input" type="text" value="Comunicato avvenuto scambio" required /></label>
          <label class="span-2">Testo comunicato<textarea id="teamTransferBodyV50" class="input textarea" rows="5" required></textarea></label>
          <label>Giocatori coinvolti <span class="muted">(opzionale)</span><input id="teamTransferPlayersV50" class="input" type="text" /></label>
          <label>Squadra coinvolta <span class="muted">(opzionale)</span><input id="teamTransferOtherTeamV50" class="input" type="text" /></label>
          <div class="form-actions span-2"><button class="button button-primary" type="submit">Invia comunicato di scambio</button><span id="teamTransferStatusV50" class="form-status"></span></div>
        </form>
        <small class="field-hint">La mail viene inviata a caparrotti86@yahoo.it con oggetto: Comunicato avvenuto scambio NOME_SQUADRA.</small>
      </section>`;
    if (newsPanel) newsPanel.insertAdjacentHTML("afterend", html);
    else target.insertAdjacentHTML("beforeend", html);

    document.getElementById("teamTransferCommunicationFormV50")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        showMessage("teamTransferStatusV50", "Invio comunicato in corso...");
        const payload = {
          ...buildBaseTeamRequestPayloadV34("TRANSFER_NEWS"),
          title: document.getElementById("teamTransferTitleV50")?.value || "Comunicato avvenuto scambio",
          body: document.getElementById("teamTransferBodyV50")?.value || "",
          players: document.getElementById("teamTransferPlayersV50")?.value || "",
          otherTeam: document.getElementById("teamTransferOtherTeamV50")?.value || "",
          emailTo: "caparrotti86@yahoo.it"
        };
        await addDoc(collection(db, "teamRequests"), payload);
        await sendTransferCommunicationEmailV50(payload);
        showMessage("teamTransferStatusV50", "Comunicato salvato e email inviata alla lega.");
        event.target.reset();
      } catch (error) {
        console.error(error);
        showMessage("teamTransferStatusV50", error?.message || "Errore durante invio comunicato.", true);
      }
    });
  }

  const renderUserAreaBeforeV50 = typeof renderUserAreaV34 === "function" ? renderUserAreaV34 : null;
  if (renderUserAreaBeforeV50) {
    renderUserAreaV34 = function renderUserAreaV50() {
      renderUserAreaBeforeV50();
      enhanceTransferCommunicationFormV50();
    };
  }

  const renderAdminAreaBeforeV50 = typeof renderAdminArea === "function" ? renderAdminArea : null;
  if (renderAdminAreaBeforeV50) {
    renderAdminArea = function renderAdminAreaV50() {
      renderAdminAreaBeforeV50();
      if (!state.isAdmin) return;
      const adminPanel = document.getElementById("adminPanel");
      if (!adminPanel || document.getElementById("adminSeasonRolloverPanel")) return;
      const snapshotPanel = document.getElementById("adminPublicSnapshotsPanel");
      if (snapshotPanel) snapshotPanel.insertAdjacentHTML("beforebegin", renderSeasonRolloverAdminPanelV50());
      else adminPanel.insertAdjacentHTML("beforeend", renderSeasonRolloverAdminPanelV50());
      const rolloverToggle = document.querySelector('#adminSeasonRolloverPanel [data-admin-toggle-panel]');
      rolloverToggle?.addEventListener("click", () => toggleAdminPanel(rolloverToggle.dataset.adminTogglePanel));
      document.getElementById("seasonRolloverFormV50")?.addEventListener("submit", handleSeasonRolloverV50);
      const sourceSelect = document.getElementById("rolloverSourceSeasonV50");
      const targetInput = document.getElementById("rolloverTargetSeasonV50");
      const targetName = document.getElementById("rolloverTargetNameV50");
      if (sourceSelect && getCurrentSeasonId()) sourceSelect.value = getCurrentSeasonId();
      sourceSelect?.addEventListener("change", () => {
        const next = inferNextSeasonIdV50(sourceSelect.value);
        if (targetInput && !targetInput.value) targetInput.value = next;
        if (targetName && !targetName.value) targetName.value = next ? `Stagione ${next}` : "";
      });
    };
  }

  const attachAdminHandlersBeforeV50 = typeof attachAdminHandlers === "function" ? attachAdminHandlers : null;
  if (attachAdminHandlersBeforeV50) {
    attachAdminHandlers = function attachAdminHandlersV50() {
      attachAdminHandlersBeforeV50();
      const rolloverToggle = document.querySelector('#adminSeasonRolloverPanel [data-admin-toggle-panel]');
      rolloverToggle?.addEventListener("click", () => toggleAdminPanel(rolloverToggle.dataset.adminTogglePanel));
      document.getElementById("seasonRolloverFormV50")?.addEventListener("submit", handleSeasonRolloverV50);
    };
  }
})();


/* V52 - Hotfix public rendering: startup stays last, competitions are ordered, dashboard news are on top. */
function getCompetitionTypeOrderV52(competition) {
  const order = {
    CAMPIONATO: 0,
    CHAMPIONS_LEAGUE: 1,
    COPPA_ITALIA: 2,
    PLAYOFF: 3,
    ALTRO: 4
  };
  return order[competition?.type] ?? 99;
}

function competitionHasProgrammedMatchesV52(competition) {
  if (!competition?.id) return false;
  return (state.raw.competitionMatches || []).some((match) => {
    if (match.competitionId !== competition.id) return false;
    const status = String(match.status || '').toUpperCase();
    return status !== 'GIOCATA' && status !== 'CONCLUSA' && status !== 'ANNULLATA';
  });
}

function getCompetitionDisplayPriorityV52(competition) {
  const status = String(competition?.status || '').toUpperCase();
  if (status === 'ATTIVA' && competitionHasProgrammedMatchesV52(competition)) return 0;
  if (status === 'ATTIVA') return 1;
  if (status === 'PROGRAMMATA') return 2;
  if (status === 'CONCLUSA') return 3;
  return 4;
}

function compareCompetitionsForPublicDisplayV52(a, b) {
  const priorityCompare = getCompetitionDisplayPriorityV52(a) - getCompetitionDisplayPriorityV52(b);
  if (priorityCompare) return priorityCompare;
  const sortA = Number(a?.sortOrder ?? a?.order ?? Number.NaN);
  const sortB = Number(b?.sortOrder ?? b?.order ?? Number.NaN);
  if (Number.isFinite(sortA) || Number.isFinite(sortB)) {
    const sortCompare = (Number.isFinite(sortA) ? sortA : 999) - (Number.isFinite(sortB) ? sortB : 999);
    if (sortCompare) return sortCompare;
  }
  const typeCompare = getCompetitionTypeOrderV52(a) - getCompetitionTypeOrderV52(b);
  if (typeCompare) return typeCompare;
  return String(a?.name || a?.id || '').localeCompare(String(b?.name || b?.id || ''), 'it', { numeric: true, sensitivity: 'base' });
}

function getSeasonCompetitionsForPublicDisplayV52(seasonId = getCurrentSeasonId()) {
  return (state.raw.competitions || [])
    .filter((competition) => competition.seasonId === seasonId)
    .sort(compareCompetitionsForPublicDisplayV52);
}

renderDashboardCalendar = function renderDashboardCalendarV52(seasonId) {
  const target = document.getElementById('dashboardCalendar');
  if (!target) return;

  const groups = getSeasonCompetitionsForPublicDisplayV52(seasonId)
    .map((competition) => {
      const matches = isRankingCompetition(competition)
        ? getNextChampionshipMatches(competition)
        : getCupScheduleMatches(competition);
      return {
        competition,
        label: isRankingCompetition(competition) ? 'Prossima giornata' : 'Programmazione coppa',
        matches
      };
    })
    .filter((group) => group.matches.length);

  if (!groups.length) {
    target.innerHTML = `<p class="muted">Nessuna partita programmata o giocata per questa stagione.</p>`;
    return;
  }

  target.innerHTML = groups.map((group) => `
    <details class="dashboard-calendar-group dashboard-subsection" open>
      <summary>
        <span>
          <strong>${escapeHtml(group.competition.name)}</strong>
          <small>${escapeHtml(group.label)}</small>
        </span>
        <span class="button button-secondary button-small details-toggle-label" aria-hidden="true">Ingrandisci/Riduci</span>
      </summary>
      <div class="table-wrap match-table-wrap dashboard-calendar-table-wrap">
        <table class="dashboard-calendar-table">
          <thead>
            <tr>
              <th>Fase</th>
              <th>Partita</th>
              <th>Data</th>
              <th class="number">Risultato</th>
            </tr>
          </thead>
          <tbody>
            ${group.matches.map((match) => `
              <tr>
                <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
                <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
                <td data-label="Data">${escapeHtml(match.matchDate || '-')}</td>
                <td data-label="Risultato" class="number">${escapeHtml(formatMatchResult(match))}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </details>`).join('');
};

renderDashboard = function renderDashboardV52() {
  const seasonId = getCurrentSeasonId();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const competitions = getSeasonCompetitionsForPublicDisplayV52(seasonId);
  const stats = typeof getSeasonFmStats === 'function' ? getSeasonFmStats(seasonId) : null;

  const metricClubs = document.getElementById('metricClubs');
  const metricTotalFm = document.getElementById('metricTotalFm');
  const metricAlerts = document.getElementById('metricAlerts');

  if (metricClubs) metricClubs.textContent = String(seasonTeams.length || getParticipantsCount(seasonId) || 0);
  if (metricTotalFm) metricTotalFm.textContent = stats ? `${formatFm(stats.total)} (medio ${formatFm(stats.average)})` : '- (medio -)';
  if (metricAlerts) metricAlerts.textContent = String(competitions.filter((competition) => competition.status === 'ATTIVA').length);

  const standings = document.getElementById('dashboardStandings');
  if (standings) {
    standings.innerHTML = competitions.length
      ? competitions.map((competition) => `
        <details class="stack-item dashboard-subsection dashboard-competition-subsection" open>
          <summary>
            <span>
              <strong>${escapeHtml(getCompetitionPublicDisplayNameV110(competition))}</strong>
              <small class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</small>
            </span>
            <span class="button button-secondary button-small details-toggle-label" aria-hidden="true">Ingrandisci/Riduci</span>
          </summary>
          ${renderDashboardCompetitionSummary(competition)}
        </details>`).join('')
      : `<p class="muted">Nessuna competizione inserita per questa stagione.</p>`;
  }

  renderDashboardCalendar(seasonId);
  renderDashboardNewsV42();
  if (typeof normalizeToggleLabelsV29 === 'function') normalizeToggleLabelsV29();
};

renderCompetitionsPublic = function renderCompetitionsPublicV52() {
  const list = document.getElementById('competitionsList');
  if (!list) return;

  const seasonId = getCurrentSeasonId();
  const competitions = getSeasonCompetitionsForPublicDisplayV52(seasonId);

  if (!competitions.length) {
    list.innerHTML = `<p class="muted">Nessuna competizione inserita per ${escapeHtml(seasonId || 'la stagione selezionata')}.</p>`;
    return;
  }

  list.innerHTML = competitions.map((competition) => `
    <article class="competition-card">
      <div class="competition-card-header">
        <div>
          <h3>${escapeHtml(competition.name)}</h3>
        </div>
        <span class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</span>
      </div>
      ${competition.notes ? `<p>${escapeHtml(competition.notes)}</p>` : ''}
      ${renderCompetitionResultsPublic(competition)}
      ${renderCompetitionMatchesPublic(competition)}
    </article>
  `).join('');
};

const updateUserVisibilityBeforeV52 = updateUserVisibilityV34;
updateUserVisibilityV34 = function updateUserVisibilityV52() {
  updateUserVisibilityBeforeV52?.();
  const logoutBtn = document.getElementById('logoutBtn');
  const openLoginBtn = document.getElementById('openLoginBtn');
  logoutBtn?.classList.toggle('hidden', !state.user);
  if (openLoginBtn && state.user && !state.isAdmin) {
    openLoginBtn.textContent = 'Account';
    openLoginBtn.classList.remove('hidden');
  }
};

const updateAdminVisibilityBeforeV52 = updateAdminVisibility;
updateAdminVisibility = function updateAdminVisibilityV52() {
  updateAdminVisibilityBeforeV52?.();
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn?.classList.toggle('hidden', !state.user);
};



/* V79 - Requested updates after refactor. */
const renderTeamRequestsAdminPanelBeforeV79 = renderTeamRequestsAdminPanelV34;
renderTeamRequestsAdminPanelV34 = function renderTeamRequestsAdminPanelV79() {
  const requests = (state.raw.teamRequests || [])
    .filter((request) => request.type !== "TRANSFER_NEWS")
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  const rows = requests.map((request) => `
    <div class="admin-list-item">
      <span>
        <strong>${escapeHtml(requestTypeLabel(request.type))} · ${escapeHtml(getSeasonTeamDisplayName(request.seasonTeamId))}</strong>
        <small>${escapeHtml(request.createdByName || request.createdByEmail || request.createdBy || "")} · ${escapeHtml(requestStatusLabel(request.status))}</small>
        <small>${escapeHtml(request.title || request.playerName || request.description || request.body || request.notes || "")}</small>
      </span>
      <span>
        ${request.status === "PENDING" ? `<button class="button button-primary button-small" type="button" data-approve-request="${escapeHtml(request.id)}">Approva</button><button class="button button-danger button-small" type="button" data-reject-request="${escapeHtml(request.id)}">Rifiuta</button>` : `<span class="status status-muted">${escapeHtml(requestStatusLabel(request.status))}</span>`}
      </span>
    </div>`).join("") || `<p class="muted admin-empty-message">Nessuna richiesta presidente.</p>`;
  return renderAdminPanel("adminTeamRequestsPanel", "Presidenti", "Richieste presidenti", "Approva o rifiuta movimenti, acquisti, svincoli e comunicati squadra ordinari. I comunicati di avvenuto scambio vengono pubblicati direttamente.", `<div class="admin-list">${rows}</div>`);
};

async function sendTransferCommunicationEmailV79(payload) {
  const emailModule = await import("./emailjs.js");
  const teamName = getSeasonTeamDisplayName(payload.seasonTeamId) || payload.teamName || "Squadra";
  await emailModule.sendTransferEmail({
    to_email: "caparrotti86@yahoo.it",
    team_name: teamName,
    president_name: payload.createdByName || getCurrentUserDisplayName(),
    title: payload.title || "Comunicato avvenuto scambio",
    message: payload.body || payload.message || "",
    created_at: new Date().toLocaleString("it-IT"),
    subject: `Comunicato avvenuto scambio ${teamName}`
  });
}

function upgradeTransferCommunicationFormV79() {
  const form = document.getElementById("teamTransferCommunicationFormV50");
  if (!form || form.dataset.v79DirectPublish === "1") return;
  const panelText = form.closest("section")?.querySelector(".panel-header p");
  if (panelText) panelText.textContent = "Pubblica subito il comunicato in News e invia una email alla lega. Non serve approvazione admin.";
  const hint = form.closest("section")?.querySelector(".field-hint");
  if (hint) hint.textContent = "Il comunicato viene pubblicato direttamente nelle News e inviato via email a caparrotti86@yahoo.it.";
  const cleanForm = form.cloneNode(true);
  cleanForm.dataset.v79DirectPublish = "1";
  form.replaceWith(cleanForm);
  cleanForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      showMessage("teamTransferStatusV50", "Pubblicazione comunicato in corso...");
      const base = buildBaseTeamRequestPayloadV34("TRANSFER_NEWS");
      const payload = {
        title: document.getElementById("teamTransferTitleV50")?.value || "Comunicato avvenuto scambio",
        body: document.getElementById("teamTransferBodyV50")?.value || "",
        topic: "COMUNICATO_SQUADRA",
        seasonId: base.seasonId || getCurrentSeasonId(),
        teamId: base.teamId || "",
        seasonTeamId: base.seasonTeamId || "",
        authorUid: base.createdBy || "",
        createdByName: base.createdByName || getCurrentUserDisplayName(),
        players: document.getElementById("teamTransferPlayersV50")?.value || "",
        otherTeam: document.getElementById("teamTransferOtherTeamV50")?.value || "",
        publishedAt: getNowLocalDateTimeInputValueV79(),
        createdAt: serverTimestamp(),
        createdBy: state.user?.uid || ""
      };
      await addDoc(collection(db, "news"), payload);
      await sendTransferCommunicationEmailV79(payload);
      showMessage("teamTransferStatusV50", "Comunicato pubblicato nelle News ed email inviata alla lega.");
      cleanForm.reset();
      await loadFullDataV32({ render: true });
    } catch (error) {
      console.error(error);
      showMessage("teamTransferStatusV50", error?.message || "Errore durante pubblicazione comunicato.", true);
    }
  });
}

const renderUserAreaBeforeV79 = renderUserAreaV34;
renderUserAreaV34 = function renderUserAreaV79() {
  renderUserAreaBeforeV79?.();
  upgradeTransferCommunicationFormV79();
};

renderCompetitionMatchesPublic = function renderCompetitionMatchesPublicV79(competition) {
  const matches = getCompetitionMatches(competition.id);
  const scheduledMatches = sortMatchesForDisplay(matches.filter((match) => String(match.status || "").toUpperCase() !== "GIOCATA")).slice(0, 5);
  const playedMatches = sortMatchesForDisplay(matches.filter((match) => String(match.status || "").toUpperCase() === "GIOCATA")).slice(0, 5);

  if (!playedMatches.length && !scheduledMatches.length) {
    return `<p class="muted">Nessuna partita inserita per questa competizione.</p>`;
  }

  return `
    <div class="competition-matches-public">
      ${scheduledMatches.length ? `
        <div class="detail-section compact-detail-section">
          <h4>Partite da disputare</h4>
          ${renderMatchRows(scheduledMatches, "Nessuna partita da disputare.")}
        </div>` : ""}
      ${playedMatches.length ? `
        <div class="detail-section compact-detail-section">
          <h4>Partite già disputate</h4>
          ${renderMatchRows(playedMatches, "Nessuna partita disputata.")}
        </div>` : ""}
    </div>`;
};

const renderAllBeforeV79 = renderAll;
renderAll = function renderAllV79() {
  const result = renderAllBeforeV79();
  upgradeTransferCommunicationFormV79();
  return result;
};

/* V58 - Mobile roster accordion and page scroll handle.
   Scroll-handle implementation lives in js/mobile/mobile-scrollbar.js. */
ensureMobilePageScrollHandle();
window.addEventListener("load", ensureMobilePageScrollHandle);
document.addEventListener("DOMContentLoaded", ensureMobilePageScrollHandle);



/* V87 - Dashboard mobile/news refinements and result summaries. */
function getCompetitionWinnerResultV87(competition) {
  return getCompetitionResults(competition?.id || '').find((result) => Number(result.position) === 1) || null;
}

function getFirstUpcomingMatchV87(competition) {
  const matches = getUpcomingMatchesForCompetition(competition).filter((match) => String(match.status || '').toUpperCase() !== 'ANNULLATA');
  if (!matches.length) return null;
  return matches[matches.length - 1] || matches[0];
}

function renderCompactSingleMatchLineV87(match) {
  if (!match) return '';
  return `
    <div class="compact-match-line dashboard-next-match-line">
      <span>${renderStaticMatchTeamNameV101(match, "home", { strong: false })} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}</span>
      <strong>${escapeHtml(match.matchDate || formatMatchStage(match) || 'Da programmare')}</strong>
    </div>`;
}

renderDashboardCompetitionSummary = function renderDashboardCompetitionSummaryV87(competition) {
  const winner = getCompetitionWinnerResultV87(competition);
  if (winner?.seasonTeamId) {
    return `<div class="dashboard-competition-summary dashboard-winner-line"><span class="muted">Vincitore:</span> ${renderSeasonTeamNameWithLogo(winner.seasonTeamId, { textClass: 'text-success' })}</div>`;
  }

  if (isRankingCompetition(competition)) {
    const nextMatches = getNextChampionshipMatches(competition);
    if (nextMatches.length) {
      const first = nextMatches[0];
      const label = `Prossima giornata programmata${first.matchday || first.matchDate ? `: ${first.matchday || first.matchDate}` : ''}`;
      return `<div class="dashboard-competition-summary"><span class="muted">${escapeHtml(label)}</span>${renderCompactMatchLines(nextMatches)}</div>`;
    }
    return `<div class="dashboard-competition-summary"><span class="muted">Nessuna prossima giornata programmata.</span></div>`;
  }

  const nextMatch = getFirstUpcomingMatchV87(competition);
  if (nextMatch) {
    const label = `Prossima partita${formatMatchStage(nextMatch) ? ` · ${formatMatchStage(nextMatch)}` : ''}`;
    return `<div class="dashboard-competition-summary"><span class="muted">${escapeHtml(label)}</span>${renderCompactSingleMatchLineV87(nextMatch)}</div>`;
  }

  return `<div class="dashboard-competition-summary"><span class="muted">Nessuna prossima partita programmata.</span></div>`;
};

renderDashboardCalendar = function renderDashboardCalendarV87(seasonId) {
  const target = document.getElementById('dashboardCalendar');
  if (!target) return;

  const groups = getSeasonCompetitionsForPublicDisplayV52(seasonId)
    .map((competition) => {
      const matches = isRankingCompetition(competition)
        ? getLatestChampionshipMatches(competition)
        : getPlayedMatchesForCompetition(competition).slice(0, 5);
      return {
        competition,
        label: isRankingCompetition(competition) ? 'Ultima giornata giocata' : 'Ultime partite disputate',
        matches
      };
    })
    .filter((group) => group.matches.length);

  if (!groups.length) {
    target.innerHTML = `<p class="muted">Nessun risultato registrato per questa stagione.</p>`;
    return;
  }

  target.innerHTML = groups.map((group) => `
    <details class="dashboard-calendar-group dashboard-subsection" open>
      <summary>
        <span>
          <strong>${escapeHtml(group.competition.name)}</strong>
          <small>${escapeHtml(group.label)}</small>
        </span>
        <span class="button button-secondary button-small details-toggle-label" aria-hidden="true">Riduci</span>
      </summary>
      <div class="table-wrap match-table-wrap dashboard-calendar-table-wrap">
        <table class="dashboard-calendar-table">
          <thead>
            <tr>
              <th>Fase</th>
              <th>Partita</th>
              <th>Data</th>
              <th class="number">Risultato</th>
            </tr>
          </thead>
          <tbody>
            ${group.matches.map((match) => `
              <tr>
                <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
                <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
                <td data-label="Data">${escapeHtml(match.matchDate || '-')}</td>
                <td data-label="Risultato" class="number">${escapeHtml(formatMatchResult(match))}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </details>`).join('');
};

renderDashboardNewsV42 = function renderDashboardNewsV87() {
  const dashboardPage = document.querySelector('[data-page="dashboard"]');
  const metrics = dashboardPage?.querySelector('[aria-label="Indicatori principali"]');
  if (!dashboardPage || !metrics) return;

  let panel = document.getElementById('dashboardNewsPanel');
  if (!panel) {
    panel = document.createElement('section');
    panel.id = 'dashboardNewsPanel';
    panel.className = 'panel dashboard-news-panel';
    panel.innerHTML = `
      <div class="panel-header compact">
        <div>
          <h2>Ultime news e comunicati</h2>
          <p>Le ultime 3 comunicazioni pubblicate nella stagione selezionata.</p>
        </div>
        <div class="panel-actions dashboard-news-header-actions">
          <button class="button button-secondary button-small" type="button" data-v42-page-link="news">Vedi tutte</button>
        </div>
      </div>
      <div id="dashboardNewsList" class="dashboard-news-list"><p class="muted">Caricamento...</p></div>`;
  } else {
    const description = panel.querySelector('.panel-header p');
    if (description) description.textContent = 'Le ultime 3 comunicazioni pubblicate nella stagione selezionata.';
  }

  if (panel.nextElementSibling !== metrics) {
    metrics.insertAdjacentElement('beforebegin', panel);
  }

  const target = document.getElementById('dashboardNewsList');
  if (!target) return;
  const rows = getVisibleNewsForSeasonV79(3);

  target.innerHTML = rows.length ? rows.map((news, index) => {
    const preview = getDashboardNewsPreview(news.body || '', 220);
    return `
      <details class="dashboard-news-card dashboard-news-details" ${index === 0 ? 'open' : ''}>
        <summary class="dashboard-news-summary">
          <span>
            <small class="muted">${escapeHtml(getNewsTopicTextV79(news))}</small>
            <strong>${escapeHtml(news.title || 'Comunicato')}</strong>
            ${news.seasonTeamId ? `<small class="dashboard-news-team-line">${renderSeasonTeamNameWithLogo(news.seasonTeamId, { strong: false, noLink: true })}</small>` : ''}
          </span>
          <span class="dashboard-news-side">
            <small class="muted">${escapeHtml(formatNewsDateTimeV79(getNewsRawDateValueV79(news)))}</small>
          </span>
        </summary>
        <div class="dashboard-news-detail-body">
          ${preview ? `<p class="dashboard-news-preview news-body-preserve">${renderBoldMarkdown(preview)}</p>` : ''}
          <button class="button button-secondary button-small" type="button" data-v42-page-link="news">Leggi tutte</button>
        </div>
      </details>`;
  }).join('') : `<p class="muted">Nessuna news pubblicata.</p>`;
};

const renderDashboardBeforeV87 = renderDashboard;
renderDashboard = function renderDashboardV87() {
  const result = renderDashboardBeforeV87();
  renderDashboardNewsV42();
  if (typeof normalizeToggleLabelsV29 === 'function') normalizeToggleLabelsV29();
  return result;
};

/* V51 - Startup after all incremental patches.
   The previous v50 initialized before the v50 overrides were registered, so
   rollover, transfer communications and some president-account handlers were
   not active. */

/* V89 - Theme switch and admin-only refresh button. */
function applyZonaOrientaleThemeV89(theme) {
  const finalTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = finalTheme;
  const toggle = document.getElementById("themeToggleBtn");
  if (toggle) {
    toggle.setAttribute("aria-pressed", finalTheme === "light" ? "true" : "false");
    const icon = toggle.querySelector(".theme-toggle-icon");
    const text = toggle.querySelector(".theme-toggle-text");
    if (icon) icon.textContent = finalTheme === "light" ? "☀️" : "🌙";
    if (text) text.textContent = finalTheme === "light" ? "Light" : "Dark";
  }
}

function setupThemeToggleV89() {
  const savedTheme = localStorage.getItem("zonaOrientaleTheme") || "dark";
  applyZonaOrientaleThemeV89(savedTheme);
  document.getElementById("themeToggleBtn")?.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    localStorage.setItem("zonaOrientaleTheme", next);
    applyZonaOrientaleThemeV89(next);
  });
}

const updateAdminVisibilityBeforeV89 = updateAdminVisibility;
updateAdminVisibility = function updateAdminVisibilityV89() {
  updateAdminVisibilityBeforeV89?.();
  document.getElementById("refreshBtn")?.classList.toggle("hidden", !state.isAdmin);
};



/* V90 - Player links in rosters, honor profile links and latest listone per season. */
function getListoneSortTimestampV90(listone) {
  const candidates = [listone?.loadedAt, listone?.meta?.loadedAt, listone?.id].filter(Boolean);
  for (const candidate of candidates) {
    const parsed = Date.parse(String(candidate));
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

const getListoniForCurrentSeasonBeforeV90 = getListoniForCurrentSeason;
getListoniForCurrentSeason = function getListoniForCurrentSeasonV90() {
  return [...(getListoniForCurrentSeasonBeforeV90?.() || [])].sort((a, b) => {
    const byDate = getListoneSortTimestampV90(b) - getListoneSortTimestampV90(a);
    if (byDate) return byDate;
    return String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || ''), 'it', { numeric: true });
  });
};

function getPlayerPageUrlV90(player) {
  const listonePlayer = findListonePlayerForRosterPlayer(player);
  const merged = { ...(player || {}), ...(listonePlayer || {}) };
  const playerUrl = buildFantacalcioPlayerUrl(merged);
  if (!playerUrl) return '';
  const label = merged.playerName || player?.playerName || player?.name || 'Giocatore';
  return `./player.html?url=${encodeURIComponent(playerUrl)}&name=${encodeURIComponent(label)}`;
}

function renderPlayerNameLinkV90(player, extraClass = '') {
  const name = escapeHtml(player?.playerName || player?.name || '-');
  const pageUrl = getPlayerPageUrlV90(player);
  if (!pageUrl) return `<strong>${name}</strong>`;
  return `<a class="link-button roster-player-link ${escapeHtml(extraClass)}" href="${pageUrl}" target="_blank" rel="noopener"><strong>${name}</strong></a>`;
}

function renderRosterPlayerTableV90(players) {
  if (!players.length) return `<p class="muted">Nessun giocatore in rosa.</p>`;
  return `
    <div class="table-wrap mobile-tabular-wrap roster-table-wrap roster-inline-table-wrap">
      <table class="mobile-tabular roster-main-table roster-player-table roster-sticky-table">
        <thead>
          <tr>
            <th class="roster-col-player">${renderRosterSortButton('playerName', 'Giocatore')}</th>
            <th class="roster-col-role">${renderRosterSortButton('role', 'R (RM)')}</th>
            <th class="roster-col-team">${renderRosterSortButton('realTeam', 'Sq')}</th>
            <th class="number roster-col-cost">${renderRosterSortButton('cost', 'Costo', true)}</th>
            <th class="number roster-col-qta">${renderRosterSortButton('quotationCurrent', 'Qt.A', true)}</th>
          </tr>
        </thead>
        <tbody>
          ${sortRosterPlayersForDisplay(players).map((player) => `
            <tr>
              <td data-label="Giocatore" class="roster-col-player">${renderPlayerNameLinkV90(player)}</td>
              <td data-label="R (RM)" class="roster-col-role">${getRosterRoleDisplay(player)}</td>
              <td data-label="Sq" class="roster-col-team">${escapeHtml(player.realTeam || '-')}</td>
              <td data-label="Costo" class="number roster-col-cost">${escapeHtml(player.cost ?? '-')}</td>
              <td data-label="Qt.A" class="number roster-col-qta">${formatListoneNumber(getRosterPlayerQuotationCurrent(player))}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}
renderRosterPlayerTable = renderRosterPlayerTableV90;

openTeamProfileV34 = async function openTeamProfileV90(seasonTeamId) {
  ensureV34Dom();
  const dialog = document.getElementById('teamProfileDialog');
  const title = document.getElementById('teamProfileTitle');
  const body = document.getElementById('teamProfileBody');
  if (!dialog || !body) return;
  if (title) title.textContent = getSeasonTeamDisplayName(seasonTeamId);
  body.innerHTML = `<p class="muted">Caricamento scheda squadra...</p>`;
  dialog.showModal?.();
  const snapshot = await loadTeamSnapshotV34(seasonTeamId);
  if (!snapshot) {
    body.innerHTML = `<p class="muted">Scheda squadra non ancora generata. Accedi come admin e aggiorna gli snapshot squadra.</p>`;
    return;
  }

  const rosterRows = (snapshot.rosterEntries || []).sort(compareRosterPlayersV34).map((player) => `
    <tr>
      <td data-label="Giocatore" class="team-profile-player-cell">${renderPlayerNameLinkV90(player, 'team-profile-player-link')}</td>
      <td data-label="R (RM)" class="team-profile-role-cell">${getRosterRoleDisplay(player)}</td>
      <td data-label="Sq" class="team-profile-team-cell">${escapeHtml(player.realTeam || '-')}</td>
      <td data-label="Costo" class="number team-profile-cost-cell">${formatListoneNumber(player.cost)}</td>
      <td data-label="Qt.A" class="number team-profile-qta-cell">${formatListoneNumber(getRosterPlayerQuotationCurrent(player))}</td>
    </tr>`).join('') || `<tr><td colspan="5" class="muted center">Rosa non disponibile.</td></tr>`;
  const palmaresRows = (snapshot.palmares || []).map((item) => `<tr><td>${escapeHtml(item.seasonLabel || item.seasonId)}</td><td>${escapeHtml(item.label)}</td></tr>`).join('') || `<tr><td colspan="2" class="muted center">Nessun titolo/piazzamento.</td></tr>`;
  const movementRows = (snapshot.recentMovements || []).map((movement) => `<tr><td>${escapeHtml(movement.date || '-')}</td><td>${renderFmMovementTypeBadge(movement.type)}</td><td>${escapeHtml(movement.playerName || '-')}</td><td class="number">${formatFm(movement.amount || 0)}</td></tr>`).join('') || `<tr><td colspan="4" class="muted center">Nessun movimento recente.</td></tr>`;
  const newsHtml = (snapshot.recentNews || []).map((news) => `<article class="compact-card"><h3>${escapeHtml(news.title || 'Comunicato')}</h3><p class="news-body-preserve">${renderBoldMarkdown(news.body || '')}</p><small class="muted">${escapeHtml(formatNewsDateTimeV79(getNewsRawDateValueV79(news)))}</small></article>`).join('') || `<p class="muted">Nessun comunicato squadra.</p>`;
  const matchesRows = (snapshot.recentMatches || []).map((match) => `
    <tr>
      <td>${escapeHtml(match.competitionCode || getCompetitionShortCodeById(match.competitionId))}</td>
      <td>${escapeHtml(formatMatchStage(match))}</td>
      <td>${escapeHtml(getSeasonTeamDisplayName(match.homeSeasonTeamId))} - ${escapeHtml(getSeasonTeamDisplayName(match.awaySeasonTeamId))}</td>
      <td>${escapeHtml(formatMatchResult(match))}</td>
    </tr>`).join('') || `<tr><td colspan="4" class="muted center">Nessuna partita recente.</td></tr>`;

  body.innerHTML = `
    <div class="team-profile-header team-profile-header-stacked">
      ${renderTeamLogo(snapshot.teamName, snapshot.logo, 'club-logo-lg')}
      <div class="team-profile-title-block"><h3>${escapeHtml(snapshot.teamName || 'Squadra')}</h3><p class="muted team-profile-meta-line">Presidenti: ${escapeHtml(snapshot.presidents || '-')}</p><p class="muted team-profile-meta-line">Saldo FM: ${formatFm(snapshot.fmBalance || 0)}</p><p class="muted team-profile-meta-line">Stadio: ${escapeHtml(formatStadium(snapshot.stadium))}</p></div>
    </div>
    <div class="detail-section"><h3>Rosa</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-roster-wrap"><table class="mobile-tabular team-profile-roster-table roster-sticky-table"><thead><tr><th>Giocatore</th><th>R (RM)</th><th>Sq</th><th class="number">Costo</th><th class="number">Qt.A</th></tr></thead><tbody>${rosterRows}</tbody></table></div></div>
    <div class="detail-section"><h3>Palmarès squadra</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-palmares-wrap"><table class="mobile-tabular team-profile-palmares-table"><thead><tr><th>Stagione</th><th>Risultato</th></tr></thead><tbody>${palmaresRows}</tbody></table></div></div>
    <div class="detail-section"><h3>Ultimi movimenti</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap"><table class="mobile-tabular team-profile-movements-table"><thead><tr><th>Data</th><th>Tipo</th><th>Giocatore</th><th class="number">FM</th></tr></thead><tbody>${movementRows}</tbody></table></div></div>
    <div class="detail-section"><h3>Ultimi comunicati</h3>${newsHtml}</div>
    <div class="detail-section"><h3>Ultime partite</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-matches-wrap"><table class="mobile-tabular team-profile-matches-table"><thead><tr><th>Comp.</th><th>Fase</th><th>Partita</th><th>Ris.</th></tr></thead><tbody>${matchesRows}</tbody></table></div></div>`;
};

function findSeasonTeamIdForTeamNameV90(teamName) {
  const normalized = normalizeKey(teamName || '');
  if (!normalized) return '';
  const currentSeasonId = getCurrentSeasonId();
  const seasonTeams = state.raw.seasonTeams || [];
  const teamsById = buildMaps().teamsById;
  const scoreSeasonTeam = (seasonTeam) => {
    const canonical = getTeamDisplayName(teamsById.get(seasonTeam.teamId));
    const names = [seasonTeam.name, canonical].map((value) => normalizeKey(value || ''));
    if (!names.includes(normalized)) return -1;
    return seasonTeam.seasonId === currentSeasonId ? 3 : 1;
  };
  return [...seasonTeams]
    .map((seasonTeam) => ({ seasonTeam, score: scoreSeasonTeam(seasonTeam) }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score || String(b.seasonTeam.seasonId || '').localeCompare(String(a.seasonTeam.seasonId || ''), 'it', { numeric: true }))
    [0]?.seasonTeam.id || '';
}

function makeHonorTeamNamesClickableV90() {
  const root = document.getElementById('honorSummary');
  if (!root) return;
  root.querySelectorAll('.club-name-with-logo').forEach((node) => {
    if (node.closest('button, a, .team-profile-link')) return;
    const name = node.textContent?.trim() || '';
    const seasonTeamId = findSeasonTeamIdForTeamNameV90(name);
    if (!seasonTeamId) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'team-profile-link honor-team-profile-link';
    button.dataset.openTeamProfile = seasonTeamId;
    node.replaceWith(button);
    button.appendChild(node);
  });
}

const renderHonorSummaryBeforeV90 = renderHonorSummary;
renderHonorSummary = function renderHonorSummaryV90() {
  const result = renderHonorSummaryBeforeV90?.();
  makeHonorTeamNamesClickableV90();
  return result;
};


/* V100 - Robust auth-gated data loading and season changes.
   Prevents refresh/auth race conditions where public snapshots can overwrite
   full admin data or season changes can render before the selected season data
   is loaded. */

/* V101 - Static competition calendars from assets/competitions to reduce Firebase reads. */
async function loadStaticCompetitionCalendarsV101() {
  if (typeof loadCompetitionCalendarData !== "function") return;
  await loadCompetitionCalendarData();
}

function findExistingCompetitionForStaticCalendarV101(calendar, seasonId) {
  const staticCompetition = calendar?.competition || {};
  const targetId = staticCompetition.id || calendar?.competitionId || calendar?.meta?.competitionId || "";
  if (targetId) {
    const byId = (state.raw.competitions || []).find((competition) => competition.id === targetId);
    if (byId) return byId;
  }

  const targetName = normalizeKey(staticCompetition.name || calendar?.competitionName || calendar?.meta?.competitionName || "");
  const targetType = staticCompetition.type || calendar?.competitionType || calendar?.meta?.competitionType || "";
  return (state.raw.competitions || []).find((competition) => {
    if (competition.seasonId !== seasonId) return false;
    if (targetType && competition.type === targetType) return true;
    return targetName && normalizeKey(competition.name || "") === targetName;
  }) || null;
}

function resolveStaticSeasonTeamIdV101(seasonId, name, explicitId = "") {
  if (explicitId && getSeasonTeamById(explicitId)) return explicitId;
  const target = normalizeKey(name || "");
  if (!target) return "";
  const { teamsById } = buildMaps();
  const seasonTeams = (state.raw.seasonTeams || []).filter((seasonTeam) => seasonTeam.seasonId === seasonId);
  const found = seasonTeams.find((seasonTeam) => {
    const team = teamsById.get(seasonTeam.teamId);
    const aliases = [
      seasonTeam.name,
      seasonTeam.displayName,
      seasonTeam.shortName,
      team?.canonicalName,
      team?.name,
      team?.shortName
    ].filter(Boolean).map(normalizeKey);
    return aliases.includes(target);
  });
  return found?.id || "";
}

function renderStaticMatchTeamNameV101(match, side, options = {}) {
  const { strong = true } = options;
  const id = side === "home" ? match.homeSeasonTeamId : match.awaySeasonTeamId;
  if (id) return renderSeasonTeamNameWithLogo(id, options);
  const name = side === "home" ? match.homeTeamName : match.awayTeamName;
  if (!name) return renderSeasonTeamNameWithLogo(id, options);
  const text = strong ? `<strong>${escapeHtml(name)}</strong>` : `<span>${escapeHtml(name)}</span>`;
  return `<span class="club-name-with-logo static-competition-team-name">${renderTeamLogo(name, "")}${text}</span>`;
}

function normalizeStaticCompetitionMatchV101(match, seasonId, competitionId, index) {
  const homeTeamName = match.homeTeamName || match.homeName || "";
  const awayTeamName = match.awayTeamName || match.awayName || "";
  return {
    ...match,
    id: match.id || `${makeIdPart(competitionId)}_${makeIdPart(match.matchday || match.stage || "giornata")}_${index + 1}`,
    seasonId,
    competitionId,
    status: match.status || "GIOCATA",
    homeTeamName,
    awayTeamName,
    homeSeasonTeamId: resolveStaticSeasonTeamIdV101(seasonId, homeTeamName, match.homeSeasonTeamId || ""),
    awaySeasonTeamId: resolveStaticSeasonTeamIdV101(seasonId, awayTeamName, match.awaySeasonTeamId || ""),
    source: match.source || "static-competition-calendar"
  };
}

function normalizeStaticCompetitionResultV101(result, seasonId, competitionId, index) {
  const teamName = result.teamName || result.winnerName || "";
  return {
    ...result,
    id: result.id || `${makeIdPart(competitionId)}_result_${index + 1}`,
    seasonId,
    competitionId,
    position: Number(result.position || index + 1),
    seasonTeamId: resolveStaticSeasonTeamIdV101(seasonId, teamName, result.seasonTeamId || ""),
    teamName,
    source: result.source || "static-competition-calendar"
  };
}

function getStaticMatchMergeKeyV101(match) {
  return [
    match.competitionId || "",
    normalizeKey(match.matchday || ""),
    String(match.serieAMatchday || ""),
    match.homeSeasonTeamId || normalizeKey(match.homeTeamName || ""),
    match.awaySeasonTeamId || normalizeKey(match.awayTeamName || "")
  ].join("|");
}


/* V107 - Enrichment from static competition calendars.
   When a match already exists in Firebase/snapshots, keep the Firebase match
   but enrich it with fantapoints and static metadata from assets/competitions.
   This makes the JSON static source visible in the public result line without
   duplicating matches. */
function hasStaticValueV107(value) {
  return value !== null && value !== undefined && value !== "";
}

function mergeStaticValueV107(target, source, field, options = {}) {
  const { overwrite = false } = options;
  if (!source || !hasStaticValueV107(source[field])) return;
  if (overwrite || !hasStaticValueV107(target[field])) target[field] = source[field];
}

function enrichExistingMatchWithStaticDataV107(existingMatch, staticMatch, calendar = {}) {
  if (!existingMatch || !staticMatch) return existingMatch;

  // Fantapoints are the key difference between Firebase-entered matches and
  // static calendar imports. Always trust the static JSON for these fields.
  mergeStaticValueV107(existingMatch, staticMatch, "homeScore", { overwrite: true });
  mergeStaticValueV107(existingMatch, staticMatch, "awayScore", { overwrite: true });

  // Preserve Firebase official score if present; otherwise use the static one.
  mergeStaticValueV107(existingMatch, staticMatch, "homeGoals");
  mergeStaticValueV107(existingMatch, staticMatch, "awayGoals");
  mergeStaticValueV107(existingMatch, staticMatch, "status");

  [
    "stage",
    "leg",
    "matchday",
    "leagueMatchday",
    "serieAMatchday",
    "matchDate",
    "homeTeamName",
    "awayTeamName",
    "homeSeasonTeamId",
    "awaySeasonTeamId"
  ].forEach((field) => mergeStaticValueV107(existingMatch, staticMatch, field));

  existingMatch.staticCalendarId = calendar.id || calendar.meta?.id || existingMatch.staticCalendarId || "";
  existingMatch.staticSourceFile = calendar.sourceFile || calendar.meta?.sourceFile || existingMatch.staticSourceFile || "assets/competitions";
  existingMatch.hasStaticCalendarData = true;
  existingMatch.source = String(existingMatch.source || "").includes("static")
    ? existingMatch.source
    : `${existingMatch.source || "firebase"}+static-competition-calendar`;
  return existingMatch;
}

function getStaticResultMergeKeyV101(result) {
  return [
    result.competitionId || "",
    String(result.position || ""),
    result.seasonTeamId || normalizeKey(result.teamName || "")
  ].join("|");
}

function mergeStaticCompetitionCalendarsForSeasonV101(seasonId = getCurrentSeasonId()) {
  if (!seasonId || !Array.isArray(state.competitionCalendars) || !state.competitionCalendars.length) return;
  const calendars = state.competitionCalendars.filter((calendar) => (calendar.seasonId || calendar.meta?.seasonId) === seasonId);
  if (!calendars.length) return;

  calendars.forEach((calendar) => {
    const staticCompetition = calendar.competition || {};
    const existingCompetition = findExistingCompetitionForStaticCalendarV101(calendar, seasonId);
    const competitionId = existingCompetition?.id || staticCompetition.id || calendar.competitionId || calendar.meta?.competitionId || `${makeIdPart(seasonId)}_${makeIdPart(calendar.competitionSlug || calendar.meta?.competitionSlug || calendar.id || "competizione")}`;
    const competitionPayload = {
      id: competitionId,
      seasonId,
      name: staticCompetition.name || calendar.competitionName || calendar.meta?.competitionName || calendar.label || "Competizione",
      type: staticCompetition.type || calendar.competitionType || calendar.meta?.competitionType || "ALTRO",
      format: staticCompetition.format || calendar.competitionFormat || calendar.meta?.competitionFormat || "GIRONI_KO",
      status: staticCompetition.status || calendar.status || "CONCLUSA",
      notes: staticCompetition.notes || "Calendario statico da file Excel.",
      staticCalendarId: calendar.id,
      source: "static-competition-calendar"
    };

    if (existingCompetition) {
      Object.assign(existingCompetition, {
        ...existingCompetition,
        // Static competition calendars are the primary source for the public
        // competition label. Firebase can still provide ids/admin metadata, but
        // the public name should follow the JSON file when it exists.
        name: competitionPayload.name || existingCompetition.name,
        staticCompetitionName: competitionPayload.name || existingCompetition.staticCompetitionName || existingCompetition.name,
        type: competitionPayload.type || existingCompetition.type,
        format: competitionPayload.format || existingCompetition.format,
        status: competitionPayload.status || existingCompetition.status,
        notes: existingCompetition.notes || competitionPayload.notes,
        staticCalendarId: calendar.id,
        source: String(existingCompetition.source || "").includes("static")
          ? existingCompetition.source
          : "firebase-with-static-calendar"
      });
    } else {
      state.raw.competitions.push({
        ...competitionPayload,
        staticCompetitionName: competitionPayload.name
      });
    }

    const existingMatchesById = new Map((state.raw.competitionMatches || []).map((match) => [match.id, match]));
    const existingMatchesByKey = new Map((state.raw.competitionMatches || []).map((match) => [getStaticMatchMergeKeyV101(match), match]));
    const normalizedMatches = (calendar.matches || []).map((match, index) => normalizeStaticCompetitionMatchV101(match, seasonId, competitionId, index));
    normalizedMatches.forEach((match) => {
      const mergeKey = getStaticMatchMergeKeyV101(match);
      const existingMatch = existingMatchesById.get(match.id) || existingMatchesByKey.get(mergeKey);
      if (existingMatch) {
        enrichExistingMatchWithStaticDataV107(existingMatch, match, calendar);
        existingMatchesById.set(existingMatch.id, existingMatch);
        existingMatchesByKey.set(mergeKey, existingMatch);
        return;
      }
      state.raw.competitionMatches.push(match);
      existingMatchesById.set(match.id, match);
      existingMatchesByKey.set(mergeKey, match);
    });

    const existingResultsById = new Map((state.raw.competitionResults || []).map((result) => [result.id, result]));
    const existingResultKeys = new Set((state.raw.competitionResults || []).map(getStaticResultMergeKeyV101));
    const normalizedResults = (calendar.results || []).map((result, index) => normalizeStaticCompetitionResultV101(result, seasonId, competitionId, index));
    normalizedResults.forEach((result) => {
      const mergeKey = getStaticResultMergeKeyV101(result);
      if (!existingResultsById.has(result.id) && !existingResultKeys.has(mergeKey)) {
        state.raw.competitionResults.push(result);
        existingResultsById.set(result.id, result);
        existingResultKeys.add(mergeKey);
      }
    });
  });
}

const renderMatchRowsBeforeV101 = renderMatchRows;
renderMatchRows = function renderMatchRowsV101(matches, emptyText = "Nessuna partita inserita.") {
  const sortedMatches = sortMatchesForDisplay(matches);
  if (!sortedMatches.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
  return `
    <div class="table-wrap match-table-wrap">
      <table>
        <thead>
          <tr><th>Fase</th><th>Partita</th><th>Data</th><th class="number">Risultato</th></tr>
        </thead>
        <tbody>
          ${sortedMatches.map((match) => `
            <tr>
              <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
              <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
              <td data-label="Data">${escapeHtml(match.matchDate || "-")}</td>
              <td data-label="Risultato" class="number">${escapeHtml(formatMatchResult(match))}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
};

renderCompactMatchLines = function renderCompactMatchLinesV101(matches) {
  if (!matches.length) return "";
  return `
    <div class="compact-match-lines">
      ${sortMatchesForDisplay(matches).map((match) => `
        <div class="compact-match-line">
          <span>${renderStaticMatchTeamNameV101(match, "home", { strong: false })} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}</span>
          <strong>${escapeHtml(formatMatchResult(match))}</strong>
        </div>`).join("")}
    </div>`;
};

renderCompactSingleMatchLineV87 = function renderCompactSingleMatchLineV101(match) {
  if (!match) return "";
  return `
    <div class="compact-match-line dashboard-next-match-line">
      <span>${renderStaticMatchTeamNameV101(match, "home", { strong: false })} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}</span>
      <strong>${escapeHtml(match.matchDate || formatMatchStage(match) || "Da programmare")}</strong>
    </div>`;
};

let dataLoadSequenceV100 = 0;
let unsubscribeAuthV100 = null;

function getDefaultSeasonIdFromRawV100(raw) {
  const league = (raw.leagueSettings || []).find((item) => item.id === "main") || (raw.leagueSettings || [])[0] || null;
  if (league?.currentSeasonId) return league.currentSeasonId;
  const current = (raw.seasons || []).find((season) => season.isCurrent);
  if (current) return current.id;
  return (raw.seasons || [])[0]?.id || "";
}

function isLatestDataLoadV100(requestId) {
  return requestId === dataLoadSequenceV100;
}

async function loadFullDataStableV100(requestId, options = {}) {
  const { render = true } = options;
  const selectedSeasonBefore = state.selectedSeasonId;
  const entries = await Promise.all(
    COLLECTIONS.map(async (name) => [name, await loadCollection(name)])
  );
  await loadListoniData();
  await loadRostersData();
  await loadStaticCompetitionCalendarsV101();
  if (!isLatestDataLoadV100(requestId)) return false;

  state.raw = Object.assign(makeEmptyRawDataV34(), Object.fromEntries(entries));
  state.hasFullData = true;
  state.usedPublicSnapshots = false;
  state.selectedSeasonId = selectedSeasonBefore || state.selectedSeasonId || getDefaultSeasonId();
  mergeStaticCompetitionCalendarsForSeasonV101(state.selectedSeasonId);
  sortData();
  if (render) renderAll();
  setError("");
  return true;
}

async function loadPublicDataForSelectedSeasonV100(requestId, options = {}) {
  const { render = true } = options;
  const selectedSeasonBefore = state.selectedSeasonId;

  const rawBase = makeEmptyRawDataV34();
  const [leagueSettings, seasons] = await Promise.all([
    loadCollection("leagueSettings"),
    loadCollection("seasons")
  ]);
  rawBase.leagueSettings = leagueSettings;
  rawBase.seasons = seasons;

  const seasonId = selectedSeasonBefore || getDefaultSeasonIdFromRawV100(rawBase);
  const [seasonSnapshot, honorSnapshot] = await Promise.all([
    loadPublicSeasonSnapshotV32(seasonId),
    loadPublicHonorSnapshotV32()
  ]);

  await loadListoniData();
  await loadRostersData();
  await loadStaticCompetitionCalendarsV101();
  if (!isLatestDataLoadV100(requestId)) return false;

  state.raw = rawBase;
  state.selectedSeasonId = seasonId;
  state.hasFullData = false;

  if (!seasonSnapshot || !honorSnapshot) {
    state.usedPublicSnapshots = false;
    state.publicHonorSnapshot = honorSnapshot || null;
    mergeStaticCompetitionCalendarsForSeasonV101(seasonId);
    sortData();
    if (render) renderAll();
    setError(`Snapshot pubblico mancante per ${seasonId}. Accedi come admin e aggiorna gli snapshot pubblici.`);
    return false;
  }

  applyPublicSeasonSnapshotV32(seasonSnapshot);
  state.raw.news = Array.isArray(seasonSnapshot.news) ? seasonSnapshot.news : [];
  mergeStaticCompetitionCalendarsForSeasonV101(seasonId);
  state.publicHonorSnapshot = honorSnapshot;
  state.hasFullData = false;
  sortData();
  if (render) renderAll();
  setError("");
  return true;
}

async function loadDataForCurrentAuthV100(options = {}) {
  const requestId = ++dataLoadSequenceV100;
  if (state.isAdmin) {
    return loadFullDataStableV100(requestId, options);
  }
  return loadPublicDataForSelectedSeasonV100(requestId, options);
}

loadData = async function loadDataV100() {
  return loadDataForCurrentAuthV100({ render: true });
};

setupSeasonSelectorEvents = function setupSeasonSelectorEventsV100() {
  document.getElementById("globalSeasonSelect")?.addEventListener("change", async (event) => {
    state.selectedSeasonId = event.target.value;
    state.selectedListoneId = "";
    try {
      if (state.isAdmin && state.hasFullData) {
        mergeStaticCompetitionCalendarsForSeasonV101(state.selectedSeasonId);
        sortData();
        renderAll();
        setError("");
        return;
      }
      await loadDataForCurrentAuthV100({ render: true });
    } catch (error) {
      console.error(error);
      setError(`Cambio stagione non riuscito. ${error?.message || error}`);
    }
  });
};

setupAuth = function setupAuthV100() {
  ensureV34Dom();
  const openLoginBtn = document.getElementById("openLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loginDialog = document.getElementById("loginDialog");
  const loginForm = document.getElementById("loginForm");
  const closeLoginBtn = document.getElementById("closeLoginBtn");
  const refreshBtn = document.getElementById("refreshBtn");

  openLoginBtn?.addEventListener("click", () => {
    if (loginDialog?.showModal) loginDialog.showModal();
  });
  closeLoginBtn?.addEventListener("click", () => loginDialog?.close());
  logoutBtn?.addEventListener("click", async () => signOut(auth));
  refreshBtn?.addEventListener("click", async () => {
    try {
      await loadDataForCurrentAuthV100({ render: true });
    } catch (error) {
      console.error(error);
      setError(`Aggiornamento dati non riuscito. ${error?.message || error}`);
    }
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;
    showMessage("loginStatus", "Accesso in corso...");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      loginDialog?.close();
    } catch (error) {
      console.error(error);
      showMessage("loginStatus", "Login non riuscito. Controlla email e password.", true);
    }
  });

  document.getElementById("registerEmailBtn")?.addEventListener("click", async () => {
    const email = document.getElementById("loginEmail")?.value.trim();
    const password = document.getElementById("loginPassword")?.value;
    const displayName = document.getElementById("registerDisplayName")?.value.trim() || email;
    if (!email || !password) {
      showMessage("loginStatus", "Inserisci email e password per registrarti.", true);
      return;
    }
    try {
      showMessage("loginStatus", "Registrazione in corso...");
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) await updateProfile(credential.user, { displayName });
      await sendEmailVerification(credential.user);
      await upsertPendingUserV34(credential.user, "EMAIL_NOT_VERIFIED");
      showMessage("loginStatus", "Registrazione completata. Controlla la mail e verifica l'indirizzo prima dell'approvazione admin.");
    } catch (error) {
      console.error(error);
      showMessage("loginStatus", error?.message || "Registrazione non riuscita.", true);
    }
  });

  document.getElementById("sendVerificationAgainBtn")?.addEventListener("click", async () => {
    try {
      if (!auth.currentUser) {
        showMessage("loginStatus", "Accedi prima di richiedere una nuova verifica.", true);
        return;
      }
      await sendEmailVerification(auth.currentUser);
      showMessage("loginStatus", "Email di verifica inviata nuovamente.");
    } catch (error) {
      console.error(error);
      showMessage("loginStatus", "Non riesco a inviare la verifica email.", true);
    }
  });

  document.getElementById("loginGoogleBtn")?.addEventListener("click", async () => {
    try {
      showMessage("loginStatus", "Accesso Google in corso...");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await upsertPendingUserV34(result.user, "PENDING");
      loginDialog?.close();
    } catch (error) {
      console.error(error);
      showMessage("loginStatus", error?.message || "Accesso Google non riuscito.", true);
    }
  });

  if (unsubscribeAuthV100) unsubscribeAuthV100();
  unsubscribeAuthV100 = onAuthStateChanged(auth, async (user) => {
    state.user = user;
    state.isAdmin = false;
    state.currentTeamUser = null;
    state.currentPendingUser = null;

    if (user) {
      try {
        try {
          const adminSnapshot = await getDoc(doc(db, "admins", user.uid));
          state.isAdmin = adminSnapshot.exists();
        } catch (adminError) {
          if (adminError?.code === "permission-denied") state.isAdmin = false;
          else throw adminError;
        }

        if (!state.isAdmin) {
          const teamSnapshot = await getDoc(doc(db, "teamUsers", user.uid)).catch(() => null);
          if (teamSnapshot?.exists?.()) state.currentTeamUser = { id: teamSnapshot.id, ...teamSnapshot.data() };

          const pendingSnapshot = await getDoc(doc(db, "pendingUsers", user.uid)).catch(() => null);
          if (pendingSnapshot?.exists?.()) state.currentPendingUser = { id: pendingSnapshot.id, ...pendingSnapshot.data() };

          if (!state.currentTeamUser && !state.currentPendingUser) {
            if (isEmailPasswordUserV34(user) && !user.emailVerified) await upsertPendingUserV34(user, "EMAIL_NOT_VERIFIED");
            else await upsertPendingUserV34(user, "PENDING");
          } else if (state.currentPendingUser?.status === "EMAIL_NOT_VERIFIED" && user.emailVerified) {
            await upsertPendingUserV34(user, "PENDING");
          }
        }
      } catch (error) {
        console.error(error);
        showMessage("loginStatus", `Controllo account fallito. ${error?.message || error}`, true);
      }
    }

    updateAdminVisibility();
    updateUserVisibilityV34();

    try {
      await loadDataForCurrentAuthV100({ render: true });
    } catch (error) {
      console.error(error);
      setError(`Non riesco a caricare i dati. ${error?.message || error}`);
    }

    updateAdminVisibility();
    updateUserVisibilityV34();
    renderUserAreaV34();
  });
};

initializeAppUi = async function initializeAppUiV100() {
  setupNavigation();
  setupMobileNavigation();
  setupAuth();
  setupSeasonSelectorEvents();
  setupListoneEvents();
  setupClubRosterEvents();
  updateAdminVisibility();

  const loginHelpText = document.querySelector("#loginDialog .muted");
  if (loginHelpText) loginHelpText.textContent = "Accedi con l'utente creato in Firebase Authentication.";
};

initializeAppUi().then(() => {
  setupThemeToggleV89();
  injectDisplayModeToggle();
  updateMobileUxClass();
});

/* V110 - Nomi competizione da JSON statico come fonte primaria. */
function getCompetitionStaticDisplayNameV110(competition) {
  if (!competition) return "";
  const calendar = typeof getStaticCompetitionCalendarForCompetitionV102 === "function"
    ? getStaticCompetitionCalendarForCompetitionV102(competition)
    : null;
  return String(
    calendar?.competition?.name ||
    calendar?.competitionName ||
    calendar?.meta?.competitionName ||
    competition.staticCompetitionName ||
    ""
  ).trim();
}

function getCompetitionPublicDisplayNameV110(competition) {
  if (!competition) return "Competizione";
  return getCompetitionStaticDisplayNameV110(competition) ||
    competition.name ||
    competition.label ||
    getLabel(COMPETITION_TYPES, competition.type) ||
    competition.type ||
    "Competizione";
}

/* V102 - Indicatore visibile per competizioni con calendario JSON statico. */
function getStaticCompetitionCalendarForCompetitionV102(competition) {
  if (!competition) return null;
  const calendars = Array.isArray(state.competitionCalendars) ? state.competitionCalendars : [];
  return calendars.find((calendar) => {
    const calendarId = calendar.id || calendar.meta?.id || "";
    const calendarCompetitionId = calendar.competitionId || calendar.meta?.competitionId || calendar.competition?.id || "";
    const calendarSeasonId = calendar.seasonId || calendar.meta?.seasonId || calendar.competition?.seasonId || "";
    const calendarName = normalizeKey(calendar.competitionName || calendar.meta?.competitionName || calendar.competition?.name || "");
    const competitionName = normalizeKey(competition.name || "");
    return Boolean(
      (competition.staticCalendarId && calendarId === competition.staticCalendarId) ||
      (calendarCompetitionId && calendarCompetitionId === competition.id) ||
      (calendarSeasonId && calendarSeasonId === competition.seasonId && calendarName && calendarName === competitionName)
    );
  }) || null;
}

function hasStaticCompetitionSourceV102(competition) {
  if (!competition) return false;
  return Boolean(
    competition.staticCalendarId ||
    String(competition.source || "").includes("static") ||
    getStaticCompetitionCalendarForCompetitionV102(competition)
  );
}

function getStaticCompetitionMatchCountV102(competition) {
  const calendar = getStaticCompetitionCalendarForCompetitionV102(competition);
  if (Array.isArray(calendar?.matches)) return calendar.matches.length;
  return (state.raw.competitionMatches || []).filter((match) => (
    match.competitionId === competition?.id && String(match.source || "").includes("static")
  )).length;
}

function renderStaticCompetitionBadgeV102(competition) {
  if (!hasStaticCompetitionSourceV102(competition)) return "";
  return `<span class="static-source-badge" title="Calendario collegato da assets/competitions">JSON statico</span>`;
}

function renderStaticCompetitionSourceLineV102(competition) {
  if (!hasStaticCompetitionSourceV102(competition)) return "";
  const calendar = getStaticCompetitionCalendarForCompetitionV102(competition) || {};
  const count = getStaticCompetitionMatchCountV102(competition);
  const sourceFile = calendar.sourceFile || calendar.meta?.sourceFile || "assets/competitions";
  const countText = count ? `${count} partite nel file` : "manifest statico collegato";
  return `
    <p class="static-source-line">
      <span class="static-source-badge">JSON statico</span>
      <span>Fonte calendario: <strong>${escapeHtml(sourceFile)}</strong> · ${escapeHtml(countText)}</span>
    </p>`;
}

const renderCompetitionsPublicBeforeV102 = renderCompetitionsPublic;
renderCompetitionsPublic = function renderCompetitionsPublicV102() {
  const list = document.getElementById("competitionsList");
  if (!list) return;

  const seasonId = getCurrentSeasonId();
  const competitions = getSeasonCompetitionsForPublicDisplayV52(seasonId);

  if (!competitions.length) {
    list.innerHTML = `<p class="muted">Nessuna competizione inserita per ${escapeHtml(seasonId || "la stagione selezionata")}.</p>`;
    return;
  }

  list.innerHTML = competitions.map((competition) => `
    <article class="competition-card${hasStaticCompetitionSourceV102(competition) ? " competition-card-static-source" : ""}">
      <div class="competition-card-header">
        <div>
          <h3>${escapeHtml(getCompetitionPublicDisplayNameV110(competition))} ${renderStaticCompetitionBadgeV102(competition)}</h3>
        </div>
        <span class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</span>
      </div>
      ${renderStaticCompetitionSourceLineV102(competition)}
      ${competition.notes ? `<p>${escapeHtml(competition.notes)}</p>` : ""}
      ${renderCompetitionResultsPublic(competition)}
      ${renderCompetitionMatchesPublic(competition)}
    </article>
  `).join("");
};

const renderDashboardBeforeV102 = renderDashboard;
renderDashboard = function renderDashboardV102() {
  const seasonId = getCurrentSeasonId();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const competitions = getSeasonCompetitionsForPublicDisplayV52(seasonId);
  const stats = typeof getSeasonFmStats === "function" ? getSeasonFmStats(seasonId) : null;

  const metricClubs = document.getElementById("metricClubs");
  const metricTotalFm = document.getElementById("metricTotalFm");
  const metricAlerts = document.getElementById("metricAlerts");

  if (metricClubs) metricClubs.textContent = String(seasonTeams.length || getParticipantsCount(seasonId) || 0);
  if (metricTotalFm) metricTotalFm.textContent = stats ? `${formatFm(stats.total)} (medio ${formatFm(stats.average)})` : "- (medio -)";
  if (metricAlerts) metricAlerts.textContent = String(competitions.filter((competition) => competition.status === "ATTIVA").length);

  const standings = document.getElementById("dashboardStandings");
  if (standings) {
    standings.innerHTML = competitions.length
      ? competitions.map((competition) => `
        <details class="stack-item dashboard-subsection dashboard-competition-subsection" open>
          <summary>
            <span>
              <strong>${escapeHtml(getCompetitionPublicDisplayNameV110(competition))}</strong>
              <small class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</small>
              ${renderStaticCompetitionBadgeV102(competition)}
            </span>
            <span class="button button-secondary button-small details-toggle-label" aria-hidden="true">Ingrandisci/Riduci</span>
          </summary>
          ${renderDashboardCompetitionSummary(competition)}
        </details>`).join("")
      : `<p class="muted">Nessuna competizione inserita per questa stagione.</p>`;
  }

  renderDashboardCalendar(seasonId);
  renderDashboardNewsV42();
  if (typeof normalizeToggleLabelsV29 === "function") normalizeToggleLabelsV29();
};


/* V103 - Badge fonte Firebase e partite competizione raggruppate per turno. */
function hasFirebaseCompetitionSourceV103(competition) {
  return Boolean(competition) && !hasStaticCompetitionSourceV102(competition);
}

function renderCompetitionSourceBadgeV103(competition) {
  if (hasStaticCompetitionSourceV102(competition)) return renderStaticCompetitionBadgeV102(competition);
  return `<span class="firebase-source-badge" title="Competizione e calendario caricati da Firebase/Firestore">Firebase</span>`;
}

function getMatchStageRankV103(match) {
  const stage = String(match?.stage || match?.round || match?.phase || match?.matchday || '').toUpperCase();
  const leg = String(match?.leg || match?.roundLeg || match?.matchday || '').toUpperCase();
  if (stage.includes('FINAL') || leg.includes('FINAL')) return 500;
  if (stage.includes('SEMI') || leg.includes('SEMI')) return leg.includes('RIT') ? 420 : 410;
  if (stage.includes('QUART') || stage.includes('QF') || leg.includes('QUART') || leg.includes('QF')) return leg.includes('RIT') ? 320 : 310;
  if (stage.includes('OTTAV') || stage.includes('R16')) return leg.includes('RIT') ? 220 : 210;
  const leagueDay = Number(match?.leagueMatchday || match?.serieAMatchday || 0);
  if (Number.isFinite(leagueDay) && leagueDay > 0) return 100 + leagueDay;
  return 0;
}

function getMatchGroupLabelV103(match) {
  const label = formatMatchStage(match) || match?.matchday || 'Partite';
  return String(label || 'Partite').trim() || 'Partite';
}

function groupCompetitionMatchesByStageV103(matches) {
  const groups = new Map();
  matches.forEach((match) => {
    const label = getMatchGroupLabelV103(match);
    const key = normalizeKey(label) || label;
    if (!groups.has(key)) {
      groups.set(key, { label, rank: getMatchStageRankV103(match), matches: [] });
    }
    const group = groups.get(key);
    group.rank = Math.max(group.rank, getMatchStageRankV103(match));
    group.matches.push(match);
  });
  return [...groups.values()].sort((a, b) => {
    const rankDiff = b.rank - a.rank;
    if (rankDiff) return rankDiff;
    return String(b.label).localeCompare(String(a.label), 'it', { numeric: true, sensitivity: 'base' });
  });
}

function sortMatchesInsideStageV103(matches) {
  return [...matches].sort((a, b) => {
    const idCompare = String(a.id || '').localeCompare(String(b.id || ''), 'it', { numeric: true, sensitivity: 'base' });
    if (idCompare) return idCompare;
    const homeCompare = String(a.homeTeamName || getSeasonTeamDisplayName(a.homeSeasonTeamId) || '').localeCompare(String(b.homeTeamName || getSeasonTeamDisplayName(b.homeSeasonTeamId) || ''), 'it', { numeric: true, sensitivity: 'base' });
    if (homeCompare) return homeCompare;
    return String(a.awayTeamName || getSeasonTeamDisplayName(a.awaySeasonTeamId) || '').localeCompare(String(b.awayTeamName || getSeasonTeamDisplayName(b.awaySeasonTeamId) || ''), 'it', { numeric: true, sensitivity: 'base' });
  });
}

function renderMatchRowsPreserveOrderV103(matches, emptyText = 'Nessuna partita inserita.') {
  if (!matches.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
  return `
    <div class="table-wrap match-table-wrap">
      <table>
        <thead>
          <tr><th>Fase</th><th>Partita</th><th>Data</th><th class="number">Risultato</th></tr>
        </thead>
        <tbody>
          ${matches.map((match) => `
            <tr>
              <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
              <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, 'home')} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, 'away')}</span></td>
              <td data-label="Data">${escapeHtml(match.matchDate || '-')}</td>
              <td data-label="Risultato" class="number">${escapeHtml(formatMatchResult(match))}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

renderCompetitionMatchesPublic = function renderCompetitionMatchesPublicV103(competition) {
  const matches = getCompetitionMatches(competition.id);
  if (!matches.length) return `<p class="muted">Nessuna partita inserita per questa competizione.</p>`;
  const groups = groupCompetitionMatchesByStageV103(matches);
  return `
    <div class="competition-matches-public competition-match-groups">
      ${groups.map((group) => `
        <div class="detail-section compact-detail-section competition-match-stage-group">
          <h4>${escapeHtml(group.label)}</h4>
          ${renderMatchRowsPreserveOrderV103(sortMatchesInsideStageV103(group.matches), 'Nessuna partita inserita.')}
        </div>`).join('')}
    </div>`;
};

renderCompetitionsPublic = function renderCompetitionsPublicV103() {
  const list = document.getElementById('competitionsList');
  if (!list) return;

  const seasonId = getCurrentSeasonId();
  const competitions = getSeasonCompetitionsForPublicDisplayV52(seasonId);

  if (!competitions.length) {
    list.innerHTML = `<p class="muted">Nessuna competizione inserita per ${escapeHtml(seasonId || 'la stagione selezionata')}.</p>`;
    return;
  }

  list.innerHTML = competitions.map((competition) => `
    <article class="competition-card${hasStaticCompetitionSourceV102(competition) ? ' competition-card-static-source' : ' competition-card-firebase-source'}">
      <div class="competition-card-header">
        <div>
          <h3>${escapeHtml(getCompetitionPublicDisplayNameV110(competition))} ${renderCompetitionSourceBadgeV103(competition)}</h3>
        </div>
        <span class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</span>
      </div>
      ${renderStaticCompetitionSourceLineV102(competition)}
      ${competition.notes ? `<p>${escapeHtml(competition.notes)}</p>` : ''}
      ${renderCompetitionResultsPublic(competition)}
      ${renderCompetitionMatchesPublic(competition)}
    </article>
  `).join('');
};

renderDashboard = function renderDashboardV103() {
  const seasonId = getCurrentSeasonId();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const competitions = getSeasonCompetitionsForPublicDisplayV52(seasonId);
  const stats = typeof getSeasonFmStats === 'function' ? getSeasonFmStats(seasonId) : null;

  const metricClubs = document.getElementById('metricClubs');
  const metricTotalFm = document.getElementById('metricTotalFm');
  const metricAlerts = document.getElementById('metricAlerts');

  if (metricClubs) metricClubs.textContent = String(seasonTeams.length || getParticipantsCount(seasonId) || 0);
  if (metricTotalFm) metricTotalFm.textContent = stats ? `${formatFm(stats.total)} (medio ${formatFm(stats.average)})` : '- (medio -)';
  if (metricAlerts) metricAlerts.textContent = String(competitions.filter((competition) => competition.status === 'ATTIVA').length);

  const standings = document.getElementById('dashboardStandings');
  if (standings) {
    standings.innerHTML = competitions.length
      ? competitions.map((competition) => `
        <details class="stack-item dashboard-subsection dashboard-competition-subsection" open>
          <summary>
            <span>
              <strong>${escapeHtml(getCompetitionPublicDisplayNameV110(competition))}</strong>
              <small class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</small>
              ${renderCompetitionSourceBadgeV103(competition)}
            </span>
            <span class="button button-secondary button-small details-toggle-label" aria-hidden="true">Ingrandisci/Riduci</span>
          </summary>
          ${renderDashboardCompetitionSummary(competition)}
        </details>`).join('')
      : `<p class="muted">Nessuna competizione inserita per questa stagione.</p>`;
  }

  renderDashboardCalendar(seasonId);
  renderDashboardNewsV42();
  if (typeof normalizeToggleLabelsV29 === 'function') normalizeToggleLabelsV29();
};


/* V104 - Ordine fasi competizioni e gruppi partite riducibili. */
function getCompetitionMatchStageInfoV104(match) {
  const stageRaw = String(match?.stage || match?.phase || match?.round || "").toUpperCase();
  const legRaw = String(match?.leg || match?.roundLeg || match?.matchday || "").toUpperCase();
  const matchdayRaw = String(match?.matchday || "").toUpperCase();
  const combined = `${stageRaw} ${legRaw} ${matchdayRaw}`;

  const hasReturnLeg = combined.includes("RIT") || combined.includes("RETURN");
  const hasFirstLeg = combined.includes("AND") || combined.includes("FIRST");

  if (combined.includes("FINAL")) {
    return { key: "finale", label: "Finale", rank: 900 };
  }
  if (combined.includes("SEMI") || combined.includes("SF")) {
    return hasReturnLeg
      ? { key: "semifinali-ritorno", label: "Semifinali ritorno", rank: 820 }
      : { key: "semifinali-andata", label: "Semifinali andata", rank: hasFirstLeg ? 810 : 815 };
  }
  if (combined.includes("QUART") || combined.includes("QF")) {
    return hasReturnLeg
      ? { key: "quarti-finale-ritorno", label: "Quarti di finale ritorno", rank: 720 }
      : { key: "quarti-finale-andata", label: "Quarti di finale andata", rank: hasFirstLeg ? 710 : 715 };
  }
  if (combined.includes("OTTAV") || combined.includes("R16")) {
    return hasReturnLeg
      ? { key: "ottavi-finale-ritorno", label: "Ottavi di finale ritorno", rank: 620 }
      : { key: "ottavi-finale-andata", label: "Ottavi di finale andata", rank: hasFirstLeg ? 610 : 615 };
  }

  const leagueDay = Number(match?.leagueMatchday || 0);
  if (Number.isFinite(leagueDay) && leagueDay > 0) {
    return { key: `giornata-${leagueDay}`, label: `Giornata ${leagueDay}`, rank: 100 + leagueDay };
  }

  const serieDay = Number(match?.serieAMatchday || 0);
  if (Number.isFinite(serieDay) && serieDay > 0) {
    return { key: `serie-a-${serieDay}`, label: `Serie A ${serieDay}`, rank: 50 + serieDay };
  }

  const fallback = getMatchGroupLabelV103(match) || "Partite";
  return { key: normalizeKey(fallback) || "partite", label: fallback, rank: 0 };
}

function groupCompetitionMatchesByStageV104(matches) {
  const groups = new Map();
  matches.forEach((match) => {
    const info = getCompetitionMatchStageInfoV104(match);
    if (!groups.has(info.key)) {
      groups.set(info.key, { key: info.key, label: info.label, rank: info.rank, matches: [] });
    }
    const group = groups.get(info.key);
    group.rank = Math.max(group.rank, info.rank);
    group.matches.push(match);
  });
  return [...groups.values()].sort((a, b) => {
    const rankDiff = b.rank - a.rank;
    if (rankDiff) return rankDiff;
    return String(a.label).localeCompare(String(b.label), "it", { numeric: true, sensitivity: "base" });
  });
}

renderCompetitionMatchesPublic = function renderCompetitionMatchesPublicV104(competition) {
  const matches = getCompetitionMatches(competition.id);
  if (!matches.length) return `<p class="muted">Nessuna partita inserita per questa competizione.</p>`;
  const groups = groupCompetitionMatchesByStageV104(matches);
  return `
    <div class="competition-matches-public competition-match-groups">
      ${groups.map((group) => `
        <details class="detail-section compact-detail-section competition-match-stage-group competition-match-stage-details" open>
          <summary class="competition-match-stage-summary">
            <h4>${escapeHtml(group.label)}</h4>
            <span class="button button-secondary button-small competition-stage-toggle-label" aria-hidden="true">Riduci/Espandi</span>
          </summary>
          ${renderMatchRowsPreserveOrderV103(sortMatchesInsideStageV103(group.matches), "Nessuna partita inserita.")}
        </details>`).join("")}
    </div>`;
};


/* V105 - Importatore Admin per competizioni statiche da Excel con anteprima modificabile. */
if (!state.__staticCompetitionImportPanelInitializedV105) {
  state.collapsedAdminPanels.add("adminStaticCompetitionImportPanel");
  state.__staticCompetitionImportPanelInitializedV105 = true;
}

function renderStaticCompetitionImportAdminPanelV105() {
  const selectedSeasonId = getCurrentSeasonId();
  const seasonOptions = state.raw.seasons.map((season) => `
    <option value="${escapeHtml(season.id)}" ${season.id === selectedSeasonId ? "selected" : ""}>${escapeHtml(season.name || season.id)}</option>
  `).join("");
  const typeOptions = COMPETITION_TYPES.map((type) => `
    <option value="${escapeHtml(type.value)}" ${type.value === "CHAMPIONS_LEAGUE" ? "selected" : ""}>${escapeHtml(type.label)}</option>
  `).join("");
  const statusOptions = COMPETITION_STATUSES.map((status) => `
    <option value="${escapeHtml(status.value)}" ${status.value === "CONCLUSA" ? "selected" : ""}>${escapeHtml(status.label)}</option>
  `).join("");

  return renderAdminPanel(
    "adminStaticCompetitionImportPanel",
    "File statici",
    "Importa calendario competizione",
    "Carica un Excel calendario, modifica l'anteprima e scarica uno zip overlay con JSON competizione e manifest aggiornato.",
    `
      <form id="adminStaticCompetitionImportForm" class="form-grid">
        <label>
          Stagione
          <select id="adminStaticCompetitionSeasonId" class="input" required>${seasonOptions}</select>
        </label>
        <label>
          Nome competizione
          <input id="adminStaticCompetitionName" class="input" type="text" value="Champion's League" required />
        </label>
        <label>
          Tipo
          <select id="adminStaticCompetitionType" class="input" required>${typeOptions}</select>
        </label>
        <label>
          Stato
          <select id="adminStaticCompetitionStatus" class="input" required>${statusOptions}</select>
        </label>
        <label>
          Slug file
          <input id="adminStaticCompetitionSlug" class="input" type="text" value="champions-league" required />
          <small class="field-hint">Usato per nome file e id statico. Esempio: champions-league.</small>
        </label>
        <label>
          Data caricamento
          <input id="adminStaticCompetitionLoadedAt" class="input" type="date" value="${escapeHtml(getTodayIsoDate())}" required />
        </label>
        <label>
          Vincitore opzionale
          <input id="adminStaticCompetitionWinner" class="input" type="text" placeholder="Compilato automaticamente se c'è una finale giocata" />
        </label>
        <label>
          Finalista opzionale
          <input id="adminStaticCompetitionRunnerUp" class="input" type="text" placeholder="Compilato automaticamente se c'è una finale giocata" />
        </label>
        <label class="span-2">
          File Excel calendario
          <input id="adminStaticCompetitionFile" class="input" type="file" accept=".xlsx,.xls" required />
          <small class="field-hint">Il file non viene caricato su Firebase. Viene letto nel browser e trasformato in JSON statico versionabile in Git.</small>
        </label>
        <div class="form-actions span-2 static-competition-import-actions">
          <button class="button button-primary" type="submit">Leggi anteprima</button>
          <button id="adminStaticCompetitionGenerateOverlay" class="button button-secondary" type="button" disabled>Genera zip overlay</button>
          <button id="adminStaticCompetitionReset" class="button button-secondary" type="button">Svuota anteprima</button>
          <span id="adminStaticCompetitionImportStatus" class="form-status"></span>
        </div>
      </form>
      <div id="adminStaticCompetitionImportReport" class="import-report hidden"></div>
    `
  );
}

function updateStaticCompetitionSlugV105() {
  const nameInput = document.getElementById("adminStaticCompetitionName");
  const slugInput = document.getElementById("adminStaticCompetitionSlug");
  if (!nameInput || !slugInput || slugInput.dataset.touched === "1") return;
  slugInput.value = makeIdPart(nameInput.value || "competizione").replace(/_/g, "-");
}

function loadZipLibraryV105() {
  if (window.JSZip) return Promise.resolve(window.JSZip);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-jszip-loader="v105"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.JSZip));
      existing.addEventListener("error", () => reject(new Error("JSZip non disponibile.")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
    script.async = true;
    script.dataset.jszipLoader = "v105";
    script.onload = () => window.JSZip ? resolve(window.JSZip) : reject(new Error("JSZip non disponibile."));
    script.onerror = () => reject(new Error("Impossibile caricare JSZip. Controlla la connessione internet."));
    document.head.appendChild(script);
  });
}

function downloadBlobV105(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function getCellValueV105(row, index) {
  const value = row?.[index];
  return typeof value === "string" ? value.trim() : value ?? "";
}

function parseNumberV105(value) {
  if (value === null || value === undefined || value === "") return "";
  const normalized = String(value).replace(",", ".").replace(/[^0-9.\-]/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : "";
}

function parseOrdinalNumberV105(value) {
  const match = String(value || "").match(/(\d+)/);
  return match ? Number(match[1]) : "";
}

function isStaticCompetitionStageRowV105(row) {
  const first = String(getCellValueV105(row, 0) || "").trim();
  if (!first) return false;
  const filled = (row || []).filter((cell) => String(cell ?? "").trim()).length;
  return filled <= 2 && /quarti|semi|final|ottavi|girone|giornata/i.test(first);
}

function normalizeCompetitionStageLabelV105(value) {
  const text = String(value || "").trim();
  const upper = text.toUpperCase();
  if (upper.includes("QUART")) return { stage: "QUARTI", label: "Quarti di finale", code: "qf" };
  if (upper.includes("SEMI")) return { stage: "SEMIFINALI", label: "Semifinali", code: "sf" };
  if (upper.includes("FINAL")) return { stage: "FINALE", label: "Finale", code: "finale" };
  if (upper.includes("OTTAV")) return { stage: "OTTAVI", label: "Ottavi di finale", code: "r16" };
  return { stage: upper || "FASE", label: text || "Fase", code: makeIdPart(text || "fase") };
}

function getMatchdayLabelFromStageV105(stageInfo, leg) {
  if (stageInfo.stage === "FINALE") return "Finale";
  const legLabel = leg === "RITORNO" ? "Ritorno" : "Andata";
  if (stageInfo.code === "qf") return `QF - ${legLabel}`;
  if (stageInfo.code === "sf") return `SF - ${legLabel}`;
  if (stageInfo.code === "r16") return `R16 - ${legLabel}`;
  return `${stageInfo.label} - ${legLabel}`;
}

function parseGoalsFromScoreV105(score) {
  const match = String(score || "").match(/(\d+)\s*[-:]\s*(\d+)/);
  if (!match) return { homeGoals: "", awayGoals: "" };
  return { homeGoals: Number(match[1]), awayGoals: Number(match[2]) };
}

function buildStaticCompetitionMatchV105({ row, start, stageInfo, leg, leagueMatchday, serieAMatchday, index }) {
  const homeTeamName = String(getCellValueV105(row, start) || "").replace(/\s+/g, " ").trim();
  const awayTeamName = String(getCellValueV105(row, start + 3) || "").replace(/\s+/g, " ").trim();
  const score = String(getCellValueV105(row, start + 4) || "").trim();
  if (!homeTeamName || !awayTeamName) return null;

  const goals = parseGoalsFromScoreV105(score);
  return {
    stage: stageInfo.stage,
    leg,
    matchday: getMatchdayLabelFromStageV105(stageInfo, leg),
    leagueMatchday,
    serieAMatchday,
    matchDate: "",
    homeTeamName,
    awayTeamName,
    homeScore: parseNumberV105(getCellValueV105(row, start + 1)),
    awayScore: parseNumberV105(getCellValueV105(row, start + 2)),
    homeGoals: goals.homeGoals,
    awayGoals: goals.awayGoals,
    status: score ? "GIOCATA" : "DA_GIOCARE",
    sourceRow: index + 1
  };
}

function parseStaticCompetitionWorkbookRowsV105(rows) {
  const matches = [];
  let currentStage = null;
  let leftLeagueMatchday = "";
  let leftSerieAMatchday = "";
  let rightLeagueMatchday = "";
  let rightSerieAMatchday = "";

  rows.forEach((row, index) => {
    if (isStaticCompetitionStageRowV105(row)) {
      currentStage = normalizeCompetitionStageLabelV105(getCellValueV105(row, 0));
      leftLeagueMatchday = "";
      leftSerieAMatchday = "";
      rightLeagueMatchday = "";
      rightSerieAMatchday = "";
      return;
    }
    if (!currentStage) return;

    const first = String(getCellValueV105(row, 0) || "");
    const third = String(getCellValueV105(row, 2) || "");
    const seventh = String(getCellValueV105(row, 6) || "");
    const ninth = String(getCellValueV105(row, 8) || "");
    if (/giornata/i.test(first) || /giornata/i.test(third) || /giornata/i.test(seventh) || /giornata/i.test(ninth)) {
      leftLeagueMatchday = parseOrdinalNumberV105(first);
      leftSerieAMatchday = parseOrdinalNumberV105(third);
      rightLeagueMatchday = parseOrdinalNumberV105(seventh);
      rightSerieAMatchday = parseOrdinalNumberV105(ninth);
      return;
    }

    const left = buildStaticCompetitionMatchV105({
      row,
      start: 0,
      stageInfo: currentStage,
      leg: currentStage.stage === "FINALE" ? "FINALE" : "ANDATA",
      leagueMatchday: leftLeagueMatchday,
      serieAMatchday: leftSerieAMatchday,
      index
    });
    if (left) matches.push(left);

    const right = buildStaticCompetitionMatchV105({
      row,
      start: 6,
      stageInfo: currentStage,
      leg: currentStage.stage === "FINALE" ? "FINALE" : "RITORNO",
      leagueMatchday: rightLeagueMatchday,
      serieAMatchday: rightSerieAMatchday,
      index
    });
    if (right) matches.push(right);
  });

  return matches;
}

function inferCompetitionPodiumV105(matches) {
  const finalMatch = [...matches].reverse().find((match) => String(match.stage || "").toUpperCase().includes("FINAL") && match.status === "GIOCATA");
  if (!finalMatch) return { winner: "", runnerUp: "" };
  const homeGoals = Number(finalMatch.homeGoals);
  const awayGoals = Number(finalMatch.awayGoals);
  if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals) || homeGoals === awayGoals) return { winner: "", runnerUp: "" };
  return homeGoals > awayGoals
    ? { winner: finalMatch.homeTeamName, runnerUp: finalMatch.awayTeamName }
    : { winner: finalMatch.awayTeamName, runnerUp: finalMatch.homeTeamName };
}

function renderStaticCompetitionImportPreviewV105() {
  const report = document.getElementById("adminStaticCompetitionImportReport");
  const generateButton = document.getElementById("adminStaticCompetitionGenerateOverlay");
  const draft = state.staticCompetitionImportDraftV105;
  if (!report) return;

  if (!draft || !draft.matches?.length) {
    report.classList.add("hidden");
    if (generateButton) generateButton.disabled = true;
    return;
  }

  report.classList.remove("hidden");
  if (generateButton) generateButton.disabled = false;
  report.innerHTML = `
    <h3>Anteprima modificabile</h3>
    <p>Partite lette: <strong>${draft.matches.length}</strong>. Correggi i campi nella tabella prima di generare lo zip overlay.</p>
    <div class="table-wrap static-competition-preview-wrap">
      <table class="static-competition-preview-table">
        <thead>
          <tr>
            <th>Fase</th>
            <th>And./Rit.</th>
            <th>G. lega</th>
            <th>G. Serie A</th>
            <th>Data</th>
            <th>Casa</th>
            <th>FP casa</th>
            <th>FP trasf.</th>
            <th>Trasferta</th>
            <th>Ris.</th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody>
          ${draft.matches.map((match, index) => `
            <tr data-static-competition-preview-row="${index}">
              <td><input class="input" data-field="stage" value="${escapeHtml(match.stage || "")}" /></td>
              <td><input class="input" data-field="leg" value="${escapeHtml(match.leg || "")}" /></td>
              <td><input class="input" data-field="leagueMatchday" type="number" min="0" step="1" value="${escapeHtml(match.leagueMatchday || "")}" /></td>
              <td><input class="input" data-field="serieAMatchday" type="number" min="0" step="1" value="${escapeHtml(match.serieAMatchday || "")}" /></td>
              <td><input class="input" data-field="matchDate" type="date" value="${escapeHtml(match.matchDate || "")}" /></td>
              <td><input class="input" data-field="homeTeamName" value="${escapeHtml(match.homeTeamName || "")}" /></td>
              <td><input class="input" data-field="homeScore" type="number" step="0.5" value="${escapeHtml(match.homeScore ?? "")}" /></td>
              <td><input class="input" data-field="awayScore" type="number" step="0.5" value="${escapeHtml(match.awayScore ?? "")}" /></td>
              <td><input class="input" data-field="awayTeamName" value="${escapeHtml(match.awayTeamName || "")}" /></td>
              <td><input class="input" data-field="score" value="${escapeHtml(formatEditableScoreV105(match))}" placeholder="0-0" /></td>
              <td>
                <select class="input" data-field="status">
                  <option value="GIOCATA" ${match.status === "GIOCATA" ? "selected" : ""}>Giocata</option>
                  <option value="DA_GIOCARE" ${match.status !== "GIOCATA" ? "selected" : ""}>Da giocare</option>
                </select>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <small class="field-hint">Lo zip includerà il JSON della competizione e il manifest completo già aggiornato.</small>
  `;
}

function formatEditableScoreV105(match) {
  if (match.homeGoals !== "" && match.homeGoals !== undefined && match.awayGoals !== "" && match.awayGoals !== undefined) {
    return `${match.homeGoals}-${match.awayGoals}`;
  }
  return "";
}

function collectStaticCompetitionPreviewRowsV105() {
  return Array.from(document.querySelectorAll("[data-static-competition-preview-row]")).map((row, index) => {
    const getValue = (field) => row.querySelector(`[data-field="${field}"]`)?.value || "";
    const goals = parseGoalsFromScoreV105(getValue("score"));
    const stage = getValue("stage").trim().toUpperCase();
    const leg = getValue("leg").trim().toUpperCase();
    const stageInfo = normalizeCompetitionStageLabelV105(stage);
    return {
      rowIndex: index + 1,
      stage,
      leg,
      matchday: getMatchdayLabelFromStageV105(stageInfo, leg || "ANDATA"),
      leagueMatchday: parseNumberV105(getValue("leagueMatchday")),
      serieAMatchday: parseNumberV105(getValue("serieAMatchday")),
      matchDate: getValue("matchDate"),
      homeTeamName: getValue("homeTeamName").trim(),
      awayTeamName: getValue("awayTeamName").trim(),
      homeScore: parseNumberV105(getValue("homeScore")),
      awayScore: parseNumberV105(getValue("awayScore")),
      homeGoals: goals.homeGoals,
      awayGoals: goals.awayGoals,
      status: getValue("status") || "DA_GIOCARE"
    };
  }).filter((match) => match.homeTeamName && match.awayTeamName);
}

async function handleStaticCompetitionImportPreviewV105(event) {
  event.preventDefault();
  const file = document.getElementById("adminStaticCompetitionFile")?.files?.[0];
  if (!file) return;

  try {
    showMessage("adminStaticCompetitionImportStatus", "Lettura Excel in corso...");
    const XLSX = await loadXlsxLibrary();
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    const matches = parseStaticCompetitionWorkbookRowsV105(rows);
    if (!matches.length) throw new Error("Nessuna partita trovata. Controlla il formato dell'Excel.");

    state.staticCompetitionImportDraftV105 = {
      sourceFile: file.name,
      sheetName: firstSheetName,
      matches
    };

    const inferred = inferCompetitionPodiumV105(matches);
    const winnerInput = document.getElementById("adminStaticCompetitionWinner");
    const runnerUpInput = document.getElementById("adminStaticCompetitionRunnerUp");
    if (winnerInput && !winnerInput.value && inferred.winner) winnerInput.value = inferred.winner;
    if (runnerUpInput && !runnerUpInput.value && inferred.runnerUp) runnerUpInput.value = inferred.runnerUp;

    renderStaticCompetitionImportPreviewV105();
    showMessage("adminStaticCompetitionImportStatus", `Anteprima pronta: ${matches.length} partite.`);
  } catch (error) {
    console.error(error);
    showMessage("adminStaticCompetitionImportStatus", error.message || "Errore durante l'importazione.", true);
  }
}

function buildStaticCompetitionPayloadV105(matches) {
  const seasonId = document.getElementById("adminStaticCompetitionSeasonId")?.value || getCurrentSeasonId();
  const competitionName = document.getElementById("adminStaticCompetitionName")?.value?.trim() || "Competizione";
  const competitionSlug = (document.getElementById("adminStaticCompetitionSlug")?.value || makeIdPart(competitionName).replace(/_/g, "-")).trim();
  const competitionType = document.getElementById("adminStaticCompetitionType")?.value || "ALTRO";
  const status = document.getElementById("adminStaticCompetitionStatus")?.value || "CONCLUSA";
  const loadedAt = document.getElementById("adminStaticCompetitionLoadedAt")?.value || getTodayIsoDate();
  const sourceFile = state.staticCompetitionImportDraftV105?.sourceFile || document.getElementById("adminStaticCompetitionFile")?.files?.[0]?.name || "calendario.xlsx";
  const staticId = `${seasonId}-${competitionSlug}`;
  const competitionId = `${makeIdPart(seasonId)}_${competitionSlug}`;
  const file = `${seasonId}/${competitionSlug}-${seasonId}.json`;
  const label = `${competitionName} ${seasonId.replace("-", "/")}`;

  const normalizedMatches = matches.map((match, index) => ({
    id: `${competitionId}_${makeIdPart(match.matchday || match.stage || "fase")}_${index + 1}`,
    competitionId,
    seasonId,
    stage: match.stage || "",
    leg: match.leg || "",
    matchday: match.matchday || "",
    leagueMatchday: match.leagueMatchday === "" ? "" : Number(match.leagueMatchday),
    serieAMatchday: match.serieAMatchday === "" ? "" : Number(match.serieAMatchday),
    matchDate: match.matchDate || "",
    homeTeamName: match.homeTeamName || "",
    awayTeamName: match.awayTeamName || "",
    homeSeasonTeamId: "",
    awaySeasonTeamId: "",
    homeGoals: match.homeGoals === "" ? "" : Number(match.homeGoals),
    awayGoals: match.awayGoals === "" ? "" : Number(match.awayGoals),
    homeScore: match.homeScore === "" ? "" : Number(match.homeScore),
    awayScore: match.awayScore === "" ? "" : Number(match.awayScore),
    status: match.status || "DA_GIOCARE",
    source: "static-competition-calendar"
  }));

  const winnerInput = document.getElementById("adminStaticCompetitionWinner")?.value?.trim() || "";
  const runnerUpInput = document.getElementById("adminStaticCompetitionRunnerUp")?.value?.trim() || "";
  const inferred = inferCompetitionPodiumV105(normalizedMatches);
  const winner = winnerInput || inferred.winner;
  const runnerUp = runnerUpInput || inferred.runnerUp;
  const results = [];
  if (winner) {
    results.push({
      id: `${competitionId}_winner`,
      competitionId,
      seasonId,
      position: 1,
      teamName: winner,
      source: "static-competition-calendar"
    });
  }
  if (runnerUp) {
    results.push({
      id: `${competitionId}_runner_up`,
      competitionId,
      seasonId,
      position: 2,
      teamName: runnerUp,
      source: "static-competition-calendar"
    });
  }

  const payload = {
    meta: {
      id: staticId,
      seasonId,
      competitionId,
      competitionName,
      competitionSlug,
      label,
      sourceFile,
      loadedAt,
      version: 1,
      schema: "zonaorientale-static-competition-calendar-v1"
    },
    competition: {
      id: competitionId,
      seasonId,
      name: competitionName,
      type: competitionType,
      format: competitionType === "CAMPIONATO" ? "CLASSIFICA" : "GIRONI_KO",
      status,
      notes: "Calendario importato da file Excel statico.",
      source: "static-competition-calendar"
    },
    matches: normalizedMatches,
    results
  };

  const manifestEntry = {
    id: staticId,
    seasonId,
    competitionId,
    competitionName,
    competitionSlug,
    label,
    loadedAt,
    sourceFile,
    file,
    matches: normalizedMatches.length,
    playedMatches: normalizedMatches.filter((match) => match.status === "GIOCATA").length,
    status
  };

  return { payload, manifestEntry, file, staticId, competitionSlug, seasonId };
}

async function loadExistingCompetitionManifestV105() {
  try {
    const response = await fetch("./assets/competitions/manifest.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Manifest non presente");
    const manifest = await response.json();
    const competitions = Array.isArray(manifest.competitions)
      ? manifest.competitions
      : Array.isArray(manifest.items)
        ? manifest.items
        : [];
    return { ...manifest, competitions };
  } catch (error) {
    return { version: 1, generatedAt: new Date().toISOString(), competitions: [] };
  }
}

function upsertCompetitionManifestEntryV105(manifest, entry) {
  const competitions = Array.isArray(manifest.competitions) ? [...manifest.competitions] : [];
  const index = competitions.findIndex((item) => item.id === entry.id || item.file === entry.file);
  if (index >= 0) competitions[index] = entry;
  else competitions.push(entry);
  competitions.sort((a, b) => {
    const seasonCompare = String(b.seasonId || "").localeCompare(String(a.seasonId || ""), "it");
    if (seasonCompare) return seasonCompare;
    return String(a.competitionName || a.label || a.id || "").localeCompare(String(b.competitionName || b.label || b.id || ""), "it");
  });
  return {
    version: manifest.version || 1,
    generatedAt: new Date().toISOString(),
    competitions
  };
}

async function handleStaticCompetitionGenerateOverlayV105() {
  try {
    const matches = collectStaticCompetitionPreviewRowsV105();
    if (!matches.length) throw new Error("Nessuna partita valida in anteprima.");
    showMessage("adminStaticCompetitionImportStatus", "Generazione overlay...");

    const { payload, manifestEntry, file, staticId } = buildStaticCompetitionPayloadV105(matches);
    const existingManifest = await loadExistingCompetitionManifestV105();
    const manifest = upsertCompetitionManifestEntryV105(existingManifest, manifestEntry);
    const JSZip = await loadZipLibraryV105();
    const zip = new JSZip();
    zip.file("static/zonaorientale/assets/competitions/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
    zip.file(`static/zonaorientale/assets/competitions/${file}`, `${JSON.stringify(payload, null, 2)}\n`);
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlobV105(blob, `zonaorientale_competizione_${safeFileName(staticId)}_overlay.zip`);
    showMessage("adminStaticCompetitionImportStatus", "Zip overlay scaricato.");
  } catch (error) {
    console.error(error);
    showMessage("adminStaticCompetitionImportStatus", error.message || "Errore durante la generazione overlay.", true);
  }
}

function resetStaticCompetitionImportV105() {
  state.staticCompetitionImportDraftV105 = null;
  document.getElementById("adminStaticCompetitionImportForm")?.reset();
  updateStaticCompetitionSlugV105();
  renderStaticCompetitionImportPreviewV105();
  showMessage("adminStaticCompetitionImportStatus", "");
}

const renderAdminAreaBeforeV105 = renderAdminArea;
renderAdminArea = function renderAdminAreaV105() {
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel || !state.isAdmin) return renderAdminAreaBeforeV105();

  adminPanel.innerHTML = `
    <div class="page-heading">
      <div>
        <p class="eyebrow">Area riservata</p>
        <h2 id="adminTitle">Admin</h2>
        <p>Gestione Firebase, dati statici, utenti presidenti, richieste e snapshot pubblici.</p>
      </div>
    </div>
    ${renderPendingUsersAdminPanelV34()}
    ${renderTeamRequestsAdminPanelV34()}
    ${renderNewsAdminPanelV48()}
    ${renderSeasonAdminPanel()}
    ${renderPresidentAdminPanel()}
    ${renderTeamAdminPanel()}
    ${renderSeasonTeamAdminPanel()}
    ${renderRosterMovementsAdminPanel()}
    ${renderStadiumAdminPanel()}
    ${renderCompetitionAdminPanel()}
    ${renderCompetitionMatchesAdminPanel()}
    ${renderStaticCompetitionImportAdminPanelV105()}
    ${renderCompetitionResultsAdminPanel()}
    ${renderFifaRankingAdminPanel()}
    ${renderListoneToolsAdminPanel()}
    ${renderPublicSnapshotsAdminPanelV34()}
    ${renderBackupAdminPanel()}
  `;
  attachAdminHandlers();
};

const attachAdminHandlersBeforeV105 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV105() {
  attachAdminHandlersBeforeV105();
  document.getElementById("adminStaticCompetitionImportForm")?.addEventListener("submit", handleStaticCompetitionImportPreviewV105);
  document.getElementById("adminStaticCompetitionGenerateOverlay")?.addEventListener("click", handleStaticCompetitionGenerateOverlayV105);
  document.getElementById("adminStaticCompetitionReset")?.addEventListener("click", resetStaticCompetitionImportV105);
  document.getElementById("adminStaticCompetitionName")?.addEventListener("input", updateStaticCompetitionSlugV105);
  document.getElementById("adminStaticCompetitionSlug")?.addEventListener("input", (event) => { event.target.dataset.touched = "1"; });
};

/* V106 - Hotfix visibilita pannello import competizioni statiche in Admin.
   V105 aggiungeva la logica ma in alcuni flussi di render il pannello poteva non essere evidente.
   Questo hotfix lo apre di default, aggiunge una scorciatoia in alto e lo reinserisce se manca. */
function ensureStaticCompetitionImportAdminPanelV106() {
  if (!state.isAdmin) return;
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;

  state.collapsedAdminPanels.delete("adminStaticCompetitionImportPanel");

  let panel = document.getElementById("adminStaticCompetitionImportPanel");
  if (!panel && typeof renderStaticCompetitionImportAdminPanelV105 === "function") {
    const anchor = document.getElementById("adminCompetitionResultsPanel") || document.getElementById("adminListoneToolsPanel") || document.getElementById("adminPublicSnapshotsPanel");
    if (anchor) anchor.insertAdjacentHTML("beforebegin", renderStaticCompetitionImportAdminPanelV105());
    else adminPanel.insertAdjacentHTML("beforeend", renderStaticCompetitionImportAdminPanelV105());
    panel = document.getElementById("adminStaticCompetitionImportPanel");
    if (typeof attachAdminHandlers === "function") attachAdminHandlers();
  }

  if (panel) {
    panel.classList.remove("is-collapsed");
    const toggle = panel.querySelector('[data-admin-toggle-panel="adminStaticCompetitionImportPanel"]');
    if (toggle) toggle.textContent = "Riduci";
  }

  if (!document.getElementById("adminStaticCompetitionImportShortcut")) {
    const heading = adminPanel.querySelector(".page-heading");
    if (heading) {
      heading.insertAdjacentHTML("afterend", `
        <div id="adminStaticCompetitionImportShortcut" class="admin-import-shortcut">
          <button class="button button-primary button-small" type="button" data-jump-static-competition-import>
            Importa calendario competizione
          </button>
          <span class="muted small">Excel → anteprima modificabile → JSON statico + manifest</span>
        </div>
      `);
      const button = document.querySelector("[data-jump-static-competition-import]");
      button?.addEventListener("click", () => {
        state.collapsedAdminPanels.delete("adminStaticCompetitionImportPanel");
        const currentPanel = document.getElementById("adminStaticCompetitionImportPanel");
        if (currentPanel) {
          currentPanel.classList.remove("is-collapsed");
          const currentToggle = currentPanel.querySelector('[data-admin-toggle-panel="adminStaticCompetitionImportPanel"]');
          if (currentToggle) currentToggle.textContent = "Riduci";
          currentPanel.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  }
}

const renderAdminAreaBeforeV106 = renderAdminArea;
renderAdminArea = function renderAdminAreaV106() {
  renderAdminAreaBeforeV106();
  ensureStaticCompetitionImportAdminPanelV106();
};

const attachAdminHandlersBeforeV106 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV106() {
  attachAdminHandlersBeforeV106();
  ensureStaticCompetitionImportAdminPanelV106();
};


/* V108 - Associazione squadre statiche e competizioni custom.
   - Mostra il nome della competizione quando presente, altrimenti il tipo.
   - L'importatore statico salva homeSeasonTeamId/awaySeasonTeamId nel JSON.
   - L'anteprima import mostra una select per associare ogni squadra Excel a una squadra stagionale Firebase.
   - I JSON vecchi senza ID continuano a funzionare tramite fallback sul nome. */
function getCompetitionDisplayNameV108(competition) {
  const explicitName = String(competition?.name || competition?.competitionName || competition?.label || "").trim();
  if (explicitName) return explicitName;
  const type = competition?.type || competition?.competitionType || "";
  return getLabel(COMPETITION_TYPES, type) || type || "Competizione";
}

function getStaticCompetitionImportSeasonIdV108() {
  return document.getElementById("adminStaticCompetitionSeasonId")?.value || getCurrentSeasonId();
}

function getSeasonTeamImportOptionsV108(seasonId) {
  const { teamsById } = buildMaps();
  return (state.raw.seasonTeams || [])
    .filter((seasonTeam) => seasonTeam.seasonId === seasonId)
    .map((seasonTeam) => {
      const team = teamsById.get(seasonTeam.teamId);
      return {
        id: seasonTeam.id,
        name: getSeasonTeamDisplayName(seasonTeam.id) || seasonTeam.name || team?.name || seasonTeam.id
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name, "it", { numeric: true, sensitivity: "base" }));
}

function renderSeasonTeamSelectV108(field, selectedId, teamName) {
  const seasonId = getStaticCompetitionImportSeasonIdV108();
  const resolvedId = selectedId || resolveStaticSeasonTeamIdV101(seasonId, teamName || "", "");
  const options = getSeasonTeamImportOptionsV108(seasonId);
  return `
    <select class="input static-team-select" data-field="${escapeHtml(field)}" aria-label="Associazione squadra stagionale">
      <option value="">Solo nome Excel</option>
      ${options.map((option) => `
        <option value="${escapeHtml(option.id)}" data-team-name="${escapeHtml(option.name)}" ${option.id === resolvedId ? "selected" : ""}>${escapeHtml(option.name)}</option>
      `).join("")}
    </select>`;
}

renderStaticCompetitionImportPreviewV105 = function renderStaticCompetitionImportPreviewV108() {
  const report = document.getElementById("adminStaticCompetitionImportReport");
  const generateButton = document.getElementById("adminStaticCompetitionGenerateOverlay");
  const draft = state.staticCompetitionImportDraftV105;
  if (!report) return;

  if (!draft || !draft.matches?.length) {
    report.classList.add("hidden");
    if (generateButton) generateButton.disabled = true;
    return;
  }

  report.classList.remove("hidden");
  if (generateButton) generateButton.disabled = false;
  report.innerHTML = `
    <h3>Anteprima modificabile</h3>
    <p>Partite lette: <strong>${draft.matches.length}</strong>. Correggi i campi nella tabella prima di generare lo zip overlay.</p>
    <p class="field-hint">Associa Casa/Trasferta alle squadre stagionali: il JSON salverà anche <code>homeSeasonTeamId</code> e <code>awaySeasonTeamId</code>. Se lasci “Solo nome Excel”, il sito userà il nome come fallback.</p>
    <div class="table-wrap static-competition-preview-wrap">
      <table class="static-competition-preview-table">
        <thead>
          <tr>
            <th>Fase</th>
            <th>And./Rit.</th>
            <th>G. lega</th>
            <th>G. Serie A</th>
            <th>Data</th>
            <th>Casa</th>
            <th>ID casa</th>
            <th>FP casa</th>
            <th>FP trasf.</th>
            <th>Trasferta</th>
            <th>ID trasf.</th>
            <th>Ris.</th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody>
          ${draft.matches.map((match, index) => `
            <tr data-static-competition-preview-row="${index}">
              <td><input class="input" data-field="stage" value="${escapeHtml(match.stage || "")}" /></td>
              <td><input class="input" data-field="leg" value="${escapeHtml(match.leg || "")}" /></td>
              <td><input class="input" data-field="leagueMatchday" type="number" min="0" step="1" value="${escapeHtml(match.leagueMatchday || "")}" /></td>
              <td><input class="input" data-field="serieAMatchday" type="number" min="0" step="1" value="${escapeHtml(match.serieAMatchday || "")}" /></td>
              <td><input class="input" data-field="matchDate" type="date" value="${escapeHtml(match.matchDate || "")}" /></td>
              <td><input class="input" data-field="homeTeamName" value="${escapeHtml(match.homeTeamName || "")}" /></td>
              <td>${renderSeasonTeamSelectV108("homeSeasonTeamId", match.homeSeasonTeamId || "", match.homeTeamName || "")}</td>
              <td><input class="input" data-field="homeScore" type="number" step="0.5" value="${escapeHtml(match.homeScore ?? "")}" /></td>
              <td><input class="input" data-field="awayScore" type="number" step="0.5" value="${escapeHtml(match.awayScore ?? "")}" /></td>
              <td><input class="input" data-field="awayTeamName" value="${escapeHtml(match.awayTeamName || "")}" /></td>
              <td>${renderSeasonTeamSelectV108("awaySeasonTeamId", match.awaySeasonTeamId || "", match.awayTeamName || "")}</td>
              <td><input class="input" data-field="score" value="${escapeHtml(formatEditableScoreV105(match))}" placeholder="0-0" /></td>
              <td>
                <select class="input" data-field="status">
                  <option value="GIOCATA" ${match.status === "GIOCATA" ? "selected" : ""}>Giocata</option>
                  <option value="DA_GIOCARE" ${match.status !== "GIOCATA" ? "selected" : ""}>Da giocare</option>
                </select>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
    <small class="field-hint">Lo zip includerà il JSON della competizione e il manifest completo già aggiornato.</small>
  `;
};

function syncStaticCompetitionTeamNameFromSelectV108(select) {
  if (!select || !select.matches?.("select.static-team-select")) return;
  const row = select.closest("[data-static-competition-preview-row]");
  if (!row) return;
  const option = select.selectedOptions?.[0];
  const teamName = option?.dataset?.teamName || "";
  if (!teamName) return;
  const field = select.dataset.field === "homeSeasonTeamId" ? "homeTeamName" : "awayTeamName";
  const input = row.querySelector(`[data-field="${field}"]`);
  if (input) input.value = teamName;
}

collectStaticCompetitionPreviewRowsV105 = function collectStaticCompetitionPreviewRowsV108() {
  return Array.from(document.querySelectorAll("[data-static-competition-preview-row]")).map((row, index) => {
    const getValue = (field) => row.querySelector(`[data-field="${field}"]`)?.value || "";
    const goals = parseGoalsFromScoreV105(getValue("score"));
    const stage = getValue("stage").trim().toUpperCase();
    const leg = getValue("leg").trim().toUpperCase();
    const stageInfo = normalizeCompetitionStageLabelV105(stage);
    const homeTeamName = getValue("homeTeamName").trim();
    const awayTeamName = getValue("awayTeamName").trim();
    const seasonId = getStaticCompetitionImportSeasonIdV108();
    return {
      rowIndex: index + 1,
      stage,
      leg,
      matchday: getMatchdayLabelFromStageV105(stageInfo, leg || "ANDATA"),
      leagueMatchday: parseNumberV105(getValue("leagueMatchday")),
      serieAMatchday: parseNumberV105(getValue("serieAMatchday")),
      matchDate: getValue("matchDate"),
      homeTeamName,
      awayTeamName,
      homeSeasonTeamId: getValue("homeSeasonTeamId") || resolveStaticSeasonTeamIdV101(seasonId, homeTeamName, ""),
      awaySeasonTeamId: getValue("awaySeasonTeamId") || resolveStaticSeasonTeamIdV101(seasonId, awayTeamName, ""),
      homeScore: parseNumberV105(getValue("homeScore")),
      awayScore: parseNumberV105(getValue("awayScore")),
      homeGoals: goals.homeGoals,
      awayGoals: goals.awayGoals,
      status: getValue("status") || "DA_GIOCARE"
    };
  }).filter((match) => match.homeTeamName && match.awayTeamName);
};

buildStaticCompetitionPayloadV105 = function buildStaticCompetitionPayloadV108(matches) {
  const seasonId = document.getElementById("adminStaticCompetitionSeasonId")?.value || getCurrentSeasonId();
  const competitionName = document.getElementById("adminStaticCompetitionName")?.value?.trim() || "Competizione";
  const competitionSlug = (document.getElementById("adminStaticCompetitionSlug")?.value || makeIdPart(competitionName).replace(/_/g, "-")).trim();
  const competitionType = document.getElementById("adminStaticCompetitionType")?.value || "ALTRO";
  const status = document.getElementById("adminStaticCompetitionStatus")?.value || "CONCLUSA";
  const loadedAt = document.getElementById("adminStaticCompetitionLoadedAt")?.value || getTodayIsoDate();
  const sourceFile = state.staticCompetitionImportDraftV105?.sourceFile || document.getElementById("adminStaticCompetitionFile")?.files?.[0]?.name || "calendario.xlsx";
  const staticId = `${seasonId}-${competitionSlug}`;
  const competitionId = `${makeIdPart(seasonId)}_${competitionSlug}`;
  const file = `${seasonId}/${competitionSlug}-${seasonId}.json`;
  const label = `${competitionName} ${seasonId.replace("-", "/")}`;

  const normalizedMatches = matches.map((match, index) => {
    const homeSeasonTeamId = match.homeSeasonTeamId || resolveStaticSeasonTeamIdV101(seasonId, match.homeTeamName || "", "");
    const awaySeasonTeamId = match.awaySeasonTeamId || resolveStaticSeasonTeamIdV101(seasonId, match.awayTeamName || "", "");
    return {
      id: `${competitionId}_${makeIdPart(match.matchday || match.stage || "fase")}_${index + 1}`,
      competitionId,
      seasonId,
      stage: match.stage || "",
      leg: match.leg || "",
      matchday: match.matchday || "",
      leagueMatchday: match.leagueMatchday === "" ? "" : Number(match.leagueMatchday),
      serieAMatchday: match.serieAMatchday === "" ? "" : Number(match.serieAMatchday),
      matchDate: match.matchDate || "",
      homeTeamName: match.homeTeamName || "",
      awayTeamName: match.awayTeamName || "",
      homeSeasonTeamId,
      awaySeasonTeamId,
      homeGoals: match.homeGoals === "" ? "" : Number(match.homeGoals),
      awayGoals: match.awayGoals === "" ? "" : Number(match.awayGoals),
      homeScore: match.homeScore === "" ? "" : Number(match.homeScore),
      awayScore: match.awayScore === "" ? "" : Number(match.awayScore),
      status: match.status || "DA_GIOCARE",
      source: "static-competition-calendar"
    };
  });

  const winnerInput = document.getElementById("adminStaticCompetitionWinner")?.value?.trim() || "";
  const runnerUpInput = document.getElementById("adminStaticCompetitionRunnerUp")?.value?.trim() || "";
  const inferred = inferCompetitionPodiumV105(normalizedMatches);
  const winner = winnerInput || inferred.winner;
  const runnerUp = runnerUpInput || inferred.runnerUp;
  const results = [];
  if (winner) {
    results.push({
      id: `${competitionId}_winner`,
      competitionId,
      seasonId,
      position: 1,
      seasonTeamId: resolveStaticSeasonTeamIdV101(seasonId, winner, ""),
      teamName: winner,
      source: "static-competition-calendar"
    });
  }
  if (runnerUp) {
    results.push({
      id: `${competitionId}_runner_up`,
      competitionId,
      seasonId,
      position: 2,
      seasonTeamId: resolveStaticSeasonTeamIdV101(seasonId, runnerUp, ""),
      teamName: runnerUp,
      source: "static-competition-calendar"
    });
  }

  const payload = {
    meta: {
      id: staticId,
      seasonId,
      competitionId,
      competitionName,
      competitionSlug,
      competitionType,
      label,
      sourceFile,
      loadedAt,
      version: 2,
      schema: "zonaorientale-static-competition-calendar-v2"
    },
    competition: {
      id: competitionId,
      seasonId,
      name: competitionName,
      type: competitionType,
      format: competitionType === "CAMPIONATO" ? "CLASSIFICA" : "GIRONI_KO",
      status,
      notes: "Calendario importato da file Excel statico.",
      source: "static-competition-calendar"
    },
    matches: normalizedMatches,
    results
  };

  const manifestEntry = {
    id: staticId,
    seasonId,
    competitionId,
    competitionName,
    competitionSlug,
    competitionType,
    label,
    loadedAt,
    sourceFile,
    file,
    matches: normalizedMatches.length,
    playedMatches: normalizedMatches.filter((match) => match.status === "GIOCATA").length,
    status
  };

  return { payload, manifestEntry, file, staticId, competitionSlug, seasonId };
};

const renderCompetitionsPublicBeforeV108 = renderCompetitionsPublic;
renderCompetitionsPublic = function renderCompetitionsPublicV108() {
  const list = document.getElementById("competitionsList");
  if (!list) return;

  const seasonId = getCurrentSeasonId();
  const competitions = getSeasonCompetitionsForPublicDisplayV52(seasonId);

  if (!competitions.length) {
    list.innerHTML = `<p class="muted">Nessuna competizione inserita per ${escapeHtml(seasonId || "la stagione selezionata")}.</p>`;
    return;
  }

  list.innerHTML = competitions.map((competition) => `
    <article class="competition-card${hasStaticCompetitionSourceV102(competition) ? " competition-card-static-source" : " competition-card-firebase-source"}">
      <div class="competition-card-header">
        <div>
          <h3>${escapeHtml(getCompetitionDisplayNameV108(competition))} ${renderCompetitionSourceBadgeV103(competition)}</h3>
        </div>
        <span class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</span>
      </div>
      ${renderStaticCompetitionSourceLineV102(competition)}
      ${competition.notes ? `<p>${escapeHtml(competition.notes)}</p>` : ""}
      ${renderCompetitionResultsPublic(competition)}
      ${renderCompetitionMatchesPublic(competition)}
    </article>
  `).join("");
};

renderDashboard = function renderDashboardV108() {
  const seasonId = getCurrentSeasonId();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const competitions = getSeasonCompetitionsForPublicDisplayV52(seasonId);
  const stats = typeof getSeasonFmStats === "function" ? getSeasonFmStats(seasonId) : null;

  const metricClubs = document.getElementById("metricClubs");
  const metricTotalFm = document.getElementById("metricTotalFm");
  const metricAlerts = document.getElementById("metricAlerts");

  if (metricClubs) metricClubs.textContent = String(seasonTeams.length || getParticipantsCount(seasonId) || 0);
  if (metricTotalFm) metricTotalFm.textContent = stats ? `${formatFm(stats.total)} (medio ${formatFm(stats.average)})` : "- (medio -)";
  if (metricAlerts) metricAlerts.textContent = String(competitions.filter((competition) => competition.status === "ATTIVA").length);

  const standings = document.getElementById("dashboardStandings");
  if (standings) {
    standings.innerHTML = competitions.length
      ? competitions.map((competition) => `
        <details class="stack-item dashboard-subsection dashboard-competition-subsection" open>
          <summary>
            <span>
              <strong>${escapeHtml(getCompetitionDisplayNameV108(competition))}</strong>
              <small class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</small>
              ${renderCompetitionSourceBadgeV103(competition)}
            </span>
            <span class="button button-secondary button-small details-toggle-label" aria-hidden="true">Ingrandisci/Riduci</span>
          </summary>
          ${renderDashboardCompetitionSummary(competition)}
        </details>`).join("")
      : `<p class="muted">Nessuna competizione inserita per questa stagione.</p>`;
  }

  renderDashboardCalendar(seasonId);
  renderDashboardNewsV42();
  if (typeof normalizeToggleLabelsV29 === "function") normalizeToggleLabelsV29();
};

const attachAdminHandlersBeforeV108 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV108() {
  attachAdminHandlersBeforeV108();
  const report = document.getElementById("adminStaticCompetitionImportReport");
  if (report && report.dataset.teamSelectSyncV108 !== "1") {
    report.dataset.teamSelectSyncV108 = "1";
    report.addEventListener("change", (event) => {
      if (event.target?.matches?.("select.static-team-select")) {
        syncStaticCompetitionTeamNameFromSelectV108(event.target);
      }
    });
  }
  document.getElementById("adminStaticCompetitionSeasonId")?.addEventListener("change", () => {
    if (state.staticCompetitionImportDraftV105?.matches?.length) renderStaticCompetitionImportPreviewV105();
  });
};

/* V109 - Competizioni statiche come fonte primaria.
   Se esiste un calendario statico in assets/competitions per una competizione,
   il sito usa quello come fonte canonica per partite e risultati. Se non esiste,
   resta il fallback Firebase/snapshot. L'importatore continua a mostrare sempre
   l'anteprima modificabile e salva homeSeasonTeamId/awaySeasonTeamId nel JSON. */
function normalizeCompetitionSlugV109(value) {
  return makeIdPart(String(value || "").replace(/[’']/g, "")).replace(/_/g, "-");
}

function getCompetitionStaticLookupValuesV109(competition = {}) {
  return {
    id: String(competition.id || ""),
    seasonId: String(competition.seasonId || ""),
    name: normalizeKey(competition.name || competition.competitionName || competition.label || ""),
    type: String(competition.type || competition.competitionType || ""),
    slug: normalizeCompetitionSlugV109(competition.competitionSlug || competition.slug || competition.name || competition.id || ""),
    staticCalendarId: String(competition.staticCalendarId || "")
  };
}

function getCalendarStaticLookupValuesV109(calendar = {}) {
  const meta = calendar.meta || {};
  const competition = calendar.competition || {};
  return {
    id: String(calendar.id || meta.id || ""),
    seasonId: String(calendar.seasonId || meta.seasonId || competition.seasonId || ""),
    competitionId: String(calendar.competitionId || meta.competitionId || competition.id || ""),
    name: normalizeKey(calendar.competitionName || meta.competitionName || competition.name || calendar.label || ""),
    type: String(calendar.competitionType || meta.competitionType || competition.type || ""),
    slug: normalizeCompetitionSlugV109(calendar.competitionSlug || meta.competitionSlug || competition.competitionSlug || calendar.id || meta.id || calendar.competitionName || competition.name || "")
  };
}

function getStaticCompetitionCalendarForCompetitionV109(competition) {
  if (!competition) return null;
  const calendars = Array.isArray(state.competitionCalendars) ? state.competitionCalendars : [];
  if (!calendars.length) return null;
  const target = getCompetitionStaticLookupValuesV109(competition);

  return calendars.find((calendar) => {
    const item = getCalendarStaticLookupValuesV109(calendar);
    if (target.staticCalendarId && item.id && item.id === target.staticCalendarId) return true;
    if (item.competitionId && item.competitionId === target.id) return true;
    if (item.seasonId && target.seasonId && item.seasonId !== target.seasonId) return false;
    if (item.slug && target.slug && item.slug === target.slug) return true;
    if (item.name && target.name && item.name === target.name) return true;
    return Boolean(item.type && target.type && item.type === target.type && item.name && target.name && item.name === target.name);
  }) || null;
}

const getStaticCompetitionCalendarForCompetitionBeforeV109 = typeof getStaticCompetitionCalendarForCompetitionV102 === "function"
  ? getStaticCompetitionCalendarForCompetitionV102
  : null;

getStaticCompetitionCalendarForCompetitionV102 = function getStaticCompetitionCalendarForCompetitionV109Compat(competition) {
  return getStaticCompetitionCalendarForCompetitionV109(competition)
    || (getStaticCompetitionCalendarForCompetitionBeforeV109 ? getStaticCompetitionCalendarForCompetitionBeforeV109(competition) : null);
};

function getCompetitionForStaticLookupV109(competitionId) {
  return (state.raw.competitions || []).find((competition) => competition.id === competitionId) || null;
}

function getStaticCompetitionMatchesCanonicalV109(competition) {
  const calendar = getStaticCompetitionCalendarForCompetitionV109(competition);
  if (!calendar || !Array.isArray(calendar.matches)) return null;
  const seasonId = competition?.seasonId || calendar.seasonId || calendar.meta?.seasonId || calendar.competition?.seasonId || getCurrentSeasonId();
  const competitionId = competition?.id || calendar.competitionId || calendar.meta?.competitionId || calendar.competition?.id || "";
  return calendar.matches.map((match, index) => {
    const normalized = normalizeStaticCompetitionMatchV101(match, seasonId, competitionId, index);
    return {
      ...normalized,
      staticCalendarId: calendar.id || calendar.meta?.id || "",
      staticSourceFile: calendar.sourceFile || calendar.meta?.sourceFile || "assets/competitions",
      hasStaticCalendarData: true,
      source: "static-competition-calendar"
    };
  });
}

const getCompetitionMatchesBeforeV109 = getCompetitionMatches;
getCompetitionMatches = function getCompetitionMatchesV109(competitionId) {
  const competition = getCompetitionForStaticLookupV109(competitionId);
  const staticMatches = getStaticCompetitionMatchesCanonicalV109(competition);
  if (staticMatches) return sortMatchesForDisplay(staticMatches);
  return getCompetitionMatchesBeforeV109(competitionId);
};

function getStaticCompetitionResultsCanonicalV109(competition) {
  const calendar = getStaticCompetitionCalendarForCompetitionV109(competition);
  if (!calendar || !Array.isArray(calendar.results)) return null;
  const seasonId = competition?.seasonId || calendar.seasonId || calendar.meta?.seasonId || calendar.competition?.seasonId || getCurrentSeasonId();
  const competitionId = competition?.id || calendar.competitionId || calendar.meta?.competitionId || calendar.competition?.id || "";
  return calendar.results.map((result, index) => ({
    ...normalizeStaticCompetitionResultV101(result, seasonId, competitionId, index),
    staticCalendarId: calendar.id || calendar.meta?.id || "",
    staticSourceFile: calendar.sourceFile || calendar.meta?.sourceFile || "assets/competitions",
    hasStaticCalendarData: true,
    source: "static-competition-calendar"
  })).sort((a, b) => Number(a.position || 999) - Number(b.position || 999));
}

const getCompetitionResultsBeforeV109 = getCompetitionResults;
getCompetitionResults = function getCompetitionResultsV109(competitionId) {
  const competition = getCompetitionForStaticLookupV109(competitionId);
  const staticResults = getStaticCompetitionResultsCanonicalV109(competition);
  if (staticResults) return staticResults;
  return getCompetitionResultsBeforeV109(competitionId);
};

function ensureStaticCompetitionImportPreviewHintV109() {
  const panel = document.getElementById("adminStaticCompetitionImportPanel");
  if (!panel || panel.dataset.previewHintV109 === "1") return;
  panel.dataset.previewHintV109 = "1";
  const fileInput = document.getElementById("adminStaticCompetitionFile");
  fileInput?.addEventListener("change", () => {
    if (!fileInput.files?.[0]) return;
    showMessage("adminStaticCompetitionImportStatus", "File selezionato. Genero l'anteprima modificabile...");
    handleStaticCompetitionImportPreviewV105({ preventDefault() {} });
  });
}

const attachAdminHandlersBeforeV109 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV109() {
  attachAdminHandlersBeforeV109();
  ensureStaticCompetitionImportPreviewHintV109();
};

const renderAdminAreaBeforeV109 = renderAdminArea;
renderAdminArea = function renderAdminAreaV109() {
  renderAdminAreaBeforeV109();
  ensureStaticCompetitionImportPreviewHintV109();
};

/* V111 - Pagina competizione e fasi calendario robuste.
   - Static JSON resta fonte primaria per calendari/risultati; Firebase e snapshot restano fallback.
   - Le fasi distinguono andata, ritorno e partita secca in base alla presenza reale del ritorno.
   - Aggiunge il link "Apri competizione" a ogni competizione pubblica. */
function getCompetitionDisplayNameV111(competition) {
  if (typeof getCompetitionStaticDisplayNameV110 === "function") {
    const staticName = getCompetitionStaticDisplayNameV110(competition);
    if (staticName) return staticName;
  }
  if (typeof getCompetitionPublicDisplayNameV110 === "function") {
    const name = getCompetitionPublicDisplayNameV110(competition);
    if (name) return name;
  }
  if (typeof getCompetitionDisplayNameV108 === "function") {
    const name = getCompetitionDisplayNameV108(competition);
    if (name) return name;
  }
  return competition?.name || competition?.competitionName || competition?.label || getLabel(COMPETITION_TYPES, competition?.type) || competition?.type || "Competizione";
}

function getCompetitionOpenUrlV111(competition) {
  const params = new URLSearchParams();
  const seasonId = competition?.seasonId || getCurrentSeasonId();
  if (seasonId) params.set("seasonId", seasonId);
  if (competition?.id) params.set("competitionId", competition.id);
  if (competition?.staticCalendarId) params.set("staticCalendarId", competition.staticCalendarId);
  const calendar = typeof getStaticCompetitionCalendarForCompetitionV102 === "function"
    ? getStaticCompetitionCalendarForCompetitionV102(competition)
    : null;
  const calendarId = calendar?.id || calendar?.meta?.id || "";
  if (calendarId && !params.has("staticCalendarId")) params.set("staticCalendarId", calendarId);
  const slug = competition?.competitionSlug || calendar?.competitionSlug || calendar?.meta?.competitionSlug || "";
  if (slug) params.set("slug", slug);
  return `./competition.html?${params.toString()}`;
}

function renderOpenCompetitionButtonV111(competition) {
  return `<a class="button button-secondary button-small competition-open-button" href="${escapeHtml(getCompetitionOpenUrlV111(competition))}">Apri competizione</a>`;
}

function getCompetitionSourceBadgeV111(competition) {
  if (typeof renderCompetitionSourceBadgeV103 === "function") return renderCompetitionSourceBadgeV103(competition);
  return "";
}

function cleanStageTextV111(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function getMatchBaseStageV111(match) {
  const stageRaw = cleanStageTextV111(match?.stage || match?.phase || match?.round || "");
  const legRaw = cleanStageTextV111(match?.leg || match?.roundLeg || "");
  const matchdayRaw = cleanStageTextV111(match?.matchday || "");
  const combinedOriginal = `${stageRaw} ${legRaw} ${matchdayRaw}`.trim();
  const combined = combinedOriginal.replace(/FINAL\s+FOUR/g, " ");

  if (/FINALE|FINAL\b/.test(combined)) return { key: "finale", label: "Finale", rank: 900 };
  if (/SEMIFINAL|SEMI|\bSF\b/.test(combined)) return { key: "semifinali", label: "Semifinali", rank: 800 };
  if (/QUARTI|QUART|\bQF\b/.test(combined)) return { key: "quarti-finale", label: "Quarti di finale", rank: 700 };
  if (/OTTAVI|OTTAV|\bR16\b/.test(combined)) return { key: "ottavi-finale", label: "Ottavi di finale", rank: 600 };
  if (/FINAL\s+FOUR/.test(combinedOriginal)) return { key: "final-four", label: "Final Four", rank: 650 };

  const leagueDay = Number(match?.leagueMatchday || 0);
  if (Number.isFinite(leagueDay) && leagueDay > 0) return { key: `giornata-${leagueDay}`, label: `Giornata ${leagueDay}`, rank: 100 + leagueDay };
  const serieDay = Number(match?.serieAMatchday || 0);
  if (Number.isFinite(serieDay) && serieDay > 0) return { key: `serie-a-${serieDay}`, label: `Serie A ${serieDay}`, rank: 50 + serieDay };
  const fallback = String(match?.matchday || match?.stage || match?.phase || "Partite").trim() || "Partite";
  return { key: normalizeKey(fallback) || "partite", label: fallback, rank: 0 };
}

function getMatchLegCodeV111(match) {
  const base = getMatchBaseStageV111(match);
  if (base.key === "finale") return "finale";
  const legRaw = cleanStageTextV111(match?.leg || match?.roundLeg || match?.matchday || "");
  if (/RITORNO|RETURN|\bRIT\b/.test(legRaw)) return "ritorno";
  if (/ANDATA|FIRST|\bAND\b/.test(legRaw)) return "andata";
  if (/SECCA|UNICA|SINGLE|ONE\s+LEG/.test(legRaw)) return "secca";
  return "secca";
}

function buildStageLegContextV111(matches) {
  const context = new Map();
  matches.forEach((match) => {
    const base = getMatchBaseStageV111(match);
    if (!context.has(base.key)) context.set(base.key, new Set());
    const leg = getMatchLegCodeV111(match);
    if (leg === "andata" || leg === "ritorno") context.get(base.key).add(leg);
  });
  return context;
}

function getMatchStageInfoV111(match, legContext) {
  const base = getMatchBaseStageV111(match);
  if (base.key === "finale") return { key: "finale", label: "Finale", rank: base.rank };

  const declaredLeg = getMatchLegCodeV111(match);
  const legs = legContext?.get(base.key) || new Set();
  const hasTwoLegs = legs.has("andata") && legs.has("ritorno");
  const leg = hasTwoLegs ? declaredLeg : "secca";

  if (leg === "ritorno") return { key: `${base.key}-ritorno`, label: `${base.label} ritorno`, rank: base.rank + 20 };
  if (leg === "andata") return { key: `${base.key}-andata`, label: `${base.label} andata`, rank: base.rank + 10 };
  return { key: base.key, label: base.label, rank: base.rank + 15 };
}

function groupCompetitionMatchesByStageV111(matches) {
  const legContext = buildStageLegContextV111(matches);
  const groups = new Map();
  matches.forEach((match) => {
    const info = getMatchStageInfoV111(match, legContext);
    if (!groups.has(info.key)) groups.set(info.key, { key: info.key, label: info.label, rank: info.rank, matches: [] });
    groups.get(info.key).matches.push(match);
  });
  return [...groups.values()].sort((a, b) => {
    const rankDiff = b.rank - a.rank;
    if (rankDiff) return rankDiff;
    return String(a.label).localeCompare(String(b.label), "it", { numeric: true, sensitivity: "base" });
  });
}

function sortMatchesInsideStageV111(matches) {
  return [...matches].sort((a, b) => {
    const dayDiff = Number(b.leagueMatchday || b.serieAMatchday || 0) - Number(a.leagueMatchday || a.serieAMatchday || 0);
    if (dayDiff) return dayDiff;
    const idCompare = String(a.id || "").localeCompare(String(b.id || ""), "it", { numeric: true, sensitivity: "base" });
    if (idCompare) return idCompare;
    return String(a.homeTeamName || getSeasonTeamDisplayName(a.homeSeasonTeamId) || "").localeCompare(String(b.homeTeamName || getSeasonTeamDisplayName(b.homeSeasonTeamId) || ""), "it", { numeric: true, sensitivity: "base" });
  });
}

function renderCompetitionMatchesPublicV111(competition) {
  const matches = getCompetitionMatches(competition.id);
  if (!matches.length) return `<p class="muted">Nessuna partita inserita per questa competizione.</p>`;
  const groups = groupCompetitionMatchesByStageV111(matches);
  return `
    <div class="competition-matches-public competition-match-groups">
      ${groups.map((group) => `
        <details class="detail-section compact-detail-section competition-match-stage-group competition-match-stage-details" open>
          <summary class="competition-match-stage-summary">
            <h4>${escapeHtml(group.label)}</h4>
            <span class="button button-secondary button-small competition-stage-toggle-label" aria-hidden="true">Riduci/Espandi</span>
          </summary>
          ${renderMatchRowsPreserveOrderV103(sortMatchesInsideStageV111(group.matches), "Nessuna partita inserita.")}
        </details>`).join("")}
    </div>`;
}

renderCompetitionMatchesPublic = renderCompetitionMatchesPublicV111;

renderCompetitionsPublic = function renderCompetitionsPublicV111() {
  const list = document.getElementById("competitionsList");
  if (!list) return;

  const seasonId = getCurrentSeasonId();
  const competitions = getSeasonCompetitionsForPublicDisplayV52(seasonId);

  if (!competitions.length) {
    list.innerHTML = `<p class="muted">Nessuna competizione inserita per ${escapeHtml(seasonId || "la stagione selezionata")}.</p>`;
    return;
  }

  list.innerHTML = competitions.map((competition) => `
    <article class="competition-card${hasStaticCompetitionSourceV102(competition) ? " competition-card-static-source" : " competition-card-firebase-source"}">
      <div class="competition-card-header competition-card-header-with-actions">
        <div>
          <h3>${escapeHtml(getCompetitionDisplayNameV111(competition))} ${getCompetitionSourceBadgeV111(competition)}</h3>
        </div>
        <div class="competition-card-actions">
          ${renderOpenCompetitionButtonV111(competition)}
          <span class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</span>
        </div>
      </div>
      ${renderStaticCompetitionSourceLineV102(competition)}
      ${competition.notes ? `<p>${escapeHtml(competition.notes)}</p>` : ""}
      ${renderCompetitionResultsPublic(competition)}
      ${renderCompetitionMatchesPublic(competition)}
    </article>
  `).join("");
};

renderDashboard = function renderDashboardV111() {
  const seasonId = getCurrentSeasonId();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const competitions = getSeasonCompetitionsForPublicDisplayV52(seasonId);
  const stats = typeof getSeasonFmStats === "function" ? getSeasonFmStats(seasonId) : null;

  const metricClubs = document.getElementById("metricClubs");
  const metricTotalFm = document.getElementById("metricTotalFm");
  const metricAlerts = document.getElementById("metricAlerts");

  if (metricClubs) metricClubs.textContent = String(seasonTeams.length || getParticipantsCount(seasonId) || 0);
  if (metricTotalFm) metricTotalFm.textContent = stats ? `${formatFm(stats.total)} (medio ${formatFm(stats.average)})` : "- (medio -)";
  if (metricAlerts) metricAlerts.textContent = String(competitions.filter((competition) => competition.status === "ATTIVA").length);

  const standings = document.getElementById("dashboardStandings");
  if (standings) {
    standings.innerHTML = competitions.length
      ? competitions.map((competition) => `
        <details class="stack-item dashboard-subsection dashboard-competition-subsection" open>
          <summary>
            <span>
              <strong>${escapeHtml(getCompetitionDisplayNameV111(competition))}</strong>
              <small class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</small>
              ${getCompetitionSourceBadgeV111(competition)}
            </span>
            <span class="button button-secondary button-small details-toggle-label" aria-hidden="true">Ingrandisci/Riduci</span>
          </summary>
          ${renderDashboardCompetitionSummary(competition)}
        </details>`).join("")
      : `<p class="muted">Nessuna competizione inserita per questa stagione.</p>`;
  }

  renderDashboardCalendar(seasonId);
  renderDashboardNewsV42();
  if (typeof normalizeToggleLabelsV29 === "function") normalizeToggleLabelsV29();
};
