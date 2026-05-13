import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// =========================================================
// 1) CONFIGURA QUI SUPABASE
// =========================================================
// Esempio:
// const SUPABASE_URL = "https://xxxxxxxxxxxxxxxxxxxx.supabase.co";
// const SUPABASE_ANON_KEY = "eyJhbGciOi...";
const SUPABASE_URL = "https://qbngcitvlhydrypxelix.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFibmdjaXR2bGh5ZHJ5cHhlbGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1ODY0NjEsImV4cCI6MjA5NDE2MjQ2MX0.B-_9H2Pv0i_CHcD9p-1ZmnVxKVy44jVKd6S01PfU6tM";


const ACTIVE_SEASON_ID = "2026-2027";

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
};

const MATCH_STATUS_LABELS = {
  SCHEDULED: "Da giocare",
  PLAYED: "Giocata",
  POSTPONED: "Rinviata",
};

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
  latestQuotations: [],
  allLatestQuotations: [],
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
  newsAdminList: document.getElementById("newsAdminList"),
  competitionForm: document.getElementById("competitionForm"),
  competitionId: document.getElementById("competitionId"),
  competitionSeason: document.getElementById("competitionSeason"),
  competitionName: document.getElementById("competitionName"),
  competitionType: document.getElementById("competitionType"),
  competitionStatus: document.getElementById("competitionStatus"),
  competitionFormReset: document.getElementById("competitionFormReset"),
  competitionFormStatus: document.getElementById("competitionFormStatus"),
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
  standingFormReset: document.getElementById("standingFormReset"),
  standingFormStatus: document.getElementById("standingFormStatus"),
  standingAdminList: document.getElementById("standingAdminList"),
  calendarForm: document.getElementById("calendarForm"),
  calendarMatchId: document.getElementById("calendarMatchId"),
  calendarCompetition: document.getElementById("calendarCompetition"),
  calendarMatchday: document.getElementById("calendarMatchday"),
  calendarDate: document.getElementById("calendarDate"),
  calendarHomeClub: document.getElementById("calendarHomeClub"),
  calendarAwayClub: document.getElementById("calendarAwayClub"),
  calendarHomeScore: document.getElementById("calendarHomeScore"),
  calendarAwayScore: document.getElementById("calendarAwayScore"),
  calendarStatus: document.getElementById("calendarStatus"),
  calendarFormReset: document.getElementById("calendarFormReset"),
  calendarFormStatus: document.getElementById("calendarFormStatus"),
  calendarAdminList: document.getElementById("calendarAdminList"),
  honorForm: document.getElementById("honorForm"),
  honorId: document.getElementById("honorId"),
  honorSeason: document.getElementById("honorSeason"),
  honorClub: document.getElementById("honorClub"),
  honorClubNameInput: document.getElementById("honorClubNameInput"),
  honorPresidentInput: document.getElementById("honorPresidentInput"),
  honorClubLogoInput: document.getElementById("honorClubLogoInput"),
  honorCompetitionType: document.getElementById("honorCompetitionType"),
  honorTitleInput: document.getElementById("honorTitleInput"),
  honorPlacement: document.getElementById("honorPlacement"),
  honorPoints: document.getElementById("honorPoints"),
  honorNotes: document.getElementById("honorNotes"),
  honorFormReset: document.getElementById("honorFormReset"),
  honorFormStatus: document.getElementById("honorFormStatus"),
  honorAdminList: document.getElementById("honorAdminList"),
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

function getPlayerKeyFromName(name) {
  return normalizeTextKey(name);
}

