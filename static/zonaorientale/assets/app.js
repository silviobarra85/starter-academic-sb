import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// =========================================================
// 1) CONFIGURA QUI SUPABASE
// =========================================================
// Esempio:
// const SUPABASE_URL = "https://xxxxxxxxxxxxxxxxxxxx.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOi...";
const SUPABASE_URL = "https://qbngcitvlhydrypxelix.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibmdjaXR2bGh5ZHJ5cHhlbGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODY0NjEsImV4cCI6MjA5NDE2MjQ2MX0.B-_9H2Pv0i_CHcD9p-1ZmnVxKVy44jVKd6S01PfU6tM";


const ACTIVE_SEASON_ID = "2025-2026";

const MOVEMENT_LABELS = {
  INITIAL_BUDGET: "Budget iniziale",
  AUCTION_BUY: "Acquisto asta",
  RELEASE_REFUND: "Rimborso svincolo",
  TRADE_FM: "Scambio FM",
  LOAN_FM: "Prestito FM",
  STADIUM_BUILD: "Costruzione stadio",
  STADIUM_MAINTENANCE: "Manutenzione stadio",
  STADIUM_REVENUE: "Introiti stadio",
  PRIZE: "Premio",
  PENALTY: "Penalizzazione",
  ADJUSTMENT: "Rettifica",
};

const ACQUIRED_LABELS = {
  AUCTION: "Asta",
  TRADE: "Scambio",
  LOAN: "Prestito",
  MANUAL: "Manuale",
};

const COMPETITION_LABELS = {
  REGULAR_SEASON: "Campionato / Regular Season",
  COPPA_ITALIA: "Coppa Italia",
  PLAYOFF: "Playoff",
  CHAMPIONS: "Champions League",
  ALTRO: "Altro",
};

const COMPETITION_STATUS_LABELS = {
  PLANNED: "Programmato",
  ACTIVE: "Attivo",
  COMPLETED: "Concluso",
  NOT_DISPUTED: "Non disputata",
};

const MATCH_STATUS_LABELS = {
  SCHEDULED: "Da giocare",
  PLAYED: "Giocata",
  POSTPONED: "Rinviata",
};

const CUP_MATCHDAY_LABELS = ["QF - Andata", "QF - Ritorno", "SF - Andata", "SF - Ritorno", "Finale"];


const NEWS_TOPIC_LABELS = {
  GENERALE: "Generale",
  COMPETIZIONE: "Competizione",
  COMUNICATO_UFFICIALE_SQUADRA: "Comunicato ufficiale squadra",
};

const state = {
  supabase: null,
  user: null,
  isAdmin: false,
  seasons: [],
  clubs: [],
  movements: [],
  players: [],
  rosterEntries: [],
  stadiums: [],
  stadiumLevels: [],
  playerQuotations: [],
  listoneUploads: [],
  rosterImports: [],
  news: [],
  competitions: [],
  competitionStandings: [],
  calendarMatches: [],
  honorRoll: [],
  honorClubs: [],
  clubSeasonIdentities: [],
  latestQuotations: [],
  allLatestQuotations: [],
  loadedScopes: new Set(),
  selectedSeason: ACTIVE_SEASON_ID,
  selectedListoneSeason: ACTIVE_SEASON_ID,
  selectedRosterSeason: ACTIVE_SEASON_ID,
  search: "",
  listoneSearch: "",
  listoneRoleFilter: "all",
  listoneSort: { key: "player_name", direction: "asc" },
  freeAgentsSort: { key: "player_name", direction: "asc" },
  marketSearch: "",
  marketClubFilter: "all",
  adminSearch: { news: "", competitions: "", standings: "", calendar: "", honor: "", historicalClubs: "", clubIdentities: "" },
  rosterSearch: "",
  rosterClubFilter: "all",
};

