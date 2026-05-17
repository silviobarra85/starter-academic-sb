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
  "adminFifaRankingPanel",
  "adminListoneToolsPanel",
  "adminBackupPanel"
];

const LISTONE_COLUMNS = [
  { key: "playerName", label: "Nome", numeric: false },
  { key: "classicRole", label: "R (RM)", numeric: false },
  { key: "realTeam", label: "Sq", numeric: false },
  { key: "fantasyRoster", label: "Rosa", numeric: false },
  { key: "quotationCurrent", label: "Qt.A", numeric: true },
  { key: "quotationInitial", label: "Qt.I", numeric: true },
  { key: "quotationDiff", label: "Diff.", numeric: true },
  { key: "quotationCurrentMantra", label: "Qt.A M", numeric: true },
  { key: "quotationInitialMantra", label: "Qt.I M", numeric: true },
  { key: "quotationDiffMantra", label: "Diff.M", numeric: true },
  { key: "fvm", label: "FVM", numeric: true },
  { key: "fvmMantra", label: "FVM M", numeric: true },
  { key: "rosterRole", label: "Ruolo rosa", numeric: false },
  { key: "rosterCost", label: "Costo rosa", numeric: true },
  { key: "status", label: "Stato", numeric: false },
  { key: "sourceSheet", label: "Origine", numeric: false }
];

