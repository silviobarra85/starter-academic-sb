import {
  db,
  auth,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "./firebase.js";

const COLLECTIONS = [
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
  "fifaRankings"
];

const COMPETITION_TYPES = [
  { value: "CAMPIONATO", label: "Campionato" },
  { value: "COPPA_ITALIA", label: "Coppa Italia" },
  { value: "CHAMPIONS_LEAGUE", label: "Champion's League" },
  { value: "PLAYOFF", label: "Playoff" },
  { value: "ALTRO", label: "Altro" }
];

const COMPETITION_FORMATS = [
  { value: "CLASSIFICA", label: "A classifica" },
  { value: "GIRONI_KO", label: "A gironi + quarti/semifinali/finale" }
];

const COMPETITION_STATUSES = [
  { value: "ATTIVA", label: "Attiva" },
  { value: "PROGRAMMATA", label: "Programmata" },
  { value: "CONCLUSA", label: "Conclusa" },
  { value: "NON_DISPUTATA", label: "Non disputata" }
];

const DEFAULT_COMPETITIONS = [
  {
    idSuffix: "campionato",
    name: "Campionato",
    type: "CAMPIONATO",
    format: "CLASSIFICA",
    status: "PROGRAMMATA"
  },
  {
    idSuffix: "champions-league",
    name: "Champion's League",
    type: "CHAMPIONS_LEAGUE",
    format: "GIRONI_KO",
    status: "PROGRAMMATA"
  },
  {
    idSuffix: "coppa-italia",
    name: "Coppa Italia",
    type: "COPPA_ITALIA",
    format: "GIRONI_KO",
    status: "PROGRAMMATA"
  },
  {
    idSuffix: "playoff",
    name: "Playoff",
    type: "PLAYOFF",
    format: "GIRONI_KO",
    status: "PROGRAMMATA"
  }
];

const MATCH_STATUSES = [
  { value: "DA_GIOCARE", label: "Da giocare" },
  { value: "GIOCATA", label: "Giocata" }
];

const STANDARD_KNOCKOUT_MATCHDAYS = [
  "QF - Andata",
  "QF - Ritorno",
  "QF - Secca",
  "SF - Andata",
  "SF - Ritorno",
  "SF - Secca",
  "Finale - Andata",
  "Finale - Ritorno",
  "Finalissima"
];

const STADIUM_LEVELS = [
  { value: 0, label: "Livello 0" },
  { value: 1, label: "Livello 1" },
  { value: 2, label: "Livello 2" },
  { value: 3, label: "Livello 3" },
  { value: 4, label: "Livello 4" }
];

const ADMIN_PANEL_IDS = [
  "adminSeasonsPanel",
  "adminPresidentsPanel",
  "adminTeamsPanel",
  "adminSeasonTeamsPanel",
  "adminStadiumsPanel",
  "adminCompetitionsPanel",
  "adminCompetitionMatchesPanel",
  "adminCompetitionResultsPanel",
  "adminFifaRankingPanel"
];


const state = {
  raw: Object.fromEntries(COLLECTIONS.map((name) => [name, []])),
  user: null,
  isAdmin: false,
  currentPage: "dashboard",
  selectedSeasonId: "",
  selectedResultCompetitionId: "",
  selectedMatchCompetitionId: "",
  selectedAdminSeasonTeamSeasonId: "",
  selectedAdminStadiumSeasonId: "",
  selectedAdminCompetitionSeasonId: "",
  selectedAdminMatchSeasonId: "",
  selectedAdminMatchdayFilter: "",
  selectedAdminResultsSeasonId: "",
  collapsedAdminPanels: new Set(ADMIN_PANEL_IDS),
  collapsedContentPanels: new Set()
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function byText(fieldName) {
  return (a, b) => String(a[fieldName] || "").localeCompare(String(b[fieldName] || ""), "it");
}

function showMessage(elementId, message, isError = false) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("text-danger", Boolean(isError));
  element.classList.toggle("text-success", !isError && Boolean(message));
}

function setError(message) {
  const box = document.getElementById("errorBox");
  if (!box) return;
  if (!message) {
    box.classList.add("hidden");
    box.textContent = "";
    return;
  }
  box.classList.remove("hidden");
  box.textContent = message;
}

function setLoadingText(targetId, text) {
  const element = document.getElementById(targetId);
  if (element) element.innerHTML = `<p class="muted">${escapeHtml(text)}</p>`;
}

function getLabel(options, value) {
  return options.find((option) => option.value === value)?.label || value || "-";
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

function parseDecimalValue(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim().replace(/\s+/g, "").replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function makeIdPart(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";
}

function getInitials(name) {
  const cleanName = String(name || "?").trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0] || ""}${words[1][0] || ""}`.toUpperCase();
}

function renderTeamLogo(name, logo, extraClass = "") {
  if (logo) {
    return `<img class="club-logo ${extraClass}" src="${escapeHtml(logo)}" alt="" />`;
  }
  return `<span class="club-logo club-logo-placeholder ${extraClass}">${escapeHtml(getInitials(name))}</span>`;
}

function readLogoFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const image = new Image();

      image.addEventListener("load", () => {
        const maxSize = 320;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        context.clearRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);

        resolve(canvas.toDataURL("image/png"));
      });

      image.addEventListener("error", () => reject(new Error("Logo non leggibile.")));
      image.src = reader.result;
    });

    reader.addEventListener("error", () => reject(new Error("Impossibile leggere il file logo.")));
    reader.readAsDataURL(file);
  });
}

async function loadCollection(name) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map((documentSnapshot) => ({
    id: documentSnapshot.id,
    ...documentSnapshot.data()
  }));
}

async function loadData() {
  const entries = await Promise.all(
    COLLECTIONS.map(async (name) => [name, await loadCollection(name)])
  );
  state.raw = Object.fromEntries(entries);
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

function getTeamDisplayName(team) {
  return team?.canonicalName || team?.name || "-";
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

function getWinnerLabel(competition) {
  const results = getCompetitionResults(competition.id);
  const winner = results.find((result) => Number(result.position) === 1);
  const second = results.find((result) => Number(result.position) === 2);

  if (!winner) return "Nessun risultato inserito";

  if (isRankingCompetition(competition)) {
    return `1° ${getSeasonTeamDisplayName(winner.seasonTeamId)}`;
  }

  const secondText = second ? ` · 2° ${getSeasonTeamDisplayName(second.seasonTeamId)}` : "";
  return `Vincitore: ${getSeasonTeamDisplayName(winner.seasonTeamId)}${secondText}`;
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
    return `1° ${winnerHtml}`;
  }

  const secondHtml = second
    ? ` · 2° ${withLogo ? renderSeasonTeamNameWithLogo(second.seasonTeamId) : escapeHtml(getSeasonTeamDisplayName(second.seasonTeamId))}`
    : "";

  return `Vincitore: ${winnerHtml}${secondHtml}`;
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

function formatStadium(stadium) {
  if (!stadium) return "-";
  const name = stadium.name || "Stadio";
  const level = stadium.level ?? 0;
  return `${name} · L${level}`;
}

function getMatchSerieAMatchday(match) {
  const value = Number(match?.serieAMatchday ?? match?.realSerieAMatchday ?? match?.serieAGiornata ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function getCompetitionNameForMatch(match) {
  const { competitionsById } = buildMaps();
  return competitionsById.get(match?.competitionId)?.name || match?.competitionId || "";
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

function formatMatchStage(match) {
  return match?.matchday || "-";
}

function getCompetitionMatches(competitionId) {
  return sortMatchesForDisplay(
    state.raw.competitionMatches.filter((match) => match.competitionId === competitionId)
  );
}

function formatMatchResult(match) {
  if (!match || match.status !== "GIOCATA") return getLabel(MATCH_STATUSES, match?.status) || "Da giocare";
  const goals = match.homeGoals !== null && match.homeGoals !== undefined && match.awayGoals !== null && match.awayGoals !== undefined
    ? `${match.homeGoals}-${match.awayGoals}`
    : "Risultato inserito";
  const scores = match.homeScore !== null && match.homeScore !== undefined && match.awayScore !== null && match.awayScore !== undefined
    ? ` · FP ${match.homeScore}-${match.awayScore}`
    : "";
  return `${goals}${scores}`;
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
              <td data-label="Partita"><span class="match-teams-line">${renderSeasonTeamNameWithLogo(match.homeSeasonTeamId)} <span class="match-separator">-</span> ${renderSeasonTeamNameWithLogo(match.awaySeasonTeamId)}</span></td>
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
  const competitionsById = new Map(competitions.map((competition) => [competition.id, competition]));
  const competitionIds = new Set(competitions.map((competition) => competition.id));

  const matches = sortMatchesForDisplay(
    state.raw.competitionMatches.filter((match) => competitionIds.has(match.competitionId))
  ).slice(0, 16);

  if (!matches.length) {
    target.innerHTML = `<p class="muted">Nessuna partita programmata o giocata per questa stagione.</p>`;
    return;
  }

  const groupedByCompetition = new Map();
  matches.forEach((match) => {
    const competition = competitionsById.get(match.competitionId);
    const key = match.competitionId || "unknown";
    if (!groupedByCompetition.has(key)) {
      groupedByCompetition.set(key, {
        competitionName: competition?.name || "Competizione",
        matches: []
      });
    }
    groupedByCompetition.get(key).matches.push(match);
  });

  target.innerHTML = Array.from(groupedByCompetition.values()).map((group) => `
    <div class="dashboard-calendar-group">
      <h4>${escapeHtml(group.competitionName)}</h4>
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
                <td data-label="Partita"><span class="match-teams-line">${renderSeasonTeamNameWithLogo(match.homeSeasonTeamId)} <span class="match-separator">-</span> ${renderSeasonTeamNameWithLogo(match.awaySeasonTeamId)}</span></td>
                <td data-label="Data">${escapeHtml(match.matchDate || "-")}</td>
                <td data-label="Risultato" class="number">${escapeHtml(formatMatchResult(match))}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`).join("");
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
          <span>${renderSeasonTeamNameWithLogo(match.homeSeasonTeamId, { strong: false })} <span class="match-separator">-</span> ${renderSeasonTeamNameWithLogo(match.awaySeasonTeamId, { strong: false })}</span>
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

  const finalMatches = getFinalMatchesForCompetition(competition);
  if (finalMatches.length) {
    return `<div class="dashboard-competition-summary"><span class="muted">Finale</span>${renderCompactMatchLines(finalMatches)}</div>`;
  }

  return `<div class="dashboard-competition-summary">${renderWinnerLabelHtml(competition, { highlightWinner: true, withLogo: true })}</div>`;
}



function renderAll() {
  renderLeagueHeader();
  renderSeasonSelectors();
  renderDashboard();
  renderTeamsTable();
  renderCompetitionsPublic();
  renderPlaceholderPages();
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
        <div class="stack-item">
          <div>
            <strong>${escapeHtml(competition.name)}</strong>
            ${renderDashboardCompetitionSummary(competition)}
          </div>
          <span class="status ${getCompetitionStatusClass(competition.status)}">${escapeHtml(getLabel(COMPETITION_STATUSES, competition.status))}</span>
        </div>`).join("")
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
        <td data-label="Rosa" class="number">-</td>
        <td data-label="Stadio" class="number">${escapeHtml(formatStadium(stadium))}</td>
        <td data-label="Stato"><span class="status ${statusClass}">${statusText}</span></td>
      </tr>`;
  }).join("");
}

function getCompetitionStatusClass(status) {
  if (status === "ATTIVA") return "status-ok";
  if (status === "PROGRAMMATA") return "status-warning";
  if (status === "CONCLUSA") return "status-muted";
  return "status-danger";
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
        <td data-label="Stagione"><strong>${escapeHtml(season.name || season.id)}</strong></td>
        <td data-label="Campione">${honor.championItalySeasonTeamId ? renderSeasonTeamNameWithLogo(honor.championItalySeasonTeamId) : "-"}</td>
        <td data-label="2° posto">${honor.secondPlaceSeasonTeamId ? renderSeasonTeamNameWithLogo(honor.secondPlaceSeasonTeamId) : "-"}</td>
        <td data-label="3° posto">${honor.thirdPlaceSeasonTeamId ? renderSeasonTeamNameWithLogo(honor.thirdPlaceSeasonTeamId) : "-"}</td>
        <td data-label="Coppa Italia">${honor.coppaItaliaWinnerSeasonTeamId ? renderSeasonTeamNameWithLogo(honor.coppaItaliaWinnerSeasonTeamId) : "-"}</td>
        <td data-label="Champions">${honor.championsLeagueWinnerSeasonTeamId ? renderSeasonTeamNameWithLogo(honor.championsLeagueWinnerSeasonTeamId) : "-"}</td>
        <td data-label="Playoff">${honor.playoffWinnerSeasonTeamId ? renderSeasonTeamNameWithLogo(honor.playoffWinnerSeasonTeamId) : "-"}</td>
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

function renderPlaceholderPages() {
  setLoadingText("newsList", "Modulo News non ancora collegato.");
  setLoadingText("rosterClubCards", "Le rose sono state escluse dalla nuova struttura dati.");
  setLoadingText("listoneTableBody", "Il listone è stato escluso dalla nuova struttura dati.");
  setLoadingText("freeAgentsTableBody", "Gli svincolati sono stati esclusi dalla nuova struttura dati.");
  renderHonorSummary();
  setLoadingText("movementsList", "I movimenti FM sono stati esclusi dalla nuova struttura dati.");
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

  const startPage = window.location.hash.replace("#", "") || "dashboard";
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
      const adminSnapshot = await getDoc(doc(db, "admins", user.uid));
      state.isAdmin = adminSnapshot.exists();
      if (!state.isAdmin) {
        showMessage("loginStatus", "Utente autenticato ma non presente nella raccolta admins.", true);
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
        <input id="adminTeamLogoValue" type="hidden" />
        <label>
          Nome squadra
          <input id="adminTeamName" class="input" type="text" placeholder="Es. Real Pastena" required />
        </label>
        <label>
          Logo squadra
          <input id="adminTeamLogoFile" class="input" type="file" accept="image/*" />
          <small class="field-hint">Carica un'immagine: verrà salvata compressa nel documento Firestore e mostrata tonda.</small>
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
          <input id="adminSeasonTeamLogoFile" class="input" type="file" accept="image/*" />
          <input id="adminSeasonTeamLogoValue" type="hidden" />
          <small class="field-hint">Se lo lasci vuoto usa il logo della squadra madre.</small>
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
          <small>${escapeHtml(formatMatchStage(match))} · ${escapeHtml(match.matchDate || "-")} · ${escapeHtml(getSeasonTeamDisplayName(match.homeSeasonTeamId))} - ${escapeHtml(getSeasonTeamDisplayName(match.awaySeasonTeamId))} · ${escapeHtml(formatMatchResult(match))}</small>
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

  seasonForm?.addEventListener("submit", saveSeason);
  presidentForm?.addEventListener("submit", savePresident);
  teamForm?.addEventListener("submit", saveTeam);
  seasonTeamForm?.addEventListener("submit", saveSeasonTeam);
  stadiumForm?.addEventListener("submit", saveStadium);
  competitionForm?.addEventListener("submit", saveCompetition);
  competitionMatchesForm?.addEventListener("submit", saveCompetitionMatch);
  competitionResultsForm?.addEventListener("submit", saveCompetitionResults);
  fifaRankingForm?.addEventListener("submit", saveFifaRanking);

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
      document.getElementById("adminTeamLogoFile").value = "";
    }
    updateTeamLogoPreview();
  });
  document.getElementById("adminTeamLogoFile")?.addEventListener("change", handleTeamLogoFileChange);
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
      document.getElementById("adminSeasonTeamLogoFile").value = "";
    }
    updateSeasonTeamLogoPreview();
  });
  document.getElementById("adminSeasonTeamLogoFile")?.addEventListener("change", handleSeasonTeamLogoFileChange);
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
    <span class="muted small">${logo ? "Logo caricato" : "Placeholder: prime due lettere"}</span>
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
  const teamLogo = buildMaps().teamsById.get(teamId)?.logo || "";
  const logo = logoValue || teamLogo;

  preview.innerHTML = `
    ${renderTeamLogo(name, logo, "club-logo-lg")}
    <span class="muted small">${logoValue ? "Logo stagionale caricato" : teamLogo ? "Logo ereditato dalla squadra madre" : "Placeholder: prime due lettere"}</span>
  `;
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
    logo: removeLogo ? "" : document.getElementById("adminTeamLogoValue").value,
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
    logo: removeLogo ? "" : document.getElementById("adminSeasonTeamLogoValue").value,
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
  document.getElementById("adminTeamLogoValue").value = team.logo || "";
  document.getElementById("adminTeamLogoFile").value = "";
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
  document.getElementById("adminSeasonTeamLogoValue").value = seasonTeam.logo || "";
  document.getElementById("adminSeasonTeamLogoFile").value = "";
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

function setupSeasonSelectorEvents() {
  const handleChange = (event) => {
    state.selectedSeasonId = event.target.value;
    renderSeasonSelectors();
    renderDashboard();
    renderTeamsTable();
    renderCompetitionsPublic();
    renderStadiumsPublic();
  };

  ["globalSeasonSelect"].forEach((id) => {
    const select = document.getElementById(id);
    select?.addEventListener("change", handleChange);
  });
}

async function initializeAppUi() {
  setupNavigation();
  setupMobileNavigation();
  setupAuth();
  setupSeasonSelectorEvents();
  updateAdminVisibility();

  const loginHelpText = document.querySelector("#loginDialog .muted");
  if (loginHelpText) loginHelpText.textContent = "Accedi con l'utente creato in Firebase Authentication.";

  try {
    await loadData();
    setError("");
  } catch (error) {
    console.error(error);
    setError("Non riesco a leggere Firestore. Controlla configurazione Firebase e Security Rules.");
  }
}

initializeAppUi();