const el = {
  configWarning: document.getElementById("configWarning"),
  errorBox: document.getElementById("errorBox"),
  globalSeasonSelect: document.getElementById("globalSeasonSelect"),
  dashboardSeasonSelect: document.getElementById("dashboardSeasonSelect"),
  dashboardSeasonText: document.getElementById("dashboardSeasonText"),
  refreshBtn: document.getElementById("refreshBtn"),
  openLoginBtn: document.getElementById("openLoginBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  loginDialog: document.getElementById("loginDialog"),
  closeLoginBtn: document.getElementById("closeLoginBtn"),
  loginForm: document.getElementById("loginForm"),
  loginEmail: document.getElementById("loginEmail"),
  loginPassword: document.getElementById("loginPassword"),
  loginStatus: document.getElementById("loginStatus"),
  metricClubs: document.getElementById("metricClubs"),
  metricTotalFm: document.getElementById("metricTotalFm"),
  metricAvgFm: document.getElementById("metricAvgFm"),
  metricAlerts: document.getElementById("metricAlerts"),
  dashboardStandings: document.getElementById("dashboardStandings"),
  dashboardCalendar: document.getElementById("dashboardCalendar"),
  newsList: document.getElementById("newsList"),
  competitionsList: document.getElementById("competitionsList"),
  honorSummary: document.getElementById("honorSummary"),
  honorHistory: document.getElementById("honorHistory"),
  globalSeasonSelect: document.getElementById("globalSeasonSelect"),
  clubSearch: document.getElementById("clubSearch"),
  clubsTableBody: document.getElementById("clubsTableBody"),
  rosterClubFilter: document.getElementById("rosterClubFilter"),
  rosterSearch: document.getElementById("rosterSearch"),
  rosterClubCards: document.getElementById("rosterClubCards"),
  rosterTableBody: document.getElementById("rosterTableBody"),
  rosterSeasonFilter: document.getElementById("rosterSeasonFilter"),
  listoneSeasonFilter: document.getElementById("listoneSeasonFilter"),
  listoneRoleFilter: document.getElementById("listoneRoleFilter"),
  listoneMetaText: document.getElementById("listoneMetaText"),
  listoneSearch: document.getElementById("listoneSearch"),
  listoneTableBody: document.getElementById("listoneTableBody"),
  freeAgentsMetaText: document.getElementById("freeAgentsMetaText"),
  freeAgentsTableBody: document.getElementById("freeAgentsTableBody"),
  marketClubFilter: document.getElementById("marketClubFilter"),
  marketSearch: document.getElementById("marketSearch"),
  marketActivityTableBody: document.getElementById("marketActivityTableBody"),
  seasonForm: document.getElementById("seasonForm"),
  seasonIdInput: document.getElementById("seasonIdInput"),
  seasonNameInput: document.getElementById("seasonNameInput"),
  seasonStartsOn: document.getElementById("seasonStartsOn"),
  seasonEndsOn: document.getElementById("seasonEndsOn"),
  seasonFormStatus: document.getElementById("seasonFormStatus"),
  rolloverForm: document.getElementById("rolloverForm"),
  rolloverSourceSeason: document.getElementById("rolloverSourceSeason"),
  rolloverTargetSeason: document.getElementById("rolloverTargetSeason"),
  rolloverStatus: document.getElementById("rolloverStatus"),
  clubLogoInput: document.getElementById("clubLogoInput"),
  clubLogoPreview: document.getElementById("clubLogoPreview"),
  removeClubLogoInput: document.getElementById("removeClubLogoInput"),
  movementsList: document.getElementById("movementsList"),
  stadiumsList: document.getElementById("stadiumsList"),
  adminPanel: document.getElementById("adminPanel"),
  adminNavLink: document.getElementById("adminNavLink"),
  clubForm: document.getElementById("clubForm"),
  clubEditSelect: document.getElementById("clubEditSelect"),
  clubNameInput: document.getElementById("clubNameInput"),
  clubPresidentSelect: document.getElementById("clubPresidentSelect"),
  clubPresidentInput: document.getElementById("clubPresidentInput"),
  clubActiveInput: document.getElementById("clubActiveInput"),
  clubFormStatus: document.getElementById("clubFormStatus"),
  auctionForm: document.getElementById("auctionForm"),
  auctionSeason: document.getElementById("auctionSeason"),
  auctionClub: document.getElementById("auctionClub"),
  auctionPlayerSelect: document.getElementById("auctionPlayerSelect"),
  auctionPlayerName: document.getElementById("auctionPlayerName"),
  auctionRealTeam: document.getElementById("auctionRealTeam"),
  auctionRoles: document.getElementById("auctionRoles"),
  auctionRoleClass: document.getElementById("auctionRoleClass"),
  auctionPrice: document.getElementById("auctionPrice"),
  auctionDate: document.getElementById("auctionDate"),
  auctionFormStatus: document.getElementById("auctionFormStatus"),
  listoneUploadForm: document.getElementById("listoneUploadForm"),
  listoneSeason: document.getElementById("listoneSeason"),
  listoneLabel: document.getElementById("listoneLabel"),
  listoneDate: document.getElementById("listoneDate"),
  listoneFile: document.getElementById("listoneFile"),
  listoneUploadStatus: document.getElementById("listoneUploadStatus"),
  listoneImportReport: document.getElementById("listoneImportReport"),
  rosterUploadForm: document.getElementById("rosterUploadForm"),
  rosterSeason: document.getElementById("rosterSeason"),
  rosterLabel: document.getElementById("rosterLabel"),
  rosterFile: document.getElementById("rosterFile"),
  rosterUpdateClubs: document.getElementById("rosterUpdateClubs"),
  rosterReplaceExisting: document.getElementById("rosterReplaceExisting"),
  rosterRegisterMovements: document.getElementById("rosterRegisterMovements"),
  rosterUploadStatus: document.getElementById("rosterUploadStatus"),
  rosterImportReport: document.getElementById("rosterImportReport"),
  stadiumForm: document.getElementById("stadiumForm"),
  stadiumSeason: document.getElementById("stadiumSeason"),
  stadiumClub: document.getElementById("stadiumClub"),
  stadiumName: document.getElementById("stadiumName"),
  stadiumLevel: document.getElementById("stadiumLevel"),
  stadiumFormStatus: document.getElementById("stadiumFormStatus"),
  newsForm: document.getElementById("newsForm"),
  newsId: document.getElementById("newsId"),
  newsTitleInput: document.getElementById("newsTitleInput"),
  newsTopic: document.getElementById("newsTopic"),
  newsBody: document.getElementById("newsBody"),
  newsFormReset: document.getElementById("newsFormReset"),
  newsFormStatus: document.getElementById("newsFormStatus"),
  newsAdminSearch: document.getElementById("newsAdminSearch"),
  newsAdminList: document.getElementById("newsAdminList"),
  competitionForm: document.getElementById("competitionForm"),
  competitionId: document.getElementById("competitionId"),
  competitionSeason: document.getElementById("competitionSeason"),
  competitionName: document.getElementById("competitionName"),
  competitionType: document.getElementById("competitionType"),
  competitionStatus: document.getElementById("competitionStatus"),
  competitionFormReset: document.getElementById("competitionFormReset"),
  competitionFormStatus: document.getElementById("competitionFormStatus"),
  competitionAdminSearch: document.getElementById("competitionAdminSearch"),
  competitionAdminList: document.getElementById("competitionAdminList"),
  standingForm: document.getElementById("standingForm"),
  standingId: document.getElementById("standingId"),
  standingCompetition: document.getElementById("standingCompetition"),
  standingClub: document.getElementById("standingClub"),
  standingPosition: document.getElementById("standingPosition"),
  standingPoints: document.getElementById("standingPoints"),
  standingFantapoints: document.getElementById("standingFantapoints"),
  standingGoalsFor: document.getElementById("standingGoalsFor"),
  standingGoalsAgainst: document.getElementById("standingGoalsAgainst"),
  standingPlayed: document.getElementById("standingPlayed"),
  standingWins: document.getElementById("standingWins"),
  standingDraws: document.getElementById("standingDraws"),
  standingLosses: document.getElementById("standingLosses"),
  standingFormReset: document.getElementById("standingFormReset"),
  standingFormStatus: document.getElementById("standingFormStatus"),
  standingAdminSearch: document.getElementById("standingAdminSearch"),
  standingAdminList: document.getElementById("standingAdminList"),
  calendarForm: document.getElementById("calendarForm"),
  calendarMatchId: document.getElementById("calendarMatchId"),
  calendarCompetition: document.getElementById("calendarCompetition"),
  calendarMatchday: document.getElementById("calendarMatchday"),
  calendarMatchdayOptions: document.getElementById("calendarMatchdayOptions"),
  calendarDate: document.getElementById("calendarDate"),
  calendarHomeClub: document.getElementById("calendarHomeClub"),
  calendarAwayClub: document.getElementById("calendarAwayClub"),
  calendarHomeScore: document.getElementById("calendarHomeScore"),
  calendarAwayScore: document.getElementById("calendarAwayScore"),
  calendarHomeGoals: document.getElementById("calendarHomeGoals"),
  calendarAwayGoals: document.getElementById("calendarAwayGoals"),
  calendarManualWinnerClub: document.getElementById("calendarManualWinnerClub"),
  calendarManualWinnerNote: document.getElementById("calendarManualWinnerNote"),
  calendarStatus: document.getElementById("calendarStatus"),
  calendarFormReset: document.getElementById("calendarFormReset"),
  calendarFormStatus: document.getElementById("calendarFormStatus"),
  calendarAdminSearch: document.getElementById("calendarAdminSearch"),
  calendarAdminList: document.getElementById("calendarAdminList"),
  honorForm: document.getElementById("honorForm"),
  honorId: document.getElementById("honorId"),
  honorSeason: document.getElementById("honorSeason"),
  honorClub: document.getElementById("honorClub"),
  honorClubNameInput: document.getElementById("honorClubNameInput"),
  honorPresidentSelect: document.getElementById("honorPresidentSelect"),
  honorPresidentInput: document.getElementById("honorPresidentInput"),
  honorClubLogoInput: document.getElementById("honorClubLogoInput"),
  honorCompetitionType: document.getElementById("honorCompetitionType"),
  honorTitleInput: document.getElementById("honorTitleInput"),
  honorPlacement: document.getElementById("honorPlacement"),
  honorPoints: document.getElementById("honorPoints"),
  honorNotes: document.getElementById("honorNotes"),
  honorFormReset: document.getElementById("honorFormReset"),
  honorFormStatus: document.getElementById("honorFormStatus"),
  honorAdminSearch: document.getElementById("honorAdminSearch"),
  honorAdminList: document.getElementById("honorAdminList"),
  historicalClubForm: document.getElementById("historicalClubForm"),
  historicalClubId: document.getElementById("historicalClubId"),
  historicalClubSourceClub: document.getElementById("historicalClubSourceClub"),
  historicalClubNameInput: document.getElementById("historicalClubNameInput"),
  historicalClubPresidentSelect: document.getElementById("historicalClubPresidentSelect"),
  historicalClubPresidentInput: document.getElementById("historicalClubPresidentInput"),
  historicalClubLogoInput: document.getElementById("historicalClubLogoInput"),
  historicalClubFormReset: document.getElementById("historicalClubFormReset"),
  historicalClubFormStatus: document.getElementById("historicalClubFormStatus"),
  historicalClubAdminSearch: document.getElementById("historicalClubAdminSearch"),
  historicalClubAdminList: document.getElementById("historicalClubAdminList"),
  clubIdentityForm: document.getElementById("clubIdentityForm"),
  clubIdentityId: document.getElementById("clubIdentityId"),
  clubIdentitySeason: document.getElementById("clubIdentitySeason"),
  clubIdentityClub: document.getElementById("clubIdentityClub"),
  clubIdentityNameInput: document.getElementById("clubIdentityNameInput"),
  clubIdentityPresidentSelect: document.getElementById("clubIdentityPresidentSelect"),
  clubIdentityPresidentInput: document.getElementById("clubIdentityPresidentInput"),
  clubIdentityStadiumInput: document.getElementById("clubIdentityStadiumInput"),
  clubIdentityLogoInput: document.getElementById("clubIdentityLogoInput"),
  clubIdentityFormReset: document.getElementById("clubIdentityFormReset"),
  clubIdentityFormStatus: document.getElementById("clubIdentityFormStatus"),
  clubIdentityAdminSearch: document.getElementById("clubIdentityAdminSearch"),
  clubIdentityAdminList: document.getElementById("clubIdentityAdminList"),
  dumpForm: document.getElementById("dumpForm"),
  dumpType: document.getElementById("dumpType"),
  dumpPretty: document.getElementById("dumpPretty"),
  dumpFormStatus: document.getElementById("dumpFormStatus"),
  movementForm: document.getElementById("movementForm"),
  movementSeason: document.getElementById("movementSeason"),
  movementClub: document.getElementById("movementClub"),
  movementType: document.getElementById("movementType"),
  movementAmount: document.getElementById("movementAmount"),
  movementSignHint: document.getElementById("movementSignHint"),
  movementDescription: document.getElementById("movementDescription"),
  movementFormStatus: document.getElementById("movementFormStatus"),
  playerDialog: document.getElementById("playerDialog"),
  closePlayerBtn: document.getElementById("closePlayerBtn"),
  playerDialogTitle: document.getElementById("playerDialogTitle"),
  playerDialogBody: document.getElementById("playerDialogBody"),
  fantacalcioDialog: document.getElementById("fantacalcioDialog"),
  closeFantacalcioBtn: document.getElementById("closeFantacalcioBtn"),
  fantacalcioDialogTitle: document.getElementById("fantacalcioDialogTitle"),
  fantacalcioFrame: document.getElementById("fantacalcioFrame"),
  fantacalcioExternalLink: document.getElementById("fantacalcioExternalLink"),
  rosterDialog: document.getElementById("rosterDialog"),
  closeRosterBtn: document.getElementById("closeRosterBtn"),
  rosterDialogTitle: document.getElementById("rosterDialogTitle"),
  rosterDialogBody: document.getElementById("rosterDialogBody"),
};

function isConfigured() {
  return (
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_URL.includes(".supabase.co") &&
    SUPABASE_ANON_KEY.length > 40 &&
    !SUPABASE_ANON_KEY.includes("INSERISCI")
  );
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function fmtFm(value) {
  const n = Number(value || 0);
  return `${n.toLocaleString("it-IT", { maximumFractionDigits: 2 })} FM`;
}

function fmtDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function fmtDateOnly(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function clubLogoHtml(entity, size = "sm") {
  const src = entity?.logo_data_url || entity?.logo_url || "";
  const label = entity?.name || entity?.club_name || "Club";
  const cls = size === "lg" ? "club-logo club-logo-lg" : "club-logo";
  if (src) {
    return `<img class="${cls}" src="${escapeHtml(src)}" alt="Logo ${escapeHtml(label)}" loading="lazy" />`;
  }
  const initial = String(label || "?").trim().charAt(0).toUpperCase() || "?";
  return `<span class="${cls} club-logo-placeholder" aria-hidden="true">${escapeHtml(initial)}</span>`;
}

function clubNameWithLogo(entity, size = "sm") {
  if (!entity) return "-";
  return `<span class="club-name-with-logo">${clubLogoHtml(entity, size)}<span>${escapeHtml(entity.name || entity.club_name || "-")}</span></span>`;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Impossibile leggere il file."));
    reader.readAsDataURL(file);
  });
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const normalized = String(value).replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function chunkArray(items, size = 250) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function fetchAllRows(queryFactory, pageSize = 1000) {
  const allRows = [];
  let from = 0;

  while (true) {
    const to = from + pageSize - 1;
    const { data, error } = await queryFactory().range(from, to);
    if (error) throw error;

    const rows = data || [];
    allRows.push(...rows);

    if (rows.length < pageSize) break;
    from += pageSize;
  }

  return allRows;
}

function normalizeTextKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function splitPresidentNames(value) {
  return String(value || "")
    .split(/\s*&\s*|\s+e\s+|\s*,\s*/i)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatPresidentNames(values) {
  const seen = new Set();
  const names = [];
  (Array.isArray(values) ? values : splitPresidentNames(values)).forEach((value) => {
    const name = String(value || "").trim();
    const key = normalizeTextKey(name);
    if (!key || seen.has(key)) return;
    seen.add(key);
    names.push(name);
  });
  return names.join(" & ");
}

function getPresidentKey(value) {
  const names = splitPresidentNames(value)
    .map((name) => ({ name, key: normalizeTextKey(name) }))
    .filter((item) => item.key)
    .sort((a, b) => a.key.localeCompare(b.key));
  return names.map((item) => item.key).join("_") || normalizeTextKey(value || "");
}

function getKnownPresidents() {
  const values = [];
  state.clubs.forEach((club) => values.push(club.president));
  state.honorClubs.forEach((club) => values.push(club.president));
  state.clubSeasonIdentities.forEach((identity) => values.push(identity.president));
  const seen = new Set();
  const names = [];
  values.forEach((value) => {
    splitPresidentNames(value).forEach((name) => {
      const key = normalizeTextKey(name);
      if (!key || seen.has(key)) return;
      seen.add(key);
      names.push(name);
    });
  });
  return names.sort((a, b) => a.localeCompare(b));
}

function renderPresidentOptions({ includeEmpty = false } = {}) {
  const base = includeEmpty ? [`<option value="">Seleziona presidente esistente</option>`] : [];
  const options = getKnownPresidents().map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`);
  return [...base, ...options].join("");
}

function resolvePresidentValue(selectEl, inputEl) {
  const selected = selectEl
    ? Array.from(selectEl.selectedOptions || []).map((option) => option.value).filter(Boolean)
    : [];
  const manual = splitPresidentNames(inputEl?.value || "");
  return formatPresidentNames([...selected, ...manual]);
}

function setPresidentControls(selectEl, inputEl, president) {
  const names = splitPresidentNames(president);
  const knownKeys = new Set(Array.from(selectEl?.options || []).map((option) => normalizeTextKey(option.value)));
  const selectedKeys = new Set(names.map(normalizeTextKey));
  if (selectEl) {
    Array.from(selectEl.options).forEach((option) => {
      option.selected = selectedKeys.has(normalizeTextKey(option.value));
    });
  }
  if (inputEl) {
    const manual = names.filter((name) => !knownKeys.has(normalizeTextKey(name)));
    inputEl.value = manual.join(" & ");
  }
}

function displayPresidents(value) {
  return formatPresidentNames(value) || "-";
}

function getPlayerKeyFromName(name) {
  return normalizeTextKey(name);
}

function getQuotationKey(quote) {
  return quote?.player_key || getPlayerKeyFromName(quote?.player_name || quote?.name || "");
}

function slugifyFantacalcio(value) {
  const slug = String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " e ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "giocatore";
}

function buildFantacalcioPlayerUrl(player, quote) {
  const fantacalcioId = String(quote?.fantacalcio_id || player?.fantacalcio_id || "").trim();
  if (!fantacalcioId) return null;

  const teamSlug = slugifyFantacalcio(quote?.real_team || player?.real_team || "serie-a");
  const playerSlug = slugifyFantacalcio(quote?.player_name || player?.name || "giocatore");
  return `https://www.fantacalcio.it/serie-a/squadre/${teamSlug}/${playerSlug}/${encodeURIComponent(fantacalcioId)}`;
}


function getLatestQuoteByPlayerId(playerId) {
  return state.latestQuotations.find((quote) => quote.player_id === playerId);
}

function getLatestQuoteByPlayerKey(playerKey) {
  return state.latestQuotations.find((quote) => getQuotationKey(quote) === playerKey);
}

function getLatestQuotations(quotations) {
  const map = new Map();
  for (const quote of [...quotations].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))) {
    const key = getQuotationKey(quote);
    if (key && !map.has(key)) {
      map.set(key, quote);
    }
  }
  return Array.from(map.values()).sort((a, b) => (a.player_name || "").localeCompare(b.player_name || ""));
}

function getQuotationsForSeason(seasonId) {
  return state.playerQuotations.filter((quote) => quote.season_id === seasonId);
}

function getLatestQuotationsForSeason(seasonId) {
  if (state.allLatestQuotations?.length) {
    return state.allLatestQuotations
      .filter((quote) => quote.season_id === seasonId)
      .sort((a, b) => (a.player_name || "").localeCompare(b.player_name || ""));
  }
  return getLatestQuotations(getQuotationsForSeason(seasonId));
}

function getLatestQuoteByPlayerIdForSeason(playerId, seasonId) {
  return getLatestQuotationsForSeason(seasonId).find((quote) => quote.player_id === playerId);
}

function getLatestListoneUploadForSeason(seasonId) {
  return [...state.listoneUploads]
    .filter((upload) => upload.season_id === seasonId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
}

function getPlayerQuotations(playerId) {
  return state.playerQuotations
    .filter((quote) => quote.player_id === playerId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

function quoteStatusLabel(quote) {
  return quote?.is_listed ? "In listone" : "Asteriscato";
}

function mobileTeamCode(value) {
  const text = String(value || "-").trim();
  if (!text || text === "-") return "-";
  return text.slice(0, 3).toUpperCase();
}

function renderMobileTeam(value) {
  const full = escapeHtml(value || "-");
  const code = escapeHtml(mobileTeamCode(value));
  return `<span class="desktop-inline">${full}</span><span class="mobile-inline team-code">${code}</span>`;
}

function renderStatusDot(status, label = status) {
  const normalized = String(status || "").toLowerCase();
  let dotClass = "status-dot-muted";
  if (normalized.includes("attivo") || normalized.includes("listone")) dotClass = "status-dot-ok";
  if (normalized.includes("asterisc") || normalized.includes("cedut") || normalized.includes("left")) dotClass = "status-dot-warning";
  const safeLabel = escapeHtml(label || status || "-");
  return `<span class="status-dot ${dotClass}" title="${safeLabel}" aria-label="${safeLabel}"></span><span class="desktop-inline"><span class="status ${dotClass === "status-dot-warning" ? "status-warning" : dotClass === "status-dot-ok" ? "status-ok" : "status-muted"}">${safeLabel}</span></span>`;
}

function getUploadById(uploadId) {
  return state.listoneUploads.find((upload) => upload.id === uploadId);
}

function getUploadLabel(upload) {
  if (!upload) return "-";
  return upload.label || upload.file_name || fmtDate(upload.created_at);
}

function roleClassFromClassicRole(role) {
  const value = String(role || "").trim().toUpperCase();
  if (["P", "POR", "PORT", "PORTIERE", "GK"].includes(value)) return "P";
  return "MOVIMENTO";
}

function isGoalkeeperPlayer(player) {
  if (!player) return false;
  const roleClass = String(player.role_class || "").trim().toUpperCase();
  const classicRole = String(player.classic_role || "").trim().toUpperCase();
  const mantraRoles = String(player.mantra_roles || "").trim().toUpperCase();
  if (roleClass === "P") return true;
  if (["P", "POR", "PORT", "PORTIERE", "GK"].includes(classicRole)) return true;
  return mantraRoles.split(/[\/\s,;+-]+/).some((part) => ["P", "POR", "PORT", "PORTIERE", "GK"].includes(part));
}

function normalizeListoneRow(row, sourceSheet, isListed) {
  const fantacalcioId = row.Id ?? row.ID ?? row.id;
  const name = row.Nome ?? row.nome;

  if (!fantacalcioId || !name) return null;

  const classicRole = row.R ?? row.Role ?? "";
  const mantraRoles = row.RM ?? row.Ruoli ?? "";

  const playerName = String(name).trim();
  return {
    fantacalcio_id: String(fantacalcioId).trim(),
    player_key: getPlayerKeyFromName(playerName),
    player_name: playerName,
    real_team: row.Squadra ? String(row.Squadra).trim() : null,
    classic_role: classicRole ? String(classicRole).trim() : null,
    mantra_roles: mantraRoles ? String(mantraRoles).trim() : null,
    role_class: roleClassFromClassicRole(classicRole),
    quotation_current: toNumber(row["Qt.A"]),
    quotation_initial: toNumber(row["Qt.I"]),
    quotation_diff: toNumber(row["Diff."]),
    quotation_current_mantra: toNumber(row["Qt.A M"]),
    quotation_initial_mantra: toNumber(row["Qt.I M"]),
    quotation_diff_mantra: toNumber(row["Diff.M"]),
    fvm: toNumber(row.FVM),
    fvm_mantra: toNumber(row["FVM M"]),
    is_listed: Boolean(isListed),
    listone_status: isListed ? "ACTIVE" : "LEFT_LISTONE",
    left_listone_reason: isListed ? null : "CEDUTI_SHEET",
    source_sheet: sourceSheet,
  };
}

function readListoneWorkbook(file) {
  return new Promise((resolve, reject) => {
    if (!window.XLSX) {
      reject(new Error("Libreria XLSX non caricata. Controlla la connessione o il CDN."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = window.XLSX.read(new Uint8Array(event.target.result), { type: "array" });
        const activeSheetName = workbook.SheetNames.includes("Tutti") ? "Tutti" : workbook.SheetNames[0];
        const cedutiSheetName = workbook.SheetNames.find((name) => name.toLowerCase().includes("ceduti"));

        const activeRows = window.XLSX.utils
          .sheet_to_json(workbook.Sheets[activeSheetName], { range: 1, defval: null })
          .map((row) => normalizeListoneRow(row, activeSheetName, true))
          .filter(Boolean);

        const cedutiRows = cedutiSheetName
          ? window.XLSX.utils
              .sheet_to_json(workbook.Sheets[cedutiSheetName], { range: 1, defval: null })
              .map((row) => normalizeListoneRow(row, cedutiSheetName, false))
              .filter(Boolean)
          : [];

        resolve({ activeRows, cedutiRows, activeSheetName, cedutiSheetName });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Impossibile leggere il file Excel."));
    reader.readAsArrayBuffer(file);
  });
}


function parseResidualCredits(value) {
  const match = String(value || "").match(/crediti\s+residui\s*:\s*([0-9]+(?:[,.][0-9]+)?)/i);
  return match ? toNumber(match[1]) : null;
}

function getClubAssignmentOrder() {
  function order(club) {
    if (club.id === "salernitana1919") return 1;
    const match = String(club.id || "").match(/club(\d+)/i);
    if (match) return Number(match[1]);
    return 1000;
  }
  return [...state.clubs].sort((a, b) => order(a) - order(b) || a.name.localeCompare(b.name));
}

function normalizeRosterRole(role) {
  const value = String(role || "").trim().toUpperCase();
  if (["P", "POR", "PORT", "PORTIERE", "GK"].includes(value)) return "P";
  if (["D", "C", "A"].includes(value)) return value;
  return value.slice(0, 1);
}

function getLatestQuoteByPlayerKeyForSeason(playerKey, seasonId) {
  return getLatestQuotationsForSeason(seasonId).find((quote) => getQuotationKey(quote) === playerKey);
}

function readRosterWorkbook(file) {
  return new Promise((resolve, reject) => {
    if (!window.XLSX) {
      reject(new Error("Libreria XLSX non caricata. Controlla la connessione o il CDN."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = window.XLSX.read(new Uint8Array(event.target.result), { type: "array" });
        const sheetName = workbook.SheetNames.includes("TutteLeRose") ? "TutteLeRose" : workbook.SheetNames[0];
        const rows = window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: null });

        const clubHeaderRow = 4;
        const firstDataRow = 6;
        const teams = [];

        for (let col = 0; col < (rows[clubHeaderRow] || []).length; col += 5) {
          const rawClubName = rows[clubHeaderRow]?.[col];
          const clubName = rawClubName ? String(rawClubName).trim() : "";
          if (!clubName) continue;

          const team = {
            sourceClubName: clubName,
            sourceClubKey: normalizeTextKey(clubName),
            startCol: col,
            residualCredits: null,
            players: [],
          };

          for (let rowIndex = firstDataRow; rowIndex < rows.length; rowIndex += 1) {
            const row = rows[rowIndex] || [];
            const roleCell = row[col];
            const nameCell = row[col + 1];
            const teamCell = row[col + 2];
            const costCell = row[col + 3];

            const residual = parseResidualCredits(roleCell);
            if (residual !== null) {
              team.residualCredits = residual;
              continue;
            }

            if (!nameCell || !roleCell) continue;

            const role = normalizeRosterRole(roleCell);
            const playerName = String(nameCell).trim();
            const playerKey = getPlayerKeyFromName(playerName);
            const cost = toNumber(costCell) ?? 0;

            if (!playerKey) continue;

            team.players.push({
              sourceClubName: clubName,
              sourceClubKey: team.sourceClubKey,
              rowNumber: rowIndex + 1,
              classic_role: role,
              role_class: role === "P" ? "P" : "MOVIMENTO",
              player_key: playerKey,
              player_name: playerName,
              real_team: teamCell ? String(teamCell).trim() : null,
              purchase_price: cost,
            });
          }

          teams.push(team);
        }

        resolve({ sheetName, teams, totalPlayers: teams.reduce((sum, team) => sum + team.players.length, 0) });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Impossibile leggere il file Excel delle rose."));
    reader.readAsArrayBuffer(file);
  });
}

function renderRosterImportReport(stats) {
  if (!el.rosterImportReport) return;
  const clubRows = stats.clubs
    .map((club) => `
      <tr>
        <td>${escapeHtml(club.sourceClubName)}</td>
        <td>${escapeHtml(club.savedClubName)}</td>
        <td class="number">${club.players}</td>
        <td class="number">${fmtFm(club.spent)}</td>
        <td class="number">${club.residualCredits ?? "-"}</td>
      </tr>
    `)
    .join("");

  el.rosterImportReport.innerHTML = `
    <div class="import-summary-grid">
      <div><span>Club letti</span><strong>${stats.clubs.length}</strong></div>
      <div><span>Giocatori importati</span><strong>${stats.insertedRosterEntries}</strong></div>
      <div><span>Giocatori creati/aggiornati</span><strong>${stats.playersUpserted}</strong></div>
      <div><span>Movimenti FM</span><strong>${stats.movementsInserted}</strong></div>
      <div><span>Totale speso</span><strong>${fmtFm(stats.totalSpent)}</strong></div>
      <div><span>Saltati</span><strong>${stats.skipped}</strong></div>
    </div>
    <div class="table-wrap mini-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Squadra nel file</th>
            <th>Club DB</th>
            <th class="number">Giocatori</th>
            <th class="number">Speso</th>
            <th class="number">Crediti residui file</th>
          </tr>
        </thead>
        <tbody>${clubRows}</tbody>
      </table>
    </div>
  `;
  el.rosterImportReport.classList.remove("hidden");
}

async function updateClubsFromRosterTeams(teams) {
  const assignments = new Map();
  const orderedClubs = getClubAssignmentOrder();
  const usedClubIds = new Set();

  for (let index = 0; index < teams.length; index += 1) {
    const team = teams[index];
    const existingByName = getClubByNameKey(team.sourceClubKey);
    let club = existingByName && !usedClubIds.has(existingByName.id) ? existingByName : null;

    if (!club) {
      club = orderedClubs.find((candidate) => !usedClubIds.has(candidate.id)) || null;
    }

    if (!club) {
      const newId = `club_${team.sourceClubKey || index + 1}`.slice(0, 48);
      const { data, error } = await state.supabase
        .from("clubs")
        .insert({ id: newId, name: team.sourceClubName, president: `Presidente ${team.sourceClubName}`, active: true })
        .select("*")
        .single();
      if (error) throw error;
      club = data;
      state.clubs.push(club);
    } else if (club.name !== team.sourceClubName) {
      const { data, error } = await state.supabase
        .from("clubs")
        .update({ name: team.sourceClubName, president: club.president || `Presidente ${team.sourceClubName}`, active: true })
        .eq("id", club.id)
        .select("*")
        .single();
      if (error) throw error;
      Object.assign(club, data);
    }

    usedClubIds.add(club.id);
    assignments.set(team.sourceClubKey, club);
  }

  return assignments;
}

function mapRosterTeamsToExistingClubs(teams) {
  const assignments = new Map();
  const orderedClubs = getClubAssignmentOrder();
  const usedClubIds = new Set();

  for (let index = 0; index < teams.length; index += 1) {
    const team = teams[index];
    const existingByName = getClubByNameKey(team.sourceClubKey);
    const club = (existingByName && !usedClubIds.has(existingByName.id))
      ? existingByName
      : orderedClubs.find((candidate) => !usedClubIds.has(candidate.id));
    if (!club) throw new Error(`Impossibile associare il club ${team.sourceClubName}.`);
    usedClubIds.add(club.id);
    assignments.set(team.sourceClubKey, club);
  }

  return assignments;
}

async function handleRosterUpload(event) {
  event.preventDefault();
  el.rosterUploadStatus.textContent = "Lettura file rose...";
  el.rosterImportReport.classList.add("hidden");

  const file = el.rosterFile.files?.[0];
  const seasonId = el.rosterSeason.value;
  const label = el.rosterLabel.value.trim() || null;
  const shouldUpdateClubs = el.rosterUpdateClubs.checked;
  const shouldReplace = el.rosterReplaceExisting.checked;
  const shouldRegisterMovements = el.rosterRegisterMovements.checked;

  if (!file) {
    el.rosterUploadStatus.textContent = "Seleziona un file Excel delle rose.";
    return;
  }

  try {
    const parsed = await readRosterWorkbook(file);
    if (!parsed.teams.length || !parsed.totalPlayers) {
      el.rosterUploadStatus.textContent = "Nessuna rosa riconosciuta nel file.";
      return;
    }

    el.rosterUploadStatus.textContent = `Riconosciute ${parsed.teams.length} rose e ${parsed.totalPlayers} giocatori...`;

    const clubAssignments = shouldUpdateClubs
      ? await updateClubsFromRosterTeams(parsed.teams)
      : mapRosterTeamsToExistingClubs(parsed.teams);

    if (shouldReplace) {
      await state.supabase
        .from("fm_movements")
        .delete()
        .eq("season_id", seasonId)
        .eq("reference_type", "ROSTER_IMPORT");
      await state.supabase
        .from("roster_entries")
        .delete()
        .eq("season_id", seasonId)
        .not("roster_import_id", "is", null);
    }

    const { data: rosterImport, error: importError } = await state.supabase
      .from("roster_imports")
      .insert({
        season_id: seasonId,
        file_name: file.name,
        label,
        total_clubs: parsed.teams.length,
        total_players: parsed.totalPlayers,
        created_by: state.user?.id || null,
      })
      .select("*")
      .single();
    if (importError) throw importError;

    const rosterRows = parsed.teams.flatMap((team) => team.players);
    const playerPayloads = rosterRows.map((row) => {
      const quote = getLatestQuoteByPlayerKeyForSeason(row.player_key, seasonId);
      const existing = getPlayerByKey(row.player_key);
      return {
        player_key: row.player_key,
        name: quote?.player_name || existing?.name || row.player_name,
        real_team: quote?.real_team || row.real_team || existing?.real_team || null,
        classic_role: quote?.classic_role || row.classic_role || existing?.classic_role || null,
        mantra_roles: quote?.mantra_roles || existing?.mantra_roles || row.classic_role || "",
        role_class: quote?.role_class || existing?.role_class || row.role_class,
        is_asterisked: quote ? !quote.is_listed : Boolean(existing?.is_asterisked),
      };
    });

    const savedPlayers = await insertRowsInChunks("players", playerPayloads, {
      upsert: true,
      onConflict: "player_key",
    });
    const playerByKey = new Map(savedPlayers.map((player) => [String(player.player_key), player]));

    const rosterEntries = [];
    const movements = [];
    const existingRosterKeys = new Set(
      state.rosterEntries
        .filter((entry) => entry.season_id === seasonId && entry.is_active)
        .map((entry) => `${entry.club_id}:${entry.player_id}`),
    );

    let skipped = 0;
    for (const team of parsed.teams) {
      const club = clubAssignments.get(team.sourceClubKey);
      if (!club) throw new Error(`Club non associato: ${team.sourceClubName}`);

      for (const row of team.players) {
        const player = playerByKey.get(row.player_key);
        if (!player) {
          skipped += 1;
          continue;
        }
        const rosterKey = `${club.id}:${player.id}`;
        if (!shouldReplace && existingRosterKeys.has(rosterKey)) {
          skipped += 1;
          continue;
        }
        existingRosterKeys.add(rosterKey);

        rosterEntries.push({
          season_id: seasonId,
          club_id: club.id,
          player_id: player.id,
          purchase_price: row.purchase_price,
          acquired_via: "AUCTION",
          acquired_at: todayIso(),
          is_active: true,
          is_loan: false,
          roster_import_id: rosterImport.id,
          source_row: row.rowNumber,
          source_club_name: row.sourceClubName,
          source_real_team: row.real_team,
          notes: `Import rose ${file.name}`,
        });

        if (shouldRegisterMovements && row.purchase_price > 0) {
          movements.push({
            season_id: seasonId,
            club_id: club.id,
            amount: -Math.abs(row.purchase_price),
            movement_type: "AUCTION_BUY",
            description: `Import rose - ${row.player_name}`,
            reference_type: "ROSTER_IMPORT",
            reference_id: rosterImport.id,
            created_by: state.user?.id || null,
          });
        }
      }
    }

    const insertedRosterEntries = rosterEntries.length ? await insertRowsInChunks("roster_entries", rosterEntries) : [];
    const insertedMovements = movements.length ? await insertRowsInChunks("fm_movements", movements) : [];

    const clubStats = parsed.teams.map((team) => {
      const club = clubAssignments.get(team.sourceClubKey);
      const spent = team.players.reduce((sum, player) => sum + Number(player.purchase_price || 0), 0);
      return {
        sourceClubName: team.sourceClubName,
        savedClubName: club?.name || "-",
        players: team.players.length,
        spent,
        residualCredits: team.residualCredits,
      };
    });

    renderRosterImportReport({
      clubs: clubStats,
      insertedRosterEntries: insertedRosterEntries.length,
      playersUpserted: savedPlayers.length,
      movementsInserted: insertedMovements.length,
      totalSpent: clubStats.reduce((sum, club) => sum + club.spent, 0),
      skipped,
    });

    el.rosterUploadStatus.textContent = "Rose caricate correttamente.";
    el.rosterUploadForm.reset();
    el.rosterSeason.value = seasonId;
    el.rosterUpdateClubs.checked = true;
    el.rosterReplaceExisting.checked = true;
    el.rosterRegisterMovements.checked = true;
    await fetchAll();
  } catch (error) {
    el.rosterUploadStatus.textContent = error.message || "Errore durante l'importazione delle rose.";
  }
}

function normalizeMovement(type, rawAmount) {
  const value = Number(rawAmount);

  if (!Number.isFinite(value) || value === 0) {
    throw new Error("Inserisci un importo diverso da zero.");
  }

  if (type === "ADJUSTMENT") {
    return {
      movementType: "ADJUSTMENT",
      amount: value,
      label: value > 0 ? "Rettifica positiva" : "Rettifica negativa",
    };
  }

  const absoluteAmount = Math.abs(value);

  const movementRules = {
    INITIAL_BUDGET: { dbType: "INITIAL_BUDGET", sign: 1, label: "Entrata" },
    AUCTION_BUY: { dbType: "AUCTION_BUY", sign: -1, label: "Uscita" },
    RELEASE_REFUND: { dbType: "RELEASE_REFUND", sign: 1, label: "Entrata" },

    TRADE_FM_IN: { dbType: "TRADE_FM", sign: 1, label: "Entrata" },
    TRADE_FM_OUT: { dbType: "TRADE_FM", sign: -1, label: "Uscita" },

    LOAN_FM_IN: { dbType: "LOAN_FM", sign: 1, label: "Entrata" },
    LOAN_FM_OUT: { dbType: "LOAN_FM", sign: -1, label: "Uscita" },

    STADIUM_BUILD: { dbType: "STADIUM_BUILD", sign: -1, label: "Uscita" },
    STADIUM_MAINTENANCE: { dbType: "STADIUM_MAINTENANCE", sign: -1, label: "Uscita" },
    STADIUM_REVENUE: { dbType: "STADIUM_REVENUE", sign: 1, label: "Entrata" },

    PRIZE: { dbType: "PRIZE", sign: 1, label: "Entrata" },
    PENALTY: { dbType: "PENALTY", sign: -1, label: "Uscita" },
  };

  const rule = movementRules[type];

  if (!rule) {
    throw new Error(`Tipo movimento non riconosciuto: ${type}`);
  }

  return {
    movementType: rule.dbType,
    amount: absoluteAmount * rule.sign,
    label: rule.label,
  };
}

function getMovementPreview() {
  try {
    return normalizeMovement(el.movementType.value, el.movementAmount.value || "1");
  } catch {
    return null;
  }
}

function updateMovementSignHint() {
  if (!el.movementSignHint) return;

  const type = el.movementType.value;

  if (type === "ADJUSTMENT") {
    el.movementSignHint.textContent = "Rettifica libera: usa + o - in base alla correzione da fare.";
    el.movementSignHint.className = "field-hint";
    return;
  }

  const preview = getMovementPreview();
  if (!preview) {
    el.movementSignHint.textContent = "Il segno viene applicato automaticamente.";
    el.movementSignHint.className = "field-hint";
    return;
  }

  const signText = preview.amount > 0 ? "+" : "-";
  el.movementSignHint.textContent = `${preview.label}: verrà salvato come ${signText}${fmtFm(Math.abs(preview.amount))}.`;
  el.movementSignHint.className = `field-hint ${preview.amount < 0 ? "hint-negative" : "hint-positive"}`;
}

function showError(message) {
  el.errorBox.textContent = message;
  el.errorBox.classList.remove("hidden");
}

function clearError() {
  el.errorBox.textContent = "";
  el.errorBox.classList.add("hidden");
}

function getClubBalance(clubId, seasonId = getSelectedSeasonId()) {
  return state.movements
    .filter((movement) => movement.club_id === clubId && movement.season_id === seasonId)
    .reduce((sum, movement) => sum + Number(movement.amount || 0), 0);
}

function getClubStadium(clubId, seasonId = getSelectedSeasonId()) {
  return state.stadiums.find(
    (stadium) => stadium.club_id === clubId && stadium.season_id === seasonId,
  );
}

function getClubById(clubId) {
  return state.clubs.find((club) => club.id === clubId);
}

function getClubSeasonIdentity(clubId, seasonId = getSelectedSeasonId()) {
  if (!clubId || !seasonId) return null;
  return state.clubSeasonIdentities.find((identity) => identity.club_id === clubId && identity.season_id === seasonId) || null;
}

function getMostRecentStadiumName(clubId, seasonId = getSelectedSeasonId()) {
  const byIdentity = state.clubSeasonIdentities
    .filter((identity) => identity.club_id === clubId && identity.stadium_name)
    .sort((a, b) => String(b.season_id || "").localeCompare(String(a.season_id || "")))[0]?.stadium_name;
  if (byIdentity) return byIdentity;
  const byStadium = state.stadiums
    .filter((stadium) => stadium.club_id === clubId && stadium.name)
    .sort((a, b) => String(b.season_id || "").localeCompare(String(a.season_id || "")))[0]?.name;
  if (byStadium) return byStadium;
  const club = getClubById(clubId);
  return club?.stadium_name || (club ? `Stadio ${club.name}` : "");
}

function applyClubSeasonIdentity(club, seasonId = getSelectedSeasonId()) {
  if (!club) return null;
  const identity = getClubSeasonIdentity(club.id, seasonId);
  if (!identity) return { ...club, stadium_name: club.stadium_name || getMostRecentStadiumName(club.id, seasonId) };
  return {
    ...club,
    name: identity.display_name || club.name,
    president: identity.president || club.president,
    logo_data_url: identity.logo_data_url || club.logo_data_url,
    stadium_name: identity.stadium_name || getMostRecentStadiumName(club.id, seasonId),
    base_name: club.name,
  };
}

function getCurrentClubs() {
  return state.clubs.filter((club) => club.active !== false);
}

function getClubsForSeason(seasonId = getSelectedSeasonId()) {
  const ids = new Set();

  state.clubSeasonIdentities
    .filter((identity) => identity.season_id === seasonId)
    .forEach((identity) => { if (identity.club_id) ids.add(identity.club_id); });

  state.rosterEntries
    .filter((entry) => entry.season_id === seasonId)
    .forEach((entry) => { if (entry.club_id) ids.add(entry.club_id); });

  state.calendarMatches
    .filter((match) => match.season_id === seasonId)
    .forEach((match) => {
      if (match.home_club_id) ids.add(match.home_club_id);
      if (match.away_club_id) ids.add(match.away_club_id);
      if (match.manual_winner_club_id) ids.add(match.manual_winner_club_id);
    });

  const seasonCompetitionIds = new Set(
    state.competitions
      .filter((competition) => competition.season_id === seasonId)
      .map((competition) => competition.id),
  );

  state.competitionStandings
    .filter((standing) => seasonCompetitionIds.has(standing.competition_id))
    .forEach((standing) => { if (standing.club_id) ids.add(standing.club_id); });

  if (!ids.size) return getCurrentClubs();

  return state.clubs.filter((club) => ids.has(club.id));
}

function getCalendarCompetitionSeasonId() {
  const competition = getCompetitionById(el.calendarCompetition?.value);
  return competition?.season_id || getSelectedSeasonId();
}

function renderClubOptionsForSeason(seasonId = getSelectedSeasonId()) {
  return getClubsForSeason(seasonId)
    .map((club) => {
      const displayClub = applyClubSeasonIdentity(club, seasonId) || club;
      return `<option value="${escapeHtml(club.id)}">${escapeHtml(displayClub.name || club.name)}</option>`;
    })
    .join("");
}

function updateCalendarManualWinnerOptions() {
  if (!el.calendarManualWinnerClub) return;

  const seasonId = getCalendarCompetitionSeasonId();
  const selected = el.calendarManualWinnerClub.value || "";
  const homeId = el.calendarHomeClub?.value || "";
  const awayId = el.calendarAwayClub?.value || "";
  const candidateIds = [homeId, awayId].filter(Boolean);
  const candidates = candidateIds.length
    ? candidateIds.map((id) => getClubById(id)).filter(Boolean)
    : getClubsForSeason(seasonId);

  const options = candidates
    .map((club) => {
      const displayClub = applyClubSeasonIdentity(club, seasonId) || club;
      return `<option value="${escapeHtml(club.id)}">${escapeHtml(displayClub.name || club.name)}</option>`;
    })
    .join("");

  selectOptionPreservingValue(
    el.calendarManualWinnerClub,
    `<option value="">Automatico / nessuno</option>${options}`,
    selected,
    "",
  );
}

function updateCalendarClubOptions() {
  const seasonId = getCalendarCompetitionSeasonId();
  const clubOptions = renderClubOptionsForSeason(seasonId);
  const fallbackClubId = getClubsForSeason(seasonId)[0]?.id || "";

  if (el.calendarHomeClub) {
    selectOptionPreservingValue(el.calendarHomeClub, `<option value="">-</option>${clubOptions}`, el.calendarHomeClub.value, fallbackClubId);
  }
  if (el.calendarAwayClub) {
    selectOptionPreservingValue(el.calendarAwayClub, `<option value="">-</option>${clubOptions}`, el.calendarAwayClub.value, "");
  }

  updateCalendarManualWinnerOptions();
}

function getHonorClubById(honorClubId) {
  return state.honorClubs.find((club) => club.id === honorClubId);
}

function getHonorClubForEntry(entry) {
  if (!entry) return null;
  return getHonorClubById(entry.honor_club_id) || state.honorClubs.find((club) => club.source_club_id === entry.club_id) || getClubById(entry.club_id);
}

function honorClubButton(honorClub, extraClass = "") {
  if (!honorClub) return "-";
  return `<button class="link-button club-link ${extraClass}" type="button" data-honor-club-id="${escapeHtml(honorClub.id)}">${clubNameWithLogo(honorClub)}</button>`;
}

function getPalmaresForClubIds(clubId, honorClubId) {
  // Deve usare buildHonorRows(), non solo state.honorRoll.
  // state.honorRoll contiene solo le voci inserite manualmente nell'Albo d'oro;
  // buildHonorRows() aggiunge anche i podi/vincitori ricavati automaticamente
  // dalle finali di Coppa Italia, Champions League e Playoff.
  const currentHonor = state.honorClubs.find((club) => club.source_club_id === clubId);
  const ids = new Set([honorClubId, currentHonor?.id].filter(Boolean));
  const names = new Set([currentHonor?.name, getHonorClubById(honorClubId)?.name, getClubById(clubId)?.name, ...state.clubSeasonIdentities.filter((identity) => identity.club_id === clubId).map((identity) => identity.display_name)].filter(Boolean).map(normalizeTextKey));

  return buildHonorRows().filter((entry) => {
    if (clubId && entry.club_id === clubId) return true;
    if (entry.honor_club_id && ids.has(entry.honor_club_id)) return true;
    if (entry.club_name && names.has(normalizeTextKey(entry.club_name))) return true;
    return false;
  });
}


function getHonorRowClubKey(row) {
  const linkedHonorClub = row.honor_club_id ? getHonorClubById(row.honor_club_id) : null;
  const sourceHonorClub = row.club_id ? state.honorClubs.find((club) => club.source_club_id === row.club_id) : null;
  const currentClub = row.club_id ? getClubById(row.club_id) : null;
  const preferredName = linkedHonorClub?.name || sourceHonorClub?.name || currentClub?.name || row.club_name || "";
  const normalizedName = normalizeTextKey(preferredName);
  return normalizedName || row.honor_club_id || row.club_id || "unknown-club";
}

function getHonorRowCompetitionKey(row) {
  const fallback = COMPETITION_LABELS[row.competition_type] || row.competition_type || "Competizione";
  return normalizeTextKey(row.competition_name || fallback) || normalizeTextKey(fallback) || "competizione";
}

function getHonorRowDedupKey(row) {
  return [
    row.season_id || "no-season",
    row.competition_type || "ALTRO",
    getHonorRowCompetitionKey(row),
    String(Number(row.placement || 0) || "no-placement"),
    getHonorRowClubKey(row),
  ].join("|");
}

function getHonorRowPresident(row) {
  return String(row.president || row.president_name || "").trim();
}

function getHonorRowPresidentKey(row) {
  return getPresidentKey(getHonorRowPresident(row)) || row.president_key || getHonorRowClubKey(row);
}

function getHonorRowsForPresidentKey(presidentKey) {
  if (!presidentKey) return [];
  return buildHonorRows().filter((row) => getHonorRowPresidentKey(row) === presidentKey);
}

function presidentButton({ president, presidentKey, teamName = "", logo = "" }, extraClass = "") {
  const safeKey = presidentKey || getPresidentKey(president);
  const display = displayPresidents(president) || "Presidente";
  const logoHtml = logo ? `<img src="${escapeHtml(logo)}" alt="" class="club-logo" loading="lazy" />` : `<span class="club-logo club-logo-placeholder">${escapeHtml(String(display || "?").slice(0, 1).toUpperCase())}</span>`;
  const suffix = teamName ? `<small class="muted"><span class="president-team-separator">—</span> ${escapeHtml(teamName)}</small>` : "";
  return `<button class="link-button club-link ${extraClass}" type="button" data-honor-president-key="${escapeHtml(safeKey)}">${logoHtml}<span><strong>${escapeHtml(display)}</strong>${suffix}</span></button>`;
}

function honorMobilePresidentCell({ president, presidentKey, teamName = "", logo = "" }) {
  const safeKey = presidentKey || getPresidentKey(president);
  const display = displayPresidents(president) || "Presidente";
  const logoHtml = logo
    ? `<img src="${escapeHtml(logo)}" alt="" class="club-logo" loading="lazy" />`
    : `<span class="club-logo club-logo-placeholder">${escapeHtml(String(display || "?").slice(0, 1).toUpperCase())}</span>`;
  const team = teamName ? `<small>${escapeHtml(teamName)}</small>` : "";
  return `<button class="link-button mobile-honor-president-cell" type="button" data-honor-president-key="${escapeHtml(safeKey)}">${logoHtml}<span>${escapeHtml(display)}</span>${team}</button>`;
}

function getHonorSourcePriority(row) {
  const priorities = {
    manual: 1,
    "calendar-final": 2,
    calendar: 3,
    standing: 4,
  };
  return priorities[row.source] || 9;
}

function mergeHonorRows(existing, candidate) {
  const existingPriority = getHonorSourcePriority(existing);
  const candidatePriority = getHonorSourcePriority(candidate);

  if (candidatePriority < existingPriority) {
    return {
      ...candidate,
      notes: candidate.notes || existing.notes || null,
      points: candidate.points ?? existing.points ?? null,
      fantapoints: candidate.fantapoints ?? existing.fantapoints ?? null,
      played: candidate.played ?? existing.played ?? null,
      wins: candidate.wins ?? existing.wins ?? null,
      draws: candidate.draws ?? existing.draws ?? null,
      losses: candidate.losses ?? existing.losses ?? null,
      goals_for: candidate.goals_for ?? existing.goals_for ?? null,
      goals_against: candidate.goals_against ?? existing.goals_against ?? null,
      goal_difference: candidate.goal_difference ?? existing.goal_difference ?? null,
    };
  }

  return {
    ...existing,
    notes: existing.notes || candidate.notes || null,
    points: existing.points ?? candidate.points ?? null,
    fantapoints: existing.fantapoints ?? candidate.fantapoints ?? null,
    played: existing.played ?? candidate.played ?? null,
    wins: existing.wins ?? candidate.wins ?? null,
    draws: existing.draws ?? candidate.draws ?? null,
    losses: existing.losses ?? candidate.losses ?? null,
    goals_for: existing.goals_for ?? candidate.goals_for ?? null,
    goals_against: existing.goals_against ?? candidate.goals_against ?? null,
    goal_difference: existing.goal_difference ?? candidate.goal_difference ?? null,
  };
}

function dedupeHonorRows(rows) {
  const map = new Map();

  for (const row of rows) {
    const key = getHonorRowDedupKey(row);
    const existing = map.get(key);
    map.set(key, existing ? mergeHonorRows(existing, row) : row);
  }

  return Array.from(map.values());
}

function getClubMovements(clubId, seasonId = null) {
  return state.movements
    .filter((movement) => movement.club_id === clubId && (!seasonId || movement.season_id === seasonId))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function getClubReleaseMovements(clubId, seasonId = null) {
  return getClubMovements(clubId, seasonId).filter((movement) => movement.movement_type === "RELEASE_REFUND");
}

function getPlayerById(playerId) {
  return state.players.find((player) => player.id === playerId);
}

function getPlayerByKey(playerKey) {
  return state.players.find((player) => player.player_key === playerKey);
}

function getClubByNameKey(nameKey) {
  return state.clubs.find((club) => normalizeTextKey(club.name) === nameKey);
}

function getActiveRosterEntries(clubId, seasonId = state.selectedRosterSeason || getSelectedSeasonId()) {
  return state.rosterEntries.filter(
    (entry) => entry.club_id === clubId && entry.season_id === seasonId && entry.is_active,
  );
}

function getRosterStats(clubId, seasonId = state.selectedRosterSeason || getSelectedSeasonId()) {
  const entries = getActiveRosterEntries(clubId, seasonId);
  let goalkeepers = 0;
  let outfieldPlayers = 0;

  for (const entry of entries) {
    const player = entry.players || getPlayerById(entry.player_id);
    if (isGoalkeeperPlayer(player)) {
      goalkeepers += 1;
    } else {
      outfieldPlayers += 1;
    }
  }

  const total = entries.length;
  const issues = [];

  if (total < 18) issues.push(`rosa sotto minimo (${total}/18)`);
  if (total > 33) issues.push(`rosa sopra massimo (${total}/33)`);
  if (goalkeepers < 2) issues.push(`portieri insufficienti (${goalkeepers}/2)`);
  if (goalkeepers > 5) issues.push(`troppi portieri (${goalkeepers}/5)`);
  if (outfieldPlayers < 16) issues.push(`movimento sotto minimo (${outfieldPlayers}/16)`);
  if (outfieldPlayers > 28) issues.push(`movimento sopra massimo (${outfieldPlayers}/28)`);

  return { total, goalkeepers, outfieldPlayers, issues };
}

function buildRosterRows() {
  return state.rosterEntries.map((entry) => ({
    entry,
    player: entry.players || getPlayerById(entry.player_id),
    club: entry.club || getClubById(entry.club_id),
    loanFromClub: entry.loan_from_club || getClubById(entry.loan_from_club_id),
  }));
}


function getCompetitionById(id) {
  return state.competitions.find((competition) => competition.id === id);
}

function getStadiumLevelData(level) {
  return state.stadiumLevels.find((entry) => Number(entry.level) === Number(level));
}

function clubButton(club, extraClass = "", seasonId = getSelectedSeasonId()) {
  if (!club) return "-";
  const displayClub = applyClubSeasonIdentity(club, seasonId) || club;
  return `<button class="link-button club-link ${extraClass}" type="button" data-roster-club-id="${escapeHtml(club.id)}">${clubNameWithLogo(displayClub)}</button>`;
}

function playerButton(playerId, label) {
  if (!playerId) return escapeHtml(label || "-");
  return `<button class="link-button" type="button" data-player-id="${escapeHtml(playerId)}">${escapeHtml(label || "Giocatore")}</button>`;
}

function renderCupPodium(competition, maxPlacement = 3) {
  const rows = buildHonorRows()
    .filter((row) => row.season_id === competition.season_id && row.competition_type === competition.competition_type && Number(row.placement || 0) <= maxPlacement)
    .sort((a, b) => Number(a.placement || 999) - Number(b.placement || 999));

  if (!rows.length) return `<p class="muted">Podio non ancora inserito nell'Albo d'oro.</p>`;

  return `<div class="stack-list podium-list">
    ${rows.map((row) => `<div class="stack-item">
      <div><strong>${renderHonorClubName(row)}</strong><small>${escapeHtml(row.competition_name || competition.name)}${row.notes ? ` · ${escapeHtml(row.notes)}` : ""}</small></div>
      <div class="stack-item-side"><strong>${row.placement}°</strong></div>
    </div>`).join("")}
  </div>`;
}

function getMatchGoals(match) {
  const home = match.home_goals !== null && match.home_goals !== undefined ? Number(match.home_goals) : null;
  const away = match.away_goals !== null && match.away_goals !== undefined ? Number(match.away_goals) : null;
  if (!Number.isFinite(home) || !Number.isFinite(away)) return null;
  return { home, away };
}

function getRegularSeasonStandingRows(competition) {
  if (!competition || competition.competition_type !== "REGULAR_SEASON") return [];

  const table = new Map();
  const ensure = (clubId) => {
    if (!clubId) return null;
    if (!table.has(clubId)) {
      table.set(clubId, {
        club_id: clubId,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        points: 0,
        goals_for: 0,
        goals_against: 0,
        goal_difference: 0,
        fantapoints: 0,
        position: null,
      });
    }
    return table.get(clubId);
  };

  const matches = state.calendarMatches.filter((match) => match.competition_id === competition.id);
  for (const match of matches) {
    const goals = getMatchGoals(match);
    if (!goals || !match.home_club_id || !match.away_club_id) continue;

    const home = ensure(match.home_club_id);
    const away = ensure(match.away_club_id);
    if (!home || !away) continue;

    home.played += 1;
    away.played += 1;
    home.goals_for += goals.home;
    home.goals_against += goals.away;
    away.goals_for += goals.away;
    away.goals_against += goals.home;
    home.fantapoints += Number(match.home_score || 0);
    away.fantapoints += Number(match.away_score || 0);

    if (goals.home > goals.away) {
      home.wins += 1; home.points += 3; away.losses += 1;
    } else if (goals.home < goals.away) {
      away.wins += 1; away.points += 3; home.losses += 1;
    } else {
      home.draws += 1; away.draws += 1; home.points += 1; away.points += 1;
    }
  }

  return Array.from(table.values())
    .map((row) => ({ ...row, goal_difference: row.goals_for - row.goals_against }))
    .sort((a, b) => Number(b.points || 0) - Number(a.points || 0)
      || Number(b.goal_difference || 0) - Number(a.goal_difference || 0)
      || Number(b.goals_for || 0) - Number(a.goals_for || 0)
      || Number(b.fantapoints || 0) - Number(a.fantapoints || 0)
      || String(getClubById(a.club_id)?.name || a.club_id).localeCompare(String(getClubById(b.club_id)?.name || b.club_id), "it", { sensitivity: "base" }))
    .map((row, index) => ({ ...row, position: index + 1 }));
}

function getStandingRowsForCompetition(competition) {
  if (!competition) return { rows: [], source: "none" };
  if (competition?.competition_type && competition.competition_type !== "REGULAR_SEASON") {
    return { rows: [], source: "cup" };
  }

  const computedRows = getRegularSeasonStandingRows(competition);
  const manualRows = state.competitionStandings
    .filter((row) => row.competition_id === competition.id)
    .sort((a, b) => Number(a.position || 999) - Number(b.position || 999) || Number(b.points || 0) - Number(a.points || 0));

  if (computedRows.length) {
    return { rows: computedRows, source: "computed" };
  }

  return {
    rows: manualRows.map((row, index) => ({
      ...row,
      position: row.position || index + 1,
      wins: row.wins ?? null,
      draws: row.draws ?? null,
      losses: row.losses ?? null,
      goal_difference: Number(row.goals_for || 0) - Number(row.goals_against || 0),
      source: "manual",
    })),
    source: manualRows.length ? "manual" : "none",
  };
}

function renderStandingTable(competition, limit = null) {
  if (!competition) return `<p class="muted">Nessuna competizione selezionata.</p>`;
  if (competition?.competition_type && competition.competition_type !== "REGULAR_SEASON") {
    return renderCupPodium(competition);
  }

  const { rows, source } = getStandingRowsForCompetition(competition);

  if (!rows.length) return `<p class="muted">Nessuna classifica inserita o calcolabile. Inserisci i risultati delle partite o una classifica manuale della Regular Season.</p>`;

  const standingSource = source === "computed" ? "Classifica calcolata dai risultati delle partite." : "Classifica manuale caricata dal database.";

  return `
    <small class="muted standing-source-note">${standingSource}</small>
    <div class="table-wrap compact-table standing-table-wrap mobile-tabular-wrap">
      <table class="standing-table mobile-standing-table">
        <thead>
          <tr>
            <th class="standing-desktop-col">#</th>
            <th class="standing-desktop-col">Club</th>
            <th class="number standing-desktop-col">Pt</th>
            <th class="number standing-desktop-col">G</th>
            <th class="number standing-desktop-col standing-optional">V</th>
            <th class="number standing-desktop-col standing-optional">N</th>
            <th class="number standing-desktop-col standing-optional">P</th>
            <th class="number standing-desktop-col standing-optional">GF</th>
            <th class="number standing-desktop-col standing-optional">GS</th>
            <th class="number standing-desktop-col standing-optional">DR</th>
            <th class="number standing-desktop-col">FP</th>
            <th class="mobile-only-col number mobile-standing-position-head">#</th>
            <th class="mobile-only-col mobile-standing-logo-head">SQ</th>
            <th class="mobile-only-col number mobile-standing-played-head">G</th>
            <th class="mobile-only-col number mobile-standing-points-head">PT</th>
            <th class="mobile-only-col number mobile-standing-fpt-head">FPT</th>
          </tr>
        </thead>
        <tbody>
          ${rows.slice(0, limit || rows.length).map((row, index) => {
            const club = getClubById(row.club_id);
            const fp = Number(row.fantapoints || 0) ? Number(row.fantapoints).toFixed(1) : (row.fantapoints ?? "-");
            return `<tr>
              <td class="standing-desktop-col">${row.position || index + 1}</td>
              <td class="standing-desktop-col">${clubButton(club)}</td>
              <td class="number standing-desktop-col"><strong>${row.points ?? "-"}</strong></td>
              <td class="number standing-desktop-col">${row.played ?? "-"}</td>
              <td class="number standing-desktop-col standing-optional">${row.wins ?? "-"}</td>
              <td class="number standing-desktop-col standing-optional">${row.draws ?? "-"}</td>
              <td class="number standing-desktop-col standing-optional">${row.losses ?? "-"}</td>
              <td class="number standing-desktop-col standing-optional">${row.goals_for ?? "-"}</td>
              <td class="number standing-desktop-col standing-optional">${row.goals_against ?? "-"}</td>
              <td class="number standing-desktop-col standing-optional">${row.goal_difference ?? "-"}</td>
              <td class="number standing-desktop-col">${fp}</td>
              <td class="mobile-only-cell number mobile-standing-position">${row.position || index + 1}</td>
              <td class="mobile-only-cell mobile-standing-logo-cell">${clubLogoHtml(applyClubSeasonIdentity(club, competition.season_id) || club || { name: row.club_name || "Club" })}</td>
              <td class="mobile-only-cell number mobile-standing-played">${row.played ?? "-"}</td>
              <td class="mobile-only-cell number mobile-standing-points"><strong>${row.points ?? "-"}</strong></td>
              <td class="mobile-only-cell number mobile-standing-fpt">${fp}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function getMatchDisplayClubs(match) {
  const competition = getCompetitionById(match?.competition_id);
  const seasonId = competition?.season_id || match?.season_id || getSelectedSeasonId();
  const homeBase = getClubById(match?.home_club_id);
  const awayBase = getClubById(match?.away_club_id);
  return {
    competition,
    seasonId,
    homeBase,
    awayBase,
    home: applyClubSeasonIdentity(homeBase, seasonId) || homeBase || { name: "Casa" },
    away: applyClubSeasonIdentity(awayBase, seasonId) || awayBase || { name: "Trasferta" },
  };
}

function getMatchResultText(match) {
  const goals = getMatchGoals(match);
  if (goals) return `${goals.home}-${goals.away}`;
  if (match?.status === "PLAYED") return "-";
  return MATCH_STATUS_LABELS[match?.status] || match?.status || "-";
}

function renderMobileMatchCard(match) {
  const { competition, home, away } = getMatchDisplayClubs(match);
  const result = getMatchResultText(match);
  const manualWinner = match.manual_winner_club_id ? getClubById(match.manual_winner_club_id) : null;
  const manualWinnerDisplay = manualWinner ? applyClubSeasonIdentity(manualWinner, competition?.season_id || match.season_id) || manualWinner : null;
  const meta = [match.matchday_label || "Giornata", match.played_on ? fmtDateOnly(match.played_on) : ""].filter(Boolean).join(" · ");
  const manualNote = manualWinnerDisplay
    ? `<small class="mobile-match-note">Vincitrice: ${escapeHtml(manualWinnerDisplay.name || manualWinnerDisplay.club_name || "-")}${match.manual_winner_note ? ` · ${escapeHtml(match.manual_winner_note)}` : ""}</small>`
    : "";

  return `<div class="mobile-match-card">
    <div class="mobile-match-meta">${escapeHtml(meta)}</div>
    <div class="mobile-match-scoreboard">
      <div class="mobile-match-team">
        ${clubLogoHtml(home)}
        <span>${escapeHtml(home?.name || home?.club_name || "Casa")}</span>
      </div>
      <strong class="mobile-match-score">${escapeHtml(result)}</strong>
      <div class="mobile-match-team">
        ${clubLogoHtml(away)}
        <span>${escapeHtml(away?.name || away?.club_name || "Trasferta")}</span>
      </div>
    </div>
    ${manualNote}
  </div>`;
}

function renderMatchList(matches) {
  if (!matches.length) return `<p class="muted">Nessuna giornata inserita.</p>`;
  return matches
    .map((match) => {
      const { competition, homeBase, awayBase } = getMatchDisplayClubs(match);
      const goals = getMatchGoals(match);
      const resultScore = goals
        ? `<strong class="result-score">${goals.home} - ${goals.away}</strong>`
        : `<span class="muted">${MATCH_STATUS_LABELS[match.status] || match.status || "Da giocare"}</span>`;
      const fpScore = match.home_score !== null && match.home_score !== undefined && match.away_score !== null && match.away_score !== undefined
        ? `<small>FP ${match.home_score} - ${match.away_score}</small>`
        : "";
      const manualWinner = match.manual_winner_club_id ? getClubById(match.manual_winner_club_id) : null;
      const manualWinnerText = manualWinner
        ? `<small>Vincitrice manuale: ${clubButton(manualWinner, "", competition?.season_id || match.season_id)}${match.manual_winner_note ? ` · ${escapeHtml(match.manual_winner_note)}` : ""}</small>`
        : "";
      return `<div class="stack-item match-stack-item">
        <div class="match-desktop-content">
          <strong>${escapeHtml(match.matchday_label || "Giornata")}</strong>
          <span>${escapeHtml(competition?.name || "Competizione")}${match.played_on ? ` · ${fmtDateOnly(match.played_on)}` : ""}</span>
          <small>${clubButton(homeBase, "", competition?.season_id || match.season_id)} vs ${clubButton(awayBase, "", competition?.season_id || match.season_id)}</small>
          ${manualWinnerText}
        </div>
        ${renderMobileMatchCard(match)}
        <div class="stack-item-side match-desktop-content">${resultScore}${fpScore}</div>
      </div>`;
    })
    .join("");
}

function getCurrentAndPreviousMatches(seasonId) {
  const matches = state.calendarMatches
    .filter((match) => match.season_id === seasonId)
    .sort((a, b) => {
      const ad = a.played_on ? new Date(a.played_on) : new Date("2999-12-31");
      const bd = b.played_on ? new Date(b.played_on) : new Date("2999-12-31");
      return ad - bd || String(a.matchday_label || "").localeCompare(String(b.matchday_label || ""));
    });

  const now = new Date();
  const previous = [...matches].filter((match) => match.played_on && new Date(match.played_on) <= now).slice(-6);
  const current = matches.filter((match) => !match.played_on || new Date(match.played_on) >= now).slice(0, 6);
  return { previous, current };
}

async function loadAuthState() {
  const { data, error } = await state.supabase.auth.getSession();
  if (error) throw error;
  state.user = data.session?.user || null;

  if (!state.user) {
    state.isAdmin = false;
    return;
  }

  const { data: profile, error: profileError } = await state.supabase
    .from("profiles")
    .select("role")
    .eq("id", state.user.id)
    .single();

  if (profileError) {
    state.isAdmin = false;
    return;
  }

  state.isAdmin = profile?.role === "admin";
}

async function fetchAll() {
  clearError();
  await fetchCoreData();
  await loadPageData(getCurrentPage(), { force: true });
  renderAll();
}

async function fetchCoreData() {
  const seasonId = state.selectedSeason || ACTIVE_SEASON_ID;

  const [
    seasons,
    clubs,
    news,
    competitions,
    competitionStandings,
    calendarMatches,
    movements,
    stadiums,
    stadiumLevels,
    clubSeasonIdentities,
  ] = await Promise.all([
    fetchAllRows(() => state.supabase.from("seasons").select("*").order("starts_on", { ascending: false })),
    fetchAllRows(() => state.supabase.from("clubs").select("*").order("name", { ascending: true })),
    fetchAllRows(() => state.supabase.from("news_posts").select("*").order("created_at", { ascending: false })).catch((error) => {
      if (error?.code === "42P01") return [];
      throw error;
    }),
    fetchAllRows(() => state.supabase.from("competitions").select("*").order("created_at", { ascending: true })).catch((error) => {
      if (error?.code === "42P01") return [];
      throw error;
    }),
    fetchAllRows(() => state.supabase.from("competition_standings").select("*").order("position", { ascending: true })).catch((error) => {
      if (error?.code === "42P01") return [];
      throw error;
    }),
    fetchAllRows(() => state.supabase.from("calendar_matches").select("*").eq("season_id", seasonId).order("played_on", { ascending: true, nullsFirst: false })).catch((error) => {
      if (error?.code === "42P01") return [];
      throw error;
    }),
    fetchAllRows(() => state.supabase.from("fm_movements").select("*").eq("season_id", seasonId).order("created_at", { ascending: false })),
    fetchAllRows(() => state.supabase.from("stadiums").select("*").eq("season_id", seasonId)),
    fetchAllRows(() => state.supabase.from("stadium_levels").select("*").order("level", { ascending: true })),
    fetchAllRows(() => state.supabase.from("club_season_identities").select("*")).catch((error) => {
      if (error?.code === "42P01") return [];
      throw error;
    }),
  ]);

  state.seasons = seasons || [];
  state.clubs = clubs || [];
  state.news = news || [];
  state.competitions = competitions || [];
  state.competitionStandings = competitionStandings || [];
  state.calendarMatches = calendarMatches || [];
  state.movements = movements || [];
  state.stadiums = stadiums || [];
  state.stadiumLevels = stadiumLevels || [];
  state.clubSeasonIdentities = clubSeasonIdentities || [];

  if (!state.seasons.some((season) => season.id === state.selectedSeason)) {
    state.selectedSeason = state.seasons.find((season) => season.id === ACTIVE_SEASON_ID)?.id || state.seasons[0]?.id || ACTIVE_SEASON_ID;
  }
  if (!state.seasons.some((season) => season.id === state.selectedListoneSeason)) {
    state.selectedListoneSeason = state.selectedSeason;
  }
  if (!state.seasons.some((season) => season.id === state.selectedRosterSeason)) {
    state.selectedRosterSeason = state.selectedSeason;
  }
}

function mergeById(existing, incoming) {
  const map = new Map((existing || []).map((item) => [item.id, item]));
  for (const item of incoming || []) map.set(item.id, item);
  return Array.from(map.values());
}

function resetLoadedScopesForSeason() {
  state.loadedScopes = new Set();
  state.players = [];
  state.rosterEntries = [];
  state.playerQuotations = [];
  state.allLatestQuotations = [];
  state.latestQuotations = [];
  state.listoneUploads = [];
  state.rosterImports = [];
  state.honorRoll = [];
  state.honorClubs = [];
  state.competitionStandings = [];
}

async function loadPageData(pageId, { force = false } = {}) {
  const page = pageId || getCurrentPage();
  const seasonId = getSelectedSeasonId();
  const scopeKey = `${page}:${seasonId}`;
  if (!force && state.loadedScopes.has(scopeKey)) return;

  if (page === "dashboard" || page === "clubs" || page === "rosters" || page === "admin") {
    const rosterEntries = await fetchAllRows(() =>
      state.supabase
        .from("roster_entries")
        .select(`
          *,
          players(*),
          club:clubs!roster_entries_club_id_fkey(id, name, president, active, logo_data_url),
          loan_from_club:clubs!roster_entries_loan_from_club_id_fkey(id, name, president, active, logo_data_url)
        `)
        .eq("season_id", seasonId)
        .order("created_at", { ascending: false })
    );
    state.rosterEntries = mergeById(state.rosterEntries, rosterEntries || []);
  }

  if (page === "listone" || page === "admin") {
    const [latestPlayerQuotations, listoneUploads, players] = await Promise.all([
      fetchAllRows(() => state.supabase.from("latest_player_quotations").select("*").eq("season_id", state.selectedListoneSeason || seasonId).order("player_name", { ascending: true })),
      fetchAllRows(() => state.supabase.from("listone_uploads").select("*").eq("season_id", state.selectedListoneSeason || seasonId).order("created_at", { ascending: false })),
      fetchAllRows(() => state.supabase.from("players").select("*").order("name", { ascending: true })),
    ]);
    state.allLatestQuotations = mergeById(state.allLatestQuotations, latestPlayerQuotations || []);
    state.latestQuotations = getLatestQuotationsForSeason(state.selectedListoneSeason || seasonId);
    state.listoneUploads = mergeById(state.listoneUploads, listoneUploads || []);
    state.players = mergeById(state.players, players || []);
  }

  if (page === "honor" || page === "admin") {
    const [honorRoll, honorClubs, competitionStandings, allCalendarMatches] = await Promise.all([
      fetchAllRows(() => state.supabase.from("honor_roll_entries").select("*").order("season_id", { ascending: false })).catch((error) => error?.code === "42P01" ? [] : Promise.reject(error)),
      fetchAllRows(() => state.supabase.from("honor_clubs").select("*").order("name", { ascending: true })).catch((error) => error?.code === "42P01" ? [] : Promise.reject(error)),
      fetchAllRows(() => state.supabase.from("competition_standings").select("*").order("position", { ascending: true })).catch((error) => error?.code === "42P01" ? [] : Promise.reject(error)),
      fetchAllRows(() => state.supabase.from("calendar_matches").select("*").order("played_on", { ascending: true, nullsFirst: false })).catch((error) => error?.code === "42P01" ? [] : Promise.reject(error)),
    ]);
    state.honorRoll = honorRoll || [];
    state.honorClubs = honorClubs || [];
    state.competitionStandings = competitionStandings || [];
    state.calendarMatches = mergeById(state.calendarMatches, allCalendarMatches || []);
  }

  if (page === "finance" || page === "admin") {
    const [movements, stadiums, rosterImports] = await Promise.all([
      fetchAllRows(() => state.supabase.from("fm_movements").select("*").order("created_at", { ascending: false })),
      fetchAllRows(() => state.supabase.from("stadiums").select("*")),
      fetchAllRows(() => state.supabase.from("roster_imports").select("*").order("created_at", { ascending: false })).catch((error) => error?.code === "42P01" ? [] : Promise.reject(error)),
    ]);
    state.movements = movements || [];
    state.stadiums = stadiums || [];
    state.rosterImports = rosterImports || [];
  }

  if (page === "competitions" || page === "dashboard") {
    const [seasonMatches, competitionStandings] = await Promise.all([
      fetchAllRows(() => state.supabase.from("calendar_matches").select("*").eq("season_id", seasonId).order("played_on", { ascending: true, nullsFirst: false })).catch((error) => error?.code === "42P01" ? [] : Promise.reject(error)),
      fetchAllRows(() => state.supabase.from("competition_standings").select("*").order("position", { ascending: true })).catch((error) => error?.code === "42P01" ? [] : Promise.reject(error)),
    ]);
    state.calendarMatches = mergeById(state.calendarMatches, seasonMatches || []);
    state.competitionStandings = mergeById(state.competitionStandings, competitionStandings || []);
  }

  state.loadedScopes.add(scopeKey);
}

function getDisplaySeasonId() {
  return state.selectedSeason || ACTIVE_SEASON_ID;
}

function getSelectedSeasonId() {
  return getDisplaySeasonId();
}

function renderSeasonControl() {
  if (!el.globalSeasonSelect) return;

  const currentValue = state.seasons.some((season) => season.id === state.selectedSeason)
    ? state.selectedSeason
    : (state.seasons.find((season) => season.id === ACTIVE_SEASON_ID)?.id || state.seasons[0]?.id || ACTIVE_SEASON_ID);

  const seasonOptions = state.seasons
    .map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name)}</option>`)
    .join("");
  if (el.globalSeasonSelect) {
    el.globalSeasonSelect.innerHTML = seasonOptions;
    el.globalSeasonSelect.value = currentValue;
  }
  if (el.dashboardSeasonSelect) {
    el.dashboardSeasonSelect.innerHTML = seasonOptions;
    el.dashboardSeasonSelect.value = currentValue;
  }
  state.selectedSeason = currentValue;
  if (el.dashboardSeasonText) {
    el.dashboardSeasonText.textContent = `Stagione visualizzata: ${currentValue}`;
  }
}

function applyDisplayedSeason(seasonId, { render = true } = {}) {
  if (!seasonId) return;

  state.selectedSeason = seasonId;
  state.selectedRosterSeason = seasonId;
  state.selectedListoneSeason = seasonId;
  state.latestQuotations = getLatestQuotationsForSeason(seasonId);

  if (el.globalSeasonSelect) el.globalSeasonSelect.value = seasonId;
  if (el.dashboardSeasonSelect) el.dashboardSeasonSelect.value = seasonId;
  if (el.rosterSeasonFilter) el.rosterSeasonFilter.value = seasonId;
  if (el.listoneSeasonFilter) el.listoneSeasonFilter.value = seasonId;
  if (el.movementSeason) el.movementSeason.value = seasonId;
  if (el.listoneSeason) el.listoneSeason.value = seasonId;
  if (el.rosterSeason) el.rosterSeason.value = seasonId;
  if (el.auctionSeason) {
    el.auctionSeason.value = seasonId;
    renderAuctionPlayerOptions();
    updateAuctionFieldsFromSelectedPlayer();
  }

  resetLoadedScopesForSeason();
  if (render) {
    fetchCoreData()
      .then(() => loadPageData(getCurrentPage(), { force: true }))
      .then(() => renderAll())
      .catch((error) => showError(error.message || String(error)));
  }
}


function renderGlobalSeasonSelector() {
  if (!el.globalSeasonSelect) return;
  const currentValue = getSelectedSeasonId();
  el.globalSeasonSelect.innerHTML = state.seasons
    .map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name || season.id)}</option>`)
    .join("");
  el.globalSeasonSelect.value = state.seasons.some((season) => season.id === currentValue)
    ? currentValue
    : (state.seasons[0]?.id || ACTIVE_SEASON_ID);
  if (el.dashboardSeasonText) {
    el.dashboardSeasonText.textContent = `Stagione visualizzata: ${el.globalSeasonSelect.value}`;
  }
}

function setViewedSeason(seasonId, options = {}) {
  if (!seasonId || !state.seasons.some((season) => season.id === seasonId)) return;
  state.selectedSeason = seasonId;
  state.selectedRosterSeason = seasonId;
  state.selectedListoneSeason = seasonId;
  state.latestQuotations = getLatestQuotationsForSeason(seasonId);
  if (el.globalSeasonSelect) el.globalSeasonSelect.value = seasonId;
  if (el.dashboardSeasonSelect) el.dashboardSeasonSelect.value = seasonId;
  if (el.rosterSeasonFilter) el.rosterSeasonFilter.value = seasonId;
  if (el.listoneSeasonFilter) el.listoneSeasonFilter.value = seasonId;
  if (el.movementSeason) el.movementSeason.value = seasonId;
  if (el.auctionSeason) el.auctionSeason.value = seasonId;
  if (el.listoneSeason) el.listoneSeason.value = seasonId;
  if (el.rosterSeason) el.rosterSeason.value = seasonId;
  resetLoadedScopesForSeason();
  if (!options.skipRender) {
    fetchCoreData()
      .then(() => loadPageData(getCurrentPage(), { force: true }))
      .then(() => renderAll())
      .catch((error) => showError(error.message || String(error)));
  }
}

function renderMetrics() {
  const currentClubs = getCurrentClubs();
  const clubCount = currentClubs.length;
  const seasonId = getSelectedSeasonId();
  const balances = currentClubs.map((club) => getClubBalance(club.id, seasonId));
  const total = balances.reduce((sum, value) => sum + value, 0);
  const average = clubCount ? total / clubCount : 0;
  const negativeBalances = balances.filter((value) => value < 0).length;

  // La dashboard è lazy-loaded: prima di segnalare problemi di rosa/formazione
  // verifichiamo che esistano davvero rose caricate per la stagione selezionata.
  // In assenza di rose, evitiamo falsi alert tipo "0 portieri" per tutti i club.
  const hasRosterDataForSeason = state.rosterEntries.some((entry) => entry.season_id === seasonId && entry.is_active);
  const rosterIssues = hasRosterDataForSeason
    ? currentClubs.filter((club) => getRosterStats(club.id, seasonId).issues.length > 0).length
    : 0;
  const alerts = negativeBalances + rosterIssues;

  el.metricClubs.textContent = String(clubCount);
  el.metricTotalFm.textContent = fmtFm(total);
  el.metricAvgFm.textContent = fmtFm(average);
  el.metricAlerts.textContent = hasRosterDataForSeason ? String(alerts) : (negativeBalances ? String(negativeBalances) : "0");
  el.metricAlerts.title = hasRosterDataForSeason
    ? `${negativeBalances} saldi negativi, ${rosterIssues} rose da verificare`
    : "Nessuna rosa caricata per questa stagione: controllo rose non applicato.";
  el.metricAlerts.classList.toggle("danger", alerts > 0);
}

function renderClubs() {
  const query = state.search.trim().toLowerCase();
  const seasonId = getSelectedSeasonId();
  const rows = getCurrentClubs()
    .map((club) => ({
      ...club,
      balance: getClubBalance(club.id, seasonId),
      stadium: getClubStadium(club.id, seasonId),
      roster: getRosterStats(club.id, seasonId),
    }))
    .filter((club) => {
      if (!query) return true;
      return `${club.name} ${club.president}`.toLowerCase().includes(query);
    })
    .sort((a, b) => b.balance - a.balance);

  if (!rows.length) {
    el.clubsTableBody.innerHTML = `<tr><td colspan="7" class="muted center">Nessun club trovato.</td></tr>`;
    return;
  }

  el.clubsTableBody.innerHTML = rows
    .map((club, index) => {
      const isNegative = club.balance < 0;
      const hasRosterIssues = club.roster.issues.length > 0;
      const hasIssues = isNegative || hasRosterIssues;
      const status = isNegative
        ? "Saldo negativo"
        : hasRosterIssues
          ? club.roster.issues[0]
          : "OK";

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${clubButton(club)}${club.active === false ? '<span class="mini-badge">non attivo</span>' : ""}</td>
          <td>${escapeHtml(displayPresidents(club.president))}</td>
          <td class="number ${isNegative ? "text-danger" : ""}">${fmtFm(club.balance)}</td>
          <td class="number">${club.roster.total} <span class="muted small">(${club.roster.goalkeepers} P)</span></td>
          <td class="number">${escapeHtml(club.stadium?.name || "Stadio")}<br><span class="muted small">Liv. ${club.stadium?.level ?? 0}</span></td>
          <td><span class="status ${hasIssues ? "status-danger" : "status-ok"}">${escapeHtml(status)}</span></td>
        </tr>
      `;
    })
    .join("");
}

function renderRosterFilters() {
  if (el.rosterSeasonFilter) {
    const currentSeason = state.selectedRosterSeason || state.selectedSeason || ACTIVE_SEASON_ID;
    el.rosterSeasonFilter.innerHTML = state.seasons
      .map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name)}</option>`)
      .join("");
    el.rosterSeasonFilter.value = state.seasons.some((season) => season.id === currentSeason)
      ? currentSeason
      : getSelectedSeasonId();
    state.selectedRosterSeason = el.rosterSeasonFilter.value;
  }

  const currentValue = el.rosterClubFilter.value || state.rosterClubFilter;
  el.rosterClubFilter.innerHTML = [
    `<option value="all">Tutti i club</option>`,
    ...getCurrentClubs().map((club) => `<option value="${escapeHtml(club.id)}">${escapeHtml(club.name)}</option>`),
  ].join("");
  el.rosterClubFilter.value = getCurrentClubs().some((club) => club.id === currentValue) ? currentValue : "all";
  state.rosterClubFilter = el.rosterClubFilter.value;
}

function renderRoster() {
  const query = state.rosterSearch.trim().toLowerCase();
  const selectedClub = state.rosterClubFilter;
  const selectedSeason = state.selectedRosterSeason || getSelectedSeasonId();
  const rows = buildRosterRows()
    .filter(({ entry, player, club }) => {
      if (entry.season_id !== selectedSeason) return false;
      if (selectedClub !== "all" && entry.club_id !== selectedClub) return false;
      if (!query) return true;
      return `${player?.name || ""} ${player?.real_team || ""} ${player?.mantra_roles || ""} ${club?.name || ""}`
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => (a.club?.name || "").localeCompare(b.club?.name || "") || (a.player?.name || "").localeCompare(b.player?.name || ""));

  if (!rows.length) {
    const countsBySeason = state.rosterEntries.reduce((acc, entry) => {
      acc[entry.season_id] = (acc[entry.season_id] || 0) + 1;
      return acc;
    }, {});
    const otherSeasons = Object.entries(countsBySeason)
      .filter(([season]) => season !== selectedSeason)
      .map(([season, count]) => `${escapeHtml(season)}: ${count}`)
      .join(" · ");
    const hint = otherSeasons
      ? `<br><span class="muted small">Ci sono rose importate in altre stagioni (${otherSeasons}). Cambia il filtro stagione.</span>`
      : "";
    el.rosterTableBody.innerHTML = `<tr><td colspan="11" class="muted center">Nessun giocatore in rosa per la stagione ${escapeHtml(selectedSeason)}.${hint}</td></tr>`;
    return;
  }

  el.rosterTableBody.innerHTML = rows
    .map(({ entry, player, club }) => {
      const latestQuote = player ? getLatestQuoteByPlayerIdForSeason(player.id, entry.season_id || ACTIVE_SEASON_ID) : null;
      const status = entry.is_active ? (latestQuote?.is_listed === false || player?.is_asterisked ? "Asteriscato" : "Attivo") : "Non attivo";
      const roleLabel = player?.role_class === "P" ? "Portiere" : "Movimento";
      return `
        <tr>
          <td class="roster-player-cell">${playerButton(player?.id || entry.player_id, player?.name || "Giocatore non trovato")}</td>
          <td class="desktop-only-cell">${club ? clubButton(club) : `<button class="link-button" type="button" data-roster-club-id="${escapeHtml(entry.club_id)}">${escapeHtml(entry.club_id)}</button>`}</td>
          <td class="desktop-only-cell">${escapeHtml(latestQuote?.real_team || player?.real_team || "-")}</td>
          <td class="desktop-only-cell">${escapeHtml(latestQuote?.mantra_roles || player?.mantra_roles || "-")}</td>
          <td class="desktop-only-cell">${roleLabel}</td>
          <td class="mobile-only-cell mobile-role-cell">${escapeHtml(latestQuote?.classic_role || player?.classic_role || player?.role_class || "-")}</td>
          <td class="mobile-only-cell mobile-mantra-cell">${escapeHtml(latestQuote?.mantra_roles || player?.mantra_roles || "-")}</td>
          <td class="mobile-only-cell mobile-team-cell">${escapeHtml(mobileTeamCode(latestQuote?.real_team || player?.real_team || entry.source_real_team || "-"))}</td>
          <td class="number mobile-cost-cell">${fmtFm(entry.purchase_price)}</td>
          <td class="desktop-only-cell">${escapeHtml(ACQUIRED_LABELS[entry.acquired_via] || entry.acquired_via)}</td>
          <td class="mobile-status-cell">${renderStatusDot(status)}</td>
        </tr>
      `;
    })
    .join("");
}



function roleSortValue(player, quote) {
  const role = String(quote?.classic_role || player?.classic_role || player?.role_class || "").toUpperCase();
  const map = { P: 1, D: 2, C: 3, A: 4 };
  return map[role] || 9;
}

function getRosterRowsForClub(clubId, seasonId = state.selectedRosterSeason || getSelectedSeasonId()) {
  return buildRosterRows()
    .filter(({ entry }) => entry.club_id === clubId && entry.season_id === seasonId && entry.is_active)
    .sort((a, b) => {
      const quoteA = a.player ? getLatestQuoteByPlayerIdForSeason(a.player.id, seasonId) : null;
      const quoteB = b.player ? getLatestQuoteByPlayerIdForSeason(b.player.id, seasonId) : null;
      return roleSortValue(a.player, quoteA) - roleSortValue(b.player, quoteB)
        || (a.player?.name || "").localeCompare(b.player?.name || "");
    });
}

function renderRosterClubCards() {
  if (!el.rosterClubCards) return;
  const seasonId = state.selectedRosterSeason || getSelectedSeasonId();
  const cards = getCurrentClubs().map((club) => {
    const stats = getRosterStats(club.id, seasonId);
    const rows = getRosterRowsForClub(club.id, seasonId);
    const spent = rows.reduce((sum, { entry }) => sum + Number(entry.purchase_price || 0), 0);
    const issueClass = stats.issues.length ? "status-danger" : "status-ok";
    const issueText = stats.issues.length ? stats.issues[0] : "Rosa valida";
    return `
      <button class="roster-club-card" type="button" data-roster-club-id="${escapeHtml(club.id)}">
        <span class="roster-card-title">${clubNameWithLogo(club)}</span>
        <span class="muted small">${escapeHtml(displayPresidents(club.president))}</span>
        <span class="roster-card-stats">
          <strong>${stats.total}</strong> giocatori · <strong>${stats.goalkeepers}</strong> P · <strong>${fmtFm(spent)}</strong>
        </span>
        <span class="status ${issueClass}">${escapeHtml(issueText)}</span>
      </button>
    `;
  });
  el.rosterClubCards.innerHTML = cards.join("");
}

function renderClubExtraSections({ clubId, honorClubId = null, seasonId = getSelectedSeasonId() }) {
  const movements = clubId ? getClubMovements(clubId).slice(0, 30) : [];
  const releases = clubId ? getClubReleaseMovements(clubId).slice(0, 20) : [];

  const movementRows = movements.map((movement) => {
    const amount = Number(movement.amount || 0);
    return `<tr>
      <td>${escapeHtml(movement.season_id || "-")}</td>
      <td>${escapeHtml(MOVEMENT_LABELS[movement.movement_type] || movement.movement_type || "-")}</td>
      <td>${escapeHtml(movement.description || "-")}</td>
      <td class="number ${amount < 0 ? "text-danger" : "text-ok"}">${amount > 0 ? "+" : ""}${fmtFm(amount)}</td>
    </tr>`;
  }).join("");

  const releaseRows = releases.map((movement) => `<tr>
    <td>${escapeHtml(movement.season_id || "-")}</td>
    <td>${escapeHtml(movement.description || "Rimborso svincolo")}</td>
    <td class="number">${fmtFm(movement.amount)}</td>
    <td>${fmtDate(movement.created_at)}</td>
  </tr>`).join("");

  return `
    ${clubId ? `<section class="detail-section"><h3>Movimenti FM</h3><div class="table-wrap compact-table"><table><thead><tr><th>Stagione</th><th>Tipo</th><th>Descrizione</th><th class="number">Importo</th></tr></thead><tbody>${movementRows || '<tr><td colspan="4" class="muted center">Nessun movimento registrato.</td></tr>'}</tbody></table></div></section>` : ""}
    ${clubId ? `<section class="detail-section"><h3>Svincoli effettuati</h3><div class="table-wrap compact-table"><table><thead><tr><th>Stagione</th><th>Descrizione</th><th class="number">Rimborso</th><th>Data</th></tr></thead><tbody>${releaseRows || '<tr><td colspan="4" class="muted center">Nessuno svincolo registrato.</td></tr>'}</tbody></table></div></section>` : ""}
  `;
}

function getHonorRowsForHonorClub(honorClub) {
  if (!honorClub) return [];
  return buildHonorRows().filter((row) => {
    if (row.honor_club_id && row.honor_club_id === honorClub.id) return true;
    if (honorClub.source_club_id && row.club_id === honorClub.source_club_id) return true;
    return normalizeTextKey(row.club_name) === normalizeTextKey(honorClub.name);
  });
}

function getHonorVictoriesForHonorClub(honorClub) {
  return getHonorRowsForHonorClub(honorClub)
    .filter((row) => Number(row.placement || 0) === 1)
    .sort((a, b) => String(b.season_id).localeCompare(String(a.season_id)) || String(a.competition_name).localeCompare(String(b.competition_name)));
}

function renderHonorContextButton(row, honorClub) {
  return `<button class="button button-secondary button-small honor-context-button" type="button" data-honor-context-season="${escapeHtml(row.season_id)}" data-honor-context-type="${escapeHtml(row.competition_type)}" data-honor-context-name="${escapeHtml(row.competition_name || "")}" data-honor-context-club="${escapeHtml(honorClub?.id || "")}" data-honor-context-club-id="${escapeHtml(row.club_id || "")}">Apri stagione</button>`;
}

function findCompetitionForHonorContext(seasonId, competitionType, competitionName = "") {
  const byName = state.competitions.find((competition) => competition.season_id === seasonId && competition.competition_type === competitionType && competition.name === competitionName);
  if (byName) return byName;
  return state.competitions.find((competition) => competition.season_id === seasonId && competition.competition_type === competitionType);
}

function renderHonorContextDetail({ seasonId, competitionType, competitionName, honorClubId, clubId: explicitClubId = null }) {
  const target = document.getElementById("honorContextDetail");
  if (!target) return;
  const honorClub = getHonorClubById(honorClubId);
  const contextClub = explicitClubId ? applyClubSeasonIdentity(getClubById(explicitClubId), seasonId) : null;
  const contextName = contextClub?.name || honorClub?.name || "Squadra";
  const competition = findCompetitionForHonorContext(seasonId, competitionType, competitionName);
  if (!honorClub && !contextClub) {
    target.innerHTML = `<p class="muted">Squadra storica non trovata.</p>`;
    return;
  }
  if (!competition) {
    target.innerHTML = `<p class="muted">Competizione non trovata per ${escapeHtml(seasonId)}.</p>`;
    return;
  }

  const closeButton = `<div class="detail-actions"><button class="button button-secondary button-small" type="button" data-honor-context-close>Chiudi stagione</button></div>`;

  if (competition.competition_type === "REGULAR_SEASON") {
    target.innerHTML = `
      ${closeButton}
      <h3>${escapeHtml(competition.name)} · classifica ${escapeHtml(seasonId)}</h3>
      ${renderStandingTable(competition)}
    `;
    return;
  }

  const clubId = explicitClubId || honorClub.source_club_id;
  const matches = state.calendarMatches
    .filter((match) => match.competition_id === competition.id)
    .filter((match) => !clubId || match.home_club_id === clubId || match.away_club_id === clubId)
    .sort((a, b) => String(a.played_on || "9999-12-31").localeCompare(String(b.played_on || "9999-12-31")) || String(a.matchday_label || "").localeCompare(String(b.matchday_label || "")));

  target.innerHTML = `
    ${closeButton}
    <h3>${escapeHtml(competition.name)} · partite ${escapeHtml(applyClubSeasonIdentity(getClubById(clubId), seasonId)?.name || contextName)}</h3>
    ${clubId ? renderMatchList(matches) : `<p class="muted">Questa è una squadra storica non collegata a un club attuale: non posso filtrare automaticamente le partite per club.</p>${renderMatchList(matches)}`}
  `;
}

function showHonorClubDialog(honorClubId) {
  const honorClub = getHonorClubById(honorClubId);
  if (!honorClub) return;
  const current = honorClub.source_club_id ? getClubById(honorClub.source_club_id) : null;
  const victories = getHonorVictoriesForHonorClub(honorClub);
  const allRows = getHonorRowsForHonorClub(honorClub);

  const victoryRows = victories.map((row) => `<tr>
    <td>${escapeHtml(row.season_id || "-")}</td>
    <td>${escapeHtml(COMPETITION_LABELS[row.competition_type] || row.competition_type || "-")}</td>
    <td>${escapeHtml(row.competition_name || row.notes || "-")}</td>
    <td>${renderHonorContextButton(row, honorClub)}</td>
  </tr>`).join("");

  const podiumRows = allRows
    .filter((row) => Number(row.placement || 0) > 0)
    .sort((a, b) => String(b.season_id).localeCompare(String(a.season_id)) || Number(a.placement || 999) - Number(b.placement || 999))
    .map((row) => `<tr>
      <td>${escapeHtml(row.season_id || "-")}</td>
      <td>${escapeHtml(COMPETITION_LABELS[row.competition_type] || row.competition_type || "-")}</td>
      <td>${row.placement ? `${row.placement}°` : "-"}</td>
      <td>${escapeHtml(row.competition_name || row.notes || "-")}</td>
      <td>${renderHonorContextButton(row, honorClub)}</td>
    </tr>`).join("");

  el.rosterDialogTitle.textContent = `${honorClub.name} · storico`;
  el.rosterDialogBody.innerHTML = `
    <div class="player-summary-grid roster-summary-grid">
      <div><span>Squadra</span><strong>${clubNameWithLogo(honorClub)}</strong></div>
      <div><span>Presidente</span><strong>${escapeHtml(displayPresidents(honorClub.president || current?.president))}</strong></div>
      <div><span>Stato</span><strong>${current ? "Attuale" : "Storica"}</strong></div>
      <div><span>Vittorie totali</span><strong>${victories.length}</strong></div>
    </div>
    <section class="detail-section">
      <h3>Vittorie nelle competizioni</h3>
      <div class="table-wrap compact-table"><table><thead><tr><th>Stagione</th><th>Competizione</th><th>Voce</th><th>Dettaglio</th></tr></thead><tbody>${victoryRows || '<tr><td colspan="4" class="muted center">Nessuna vittoria registrata.</td></tr>'}</tbody></table></div>
    </section>
    <section class="detail-section">
      <h3>Palmarès e piazzamenti storici</h3>
      <div class="table-wrap compact-table"><table><thead><tr><th>Stagione</th><th>Competizione</th><th>Pos.</th><th>Voce</th><th>Dettaglio</th></tr></thead><tbody>${podiumRows || '<tr><td colspan="5" class="muted center">Nessun piazzamento registrato.</td></tr>'}</tbody></table></div>
    </section>
    <section id="honorContextDetail" class="detail-section honor-context-detail">
      <p class="muted">Clicca su “Apri stagione” per vedere la classifica della Regular Season o le partite della squadra nelle coppe.</p>
    </section>
    ${current ? renderClubExtraSections({ clubId: current.id, honorClubId }) : renderClubExtraSections({ clubId: null, honorClubId })}
  `;
  el.rosterDialog.showModal();
}

function showHonorPresidentDialog(presidentKey) {
  const allRows = getHonorRowsForPresidentKey(presidentKey)
    .sort((a, b) => String(b.season_id).localeCompare(String(a.season_id)) || Number(a.placement || 999) - Number(b.placement || 999));
  if (!allRows.length) return;

  const president = getHonorRowPresident(allRows[0]) || "Presidente";
  const victories = allRows.filter((row) => Number(row.placement || 0) === 1);

  const victoryRows = victories.map((row) => `<tr>
    <td>${escapeHtml(row.season_id || "-")}</td>
    <td>${escapeHtml(row.club_name || "-")}</td>
    <td>${escapeHtml(COMPETITION_LABELS[row.competition_type] || row.competition_type || "-")}</td>
    <td>${escapeHtml(row.competition_name || row.notes || "-")}</td>
    <td>${renderHonorContextButton(row, getHonorClubById(row.honor_club_id))}</td>
  </tr>`).join("");

  const podiumRows = allRows
    .filter((row) => Number(row.placement || 0) > 0)
    .map((row) => `<tr>
      <td>${escapeHtml(row.season_id || "-")}</td>
      <td>${escapeHtml(row.club_name || "-")}</td>
      <td>${escapeHtml(COMPETITION_LABELS[row.competition_type] || row.competition_type || "-")}</td>
      <td>${row.placement ? `${row.placement}°` : "-"}</td>
      <td>${escapeHtml(row.competition_name || row.notes || "-")}</td>
      <td>${renderHonorContextButton(row, getHonorClubById(row.honor_club_id))}</td>
    </tr>`).join("");

  const teams = Array.from(new Set(allRows.map((row) => row.club_name).filter(Boolean)));
  el.rosterDialogTitle.textContent = `${president} · storico`;
  el.rosterDialogBody.innerHTML = `
    <div class="player-summary-grid roster-summary-grid">
      <div><span>Presidente</span><strong>${escapeHtml(displayPresidents(president))}</strong></div>
      <div><span>Squadre usate</span><strong>${escapeHtml(teams.join(" · ") || "-")}</strong></div>
      <div><span>Vittorie totali</span><strong>${victories.length}</strong></div>
      <div><span>Piazzamenti totali</span><strong>${allRows.filter((row) => Number(row.placement || 0) > 0).length}</strong></div>
    </div>
    <section class="detail-section">
      <h3>Vittorie nelle competizioni</h3>
      <div class="table-wrap compact-table"><table><thead><tr><th>Stagione</th><th>Squadra</th><th>Competizione</th><th>Voce</th><th>Dettaglio</th></tr></thead><tbody>${victoryRows || '<tr><td colspan="5" class="muted center">Nessuna vittoria registrata.</td></tr>'}</tbody></table></div>
    </section>
    <section class="detail-section">
      <h3>Palmarès e piazzamenti storici</h3>
      <div class="table-wrap compact-table"><table><thead><tr><th>Stagione</th><th>Squadra</th><th>Competizione</th><th>Pos.</th><th>Voce</th><th>Dettaglio</th></tr></thead><tbody>${podiumRows || '<tr><td colspan="6" class="muted center">Nessun piazzamento registrato.</td></tr>'}</tbody></table></div>
    </section>
    <section id="honorContextDetail" class="detail-section honor-context-detail">
      <p class="muted">Clicca su “Apri stagione” per vedere la classifica della Regular Season o le partite della squadra nelle coppe.</p>
    </section>
  `;
  el.rosterDialog.showModal();
}

function showRosterDialog(clubId) {
  const club = getClubById(clubId);
  if (!club) return;
  const seasonId = state.selectedRosterSeason || getSelectedSeasonId();
  const rows = getRosterRowsForClub(clubId, seasonId);
  const stats = getRosterStats(clubId, seasonId);
  const spent = rows.reduce((sum, { entry }) => sum + Number(entry.purchase_price || 0), 0);

  el.rosterDialogTitle.textContent = `${club.name} · ${seasonId}`;

  const tableRows = rows.map(({ entry, player }) => {
    const quote = player ? getLatestQuoteByPlayerIdForSeason(player.id, seasonId) : null;
    const status = entry.is_active ? (quote?.is_listed === false || player?.is_asterisked ? "Asteriscato" : "Attivo") : "Non attivo";
    return `
      <tr>
        <td class="roster-player-cell">${playerButton(player?.id || entry.player_id, player?.name || "Giocatore non trovato")}</td>
        <td class="mobile-role-cell">${escapeHtml(quote?.classic_role || player?.classic_role || player?.role_class || "-")}</td>
        <td class="mobile-team-cell">${escapeHtml(mobileTeamCode(quote?.real_team || player?.real_team || entry.source_real_team || "-"))}</td>
        <td class="mobile-mantra-cell">${escapeHtml(quote?.mantra_roles || player?.mantra_roles || "-")}</td>
        <td class="number mobile-cost-cell">${fmtFm(entry.purchase_price)}</td>
        <td class="mobile-status-cell">${renderStatusDot(status)}</td>
      </tr>
    `;
  }).join("");

  el.rosterDialogBody.innerHTML = `
    <div class="player-summary-grid roster-summary-grid">
      <div><span>Giocatori</span><strong>${stats.total}</strong></div>
      <div><span>Portieri</span><strong>${stats.goalkeepers}</strong></div>
      <div><span>Movimento</span><strong>${stats.outfieldPlayers}</strong></div>
      <div><span>Costo rosa</span><strong>${fmtFm(spent)}</strong></div>
      <div><span>Saldo club</span><strong>${fmtFm(getClubBalance(clubId, seasonId))}</strong></div>
      <div><span>Stato</span><strong>${stats.issues.length ? escapeHtml(stats.issues[0]) : "OK"}</strong></div>
    </div>
    <div class="table-wrap compact-table roster-dialog-table mobile-tabular-wrap">
      <table class="mobile-tabular roster-dialog-players-table">
        <thead>
          <tr><th>Giocatore</th><th>R</th><th>Sq</th><th>RM</th><th class="number">Costo</th><th>Stato</th></tr>
        </thead>
        <tbody>${tableRows || '<tr><td colspan="6" class="muted center">Nessun giocatore in rosa.</td></tr>'}</tbody>
      </table>
    </div>
    ${renderClubExtraSections({ clubId, seasonId })}
  `;
  el.rosterDialog.showModal();
}


function getActiveRosterEntryForPlayer(playerId, seasonId = state.selectedListoneSeason || getSelectedSeasonId()) {
  if (!playerId) return null;
  return state.rosterEntries.find(
    (entry) => entry.player_id === playerId && entry.season_id === seasonId && entry.is_active
  ) || null;
}

function getRosterClubForPlayer(playerId, seasonId = state.selectedListoneSeason || getSelectedSeasonId()) {
  const entry = getActiveRosterEntryForPlayer(playerId, seasonId);
  if (!entry) return null;
  return entry.club || getClubById(entry.club_id);
}

function renderRosterCellForPlayer(playerId, seasonId = state.selectedListoneSeason || getSelectedSeasonId()) {
  const club = getRosterClubForPlayer(playerId, seasonId);
  if (!club) {
    return `<span class="desktop-inline"><span class="status status-muted">Svincolato</span></span><span class="mobile-inline mobile-sv-label">SV</span>`;
  }
  return `<span class="desktop-inline">${clubButton(club)}</span><span class="mobile-inline mobile-roster-logo-only" title="${escapeHtml(club.name || club.club_name || "Club")}">${clubLogoHtml(club)}</span>`;
}


function getQuoteSortValue(quote, key) {
  const club = getRosterClubForPlayer(quote.player_id, state.selectedListoneSeason);
  switch (key) {
    case "player_name": return quote.player_name || "";
    case "real_team": return quote.real_team || "";
    case "mantra_roles": return quote.mantra_roles || "";
    case "classic_role": return quote.classic_role || "";
    case "roster": return club?.name || "Svincolato";
    case "quotation_current": return Number(quote.quotation_current ?? -999999);
    case "fvm": return Number(quote.fvm ?? -999999);
    case "status": return quoteStatusLabel(quote);
    default: return quote.player_name || "";
  }
}

function sortQuotationRows(rows, sortState) {
  const { key = "player_name", direction = "asc" } = sortState || {};
  const dir = direction === "desc" ? -1 : 1;
  return [...rows].sort((a, b) => {
    const av = getQuoteSortValue(a, key);
    const bv = getQuoteSortValue(b, key);
    if (typeof av === "number" || typeof bv === "number") {
      return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
    }
    return String(av).localeCompare(String(bv), "it", { sensitivity: "base" }) * dir;
  });
}

function sortableTh(label, key, table) {
  const sortState = table === "freeAgents" ? state.freeAgentsSort : state.listoneSort;
  const active = sortState?.key === key;
  const arrow = active ? (sortState.direction === "asc" ? " ↑" : " ↓") : "";
  return `<button class="table-sort" type="button" data-sort-table="${escapeHtml(table)}" data-sort-key="${escapeHtml(key)}">${escapeHtml(label)}${arrow}</button>`;
}

function getFilteredListoneRows() {
  const query = state.listoneSearch.trim().toLowerCase();
  const roleFilter = state.listoneRoleFilter || "all";
  const filtered = state.latestQuotations
    .filter((quote) => {
      if (roleFilter !== "all" && String(quote.classic_role || "").toUpperCase() !== roleFilter) return false;
      if (!query) return true;
      const club = getRosterClubForPlayer(quote.player_id, state.selectedListoneSeason);
      return `${quote.player_name || ""} ${quote.real_team || ""} ${quote.mantra_roles || ""} ${quote.classic_role || ""} ${club?.name || ""}`
        .toLowerCase()
        .includes(query);
    })
    ;
  const activeRows = filtered.filter((quote) => quote.is_listed);
  const inactiveRows = filtered.filter((quote) => !quote.is_listed);
  return [
    ...sortQuotationRows(activeRows, state.listoneSort),
    ...sortQuotationRows(inactiveRows, state.listoneSort),
  ];
}

function renderListoneSeasonFilter() {
  if (!el.listoneSeasonFilter) return;
  const currentValue = state.selectedListoneSeason || state.selectedSeason || ACTIVE_SEASON_ID;
  el.listoneSeasonFilter.innerHTML = state.seasons
    .map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name)}</option>`)
    .join("");
  el.listoneSeasonFilter.value = state.seasons.some((season) => season.id === currentValue)
    ? currentValue
    : getSelectedSeasonId();
  state.selectedListoneSeason = el.listoneSeasonFilter.value;
  state.latestQuotations = getLatestQuotationsForSeason(state.selectedListoneSeason);
}

function renderListone() {
  state.latestQuotations = getLatestQuotationsForSeason(state.selectedListoneSeason);

  const latestUpload = getLatestListoneUploadForSeason(state.selectedListoneSeason);
  if (el.listoneMetaText) {
    if (latestUpload) {
      const label = latestUpload.label ? ` · ${escapeHtml(latestUpload.label)}` : "";
      const listoneDate = latestUpload.listone_date ? ` · data listone ${escapeHtml(latestUpload.listone_date)}` : "";
      el.listoneMetaText.innerHTML = `Stagione ${escapeHtml(state.selectedListoneSeason)} · ultimo upload ${fmtDate(latestUpload.created_at)}${label}${listoneDate} · ${state.latestQuotations.length} giocatori effettivi`;
    } else {
      el.listoneMetaText.textContent = `Nessun listone caricato per la stagione ${state.selectedListoneSeason}.`;
    }
  }

  const rows = getFilteredListoneRows();

  if (!rows.length) {
    el.listoneTableBody.innerHTML = `<tr><td colspan="9" class="muted center">Nessun listone caricato per questa stagione.</td></tr>`;
    renderFreeAgents();
    return;
  }

  el.listoneTableBody.innerHTML = rows
    .map((quote) => {
      const statusClass = quote.is_listed ? "status-ok" : "status-warning";
      return `
        <tr>
          <td class="listone-player-cell">${playerButton(quote.player_id, quote.player_name)}<br><span class="muted small mobile-hide-line">ID ${escapeHtml(quote.fantacalcio_id)} · key ${escapeHtml(getQuotationKey(quote))}</span></td>
          <td class="mobile-team-cell">${renderMobileTeam(quote.real_team || "-")}</td>
          <td class="mobile-mantra-cell listone-mantra-col">${escapeHtml(quote.mantra_roles || "-")}</td>
          <td class="mobile-role-cell"><span class="desktop-inline">${escapeHtml(quote.classic_role || "-")}</span><span class="mobile-inline mobile-role-combo">${escapeHtml(quote.classic_role || "-")} <small>(${escapeHtml(quote.mantra_roles || "-")})</small></span></td>
          <td class="mobile-roster-cell">${renderRosterCellForPlayer(quote.player_id, state.selectedListoneSeason)}</td>
          <td class="number mobile-quote-cell">${quote.quotation_current ?? "-"}</td>
          <td class="number mobile-fvm-cell listone-fvm-col">${quote.fvm ?? "-"}</td>
          <td class="mobile-status-cell">${renderStatusDot(quote.is_listed ? "In listone" : "Asteriscato")}</td>
          <td class="mobile-history-cell"><button class="link-button" type="button" data-player-id="${escapeHtml(quote.player_id)}"><span class="desktop-inline">Scheda</span><span class="mobile-inline">↗</span></button></td>
        </tr>
      `;
    })
    .join("");

  renderFreeAgents();
}

function renderFreeAgents() {
  if (!el.freeAgentsTableBody) return;

  const rows = sortQuotationRows(
    getFilteredListoneRows().filter(
      (quote) => quote.is_listed && !getActiveRosterEntryForPlayer(quote.player_id, state.selectedListoneSeason)
    ),
    state.freeAgentsSort
  );

  if (el.freeAgentsMetaText) {
    el.freeAgentsMetaText.textContent = `${rows.length} svincolati disponibili nel listone della stagione ${state.selectedListoneSeason}.`;
  }

  if (!state.latestQuotations.length) {
    el.freeAgentsTableBody.innerHTML = `<tr><td colspan="9" class="muted center">Nessun listone caricato per questa stagione.</td></tr>`;
    return;
  }

  if (!rows.length) {
    el.freeAgentsTableBody.innerHTML = `<tr><td colspan="9" class="muted center">Nessun giocatore svincolato trovato con i filtri attuali.</td></tr>`;
    return;
  }

  el.freeAgentsTableBody.innerHTML = rows
    .map((quote) => `
      <tr>
        <td class="listone-player-cell">${playerButton(quote.player_id, quote.player_name)}<br><span class="muted small mobile-hide-line">key ${escapeHtml(getQuotationKey(quote))}</span></td>
        <td class="mobile-team-cell">${renderMobileTeam(quote.real_team || "-")}</td>
        <td class="mobile-mantra-cell listone-mantra-col">${escapeHtml(quote.mantra_roles || "-")}</td>
        <td class="mobile-role-cell"><span class="desktop-inline">${escapeHtml(quote.classic_role || "-")}</span><span class="mobile-inline mobile-role-combo">${escapeHtml(quote.classic_role || "-")} <small>(${escapeHtml(quote.mantra_roles || "-")})</small></span></td>
        <td class="mobile-roster-cell"><span class="desktop-inline"><span class="status status-muted">Svincolato</span></span><span class="mobile-inline mobile-sv-label">SV</span></td>
        <td class="number mobile-quote-cell">${quote.quotation_current ?? "-"}</td>
        <td class="number mobile-fvm-cell listone-fvm-col">${quote.fvm ?? "-"}</td>
        <td class="mobile-status-cell">${renderStatusDot(quote.is_listed ? "In listone" : "Asteriscato")}</td>
        <td class="mobile-history-cell"><button class="link-button" type="button" data-player-id="${escapeHtml(quote.player_id)}"><span class="desktop-inline">Scheda</span><span class="mobile-inline">↗</span></button></td>
      </tr>
    `)
    .join("");
}

function showPlayerDialog(playerId) {
  const player = getPlayerById(playerId);
  const quotes = getPlayerQuotations(playerId);
  const latest = quotes.at(-1);
  const rosterSeasonId = state.selectedListoneSeason || getSelectedSeasonId();
  const rosterClub = getRosterClubForPlayer(playerId, rosterSeasonId);

  if (!player && !latest) return;

  el.playerDialogTitle.textContent = latest?.player_name || player?.name || "Giocatore";

  const rows = quotes
    .map((quote) => {
      const upload = getUploadById(quote.upload_id);
      const snapshotLabel = upload
        ? escapeHtml(fmtDateOnly(upload.listone_date || upload.created_at))
        : escapeHtml(fmtDateOnly(quote.created_at) || quote.season_id || "-");
      const reason = quote.left_listone_reason === "MISSING_FROM_LISTONE"
        ? "assente nel nuovo listone"
        : quote.left_listone_reason === "CEDUTI_SHEET"
          ? "foglio Ceduti"
          : "";
      return `
      <tr>
        <td>${snapshotLabel}<br><span class="muted small">${escapeHtml(upload?.season_id || quote.season_id || "-")}</span></td>
        <td>${escapeHtml(quote.real_team || "-")}</td>
        <td>${escapeHtml(quote.mantra_roles || "-")}</td>
        <td class="number">${quote.quotation_current ?? "-"}</td>
        <td class="number">${quote.fvm ?? "-"}</td>
        <td><span class="status ${quote.is_listed ? "status-ok" : "status-warning"}">${quoteStatusLabel(quote)}</span>${reason ? `<br><span class="muted small">${reason}</span>` : ""}</td>
      </tr>
    `;
    })
    .join("");

  const first = quotes[0];
  const priceDelta = latest && first && latest.quotation_current !== null && first.quotation_current !== null
    ? Number(latest.quotation_current) - Number(first.quotation_current)
    : null;
  const fvmDelta = latest && first && latest.fvm !== null && first.fvm !== null
    ? Number(latest.fvm) - Number(first.fvm)
    : null;

  el.playerDialogBody.innerHTML = `
    <div class="player-summary-grid">
      <div><span>Rosa (${escapeHtml(rosterSeasonId)})</span><strong>${rosterClub ? clubButton(rosterClub) : "Svincolato"}</strong></div>
      <div><span>Squadra</span><strong>${escapeHtml(latest?.real_team || player?.real_team || "-")}</strong></div>
      <div><span>Ruoli Mantra</span><strong>${escapeHtml(latest?.mantra_roles || player?.mantra_roles || "-")}</strong></div>
      <div><span>Qt.A attuale</span><strong>${latest?.quotation_current ?? "-"}</strong></div>
      <div><span>Delta Qt.A</span><strong class="${priceDelta < 0 ? "text-danger" : priceDelta > 0 ? "text-success" : ""}">${priceDelta === null ? "-" : (priceDelta > 0 ? "+" : "") + priceDelta}</strong></div>
      <div><span>FVM attuale</span><strong>${latest?.fvm ?? "-"}</strong></div>
      <div><span>Delta FVM</span><strong class="${fvmDelta < 0 ? "text-danger" : fvmDelta > 0 ? "text-success" : ""}">${fvmDelta === null ? "-" : (fvmDelta > 0 ? "+" : "") + fvmDelta}</strong></div>
      <div class="player-external-action"><span>Fantacalcio.it</span><strong>${buildFantacalcioPlayerUrl(player, latest) ? `<button class="button button-secondary button-small" type="button" data-fantacalcio-player-id="${escapeHtml(playerId)}">Apri scheda</button>` : "ID non disponibile"}</strong></div>
    </div>
    <div class="table-wrap compact-table">
      <table>
        <thead>
          <tr><th>Snapshot</th><th>Squadra</th><th>Ruoli</th><th class="number">Qt.A</th><th class="number">FVM</th><th>Stato</th></tr>
        </thead>
        <tbody>${rows || '<tr><td colspan="6" class="muted center">Nessuno storico disponibile.</td></tr>'}</tbody>
      </table>
    </div>
  `;

  el.playerDialog.showModal();
}

function openFantacalcioDialog(playerId) {
  const player = getPlayerById(playerId);
  const quotes = getPlayerQuotations(playerId);
  const latest = quotes.at(-1) || getLatestQuoteByPlayerId(playerId);
  const url = buildFantacalcioPlayerUrl(player, latest);

  if (!url) {
    showError("Non trovo il fantacalcio_id per questo giocatore. Carica un listone che contenga l'ID Fantacalcio.");
    return;
  }

  const title = latest?.player_name || player?.name || "Scheda Fantacalcio";
  el.fantacalcioDialogTitle.textContent = title;
  el.fantacalcioExternalLink.href = url;
  el.fantacalcioFrame.src = url;
  el.fantacalcioDialog.showModal();
}


function renderCompetitionContent(competition) {
  const matches = state.calendarMatches
    .filter((match) => match.competition_id === competition.id)
    .sort(competition.competition_type === "REGULAR_SEASON"
      ? ((a, b) => String(a.matchday_label || "").localeCompare(String(b.matchday_label || ""), "it", { numeric: true, sensitivity: "base" }) || String(a.played_on || "").localeCompare(String(b.played_on || "")))
      : sortMatchesByRoundAndDate);

  if (competition.competition_type === "REGULAR_SEASON") {
    return `<h4 class="desktop-competition-heading">Classifica</h4>${renderStandingTable(competition)}<h4 class="desktop-competition-heading">Calendario</h4>${renderMatchList(matches)}`;
  }
  return `<h4 class="desktop-competition-heading">Podio albo d'oro</h4><h4 class="mobile-competition-heading">Podio</h4>${renderCupPodium(competition, 2)}<h4 class="desktop-competition-heading">Partite</h4>${renderMatchList(matches)}`;
}

function getCompetitionMatches(competition) {
  if (!competition) return [];
  const sorter = competition.competition_type === "REGULAR_SEASON"
    ? ((a, b) => String(a.matchday_label || "").localeCompare(String(b.matchday_label || ""), "it", { numeric: true, sensitivity: "base" }) || String(a.played_on || "9999-12-31").localeCompare(String(b.played_on || "9999-12-31")))
    : sortMatchesByRoundAndDate;

  return state.calendarMatches
    .filter((match) => match.competition_id === competition.id)
    .sort(sorter);
}

function isPlayedMatch(match) {
  if (!match) return false;
  if (match.status === "PLAYED") return true;
  if (getMatchGoals(match)) return true;
  if (match.home_score !== null && match.home_score !== undefined && match.away_score !== null && match.away_score !== undefined) return true;
  return false;
}

function getCompetitionTimeline(competition) {
  const matches = getCompetitionMatches(competition);
  const played = matches.filter(isPlayedMatch);
  const upcoming = matches.filter((match) => !isPlayedMatch(match));
  return {
    matches,
    played,
    upcoming,
    lastPlayed: played[played.length - 1] || null,
    next: upcoming[0] || null,
  };
}

function renderSingleMatchBlock(title, match, emptyText) {
  return `
    <div class="dashboard-match-block">
      <h4>${escapeHtml(title)}</h4>
      ${match ? renderMatchList([match]) : `<p class="muted">${escapeHtml(emptyText)}</p>`}
    </div>
  `;
}

function renderRegularSeasonDashboardCard(competition) {
  const status = competition.status || "PLANNED";
  const { rows } = getStandingRowsForCompetition(competition);
  const winner = rows[0] ? getClubById(rows[0].club_id) : null;
  const timeline = getCompetitionTimeline(competition);

  if (status === "COMPLETED") {
    return `
      <div class="dashboard-competition-body">
        ${winner ? `<p class="winner-line">Vincitore: <strong>${clubButton(winner)}</strong></p>` : `<p class="muted">Vincitore non ancora determinabile.</p>`}
        <h4>Classifica finale</h4>
        ${renderStandingTable(competition)}
      </div>
    `;
  }

  if (status === "PLANNED") {
    return `<p class="muted">Competizione programmata. Nessuna classifica o calendario da mostrare.</p>`;
  }

  if (status === "NOT_DISPUTED") {
    return `<p class="muted">Competizione non disputata.</p>`;
  }

  return `
    <div class="dashboard-competition-body">
      <h4>Classifica attuale</h4>
      ${renderStandingTable(competition)}
      ${renderSingleMatchBlock("Ultima giornata giocata", timeline.lastPlayed, "Nessuna giornata giocata.")}
      ${renderSingleMatchBlock("Prossima giornata", timeline.next, "Nessuna prossima giornata inserita.")}
    </div>
  `;
}

function renderCupDashboardCard(competition) {
  const status = competition.status || "PLANNED";
  const timeline = getCompetitionTimeline(competition);

  if (status === "COMPLETED") {
    const finalMatch = getCupFinalMatch(competition);
    const outcome = getCupFinalOutcome(competition);
    const winner = outcome?.winnerId ? getClubById(outcome.winnerId) : null;
    return `
      <div class="dashboard-competition-body">
        ${winner ? `<p class="winner-line">Vincitore: <strong>${clubButton(winner)}</strong></p>` : `<p class="muted">Vincitore non ancora determinabile. Controlla risultato finale o vincitrice manuale.</p>`}
        <h4>Finale</h4>
        ${finalMatch ? renderMatchList([finalMatch]) : `<p class="muted">Finale non inserita.</p>`}
      </div>
    `;
  }

  if (status === "PLANNED") {
    return `<p class="muted">Competizione programmata.</p>`;
  }

  if (status === "NOT_DISPUTED") {
    return `<p class="muted">Competizione non disputata.</p>`;
  }

  return `
    <div class="dashboard-competition-body">
      ${renderSingleMatchBlock("Ultima giornata giocata", timeline.lastPlayed, "Nessuna partita giocata.")}
      ${renderSingleMatchBlock("Prossima giornata", timeline.next, "Nessuna prossima partita inserita.")}
    </div>
  `;
}

function renderDashboardCompetitionCard(competition) {
  const isRegularSeason = competition.competition_type === "REGULAR_SEASON";
  const content = isRegularSeason
    ? renderRegularSeasonDashboardCard(competition)
    : renderCupDashboardCard(competition);

  return `
    <div class="competition-card compact-card">
      <div class="competition-card-header">
        <div>
          <strong>${escapeHtml(competition.name)}</strong>
          <span>${escapeHtml(COMPETITION_LABELS[competition.competition_type] || competition.competition_type || "Competizione")}</span>
        </div>
        <span class="status ${competition.status === "ACTIVE" ? "status-ok" : "status-muted"}">${escapeHtml(COMPETITION_STATUS_LABELS[competition.status] || competition.status || "-")}</span>
      </div>
      ${content}
    </div>
  `;
}

function renderDashboardCompetitions() {
  const seasonId = getSelectedSeasonId();
  const competitions = state.competitions
    .filter((competition) => competition.season_id === seasonId)
    .sort((a, b) => {
      const order = { REGULAR_SEASON: 1, CHAMPIONS: 2, COPPA_ITALIA: 3, PLAYOFF: 4, ALTRO: 9 };
      return (order[a.competition_type] || 99) - (order[b.competition_type] || 99)
        || String(a.name || "").localeCompare(String(b.name || ""), "it", { sensitivity: "base" });
    });

  if (!el.dashboardStandings) return;

  if (!competitions.length) {
    el.dashboardStandings.innerHTML = `<p class="muted">Nessuna competizione inserita per la stagione ${escapeHtml(seasonId)}.</p>`;
  } else {
    const visibleCompetitions = competitions.filter((competition) => competition.status !== "NOT_DISPUTED");
    const planned = visibleCompetitions.filter((competition) => competition.status === "PLANNED");
    const nonPlanned = visibleCompetitions.filter((competition) => competition.status !== "PLANNED");
    const plannedBlock = planned.length
      ? `<div class="competition-card compact-card planned-competitions-card">
          <div class="competition-card-header"><div><strong>Competizioni programmate</strong><span>Non ancora iniziate</span></div></div>
          <div class="tag-list">${planned.map((competition) => `<span class="mini-badge">${escapeHtml(competition.name)}</span>`).join("")}</div>
        </div>`
      : "";

    el.dashboardStandings.innerHTML = [
      ...nonPlanned.map(renderDashboardCompetitionCard),
      plannedBlock,
    ].filter(Boolean).join("");
  }

  if (!el.dashboardCalendar) return;
  const activeCompetitions = competitions.filter((competition) => competition.status === "ACTIVE");
  if (!activeCompetitions.length) {
    el.dashboardCalendar.innerHTML = `<p class="muted">Nessuna competizione attiva nella stagione selezionata.</p>`;
    return;
  }

  el.dashboardCalendar.innerHTML = activeCompetitions.map((competition) => {
    const timeline = getCompetitionTimeline(competition);
    return `
      <div class="stack-section">
        <h3>${escapeHtml(competition.name)}</h3>
        ${renderSingleMatchBlock(competition.competition_type === "REGULAR_SEASON" ? "Ultima giornata giocata" : "Ultima giornata giocata", timeline.lastPlayed, "Nessuna giornata giocata.")}
        ${renderSingleMatchBlock(competition.competition_type === "REGULAR_SEASON" ? "Prossima giornata" : "Prossima giornata", timeline.next, "Nessuna prossima giornata inserita.")}
      </div>
    `;
  }).join("");
}

function renderNews() {
  if (!el.newsList) return;
  if (!state.news.length) {
    el.newsList.innerHTML = `<p class="muted">Nessun comunicato inserito.</p>`;
    return;
  }
  el.newsList.innerHTML = state.news
    .map((post) => `
      <article class="news-card">
        <div class="news-card-header">
          <span class="status status-muted">${escapeHtml(NEWS_TOPIC_LABELS[post.topic] || post.topic || "Generale")}</span>
          <small>${fmtDate(post.created_at)}</small>
        </div>
        <h3>${escapeHtml(post.title)}</h3>
        ${post.body ? `<p>${escapeHtml(post.body).replaceAll("\n", "<br>")}</p>` : ""}
      </article>
    `)
    .join("");
}

function renderCompetitionsPage() {
  if (!el.competitionsList) return;
  const seasonId = getSelectedSeasonId();
  const competitions = state.competitions.filter((competition) => competition.season_id === seasonId && competition.status !== "NOT_DISPUTED");
  if (!competitions.length) {
    el.competitionsList.innerHTML = `<p class="muted">Nessuna competizione inserita per la stagione ${escapeHtml(seasonId)}.</p>`;
    return;
  }
  el.competitionsList.innerHTML = competitions
    .map((competition) => {
      const matches = state.calendarMatches
        .filter((match) => match.competition_id === competition.id)
        .sort((a, b) => String(a.matchday_label || "").localeCompare(String(b.matchday_label || "")) || String(a.played_on || "").localeCompare(String(b.played_on || "")));
      const statusLabel = COMPETITION_STATUS_LABELS[competition.status] || competition.status || "-";
      return `
        <details class="competition-card competition-detail-card" open>
          <summary class="competition-mobile-summary"><strong>${escapeHtml(competition.name)}</strong><span>${escapeHtml(statusLabel)}</span></summary>
          <div class="competition-card-header competition-desktop-header">
            <div>
              <h3>${escapeHtml(competition.name)}</h3>
              <span>${escapeHtml(COMPETITION_LABELS[competition.competition_type] || competition.competition_type || "Competizione")}</span>
            </div>
            <span class="status ${competition.status === "ACTIVE" ? "status-ok" : "status-muted"}">${escapeHtml(statusLabel)}</span>
          </div>
          <div class="competition-card-body">${renderCompetitionContent(competition)}</div>
        </details>
      `;
    })
    .join("");
}


function isFinalMatch(match) {
  return String(match?.matchday_label || "").trim().toLowerCase() === "finale";
}

function getCupFinalMatch(competition) {
  if (!competition || competition.competition_type === "REGULAR_SEASON") return null;
  return state.calendarMatches
    .filter((match) => match.competition_id === competition.id)
    .filter(isFinalMatch)
    .sort((a, b) => String(b.played_on || "0000-00-00").localeCompare(String(a.played_on || "0000-00-00")) || String(b.created_at || "").localeCompare(String(a.created_at || "")))[0] || null;
}

function getManualWinnerOutcome(finalMatch) {
  const manualWinnerId = finalMatch?.manual_winner_club_id || null;
  if (!manualWinnerId || !finalMatch?.home_club_id || !finalMatch?.away_club_id) return null;
  if (![finalMatch.home_club_id, finalMatch.away_club_id].includes(manualWinnerId)) return null;
  const runnerUpId = manualWinnerId === finalMatch.home_club_id ? finalMatch.away_club_id : finalMatch.home_club_id;
  return {
    winnerId: manualWinnerId,
    runnerUpId,
    decidedBy: "manual",
    note: finalMatch.manual_winner_note || "Vincitore indicato manualmente",
  };
}

function getCupFinalOutcome(competition) {
  const finalMatch = getCupFinalMatch(competition);
  if (!finalMatch || !finalMatch.home_club_id || !finalMatch.away_club_id) return null;

  const manualOutcome = getManualWinnerOutcome(finalMatch);
  if (manualOutcome) {
    return { finalMatch, ...manualOutcome };
  }

  const goals = getMatchGoals(finalMatch);
  let winnerId = null;
  let runnerUpId = null;
  let decidedBy = "result";

  if (goals) {
    if (goals.home > goals.away) {
      winnerId = finalMatch.home_club_id;
      runnerUpId = finalMatch.away_club_id;
    } else if (goals.away > goals.home) {
      winnerId = finalMatch.away_club_id;
      runnerUpId = finalMatch.home_club_id;
    } else {
      // Le finali possono finire in parità: in quel caso serve vincitore manuale.
      return null;
    }
  } else {
    // Fallback solo se il risultato finale non è stato inserito: usa i fantapunti se disponibili.
    const homeFp = finalMatch.home_score !== null && finalMatch.home_score !== undefined ? Number(finalMatch.home_score) : null;
    const awayFp = finalMatch.away_score !== null && finalMatch.away_score !== undefined ? Number(finalMatch.away_score) : null;
    if (Number.isFinite(homeFp) && Number.isFinite(awayFp) && homeFp !== awayFp) {
      winnerId = homeFp > awayFp ? finalMatch.home_club_id : finalMatch.away_club_id;
      runnerUpId = homeFp > awayFp ? finalMatch.away_club_id : finalMatch.home_club_id;
      decidedBy = "fantapoints";
    }
  }

  if (!winnerId || !runnerUpId) return null;
  return { finalMatch, winnerId, runnerUpId, decidedBy, note: null };
}

function manualHonorExistsForCupPlacement(competition, placement) {
  return state.honorRoll.some((entry) =>
    entry.season_id === competition.season_id
    && entry.competition_type === competition.competition_type
    && Number(entry.placement || 0) === Number(placement)
  );
}

function buildAutomaticCupHonorRows() {
  const rows = [];
  const cupCompetitions = state.competitions.filter((competition) => competition.competition_type !== "REGULAR_SEASON");

  for (const competition of cupCompetitions) {
    const outcome = getCupFinalOutcome(competition);
    if (!outcome) continue;

    const placements = [
      { placement: 1, club_id: outcome.winnerId, title: `Vincitore ${competition.name || COMPETITION_LABELS[competition.competition_type] || "competizione"}` },
      { placement: 2, club_id: outcome.runnerUpId, title: `Secondo posto ${competition.name || COMPETITION_LABELS[competition.competition_type] || "competizione"}` },
    ];

    for (const item of placements) {
      const club = applyClubSeasonIdentity(getClubById(item.club_id), competition.season_id);
      const president = club?.president || "-";
      rows.push({
        source: "calendar-final",
        id: `cup-final-${competition.id}-${item.placement}-${item.club_id}`,
        season_id: competition.season_id,
        club_id: item.club_id,
        honor_club_id: state.honorClubs.find((honorClub) => honorClub.source_club_id === item.club_id)?.id || null,
        club_name: club?.name || item.club_id || "-",
        president,
        president_key: getPresidentKey(president),
        competition_type: competition.competition_type || "ALTRO",
        competition_name: competition.name || COMPETITION_LABELS[competition.competition_type] || "Competizione",
        placement: item.placement,
        points: null,
        notes: [item.title, outcome.decidedBy === "manual" ? `vincitore manuale${outcome.note ? `: ${outcome.note}` : ""}` : "da finale calendario"].filter(Boolean).join(" · "),
        fantapoints: null,
        played: null,
        wins: null,
        draws: null,
        losses: null,
        goals_for: null,
        goals_against: null,
        goal_difference: null,
      });
    }
  }

  return rows;
}

function buildHonorRows() {
  const rows = [];

  for (const entry of state.honorRoll) {
    const honorClub = getHonorClubForEntry(entry);
    const sourceClubId = entry.club_id || honorClub?.source_club_id || null;
    const seasonalClub = sourceClubId ? applyClubSeasonIdentity(getClubById(sourceClubId), entry.season_id) : null;
    const president = entry.president || honorClub?.president || seasonalClub?.president || "-";
    rows.push({
      source: "manual",
      id: `honor-${entry.id}`,
      season_id: entry.season_id,
      club_id: sourceClubId,
      honor_club_id: entry.honor_club_id || honorClub?.id || null,
      // Le voci inserite manualmente nell'Albo d'oro devono mantenere
      // il nome squadra di quella stagione: non sovrascriverlo con il
      // nome attuale del club se il presidente ha cambiato squadra.
      club_name: entry.season_team_name || honorClub?.name || seasonalClub?.name || "-",
      president,
      president_key: entry.president_key || getPresidentKey(president),
      competition_type: entry.competition_type || "ALTRO",
      competition_name: COMPETITION_LABELS[entry.competition_type] || entry.competition_type || entry.title || "Competizione",
      placement: entry.placement,
      points: entry.points,
      notes: [entry.title, entry.notes].filter(Boolean).join(" · "),
      fantapoints: null,
      played: null,
      wins: null,
      draws: null,
      losses: null,
      goals_for: null,
      goals_against: null,
      goal_difference: null,
    });
  }

  for (const competition of state.competitions.filter((item) => item.competition_type === "REGULAR_SEASON")) {
    const computedRows = getRegularSeasonStandingRows(competition);
    const sourceRows = computedRows.length
      ? computedRows
      : state.competitionStandings
        .filter((standing) => standing.competition_id === competition.id)
        .sort((a, b) => Number(a.position || 999) - Number(b.position || 999));

    for (const standing of sourceRows) {
      const club = applyClubSeasonIdentity(getClubById(standing.club_id), competition.season_id);
      const president = club?.president || "-";
      rows.push({
        source: computedRows.length ? "calendar" : "standing",
        id: `${computedRows.length ? "calendar-standing" : "standing"}-${competition.id}-${standing.club_id}`,
        season_id: competition.season_id,
        club_id: standing.club_id,
        honor_club_id: state.honorClubs.find((item) => item.source_club_id === standing.club_id)?.id || null,
        club_name: club?.name || standing.club_id || "-",
        president,
        president_key: getPresidentKey(president),
        competition_type: competition.competition_type || "ALTRO",
        competition_name: competition.name || COMPETITION_LABELS[competition.competition_type] || "Competizione",
        placement: standing.position,
        points: standing.points,
        notes: computedRows.length ? "da risultati calendario" : (standing.notes || "da classifica competizione"),
        fantapoints: standing.fantapoints,
        played: standing.played,
        wins: standing.wins,
        draws: standing.draws,
        losses: standing.losses,
        goals_for: standing.goals_for,
        goals_against: standing.goals_against,
        goal_difference: standing.goal_difference,
      });
    }
  }

  rows.push(...buildAutomaticCupHonorRows());

  return dedupeHonorRows(rows).sort((a, b) =>
    String(b.season_id).localeCompare(String(a.season_id))
    || String(a.competition_type || "").localeCompare(String(b.competition_type || ""), "it", { sensitivity: "base" })
    || Number(a.placement || 999) - Number(b.placement || 999)
    || String(a.club_name || "").localeCompare(String(b.club_name || ""), "it", { sensitivity: "base" })
  );
}

function renderHonorClubName(row) {
  const current = row.club_id ? getClubById(row.club_id) : null;
  const honor = row.honor_club_id ? getHonorClubById(row.honor_club_id) : null;
  if (current) return clubButton(current, "", row.season_id || getSelectedSeasonId());
  if (honor) return honorClubButton(honor);
  return escapeHtml(row.club_name || "-");
}

function getCupHonorRowsForCompetition(competition) {
  if (!competition || competition.competition_type === "REGULAR_SEASON") return [];
  return buildHonorRows()
    .filter((row) => row.season_id === competition.season_id && row.competition_type === competition.competition_type)
    .filter((row) => !competition.name || row.competition_name === competition.name || row.notes?.includes(competition.name) || row.competition_name === (COMPETITION_LABELS[competition.competition_type] || competition.competition_type))
    .sort((a, b) => Number(a.placement || 999) - Number(b.placement || 999));
}

function renderCupPodiumRowsForHonor(competition) {
  const rows = getCupHonorRowsForCompetition(competition).filter((row) => Number(row.placement || 0) > 0 && Number(row.placement || 0) <= 3);
  if (!rows.length) return `<p class="muted">Nessun podio inserito nell'Albo d'oro.</p>`;
  return `<div class="podium-mini-grid">${rows.map((row) => `<div class="podium-mini-item"><span>${row.placement}° posto</span><strong>${renderHonorClubName(row)}</strong><small>${escapeHtml(row.notes || "")}</small></div>`).join("")}</div>`;
}

function renderHonorCupHistorySections() {
  const cupCompetitions = state.competitions
    .filter((competition) => competition.competition_type !== "REGULAR_SEASON")
    .sort((a, b) => String(b.season_id).localeCompare(String(a.season_id)) || String(a.name).localeCompare(String(b.name), "it", { sensitivity: "base" }));

  if (!cupCompetitions.length) return "";

  return cupCompetitions.map((competition, index) => {
    const matches = state.calendarMatches
      .filter((match) => match.competition_id === competition.id)
      .sort(sortMatchesByRoundAndDate);
    return `<details class="collapse-card honor-cup-section" ${index === 0 ? "open" : ""}>
      <summary><strong>${escapeHtml(competition.season_id)} · ${escapeHtml(competition.name)}</strong><span>${escapeHtml(COMPETITION_LABELS[competition.competition_type] || competition.competition_type)} · ${matches.length} partite</span></summary>
      <div class="honor-cup-content">
        <h4>Podio albo d'oro</h4>
        ${renderCupPodiumRowsForHonor(competition)}
        <h4>Partite e risultati</h4>
        ${renderMatchTable(matches)}
      </div>
    </details>`;
  }).join("");
}

function roundOrder(label) {
  const value = String(label || "").trim().toLowerCase();
  const order = {
    "qf - andata": 1,
    "qf - ritorno": 2,
    "sf - andata": 3,
    "sf - ritorno": 4,
    "finale": 5,
  };
  return order[value] || 99;
}

function sortMatchesByRoundAndDate(a, b) {
  return roundOrder(a.matchday_label) - roundOrder(b.matchday_label)
    || String(a.played_on || "9999-12-31").localeCompare(String(b.played_on || "9999-12-31"))
    || String(a.matchday_label || "").localeCompare(String(b.matchday_label || ""), "it", { sensitivity: "base" });
}

function renderMatchTable(matches) {
  if (!matches.length) return `<p class="muted">Nessuna partita inserita.</p>`;
  return `<div class="mobile-match-card-list">${matches.map(renderMobileMatchCard).join("")}</div><div class="table-wrap compact-table match-table-desktop"><table>
    <thead><tr><th>Giornata</th><th>Data</th><th>Casa</th><th>Trasferta</th><th class="number">Ris.</th><th class="number">FP</th><th>Vincitrice manuale</th></tr></thead>
    <tbody>${matches.map((match) => {
      const competition = getCompetitionById(match.competition_id);
      const home = getClubById(match.home_club_id);
      const away = getClubById(match.away_club_id);
      const goals = getMatchGoals(match);
      const result = goals ? `${goals.home}-${goals.away}` : "-";
      const fp = match.home_score !== null && match.home_score !== undefined && match.away_score !== null && match.away_score !== undefined ? `${match.home_score}-${match.away_score}` : "-";
      const manualWinner = match.manual_winner_club_id ? getClubById(match.manual_winner_club_id) : null;
      const manual = manualWinner ? `${clubButton(manualWinner, "", competition?.season_id || match.season_id)}${match.manual_winner_note ? `<small>${escapeHtml(match.manual_winner_note)}</small>` : ""}` : "-";
      return `<tr><td>${escapeHtml(match.matchday_label || "-")}</td><td>${match.played_on ? fmtDateOnly(match.played_on) : "-"}</td><td>${clubButton(home, "", competition?.season_id || match.season_id)}</td><td>${clubButton(away, "", competition?.season_id || match.season_id)}</td><td class="number"><strong>${escapeHtml(result)}</strong></td><td class="number">${escapeHtml(fp)}</td><td>${manual}</td></tr>`;
    }).join("")}</tbody>
  </table></div>`;
}



function renderHonorOverallMobileTable(summaryRows) {
  if (!summaryRows.length) return `<p class="muted mobile-honor-only">Nessuna vittoria registrata.</p>`;
  const getWins = (row, type) => Number(row.winsByCompetition?.[type] || 0);
  return `<div class="mobile-honor-only mobile-honor-table-wrap"><table class="mobile-honor-table">
    <thead><tr><th>Presidente</th><th class="number">#</th><th class="number">RS</th><th class="number">CI</th><th class="number">CL</th><th class="number">PO</th></tr></thead>
    <tbody>${summaryRows.map((row) => `<tr>
      <td>${honorMobilePresidentCell({ president: row.president, presidentKey: row.key, teamName: Array.from(row.teams || []).filter(Boolean).join(" · "), logo: row.logo })}</td>
      <td class="number"><strong>${row.wins || 0}</strong></td>
      <td class="number">${getWins(row, "REGULAR_SEASON")}</td>
      <td class="number">${getWins(row, "COPPA_ITALIA")}</td>
      <td class="number">${getWins(row, "CHAMPIONS")}</td>
      <td class="number">${getWins(row, "PLAYOFF")}</td>
    </tr>`).join("")}</tbody>
  </table></div>`;
}

function renderHonorCompetitionMobileTable(summaryRows) {
  if (!summaryRows.length) return `<p class="muted mobile-honor-only">Nessun podio registrato.</p>`;
  return `<div class="mobile-honor-only mobile-honor-table-wrap"><table class="mobile-honor-table honor-competition-mobile-table">
    <thead><tr><th>Presidente</th><th class="number">1°</th><th class="number">2°</th><th class="number">3°</th></tr></thead>
    <tbody>${summaryRows.map((row) => `<tr>
      <td>${honorMobilePresidentCell({ president: row.president, presidentKey: row.key, teamName: Array.from(row.teams || []).filter(Boolean).join(" · "), logo: row.logo })}</td>
      <td class="number"><strong>${row.wins || 0}</strong></td>
      <td class="number">${row.seconds || 0}</td>
      <td class="number">${row.thirds || 0}</td>
    </tr>`).join("")}</tbody>
  </table></div>`;
}

function renderHonorCompetitionSections(honorRows) {
  const competitionOrder = { REGULAR_SEASON: 1, CHAMPIONS: 2, COPPA_ITALIA: 3, PLAYOFF: 4, ALTRO: 9 };
  const competitionTypes = Array.from(new Set(honorRows.map((row) => row.competition_type || "ALTRO")))
    .sort((a, b) => (competitionOrder[a] || 99) - (competitionOrder[b] || 99) || String(a).localeCompare(String(b), "it", { sensitivity: "base" }));

  if (!competitionTypes.length) return "";

  return `
    <div class="honor-competition-sections">
      <h3>Classifiche Albo d'oro per competizione</h3>
      ${competitionTypes.map((type, index) => {
        const rowsForType = honorRows.filter((row) => (row.competition_type || "ALTRO") === type && [1, 2, 3].includes(Number(row.placement || 0)));
        const byPresident = new Map();

        for (const row of rowsForType) {
          const key = getHonorRowPresidentKey(row) || getHonorRowPresident(row) || "presidente";
          const president = getHonorRowPresident(row) || row.president || "Presidente";
          const current = byPresident.get(key) || {
            key,
            president,
            logo: row.club_id ? applyClubSeasonIdentity(getClubById(row.club_id), row.season_id)?.logo_data_url : getHonorClubById(row.honor_club_id)?.logo_data_url,
            teams: new Set(),
            wins: 0,
            seconds: 0,
            thirds: 0,
            placements: [],
          };

          if (row.club_name) current.teams.add(row.club_name);
          if (Number(row.placement || 0) === 1) current.wins += 1;
          if (Number(row.placement || 0) === 2) current.seconds += 1;
          if (Number(row.placement || 0) === 3) current.thirds += 1;
          current.placements.push(row);
          byPresident.set(key, current);
        }

        const summaryRows = Array.from(byPresident.values())
          .sort((a, b) => b.wins - a.wins || b.seconds - a.seconds || b.thirds - a.thirds || String(a.president).localeCompare(String(b.president), "it", { sensitivity: "base" }));

        return `<details class="collapse-card honor-competition-ranking" ${index === 0 ? "open" : ""}>
          <summary><strong>${escapeHtml(COMPETITION_LABELS[type] || type)}</strong><span>${summaryRows.length} presidenti in classifica</span></summary>
          ${summaryRows.length ? `${renderHonorCompetitionMobileTable(summaryRows)}<div class="table-wrap compact-table honor-table-wrap desktop-honor-table"><table>
            <thead><tr><th>#</th><th>Presidente/i — Squadra/e</th><th class="number">Vittorie</th><th class="number">Secondi</th><th class="number">Terzi</th><th>Stagioni</th></tr></thead>
            <tbody>${summaryRows.map((row, pos) => {
              const teams = Array.from(row.teams).filter(Boolean).join(" · ");
              const seasons = row.placements
                .sort((a, b) => String(b.season_id).localeCompare(String(a.season_id)) || Number(a.placement || 999) - Number(b.placement || 999))
                .map((item) => `${escapeHtml(item.season_id || "-")} (${Number(item.placement || 0) ? `${item.placement}°` : "-"}${item.club_name ? `, ${escapeHtml(item.club_name)}` : ""})`)
                .join(" · ");
              return `<tr>
                <td>${pos + 1}</td>
                <td>${presidentButton({ president: row.president, presidentKey: row.key, teamName: teams, logo: row.logo })}</td>
                <td class="number"><strong>${row.wins}</strong></td>
                <td class="number">${row.seconds}</td>
                <td class="number">${row.thirds}</td>
                <td><small>${seasons}</small></td>
              </tr>`;
            }).join("")}</tbody>
          </table></div>` : `<p class="muted">Nessun podio registrato per questa competizione.</p>`}
        </details>`;
      }).join("")}
    </div>
  `;
}

function renderHonorRoll() {
  if (!el.honorSummary) return;
  const honorRows = buildHonorRows();
  if (!honorRows.length) {
    el.honorSummary.innerHTML = `<p class="muted">Nessuna voce inserita.</p>`;
    if (el.honorHistory) el.honorHistory.innerHTML = ``;
    return;
  }

  const resultsByPresident = new Map();
  for (const row of honorRows.filter((item) => [1, 2].includes(Number(item.placement || 0)))) {
    const president = getHonorRowPresident(row) || row.president || "Presidente";
    const key = getHonorRowPresidentKey(row);
    if (!key) continue;
    const current = resultsByPresident.get(key) || {
      key,
      president,
      logo: row.club_id ? applyClubSeasonIdentity(getClubById(row.club_id), row.season_id)?.logo_data_url : getHonorClubById(row.honor_club_id)?.logo_data_url,
      teams: new Set(),
      winsByCompetition: {},
      secondsByCompetition: {},
      wins: 0,
      seconds: 0,
    };
    if (row.club_name) current.teams.add(row.club_name);
    if (Number(row.placement || 0) === 1) {
      current.winsByCompetition[row.competition_type] = (current.winsByCompetition[row.competition_type] || 0) + 1;
      current.wins += 1;
    }
    if (Number(row.placement || 0) === 2) {
      current.secondsByCompetition[row.competition_type] = (current.secondsByCompetition[row.competition_type] || 0) + 1;
      current.seconds += 1;
    }
    resultsByPresident.set(key, current);
  }

  const summaryRows = Array.from(resultsByPresident.values()).sort((a, b) => b.wins - a.wins || b.seconds - a.seconds || String(a.president).localeCompare(String(b.president)));
  const overallHonorMobileHtml = renderHonorOverallMobileTable(summaryRows);
  const overallHonorHtml = summaryRows.length
    ? summaryRows.map((row) => {
      const teams = Array.from(row.teams).filter(Boolean).join(" · ");
      const name = presidentButton({ president: row.president, presidentKey: row.key, teamName: teams, logo: row.logo });
      const winDetails = Object.entries(row.winsByCompetition)
        .filter(([, count]) => count > 0)
        .map(([type, count]) => `${COMPETITION_LABELS[type] || type}: ${count}`)
        .join(" · ");
      const secondDetails = Object.entries(row.secondsByCompetition)
        .filter(([, count]) => count > 0)
        .map(([type, count]) => `${COMPETITION_LABELS[type] || type}: ${count}`)
        .join(" · ");
      return `<div class="stack-item desktop-honor-summary-row">
        <div><strong>${name}</strong><small>${winDetails ? `Vittorie: ${escapeHtml(winDetails)}` : ""}${secondDetails ? ` · Secondi posti: ${escapeHtml(secondDetails)}` : ""}</small></div>
        <div class="stack-item-side"><strong>${row.wins}</strong><small>${row.seconds} secondi</small></div>
      </div>`;
    }).join("")
    : `<p class="muted">Nessuna vittoria o secondo posto registrato.</p>`;

  el.honorSummary.innerHTML = `
    <div class="honor-overall-section">
      <h3>Classifica generale</h3>
      ${overallHonorMobileHtml}
      <div class="desktop-honor-summary">${overallHonorHtml}</div>
    </div>
    ${renderHonorCompetitionSections(honorRows)}
  `;

  const regularRows = honorRows.filter((row) => row.competition_type === "REGULAR_SEASON");
  const grouped = new Map();
  for (const row of regularRows) {
    const key = `${row.season_id}|${row.competition_type}|${row.competition_name}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }

  const regularSections = Array.from(grouped.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, rows], index) => {
      const [seasonId, competitionType, competitionName] = key.split("|");
      rows.sort((a, b) => Number(a.placement || 999) - Number(b.placement || 999));
      return `<details class="collapse-card honor-season-section" ${index === 0 ? "open" : ""}>
        <summary><strong>${escapeHtml(seasonId)} · ${escapeHtml(competitionName)}</strong><span>Classifica completa · ${rows.length} squadre</span></summary>
        <div class="table-wrap compact-table honor-table-wrap">
          <table>
            <thead><tr><th>Pos.</th><th>Squadra</th><th class="number">Punti</th><th class="number">G</th><th class="number">V</th><th class="number">N</th><th class="number">P</th><th class="number">GF</th><th class="number">GS</th><th class="number">DR</th><th class="number">FP</th><th>Note</th></tr></thead>
            <tbody>
              ${rows.map((row) => `<tr>
                <td>${row.placement ? `${row.placement}°` : "-"}</td>
                <td>${renderHonorClubName(row)}</td>
                <td class="number"><strong>${row.points ?? "-"}</strong></td>
                <td class="number">${row.played ?? "-"}</td>
                <td class="number">${row.wins ?? "-"}</td>
                <td class="number">${row.draws ?? "-"}</td>
                <td class="number">${row.losses ?? "-"}</td>
                <td class="number">${row.goals_for ?? "-"}</td>
                <td class="number">${row.goals_against ?? "-"}</td>
                <td class="number">${row.goal_difference ?? "-"}</td>
                <td class="number">${row.fantapoints ?? "-"}</td>
                <td>${escapeHtml(row.notes || (row.source === "standing" ? "da classifica competizione" : ""))}</td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </details>`;
    });

  // Le classifiche storiche non sono più mostrate direttamente nell'Albo d'oro.
  // Restano consultabili dalla scheda di ogni squadra, cliccando su "Apri stagione".
  if (el.honorHistory) el.honorHistory.innerHTML = ``;
}

function renderHonorClubOptions() {
  const existing = state.honorClubs.map((club) => {
    const suffix = club.source_club_id ? " · attuale" : " · storica";
    return `<option value="${escapeHtml(club.id)}">${escapeHtml(club.name)}${escapeHtml(suffix)}</option>`;
  });
  return [`<option value="__new__">+ Nuova squadra storica</option>`, ...existing].join("");
}

function getHonorClubOptionValueForEntry(entry) {
  const honorClub = getHonorClubForEntry(entry);
  return honorClub?.id || "__new__";
}

function selectOptionPreservingValue(select, html, preferredValue, fallbackValue = "") {
  if (!select) return "";
  const current = preferredValue ?? select.value ?? "";
  select.innerHTML = html;
  const values = Array.from(select.options).map((option) => option.value);
  const nextValue = values.includes(current) ? current : (values.includes(fallbackValue) ? fallbackValue : (values[0] || ""));
  select.value = nextValue;
  return nextValue;
}

function renderAdminExtendedControls() {
  const seasonOptions = state.seasons.map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name || season.id)}</option>`).join("");
  const clubOptions = getCurrentClubs().map((club) => `<option value="${escapeHtml(club.id)}">${escapeHtml(club.name)}</option>`).join("");
  const selectedSeason = getSelectedSeasonId();

  const competitionSeasonValue = selectOptionPreservingValue(el.competitionSeason, seasonOptions, el.competitionSeason?.value || selectedSeason, selectedSeason);
  const stadiumSeasonValue = selectOptionPreservingValue(el.stadiumSeason, seasonOptions, el.stadiumSeason?.value || selectedSeason, selectedSeason);
  const honorSeasonValue = selectOptionPreservingValue(el.honorSeason, seasonOptions, el.honorSeason?.value || selectedSeason, selectedSeason);
  selectOptionPreservingValue(el.rolloverSourceSeason, seasonOptions, el.rolloverSourceSeason?.value || selectedSeason, selectedSeason);

  if (el.stadiumClub) {
    selectOptionPreservingValue(el.stadiumClub, clubOptions, el.stadiumClub.value, getCurrentClubs()[0]?.id || "");
    updateStadiumFormFields();
  }

  const competitionListSeason = competitionSeasonValue || selectedSeason;
  const competitionsForFormSeason = state.competitions.filter((competition) => competition.season_id === competitionListSeason);
  const competitionOptionsForFormSeason = competitionsForFormSeason.map((competition) => `<option value="${escapeHtml(competition.id)}">${escapeHtml(competition.name)}</option>`).join("");

  const standingSeason = selectedSeason;
  const competitionsForSelectedSeason = state.competitions.filter((competition) => competition.season_id === standingSeason);
  const regularCompetitionsForSeason = competitionsForSelectedSeason.filter((competition) => competition.competition_type === "REGULAR_SEASON");
  const regularCompetitionOptions = regularCompetitionsForSeason.map((competition) => `<option value="${escapeHtml(competition.id)}">${escapeHtml(competition.name)}</option>`).join("");

  const calendarCompetitionOptions = competitionsForSelectedSeason.map((competition) => `<option value="${escapeHtml(competition.id)}">${escapeHtml(competition.name)}</option>`).join("");

  if (el.standingCompetition) {
    selectOptionPreservingValue(el.standingCompetition, regularCompetitionOptions || `<option value="">Nessuna Regular Season</option>`, el.standingCompetition.value, regularCompetitionsForSeason[0]?.id || "");
  }
  if (el.standingClub) selectOptionPreservingValue(el.standingClub, clubOptions, el.standingClub.value, getCurrentClubs()[0]?.id || "");
  if (el.calendarCompetition) {
    selectOptionPreservingValue(el.calendarCompetition, calendarCompetitionOptions || `<option value="">Nessuna competizione</option>`, el.calendarCompetition.value, competitionsForSelectedSeason[0]?.id || "");
  }
  updateCalendarClubOptions();
  if (el.honorClub) selectOptionPreservingValue(el.honorClub, renderHonorClubOptions(), el.honorClub.value, "__new__");
  const presidentOptions = renderPresidentOptions();
  if (el.clubPresidentSelect) { const current = resolvePresidentValue(el.clubPresidentSelect, el.clubPresidentInput); el.clubPresidentSelect.innerHTML = presidentOptions; setPresidentControls(el.clubPresidentSelect, el.clubPresidentInput, current || el.clubPresidentInput?.value || ""); }
  if (el.honorPresidentSelect) { const current = resolvePresidentValue(el.honorPresidentSelect, el.honorPresidentInput); el.honorPresidentSelect.innerHTML = presidentOptions; setPresidentControls(el.honorPresidentSelect, el.honorPresidentInput, current || el.honorPresidentInput?.value || ""); }
  if (el.historicalClubSourceClub) selectOptionPreservingValue(el.historicalClubSourceClub, `<option value="">Nessuno / squadra storica pura</option>${clubOptions}`, el.historicalClubSourceClub.value, "");
  if (el.historicalClubPresidentSelect) { const current = resolvePresidentValue(el.historicalClubPresidentSelect, el.historicalClubPresidentInput); el.historicalClubPresidentSelect.innerHTML = presidentOptions; setPresidentControls(el.historicalClubPresidentSelect, el.historicalClubPresidentInput, current || el.historicalClubPresidentInput?.value || ""); }
  if (el.clubIdentitySeason) selectOptionPreservingValue(el.clubIdentitySeason, seasonOptions, el.clubIdentitySeason.value || selectedSeason, selectedSeason);
  if (el.clubIdentityClub) selectOptionPreservingValue(el.clubIdentityClub, clubOptions, el.clubIdentityClub.value, getCurrentClubs()[0]?.id || "");
  if (el.clubIdentityPresidentSelect) { const current = resolvePresidentValue(el.clubIdentityPresidentSelect, el.clubIdentityPresidentInput); el.clubIdentityPresidentSelect.innerHTML = presidentOptions; setPresidentControls(el.clubIdentityPresidentSelect, el.clubIdentityPresidentInput, current || el.clubIdentityPresidentInput?.value || ""); }

  if (el.rolloverTargetSeason && !el.rolloverTargetSeason.value) {
    const y = Number(String(selectedSeason).slice(0, 4));
    if (Number.isFinite(y)) el.rolloverTargetSeason.value = `${y + 1}-${y + 2}`;
  }

  updateCalendarMatchdaySuggestions();
  renderAdminLists();
}

function updateCalendarMatchdaySuggestions() {
  if (!el.calendarMatchdayOptions || !el.calendarCompetition) return;
  const competition = getCompetitionById(el.calendarCompetition.value);
  if (competition && competition.competition_type !== "REGULAR_SEASON") {
    el.calendarMatchdayOptions.innerHTML = CUP_MATCHDAY_LABELS.map((label) => `<option value="${escapeHtml(label)}"></option>`).join("");
    if (el.calendarMatchday && !el.calendarMatchday.value) el.calendarMatchday.placeholder = "Es. QF - Andata";
    return;
  }
  const regularOptions = Array.from({ length: 38 }, (_, index) => `<option value="Giornata ${index + 1}"></option>`).join("");
  el.calendarMatchdayOptions.innerHTML = regularOptions;
  if (el.calendarMatchday && !el.calendarMatchday.value) el.calendarMatchday.placeholder = "Es. Giornata 1";
}

function adminSearchValue(key) {
  return String(state.adminSearch?.[key] || "").trim().toLowerCase();
}

function textMatchesQuery(text, query) {
  if (!query) return true;
  return String(text || "").toLowerCase().includes(query);
}

function renderAdminListMessage(message) {
  return `<p class="muted admin-empty-message">${escapeHtml(message)}</p>`;
}

async function refreshAdminDataAfterMutation({ preserve = {}, statusElement = null, message = "" } = {}) {
  await fetchCoreData();
  await loadPageData("admin", { force: true });
  renderAll();
  Object.entries(preserve || {}).forEach(([key, value]) => {
    if (el[key] && value !== undefined && value !== null) el[key].value = value;
  });
  updateCalendarMatchdaySuggestions();
  renderAdminLists();
  if (statusElement && message) statusElement.textContent = message;
}

function renderAdminLists() {
  const selectedSeason = getSelectedSeasonId();

  if (el.newsAdminList) {
    const query = adminSearchValue("news");
    const rows = state.news
      .filter((post) => textMatchesQuery(`${post.title || ""} ${post.topic || ""} ${post.body || ""}`, query))
      .slice(0, 80);
    el.newsAdminList.innerHTML = rows.map((post) => `
      <div class="admin-list-item">
        <span><strong>${escapeHtml(post.title)}</strong><small>${escapeHtml(NEWS_TOPIC_LABELS[post.topic] || post.topic)} · ${fmtDate(post.created_at)}</small></span>
        <span><button class="button button-secondary button-small" type="button" data-edit-news="${escapeHtml(post.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-delete-news="${escapeHtml(post.id)}">Elimina</button></span>
      </div>`).join("") || renderAdminListMessage(query ? "Nessun comunicato trovato." : "Nessun comunicato.");
  }

  if (el.competitionAdminList) {
    const query = adminSearchValue("competitions");
    const listSeason = el.competitionSeason?.value || selectedSeason;
    const rows = state.competitions
      .filter((c) => c.season_id === listSeason)
      .filter((c) => textMatchesQuery(`${c.name || ""} ${c.competition_type || ""} ${c.status || ""}`, query));
    el.competitionAdminList.innerHTML = rows.map((competition) => `
      <div class="admin-list-item">
        <span><strong>${escapeHtml(competition.name)}</strong><small>${escapeHtml(COMPETITION_LABELS[competition.competition_type] || competition.competition_type)} · ${escapeHtml(COMPETITION_STATUS_LABELS[competition.status] || competition.status)} · ${escapeHtml(competition.season_id)}</small></span>
        <span><button class="button button-secondary button-small" type="button" data-edit-competition="${escapeHtml(competition.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-delete-competition="${escapeHtml(competition.id)}">Elimina</button></span>
      </div>`).join("") || renderAdminListMessage(query ? `Nessuna competizione trovata per ${listSeason}.` : `Nessuna competizione per ${listSeason}.`);
  }

  if (el.standingAdminList) {
    const query = adminSearchValue("standings");
    const standingCompetitionId = el.standingCompetition?.value || "";
    const rows = state.competitionStandings
      .filter((row) => {
        const competition = getCompetitionById(row.competition_id);
        if (standingCompetitionId) return row.competition_id === standingCompetitionId && competition?.competition_type === "REGULAR_SEASON";
        return competition?.season_id === selectedSeason && competition?.competition_type === "REGULAR_SEASON";
      })
      .filter((row) => {
        const club = getClubById(row.club_id);
        const competition = getCompetitionById(row.competition_id);
        return textMatchesQuery(`${competition?.name || ""} ${club?.name || ""} ${row.position || ""} ${row.points ?? ""}`, query);
      });
    el.standingAdminList.innerHTML = rows.map((row) => {
      const club = getClubById(row.club_id);
      const competition = getCompetitionById(row.competition_id);
      return `<div class="admin-list-item"><span><strong>${escapeHtml(competition?.name || "-")} · ${clubButton(club)}</strong><small>Pos. ${row.position || "-"} · ${row.points ?? "-"} pt · ${escapeHtml(competition?.season_id || selectedSeason)}</small></span><span><button class="button button-secondary button-small" type="button" data-edit-standing="${escapeHtml(row.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-delete-standing="${escapeHtml(row.id)}">Elimina</button></span></div>`;
    }).join("") || renderAdminListMessage(query ? "Nessuna riga di classifica trovata." : "Nessuna classifica Regular Season per la stagione selezionata.");
  }

  if (el.calendarAdminList) {
    const query = adminSearchValue("calendar");
    const calendarCompetitionId = el.calendarCompetition?.value || "";
    const rows = state.calendarMatches
      .filter((row) => calendarCompetitionId ? row.competition_id === calendarCompetitionId : row.season_id === selectedSeason)
      .filter((match) => {
        const competition = getCompetitionById(match.competition_id);
        const home = getClubById(match.home_club_id);
        const away = getClubById(match.away_club_id);
        return textMatchesQuery(`${match.matchday_label || ""} ${competition?.name || ""} ${home?.name || ""} ${away?.name || ""}`, query);
      })
      .slice(0, 120);
    el.calendarAdminList.innerHTML = rows.map((match) => {
      const competition = getCompetitionById(match.competition_id);
      const home = getClubById(match.home_club_id);
      const away = getClubById(match.away_club_id);
      const goals = getMatchGoals(match);
      const result = goals ? ` · risultato ${goals.home}-${goals.away}` : "";
      const fp = match.home_score !== null && match.home_score !== undefined && match.away_score !== null && match.away_score !== undefined ? ` · FP ${match.home_score}-${match.away_score}` : "";
      return `<div class="admin-list-item"><span><strong>${escapeHtml(match.matchday_label || "Giornata")} · ${escapeHtml(competition?.name || "-")}</strong><small>${clubButton(home)} vs ${clubButton(away)} · ${match.played_on ? fmtDateOnly(match.played_on) : "senza data"}${result}${fp}</small></span><span><button class="button button-secondary button-small" type="button" data-edit-calendar="${escapeHtml(match.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-delete-calendar="${escapeHtml(match.id)}">Elimina</button></span></div>`;
    }).join("") || renderAdminListMessage(query ? "Nessuna giornata trovata." : "Nessuna giornata per la stagione selezionata.");
  }

  if (el.honorAdminList) {
    const query = adminSearchValue("honor");
    const honorSeason = el.honorSeason?.value || "";
    const rows = state.honorRoll
      .filter((entry) => !honorSeason || entry.season_id === honorSeason)
      .filter((entry) => {
        const honorClub = getHonorClubForEntry(entry);
        const currentClub = getClubById(entry.club_id);
        return textMatchesQuery(`${entry.season_id || ""} ${entry.title || ""} ${entry.competition_type || ""} ${honorClub?.name || ""} ${currentClub?.name || ""} ${entry.notes || ""}`, query);
      })
      .slice(0, 120);
    el.honorAdminList.innerHTML = rows.map((entry) => {
      const honorClub = getHonorClubForEntry(entry);
      const currentClub = getClubById(entry.club_id);
      const clubHtml = honorClub ? honorClubButton(honorClub) : clubButton(currentClub);
      return `<div class="admin-list-item"><span><strong>${escapeHtml(entry.season_id)} · ${escapeHtml(entry.title)}</strong><small>${clubHtml || "-"} · ${entry.placement ? `${entry.placement}°` : "-"}</small></span><span><button class="button button-secondary button-small" type="button" data-edit-honor="${escapeHtml(entry.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-delete-honor="${escapeHtml(entry.id)}">Elimina</button></span></div>`;
    }).join("") || renderAdminListMessage(query ? "Nessuna voce Albo d'oro trovata." : "Nessuna voce albo.");
  }

  if (el.historicalClubAdminList) {
    const query = adminSearchValue("historicalClubs");
    const rows = state.honorClubs
      .filter((club) => textMatchesQuery(`${club.name || ""} ${club.president || ""}`, query))
      .slice(0, 120);
    el.historicalClubAdminList.innerHTML = rows.map((club) => `
      <div class="admin-list-item">
        <span><strong>${clubNameWithLogo(club)}</strong><small>${escapeHtml(displayPresidents(club.president))}${club.source_club_id ? " · collegata a club attuale" : " · storica"}</small></span>
        <span><button class="button button-secondary button-small" type="button" data-edit-historical-club="${escapeHtml(club.id)}">Modifica</button></span>
      </div>`).join("") || renderAdminListMessage(query ? "Nessuna squadra storica trovata." : "Nessuna squadra storica.");
  }

  if (el.clubIdentityAdminList) {
    const query = adminSearchValue("clubIdentities");
    const season = el.clubIdentitySeason?.value || selectedSeason;
    const rows = state.clubSeasonIdentities
      .filter((identity) => !season || identity.season_id === season)
      .filter((identity) => {
        const club = getClubById(identity.club_id);
        return textMatchesQuery(`${identity.season_id || ""} ${club?.name || ""} ${identity.display_name || ""} ${identity.president || ""} ${identity.stadium_name || ""}`, query);
      })
      .slice(0, 120);
    el.clubIdentityAdminList.innerHTML = rows.map((identity) => {
      const club = getClubById(identity.club_id);
      const display = applyClubSeasonIdentity(club, identity.season_id);
      return `<div class="admin-list-item">
        <span><strong>${clubNameWithLogo(display || club || { name: identity.display_name || "Club" })}</strong><small>${escapeHtml(identity.season_id)} · base: ${escapeHtml(club?.name || "-")} · stadio: ${escapeHtml(identity.stadium_name || "-")}</small></span>
        <span><button class="button button-secondary button-small" type="button" data-edit-club-identity="${escapeHtml(identity.id)}">Modifica</button></span>
      </div>`;
    }).join("") || renderAdminListMessage(query ? "Nessuna identità trovata." : `Nessuna identità stagionale per ${season}.`);
  }
}


function renderMarketActivity() {
  if (!el.marketActivityTableBody) return;
  const query = (state.marketSearch || "").trim().toLowerCase();
  const clubFilter = state.marketClubFilter || "all";
  const marketTypes = new Set(["AUCTION_BUY", "RELEASE_REFUND", "TRADE_FM", "LOAN_FM"]);
  const rows = state.movements
    .filter((movement) => marketTypes.has(movement.movement_type))
    .filter((movement) => clubFilter === "all" || movement.club_id === clubFilter)
    .filter((movement) => {
      if (!query) return true;
      const club = getClubById(movement.club_id);
      return `${club?.name || ""} ${movement.description || ""} ${MOVEMENT_LABELS[movement.movement_type] || movement.movement_type}`.toLowerCase().includes(query);
    })
    .slice(0, 200);

  if (!rows.length) {
    el.marketActivityTableBody.innerHTML = `<tr><td colspan="5" class="muted center">Nessun movimento di mercato trovato.</td></tr>`;
    return;
  }

  el.marketActivityTableBody.innerHTML = rows.map((movement) => {
    const club = getClubById(movement.club_id);
    const amount = Number(movement.amount || 0);
    return `<tr>
      <td>${fmtDate(movement.created_at)}</td>
      <td>${clubButton(club)}</td>
      <td>${escapeHtml(MOVEMENT_LABELS[movement.movement_type] || movement.movement_type)}</td>
      <td>${escapeHtml(movement.description || "-")}</td>
      <td class="number ${amount < 0 ? "text-danger" : ""}">${amount > 0 ? "+" : ""}${fmtFm(amount)}</td>
    </tr>`;
  }).join("");
}

function renderMovements() {
  const seasonId = getDisplaySeasonId();
  const recent = state.movements.filter((movement) => movement.season_id === seasonId).slice(0, 14);
  if (!recent.length) {
    el.movementsList.innerHTML = `<p class="muted">Nessun movimento registrato per la stagione ${escapeHtml(seasonId)}.</p>`;
    return;
  }

  el.movementsList.innerHTML = recent
    .map((movement) => {
      const club = getClubById(movement.club_id);
      const amount = Number(movement.amount || 0);
      return `
        <div class="movement-item">
          <div>
            ${club ? clubButton(club) : `<strong>${escapeHtml(movement.club_id)}</strong>`}
            <span>${escapeHtml(MOVEMENT_LABELS[movement.movement_type] || movement.movement_type)}</span>
            <small>${escapeHtml(movement.description || "-")} · ${fmtDate(movement.created_at)}</small>
          </div>
          <strong class="movement-amount ${amount < 0 ? "negative" : "positive"}">${amount > 0 ? "+" : ""}${fmtFm(amount)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderStadiums() {
  const seasonId = getSelectedSeasonId();
  const items = getCurrentClubs().map((club) => ({ club, stadium: getClubStadium(club.id, seasonId) }));

  el.stadiumsList.innerHTML = items
    .map(({ club, stadium }) => {
      const level = stadium?.level ?? 0;
      const levelData = state.stadiumLevels.find((entry) => entry.level === level);
      return `
        <div class="stadium-item">
          <div>
            ${clubButton(club)}
            <span>${escapeHtml(stadium?.name || `Stadio ${club.name}`)} · Livello ${level}</span>
          </div>
          <small>Bonus FP casa: ${levelData?.home_bonus ?? 0} · Vittoria: ${fmtFm(levelData?.win_fm ?? 0)} · Pareggio: ${fmtFm(levelData?.draw_fm ?? 0)} · Manutenzione: ${fmtFm(levelData?.maintenance_cost ?? 0)}</small>
        </div>
      `;
    })
    .join("");
}

function renderAdminControls() {
  el.openLoginBtn.classList.toggle("hidden", Boolean(state.user));
  el.logoutBtn.classList.toggle("hidden", !state.user);
  if (el.adminPanel) el.adminPanel.classList.toggle("admin-locked", !state.isAdmin);
  document.querySelectorAll(".nav-link-admin").forEach((link) => link.classList.toggle("hidden", !state.isAdmin));
  if (!state.isAdmin && getCurrentPage() === "admin") {
    setActivePage("dashboard");
  }

  const seasonOptions = state.seasons
    .map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name)}</option>`)
    .join("");

  const clubOptions = getCurrentClubs()
    .map((club) => `<option value="${escapeHtml(club.id)}">${escapeHtml(club.name)}</option>`)
    .join("");

  const selectedSeason = state.selectedSeason || ACTIVE_SEASON_ID;

  el.movementSeason.innerHTML = seasonOptions;
  el.movementSeason.value = selectedSeason;
  el.movementClub.innerHTML = clubOptions;
  if (el.marketClubFilter) {
    const currentMarketClub = state.marketClubFilter || "all";
    el.marketClubFilter.innerHTML = `<option value="all">Tutti i club</option>${clubOptions}`;
    el.marketClubFilter.value = getCurrentClubs().some((club) => club.id === currentMarketClub) ? currentMarketClub : "all";
  }

  el.listoneSeason.innerHTML = seasonOptions;
  el.listoneSeason.value = state.selectedListoneSeason || selectedSeason;

  if (el.rosterSeason) {
    el.rosterSeason.innerHTML = seasonOptions;
    el.rosterSeason.value = selectedSeason;
  }

  el.auctionSeason.innerHTML = seasonOptions;
  el.auctionSeason.value = selectedSeason;
  el.auctionClub.innerHTML = clubOptions;
  renderAuctionPlayerOptions();
  if (!el.auctionDate.value) el.auctionDate.value = todayIso();

  el.clubEditSelect.innerHTML = clubOptions;
  if (!el.clubEditSelect.value && getCurrentClubs().length) {
    el.clubEditSelect.value = getCurrentClubs()[0].id;
  }
  updateClubFormFields();
  renderAdminExtendedControls();
}

function renderAll() {
  renderSeasonControl();
  renderMetrics();
  renderDashboardCompetitions();
  renderClubs();
  renderRosterFilters();
  renderRosterClubCards();
  renderRoster();
  renderListoneSeasonFilter();
  renderListone();
  renderNews();
  renderCompetitionsPage();
  renderHonorRoll();
  renderMovements();
  renderMarketActivity();
  renderStadiums();
  renderAdminControls();
  applyResponsiveTableLabels();
  updateMobilePageSubnav(getCurrentPage());
}


function renderAuctionPlayerOptions() {
  if (!el.auctionPlayerSelect) return;
  const currentValue = el.auctionPlayerSelect.value || "manual";
  const seasonId = el.auctionSeason?.value || getSelectedSeasonId();
  const activeQuotes = getLatestQuotationsForSeason(seasonId).filter((quote) => quote.is_listed);
  el.auctionPlayerSelect.innerHTML = [
    `<option value="manual">Inserimento manuale</option>`,
    ...activeQuotes.map((quote) =>
      `<option value="${escapeHtml(quote.player_id)}">${escapeHtml(quote.player_name)} · ${escapeHtml(quote.real_team || "-")} · ${escapeHtml(quote.mantra_roles || "-")} · Qt.A ${quote.quotation_current ?? "-"}</option>`,
    ),
  ].join("");
  el.auctionPlayerSelect.value = activeQuotes.some((quote) => quote.player_id === currentValue) ? currentValue : "manual";
}

function updateAuctionFieldsFromSelectedPlayer() {
  const playerId = el.auctionPlayerSelect.value;
  if (!playerId || playerId === "manual") {
    return;
  }

  const player = getPlayerById(playerId);
  const quote = getLatestQuoteByPlayerIdForSeason(playerId, el.auctionSeason.value || getSelectedSeasonId());

  el.auctionPlayerName.value = quote?.player_name || player?.name || "";
  el.auctionRealTeam.value = quote?.real_team || player?.real_team || "";
  el.auctionRoles.value = quote?.mantra_roles || player?.mantra_roles || "";
  el.auctionRoleClass.value = quote?.role_class || player?.role_class || "MOVIMENTO";
}

function updateClubFormFields() {
  if (!el.clubEditSelect || !state.clubs.length) return;

  const selected = getClubById(el.clubEditSelect.value) || state.clubs[0];
  if (!selected) return;

  el.clubEditSelect.value = selected.id;
  el.clubNameInput.value = selected.name || "";
  setPresidentControls(el.clubPresidentSelect, el.clubPresidentInput, selected.president || "");
  el.clubActiveInput.checked = selected.active !== false;
  if (el.clubLogoPreview) el.clubLogoPreview.innerHTML = clubLogoHtml(selected, "lg");
  if (el.clubLogoInput) el.clubLogoInput.value = "";
  if (el.removeClubLogoInput) el.removeClubLogoInput.checked = false;
}

async function handleLogin(event) {
  event.preventDefault();
  el.loginStatus.textContent = "Accesso in corso...";

  const email = el.loginEmail.value.trim();
  const password = el.loginPassword.value;

  const { error } = await state.supabase.auth.signInWithPassword({ email, password });

  if (error) {
    el.loginStatus.textContent = error.message;
    return;
  }

  await loadAuthState();
  await fetchAll();
  el.loginStatus.textContent = "Accesso effettuato.";
  el.loginDialog.close();
}

async function handleLogout() {
  await state.supabase.auth.signOut();
  state.user = null;
  state.isAdmin = false;
  renderAll();
}

async function handleSeasonSubmit(event) {
  event.preventDefault();
  if (!state.isAdmin) return;
  el.seasonFormStatus.textContent = "Creazione stagione...";

  const payload = {
    id: el.seasonIdInput.value.trim(),
    name: el.seasonNameInput.value.trim() || `Stagione ${el.seasonIdInput.value.trim()}`,
    starts_on: el.seasonStartsOn.value,
    ends_on: el.seasonEndsOn.value,
    is_active: false,
  };

  if (!payload.id || !payload.starts_on || !payload.ends_on) {
    el.seasonFormStatus.textContent = "ID, data inizio e data fine sono obbligatori.";
    return;
  }

  const { error } = await state.supabase.from("seasons").upsert(payload, { onConflict: "id" });
  if (error) { el.seasonFormStatus.textContent = error.message; return; }

  await seedDefaultCompetitions(payload.id);
  const createdSeasonId = payload.id;
  el.seasonForm.reset();
  await refreshAdminDataAfterMutation({
    preserve: {
      competitionSeason: createdSeasonId,
      honorSeason: createdSeasonId,
      rolloverSourceSeason: createdSeasonId,
      stadiumSeason: createdSeasonId,
    },
    statusElement: el.seasonFormStatus,
    message: "Stagione salvata con competizioni base.",
  });
}

async function seedDefaultCompetitions(seasonId) {
  const defaults = [
    { name: `Regular Season ${seasonId}`, competition_type: "REGULAR_SEASON", status: "PLANNED" },
    { name: `Champions League ${seasonId}`, competition_type: "CHAMPIONS", status: "PLANNED" },
    { name: `Coppa Italia ${seasonId}`, competition_type: "COPPA_ITALIA", status: "PLANNED" },
    { name: `Playoff ${seasonId}`, competition_type: "PLAYOFF", status: "PLANNED" },
  ];

  const { data: existing, error } = await state.supabase
    .from("competitions")
    .select("id, competition_type")
    .eq("season_id", seasonId);
  if (error && error.code !== "42P01") throw error;

  const existingTypes = new Set((existing || []).map((competition) => competition.competition_type));
  const missing = defaults
    .filter((item) => !existingTypes.has(item.competition_type))
    .map((item) => ({ season_id: seasonId, ...item }));

  if (!missing.length) return;
  const { error: insertError } = await state.supabase.from("competitions").insert(missing);
  if (insertError && insertError.code !== "23505") throw insertError;
}

async function handleRolloverSubmit(event) {
  event.preventDefault();
  if (!state.isAdmin) return;
  el.rolloverStatus.textContent = "Riversamento rose in corso...";

  const sourceSeason = el.rolloverSourceSeason.value;
  const targetSeason = el.rolloverTargetSeason.value.trim();
  if (!sourceSeason || !targetSeason) {
    el.rolloverStatus.textContent = "Scegli stagione origine e stagione destinazione.";
    return;
  }

  if (!state.seasons.some((season) => season.id === targetSeason)) {
    const [startYear, endYear] = targetSeason.split("-");
    const { error: seasonError } = await state.supabase.from("seasons").insert({
      id: targetSeason,
      name: `Stagione ${targetSeason}`,
      starts_on: `${startYear || new Date().getFullYear()}-07-01`,
      ends_on: `${endYear || Number(startYear || new Date().getFullYear()) + 1}-06-30`,
      is_active: false,
    });
    if (seasonError) { el.rolloverStatus.textContent = seasonError.message; return; }
    await seedDefaultCompetitions(targetSeason);
  }

  const sourceRows = state.rosterEntries.filter((entry) => entry.season_id === sourceSeason && entry.is_active);
  const targetExisting = new Set(state.rosterEntries.filter((entry) => entry.season_id === targetSeason).map((entry) => `${entry.club_id}|${entry.player_id}`));
  const rows = sourceRows
    .filter((entry) => !targetExisting.has(`${entry.club_id}|${entry.player_id}`))
    .map((entry) => ({
      season_id: targetSeason,
      club_id: entry.club_id,
      player_id: entry.player_id,
      purchase_price: entry.purchase_price || 0,
      acquired_via: "MANUAL",
      acquired_at: `${targetSeason.slice(0, 4)}-07-01`,
      is_active: true,
      is_loan: entry.is_loan || false,
      loan_from_club_id: entry.loan_from_club_id || null,
      source_real_team: entry.source_real_team || null,
      source_file_name: "Riversamento stagione precedente",
      import_id: entry.import_id || null,
      notes: `Riversato da ${sourceSeason}`,
    }));

  if (rows.length) {
    const { error } = await state.supabase.from("roster_entries").insert(rows);
    if (error) { el.rolloverStatus.textContent = error.message; return; }
  }

  el.rolloverStatus.textContent = `Riversati ${rows.length} giocatori da ${sourceSeason} a ${targetSeason}.`;
  await fetchAll();
}

async function handleClubSubmit(event) {
  event.preventDefault();
  el.clubFormStatus.textContent = "Salvataggio...";

  const clubId = el.clubEditSelect.value;
  const payload = {
    name: el.clubNameInput.value.trim(),
    president: resolvePresidentValue(el.clubPresidentSelect, el.clubPresidentInput),
    active: el.clubActiveInput.checked,
  };

  if (el.removeClubLogoInput?.checked) {
    payload.logo_data_url = null;
  } else if (el.clubLogoInput?.files?.[0]) {
    payload.logo_data_url = await readFileAsDataUrl(el.clubLogoInput.files[0]);
  }

  if (!payload.name || !payload.president) {
    el.clubFormStatus.textContent = "Nome club e presidente sono obbligatori.";
    return;
  }

  const { error } = await state.supabase.from("clubs").update(payload).eq("id", clubId);

  if (error) {
    el.clubFormStatus.textContent = error.message;
    return;
  }

  const { error: honorError } = await state.supabase.from("honor_clubs").upsert({
    source_club_id: clubId,
    name: payload.name,
    president: payload.president,
    president_key: getPresidentKey(payload.president),
    logo_data_url: payload.logo_data_url === undefined ? (getClubById(clubId)?.logo_data_url || null) : payload.logo_data_url,
  }, { onConflict: "source_club_id" });
  if (honorError) {
    el.clubFormStatus.textContent = `Club aggiornato, ma sync albo fallita: ${honorError.message}`;
    return;
  }

  el.clubFormStatus.textContent = "Club aggiornato.";
  await fetchAll();
  el.clubEditSelect.value = clubId;
  updateClubFormFields();
}


async function insertRowsInChunks(table, rows, options = {}) {
  const inserted = [];
  for (const chunk of chunkArray(rows, 250)) {
    let query = state.supabase.from(table);
    const response = options.upsert
      ? await query.upsert(chunk, { onConflict: options.onConflict }).select("*")
      : await query.insert(chunk).select("*");
    if (response.error) throw response.error;
    inserted.push(...(response.data || []));
  }
  return inserted;
}

function buildRowsWithAutoAsterisked(parsedRows, previousLatest) {
  const rowsMap = new Map();

  for (const row of parsedRows.activeRows) rowsMap.set(row.player_key, row);
  for (const row of parsedRows.cedutiRows) {
    if (!rowsMap.has(row.player_key)) rowsMap.set(row.player_key, row);
  }

  let autoAsterisked = 0;

  for (const prev of previousLatest) {
    const prevKey = getQuotationKey(prev);
    if (prev.is_listed && prevKey && !rowsMap.has(prevKey)) {
      rowsMap.set(prevKey, {
        fantacalcio_id: String(prev.fantacalcio_id || ""),
        player_key: prevKey,
        player_name: prev.player_name,
        real_team: prev.real_team,
        classic_role: prev.classic_role,
        mantra_roles: prev.mantra_roles,
        role_class: prev.role_class,
        quotation_current: toNumber(prev.quotation_current),
        quotation_initial: toNumber(prev.quotation_initial),
        quotation_diff: toNumber(prev.quotation_diff),
        quotation_current_mantra: toNumber(prev.quotation_current_mantra),
        quotation_initial_mantra: toNumber(prev.quotation_initial_mantra),
        quotation_diff_mantra: toNumber(prev.quotation_diff_mantra),
        fvm: toNumber(prev.fvm),
        fvm_mantra: toNumber(prev.fvm_mantra),
        is_listed: false,
        listone_status: "LEFT_LISTONE",
        left_listone_reason: "MISSING_FROM_LISTONE",
        source_sheet: "Assente nel nuovo listone",
      });
      autoAsterisked += 1;
    }
  }

  return { rows: Array.from(rowsMap.values()), autoAsterisked };
}

function comparableString(value) {
  return String(value || "").trim().toUpperCase();
}

function comparableNumber(value) {
  const n = toNumber(value);
  return n === null ? null : Number(n);
}

function rowHasQuotationChange(row, prev) {
  if (!prev) return true;

  const stringFields = [
    "player_name",
    "real_team",
    "classic_role",
    "mantra_roles",
    "role_class",
    "listone_status",
    "left_listone_reason",
  ];

  for (const field of stringFields) {
    if (comparableString(row[field]) !== comparableString(prev[field])) return true;
  }

  if (Boolean(row.is_listed) !== Boolean(prev.is_listed)) return true;

  const numericFields = [
    "quotation_current",
    "quotation_initial",
    "quotation_diff",
    "quotation_current_mantra",
    "quotation_initial_mantra",
    "quotation_diff_mantra",
    "fvm",
    "fvm_mantra",
  ];

  for (const field of numericFields) {
    if (comparableNumber(row[field]) !== comparableNumber(prev[field])) return true;
  }

  // L'ID Fantacalcio puo cambiare tra stagioni/listoni e non e una modifica sportiva.
  return false;
}

function splitRowsByChange(rows, previousLatest) {
  const prevByPlayerKey = new Map(previousLatest.map((quote) => [getQuotationKey(quote), quote]));
  const changedRows = [];
  const unchangedRows = [];

  for (const row of rows) {
    const prev = prevByPlayerKey.get(row.player_key);
    if (rowHasQuotationChange(row, prev)) {
      changedRows.push(row);
    } else {
      unchangedRows.push({ row, prev });
    }
  }

  return { changedRows, unchangedRows };
}

function computeListoneChanges(newRows, previousLatest, unchangedRows = []) {
  const prevByPlayerKey = new Map(previousLatest.map((quote) => [getQuotationKey(quote), quote]));

  const changes = {
    newPlayers: [],
    returned: [],
    asterisked: [],
    priceChanges: [],
    teamChanges: [],
    roleChanges: [],
    unchanged: unchangedRows,
  };

  for (const row of newRows) {
    const prev = prevByPlayerKey.get(row.player_key);

    if (!prev && row.is_listed) {
      changes.newPlayers.push(row);
      continue;
    }

    if (!prev) continue;

    if (!prev.is_listed && row.is_listed) changes.returned.push({ row, prev });
    if (prev.is_listed && !row.is_listed) changes.asterisked.push({ row, prev });

    if (prev.is_listed && row.is_listed) {
      const prevPrice = Number(prev.quotation_current ?? 0);
      const newPrice = Number(row.quotation_current ?? 0);
      if (prevPrice !== newPrice) {
        changes.priceChanges.push({ row, prev, delta: newPrice - prevPrice });
      }
      if ((prev.real_team || "") !== (row.real_team || "")) changes.teamChanges.push({ row, prev });
      if ((prev.mantra_roles || "") !== (row.mantra_roles || "")) changes.roleChanges.push({ row, prev });
    }
  }

  return changes;
}

function renderImportReport(changes, uploadStats) {
  const priceRows = changes.priceChanges
    .slice(0, 12)
    .map(({ row, prev, delta }) => `<li>${escapeHtml(row.player_name)}: ${prev.quotation_current ?? "-"} → ${row.quotation_current ?? "-"} (${delta > 0 ? "+" : ""}${delta})</li>`)
    .join("");

  const asteriskedRows = changes.asterisked
    .slice(0, 12)
    .map(({ row }) => {
      const reason = row.left_listone_reason === "MISSING_FROM_LISTONE" ? "assente dal nuovo listone" : "foglio Ceduti";
      return `<li>${escapeHtml(row.player_name)}${row.real_team ? ` · ${escapeHtml(row.real_team)}` : ""} <span class="muted">(${reason})</span></li>`;
    })
    .join("");

  const returnedRows = changes.returned
    .slice(0, 8)
    .map(({ row }) => `<li>${escapeHtml(row.player_name)}${row.real_team ? ` · ${escapeHtml(row.real_team)}` : ""}</li>`)
    .join("");

  const teamRows = changes.teamChanges
    .slice(0, 8)
    .map(({ row, prev }) => `<li>${escapeHtml(row.player_name)}: ${escapeHtml(prev.real_team || "-")} → ${escapeHtml(row.real_team || "-")}</li>`)
    .join("");

  const roleRows = changes.roleChanges
    .slice(0, 8)
    .map(({ row, prev }) => `<li>${escapeHtml(row.player_name)}: ${escapeHtml(prev.mantra_roles || "-")} → ${escapeHtml(row.mantra_roles || "-")}</li>`)
    .join("");

  const unchangedRows = changes.unchanged
    .slice(0, 12)
    .map(({ row, prev }) => {
      const upload = getUploadById(prev.upload_id);
      const lastChange = upload?.listone_date || upload?.created_at || prev.upload_created_at || prev.created_at;
      return `<li>${escapeHtml(row.player_name)} <span class="muted">ultima modifica ${escapeHtml(fmtDateOnly(lastChange))}</span></li>`;
    })
    .join("");

  el.listoneImportReport.innerHTML = `
    <div class="import-summary-grid">
      <div><span>Righe file</span><strong>${uploadStats.fileRows}</strong></div>
      <div><span>In listone</span><strong>${uploadStats.active}</strong></div>
      <div><span>Foglio Ceduti</span><strong>${uploadStats.ceduti}</strong></div>
      <div><span>Asteriscati automatici</span><strong>${uploadStats.autoAsterisked}</strong></div>
      <div><span>Righe con modifica</span><strong>${uploadStats.changed}</strong></div>
      <div><span>Righe invariate</span><strong>${uploadStats.unchanged}</strong></div>
      <div><span>Nuovi</span><strong>${changes.newPlayers.length}</strong></div>
      <div><span>Rientrati</span><strong>${changes.returned.length}</strong></div>
      <div><span>Variazioni prezzo</span><strong>${changes.priceChanges.length}</strong></div>
      <div><span>Asteriscati totali</span><strong>${changes.asterisked.length}</strong></div>
    </div>
    <div class="import-columns import-columns-wide">
      <div><h3>Variazioni prezzo</h3><ul>${priceRows || '<li>Nessuna variazione.</li>'}</ul></div>
      <div><h3>Asteriscati / usciti dal listone</h3><ul>${asteriskedRows || '<li>Nessun nuovo asteriscato.</li>'}</ul></div>
      <div><h3>Rientrati nel listone</h3><ul>${returnedRows || '<li>Nessun rientro.</li>'}</ul></div>
      <div><h3>Cambi squadra</h3><ul>${teamRows || '<li>Nessun cambio squadra.</li>'}</ul></div>
      <div><h3>Cambi ruolo Mantra</h3><ul>${roleRows || '<li>Nessun cambio ruolo.</li>'}</ul></div>
      <div><h3>Invariati</h3><ul>${unchangedRows || '<li>Nessun invariato oppure primo caricamento.</li>'}</ul></div>
    </div>
  `;
  el.listoneImportReport.classList.remove("hidden");
}

async function handleListoneUpload(event) {
  event.preventDefault();
  el.listoneUploadStatus.textContent = "Lettura file...";
  el.listoneImportReport.classList.add("hidden");

  const file = el.listoneFile.files?.[0];
  const seasonId = el.listoneSeason.value;
  const label = el.listoneLabel.value.trim() || null;
  const listoneDate = el.listoneDate.value || null;

  if (!file) {
    el.listoneUploadStatus.textContent = "Seleziona un file Excel.";
    return;
  }

  try {
    const previousLatest = getLatestQuotationsForSeason(seasonId);
    const parsed = await readListoneWorkbook(file);
    const { rows: effectiveRows, autoAsterisked } = buildRowsWithAutoAsterisked(parsed, previousLatest);
    const { changedRows, unchangedRows } = splitRowsByChange(effectiveRows, previousLatest);

    if (!effectiveRows.length) {
      el.listoneUploadStatus.textContent = "Nessun giocatore riconosciuto nel file.";
      return;
    }

    el.listoneUploadStatus.textContent = `Riconosciuti ${effectiveRows.length} giocatori: ${changedRows.length} modifiche, ${unchangedRows.length} invariati...`;

    const uploadPayload = {
      season_id: seasonId,
      file_name: file.name,
      label,
      listone_date: listoneDate,
      total_rows: effectiveRows.length,
      active_rows: parsed.activeRows.length,
      ceduti_rows: parsed.cedutiRows.length,
      auto_asterisked_rows: autoAsterisked,
      changed_rows: changedRows.length,
      unchanged_rows: unchangedRows.length,
      created_by: state.user?.id || null,
    };

    const { data: upload, error: uploadError } = await state.supabase
      .from("listone_uploads")
      .insert(uploadPayload)
      .select("*")
      .single();

    if (uploadError) throw uploadError;

    if (changedRows.length) {
      const playerPayloads = changedRows.map((row) => ({
        player_key: row.player_key,
        fantacalcio_id: row.fantacalcio_id,
        name: row.player_name,
        real_team: row.real_team,
        classic_role: row.classic_role,
        mantra_roles: row.mantra_roles,
        role_class: row.role_class,
        is_asterisked: !row.is_listed,
      }));

      const savedPlayers = await insertRowsInChunks("players", playerPayloads, {
        upsert: true,
        onConflict: "player_key",
      });

      const playerByKey = new Map(savedPlayers.map((player) => [String(player.player_key), player]));

      const quotationPayloads = changedRows.map((row) => {
        const player = playerByKey.get(row.player_key);
        if (!player) throw new Error(`Giocatore non salvato: ${row.player_name}`);
        return {
          upload_id: upload.id,
          season_id: seasonId,
          player_id: player.id,
          ...row,
        };
      });

      await insertRowsInChunks("player_quotations", quotationPayloads);
    }

    const changes = computeListoneChanges(changedRows, previousLatest, unchangedRows);
    renderImportReport(changes, {
      fileRows: parsed.activeRows.length + parsed.cedutiRows.length,
      total: effectiveRows.length,
      active: parsed.activeRows.length,
      ceduti: parsed.cedutiRows.length,
      autoAsterisked,
      changed: changedRows.length,
      unchanged: unchangedRows.length,
    });

    el.listoneUploadStatus.textContent = changedRows.length
      ? "Listone caricato correttamente. Sono state salvate solo le righe modificate."
      : "Listone caricato correttamente. Nessuna nuova modifica da salvare nello storico giocatori.";
    el.listoneUploadForm.reset();
    state.selectedListoneSeason = seasonId;
    await fetchAll();
    if (el.listoneSeasonFilter) el.listoneSeasonFilter.value = seasonId;
    renderListone();
  } catch (error) {
    el.listoneUploadStatus.textContent = error.message || "Errore durante l'importazione del listone.";
  }
}

async function handleAuctionSubmit(event) {
  event.preventDefault();
  el.auctionFormStatus.textContent = "Salvataggio...";

  const seasonId = el.auctionSeason.value;
  const clubId = el.auctionClub.value;
  const selectedPlayerId = el.auctionPlayerSelect.value;
  const selectedPlayer = selectedPlayerId && selectedPlayerId !== "manual" ? getPlayerById(selectedPlayerId) : null;
  const selectedQuote = selectedPlayerId && selectedPlayerId !== "manual" ? getLatestQuoteByPlayerIdForSeason(selectedPlayerId, seasonId) : null;
  const playerName = el.auctionPlayerName.value.trim();
  const realTeam = el.auctionRealTeam.value.trim() || selectedQuote?.real_team || selectedPlayer?.real_team || null;
  const mantraRoles = el.auctionRoles.value.trim() || selectedQuote?.mantra_roles || selectedPlayer?.mantra_roles || "";
  const roleClass = el.auctionRoleClass.value || selectedQuote?.role_class || selectedPlayer?.role_class || "MOVIMENTO";
  const price = Number(el.auctionPrice.value);
  const acquiredAt = el.auctionDate.value || todayIso();

  if (!playerName || !mantraRoles) {
    el.auctionFormStatus.textContent = "Nome calciatore e ruoli Mantra sono obbligatori.";
    return;
  }

  if (!Number.isFinite(price) || price < 0) {
    el.auctionFormStatus.textContent = "Inserisci un prezzo valido.";
    return;
  }

  const balance = getClubBalance(clubId);
  if (balance - price < 0) {
    el.auctionFormStatus.textContent = `Operazione bloccata: saldo insufficiente (${fmtFm(balance)}).`;
    return;
  }

  let player = selectedPlayer;
  let createdManualPlayer = false;

  if (!player) {
    const { data: manualPlayer, error: playerError } = await state.supabase
      .from("players")
      .insert({
        player_key: getPlayerKeyFromName(playerName),
        name: playerName,
        real_team: realTeam,
        mantra_roles: mantraRoles,
        role_class: roleClass,
      })
      .select("*")
      .single();

    if (playerError) {
      el.auctionFormStatus.textContent = playerError.message;
      return;
    }

    player = manualPlayer;
    createdManualPlayer = true;
  }

  const { error: rosterError } = await state.supabase.from("roster_entries").insert({
    season_id: seasonId,
    club_id: clubId,
    player_id: player.id,
    purchase_price: price,
    acquired_via: "AUCTION",
    acquired_at: acquiredAt,
    is_active: true,
    is_loan: false,
  });

  if (rosterError) {
    if (createdManualPlayer) await state.supabase.from("players").delete().eq("id", player.id);
    el.auctionFormStatus.textContent = rosterError.message;
    return;
  }

  if (price > 0) {
    const { error: movementError } = await state.supabase.from("fm_movements").insert({
      season_id: seasonId,
      club_id: clubId,
      amount: -Math.abs(price),
      movement_type: "AUCTION_BUY",
      description: `Acquisto asta - ${playerName}`,
      reference_type: "player",
      reference_id: player.id,
      created_by: state.user?.id || null,
    });

    if (movementError) {
      el.auctionFormStatus.textContent = `Giocatore inserito, ma movimento FM non registrato: ${movementError.message}`;
      await fetchAll();
      return;
    }
  }

  el.auctionForm.reset();
  el.auctionPlayerSelect.value = "manual";
  el.auctionSeason.value = state.selectedSeason || ACTIVE_SEASON_ID;
  el.auctionDate.value = todayIso();
  el.auctionFormStatus.textContent = "Acquisto registrato.";
  await fetchAll();
}

async function handleMovementSubmit(event) {
  event.preventDefault();
  el.movementFormStatus.textContent = "Salvataggio...";

  let normalized;

  try {
    normalized = normalizeMovement(el.movementType.value, el.movementAmount.value);
  } catch (error) {
    el.movementFormStatus.textContent = error.message;
    return;
  }

  const clubId = el.movementClub.value;
  const balance = getClubBalance(clubId, el.movementSeason.value);

  if (normalized.amount < 0 && balance + normalized.amount < 0 && normalized.movementType !== "ADJUSTMENT") {
    el.movementFormStatus.textContent = `Operazione bloccata: saldo insufficiente (${fmtFm(balance)}).`;
    return;
  }

  const payload = {
    season_id: el.movementSeason.value,
    club_id: clubId,
    amount: normalized.amount,
    movement_type: normalized.movementType,
    description: el.movementDescription.value.trim() || null,
    created_by: state.user?.id || null,
  };

  const { error } = await state.supabase.from("fm_movements").insert(payload);

  if (error) {
    el.movementFormStatus.textContent = error.message;
    return;
  }

  el.movementForm.reset();
  el.movementSeason.value = state.selectedSeason || ACTIVE_SEASON_ID;
  updateMovementSignHint();
  el.movementFormStatus.textContent = "Movimento salvato.";
  await fetchAll();
}


function updateStadiumFormFields() {
  if (!el.stadiumClub || !el.stadiumSeason) return;
  const clubId = el.stadiumClub.value || getCurrentClubs()[0]?.id;
  const seasonId = el.stadiumSeason.value || getSelectedSeasonId();
  const club = getClubById(clubId);
  const stadium = getClubStadium(clubId, seasonId);
  if (el.stadiumClub && clubId) el.stadiumClub.value = clubId;
  if (el.stadiumName) el.stadiumName.value = stadium?.name || (club ? `Stadio ${club.name}` : "");
  if (el.stadiumLevel) el.stadiumLevel.value = String(stadium?.level ?? 0);
}

async function handleStadiumSubmit(event) {
  event.preventDefault();
  el.stadiumFormStatus.textContent = "Salvataggio...";
  const payload = {
    season_id: el.stadiumSeason.value,
    club_id: el.stadiumClub.value,
    name: el.stadiumName.value.trim() || null,
    level: Number(el.stadiumLevel.value || 0),
  };
  const { error } = await state.supabase.from("stadiums").upsert(payload, { onConflict: "season_id,club_id" });
  if (error) { el.stadiumFormStatus.textContent = error.message; return; }
  await refreshAdminDataAfterMutation({
    preserve: { stadiumSeason: payload.season_id, stadiumClub: payload.club_id },
    statusElement: el.stadiumFormStatus,
    message: "Stadio aggiornato.",
  });
}

async function handleNewsSubmit(event) {
  event.preventDefault();
  el.newsFormStatus.textContent = "Salvataggio...";
  const id = el.newsId.value || null;
  const payload = {
    title: el.newsTitleInput.value.trim(),
    topic: el.newsTopic.value,
    body: el.newsBody.value.trim() || null,
    created_by: state.user?.id || null,
  };
  const response = id
    ? await state.supabase.from("news_posts").update(payload).eq("id", id)
    : await state.supabase.from("news_posts").insert(payload);
  if (response.error) { el.newsFormStatus.textContent = response.error.message; return; }
  resetNewsForm();
  await refreshAdminDataAfterMutation({
    statusElement: el.newsFormStatus,
    message: "Comunicato salvato.",
  });
}

function resetNewsForm() {
  if (!el.newsForm) return;
  el.newsId.value = ""; el.newsTitleInput.value = ""; el.newsTopic.value = "GENERALE"; el.newsBody.value = "";
}

async function handleCompetitionSubmit(event) {
  event.preventDefault();
  el.competitionFormStatus.textContent = "Salvataggio...";
  const id = el.competitionId.value || null;
  const payload = { season_id: el.competitionSeason.value, name: el.competitionName.value.trim(), competition_type: el.competitionType.value, status: el.competitionStatus.value };
  const response = id ? await state.supabase.from("competitions").update(payload).eq("id", id) : await state.supabase.from("competitions").insert(payload);
  if (response.error) { el.competitionFormStatus.textContent = response.error.message; return; }
  const savedSeason = payload.season_id;
  resetCompetitionForm({ keepSeason: savedSeason });
  await refreshAdminDataAfterMutation({
    preserve: { competitionSeason: savedSeason },
    statusElement: el.competitionFormStatus,
    message: "Competizione salvata.",
  });
}

function resetCompetitionForm(options = {}) {
  if (!el.competitionForm) return;
  const keepSeason = options.keepSeason || el.competitionSeason?.value || getSelectedSeasonId();
  el.competitionId.value = "";
  el.competitionName.value = "";
  el.competitionType.value = "REGULAR_SEASON";
  el.competitionStatus.value = "ACTIVE";
  if (el.competitionSeason) el.competitionSeason.value = keepSeason;
}

async function handleHistoricalClubSubmit(event) {
  event.preventDefault();
  if (!state.isAdmin) return;
  el.historicalClubFormStatus.textContent = "Salvataggio...";
  const logoFile = el.historicalClubLogoInput?.files?.[0];
  const logo = logoFile ? await readFileAsDataUrl(logoFile) : null;
  const id = el.historicalClubId.value || null;
  const president = resolvePresidentValue(el.historicalClubPresidentSelect, el.historicalClubPresidentInput);
  const payload = {
    source_club_id: el.historicalClubSourceClub?.value || null,
    name: el.historicalClubNameInput.value.trim(),
    president: president || null,
    president_key: president ? getPresidentKey(president) : null,
  };
  if (logo) payload.logo_data_url = logo;
  const response = id
    ? await state.supabase.from("honor_clubs").update(payload).eq("id", id)
    : await state.supabase.from("honor_clubs").insert(payload);
  if (response.error) { el.historicalClubFormStatus.textContent = response.error.message; return; }
  resetHistoricalClubForm();
  await refreshAdminDataAfterMutation({ statusElement: el.historicalClubFormStatus, message: "Squadra storica salvata." });
}

function resetHistoricalClubForm() {
  if (!el.historicalClubForm) return;
  el.historicalClubId.value = "";
  if (el.historicalClubSourceClub) el.historicalClubSourceClub.value = "";
  el.historicalClubNameInput.value = "";
  setPresidentControls(el.historicalClubPresidentSelect, el.historicalClubPresidentInput, "");
  if (el.historicalClubLogoInput) el.historicalClubLogoInput.value = "";
}

async function handleClubIdentitySubmit(event) {
  event.preventDefault();
  if (!state.isAdmin) return;
  el.clubIdentityFormStatus.textContent = "Salvataggio...";
  const logoFile = el.clubIdentityLogoInput?.files?.[0];
  const logo = logoFile ? await readFileAsDataUrl(logoFile) : null;
  const id = el.clubIdentityId.value || null;
  const president = resolvePresidentValue(el.clubIdentityPresidentSelect, el.clubIdentityPresidentInput);
  const payload = {
    season_id: el.clubIdentitySeason.value,
    club_id: el.clubIdentityClub.value,
    display_name: el.clubIdentityNameInput.value.trim(),
    president: president || null,
    president_key: president ? getPresidentKey(president) : null,
    stadium_name: el.clubIdentityStadiumInput.value.trim() || getMostRecentStadiumName(el.clubIdentityClub.value, el.clubIdentitySeason.value) || null,
  };
  if (logo) payload.logo_data_url = logo;
  const response = id
    ? await state.supabase.from("club_season_identities").update(payload).eq("id", id)
    : await state.supabase.from("club_season_identities").upsert(payload, { onConflict: "season_id,club_id" });
  if (response.error) { el.clubIdentityFormStatus.textContent = response.error.message; return; }
  const savedSeason = payload.season_id;
  resetClubIdentityForm({ keepSeason: savedSeason });
  await refreshAdminDataAfterMutation({
    preserve: { clubIdentitySeason: savedSeason },
    statusElement: el.clubIdentityFormStatus,
    message: "Identità stagionale salvata.",
  });
}

function resetClubIdentityForm(options = {}) {
  if (!el.clubIdentityForm) return;
  const keepSeason = options.keepSeason || el.clubIdentitySeason?.value || getSelectedSeasonId();
  el.clubIdentityId.value = "";
  if (el.clubIdentitySeason) el.clubIdentitySeason.value = keepSeason;
  if (el.clubIdentityClub && getCurrentClubs()[0]) el.clubIdentityClub.value = getCurrentClubs()[0].id;
  el.clubIdentityNameInput.value = "";
  setPresidentControls(el.clubIdentityPresidentSelect, el.clubIdentityPresidentInput, "");
  const clubId = el.clubIdentityClub?.value || getCurrentClubs()[0]?.id;
  el.clubIdentityStadiumInput.value = clubId ? getMostRecentStadiumName(clubId, keepSeason) : "";
  if (el.clubIdentityLogoInput) el.clubIdentityLogoInput.value = "";
}

async function handleStandingSubmit(event) {
  event.preventDefault();
  el.standingFormStatus.textContent = "Salvataggio...";
  const selectedCompetition = getCompetitionById(el.standingCompetition.value);
  if (!selectedCompetition || selectedCompetition.competition_type !== "REGULAR_SEASON") {
    el.standingFormStatus.textContent = "Puoi inserire classifiche solo per la Regular Season. Per coppe e playoff usa Albo d'oro e Calendario.";
    return;
  }
  const id = el.standingId.value || null;
  const payload = {
    competition_id: el.standingCompetition.value,
    club_id: el.standingClub.value,
    position: toNumber(el.standingPosition.value),
    points: toNumber(el.standingPoints.value),
    fantapoints: toNumber(el.standingFantapoints.value),
    goals_for: toNumber(el.standingGoalsFor.value),
    goals_against: toNumber(el.standingGoalsAgainst.value),
    played: toNumber(el.standingPlayed.value),
    wins: toNumber(el.standingWins?.value),
    draws: toNumber(el.standingDraws?.value),
    losses: toNumber(el.standingLosses?.value),
  };
  const response = id ? await state.supabase.from("competition_standings").update(payload).eq("id", id) : await state.supabase.from("competition_standings").insert(payload);
  if (response.error) { el.standingFormStatus.textContent = response.error.message; return; }
  const savedCompetition = payload.competition_id;
  resetStandingForm({ keepCompetition: savedCompetition });
  await refreshAdminDataAfterMutation({
    preserve: { standingCompetition: savedCompetition },
    statusElement: el.standingFormStatus,
    message: "Riga classifica salvata.",
  });
}

function resetStandingForm(options = {}) {
  if (!el.standingForm) return;
  const keepCompetition = options.keepCompetition || el.standingCompetition?.value || "";
  el.standingId.value = "";
  [el.standingPosition, el.standingPoints, el.standingFantapoints, el.standingGoalsFor, el.standingGoalsAgainst, el.standingPlayed, el.standingWins, el.standingDraws, el.standingLosses].forEach((field) => { if (field) field.value = ""; });
  if (el.standingCompetition && keepCompetition) el.standingCompetition.value = keepCompetition;
}

async function handleCalendarSubmit(event) {
  event.preventDefault();
  el.calendarFormStatus.textContent = "Salvataggio...";
  const competition = getCompetitionById(el.calendarCompetition.value);
  const id = el.calendarMatchId.value || null;
  const manualWinnerId = el.calendarManualWinnerClub?.value || null;

  if (manualWinnerId) {
    const participants = [el.calendarHomeClub.value, el.calendarAwayClub.value].filter(Boolean);
    if (participants.length && !participants.includes(manualWinnerId)) {
      el.calendarFormStatus.textContent = "La vincitrice manuale deve essere una delle due squadre della partita.";
      return;
    }
    if (competition?.competition_type === "REGULAR_SEASON") {
      el.calendarFormStatus.textContent = "La vincitrice manuale è prevista solo per coppe e playoff, non per la Regular Season.";
      return;
    }
  }

  const payload = {
    season_id: competition?.season_id || getSelectedSeasonId(),
    competition_id: el.calendarCompetition.value,
    matchday_label: el.calendarMatchday.value.trim(),
    played_on: el.calendarDate.value || null,
    home_club_id: el.calendarHomeClub.value || null,
    away_club_id: el.calendarAwayClub.value || null,
    home_score: toNumber(el.calendarHomeScore.value),
    away_score: toNumber(el.calendarAwayScore.value),
    home_goals: toNumber(el.calendarHomeGoals?.value),
    away_goals: toNumber(el.calendarAwayGoals?.value),
    manual_winner_club_id: manualWinnerId,
    manual_winner_note: el.calendarManualWinnerNote?.value.trim() || null,
    status: el.calendarStatus.value,
  };
  const response = id ? await state.supabase.from("calendar_matches").update(payload).eq("id", id) : await state.supabase.from("calendar_matches").insert(payload);
  if (response.error) { el.calendarFormStatus.textContent = response.error.message; return; }
  const savedCompetition = payload.competition_id;
  resetCalendarForm({ keepCompetition: savedCompetition });
  await refreshAdminDataAfterMutation({
    preserve: { calendarCompetition: savedCompetition },
    statusElement: el.calendarFormStatus,
    message: "Giornata salvata.",
  });
}

function resetCalendarForm(options = {}) {
  if (!el.calendarForm) return;
  const keepCompetition = options.keepCompetition || el.calendarCompetition?.value || "";
  el.calendarMatchId.value = "";
  el.calendarMatchday.value = "";
  el.calendarDate.value = "";
  el.calendarHomeClub.value = "";
  el.calendarAwayClub.value = "";
  el.calendarHomeScore.value = "";
  el.calendarAwayScore.value = "";
  if (el.calendarHomeGoals) el.calendarHomeGoals.value = "";
  if (el.calendarAwayGoals) el.calendarAwayGoals.value = "";
  if (el.calendarManualWinnerClub) el.calendarManualWinnerClub.value = "";
  if (el.calendarManualWinnerNote) el.calendarManualWinnerNote.value = "";
  el.calendarStatus.value = "SCHEDULED";
  if (el.calendarCompetition && keepCompetition) el.calendarCompetition.value = keepCompetition;
  updateCalendarClubOptions();
}

async function ensureHonorClubFromForm() {
  const selectedValue = el.honorClub?.value || "__new__";
  if (selectedValue && selectedValue !== "__new__") {
    const club = getHonorClubById(selectedValue);
    if (!club) throw new Error("Squadra albo d'oro non trovata.");
    if (el.honorClubLogoInput?.files?.[0]) {
      const logo_data_url = await readFileAsDataUrl(el.honorClubLogoInput.files[0]);
      const { data, error } = await state.supabase.from("honor_clubs").update({ logo_data_url }).eq("id", club.id).select("*").single();
      if (error) throw error;
      Object.assign(club, data);
      return data;
    }
    return club;
  }

  const name = el.honorClubNameInput?.value.trim();
  const president = resolvePresidentValue(el.honorPresidentSelect, el.honorPresidentInput) || null;
  if (!name) throw new Error("Inserisci il nome della squadra storica oppure seleziona una squadra esistente.");

  const logo_data_url = el.honorClubLogoInput?.files?.[0] ? await readFileAsDataUrl(el.honorClubLogoInput.files[0]) : null;
  const clubKey = normalizeTextKey(`${name}-${president || ""}`) || normalizeTextKey(name);
  const existing = state.honorClubs.find((club) => normalizeTextKey(`${club.name}-${club.president || ""}`) === clubKey || normalizeTextKey(club.name) === normalizeTextKey(name));
  if (existing) return existing;

  const { data, error } = await state.supabase
    .from("honor_clubs")
    .insert({ name, president, president_key: president ? getPresidentKey(president) : null, logo_data_url, source_club_id: null })
    .select("*")
    .single();

  if (error) throw error;
  state.honorClubs.push(data);
  return data;
}

async function handleHonorSubmit(event) {
  event.preventDefault();
  el.honorFormStatus.textContent = "Salvataggio...";

  let honorClub;
  try {
    honorClub = await ensureHonorClubFromForm();
  } catch (error) {
    el.honorFormStatus.textContent = error.message;
    return;
  }

  const id = el.honorId.value || null;
  const honorPresident = resolvePresidentValue(el.honorPresidentSelect, el.honorPresidentInput) || honorClub.president || null;
  const payload = {
    season_id: el.honorSeason.value,
    club_id: honorClub.source_club_id || null,
    honor_club_id: honorClub.id,
    competition_type: el.honorCompetitionType.value,
    title: el.honorTitleInput.value.trim(),
    placement: toNumber(el.honorPlacement.value),
    points: toNumber(el.honorPoints.value),
    notes: el.honorNotes.value.trim() || null,
    // Salviamo anche presidente e nome squadra della stagione, così
    // una posizione manuale (es. 1° posto senza calendario partite)
    // compare correttamente nel palmarès storico del presidente/squadra.
    president: honorPresident,
    president_key: honorPresident ? getPresidentKey(honorPresident) : honorClub.president_key || null,
    season_team_name: honorClub.name || null,
  };
  const response = id ? await state.supabase.from("honor_roll_entries").update(payload).eq("id", id) : await state.supabase.from("honor_roll_entries").insert(payload);
  if (response.error) { el.honorFormStatus.textContent = response.error.message; return; }
  const savedSeason = payload.season_id;
  resetHonorForm({ keepSeason: savedSeason, keepCompetitionType: payload.competition_type });
  await refreshAdminDataAfterMutation({
    preserve: { honorSeason: savedSeason, honorCompetitionType: payload.competition_type },
    statusElement: el.honorFormStatus,
    message: "Voce albo salvata.",
  });
}

function resetHonorForm(options = {}) {
  if (!el.honorForm) return;
  const keepSeason = options.keepSeason || el.honorSeason?.value || getSelectedSeasonId();
  const keepCompetitionType = options.keepCompetitionType || el.honorCompetitionType?.value || "REGULAR_SEASON";
  el.honorId.value = "";
  el.honorTitleInput.value = "";
  el.honorPlacement.value = "";
  el.honorPoints.value = "";
  el.honorNotes.value = "";
  if (el.honorClub) el.honorClub.value = "__new__";
  if (el.honorClubNameInput) el.honorClubNameInput.value = "";
  if (el.honorPresidentSelect) el.honorPresidentSelect.value = "";
  if (el.honorPresidentInput) el.honorPresidentInput.value = "";
  if (el.honorClubLogoInput) el.honorClubLogoInput.value = "";
  if (el.honorSeason) el.honorSeason.value = keepSeason;
  if (el.honorCompetitionType) el.honorCompetitionType.value = keepCompetitionType;
}

const DUMP_TABLES = [
  "profiles",
  "seasons",
  "clubs",
  "club_season_identities",
  "fm_movements",
  "players",
  "roster_entries",
  "stadium_levels",
  "stadiums",
  "listone_uploads",
  "player_quotations",
  "roster_imports",
  "news_posts",
  "competitions",
  "competition_standings",
  "calendar_matches",
  "honor_clubs",
  "honor_roll_entries",
];

const SCHEMA_DUMP_NOTE = `-- FantaMantra DB schema note\n-- Questo dump include i dati completi in JSON.\n-- Per ricreare lo schema, esegui in ordine le migration SQL generate nella webapp:\n-- 1) schema MVP iniziale\n-- 2) supabase_listone_migration_v7.sql\n-- 3) supabase_roster_import_migration_v7.sql\n-- 4) supabase_incremental_listone_v11.sql\n-- 5) supabase_feature_migration_v13.sql\n-- 6) supabase_feature_migration_v14.sql\n-- 7) supabase_feature_migration_v15.sql\n-- 8) supabase_feature_migration_v35.sql\n-- Le tabelle incluse nel dump dati sono elencate nel campo tables.\n`;

function downloadTextFile(filename, text, mime = "application/json") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function handleDumpSubmit(event) {
  event.preventDefault();
  if (!state.isAdmin) return;
  el.dumpFormStatus.textContent = "Preparazione dump...";
  const type = el.dumpType.value || "both";
  const pretty = Boolean(el.dumpPretty?.checked);
  const payload = {
    exported_at: new Date().toISOString(),
    app_version: "v15",
    type,
    tables: DUMP_TABLES,
  };

  if (type === "schema" || type === "both") {
    payload.schema_sql_note = SCHEMA_DUMP_NOTE;
  }

  if (type === "data" || type === "both") {
    payload.data = {};
    for (const table of DUMP_TABLES) {
      try {
        payload.data[table] = await fetchAllRows(() => state.supabase.from(table).select("*"));
      } catch (error) {
        payload.data[table] = { error: error.message || String(error) };
      }
    }
  }

  const suffix = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  downloadTextFile(`fantamantra-db-dump-${type}-${suffix}.json`, JSON.stringify(payload, null, pretty ? 2 : 0));
  el.dumpFormStatus.textContent = "Dump scaricato.";
}

async function deleteById(table, id, messageEl) {
  if (!confirm("Confermi l'eliminazione?")) return;
  const { error } = await state.supabase.from(table).delete().eq("id", id);
  if (error) { if (messageEl) messageEl.textContent = error.message; else showError(error.message); return; }
  await fetchAll();
}

function fillEditFormsFromAdminAction(target) {
  const newsId = target.closest("[data-edit-news]")?.dataset.editNews;
  if (newsId) { const post = state.news.find((item) => item.id === newsId); if (!post) return; el.newsId.value = post.id; el.newsTitleInput.value = post.title || ""; el.newsTopic.value = post.topic || "GENERALE"; el.newsBody.value = post.body || ""; return; }
  const compId = target.closest("[data-edit-competition]")?.dataset.editCompetition;
  if (compId) { const c = getCompetitionById(compId); if (!c) return; el.competitionId.value = c.id; el.competitionSeason.value = c.season_id; el.competitionName.value = c.name || ""; el.competitionType.value = c.competition_type || "ALTRO"; el.competitionStatus.value = c.status || "PLANNED"; return; }
  const standingId = target.closest("[data-edit-standing]")?.dataset.editStanding;
  if (standingId) { const r = state.competitionStandings.find((item) => item.id === standingId); if (!r) return; el.standingId.value = r.id; el.standingCompetition.value = r.competition_id; el.standingClub.value = r.club_id; el.standingPosition.value = r.position ?? ""; el.standingPoints.value = r.points ?? ""; el.standingFantapoints.value = r.fantapoints ?? ""; el.standingGoalsFor.value = r.goals_for ?? ""; el.standingGoalsAgainst.value = r.goals_against ?? ""; el.standingPlayed.value = r.played ?? ""; if (el.standingWins) el.standingWins.value = r.wins ?? ""; if (el.standingDraws) el.standingDraws.value = r.draws ?? ""; if (el.standingLosses) el.standingLosses.value = r.losses ?? ""; return; }
  const historicalClubId = target.closest("[data-edit-historical-club]")?.dataset.editHistoricalClub;
  if (historicalClubId) {
    const club = state.honorClubs.find((item) => item.id === historicalClubId);
    if (!club) return;
    el.historicalClubId.value = club.id;
    if (el.historicalClubSourceClub) el.historicalClubSourceClub.value = club.source_club_id || "";
    el.historicalClubNameInput.value = club.name || "";
    setPresidentControls(el.historicalClubPresidentSelect, el.historicalClubPresidentInput, club.president || "");
    return;
  }
  const clubIdentityId = target.closest("[data-edit-club-identity]")?.dataset.editClubIdentity;
  if (clubIdentityId) {
    const identity = state.clubSeasonIdentities.find((item) => item.id === clubIdentityId);
    if (!identity) return;
    el.clubIdentityId.value = identity.id;
    el.clubIdentitySeason.value = identity.season_id || getSelectedSeasonId();
    el.clubIdentityClub.value = identity.club_id || "";
    el.clubIdentityNameInput.value = identity.display_name || "";
    setPresidentControls(el.clubIdentityPresidentSelect, el.clubIdentityPresidentInput, identity.president || "");
    el.clubIdentityStadiumInput.value = identity.stadium_name || getMostRecentStadiumName(identity.club_id, identity.season_id) || "";
    return;
  }
  const calendarId = target.closest("[data-edit-calendar]")?.dataset.editCalendar;
  if (calendarId) {
    const m = state.calendarMatches.find((item) => item.id === calendarId);
    if (!m) return;
    el.calendarMatchId.value = m.id;
    el.calendarCompetition.value = m.competition_id;
    updateCalendarMatchdaySuggestions();
    updateCalendarClubOptions();
    el.calendarMatchday.value = m.matchday_label || "";
    el.calendarDate.value = m.played_on || "";
    el.calendarHomeClub.value = m.home_club_id || "";
    el.calendarAwayClub.value = m.away_club_id || "";
    updateCalendarManualWinnerOptions();
    el.calendarHomeScore.value = m.home_score ?? "";
    el.calendarAwayScore.value = m.away_score ?? "";
    if (el.calendarHomeGoals) el.calendarHomeGoals.value = m.home_goals ?? "";
    if (el.calendarAwayGoals) el.calendarAwayGoals.value = m.away_goals ?? "";
    if (el.calendarManualWinnerClub) el.calendarManualWinnerClub.value = m.manual_winner_club_id || "";
    if (el.calendarManualWinnerNote) el.calendarManualWinnerNote.value = m.manual_winner_note || "";
    el.calendarStatus.value = m.status || "SCHEDULED";
    return;
  }
  const honorId = target.closest("[data-edit-honor]")?.dataset.editHonor;
  if (honorId) {
    const h = state.honorRoll.find((item) => item.id === honorId);
    if (!h) return;
    const honorClub = getHonorClubForEntry(h);
    el.honorId.value = h.id;
    el.honorSeason.value = h.season_id;
    el.honorClub.value = honorClub?.id || "__new__";
    if (el.honorClubNameInput) el.honorClubNameInput.value = honorClub?.source_club_id ? "" : (honorClub?.name || "");
    setPresidentControls(el.honorPresidentSelect, el.honorPresidentInput, honorClub?.president || "");
    if (el.honorClubLogoInput) el.honorClubLogoInput.value = "";
    el.honorCompetitionType.value = h.competition_type || "ALTRO";
    el.honorTitleInput.value = h.title || "";
    el.honorPlacement.value = h.placement ?? "";
    el.honorPoints.value = h.points ?? "";
    el.honorNotes.value = h.notes || "";
    return;
  }
}

function handleAdminListClick(event) {
  const target = event.target;
  fillEditFormsFromAdminAction(target);
  const deleteNews = target.closest("[data-delete-news]")?.dataset.deleteNews; if (deleteNews) return deleteById("news_posts", deleteNews, el.newsFormStatus);
  const deleteCompetition = target.closest("[data-delete-competition]")?.dataset.deleteCompetition; if (deleteCompetition) return deleteById("competitions", deleteCompetition, el.competitionFormStatus);
  const deleteStanding = target.closest("[data-delete-standing]")?.dataset.deleteStanding; if (deleteStanding) return deleteById("competition_standings", deleteStanding, el.standingFormStatus);
  const deleteCalendar = target.closest("[data-delete-calendar]")?.dataset.deleteCalendar; if (deleteCalendar) return deleteById("calendar_matches", deleteCalendar, el.calendarFormStatus);
  const deleteHonor = target.closest("[data-delete-honor]")?.dataset.deleteHonor; if (deleteHonor) return deleteById("honor_roll_entries", deleteHonor, el.honorFormStatus);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}



function setupMobileViewportClass() {
  const apply = () => {
    const coarsePointer = window.matchMedia?.("(hover: none) and (pointer: coarse)")?.matches || false;
    const narrowViewport = window.matchMedia?.("(max-width: 900px)")?.matches || false;
    const smallScreen = Math.min(window.innerWidth || 9999, screen.width || 9999) <= 900;
    document.body.classList.toggle("is-mobile-ux", Boolean(coarsePointer || narrowViewport || smallScreen));
  };
  apply();
  window.addEventListener("resize", apply, { passive: true });
  window.addEventListener("orientationchange", apply, { passive: true });
}

function closeMobileMoreMenu() {
  const sheet = document.getElementById("mobileMoreSheet");
  const backdrop = document.getElementById("mobileMoreBackdrop");
  const button = document.getElementById("mobileMoreBtn");
  sheet?.classList.add("hidden");
  backdrop?.classList.add("hidden");
  button?.setAttribute("aria-expanded", "false");
}

function openMobileMoreMenu() {
  const sheet = document.getElementById("mobileMoreSheet");
  const backdrop = document.getElementById("mobileMoreBackdrop");
  const button = document.getElementById("mobileMoreBtn");
  sheet?.classList.remove("hidden");
  backdrop?.classList.remove("hidden");
  button?.setAttribute("aria-expanded", "true");
}

function setupMobileNavigation() {
  const button = document.getElementById("mobileMoreBtn");
  const closeButton = document.getElementById("mobileMoreClose");
  const backdrop = document.getElementById("mobileMoreBackdrop");
  const sheet = document.getElementById("mobileMoreSheet");

  button?.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    isOpen ? closeMobileMoreMenu() : openMobileMoreMenu();
  });
  closeButton?.addEventListener("click", closeMobileMoreMenu);
  backdrop?.addEventListener("click", closeMobileMoreMenu);
  sheet?.addEventListener("click", (event) => {
    if (event.target.closest("[data-page-link]")) closeMobileMoreMenu();
  });
}

function updateMobileMoreState(pageId) {
  const morePages = ["clubs", "competitions", "honor", "finance", "admin"];
  const button = document.getElementById("mobileMoreBtn");
  button?.classList.toggle("active", morePages.includes(pageId));
}

function updateMobilePageSubnav(pageId) {
  const container = document.getElementById("mobilePageSubnav");
  const page = document.querySelector(`[data-page="${pageId}"]`);
  if (!container || !page) return;

  const panels = Array.from(page.querySelectorAll(".panel"))
    .filter((panel) => !panel.closest("dialog"));

  if (panels.length < 2) {
    container.classList.add("hidden");
    container.innerHTML = "";
    return;
  }

  container.classList.remove("hidden");
  container.innerHTML = panels
    .map((panel, index) => {
      if (!panel.id) panel.id = `mobile-${pageId}-section-${index + 1}`;
      const title = panel.querySelector("h2, h3")?.textContent?.trim() || `Sezione ${index + 1}`;
      return `<button class="mobile-subnav-pill" type="button" data-mobile-anchor="${escapeHtml(panel.id)}">${escapeHtml(title)}</button>`;
    })
    .join("");
}

function setupMobilePageSubnav() {
  const container = document.getElementById("mobilePageSubnav");
  container?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mobile-anchor]");
    if (!button) return;
    const target = document.getElementById(button.dataset.mobileAnchor);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function applyResponsiveTableLabels() {
  document.querySelectorAll(".table-wrap table").forEach((table) => {
    const labels = Array.from(table.querySelectorAll("thead th")).map((th) => th.textContent.trim().replace(/\s+/g, " "));
    table.querySelectorAll("tbody tr").forEach((row) => {
      Array.from(row.children).forEach((cell, index) => {
        if (cell.tagName === "TD") cell.setAttribute("data-label", labels[index] || "");
      });
    });
  });
}

function setupResponsiveTableObserver() {
  const root = document.querySelector(".app-main");
  if (!root) return;
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      applyResponsiveTableLabels();
      scheduled = false;
    });
  });
  observer.observe(root, { childList: true, subtree: true });
  applyResponsiveTableLabels();
}