const DEFAULT_HIDDEN_LISTONE_COLUMNS = [
  "quotationInitialMantra",
  "quotationDiffMantra",
  "fvmMantra",
  "rosterRole",
  "rosterCost",
  "sourceSheet"
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
  selectedListoneId: "",
  selectedClubRosterFilter: "all",
  listoni: [],
  rosters: [],
  listoneSort: { key: "playerName", direction: "asc" },
  freeAgentsSort: { key: "playerName", direction: "asc" },
  rosterSort: { key: "role", direction: "asc" },
  selectedAdminMovementSeasonTeamId: "",
  hiddenListoneColumns: new Set(DEFAULT_HIDDEN_LISTONE_COLUMNS),
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

function normalizeKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[.'’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getTodayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function safeFileName(value) {
  return String(value || "export")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "export";
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

function isBase64Logo(value) {
  return typeof value === "string" && value.trim().startsWith("data:");
}

function normalizeLogoPath(value) {
  const raw = String(value || "").trim();
  if (!raw || isBase64Logo(raw)) return "";
  if (/^(https?:|\/|\.\/|\.\.\/|assets\/)/i.test(raw)) return raw;
  return `./assets/logos/${raw}`;
}

function getLogoPathForInput(value) {
  return isBase64Logo(value) ? "" : String(value || "").trim();
}

function renderTeamLogo(name, logo, extraClass = "") {
  const logoPath = normalizeLogoPath(logo);
  if (logoPath) {
    return `<img class="club-logo ${extraClass}" src="${escapeHtml(logoPath)}" alt="" />`;
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
  try {
    const snapshot = await getDocs(collection(db, name));
    return snapshot.docs.map((documentSnapshot) => ({
      id: documentSnapshot.id,
      ...documentSnapshot.data()
    }));
  } catch (error) {
    const code = error?.code ? `${error.code}: ` : "";
    error.message = `Errore lettura raccolta ${name}. ${code}${error.message || error}`;
    throw error;
  }
}

async function loadListoniData() {
  try {
    const manifestResponse = await fetch("./assets/listoni/manifest.json", { cache: "no-store" });
    if (!manifestResponse.ok) {
      state.listoni = [];
      return;
    }

    const manifest = await manifestResponse.json();
    const entries = Array.isArray(manifest.listoni) ? manifest.listoni : [];

    const loadedListoni = await Promise.all(entries.map(async (entry) => {
      try {
        const response = await fetch(`./assets/listoni/${entry.file}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`Listone non leggibile: ${entry.file}`);
        const payload = await response.json();
        return {
          ...entry,
          meta: payload.meta || {},
          players: Array.isArray(payload.players) ? payload.players : []
        };
      } catch (error) {
        console.warn(error);
        return { ...entry, meta: {}, players: [], loadError: true };
      }
    }));

    state.listoni = loadedListoni.sort((a, b) => String(b.loadedAt || b.id || "").localeCompare(String(a.loadedAt || a.id || ""), "it"));
  } catch (error) {
    console.warn("Listoni non caricati", error);
    state.listoni = [];
  }
}


async function loadRostersData() {
  try {
    const manifestResponse = await fetch("./assets/rose/manifest.json", { cache: "no-store" });
    if (!manifestResponse.ok) {
      state.rosters = [];
      return;
    }

    const manifest = await manifestResponse.json();
    const entries = Array.isArray(manifest.rosters) ? manifest.rosters : [];

    const loadedRosters = await Promise.all(entries.map(async (entry) => {
      try {
        const response = await fetch(`./assets/rose/${entry.file}`, { cache: "no-store" });
        if (!response.ok) throw new Error(`Rose non leggibili: ${entry.file}`);
        const payload = await response.json();
        return {
          ...entry,
          meta: payload.meta || {},
          rosters: Array.isArray(payload.rosters) ? payload.rosters : []
        };
      } catch (error) {
        console.warn(error);
        return { ...entry, meta: {}, rosters: [], loadError: true };
      }
    }));

    state.rosters = loadedRosters.sort((a, b) => String(b.loadedAt || b.id || "").localeCompare(String(a.loadedAt || a.id || ""), "it"));
  } catch (error) {
    console.warn("Rose non caricate", error);
    state.rosters = [];
  }
}

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

function getSeasonName(id) {
  const { seasonsById } = buildMaps();
  return seasonsById.get(id)?.name || id || "-";
}

function formatSeasonShortLabel(season) {
  const raw = String(season?.id || season?.name || "");
  const match = raw.match(/(\d{4})\D+(\d{2,4})/);
  if (!match) return raw || "-";

  const startYear = match[1];
  const endYear = match[2].length === 4 ? match[2].slice(-2) : match[2];
  return `${startYear}-${endYear}`;
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

function getCompetitionShortCode(competition) {
  const type = competition?.type || competition;
  if (type === "CAMPIONATO") return "A";
  if (type === "COPPA_ITALIA") return "CI";
  if (type === "CHAMPIONS_LEAGUE") return "CL";
  if (type === "PLAYOFF") return "PO";
  return String(competition?.name || type || "-").trim().slice(0, 3).toUpperCase() || "-";
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
                <td data-label="Partita"><span class="match-teams-line">${renderSeasonTeamNameWithLogo(match.homeSeasonTeamId)} <span class="match-separator">-</span> ${renderSeasonTeamNameWithLogo(match.awaySeasonTeamId)}</span></td>
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
              <strong>${escapeHtml(competition.name)}</strong>
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

function getListoniForCurrentSeason() {
  const seasonId = getCurrentSeasonId();
  const seasonal = state.listoni.filter((listone) => listone.seasonId === seasonId);
  return seasonal.length ? seasonal : state.listoni;
}

function getSelectedListone() {
  const available = getListoniForCurrentSeason();
  if (!available.length) return null;

  if (state.selectedListoneId) {
    const selected = available.find((listone) => listone.id === state.selectedListoneId);
    if (selected) return enrichListoneWithRosters(selected);
  }

  state.selectedListoneId = available[0].id;
  return enrichListoneWithRosters(available[0]);
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

function formatListoneNumber(value) {
  if (value === null || value === undefined || value === "") return "-";
  return escapeHtml(value);
}

function getListoneValue(player, key) {
  if (key === "fantasyRoster") return player.fantasyRoster || "Svincolati";
  return player[key] ?? "";
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

function compareListoneValues(a, b, column) {
  const valueA = getListoneValue(a, column.key);
  const valueB = getListoneValue(b, column.key);

  if (column.numeric) {
    const numberA = parseDecimalValue(valueA) ?? Number.NEGATIVE_INFINITY;
    const numberB = parseDecimalValue(valueB) ?? Number.NEGATIVE_INFINITY;
    return numberA - numberB;
  }

  return String(valueA || "").localeCompare(String(valueB || ""), "it", { numeric: true, sensitivity: "base" });
}

function getFilteredListonePlayers(listone) {
  if (!listone) return [];
  const role = document.getElementById("listoneRoleFilter")?.value || "all";
  const search = String(document.getElementById("listoneSearch")?.value || "").trim().toLowerCase();

  const filtered = (listone.players || []).filter((player) => {
    if (role !== "all" && player.classicRole !== role) return false;
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

function renderListoneCell(player, column) {
  const value = getListoneValue(player, column.key);

  if (column.key === "playerName") {
    return `<strong>${escapeHtml(value || "-")}</strong>`;
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
    tbody.innerHTML = `<tr><td colspan="${visibleColumns.length || 1}" class="muted center">Nessun listone caricato.</td></tr>`;
    if (metaText) metaText.textContent = "Nessun listone disponibile in assets/listoni.";
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


function loadXlsxLibrary() {
  if (window.XLSX) return Promise.resolve(window.XLSX);

  return new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-xlsx-loader]");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.XLSX));
      existing.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
    script.async = true;
    script.dataset.xlsxLoader = "true";
    script.addEventListener("load", () => window.XLSX ? resolve(window.XLSX) : reject(new Error("SheetJS non disponibile.")));
    script.addEventListener("error", () => reject(new Error("Impossibile caricare la libreria Excel.")));
    document.head.appendChild(script);
  });
}

function abbreviateRealTeam(value) {
  return String(value || "").trim().slice(0, 3).toUpperCase();
}

function toNumberOrValue(value) {
  const parsed = parseDecimalValue(value);
  return parsed === null ? (value ?? "") : parsed;
}

function parseListoneSheetRows(rows, sourceSheet, status, statusCode) {
  const headerIndex = rows.findIndex((row) => row.some((cell) => String(cell || "").trim().toLowerCase() === "nome"));
  if (headerIndex < 0) return [];
  const headers = rows[headerIndex].map((cell) => String(cell || "").trim().toLowerCase());
  const find = (name) => headers.indexOf(name.toLowerCase());
  const idx = {
    id: find("id"),
    role: find("r"),
    mantra: find("rm"),
    name: find("nome"),
    team: find("squadra"),
    qta: find("qt.a"),
    qti: find("qt.i"),
    diff: find("diff."),
    qtam: find("qt.a m"),
    qtim: find("qt.i m"),
    diffm: find("diff.m"),
    fvm: find("fvm"),
    fvmm: find("fvm m")
  };

  return rows.slice(headerIndex + 1)
    .filter((row) => row[idx.name])
    .map((row) => ({
      fantacalcioId: String(row[idx.id] || ""),
      classicRole: String(row[idx.role] || ""),
      mantraRoles: String(row[idx.mantra] || ""),
      playerName: String(row[idx.name] || ""),
      realTeam: abbreviateRealTeam(row[idx.team]),
      quotationCurrent: toNumberOrValue(row[idx.qta]),
      quotationInitial: toNumberOrValue(row[idx.qti]),
      quotationDiff: toNumberOrValue(row[idx.diff]),
      quotationCurrentMantra: toNumberOrValue(row[idx.qtam]),
      quotationInitialMantra: toNumberOrValue(row[idx.qtim]),
      quotationDiffMantra: toNumberOrValue(row[idx.diffm]),
      fvm: toNumberOrValue(row[idx.fvm]),
      fvmMantra: toNumberOrValue(row[idx.fvmm]),
      fantasyRoster: "",
      rosterRole: "",
      rosterCost: "",
      status,
      statusCode,
      sourceSheet
    }));
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
  document.getElementById("listoneRoleFilter")?.addEventListener("change", renderListonePublic);
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

const FM_MOVEMENT_TYPES = [
  { value: "INITIAL_BUDGET", label: "Budget iniziale", player: false, target: false },
  { value: "ACQUISTO", label: "Acquisto", player: true, target: false },
  { value: "VENDITA", label: "Vendita", player: true, target: false },
  { value: "SVINCOLO", label: "Svincolo", player: true, target: false },
  { value: "SCAMBIO", label: "Scambio", player: true, target: true },
  { value: "RETTIFICA", label: "Rettifica", player: false, target: false },
  { value: "BONUS", label: "Bonus", player: false, target: false },
  { value: "PENALITA", label: "Penalità", player: false, target: false },
  { value: "ALTRO", label: "Altro", player: false, target: false }
];

function getFmMovementLabel(type) {
  return FM_MOVEMENT_TYPES.find((item) => item.value === type)?.label || type || "-";
}

function renderFmMovementTypeBadge(type) {
  return `<span class="status status-muted movement-type-badge">${escapeHtml(getFmMovementLabel(type))}</span>`;
}

function normalizePlayerName(value) {
  return normalizeKey(value);
}

function hasFirebaseRostersForSeason(seasonId) {
  return (state.raw.rosterEntries || []).some((entry) => entry.seasonId === seasonId && entry.status !== "REMOVED");
}

function getRosterAliasKeys(seasonTeam) {
  return [
    seasonTeam?.name,
    seasonTeam?.rosterAlias,
    seasonTeam?.rosterName,
    seasonTeam?.excelRosterName,
    seasonTeam?.teamName
  ]
    .filter(Boolean)
    .flatMap((value) => [normalizeKey(value), normalizeRosterKey(value)])
    .filter(Boolean);
}

function normalizeRosterKey(value) {
  return normalizeKey(value)
    .replace(/\b(f c|fc|a c|ac|a s|as|asd|u s|us|s s|ss)\b/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function mapStaticRosterPlayers(staticRoster, seasonId, seasonTeamId) {
  return (staticRoster?.players || []).map((player, index) => ({
    id: `static_${seasonTeamId}_${index}`,
    seasonId,
    seasonTeamId,
    playerName: player.playerName,
    realTeam: player.realTeam || "",
    rosterRole: player.role || player.rosterRole || "",
    classicRole: player.role || player.classicRole || "",
    mantraRoles: player.mantraRoles || "",
    cost: player.cost ?? player.rosterCost ?? "",
    status: "ACTIVE",
    source: "static-roster"
  }));
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

function formatFm(value) {
  const number = Number(value || 0);
  return Number.isInteger(number) ? `${number} FM` : `${number.toFixed(2).replace(".", ",")} FM`;
}

function getRosterRoleSortValue(player) {
  const rawRole = String(player.rosterRole || player.classicRole || player.role || "").trim().toUpperCase();
  const primaryRole = rawRole.charAt(0);
  const order = { P: 1, D: 2, C: 3, A: 4 };
  return order[primaryRole] || 99;
}

function sortRosterPlayersByRole(players) {
  return [...players].sort((a, b) => {
    const roleDiff = getRosterRoleSortValue(a) - getRosterRoleSortValue(b);
    if (roleDiff) return roleDiff;

    const nameA = String(a.playerName || "");
    const nameB = String(b.playerName || "");
    return nameA.localeCompare(nameB, "it", { sensitivity: "base" });
  });
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
  const mantra = String(player.mantraRoles || "").trim();
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
            <th class="number roster-col-qta">${renderRosterSortButton("quotationCurrent", "Qt.A", true)}</th>
            <th class="roster-col-team">${renderRosterSortButton("realTeam", "Sq")}</th>
            <th class="number roster-col-cost">${renderRosterSortButton("cost", "Costo", true)}</th>
          </tr>
        </thead>
        <tbody>
          ${sortRosterPlayersForDisplay(players).map((player) => `
            <tr>
              <td data-label="Giocatore" class="roster-col-player"><strong>${escapeHtml(player.playerName || "-")}</strong></td>
              <td data-label="R (RM)" class="roster-col-role">${getRosterRoleDisplay(player)}</td>
              <td data-label="Qt.A" class="number roster-col-qta">${formatListoneNumber(getRosterPlayerQuotationCurrent(player))}</td>
              <td data-label="Sq" class="roster-col-team">${escapeHtml(player.realTeam || "-")}</td>
              <td data-label="Costo" class="number roster-col-cost">${escapeHtml(player.cost ?? "-")}</td>
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
                  <td data-label="Rosa" class="roster-team-name">${renderTeamLogo(displayName, getSeasonTeamLogo(seasonTeam))}<strong>${escapeHtml(displayName)}</strong></td>
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

function requestStatusLabel(status) {
  return {
    PENDING: "In attesa",
    APPROVED: "Approvata",
    REJECTED: "Rifiutata",
    EMAIL_NOT_VERIFIED: "Email da verificare"
  }[status] || status || "-";
}

function requestTypeLabel(type) {
  return {
    FM_MOVEMENT: "Movimento FM",
    TEAM_NEWS: "Comunicato squadra",
    PLAYER_BUY_REQUEST: "Richiesta acquisto",
    PLAYER_RELEASE_REQUEST: "Richiesta svincolo",
    PLAYER_TRADE_REQUEST: "Richiesta scambio"
  }[type] || type || "-";
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
        const adminSnapshot = await getDoc(doc(db, "admins", user.uid));
        state.isAdmin = adminSnapshot.exists();

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
  const seasonId = getCurrentSeasonId();
  const rows = (state.raw.news || [])
    .filter((item) => !item.seasonId || item.seasonId === seasonId)
    .sort((a, b) => String(b.publishedAt || b.createdAt || "").localeCompare(String(a.publishedAt || a.createdAt || "")))
    .slice(0, 30);

  target.innerHTML = rows.length ? rows.map((news) => `
    <article class="news-card">
      <div class="news-card-header">
        <div>
          <small>${escapeHtml(news.topic === "COMUNICATO_SQUADRA" ? "Comunicato squadra" : news.topic || "News")}</small>
          <h3>${escapeHtml(news.title || "Comunicato")}</h3>
          ${news.seasonTeamId ? `<small>${renderSeasonTeamNameWithLogo(news.seasonTeamId, { strong: false })}</small>` : ""}
        </div>
        <small>${escapeHtml(news.publishedAt || news.createdAt || "")}</small>
      </div>
      <p>${escapeHtml(news.body || "")}</p>
    </article>`).join("") : `<p class="muted">Nessun comunicato pubblicato.</p>`;
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
      body: document.getElementById("teamNewsRequestBody")?.value.trim() || ""
    }, "teamNewsRequestStatus");
    event.target.reset();
  });
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
      publishedAt: getTodayIsoDate(),
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
    .sort((a, b) => String(b.publishedAt || b.createdAt || "").localeCompare(String(a.publishedAt || a.createdAt || "")))
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
    recentNews: (state.raw.news || []).filter((news) => news.seasonTeamId === seasonTeamId || news.teamId === seasonTeam.teamId).sort((a, b) => String(b.publishedAt || b.createdAt || "").localeCompare(String(a.publishedAt || a.createdAt || ""))).slice(0, 10),
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
    <tr><td class="team-profile-player-cell"><strong>${escapeHtml(player.playerName || "-")}</strong></td><td>${getRosterRoleDisplay(player)}</td><td class="number">${formatListoneNumber(getRosterPlayerQuotationCurrent(player))}</td><td>${escapeHtml(player.realTeam || "-")}</td><td class="number">${formatListoneNumber(player.cost)}</td></tr>`).join("") || `<tr><td colspan="5" class="muted center">Rosa non disponibile.</td></tr>`;
  const palmaresRows = (snapshot.palmares || []).map((item) => `<tr><td>${escapeHtml(item.seasonLabel || item.seasonId)}</td><td>${escapeHtml(item.label)}</td></tr>`).join("") || `<tr><td colspan="2" class="muted center">Nessun titolo/piazzamento.</td></tr>`;
  const movementRows = (snapshot.recentMovements || []).map((movement) => `<tr><td>${escapeHtml(movement.date || "-")}</td><td>${renderFmMovementTypeBadge(movement.type)}</td><td>${escapeHtml(movement.playerName || "-")}</td><td class="number">${formatFm(movement.amount || 0)}</td></tr>`).join("") || `<tr><td colspan="4" class="muted center">Nessun movimento recente.</td></tr>`;
  const newsHtml = (snapshot.recentNews || []).map((news) => `<article class="compact-card"><h3>${escapeHtml(news.title || "Comunicato")}</h3><p>${escapeHtml(news.body || "")}</p><small class="muted">${escapeHtml(news.publishedAt || "")}</small></article>`).join("") || `<p class="muted">Nessun comunicato squadra.</p>`;
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


initializeAppUi().then(() => {
  injectDisplayModeToggle();
  updateMobileUxClass();
});

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
  if (state.expandedRosterClubIds.has(id)) state.expandedRosterClubIds.delete(id);
  else state.expandedRosterClubIds.add(id);
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
  const second = results.find((result) => Number(result.position) === 2);

  if (!winner) return "Nessun risultato inserito";

  const winnerHtml = withLogo
    ? renderSeasonTeamNameWithLogo(winner.seasonTeamId, { textClass: "text-success" })
    : `<strong class="text-success">${escapeHtml(getSeasonTeamDisplayName(winner.seasonTeamId))}</strong>`;
  const secondHtml = second
    ? (withLogo ? renderSeasonTeamNameWithLogo(second.seasonTeamId) : escapeHtml(getSeasonTeamDisplayName(second.seasonTeamId)))
    : "-";

  return `
    <div class="dashboard-podium-lines">
      <div><span class="muted">Vincitore:</span> ${winnerHtml}</div>
      <div><span class="muted">2°</span> ${secondHtml}</div>
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
      <td class="team-profile-player-cell"><strong>${escapeHtml(player.playerName || "-")}</strong></td>
      <td>${getRosterRoleDisplay(player)}</td>
      <td>${escapeHtml(player.realTeam || "-")}</td>
      <td class="number">${formatListoneNumber(player.cost)}</td>
      <td class="number">${formatListoneNumber(getRosterPlayerQuotationCurrent(player))}</td>
    </tr>`).join("") || `<tr><td colspan="5" class="muted center">Rosa non disponibile.</td></tr>`;
  const palmaresRows = (snapshot.palmares || []).map((item) => `<tr><td>${escapeHtml(item.seasonLabel || item.seasonId)}</td><td>${escapeHtml(item.label)}</td></tr>`).join("") || `<tr><td colspan="2" class="muted center">Nessun titolo/piazzamento.</td></tr>`;
  const movementRows = (snapshot.recentMovements || []).map((movement) => `<tr><td>${escapeHtml(movement.date || "-")}</td><td>${renderFmMovementTypeBadge(movement.type)}</td><td>${escapeHtml(movement.playerName || "-")}</td><td class="number">${formatFm(movement.amount || 0)}</td></tr>`).join("") || `<tr><td colspan="4" class="muted center">Nessun movimento recente.</td></tr>`;
  const newsHtml = (snapshot.recentNews || []).map((news) => `<article class="compact-card"><h3>${escapeHtml(news.title || "Comunicato")}</h3><p>${escapeHtml(news.body || "")}</p><small class="muted">${escapeHtml(news.publishedAt || "")}</small></article>`).join("") || `<p class="muted">Nessun comunicato squadra.</p>`;
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
