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

const state = {
  supabase: null,
  user: null,
  isAdmin: false,
  seasons: [],
  clubs: [],
  movements: [],
  stadiums: [],
  stadiumLevels: [],
  search: "",
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
  movementsList: document.getElementById("movementsList"),
  stadiumsList: document.getElementById("stadiumsList"),
  adminPanel: document.getElementById("adminPanel"),
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
  el.movementSignHint.textContent = `${preview.label}: verra salvato come ${signText}${fmtFm(Math.abs(preview.amount))}.`;
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

  const [seasonsRes, clubsRes, movementsRes, stadiumsRes, stadiumLevelsRes] = await Promise.all([
    state.supabase.from("seasons").select("*").order("starts_on", { ascending: false }),
    state.supabase.from("clubs").select("*").order("name", { ascending: true }),
    state.supabase
      .from("fm_movements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500),
    state.supabase.from("stadiums").select("*").eq("season_id", ACTIVE_SEASON_ID),
    state.supabase.from("stadium_levels").select("*").order("level", { ascending: true }),
  ]);

  for (const result of [seasonsRes, clubsRes, movementsRes, stadiumsRes, stadiumLevelsRes]) {
    if (result.error) throw result.error;
  }

  state.seasons = seasonsRes.data || [];
  state.clubs = clubsRes.data || [];
  state.movements = movementsRes.data || [];
  state.stadiums = stadiumsRes.data || [];
  state.stadiumLevels = stadiumLevelsRes.data || [];

  renderAll();
}

function renderMetrics() {
  const clubCount = state.clubs.length;
  const balances = state.clubs.map((club) => getClubBalance(club.id));
  const total = balances.reduce((sum, value) => sum + value, 0);
  const average = clubCount ? total / clubCount : 0;
  const negativeBalances = balances.filter((value) => value < 0).length;

  el.metricClubs.textContent = String(clubCount);
  el.metricTotalFm.textContent = fmtFm(total);
  el.metricAvgFm.textContent = fmtFm(average);
  el.metricAlerts.textContent = negativeBalances === 0 ? "0" : String(negativeBalances);
  el.metricAlerts.classList.toggle("danger", negativeBalances > 0);
}

function renderClubs() {
  const query = state.search.trim().toLowerCase();
  const rows = state.clubs
    .map((club) => ({
      ...club,
      balance: getClubBalance(club.id),
      stadium: getClubStadium(club.id),
    }))
    .filter((club) => {
      if (!query) return true;
      return `${club.name} ${club.president}`.toLowerCase().includes(query);
    })
    .sort((a, b) => b.balance - a.balance);

  if (!rows.length) {
    el.clubsTableBody.innerHTML = `<tr><td colspan="6" class="muted center">Nessun club trovato.</td></tr>`;
    return;
  }

  el.clubsTableBody.innerHTML = rows
    .map((club, index) => {
      const isNegative = club.balance < 0;
      const status = isNegative ? "Saldo negativo" : "OK";
      return `
        <tr>
          <td>${index + 1}</td>
          <td><strong>${escapeHtml(club.name)}</strong></td>
          <td>${escapeHtml(club.president)}</td>
          <td class="number ${isNegative ? "text-danger" : ""}">${fmtFm(club.balance)}</td>
          <td class="number">Liv. ${club.stadium?.level ?? 0}</td>
          <td><span class="status ${isNegative ? "status-danger" : "status-ok"}">${status}</span></td>
        </tr>
      `;
    })
    .join("");
}

function renderMovements() {
  const recent = state.movements.slice(0, 12);
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

  el.movementSeason.innerHTML = state.seasons
    .map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name)}</option>`)
    .join("");
  el.movementSeason.value = ACTIVE_SEASON_ID;

  el.movementClub.innerHTML = state.clubs
    .map((club) => `<option value="${escapeHtml(club.id)}">${escapeHtml(club.name)}</option>`)
    .join("");
}

function renderAll() {
  renderMetrics();
  renderClubs();
  renderMovements();
  renderStadiums();
  renderAdminControls();
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

  const payload = {
    season_id: el.movementSeason.value,
    club_id: el.movementClub.value,
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
  el.movementForm.addEventListener("submit", handleMovementSubmit);
  el.movementType.addEventListener("change", updateMovementSignHint);
  el.movementAmount.addEventListener("input", updateMovementSignHint);
  el.clubSearch.addEventListener("input", (event) => {
    state.search = event.target.value;
    renderClubs();
  });
}

async function init() {
  bindEvents();
  updateMovementSignHint();

  if (!isConfigured()) {
    el.configWarning.classList.remove("hidden");
    el.clubsTableBody.innerHTML = `<tr><td colspan="6" class="muted center">Configura Supabase per caricare i dati.</td></tr>`;
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
