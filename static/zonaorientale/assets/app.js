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
  query,
  where,
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
import { setupMobileTables } from "./js/mobile/mobile-tables.js";
import { setupAdaptiveMobileViewport } from "./js/mobile/mobile-viewport.js";
import { createMobileRosterHelpersV169 } from "./js/mobile/mobile-rosters.js";

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
  guessTeamLogoByName as guessTeamLogoByNameV125,
  getSeasonTeamNameCandidates as getSeasonTeamNameCandidatesV125
} from "./js/domain/team-logos.js";
import { createTransferMarketHelpersV128 } from "./js/market/transfer-market.js";
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
import { createAdminUserApprovalHelpersV129 } from "./js/admin/admin-users.js";
import { createPublicSnapshotAdminHelpersV129 } from "./js/admin/public-snapshots.js?v=192";
import { createAdminCompetitionHelpersV131 } from "./js/admin/admin-competitions.js";


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

function getTeamById(teamId) {
  const { teamsById } = buildMaps();
  return teamsById.get(teamId) || null;
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
          <tr><th>Fase</th><th>Partita</th><th>Data</th><th class="number">Ris.</th></tr>
        </thead>
        <tbody>
          ${sortedMatches.map((match) => `
            <tr>
              <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
              <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
              <td data-label="Data">${escapeHtml(match.matchDate || "-")}</td>
              <td data-label="Ris." class="number">${escapeHtml(formatMatchResult(match))}</td>
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
              <th class="number">Ris.</th>
            </tr>
          </thead>
          <tbody>
            ${group.matches.map((match) => `
              <tr>
                <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
                <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
                <td data-label="Data">${escapeHtml(match.matchDate || "-")}</td>
                <td data-label="Ris." class="number">${escapeHtml(formatMatchResult(match))}</td>
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
    <div class="detail-section palmares-competitions-section-v167">
      <h3>Palmarès per competizione</h3>
      <div class="palmares-grid">${palmaresHtml}</div>
    </div>
    <div class="detail-section fifa-ranking-section-v184">
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
  return adminCompetitionHelpersV131.renderCompetitionResultsAdminPanel();
}
function renderCompetitionResultsEditor(competitionId) {
  return adminCompetitionHelpersV131.renderCompetitionResultsEditor(competitionId);
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
      <td data-label="Tipo"><span class="status status-muted movement-type-badge movement-type-badge-${escapeHtml(String(movement.type || "").toLowerCase())}">${movement.type === "INITIAL_BUDGET" ? "Budget<br>Iniziale" : escapeHtml(getFmMovementLabel(movement.type))}</span></td>
      <td data-label="Giocatore">${movement.type === "INITIAL_BUDGET" ? "-" : `${escapeHtml(movement.playerName || "-")}${movement.targetSeasonTeamId ? `<small class="muted"> → ${escapeHtml(getSeasonTeamDisplayName(movement.targetSeasonTeamId))}</small>` : ""}`}</td>
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
    <div class="detail-section palmares-competitions-section-v167">
      <h3>Palmarès per competizione</h3>
      <div class="palmares-grid">${palmaresHtml}</div>
    </div>
    <div class="detail-section fifa-ranking-section-v184">
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
  const allNewsRowsV134 = (state.raw.news || [])
    .slice()
    .sort((a, b) => getNewsSortTimeV79(b) - getNewsSortTimeV79(a));
  const rows = allNewsRowsV134
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
      <summary><strong>Comunicati pubblicati</strong><span>Tutti · ${allNewsRowsV134.length}</span></summary>
      <div class="admin-list">${rows}</div>
    </details>`;
  return renderAdminPanel("adminNewsPanel", "Comunicazioni", "Comunicati", "Pubblica, modifica o cancella definitivamente da Firebase qualsiasi comunicato della lega.", body);
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
  if (!confirm("Eliminare definitivamente questo comunicato anche da Firebase?")) return;
  const status = document.getElementById("adminNewsStatus");
  if (status) status.textContent = "Eliminazione comunicato da Firebase...";
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

function normalizeUserApprovalStatusV138(status) {
  return String(status || "PENDING").trim().toUpperCase();
}

function isPendingUserApprovalV138(item) {
  const status = normalizeUserApprovalStatusV138(item?.status);
  return status === "PENDING" || status === "EMAIL_NOT_VERIFIED" || status === "";
}

function isRejectedUserApprovalV138(item) {
  const status = normalizeUserApprovalStatusV138(item?.status);
  return status === "REJECTED" || status === "RIFIUTATA" || status === "RIFIUTATO" || status === "DECLINED" || status === "REFUSED";
}

function buildApprovedAdminUsersV138(pendingUsers = [], teamUsers = []) {
  const approvedByUid = new Map();

  pendingUsers
    .filter((item) => normalizeUserApprovalStatusV138(item.status) === "APPROVED")
    .forEach((item) => approvedByUid.set(item.id, { ...item, approvalSource: "pendingUsers" }));

  teamUsers
    .filter((item) => normalizeUserApprovalStatusV138(item.status) !== "DISABLED")
    .forEach((item) => {
      const merged = approvedByUid.has(item.id)
        ? { ...approvedByUid.get(item.id), ...item, approvalSource: "pendingUsers/teamUsers" }
        : { ...item, approvalSource: "teamUsers" };
      approvedByUid.set(item.id, merged);
    });

  return Array.from(approvedByUid.values()).sort((a, b) => {
    const aName = a.displayName || a.email || a.id || "";
    const bName = b.displayName || b.email || b.id || "";
    return String(aName).localeCompare(String(bName), "it", { sensitivity: "base" });
  });
}

function renderApprovedAdminUserRowV138(user) {
  const seasonTeam = getSeasonTeamById(user.seasonTeamId);
  const team = typeof getTeamById === "function" ? getTeamById(user.teamId) : null;
  const label = user.displayName || user.email || user.id || "Utente";
  const teamLabel = seasonTeam?.name || team?.canonicalName || user.teamName || user.seasonTeamId || "Squadra non associata";
  const meta = [
    user.email || "",
    user.seasonId || seasonTeam?.seasonId || "",
    teamLabel,
    requestStatusLabel(user.status || "ACTIVE")
  ].filter(Boolean).join(" · ");
  return `
    <div class="admin-list-item admin-user-approval-item admin-user-approved-item">
      <span>
        <strong>${escapeHtml(label)}</strong>
        <small>${escapeHtml(meta)}</small>
      </span>
      <span><span class="status status-success">APPROVATO</span></span>
    </div>`;
}

function renderPendingUsersAdminPanelV34() {
  const allPendingUsers = state.raw.pendingUsers || [];
  const pending = allPendingUsers.filter((item) => isPendingUserApprovalV138(item) && !isRejectedUserApprovalV138(item));
  const approved = buildApprovedAdminUsersV138(allPendingUsers, state.raw.teamUsers || []);
  const approvedCount = approved.length;

  const presidentOptions = state.raw.presidents.map((president) => `<option value="${escapeHtml(president.id)}">${escapeHtml(president.name || president.id)}</option>`).join("");
  const teamOptions = state.raw.teams.map((team) => `<option value="${escapeHtml(team.id)}">${escapeHtml(team.canonicalName || team.id)}</option>`).join("");
  const seasonTeamOptions = state.raw.seasonTeams.map((seasonTeam) => `<option value="${escapeHtml(seasonTeam.id)}">${escapeHtml(seasonTeam.seasonId)} · ${escapeHtml(seasonTeam.name || seasonTeam.id)}</option>`).join("");
  const rows = pending.map((user) => `
    <div class="admin-list-item admin-user-approval-item">
      <span>
        <strong>${escapeHtml(user.displayName || user.email || user.id)}</strong>
        <small>${escapeHtml(user.email || "")} · ${escapeHtml(requestStatusLabel(user.status || "PENDING"))}</small>
      </span>
      <span class="admin-approval-controls">
        <select class="input" id="approvePresident_${escapeHtml(user.id)}"><option value="">Presidente...</option>${presidentOptions}</select>
        <select class="input" id="approveTeam_${escapeHtml(user.id)}"><option value="">Squadra madre...</option>${teamOptions}</select>
        <select class="input" id="approveSeasonTeam_${escapeHtml(user.id)}"><option value="">Rosa/stagione...</option>${seasonTeamOptions}</select>
        <button class="button button-primary button-small" type="button" data-approve-user="${escapeHtml(user.id)}">Approva</button>
        <button class="button button-danger button-small" type="button" data-reject-user="${escapeHtml(user.id)}">Rifiuta</button>
      </span>
    </div>`).join("") || `<p class="muted admin-empty-message">Nessun utente in attesa.</p>`;
  const approvedRows = approved.map(renderApprovedAdminUserRowV138).join("") || `<p class="muted admin-empty-message">Nessun utente approvato.</p>`;
  return renderAdminPanel("adminPendingUsersPanel", "Utenti", "Accetta utenti", `Approva i presidenti registrati e associali alla squadra/rosa corretta. Presidenti gia accettati: ${approvedCount}.`, `
    <div class="admin-subsection-block admin-user-requests-block">
      <div class="admin-subsection-headerline">
        <h3>Richieste in attesa</h3>
        <span class="status status-muted">${pending.length}</span>
      </div>
      <p class="muted">Se una richiesta viene rifiutata, il documento viene cancellato da Firebase e non resta nello storico.</p>
      <div class="admin-list">${rows}</div>
    </div>
    <div class="admin-subsection-block admin-user-approved-block">
      <div class="admin-subsection-headerline">
        <h3>Accessi approvati</h3>
        <span class="status status-success">${approvedCount}</span>
      </div>
      <p class="muted">Presidenti gia registrati e accettati. Usa questo numero per capire chi manca ancora all'appello.</p>
      <div class="admin-list">${approvedRows}</div>
    </div>`);
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
  if (!uid) return;
  const user = (state.raw.pendingUsers || []).find((item) => item.id === uid);
  const label = user?.displayName || user?.email || uid;
  if (!window.confirm(`Rifiutare l'accesso di ${label} ed eliminare definitivamente la richiesta da Firebase?`)) return;
  await deleteDoc(doc(db, "pendingUsers", uid));
  state.raw.pendingUsers = (state.raw.pendingUsers || []).filter((item) => item.id !== uid);
  renderAdminArea();
  expandAdminPanel("adminPendingUsersPanel");
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
  const wasExpanded = state.expandedRosterClubIds.has(id);
  if (wasExpanded) {
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
  window.requestAnimationFrame(() => {
    const isMobileLike = window.matchMedia("(max-width: 900px), (hover: none) and (pointer: coarse)").matches;
    const displayMode = localStorage.getItem("zonaOrientaleDisplayMode") || "auto";
    const isMobileMode = isMobileLike && displayMode !== "desktop";

    if (!wasExpanded) {
      const escapedId = window.CSS?.escape ? CSS.escape(id) : id.replace(/"/g, '\"');
      const openedButton = document.querySelector(`[data-toggle-roster-club="${escapedId}"][aria-expanded="true"]`);
      const detail = openedButton?.closest?.(".mobile-roster-detail-card-v156, .roster-detail-row") || document.querySelector(".mobile-roster-detail-card-v156");
      detail?.scrollIntoView?.({ behavior: "smooth", block: "start" });
      return;
    }

    if (isMobileMode) {
      const selector = document.querySelector(".mobile-roster-selector-v156") || document.getElementById("rosterClubCards") || document.getElementById("clubs");
      selector?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    }
  });
}, true);


/* V29 - UI refinements: mobile table overlap, dashboard podium labels and toggle labels. */
function normalizeToggleLabelsV29() {
  document.querySelectorAll("details .details-toggle-label").forEach((label) => {
    const details = label.closest("details");
    label.textContent = details?.open ? "Riduci" : "Espandi";
  });

  document.querySelectorAll("[data-toggle-roster-club]").forEach((button) => {
    // V159: i blocchi di selezione rosa mobile sono card ricche, non semplici toggle testuali.
    // Non sostituire il loro contenuto con "Espandi/Riduci", altrimenti spariscono logo, squadra e presidenti.
    if (button.classList?.contains("mobile-roster-select-block-v156")) return;
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
    link.innerHTML = '<span class="mobile-more-icon">👕</span><span>La mia squadra</span>';
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
              <th class="number">Ris.</th>
            </tr>
          </thead>
          <tbody>
            ${group.matches.map((match) => `
              <tr>
                <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
                <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
                <td data-label="Data">${escapeHtml(match.matchDate || '-')}</td>
                <td data-label="Ris." class="number">${escapeHtml(formatMatchResult(match))}</td>
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
              <th class="number">Ris.</th>
            </tr>
          </thead>
          <tbody>
            ${group.matches.map((match) => `
              <tr>
                <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
                <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
                <td data-label="Data">${escapeHtml(match.matchDate || '-')}</td>
                <td data-label="Ris." class="number">${escapeHtml(formatMatchResult(match))}</td>
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
          <tr><th>Fase</th><th>Partita</th><th>Data</th><th class="number">Ris.</th></tr>
        </thead>
        <tbody>
          ${sortedMatches.map((match) => `
            <tr>
              <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
              <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
              <td data-label="Data">${escapeHtml(match.matchDate || "-")}</td>
              <td data-label="Ris." class="number">${escapeHtml(formatMatchResult(match))}</td>
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

function startZonaOrientaleAppV173() {
  return initializeAppUi().then(() => {
    setupThemeToggleV89();
    injectDisplayModeToggle();
    updateMobileUxClass();
  });
}

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
          <tr><th>Fase</th><th>Partita</th><th>Data</th><th class="number">Ris.</th></tr>
        </thead>
        <tbody>
          ${matches.map((match) => `
            <tr>
              <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
              <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, 'home')} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, 'away')}</span></td>
              <td data-label="Data">${escapeHtml(match.matchDate || '-')}</td>
              <td data-label="Ris." class="number">${escapeHtml(formatMatchResult(match))}</td>
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


/* V112 - Fasi competizione piu precise e flag Admin partite coperte da JSON.
   - Riconosce finali abbreviate come "F - Secca" senza farle cadere su Serie A.
   - Le righe pubbliche delle partite non ripetono piu la fase quando sono gia raggruppate.
   - In Admin > Partite competizioni segnala le partite Firebase coperte da JSON statico. */
function getMatchBaseStageV112(match) {
  const stageRaw = cleanStageTextV111(match?.stage || match?.phase || match?.round || "");
  const legRaw = cleanStageTextV111(match?.leg || match?.roundLeg || "");
  const matchdayRaw = cleanStageTextV111(match?.matchday || "");
  const combinedOriginal = `${stageRaw} ${legRaw} ${matchdayRaw}`.trim();
  const withoutFinalFour = combinedOriginal.replace(/FINAL\s+FOUR/g, " ").replace(/\s+/g, " ").trim();

  if (/FINALE|FINAL\b|(^|\s)F(\s|$)/.test(withoutFinalFour)) return { key: "finale", label: "Finale", rank: 900 };
  if (/SEMIFINAL|SEMI|\bSF\b/.test(withoutFinalFour)) return { key: "semifinali", label: "Semifinali", rank: 800 };
  if (/QUARTI|QUART|\bQF\b/.test(withoutFinalFour)) return { key: "quarti-finale", label: "Quarti di finale", rank: 700 };
  if (/OTTAVI|OTTAV|\bR16\b/.test(withoutFinalFour)) return { key: "ottavi-finale", label: "Ottavi di finale", rank: 600 };
  if (/FINAL\s+FOUR/.test(combinedOriginal)) return { key: "final-four", label: "Final Four", rank: 650 };

  const leagueDay = Number(match?.leagueMatchday || 0);
  if (Number.isFinite(leagueDay) && leagueDay > 0) return { key: `giornata-${leagueDay}`, label: `Giornata ${leagueDay}`, rank: 100 + leagueDay };
  const serieDay = Number(match?.serieAMatchday || 0);
  if (Number.isFinite(serieDay) && serieDay > 0) return { key: `serie-a-${serieDay}`, label: `Serie A ${serieDay}`, rank: 50 + serieDay };
  const fallback = String(match?.matchday || match?.stage || match?.phase || "Partite").trim() || "Partite";
  return { key: normalizeKey(fallback) || "partite", label: fallback, rank: 0 };
}

function getMatchLegCodeV112(match) {
  const base = getMatchBaseStageV112(match);
  if (base.key === "finale") return "finale";
  const legRaw = cleanStageTextV111(match?.leg || match?.roundLeg || match?.matchday || "");
  if (/RITORNO|RETURN|\bRIT\b|(^|\s)R(\s|$)/.test(legRaw)) return "ritorno";
  if (/ANDATA|FIRST|\bAND\b|(^|\s)A(\s|$)/.test(legRaw)) return "andata";
  if (/SECCA|UNICA|SINGLE|ONE\s+LEG/.test(legRaw)) return "secca";
  return "secca";
}

function buildStageLegContextV112(matches) {
  const context = new Map();
  matches.forEach((match) => {
    const base = getMatchBaseStageV112(match);
    if (!context.has(base.key)) context.set(base.key, new Set());
    const leg = getMatchLegCodeV112(match);
    if (leg === "andata" || leg === "ritorno") context.get(base.key).add(leg);
  });
  return context;
}

function getMatchStageInfoV112(match, legContext) {
  const base = getMatchBaseStageV112(match);
  if (base.key === "finale") return { key: "finale", label: "Finale", rank: base.rank };

  const declaredLeg = getMatchLegCodeV112(match);
  const legs = legContext?.get(base.key) || new Set();
  const hasTwoLegs = legs.has("andata") && legs.has("ritorno");
  const leg = hasTwoLegs ? declaredLeg : "secca";

  if (leg === "ritorno") return { key: `${base.key}-ritorno`, label: `${base.label} ritorno`, rank: base.rank + 20 };
  if (leg === "andata") return { key: `${base.key}-andata`, label: `${base.label} andata`, rank: base.rank + 10 };
  return { key: base.key, label: base.label, rank: base.rank + 15 };
}

function groupCompetitionMatchesByStageV112(matches) {
  const legContext = buildStageLegContextV112(matches);
  const groups = new Map();
  matches.forEach((match) => {
    const info = getMatchStageInfoV112(match, legContext);
    if (!groups.has(info.key)) groups.set(info.key, { key: info.key, label: info.label, rank: info.rank, matches: [] });
    groups.get(info.key).matches.push(match);
  });
  return [...groups.values()].sort((a, b) => {
    const rankDiff = b.rank - a.rank;
    if (rankDiff) return rankDiff;
    return String(a.label).localeCompare(String(b.label), "it", { numeric: true, sensitivity: "base" });
  });
}

function renderMatchRowsNoStageV112(matches, emptyText = "Nessuna partita inserita.") {
  if (!matches.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
  return `
    <div class="table-wrap match-table-wrap">
      <table>
        <thead>
          <tr><th>Partita</th><th>Data</th><th class="number">Ris.</th></tr>
        </thead>
        <tbody>
          ${matches.map((match) => `
            <tr>
              <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
              <td data-label="Data">${escapeHtml(match.matchDate || "-")}</td>
              <td data-label="Ris." class="number">${escapeHtml(formatMatchResult(match))}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function renderCompetitionMatchesPublicV112(competition) {
  const matches = getCompetitionMatches(competition.id);
  if (!matches.length) return `<p class="muted">Nessuna partita inserita per questa competizione.</p>`;
  const groups = groupCompetitionMatchesByStageV112(matches);
  return `
    <div class="competition-matches-public competition-match-groups">
      ${groups.map((group) => `
        <details class="detail-section compact-detail-section competition-match-stage-group competition-match-stage-details" open>
          <summary class="competition-match-stage-summary">
            <h4>${escapeHtml(group.label)}</h4>
            <span class="button button-secondary button-small competition-stage-toggle-label" aria-hidden="true">Riduci/Espandi</span>
          </summary>
          ${renderMatchRowsNoStageV112(sortMatchesInsideStageV111(group.matches), "Nessuna partita inserita.")}
        </details>`).join("")}
    </div>`;
}

renderCompetitionMatchesPublic = renderCompetitionMatchesPublicV112;

function getStaticMatchForAdminFlagV112(match, competition) {
  if (!match || !competition || typeof getStaticCompetitionMatchesCanonicalV109 !== "function") return null;
  const staticMatches = getStaticCompetitionMatchesCanonicalV109(competition) || [];
  if (!staticMatches.length) return null;
  const matchKey = typeof getStaticMatchMergeKeyV101 === "function" ? getStaticMatchMergeKeyV101(match) : "";
  return staticMatches.find((staticMatch) => {
    if (staticMatch.id && match.id && staticMatch.id === match.id) return true;
    if (matchKey && typeof getStaticMatchMergeKeyV101 === "function" && getStaticMatchMergeKeyV101(staticMatch) === matchKey) return true;
    const sameHome = String(staticMatch.homeSeasonTeamId || "") === String(match.homeSeasonTeamId || "") || normalizeKey(staticMatch.homeTeamName || "") === normalizeKey(getSeasonTeamDisplayName(match.homeSeasonTeamId) || "");
    const sameAway = String(staticMatch.awaySeasonTeamId || "") === String(match.awaySeasonTeamId || "") || normalizeKey(staticMatch.awayTeamName || "") === normalizeKey(getSeasonTeamDisplayName(match.awaySeasonTeamId) || "");
    const sameRound = normalizeKey(staticMatch.matchday || staticMatch.stage || "") === normalizeKey(match.matchday || match.stage || "") || Number(staticMatch.serieAMatchday || 0) === Number(match.serieAMatchday || 0);
    return Boolean(sameHome && sameAway && sameRound);
  }) || null;
}

renderCompetitionMatchesAdminPanel = function renderCompetitionMatchesAdminPanelV112() {
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
    <option value="${escapeHtml(competition.id)}" ${competition.id === selectedCompetitionId ? "selected" : ""}>${escapeHtml(getCompetitionDisplayNameV111(competition))}</option>
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
    const staticMatch = getStaticMatchForAdminFlagV112(match, competition);
    const staticFlag = staticMatch ? `<span class="admin-static-match-flag" title="Questa partita Firebase e gia coperta da un calendario JSON statico">JSON</span>` : "";
    return `
      <div class="admin-list-item${staticMatch ? " admin-list-item-static-covered" : ""}">
        <span>
          <strong>${escapeHtml(getSeasonName(competition?.seasonId || match.seasonId))} · ${escapeHtml(getCompetitionDisplayNameV111(competition) || match.competitionId)}</strong>
          <small><strong>Fase/giornata:</strong> ${escapeHtml(formatMatchStage(match))}${getMatchSerieAMatchday(match) ? ` · Serie A: ${escapeHtml(getMatchSerieAMatchday(match))}` : ""} · ${escapeHtml(match.matchDate || "-")} · ${escapeHtml(getSeasonTeamDisplayName(match.homeSeasonTeamId))} - ${escapeHtml(getSeasonTeamDisplayName(match.awaySeasonTeamId))} · ${escapeHtml(formatMatchResult(match))}</small>
        </span>
        <span>
          ${staticFlag}
          <span class="status ${match.status === "GIOCATA" ? "status-ok" : "status-warning"}">${escapeHtml(getLabel(MATCH_STATUSES, match.status))}</span>
          <button class="button button-secondary button-small" type="button" data-admin-edit-match="${escapeHtml(match.id)}">Modifica</button>
          <button class="button button-danger button-small" type="button" data-admin-delete-match="${escapeHtml(match.id)}">Elimina</button>
        </span>
      </div>`;
  }).join("") || `<p class="muted admin-empty-message">Nessuna partita trovata per stagione, competizione e fase/giornata selezionate.</p>`;

  const coveredCount = filteredMatches.filter((match) => getStaticMatchForAdminFlagV112(match, competitionsById.get(match.competitionId))).length;

  return renderAdminPanel("adminCompetitionMatchesPanel", "Firebase", "Partite competizioni", "Inserisci calendario e risultati delle partite. Le partite con badge JSON sono gia lette da assets/competitions e possono essere eliminate da Firebase dopo verifica.", `
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
          <small class="field-hint">Per competizioni a gironi puoi usare QF/SF/F/Finale/Finalissima o scrivere una giornata libera.</small>
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
        <summary><strong>Partite filtrate</strong><span>${filteredMatches.length}${coveredCount ? ` · ${coveredCount} JSON` : ""}</span></summary>
        <p class="field-hint">Il badge <strong>JSON</strong> indica partite Firebase gia coperte dal calendario statico della competizione.</p>
        <div class="admin-list">${rows}</div>
      </details>
  `);
};


/* V113 - Raggruppamento fasi/giornate piu robusto.
   - Le finali senza stage esplicito nei KO vengono inferite dall'ultima partita rimasta.
   - Le competizioni tipo Campionato/Regular Season vengono raggruppate per Giornata 1, Giornata 2, ...
   - La giornata di Serie A resta fallback solo quando non esiste una fase riconoscibile. */
function getCompetitionKindTextV113(competition) {
  return cleanStageTextV111([
    competition?.name,
    competition?.competitionName,
    competition?.staticCompetitionName,
    competition?.label,
    competition?.type,
    competition?.competitionType,
    competition?.formula
  ].filter(Boolean).join(" "));
}

function isLeagueCompetitionV113(competition) {
  const text = getCompetitionKindTextV113(competition);
  return /CAMPIONATO|REGULAR\s*SEASON|REGULAR|LEGA|LEAGUE\s*TABLE/.test(text) && !/CHAMPIONS|CHAMPION|COPPA|PLAYOFF|PLAY\s*OFF|SUPERCOPPA|FINAL|KNOCK/.test(text);
}

function getMatchDaySortValueV113(match) {
  const candidates = [match?.leagueMatchday, match?.serieAMatchday, match?.matchday, match?.stage, match?.id];
  for (const value of candidates) {
    const matchNumber = String(value || "").match(/\d+/);
    if (matchNumber) {
      const number = Number(matchNumber[0]);
      if (Number.isFinite(number)) return number;
    }
  }
  return 0;
}

function getExplicitMatchBaseStageV113(match) {
  const stageRaw = cleanStageTextV111(match?.stage || match?.phase || match?.round || "");
  const legRaw = cleanStageTextV111(match?.leg || match?.roundLeg || "");
  const matchdayRaw = cleanStageTextV111(match?.matchday || "");
  const combinedOriginal = `${stageRaw} ${legRaw} ${matchdayRaw}`.trim();
  const combined = combinedOriginal.replace(/FINAL\s+FOUR/g, " ").replace(/\s+/g, " ").trim();

  if (/FINALE|FINAL\b|(^|\s)F(\s|$)/.test(combined)) return { key: "finale", label: "Finale", rank: 900, explicit: true };
  if (/SEMIFINAL|SEMI|\bSF\b/.test(combined)) return { key: "semifinali", label: "Semifinali", rank: 800, explicit: true };
  if (/QUARTI|QUART|\bQF\b/.test(combined)) return { key: "quarti-finale", label: "Quarti di finale", rank: 700, explicit: true };
  if (/OTTAVI|OTTAV|\bR16\b/.test(combined)) return { key: "ottavi-finale", label: "Ottavi di finale", rank: 600, explicit: true };
  if (/FINAL\s+FOUR/.test(combinedOriginal)) return { key: "final-four", label: "Final Four", rank: 650, explicit: true };
  return null;
}

function shouldInferFinalForUnknownKnockoutV113(match, matches, competition) {
  if (!match || isLeagueCompetitionV113(competition)) return false;
  if (getExplicitMatchBaseStageV113(match)) return false;
  const unknownMatches = (matches || []).filter((item) => !getExplicitMatchBaseStageV113(item));
  if (unknownMatches.length !== 1) return false;
  if (unknownMatches[0] !== match) return false;
  const knownStages = (matches || []).map(getExplicitMatchBaseStageV113).filter(Boolean).map((stage) => stage.key);
  if (!knownStages.some((key) => key === "semifinali" || key === "quarti-finale" || key === "ottavi-finale" || key === "final-four")) return false;
  const currentDay = getMatchDaySortValueV113(match);
  const maxKnownDay = Math.max(0, ...(matches || []).filter((item) => item !== match).map(getMatchDaySortValueV113));
  return currentDay >= maxKnownDay;
}

function getMatchBaseStageV113(match, matches = [], competition = null) {
  const explicit = getExplicitMatchBaseStageV113(match);
  if (explicit) return explicit;

  const leagueDay = Number(match?.leagueMatchday || 0);
  const serieDay = Number(match?.serieAMatchday || 0);

  if (isLeagueCompetitionV113(competition)) {
    if (Number.isFinite(leagueDay) && leagueDay > 0) return { key: `giornata-${leagueDay}`, label: `Giornata ${leagueDay}`, rank: 100 + leagueDay };
    if (Number.isFinite(serieDay) && serieDay > 0) return { key: `giornata-${serieDay}`, label: `Giornata ${serieDay}`, rank: 100 + serieDay };
  }

  if (shouldInferFinalForUnknownKnockoutV113(match, matches, competition)) {
    return { key: "finale", label: "Finale", rank: 900, inferred: true };
  }

  if (Number.isFinite(leagueDay) && leagueDay > 0) return { key: `giornata-${leagueDay}`, label: `Giornata ${leagueDay}`, rank: 100 + leagueDay };
  if (Number.isFinite(serieDay) && serieDay > 0) return { key: `serie-a-${serieDay}`, label: `Serie A ${serieDay}`, rank: 50 + serieDay };
  const fallback = String(match?.matchday || match?.stage || match?.phase || "Partite").trim() || "Partite";
  return { key: normalizeKey(fallback) || "partite", label: fallback, rank: 0 };
}

function getMatchLegCodeV113(match, matches = [], competition = null) {
  const base = getMatchBaseStageV113(match, matches, competition);
  if (base.key === "finale" || base.key.startsWith("giornata-") || base.key.startsWith("serie-a-")) return "secca";
  const legRaw = cleanStageTextV111(match?.leg || match?.roundLeg || match?.matchday || "");
  if (/RITORNO|RETURN|\bRIT\b|(^|\s)R(\s|$)/.test(legRaw)) return "ritorno";
  if (/ANDATA|FIRST|\bAND\b|(^|\s)A(\s|$)/.test(legRaw)) return "andata";
  if (/SECCA|UNICA|SINGLE|ONE\s+LEG/.test(legRaw)) return "secca";
  return "secca";
}

function buildStageLegContextV113(matches, competition) {
  const context = new Map();
  (matches || []).forEach((match) => {
    const base = getMatchBaseStageV113(match, matches, competition);
    if (!context.has(base.key)) context.set(base.key, new Set());
    const leg = getMatchLegCodeV113(match, matches, competition);
    if (leg === "andata" || leg === "ritorno") context.get(base.key).add(leg);
  });
  return context;
}

function getMatchStageInfoV113(match, matches, legContext, competition) {
  const base = getMatchBaseStageV113(match, matches, competition);
  if (base.key === "finale" || base.key.startsWith("giornata-") || base.key.startsWith("serie-a-")) {
    return { key: base.key, label: base.label, rank: base.rank };
  }
  const declaredLeg = getMatchLegCodeV113(match, matches, competition);
  const legs = legContext?.get(base.key) || new Set();
  const hasTwoLegs = legs.has("andata") && legs.has("ritorno");
  const leg = hasTwoLegs ? declaredLeg : "secca";
  if (leg === "ritorno") return { key: `${base.key}-ritorno`, label: `${base.label} ritorno`, rank: base.rank + 20 };
  if (leg === "andata") return { key: `${base.key}-andata`, label: `${base.label} andata`, rank: base.rank + 10 };
  return { key: base.key, label: base.label, rank: base.rank + 15 };
}

function groupCompetitionMatchesByStageV113(matches, competition) {
  const matchList = Array.isArray(matches) ? matches : [];
  const legContext = buildStageLegContextV113(matchList, competition);
  const groups = new Map();
  matchList.forEach((match) => {
    const info = getMatchStageInfoV113(match, matchList, legContext, competition);
    if (!groups.has(info.key)) groups.set(info.key, { key: info.key, label: info.label, rank: info.rank, matches: [] });
    groups.get(info.key).matches.push(match);
  });
  return [...groups.values()].sort((a, b) => {
    const rankDiff = b.rank - a.rank;
    if (rankDiff) return rankDiff;
    return String(a.label).localeCompare(String(b.label), "it", { numeric: true, sensitivity: "base" });
  });
}

function renderCompetitionMatchesPublicV113(competition) {
  const matches = getCompetitionMatches(competition.id);
  if (!matches.length) return `<p class="muted">Nessuna partita inserita per questa competizione.</p>`;
  const groups = groupCompetitionMatchesByStageV113(matches, competition);
  return `
    <div class="competition-matches-public competition-match-groups">
      ${groups.map((group) => `
        <details class="detail-section compact-detail-section competition-match-stage-group competition-match-stage-details" open>
          <summary class="competition-match-stage-summary">
            <h4>${escapeHtml(group.label)}</h4>
            <span class="button button-secondary button-small competition-stage-toggle-label" aria-hidden="true">Riduci/Espandi</span>
          </summary>
          ${renderMatchRowsNoStageV112(sortMatchesInsideStageV111(group.matches), "Nessuna partita inserita.")}
        </details>`).join("")}
    </div>`;
}

renderCompetitionMatchesPublic = renderCompetitionMatchesPublicV113;


/* V114 - Admin categorizzato, formule competizione aggiornate, snapshot date e risultati leggibili. */
const COMPETITION_FORMATS_V114 = [
  { value: "UNO_VS_TUTTI", label: "1 Vs Tutti" },
  { value: "FORMULA_1", label: "Formula 1" },
  { value: "CLASSIFICA", label: "A Calendario" },
  { value: "GIRONI_KO", label: "Ad Eliminazione Diretta" },
  { value: "GRUPPI", label: "A gruppi" },
  { value: "BATTLE_ROYALE", label: "Battle Royale" },
  { value: "HIGHLANDER", label: "Highlander" }
];

function getCompetitionFormatLabelV114(value) {
  return getLabel(COMPETITION_FORMATS_V114, value) || getLabel(COMPETITION_FORMATS, value) || value || "-";
}

const adminCompetitionHelpersV131 = createAdminCompetitionHelpersV131({
  state,
  escapeHtml,
  getLabel,
  renderAdminPanel,
  getValidSeasonSelection,
  getSeasonName,
  getSeasonTeamsForSeason,
  getParticipantsCount,
  getCompetitionResults,
  isRankingCompetition,
  getCompetitionStatusClass,
  getCompetitionFormatLabel: getCompetitionFormatLabelV114,
  getCompetitionDisplayName: (competition) => getCompetitionDisplayNameV111(competition),
  getDisputableCompetitionsForSeason: (seasonId) => getDisputableCompetitionsForSeasonV116(seasonId),
  isCompetitionNotDisputed: (competition) => isCompetitionNotDisputedV116(competition),
  buildMaps,
  getAdminMatchDisplayRows: (selectedCompetition, firebaseMatches) => getAdminMatchDisplayRowsV117(selectedCompetition, firebaseMatches),
  getMatchSerieAMatchday,
  formatMatchStage,
  formatMatchResult,
  getAdminMatchTeamText: (match, side) => getAdminMatchTeamTextV116(match, side),
  renderAdminMatchSourceBadges: (row) => renderAdminMatchSourceBadgesV117(row),
  getAdminMatchActionButtons: (row) => getAdminMatchActionButtonsV117(row),
  COMPETITION_TYPES,
  COMPETITION_FORMATS: COMPETITION_FORMATS_V114,
  COMPETITION_STATUSES,
  MATCH_STATUSES,
  STANDARD_KNOCKOUT_MATCHDAYS
});

const publicSnapshotAdminHelpersV129 = createPublicSnapshotAdminHelpersV129({
  state,
  escapeHtml,
  renderAdminPanel,
  getCurrentSeasonId,
  scheduleLoadPublicSnapshotDates: (seasonId) => loadPublicSnapshotDatesForAdminV116(seasonId)
});

const formatSnapshotTimestampV114 = publicSnapshotAdminHelpersV129.formatSnapshotTimestamp;
const getCurrentSeasonSnapshotGeneratedAtV114 = publicSnapshotAdminHelpersV129.getCurrentSeasonSnapshotGeneratedAt;

function renderPublicSnapshotsAdminPanelV114() {
  return publicSnapshotAdminHelpersV129.renderBasePanel();
}

renderPublicSnapshotsAdminPanelV34 = renderPublicSnapshotsAdminPanelV114;
renderPublicSnapshotsAdminPanel = renderPublicSnapshotsAdminPanelV114;


function renderAdminCategoryV114(title, subtitle, body) {
  const content = String(body || "").trim();
  if (!content) return "";
  return `
    <section class="admin-category" aria-label="${escapeHtml(title)}">
      <div class="admin-category-heading">
        <div>
          <p class="eyebrow">Admin</p>
          <h2>${escapeHtml(title)}</h2>
          ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
        </div>
      </div>
      <div class="admin-category-body">${content}</div>
    </section>`;
}

function renderOptionalAdminPanelV114(name) {
  return typeof name === "function" ? name() : "";
}

// V106 aveva aggiunto un collegamento rapido verde in cima: da V114 lo rimuoviamo.
if (typeof ensureStaticCompetitionImportAdminPanelV106 === "function") {
  ensureStaticCompetitionImportAdminPanelV106 = function ensureStaticCompetitionImportAdminPanelV114() {
    document.getElementById("adminStaticCompetitionImportShortcut")?.remove();
  };
}

renderAdminArea = function renderAdminAreaV114() {
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

  const rolloverPanel = typeof renderSeasonRolloverAdminPanelV50 === "function" ? renderSeasonRolloverAdminPanelV50() : "";
  const staticCompetitionImportPanel = typeof renderStaticCompetitionImportAdminPanelV105 === "function" ? renderStaticCompetitionImportAdminPanelV105() : "";

  adminPanel.innerHTML = `
    <div class="page-heading">
      <div>
        <p class="eyebrow">Area riservata</p>
        <h2 id="adminTitle">Admin</h2>
        <p>Gestione Firebase, dati statici, utenti presidenti, richieste e snapshot pubblici.</p>
      </div>
    </div>
    ${renderAdminCategoryV114("Utenti e comunicazioni", "Registrazioni, richieste presidenti e comunicati.", `
      ${typeof renderPendingUsersAdminPanelV34 === "function" ? renderPendingUsersAdminPanelV34() : ""}
      ${typeof renderTeamRequestsAdminPanelV34 === "function" ? renderTeamRequestsAdminPanelV34() : ""}
      ${typeof renderNewsAdminPanelV48 === "function" ? renderNewsAdminPanelV48() : ""}
    `)}
    ${renderAdminCategoryV114("Stagioni e club", "Stagioni, presidenti, squadre, squadre stagionali e stadi.", `
      ${renderSeasonAdminPanel()}
      ${rolloverPanel}
      ${renderPresidentAdminPanel()}
      ${renderTeamAdminPanel()}
      ${renderSeasonTeamAdminPanel()}
      ${renderStadiumAdminPanel()}
    `)}
    ${renderAdminCategoryV114("Rose e mercato", "Rose modificabili, movimenti FM e strumenti listone.", `
      ${typeof renderRosterMovementsAdminPanel === "function" ? renderRosterMovementsAdminPanel() : ""}
      ${renderListoneToolsAdminPanel()}
    `)}
    ${renderAdminCategoryV114("Competizioni", "Competizioni, calendari, import statico, risultati e FIFA Ranking.", `
      ${renderCompetitionAdminPanel()}
      ${renderCompetitionMatchesAdminPanel()}
      ${staticCompetitionImportPanel}
      ${renderCompetitionResultsAdminPanel()}
      ${renderFifaRankingAdminPanel()}
    `)}
    ${renderAdminCategoryV114("Snapshot e backup", "Pubblicazione dati leggeri e backup locale Firebase.", `
      ${renderPublicSnapshotsAdminPanelV114()}
      ${renderBackupAdminPanel()}
    `)}
  `;
  document.getElementById("adminStaticCompetitionImportShortcut")?.remove();
  attachAdminHandlers();
};

renderCompetitionAdminPanel = function renderCompetitionAdminPanelV114() {
  return adminCompetitionHelpersV131.renderCompetitionAdminPanel();
};

const renderStaticCompetitionImportAdminPanelBeforeV114 = typeof renderStaticCompetitionImportAdminPanelV105 === "function" ? renderStaticCompetitionImportAdminPanelV105 : null;
if (renderStaticCompetitionImportAdminPanelBeforeV114) {
  renderStaticCompetitionImportAdminPanelV105 = function renderStaticCompetitionImportAdminPanelV114() {
    let html = renderStaticCompetitionImportAdminPanelBeforeV114();
    if (!html.includes('id="adminStaticCompetitionFormat"')) {
      const formatOptions = COMPETITION_FORMATS_V114.map((format) => `
        <option value="${escapeHtml(format.value)}" ${format.value === "GIRONI_KO" ? "selected" : ""}>${escapeHtml(format.label)}</option>
      `).join("");
      html = html.replace(/<label>\s*Stato\s*<select id="adminStaticCompetitionStatus"[\s\S]*?<\/label>/, (match) => `${match}
        <label>
          Formula
          <select id="adminStaticCompetitionFormat" class="input" required>${formatOptions}</select>
        </label>`);
    }
    return html;
  };
}

const buildStaticCompetitionPayloadBeforeV114 = typeof buildStaticCompetitionPayloadV105 === "function" ? buildStaticCompetitionPayloadV105 : null;
if (buildStaticCompetitionPayloadBeforeV114) {
  buildStaticCompetitionPayloadV105 = function buildStaticCompetitionPayloadV114(matches) {
    const result = buildStaticCompetitionPayloadBeforeV114(matches);
    const format = document.getElementById("adminStaticCompetitionFormat")?.value || result.payload?.competition?.format || "GIRONI_KO";
    if (result.payload?.competition) result.payload.competition.format = format;
    if (result.payload?.meta) result.payload.meta.competitionFormat = format;
    if (result.manifestEntry) result.manifestEntry.competitionFormat = format;
    return result;
  };
}

function hasMatchGoalsV114(match) {
  return match?.homeGoals !== "" && match?.homeGoals !== undefined && match?.homeGoals !== null && match?.awayGoals !== "" && match?.awayGoals !== undefined && match?.awayGoals !== null;
}

function hasMatchFantasyPointsV114(match) {
  return match?.homeScore !== "" && match?.homeScore !== undefined && match?.homeScore !== null && match?.awayScore !== "" && match?.awayScore !== undefined && match?.awayScore !== null;
}

function formatNumberCompactV114(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("it-IT", { maximumFractionDigits: 2 }) : String(value ?? "");
}

function renderMatchResultHtmlV114(match) {
  const goals = hasMatchGoalsV114(match) ? `${match.homeGoals}-${match.awayGoals}` : "-";
  const goalsHtml = `<strong class="match-result-goals">${escapeHtml(goals)}</strong>`;
  if (!hasMatchFantasyPointsV114(match)) return goalsHtml;
  return `${goalsHtml} <span class="match-result-separator">·</span> <span class="match-result-fp">(${escapeHtml(formatNumberCompactV114(match.homeScore))}-${escapeHtml(formatNumberCompactV114(match.awayScore))})</span>`;
}

function renderMatchRowsResultV114(matches, emptyText = "Nessuna partita inserita.", { showStage = true, preserveOrder = false } = {}) {
  const rows = preserveOrder ? [...matches] : sortMatchesForDisplay(matches);
  if (!rows.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
  return `
    <div class="table-wrap match-table-wrap">
      <table>
        <thead>
          <tr>${showStage ? "<th>Fase</th>" : ""}<th>Partita</th><th>Data</th><th class="number">Ris.</th></tr>
        </thead>
        <tbody>
          ${rows.map((match) => `
            <tr>
              ${showStage ? `<td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>` : ""}
              <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
              <td data-label="Data">${escapeHtml(match.matchDate || "-")}</td>
              <td data-label="Ris." class="number">${renderMatchResultHtmlV114(match)}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

renderMatchRows = function renderMatchRowsV114(matches, emptyText = "Nessuna partita inserita.") {
  return renderMatchRowsResultV114(matches, emptyText, { showStage: true });
};

renderMatchRowsPreserveOrderV103 = function renderMatchRowsPreserveOrderV114(matches, emptyText = "Nessuna partita inserita.") {
  return renderMatchRowsResultV114(matches, emptyText, { showStage: true, preserveOrder: true });
};

renderMatchRowsNoStageV112 = function renderMatchRowsNoStageV114(matches, emptyText = "Nessuna partita inserita.") {
  return renderMatchRowsResultV114(matches, emptyText, { showStage: false, preserveOrder: true });
};

renderCompactMatchLines = function renderCompactMatchLinesV114(matches) {
  if (!matches.length) return "";
  return `
    <div class="compact-match-lines">
      ${sortMatchesForDisplay(matches).map((match) => `
        <div class="compact-match-line">
          <span>${renderStaticMatchTeamNameV101(match, "home", { strong: false })} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}</span>
          <span class="compact-match-result">${renderMatchResultHtmlV114(match)}</span>
        </div>`).join("")}
    </div>`;
};

renderCompactSingleMatchLineV87 = function renderCompactSingleMatchLineV114(match) {
  if (!match) return "";
  return `
    <div class="compact-match-line dashboard-next-match-line">
      <span>${renderStaticMatchTeamNameV101(match, "home", { strong: false })} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}</span>
      <span class="compact-match-result">${renderMatchResultHtmlV114(match)}</span>
    </div>`;
};

renderDashboardCalendar = function renderDashboardCalendarV114(seasonId) {
  const target = document.getElementById("dashboardCalendar");
  if (!target) return;
  const groups = getSeasonCompetitionsForPublicDisplayV52(seasonId)
    .map((competition) => {
      const matches = isRankingCompetition(competition)
        ? getLatestChampionshipMatches(competition)
        : getPlayedMatchesForCompetition(competition).slice(0, 5);
      return {
        competition,
        label: isRankingCompetition(competition) ? "Ultima giornata giocata" : "Ultime partite disputate",
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
          <strong>${escapeHtml(typeof getCompetitionDisplayNameV108 === "function" ? getCompetitionDisplayNameV108(group.competition) : group.competition.name || group.competition.id)}</strong>
          <small>${escapeHtml(group.label)}</small>
        </span>
        <span class="button button-secondary button-small details-toggle-label" aria-hidden="true">Riduci</span>
      </summary>
      <div class="table-wrap match-table-wrap dashboard-calendar-table-wrap">
        <table class="dashboard-calendar-table">
          <thead><tr><th>Fase</th><th>Partita</th><th>Data</th><th class="number">Ris.</th></tr></thead>
          <tbody>
            ${group.matches.map((match) => `
              <tr>
                <td data-label="Fase">${escapeHtml(formatMatchStage(match))}</td>
                <td data-label="Partita"><span class="match-teams-line">${renderStaticMatchTeamNameV101(match, "home")} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away")}</span></td>
                <td data-label="Data">${escapeHtml(match.matchDate || "-")}</td>
                <td data-label="Ris." class="number">${renderMatchResultHtmlV114(match)}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </details>`).join("");
};



/* V136 - Dashboard upcoming match metadata (date and Serie A matchday). */
function formatDashboardMatchDateLabelV136(match) {
  const date = String(match?.matchDate || match?.date || "").trim();
  return date || "Data da definire";
}

function formatDashboardSerieALabelV136(match) {
  const serieA = getMatchSerieAMatchday(match);
  return serieA ? `Serie A ${serieA}` : "";
}

function renderDashboardUpcomingMatchMetaV136(match) {
  const items = [];
  items.push(`<span class="dashboard-match-date">${escapeHtml(formatDashboardMatchDateLabelV136(match))}</span>`);
  const serieALabel = formatDashboardSerieALabelV136(match);
  if (serieALabel) items.push(`<span class="dashboard-match-serie-a">${escapeHtml(serieALabel)}</span>`);
  return `<span class="dashboard-match-meta">${items.join("")}</span>`;
}

function renderDashboardUpcomingMatchLinesV136(matches) {
  if (!matches.length) return "";
  return `
    <div class="compact-match-lines dashboard-upcoming-match-lines">
      ${sortMatchesForDisplay(matches).map((match) => `
        <div class="compact-match-line dashboard-next-match-line dashboard-next-match-line-v136">
          <span class="dashboard-match-teams">${renderStaticMatchTeamNameV101(match, "home", { strong: false })} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}</span>
          ${renderDashboardUpcomingMatchMetaV136(match)}
        </div>`).join("")}
    </div>`;
}

renderCompactSingleMatchLineV87 = function renderCompactSingleMatchLineV136(match) {
  if (!match) return "";
  return `
    <div class="compact-match-line dashboard-next-match-line dashboard-next-match-line-v136">
      <span class="dashboard-match-teams">${renderStaticMatchTeamNameV101(match, "home", { strong: false })} <span class="match-separator">-</span> ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}</span>
      ${renderDashboardUpcomingMatchMetaV136(match)}
    </div>`;
};

renderDashboardCompetitionSummary = function renderDashboardCompetitionSummaryV136(competition) {
  const winner = getCompetitionWinnerResultV87(competition);
  if (winner?.seasonTeamId) {
    return `<div class="dashboard-competition-summary dashboard-winner-line"><span class="muted">Vincitore:</span> ${renderSeasonTeamNameWithLogo(winner.seasonTeamId, { textClass: "text-success" })}</div>`;
  }

  if (isRankingCompetition(competition)) {
    const nextMatches = getNextChampionshipMatches(competition);
    if (nextMatches.length) {
      const first = nextMatches[0];
      const label = `Prossima giornata programmata${first.matchday ? `: ${first.matchday}` : ""}`;
      return `<div class="dashboard-competition-summary"><span class="muted">${escapeHtml(label)}</span>${renderDashboardUpcomingMatchLinesV136(nextMatches)}</div>`;
    }
    return `<div class="dashboard-competition-summary"><span class="muted">Nessuna prossima giornata programmata.</span></div>`;
  }

  const nextMatch = getFirstUpcomingMatchV87(competition);
  if (nextMatch) {
    const label = `Prossima partita${formatMatchStage(nextMatch) ? ` · ${formatMatchStage(nextMatch)}` : ""}`;
    return `<div class="dashboard-competition-summary"><span class="muted">${escapeHtml(label)}</span>${renderCompactSingleMatchLineV87(nextMatch)}</div>`;
  }

  return `<div class="dashboard-competition-summary"><span class="muted">Nessuna prossima partita programmata.</span></div>`;
};


/* V115 - Admin: categorie rese vere sottosezioni, distinte dalle funzionalità. */
renderAdminCategoryV114 = function renderAdminCategoryV115(title, subtitle, content) {
  if (!content || !String(content).trim()) return "";
  const sectionId = `admin-category-${makeIdPart(title || "sezione")}`;
  return `
    <section id="${escapeHtml(sectionId)}" class="admin-category admin-category-section" aria-labelledby="${escapeHtml(sectionId)}-title">
      <header class="admin-category-heading">
        <div class="admin-category-heading-main">
          <span class="admin-category-kicker">Sottosezione Admin</span>
          <h2 id="${escapeHtml(sectionId)}-title">${escapeHtml(title)}</h2>
          ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
        </div>
      </header>
      <div class="admin-category-body" role="list">${content}</div>
    </section>`;
};

/* V116 - Admin snapshot controls, season rollover visibility, match tombstones and source badges. */
const ADMIN_PANELS_COLLAPSED_BY_DEFAULT_V116 = [
  "adminPendingUsersPanel",
  "adminTeamRequestsPanel",
  "adminNewsPanel",
  "adminSeasonsPanel",
  "adminSeasonRolloverPanel",
  "adminPresidentsPanel",
  "adminTeamsPanel",
  "adminSeasonTeamsPanel",
  "adminStadiumsPanel",
  "adminRosterMovementsPanel",
  "adminListoneToolsPanel",
  "adminCompetitionsPanel",
  "adminCompetitionMatchesPanel",
  "adminStaticCompetitionImportPanel",
  "adminCompetitionResultsPanel",
  "adminFifaRankingPanel",
  "adminPublicSnapshotsPanel",
  "adminBackupPanel"
];

if (!state.__adminDefaultCollapsedV116) {
  ADMIN_PANELS_COLLAPSED_BY_DEFAULT_V116.forEach((panelId) => state.collapsedAdminPanels?.add?.(panelId));
  state.__adminDefaultCollapsedV116 = true;
}

function isCompetitionNotDisputedV116(competition) {
  const status = String(competition?.status || "").toUpperCase();
  return status === "NON_DISPUTATA" || status === "NOT_DISPUTED";
}

function getDisputableCompetitionsForSeasonV116(seasonId) {
  return (state.raw.competitions || []).filter((competition) => (
    competition.seasonId === seasonId && !isCompetitionNotDisputedV116(competition)
  ));
}

function inferNextSeasonIdV116(sourceSeasonId) {
  const match = String(sourceSeasonId || "").match(/(\d{4})\D+(\d{4})/);
  if (!match) return "";
  return `${Number(match[1]) + 1}-${Number(match[2]) + 1}`;
}

function renderSeasonRolloverAdminPanelV116() {
  const defaultSource = getCurrentSeasonId() || (state.raw.seasons || [])[0]?.id || "";
  const defaultTarget = inferNextSeasonIdV116(defaultSource);
  const seasonOptions = (state.raw.seasons || [])
    .map((season) => `<option value="${escapeHtml(season.id)}" ${season.id === defaultSource ? "selected" : ""}>${escapeHtml(season.name || season.id)}</option>`)
    .join("");

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

function setupSeasonRolloverDefaultsV116() {
  const sourceSelect = document.getElementById("rolloverSourceSeasonV50");
  const targetInput = document.getElementById("rolloverTargetSeasonV50");
  const targetName = document.getElementById("rolloverTargetNameV50");
  sourceSelect?.addEventListener("change", () => {
    const next = inferNextSeasonIdV116(sourceSelect.value);
    if (targetInput && (!targetInput.value || /^\d{4}-\d{4}$/.test(targetInput.value))) targetInput.value = next;
    if (targetName && (!targetName.value || /^Stagione \d{4}-\d{4}$/.test(targetName.value))) targetName.value = next ? `Stagione ${next}` : "";
  });
}

function collapseAdminNestedDetailsByDefaultV116() {
  document.querySelectorAll('#adminPanel details.admin-edit-section[open]').forEach((details) => {
    details.removeAttribute("open");
  });
}

async function loadPublicSnapshotDatesForAdminV116(seasonId) {
  if (!state.isAdmin || !seasonId) return;
  const loadKey = `${seasonId}|${state.publicHonorSnapshot?.generatedAt || ""}`;
  if (state.__snapshotDatesLoadedKeyV116 === loadKey || state.__snapshotDatesLoadingV116) return;
  state.__snapshotDatesLoadingV116 = true;
  try {
    const [seasonSnapshot, honorSnapshot] = await Promise.all([
      getDocumentIfExistsV32("publicSeasonSnapshots", seasonId).catch(() => null),
      getDocumentIfExistsV32("publicSnapshots", "honor").catch(() => null)
    ]);
    if (seasonSnapshot) state.publicSeasonSnapshots[seasonId] = seasonSnapshot;
    if (honorSnapshot) state.publicHonorSnapshot = honorSnapshot;
    state.__snapshotDatesLoadedKeyV116 = `${seasonId}|${state.publicHonorSnapshot?.generatedAt || ""}`;
    renderAdminArea();
  } finally {
    state.__snapshotDatesLoadingV116 = false;
  }
}

function getSnapshotDateTextV116(value) {
  return publicSnapshotAdminHelpersV129.getSnapshotDateText(value);
}

renderPublicSnapshotsAdminPanelV114 = function renderPublicSnapshotsAdminPanelV116() {
  return publicSnapshotAdminHelpersV129.renderFullPanel();
};
renderPublicSnapshotsAdminPanel = renderPublicSnapshotsAdminPanelV114;


async function saveNewsSnapshotV116() {
  try {
    showMessage("adminPublicSnapshotsStatus", "Aggiornamento comunicati...");
    if (!state.hasFullData) await loadFullDataV32({ render: false });
    const seasonId = getCurrentSeasonId();
    await saveSeasonSnapshotByIdV34(seasonId);
    state.__snapshotDatesLoadedKeyV116 = "";
    showMessage("adminPublicSnapshotsStatus", `Comunicati aggiornati nello snapshot ${seasonId}.`);
    renderAdminArea();
  } catch (error) {
    console.error(error);
    showMessage("adminPublicSnapshotsStatus", `Errore comunicati: ${error?.message || error}`, true);
  }
}

async function saveCompetitionDataSnapshotV116() {
  try {
    showMessage("adminPublicSnapshotsStatus", "Aggiornamento competizioni e classifiche...");
    if (!state.hasFullData) await loadFullDataV32({ render: false });
    const seasonId = getCurrentSeasonId();
    await saveSeasonSnapshotByIdV34(seasonId);
    await saveHonorSnapshotV34();
    state.__snapshotDatesLoadedKeyV116 = "";
    showMessage("adminPublicSnapshotsStatus", `Competizioni e classifiche aggiornate per ${seasonId}.`);
    renderAdminArea();
  } catch (error) {
    console.error(error);
    showMessage("adminPublicSnapshotsStatus", `Errore competizioni/classifiche: ${error?.message || error}`, true);
  }
}

function isMatchDeletedV116(match) {
  return match?.deleted === true || String(match?.deleted || "").toLowerCase() === "true" || String(match?.status || "").toUpperCase() === "DELETED";
}

function getMatchMergeKeySafeV116(match) {
  if (typeof getStaticMatchMergeKeyV101 === "function") return getStaticMatchMergeKeyV101(match);
  return [
    match?.competitionId || "",
    normalizeKey(match?.matchday || match?.stage || ""),
    String(match?.serieAMatchday || ""),
    match?.homeSeasonTeamId || normalizeKey(match?.homeTeamName || ""),
    match?.awaySeasonTeamId || normalizeKey(match?.awayTeamName || "")
  ].join("|");
}

function getDeletedMatchKeysForCompetitionV116(competitionId) {
  const keys = new Set();
  (state.raw.competitionMatches || []).forEach((match) => {
    if (match.competitionId !== competitionId || !isMatchDeletedV116(match)) return;
    if (match.id) keys.add(`id:${match.id}`);
    keys.add(`key:${getMatchMergeKeySafeV116(match)}`);
  });
  return keys;
}

function isMatchHiddenByDeletedFlagV116(match, deletedKeys) {
  if (isMatchDeletedV116(match)) return true;
  return Boolean(
    deletedKeys?.has?.(`id:${match?.id || ""}`) ||
    deletedKeys?.has?.(`key:${getMatchMergeKeySafeV116(match)}`)
  );
}

const getCompetitionMatchesBeforeV116 = getCompetitionMatches;
getCompetitionMatches = function getCompetitionMatchesV116(competitionId) {
  const matches = getCompetitionMatchesBeforeV116(competitionId) || [];
  const deletedKeys = getDeletedMatchKeysForCompetitionV116(competitionId);
  return sortMatchesForDisplay(matches.filter((match) => !isMatchHiddenByDeletedFlagV116(match, deletedKeys)));
};

const buildPublicTeamSnapshotBeforeV116 = buildPublicTeamSnapshotV34;
buildPublicTeamSnapshotV34 = function buildPublicTeamSnapshotV116(seasonTeam) {
  const snapshot = buildPublicTeamSnapshotBeforeV116(seasonTeam);
  snapshot.recentMatches = (snapshot.recentMatches || []).filter((match) => !isMatchDeletedV116(match));
  return snapshot;
};

function getFirebaseMatchForStaticMatchV116(staticMatch, firebaseMatches) {
  const staticKey = getMatchMergeKeySafeV116(staticMatch);
  return (firebaseMatches || []).find((match) => {
    if (match.id && staticMatch.id && match.id === staticMatch.id) return true;
    return getMatchMergeKeySafeV116(match) === staticKey;
  }) || null;
}

function getAdminMatchDisplayRowsV116(selectedCompetition, firebaseMatches) {
  const rows = [];
  const usedFirebaseIds = new Set();
  const staticMatches = selectedCompetition && typeof getStaticCompetitionMatchesCanonicalV109 === "function"
    ? getStaticCompetitionMatchesCanonicalV109(selectedCompetition) || []
    : [];

  staticMatches.forEach((staticMatch, index) => {
    const firebaseMatch = getFirebaseMatchForStaticMatchV116(staticMatch, firebaseMatches);
    if (firebaseMatch?.id) usedFirebaseIds.add(firebaseMatch.id);
    rows.push({
      key: `json-${index}-${getMatchMergeKeySafeV116(staticMatch)}`,
      displayMatch: { ...staticMatch, ...(firebaseMatch || {}) },
      staticMatch,
      firebaseMatch,
      hasJson: true,
      hasFirebase: Boolean(firebaseMatch),
      isDeleted: Boolean(firebaseMatch && isMatchDeletedV116(firebaseMatch))
    });
  });

  (firebaseMatches || []).forEach((firebaseMatch) => {
    if (firebaseMatch.id && usedFirebaseIds.has(firebaseMatch.id)) return;
    rows.push({
      key: `firebase-${firebaseMatch.id || getMatchMergeKeySafeV116(firebaseMatch)}`,
      displayMatch: firebaseMatch,
      staticMatch: null,
      firebaseMatch,
      hasJson: false,
      hasFirebase: true,
      isDeleted: isMatchDeletedV116(firebaseMatch)
    });
  });

  return sortMatchesForDisplay(rows.map((row) => row.displayMatch)).map((displayMatch) => (
    rows.find((row) => row.displayMatch === displayMatch) || rows.find((row) => row.displayMatch.id && row.displayMatch.id === displayMatch.id) || rows[0]
  )).filter(Boolean);
}

function renderAdminMatchSourceBadgesV116(row) {
  return `
    ${row.hasJson ? `<span class="admin-match-source-badge admin-match-source-badge-json" title="Partita recuperata dal calendario JSON statico">JSON</span>` : ""}
    ${row.hasFirebase ? `<span class="admin-match-source-badge admin-match-source-badge-firebase" title="Partita presente nella raccolta Firestore competitionMatches">Firebase</span>` : ""}
    ${row.isDeleted ? `<span class="admin-match-source-badge admin-match-source-badge-deleted" title="Record marcato deleted: true in Firebase">deleted</span>` : ""}
  `;
}

function getStaticDeleteDraftIdV116(match) {
  return `${makeIdPart(match.competitionId || "competizione")}_${makeIdPart(match.matchday || match.stage || "fase")}_${makeIdPart(match.homeSeasonTeamId || match.homeTeamName || "casa")}_${makeIdPart(match.awaySeasonTeamId || match.awayTeamName || "trasferta")}_deleted`;
}

async function softDeleteCompetitionMatchV116(matchId) {
  if (!matchId) return;
  const match = (state.raw.competitionMatches || []).find((item) => item.id === matchId);
  const label = match ? `${getSeasonTeamDisplayName(match.homeSeasonTeamId) || match.homeTeamName || "Casa"} - ${getSeasonTeamDisplayName(match.awaySeasonTeamId) || match.awayTeamName || "Trasferta"}` : "partita";
  const confirmed = window.confirm(`Marcare come deleted questa partita?\n${label}\n\nIl record resta in Firebase con deleted: true e viene escluso dal sito pubblico.`);
  if (!confirmed) return;
  try {
    await setDoc(doc(db, "competitionMatches", matchId), {
      deleted: true,
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    await loadData();
    expandAdminPanel("adminCompetitionMatchesPanel");
  } catch (error) {
    console.error(error);
    setError(`Errore durante il flag deleted della partita.`);
  }
}

async function softDeleteStaticCompetitionMatchV116(draftKey) {
  const draft = state.adminStaticMatchDeleteDraftsV116?.[draftKey];
  if (!draft) return;
  const confirmed = window.confirm(`Nascondere questa partita JSON creando un flag deleted in Firebase?\n${draft.homeTeamName || getSeasonTeamDisplayName(draft.homeSeasonTeamId)} - ${draft.awayTeamName || getSeasonTeamDisplayName(draft.awaySeasonTeamId)}`);
  if (!confirmed) return;
  const id = getStaticDeleteDraftIdV116(draft);
  try {
    await setDoc(doc(db, "competitionMatches", id), {
      ...draft,
      id,
      deleted: true,
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      source: "static-delete-tombstone"
    }, { merge: true });
    await loadData();
    expandAdminPanel("adminCompetitionMatchesPanel");
  } catch (error) {
    console.error(error);
    setError("Errore durante la creazione del flag deleted per la partita JSON.");
  }
}

async function restoreCompetitionMatchV116(matchId) {
  if (!matchId) return;
  const confirmed = window.confirm("Ripristinare questa partita rimuovendo il flag deleted?");
  if (!confirmed) return;
  try {
    await setDoc(doc(db, "competitionMatches", matchId), {
      deleted: false,
      restoredAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    await loadData();
    expandAdminPanel("adminCompetitionMatchesPanel");
  } catch (error) {
    console.error(error);
    setError("Errore durante il ripristino della partita.");
  }
}

function getAdminMatchTeamTextV116(match, side) {
  const id = side === "home" ? match?.homeSeasonTeamId : match?.awaySeasonTeamId;
  const name = side === "home" ? match?.homeTeamName : match?.awayTeamName;
  return name || getSeasonTeamDisplayName(id) || id || "-";
}

function getAdminMatchActionButtonsV116(row) {
  if (row.hasFirebase && row.firebaseMatch?.id) {
    if (row.isDeleted) {
      return `<button class="button button-secondary button-small" type="button" data-admin-restore-match="${escapeHtml(row.firebaseMatch.id)}">Ripristina</button>`;
    }
    return `
      <button class="button button-secondary button-small" type="button" data-admin-edit-match="${escapeHtml(row.firebaseMatch.id)}">Modifica</button>
      <button class="button button-danger button-small" type="button" data-admin-soft-delete-match="${escapeHtml(row.firebaseMatch.id)}">Elimina</button>`;
  }
  if (row.hasJson && row.staticMatch) {
    const key = `static-${Object.keys(state.adminStaticMatchDeleteDraftsV116 || {}).length}`;
    state.adminStaticMatchDeleteDraftsV116 = state.adminStaticMatchDeleteDraftsV116 || {};
    state.adminStaticMatchDeleteDraftsV116[key] = {
      ...row.staticMatch,
      id: getStaticDeleteDraftIdV116(row.staticMatch),
      competitionId: row.staticMatch.competitionId || row.displayMatch.competitionId,
      seasonId: row.staticMatch.seasonId || row.displayMatch.seasonId,
      matchday: row.staticMatch.matchday || row.displayMatch.matchday || "",
      stage: row.staticMatch.stage || row.displayMatch.stage || "",
      serieAMatchday: row.staticMatch.serieAMatchday || row.displayMatch.serieAMatchday || null,
      homeSeasonTeamId: row.staticMatch.homeSeasonTeamId || row.displayMatch.homeSeasonTeamId || "",
      awaySeasonTeamId: row.staticMatch.awaySeasonTeamId || row.displayMatch.awaySeasonTeamId || "",
      homeTeamName: row.staticMatch.homeTeamName || row.displayMatch.homeTeamName || getSeasonTeamDisplayName(row.displayMatch.homeSeasonTeamId) || "",
      awayTeamName: row.staticMatch.awayTeamName || row.displayMatch.awayTeamName || getSeasonTeamDisplayName(row.displayMatch.awaySeasonTeamId) || ""
    };
    return `<button class="button button-danger button-small" type="button" data-admin-soft-delete-static-match="${escapeHtml(key)}">Nascondi</button>`;
  }
  return `<span class="muted">Solo lettura</span>`;
}

renderCompetitionMatchesAdminPanel = function renderCompetitionMatchesAdminPanelV116() {
  const selectedSeasonId = getValidSeasonSelection("selectedAdminMatchSeasonId");
  const competitionsForSelectedSeason = getDisputableCompetitionsForSeasonV116(selectedSeasonId);
  const blockedCompetitionsCount = (state.raw.competitions || []).filter((competition) => competition.seasonId === selectedSeasonId && isCompetitionNotDisputedV116(competition)).length;

  const selectedCompetitionId = state.selectedMatchCompetitionId && competitionsForSelectedSeason.some((competition) => competition.id === state.selectedMatchCompetitionId)
    ? state.selectedMatchCompetitionId
    : competitionsForSelectedSeason[0]?.id || "";
  state.selectedMatchCompetitionId = selectedCompetitionId;

  const seasonOptions = state.raw.seasons.map((season) => `
    <option value="${escapeHtml(season.id)}" ${season.id === selectedSeasonId ? "selected" : ""}>${escapeHtml(season.name || season.id)}</option>
  `).join("");

  const competitionOptions = competitionsForSelectedSeason.map((competition) => `
    <option value="${escapeHtml(competition.id)}" ${competition.id === selectedCompetitionId ? "selected" : ""}>${escapeHtml(getCompetitionDisplayNameV111(competition))}</option>
  `).join("");

  const statusOptions = MATCH_STATUSES.map((status) => `
    <option value="${escapeHtml(status.value)}">${escapeHtml(status.label)}</option>
  `).join("");

  const matchdayOptions = STANDARD_KNOCKOUT_MATCHDAYS.map((matchday) => `
    <option value="${escapeHtml(matchday)}"></option>
  `).join("");

  const { competitionsById } = buildMaps();
  const selectedCompetition = competitionsById.get(selectedCompetitionId) || competitionsForSelectedSeason[0] || null;
  const firebaseMatchesForSelectedCompetition = (state.raw.competitionMatches || []).filter((match) => {
    const matchSeasonId = match.seasonId || competitionsById.get(match.competitionId)?.seasonId || "";
    return matchSeasonId === selectedSeasonId && (!selectedCompetitionId || match.competitionId === selectedCompetitionId);
  });
  const allDisplayRows = getAdminMatchDisplayRowsV116(selectedCompetition, firebaseMatchesForSelectedCompetition);

  const matchdayValues = Array.from(new Set(
    allDisplayRows
      .map((row) => row.displayMatch.matchday || row.displayMatch.stage || "")
      .filter(Boolean)
  )).sort((a, b) => b.localeCompare(a, "it", { numeric: true }));

  const selectedMatchdayFilter = state.selectedAdminMatchdayFilter && matchdayValues.includes(state.selectedAdminMatchdayFilter)
    ? state.selectedAdminMatchdayFilter
    : "";
  state.selectedAdminMatchdayFilter = selectedMatchdayFilter;

  const matchdayFilterOptions = [`<option value="">Tutte le fasi/giornate</option>`, ...matchdayValues.map((matchday) => `
    <option value="${escapeHtml(matchday)}" ${matchday === selectedMatchdayFilter ? "selected" : ""}>${escapeHtml(matchday)}</option>
  `)].join("");

  const filteredRows = selectedMatchdayFilter
    ? allDisplayRows.filter((row) => (row.displayMatch.matchday || row.displayMatch.stage || "") === selectedMatchdayFilter)
    : allDisplayRows;

  state.adminStaticMatchDeleteDraftsV116 = {};
  const rows = filteredRows.map((row) => {
    const match = row.displayMatch;
    const competition = competitionsById.get(match.competitionId) || selectedCompetition;
    return `
      <div class="admin-list-item${row.hasJson ? " admin-list-item-static-covered" : ""}${row.isDeleted ? " admin-list-item-deleted" : ""}">
        <span>
          <strong>${escapeHtml(getSeasonName(competition?.seasonId || match.seasonId))} · ${escapeHtml(getCompetitionDisplayNameV111(competition) || match.competitionId)}</strong>
          <small><strong>Fase/giornata:</strong> ${escapeHtml(formatMatchStage(match))}${getMatchSerieAMatchday(match) ? ` · Serie A: ${escapeHtml(getMatchSerieAMatchday(match))}` : ""} · ${escapeHtml(match.matchDate || "-")} · ${escapeHtml(getAdminMatchTeamTextV116(match, "home"))} - ${escapeHtml(getAdminMatchTeamTextV116(match, "away"))} · ${escapeHtml(formatMatchResult(match))}</small>
        </span>
        <span class="admin-match-actions">
          ${renderAdminMatchSourceBadgesV116(row)}
          <span class="status ${match.status === "GIOCATA" ? "status-ok" : row.isDeleted ? "status-danger" : "status-warning"}">${escapeHtml(row.isDeleted ? "Deleted" : getLabel(MATCH_STATUSES, match.status))}</span>
          ${getAdminMatchActionButtonsV116(row)}
        </span>
      </div>`;
  }).join("") || `<p class="muted admin-empty-message">Nessuna partita trovata per stagione, competizione e fase/giornata selezionate.</p>`;

  const jsonCount = filteredRows.filter((row) => row.hasJson).length;
  const firebaseCount = filteredRows.filter((row) => row.hasFirebase).length;
  const deletedCount = filteredRows.filter((row) => row.isDeleted).length;
  const saveDisabled = competitionsForSelectedSeason.length ? "" : "disabled";

  return renderAdminPanel("adminCompetitionMatchesPanel", "Firebase + JSON", "Partite competizioni", "Inserisci calendario e risultati solo per competizioni disputate. I badge indicano origine JSON, presenza Firebase e flag deleted.", `
      <form id="adminCompetitionMatchesForm" class="form-grid">
        <input id="adminCompetitionMatchId" type="hidden" />
        <label>
          Stagione
          <select id="adminCompetitionMatchSeasonId" class="input" required>${seasonOptions}</select>
        </label>
        <label>
          Competizione
          <select id="adminCompetitionMatchCompetitionId" class="input" required>${competitionOptions}</select>
          <small class="field-hint">Le competizioni segnate come Non disputata sono escluse.${blockedCompetitionsCount ? ` Escluse: ${blockedCompetitionsCount}.` : ""}</small>
        </label>
        <label>
          Filtro elenco fase/giornata
          <select id="adminCompetitionMatchdayFilter" class="input">${matchdayFilterOptions}</select>
          <small class="field-hint">La lista sotto viene filtrata per stagione, competizione e fase/giornata.</small>
        </label>
        <label>
          Fase
          <input id="adminCompetitionMatchday" class="input" type="text" list="adminCompetitionMatchdayOptions" placeholder="Es. Giornata 1 oppure QF - Andata" required />
          <datalist id="adminCompetitionMatchdayOptions">${matchdayOptions}</datalist>
          <small class="field-hint">Per competizioni a gironi puoi usare QF/SF/F/Finale/Finalissima o scrivere una giornata libera.</small>
        </label>
        <label>Data<input id="adminCompetitionMatchDate" class="input" type="date" /></label>
        <label>Giornata Serie A reale<input id="adminCompetitionMatchSerieAMatchday" class="input" type="number" min="1" step="1" placeholder="Es. 12" /></label>
        <label>Squadra casa<select id="adminCompetitionMatchHome" class="input" required></select></label>
        <label>Squadra trasferta<select id="adminCompetitionMatchAway" class="input" required></select></label>
        <label>Stato partita<select id="adminCompetitionMatchStatus" class="input" required>${statusOptions}</select></label>
        <label>Gol casa<input id="adminCompetitionMatchHomeGoals" class="input" type="number" min="0" step="1" /></label>
        <label>Gol trasferta<input id="adminCompetitionMatchAwayGoals" class="input" type="number" min="0" step="1" /></label>
        <label>FP casa<input id="adminCompetitionMatchHomeScore" class="input" type="number" step="0.5" /></label>
        <label>FP trasferta<input id="adminCompetitionMatchAwayScore" class="input" type="number" step="0.5" /></label>
        <label class="span-2">Note<input id="adminCompetitionMatchNotes" class="input" type="text" placeholder="Opzionale" /></label>
        <div class="form-actions span-2">
          <button class="button button-primary" type="submit" ${saveDisabled}>Salva partita</button>
          <button id="adminCompetitionMatchReset" class="button button-secondary" type="button">Nuova</button>
          <span id="adminCompetitionMatchStatusText" class="form-status"></span>
        </div>
      </form>
      <details class="admin-edit-section" open>
        <summary><strong>Partite filtrate</strong><span>${filteredRows.length} · ${jsonCount} JSON · ${firebaseCount} Firebase${deletedCount ? ` · ${deletedCount} deleted` : ""}</span></summary>
        <p class="field-hint">JSON = partita letta da <code>assets/competitions</code>. Firebase = record presente in Firestore. deleted = record/tombstone con <code>deleted: true</code>, escluso dal sito pubblico.</p>
        <div class="admin-list">${rows}</div>
      </details>
  `);
};

const saveCompetitionMatchBeforeV116 = saveCompetitionMatch;
saveCompetitionMatch = async function saveCompetitionMatchV116(event) {
  const competitionId = document.getElementById("adminCompetitionMatchCompetitionId")?.value || "";
  const competition = (state.raw.competitions || []).find((item) => item.id === competitionId);
  if (isCompetitionNotDisputedV116(competition)) {
    event?.preventDefault?.();
    showMessage("adminCompetitionMatchStatusText", "Non puoi inserire partite per una competizione segnata come Non disputata.", true);
    return;
  }
  return saveCompetitionMatchBeforeV116(event);
};

function getStaticImportTargetCompetitionV116() {
  const seasonId = document.getElementById("adminStaticCompetitionSeasonId")?.value || getCurrentSeasonId();
  const name = normalizeKey(document.getElementById("adminStaticCompetitionName")?.value || "");
  const type = document.getElementById("adminStaticCompetitionType")?.value || "";
  return (state.raw.competitions || []).find((competition) => {
    if (competition.seasonId !== seasonId) return false;
    if (name && normalizeKey(competition.name || competition.staticCompetitionName || "") === name) return true;
    return Boolean(type && competition.type === type && isCompetitionNotDisputedV116(competition));
  }) || null;
}

function blockStaticImportIfNotDisputedV116() {
  const statusInput = document.getElementById("adminStaticCompetitionStatus");
  if (statusInput?.value === "NON_DISPUTATA" || statusInput?.value === "NOT_DISPUTED") {
    showMessage("adminStaticCompetitionImportStatus", "Non puoi importare un calendario per una competizione segnata come Non disputata.", true);
    return true;
  }
  const existing = getStaticImportTargetCompetitionV116();
  if (isCompetitionNotDisputedV116(existing)) {
    showMessage("adminStaticCompetitionImportStatus", `La competizione ${existing.name || existing.id} è segnata come Non disputata: import bloccato.`, true);
    return true;
  }
  return false;
}

if (typeof handleStaticCompetitionImportPreviewV105 === "function") {
  const handleStaticCompetitionImportPreviewBeforeV116 = handleStaticCompetitionImportPreviewV105;
  handleStaticCompetitionImportPreviewV105 = function handleStaticCompetitionImportPreviewV116(event) {
    if (blockStaticImportIfNotDisputedV116()) {
      event?.preventDefault?.();
      return;
    }
    return handleStaticCompetitionImportPreviewBeforeV116(event);
  };
}

if (typeof handleStaticCompetitionGenerateOverlayV105 === "function") {
  const handleStaticCompetitionGenerateOverlayBeforeV116 = handleStaticCompetitionGenerateOverlayV105;
  handleStaticCompetitionGenerateOverlayV105 = function handleStaticCompetitionGenerateOverlayV116(event) {
    if (blockStaticImportIfNotDisputedV116()) {
      event?.preventDefault?.();
      return;
    }
    return handleStaticCompetitionGenerateOverlayBeforeV116(event);
  };
}

if (typeof renderStaticCompetitionImportAdminPanelV105 === "function") {
  const renderStaticCompetitionImportAdminPanelBeforeV116 = renderStaticCompetitionImportAdminPanelV105;
  renderStaticCompetitionImportAdminPanelV105 = function renderStaticCompetitionImportAdminPanelV116() {
    let html = renderStaticCompetitionImportAdminPanelBeforeV116();
    html = html.replace(/<option value="NON_DISPUTATA"[\s\S]*?<\/option>/g, "");
    html = html.replace(/<option value="NOT_DISPUTED"[\s\S]*?<\/option>/g, "");
    return html.replace("Carica un Excel", "Carica un Excel solo per competizioni disputate");
  };
}

const attachAdminHandlersBeforeV116 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV116() {
  attachAdminHandlersBeforeV116();
  setupSeasonRolloverDefaultsV116();
  document.getElementById("adminGenerateNewsSnapshot")?.addEventListener("click", saveNewsSnapshotV116);
  document.getElementById("adminGenerateCompetitionDataSnapshot")?.addEventListener("click", saveCompetitionDataSnapshotV116);
  document.querySelectorAll("[data-admin-soft-delete-match]").forEach((button) => {
    button.addEventListener("click", () => softDeleteCompetitionMatchV116(button.dataset.adminSoftDeleteMatch));
  });
  document.querySelectorAll("[data-admin-soft-delete-static-match]").forEach((button) => {
    button.addEventListener("click", () => softDeleteStaticCompetitionMatchV116(button.dataset.adminSoftDeleteStaticMatch));
  });
  document.querySelectorAll("[data-admin-restore-match]").forEach((button) => {
    button.addEventListener("click", () => restoreCompetitionMatchV116(button.dataset.adminRestoreMatch));
  });
};

renderAdminArea = function renderAdminAreaV116() {
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

  const staticCompetitionImportPanel = typeof renderStaticCompetitionImportAdminPanelV105 === "function" ? renderStaticCompetitionImportAdminPanelV105() : "";

  adminPanel.innerHTML = `
    <div class="page-heading">
      <div>
        <p class="eyebrow">Area riservata</p>
        <h2 id="adminTitle">Admin</h2>
        <p>Gestione Firebase, dati statici, utenti presidenti, richieste e snapshot pubblici.</p>
      </div>
    </div>
    ${renderAdminCategoryV114("Utenti e comunicazioni", "Registrazioni, richieste presidenti e comunicati.", `
      ${typeof renderPendingUsersAdminPanelV34 === "function" ? renderPendingUsersAdminPanelV34() : ""}
      ${typeof renderTeamRequestsAdminPanelV34 === "function" ? renderTeamRequestsAdminPanelV34() : ""}
      ${typeof renderNewsAdminPanelV48 === "function" ? renderNewsAdminPanelV48() : ""}
    `)}
    ${renderAdminCategoryV114("Stagioni e club", "Stagioni, riversamento, presidenti, squadre, squadre stagionali e stadi.", `
      ${renderSeasonAdminPanel()}
      ${renderSeasonRolloverAdminPanelV116()}
      ${renderPresidentAdminPanel()}
      ${renderTeamAdminPanel()}
      ${renderSeasonTeamAdminPanel()}
      ${renderStadiumAdminPanel()}
    `)}
    ${renderAdminCategoryV114("Rose e mercato", "Rose modificabili, movimenti FM e strumenti listone.", `
      ${typeof renderRosterMovementsAdminPanel === "function" ? renderRosterMovementsAdminPanel() : ""}
      ${renderListoneToolsAdminPanel()}
    `)}
    ${renderAdminCategoryV114("Competizioni", "Competizioni disputate, calendari, import statico, risultati e FIFA Ranking.", `
      ${renderCompetitionAdminPanel()}
      ${renderCompetitionMatchesAdminPanel()}
      ${staticCompetitionImportPanel}
      ${renderCompetitionResultsAdminPanel()}
      ${renderFifaRankingAdminPanel()}
    `)}
    ${renderAdminCategoryV114("Snapshot e backup", "Pubblicazione dati leggeri e backup locale Firebase.", `
      ${renderPublicSnapshotsAdminPanelV114()}
      ${renderBackupAdminPanel()}
    `)}
  `;

  document.getElementById("adminStaticCompetitionImportShortcut")?.remove();
  collapseAdminNestedDetailsByDefaultV116();
  attachAdminHandlers();
};

/* V117 - Admin: deleted indica Firebase rimossa, non nasconde il JSON statico. */
let lastAdminToggleV117 = { panelId: "", at: 0 };
const toggleAdminPanelBeforeV117 = toggleAdminPanel;
toggleAdminPanel = function toggleAdminPanelV117(panelId) {
  const now = Date.now();
  if (lastAdminToggleV117.panelId === panelId && now - lastAdminToggleV117.at < 120) return;
  lastAdminToggleV117 = { panelId, at: now };
  return toggleAdminPanelBeforeV117(panelId);
};

function isSameMatchKeyV117(a, b) {
  return getMatchMergeKeySafeV116(a) === getMatchMergeKeySafeV116(b);
}

function getActiveFirebaseMatchForStaticMatchV117(staticMatch, firebaseMatches) {
  const staticKey = getMatchMergeKeySafeV116(staticMatch);
  return (firebaseMatches || []).find((match) => {
    if (isMatchDeletedV116(match)) return false;
    if (match.id && staticMatch.id && match.id === staticMatch.id) return true;
    return getMatchMergeKeySafeV116(match) === staticKey;
  }) || null;
}

function getDeletedFirebaseMarkerForStaticMatchV117(staticMatch, firebaseMatches) {
  const staticKey = getMatchMergeKeySafeV116(staticMatch);
  return (firebaseMatches || []).find((match) => {
    if (!isMatchDeletedV116(match)) return false;
    if (match.id && staticMatch.id && match.id === staticMatch.id) return true;
    return getMatchMergeKeySafeV116(match) === staticKey;
  }) || null;
}

getCompetitionMatches = function getCompetitionMatchesV117(competitionId) {
  const competition = typeof getCompetitionForStaticLookupV109 === "function" ? getCompetitionForStaticLookupV109(competitionId) : null;
  const staticMatches = typeof getStaticCompetitionMatchesCanonicalV109 === "function" ? getStaticCompetitionMatchesCanonicalV109(competition) : null;
  if (staticMatches) return sortMatchesForDisplay(staticMatches.filter((match) => !isMatchDeletedV116(match)));
  return sortMatchesForDisplay((state.raw.competitionMatches || []).filter((match) => (
    match.competitionId === competitionId && !isMatchDeletedV116(match)
  )));
};

function getAdminMatchDisplayRowsV117(selectedCompetition, firebaseMatches) {
  const rows = [];
  const usedActiveFirebaseIds = new Set();
  const usedDeletedMarkerIds = new Set();
  const staticMatches = selectedCompetition && typeof getStaticCompetitionMatchesCanonicalV109 === "function"
    ? getStaticCompetitionMatchesCanonicalV109(selectedCompetition) || []
    : [];
  const activeFirebaseMatches = (firebaseMatches || []).filter((match) => !isMatchDeletedV116(match));
  const deletedFirebaseMarkers = (firebaseMatches || []).filter((match) => isMatchDeletedV116(match));

  staticMatches.forEach((staticMatch, index) => {
    const firebaseMatch = getActiveFirebaseMatchForStaticMatchV117(staticMatch, activeFirebaseMatches);
    const deletedMarker = getDeletedFirebaseMarkerForStaticMatchV117(staticMatch, deletedFirebaseMarkers);
    if (firebaseMatch?.id) usedActiveFirebaseIds.add(firebaseMatch.id);
    if (deletedMarker?.id) usedDeletedMarkerIds.add(deletedMarker.id);
    rows.push({
      key: `json-${index}-${getMatchMergeKeySafeV116(staticMatch)}`,
      displayMatch: firebaseMatch ? { ...staticMatch, ...firebaseMatch } : staticMatch,
      staticMatch,
      firebaseMatch,
      deletedMarker,
      hasJson: true,
      hasFirebase: Boolean(firebaseMatch),
      isDeleted: Boolean(deletedMarker)
    });
  });

  activeFirebaseMatches.forEach((firebaseMatch) => {
    if (firebaseMatch.id && usedActiveFirebaseIds.has(firebaseMatch.id)) return;
    rows.push({
      key: `firebase-${firebaseMatch.id || getMatchMergeKeySafeV116(firebaseMatch)}`,
      displayMatch: firebaseMatch,
      staticMatch: null,
      firebaseMatch,
      deletedMarker: null,
      hasJson: false,
      hasFirebase: true,
      isDeleted: false
    });
  });

  deletedFirebaseMarkers.forEach((deletedMarker) => {
    if (deletedMarker.id && usedDeletedMarkerIds.has(deletedMarker.id)) return;
    rows.push({
      key: `deleted-${deletedMarker.id || getMatchMergeKeySafeV116(deletedMarker)}`,
      displayMatch: deletedMarker,
      staticMatch: null,
      firebaseMatch: null,
      deletedMarker,
      hasJson: false,
      hasFirebase: false,
      isDeleted: true
    });
  });

  return sortMatchesForDisplay(rows.map((row) => row.displayMatch)).map((displayMatch) => (
    rows.find((row) => row.displayMatch === displayMatch)
    || rows.find((row) => row.displayMatch.id && row.displayMatch.id === displayMatch.id)
    || rows[0]
  )).filter(Boolean);
}

function renderAdminMatchSourceBadgesV117(row) {
  return `
    ${row.hasJson ? `<span class="admin-match-source-badge admin-match-source-badge-json" title="Partita recuperata dal calendario JSON statico">JSON</span>` : ""}
    ${row.hasFirebase ? `<span class="admin-match-source-badge admin-match-source-badge-firebase" title="Partita presente come record attivo nella raccolta Firestore competitionMatches">Firebase</span>` : ""}
    ${row.isDeleted ? `<span class="admin-match-source-badge admin-match-source-badge-deleted" title="La copia Firebase e marcata deleted: true">deleted</span>` : ""}
  `;
}

function openCompetitionMatchesListV117() {
  expandAdminPanel("adminCompetitionMatchesPanel");
  document.querySelector('#adminCompetitionMatchesPanel details.admin-edit-section')?.setAttribute("open", "");
}

async function softDeleteCompetitionMatchV117(matchId) {
  if (!matchId) return;
  const match = (state.raw.competitionMatches || []).find((item) => item.id === matchId);
  const label = match ? `${getSeasonTeamDisplayName(match.homeSeasonTeamId) || match.homeTeamName || "Casa"} - ${getSeasonTeamDisplayName(match.awaySeasonTeamId) || match.awayTeamName || "Trasferta"}` : "partita";
  const hasStaticCopy = Boolean(match && typeof getStaticCompetitionMatchesCanonicalV109 === "function" && (() => {
    const competition = typeof getCompetitionForStaticLookupV109 === "function" ? getCompetitionForStaticLookupV109(match.competitionId) : null;
    const staticMatches = getStaticCompetitionMatchesCanonicalV109(competition) || [];
    return staticMatches.some((staticMatch) => isSameMatchKeyV117(staticMatch, match));
  })());
  const confirmed = window.confirm(`Eliminare questa partita dai record Firebase attivi?\n${label}\n\n${hasStaticCopy ? "La partita resta visibile dal JSON statico e avra badge JSON + deleted." : "Il record viene marcato deleted e non sara mostrato nel pubblico se manca il JSON statico."}`);
  if (!confirmed) return;
  try {
    const marker = {
      ...(match || {}),
      id: matchId,
      deleted: true,
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      source: hasStaticCopy ? "firebase-delete-marker-static-json" : "firebase-delete-marker"
    };
    await deleteDoc(doc(db, "competitionMatches", matchId));
    await setDoc(doc(db, "competitionMatches", matchId), marker, { merge: true });
    await loadData();
    openCompetitionMatchesListV117();
  } catch (error) {
    console.error(error);
    setError("Errore durante il flag deleted della partita.");
  }
}
softDeleteCompetitionMatchV116 = softDeleteCompetitionMatchV117;

function getAdminMatchActionButtonsV117(row) {
  if (row.hasFirebase && row.firebaseMatch?.id) {
    return `
      <button class="button button-secondary button-small" type="button" data-admin-edit-match="${escapeHtml(row.firebaseMatch.id)}">Modifica</button>
      <button class="button button-danger button-small" type="button" data-admin-soft-delete-match="${escapeHtml(row.firebaseMatch.id)}">Elimina Firebase</button>`;
  }
  if (row.isDeleted && row.deletedMarker?.id) {
    return `<button class="button button-secondary button-small" type="button" data-admin-restore-match="${escapeHtml(row.deletedMarker.id)}">Ripristina Firebase</button>`;
  }
  if (row.hasJson) return `<span class="muted">Solo JSON</span>`;
  return `<span class="muted">Solo lettura</span>`;
}
getAdminMatchActionButtonsV116 = getAdminMatchActionButtonsV117;

renderCompetitionMatchesAdminPanel = function renderCompetitionMatchesAdminPanelV117() {
  return adminCompetitionHelpersV131.renderCompetitionMatchesAdminPanel();
};

const restoreCompetitionMatchBeforeV117 = restoreCompetitionMatchV116;
restoreCompetitionMatchV116 = async function restoreCompetitionMatchV117(matchId) {
  state.keepCompetitionMatchesListOpenV117 = true;
  await restoreCompetitionMatchBeforeV117(matchId);
  openCompetitionMatchesListV117();
};


/* V119 - Fantamercato, trattative squadra e badge uniformi. */
// V168: transfer market collections are loaded with targeted queries in loadTransferMarketCollectionsV133.
// Do not add them to COLLECTIONS, otherwise admin full-load reads the entire collections too.

state.transferMarketLoadedV119 = false;
state.transferMarketLoadingV119 = false;
state.transferMarketTeamFilterV119 = state.transferMarketTeamFilterV119 || "all";
state.transferMarketSearchV119 = state.transferMarketSearchV119 || "";
state.prefillTransferListingIdV119 = state.prefillTransferListingIdV119 || "";

function ensureTransferMarketDomV119() {
  const desktopNav = document.querySelector(".app-nav");
  if (desktopNav && !desktopNav.querySelector('[data-page-link="fantamercato"]')) {
    const link = document.createElement("a");
    link.href = "#fantamercato";
    link.className = "nav-link";
    link.dataset.pageLink = "fantamercato";
    link.textContent = "Fantamercato";
    const listoneLink = desktopNav.querySelector('[data-page-link="listone"]');
    desktopNav.insertBefore(link, listoneLink || null);
  }

  const mobileSheet = document.getElementById("mobileMoreSheet");
  if (mobileSheet && !mobileSheet.querySelector('[data-page-link="fantamercato"]')) {
    const link = document.createElement("a");
    link.href = "#fantamercato";
    link.className = "mobile-more-link";
    link.dataset.pageLink = "fantamercato";
    link.textContent = "Fantamercato";
    const listoneLink = mobileSheet.querySelector('[data-page-link="listone"]');
    mobileSheet.insertBefore(link, listoneLink || null);
  }

  const main = document.querySelector("main.app-main");
  const listonePage = document.querySelector('[data-page="listone"]');
  if (main && !document.querySelector('[data-page="fantamercato"]')) {
    const section = document.createElement("section");
    section.className = "app-page";
    section.dataset.page = "fantamercato";
    section.setAttribute("aria-labelledby", "fantamercatoTitle");
    section.innerHTML = `
      <div class="page-heading">
        <div>
          <p class="eyebrow">Scambi e trasferibili</p>
          <h2 id="fantamercatoTitle">Fantamercato</h2>
          <p>Giocatori messi in vendita dai presidenti, condizioni richieste e avvio rapido di una proposta di trattativa.</p>
        </div>
      </div>
      <section class="panel transfer-market-panel">
        <div class="panel-header">
          <div>
            <h2>Giocatori trasferibili</h2>
            <p>Consulta i giocatori sul mercato e, se hai un account presidente attivo, apri una proposta di trattativa.</p>
          </div>
          <div class="filters-row">
            <select id="transferMarketTeamFilter" class="input filter-input" aria-label="Filtro squadra fantamercato"><option value="all">Tutte le squadre</option></select>
            <input id="transferMarketSearch" class="input search-input" type="search" placeholder="Cerca giocatore, squadra, condizioni..." />
          </div>
        </div>
        <div class="table-wrap mobile-tabular-wrap transfer-market-table-wrap">
          <table class="mobile-tabular transfer-market-table">
            <thead><tr><th>Giocatore</th><th>Rosa</th><th>Ruolo</th><th>Squadra</th><th class="number">Costo</th><th>Condizioni</th><th>Azione</th></tr></thead>
            <tbody id="transferMarketTableBody"><tr><td colspan="7" class="muted center">Caricamento...</td></tr></tbody>
          </table>
        </div>
      </section>`;
    main.insertBefore(section, listonePage || document.getElementById("adminPanel") || null);
  }
}

const makeEmptyRawDataBeforeV119 = makeEmptyRawDataV34;
makeEmptyRawDataV34 = function makeEmptyRawDataV119() {
  const raw = makeEmptyRawDataBeforeV119();
  raw.transferListings = raw.transferListings || [];
  raw.transferNegotiations = raw.transferNegotiations || [];
  return raw;
};

async function loadTransferMarketCollectionsV119() {
  if (!state.raw) state.raw = makeEmptyRawDataV34();
  state.transferMarketLoadingV119 = true;
  try {
    const [listings, negotiations] = await Promise.all([
      loadCollection("transferListings").catch((error) => {
        console.warn("Transfer listings non disponibili", error);
        return state.raw.transferListings || [];
      }),
      loadCollection("transferNegotiations").catch((error) => {
        console.warn("Transfer negotiations non disponibili", error);
        return state.raw.transferNegotiations || [];
      })
    ]);
    state.raw.transferListings = Array.isArray(listings) ? listings : [];
    state.raw.transferNegotiations = Array.isArray(negotiations) ? negotiations : [];
    state.transferMarketLoadedV119 = true;
  } finally {
    state.transferMarketLoadingV119 = false;
  }
}

function ensureTransferMarketDataV119() {
  if (state.transferMarketLoadedV119 || state.transferMarketLoadingV119) return;
  loadTransferMarketCollectionsV119().then(() => {
    renderTransferMarketPageV119();
    renderUserAreaV34?.();
    renderTeamsTable?.();
  }).catch((error) => console.warn("Fantamercato non caricato", error));
}

const loadDataForCurrentAuthBeforeV119 = typeof loadDataForCurrentAuthV100 === "function" ? loadDataForCurrentAuthV100 : null;
if (loadDataForCurrentAuthBeforeV119) {
  loadDataForCurrentAuthV100 = async function loadDataForCurrentAuthV119(options = {}) {
    const result = await loadDataForCurrentAuthBeforeV119(options);
    await loadTransferMarketCollectionsV119();
    if (options.render) {
      renderTransferMarketPageV119();
      renderUserAreaV34?.();
      renderTeamsTable?.();
    }
    return result;
  };
  loadData = async function loadDataV119() {
    return loadDataForCurrentAuthV100({ render: true });
  };
}

const transferMarketHelpersV128 = createTransferMarketHelpersV128({
  state,
  escapeHtml,
  normalizeKey,
  normalizePlayerName,
  formatFm,
  parseDecimalValue,
  getApprovedTeamUser: () => getApprovedTeamUser?.(),
  getCurrentSeasonId,
  getSeasonTeamsForSeason,
  getSeasonTeamById,
  getRosterForSeasonTeam,
  getSeasonTeamDisplayName,
  getTeamFmBalance,
  sortRosterPlayersForDisplay
});

const {
  getApprovedSeasonTeamId: getApprovedSeasonTeamIdV119,
  getApprovedPresidentId: getApprovedPresidentIdV119,
  isOwnSeasonTeam: isOwnSeasonTeamV119,
  getActiveSeasonTeamsForTrades: getActiveSeasonTeamsForTradesV119,
  getPlayerMarketKey: getPlayerMarketKeyV119,
  getRosterPlayerByKey: getRosterPlayerByKeyV119,
  getRosterCount: getRosterCountV119,
  getActiveTransferListings: getActiveTransferListingsV119,
  getListingForPlayer: getListingForPlayerV119,
  renderTransferBadge: renderTransferBadgeV119,
  renderRosterMarketAction: renderRosterMarketActionV119,
  getTransferListingById: getTransferListingByIdV119,
  getNegotiationById: getNegotiationByIdV119,
  serializePlayerRef: serializePlayerRefV119,
  formatPlayerRefs: formatPlayerRefsV119,
  renderFmPart: renderFmPartV119,
  renderNegotiationStatusBadge: renderNegotiationStatusBadgeV119,
  getNegotiationTitle: getNegotiationTitleV119,
  renderNegotiationCard: renderNegotiationCardV119,
  renderNegotiationsList: renderNegotiationsListV119,
  renderTradePlayerOptions: renderTradePlayerOptionsV119,
  getSelectedValues: getSelectedValuesV119,
  getSelectedPlayerRefs: getSelectedPlayerRefsV119,
  getTradeFormValidation: getTradeFormValidationV119,
  updateTradeTargetPlayers: updateTradeTargetPlayersV119,
  validateTradeForm: validateTradeFormV119
} = transferMarketHelpersV128;

renderRosterPlayerTable = function renderRosterPlayerTableV119(players) {
  if (!players.length) return `<p class="muted">Nessun giocatore in rosa.</p>`;
  const seasonTeamId = players.find((player) => player.seasonTeamId)?.seasonTeamId || "";
  const showMarketColumn = isOwnSeasonTeamV119(seasonTeamId);
  const colSpan = showMarketColumn ? 6 : 5;
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
            ${showMarketColumn ? `<th>Mercato</th>` : ""}
          </tr>
        </thead>
        <tbody>
          ${sortRosterPlayersForDisplay(players).map((player) => {
            const currentSeasonTeamId = player.seasonTeamId || seasonTeamId;
            const playerWithTeam = { ...player, seasonTeamId: currentSeasonTeamId };
            return `
            <tr>
              <td data-label="Giocatore" class="roster-col-player">${renderPlayerNameLinkV90(playerWithTeam)} ${renderTransferBadgeV119(playerWithTeam, currentSeasonTeamId)}</td>
              <td data-label="R (RM)" class="roster-col-role">${getRosterRoleDisplay(playerWithTeam)}</td>
              <td data-label="Sq" class="roster-col-team">${escapeHtml(playerWithTeam.realTeam || "-")}</td>
              <td data-label="Costo" class="number roster-col-cost">${escapeHtml(playerWithTeam.cost ?? "-")}</td>
              <td data-label="Qt.A" class="number roster-col-qta">${formatListoneNumber(getRosterPlayerQuotationCurrent(playerWithTeam))}</td>
              ${showMarketColumn ? `<td data-label="Mercato">${renderRosterMarketActionV119(playerWithTeam, currentSeasonTeamId)}</td>` : ""}
            </tr>`;
          }).join("") || `<tr><td colspan="${colSpan}" class="muted center">Nessun giocatore in rosa.</td></tr>`}
        </tbody>
      </table>
    </div>`;
};


async function savePlayerTransferListingV119(seasonTeamId, playerKey, conditions) {
  const player = getRosterPlayerByKeyV119(seasonTeamId, playerKey);
  if (!player) throw new Error("Giocatore non trovato nella rosa.");
  const seasonTeam = getSeasonTeamById(seasonTeamId);
  const seasonId = seasonTeam?.seasonId || getCurrentSeasonId();
  const docId = `${makeIdPart(seasonId)}_${makeIdPart(seasonTeamId)}_${makeIdPart(playerKey)}`.slice(0, 190);
  const payload = {
    ...serializePlayerRefV119(player, seasonTeamId),
    seasonId,
    seasonTeamId,
    teamName: getSeasonTeamDisplayName(seasonTeamId),
    conditions: String(conditions || "").trim(),
    status: "ACTIVE",
    createdBy: state.user?.uid || "",
    updatedAt: serverTimestamp()
  };
  const existing = getTransferListingByIdV119(docId);
  if (!existing) payload.createdAt = serverTimestamp();
  await setDoc(doc(db, "transferListings", docId), payload, { merge: true });
}

async function removeTransferListingV119(listingId) {
  await setDoc(doc(db, "transferListings", listingId), {
    status: "REMOVED",
    removedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

function renderTransferMarketPageV119() {
  ensureTransferMarketDomV119();
  const tableBody = document.getElementById("transferMarketTableBody");
  const teamFilter = document.getElementById("transferMarketTeamFilter");
  const searchInput = document.getElementById("transferMarketSearch");
  if (!tableBody) return;

  const seasonId = getCurrentSeasonId();
  const listings = getActiveTransferListingsV119(seasonId);
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const selectedTeam = state.transferMarketTeamFilterV119 || teamFilter?.value || "all";
  const search = normalizeKey(state.transferMarketSearchV119 || searchInput?.value || "");

  if (teamFilter) {
    teamFilter.innerHTML = `<option value="all">Tutte le squadre</option>${seasonTeams.map((team) => `<option value="${escapeHtml(team.id)}" ${team.id === selectedTeam ? "selected" : ""}>${escapeHtml(team.name || team.id)}</option>`).join("")}`;
    teamFilter.value = seasonTeams.some((team) => team.id === selectedTeam) ? selectedTeam : "all";
  }
  if (searchInput && searchInput.value !== state.transferMarketSearchV119) searchInput.value = state.transferMarketSearchV119 || "";

  const rows = listings
    .filter((listing) => selectedTeam === "all" || listing.seasonTeamId === selectedTeam)
    .filter((listing) => {
      if (!search) return true;
      return normalizeKey([listing.playerName, listing.teamName, getSeasonTeamDisplayName(listing.seasonTeamId), listing.realTeam, listing.rosterRole, listing.conditions].join(" ")).includes(search);
    })
    .sort((a, b) => String(a.playerName || "").localeCompare(String(b.playerName || ""), "it", { sensitivity: "base" }));

  if (!state.transferMarketLoadedV119 && state.transferMarketLoadingV119) {
    tableBody.innerHTML = `<tr><td colspan="7" class="muted center">Caricamento fantamercato...</td></tr>`;
    return;
  }

  tableBody.innerHTML = rows.length ? rows.map((listing) => {
    const own = isOwnSeasonTeamV119(listing.seasonTeamId);
    return `
      <tr>
        <td data-label="Giocatore"><strong>${escapeHtml(listing.playerName || "-")}</strong> <span class="status status-transfermarket">TRASF</span></td>
        <td data-label="Rosa">${renderSeasonTeamNameWithLogo(listing.seasonTeamId, { strong: false })}</td>
        <td data-label="Ruolo">${escapeHtml(listing.rosterRole || "-")}</td>
        <td data-label="Squadra"><span class="team-code">${escapeHtml(listing.realTeam || "-")}</span></td>
        <td data-label="Costo" class="number">${formatListoneNumber(listing.cost)}</td>
        <td data-label="Condizioni">${escapeHtml(listing.conditions || "-")}</td>
        <td data-label="Azione" class="transfer-market-actions">
          ${own
            ? `<button class="button button-secondary button-small" type="button" data-transfer-edit-listing="${escapeHtml(listing.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-transfer-remove-listing="${escapeHtml(listing.id)}">Togli</button>`
            : `<button class="button button-primary button-small" type="button" data-transfer-propose-listing="${escapeHtml(listing.id)}">Fai proposta</button>`}
        </td>
      </tr>`;
  }).join("") : `<tr><td colspan="7" class="muted center">Nessun giocatore trasferibile per questa stagione.</td></tr>`;
}


function renderUserAreaApprovedV119(approved) {
  const seasonTeamName = getSeasonTeamDisplayName(approved.seasonTeamId) || approved.teamName || "Squadra";
  const seasonId = approved.seasonId || getCurrentSeasonId();
  const prefill = getTransferListingByIdV119(state.prefillTransferListingIdV119 || "");
  const prefillTargetTeamId = prefill?.seasonTeamId || "";
  const prefillPlayerKey = prefill?.playerKey ? [prefill.playerKey] : [];
  const targetTeams = getActiveSeasonTeamsForTradesV119(seasonId);
  const selectedTargetTeamId = prefillTargetTeamId && targetTeams.some((team) => team.id === prefillTargetTeamId) ? prefillTargetTeamId : targetTeams[0]?.id || "";
  const targetOptions = targetTeams.map((team) => `<option value="${escapeHtml(team.id)}" ${team.id === selectedTargetTeamId ? "selected" : ""}>${escapeHtml(team.name || team.id)}</option>`).join("");
  const offeredOptions = renderTradePlayerOptionsV119(approved.seasonTeamId, []);
  const requestedOptions = renderTradePlayerOptionsV119(selectedTargetTeamId, prefillTargetTeamId ? prefillPlayerKey : []);

  return `
    <section class="panel team-area-summary-panel">
      <div class="panel-header compact"><div><h2>${escapeHtml(seasonTeamName)}</h2><p>Gestisci trattative, comunicati e profilo squadra.</p></div></div>
      <div class="cards-grid user-request-grid">
        <article class="metric-card"><span class="metric-label">Utente</span><strong>${escapeHtml(getCurrentUserDisplayName())}</strong></article>
        <article class="metric-card"><span class="metric-label">Ruolo</span><strong>Presidente</strong></article>
        <article class="metric-card"><span class="metric-label">Stato</span><strong>Attivo</strong></article>
      </div>
      <div class="team-area-profile-action"><button class="button button-secondary" type="button" data-open-team-profile="${escapeHtml(approved.seasonTeamId)}">Apri pagina squadra</button></div>
    </section>

    <section class="panel trade-proposal-panel">
      <div class="panel-header compact"><div><h2>Proponi svincolo</h2><p>Avvia una trattativa con una squadra attiva: offri giocatori e/o FM e chiedi giocatori e/o FM.</p></div></div>
      ${prefill ? `<p class="notice notice-success trade-prefill-notice">Proposta precompilata per <strong>${escapeHtml(prefill.playerName || "giocatore")}</strong> di ${escapeHtml(getSeasonTeamDisplayName(prefill.seasonTeamId))}.</p>` : ""}
      <form id="tradeProposalForm" class="form-grid trade-proposal-form">
        <label class="span-2">Squadra con cui trattare<select id="tradeTargetTeam" class="input" required>${targetOptions}</select></label>
        <label>Giocatori che offri<select id="tradeOfferedPlayers" class="input" multiple size="7">${offeredOptions}</select><button class="button button-secondary button-small trade-clear-selection-button" type="button" data-clear-trade-select="tradeOfferedPlayers">Deseleziona giocatori offerti</button><small class="field-hint">Puoi selezionare uno o più giocatori della tua rosa.</small></label>
        <label>Giocatori che chiedi<select id="tradeRequestedPlayers" class="input" multiple size="7">${requestedOptions}</select><button class="button button-secondary button-small trade-clear-selection-button" type="button" data-clear-trade-select="tradeRequestedPlayers">Deseleziona giocatori richiesti</button><small class="field-hint">La lista dipende dalla squadra selezionata.</small></label>
        <label>FM che offri<input id="tradeOfferedFm" class="input" type="text" inputmode="decimal" placeholder="Es. 10,5" /></label>
        <label>FM che chiedi<input id="tradeRequestedFm" class="input" type="text" inputmode="decimal" placeholder="Es. 5" /></label>
        <label class="span-2">Messaggio<textarea id="tradeProposalNote" class="input textarea" rows="3" placeholder="Scrivi una nota per il presidente destinatario..."></textarea></label>
        <div id="tradeValidationStatus" class="trade-validation span-2"></div>
        <div class="form-actions span-2"><button id="tradeSubmitButton" class="button button-primary" type="submit" disabled>Invia proposta</button><span id="tradeProposalStatus" class="form-status"></span></div>
      </form>
    </section>

    <section class="panel trade-list-panel">
      <div class="panel-header compact"><div><h2>Trattative</h2><p>Storico delle proposte inviate e ricevute nella stagione selezionata.</p></div></div>
      <div class="grid-two trade-lists-grid">
        <article class="trade-list-column"><h3>Inviate</h3>${renderNegotiationsListV119(approved.seasonTeamId, "sent")}</article>
        <article class="trade-list-column"><h3>Ricevute</h3>${renderNegotiationsListV119(approved.seasonTeamId, "received")}</article>
      </div>
    </section>

    <section class="panel">
      <div class="panel-header compact"><div><h2>Invia comunicato squadra</h2><p>Il comunicato sarà pubblicato in News e nella pagina squadra dopo approvazione.</p></div></div>
      <form id="teamNewsRequestForm" class="form-grid">
        <label class="span-2">Titolo<input id="teamNewsRequestTitle" class="input" type="text" required /></label>
        <label class="span-2">Testo<textarea id="teamNewsRequestBody" class="input textarea" rows="5" required></textarea></label>
        <div class="form-actions span-2"><button class="button button-primary" type="submit">Invia comunicato</button><span id="teamNewsRequestStatus" class="form-status"></span></div>
      </form>
    </section>`;
}

renderUserAreaV34 = function renderUserAreaV119() {
  const target = document.getElementById("teamAreaBody");
  if (!target) return;
  const approved = getApprovedTeamUser?.();
  if (!state.user || !approved) {
    const previous = renderUserAreaBeforeV42 || renderUserAreaBeforeV34;
    if (typeof previous === "function") previous();
    return;
  }
  target.innerHTML = renderUserAreaApprovedV119(approved);
  attachUserAreaHandlersV119();
};

function attachUserAreaHandlersV119() {
  const targetTeam = document.getElementById("tradeTargetTeam");
  const tradeForm = document.getElementById("tradeProposalForm");
  targetTeam?.addEventListener("change", () => {
    updateTradeTargetPlayersV119();
    validateTradeFormV119();
  });
  ["tradeOfferedPlayers", "tradeRequestedPlayers", "tradeOfferedFm", "tradeRequestedFm", "tradeProposalNote"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", validateTradeFormV119);
    document.getElementById(id)?.addEventListener("change", validateTradeFormV119);
  });
  validateTradeFormV119();

  tradeForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const validation = validateTradeFormV119();
    if (!validation.valid) return;
    try {
      const payload = {
        seasonId: getCurrentSeasonId(),
        fromSeasonTeamId: validation.fromTeamId,
        fromTeamName: getSeasonTeamDisplayName(validation.fromTeamId),
        toSeasonTeamId: validation.toTeamId,
        toTeamName: getSeasonTeamDisplayName(validation.toTeamId),
        offeredPlayers: getSelectedPlayerRefsV119(validation.fromTeamId, validation.offeredKeys),
        requestedPlayers: getSelectedPlayerRefsV119(validation.toTeamId, validation.requestedKeys),
        offeredFm: validation.offeredFm,
        requestedFm: validation.requestedFm,
        note: document.getElementById("tradeProposalNote")?.value.trim() || "",
        status: "PENDING",
        source: state.prefillTransferListingIdV119 ? "transfer-market" : "direct",
        listingId: state.prefillTransferListingIdV119 || "",
        createdBy: state.user?.uid || "",
        createdByName: getCurrentUserDisplayName(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await addDoc(collection(db, "transferNegotiations"), payload);
      state.prefillTransferListingIdV119 = "";
      await loadTransferMarketCollectionsV119();
      renderUserAreaV34();
      renderTransferMarketPageV119();
      showMessage("tradeProposalStatus", "Proposta inviata.");
    } catch (error) {
      console.error(error);
      showMessage("tradeProposalStatus", error?.message || "Errore invio proposta.", true);
    }
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

async function updateNegotiationStatusV119(id, status) {
  const item = getNegotiationByIdV119(id);
  const currentTeamId = getApprovedSeasonTeamIdV119();
  if (!item) throw new Error("Trattativa non trovata.");
  if (status === "CANCELLED") {
    if (item.fromSeasonTeamId !== currentTeamId) throw new Error("Solo chi invia può annullare la trattativa.");
    if (item.status !== "PENDING") throw new Error("Puoi eliminare solo una trattativa ancora in attesa.");
    await deleteDoc(doc(db, "transferNegotiations", id));
    await loadTransferMarketCollectionsV119();
    renderUserAreaV34();
    return;
  }
  if ((status === "ACCEPTED" || status === "REJECTED") && item.toSeasonTeamId !== currentTeamId) throw new Error("Solo chi riceve può rispondere alla trattativa.");
  await updateDoc(doc(db, "transferNegotiations", id), {
    status,
    updatedAt: serverTimestamp(),
    [`${status.toLowerCase()}At`]: serverTimestamp(),
    [`${status.toLowerCase()}By`]: state.user?.uid || ""
  });
  await loadTransferMarketCollectionsV119();
  renderUserAreaV34();
}

function renderTeamProfileNegotiationsV119(seasonTeamId) {
  const viewerTeamId = getApprovedSeasonTeamIdV119();
  if (!seasonTeamId || (!state.isAdmin && !viewerTeamId)) return "";
  const rows = (state.raw?.transferNegotiations || [])
    .filter((item) => item.seasonId === getCurrentSeasonId())
    .filter((item) => item.fromSeasonTeamId === seasonTeamId || item.toSeasonTeamId === seasonTeamId)
    .filter((item) => state.isAdmin || item.fromSeasonTeamId === viewerTeamId || item.toSeasonTeamId === viewerTeamId)
    .sort((a, b) => String(b.createdAt?.seconds || b.createdAt || "").localeCompare(String(a.createdAt?.seconds || a.createdAt || ""), "it"));
  if (!rows.length) return "";
  return `<section class="panel detail-section team-profile-trades"><h3>Trattative</h3>${rows.map((item) => renderNegotiationCardV119(item, item.fromSeasonTeamId === seasonTeamId ? "sent" : "received", seasonTeamId)).join("")}</section>`;
}

const renderTeamProfileContentBeforeV119 = renderTeamProfileContentV42;
renderTeamProfileContentV42 = function renderTeamProfileContentWithTradesV119(snapshot) {
  const html = renderTeamProfileContentBeforeV119(snapshot);
  return html + renderTeamProfileNegotiationsV119(snapshot?.seasonTeamId || state.activeTeamProfileSeasonTeamId || "");
};

const renderAllBeforeV119 = renderAll;
renderAll = function renderAllV119() {
  ensureTransferMarketDomV119();
  const result = renderAllBeforeV119();
  renderTransferMarketPageV119();
  ensureTransferMarketDataV119();
  return result;
};

document.addEventListener("change", (event) => {
  const teamFilter = event.target.closest("#transferMarketTeamFilter");
  if (teamFilter) {
    state.transferMarketTeamFilterV119 = teamFilter.value || "all";
    renderTransferMarketPageV119();
  }
}, true);

document.addEventListener("input", (event) => {
  const search = event.target.closest("#transferMarketSearch");
  if (search) {
    state.transferMarketSearchV119 = search.value || "";
    renderTransferMarketPageV119();
  }
}, true);

document.addEventListener("click", async (event) => {
  const listButton = event.target.closest("[data-transfer-list-player]");
  const editButton = event.target.closest("[data-transfer-edit-listing]");
  const removeButton = event.target.closest("[data-transfer-remove-listing]");
  const proposeButton = event.target.closest("[data-transfer-propose-listing]");
  const cancelButton = event.target.closest("[data-trade-cancel]");
  const acceptButton = event.target.closest("[data-trade-accept]");
  const rejectButton = event.target.closest("[data-trade-reject]");

  try {
    if (listButton) {
      event.preventDefault();
      const seasonTeamId = listButton.dataset.seasonTeamId;
      if (!isOwnSeasonTeamV119(seasonTeamId)) return;
      const player = getRosterPlayerByKeyV119(seasonTeamId, listButton.dataset.transferListPlayer);
      const conditions = window.prompt(`Condizioni per ${player?.playerName || "il giocatore"}: cosa cerchi per trattare?`, "");
      if (conditions === null) return;
      await savePlayerTransferListingV119(seasonTeamId, listButton.dataset.transferListPlayer, conditions);
      await loadTransferMarketCollectionsV119();
      renderTeamsTable?.();
      renderTransferMarketPageV119();
      return;
    }

    if (editButton) {
      event.preventDefault();
      const listing = getTransferListingByIdV119(editButton.dataset.transferEditListing);
      if (!listing || !isOwnSeasonTeamV119(listing.seasonTeamId)) return;
      const next = window.prompt(`Modifica condizioni per ${listing.playerName || "il giocatore"}. Lascia vuoto e conferma per togliere dal mercato.`, listing.conditions || "");
      if (next === null) return;
      if (!String(next).trim() && window.confirm("Vuoi togliere il giocatore dal mercato?")) await removeTransferListingV119(listing.id);
      else await savePlayerTransferListingV119(listing.seasonTeamId, listing.playerKey, next);
      await loadTransferMarketCollectionsV119();
      renderTeamsTable?.();
      renderTransferMarketPageV119();
      renderUserAreaV34?.();
      return;
    }

    if (removeButton) {
      event.preventDefault();
      const listing = getTransferListingByIdV119(removeButton.dataset.transferRemoveListing);
      if (!listing || !isOwnSeasonTeamV119(listing.seasonTeamId)) return;
      if (!window.confirm(`Togli ${listing.playerName || "questo giocatore"} dal mercato?`)) return;
      await removeTransferListingV119(listing.id);
      await loadTransferMarketCollectionsV119();
      renderTeamsTable?.();
      renderTransferMarketPageV119();
      return;
    }

    if (proposeButton) {
      event.preventDefault();
      if (!getApprovedTeamUser?.()) {
        window.alert("Accedi con un account presidente attivo per fare una proposta.");
        return;
      }
      state.prefillTransferListingIdV119 = proposeButton.dataset.transferProposeListing || "";
      renderUserAreaV34?.();
      if (typeof setAppPageV42 === "function") setAppPageV42("teamarea");
      else window.location.hash = "#teamarea";
      return;
    }

    if (cancelButton) {
      event.preventDefault();
      if (window.confirm("Annullare questa proposta? Verrà eliminata definitivamente da Firebase.")) await updateNegotiationStatusV119(cancelButton.dataset.tradeCancel, "CANCELLED");
      return;
    }
    if (acceptButton) {
      event.preventDefault();
      if (window.confirm("Accettare questa trattativa?")) await updateNegotiationStatusV119(acceptButton.dataset.tradeAccept, "ACCEPTED");
      return;
    }
    if (rejectButton) {
      event.preventDefault();
      if (window.confirm("Rifiutare questa trattativa?")) await updateNegotiationStatusV119(rejectButton.dataset.tradeReject, "REJECTED");
    }
  } catch (error) {
    console.error(error);
    setError(error?.message || "Operazione fantamercato non riuscita.");
  }
}, true);

ensureTransferMarketDomV119();
// V124: il caricamento dati fantamercato parte dopo l'override sicuro a fine file.


/* V120 - Link Fantacalcio e mercato nella pagina squadra, load sicuro delle raccolte fantamercato. */
function removeTransferCollectionsFromCoreLoadV120() {
  ["transferListings", "transferNegotiations"].forEach((name) => {
    let index = COLLECTIONS.indexOf(name);
    while (index !== -1) {
      COLLECTIONS.splice(index, 1);
      index = COLLECTIONS.indexOf(name);
    }
  });
}
removeTransferCollectionsFromCoreLoadV120();

function renderTeamProfileContentV120(snapshot) {
  if (!snapshot) {
    return `<section class="panel"><p class="muted">Scheda squadra non ancora generata. Accedi come admin e aggiorna gli snapshot squadra.</p></section>`;
  }

  const seasonTeamId = snapshot.seasonTeamId || state.activeTeamProfileSeasonTeamId || "";
  const isOwner = isOwnSeasonTeamV119(seasonTeamId);
  const marketHeader = isOwner ? `<th>Mercato</th>` : "";
  const rosterColspan = isOwner ? 6 : 5;

  const rosterRows = (snapshot.rosterEntries || []).sort(compareRosterPlayersV34).map((player) => {
    const playerWithTeam = { ...player, seasonTeamId };
    return `
      <tr>
        <td data-label="Giocatore" class="team-profile-player-cell">${renderPlayerNameLinkV90(playerWithTeam, "team-profile-player-link")} ${renderTransferBadgeV119(playerWithTeam, seasonTeamId)}</td>
        <td data-label="R (RM)" class="team-profile-role-cell">${getRosterRoleDisplay(playerWithTeam)}</td>
        <td data-label="Sq" class="team-profile-team-cell">${escapeHtml(playerWithTeam.realTeam || "-")}</td>
        <td data-label="Costo" class="number team-profile-cost-cell">${formatListoneNumber(playerWithTeam.cost)}</td>
        <td data-label="Qt.A" class="number team-profile-qta-cell">${formatListoneNumber(getRosterPlayerQuotationCurrent(playerWithTeam))}</td>
        ${isOwner ? `<td data-label="Mercato" class="team-profile-market-cell">${renderRosterMarketActionV119(playerWithTeam, seasonTeamId)}</td>` : ""}
      </tr>`;
  }).join("") || `<tr><td colspan="${rosterColspan}" class="muted center">Rosa non disponibile.</td></tr>`;

  const palmaresRows = (snapshot.palmares || []).map((item) => `
    <tr><td>${escapeHtml(item.seasonLabel || item.seasonId)}</td><td>${escapeHtml(item.label)}</td></tr>`).join("") || `<tr><td colspan="2" class="muted center">Nessun titolo/piazzamento.</td></tr>`;

  const movementRows = (snapshot.recentMovements || []).map((movement) => `
    <tr><td>${escapeHtml(movement.date || "-")}</td><td>${renderFmMovementTypeBadge(movement.type)}</td><td>${escapeHtml(movement.playerName || "-")}</td><td class="number">${formatFm(movement.amount || 0)}</td></tr>`).join("") || `<tr><td colspan="4" class="muted center">Nessun movimento recente.</td></tr>`;

  const newsHtml = (snapshot.recentNews || []).map((news) => `
    <article class="compact-card team-profile-news-card">
      <h3>${escapeHtml(news.title || "Comunicato")}</h3>
      <p class="news-body-preserve">${renderBoldMarkdown(news.body || "")}</p>
      <small class="muted">${escapeHtml(formatNewsDateTimeV79(getNewsRawDateValueV79(news)))}</small>
    </article>`).join("") || `<p class="muted">Nessun comunicato squadra.</p>`;

  const matchesRows = (snapshot.recentMatches || []).map((match) => `
    <tr>
      <td>${escapeHtml(match.competitionCode || getCompetitionShortCodeById(match.competitionId))}</td>
      <td>${escapeHtml(formatMatchStage(match))}</td>
      <td>${escapeHtml(getSeasonTeamDisplayName(match.homeSeasonTeamId))} - ${escapeHtml(getSeasonTeamDisplayName(match.awaySeasonTeamId))}</td>
      <td>${escapeHtml(formatMatchResult(match))}</td>
    </tr>`).join("") || `<tr><td colspan="4" class="muted center">Nessuna partita recente.</td></tr>`;

  const negotiationsHtml = typeof renderTeamProfileNegotiationsV119 === "function"
    ? renderTeamProfileNegotiationsV119(seasonTeamId)
    : "";

  return `
    <section class="panel team-profile-hero-panel">
      <div class="team-profile-header team-profile-header-stacked team-profile-page-hero">
        ${renderTeamLogo(snapshot.teamName, snapshot.logo, "club-logo-lg")}
        <div class="team-profile-title-block">
          <h3>${escapeHtml(snapshot.teamName || "Squadra")}</h3>
          <p class="muted team-profile-meta-line">Presidenti: ${escapeHtml(snapshot.presidents || "-")}</p>
          <p class="muted team-profile-meta-line">Saldo FM: ${formatFm(snapshot.fmBalance || 0)}</p>
          <p class="muted team-profile-meta-line">Stadio: ${escapeHtml(formatStadium(snapshot.stadium))}</p>
        </div>
      </div>
    </section>

    <section class="panel detail-section"><h3>Rosa</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-roster-wrap"><table class="mobile-tabular team-profile-roster-table roster-sticky-table"><thead><tr><th>Giocatore</th><th>R (RM)</th><th>Sq</th><th class="number">Costo</th><th class="number">Qt.A</th>${marketHeader}</tr></thead><tbody>${rosterRows}</tbody></table></div></section>
    <section class="panel detail-section"><h3>Palmarès squadra</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-palmares-wrap"><table class="mobile-tabular team-profile-palmares-table"><thead><tr><th>Stagione</th><th>Risultato</th></tr></thead><tbody>${palmaresRows}</tbody></table></div></section>
    <section class="panel detail-section"><h3>Ultimi movimenti</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap"><table class="mobile-tabular team-profile-movements-table"><thead><tr><th>Data</th><th>Tipo</th><th>Giocatore</th><th class="number">FM</th></tr></thead><tbody>${movementRows}</tbody></table></div></section>
    <section class="panel detail-section"><h3>Ultimi comunicati</h3><div class="team-profile-news-list">${newsHtml}</div></section>
    <section class="panel detail-section"><h3>Ultime partite</h3><div class="table-wrap mobile-tabular-wrap team-profile-table-wrap team-profile-matches-wrap"><table class="mobile-tabular team-profile-matches-table"><thead><tr><th>Comp.</th><th>Fase</th><th>Partita</th><th>Ris.</th></tr></thead><tbody>${matchesRows}</tbody></table></div></section>
    ${negotiationsHtml}`;
}

renderTeamProfileContentV42 = renderTeamProfileContentV120;

openTeamProfileV34 = function openTeamProfileV120(seasonTeamId) {
  openTeamProfilePageV42(seasonTeamId, { pushHash: true }).catch((error) => {
    console.error(error);
    setError?.(`Non riesco ad aprire la pagina squadra. ${error?.message || error}`);
  });
};
openTeamProfile = openTeamProfileV34;

function refreshVisibleTeamProfileV120() {
  if (state.currentPage !== "teamprofile" || !state.activeTeamProfileSeasonTeamId) return;
  clearTimeout(state.refreshTeamProfileTimerV120);
  state.refreshTeamProfileTimerV120 = setTimeout(() => {
    openTeamProfilePageV42(state.activeTeamProfileSeasonTeamId, { pushHash: false, scroll: false }).catch((error) => {
      console.warn("Profilo squadra non aggiornato dopo operazione mercato", error);
    });
  }, 0);
}

const loadTransferMarketCollectionsBeforeV120 = loadTransferMarketCollectionsV119;
loadTransferMarketCollectionsV119 = async function loadTransferMarketCollectionsV120() {
  const result = await loadTransferMarketCollectionsBeforeV120();
  refreshVisibleTeamProfileV120();
  return result;
};

/* V122 - Admin Accetta utenti: rifiuto elimina record, storico approvati visibile. */
function getApprovedTeamUserByUidV122(uid) {
  return (state.raw.teamUsers || []).find((item) => item.id === uid) || null;
}

const adminUserApprovalHelpersV129 = createAdminUserApprovalHelpersV129({
  state,
  escapeHtml,
  requestStatusLabel,
  getSeasonTeamById,
  getTeamById,
  renderAdminPanel
});

renderPendingUsersAdminPanelV34 = function renderPendingUsersAdminPanelV129() {
  return adminUserApprovalHelpersV129.renderPendingUsersPanel();
};

rejectPendingUserV34 = async function rejectPendingUserV129(uid) {
  if (!uid) return;
  if (!window.confirm("Rifiutare l'accesso ed eliminare definitivamente questa richiesta da Firebase?")) return;
  await deleteDoc(doc(db, "pendingUsers", uid));
  await loadFullDataV32({ render: true });
  expandAdminPanel("adminPendingUsersPanel");
};


/* V124 - Mobile refinements, alert reasons and safer transfer negotiation reads. */
function updateDashboardAlertReasonV124() {
  const reasonEl = document.getElementById("metricAlertsReason");
  if (!reasonEl) return;
  const activeCompetitions = getSeasonCompetitionsForPublicDisplayV52(getCurrentSeasonId()).filter((competition) => competition.status === "ATTIVA");
  if (!activeCompetitions.length) {
    reasonEl.textContent = "Nessun alert.";
    return;
  }
  const names = activeCompetitions.map((competition) => getCompetitionDisplayNameV111?.(competition) || getCompetitionPublicDisplayNameV110?.(competition) || competition.name || competition.type || "Competizione");
  reasonEl.textContent = `Motivo: competizioni attive (${names.slice(0, 3).join(", ")}${names.length > 3 ? ", ..." : ""}).`;
}

const renderDashboardBeforeV124 = renderDashboard;
renderDashboard = function renderDashboardV124() {
  const result = renderDashboardBeforeV124();
  updateDashboardAlertReasonV124();
  return result;
};

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-clear-trade-select]");
  if (!button) return;
  event.preventDefault();
  const select = document.getElementById(button.dataset.clearTradeSelect || "");
  if (!select) return;
  Array.from(select.options || []).forEach((option) => { option.selected = false; });
  select.dispatchEvent(new Event("change", { bubbles: true }));
  validateTradeFormV119?.();
}, true);

async function loadTransferNegotiationsForCurrentUserV124() {
  if (!state.user) return [];
  if (state.isAdmin) {
    return loadCollection("transferNegotiations").catch((error) => {
      if (error?.code === "permission-denied") {
        console.info("Transfer negotiations non disponibili: aggiorna le Firestore Rules per consentire la lettura admin o per squadra.");
        return [];
      }
      console.warn("Transfer negotiations non disponibili", error);
      return [];
    });
  }
  const seasonTeamId = getApprovedSeasonTeamIdV119?.() || "";
  if (!seasonTeamId) return [];
  const readByField = async (field) => {
    const snapshot = await getDocs(query(collection(db, "transferNegotiations"), where(field, "==", seasonTeamId)));
    return snapshot.docs.map((documentSnapshot) => ({ id: documentSnapshot.id, ...documentSnapshot.data() }));
  };
  try {
    const [sent, received] = await Promise.all([readByField("fromSeasonTeamId"), readByField("toSeasonTeamId")]);
    return [...new Map([...sent, ...received].map((item) => [item.id, item])).values()];
  } catch (error) {
    if (error?.code === "permission-denied") {
      console.info("Transfer negotiations non disponibili: aggiorna le Firestore Rules per consentire la lettura delle trattative della propria squadra.");
      return [];
    }
    console.warn("Transfer negotiations non disponibili", error);
    return [];
  }
}

async function loadTransferListingsForCurrentSeasonV133() {
  const seasonId = getCurrentSeasonId?.() || "";
  const fallbackListings = state.raw?.transferListings || [];
  if (!seasonId) return fallbackListings;
  try {
    const snapshot = await getDocs(query(
      collection(db, "transferListings"),
      where("seasonId", "==", seasonId),
      where("status", "==", "ACTIVE")
    ));
    return snapshot.docs.map((documentSnapshot) => ({ id: documentSnapshot.id, ...documentSnapshot.data() }));
  } catch (error) {
    if (error?.code === "permission-denied") {
      console.info("Transfer listings non disponibili: aggiorna le Firestore Rules per consentire la lettura dei trasferibili attivi della stagione.");
      return fallbackListings;
    }
    console.warn("Transfer listings non disponibili", error);
    return fallbackListings;
  }
}

loadTransferMarketCollectionsV119 = async function loadTransferMarketCollectionsV133() {
  if (!state.raw) state.raw = makeEmptyRawDataV34();
  state.transferMarketLoadingV119 = true;
  try {
    const [listings, negotiations] = await Promise.all([
      loadTransferListingsForCurrentSeasonV133(),
      loadTransferNegotiationsForCurrentUserV124()
    ]);
    state.raw.transferListings = Array.isArray(listings) ? listings : [];
    state.raw.transferNegotiations = Array.isArray(negotiations) ? negotiations : [];
    state.transferMarketLoadedV119 = true;
  } finally {
    state.transferMarketLoadingV119 = false;
  }
  refreshVisibleTeamProfileV120?.();
};


// V170: fantamercato lazy; non caricare le raccolte mercato al bootstrap pubblico.

/* V125 - Loghi robusti nelle competizioni statiche e nomi squadra con fallback logo.
   Helper puri spostati in assets/js/domain/team-logos.js in V127. */
const getSeasonTeamLogoBeforeV125 = typeof getSeasonTeamLogo === "function" ? getSeasonTeamLogo : null;
if (getSeasonTeamLogoBeforeV125) {
  getSeasonTeamLogo = function getSeasonTeamLogoV125(seasonTeam) {
    const configuredLogo = getSeasonTeamLogoBeforeV125(seasonTeam);
    if (configuredLogo) return configuredLogo;
    if (!seasonTeam) return "";
    const { teamsById } = buildMaps();
    const team = teamsById.get(seasonTeam.teamId);
    for (const name of getSeasonTeamNameCandidatesV125(seasonTeam, team)) {
      const guessedLogo = guessTeamLogoByNameV125(name);
      if (guessedLogo) return guessedLogo;
    }
    return "";
  };
}

function findSeasonTeamByNameV125(name, seasonId = getCurrentSeasonId()) {
  const target = normalizeKey(name || "");
  if (!target) return null;
  const { teamsById } = buildMaps();
  return (state.raw.seasonTeams || []).find((seasonTeam) => {
    if (seasonId && seasonTeam.seasonId && seasonTeam.seasonId !== seasonId) return false;
    const team = teamsById.get(seasonTeam.teamId);
    return getSeasonTeamNameCandidatesV125(seasonTeam, team).map(normalizeKey).includes(target);
  }) || null;
}

const renderStaticMatchTeamNameBeforeV125 = typeof renderStaticMatchTeamNameV101 === "function" ? renderStaticMatchTeamNameV101 : null;
if (renderStaticMatchTeamNameBeforeV125) {
  renderStaticMatchTeamNameV101 = function renderStaticMatchTeamNameV125(match, side, options = {}) {
    const { strong = true, className = "", textClass = "" } = options;
    const id = side === "home" ? match.homeSeasonTeamId : match.awaySeasonTeamId;
    const fallbackName = side === "home" ? match.homeTeamName : match.awayTeamName;
    const seasonTeam = id ? getSeasonTeamById(id) : null;
    const matchedSeasonTeam = seasonTeam || findSeasonTeamByNameV125(fallbackName, match.seasonId || getCurrentSeasonId());
    const resolvedId = matchedSeasonTeam?.id || id;
    const resolvedName = matchedSeasonTeam
      ? (matchedSeasonTeam.name || getSeasonTeamDisplayName(resolvedId))
      : (fallbackName || getSeasonTeamDisplayName(resolvedId) || "-");
    const logo = (matchedSeasonTeam ? getSeasonTeamLogo(matchedSeasonTeam) : "") || guessTeamLogoByNameV125(resolvedName);
    const safeTextClass = escapeHtml(textClass);
    const text = strong
      ? `<strong class="${safeTextClass}">${escapeHtml(resolvedName)}</strong>`
      : `<span class="${safeTextClass}">${escapeHtml(resolvedName)}</span>`;
    return `<span class="club-name-with-logo static-competition-team-name ${escapeHtml(className)}">${renderTeamLogo(resolvedName, logo)}${text}</span>`;
  };
}


/* V134 - Admin: rifiuto utenti e cancellazione comunicati definitivi da Firebase. */
const rejectPendingUserBeforeV134 = rejectPendingUserV34;
rejectPendingUserV34 = async function rejectPendingUserV134(uid) {
  if (!uid) return;
  if (!window.confirm("Rifiutare l'accesso ed eliminare definitivamente questa richiesta da Firebase?")) return;
  await deleteDoc(doc(db, "pendingUsers", uid));
  await loadFullDataV32({ render: true });
  expandAdminPanel("adminPendingUsersPanel");
};

const deleteAdminNewsBeforeV134 = deleteAdminNewsV48;
deleteAdminNewsV48 = async function deleteAdminNewsV134(newsId) {
  if (!newsId) return;
  if (!window.confirm("Eliminare definitivamente questo comunicato anche da Firebase?")) return;
  const status = document.getElementById("adminNewsStatus");
  if (status) status.textContent = "Eliminazione comunicato da Firebase...";
  await deleteDoc(doc(db, "news", newsId));
  await loadFullDataV32({ render: true });
  expandAdminPanel("adminNewsPanel");
};

/* V137 - Admin Accetta utenti: rifiuto definitivo e lista approvati sempre sotto le richieste. */
rejectPendingUserV34 = async function rejectPendingUserV137(uid) {
  if (!uid) return;
  const user = (state.raw.pendingUsers || []).find((item) => item.id === uid);
  const label = user?.displayName || user?.email || uid;
  if (!window.confirm(`Rifiutare l'accesso di ${label} ed eliminare definitivamente la richiesta da Firebase?`)) return;
  try {
    await deleteDoc(doc(db, "pendingUsers", uid));
    state.raw.pendingUsers = (state.raw.pendingUsers || []).filter((item) => item.id !== uid);
    await loadFullDataV32({ render: true });
    expandAdminPanel("adminPendingUsersPanel");
  } catch (error) {
    console.error("Errore eliminazione richiesta utente", error);
    setError?.(`Non riesco a eliminare la richiesta utente. ${error?.message || error}`);
  }
};


/* V138 - Accetta utenti: richieste rifiutate non visibili e conteggio approvati. */
renderPendingUsersAdminPanelV34 = function renderPendingUsersAdminPanelV138() {
  return adminUserApprovalHelpersV129.renderPendingUsersPanel();
};

rejectPendingUserV34 = async function rejectPendingUserV138(uid) {
  if (!uid) return;
  const user = (state.raw.pendingUsers || []).find((item) => item.id === uid);
  const label = user?.displayName || user?.email || uid;
  if (!window.confirm(`Rifiutare l'accesso di ${label} ed eliminare definitivamente la richiesta da Firebase?`)) return;
  try {
    await deleteDoc(doc(db, "pendingUsers", uid));
    state.raw.pendingUsers = (state.raw.pendingUsers || []).filter((item) => item.id !== uid);
    renderAdminArea();
    expandAdminPanel("adminPendingUsersPanel");
    await loadFullDataV32({ render: true });
    expandAdminPanel("adminPendingUsersPanel");
  } catch (error) {
    console.error("Errore eliminazione richiesta utente", error);
    setError?.(`Non riesco a eliminare la richiesta utente. ${error?.message || error}`);
  }
};

/* V140 - Mobile Home a blocchi. Desktop invariato: il rendering e visibile solo via CSS mobile. */
function getMobileHomeActiveListingsCountV140(seasonId) {
  if (typeof getActiveTransferListingsV119 === "function") return getActiveTransferListingsV119(seasonId).length;
  return (state.raw?.transferListings || []).filter((listing) => (
    (!seasonId || listing.seasonId === seasonId)
    && String(listing.status || "ACTIVE").toUpperCase() === "ACTIVE"
  )).length;
}

function getMobileHomePendingNegotiationsCountV140() {
  const currentTeamId = typeof getApprovedSeasonTeamIdV119 === "function" ? getApprovedSeasonTeamIdV119() : "";
  return (state.raw?.transferNegotiations || []).filter((item) => {
    if (String(item.status || "").toUpperCase() !== "PENDING") return false;
    if (!currentTeamId) return state.isAdmin;
    return item.fromSeasonTeamId === currentTeamId || item.toSeasonTeamId === currentTeamId;
  }).length;
}

function getMobileHomeNextMatchV140(seasonId) {
  const competitions = typeof getSeasonCompetitionsForPublicDisplayV52 === "function"
    ? getSeasonCompetitionsForPublicDisplayV52(seasonId)
    : (state.raw?.competitions || []).filter((competition) => competition.seasonId === seasonId);

  for (const competition of competitions) {
    const matches = (typeof isRankingCompetition === "function" && isRankingCompetition(competition))
      ? (typeof getNextChampionshipMatches === "function" ? getNextChampionshipMatches(competition) : [])
      : (typeof getCupScheduleMatches === "function" ? getCupScheduleMatches(competition) : []);
    if (matches?.length) {
      const sorted = typeof sortMatchesForDisplay === "function" ? sortMatchesForDisplay(matches) : matches;
      return { competition, match: sorted[sorted.length - 1] || sorted[0] };
    }
  }
  return { competition: null, match: null };
}

function getMobileHomeMatchTextV140(match) {
  if (!match) return "Nessuna partita programmata";
  const home = getSeasonTeamDisplayName(match.homeSeasonTeamId) || match.homeTeamName || "Casa";
  const away = getSeasonTeamDisplayName(match.awaySeasonTeamId) || match.awayTeamName || "Trasferta";
  return `${home} - ${away}`;
}

function getMobileHomeMatchMetaV140(match) {
  if (!match) return "";
  const date = typeof formatDashboardMatchDateLabelV136 === "function" ? formatDashboardMatchDateLabelV136(match) : (match.matchDate || match.date || "");
  const serieA = typeof formatDashboardSerieALabelV136 === "function" ? formatDashboardSerieALabelV136(match) : "";
  return [date, serieA].filter(Boolean).join(" · ");
}

function getMobileHomeLatestNewsV140() {
  if (typeof getVisibleNewsForSeasonV79 === "function") return getVisibleNewsForSeasonV79(1)[0] || null;
  const seasonId = getCurrentSeasonId();
  return (state.raw?.news || []).filter((item) => !item.seasonId || item.seasonId === seasonId)[0] || null;
}

function renderMobileHomeActionV140(label, page, extraClass = "") {
  return `<button class="button button-secondary button-small mobile-home-action ${escapeHtml(extraClass)}" type="button" data-v42-page-link="${escapeHtml(page)}">${escapeHtml(label)}</button>`;
}

function renderMobileHomeCardV140({ icon, kicker, title, description, value, primary = false, actions = [] }) {
  return `
    <article class="mobile-home-card ${primary ? "is-primary" : ""}">
      <span class="mobile-home-icon" aria-hidden="true">${icon}</span>
      <div class="mobile-home-content">
        <span class="mobile-home-kicker">${escapeHtml(kicker)}</span>
        <h3>${escapeHtml(title)}</h3>
        ${value ? `<strong class="mobile-home-value">${escapeHtml(value)}</strong>` : ""}
        <p>${escapeHtml(description)}</p>
      </div>
      ${actions.length ? `<div class="mobile-home-action-row">${actions.join("")}</div>` : ""}
    </article>`;
}

function renderMobileBlockDashboardV140() {
  const target = document.getElementById("mobileHomeBlocks");
  if (!target) return;

  const seasonId = getCurrentSeasonId();
  const activeCompetitions = (typeof getSeasonCompetitionsForPublicDisplayV52 === "function" ? getSeasonCompetitionsForPublicDisplayV52(seasonId) : [])
    .filter((competition) => String(competition.status || "").toUpperCase() === "ATTIVA");
  const { competition: nextCompetition, match: nextMatch } = getMobileHomeNextMatchV140(seasonId);
  const latestNews = getMobileHomeLatestNewsV140();
  const currentTeamId = typeof getApprovedSeasonTeamIdV119 === "function" ? getApprovedSeasonTeamIdV119() : "";
  const currentTeamName = currentTeamId ? getSeasonTeamDisplayName(currentTeamId) : "Accedi come presidente";
  const rosterCount = currentTeamId && typeof getRosterCountV119 === "function" ? getRosterCountV119(currentTeamId) : 0;
  const fmBalance = currentTeamId && typeof getTeamFmBalance === "function" ? getTeamFmBalance(currentTeamId) : null;
  const alerts = document.getElementById("metricAlerts")?.textContent?.trim() || "0";
  const alertReason = document.getElementById("metricAlertsReason")?.textContent?.trim() || "Nessun alert.";
  const listingsCount = getMobileHomeActiveListingsCountV140(seasonId);
  const negotiationsCount = getMobileHomePendingNegotiationsCountV140();
  const matchMeta = getMobileHomeMatchMetaV140(nextMatch);
  const matchValue = nextCompetition
    ? `${getCompetitionPublicDisplayNameV110?.(nextCompetition) || getCompetitionDisplayNameV111?.(nextCompetition) || nextCompetition.name || "Competizione"}${matchMeta ? ` · ${matchMeta}` : ""}`
    : "Calendario aggiornato";

  target.innerHTML = [
    renderMobileHomeCardV140({
      icon: "⚠️",
      kicker: "Alert",
      title: `${alerts} da controllare`,
      value: alertReason.replace(/^Motivo:\s*/i, ""),
      description: "Stato rapido della stagione e delle competizioni attive.",
      primary: Number(alerts) > 0,
      actions: [renderMobileHomeActionV140("Vai alla dashboard", "dashboard")]
    }),
    renderMobileHomeCardV140({
      icon: "🏆",
      kicker: "Competizioni",
      title: "Prossime partite",
      value: getMobileHomeMatchTextV140(nextMatch),
      description: activeCompetitions.length ? `${activeCompetitions.length} competizioni attive nella stagione.` : "Consulta calendari, classifiche e risultati.",
      primary: true,
      actions: [renderMobileHomeActionV140("Apri competizioni", "competitions")]
    }),
    renderMobileHomeCardV140({
      icon: "🔁",
      kicker: "Fantamercato",
      title: "Mercato e trattative",
      value: `${listingsCount} trasferibili · ${negotiationsCount} trattative aperte`,
      description: "Guarda i giocatori sul mercato e invia una proposta.",
      actions: [renderMobileHomeActionV140("Vai al mercato", "fantamercato"), renderMobileHomeActionV140("Trattative", "teamarea")]
    }),
    renderMobileHomeCardV140({
      icon: "👥",
      kicker: "Area squadra",
      title: currentTeamName,
      value: currentTeamId ? `${rosterCount}/30 giocatori${fmBalance !== null ? ` · ${formatFm(fmBalance)}` : ""}` : "Login presidente richiesto",
      description: currentTeamId ? "Gestisci rosa, comunicati, proposte e giocatori trasferibili." : "Accedi per usare trattative e funzioni presidente.",
      actions: [renderMobileHomeActionV140(currentTeamId ? "Apri area squadra" : "Accedi", currentTeamId ? "teamarea" : "dashboard")]
    }),
    renderMobileHomeCardV140({
      icon: "📋",
      kicker: "Listone",
      title: "Cerca giocatori",
      value: "Quotazioni, ruoli e stato",
      description: "Apri il listone per consultare rapidamente i giocatori.",
      actions: [renderMobileHomeActionV140("Apri listone", "listone")]
    }),
    renderMobileHomeCardV140({
      icon: "📰",
      kicker: "Comunicati",
      title: latestNews?.title || "Ultime news",
      value: latestNews ? (typeof formatNewsDateTimeV79 === "function" ? formatNewsDateTimeV79(getNewsRawDateValueV79(latestNews)) : "") : "Nessun comunicato recente",
      description: "Leggi comunicati ufficiali e aggiornamenti della lega.",
      actions: [renderMobileHomeActionV140("Leggi comunicati", "news")]
    })
  ].join("");
}

const renderDashboardBeforeV140 = renderDashboard;
renderDashboard = function renderDashboardV140() {
  const result = renderDashboardBeforeV140();
  renderMobileBlockDashboardV140();
  return result;
};

const loadTransferMarketCollectionsBeforeV140 = loadTransferMarketCollectionsV119;
loadTransferMarketCollectionsV119 = async function loadTransferMarketCollectionsV140() {
  const result = await loadTransferMarketCollectionsBeforeV140();
  renderMobileBlockDashboardV140();
  return result;
};

/* V141 - Mobile UI unificata: bottom navigation e Fantamercato a card. Desktop invariato via CSS. */
function updateMobileNavStateV141() {
  const directMobilePages = new Set(["dashboard", "teamarea", "fantamercato", "competitions"]);
  const moreButton = document.getElementById("mobileMoreBtn");
  moreButton?.classList.toggle("active", !directMobilePages.has(state.currentPage));
}
updateMobileNavState = updateMobileNavStateV141;

function ensureTransferMarketMobileCardsV141() {
  const panel = document.querySelector('.transfer-market-panel');
  const tableWrap = panel?.querySelector('.transfer-market-table-wrap');
  if (!panel || !tableWrap) return null;
  let target = document.getElementById('transferMarketMobileCards');
  if (!target) {
    target = document.createElement('div');
    target.id = 'transferMarketMobileCards';
    target.className = 'mobile-transfer-card-list';
    tableWrap.insertAdjacentElement('afterend', target);
  }
  return target;
}

function getTransferMarketFilteredRowsV141() {
  const seasonId = getCurrentSeasonId();
  const listings = typeof getActiveTransferListingsV119 === 'function'
    ? getActiveTransferListingsV119(seasonId)
    : (state.raw?.transferListings || []).filter((listing) => (
      (!seasonId || listing.seasonId === seasonId)
      && String(listing.status || 'ACTIVE').toUpperCase() === 'ACTIVE'
    ));
  const teamFilter = document.getElementById('transferMarketTeamFilter');
  const searchInput = document.getElementById('transferMarketSearch');
  const selectedTeam = state.transferMarketTeamFilterV119 || teamFilter?.value || 'all';
  const search = normalizeKey(state.transferMarketSearchV119 || searchInput?.value || '');
  return listings
    .filter((listing) => selectedTeam === 'all' || listing.seasonTeamId === selectedTeam)
    .filter((listing) => {
      if (!search) return true;
      return normalizeKey([
        listing.playerName,
        listing.teamName,
        getSeasonTeamDisplayName(listing.seasonTeamId),
        listing.realTeam,
        listing.rosterRole,
        listing.conditions
      ].join(' ')).includes(search);
    })
    .sort((a, b) => String(a.playerName || '').localeCompare(String(b.playerName || ''), 'it', { sensitivity: 'base' }));
}

function renderTransferMarketMobileCardsV141() {
  const target = ensureTransferMarketMobileCardsV141();
  if (!target) return;
  if (!state.transferMarketLoadedV119 && state.transferMarketLoadingV119) {
    target.innerHTML = '<p class="muted center">Caricamento fantamercato...</p>';
    return;
  }
  const rows = getTransferMarketFilteredRowsV141();
  if (!rows.length) {
    target.innerHTML = '<p class="muted center">Nessun giocatore trasferibile per questa stagione.</p>';
    return;
  }
  target.innerHTML = rows.map((listing) => {
    const own = typeof isOwnSeasonTeamV119 === 'function' && isOwnSeasonTeamV119(listing.seasonTeamId);
    const actionHtml = own
      ? `<button class="button button-secondary button-small" type="button" data-transfer-edit-listing="${escapeHtml(listing.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-transfer-remove-listing="${escapeHtml(listing.id)}">Togli</button>`
      : `<button class="button button-primary button-small" type="button" data-transfer-propose-listing="${escapeHtml(listing.id)}">Fai proposta</button>`;
    return `
      <article class="mobile-transfer-card">
        <div class="mobile-transfer-card-header">
          <div class="mobile-transfer-card-title">
            <h3>${escapeHtml(listing.playerName || '-')}</h3>
            <div>${renderSeasonTeamNameWithLogo(listing.seasonTeamId, { strong: false })}</div>
          </div>
          <span class="status status-transfermarket">TRASF</span>
        </div>
        <div class="mobile-transfer-card-meta">
          <span>${escapeHtml(listing.rosterRole || '-')}</span>
          <span>${escapeHtml(listing.realTeam || '-')}</span>
          <span>Costo ${formatListoneNumber(listing.cost)}</span>
        </div>
        <div class="mobile-transfer-card-conditions"><strong>Cerca:</strong> ${escapeHtml(listing.conditions || 'Condizioni non specificate.')}</div>
        <div class="mobile-transfer-card-actions">${actionHtml}</div>
      </article>`;
  }).join('');
}

const renderTransferMarketPageBeforeV141 = renderTransferMarketPageV119;
renderTransferMarketPageV119 = function renderTransferMarketPageV141() {
  const result = renderTransferMarketPageBeforeV141();
  renderTransferMarketMobileCardsV141();
  return result;
};

const renderAllBeforeV141 = renderAll;
renderAll = function renderAllV141() {
  const result = renderAllBeforeV141();
  updateMobileNavStateV141();
  renderTransferMarketMobileCardsV141();
  return result;
};


/* V142 - Mobile UI role-aware: admin senza squadra e accesso a tutte le rose. */
function getMobileCurrentSeasonTeamsCountV142(seasonId) {
  return (state.raw?.seasonTeams || []).filter((team) => !seasonId || team.seasonId === seasonId).length;
}

function getMobileRoleDestinationV142() {
  const currentTeamId = typeof getApprovedSeasonTeamIdV119 === "function" ? getApprovedSeasonTeamIdV119() : "";
  if (currentTeamId) {
    return { page: "teamarea", icon: "👥", label: "Squadra", title: "Area squadra" };
  }
  if (state.isAdmin) {
    return { page: "admin", icon: "🛠️", label: "Admin", title: "Admin" };
  }
  return { page: "clubs", icon: "👥", label: "Rose", title: "Rose" };
}

function syncMobileRoleNavigationV142() {
  const destination = getMobileRoleDestinationV142();
  const nav = document.querySelector(".mobile-bottom-nav-v141");
  const roleLink = nav?.querySelectorAll(".mobile-bottom-link[data-page-link]")?.[1];
  if (roleLink) {
    roleLink.href = `#${destination.page}`;
    roleLink.dataset.pageLink = destination.page;
    roleLink.innerHTML = `<span class="mobile-nav-icon">${destination.icon}</span><span>${escapeHtml(destination.label)}</span>`;
    roleLink.classList.toggle("active", state.currentPage === destination.page);
  }

  const roseLink = document.querySelector('#mobileMoreSheet [data-page-link="clubs"]');
  if (roseLink) roseLink.textContent = "Tutte le rose";

  updateMobileNavStateV142();
}

function updateMobileNavStateV142() {
  const bottomPages = new Set(Array.from(document.querySelectorAll(".mobile-bottom-nav-v141 [data-page-link]")).map((link) => link.dataset.pageLink));
  const moreButton = document.getElementById("mobileMoreBtn");
  moreButton?.classList.toggle("active", !bottomPages.has(state.currentPage));
}
updateMobileNavState = updateMobileNavStateV142;

function renderMobileBlockDashboardV142() {
  const target = document.getElementById("mobileHomeBlocks");
  if (!target) return;

  const seasonId = getCurrentSeasonId();
  const activeCompetitions = (typeof getSeasonCompetitionsForPublicDisplayV52 === "function" ? getSeasonCompetitionsForPublicDisplayV52(seasonId) : [])
    .filter((competition) => String(competition.status || "").toUpperCase() === "ATTIVA");
  const { competition: nextCompetition, match: nextMatch } = getMobileHomeNextMatchV140(seasonId);
  const latestNews = getMobileHomeLatestNewsV140();
  const currentTeamId = typeof getApprovedSeasonTeamIdV119 === "function" ? getApprovedSeasonTeamIdV119() : "";
  const currentTeamName = currentTeamId ? getSeasonTeamDisplayName(currentTeamId) : "";
  const rosterCount = currentTeamId && typeof getRosterCountV119 === "function" ? getRosterCountV119(currentTeamId) : 0;
  const fmBalance = currentTeamId && typeof getTeamFmBalance === "function" ? getTeamFmBalance(currentTeamId) : null;
  const alerts = document.getElementById("metricAlerts")?.textContent?.trim() || "0";
  const alertReason = document.getElementById("metricAlertsReason")?.textContent?.trim() || "Nessun alert.";
  const listingsCount = getMobileHomeActiveListingsCountV140(seasonId);
  const negotiationsCount = getMobileHomePendingNegotiationsCountV140();
  const matchMeta = getMobileHomeMatchMetaV140(nextMatch);
  const teamCount = getMobileCurrentSeasonTeamsCountV142(seasonId);
  const matchValue = nextCompetition
    ? `${getCompetitionPublicDisplayNameV110?.(nextCompetition) || getCompetitionDisplayNameV111?.(nextCompetition) || nextCompetition.name || "Competizione"}${matchMeta ? ` · ${matchMeta}` : ""}`
    : "Calendario aggiornato";

  const marketActions = [renderMobileHomeActionV140("Vai al mercato", "fantamercato")];
  if (currentTeamId) marketActions.push(renderMobileHomeActionV140("Trattative", "teamarea"));
  else if (state.isAdmin) marketActions.push(renderMobileHomeActionV140("Admin", "admin"));

  const roleCard = currentTeamId
    ? renderMobileHomeCardV140({
        icon: "👥",
        kicker: "Area squadra",
        title: currentTeamName,
        value: `${rosterCount}/30 giocatori${fmBalance !== null ? ` · ${formatFm(fmBalance)}` : ""}`,
        description: "Gestisci rosa, comunicati, proposte e giocatori trasferibili.",
        actions: [renderMobileHomeActionV140("Apri area squadra", "teamarea"), renderMobileHomeActionV140("Tutte le rose", "clubs")]
      })
    : state.isAdmin
      ? renderMobileHomeCardV140({
          icon: "🛠️",
          kicker: "Admin",
          title: "Pannello amministrazione",
          value: "Gestione lega",
          description: "L'admin non è legato a una squadra: usa il pannello Admin per gestire utenti, dati e snapshot.",
          actions: [renderMobileHomeActionV140("Apri Admin", "admin"), renderMobileHomeActionV140("Tutte le rose", "clubs")]
        })
      : renderMobileHomeCardV140({
          icon: "👥",
          kicker: "Rose",
          title: "Rose della lega",
          value: teamCount ? `${teamCount} squadre` : "Stagione corrente",
          description: "Consulta le rose e le schede delle squadre della stagione.",
          actions: [renderMobileHomeActionV140("Vedi tutte le rose", "clubs")]
        });

  const cards = [
    renderMobileHomeCardV140({
      icon: "⚠️",
      kicker: "Alert",
      title: `${alerts} da controllare`,
      value: alertReason.replace(/^Motivo:\s*/i, ""),
      description: "Stato rapido della stagione e delle competizioni attive.",
      primary: Number(alerts) > 0,
      actions: [renderMobileHomeActionV140("Vai alla dashboard", "dashboard")]
    }),
    renderMobileHomeCardV140({
      icon: "🏆",
      kicker: "Competizioni",
      title: "Prossime partite",
      value: getMobileHomeMatchTextV140(nextMatch),
      description: activeCompetitions.length ? `${activeCompetitions.length} competizioni attive nella stagione.` : "Consulta calendari, classifiche e risultati.",
      primary: true,
      actions: [renderMobileHomeActionV140("Apri competizioni", "competitions")]
    }),
    renderMobileHomeCardV140({
      icon: "🔁",
      kicker: "Fantamercato",
      title: "Mercato e trattative",
      value: `${listingsCount} trasferibili · ${negotiationsCount} trattative aperte`,
      description: currentTeamId ? "Guarda i giocatori sul mercato e invia una proposta." : "Consulta i giocatori trasferibili; le proposte sono riservate ai presidenti.",
      actions: marketActions
    }),
    roleCard
  ];

  if (currentTeamId || state.isAdmin) {
    cards.push(renderMobileHomeCardV140({
      icon: "👥",
      kicker: "Rose",
      title: "Tutte le rose",
      value: teamCount ? `${teamCount} squadre` : "Stagione corrente",
      description: "Ogni presidente può consultare tutte le rose della lega, non solo la propria.",
      actions: [renderMobileHomeActionV140("Apri rose", "clubs")]
    }));
  }

  cards.push(
    renderMobileHomeCardV140({
      icon: "📋",
      kicker: "Listone",
      title: "Cerca giocatori",
      value: "Quotazioni, ruoli e stato",
      description: "Apri il listone per consultare rapidamente i giocatori.",
      actions: [renderMobileHomeActionV140("Apri listone", "listone")]
    }),
    renderMobileHomeCardV140({
      icon: "📰",
      kicker: "Comunicati",
      title: latestNews?.title || "Ultime news",
      value: latestNews ? (typeof formatNewsDateTimeV79 === "function" ? formatNewsDateTimeV79(getNewsRawDateValueV79(latestNews)) : "") : "Nessun comunicato recente",
      description: "Leggi comunicati ufficiali e aggiornamenti della lega.",
      actions: [renderMobileHomeActionV140("Leggi comunicati", "news")]
    })
  );

  target.innerHTML = cards.join("");
  syncMobileRoleNavigationV142();
}
renderMobileBlockDashboardV140 = renderMobileBlockDashboardV142;

const renderAllBeforeV142 = renderAll;
renderAll = function renderAllV142() {
  const result = renderAllBeforeV142();
  syncMobileRoleNavigationV142();
  renderMobileBlockDashboardV142();
  return result;
};


/* V144 - Area squadra mobile operativa: hub azioni rapide e ritocchi solo mobile. */
function renderMobileTeamAreaHubV144(approved) {
  if (!approved?.seasonTeamId) return "";
  const seasonTeam = typeof getSeasonTeamById === "function" ? getSeasonTeamById(approved.seasonTeamId) : null;
  const teamName = getSeasonTeamDisplayName(approved.seasonTeamId) || approved.teamName || "La mia squadra";
  const presidentNames = typeof getSeasonTeamPresidentNames === "function" ? getSeasonTeamPresidentNames(seasonTeam) : (approved.presidentName || approved.displayName || "-");
  const rosterCount = typeof getRosterCountV119 === "function" ? getRosterCountV119(approved.seasonTeamId) : 0;
  const fmBalance = typeof getTeamFmBalance === "function" ? getTeamFmBalance(approved.seasonTeamId) : null;
  const pendingSent = (state.raw?.transferNegotiations || []).filter((item) => item.fromSeasonTeamId === approved.seasonTeamId && String(item.status || "PENDING").toUpperCase() === "PENDING").length;
  const pendingReceived = (state.raw?.transferNegotiations || []).filter((item) => item.toSeasonTeamId === approved.seasonTeamId && String(item.status || "PENDING").toUpperCase() === "PENDING").length;
  const listings = typeof getActiveTransferListingsV119 === "function" ? getActiveTransferListingsV119(getCurrentSeasonId()).filter((item) => item.seasonTeamId === approved.seasonTeamId).length : 0;

  return `
    <section id="mobileTeamAreaHubV144" class="mobile-teamarea-hub-v144" aria-label="Azioni rapide area squadra">
      <div class="mobile-teamarea-hero-v144 mobile-teamarea-hero-v167">
        <span class="mobile-teamarea-kicker-v144">Area squadra</span>
        <h3>${escapeHtml(teamName)}</h3>
        <p class="mobile-teamarea-president-v167">${escapeHtml(presidentNames || "-")}</p>
        <p>${escapeHtml(`${rosterCount}/30 giocatori${fmBalance !== null ? ` · ${formatFm(fmBalance)}` : ""}`)}</p>
        <button class="button button-secondary button-small mobile-teamarea-open-profile-v167" type="button" data-open-team-profile="${escapeHtml(approved.seasonTeamId)}">Apri pagina squadra</button>
      </div>
      <div class="mobile-teamarea-stats-v144">
        <span><strong>${escapeHtml(String(listings))}</strong><small>in vendita</small></span>
        <span><strong>${escapeHtml(String(pendingSent))}</strong><small>inviate</small></span>
        <span><strong>${escapeHtml(String(pendingReceived))}</strong><small>ricevute</small></span>
      </div>
      <div class="mobile-teamarea-actions-v144">
        <a class="mobile-teamarea-action-v144" href="#clubs" data-page-link="clubs"><span>👥</span><strong>Tutte le rose</strong><small>lega</small></a>
        <a class="mobile-teamarea-action-v144" href="#fantamercato" data-page-link="fantamercato"><span>🔁</span><strong>Mercato</strong><small>trasferibili</small></a>
        <button class="mobile-teamarea-action-v144" type="button" data-mobile-teamarea-scroll=".trade-proposal-panel"><span>✍️</span><strong>Proposta</strong><small>nuova trattativa</small></button>
        <button class="mobile-teamarea-action-v144" type="button" data-mobile-teamarea-scroll=".trade-list-panel"><span>🤝</span><strong>Trattative</strong><small>storico</small></button>
        <button class="mobile-teamarea-action-v144" type="button" data-mobile-teamarea-scroll="#teamNewsRequestForm"><span>📰</span><strong>Comunicato</strong><small>squadra</small></button>
      </div>
    </section>`;
}

function enhanceTeamAreaMobileV144() {
  const target = document.getElementById("teamAreaBody");
  if (!target) return;
  const old = document.getElementById("mobileTeamAreaHubV144");
  if (old) old.remove();
  const approved = getApprovedTeamUser?.();
  if (!state.user || !approved?.seasonTeamId) return;
  const summary = target.querySelector(".team-area-summary-panel");
  if (!summary) return;
  summary.insertAdjacentHTML("afterend", renderMobileTeamAreaHubV144(approved));
}

const renderUserAreaBeforeV144 = renderUserAreaV34;
renderUserAreaV34 = function renderUserAreaV144() {
  const result = renderUserAreaBeforeV144?.();
  enhanceTeamAreaMobileV144();
  return result;
};

const renderAllBeforeV144 = renderAll;
renderAll = function renderAllV144() {
  const result = renderAllBeforeV144();
  enhanceTeamAreaMobileV144();
  return result;
};

document.addEventListener("click", (event) => {
  const button = event.target.closest?.("[data-mobile-teamarea-scroll]");
  if (!button) return;
  event.preventDefault();
  const selector = button.dataset.mobileTeamareaScroll;
  const node = selector ? document.querySelector(selector) : null;
  if (!node) return;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
}, true);

/* V150 - Mobile Coppe: layout partite compatto nella sezione Competizioni.
   Desktop invariato: la lista mobile viene nascosta via CSS, mentre la tabella esistente resta visibile. */
function isPlayedMatchV150(match) {
  return String(match?.status || "").toUpperCase() === "GIOCATA" || hasMatchGoalsV114(match);
}

function formatMobileCupMatchMetaV150(match) {
  if (isPlayedMatchV150(match)) return renderMatchResultHtmlV114(match);
  const date = String(match?.matchDate || match?.date || "").trim();
  return escapeHtml(date || "Data da definire");
}

function renderMobileCupMatchCardsV150(matches, emptyText = "Nessuna partita inserita.") {
  const rows = Array.isArray(matches) ? matches : [];
  if (!rows.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
  return `
    <div class="mobile-cup-match-list-v150" aria-label="Partite mobile">
      ${rows.map((match) => `
        <div class="mobile-cup-match-row-v150 ${isPlayedMatchV150(match) ? "is-played" : "is-scheduled"}">
          <span class="mobile-cup-match-teams-v150">
            ${renderStaticMatchTeamNameV101(match, "home", { strong: false })}
            <span class="match-separator">-</span>
            ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}
          </span>
          <span class="mobile-cup-match-meta-v150">${formatMobileCupMatchMetaV150(match)}</span>
        </div>`).join("")}
    </div>`;
}

function renderCompetitionMatchRowsPublicV150(matches, emptyText = "Nessuna partita inserita.") {
  const rows = Array.isArray(matches) ? matches : [];
  return `
    <div class="competition-match-responsive-pack-v150">
      ${renderMobileCupMatchCardsV150(rows, emptyText)}
      ${renderMatchRowsNoStageV112(rows, emptyText)}
    </div>`;
}

renderCompetitionMatchesPublic = function renderCompetitionMatchesPublicV150(competition) {
  const matches = getCompetitionMatches(competition.id);
  if (!matches.length) return `<p class="muted">Nessuna partita inserita per questa competizione.</p>`;
  const groups = groupCompetitionMatchesByStageV113(matches, competition);
  return `
    <div class="competition-matches-public competition-match-groups competition-match-groups-v150">
      ${groups.map((group) => {
        const rows = sortMatchesInsideStageV111(group.matches);
        return `
          <details class="detail-section compact-detail-section competition-match-stage-group competition-match-stage-details" open>
            <summary class="competition-match-stage-summary">
              <h4>${escapeHtml(group.label)}</h4>
              <span class="button button-secondary button-small competition-stage-toggle-label" aria-hidden="true">Riduci/Espandi</span>
            </summary>
            ${renderCompetitionMatchRowsPublicV150(rows, "Nessuna partita inserita.")}
          </details>`;
      }).join("")}
    </div>`;
};

/* V151 - Hotfix mobile: dashboard senza alert, prossima partita robusta e Coppe risultato/data. */
function getMatchGoalsPairV151(match) {
  if (!match) return null;
  const homeKeys = ["homeGoals", "homeGoal", "homeResult", "homeGoalsFinal", "homeFinalGoals", "homeScoreGoals"];
  const awayKeys = ["awayGoals", "awayGoal", "awayResult", "awayGoalsFinal", "awayFinalGoals", "awayScoreGoals"];
  const readValue = (keys) => {
    for (const key of keys) {
      const value = match[key];
      if (value !== undefined && value !== null && value !== "") return value;
    }
    return null;
  };
  const home = readValue(homeKeys);
  const away = readValue(awayKeys);
  return home !== null && away !== null ? { home, away } : null;
}

function getMatchDateRawV151(match) {
  if (!match) return "";
  return String(match.matchDate || match.date || match.scheduledDate || match.playDate || match.kickoffDate || "").trim();
}

function parseMatchDateMsV151(match) {
  const raw = getMatchDateRawV151(match);
  if (!raw) return Number.POSITIVE_INFINITY;
  const normalized = raw.includes("/")
    ? raw.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4}).*$/, "$3-$2-$1")
    : raw;
  const time = Date.parse(normalized);
  return Number.isFinite(time) ? time : Number.POSITIVE_INFINITY;
}

function getMatchdaySortValueV151(match) {
  const values = [
    typeof getMatchSerieAMatchday === "function" ? getMatchSerieAMatchday(match) : null,
    match?.serieAMatchday,
    match?.serieAMatchDay,
    match?.leagueMatchday,
    match?.matchday,
    match?.giornata
  ];
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) return number;
  }
  return Number.POSITIVE_INFINITY;
}

function isPlayedMatchV151(match) {
  const status = String(match?.status || match?.matchStatus || "").trim().toUpperCase();
  const playedStatuses = new Set(["GIOCATA", "PLAYED", "FINISHED", "COMPLETED", "CONCLUSA", "DISPUTATA"]);
  if (playedStatuses.has(status)) return true;
  if (match?.played === true || match?.isPlayed === true || match?.finished === true) return true;
  return !!getMatchGoalsPairV151(match);
}

function isCancelledMatchV151(match) {
  const status = String(match?.status || match?.matchStatus || "").trim().toUpperCase();
  return ["CANCELLED", "CANCELED", "ANNULLATA", "RINVIATA", "DELETED"].includes(status) || match?.deleted === true;
}

function getCompetitionDisplayForMobileHomeV151(competition) {
  return getCompetitionPublicDisplayNameV110?.(competition)
    || getCompetitionDisplayNameV111?.(competition)
    || competition?.name
    || competition?.competitionName
    || "Competizione";
}

function getMobileHomeNextMatchV151(seasonId) {
  const competitions = typeof getSeasonCompetitionsForPublicDisplayV52 === "function"
    ? getSeasonCompetitionsForPublicDisplayV52(seasonId)
    : (state.raw?.competitions || []).filter((competition) => competition.seasonId === seasonId);
  const candidates = [];
  competitions.forEach((competition, competitionIndex) => {
    const status = String(competition?.status || "").toUpperCase();
    if (["NON_DISPUTATA", "ANNULLATA"].includes(status)) return;
    let matches = [];
    if (typeof getCompetitionMatches === "function") {
      matches = getCompetitionMatches(competition.id || competition.competitionId || competition.uid) || [];
    }
    if (!matches.length && typeof isRankingCompetition === "function" && isRankingCompetition(competition) && typeof getNextChampionshipMatches === "function") {
      matches = getNextChampionshipMatches(competition) || [];
    }
    if (!matches.length && typeof getCupScheduleMatches === "function") {
      matches = getCupScheduleMatches(competition) || [];
    }
    matches
      .filter((match) => match && !isCancelledMatchV151(match) && !isPlayedMatchV151(match))
      .forEach((match) => {
        candidates.push({
          competition,
          match,
          competitionIndex,
          dateMs: parseMatchDateMsV151(match),
          matchday: getMatchdaySortValueV151(match),
          id: String(match.id || match.uid || "")
        });
      });
  });
  if (!candidates.length) return { competition: null, match: null };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const future = candidates.filter((item) => Number.isFinite(item.dateMs) && item.dateMs >= today.getTime());
  const pool = future.length ? future : candidates;
  pool.sort((a, b) => {
    const dateDiff = a.dateMs - b.dateMs;
    if (Number.isFinite(dateDiff) && dateDiff !== 0) return dateDiff;
    const matchdayDiff = a.matchday - b.matchday;
    if (Number.isFinite(matchdayDiff) && matchdayDiff !== 0) return matchdayDiff;
    if (a.competitionIndex !== b.competitionIndex) return a.competitionIndex - b.competitionIndex;
    return a.id.localeCompare(b.id);
  });
  const first = pool[0];
  return { competition: first.competition, match: first.match };
}

getMobileHomeNextMatchV140 = getMobileHomeNextMatchV151;

function formatMobileCupMatchMetaV151(match) {
  if (isPlayedMatchV151(match)) {
    const pair = getMatchGoalsPairV151(match);
    if (pair) return `<strong class="match-result-goals">${escapeHtml(pair.home)}-${escapeHtml(pair.away)}</strong>`;
    return `<strong class="match-result-goals">Giocata</strong>`;
  }
  const date = getMatchDateRawV151(match);
  if (date) return escapeHtml(date);
  const serieA = typeof formatDashboardSerieALabelV136 === "function" ? formatDashboardSerieALabelV136(match) : "";
  return escapeHtml(serieA || "Data da definire");
}

isPlayedMatchV150 = isPlayedMatchV151;
formatMobileCupMatchMetaV150 = formatMobileCupMatchMetaV151;

function removeMobileAlertCardV151() {
  const target = document.getElementById("mobileHomeBlocks");
  if (!target) return;
  target.querySelectorAll(".mobile-home-card").forEach((card) => {
    const kicker = card.querySelector(".mobile-home-kicker")?.textContent?.trim().toLowerCase() || "";
    if (kicker === "alert") card.remove();
  });
}

const renderMobileBlockDashboardBeforeV151 = renderMobileBlockDashboardV140;
renderMobileBlockDashboardV140 = function renderMobileBlockDashboardV151() {
  const result = renderMobileBlockDashboardBeforeV151?.();
  removeMobileAlertCardV151();
  return result;
};

const renderAllBeforeV151 = renderAll;
renderAll = function renderAllV151() {
  const result = renderAllBeforeV151();
  removeMobileAlertCardV151();
  return result;
};


/* V152 - Hotfix mobile: Rose senza barra laterale riga e Coppe con risultato per partite giocate. */
function getMatchResultTextV152(match) {
  if (!match) return "";
  const candidateKeys = ["result", "score", "finalResult", "matchResult", "goals", "risultato"];
  for (const key of candidateKeys) {
    const value = match[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      const text = String(value).trim();
      if (/\d+\s*[-–:]\s*\d+/.test(text)) return text.replace(/[–:]/g, "-").replace(/\s+/g, "");
    }
  }
  const pair = typeof getMatchGoalsPairV151 === "function" ? getMatchGoalsPairV151(match) : null;
  if (pair) return `${pair.home}-${pair.away}`;
  const homeKeys = ["homeGoals", "homeGoal", "homeResult", "homeGoalsFinal", "homeFinalGoals", "homeScoreGoals", "home_score_goals", "goalsHome"];
  const awayKeys = ["awayGoals", "awayGoal", "awayResult", "awayGoalsFinal", "awayFinalGoals", "awayScoreGoals", "away_score_goals", "goalsAway"];
  const readValue = (keys) => {
    for (const key of keys) {
      const value = match[key];
      if (value !== undefined && value !== null && String(value).trim() !== "") return String(value).trim();
    }
    return "";
  };
  const home = readValue(homeKeys);
  const away = readValue(awayKeys);
  return home && away ? `${home}-${away}` : "";
}

function isPlayedMatchV152(match) {
  const status = String(match?.status || match?.matchStatus || match?.state || "").trim().toUpperCase();
  const playedStatuses = new Set(["GIOCATA", "PLAYED", "FINISHED", "COMPLETED", "CONCLUSA", "DISPUTATA", "FINAL", "ENDED"]);
  if (playedStatuses.has(status)) return true;
  if (match?.played === true || match?.isPlayed === true || match?.finished === true || match?.completed === true) return true;
  return Boolean(getMatchResultTextV152(match));
}

function formatMobileCupMatchMetaV152(match) {
  if (isPlayedMatchV152(match)) {
    const result = getMatchResultTextV152(match);
    return `<strong class="match-result-goals">${escapeHtml(result || "Giocata")}</strong>`;
  }
  const date = typeof getMatchDateRawV151 === "function" ? getMatchDateRawV151(match) : String(match?.matchDate || match?.date || "").trim();
  if (date) return escapeHtml(date);
  const serieA = typeof formatDashboardSerieALabelV136 === "function" ? formatDashboardSerieALabelV136(match) : "";
  return escapeHtml(serieA || "Data da definire");
}

isPlayedMatchV150 = isPlayedMatchV152;
formatMobileCupMatchMetaV150 = formatMobileCupMatchMetaV152;

/* V153 - Mobile Coppe: partite con squadre su due righe, data e risultato sempre visibili. */
function formatMobileCupDateV153(match) {
  const raw = typeof getMatchDateRawV151 === "function"
    ? getMatchDateRawV151(match)
    : String(match?.matchDate || match?.date || match?.scheduledDate || "").trim();
  return raw || "Data da definire";
}

function formatMobileCupResultV153(match) {
  const result = typeof getMatchResultTextV152 === "function" ? getMatchResultTextV152(match) : "";
  if (result) return result;
  const played = typeof isPlayedMatchV152 === "function" ? isPlayedMatchV152(match) : isPlayedMatchV150(match);
  return played ? "Risultato non inserito" : "Da disputare";
}

renderMobileCupMatchCardsV150 = function renderMobileCupMatchCardsV153(matches, emptyText = "Nessuna partita inserita.") {
  const rows = Array.isArray(matches) ? matches : [];
  if (!rows.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
  return `
    <div class="mobile-cup-match-list-v150 mobile-cup-match-list-v153" aria-label="Partite mobile">
      ${rows.map((match) => {
        const played = typeof isPlayedMatchV152 === "function" ? isPlayedMatchV152(match) : isPlayedMatchV150(match);
        const date = formatMobileCupDateV153(match);
        const result = formatMobileCupResultV153(match);
        return `
          <div class="mobile-cup-match-row-v150 mobile-cup-match-row-v153 ${played ? "is-played" : "is-scheduled"}">
            <div class="mobile-cup-match-teams-v150 mobile-cup-match-teams-v153">
              <div class="mobile-cup-team-line-v153 mobile-cup-team-home-v153">
                ${renderStaticMatchTeamNameV101(match, "home", { strong: false })}
              </div>
              <div class="mobile-cup-team-line-v153 mobile-cup-team-away-v153">
                ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}
              </div>
            </div>
            <div class="mobile-cup-match-meta-v150 mobile-cup-match-meta-v153">
              <span class="mobile-cup-date-v153">${escapeHtml(date)}</span>
              <strong class="mobile-cup-result-v153 ${played ? "match-result-goals" : "is-pending"}">${escapeHtml(result)}</strong>
            </div>
          </div>`;
      }).join("")}
    </div>`;
};


/* V154 - Mobile Competizioni: tabella compatta Partita/Data/Risultato.
   Vale sia nella sezione Competizioni sia come struttura riusabile per la pagina singola. */
function formatMobileCupDateV154(match) {
  const raw = typeof getMatchDateRawV151 === "function"
    ? getMatchDateRawV151(match)
    : String(match?.matchDate || match?.date || match?.scheduledDate || match?.playDate || "").trim();
  return raw || "-";
}

function formatMobileCupResultV154(match) {
  const result = typeof getMatchResultTextV152 === "function" ? getMatchResultTextV152(match) : "";
  return result || "-";
}

renderMobileCupMatchCardsV150 = function renderMobileCupMatchTableV154(matches, emptyText = "Nessuna partita inserita.") {
  const rows = Array.isArray(matches) ? matches : [];
  if (!rows.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
  return `
    <div class="mobile-cup-match-table-v154" role="table" aria-label="Partite mobile">
      <div class="mobile-cup-match-head-v154" role="row">
        <span role="columnheader">Partita</span>
        <span role="columnheader">Data</span>
        <span role="columnheader">Ris.</span>
      </div>
      ${rows.map((match) => {
        const played = typeof isPlayedMatchV152 === "function" ? isPlayedMatchV152(match) : isPlayedMatchV150(match);
        return `
          <div class="mobile-cup-match-row-v154 ${played ? "is-played" : "is-scheduled"}" role="row">
            <div class="mobile-cup-match-cell-v154 mobile-cup-match-teams-cell-v154" role="cell" data-label="Partita">
              <div class="mobile-cup-team-line-v154 mobile-cup-team-home-v154">
                ${renderStaticMatchTeamNameV101(match, "home", { strong: false })}
              </div>
              <div class="mobile-cup-team-line-v154 mobile-cup-team-away-v154">
                ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}
              </div>
            </div>
            <div class="mobile-cup-match-cell-v154 mobile-cup-date-cell-v154" role="cell" data-label="Data">${escapeHtml(formatMobileCupDateV154(match))}</div>
            <div class="mobile-cup-match-cell-v154 mobile-cup-result-cell-v154 ${played ? "match-result-goals" : ""}" role="cell" data-label="Ris.">${escapeHtml(formatMobileCupResultV154(match))}</div>
          </div>`;
      }).join("")}
    </div>`;
};

/* V155 - Mobile Competizioni: schermata a blocchi cliccabili, desktop invariato. */
function isMobileCompetitionStatusActiveV155(competition) {
  return String(competition?.status || "").trim().toUpperCase() === "ATTIVA";
}

function getCompetitionMatchesForMobileBlockV155(competition) {
  if (!competition) return [];
  if (typeof getCompetitionMatches === "function") {
    const matches = getCompetitionMatches(competition.id) || [];
    if (matches.length) return matches;
  }
  if (Array.isArray(competition.matches)) return competition.matches;
  if (Array.isArray(competition.calendar)) return competition.calendar;
  return [];
}

function getMobileCompetitionNextScheduledMatchV155(competition) {
  const matches = getCompetitionMatchesForMobileBlockV155(competition)
    .filter((match) => match && !(typeof isCancelledMatchV151 === "function" && isCancelledMatchV151(match)))
    .filter((match) => !(typeof isPlayedMatchV152 === "function" ? isPlayedMatchV152(match) : isPlayedMatchV150(match)));

  if (!matches.length) return null;

  return [...matches].sort((a, b) => {
    const aDate = typeof parseMatchDateMsV151 === "function" ? parseMatchDateMsV151(a) : Date.parse(a?.matchDate || a?.date || "");
    const bDate = typeof parseMatchDateMsV151 === "function" ? parseMatchDateMsV151(b) : Date.parse(b?.matchDate || b?.date || "");
    const aFinite = Number.isFinite(aDate);
    const bFinite = Number.isFinite(bDate);
    if (aFinite && bFinite && aDate !== bDate) return aDate - bDate;
    if (aFinite && !bFinite) return -1;
    if (!aFinite && bFinite) return 1;

    const aMatchday = typeof getMatchdaySortValueV151 === "function" ? getMatchdaySortValueV151(a) : Number(a?.leagueMatchday || a?.serieAMatchday || 9999);
    const bMatchday = typeof getMatchdaySortValueV151 === "function" ? getMatchdaySortValueV151(b) : Number(b?.leagueMatchday || b?.serieAMatchday || 9999);
    if (Number.isFinite(aMatchday) && Number.isFinite(bMatchday) && aMatchday !== bMatchday) return aMatchday - bMatchday;
    return String(a?.id || "").localeCompare(String(b?.id || ""));
  })[0] || null;
}

function getMobileCompetitionMatchDateV155(match) {
  const raw = typeof getMatchDateRawV151 === "function"
    ? getMatchDateRawV151(match)
    : String(match?.matchDate || match?.date || match?.scheduledDate || match?.playDate || "").trim();
  return raw || "Data da definire";
}

function renderMobileCompetitionNextMatchV155(competition) {
  if (!isMobileCompetitionStatusActiveV155(competition)) return "";
  const match = getMobileCompetitionNextScheduledMatchV155(competition);
  if (!match) {
    return `<p class="mobile-competition-block-next-v155 muted">Nessuna prossima partita programmata.</p>`;
  }
  return `
    <div class="mobile-competition-block-next-v155">
      <span class="mobile-competition-next-label-v155">Prossima partita</span>
      <span class="mobile-competition-next-teams-v155">
        ${renderStaticMatchTeamNameV101(match, "home", { strong: false })}
        <span class="match-separator">-</span>
        ${renderStaticMatchTeamNameV101(match, "away", { strong: false })}
      </span>
      <span class="mobile-competition-next-date-v155">${escapeHtml(getMobileCompetitionMatchDateV155(match))}</span>
    </div>`;
}

function renderMobileCompetitionBlockV155(competition) {
  const name = typeof getCompetitionDisplayNameV111 === "function"
    ? getCompetitionDisplayNameV111(competition)
    : (competition?.name || competition?.competitionName || "Competizione");
  const statusText = getLabel(COMPETITION_STATUSES, competition?.status) || competition?.status || "-";
  const url = typeof getCompetitionOpenUrlV111 === "function" ? getCompetitionOpenUrlV111(competition) : "./competition.html";
  const activeClass = isMobileCompetitionStatusActiveV155(competition) ? " is-active" : "";
  return `
    <a class="mobile-competition-block-v155${activeClass}" href="${escapeHtml(url)}" aria-label="Apri ${escapeHtml(name)}">
      <div class="mobile-competition-block-head-v155">
        <h3>${escapeHtml(name)}</h3>
        <span class="status ${getCompetitionStatusClass(competition?.status)}">${escapeHtml(statusText)}</span>
      </div>
      ${renderMobileCompetitionNextMatchV155(competition)}
      <span class="mobile-competition-open-v155">Apri competizione →</span>
    </a>`;
}

function renderDesktopCompetitionCardV155(competition) {
  return `
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
    </article>`;
}

renderCompetitionsPublic = function renderCompetitionsPublicV155() {
  const list = document.getElementById("competitionsList");
  if (!list) return;

  const seasonId = getCurrentSeasonId();
  const competitions = getSeasonCompetitionsForPublicDisplayV52(seasonId);

  if (!competitions.length) {
    list.innerHTML = `<p class="muted">Nessuna competizione inserita per ${escapeHtml(seasonId || "la stagione selezionata")}.</p>`;
    return;
  }

  list.innerHTML = `
    <div class="mobile-competition-blocks-v155" aria-label="Competizioni mobile">
      ${competitions.map((competition) => renderMobileCompetitionBlockV155(competition)).join("")}
    </div>
    <div class="desktop-competition-list-v155">
      ${competitions.map((competition) => renderDesktopCompetitionCardV155(competition)).join("")}
    </div>`;
};

/* V169 - Mobile roster/date helpers extracted to js/mobile/mobile-rosters.js. */
const mobileRosterHelpersV169 = createMobileRosterHelpersV169({
  state,
  escapeHtml,
  formatFm,
  formatStadium,
  getRosterForSeasonTeam,
  getSeasonTeamDisplayName,
  getSeasonTeamLogo,
  getSeasonTeamPresidentNames,
  getStadiumForSeasonTeam,
  getTeamDisplayName,
  getTeamFmBalance,
  renderPresidentStack,
  renderRosterPlayerTable,
  renderSeasonTeamNameWithLogo,
  renderTeamLogo
});
const {
  formatCompactMobileDateV156,
  isMobileDateFormattingEnabledV156,
  applyMobileCompactDatesV156,
  renderMobileRosterSelectBlockV156,
  renderMobileRosterSelectedDetailsV156,
  renderDesktopRosterTableV156,
  renderMobileRosterSelectorV156
} = mobileRosterHelpersV169;

const renderTeamsTableBeforeV156 = renderTeamsTable;
renderTeamsTable = function renderTeamsTableV156() {
  const cards = document.getElementById("rosterClubCards");
  const legacyTableBody = document.getElementById("clubsTableBody");
  const seasonId = getCurrentSeasonId();
  const seasonTeams = getSeasonTeamsForSeason(seasonId);
  const { teamsById } = buildMaps();

  if (!cards) return renderTeamsTableBeforeV156();

  if (!seasonTeams.length) {
    const empty = `<p class="muted">Nessuna squadra associata a ${escapeHtml(seasonId || "questa stagione")}.</p>`;
    cards.innerHTML = empty;
    if (legacyTableBody) legacyTableBody.innerHTML = `<tr><td colspan="7" class="muted center">Nessuna squadra associata a ${escapeHtml(seasonId || "questa stagione")}.</td></tr>`;
    return;
  }

  cards.classList.add("roster-table-container", "roster-table-container-v156");
  cards.innerHTML = `
    ${renderMobileRosterSelectorV156(seasonTeams, teamsById)}
    ${renderDesktopRosterTableV156(seasonTeams, teamsById)}`;

  if (legacyTableBody) {
    legacyTableBody.innerHTML = seasonTeams.map((seasonTeam, index) => {
      const team = teamsById.get(seasonTeam.teamId);
      const displayName = seasonTeam.name || getTeamDisplayName(team);
      const balance = getTeamFmBalance(seasonTeam.id);
      const roster = getRosterForSeasonTeam(seasonTeam);
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${renderSeasonTeamNameWithLogo(seasonTeam.id)}</td>
          <td>${renderPresidentStack(getSeasonTeamPresidentNames(seasonTeam))}</td>
          <td class="number"><strong>${escapeHtml(formatFm(balance))}</strong></td>
          <td class="number">${escapeHtml(roster?.playerCount ?? 0)}</td>
          <td>${escapeHtml(displayName || "-")}</td>
        </tr>`;
    }).join("");
  }
};

const renderAllBeforeV156 = renderAll;
renderAll = function renderAllV156() {
  const result = renderAllBeforeV156();
  window.requestAnimationFrame(() => applyMobileCompactDatesV156(document.querySelector("main") || document.body));
  return result;
};

window.addEventListener("load", () => {
  window.requestAnimationFrame(() => applyMobileCompactDatesV156(document.querySelector("main") || document.body));
});

/* V162 - Mobile: card Albo/Palmares, label Ris. robusta e rose piu bilanciate. */
function isMobileUxActiveV162() {
  return document.body?.classList.contains("is-mobile-ux")
    || window.matchMedia?.("(max-width: 900px), (hover: none) and (pointer: coarse)").matches;
}

function ensureMobileHonorHomeCardV162() {
  const target = document.getElementById("mobileHomeBlocks");
  if (!target || !isMobileUxActiveV162()) return;
  if (target.querySelector('[data-mobile-home-card="honor"]')) return;
  const cardHtml = renderMobileHomeCardV140({
    icon: "🏅",
    kicker: "Albo d'Oro",
    title: "Palmarès e ranking",
    value: "Storico della lega",
    description: "Consulta vincitori, piazzamenti, palmarès e FIFA Ranking.",
    actions: [renderMobileHomeActionV140("Apri Albo", "honor")]
  }).replace('class="mobile-home-card', 'data-mobile-home-card="honor" class="mobile-home-card');
  const newsCard = Array.from(target.querySelectorAll(".mobile-home-card")).find((card) => {
    const kicker = card.querySelector(".mobile-home-kicker")?.textContent?.trim().toLowerCase() || "";
    return kicker === "comunicati";
  });
  if (newsCard) newsCard.insertAdjacentHTML("beforebegin", cardHtml);
  else target.insertAdjacentHTML("beforeend", cardHtml);
}

function ensureMobileHonorMoreLinkV162() {
  const sheet = document.getElementById("mobileMoreSheet");
  if (!sheet) return;
  if (sheet.querySelector('[data-page-link="honor"]')) return;
  const clubs = sheet.querySelector('[data-page-link="clubs"]');
  const link = document.createElement("a");
  link.href = "#honor";
  link.className = "mobile-more-link";
  link.dataset.pageLink = "honor";
  link.textContent = "Albo d'Oro e Palmarès";
  if (clubs) clubs.insertAdjacentElement("afterend", link);
  else sheet.appendChild(link);
}

function normalizeMobileMatchResultLabelsV162(root = document.body) {
  if (!root || !isMobileUxActiveV162()) return;
  root.querySelectorAll("th, [role='columnheader']").forEach((node) => {
    const text = node.textContent?.trim().toLowerCase() || "";
    if (text === "risultato") node.textContent = "Ris.";
  });
  root.querySelectorAll('[data-label="Risultato"]').forEach((node) => {
    node.setAttribute("data-label", "Ris.");
  });
}

const renderMobileBlockDashboardBeforeV162 = renderMobileBlockDashboardV140;
renderMobileBlockDashboardV140 = function renderMobileBlockDashboardV162() {
  const result = renderMobileBlockDashboardBeforeV162?.();
  ensureMobileHonorHomeCardV162();
  ensureMobileHonorMoreLinkV162();
  normalizeMobileMatchResultLabelsV162(document.querySelector("main") || document.body);
  return result;
};

const renderAllBeforeV162 = renderAll;
renderAll = function renderAllV162() {
  const result = renderAllBeforeV162();
  ensureMobileHonorHomeCardV162();
  ensureMobileHonorMoreLinkV162();
  normalizeMobileMatchResultLabelsV162(document.querySelector("main") || document.body);
  return result;
};

window.addEventListener("load", () => {
  window.requestAnimationFrame(() => {
    ensureMobileHonorHomeCardV162();
    ensureMobileHonorMoreLinkV162();
    normalizeMobileMatchResultLabelsV162(document.querySelector("main") || document.body);
  });
});


/* V164 - Mobile competition detail refinements live in competition.html/CSS. */

/* V170 - Fantamercato lazy per ridurre le letture Firebase pubbliche. */
state.transferMarketPromiseV170 = null;
state.transferMarketLastLoadReasonV170 = state.transferMarketLastLoadReasonV170 || "";

function resetTransferMarketCacheV170() {
  state.transferMarketLoadedV119 = false;
  state.transferMarketLoadingV119 = false;
  state.transferMarketPromiseV170 = null;
  if (state.raw) {
    state.raw.transferListings = [];
    state.raw.transferNegotiations = [];
  }
}

function getHashPageV170() {
  return String(window.location.hash || "").replace("#", "") || "dashboard";
}

function shouldLoadTransferMarketForPageV170(pageName = state.currentPage || getHashPageV170()) {
  const page = String(pageName || "dashboard");
  if (page === "fantamercato") return true;
  if (page === "teamarea") return Boolean(state.user || state.isAdmin);
  if (page === "teamprofile") {
    const activeTeamId = state.activeTeamProfileSeasonTeamId || "";
    return Boolean(state.user && activeTeamId && typeof isOwnSeasonTeamV119 === "function" && isOwnSeasonTeamV119(activeTeamId));
  }
  return false;
}

function renderTransferMarketDeferredStateV170() {
  if (state.transferMarketLoadedV119 || state.transferMarketLoadingV119) return;
  const tableBody = document.getElementById("transferMarketTableBody");
  if (tableBody) {
    tableBody.innerHTML = `<tr><td colspan="7" class="muted center">Apri il Fantamercato per caricare i trasferibili.</td></tr>`;
  }
  const mobileCards = document.getElementById("transferMarketMobileCardsV141");
  if (mobileCards) {
    mobileCards.innerHTML = '<p class="muted center">Apri il Fantamercato per caricare i trasferibili.</p>';
  }
}

async function ensureTransferMarketDataV170(options = {}) {
  const { force = false, reason = "" } = options || {};
  if (state.transferMarketLoadedV119) return state.raw?.transferListings || [];
  if (state.transferMarketPromiseV170) return state.transferMarketPromiseV170;
  if (!force && !shouldLoadTransferMarketForPageV170()) {
    renderTransferMarketDeferredStateV170();
    return null;
  }

  state.transferMarketLastLoadReasonV170 = reason || state.currentPage || getHashPageV170();
  state.transferMarketPromiseV170 = loadTransferMarketCollectionsV119()
    .then(() => {
      renderTransferMarketPageV119?.();
      renderUserAreaV34?.();
      renderTeamsTable?.();
      return state.raw?.transferListings || [];
    })
    .catch((error) => {
      console.warn("Fantamercato non caricato", error);
      return null;
    })
    .finally(() => {
      state.transferMarketPromiseV170 = null;
    });

  renderTransferMarketPageV119?.();
  renderUserAreaV34?.();
  return state.transferMarketPromiseV170;
}

ensureTransferMarketDataV119 = ensureTransferMarketDataV170;

const renderTransferMarketPageBeforeV170 = renderTransferMarketPageV119;
renderTransferMarketPageV119 = function renderTransferMarketPageV170() {
  if (!state.transferMarketLoadedV119 && !state.transferMarketLoadingV119 && shouldLoadTransferMarketForPageV170()) {
    ensureTransferMarketDataV119({ force: true, reason: state.currentPage || getHashPageV170() });
  }
  const result = renderTransferMarketPageBeforeV170?.();
  if (!state.transferMarketLoadedV119 && !state.transferMarketLoadingV119 && !shouldLoadTransferMarketForPageV170()) {
    renderTransferMarketDeferredStateV170();
  }
  return result;
};

if (loadDataForCurrentAuthBeforeV119) {
  loadDataForCurrentAuthV100 = async function loadDataForCurrentAuthV170(options = {}) {
    resetTransferMarketCacheV170();
    const result = await loadDataForCurrentAuthBeforeV119(options);
    if (shouldLoadTransferMarketForPageV170()) {
      await ensureTransferMarketDataV119({ force: true, reason: state.currentPage || getHashPageV170() });
    } else if (options.render) {
      renderTransferMarketDeferredStateV170();
    }
    return result;
  };
  loadData = async function loadDataV170() {
    return loadDataForCurrentAuthV100({ render: true });
  };
}

const setAppPageBeforeV170 = typeof setAppPageV42 === "function" ? setAppPageV42 : null;
if (setAppPageBeforeV170) {
  setAppPageV42 = function setAppPageV170(pageName) {
    const result = setAppPageBeforeV170(pageName);
    if (shouldLoadTransferMarketForPageV170(pageName)) {
      ensureTransferMarketDataV119({ force: true, reason: pageName || "navigation" });
    }
    return result;
  };
}

document.addEventListener("click", (event) => {
  const link = event.target.closest('[data-page-link="fantamercato"], [data-v42-page-link="fantamercato"], [data-page-link="teamarea"], [data-v42-page-link="teamarea"]');
  if (!link) return;
  const page = link.dataset.pageLink || link.dataset.v42PageLink || "";
  window.setTimeout(() => {
    if (shouldLoadTransferMarketForPageV170(page)) {
      ensureTransferMarketDataV119({ force: true, reason: page || "click" });
    }
  }, 0);
}, true);

window.addEventListener("hashchange", () => {
  const page = getHashPageV170();
  if (shouldLoadTransferMarketForPageV170(page)) {
    ensureTransferMarketDataV119({ force: true, reason: page });
  }
});

window.addEventListener("load", () => {
  if (shouldLoadTransferMarketForPageV170()) {
    ensureTransferMarketDataV119({ force: true, reason: state.currentPage || getHashPageV170() });
  } else {
    renderTransferMarketDeferredStateV170();
  }
});



/* V171 - Static public config and admin mobile account button.
   Public users load assets/public/config.json before falling back to Firestore
   leagueSettings/seasons, reducing baseline reads. Admin keeps the Account
   button visible so Dark/Light, Account and Logout can sit on one mobile row. */
const PUBLIC_CONFIG_URL_V171 = "assets/public/config.json";
state.publicConfigV171 = state.publicConfigV171 || null;
state.publicConfigSourceV171 = state.publicConfigSourceV171 || "";

function normalizePublicConfigSeasonV171(season, currentSeasonId = "") {
  const id = String(season?.id || season?.seasonId || "").trim();
  if (!id) return null;
  return {
    ...season,
    id,
    name: season?.name || season?.label || `Stagione ${id}`,
    isCurrent: Boolean(season?.isCurrent || id === currentSeasonId)
  };
}

function normalizePublicConfigV171(payload) {
  const sourceSeasons = Array.isArray(payload?.seasons)
    ? payload.seasons
    : Array.isArray(payload?.raw?.seasons)
      ? payload.raw.seasons
      : [];
  const currentSeasonId = String(payload?.currentSeasonId || sourceSeasons.find((season) => season?.isCurrent)?.id || sourceSeasons[0]?.id || "").trim();
  const seasons = sourceSeasons
    .map((season) => normalizePublicConfigSeasonV171(season, currentSeasonId))
    .filter(Boolean)
    .sort((a, b) => String(b.id || "").localeCompare(String(a.id || ""), "it"));
  if (!seasons.length) return null;

  const leagueSettings = Array.isArray(payload?.leagueSettings) && payload.leagueSettings.length
    ? payload.leagueSettings.map((item, index) => ({
        ...item,
        id: item?.id || (index === 0 ? "main" : `settings-${index + 1}`),
        currentSeasonId: item?.currentSeasonId || currentSeasonId
      }))
    : [{ id: "main", currentSeasonId }];

  return {
    currentSeasonId,
    leagueSettings,
    seasons,
    generatedAt: payload?.generatedAt || "",
    version: payload?.version || 1
  };
}

async function loadStaticPublicConfigV171() {
  if (state.publicConfigV171) return state.publicConfigV171;
  try {
    const response = await fetch(PUBLIC_CONFIG_URL_V171, { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json();
    const normalized = normalizePublicConfigV171(payload);
    if (!normalized) return null;
    state.publicConfigV171 = normalized;
    state.publicConfigSourceV171 = "static";
    return normalized;
  } catch (error) {
    console.warn("Config pubblica statica non disponibile", error);
    return null;
  }
}

async function loadPublicConfigV171() {
  const staticConfig = await loadStaticPublicConfigV171();
  if (staticConfig) return staticConfig;

  const [leagueSettings, seasons] = await Promise.all([
    loadCollection("leagueSettings"),
    loadCollection("seasons")
  ]);
  state.publicConfigSourceV171 = "firebase";
  return {
    leagueSettings,
    seasons,
    currentSeasonId: getDefaultSeasonIdFromRawV100({ leagueSettings, seasons })
  };
}

loadPublicDataForSelectedSeasonV100 = async function loadPublicDataForSelectedSeasonV171(requestId, options = {}) {
  const { render = true } = options;
  const selectedSeasonBefore = state.selectedSeasonId;
  const rawBase = makeEmptyRawDataV34();
  const publicConfig = await loadPublicConfigV171();

  rawBase.leagueSettings = Array.isArray(publicConfig?.leagueSettings) ? publicConfig.leagueSettings : [];
  rawBase.seasons = Array.isArray(publicConfig?.seasons) ? publicConfig.seasons : [];

  const seasonId = selectedSeasonBefore || publicConfig?.currentSeasonId || getDefaultSeasonIdFromRawV100(rawBase);
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
};

function buildPublicConfigPayloadV171() {
  const currentSeasonId = getCurrentSeasonId() || getDefaultSeasonId();
  const seasons = (state.raw.seasons || []).map((season) => ({
    ...season,
    isCurrent: season.id === currentSeasonId || Boolean(season.isCurrent)
  }));
  const leagueSettings = (state.raw.leagueSettings || []).length
    ? (state.raw.leagueSettings || []).map((item, index) => ({
        ...item,
        id: item?.id || (index === 0 ? "main" : `settings-${index + 1}`),
        currentSeasonId: item?.currentSeasonId || currentSeasonId
      }))
    : [{ id: "main", currentSeasonId }];

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    currentSeasonId,
    leagueSettings,
    seasons
  };
}

function downloadPublicConfigV171() {
  const payload = buildPublicConfigPayloadV171();
  downloadJson(payload, "config.json");
  showMessage("adminPublicSnapshotsStatus", "Config pubblica scaricata. Salvala in assets/public/config.json e pubblicala su GitHub.");
}

const renderPublicSnapshotsAdminPanelBeforeV171 = typeof renderPublicSnapshotsAdminPanelV114 === "function" ? renderPublicSnapshotsAdminPanelV114 : null;
if (renderPublicSnapshotsAdminPanelBeforeV171) {
  renderPublicSnapshotsAdminPanelV114 = function renderPublicSnapshotsAdminPanelV171() {
    let html = renderPublicSnapshotsAdminPanelBeforeV171();
    if (!html.includes('id="adminDownloadPublicConfig"')) {
      html = html.replace('</div>\n      <p id="adminPublicSnapshotsStatus"', `  <button id="adminDownloadPublicConfig" class="button button-secondary snapshot-action-button" type="button"><span class="snapshot-button-title">Scarica config pubblica</span><span class="snapshot-button-date">Ultimo: ${escapeHtml(publicSnapshotAdminHelpersV129.getSnapshotDateText(state.publicConfigV171?.generatedAt || ""))}</span></button>\n      </div>\n      <p id="adminPublicSnapshotsStatus"`);
      html = html.replace('Comunicati, competizioni e classifiche della stagione sono dentro', 'La config pubblica statica va salvata in <code>assets/public/config.json</code>. Comunicati, competizioni e classifiche della stagione sono dentro');
    }
    return html;
  };
  renderPublicSnapshotsAdminPanel = renderPublicSnapshotsAdminPanelV114;
}

const attachAdminHandlersBeforeV171 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV171() {
  attachAdminHandlersBeforeV171?.();
  document.getElementById("adminDownloadPublicConfig")?.addEventListener("click", downloadPublicConfigV171);
};

const updateAdminVisibilityBeforeV171 = updateAdminVisibility;
updateAdminVisibility = function updateAdminVisibilityV171() {
  updateAdminVisibilityBeforeV171?.();
  const openLoginBtn = document.getElementById("openLoginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  if (openLoginBtn && state.user) {
    openLoginBtn.textContent = "Account";
    openLoginBtn.classList.remove("hidden");
  }
  logoutBtn?.classList.toggle("hidden", !state.user);
  document.body?.classList.toggle("is-admin-authenticated", Boolean(state.isAdmin && state.user));
};

/* V172 - Static season snapshots and mobile page top focus.
   Public season snapshots can now be served from GitHub at
   assets/snapshots/seasons before falling back to Firestore. On mobile,
   every tab/page navigation is forced back to the top of the viewport. */
const STATIC_SEASON_SNAPSHOTS_BASE_URL_V172 = "assets/snapshots/seasons/";
const STATIC_SEASON_SNAPSHOTS_MANIFEST_URL_V172 = `${STATIC_SEASON_SNAPSHOTS_BASE_URL_V172}manifest.json`;
state.staticSeasonSnapshotsManifestV172 = state.staticSeasonSnapshotsManifestV172 || null;
state.publicSeasonSnapshotSourcesV172 = state.publicSeasonSnapshotSourcesV172 || {};

function normalizeStaticSeasonSnapshotEntryV172(entry) {
  const seasonId = String(entry?.seasonId || entry?.id || "").trim();
  if (!seasonId) return null;
  const file = String(entry?.file || entry?.path || `${safeFileName(seasonId)}.json`).replace(/^\/+/, "");
  return {
    ...entry,
    id: seasonId,
    seasonId,
    file,
    generatedAt: entry?.generatedAt || ""
  };
}

function getStaticSeasonSnapshotEntriesV172(manifest) {
  if (Array.isArray(manifest?.snapshots)) return manifest.snapshots;
  if (Array.isArray(manifest?.seasons)) return manifest.seasons;
  if (manifest?.snapshots && typeof manifest.snapshots === "object") {
    return Object.entries(manifest.snapshots).map(([seasonId, value]) => ({ seasonId, ...(value || {}) }));
  }
  return [];
}

async function loadStaticSeasonSnapshotsManifestV172() {
  if (state.staticSeasonSnapshotsManifestV172) return state.staticSeasonSnapshotsManifestV172;
  try {
    const response = await fetch(STATIC_SEASON_SNAPSHOTS_MANIFEST_URL_V172, { cache: "no-store" });
    if (!response.ok) {
      state.staticSeasonSnapshotsManifestV172 = { version: 1, generatedAt: "", snapshots: [] };
      return state.staticSeasonSnapshotsManifestV172;
    }
    const payload = await response.json();
    const snapshots = getStaticSeasonSnapshotEntriesV172(payload)
      .map(normalizeStaticSeasonSnapshotEntryV172)
      .filter(Boolean);
    state.staticSeasonSnapshotsManifestV172 = {
      version: payload?.version || 1,
      generatedAt: payload?.generatedAt || "",
      snapshots
    };
    return state.staticSeasonSnapshotsManifestV172;
  } catch (error) {
    console.warn("Manifest snapshot stagioni statico non disponibile", error);
    state.staticSeasonSnapshotsManifestV172 = { version: 1, generatedAt: "", snapshots: [] };
    return state.staticSeasonSnapshotsManifestV172;
  }
}

function getStaticSeasonSnapshotEntryV172(manifest, seasonId) {
  const target = String(seasonId || "").trim();
  if (!target) return null;
  return (manifest?.snapshots || []).find((entry) => String(entry?.seasonId || entry?.id || "") === target) || null;
}

function normalizeStaticPublicSeasonSnapshotV172(payload, seasonId) {
  const snapshot = payload?.snapshot && typeof payload.snapshot === "object" ? payload.snapshot : payload;
  if (!snapshot || typeof snapshot !== "object") return null;
  const normalizedSeasonId = String(snapshot.seasonId || snapshot.id || seasonId || "").trim();
  if (!normalizedSeasonId || normalizedSeasonId !== String(seasonId || "")) return null;
  return {
    ...snapshot,
    id: snapshot.id || normalizedSeasonId,
    seasonId: normalizedSeasonId
  };
}

async function loadStaticPublicSeasonSnapshotV172(seasonId) {
  const manifest = await loadStaticSeasonSnapshotsManifestV172();
  const entry = getStaticSeasonSnapshotEntryV172(manifest, seasonId);
  if (!entry?.file) return null;
  try {
    const response = await fetch(`${STATIC_SEASON_SNAPSHOTS_BASE_URL_V172}${entry.file}`, { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json();
    const snapshot = normalizeStaticPublicSeasonSnapshotV172(payload, seasonId);
    if (!snapshot) return null;
    snapshot.staticGeneratedAt = entry.generatedAt || snapshot.generatedAt || "";
    state.publicSeasonSnapshotSourcesV172[seasonId] = "static";
    return snapshot;
  } catch (error) {
    console.warn(`Snapshot stagione statico non disponibile per ${seasonId}`, error);
    return null;
  }
}

const loadPublicSeasonSnapshotBeforeV172 = loadPublicSeasonSnapshotV32;
loadPublicSeasonSnapshotV32 = async function loadPublicSeasonSnapshotV172(seasonId) {
  if (!seasonId) return null;
  if (state.publicSeasonSnapshots[seasonId]) return state.publicSeasonSnapshots[seasonId];
  const staticSnapshot = await loadStaticPublicSeasonSnapshotV172(seasonId);
  if (staticSnapshot) {
    state.publicSeasonSnapshots[seasonId] = staticSnapshot;
    return staticSnapshot;
  }
  const firebaseSnapshot = await loadPublicSeasonSnapshotBeforeV172(seasonId);
  if (firebaseSnapshot) state.publicSeasonSnapshotSourcesV172[seasonId] = "firebase";
  return firebaseSnapshot;
};

function buildStaticSeasonSnapshotFileNameV172(seasonId) {
  return `${safeFileName(seasonId || "stagione")}.json`;
}

function buildStaticSeasonSnapshotsManifestV172(snapshotEntries) {
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    snapshots: snapshotEntries.map((entry) => ({
      seasonId: entry.seasonId,
      file: entry.file,
      generatedAt: entry.snapshot?.generatedAt || "",
      snapshotVersion: entry.snapshot?.snapshotVersion || entry.snapshot?.version || ""
    }))
  };
}

function buildStaticSeasonSnapshotEntriesV172(seasonIds) {
  return (seasonIds || [])
    .filter(Boolean)
    .map((seasonId) => {
      const snapshot = typeof buildPublicSeasonSnapshotV34 === "function"
        ? buildPublicSeasonSnapshotV34(seasonId)
        : buildPublicSeasonSnapshotV32(seasonId);
      return {
        seasonId,
        file: buildStaticSeasonSnapshotFileNameV172(seasonId),
        snapshot
      };
    });
}

async function downloadStaticSeasonSnapshotsOverlayV172(options = {}) {
  const { selectedOnly = false } = options;
  try {
    showMessage("adminPublicSnapshotsStatus", selectedOnly ? "Genero overlay snapshot stagione selezionata..." : "Genero overlay snapshot stagioni...");
    if (!state.hasFullData) await loadFullDataV32({ render: false });
    const seasonIds = selectedOnly
      ? [getCurrentSeasonId()].filter(Boolean)
      : (state.raw.seasons || []).map((season) => season.id).filter(Boolean);
    if (!seasonIds.length) throw new Error("Nessuna stagione disponibile per generare lo snapshot statico.");

    const entries = buildStaticSeasonSnapshotEntriesV172(seasonIds);
    const manifest = buildStaticSeasonSnapshotsManifestV172(entries);
    const JSZip = await loadZipLibraryV105();
    const zip = new JSZip();
    zip.file("static/zonaorientale/assets/snapshots/seasons/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
    entries.forEach((entry) => {
      zip.file(`static/zonaorientale/assets/snapshots/seasons/${entry.file}`, `${JSON.stringify(entry.snapshot, null, 2)}\n`);
    });
    const blob = await zip.generateAsync({ type: "blob" });
    const suffix = selectedOnly ? safeFileName(seasonIds[0]) : "tutte_le_stagioni";
    downloadBlobV105(blob, `zonaorientale_snapshot_stagioni_${suffix}_overlay.zip`);
    showMessage("adminPublicSnapshotsStatus", "Overlay snapshot stagioni scaricato. Pubblicalo su GitHub per evitare letture Firestore sulle stagioni staticizzate.");
  } catch (error) {
    console.error(error);
    showMessage("adminPublicSnapshotsStatus", error.message || "Errore durante la generazione overlay snapshot stagioni.", true);
  }
}

const renderPublicSnapshotsAdminPanelBeforeV172 = typeof renderPublicSnapshotsAdminPanelV114 === "function" ? renderPublicSnapshotsAdminPanelV114 : null;
if (renderPublicSnapshotsAdminPanelBeforeV172) {
  renderPublicSnapshotsAdminPanelV114 = function renderPublicSnapshotsAdminPanelV172() {
    let html = renderPublicSnapshotsAdminPanelBeforeV172();
    if (!html.includes('id="adminDownloadStaticSeasonSnapshots"')) {
      html = html.replace('</div>\n      <p id="adminPublicSnapshotsStatus"', `  <button id="adminDownloadSelectedStaticSeasonSnapshot" class="button button-secondary snapshot-action-button" type="button"><span class="snapshot-button-title">Scarica snapshot stagione JSON</span><span class="snapshot-button-date">Ultimo: ${escapeHtml(getStaticSeasonSnapshotDateTextV173(getCurrentSeasonId()))}</span></button>\n        <button id="adminDownloadStaticSeasonSnapshots" class="button button-secondary snapshot-action-button" type="button"><span class="snapshot-button-title">Scarica overlay snapshot stagioni</span><span class="snapshot-button-date">Ultimo: ${escapeHtml(getStaticSeasonSnapshotsManifestDateTextV173())}</span></button>\n      </div>\n      <p id="adminPublicSnapshotsStatus"`);
      html = html.replace('La config pubblica statica va salvata in <code>assets/public/config.json</code>.', 'La config pubblica statica va salvata in <code>assets/public/config.json</code>. Gli snapshot stagione statici vanno salvati in <code>assets/snapshots/seasons/</code>.');
    }
    return html;
  };
  renderPublicSnapshotsAdminPanel = renderPublicSnapshotsAdminPanelV114;
}

const attachAdminHandlersBeforeV172 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV172() {
  attachAdminHandlersBeforeV172?.();
  document.getElementById("adminDownloadSelectedStaticSeasonSnapshot")?.addEventListener("click", () => downloadStaticSeasonSnapshotsOverlayV172({ selectedOnly: true }));
  document.getElementById("adminDownloadStaticSeasonSnapshots")?.addEventListener("click", () => downloadStaticSeasonSnapshotsOverlayV172({ selectedOnly: false }));
};

function isMobileUxActiveV172() {
  if (typeof isMobileUxActiveV162 === "function") return isMobileUxActiveV162();
  return document.body?.classList.contains("is-mobile-ux")
    || window.matchMedia?.("(max-width: 900px), (hover: none) and (pointer: coarse)").matches;
}

function scrollMobilePageTopNowV172() {
  if (!isMobileUxActiveV172()) return;
  closeMobileMoreMenu?.();
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  const activePage = document.querySelector(".app-page.is-active");
  const focusTarget = activePage?.querySelector(".page-heading h1, .page-heading h2, h1, h2") || activePage;
  if (focusTarget && typeof focusTarget.focus === "function") {
    const previousTabIndex = focusTarget.getAttribute("tabindex");
    if (previousTabIndex === null) focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
    if (previousTabIndex === null) focusTarget.removeAttribute("tabindex");
  }
}

function scheduleMobilePageTopV172() {
  if (!isMobileUxActiveV172()) return;
  scrollMobilePageTopNowV172();
  window.requestAnimationFrame(scrollMobilePageTopNowV172);
  window.setTimeout(scrollMobilePageTopNowV172, 80);
  window.setTimeout(scrollMobilePageTopNowV172, 240);
}

const setAppPageBeforeV172 = typeof setAppPageV42 === "function" ? setAppPageV42 : null;
if (setAppPageBeforeV172) {
  setAppPageV42 = function setAppPageV172(pageName) {
    const result = setAppPageBeforeV172(pageName);
    scheduleMobilePageTopV172();
    return result;
  };
}

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-page-link], [data-v42-page-link], [data-open-team-profile]");
  if (!link) return;
  scheduleMobilePageTopV172();
}, true);

window.addEventListener("hashchange", scheduleMobilePageTopV172);



/* V173 - Static honor snapshot and snapshot button dates.
   Albo/FIFA can now be served from assets/snapshots/honor.json before
   Firestore fallback. Admin snapshot buttons show their latest known update
   directly under the button label, especially on mobile. */
const STATIC_HONOR_SNAPSHOT_URL_V173 = "assets/snapshots/honor.json";
state.staticHonorSnapshotV173 = state.staticHonorSnapshotV173 || null;
state.publicHonorSnapshotSourceV173 = state.publicHonorSnapshotSourceV173 || "";

function normalizeStaticHonorSnapshotV173(payload) {
  const snapshot = payload?.snapshot && typeof payload.snapshot === "object" ? payload.snapshot : payload;
  if (!snapshot || typeof snapshot !== "object") return null;
  const hasHonorData = (Array.isArray(snapshot.honorRows) && snapshot.honorRows.length)
    || (Array.isArray(snapshot.palmares) && snapshot.palmares.length)
    || (Array.isArray(snapshot.fifaRanking) && snapshot.fifaRanking.length);
  if (!hasHonorData) return null;
  return {
    ...snapshot,
    generatedAt: snapshot.generatedAt || payload?.generatedAt || "",
    snapshotVersion: snapshot.snapshotVersion || snapshot.version || payload?.version || 1
  };
}

async function loadStaticHonorSnapshotV173() {
  if (state.staticHonorSnapshotV173) return state.staticHonorSnapshotV173;
  try {
    const response = await fetch(STATIC_HONOR_SNAPSHOT_URL_V173, { cache: "no-store" });
    if (!response.ok) return null;
    const payload = await response.json();
    const snapshot = normalizeStaticHonorSnapshotV173(payload);
    if (!snapshot) return null;
    state.staticHonorSnapshotV173 = snapshot;
    state.publicHonorSnapshotSourceV173 = "static";
    return snapshot;
  } catch (error) {
    console.warn("Snapshot honor statico non disponibile", error);
    return null;
  }
}

const loadPublicHonorSnapshotBeforeV173 = loadPublicHonorSnapshotV32;
loadPublicHonorSnapshotV32 = async function loadPublicHonorSnapshotV173() {
  if (state.publicHonorSnapshot) return state.publicHonorSnapshot;
  const staticSnapshot = await loadStaticHonorSnapshotV173();
  if (staticSnapshot) {
    state.publicHonorSnapshot = staticSnapshot;
    return staticSnapshot;
  }
  const firebaseSnapshot = await loadPublicHonorSnapshotBeforeV173();
  if (firebaseSnapshot) state.publicHonorSnapshotSourceV173 = "firebase";
  return firebaseSnapshot;
};

function getSnapshotDateTextV173(value) {
  return publicSnapshotAdminHelpersV129.getSnapshotDateText(value || "");
}

function getStaticSeasonSnapshotDateTextV173(seasonId) {
  const target = String(seasonId || getCurrentSeasonId() || "");
  const entry = (state.staticSeasonSnapshotsManifestV172?.snapshots || [])
    .find((item) => String(item?.seasonId || item?.id || "") === target);
  return getSnapshotDateTextV173(entry?.generatedAt || state.publicSeasonSnapshots?.[target]?.generatedAt || "");
}

function getStaticSeasonSnapshotsManifestDateTextV173() {
  return getSnapshotDateTextV173(state.staticSeasonSnapshotsManifestV172?.generatedAt || "");
}

function getStaticHonorSnapshotDateTextV173() {
  return getSnapshotDateTextV173(state.staticHonorSnapshotV173?.generatedAt || state.publicHonorSnapshot?.generatedAt || "");
}

function buildStaticHonorSnapshotPayloadV173() {
  const snapshot = buildHonorSnapshotV32();
  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    snapshot
  };
}

async function downloadStaticHonorSnapshotV173() {
  try {
    showMessage("adminPublicSnapshotsStatus", "Genero honor snapshot statico...");
    if (!state.hasFullData) await loadFullDataV32({ render: false });
    const payload = buildStaticHonorSnapshotPayloadV173();
    downloadJson(payload, "honor.json");
    showMessage("adminPublicSnapshotsStatus", "Honor snapshot scaricato. Salvalo in assets/snapshots/honor.json e pubblicalo su GitHub.");
  } catch (error) {
    console.error(error);
    showMessage("adminPublicSnapshotsStatus", error.message || "Errore durante la generazione honor snapshot statico.", true);
  }
}

const renderPublicSnapshotsAdminPanelBeforeV173 = typeof renderPublicSnapshotsAdminPanelV114 === "function" ? renderPublicSnapshotsAdminPanelV114 : null;
if (renderPublicSnapshotsAdminPanelBeforeV173) {
  renderPublicSnapshotsAdminPanelV114 = function renderPublicSnapshotsAdminPanelV173() {
    let html = renderPublicSnapshotsAdminPanelBeforeV173();
    if (!html.includes('id="adminDownloadStaticHonorSnapshot"')) {
      html = html.replace('</div>\n      <p id="adminPublicSnapshotsStatus"', `  <button id="adminDownloadStaticHonorSnapshot" class="button button-secondary snapshot-action-button" type="button"><span class="snapshot-button-title">Scarica honor JSON</span><span class="snapshot-button-date">Ultimo: ${escapeHtml(getStaticHonorSnapshotDateTextV173())}</span></button>\n      </div>\n      <p id="adminPublicSnapshotsStatus"`);
      html = html.replace('Gli snapshot stagione statici vanno salvati in <code>assets/snapshots/seasons/</code>.', 'Gli snapshot stagione statici vanno salvati in <code>assets/snapshots/seasons/</code>. L\'honor snapshot statico va salvato in <code>assets/snapshots/honor.json</code>.');
    }
    return html;
  };
  renderPublicSnapshotsAdminPanel = renderPublicSnapshotsAdminPanelV114;
}

const attachAdminHandlersBeforeV173 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV173() {
  attachAdminHandlersBeforeV173?.();
  document.getElementById("adminDownloadStaticHonorSnapshot")?.addEventListener("click", downloadStaticHonorSnapshotV173);
};


/* V174 - Explicit admin data collections.
   Admin full-load no longer uses the mutable COLLECTIONS array directly.
   This prevents read-only/public snapshot collections, especially
   publicTeamSnapshots, from being read on every admin login. Manual Firebase
   backup still uses an explicit backup list and can include snapshots. */
const ADMIN_FULL_LOAD_COLLECTIONS_V174 = Object.freeze([
  "leagueSettings",
  "seasons",
  "presidents",
  "teams",
  "seasonTeams",
  "stadiums",
  "competitions",
  "competitionMatches",
  "competitionResults",
  "honorRoll",
  "fifaRankings",
  "rosterEntries",
  "fmMovements",
  "news",
  "pendingUsers",
  "teamUsers",
  "teamRequests"
]);

const ADMIN_BACKUP_COLLECTIONS_V174 = Object.freeze([
  ...ADMIN_FULL_LOAD_COLLECTIONS_V174,
  "publicTeamSnapshots"
]);

const ADMIN_FULL_LOAD_EXCLUDED_COLLECTIONS_V174 = Object.freeze([
  "publicTeamSnapshots",
  "publicSeasonSnapshots",
  "publicSnapshots",
  "transferListings",
  "transferNegotiations"
]);

function uniqueCollectionNamesV174(names) {
  return [...new Set((names || []).map((name) => String(name || "").trim()).filter(Boolean))];
}

function getAdminFullLoadCollectionsV174() {
  return uniqueCollectionNamesV174(ADMIN_FULL_LOAD_COLLECTIONS_V174)
    .filter((name) => !ADMIN_FULL_LOAD_EXCLUDED_COLLECTIONS_V174.includes(name));
}

function getFirebaseBackupCollectionsV174() {
  return uniqueCollectionNamesV174(ADMIN_BACKUP_COLLECTIONS_V174);
}

async function loadCollectionEntriesV174(collectionNames) {
  const names = uniqueCollectionNamesV174(collectionNames);
  return Promise.all(names.map(async (name) => [name, await loadCollection(name)]));
}

function buildRawFromEntriesV174(entries) {
  return Object.assign(makeEmptyRawDataV34(), Object.fromEntries(entries || []));
}

function markFullAdminDataLoadedV174() {
  state.hasFullData = true;
  state.usedPublicSnapshots = false;
}

loadFullDataV32 = async function loadFullDataV174(options = {}) {
  const { render = true } = options;
  const entries = await loadCollectionEntriesV174(getAdminFullLoadCollectionsV174());
  state.raw = buildRawFromEntriesV174(entries);
  markFullAdminDataLoadedV174();
  await loadListoniData();
  await loadRostersData();
  sortData();
  if (render) renderAll();
};

loadFullDataStableV100 = async function loadFullDataStableV174(requestId, options = {}) {
  const { render = true } = options;
  const selectedSeasonBefore = state.selectedSeasonId;
  const entries = await loadCollectionEntriesV174(getAdminFullLoadCollectionsV174());
  await loadListoniData();
  await loadRostersData();
  await loadStaticCompetitionCalendarsV101();
  if (!isLatestDataLoadV100(requestId)) return false;

  state.raw = buildRawFromEntriesV174(entries);
  markFullAdminDataLoadedV174();
  state.selectedSeasonId = selectedSeasonBefore || state.selectedSeasonId || getDefaultSeasonId();
  mergeStaticCompetitionCalendarsForSeasonV101(state.selectedSeasonId);
  sortData();
  if (render) renderAll();
  setError("");
  return true;
};

renderBackupAdminPanel = function renderBackupAdminPanelV174() {
  const backupCollections = getFirebaseBackupCollectionsV174();
  const adminLoadCollections = getAdminFullLoadCollectionsV174();
  return renderAdminPanel("adminBackupPanel", "Backup", "Download dati Firebase", "Scarica uno snapshot JSON delle raccolte Firestore usate dal sito.", `
    <div class="form-actions">
      <button id="adminDownloadFirebaseBackup" class="button button-primary" type="button">Scarica backup Firebase</button>
      <span id="adminBackupStatus" class="form-status"></span>
    </div>
    <small class="field-hint">Il backup include: ${escapeHtml(backupCollections.join(", "))}.</small>
    <small class="field-hint">Il caricamento admin iniziale legge solo: ${escapeHtml(adminLoadCollections.join(", "))}. Gli snapshot squadra non vengono caricati automaticamente.</small>
  `);
};

downloadFirebaseBackup = async function downloadFirebaseBackupV174() {
  try {
    showMessage("adminBackupStatus", "Preparazione backup...");
    const collections = {};
    for (const collectionName of getFirebaseBackupCollectionsV174()) {
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
};


/* V175 - Lazy admin user collections and mobile Listone scroll top.
   Admin initial load keeps active teamUsers because they are used by multiple
   workflows, but pendingUsers and teamRequests are now loaded only when the
   admin opens/requests the Utenti panels. This avoids two Firebase collection
   scans on every admin login. */
const ADMIN_LAZY_USER_COLLECTIONS_V175 = Object.freeze([
  "pendingUsers",
  "teamRequests"
]);

state.adminUserCollectionsLoadedV175 = Boolean(state.adminUserCollectionsLoadedV175);

function getAdminInitialLoadCollectionsV175() {
  return uniqueCollectionNamesV174(getAdminFullLoadCollectionsV174())
    .filter((name) => !ADMIN_LAZY_USER_COLLECTIONS_V175.includes(name));
}

function getAdminCurrentLoadCollectionsV175() {
  const names = getAdminInitialLoadCollectionsV175();
  if (state.adminUserCollectionsLoadedV175) names.push(...ADMIN_LAZY_USER_COLLECTIONS_V175);
  return uniqueCollectionNamesV174(names);
}

function applyAdminUserCollectionEntriesV175(entries) {
  const loaded = Object.fromEntries(entries || []);
  ADMIN_LAZY_USER_COLLECTIONS_V175.forEach((name) => {
    state.raw[name] = Array.isArray(loaded[name]) ? loaded[name] : [];
  });
  state.adminUserCollectionsLoadedV175 = true;
}

async function loadAdminUserCollectionsV175(options = {}) {
  const { render = true, expandPanelId = "adminPendingUsersPanel" } = options;
  if (!state.isAdmin) return false;
  document.querySelectorAll("[data-admin-load-user-collections]").forEach((button) => {
    button.disabled = true;
    button.textContent = "Caricamento...";
  });
  document.querySelectorAll("[data-admin-user-lazy-status-v175]").forEach((status) => {
    status.textContent = "Carico utenti e richieste da Firebase...";
  });
  try {
    const entries = await loadCollectionEntriesV174(ADMIN_LAZY_USER_COLLECTIONS_V175);
    applyAdminUserCollectionEntriesV175(entries);
    if (render) {
      renderAll();
      expandAdminPanel(expandPanelId);
    }
    return true;
  } catch (error) {
    console.error(error);
    document.querySelectorAll("[data-admin-load-user-collections]").forEach((button) => {
      button.disabled = false;
      button.textContent = "Carica utenti e richieste";
    });
    document.querySelectorAll("[data-admin-user-lazy-status-v175]").forEach((status) => {
      status.textContent = error?.message || "Errore durante il caricamento.";
      status.classList.add("error");
    });
    return false;
  }
}

function renderAdminUserLazyPanelV175(panelId, eyebrow, title, description) {
  return renderAdminPanel(panelId, eyebrow, title, description, `
    <div class="admin-list admin-lazy-panel-v175">
      <p class="muted admin-empty-message">Dati non caricati all'apertura admin per ridurre le letture Firebase.</p>
      <div class="form-actions">
        <button class="button button-primary" type="button" data-admin-load-user-collections data-admin-target-panel="${escapeHtml(panelId)}">Carica utenti e richieste</button>
        <span class="form-status" data-admin-user-lazy-status-v175>Caricamento manuale: pendingUsers e teamRequests.</span>
      </div>
    </div>`);
}

const renderPendingUsersAdminPanelBeforeV175 = renderPendingUsersAdminPanelV34;
renderPendingUsersAdminPanelV34 = function renderPendingUsersAdminPanelV175() {
  if (!state.adminUserCollectionsLoadedV175) {
    return renderAdminUserLazyPanelV175(
      "adminPendingUsersPanel",
      "Utenti",
      "Accetta utenti",
      "Carica le registrazioni solo quando devi approvare nuovi presidenti."
    );
  }
  return renderPendingUsersAdminPanelBeforeV175?.() || "";
};

const renderTeamRequestsAdminPanelBeforeV175 = renderTeamRequestsAdminPanelV34;
renderTeamRequestsAdminPanelV34 = function renderTeamRequestsAdminPanelV175() {
  if (!state.adminUserCollectionsLoadedV175) {
    return renderAdminUserLazyPanelV175(
      "adminTeamRequestsPanel",
      "Presidenti",
      "Richieste presidenti",
      "Carica le richieste operative solo quando devi approvarle o rifiutarle."
    );
  }
  return renderTeamRequestsAdminPanelBeforeV175?.() || "";
};

loadFullDataV32 = async function loadFullDataV175(options = {}) {
  const { render = true } = options;
  const entries = await loadCollectionEntriesV174(getAdminCurrentLoadCollectionsV175());
  state.raw = buildRawFromEntriesV174(entries);
  markFullAdminDataLoadedV174();
  await loadListoniData();
  await loadRostersData();
  sortData();
  if (render) renderAll();
};

loadFullDataStableV100 = async function loadFullDataStableV175(requestId, options = {}) {
  const { render = true } = options;
  const selectedSeasonBefore = state.selectedSeasonId;
  const entries = await loadCollectionEntriesV174(getAdminCurrentLoadCollectionsV175());
  await loadListoniData();
  await loadRostersData();
  await loadStaticCompetitionCalendarsV101();
  if (!isLatestDataLoadV100(requestId)) return false;

  state.raw = buildRawFromEntriesV174(entries);
  markFullAdminDataLoadedV174();
  state.selectedSeasonId = selectedSeasonBefore || state.selectedSeasonId || getDefaultSeasonId();
  mergeStaticCompetitionCalendarsForSeasonV101(state.selectedSeasonId);
  sortData();
  if (render) renderAll();
  setError("");
  return true;
};

renderBackupAdminPanel = function renderBackupAdminPanelV175() {
  const backupCollections = getFirebaseBackupCollectionsV174();
  const initialLoadCollections = getAdminInitialLoadCollectionsV175();
  const lazyCollections = ADMIN_LAZY_USER_COLLECTIONS_V175;
  return renderAdminPanel("adminBackupPanel", "Backup", "Download dati Firebase", "Scarica uno snapshot JSON delle raccolte Firestore usate dal sito.", `
    <div class="form-actions">
      <button id="adminDownloadFirebaseBackup" class="button button-primary" type="button">Scarica backup Firebase</button>
      <span id="adminBackupStatus" class="form-status"></span>
    </div>
    <small class="field-hint">Il backup include: ${escapeHtml(backupCollections.join(", "))}.</small>
    <small class="field-hint">Il caricamento admin iniziale legge: ${escapeHtml(initialLoadCollections.join(", "))}.</small>
    <small class="field-hint">Caricate solo su richiesta: ${escapeHtml(lazyCollections.join(", "))}.</small>
  `);
};

const attachAdminHandlersBeforeV175 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV175() {
  attachAdminHandlersBeforeV175?.();
  document.querySelectorAll("[data-admin-load-user-collections]").forEach((button) => {
    button.addEventListener("click", () => loadAdminUserCollectionsV175({
      render: true,
      expandPanelId: button.dataset.adminTargetPanel || "adminPendingUsersPanel"
    }));
  });
};

document.addEventListener("click", (event) => {
  const button = event.target.closest("#listoneScrollTopBtnV175");
  if (!button) return;
  event.preventDefault();
  if (typeof scrollMobilePageTopNowV172 === "function") {
    scrollMobilePageTopNowV172();
    window.requestAnimationFrame(scrollMobilePageTopNowV172);
    window.setTimeout(scrollMobilePageTopNowV172, 80);
    return;
  }
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}, true);


/* V176 - Mobile Team Area delegated quick actions.
   The mobile hub in the president Squadra page is rendered after the initial
   navigation listeners are attached. A delegated handler makes the dynamic
   "Tutte le rose" and "Mercato" actions behave like normal page navigation. */
function getMobileTeamAreaQuickActionPageV176(action) {
  return String(action?.dataset?.pageLink || action?.dataset?.v42PageLink || "").trim();
}

function navigateMobileTeamAreaQuickActionV176(pageName) {
  const page = String(pageName || "").trim();
  if (!page) return false;
  closeMobileMoreMenu?.();
  if (typeof setAppPageV42 === "function") {
    setAppPageV42(page);
  } else {
    state.currentPage = page;
    window.location.hash = `#${page}`;
  }
  if (page === "fantamercato" && typeof ensureTransferMarketDataV119 === "function") {
    ensureTransferMarketDataV119({ force: true, reason: "mobile-teamarea-action" });
  }
  if (typeof scheduleMobilePageTopV172 === "function") {
    scheduleMobilePageTopV172();
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
  return true;
}

document.addEventListener("click", (event) => {
  const action = event.target.closest?.(".mobile-teamarea-actions-v144 [data-page-link], .mobile-teamarea-actions-v144 [data-v42-page-link]");
  if (!action) return;
  const page = getMobileTeamAreaQuickActionPageV176(action);
  if (!page) return;
  event.preventDefault();
  navigateMobileTeamAreaQuickActionV176(page);
}, true);

/* V177 - Firebase read diagnostics.
   This lightweight monitor estimates Firestore reads from the main data paths
   without changing the production flow. It helps validate the effect of static
   JSON snapshots before going online. Exact billing can still differ because
   Firestore counts cache/server behavior internally, so the UI labels it as an
   estimate. */
const FIREBASE_READ_DEBUG_STORAGE_KEY_V177 = "zonaOrientaleDebugReadsV177";

state.firebaseReadStatsV177 = state.firebaseReadStatsV177 || {
  startedAt: "",
  reason: "",
  total: 0,
  entries: []
};

function isFirebaseReadDebugEnabledV177() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    const value = params.get("debugReads");
    if (value === "1" || value === "true") {
      localStorage.setItem(FIREBASE_READ_DEBUG_STORAGE_KEY_V177, "1");
      return true;
    }
    if (value === "0" || value === "false") {
      localStorage.removeItem(FIREBASE_READ_DEBUG_STORAGE_KEY_V177);
      return false;
    }
    return localStorage.getItem(FIREBASE_READ_DEBUG_STORAGE_KEY_V177) === "1";
  } catch (_) {
    return false;
  }
}

function resetFirebaseReadStatsV177(reason = "") {
  state.firebaseReadStatsV177 = {
    startedAt: new Date().toISOString(),
    reason: String(reason || ""),
    total: 0,
    entries: []
  };
  return state.firebaseReadStatsV177;
}

function recordFirebaseReadV177(label, count = 0, meta = {}) {
  const numericCount = Number.isFinite(Number(count)) ? Math.max(0, Number(count)) : 0;
  if (!state.firebaseReadStatsV177?.startedAt) resetFirebaseReadStatsV177("sessione");
  const entry = {
    at: new Date().toISOString(),
    label: String(label || "Firebase"),
    count: numericCount,
    kind: meta.kind || "read",
    source: meta.source || "firebase"
  };
  state.firebaseReadStatsV177.entries.push(entry);
  state.firebaseReadStatsV177.total += numericCount;
  return entry;
}

function getFirebaseReadSummaryV177() {
  const stats = state.firebaseReadStatsV177 || resetFirebaseReadStatsV177("sessione");
  const byLabel = new Map();
  (stats.entries || []).forEach((entry) => {
    const current = byLabel.get(entry.label) || 0;
    byLabel.set(entry.label, current + (Number(entry.count) || 0));
  });
  const rows = [...byLabel.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return {
    startedAt: stats.startedAt || "",
    reason: stats.reason || "",
    total: stats.total || 0,
    rows
  };
}

function logFirebaseReadSummaryV177(reason = "") {
  if (!isFirebaseReadDebugEnabledV177()) return;
  const summary = getFirebaseReadSummaryV177();
  const title = `[ZonaOrientale] Letture Firebase stimate${reason ? ` - ${reason}` : ""}: ${summary.total}`;
  console.groupCollapsed(title);
  console.table(summary.rows);
  console.info("Dettaglio", state.firebaseReadStatsV177?.entries || []);
  console.info("Nota: il totale e una stima applicativa, non il dato ufficiale di billing Firestore.");
  console.groupEnd();
}

function renderFirebaseReadSummaryHtmlV177() {
  const summary = getFirebaseReadSummaryV177();
  const rows = summary.rows.slice(0, 6);
  const details = rows.length
    ? `<ul class="compact-list">${rows.map((row) => `<li><strong>${escapeHtml(row.label)}</strong>: ${escapeHtml(String(row.count))}</li>`).join("")}</ul>`
    : `<p class="muted admin-empty-message">Nessuna lettura registrata in questa sessione.</p>`;
  return `
    <div class="admin-inline-note firebase-read-summary-v177">
      <strong>Letture Firebase stimate nella sessione: ${escapeHtml(String(summary.total))}</strong>
      ${details}
      <small class="field-hint">Per vedere il riepilogo in console apri il sito con <code>?debugReads=1</code>. Disattiva con <code>?debugReads=0</code>.</small>
    </div>`;
}

const getDocumentIfExistsBeforeV177 = getDocumentIfExistsV32;
getDocumentIfExistsV32 = async function getDocumentIfExistsV177(collectionName, documentId) {
  const result = await getDocumentIfExistsBeforeV177(collectionName, documentId);
  recordFirebaseReadV177(`${collectionName}/${documentId}`, 1, { kind: "document" });
  return result;
};

const loadCollectionEntriesBeforeV177 = loadCollectionEntriesV174;
loadCollectionEntriesV174 = async function loadCollectionEntriesV177(collectionNames) {
  const entries = await loadCollectionEntriesBeforeV177(collectionNames);
  entries.forEach(([name, rows]) => {
    recordFirebaseReadV177(name, Array.isArray(rows) ? rows.length : 0, { kind: "collection" });
  });
  return entries;
};

if (typeof loadTransferListingsForCurrentSeasonV133 === "function") {
  const loadTransferListingsForCurrentSeasonBeforeV177 = loadTransferListingsForCurrentSeasonV133;
  loadTransferListingsForCurrentSeasonV133 = async function loadTransferListingsForCurrentSeasonV177() {
    const rows = await loadTransferListingsForCurrentSeasonBeforeV177();
    if (Array.isArray(rows)) {
      recordFirebaseReadV177("transferListings ACTIVE", rows.length, { kind: "query" });
    }
    return rows;
  };
}

if (typeof loadTransferNegotiationsForCurrentUserV124 === "function") {
  const loadTransferNegotiationsForCurrentUserBeforeV177 = loadTransferNegotiationsForCurrentUserV124;
  loadTransferNegotiationsForCurrentUserV124 = async function loadTransferNegotiationsForCurrentUserV177() {
    const rows = await loadTransferNegotiationsForCurrentUserBeforeV177();
    if (Array.isArray(rows)) {
      recordFirebaseReadV177("transferNegotiations utente", rows.length, { kind: "query" });
    }
    return rows;
  };
}

const loadPublicDataForSelectedSeasonBeforeV177 = loadPublicDataForSelectedSeasonV100;
loadPublicDataForSelectedSeasonV100 = async function loadPublicDataForSelectedSeasonV177(requestId, options = {}) {
  resetFirebaseReadStatsV177("public-load");
  const result = await loadPublicDataForSelectedSeasonBeforeV177(requestId, options);
  logFirebaseReadSummaryV177("public-load");
  return result;
};

const loadFullDataBeforeV177 = loadFullDataV32;
loadFullDataV32 = async function loadFullDataV177(options = {}) {
  resetFirebaseReadStatsV177("admin-load");
  const result = await loadFullDataBeforeV177(options);
  logFirebaseReadSummaryV177("admin-load");
  return result;
};

const loadFullDataStableBeforeV177 = loadFullDataStableV100;
loadFullDataStableV100 = async function loadFullDataStableV177(requestId, options = {}) {
  resetFirebaseReadStatsV177("admin-load-stable");
  const result = await loadFullDataStableBeforeV177(requestId, options);
  logFirebaseReadSummaryV177("admin-load-stable");
  return result;
};

const renderBackupAdminPanelBeforeV177 = renderBackupAdminPanel;
renderBackupAdminPanel = function renderBackupAdminPanelV177() {
  const html = renderBackupAdminPanelBeforeV177?.() || "";
  if (!html || html.includes("firebase-read-summary-v177")) return html;
  return html.replace('</div>\n    <small class="field-hint">', `</div>\n    ${renderFirebaseReadSummaryHtmlV177()}\n    <small class="field-hint">`);
};

window.ZonaOrientaleFirebaseReads = {
  enable() {
    localStorage.setItem(FIREBASE_READ_DEBUG_STORAGE_KEY_V177, "1");
    logFirebaseReadSummaryV177("manuale");
  },
  disable() {
    localStorage.removeItem(FIREBASE_READ_DEBUG_STORAGE_KEY_V177);
  },
  reset(reason = "manuale") {
    return resetFirebaseReadStatsV177(reason);
  },
  summary() {
    const summary = getFirebaseReadSummaryV177();
    console.table(summary.rows);
    return summary;
  }
};


/* V178 - Admin light startup and localhost read diagnostics by default.
   Admin users now start with the same lightweight public snapshot flow used by
   visitors. Granular Firebase collections are loaded only when the admin opens
   the Admin page and presses the explicit load button. This keeps normal admin
   browsing from triggering hundreds of Firestore reads at startup. On localhost
   the Firebase read diagnostic is enabled automatically; debugReads=0 still
   disables it for the browser. */
const FIREBASE_READ_DEBUG_LOCAL_DISABLED_KEY_V178 = "zonaOrientaleDebugReadsLocalDisabledV178";

function isLocalhostRuntimeV178() {
  const host = String(window.location.hostname || "").toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host === "::1";
}

const isFirebaseReadDebugEnabledBeforeV178 = isFirebaseReadDebugEnabledV177;
isFirebaseReadDebugEnabledV177 = function isFirebaseReadDebugEnabledV178() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    const value = params.get("debugReads");
    if (value === "1" || value === "true") {
      localStorage.removeItem(FIREBASE_READ_DEBUG_LOCAL_DISABLED_KEY_V178);
      localStorage.setItem(FIREBASE_READ_DEBUG_STORAGE_KEY_V177, "1");
      return true;
    }
    if (value === "0" || value === "false") {
      localStorage.setItem(FIREBASE_READ_DEBUG_LOCAL_DISABLED_KEY_V178, "1");
      localStorage.removeItem(FIREBASE_READ_DEBUG_STORAGE_KEY_V177);
      return false;
    }
    if (isLocalhostRuntimeV178() && localStorage.getItem(FIREBASE_READ_DEBUG_LOCAL_DISABLED_KEY_V178) !== "1") {
      return true;
    }
  } catch (_) {
    // Fall back to the previous opt-in behavior.
  }
  return isFirebaseReadDebugEnabledBeforeV178?.() || false;
};

state.adminFullCollectionsLoadedV178 = Boolean(state.adminFullCollectionsLoadedV178);
state.adminFullDataLoadingV178 = false;
state.adminLightModeV178 = false;

function shouldUseAdminFullDataV178(options = {}) {
  return Boolean(state.isAdmin && (options.forceFullAdminV178 || state.adminFullCollectionsLoadedV178));
}

function getAdminStartupModeLabelV178() {
  if (!state.isAdmin) return "pubblico";
  return state.adminFullCollectionsLoadedV178 ? "admin completo" : "admin leggero";
}

async function loadAdminFullDataForEditingV178(options = {}) {
  const { render = true } = options;
  const requestId = options.requestId || ++dataLoadSequenceV100;
  const selectedSeasonBefore = state.selectedSeasonId;
  state.adminFullDataLoadingV178 = true;
  if (typeof resetTransferMarketCacheV170 === "function") resetTransferMarketCacheV170();
  if (typeof resetFirebaseReadStatsV177 === "function") resetFirebaseReadStatsV177("admin-full-on-demand");
  try {
    const entries = await loadCollectionEntriesV174(getAdminCurrentLoadCollectionsV175());
    await loadListoniData();
    await loadRostersData();
    if (typeof loadStaticCompetitionCalendarsV101 === "function") await loadStaticCompetitionCalendarsV101();
    if (!isLatestDataLoadV100(requestId)) return false;

    state.raw = buildRawFromEntriesV174(entries);
    markFullAdminDataLoadedV174();
    state.adminFullCollectionsLoadedV178 = true;
    state.adminLightModeV178 = false;
    state.selectedSeasonId = selectedSeasonBefore || state.selectedSeasonId || getDefaultSeasonId();
    if (typeof mergeStaticCompetitionCalendarsForSeasonV101 === "function") {
      mergeStaticCompetitionCalendarsForSeasonV101(state.selectedSeasonId);
    }
    sortData();
    if (render) renderAll();
    setError("");
    if (typeof logFirebaseReadSummaryV177 === "function") logFirebaseReadSummaryV177("admin-full-on-demand");
    return true;
  } finally {
    state.adminFullDataLoadingV178 = false;
  }
}

const loadDataForCurrentAuthBeforeV178 = loadDataForCurrentAuthV100;
loadDataForCurrentAuthV100 = async function loadDataForCurrentAuthV178(options = {}) {
  if (!state.isAdmin) {
    state.adminFullCollectionsLoadedV178 = false;
    state.adminLightModeV178 = false;
    return loadDataForCurrentAuthBeforeV178(options);
  }

  if (shouldUseAdminFullDataV178(options)) {
    return loadAdminFullDataForEditingV178(options);
  }

  const requestId = ++dataLoadSequenceV100;
  state.adminLightModeV178 = true;
  if (typeof resetTransferMarketCacheV170 === "function") resetTransferMarketCacheV170();
  const result = await loadPublicDataForSelectedSeasonV100(requestId, options);
  state.adminLightModeV178 = true;
  state.hasFullData = false;

  if (typeof shouldLoadTransferMarketForPageV170 === "function" && shouldLoadTransferMarketForPageV170()) {
    await ensureTransferMarketDataV119({ force: true, reason: state.currentPage || getHashPageV170?.() || "admin-light" });
  } else if (options.render && typeof renderTransferMarketDeferredStateV170 === "function") {
    renderTransferMarketDeferredStateV170();
  }
  return result;
};

loadData = async function loadDataV178() {
  return loadDataForCurrentAuthV100({ render: true });
};

function renderAdminLightGateV178() {
  const collections = typeof getAdminInitialLoadCollectionsV175 === "function"
    ? getAdminInitialLoadCollectionsV175()
    : getAdminFullLoadCollectionsV174();
  const buttonLabel = state.adminFullDataLoadingV178 ? "Caricamento dati..." : "Carica dati amministrazione";
  return `
    <div class="page-heading">
      <div>
        <p class="eyebrow">Area riservata</p>
        <h2 id="adminTitle">Admin</h2>
        <p>All'avvio stai usando la modalità admin leggero: i dati pubblici arrivano da JSON/snapshot, mentre le collection Firebase modificabili restano ferme.</p>
      </div>
    </div>
    <section class="panel admin-light-gate-v178">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Firebase</p>
          <h3>Dati amministrazione non ancora caricati</h3>
          <p>Premi il bottone solo quando devi modificare dati, generare snapshot o scaricare backup Firebase.</p>
        </div>
      </div>
      <div class="form-actions">
        <button id="adminLoadFullDataV178" class="button button-primary" type="button" ${state.adminFullDataLoadingV178 ? "disabled" : ""}>${escapeHtml(buttonLabel)}</button>
        <span id="adminLoadFullDataStatusV178" class="form-status">Modalità corrente: ${escapeHtml(getAdminStartupModeLabelV178())}.</span>
      </div>
      <small class="field-hint">Il caricamento completo legge: ${escapeHtml(collections.join(", "))}.</small>
    </section>`;
}

const renderAdminAreaBeforeV178 = renderAdminArea;
renderAdminArea = function renderAdminAreaV178() {
  const adminPanel = document.getElementById("adminPanel");
  if (state.isAdmin && !state.adminFullCollectionsLoadedV178) {
    if (adminPanel) adminPanel.innerHTML = renderAdminLightGateV178();
    return;
  }
  return renderAdminAreaBeforeV178?.();
};

document.addEventListener("click", async (event) => {
  const button = event.target.closest?.("#adminLoadFullDataV178");
  if (!button) return;
  event.preventDefault();
  button.disabled = true;
  button.textContent = "Caricamento dati...";
  const status = document.getElementById("adminLoadFullDataStatusV178");
  if (status) status.textContent = "Carico le collection modificabili da Firebase...";
  try {
    await loadAdminFullDataForEditingV178({ render: true, forceFullAdminV178: true });
  } catch (error) {
    console.error(error);
    button.disabled = false;
    button.textContent = "Riprova caricamento dati";
    if (status) {
      status.textContent = error?.message || "Errore durante il caricamento admin.";
      status.classList.add("error");
    }
  }
}, true);

if (window.ZonaOrientaleFirebaseReads) {
  window.ZonaOrientaleFirebaseReads.mode = () => getAdminStartupModeLabelV178();
}


/* V179 - Public static assets preflight.
   Adds a no-Firebase pre-online check for the JSON files that should be served
   from GitHub/static hosting: public config, season snapshots manifest, honor,
   listoni, rose and static competitions. The check is available from the admin
   light gate, from Backup after full admin load, and from the console. */
const PUBLIC_ASSET_PREFLIGHT_STORAGE_KEY_V179 = "zonaOrientalePublicAssetsPreflightV179";

function getPublicPreflightAssetsV179() {
  return [
    {
      key: "config",
      label: "Config pubblica",
      url: typeof PUBLIC_CONFIG_URL_V171 === "string" ? PUBLIC_CONFIG_URL_V171 : "assets/public/config.json",
      required: true,
      validator: validatePublicConfigPreflightV179
    },
    {
      key: "seasonSnapshotsManifest",
      label: "Manifest snapshot stagioni",
      url: typeof STATIC_SEASON_SNAPSHOTS_MANIFEST_URL_V172 === "string" ? STATIC_SEASON_SNAPSHOTS_MANIFEST_URL_V172 : "assets/snapshots/seasons/manifest.json",
      required: true,
      validator: validateSeasonSnapshotsManifestPreflightV179
    },
    {
      key: "honor",
      label: "Honor snapshot statico",
      url: typeof STATIC_HONOR_SNAPSHOT_URL_V173 === "string" ? STATIC_HONOR_SNAPSHOT_URL_V173 : "assets/snapshots/honor.json",
      required: true,
      validator: validateHonorSnapshotPreflightV179
    },
    {
      key: "listoni",
      label: "Manifest listoni",
      url: "assets/listoni/manifest.json",
      required: true,
      validator: (payload) => validateManifestArrayPreflightV179(payload, "listoni", "listone")
    },
    {
      key: "rose",
      label: "Manifest rose",
      url: "assets/rose/manifest.json",
      required: true,
      validator: (payload) => validateManifestArrayPreflightV179(payload, "rosters", "rosa")
    },
    {
      key: "competitions",
      label: "Manifest competizioni statiche",
      url: "assets/competitions/manifest.json",
      required: false,
      validator: (payload) => validateManifestArrayPreflightV179(payload, "competitions", "competizione")
    }
  ];
}

function getRuntimeVersionInfoV179() {
  const appScript = document.querySelector('script[src*="assets/app.js"]');
  const appSrc = appScript?.getAttribute("src") || "";
  const versionMatch = appSrc.match(/[?&]v=([^&]+)/);
  return {
    appVersion: versionMatch?.[1] || "non trovato",
    footer: document.querySelector(".app-footer p")?.textContent?.trim() || ""
  };
}

function normalizePreflightDateV179(value) {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" });
  } catch (_) {
    return String(value);
  }
}

function validatePublicConfigPreflightV179(payload) {
  const normalized = typeof normalizePublicConfigV171 === "function" ? normalizePublicConfigV171(payload) : null;
  if (!normalized) {
    return { status: "error", detail: "JSON valido ma config non riconosciuta" };
  }
  return {
    status: "ok",
    detail: `${normalized.seasons.length} stagioni · corrente ${normalized.currentSeasonId || "n/d"}${normalized.generatedAt ? ` · ${normalizePreflightDateV179(normalized.generatedAt)}` : ""}`
  };
}

function validateSeasonSnapshotsManifestPreflightV179(payload) {
  const snapshots = Array.isArray(payload?.snapshots) ? payload.snapshots : [];
  if (!snapshots.length) {
    return { status: "warn", detail: "manifest presente ma senza snapshot stagioni" };
  }
  const missingFiles = snapshots.filter((entry) => !entry?.file).length;
  if (missingFiles) {
    return { status: "warn", detail: `${snapshots.length} snapshot, ${missingFiles} senza file` };
  }
  const generatedAt = payload?.generatedAt ? ` · ${normalizePreflightDateV179(payload.generatedAt)}` : "";
  return { status: "ok", detail: `${snapshots.length} snapshot stagioni${generatedAt}` };
}

function validateHonorSnapshotPreflightV179(payload) {
  const snapshot = payload?.snapshot && typeof payload.snapshot === "object" ? payload.snapshot : payload;
  const honorRows = Array.isArray(snapshot?.honorRows) ? snapshot.honorRows.length : 0;
  const palmares = Array.isArray(snapshot?.palmares) ? snapshot.palmares.length : 0;
  const fifaRanking = Array.isArray(snapshot?.fifaRanking) ? snapshot.fifaRanking.length : 0;
  if (!honorRows && !palmares && !fifaRanking) {
    return { status: "error", detail: "nessun dato honor/palmarès/FIFA trovato" };
  }
  const generatedAt = snapshot?.generatedAt || payload?.generatedAt || "";
  return {
    status: "ok",
    detail: `${honorRows} albo · ${palmares} palmarès · ${fifaRanking} ranking${generatedAt ? ` · ${normalizePreflightDateV179(generatedAt)}` : ""}`
  };
}

function validateManifestArrayPreflightV179(payload, arrayKey, singularLabel) {
  const rows = Array.isArray(payload?.[arrayKey]) ? payload[arrayKey] : [];
  if (!rows.length) {
    return { status: "warn", detail: `manifest presente ma senza ${singularLabel}` };
  }
  const missingFiles = rows.filter((entry) => !entry?.file).length;
  const generatedAt = payload?.generatedAt ? ` · ${normalizePreflightDateV179(payload.generatedAt)}` : "";
  if (missingFiles) {
    return { status: "warn", detail: `${rows.length} voci, ${missingFiles} senza file` };
  }
  return { status: "ok", detail: `${rows.length} voci${generatedAt}` };
}

async function checkPublicAssetPreflightV179(asset) {
  const startedAt = performance.now?.() || Date.now();
  try {
    const response = await fetch(asset.url, { cache: "no-store" });
    const elapsedMs = Math.round((performance.now?.() || Date.now()) - startedAt);
    if (!response.ok) {
      return {
        ...asset,
        status: asset.required ? "error" : "warn",
        httpStatus: response.status,
        detail: `HTTP ${response.status}`,
        elapsedMs
      };
    }
    let payload = null;
    try {
      payload = await response.json();
    } catch (error) {
      return {
        ...asset,
        status: "error",
        httpStatus: response.status,
        detail: "risposta non è JSON valido",
        elapsedMs
      };
    }
    const validation = typeof asset.validator === "function" ? asset.validator(payload) : { status: "ok", detail: "JSON valido" };
    return {
      ...asset,
      status: validation.status || "ok",
      httpStatus: response.status,
      detail: validation.detail || "JSON valido",
      elapsedMs
    };
  } catch (error) {
    return {
      ...asset,
      status: asset.required ? "error" : "warn",
      httpStatus: 0,
      detail: error?.message || "fetch fallito",
      elapsedMs: Math.round((performance.now?.() || Date.now()) - startedAt)
    };
  }
}

function getPreflightSummaryV179(results) {
  const total = results.length;
  const ok = results.filter((item) => item.status === "ok").length;
  const warn = results.filter((item) => item.status === "warn").length;
  const error = results.filter((item) => item.status === "error").length;
  return { total, ok, warn, error, passed: error === 0 };
}

function renderPreflightStatusLabelV179(status) {
  if (status === "ok") return "OK";
  if (status === "warn") return "Attenzione";
  return "Errore";
}

function renderPreflightResultsHtmlV179(results) {
  const summary = getPreflightSummaryV179(results);
  const runtime = getRuntimeVersionInfoV179();
  const rows = results.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.label)}</strong><br><small>${escapeHtml(item.url)}</small></td>
      <td>${escapeHtml(renderPreflightStatusLabelV179(item.status))}</td>
      <td>${escapeHtml(item.detail || "")}</td>
      <td>${escapeHtml(String(item.elapsedMs ?? "-"))} ms</td>
    </tr>`).join("");
  return `
    <div class="import-report public-preflight-report-v179">
      <h3>Controllo pre-online asset pubblici</h3>
      <p><strong>${summary.passed ? "Pronto" : "Da verificare"}</strong> · ${summary.ok}/${summary.total} ok · ${summary.warn} attenzioni · ${summary.error} errori.</p>
      <p class="muted">Runtime: app.js?v=${escapeHtml(runtime.appVersion)} · ${escapeHtml(runtime.footer)}</p>
      <div class="table-scroll">
        <table class="admin-table compact-table">
          <thead><tr><th>Asset</th><th>Stato</th><th>Dettaglio</th><th>Tempo</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>`;
}

async function runPublicAssetsPreflightV179(options = {}) {
  const { targetId = "", silent = false } = options;
  const target = targetId ? document.getElementById(targetId) : null;
  if (target && !silent) {
    target.classList.remove("hidden");
    target.innerHTML = `<div class="import-report"><p>Controllo asset pubblici in corso...</p></div>`;
  }
  const assets = getPublicPreflightAssetsV179();
  const results = [];
  for (const asset of assets) {
    // Sequential requests make the console/table easier to read and avoid noise.
    results.push(await checkPublicAssetPreflightV179(asset));
  }
  const summary = getPreflightSummaryV179(results);
  state.publicAssetsPreflightV179 = { summary, results, checkedAt: new Date().toISOString() };
  try {
    sessionStorage.setItem(PUBLIC_ASSET_PREFLIGHT_STORAGE_KEY_V179, JSON.stringify(state.publicAssetsPreflightV179));
  } catch (_) {
    // Non-critical: the visible result is already rendered.
  }
  if (target) {
    target.classList.remove("hidden");
    target.innerHTML = renderPreflightResultsHtmlV179(results);
  }
  if (isFirebaseReadDebugEnabledV177?.() || !silent) {
    console.info(`[ZonaOrientale] Preflight asset pubblici: ${summary.ok}/${summary.total} ok, ${summary.warn} warning, ${summary.error} errori`);
    console.table(results.map((item) => ({ asset: item.label, status: item.status, detail: item.detail, url: item.url })));
  }
  return { summary, results };
}

function renderPublicPreflightButtonV179(targetId = "publicAssetsPreflightReportV179") {
  return `
    <div class="form-actions public-preflight-actions-v179">
      <button class="button button-secondary" type="button" data-run-public-preflight-v179="${escapeHtml(targetId)}">Controlla asset pubblici</button>
      <span class="form-status">Non usa Firebase: controlla solo JSON statici.</span>
    </div>
    <div id="${escapeHtml(targetId)}" class="hidden"></div>`;
}

const renderAdminLightGateBeforeV179 = typeof renderAdminLightGateV178 === "function" ? renderAdminLightGateV178 : null;
if (renderAdminLightGateBeforeV179) {
  renderAdminLightGateV178 = function renderAdminLightGateV179() {
    let html = renderAdminLightGateBeforeV179();
    if (!html.includes('data-run-public-preflight-v179')) {
      html = html.replace('</section>', `${renderPublicPreflightButtonV179("publicAssetsPreflightReportLightV179")}</section>`);
    }
    return html;
  };
}

const renderBackupAdminPanelBeforeV179 = renderBackupAdminPanel;
renderBackupAdminPanel = function renderBackupAdminPanelV179() {
  let html = renderBackupAdminPanelBeforeV179?.() || "";
  if (html && !html.includes('publicAssetsPreflightReportBackupV179')) {
    html = html.replace('</article>', `${renderPublicPreflightButtonV179("publicAssetsPreflightReportBackupV179")}</article>`);
  }
  return html;
};

document.addEventListener("click", async (event) => {
  const button = event.target.closest?.("[data-run-public-preflight-v179]");
  if (!button) return;
  event.preventDefault();
  const targetId = button.dataset.runPublicPreflightV179 || "publicAssetsPreflightReportV179";
  const previousText = button.textContent;
  button.disabled = true;
  button.textContent = "Controllo in corso...";
  try {
    await runPublicAssetsPreflightV179({ targetId });
  } finally {
    button.disabled = false;
    button.textContent = previousText || "Controlla asset pubblici";
  }
}, true);

window.ZonaOrientalePreflight = {
  check(options = {}) {
    return runPublicAssetsPreflightV179({ ...options, silent: options.silent ?? false });
  },
  assets() {
    return getPublicPreflightAssetsV179().map(({ key, label, url, required }) => ({ key, label, url, required }));
  },
  last() {
    return state.publicAssetsPreflightV179 || null;
  }
};

/* V180/V181 - Final online readiness checklist.
   Keeps the deploy check in the admin UI without touching Firebase: it reuses
   the static asset preflight from V179, verifies cache-busters/footer version,
   and highlights whether the current admin session is still lightweight. */
const DEPLOY_CHECKLIST_STORAGE_KEY_V180 = "zonaOrientaleDeployChecklistV191";
const DEPLOY_EXPECTED_VERSION_V181 = "192";

function getRuntimeAssetsVersionInfoV180() {
  const links = [...document.querySelectorAll('link[href*=".css?v="]')].map((node) => node.getAttribute("href") || "");
  const scripts = [...document.querySelectorAll('script[src*=".js?v="]')].map((node) => node.getAttribute("src") || "");
  const extractVersion = (value) => {
    const match = String(value || "").match(/[?&]v=([^&]+)/);
    return match?.[1] || "non trovato";
  };
  const versions = [...links, ...scripts].map(extractVersion).filter(Boolean);
  const uniqueVersions = [...new Set(versions)];
  const footer = document.querySelector(".app-footer p")?.textContent?.trim() || "";
  const footerVersion = footer.match(/V(\d+)/)?.[1] || "non trovato";
  return { links, scripts, uniqueVersions, footer, footerVersion };
}

function renderDeployStatusBadgeV180(status) {
  if (status === "ok") return "OK";
  if (status === "warn") return "Attenzione";
  return "Errore";
}

function buildDeployRuntimeChecksV180(preflightSummary) {
  const runtime = getRuntimeAssetsVersionInfoV180();
  const appMode = typeof getAdminStartupModeLabelV178 === "function" ? getAdminStartupModeLabelV178() : (state.isAdmin ? "admin" : "pubblico");
  const readsSummary = typeof getFirebaseReadSummaryV177 === "function" ? getFirebaseReadSummaryV177() : { total: 0, rows: [] };
  const checks = [];

  const expectedVersion = DEPLOY_EXPECTED_VERSION_V181 || "181";
  const versionsOk = runtime.uniqueVersions.length === 1 && runtime.uniqueVersions[0] === expectedVersion && runtime.footerVersion === expectedVersion;
  checks.push({
    key: "versions",
    label: "Version e cache-buster",
    status: versionsOk ? "ok" : "warn",
    detail: versionsOk
      ? `Footer e asset puntano a V${expectedVersion}.`
      : `Footer V${runtime.footerVersion}; asset ${runtime.uniqueVersions.join(", ") || "non trovati"}; atteso ${expectedVersion}.`
  });

  if (preflightSummary) {
    checks.push({
      key: "static-assets",
      label: "Asset pubblici GitHub",
      status: preflightSummary.error ? "error" : (preflightSummary.warn ? "warn" : "ok"),
      detail: `${preflightSummary.ok}/${preflightSummary.total} ok · ${preflightSummary.warn} attenzioni · ${preflightSummary.error} errori.`
    });
  } else {
    checks.push({
      key: "static-assets",
      label: "Asset pubblici GitHub",
      status: "warn",
      detail: "Preflight non eseguito: premi Checklist online finale."
    });
  }

  const lightweightAdminOk = !state.isAdmin || appMode === "admin leggero" || appMode === "pubblico";
  checks.push({
    key: "admin-mode",
    label: "Modalità admin all'avvio",
    status: lightweightAdminOk ? "ok" : "warn",
    detail: state.isAdmin
      ? `Modalità corrente: ${appMode}. Per testare l'avvio leggero, ricarica la pagina prima di premere Carica dati amministrazione.`
      : "Sessione pubblica/non admin."
  });

  const readTotal = Number(readsSummary?.total || 0);
  const readStatus = readTotal <= 30 ? "ok" : (readTotal <= 120 ? "warn" : "error");
  checks.push({
    key: "reads",
    label: "Letture Firebase sessione",
    status: state.isAdmin && appMode === "admin completo" ? "warn" : readStatus,
    detail: `${readTotal} letture stimate. Il full-load admin resta previsto solo dopo il bottone Carica dati amministrazione.`
  });

  const localDebug = typeof isFirebaseReadDebugEnabledV177 === "function" ? isFirebaseReadDebugEnabledV177() : false;
  checks.push({
    key: "debug",
    label: "Diagnostica locale",
    status: localDebug || !isLocalhostRuntimeV178?.() ? "ok" : "warn",
    detail: localDebug ? "Debug letture attivo in questa sessione." : "Debug letture non attivo; usa ?debugReads=1 se vuoi verificare."
  });

  return checks;
}

function summarizeDeployChecksV180(checks) {
  const summary = checks.reduce((acc, item) => {
    acc.total += 1;
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, { total: 0, ok: 0, warn: 0, error: 0 });
  summary.passed = summary.error === 0;
  return summary;
}

function renderDeployChecklistHtmlV180(checks, checkedAt = new Date().toISOString()) {
  const summary = summarizeDeployChecksV180(checks);
  const rows = checks.map((item) => `
    <tr>
      <td><strong>${escapeHtml(item.label)}</strong></td>
      <td>${escapeHtml(renderDeployStatusBadgeV180(item.status))}</td>
      <td>${escapeHtml(item.detail || "")}</td>
    </tr>`).join("");
  const title = summary.error ? "Da correggere prima dell'online" : (summary.warn ? "Quasi pronto" : "Pronto per l'online");
  return `
    <div class="import-report deploy-checklist-report-v180">
      <h3>Checklist online finale</h3>
      <p><strong>${escapeHtml(title)}</strong> · ${summary.ok}/${summary.total} ok · ${summary.warn} attenzioni · ${summary.error} errori.</p>
      <p class="muted">Controllo eseguito: ${escapeHtml(normalizePreflightDateV179(checkedAt))}. Non scrive su Firebase.</p>
      <div class="table-scroll">
        <table class="admin-table compact-table">
          <thead><tr><th>Controllo</th><th>Stato</th><th>Dettaglio</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <small class="field-hint">Prima del push finale esegui anche un test anonimo/incognito e un test login presidente.</small>
    </div>`;
}

async function runDeployChecklistV180(options = {}) {
  const { targetId = "", silent = false } = options;
  const target = targetId ? document.getElementById(targetId) : null;
  if (target && !silent) {
    target.classList.remove("hidden");
    target.innerHTML = `<div class="import-report"><p>Checklist online in corso...</p></div>`;
  }

  let preflightSummary = null;
  try {
    if (typeof runPublicAssetsPreflightV179 === "function") {
      const preflight = await runPublicAssetsPreflightV179({ silent: true });
      preflightSummary = preflight?.summary || null;
    }
  } catch (error) {
    console.warn("[ZonaOrientale] Preflight asset pubblici non completato", error);
  }

  const checks = buildDeployRuntimeChecksV180(preflightSummary);
  const checkedAt = new Date().toISOString();
  const payload = { checkedAt, summary: summarizeDeployChecksV180(checks), checks };
  state.deployChecklistV180 = payload;
  try {
    sessionStorage.setItem(DEPLOY_CHECKLIST_STORAGE_KEY_V180, JSON.stringify(payload));
  } catch (_) {
    // Non-critical: the report is visible in the UI.
  }
  if (target) {
    target.classList.remove("hidden");
    target.innerHTML = renderDeployChecklistHtmlV180(checks, checkedAt);
  }
  if (!silent || typeof isFirebaseReadDebugEnabledV177 !== "function" || isFirebaseReadDebugEnabledV177()) {
    console.info(`[ZonaOrientale] Checklist online: ${payload.summary.ok}/${payload.summary.total} ok, ${payload.summary.warn} warning, ${payload.summary.error} errori`);
    console.table(checks.map((item) => ({ check: item.label, status: item.status, detail: item.detail })));
  }
  return payload;
}

function renderDeployChecklistButtonV180(targetId = "deployChecklistReportV180") {
  return `
    <div class="form-actions deploy-checklist-actions-v180">
      <button class="button button-primary" type="button" data-run-deploy-checklist-v180="${escapeHtml(targetId)}">Checklist online finale</button>
      <span class="form-status">Verifica versioni, asset statici e letture stimate.</span>
    </div>
    <div id="${escapeHtml(targetId)}" class="hidden"></div>`;
}

const renderAdminLightGateBeforeV180 = typeof renderAdminLightGateV178 === "function" ? renderAdminLightGateV178 : null;
if (renderAdminLightGateBeforeV180) {
  renderAdminLightGateV178 = function renderAdminLightGateV180() {
    let html = renderAdminLightGateBeforeV180();
    if (html && !html.includes('deployChecklistReportLightV180')) {
      html = html.replace('</section>', `${renderDeployChecklistButtonV180("deployChecklistReportLightV180")}</section>`);
    }
    return html;
  };
}

const renderBackupAdminPanelBeforeV180 = renderBackupAdminPanel;
renderBackupAdminPanel = function renderBackupAdminPanelV180() {
  let html = renderBackupAdminPanelBeforeV180?.() || "";
  if (html && !html.includes('deployChecklistReportBackupV180')) {
    html = html.replace('</article>', `${renderDeployChecklistButtonV180("deployChecklistReportBackupV180")}</article>`);
  }
  return html;
};

document.addEventListener("click", async (event) => {
  const button = event.target.closest?.("[data-run-deploy-checklist-v180]");
  if (!button) return;
  event.preventDefault();
  const targetId = button.dataset.runDeployChecklistV180 || "deployChecklistReportV180";
  const previousText = button.textContent;
  button.disabled = true;
  button.textContent = "Checklist in corso...";
  try {
    await runDeployChecklistV180({ targetId });
  } finally {
    button.disabled = false;
    button.textContent = previousText || "Checklist online finale";
  }
}, true);

window.ZonaOrientaleDeploy = {
  check(options = {}) {
    return runDeployChecklistV180({ ...options, silent: options.silent ?? false });
  },
  last() {
    return state.deployChecklistV180 || null;
  },
  runtime() {
    return getRuntimeAssetsVersionInfoV180();
  }
};

/* V182 - Auth dashboard landing.
   Admin and president login/logout actions now land on Dashboard instead of
   leaving the user on Admin, Squadra, Mercato or another protected tab. The
   capture listeners set the SPA page before Firebase auth changes complete; a
   short auth-state follow-up keeps the destination stable after renderAll(). */
const AUTH_DASHBOARD_PENDING_KEY_V182 = "zonaOrientaleAuthDashboardPendingV182";
let lastAuthUidV182;

function setAuthDashboardPendingV182(reason = "auth") {
  try {
    sessionStorage.setItem(AUTH_DASHBOARD_PENDING_KEY_V182, JSON.stringify({
      reason: String(reason || "auth"),
      at: Date.now()
    }));
  } catch (_) {
    state.authDashboardPendingV182 = { reason: String(reason || "auth"), at: Date.now() };
  }
}

function getAuthDashboardPendingV182() {
  try {
    const raw = sessionStorage.getItem(AUTH_DASHBOARD_PENDING_KEY_V182);
    if (!raw) return state.authDashboardPendingV182 || null;
    const parsed = JSON.parse(raw);
    if (!parsed?.at || Date.now() - Number(parsed.at) > 10000) {
      sessionStorage.removeItem(AUTH_DASHBOARD_PENDING_KEY_V182);
      return null;
    }
    return parsed;
  } catch (_) {
    return state.authDashboardPendingV182 || null;
  }
}

function clearAuthDashboardPendingV182() {
  state.authDashboardPendingV182 = null;
  try {
    sessionStorage.removeItem(AUTH_DASHBOARD_PENDING_KEY_V182);
  } catch (_) {
    // Non-critical.
  }
}

function navigateAuthDashboardV182(options = {}) {
  const { clearPending = false, replaceHistory = true } = options;
  state.currentPage = "dashboard";
  state.activeTeamProfileSeasonTeamId = "";

  if (typeof setAppPageV42 === "function") {
    setAppPageV42("dashboard");
    if (replaceHistory && window.location.hash !== "#dashboard") {
      window.history.replaceState(null, "", "#dashboard");
    }
  } else {
    document.querySelectorAll(".app-page").forEach((page) => {
      page.classList.toggle("is-active", page.dataset.page === "dashboard");
    });
    document.querySelectorAll("[data-page-link]").forEach((link) => {
      link.classList.toggle("active", link.dataset.pageLink === "dashboard");
    });
    if (replaceHistory) window.history.replaceState(null, "", "#dashboard");
  }

  closeMobileMoreMenu?.();
  updateMobileNavState?.();
  if (typeof scheduleMobilePageTopV172 === "function") scheduleMobilePageTopV172();
  else window.scrollTo({ top: 0, left: 0, behavior: "auto" });

  if (clearPending) clearAuthDashboardPendingV182();
}

function scheduleAuthDashboardLandingV182(reason = "auth") {
  setAuthDashboardPendingV182(reason);
  navigateAuthDashboardV182({ clearPending: false });
  window.setTimeout(() => navigateAuthDashboardV182({ clearPending: false }), 80);
  window.setTimeout(() => navigateAuthDashboardV182({ clearPending: false }), 320);
  window.setTimeout(() => navigateAuthDashboardV182({ clearPending: true }), 900);
}

document.addEventListener("submit", (event) => {
  if (event.target?.id !== "loginForm") return;
  scheduleAuthDashboardLandingV182("login-email");
}, true);

document.addEventListener("click", (event) => {
  if (event.target.closest?.("#loginGoogleBtn")) {
    scheduleAuthDashboardLandingV182("login-google");
    return;
  }
  if (event.target.closest?.("#logoutBtn")) {
    scheduleAuthDashboardLandingV182("logout");
  }
}, true);

onAuthStateChanged(auth, (user) => {
  const uid = user?.uid || "";
  const changed = lastAuthUidV182 !== undefined && lastAuthUidV182 !== uid;
  lastAuthUidV182 = uid;
  if (!changed && !getAuthDashboardPendingV182()) return;
  if (!getAuthDashboardPendingV182()) return;
  window.setTimeout(() => navigateAuthDashboardV182({ clearPending: false }), 120);
  window.setTimeout(() => navigateAuthDashboardV182({ clearPending: true }), 850);
});


/* V185 - Admin mobile actions and inline admin help.
   Mobile admins keep Dark/Light, Aggiorna dati, Account and Logout on one row.
   Snapshot public buttons have centered text and the Admin page gets an
   explanatory block at the bottom so every maintenance action is documented in UI. */
function renderAdminHelpPanelV185() {
  return `
    <section class="panel admin-help-v185" aria-labelledby="adminHelpTitleV185">
      <div class="panel-header compact">
        <div>
          <p class="eyebrow">Guida rapida</p>
          <h3 id="adminHelpTitleV185">Cosa fanno le funzioni Admin</h3>
          <p>Riepilogo operativo delle funzioni principali. I controlli di diagnostica non scrivono su Firebase.</p>
        </div>
      </div>
      <div class="admin-help-grid-v185">
        <article>
          <h4>Carica dati amministrazione</h4>
          <p>Passa da admin leggero ad admin completo e legge le collection Firebase modificabili. Usalo solo quando devi gestire dati o backup.</p>
        </article>
        <article>
          <h4>Stagioni, presidenti e squadre</h4>
          <p>Gestiscono anagrafiche base, squadre storiche, presidenti e associazioni delle squadre alle singole stagioni.</p>
        </article>
        <article>
          <h4>Rose e movimenti FM</h4>
          <p>Permette di aggiornare rose, acquisti, vendite, svincoli, scambi e saldo fantamilioni.</p>
        </article>
        <article>
          <h4>Competizioni, partite e risultati</h4>
          <p>Crea competizioni, calendari e risultati. Le competizioni concluse possono essere pubblicate come JSON statici su GitHub.</p>
        </article>
        <article>
          <h4>FIFA Ranking e Comunicati</h4>
          <p>Aggiorna ranking FIFA e news/comunicati visibili nella parte pubblica del sito.</p>
        </article>
        <article>
          <h4>Snapshot pubblici</h4>
          <p>Genera documenti compatti per il pubblico: stagione, albo/FIFA e schede squadra. Servono a ridurre molte letture Firebase.</p>
        </article>
        <article>
          <h4>Scarica config e JSON statici</h4>
          <p>Produce file da salvare nella repo GitHub: config, honor e snapshot stagioni. Se pubblicati, il sito li legge senza consumare Firestore.</p>
        </article>
        <article>
          <h4>Controlla asset pubblici</h4>
          <p>Verifica che i JSON statici siano presenti nei percorsi corretti. Fa solo fetch HTTP e non scrive né legge collection Firebase.</p>
        </article>
        <article>
          <h4>Checklist online finale</h4>
          <p>Controlla versione, cache-buster, asset statici, modalità admin leggera e letture stimate prima del deploy.</p>
        </article>
        <article>
          <h4>Backup Firebase</h4>
          <p>Scarica uno snapshot completo dei dati Firebase. Richiede admin completo perché legge le collection modificabili.</p>
        </article>
      </div>
    </section>`;
}

const renderAdminLightGateBeforeV185 = typeof renderAdminLightGateV178 === "function" ? renderAdminLightGateV178 : null;
if (renderAdminLightGateBeforeV185) {
  renderAdminLightGateV178 = function renderAdminLightGateV185() {
    const html = renderAdminLightGateBeforeV185() || "";
    if (html.includes("admin-help-v185")) return html;
    return `${html}${renderAdminHelpPanelV185()}`;
  };
}

const renderAdminAreaBeforeV185 = renderAdminArea;
renderAdminArea = function renderAdminAreaV185() {
  const result = renderAdminAreaBeforeV185?.();
  const adminPanel = document.getElementById("adminPanel");
  if (state.isAdmin && adminPanel && !adminPanel.querySelector(".admin-help-v185")) {
    adminPanel.insertAdjacentHTML("beforeend", renderAdminHelpPanelV185());
  }
  return result;
};


/* V187 - Static rosters Excel converter.
   Admin can now convert the Fantacalcio Excel rosters file directly in the
   browser into a GitHub-ready overlay for assets/rose/manifest.json and the
   season rosters JSON. This does not write to Firebase. */
function simplifyRosterClubKeyV187(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((token) => token && !["fc", "f", "c", "as", "a", "s", "afc"].includes(token))
    .join("");
}

function cleanStaticRosterTextV187(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function getStaticRosterCellV187(row, index) {
  return cleanStaticRosterTextV187(Array.isArray(row) ? row[index] : "");
}

function parseStaticRosterNumberV187(value) {
  if (typeof value === "number" && Number.isFinite(value)) return Number.isInteger(value) ? value : Number(value.toFixed(2));
  const normalized = String(value ?? "").replace(/\s+/g, "").replace(",", ".").trim();
  if (!normalized) return "";
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return cleanStaticRosterTextV187(value);
  return Number.isInteger(parsed) ? parsed : Number(parsed.toFixed(2));
}

function getRosterSeasonTeamsForMappingV187(seasonId) {
  if (typeof getSeasonTeamsForSeason === "function") return getSeasonTeamsForSeason(seasonId) || [];
  return (state.raw?.seasonTeams || []).filter((team) => team.seasonId === seasonId);
}

function mapStaticRosterTeamNameV187(name, seasonId) {
  // V188: do not map or normalize club names. The static rosters JSON must
  // preserve exactly the team name written in the Excel file, apart from
  // trimming repeated spaces.
  return cleanStaticRosterTextV187(name);
}

function isStaticRosterHeaderRowV187(rows, rowIndex, startCol) {
  const name = getStaticRosterCellV187(rows[rowIndex], startCol);
  if (!name || name.toLowerCase() === "ruolo" || name.toLowerCase().includes("crediti residui")) return false;
  const next = rows[rowIndex + 1] || [];
  return getStaticRosterCellV187(next, startCol).toLowerCase() === "ruolo"
    && getStaticRosterCellV187(next, startCol + 1).toLowerCase() === "calciatore";
}

function parseStaticRosterBlockV187(rows, rowIndex, startCol, seasonId) {
  const rawName = getStaticRosterCellV187(rows[rowIndex], startCol);
  const name = mapStaticRosterTeamNameV187(rawName, seasonId);
  const players = [];
  let remainingCredits = null;

  for (let i = rowIndex + 2; i < rows.length; i += 1) {
    const role = getStaticRosterCellV187(rows[i], startCol);
    if (!role || role.toLowerCase() === "ruolo") break;
    if (role.toLowerCase().includes("crediti residui")) {
      const match = role.match(/-?\d+(?:[,.]\d+)?/);
      remainingCredits = match ? parseStaticRosterNumberV187(match[0]) : null;
      break;
    }
    const playerName = getStaticRosterCellV187(rows[i], startCol + 1);
    if (!playerName) continue;
    players.push({
      role: role.toUpperCase(),
      playerName,
      realTeam: abbreviateRealTeam(getStaticRosterCellV187(rows[i], startCol + 2)).toUpperCase(),
      cost: parseStaticRosterNumberV187(getStaticRosterCellV187(rows[i], startCol + 3))
    });
  }

  const roster = { name, playerCount: players.length, players };
  if (remainingCredits !== null && remainingCredits !== "") roster.remainingCredits = remainingCredits;
  return roster;
}

function findStaticRosterDownloadDateV187(rows) {
  for (const row of rows.slice(0, 10)) {
    for (const cell of row || []) {
      const text = String(cell ?? "");
      const match = text.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (match) return `${match[3]}-${match[2]}-${match[1]}`;
    }
  }
  return "";
}

function parseStaticRostersWorkbookV187(workbook, XLSX, seasonId) {
  const rosters = [];
  const seen = new Set();
  let detectedDate = "";

  (workbook.SheetNames || []).forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
    if (!detectedDate) detectedDate = findStaticRosterDownloadDateV187(rows);
    rows.forEach((_, rowIndex) => {
      [0, 5].forEach((startCol) => {
        if (!isStaticRosterHeaderRowV187(rows, rowIndex, startCol)) return;
        const roster = parseStaticRosterBlockV187(rows, rowIndex, startCol, seasonId);
        const key = cleanStaticRosterTextV187(roster.name).toLocaleLowerCase("it");
        if (!key || seen.has(key)) return;
        seen.add(key);
        rosters.push(roster);
      });
    });
  });

  return { rosters, detectedDate };
}

function buildStaticRostersManifestV187(newEntry) {
  const existing = (state.rosters || []).map((snapshot) => ({
    id: snapshot.id || snapshot.meta?.id,
    seasonId: snapshot.seasonId || snapshot.meta?.seasonId,
    label: snapshot.label || snapshot.meta?.label,
    loadedAt: snapshot.loadedAt || snapshot.meta?.loadedAt,
    file: snapshot.file || `${safeFileName(snapshot.id || snapshot.meta?.id || "rose")}.json`,
    teams: snapshot.teams ?? snapshot.meta?.teams ?? (snapshot.rosters || []).length,
    players: snapshot.players ?? snapshot.meta?.players ?? (snapshot.rosters || []).reduce((sum, roster) => sum + (roster.players || []).length, 0)
  })).filter((entry) => entry.id && entry.file);

  const merged = [newEntry, ...existing.filter((entry) => entry.id !== newEntry.id)];
  merged.sort((a, b) => String(b.loadedAt || b.id || "").localeCompare(String(a.loadedAt || a.id || ""), "it"));
  return { rosters: merged };
}

function renderStaticRosterConverterAdminFormV187() {
  const seasons = (state.raw?.seasons || []).length
    ? state.raw.seasons
    : [{ id: getCurrentSeasonId(), name: getCurrentSeasonId() }];
  const currentSeasonId = getCurrentSeasonId();
  const options = seasons.map((season) => `
    <option value="${escapeHtml(season.id)}" ${season.id === currentSeasonId ? "selected" : ""}>${escapeHtml(season.name || season.id)}</option>
  `).join("");

  return `
    <form id="adminStaticRosterConverterForm" class="form-grid">
      <label>
        Stagione
        <select id="adminStaticRosterSeasonId" class="input" required>${options}</select>
      </label>
      <label>
        Data rose
        <input id="adminStaticRosterLoadedAt" class="input" type="date" value="${escapeHtml(getTodayIsoDate())}" required />
      </label>
      <label class="span-2">
        Label
        <input id="adminStaticRosterLabel" class="input" type="text" placeholder="Es. Rose ZonaOrientale Salerno 2025/26" />
      </label>
      <label class="span-2">
        File Excel rose
        <input id="adminStaticRosterFile" class="input" type="file" accept=".xlsx,.xls" required />
        <small class="field-hint">Converte il file Excel in overlay GitHub con <code>assets/rose/manifest.json</code> e il JSON rose. Mantiene i nomi squadra dell'Excel e non scrive su Firebase.</small>
      </label>
      <div class="form-actions span-2">
        <button class="button button-primary" type="submit">Converti rose e scarica overlay</button>
        <span id="adminStaticRosterConverterStatus" class="form-status"></span>
      </div>
    </form>
    <div id="adminStaticRosterConverterReport" class="import-report hidden"></div>
    <hr class="soft-separator" />`;
}

async function handleStaticRosterConverterSubmitV187(event) {
  event.preventDefault();
  const file = document.getElementById("adminStaticRosterFile")?.files?.[0];
  if (!file) return;

  try {
    showMessage("adminStaticRosterConverterStatus", "Conversione rose in corso...");
    const seasonId = document.getElementById("adminStaticRosterSeasonId")?.value || getCurrentSeasonId();
    const XLSX = await loadXlsxLibrary();
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const parsed = parseStaticRostersWorkbookV187(workbook, XLSX, seasonId);
    if (!parsed.rosters.length) throw new Error("Nessuna rosa trovata. Controlla che il file abbia nome squadra e colonne Ruolo, Calciatore, Squadra, Costo.");

    const dateInput = document.getElementById("adminStaticRosterLoadedAt");
    const loadedAt = dateInput?.value || parsed.detectedDate || getTodayIsoDate();
    if (dateInput && parsed.detectedDate && !dateInput.dataset.userChangedV187) dateInput.value = parsed.detectedDate;
    const label = cleanStaticRosterTextV187(document.getElementById("adminStaticRosterLabel")?.value)
      || `Rose ZonaOrientale Salerno ${formatSeasonShortLabel(seasonId)}`;
    const id = `${seasonId}-${loadedAt}`;
    const fileName = `${safeFileName(id)}.json`;
    const players = parsed.rosters.reduce((sum, roster) => sum + (roster.players || []).length, 0);
    const payload = {
      meta: {
        id,
        seasonId,
        label,
        loadedAt,
        sourceFile: file.name,
        teams: parsed.rosters.length,
        players
      },
      rosters: parsed.rosters
    };
    const manifestEntry = {
      id,
      seasonId,
      label,
      loadedAt,
      file: fileName,
      teams: parsed.rosters.length,
      players
    };
    const manifest = buildStaticRostersManifestV187(manifestEntry);
    const JSZip = await loadZipLibraryV105();
    const zip = new JSZip();
    zip.file("static/zonaorientale/assets/rose/manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
    zip.file(`static/zonaorientale/assets/rose/${fileName}`, `${JSON.stringify(payload, null, 2)}\n`);
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlobV105(blob, `zonaorientale_rose_${safeFileName(id)}_overlay.zip`);

    const report = document.getElementById("adminStaticRosterConverterReport");
    if (report) {
      report.classList.remove("hidden");
      report.innerHTML = `
        <h3>Overlay rose generato</h3>
        <p>Rose: <strong>${parsed.rosters.length}</strong> · Giocatori: <strong>${players}</strong> · Data: <strong>${escapeHtml(loadedAt)}</strong></p>
        <p>Lo zip contiene <code>assets/rose/manifest.json</code> e <code>assets/rose/${escapeHtml(fileName)}</code>. Estrailo dalla root della repo e committalo.</p>
        <pre>${escapeHtml(JSON.stringify(manifestEntry, null, 2))}</pre>`;
    }
    showMessage("adminStaticRosterConverterStatus", "Overlay rose scaricato.");
  } catch (error) {
    console.error(error);
    showMessage("adminStaticRosterConverterStatus", error.message || "Errore durante la conversione rose.", true);
  }
}

const renderRosterMovementsAdminPanelBeforeV187 = renderRosterMovementsAdminPanel;
renderRosterMovementsAdminPanel = function renderRosterMovementsAdminPanelV187() {
  let html = renderRosterMovementsAdminPanelBeforeV187?.() || "";
  if (html && !html.includes('id="adminStaticRosterConverterForm"')) {
    html = html.replace('<form id="adminImportStaticRostersForm"', `${renderStaticRosterConverterAdminFormV187()}\n    <form id="adminImportStaticRostersForm"`);
  }
  return html;
};

const attachAdminHandlersBeforeV187 = attachAdminHandlers;
attachAdminHandlers = function attachAdminHandlersV187() {
  attachAdminHandlersBeforeV187?.();
  document.getElementById("adminStaticRosterConverterForm")?.addEventListener("submit", handleStaticRosterConverterSubmitV187);
  document.getElementById("adminStaticRosterLoadedAt")?.addEventListener("input", (event) => {
    event.target.dataset.userChangedV187 = "1";
  });
};

const renderAdminHelpPanelBeforeV187 = renderAdminHelpPanelV185;
renderAdminHelpPanelV185 = function renderAdminHelpPanelV187() {
  let html = renderAdminHelpPanelBeforeV187?.() || "";
  if (html && !html.includes("Converti rose Excel")) {
    html = html.replace('<article>\n          <h4>Rose e movimenti FM</h4>', '<article>\n          <h4>Converti rose Excel</h4>\n          <p>Trasforma il file Excel delle rose in JSON statico e manifest da pubblicare su GitHub. Non consuma letture Firebase.</p>\n        </article>\n        <article>\n          <h4>Rose e movimenti FM</h4>');
  }
  return html;
};

/* V189 - Admin publication reminders.
   Tracks admin data changes and shows a mobile-friendly reminder explaining
   which public snapshots/static JSON files must be regenerated and committed
   before the change is durable after refresh/logout. */
const ADMIN_PUBLICATION_REMINDERS_KEY_V189 = "zonaOrientaleAdminPublicationRemindersV189";

const ADMIN_PUBLICATION_RULES_V189 = {
  adminSeasonForm: {
    title: "Stagioni/config pubblica modificata",
    impacts: ["config", "seasonSnapshots"],
    details: "Aggiorna snapshot pubblici, poi scarica config pubblica e overlay snapshot stagioni."
  },
  adminPresidentForm: {
    title: "Presidenti modificati",
    impacts: ["seasonSnapshots", "honor"],
    details: "Se il presidente compare in storico, aggiorna anche honor.json."
  },
  adminTeamForm: {
    title: "Squadre anagrafiche modificate",
    impacts: ["seasonSnapshots", "honor"],
    details: "I nomi/loghi possono comparire in stagione e Albo/Palmares."
  },
  adminSeasonTeamForm: {
    title: "Squadre per stagione modificate",
    impacts: ["seasonSnapshots", "honor"],
    details: "Scarica overlay snapshot stagioni; se il nome compare in Albo/Palmares scarica anche honor.json."
  },
  adminStadiumForm: {
    title: "Stadi modificati",
    impacts: ["seasonSnapshots"],
    details: "Gli stadi sono nello snapshot stagione e nelle schede squadra."
  },
  adminCompetitionForm: {
    title: "Competizioni modificate",
    impacts: ["seasonSnapshots", "honor"],
    details: "Risultati e competizioni possono influire anche su Albo/Palmares."
  },
  adminCompetitionMatchesForm: {
    title: "Partite competizioni modificate",
    impacts: ["seasonSnapshots"],
    details: "Aggiorna e scarica overlay snapshot stagioni."
  },
  adminCompetitionResultsForm: {
    title: "Classifiche/risultati modificati",
    impacts: ["seasonSnapshots", "honor"],
    details: "Le classifiche sono nello snapshot stagione; eventuali vincitori sono anche in honor.json."
  },
  adminFifaRankingForm: {
    title: "FIFA Ranking modificato",
    impacts: ["honor"],
    details: "Scarica honor.json dopo Aggiorna tutto."
  },
  adminFmMovementForm: {
    title: "Movimenti FM modificati",
    impacts: ["seasonSnapshots"],
    details: "Movimenti e saldi sono nello snapshot stagione."
  },
  adminNewsForm: {
    title: "Comunicati modificati",
    impacts: ["seasonSnapshots"],
    details: "I comunicati pubblici sono nello snapshot stagione."
  },
  adminImportStaticRostersForm: {
    title: "Rose importate da file statico",
    impacts: ["seasonSnapshots"],
    details: "Dopo l'import in Firebase aggiorna e scarica overlay snapshot stagioni."
  },
  adminStaticRosterConverterForm: {
    title: "Overlay rose generato",
    impacts: ["rosters"],
    details: "Applica lo zip rose nella repo, commit/push, poi inizializza rose dal file statico se vuoi aggiornare Firebase."
  },
  adminListoneConverterForm: {
    title: "Overlay listone generato",
    impacts: ["listone"],
    details: "Applica lo zip listone nella repo e fai commit/push."
  },
  adminStaticCompetitionImportForm: {
    title: "Competizione statica generata",
    impacts: ["competitions"],
    details: "Applica overlay competizioni nella repo e fai commit/push."
  }
};

const ADMIN_COLLECTION_PUBLICATION_RULES_V189 = {
  seasons: ADMIN_PUBLICATION_RULES_V189.adminSeasonForm,
  presidents: ADMIN_PUBLICATION_RULES_V189.adminPresidentForm,
  teams: ADMIN_PUBLICATION_RULES_V189.adminTeamForm,
  seasonTeams: ADMIN_PUBLICATION_RULES_V189.adminSeasonTeamForm,
  stadiums: ADMIN_PUBLICATION_RULES_V189.adminStadiumForm,
  competitions: ADMIN_PUBLICATION_RULES_V189.adminCompetitionForm,
  competitionMatches: ADMIN_PUBLICATION_RULES_V189.adminCompetitionMatchesForm,
  competitionResults: ADMIN_PUBLICATION_RULES_V189.adminCompetitionResultsForm,
  fifaRankings: ADMIN_PUBLICATION_RULES_V189.adminFifaRankingForm,
  fmMovements: ADMIN_PUBLICATION_RULES_V189.adminFmMovementForm,
  news: ADMIN_PUBLICATION_RULES_V189.adminNewsForm,
  rosterEntries: ADMIN_PUBLICATION_RULES_V189.adminImportStaticRostersForm,
  honorRoll: { title: "Albo d'Oro/Palmares modificato", impacts: ["honor"], details: "Scarica honor.json dopo Aggiorna tutto." }
};

function readAdminPublicationRemindersV189() {
  try {
    const raw = localStorage.getItem(ADMIN_PUBLICATION_REMINDERS_KEY_V189);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => item && item.id) : [];
  } catch (error) {
    console.warn("Impossibile leggere gli avvisi pubblicazione admin", error);
    return [];
  }
}

function writeAdminPublicationRemindersV189(items) {
  const clean = Array.isArray(items) ? items.slice(0, 12) : [];
  try {
    localStorage.setItem(ADMIN_PUBLICATION_REMINDERS_KEY_V189, JSON.stringify(clean));
  } catch (error) {
    console.warn("Impossibile salvare gli avvisi pubblicazione admin", error);
  }
  state.adminPublicationRemindersV189 = clean;
  renderAdminPublicationReminderPanelV189();
}

function buildAdminPublicationReminderIdV189(rule) {
  return (rule.impacts || []).slice().sort().join("-") || safeFileName(rule.title || "admin-change");
}

function addAdminPublicationReminderV189(rule, source = "admin") {
  if (!state.isAdmin || !rule) return;
  const now = new Date().toISOString();
  const id = buildAdminPublicationReminderIdV189(rule);
  const existing = readAdminPublicationRemindersV189().filter((item) => item.id !== id);
  existing.unshift({
    id,
    title: rule.title || "Dati admin modificati",
    impacts: Array.isArray(rule.impacts) ? rule.impacts : [],
    details: rule.details || "Aggiorna snapshot pubblici e JSON statici prima del deploy.",
    source,
    createdAt: now,
    updatedAt: now
  });
  writeAdminPublicationRemindersV189(existing);
}

function getAdminPublicationActionsV189(items) {
  const impacts = new Set((items || []).flatMap((item) => item.impacts || []));
  const actions = [];
  if (impacts.has("config") || impacts.has("seasonSnapshots") || impacts.has("honor")) {
    actions.push("Admin → Snapshot pubblici → Aggiorna tutto");
  }
  if (impacts.has("config")) actions.push("Scarica config pubblica");
  if (impacts.has("seasonSnapshots")) actions.push("Scarica overlay snapshot stagioni");
  if (impacts.has("honor")) actions.push("Scarica honor JSON");
  if (impacts.has("rosters")) actions.push("Applica overlay rose e committa assets/rose");
  if (impacts.has("listone")) actions.push("Applica overlay listone e committa assets/listoni");
  if (impacts.has("competitions")) actions.push("Applica overlay competizioni e committa assets/competitions");
  if (actions.length) actions.push("Commit + push del branch, poi merge su master quando vuoi pubblicare");
  return actions;
}

function formatAdminReminderDateV189(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("it-IT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function renderAdminPublicationReminderHtmlV189() {
  const items = readAdminPublicationRemindersV189();
  if (!items.length) {
    return `
      <section class="panel admin-publication-reminder-v189 is-clear" aria-labelledby="adminPublicationReminderTitleV189">
        <div class="panel-header compact">
          <div>
            <p class="eyebrow">Pubblicazione dati</p>
            <h3 id="adminPublicationReminderTitleV189">Nessun aggiornamento statico in sospeso</h3>
            <p>I dati pubblici risultano senza avvisi locali pendenti. Se modifichi dati admin, qui comparira cosa rigenerare.</p>
          </div>
        </div>
      </section>`;
  }
  const actions = getAdminPublicationActionsV189(items);
  return `
    <section class="panel admin-publication-reminder-v189" aria-labelledby="adminPublicationReminderTitleV189">
      <div class="panel-header compact">
        <div>
          <p class="eyebrow">Pubblicazione dati</p>
          <h3 id="adminPublicationReminderTitleV189">Aggiornamenti da pubblicare</h3>
          <p>Hai modifiche admin che dopo refresh/logout potrebbero richiedere JSON statici aggiornati su GitHub.</p>
        </div>
      </div>
      <div class="admin-publication-grid-v189">
        <div>
          <h4>Azioni consigliate</h4>
          <ol>${actions.map((action) => `<li>${escapeHtml(action)}</li>`).join("")}</ol>
        </div>
        <div>
          <h4>Modifiche rilevate</h4>
          <ul>${items.map((item) => `
            <li>
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.details)}</span>
              <small>Ultimo avviso: ${escapeHtml(formatAdminReminderDateV189(item.updatedAt || item.createdAt))}</small>
            </li>`).join("")}</ul>
        </div>
      </div>
      <div class="form-actions admin-publication-actions-v189">
        <button class="button button-secondary" type="button" data-clear-admin-publication-reminders-v189>Segna come pubblicato</button>
        <small class="muted">Usalo dopo aver applicato/committato i JSON statici richiesti.</small>
      </div>
    </section>`;
}

function renderAdminPublicationReminderPanelV189() {
  if (!state.isAdmin) return;
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;
  let holder = adminPanel.querySelector("#adminPublicationReminderMountV189");
  if (!holder) {
    holder = document.createElement("div");
    holder.id = "adminPublicationReminderMountV189";
    adminPanel.insertAdjacentElement("afterbegin", holder);
  }
  holder.innerHTML = renderAdminPublicationReminderHtmlV189();
}

function getAdminPublicationRuleFromFormV189(form) {
  if (!form || !form.id) return null;
  return ADMIN_PUBLICATION_RULES_V189[form.id] || null;
}

function getAdminPublicationRuleFromDeleteButtonV189(button) {
  if (!button?.dataset) return null;
  const map = [
    ["adminDeleteSeason", "seasons"],
    ["adminDeletePresident", "presidents"],
    ["adminDeleteTeam", "teams"],
    ["adminDeleteSeasonTeam", "seasonTeams"],
    ["adminDeleteStadium", "stadiums"],
    ["adminDeleteCompetition", "competitions"],
    ["adminDeleteMatch", "competitionMatches"],
    ["adminDeleteFifa", "fifaRankings"],
    ["adminDeleteFmMovement", "fmMovements"],
    ["adminDeleteNews", "news"],
    ["adminSoftDeleteMatch", "competitionMatches"],
    ["adminRestoreMatch", "competitionMatches"]
  ];
  const found = map.find(([key]) => button.dataset[key] !== undefined);
  return found ? ADMIN_COLLECTION_PUBLICATION_RULES_V189[found[1]] : null;
}

(function installAdminPublicationReminderEventsV189() {
  document.addEventListener("submit", (event) => {
    const rule = getAdminPublicationRuleFromFormV189(event.target);
    if (!rule) return;
    window.setTimeout(() => addAdminPublicationReminderV189(rule, event.target.id), 700);
  }, true);

  document.addEventListener("click", (event) => {
    const clearButton = event.target.closest?.("[data-clear-admin-publication-reminders-v189]");
    if (clearButton) {
      writeAdminPublicationRemindersV189([]);
      return;
    }
    const deleteButton = event.target.closest?.("[data-admin-delete-season], [data-admin-delete-president], [data-admin-delete-team], [data-admin-delete-season-team], [data-admin-delete-stadium], [data-admin-delete-competition], [data-admin-delete-match], [data-admin-delete-fifa], [data-admin-delete-fm-movement], [data-admin-delete-news], [data-admin-soft-delete-match], [data-admin-restore-match]");
    const rule = getAdminPublicationRuleFromDeleteButtonV189(deleteButton);
    if (!rule) return;
    window.setTimeout(() => addAdminPublicationReminderV189(rule, "delete"), 1200);
  }, true);
})();

const renderAdminAreaBeforeV189 = renderAdminArea;
renderAdminArea = function renderAdminAreaV189() {
  const result = renderAdminAreaBeforeV189?.();
  renderAdminPublicationReminderPanelV189();
  return result;
};

const renderAdminLightGateBeforeV189 = typeof renderAdminLightGateV178 === "function" ? renderAdminLightGateV178 : null;
if (renderAdminLightGateBeforeV189) {
  renderAdminLightGateV178 = function renderAdminLightGateV189() {
    const html = renderAdminLightGateBeforeV189() || "";
    if (html.includes("adminPublicationReminderMountV189")) return html;
    return `<div id="adminPublicationReminderMountV189">${renderAdminPublicationReminderHtmlV189()}</div>${html}`;
  };
}

function injectAdminPublicationReminderStylesV189() {
  if (document.getElementById("adminPublicationReminderStylesV189")) return;
  const style = document.createElement("style");
  style.id = "adminPublicationReminderStylesV189";
  style.textContent = `
    .admin-publication-reminder-v189 { border: 1px solid rgba(245, 158, 11, .35); background: rgba(245, 158, 11, .08); }
    .admin-publication-reminder-v189.is-clear { border-color: rgba(34, 197, 94, .25); background: rgba(34, 197, 94, .06); }
    .admin-publication-grid-v189 { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1rem; }
    .admin-publication-grid-v189 h4 { margin: 0 0 .5rem; }
    .admin-publication-grid-v189 ol, .admin-publication-grid-v189 ul { margin: 0; padding-left: 1.15rem; }
    .admin-publication-grid-v189 li { margin-bottom: .45rem; overflow-wrap: anywhere; }
    .admin-publication-grid-v189 li span, .admin-publication-grid-v189 li small { display: block; }
    .admin-publication-actions-v189 { align-items: center; gap: .65rem; }
    @media (max-width: 760px) {
      .admin-publication-reminder-v189 { margin-inline: 0; }
      .admin-publication-grid-v189 { grid-template-columns: 1fr; gap: .8rem; }
      .admin-publication-actions-v189 { flex-direction: column; align-items: stretch; }
      .admin-publication-actions-v189 .button { width: 100%; }
      .admin-publication-actions-v189 small { text-align: center; }
    }
  `;
  document.head.appendChild(style);
}

injectAdminPublicationReminderStylesV189();

const renderAdminHelpPanelBeforeV189 = renderAdminHelpPanelV185;
renderAdminHelpPanelV185 = function renderAdminHelpPanelV189() {
  let html = renderAdminHelpPanelBeforeV189?.() || "";
  if (html && !html.includes("Avvisi pubblicazione")) {
    html = html.replace("<article>\n          <h4>Snapshot pubblici</h4>", "<article>\n          <h4>Avvisi pubblicazione</h4>\n          <p>Dopo modifiche admin segnala quali JSON statici scaricare e committare, cosi i dati restano corretti dopo refresh/logout.</p>\n        </article>\n        <article>\n          <h4>Snapshot pubblici</h4>");
  }
  return html;
};


/* V190 - Stato pubblicazione Firebase/JSON con semafori.
   This admin-only panel summarizes whether static JSON assets are reachable,
   whether local admin publication reminders are still pending, and whether the
   current session is in lightweight/full admin mode. It does not write to
   Firebase and is designed to be readable on mobile without wide tables. */
const PUBLICATION_STATUS_STORAGE_KEY_V190 = "zonaOrientalePublicationStatusV190";

function getPublicationStatusBadgeV190(status) {
  if (status === "ok") return "Verde";
  if (status === "warn") return "Giallo";
  return "Rosso";
}

function getPublicationStatusTitleV190(status) {
  if (status === "ok") return "OK";
  if (status === "warn") return "Attenzione";
  return "Intervento richiesto";
}

function getPublicationStatusDotV190(status) {
  const clean = status === "ok" || status === "warn" || status === "error" ? status : "warn";
  return `<span class="publication-status-dot-v190 is-${escapeHtml(clean)}" aria-hidden="true"></span>`;
}

function findPublicationPreflightResultV190(preflight, key) {
  const results = preflight?.results || [];
  return results.find((item) => item.key === key) || null;
}

function rowFromPreflightAssetV190(preflight, key, fallbackLabel) {
  const item = findPublicationPreflightResultV190(preflight, key);
  if (!item) {
    return {
      id: key,
      title: fallbackLabel,
      status: "warn",
      detail: "Non controllato. Premi Aggiorna stato pubblicazione.",
      action: "Esegui il controllo asset pubblici o la checklist online finale."
    };
  }
  return {
    id: key,
    title: item.label || fallbackLabel,
    status: item.status === "error" ? "error" : (item.status === "warn" ? "warn" : "ok"),
    detail: item.detail || `HTTP ${item.httpStatus || "n/d"}`,
    action: item.status === "ok" ? "Nessuna azione richiesta." : `Verifica ${item.url || "il file statico"} nella repo/GitHub.`
  };
}

function buildPublicationStatusRowsV190(preflight) {
  const reminders = typeof readAdminPublicationRemindersV189 === "function" ? readAdminPublicationRemindersV189() : [];
  const mode = typeof getAdminStartupModeLabelV178 === "function" ? getAdminStartupModeLabelV178() : (state.isAdmin ? "admin" : "pubblico");
  const readSummary = window.ZonaOrientaleFirebaseReads?.summary?.() || null;
  const readTotal = Number(readSummary?.total || 0);
  const rows = [
    {
      id: "pending-reminders",
      title: "Modifiche da pubblicare",
      status: reminders.length ? "warn" : "ok",
      detail: reminders.length ? `${reminders.length} promemoria locale in sospeso.` : "Nessun promemoria locale in sospeso.",
      action: reminders.length ? "Completa Aggiorna tutto, scarica i JSON richiesti, commit/push, poi usa Segna come pubblicato." : "Nessuna azione richiesta."
    },
    {
      id: "admin-mode",
      title: "Modalita admin",
      status: mode === "admin completo" ? "warn" : "ok",
      detail: `Sessione corrente: ${mode}.`,
      action: mode === "admin completo" ? "Normale se stai modificando dati; per navigazione pubblica basta refresh/logout." : "Admin leggero: non carica tutte le collection all'avvio."
    },
    rowFromPreflightAssetV190(preflight, "config", "Config pubblica"),
    rowFromPreflightAssetV190(preflight, "seasonSnapshotsManifest", "Snapshot stagioni statici"),
    rowFromPreflightAssetV190(preflight, "honor", "Honor/Palmares/FIFA statico"),
    rowFromPreflightAssetV190(preflight, "rose", "Manifest rose"),
    rowFromPreflightAssetV190(preflight, "listoni", "Manifest listoni"),
    rowFromPreflightAssetV190(preflight, "competitions", "Manifest competizioni")
  ];

  rows.push({
    id: "reads",
    title: "Letture Firebase sessione",
    status: readTotal > 100 ? "warn" : "ok",
    detail: `${readTotal} letture stimate nella sessione corrente.`,
    action: readTotal > 100 ? "Verifica di non aver premuto Carica dati amministrazione per errore prima del controllo pubblico." : "Valore compatibile con flusso leggero/statico."
  });
  return rows;
}

function summarizePublicationStatusRowsV190(rows) {
  const total = rows.length;
  const ok = rows.filter((item) => item.status === "ok").length;
  const warn = rows.filter((item) => item.status === "warn").length;
  const error = rows.filter((item) => item.status === "error").length;
  return { total, ok, warn, error, passed: error === 0 && warn === 0 };
}

function renderPublicationStatusRowsV190(rows) {
  return rows.map((item) => `
    <article class="publication-status-card-v190 is-${escapeHtml(item.status)}">
      <div class="publication-status-card-head-v190">
        ${getPublicationStatusDotV190(item.status)}
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <strong>${escapeHtml(getPublicationStatusTitleV190(item.status))}</strong>
        </div>
      </div>
      <p>${escapeHtml(item.detail || "")}</p>
      <small>${escapeHtml(item.action || "")}</small>
    </article>`).join("");
}

function renderPublicationStatusHtmlV190(payload = null) {
  const checkedAt = payload?.checkedAt ? normalizePreflightDateV179(payload.checkedAt) : "non ancora eseguito";
  const rows = payload?.rows || [];
  const summary = payload?.summary || { total: 0, ok: 0, warn: 0, error: 0 };
  const hasRows = rows.length > 0;
  return `
    <section class="panel publication-status-v190" aria-labelledby="publicationStatusTitleV190">
      <div class="panel-header compact">
        <div>
          <p class="eyebrow">Pubblicazione dati</p>
          <h3 id="publicationStatusTitleV190">Stato Firebase / JSON</h3>
          <p>Semaforo operativo: controlla se i JSON statici sono presenti e se ci sono modifiche admin da pubblicare.</p>
        </div>
      </div>
      <div class="publication-status-summary-v190">
        <span><strong>${escapeHtml(String(summary.ok))}</strong> OK</span>
        <span><strong>${escapeHtml(String(summary.warn))}</strong> attenzioni</span>
        <span><strong>${escapeHtml(String(summary.error))}</strong> errori</span>
        <small>Ultimo controllo: ${escapeHtml(checkedAt)}</small>
      </div>
      <div class="form-actions publication-status-actions-v190">
        <button class="button button-primary" type="button" data-run-publication-status-v190>Aggiorna stato pubblicazione</button>
        <button class="button button-secondary" type="button" data-run-public-preflight-v179="publicationStatusPreflightReportV190">Controlla solo asset pubblici</button>
      </div>
      <div id="publicationStatusReportV190" class="publication-status-grid-v190">
        ${hasRows ? renderPublicationStatusRowsV190(rows) : `<p class="muted">Premi Aggiorna stato pubblicazione per leggere i JSON statici e aggiornare i semafori.</p>`}
      </div>
      <div id="publicationStatusPreflightReportV190" class="publication-status-preflight-v190"></div>
    </section>`;
}

function readPublicationStatusV190() {
  try {
    const raw = sessionStorage.getItem(PUBLICATION_STATUS_STORAGE_KEY_V190);
    if (!raw) return state.publicationStatusV190 || null;
    return JSON.parse(raw);
  } catch (error) {
    return state.publicationStatusV190 || null;
  }
}

function writePublicationStatusV190(payload) {
  state.publicationStatusV190 = payload;
  try {
    sessionStorage.setItem(PUBLICATION_STATUS_STORAGE_KEY_V190, JSON.stringify(payload));
  } catch (error) {
    console.warn("Impossibile salvare lo stato pubblicazione", error);
  }
}

async function runPublicationStatusV190(options = {}) {
  const targetId = options.targetId || "publicationStatusReportV190";
  const target = document.getElementById(targetId);
  if (target && !options.silent) target.innerHTML = `<p class="muted">Aggiornamento stato pubblicazione...</p>`;
  let preflight = null;
  try {
    preflight = await runPublicAssetsPreflightV179({ silent: true });
  } catch (error) {
    console.warn("Preflight asset per stato pubblicazione non completato", error);
  }
  const rows = buildPublicationStatusRowsV190(preflight);
  const payload = { checkedAt: new Date().toISOString(), summary: summarizePublicationStatusRowsV190(rows), rows, preflightSummary: preflight?.summary || null };
  writePublicationStatusV190(payload);
  if (!options.silent) {
    renderPublicationStatusPanelV190(payload);
    console.info(`[ZonaOrientale] Stato pubblicazione: ${payload.summary.ok}/${payload.summary.total} OK, ${payload.summary.warn} attenzioni, ${payload.summary.error} errori`);
  }
  return payload;
}

function renderPublicationStatusPanelV190(payload = readPublicationStatusV190()) {
  if (!state.isAdmin) return;
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;
  let holder = adminPanel.querySelector("#publicationStatusMountV190");
  if (!holder) {
    holder = document.createElement("div");
    holder.id = "publicationStatusMountV190";
    const reminder = adminPanel.querySelector("#adminPublicationReminderMountV189");
    if (reminder) reminder.insertAdjacentElement("afterend", holder);
    else adminPanel.insertAdjacentElement("afterbegin", holder);
  }
  holder.innerHTML = renderPublicationStatusHtmlV190(payload);
}

const renderAdminAreaBeforeV190 = renderAdminArea;
renderAdminArea = function renderAdminAreaV190() {
  const result = renderAdminAreaBeforeV190?.();
  renderPublicationStatusPanelV190();
  return result;
};

const renderAdminLightGateBeforeV190 = typeof renderAdminLightGateV178 === "function" ? renderAdminLightGateV178 : null;
if (renderAdminLightGateBeforeV190) {
  renderAdminLightGateV178 = function renderAdminLightGateV190() {
    const html = renderAdminLightGateBeforeV190() || "";
    if (html.includes("publicationStatusMountV190")) return html;
    return `<div id="publicationStatusMountV190">${renderPublicationStatusHtmlV190(readPublicationStatusV190())}</div>${html}`;
  };
}

document.addEventListener("click", async (event) => {
  const button = event.target.closest?.("[data-run-publication-status-v190]");
  if (!button) return;
  const previousText = button.textContent;
  button.disabled = true;
  button.textContent = "Aggiornamento...";
  try {
    await runPublicationStatusV190();
  } finally {
    button.disabled = false;
    button.textContent = previousText || "Aggiorna stato pubblicazione";
  }
});

function injectPublicationStatusStylesV190() {
  if (document.getElementById("publicationStatusStylesV190")) return;
  const style = document.createElement("style");
  style.id = "publicationStatusStylesV190";
  style.textContent = `
    .publication-status-v190 { border: 1px solid rgba(59, 130, 246, .25); background: rgba(59, 130, 246, .055); }
    .publication-status-summary-v190 { display: flex; flex-wrap: wrap; gap: .55rem; align-items: center; margin: .85rem 0 1rem; }
    .publication-status-summary-v190 span { display: inline-flex; gap: .3rem; align-items: center; border: 1px solid rgba(255,255,255,.12); border-radius: 999px; padding: .32rem .65rem; background: rgba(15,23,42,.45); }
    .publication-status-summary-v190 small { color: var(--muted); overflow-wrap: anywhere; }
    .publication-status-actions-v190 { gap: .6rem; flex-wrap: wrap; }
    .publication-status-grid-v190 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; margin-top: 1rem; }
    .publication-status-card-v190 { border: 1px solid rgba(255,255,255,.12); border-radius: 1rem; padding: .8rem; background: rgba(15,23,42,.58); min-width: 0; }
    .publication-status-card-v190.is-ok { border-color: rgba(34,197,94,.35); }
    .publication-status-card-v190.is-warn { border-color: rgba(245,158,11,.42); }
    .publication-status-card-v190.is-error { border-color: rgba(239,68,68,.48); }
    .publication-status-card-head-v190 { display: flex; gap: .55rem; align-items: flex-start; min-width: 0; }
    .publication-status-card-head-v190 h4 { margin: 0; overflow-wrap: anywhere; }
    .publication-status-card-head-v190 strong { display: block; font-size: .78rem; color: var(--muted); margin-top: .12rem; }
    .publication-status-card-v190 p { margin: .55rem 0 .35rem; overflow-wrap: anywhere; }
    .publication-status-card-v190 small { display: block; color: var(--muted); overflow-wrap: anywhere; }
    .publication-status-dot-v190 { width: .75rem; height: .75rem; border-radius: 999px; margin-top: .22rem; flex: 0 0 auto; box-shadow: 0 0 0 3px rgba(255,255,255,.06); }
    .publication-status-dot-v190.is-ok { background: #22c55e; }
    .publication-status-dot-v190.is-warn { background: #f59e0b; }
    .publication-status-dot-v190.is-error { background: #ef4444; }
    .publication-status-preflight-v190 .import-report { margin-top: .85rem; }
    @media (max-width: 760px) {
      .publication-status-v190 { margin-inline: 0; }
      .publication-status-grid-v190 { grid-template-columns: 1fr; }
      .publication-status-actions-v190 { flex-direction: column; align-items: stretch; }
      .publication-status-actions-v190 .button { width: 100%; }
      .publication-status-summary-v190 { align-items: stretch; }
      .publication-status-summary-v190 span, .publication-status-summary-v190 small { width: 100%; justify-content: center; text-align: center; }
    }
  `;
  document.head.appendChild(style);
}

injectPublicationStatusStylesV190();

const renderAdminHelpPanelBeforeV190 = renderAdminHelpPanelV185;
renderAdminHelpPanelV185 = function renderAdminHelpPanelV190() {
  let html = renderAdminHelpPanelBeforeV190?.() || "";
  if (html && !html.includes("Stato Firebase / JSON")) {
    html = html.replace("<article>\n          <h4>Avvisi pubblicazione</h4>", "<article>\n          <h4>Stato Firebase / JSON</h4>\n          <p>Mostra semafori per asset statici, promemoria pendenti, modalita admin e letture stimate, cosi sai cosa pubblicare prima del deploy.</p>\n        </article>\n        <article>\n          <h4>Avvisi pubblicazione</h4>");
  }
  return html;
};

window.ZonaOrientalePublicationStatus = {
  check(options = {}) {
    return runPublicationStatusV190({ ...options, silent: options.silent ?? false });
  },
  last() {
    return readPublicationStatusV190();
  },
  rows() {
    return readPublicationStatusV190()?.rows || [];
  }
};


/* V191 - Procedura guidata Pubblica aggiornamenti.
   Mobile-first panel that turns the V189 reminders and V190 status checks into
   an operational publishing flow. It does not write to Firebase or GitHub; it
   only guides the admin and provides copyable commands. */
const PUBLISH_WIZARD_STORAGE_KEY_V191 = "zonaOrientalePublishWizardV191";

function getPublishWizardPendingItemsV191() {
  if (typeof readAdminPublicationRemindersV189 === "function") {
    return readAdminPublicationRemindersV189() || [];
  }
  return [];
}

function getPublishWizardActionsV191(items) {
  if (typeof getAdminPublicationActionsV189 === "function") {
    return getAdminPublicationActionsV189(items || []);
  }
  return [];
}

function getPublishWizardCommandsV191() {
  return [
    "git status",
    "git add -f static/zonaorientale/assets/public/config.json",
    "git add -f static/zonaorientale/assets/snapshots/honor.json",
    "git add -f static/zonaorientale/assets/snapshots/seasons/manifest.json",
    "git add -f static/zonaorientale/assets/snapshots/seasons/*.json",
    "git add -f static/zonaorientale/assets/rose/manifest.json static/zonaorientale/assets/rose/*.json",
    "git add -f static/zonaorientale/assets/listoni/manifest.json static/zonaorientale/assets/listoni/*.json",
    "git add -f static/zonaorientale/assets/competitions/manifest.json static/zonaorientale/assets/competitions/**/*.json",
    "git commit -m \"Update ZonaOrientale static public data\"",
    "git push",
    "git checkout master",
    "git pull --ff-only origin master",
    "git merge --no-ff feature/zonaorientale-v187-next",
    "git push origin master",
    "git checkout feature/zonaorientale-v187-next"
  ].join("\n");
}

function getPublishWizardRuntimeV191(statusPayload = null) {
  const items = getPublishWizardPendingItemsV191();
  const actions = getPublishWizardActionsV191(items);
  const preflightSummary = statusPayload?.preflightSummary || null;
  const statusSummary = statusPayload?.summary || null;
  const hasPending = items.length > 0;
  const needsAssets = hasPending || (statusSummary && (statusSummary.warn > 0 || statusSummary.error > 0));
  return {
    checkedAt: new Date().toISOString(),
    pendingItems: items,
    actions,
    preflightSummary,
    statusSummary,
    needsAssets,
    commands: getPublishWizardCommandsV191()
  };
}

function formatPublishWizardDateV191(value) {
  if (typeof normalizePreflightDateV179 === "function") return normalizePreflightDateV179(value);
  try {
    return new Date(value).toLocaleString("it-IT");
  } catch (error) {
    return "non disponibile";
  }
}

function renderPublishWizardActionListV191(actions) {
  if (!actions?.length) return `<li>Nessuna azione specifica pendente rilevata. Esegui comunque i controlli prima del deploy.</li>`;
  return actions.map((action) => `<li>${escapeHtml(action)}</li>`).join("");
}

function renderPublishWizardPendingListV191(items) {
  if (!items?.length) return `<p class="muted">Nessun promemoria admin pendente. Se hai appena modificato dati, premi Aggiorna stato pubblicazione per confermare.</p>`;
  return `
    <div class="publish-wizard-pending-v191">
      ${items.map((item) => `
        <article>
          <strong>${escapeHtml(item.title || "Aggiornamento dati")}</strong>
          <p>${escapeHtml(item.detail || "Dati modificati da pubblicare nei JSON statici.")}</p>
          <small>Ultimo avviso: ${escapeHtml(formatPublishWizardDateV191(item.updatedAt || item.createdAt))}</small>
        </article>`).join("")}
    </div>`;
}

function renderPublishWizardCommandsV191(commands) {
  return `<pre class="publish-wizard-code-v191"><code>${escapeHtml(commands || "")}</code></pre>`;
}

function renderPublishWizardHtmlV191(payload = null) {
  const runtime = payload || getPublishWizardRuntimeV191(readPublicationStatusV190?.());
  const checkedAt = runtime.checkedAt ? formatPublishWizardDateV191(runtime.checkedAt) : "non ancora generato";
  const statusSummary = runtime.statusSummary || { ok: 0, warn: 0, error: 0 };
  const preflightSummary = runtime.preflightSummary || null;
  const badgeClass = runtime.needsAssets ? "is-warn" : "is-ok";
  const badgeText = runtime.needsAssets ? "Azioni da verificare" : "Nessuna azione pendente";
  return `
    <section class="panel publish-wizard-v191" aria-labelledby="publishWizardTitleV191">
      <div class="panel-header compact">
        <div>
          <p class="eyebrow">Pubblicazione dati</p>
          <h3 id="publishWizardTitleV191">Procedura guidata Pubblica aggiornamenti</h3>
          <p>Segui i passaggi dopo modifiche admin: snapshot Firebase, JSON statici, commit, push e master.</p>
        </div>
        <span class="publish-wizard-badge-v191 ${badgeClass}">${escapeHtml(badgeText)}</span>
      </div>
      <div class="publish-wizard-summary-v191">
        <span>Promemoria: <strong>${escapeHtml(String(runtime.pendingItems?.length || 0))}</strong></span>
        <span>Status: <strong>${escapeHtml(String(statusSummary.ok || 0))}</strong> OK / <strong>${escapeHtml(String(statusSummary.warn || 0))}</strong> warning / <strong>${escapeHtml(String(statusSummary.error || 0))}</strong> errori</span>
        <small>Ultimo piano: ${escapeHtml(checkedAt)}</small>
      </div>
      <div class="form-actions publish-wizard-actions-v191">
        <button class="button button-primary" type="button" data-run-publish-wizard-v191>Genera piano pubblicazione</button>
        <button class="button button-secondary" type="button" data-copy-publish-wizard-v191="flow">Copia flusso</button>
        <button class="button button-secondary" type="button" data-copy-publish-wizard-v191="commands">Copia comandi Git</button>
      </div>
      <div class="publish-wizard-grid-v191">
        <article>
          <span class="publish-wizard-step-v191">1</span>
          <h4>Modifica e snapshot</h4>
          <p>Carica dati amministrazione, modifica i dati, poi vai in Snapshot pubblici e premi Aggiorna tutto.</p>
        </article>
        <article>
          <span class="publish-wizard-step-v191">2</span>
          <h4>Scarica JSON statici</h4>
          <ul>${renderPublishWizardActionListV191(runtime.actions)}</ul>
        </article>
        <article>
          <span class="publish-wizard-step-v191">3</span>
          <h4>Applica nella repo</h4>
          <p>Estrai gli overlay dalla root della repo e sostituisci eventuali file singoli, come config.json o honor.json.</p>
        </article>
        <article>
          <span class="publish-wizard-step-v191">4</span>
          <h4>Commit, push e master</h4>
          <p>Usa i comandi sotto, poi controlla su GitHub che il branch e master siano aggiornati.</p>
        </article>
      </div>
      <div class="publish-wizard-section-v191">
        <h4>Promemoria rilevati</h4>
        ${renderPublishWizardPendingListV191(runtime.pendingItems)}
      </div>
      <div class="publish-wizard-section-v191">
        <h4>Comandi utili</h4>
        ${renderPublishWizardCommandsV191(runtime.commands)}
        <p class="muted">I comandi con <code>git add -f</code> sono volutamente ampi: Git aggiunge solo i file esistenti/modificati.</p>
      </div>
      <div class="publish-wizard-section-v191">
        <h4>Controllo finale</h4>
        <p>Prima del merge su master, esegui Controlla asset pubblici e Checklist online finale. Se il preflight segnala errori, sistema i JSON prima del push master.</p>
        <p class="muted">Asset preflight: ${escapeHtml(preflightSummary ? `${preflightSummary.ok || 0} OK, ${preflightSummary.warn || 0} warning, ${preflightSummary.error || 0} errori` : "non ancora eseguito")}</p>
      </div>
    </section>`;
}

function writePublishWizardPayloadV191(payload) {
  state.publishWizardV191 = payload;
  try {
    sessionStorage.setItem(PUBLISH_WIZARD_STORAGE_KEY_V191, JSON.stringify(payload));
  } catch (error) {
    console.warn("Impossibile salvare il piano pubblicazione", error);
  }
}

function readPublishWizardPayloadV191() {
  try {
    const raw = sessionStorage.getItem(PUBLISH_WIZARD_STORAGE_KEY_V191);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    console.warn("Impossibile leggere il piano pubblicazione", error);
  }
  return state.publishWizardV191 || null;
}

async function buildPublishWizardPayloadV191(options = {}) {
  let statusPayload = null;
  try {
    if (typeof runPublicationStatusV190 === "function") {
      statusPayload = await runPublicationStatusV190({ silent: true });
    }
  } catch (error) {
    console.warn("Stato pubblicazione non disponibile per procedura guidata", error);
  }
  const payload = getPublishWizardRuntimeV191(statusPayload || readPublicationStatusV190?.());
  writePublishWizardPayloadV191(payload);
  if (!options.silent) renderPublishWizardPanelV191(payload);
  return payload;
}

function getPublishWizardCopyTextV191(kind = "flow") {
  const payload = readPublishWizardPayloadV191() || getPublishWizardRuntimeV191(readPublicationStatusV190?.());
  if (kind === "commands") return payload.commands || getPublishWizardCommandsV191();
  const actions = payload.actions?.length ? payload.actions.map((item, index) => `${index + 1}. ${item}`).join("\n") : "Nessuna azione specifica pendente.";
  return [
    "Flusso Pubblica aggiornamenti ZonaOrientale",
    "",
    "1. Admin > Carica dati amministrazione",
    "2. Esegui modifiche/cancellazioni/pubblicazioni dati",
    "3. Admin > Snapshot pubblici > Aggiorna tutto",
    "4. Scarica i JSON/overlay richiesti:",
    actions,
    "5. Applica overlay/file statici nella repo",
    "6. Commit + push branch attuale",
    "7. Merge + push su master",
    "",
    "Comandi:",
    payload.commands || getPublishWizardCommandsV191()
  ].join("\n");
}

async function copyPublishWizardTextV191(kind, button) {
  const text = getPublishWizardCopyTextV191(kind);
  try {
    await navigator.clipboard.writeText(text);
    const original = button?.textContent;
    if (button) {
      button.textContent = "Copiato";
      window.setTimeout(() => { button.textContent = original || "Copia"; }, 1200);
    }
  } catch (error) {
    console.warn("Copia non riuscita", error);
    window.prompt("Copia manualmente il testo", text);
  }
}

function renderPublishWizardPanelV191(payload = readPublishWizardPayloadV191()) {
  if (!state.isAdmin) return;
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;
  let holder = adminPanel.querySelector("#publishWizardMountV191");
  if (!holder) {
    holder = document.createElement("div");
    holder.id = "publishWizardMountV191";
    const status = adminPanel.querySelector("#publicationStatusMountV190");
    if (status) status.insertAdjacentElement("afterend", holder);
    else adminPanel.insertAdjacentElement("afterbegin", holder);
  }
  holder.innerHTML = renderPublishWizardHtmlV191(payload);
}

const renderAdminAreaBeforeV191 = renderAdminArea;
renderAdminArea = function renderAdminAreaV191() {
  const result = renderAdminAreaBeforeV191?.();
  renderPublishWizardPanelV191();
  return result;
};

const renderAdminLightGateBeforeV191 = typeof renderAdminLightGateV178 === "function" ? renderAdminLightGateV178 : null;
if (renderAdminLightGateBeforeV191) {
  renderAdminLightGateV178 = function renderAdminLightGateV191() {
    const html = renderAdminLightGateBeforeV191() || "";
    if (html.includes("publishWizardMountV191")) return html;
    return `<div id="publishWizardMountV191">${renderPublishWizardHtmlV191(readPublishWizardPayloadV191())}</div>${html}`;
  };
}

document.addEventListener("click", async (event) => {
  const runButton = event.target.closest?.("[data-run-publish-wizard-v191]");
  if (runButton) {
    const previous = runButton.textContent;
    runButton.disabled = true;
    runButton.textContent = "Generazione...";
    try {
      await buildPublishWizardPayloadV191();
    } finally {
      runButton.disabled = false;
      runButton.textContent = previous || "Genera piano pubblicazione";
    }
    return;
  }
  const copyButton = event.target.closest?.("[data-copy-publish-wizard-v191]");
  if (copyButton) {
    await copyPublishWizardTextV191(copyButton.dataset.copyPublishWizardV191 || "flow", copyButton);
  }
});

function injectPublishWizardStylesV191() {
  if (document.getElementById("publishWizardStylesV191")) return;
  const style = document.createElement("style");
  style.id = "publishWizardStylesV191";
  style.textContent = `
    .publish-wizard-v191 { border: 1px solid rgba(16,185,129,.28); background: rgba(16,185,129,.055); }
    .publish-wizard-badge-v191 { align-self: flex-start; border-radius: 999px; padding: .35rem .7rem; font-size: .78rem; font-weight: 800; border: 1px solid rgba(255,255,255,.14); white-space: nowrap; }
    .publish-wizard-badge-v191.is-ok { background: rgba(34,197,94,.16); color: #bbf7d0; }
    .publish-wizard-badge-v191.is-warn { background: rgba(245,158,11,.18); color: #fde68a; }
    .publish-wizard-summary-v191 { display: flex; flex-wrap: wrap; gap: .55rem; margin: .85rem 0 1rem; align-items: center; }
    .publish-wizard-summary-v191 span, .publish-wizard-summary-v191 small { border: 1px solid rgba(255,255,255,.12); border-radius: 999px; padding: .32rem .65rem; background: rgba(15,23,42,.45); overflow-wrap: anywhere; }
    .publish-wizard-summary-v191 small { color: var(--muted); }
    .publish-wizard-actions-v191 { gap: .6rem; flex-wrap: wrap; }
    .publish-wizard-grid-v191 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; margin-top: 1rem; }
    .publish-wizard-grid-v191 article, .publish-wizard-pending-v191 article { border: 1px solid rgba(255,255,255,.12); border-radius: 1rem; padding: .85rem; background: rgba(15,23,42,.58); min-width: 0; }
    .publish-wizard-grid-v191 h4, .publish-wizard-section-v191 h4 { margin: .35rem 0 .45rem; overflow-wrap: anywhere; }
    .publish-wizard-grid-v191 p, .publish-wizard-grid-v191 li, .publish-wizard-section-v191 p, .publish-wizard-section-v191 li { overflow-wrap: anywhere; }
    .publish-wizard-grid-v191 ul { margin: .4rem 0 0; padding-left: 1.1rem; }
    .publish-wizard-step-v191 { display: inline-flex; align-items: center; justify-content: center; width: 1.7rem; height: 1.7rem; border-radius: 999px; background: rgba(16,185,129,.18); border: 1px solid rgba(16,185,129,.35); font-weight: 900; }
    .publish-wizard-section-v191 { margin-top: 1rem; min-width: 0; }
    .publish-wizard-pending-v191 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .65rem; }
    .publish-wizard-pending-v191 strong, .publish-wizard-pending-v191 p, .publish-wizard-pending-v191 small { overflow-wrap: anywhere; }
    .publish-wizard-code-v191 { max-width: 100%; overflow-x: auto; white-space: pre-wrap; word-break: break-word; border: 1px solid rgba(255,255,255,.12); border-radius: .9rem; padding: .85rem; background: rgba(2,6,23,.82); }
    .publish-wizard-code-v191 code { white-space: pre-wrap; word-break: break-word; }
    @media (max-width: 980px) {
      .publish-wizard-grid-v191 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 760px) {
      .publish-wizard-v191 { margin-inline: 0; }
      .publish-wizard-v191 .panel-header { align-items: stretch; }
      .publish-wizard-badge-v191 { width: 100%; text-align: center; white-space: normal; }
      .publish-wizard-summary-v191 span, .publish-wizard-summary-v191 small { width: 100%; text-align: center; }
      .publish-wizard-actions-v191 { flex-direction: column; align-items: stretch; }
      .publish-wizard-actions-v191 .button { width: 100%; }
      .publish-wizard-grid-v191, .publish-wizard-pending-v191 { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

injectPublishWizardStylesV191();

const renderAdminHelpPanelBeforeV191 = renderAdminHelpPanelV185;
renderAdminHelpPanelV185 = function renderAdminHelpPanelV191() {
  let html = renderAdminHelpPanelBeforeV191?.() || "";
  if (html && !html.includes("Procedura guidata Pubblica aggiornamenti")) {
    html = html.replace("<article>\n          <h4>Stato Firebase / JSON</h4>", "<article>\n          <h4>Procedura guidata Pubblica aggiornamenti</h4>\n          <p>Trasforma promemoria e semafori in passaggi operativi: aggiorna snapshot, scarica JSON statici, applica overlay, commit, push e merge su master.</p>\n        </article>\n        <article>\n          <h4>Stato Firebase / JSON</h4>");
  }
  return html;
};

window.ZonaOrientalePublishWizard = {
  build(options = {}) {
    return buildPublishWizardPayloadV191({ ...options, silent: options.silent ?? false });
  },
  last() {
    return readPublishWizardPayloadV191();
  },
  commands() {
    return getPublishWizardCommandsV191();
  },
  copy(kind = "flow") {
    return copyPublishWizardTextV191(kind, null);
  }
};


/* V192 - Dashboard Presidente evoluta: riepilogo operativo in Area squadra.
   Non aggiunge letture Firebase all'avvio: usa solo i dati gia presenti in memoria
   e mantiene il Fantamercato lazy finche il presidente non apre Mercato. */
function getPresidentDashboardDateValueV192(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  if (typeof value?.toDate === "function") {
    try { return value.toDate().getTime(); } catch (error) { return 0; }
  }
  return 0;
}

function formatPresidentDashboardDateV192(value) {
  const timestamp = getPresidentDashboardDateValueV192(value);
  if (!timestamp) return "-";
  try {
    return new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "2-digit", year: "2-digit" }).format(new Date(timestamp));
  } catch (error) {
    return String(value || "-");
  }
}

function getPresidentDashboardSeasonTeamV192(approved) {
  if (!approved?.seasonTeamId) return null;
  return typeof getSeasonTeamById === "function" ? getSeasonTeamById(approved.seasonTeamId) : null;
}

function getPresidentDashboardRosterV192(approved) {
  const seasonTeam = getPresidentDashboardSeasonTeamV192(approved);
  if (!seasonTeam) return [];
  try {
    const roster = typeof getRosterForSeasonTeam === "function" ? getRosterForSeasonTeam(seasonTeam) : [];
    return Array.isArray(roster) ? roster : [];
  } catch (error) {
    console.warn("Dashboard presidente: rosa non disponibile", error);
    return [];
  }
}

function getPresidentDashboardRecentMovementsV192(seasonTeamId, limit = 5) {
  const seasonId = typeof getCurrentSeasonId === "function" ? getCurrentSeasonId() : "";
  return (state.raw?.fmMovements || [])
    .filter((item) => item.seasonTeamId === seasonTeamId && (!seasonId || item.seasonId === seasonId))
    .sort((a, b) => getPresidentDashboardDateValueV192(b.date || b.createdAt || b.updatedAt) - getPresidentDashboardDateValueV192(a.date || a.createdAt || a.updatedAt))
    .slice(0, limit);
}

function getPresidentDashboardRecentNewsV192(seasonTeamId, limit = 3) {
  const seasonId = typeof getCurrentSeasonId === "function" ? getCurrentSeasonId() : "";
  return (state.raw?.news || [])
    .filter((item) => (!seasonId || !item.seasonId || item.seasonId === seasonId) && item.seasonTeamId === seasonTeamId)
    .sort((a, b) => getPresidentDashboardDateValueV192((typeof getNewsRawDateValueV79 === "function" ? getNewsRawDateValueV79(b) : b.date) || b.createdAt) - getPresidentDashboardDateValueV192((typeof getNewsRawDateValueV79 === "function" ? getNewsRawDateValueV79(a) : a.date) || a.createdAt))
    .slice(0, limit);
}

function getPresidentDashboardCompetitionNameV192(competitionId) {
  const competition = (state.raw?.competitions || []).find((item) => item.id === competitionId);
  if (!competition) return "Competizione";
  if (typeof getCompetitionPublicDisplayNameV110 === "function") return getCompetitionPublicDisplayNameV110(competition);
  if (typeof getCompetitionDisplayNameV111 === "function") return getCompetitionDisplayNameV111(competition);
  return competition.name || competition.code || "Competizione";
}

function getPresidentDashboardMatchesV192(seasonTeamId, limit = 4) {
  const seasonId = typeof getCurrentSeasonId === "function" ? getCurrentSeasonId() : "";
  return (state.raw?.competitionMatches || [])
    .filter((match) => (!seasonId || !match.seasonId || match.seasonId === seasonId) && (match.homeSeasonTeamId === seasonTeamId || match.awaySeasonTeamId === seasonTeamId))
    .sort((a, b) => getPresidentDashboardDateValueV192(b.matchDate || b.date || b.updatedAt || b.createdAt) - getPresidentDashboardDateValueV192(a.matchDate || a.date || a.updatedAt || a.createdAt))
    .slice(0, limit);
}

function renderPresidentDashboardMetricV192(label, value, hint = "") {
  return `
    <article class="president-dashboard-metric-v192">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      ${hint ? `<small>${escapeHtml(hint)}</small>` : ""}
    </article>`;
}

function renderPresidentDashboardMovementsV192(movements) {
  if (!movements.length) return `<p class="muted">Nessun movimento FM recente.</p>`;
  return `
    <div class="president-dashboard-list-v192">
      ${movements.map((movement) => `
        <article>
          <strong>${escapeHtml(movement.playerName || movement.description || "Movimento FM")}</strong>
          <span>${escapeHtml(formatPresidentDashboardDateV192(movement.date || movement.createdAt))} · ${escapeHtml(movement.type || "FM")} · ${escapeHtml(typeof formatFm === "function" ? formatFm(movement.amount || 0) : String(movement.amount || 0))}</span>
        </article>`).join("")}
    </div>`;
}

function renderPresidentDashboardMatchesV192(matches, seasonTeamId) {
  if (!matches.length) return `<p class="muted">Nessuna partita recente o programmata trovata.</p>`;
  return `
    <div class="president-dashboard-list-v192">
      ${matches.map((match) => {
        const home = typeof getSeasonTeamDisplayName === "function" ? getSeasonTeamDisplayName(match.homeSeasonTeamId) : (match.homeTeamName || "Casa");
        const away = typeof getSeasonTeamDisplayName === "function" ? getSeasonTeamDisplayName(match.awaySeasonTeamId) : (match.awayTeamName || "Trasferta");
        const result = (typeof hasMatchGoalsV114 === "function" && hasMatchGoalsV114(match) && typeof renderMatchResultHtmlV114 === "function")
          ? renderMatchResultHtmlV114(match)
          : escapeHtml(formatPresidentDashboardDateV192(match.matchDate || match.date));
        const ownSide = match.homeSeasonTeamId === seasonTeamId ? "Casa" : "Trasferta";
        return `
          <article>
            <strong>${escapeHtml(home || "Casa")} - ${escapeHtml(away || "Trasferta")}</strong>
            <span>${escapeHtml(getPresidentDashboardCompetitionNameV192(match.competitionId))} · ${escapeHtml(ownSide)} · ${result}</span>
          </article>`;
      }).join("")}
    </div>`;
}

function renderPresidentDashboardNewsV192(news) {
  if (!news.length) return `<p class="muted">Nessun comunicato squadra recente.</p>`;
  return `
    <div class="president-dashboard-list-v192">
      ${news.map((item) => {
        const rawDate = typeof getNewsRawDateValueV79 === "function" ? getNewsRawDateValueV79(item) : (item.date || item.createdAt);
        const formatted = typeof formatNewsDateTimeV79 === "function" ? formatNewsDateTimeV79(rawDate) : formatPresidentDashboardDateV192(rawDate);
        return `
          <article>
            <strong>${escapeHtml(item.title || "Comunicato squadra")}</strong>
            <span>${escapeHtml(formatted || "-")}</span>
          </article>`;
      }).join("")}
    </div>`;
}

function renderPresidentDashboardV192(approved) {
  if (!approved?.seasonTeamId) return "";
  const seasonTeam = getPresidentDashboardSeasonTeamV192(approved);
  const teamName = (typeof getSeasonTeamDisplayName === "function" ? getSeasonTeamDisplayName(approved.seasonTeamId) : "") || approved.teamName || "La mia squadra";
  const roster = getPresidentDashboardRosterV192(approved);
  const fmBalance = typeof getTeamFmBalance === "function" ? getTeamFmBalance(approved.seasonTeamId) : null;
  const marketLoaded = Boolean(state.transferMarketLoadedV119 || state.transferMarketLoadedV170);
  const seasonId = typeof getCurrentSeasonId === "function" ? getCurrentSeasonId() : "";
  const listings = (marketLoaded && typeof getActiveTransferListingsV119 === "function")
    ? getActiveTransferListingsV119(seasonId).filter((item) => item.seasonTeamId === approved.seasonTeamId).length
    : null;
  const negotiations = marketLoaded
    ? (state.raw?.transferNegotiations || []).filter((item) => item.seasonId === seasonId && (item.fromSeasonTeamId === approved.seasonTeamId || item.toSeasonTeamId === approved.seasonTeamId) && String(item.status || "PENDING").toUpperCase() === "PENDING").length
    : null;
  const movements = getPresidentDashboardRecentMovementsV192(approved.seasonTeamId, 5);
  const matches = getPresidentDashboardMatchesV192(approved.seasonTeamId, 4);
  const news = getPresidentDashboardRecentNewsV192(approved.seasonTeamId, 3);
  const presidentNames = typeof getSeasonTeamPresidentNames === "function" ? getSeasonTeamPresidentNames(seasonTeam) : (approved.presidentName || getCurrentUserDisplayName());

  return `
    <section id="presidentDashboardV192" class="panel president-dashboard-v192" aria-labelledby="presidentDashboardTitleV192">
      <div class="panel-header compact president-dashboard-header-v192">
        <div>
          <p class="eyebrow">Dashboard presidente</p>
          <h2 id="presidentDashboardTitleV192">${escapeHtml(teamName)}</h2>
          <p>${escapeHtml(presidentNames || "-")} · ${escapeHtml(seasonId || "Stagione corrente")}</p>
        </div>
        <div class="president-dashboard-actions-v192">
          <button class="button button-secondary button-small" type="button" data-open-team-profile="${escapeHtml(approved.seasonTeamId)}">Pagina squadra</button>
          <button class="button button-secondary button-small" type="button" data-v42-page-link="clubs">Tutte le rose</button>
          <button class="button button-primary button-small" type="button" data-v42-page-link="fantamercato">Mercato</button>
        </div>
      </div>
      <div class="president-dashboard-metrics-v192">
        ${renderPresidentDashboardMetricV192("Saldo FM", fmBalance !== null && fmBalance !== undefined ? formatFm(fmBalance) : "-", "saldo squadra")}
        ${renderPresidentDashboardMetricV192("Rosa", `${roster.length}/30`, roster.length > 30 ? "oltre limite" : "giocatori")}
        ${renderPresidentDashboardMetricV192("In vendita", listings === null ? "lazy" : String(listings), listings === null ? "apri Mercato per caricare" : "giocatori")}
        ${renderPresidentDashboardMetricV192("Trattative", negotiations === null ? "lazy" : String(negotiations), negotiations === null ? "caricate nel Mercato" : "aperte")}
      </div>
      <div class="president-dashboard-content-v192">
        <article>
          <div class="president-dashboard-card-title-v192"><span>💰</span><h3>Ultimi movimenti FM</h3></div>
          ${renderPresidentDashboardMovementsV192(movements)}
        </article>
        <article>
          <div class="president-dashboard-card-title-v192"><span>🏆</span><h3>Partite squadra</h3></div>
          ${renderPresidentDashboardMatchesV192(matches, approved.seasonTeamId)}
        </article>
        <article>
          <div class="president-dashboard-card-title-v192"><span>📰</span><h3>Comunicati squadra</h3></div>
          ${renderPresidentDashboardNewsV192(news)}
        </article>
      </div>
      <p class="muted president-dashboard-note-v192">La dashboard non aggiunge letture Firebase all'avvio: il mercato resta lazy e viene caricato solo quando apri Mercato o Area squadra operativa.</p>
    </section>`;
}

function injectPresidentDashboardV192() {
  const target = document.getElementById("teamAreaBody");
  const approved = typeof getApprovedTeamUser === "function" ? getApprovedTeamUser() : null;
  const existing = document.getElementById("presidentDashboardV192");
  if (existing) existing.remove();
  if (!target || !state.user || !approved?.seasonTeamId) return;
  const summary = target.querySelector(".team-area-summary-panel") || target.querySelector(".panel");
  if (!summary) return;
  summary.insertAdjacentHTML("afterend", renderPresidentDashboardV192(approved));
}

const renderUserAreaBeforeV192 = renderUserAreaV34;
renderUserAreaV34 = function renderUserAreaV192() {
  const result = renderUserAreaBeforeV192?.();
  injectPresidentDashboardV192();
  return result;
};

const renderAllBeforeV192 = renderAll;
renderAll = function renderAllV192() {
  const result = renderAllBeforeV192?.();
  injectPresidentDashboardV192();
  return result;
};

function injectPresidentDashboardStylesV192() {
  if (document.getElementById("presidentDashboardStylesV192")) return;
  const style = document.createElement("style");
  style.id = "presidentDashboardStylesV192";
  style.textContent = `
    .president-dashboard-v192 { border: 1px solid rgba(59,130,246,.28); background: linear-gradient(135deg, rgba(15,23,42,.92), rgba(30,41,59,.78)); }
    .president-dashboard-header-v192 { gap: 1rem; align-items: flex-start; }
    .president-dashboard-actions-v192 { display: flex; flex-wrap: wrap; gap: .55rem; justify-content: flex-end; }
    .president-dashboard-metrics-v192 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .75rem; margin: 1rem 0; }
    .president-dashboard-metric-v192 { min-width: 0; border: 1px solid rgba(255,255,255,.12); border-radius: 1rem; padding: .85rem; background: rgba(2,6,23,.45); }
    .president-dashboard-metric-v192 span, .president-dashboard-metric-v192 small { display: block; color: var(--muted); overflow-wrap: anywhere; }
    .president-dashboard-metric-v192 strong { display: block; margin: .22rem 0; font-size: 1.35rem; overflow-wrap: anywhere; }
    .president-dashboard-content-v192 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .85rem; }
    .president-dashboard-content-v192 > article { min-width: 0; border: 1px solid rgba(255,255,255,.12); border-radius: 1rem; padding: .9rem; background: rgba(15,23,42,.58); }
    .president-dashboard-card-title-v192 { display: flex; align-items: center; gap: .45rem; margin-bottom: .7rem; }
    .president-dashboard-card-title-v192 h3 { margin: 0; font-size: 1rem; }
    .president-dashboard-list-v192 { display: grid; gap: .55rem; }
    .president-dashboard-list-v192 article { border-radius: .8rem; padding: .65rem; background: rgba(255,255,255,.055); min-width: 0; }
    .president-dashboard-list-v192 strong, .president-dashboard-list-v192 span { display: block; overflow-wrap: anywhere; }
    .president-dashboard-list-v192 span { color: var(--muted); font-size: .88rem; margin-top: .15rem; }
    .president-dashboard-note-v192 { margin-top: .85rem; }
    @media (max-width: 980px) {
      .president-dashboard-metrics-v192 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .president-dashboard-content-v192 { grid-template-columns: 1fr; }
    }
    @media (max-width: 760px) {
      .president-dashboard-v192 { margin-inline: 0; }
      .president-dashboard-header-v192 { align-items: stretch; }
      .president-dashboard-actions-v192 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); width: 100%; }
      .president-dashboard-actions-v192 .button { width: 100%; min-width: 0; padding-inline: .45rem; }
      .president-dashboard-metrics-v192 { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .55rem; }
      .president-dashboard-metric-v192 { padding: .72rem; }
      .president-dashboard-metric-v192 strong { font-size: 1.12rem; }
    }
    @media (max-width: 420px) {
      .president-dashboard-actions-v192 { grid-template-columns: 1fr; }
      .president-dashboard-metrics-v192 { grid-template-columns: 1fr; }
    }
  `;
  document.head.appendChild(style);
}

injectPresidentDashboardStylesV192();

const renderAdminHelpPanelBeforeV192 = renderAdminHelpPanelV185;
renderAdminHelpPanelV185 = function renderAdminHelpPanelV192() {
  let html = renderAdminHelpPanelBeforeV192?.() || "";
  if (html && !html.includes("Dashboard presidente")) {
    html = html.replace("</div>\n    </section>", "        <article>\n          <h4>Dashboard presidente</h4>\n          <p>Riepilogo operativo per presidenti: saldo FM, rosa, mercato lazy, trattative, movimenti, partite e comunicati squadra. Mobile-first e senza letture Firebase aggiuntive all'avvio.</p>\n        </article>\n      </div>\n    </section>");
  }
  return html;
};


/* V192 - Final startup remains centralized here. */
startZonaOrientaleAppV173();