function getQuotationKey(quote) {
  return quote?.player_key || getPlayerKeyFromName(quote?.player_name || quote?.name || "");
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

function getUploadById(uploadId) {
  return state.listoneUploads.find((upload) => upload.id === uploadId);
}

function getUploadLabel(upload) {
  if (!upload) return "-";
  return upload.label || upload.file_name || fmtDate(upload.created_at);
}

function roleClassFromClassicRole(role) {
  return String(role || "").toUpperCase() === "P" ? "P" : "MOVIMENTO";
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
  if (["P", "D", "C", "A"].includes(value)) return value;
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

function getCurrentClubs() {
  return state.clubs.filter((club) => club.active !== false);
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
  const linkedCurrent = honorClub.source_club_id ? getClubById(honorClub.source_club_id) : null;
  if (linkedCurrent) return clubButton(linkedCurrent, extraClass);
  return `<button class="link-button club-link ${extraClass}" type="button" data-honor-club-id="${escapeHtml(honorClub.id)}">${clubNameWithLogo(honorClub)}</button>`;
}

function getPalmaresForClubIds(clubId, honorClubId) {
  const currentHonor = state.honorClubs.find((club) => club.source_club_id === clubId);
  const ids = new Set([honorClubId, currentHonor?.id].filter(Boolean));
  return state.honorRoll.filter((entry) => entry.club_id === clubId || (entry.honor_club_id && ids.has(entry.honor_club_id)));
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
    const player = getPlayerById(entry.player_id);
    if (player?.role_class === "P") goalkeepers += 1;
    if (player?.role_class === "MOVIMENTO") outfieldPlayers += 1;
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

function clubButton(club, extraClass = "") {
  if (!club) return "-";
  return `<button class="link-button club-link ${extraClass}" type="button" data-roster-club-id="${escapeHtml(club.id)}">${clubNameWithLogo(club)}</button>`;
}

function playerButton(playerId, label) {
  if (!playerId) return escapeHtml(label || "-");
  return `<button class="link-button" type="button" data-player-id="${escapeHtml(playerId)}">${escapeHtml(label || "Giocatore")}</button>`;
}

function renderCupPodium(competition) {
  const rows = buildHonorRows()
    .filter((row) => row.season_id === competition.season_id && row.competition_type === competition.competition_type && Number(row.placement || 0) <= 3)
    .sort((a, b) => Number(a.placement || 999) - Number(b.placement || 999));

  if (!rows.length) return `<p class="muted">Podio non ancora inserito nell'Albo d'oro.</p>`;

  return `<div class="stack-list podium-list">
    ${rows.map((row) => `<div class="stack-item">
      <div><strong>${renderHonorClubName(row)}</strong><small>${escapeHtml(row.competition_name || competition.name)}${row.notes ? ` · ${escapeHtml(row.notes)}` : ""}</small></div>
      <div class="stack-item-side"><strong>${row.placement}°</strong></div>
    </div>`).join("")}
  </div>`;
}

function renderStandingTable(competition, limit = null) {
  if (competition?.competition_type && competition.competition_type !== "REGULAR_SEASON") {
    return renderCupPodium(competition);
  }

  const rows = state.competitionStandings
    .filter((row) => row.competition_id === competition.id)
    .sort((a, b) => Number(a.position || 999) - Number(b.position || 999) || Number(b.points || 0) - Number(a.points || 0));

  if (!rows.length) return `<p class="muted">Nessuna classifica inserita.</p>`;

  return `
    <div class="table-wrap compact-table">
      <table>
        <thead>
          <tr><th>#</th><th>Club</th><th class="number">Pt</th><th class="number">FP</th><th class="number">GF</th><th class="number">GS</th></tr>
        </thead>
        <tbody>
          ${rows.slice(0, limit || rows.length).map((row, index) => {
            const club = getClubById(row.club_id);
            return `<tr>
              <td>${row.position || index + 1}</td>
              <td>${clubButton(club)}</td>
              <td class="number">${row.points ?? "-"}</td>
              <td class="number">${row.fantapoints ?? "-"}</td>
              <td class="number">${row.goals_for ?? "-"}</td>
              <td class="number">${row.goals_against ?? "-"}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderMatchList(matches) {
  if (!matches.length) return `<p class="muted">Nessuna giornata inserita.</p>`;
  return matches
    .map((match) => {
      const competition = getCompetitionById(match.competition_id);
      const home = getClubById(match.home_club_id);
      const away = getClubById(match.away_club_id);
      const score = match.home_score !== null && match.home_score !== undefined && match.away_score !== null && match.away_score !== undefined
        ? `<strong>${match.home_score} - ${match.away_score}</strong>`
        : `<span class="muted">${MATCH_STATUS_LABELS[match.status] || match.status || "Da giocare"}</span>`;
      return `<div class="stack-item">
        <div>
          <strong>${escapeHtml(match.matchday_label || "Giornata")}</strong>
          <span>${escapeHtml(competition?.name || "Competizione")}${match.played_on ? ` · ${fmtDateOnly(match.played_on)}` : ""}</span>
          <small>${clubButton(home)} vs ${clubButton(away)}</small>
        </div>
        <div class="stack-item-side">${score}</div>
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

  const [
    seasons,
    clubs,
    movements,
    players,
    rosterEntries,
    stadiums,
    stadiumLevels,
    playerQuotations,
    latestPlayerQuotations,
    listoneUploads,
    rosterImports,
    news,
    competitions,
    competitionStandings,
    calendarMatches,
    honorRoll,
    honorClubs,
  ] = await Promise.all([
    fetchAllRows(() => state.supabase.from("seasons").select("*").order("starts_on", { ascending: false })),
    fetchAllRows(() => state.supabase.from("clubs").select("*").order("name", { ascending: true })),
    fetchAllRows(() => state.supabase.from("fm_movements").select("*").order("created_at", { ascending: false })),
    fetchAllRows(() => state.supabase.from("players").select("*").order("name", { ascending: true })),
    fetchAllRows(() =>
      state.supabase
        .from("roster_entries")
        .select(`
          *,
          players(*),
          club:clubs!roster_entries_club_id_fkey(id, name, president, active),
          loan_from_club:clubs!roster_entries_loan_from_club_id_fkey(id, name, president, active)
        `)
        .order("created_at", { ascending: false })
    ),
    fetchAllRows(() => state.supabase.from("stadiums").select("*")),
    fetchAllRows(() => state.supabase.from("stadium_levels").select("*").order("level", { ascending: true })),
    fetchAllRows(() => state.supabase.from("player_quotations_history").select("*").order("upload_created_at", { ascending: false })),
    fetchAllRows(() => state.supabase.from("latest_player_quotations").select("*").order("player_name", { ascending: true })),
    fetchAllRows(() => state.supabase.from("listone_uploads").select("*").order("created_at", { ascending: false })),
    fetchAllRows(() => state.supabase.from("roster_imports").select("*").order("created_at", { ascending: false })).catch((error) => {
      if (error?.code === "42P01") return [];
      throw error;
    }),
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
    fetchAllRows(() => state.supabase.from("calendar_matches").select("*").order("played_on", { ascending: true, nullsFirst: false })).catch((error) => {
      if (error?.code === "42P01") return [];
      throw error;
    }),
    fetchAllRows(() => state.supabase.from("honor_roll_entries").select("*").order("season_id", { ascending: false })).catch((error) => {
      if (error?.code === "42P01") return [];
      throw error;
    }),
    fetchAllRows(() => state.supabase.from("honor_clubs").select("*").order("name", { ascending: true })).catch((error) => {
      if (error?.code === "42P01") return [];
      throw error;
    }),
  ]);

  state.seasons = seasons || [];
  state.clubs = clubs || [];
  state.movements = movements || [];
  state.players = players || [];
  state.rosterEntries = rosterEntries || [];
  state.stadiums = stadiums || [];
  state.stadiumLevels = stadiumLevels || [];
  state.playerQuotations = playerQuotations || [];
  state.allLatestQuotations = latestPlayerQuotations || [];
  state.listoneUploads = listoneUploads || [];
  state.rosterImports = rosterImports || [];
  state.news = news || [];
  state.competitions = competitions || [];
  state.competitionStandings = competitionStandings || [];
  state.calendarMatches = calendarMatches || [];
  state.honorRoll = honorRoll || [];
  state.honorClubs = honorClubs || [];

  if (!state.seasons.some((season) => season.id === state.selectedSeason)) {
    state.selectedSeason = state.seasons.find((season) => season.id === ACTIVE_SEASON_ID)?.id || state.seasons[0]?.id || ACTIVE_SEASON_ID;
  }
  if (!state.seasons.some((season) => season.id === state.selectedListoneSeason)) {
    state.selectedListoneSeason = state.selectedSeason;
  }
  if (!state.seasons.some((season) => season.id === state.selectedRosterSeason)) {
    state.selectedRosterSeason = state.selectedSeason;
  }
  state.latestQuotations = getLatestQuotationsForSeason(state.selectedListoneSeason);

  renderAll();
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

  if (render) renderAll();
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
  if (!options.skipRender) renderAll();
}

function renderMetrics() {
  const currentClubs = getCurrentClubs();
  const clubCount = currentClubs.length;
  const seasonId = getSelectedSeasonId();
  const balances = currentClubs.map((club) => getClubBalance(club.id, seasonId));
  const total = balances.reduce((sum, value) => sum + value, 0);
  const average = clubCount ? total / clubCount : 0;
  const negativeBalances = balances.filter((value) => value < 0).length;
  const rosterIssues = currentClubs.filter((club) => getRosterStats(club.id, seasonId).issues.length > 0).length;
  const alerts = negativeBalances + rosterIssues;

  el.metricClubs.textContent = String(clubCount);
  el.metricTotalFm.textContent = fmtFm(total);
  el.metricAvgFm.textContent = fmtFm(average);
  el.metricAlerts.textContent = String(alerts);
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
          <td>${escapeHtml(club.president)}</td>
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
    el.rosterTableBody.innerHTML = `<tr><td colspan="8" class="muted center">Nessun giocatore in rosa per la stagione ${escapeHtml(selectedSeason)}.${hint}</td></tr>`;
    return;
  }

  el.rosterTableBody.innerHTML = rows
    .map(({ entry, player, club }) => {
      const latestQuote = player ? getLatestQuoteByPlayerIdForSeason(player.id, entry.season_id || ACTIVE_SEASON_ID) : null;
      const status = entry.is_active ? (latestQuote?.is_listed === false || player?.is_asterisked ? "Asteriscato" : "Attivo") : "Non attivo";
      const roleLabel = player?.role_class === "P" ? "Portiere" : "Movimento";
      return `
        <tr>
          <td>${playerButton(player?.id || entry.player_id, player?.name || "Giocatore non trovato")}</td>
          <td><button class="link-button" type="button" data-roster-club-id="${escapeHtml(club?.id || entry.club_id)}">${escapeHtml(club?.name || entry.club_id)}</button></td>
          <td>${escapeHtml(latestQuote?.real_team || player?.real_team || "-")}</td>
          <td>${escapeHtml(latestQuote?.mantra_roles || player?.mantra_roles || "-")}</td>
          <td>${roleLabel}</td>
          <td class="number">${fmtFm(entry.purchase_price)}</td>
          <td>${escapeHtml(ACQUIRED_LABELS[entry.acquired_via] || entry.acquired_via)}</td>
          <td><span class="status ${status === "Asteriscato" ? "status-warning" : entry.is_active ? "status-ok" : "status-muted"}">${status}</span></td>
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
        <span class="roster-card-title">${escapeHtml(club.name)}</span>
        <span class="muted small">${escapeHtml(club.president || "-")}</span>
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
  const palmares = getPalmaresForClubIds(clubId, honorClubId)
    .sort((a, b) => String(b.season_id).localeCompare(String(a.season_id)) || Number(a.placement || 999) - Number(b.placement || 999));

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

  const palmaresRows = palmares.map((entry) => `<tr>
    <td>${escapeHtml(entry.season_id || "-")}</td>
    <td>${escapeHtml(COMPETITION_LABELS[entry.competition_type] || entry.competition_type || "-")}</td>
    <td>${escapeHtml(entry.title || "-")}</td>
    <td class="number">${entry.placement ? `${entry.placement}°` : "-"}</td>
    <td class="number">${entry.points ?? "-"}</td>
  </tr>`).join("");

  return `
    <section class="detail-section">
      <h3>Palmarès e piazzamenti storici</h3>
      <div class="table-wrap compact-table"><table><thead><tr><th>Stagione</th><th>Competizione</th><th>Voce</th><th class="number">Pos.</th><th class="number">Pt</th></tr></thead><tbody>${palmaresRows || '<tr><td colspan="5" class="muted center">Nessuna voce storica.</td></tr>'}</tbody></table></div>
    </section>
    ${clubId ? `<section class="detail-section"><h3>Movimenti FM</h3><div class="table-wrap compact-table"><table><thead><tr><th>Stagione</th><th>Tipo</th><th>Descrizione</th><th class="number">Importo</th></tr></thead><tbody>${movementRows || '<tr><td colspan="4" class="muted center">Nessun movimento registrato.</td></tr>'}</tbody></table></div></section>` : ""}
    ${clubId ? `<section class="detail-section"><h3>Svincoli effettuati</h3><div class="table-wrap compact-table"><table><thead><tr><th>Stagione</th><th>Descrizione</th><th class="number">Rimborso</th><th>Data</th></tr></thead><tbody>${releaseRows || '<tr><td colspan="4" class="muted center">Nessuno svincolo registrato.</td></tr>'}</tbody></table></div></section>` : ""}
  `;
}

function showHonorClubDialog(honorClubId) {
  const honorClub = getHonorClubById(honorClubId);
  if (!honorClub) return;
  const current = honorClub.source_club_id ? getClubById(honorClub.source_club_id) : null;
  if (current) return showRosterDialog(current.id);
  el.rosterDialogTitle.textContent = `${honorClub.name} · storico`;
  el.rosterDialogBody.innerHTML = `
    <div class="player-summary-grid roster-summary-grid">
      <div><span>Squadra</span><strong>${escapeHtml(honorClub.name)}</strong></div>
      <div><span>Presidente</span><strong>${escapeHtml(honorClub.president || "-")}</strong></div>
      <div><span>Stato</span><strong>Storica</strong></div>
    </div>
    ${renderClubExtraSections({ clubId: null, honorClubId })}
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
        <td>${playerButton(player?.id || entry.player_id, player?.name || "Giocatore non trovato")}</td>
        <td>${escapeHtml(quote?.classic_role || player?.classic_role || player?.role_class || "-")}</td>
        <td>${escapeHtml(quote?.real_team || player?.real_team || entry.source_real_team || "-")}</td>
        <td>${escapeHtml(quote?.mantra_roles || player?.mantra_roles || "-")}</td>
        <td class="number">${fmtFm(entry.purchase_price)}</td>
        <td><span class="status ${status === "Asteriscato" ? "status-warning" : entry.is_active ? "status-ok" : "status-muted"}">${status}</span></td>
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
    <div class="table-wrap compact-table roster-dialog-table">
      <table>
        <thead>
          <tr><th>Giocatore</th><th>R</th><th>Squadra</th><th>Ruoli</th><th class="number">Costo</th><th>Stato</th></tr>
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
    return `<span class="status status-muted">Svincolato</span>`;
  }
  return clubButton(club);
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
          <td>${playerButton(quote.player_id, quote.player_name)}<br><span class="muted small">ID ${escapeHtml(quote.fantacalcio_id)} · key ${escapeHtml(getQuotationKey(quote))}</span></td>
          <td>${escapeHtml(quote.real_team || "-")}</td>
          <td>${escapeHtml(quote.mantra_roles || "-")}</td>
          <td>${escapeHtml(quote.classic_role || "-")}</td>
          <td>${renderRosterCellForPlayer(quote.player_id, state.selectedListoneSeason)}</td>
          <td class="number">${quote.quotation_current ?? "-"}</td>
          <td class="number">${quote.fvm ?? "-"}</td>
          <td><span class="status ${statusClass}">${quoteStatusLabel(quote)}</span></td>
          <td><button class="link-button" type="button" data-player-id="${escapeHtml(quote.player_id)}">Scheda</button></td>
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
    el.freeAgentsTableBody.innerHTML = `<tr><td colspan="8" class="muted center">Nessun listone caricato per questa stagione.</td></tr>`;
    return;
  }

  if (!rows.length) {
    el.freeAgentsTableBody.innerHTML = `<tr><td colspan="8" class="muted center">Nessun giocatore svincolato trovato con i filtri attuali.</td></tr>`;
    return;
  }

  el.freeAgentsTableBody.innerHTML = rows
    .map((quote) => `
      <tr>
        <td>${playerButton(quote.player_id, quote.player_name)}<br><span class="muted small">key ${escapeHtml(getQuotationKey(quote))}</span></td>
        <td>${escapeHtml(quote.real_team || "-")}</td>
        <td>${escapeHtml(quote.mantra_roles || "-")}</td>
        <td>${escapeHtml(quote.classic_role || "-")}</td>
        <td class="number">${quote.quotation_current ?? "-"}</td>
        <td class="number">${quote.fvm ?? "-"}</td>
        <td><span class="status status-muted">Svincolato</span></td>
        <td><button class="link-button" type="button" data-player-id="${escapeHtml(quote.player_id)}">Scheda</button></td>
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


function renderCompetitionContent(competition) {
  const matches = state.calendarMatches
    .filter((match) => match.competition_id === competition.id)
    .sort((a, b) => String(a.matchday_label || "").localeCompare(String(b.matchday_label || "")) || String(a.played_on || "").localeCompare(String(b.played_on || "")));

  if (competition.competition_type === "REGULAR_SEASON") {
    return `<h4>Classifica</h4>${renderStandingTable(competition)}<h4>Calendario</h4>${renderMatchList(matches)}`;
  }
  return `<h4>Podio albo d'oro</h4>${renderCupPodium(competition)}<h4>Partite</h4>${renderMatchList(matches)}`;
}

function renderDashboardCompetitions() {
  const seasonId = getSelectedSeasonId();
  const competitions = state.competitions.filter((competition) => competition.season_id === seasonId);
  if (!el.dashboardStandings) return;
  if (!competitions.length) {
    el.dashboardStandings.innerHTML = `<p class="muted">Nessuna competizione inserita per la stagione ${escapeHtml(seasonId)}.</p>`;
  } else {
    el.dashboardStandings.innerHTML = competitions
      .map((competition) => `
        <div class="competition-card compact-card">
          <div class="competition-card-header">
            <div>
              <strong>${escapeHtml(competition.name)}</strong>
              <span>${escapeHtml(COMPETITION_LABELS[competition.competition_type] || competition.competition_type || "Competizione")}</span>
            </div>
            <span class="status status-muted">${escapeHtml(COMPETITION_STATUS_LABELS[competition.status] || competition.status || "-")}</span>
          </div>
          ${renderStandingTable(competition)}
        </div>
      `)
      .join("");
  }

  if (!el.dashboardCalendar) return;
  const { previous, current } = getCurrentAndPreviousMatches(seasonId);
  el.dashboardCalendar.innerHTML = `
    <div class="stack-section">
      <h3>Giornata corrente / prossima</h3>
      ${renderMatchList(current)}
    </div>
    <div class="stack-section">
      <h3>Giornata precedente</h3>
      ${renderMatchList(previous)}
    </div>
  `;
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
  const competitions = state.competitions.filter((competition) => competition.season_id === seasonId);
  if (!competitions.length) {
    el.competitionsList.innerHTML = `<p class="muted">Nessuna competizione inserita per la stagione ${escapeHtml(seasonId)}.</p>`;
    return;
  }
  el.competitionsList.innerHTML = competitions
    .map((competition) => {
      const matches = state.calendarMatches
        .filter((match) => match.competition_id === competition.id)
        .sort((a, b) => String(a.matchday_label || "").localeCompare(String(b.matchday_label || "")) || String(a.played_on || "").localeCompare(String(b.played_on || "")));
      return `
        <article class="competition-card">
          <div class="competition-card-header">
            <div>
              <h3>${escapeHtml(competition.name)}</h3>
              <span>${escapeHtml(COMPETITION_LABELS[competition.competition_type] || competition.competition_type || "Competizione")}</span>
            </div>
            <span class="status ${competition.status === "ACTIVE" ? "status-ok" : "status-muted"}">${escapeHtml(COMPETITION_STATUS_LABELS[competition.status] || competition.status || "-")}</span>
          </div>
          ${renderCompetitionContent(competition)}
        </article>
      `;
    })
    .join("");
}

function buildHonorRows() {
  const rows = [];

  for (const entry of state.honorRoll) {
    const honorClub = getHonorClubForEntry(entry);
    rows.push({
      source: "manual",
      id: `honor-${entry.id}`,
      season_id: entry.season_id,
      club_id: entry.club_id || honorClub?.source_club_id || null,
      honor_club_id: entry.honor_club_id || honorClub?.id || null,
      club_name: honorClub?.name || getClubById(entry.club_id)?.name || "-",
      president: honorClub?.president || getClubById(entry.club_id)?.president || "-",
      competition_type: entry.competition_type || "ALTRO",
      competition_name: COMPETITION_LABELS[entry.competition_type] || entry.competition_type || entry.title || "Competizione",
      placement: entry.placement,
      points: entry.points,
      notes: [entry.title, entry.notes].filter(Boolean).join(" · "),
    });
  }

  for (const standing of state.competitionStandings) {
    const competition = getCompetitionById(standing.competition_id);
    if (!competition || competition.competition_type !== "REGULAR_SEASON") continue;
    const club = getClubById(standing.club_id);
    rows.push({
      source: "standing",
      id: `standing-${standing.id}`,
      season_id: competition.season_id,
      club_id: standing.club_id,
      honor_club_id: state.honorClubs.find((item) => item.source_club_id === standing.club_id)?.id || null,
      club_name: club?.name || standing.club_id || "-",
      president: club?.president || "-",
      competition_type: competition.competition_type || "ALTRO",
      competition_name: competition.name || COMPETITION_LABELS[competition.competition_type] || "Competizione",
      placement: standing.position,
      points: standing.points,
      notes: standing.notes,
      fantapoints: standing.fantapoints,
    });
  }

  return rows.sort((a, b) => String(b.season_id).localeCompare(String(a.season_id)) || Number(a.placement || 999) - Number(b.placement || 999));
}

function renderHonorClubName(row) {
  const current = row.club_id ? getClubById(row.club_id) : null;
  const honor = row.honor_club_id ? getHonorClubById(row.honor_club_id) : null;
  if (current) return clubButton(current);
  if (honor) return honorClubButton(honor);
  return escapeHtml(row.club_name || "-");
}

function renderHonorRoll() {
  if (!el.honorSummary || !el.honorHistory) return;
  const honorRows = buildHonorRows();
  if (!honorRows.length) {
    el.honorSummary.innerHTML = `<p class="muted">Nessuna voce inserita.</p>`;
    el.honorHistory.innerHTML = `<p class="muted">Nessuna classifica storica inserita.</p>`;
    return;
  }

  const winsByClub = new Map();
  for (const row of honorRows.filter((item) => Number(item.placement || 0) === 1)) {
    const key = row.honor_club_id || row.club_id || row.club_name;
    if (!key) continue;
    const current = winsByClub.get(key) || {
      key,
      club_id: row.club_id,
      honor_club_id: row.honor_club_id,
      club_name: row.club_name,
      president: row.president,
      counts: {},
      total: 0,
    };
    current.counts[row.competition_type] = (current.counts[row.competition_type] || 0) + 1;
    current.total += 1;
    winsByClub.set(key, current);
  }

  const summaryRows = Array.from(winsByClub.values()).sort((a, b) => b.total - a.total || String(a.club_name).localeCompare(String(b.club_name)));
  el.honorSummary.innerHTML = summaryRows.length
    ? summaryRows.map((row) => {
      const current = row.club_id ? getClubById(row.club_id) : null;
      const honor = row.honor_club_id ? getHonorClubById(row.honor_club_id) : null;
      const name = current ? clubButton(current) : honor ? honorClubButton(honor) : escapeHtml(row.club_name || "-");
      const details = Object.entries(row.counts)
        .filter(([, count]) => count > 0)
        .map(([type, count]) => `${COMPETITION_LABELS[type] || type}: ${count}`)
        .join(" · ");
      return `<div class="stack-item">
        <div><strong>${name}</strong><small>${escapeHtml(row.president || "")} ${details ? `· ${escapeHtml(details)}` : ""}</small></div>
        <div class="stack-item-side"><strong>${row.total}</strong></div>
      </div>`;
    }).join("")
    : `<p class="muted">Nessuna vittoria registrata.</p>`;

  const grouped = new Map();
  for (const row of honorRows) {
    const key = `${row.season_id}|${row.competition_type}|${row.competition_name}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  }

  const sections = Array.from(grouped.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, rows], index) => {
      const [seasonId, competitionType, competitionName] = key.split("|");
      rows.sort((a, b) => Number(a.placement || 999) - Number(b.placement || 999));
      return `<details class="collapse-card" ${index === 0 ? "open" : ""}>
        <summary><strong>${escapeHtml(seasonId)} · ${escapeHtml(competitionName)}</strong><span>${escapeHtml(COMPETITION_LABELS[competitionType] || competitionType)} · ${rows.length} righe</span></summary>
        <div class="table-wrap compact-table">
          <table>
            <thead><tr><th>Pos.</th><th>Squadra</th><th class="number">Punti</th><th class="number">FP</th><th>Note</th></tr></thead>
            <tbody>
              ${rows.map((row) => `<tr>
                <td>${row.placement ? `${row.placement}°` : "-"}</td>
                <td>${renderHonorClubName(row)}</td>
                <td class="number">${row.points ?? "-"}</td>
                <td class="number">${row.fantapoints ?? "-"}</td>
                <td>${escapeHtml(row.notes || (row.source === "standing" ? "da classifica competizione" : ""))}</td>
              </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </details>`;
    });

  el.honorHistory.innerHTML = sections.join("");
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

function renderAdminExtendedControls() {
  const seasonOptions = state.seasons.map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name || season.id)}</option>`).join("");
  const clubOptions = getCurrentClubs().map((club) => `<option value="${escapeHtml(club.id)}">${escapeHtml(club.name)}</option>`).join("");
  const selectedSeason = getSelectedSeasonId();
  const competitionsForSeason = state.competitions.filter((competition) => competition.season_id === selectedSeason);
  const competitionOptions = competitionsForSeason.map((competition) => `<option value="${escapeHtml(competition.id)}">${escapeHtml(competition.name)}</option>`).join("");

  if (el.stadiumSeason) { el.stadiumSeason.innerHTML = seasonOptions; el.stadiumSeason.value = selectedSeason; }
  if (el.stadiumClub) { el.stadiumClub.innerHTML = clubOptions; if (!el.stadiumClub.value && getCurrentClubs()[0]) el.stadiumClub.value = getCurrentClubs()[0].id; updateStadiumFormFields(); }
  if (el.competitionSeason) { el.competitionSeason.innerHTML = seasonOptions; el.competitionSeason.value = selectedSeason; }
  if (el.standingCompetition) el.standingCompetition.innerHTML = competitionOptions || `<option value="">Nessuna competizione</option>`;
  if (el.standingClub) el.standingClub.innerHTML = clubOptions;
  if (el.calendarCompetition) el.calendarCompetition.innerHTML = competitionOptions || `<option value="">Nessuna competizione</option>`;
  if (el.calendarHomeClub) el.calendarHomeClub.innerHTML = `<option value="">-</option>${clubOptions}`;
  if (el.calendarAwayClub) el.calendarAwayClub.innerHTML = `<option value="">-</option>${clubOptions}`;
  if (el.honorSeason) { el.honorSeason.innerHTML = seasonOptions; el.honorSeason.value = selectedSeason; }
  if (el.honorClub) el.honorClub.innerHTML = renderHonorClubOptions();
  if (el.rolloverSourceSeason) { el.rolloverSourceSeason.innerHTML = seasonOptions; el.rolloverSourceSeason.value = selectedSeason; }
  if (el.rolloverTargetSeason && !el.rolloverTargetSeason.value) {
    const y = Number(String(selectedSeason).slice(0, 4));
    if (Number.isFinite(y)) el.rolloverTargetSeason.value = `${y + 1}-${y + 2}`;
  }

  renderAdminLists();
}

function renderAdminLists() {
  if (el.newsAdminList) {
    el.newsAdminList.innerHTML = state.news.map((post) => `
      <div class="admin-list-item">
        <span><strong>${escapeHtml(post.title)}</strong><small>${escapeHtml(NEWS_TOPIC_LABELS[post.topic] || post.topic)} · ${fmtDate(post.created_at)}</small></span>
        <span><button class="button button-secondary button-small" type="button" data-edit-news="${escapeHtml(post.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-delete-news="${escapeHtml(post.id)}">Elimina</button></span>
      </div>`).join("") || `<p class="muted">Nessun comunicato.</p>`;
  }
  if (el.competitionAdminList) {
    el.competitionAdminList.innerHTML = state.competitions.filter((c) => c.season_id === getSelectedSeasonId()).map((competition) => `
      <div class="admin-list-item">
        <span><strong>${escapeHtml(competition.name)}</strong><small>${escapeHtml(COMPETITION_LABELS[competition.competition_type] || competition.competition_type)} · ${escapeHtml(COMPETITION_STATUS_LABELS[competition.status] || competition.status)}</small></span>
        <span><button class="button button-secondary button-small" type="button" data-edit-competition="${escapeHtml(competition.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-delete-competition="${escapeHtml(competition.id)}">Elimina</button></span>
      </div>`).join("") || `<p class="muted">Nessuna competizione.</p>`;
  }
  if (el.standingAdminList) {
    el.standingAdminList.innerHTML = state.competitionStandings.filter((row) => getCompetitionById(row.competition_id)?.season_id === getSelectedSeasonId()).map((row) => {
      const club = getClubById(row.club_id); const competition = getCompetitionById(row.competition_id);
      return `<div class="admin-list-item"><span><strong>${escapeHtml(competition?.name || "-")} · ${escapeHtml(club?.name || "-")}</strong><small>Pos. ${row.position || "-"} · ${row.points ?? "-"} pt</small></span><span><button class="button button-secondary button-small" type="button" data-edit-standing="${escapeHtml(row.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-delete-standing="${escapeHtml(row.id)}">Elimina</button></span></div>`;
    }).join("") || `<p class="muted">Nessuna classifica.</p>`;
  }
  if (el.calendarAdminList) {
    el.calendarAdminList.innerHTML = state.calendarMatches.filter((row) => row.season_id === getSelectedSeasonId()).map((match) => {
      const competition = getCompetitionById(match.competition_id); const home = getClubById(match.home_club_id); const away = getClubById(match.away_club_id);
      return `<div class="admin-list-item"><span><strong>${escapeHtml(match.matchday_label || "Giornata")} · ${escapeHtml(competition?.name || "-")}</strong><small>${escapeHtml(home?.name || "-")} vs ${escapeHtml(away?.name || "-")} · ${match.played_on ? fmtDateOnly(match.played_on) : "senza data"}</small></span><span><button class="button button-secondary button-small" type="button" data-edit-calendar="${escapeHtml(match.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-delete-calendar="${escapeHtml(match.id)}">Elimina</button></span></div>`;
    }).join("") || `<p class="muted">Nessuna giornata.</p>`;
  }
  if (el.honorAdminList) {
    el.honorAdminList.innerHTML = state.honorRoll.map((entry) => {
      const honorClub = getHonorClubForEntry(entry);
      return `<div class="admin-list-item"><span><strong>${escapeHtml(entry.season_id)} · ${escapeHtml(entry.title)}</strong><small>${escapeHtml(honorClub?.name || getClubById(entry.club_id)?.name || "-")} · ${entry.placement ? `${entry.placement}°` : "-"}</small></span><span><button class="button button-secondary button-small" type="button" data-edit-honor="${escapeHtml(entry.id)}">Modifica</button><button class="button button-danger button-small" type="button" data-delete-honor="${escapeHtml(entry.id)}">Elimina</button></span></div>`;
    }).join("") || `<p class="muted">Nessuna voce albo.</p>`;
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
  if (el.adminNavLink) el.adminNavLink.classList.toggle("hidden", !state.isAdmin);
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
  el.clubPresidentInput.value = selected.president || "";
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
  el.seasonForm.reset();
  el.seasonFormStatus.textContent = "Stagione salvata con competizioni base.";
  await fetchAll();
}

async function seedDefaultCompetitions(seasonId) {
  const defaults = [
    { name: `Regular Season ${seasonId}`, competition_type: "REGULAR_SEASON", status: "PLANNED" },
    { name: `Champions League ${seasonId}`, competition_type: "CHAMPIONS", status: "PLANNED" },
    { name: `Coppa Italia ${seasonId}`, competition_type: "COPPA_ITALIA", status: "PLANNED" },
    { name: `Playoff ${seasonId}`, competition_type: "PLAYOFF", status: "PLANNED" },
  ];
  for (const item of defaults) {
    const exists = state.competitions.some((competition) => competition.season_id === seasonId && competition.competition_type === item.competition_type);
    if (!exists) {
      const { error } = await state.supabase.from("competitions").insert({ season_id: seasonId, ...item });
      if (error && error.code !== "23505") throw error;
    }
  }
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
    president: el.clubPresidentInput.value.trim(),
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
  el.stadiumFormStatus.textContent = "Stadio aggiornato.";
  await fetchAll();
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
  el.newsFormStatus.textContent = "Comunicito salvato.";
  await fetchAll();
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
  resetCompetitionForm(); el.competitionFormStatus.textContent = "Competizione salvata."; await fetchAll();
}

function resetCompetitionForm() {
  if (!el.competitionForm) return;
  el.competitionId.value = ""; el.competitionName.value = ""; el.competitionType.value = "REGULAR_SEASON"; el.competitionStatus.value = "ACTIVE";
  if (el.competitionSeason) el.competitionSeason.value = getSelectedSeasonId();
}

async function handleStandingSubmit(event) {
  event.preventDefault();
  el.standingFormStatus.textContent = "Salvataggio...";
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
  };
  const response = id ? await state.supabase.from("competition_standings").update(payload).eq("id", id) : await state.supabase.from("competition_standings").insert(payload);
  if (response.error) { el.standingFormStatus.textContent = response.error.message; return; }
  resetStandingForm(); el.standingFormStatus.textContent = "Riga classifica salvata."; await fetchAll();
}

function resetStandingForm() {
  if (!el.standingForm) return;
  el.standingId.value = ""; [el.standingPosition, el.standingPoints, el.standingFantapoints, el.standingGoalsFor, el.standingGoalsAgainst, el.standingPlayed].forEach((field) => { if (field) field.value = ""; });
}

async function handleCalendarSubmit(event) {
  event.preventDefault();
  el.calendarFormStatus.textContent = "Salvataggio...";
  const competition = getCompetitionById(el.calendarCompetition.value);
  const id = el.calendarMatchId.value || null;
  const payload = {
    season_id: competition?.season_id || getSelectedSeasonId(),
    competition_id: el.calendarCompetition.value,
    matchday_label: el.calendarMatchday.value.trim(),
    played_on: el.calendarDate.value || null,
    home_club_id: el.calendarHomeClub.value || null,
    away_club_id: el.calendarAwayClub.value || null,
    home_score: toNumber(el.calendarHomeScore.value),
    away_score: toNumber(el.calendarAwayScore.value),
    status: el.calendarStatus.value,
  };
  const response = id ? await state.supabase.from("calendar_matches").update(payload).eq("id", id) : await state.supabase.from("calendar_matches").insert(payload);
  if (response.error) { el.calendarFormStatus.textContent = response.error.message; return; }
  resetCalendarForm(); el.calendarFormStatus.textContent = "Giornata salvata."; await fetchAll();
}

function resetCalendarForm() {
  if (!el.calendarForm) return;
  el.calendarMatchId.value = ""; el.calendarMatchday.value = ""; el.calendarDate.value = ""; el.calendarHomeClub.value = ""; el.calendarAwayClub.value = ""; el.calendarHomeScore.value = ""; el.calendarAwayScore.value = ""; el.calendarStatus.value = "SCHEDULED";
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
  const president = el.honorPresidentInput?.value.trim() || null;
  if (!name) throw new Error("Inserisci il nome della squadra storica oppure seleziona una squadra esistente.");

  const logo_data_url = el.honorClubLogoInput?.files?.[0] ? await readFileAsDataUrl(el.honorClubLogoInput.files[0]) : null;
  const clubKey = normalizeTextKey(`${name}-${president || ""}`) || normalizeTextKey(name);
  const existing = state.honorClubs.find((club) => normalizeTextKey(`${club.name}-${club.president || ""}`) === clubKey || normalizeTextKey(club.name) === normalizeTextKey(name));
  if (existing) return existing;

  const { data, error } = await state.supabase
    .from("honor_clubs")
    .insert({ name, president, logo_data_url, source_club_id: null })
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
  const payload = {
    season_id: el.honorSeason.value,
    club_id: honorClub.source_club_id || null,
    honor_club_id: honorClub.id,
    competition_type: el.honorCompetitionType.value,
    title: el.honorTitleInput.value.trim(),
    placement: toNumber(el.honorPlacement.value),
    points: toNumber(el.honorPoints.value),
    notes: el.honorNotes.value.trim() || null,
  };
  const response = id ? await state.supabase.from("honor_roll_entries").update(payload).eq("id", id) : await state.supabase.from("honor_roll_entries").insert(payload);
  if (response.error) { el.honorFormStatus.textContent = response.error.message; return; }
  resetHonorForm(); el.honorFormStatus.textContent = "Voce albo salvata."; await fetchAll();
}

function resetHonorForm() {
  if (!el.honorForm) return;
  el.honorId.value = ""; el.honorTitleInput.value = ""; el.honorPlacement.value = ""; el.honorPoints.value = ""; el.honorNotes.value = "";
  if (el.honorClub) el.honorClub.value = "__new__";
  if (el.honorClubNameInput) el.honorClubNameInput.value = "";
  if (el.honorPresidentInput) el.honorPresidentInput.value = "";
  if (el.honorClubLogoInput) el.honorClubLogoInput.value = "";
  if (el.honorSeason) el.honorSeason.value = getSelectedSeasonId();
}

const DUMP_TABLES = [
  "profiles",
  "seasons",
  "clubs",
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

const SCHEMA_DUMP_NOTE = `-- FantaMantra DB schema note\n-- Questo dump include i dati completi in JSON.\n-- Per ricreare lo schema, esegui in ordine le migration SQL generate nella webapp:\n-- 1) schema MVP iniziale\n-- 2) supabase_listone_migration_v7.sql\n-- 3) supabase_roster_import_migration_v7.sql\n-- 4) supabase_incremental_listone_v11.sql\n-- 5) supabase_feature_migration_v13.sql\n-- 6) supabase_feature_migration_v14.sql\n-- 7) supabase_feature_migration_v15.sql\n-- Le tabelle incluse nel dump dati sono elencate nel campo tables.\n`;

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
  if (standingId) { const r = state.competitionStandings.find((item) => item.id === standingId); if (!r) return; el.standingId.value = r.id; el.standingCompetition.value = r.competition_id; el.standingClub.value = r.club_id; el.standingPosition.value = r.position ?? ""; el.standingPoints.value = r.points ?? ""; el.standingFantapoints.value = r.fantapoints ?? ""; el.standingGoalsFor.value = r.goals_for ?? ""; el.standingGoalsAgainst.value = r.goals_against ?? ""; el.standingPlayed.value = r.played ?? ""; return; }
  const calendarId = target.closest("[data-edit-calendar]")?.dataset.editCalendar;
  if (calendarId) { const m = state.calendarMatches.find((item) => item.id === calendarId); if (!m) return; el.calendarMatchId.value = m.id; el.calendarCompetition.value = m.competition_id; el.calendarMatchday.value = m.matchday_label || ""; el.calendarDate.value = m.played_on || ""; el.calendarHomeClub.value = m.home_club_id || ""; el.calendarAwayClub.value = m.away_club_id || ""; el.calendarHomeScore.value = m.home_score ?? ""; el.calendarAwayScore.value = m.away_score ?? ""; el.calendarStatus.value = m.status || "SCHEDULED"; return; }
  const honorId = target.closest("[data-edit-honor]")?.dataset.editHonor;
  if (honorId) {
    const h = state.honorRoll.find((item) => item.id === honorId);
    if (!h) return;
    const honorClub = getHonorClubForEntry(h);
    el.honorId.value = h.id;
    el.honorSeason.value = h.season_id;
    el.honorClub.value = honorClub?.id || "__new__";
    if (el.honorClubNameInput) el.honorClubNameInput.value = honorClub?.source_club_id ? "" : (honorClub?.name || "");
    if (el.honorPresidentInput) el.honorPresidentInput.value = honorClub?.source_club_id ? "" : (honorClub?.president || "");
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

  if (!options.skipHash && window.location.hash !== `#${nextPage}`) {
    history.replaceState(null, "", `#${nextPage}`);
  }

  window.scrollTo({ top: 0, behavior: options.instant ? "auto" : "smooth" });
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
  if (el.standingForm) el.standingForm.addEventListener("submit", handleStandingSubmit);
  if (el.standingFormReset) el.standingFormReset.addEventListener("click", resetStandingForm);
  if (el.calendarForm) el.calendarForm.addEventListener("submit", handleCalendarSubmit);
  if (el.calendarFormReset) el.calendarFormReset.addEventListener("click", resetCalendarForm);
  if (el.honorForm) el.honorForm.addEventListener("submit", handleHonorSubmit);
  if (el.honorFormReset) el.honorFormReset.addEventListener("click", resetHonorForm);
  if (el.dumpForm) el.dumpForm.addEventListener("submit", handleDumpSubmit);
  [el.newsAdminList, el.competitionAdminList, el.standingAdminList, el.calendarAdminList, el.honorAdminList].forEach((node) => {
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
      const honorButton = event.target.closest("[data-honor-club-id]");
      if (honorButton) return showHonorClubDialog(honorButton.dataset.honorClubId);
      const playerButtonEl = event.target.closest("[data-player-id]");
      if (playerButtonEl) return showPlayerDialog(playerButtonEl.dataset.playerId);
    });
  }
  if (el.playerDialogBody) {
    el.playerDialogBody.addEventListener("click", (event) => {
      const rosterButton = event.target.closest("[data-roster-club-id]");
      if (rosterButton) return showRosterDialog(rosterButton.dataset.rosterClubId);
    });
  }
  if (el.closeRosterBtn) el.closeRosterBtn.addEventListener("click", () => el.rosterDialog.close());
}

async function init() {
  setupCollapsiblePanels();
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