const PAGE_IDS = ["dashboard", "clubs", "rosters", "listone", "news", "competitions", "honor", "finance", "admin"];

function getCurrentPage() {
  return document.querySelector(".app-page.is-active")?.dataset.page || "dashboard";
}

function getPageFromHash() {
  const raw = (window.location.hash || "#dashboard").replace("#", "").trim();
  return PAGE_IDS.includes(raw) ? raw : "dashboard";
}

function setActivePage(pageId, options = {}) {
  let nextPage = PAGE_IDS.includes(pageId) ? pageId : "dashboard";

  if (nextPage === "admin" && !state.isAdmin) {
    nextPage = "dashboard";
  }

  document.querySelectorAll("[data-page]").forEach((page) => {
    page.classList.toggle("is-active", page.dataset.page === nextPage);
  });

  document.querySelectorAll("[data-page-link]").forEach((link) => {
    const active = link.dataset.pageLink === nextPage;
    link.classList.toggle("active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  updateMobileMoreState(nextPage);
  updateMobilePageSubnav(nextPage);
  closeMobileMoreMenu();

  if (!options.skipHash && window.location.hash !== `#${nextPage}`) {
    history.replaceState(null, "", `#${nextPage}`);
  }

  window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });

  if (state.supabase) {
    loadPageData(nextPage)
      .then(() => renderAll())
      .catch((error) => showError(error.message || String(error)));
  }
}

function setupPageNavigation() {
  document.querySelectorAll("[data-page-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setActivePage(link.dataset.pageLink);
    });
  });

  window.addEventListener("hashchange", () => {
    setActivePage(getPageFromHash(), { skipHash: true, instant: true });
  });

  setActivePage(getPageFromHash(), { skipHash: true, instant: true });
}

