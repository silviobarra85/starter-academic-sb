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
  search: "",
  rosterSearch: "",
  rosterClubFilter: "all",
};

const el = {
  configWarning: document.getElementById("configWarning"),
  errorBox: document.getElementById("errorBox"),
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
  clubSearch: document.getElementById("clubSearch"),
  clubsTableBody: document.getElementById("clubsTableBody"),
  rosterClubFilter: document.getElementById("rosterClubFilter"),
  rosterSearch: document.getElementById("rosterSearch"),
  rosterTableBody: document.getElementById("rosterTableBody"),
  movementsList: document.getElementById("movementsList"),
  stadiumsList: document.getElementById("stadiumsList"),
  adminPanel: document.getElementById("adminPanel"),
  clubForm: document.getElementById("clubForm"),
  clubEditSelect: document.getElementById("clubEditSelect"),
  clubNameInput: document.getElementById("clubNameInput"),
  clubPresidentInput: document.getElementById("clubPresidentInput"),
  clubActiveInput: document.getElementById("clubActiveInput"),
  clubFormStatus: document.getElementById("clubFormStatus"),
  auctionForm: document.getElementById("auctionForm"),
  auctionSeason: document.getElementById("auctionSeason"),
  auctionClub: document.getElementById("auctionClub"),
  auctionPlayerName: document.getElementById("auctionPlayerName"),
  auctionRealTeam: document.getElementById("auctionRealTeam"),
  auctionRoles: document.getElementById("auctionRoles"),
  auctionRoleClass: document.getElementById("auctionRoleClass"),
  auctionPrice: document.getElementById("auctionPrice"),
  auctionDate: document.getElementById("auctionDate"),
  auctionFormStatus: document.getElementById("auctionFormStatus"),
  movementForm: document.getElementById("movementForm"),
  movementSeason: document.getElementById("movementSeason"),
  movementClub: document.getElementById("movementClub"),
  movementType: document.getElementById("movementType"),
  movementAmount: document.getElementById("movementAmount"),
  movementSignHint: document.getElementById("movementSignHint"),
  movementDescription: document.getElementById("movementDescription"),
  movementFormStatus: document.getElementById("movementFormStatus"),
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

function getClubBalance(clubId) {
  return state.movements
    .filter((movement) => movement.club_id === clubId)
    .reduce((sum, movement) => sum + Number(movement.amount || 0), 0);
}

function getClubStadium(clubId) {
  return state.stadiums.find(
    (stadium) => stadium.club_id === clubId && stadium.season_id === ACTIVE_SEASON_ID,
  );
}

function getClubById(clubId) {
  return state.clubs.find((club) => club.id === clubId);
}

function getPlayerById(playerId) {
  return state.players.find((player) => player.id === playerId);
}

function getActiveRosterEntries(clubId) {
  return state.rosterEntries.filter(
    (entry) => entry.club_id === clubId && entry.season_id === ACTIVE_SEASON_ID && entry.is_active,
  );
}

function getRosterStats(clubId) {
  const entries = getActiveRosterEntries(clubId);
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
    player: getPlayerById(entry.player_id),
    club: getClubById(entry.club_id),
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
    seasonsRes,
    clubsRes,
    movementsRes,
    playersRes,
    rosterEntriesRes,
    stadiumsRes,
    stadiumLevelsRes,
  ] = await Promise.all([
    state.supabase.from("seasons").select("*").order("starts_on", { ascending: false }),
    state.supabase.from("clubs").select("*").order("name", { ascending: true }),
    state.supabase
      .from("fm_movements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000),
    state.supabase.from("players").select("*").order("name", { ascending: true }),
    state.supabase
      .from("roster_entries")
      .select("*")
      .eq("season_id", ACTIVE_SEASON_ID)
      .order("created_at", { ascending: false }),
    state.supabase.from("stadiums").select("*").eq("season_id", ACTIVE_SEASON_ID),
    state.supabase.from("stadium_levels").select("*").order("level", { ascending: true }),
  ]);

  for (const result of [
    seasonsRes,
    clubsRes,
    movementsRes,
    playersRes,
    rosterEntriesRes,
    stadiumsRes,
    stadiumLevelsRes,
  ]) {
    if (result.error) throw result.error;
  }

  state.seasons = seasonsRes.data || [];
  state.clubs = clubsRes.data || [];
  state.movements = movementsRes.data || [];
  state.players = playersRes.data || [];
  state.rosterEntries = rosterEntriesRes.data || [];
  state.stadiums = stadiumsRes.data || [];
  state.stadiumLevels = stadiumLevelsRes.data || [];

  renderAll();
}

function renderMetrics() {
  const clubCount = state.clubs.filter((club) => club.active !== false).length;
  const balances = state.clubs.map((club) => getClubBalance(club.id));
  const total = balances.reduce((sum, value) => sum + value, 0);
  const average = clubCount ? total / clubCount : 0;
  const negativeBalances = balances.filter((value) => value < 0).length;
  const rosterIssues = state.clubs.filter((club) => getRosterStats(club.id).issues.length > 0).length;
  const alerts = negativeBalances + rosterIssues;

  el.metricClubs.textContent = String(clubCount);
  el.metricTotalFm.textContent = fmtFm(total);
  el.metricAvgFm.textContent = fmtFm(average);
  el.metricAlerts.textContent = String(alerts);
  el.metricAlerts.classList.toggle("danger", alerts > 0);
}

function renderClubs() {
  const query = state.search.trim().toLowerCase();
  const rows = state.clubs
    .map((club) => ({
      ...club,
      balance: getClubBalance(club.id),
      stadium: getClubStadium(club.id),
      roster: getRosterStats(club.id),
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
  const rows = buildRosterRows()
    .filter(({ entry, player, club }) => {
      if (selectedClub !== "all" && entry.club_id !== selectedClub) return false;
      if (!query) return true;
      return `${player?.name || ""} ${player?.real_team || ""} ${player?.mantra_roles || ""} ${club?.name || ""}`
        .toLowerCase()
        .includes(query);
    })
    .sort((a, b) => (a.club?.name || "").localeCompare(b.club?.name || "") || (a.player?.name || "").localeCompare(b.player?.name || ""));

  if (!rows.length) {
    el.rosterTableBody.innerHTML = `<tr><td colspan="8" class="muted center">Nessun giocatore in rosa.</td></tr>`;
    return;
  }

  el.rosterTableBody.innerHTML = rows
    .map(({ entry, player, club }) => {
      const status = entry.is_active ? "Attivo" : "Non attivo";
      const roleLabel = player?.role_class === "P" ? "Portiere" : "Movimento";
      return `
        <tr>
          <td><strong>${escapeHtml(player?.name || "Giocatore non trovato")}</strong></td>
          <td>${escapeHtml(club?.name || entry.club_id)}</td>
          <td>${escapeHtml(player?.real_team || "-")}</td>
          <td>${escapeHtml(player?.mantra_roles || "-")}</td>
          <td>${roleLabel}</td>
          <td class="number">${fmtFm(entry.purchase_price)}</td>
          <td>${escapeHtml(ACQUIRED_LABELS[entry.acquired_via] || entry.acquired_via)}</td>
          <td><span class="status ${entry.is_active ? "status-ok" : "status-muted"}">${status}</span></td>
        </tr>
      `;
    })
    .join("");
}

function renderMovements() {
  const recent = state.movements.slice(0, 14);
  if (!recent.length) {
    el.movementsList.innerHTML = `<p class="muted">Nessun movimento registrato.</p>`;
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
  el.adminPanel.classList.toggle("hidden", !state.isAdmin);

  const seasonOptions = state.seasons
    .map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name)}</option>`)
    .join("");

  const clubOptions = state.clubs
    .map((club) => `<option value="${escapeHtml(club.id)}">${escapeHtml(club.name)}</option>`)
    .join("");

  el.movementSeason.innerHTML = seasonOptions;
  el.movementSeason.value = ACTIVE_SEASON_ID;
  el.movementClub.innerHTML = clubOptions;

  el.auctionSeason.innerHTML = seasonOptions;
  el.auctionSeason.value = ACTIVE_SEASON_ID;
  el.auctionClub.innerHTML = clubOptions;
  if (!el.auctionDate.value) el.auctionDate.value = todayIso();

  el.clubEditSelect.innerHTML = clubOptions;
  if (!el.clubEditSelect.value && state.clubs.length) {
    el.clubEditSelect.value = state.clubs[0].id;
  }
  updateClubFormFields();
}

function renderAll() {
  renderMetrics();
  renderClubs();
  renderRosterFilters();
  renderRoster();
  renderMovements();
  renderStadiums();
  renderAdminControls();
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

async function handleAuctionSubmit(event) {
  event.preventDefault();
  el.auctionFormStatus.textContent = "Salvataggio...";

  const seasonId = el.auctionSeason.value;
  const clubId = el.auctionClub.value;
  const playerName = el.auctionPlayerName.value.trim();
  const realTeam = el.auctionRealTeam.value.trim() || null;
  const mantraRoles = el.auctionRoles.value.trim();
  const roleClass = el.auctionRoleClass.value;
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

  const { data: player, error: playerError } = await state.supabase
    .from("players")
    .insert({
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
    await state.supabase.from("players").delete().eq("id", player.id);
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
  el.auctionSeason.value = ACTIVE_SEASON_ID;
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
  const balance = getClubBalance(clubId);

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
  el.movementSeason.value = ACTIVE_SEASON_ID;
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

function bindEvents() {
  el.refreshBtn.addEventListener("click", () => fetchAll().catch((error) => showError(error.message)));
  el.openLoginBtn.addEventListener("click", () => el.loginDialog.showModal());
  el.closeLoginBtn.addEventListener("click", () => el.loginDialog.close());
  el.loginForm.addEventListener("submit", handleLogin);
  el.logoutBtn.addEventListener("click", handleLogout);
  el.clubForm.addEventListener("submit", handleClubSubmit);
  el.clubEditSelect.addEventListener("change", updateClubFormFields);
  el.auctionForm.addEventListener("submit", handleAuctionSubmit);
  el.movementForm.addEventListener("submit", handleMovementSubmit);
  el.movementType.addEventListener("change", updateMovementSignHint);
  el.movementAmount.addEventListener("input", updateMovementSignHint);
  el.clubSearch.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderClubs();
  });
  el.rosterSearch.addEventListener("input", (event) => {
    state.rosterSearch = event.target.value;
    renderRoster();
  });
  el.rosterClubFilter.addEventListener("change", (event) => {
    state.rosterClubFilter = event.target.value;
    renderRoster();
  });
}

async function init() {
  bindEvents();
  updateMovementSignHint();
  el.auctionDate.value = todayIso();

  if (!isConfigured()) {
    el.configWarning.classList.remove("hidden");
    el.clubsTableBody.innerHTML = `<tr><td colspan="7" class="muted center">Configura Supabase per caricare i dati.</td></tr>`;
    el.rosterTableBody.innerHTML = `<tr><td colspan="8" class="muted center">Configura Supabase per caricare i dati.</td></tr>`;
    el.movementsList.innerHTML = `<p class="muted">Configura Supabase per caricare i dati.</p>`;
    el.stadiumsList.innerHTML = `<p class="muted">Configura Supabase per caricare i dati.</p>`;
    return;
  }

  state.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  try {
    await loadAuthState();
    await fetchAll();
  } catch (error) {
    showError(error.message || "Errore durante il caricamento dei dati.");
  }
}

init();
