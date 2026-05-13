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
  latestQuotations: [],
  allLatestQuotations: [],
  selectedSeason: ACTIVE_SEASON_ID,
  selectedListoneSeason: ACTIVE_SEASON_ID,
  selectedRosterSeason: ACTIVE_SEASON_ID,
  search: "",
  listoneSearch: "",
  listoneRoleFilter: "all",
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

  if (total < 23) issues.push(`rosa sotto minimo (${total}/23)`);
  if (total > 33) issues.push(`rosa sopra massimo (${total}/33)`);
  if (goalkeepers < 2) issues.push(`portieri insufficienti (${goalkeepers}/2)`);
  if (goalkeepers > 5) issues.push(`troppi portieri (${goalkeepers}/5)`);
  if (outfieldPlayers < 21) issues.push(`movimento sotto minimo (${outfieldPlayers}/21)`);
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
  const clubCount = state.clubs.filter((club) => club.active !== false).length;
  const seasonId = getSelectedSeasonId();
  const balances = state.clubs.map((club) => getClubBalance(club.id, seasonId));
  const total = balances.reduce((sum, value) => sum + value, 0);
  const average = clubCount ? total / clubCount : 0;
  const negativeBalances = balances.filter((value) => value < 0).length;
  const rosterIssues = state.clubs.filter((club) => getRosterStats(club.id, seasonId).issues.length > 0).length;
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
  const rows = state.clubs
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
          <td><strong>${escapeHtml(club.name)}</strong>${club.active === false ? '<span class="mini-badge">non attivo</span>' : ""}</td>
          <td>${escapeHtml(club.president)}</td>
          <td class="number ${isNegative ? "text-danger" : ""}">${fmtFm(club.balance)}</td>
          <td class="number">${club.roster.total} <span class="muted small">(${club.roster.goalkeepers} P)</span></td>
          <td class="number">Liv. ${club.stadium?.level ?? 0}</td>
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
    ...state.clubs.map((club) => `<option value="${escapeHtml(club.id)}">${escapeHtml(club.name)}</option>`),
  ].join("");
  el.rosterClubFilter.value = state.clubs.some((club) => club.id === currentValue) ? currentValue : "all";
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
          <td><strong>${escapeHtml(player?.name || "Giocatore non trovato")}</strong></td>
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
  const cards = state.clubs.map((club) => {
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
        <td><strong>${escapeHtml(player?.name || "Giocatore non trovato")}</strong></td>
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
  return `<button class="link-button" type="button" data-roster-club-id="${escapeHtml(club.id)}">${escapeHtml(club.name)}</button>`;
}

function getFilteredListoneRows() {
  const query = state.listoneSearch.trim().toLowerCase();
  const roleFilter = state.listoneRoleFilter || "all";
  return state.latestQuotations
    .filter((quote) => {
      if (roleFilter !== "all" && String(quote.classic_role || "").toUpperCase() !== roleFilter) return false;
      if (!query) return true;
      const club = getRosterClubForPlayer(quote.player_id, state.selectedListoneSeason);
      return `${quote.player_name || ""} ${quote.real_team || ""} ${quote.mantra_roles || ""} ${quote.classic_role || ""} ${club?.name || ""}`
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => Number(b.is_listed) - Number(a.is_listed) || (a.player_name || "").localeCompare(b.player_name || ""));
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
          <td><strong>${escapeHtml(quote.player_name)}</strong><br><span class="muted small">ID ${escapeHtml(quote.fantacalcio_id)} · key ${escapeHtml(getQuotationKey(quote))}</span></td>
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

  const rows = getFilteredListoneRows().filter(
    (quote) => quote.is_listed && !getActiveRosterEntryForPlayer(quote.player_id, state.selectedListoneSeason)
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
        <td><strong>${escapeHtml(quote.player_name)}</strong><br><span class="muted small">key ${escapeHtml(getQuotationKey(quote))}</span></td>
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
      <div><span>Rosa (${escapeHtml(rosterSeasonId)})</span><strong>${rosterClub ? escapeHtml(rosterClub.name) : "Svincolato"}</strong></div>
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
            <strong>${escapeHtml(club?.name || movement.club_id)}</strong>
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
  const items = state.clubs.map((club) => ({ club, stadium: getClubStadium(club.id) }));

  el.stadiumsList.innerHTML = items
    .map(({ club, stadium }) => {
      const level = stadium?.level ?? 0;
      const levelData = state.stadiumLevels.find((entry) => entry.level === level);
      return `
        <div class="stadium-item">
          <div>
            <strong>${escapeHtml(club.name)}</strong>
            <span>Livello ${level}</span>
          </div>
          <small>Bonus casa: ${levelData?.home_bonus ?? 0} · Manutenzione: ${fmtFm(levelData?.maintenance_cost ?? 0)}</small>
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

  const clubOptions = state.clubs
    .map((club) => `<option value="${escapeHtml(club.id)}">${escapeHtml(club.name)}</option>`)
    .join("");

  const selectedSeason = state.selectedSeason || ACTIVE_SEASON_ID;

  el.movementSeason.innerHTML = seasonOptions;
  el.movementSeason.value = selectedSeason;
  el.movementClub.innerHTML = clubOptions;

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
  if (!el.clubEditSelect.value && state.clubs.length) {
    el.clubEditSelect.value = state.clubs[0].id;
  }
  updateClubFormFields();
}

function renderAll() {
  renderSeasonControl();
  renderMetrics();
  renderClubs();
  renderRosterFilters();
  renderRosterClubCards();
  renderRoster();
  renderListoneSeasonFilter();
  renderListone();
  renderMovements();
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

async function handleClubSubmit(event) {
  event.preventDefault();
  el.clubFormStatus.textContent = "Salvataggio...";

  const clubId = el.clubEditSelect.value;
  const payload = {
    name: el.clubNameInput.value.trim(),
    president: el.clubPresidentInput.value.trim(),
    active: el.clubActiveInput.checked,
  };

  if (!payload.name || !payload.president) {
    el.clubFormStatus.textContent = "Nome club e presidente sono obbligatori.";
    return;
  }

  const { error } = await state.supabase.from("clubs").update(payload).eq("id", clubId);

  if (error) {
    el.clubFormStatus.textContent = error.message;
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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}



const PAGE_IDS = ["dashboard", "clubs", "rosters", "listone", "finance", "admin"];

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
  if (el.rosterTableBody) {
    el.rosterTableBody.addEventListener("click", (event) => {
      const button = event.target.closest("[data-roster-club-id]");
      if (!button) return;
      showRosterDialog(button.dataset.rosterClubId);
    });
  }
  el.listoneSearch.addEventListener("input", (event) => {
    state.listoneSearch = event.target.value;
    renderListone();
  });
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