function setupCollapsiblePanels() {
  document.querySelectorAll(".panel").forEach((panel, index) => {
    const header = panel.querySelector(":scope > .panel-header");
    if (!header || header.querySelector(".panel-toggle")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button-secondary panel-toggle";
    button.setAttribute("aria-expanded", "true");
    button.textContent = "Riduci";
    button.dataset.panelIndex = String(index);

    button.addEventListener("click", () => {
      const collapsed = panel.classList.toggle("is-collapsed");
      button.textContent = collapsed ? "Ingrandisci" : "Riduci";
      button.setAttribute("aria-expanded", String(!collapsed));
    });

    if (panel.closest("#adminPanel")) {
      panel.classList.add("is-collapsed");
      button.textContent = "Ingrandisci";
      button.setAttribute("aria-expanded", "false");
    }

    const actions = header.querySelector(".filters-row") || header.querySelector(".panel-actions");
    if (actions) {
      actions.appendChild(button);
    } else {
      const wrapper = document.createElement("div");
      wrapper.className = "panel-actions";
      wrapper.appendChild(button);
      header.appendChild(wrapper);
    }
  });
}

function bindEvents() {
  if (el.globalSeasonSelect) {
    el.globalSeasonSelect.addEventListener("change", (event) => applyDisplayedSeason(event.target.value));
  }
  if (el.dashboardSeasonSelect) {
    el.dashboardSeasonSelect.addEventListener("change", (event) => applyDisplayedSeason(event.target.value));
  }
  el.refreshBtn.addEventListener("click", () => fetchAll().catch((error) => showError(error.message)));
  el.openLoginBtn.addEventListener("click", () => el.loginDialog.showModal());
  el.closeLoginBtn.addEventListener("click", () => el.loginDialog.close());
  el.loginForm.addEventListener("submit", handleLogin);
  el.logoutBtn.addEventListener("click", handleLogout);
  el.clubForm.addEventListener("submit", handleClubSubmit);
  el.clubEditSelect.addEventListener("change", updateClubFormFields);
  if (el.clubLogoInput) el.clubLogoInput.addEventListener("change", async () => {
    if (el.clubLogoPreview && el.clubLogoInput.files?.[0]) {
      el.clubLogoPreview.innerHTML = `<img class="club-logo club-logo-lg" src="${escapeHtml(await readFileAsDataUrl(el.clubLogoInput.files[0]))}" alt="Logo" />`;
    }
  });
  if (el.seasonForm) el.seasonForm.addEventListener("submit", handleSeasonSubmit);
  if (el.rolloverForm) el.rolloverForm.addEventListener("submit", handleRolloverSubmit);
  if (el.stadiumForm) el.stadiumForm.addEventListener("submit", handleStadiumSubmit);
  if (el.stadiumClub) el.stadiumClub.addEventListener("change", updateStadiumFormFields);
  if (el.stadiumSeason) el.stadiumSeason.addEventListener("change", updateStadiumFormFields);
  if (el.newsForm) el.newsForm.addEventListener("submit", handleNewsSubmit);
  if (el.newsFormReset) el.newsFormReset.addEventListener("click", resetNewsForm);
  if (el.competitionForm) el.competitionForm.addEventListener("submit", handleCompetitionSubmit);
  if (el.competitionFormReset) el.competitionFormReset.addEventListener("click", resetCompetitionForm);
  if (el.historicalClubForm) el.historicalClubForm.addEventListener("submit", handleHistoricalClubSubmit);
  if (el.historicalClubFormReset) el.historicalClubFormReset.addEventListener("click", resetHistoricalClubForm);
  if (el.clubIdentityForm) el.clubIdentityForm.addEventListener("submit", handleClubIdentitySubmit);
  if (el.clubIdentityFormReset) el.clubIdentityFormReset.addEventListener("click", () => resetClubIdentityForm());
  if (el.clubIdentityClub) el.clubIdentityClub.addEventListener("change", () => {
    const club = getClubById(el.clubIdentityClub.value);
    if (el.clubIdentityNameInput && club && !el.clubIdentityNameInput.value) el.clubIdentityNameInput.value = applyClubSeasonIdentity(club, el.clubIdentitySeason?.value || getSelectedSeasonId())?.name || club.name || "";
    if (el.clubIdentityPresidentSelect || el.clubIdentityPresidentInput) setPresidentControls(el.clubIdentityPresidentSelect, el.clubIdentityPresidentInput, club?.president || "");
    if (el.clubIdentityStadiumInput) el.clubIdentityStadiumInput.value = getMostRecentStadiumName(el.clubIdentityClub.value, el.clubIdentitySeason?.value || getSelectedSeasonId()) || "";
  });
  if (el.clubIdentitySeason) el.clubIdentitySeason.addEventListener("change", () => {
    const identity = getClubSeasonIdentity(el.clubIdentityClub?.value, el.clubIdentitySeason.value);
    if (identity) {
      el.clubIdentityId.value = identity.id;
      el.clubIdentityNameInput.value = identity.display_name || "";
      setPresidentControls(el.clubIdentityPresidentSelect, el.clubIdentityPresidentInput, identity.president || "");
    }
    if (el.clubIdentityStadiumInput) el.clubIdentityStadiumInput.value = identity?.stadium_name || getMostRecentStadiumName(el.clubIdentityClub?.value, el.clubIdentitySeason.value) || "";
  });
  if (el.standingForm) el.standingForm.addEventListener("submit", handleStandingSubmit);
  if (el.standingFormReset) el.standingFormReset.addEventListener("click", resetStandingForm);
  if (el.calendarForm) el.calendarForm.addEventListener("submit", handleCalendarSubmit);
  if (el.calendarFormReset) el.calendarFormReset.addEventListener("click", resetCalendarForm);
  if (el.honorForm) el.honorForm.addEventListener("submit", handleHonorSubmit);
  if (el.honorFormReset) el.honorFormReset.addEventListener("click", resetHonorForm);
  if (el.dumpForm) el.dumpForm.addEventListener("submit", handleDumpSubmit);
  [
    [el.newsAdminSearch, "news"],
    [el.competitionAdminSearch, "competitions"],
    [el.standingAdminSearch, "standings"],
    [el.calendarAdminSearch, "calendar"],
    [el.honorAdminSearch, "honor"],
    [el.historicalClubAdminSearch, "historicalClubs"],
    [el.clubIdentityAdminSearch, "clubIdentities"],
  ].forEach(([node, key]) => {
    if (node) node.addEventListener("input", () => {
      state.adminSearch[key] = node.value;
      renderAdminLists();
    });
  });

  [el.competitionSeason, el.standingCompetition, el.calendarCompetition, el.honorSeason, el.clubIdentitySeason].forEach((node) => {
    if (node) node.addEventListener("change", () => {
      updateCalendarMatchdaySuggestions();
      if (node === el.calendarCompetition) updateCalendarClubOptions();
      renderAdminLists();
    });
  });

  [el.calendarHomeClub, el.calendarAwayClub].forEach((node) => {
    if (node) node.addEventListener("change", updateCalendarManualWinnerOptions);
  });

  [el.newsAdminList, el.competitionAdminList, el.standingAdminList, el.calendarAdminList, el.honorAdminList, el.historicalClubAdminList, el.clubIdentityAdminList].forEach((node) => {
    if (node) node.addEventListener("click", handleAdminListClick);
  });
  el.listoneUploadForm.addEventListener("submit", handleListoneUpload);
  if (el.rosterUploadForm) el.rosterUploadForm.addEventListener("submit", handleRosterUpload);
  el.listoneSeasonFilter.addEventListener("change", (event) => {
    applyDisplayedSeason(event.target.value);
  });
  el.auctionSeason.addEventListener("change", () => {
    renderAuctionPlayerOptions();
    updateAuctionFieldsFromSelectedPlayer();
  });
  el.auctionPlayerSelect.addEventListener("change", updateAuctionFieldsFromSelectedPlayer);
  el.auctionForm.addEventListener("submit", handleAuctionSubmit);
  el.movementForm.addEventListener("submit", handleMovementSubmit);
  el.movementType.addEventListener("change", updateMovementSignHint);
  el.movementAmount.addEventListener("input", updateMovementSignHint);
  el.clubSearch.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderClubs();
  });
  if (el.rosterSeasonFilter) {
    el.rosterSeasonFilter.addEventListener("change", (event) => {
      applyDisplayedSeason(event.target.value);
    });
  }
  el.rosterSearch.addEventListener("input", (event) => {
    state.rosterSearch = event.target.value;
    renderRoster();
  });
  el.rosterClubFilter.addEventListener("change", (event) => {
    state.rosterClubFilter = event.target.value;
    renderRosterClubCards();
    renderRoster();
  });
  if (el.rosterClubCards) {
    el.rosterClubCards.addEventListener("click", (event) => {
      const button = event.target.closest("[data-roster-club-id]");
      if (!button) return;
      showRosterDialog(button.dataset.rosterClubId);
    });
  }
  if (el.clubsTableBody) {
    el.clubsTableBody.addEventListener("click", (event) => {
      const button = event.target.closest("[data-roster-club-id]");
      if (!button) return;
      showRosterDialog(button.dataset.rosterClubId);
    });
  }
  [el.dashboardStandings, el.dashboardCalendar, el.competitionsList, el.honorSummary, el.honorHistory, el.stadiumsList, el.movementsList, el.marketActivityTableBody].forEach((node) => {
    if (!node) return;
    node.addEventListener("click", (event) => {
      const rosterButton = event.target.closest("[data-roster-club-id]");
      if (rosterButton) return showRosterDialog(rosterButton.dataset.rosterClubId);
      const presidentButtonEl = event.target.closest("[data-honor-president-key]");
      if (presidentButtonEl) return showHonorPresidentDialog(presidentButtonEl.dataset.honorPresidentKey);
      const honorButton = event.target.closest("[data-honor-club-id]");
      if (honorButton) return showHonorClubDialog(honorButton.dataset.honorClubId);
      const player = event.target.closest("[data-player-id]");
      if (player) return showPlayerDialog(player.dataset.playerId);
    });
  });
  if (el.rosterTableBody) {
    el.rosterTableBody.addEventListener("click", (event) => {
      const playerButtonEl = event.target.closest("[data-player-id]");
      if (playerButtonEl) {
        showPlayerDialog(playerButtonEl.dataset.playerId);
        return;
      }
      const button = event.target.closest("[data-roster-club-id]");
      if (!button) return;
      showRosterDialog(button.dataset.rosterClubId);
    });
  }
  el.listoneSearch.addEventListener("input", (event) => {
    state.listoneSearch = event.target.value;
    renderListone();
  });
  [el.listoneTableBody?.closest("table"), el.freeAgentsTableBody?.closest("table")].forEach((table) => {
    if (!table) return;
    table.addEventListener("click", (event) => {
      const button = event.target.closest("[data-sort-table][data-sort-key]");
      if (!button) return;
      const tableName = button.dataset.sortTable;
      const key = button.dataset.sortKey;
      const target = tableName === "freeAgents" ? state.freeAgentsSort : state.listoneSort;
      target.direction = target.key === key && target.direction === "asc" ? "desc" : "asc";
      target.key = key;
      renderListone();
    });
  });
  if (el.marketSearch) {
    el.marketSearch.addEventListener("input", (event) => {
      state.marketSearch = event.target.value;
      renderMarketActivity();
    });
  }
  if (el.marketClubFilter) {
    el.marketClubFilter.addEventListener("change", (event) => {
      state.marketClubFilter = event.target.value;
      renderMarketActivity();
    });
  }
  el.listoneRoleFilter.addEventListener("change", (event) => {
    state.listoneRoleFilter = event.target.value;
    renderListone();
  });
  el.listoneTableBody.addEventListener("click", (event) => {
    const rosterButton = event.target.closest("[data-roster-club-id]");
    if (rosterButton) {
      showRosterDialog(rosterButton.dataset.rosterClubId);
      return;
    }
    const button = event.target.closest("[data-player-id]");
    if (!button) return;
    showPlayerDialog(button.dataset.playerId);
  });
  if (el.freeAgentsTableBody) {
    el.freeAgentsTableBody.addEventListener("click", (event) => {
      const button = event.target.closest("[data-player-id]");
      if (!button) return;
      showPlayerDialog(button.dataset.playerId);
    });
  }
  el.closePlayerBtn.addEventListener("click", () => el.playerDialog.close());
  if (el.rosterDialogBody) {
    el.rosterDialogBody.addEventListener("click", (event) => {
      const rosterButton = event.target.closest("[data-roster-club-id]");
      if (rosterButton) return showRosterDialog(rosterButton.dataset.rosterClubId);
      const honorContextClose = event.target.closest("[data-honor-context-close]");
      if (honorContextClose) {
        const target = document.getElementById("honorContextDetail");
        if (target) target.innerHTML = `<p class="muted">Clicca su “Apri stagione” per vedere la classifica della Regular Season o le partite della squadra nelle coppe.</p>`;
        return;
      }
      const honorContextButton = event.target.closest("[data-honor-context-season]");
      if (honorContextButton) return renderHonorContextDetail({
        seasonId: honorContextButton.dataset.honorContextSeason,
        competitionType: honorContextButton.dataset.honorContextType,
        competitionName: honorContextButton.dataset.honorContextName,
        honorClubId: honorContextButton.dataset.honorContextClub,
        clubId: honorContextButton.dataset.honorContextClubId || null,
      });
      const presidentButtonEl = event.target.closest("[data-honor-president-key]");
      if (presidentButtonEl) return showHonorPresidentDialog(presidentButtonEl.dataset.honorPresidentKey);
      const honorButton = event.target.closest("[data-honor-club-id]");
      if (honorButton) return showHonorClubDialog(honorButton.dataset.honorClubId);
      const playerButtonEl = event.target.closest("[data-player-id]");
      if (playerButtonEl) return showPlayerDialog(playerButtonEl.dataset.playerId);
    });
  }
  if (el.playerDialogBody) {
    el.playerDialogBody.addEventListener("click", (event) => {
      const fantacalcioButton = event.target.closest("[data-fantacalcio-player-id]");
      if (fantacalcioButton) return openFantacalcioDialog(fantacalcioButton.dataset.fantacalcioPlayerId);
      const rosterButton = event.target.closest("[data-roster-club-id]");
      if (rosterButton) return showRosterDialog(rosterButton.dataset.rosterClubId);
    });
  }
  if (el.closeFantacalcioBtn) {
    el.closeFantacalcioBtn.addEventListener("click", () => {
      el.fantacalcioDialog.close();
      if (el.fantacalcioFrame) el.fantacalcioFrame.src = "about:blank";
    });
  }
  if (el.fantacalcioDialog) {
    el.fantacalcioDialog.addEventListener("close", () => {
      if (el.fantacalcioFrame) el.fantacalcioFrame.src = "about:blank";
    });
  }
  if (el.closeRosterBtn) el.closeRosterBtn.addEventListener("click", () => el.rosterDialog.close());
}

async function init() {
  setupMobileViewportClass();
  setupCollapsiblePanels();
  setupMobileNavigation();
  setupMobilePageSubnav();
  setupResponsiveTableObserver();
  bindEvents();
  updateMovementSignHint();
  el.auctionDate.value = todayIso();

  if (!isConfigured()) {
    setupPageNavigation();
    el.configWarning.classList.remove("hidden");
    el.clubsTableBody.innerHTML = `<tr><td colspan="7" class="muted center">Configura Supabase per caricare i dati.</td></tr>`;
    el.rosterTableBody.innerHTML = `<tr><td colspan="8" class="muted center">Configura Supabase per caricare i dati.</td></tr>`;
    el.listoneTableBody.innerHTML = `<tr><td colspan="8" class="muted center">Configura Supabase per caricare i dati.</td></tr>`;
    el.movementsList.innerHTML = `<p class="muted">Configura Supabase per caricare i dati.</p>`;
    el.stadiumsList.innerHTML = `<p class="muted">Configura Supabase per caricare i dati.</p>`;
    return;
  }

  state.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    await loadAuthState();
    await fetchAll();
    setupPageNavigation();
  } catch (error) {
    showError(error.message || "Errore durante il caricamento dei dati.");
  }
}

init();
