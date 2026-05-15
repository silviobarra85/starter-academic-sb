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
  "competitionResults",
  "honorRoll"
];

const state = {
  raw: Object.fromEntries(COLLECTIONS.map((name) => [name, []])),
  user: null,
  isAdmin: false,
  currentPage: "dashboard"
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

function toBoolean(value) {
  return value === true || value === "true" || value === "on";
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
  state.raw.seasonTeams.sort(byText("name"));
}

function buildMaps() {
  return {
    presidentsById: new Map(state.raw.presidents.map((item) => [item.id, item])),
    teamsById: new Map(state.raw.teams.map((item) => [item.id, item])),
    seasonsById: new Map(state.raw.seasons.map((item) => [item.id, item]))
  };
}

function getLeagueSettings() {
  return state.raw.leagueSettings.find((item) => item.id === "main") || state.raw.leagueSettings[0] || null;
}

function getCurrentSeasonId() {
  const league = getLeagueSettings();
  if (league?.currentSeasonId) return league.currentSeasonId;
  const current = state.raw.seasons.find((season) => season.isCurrent);
  if (current) return current.id;
  return state.raw.seasons[0]?.id || "";
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

function renderAll() {
  renderLeagueHeader();
  renderSeasonSelectors();
  renderDashboard();
  renderTeamsTable();
  renderPlaceholderPages();
  renderAdminArea();
}

function renderLeagueHeader() {
  const league = getLeagueSettings();
  const title = document.querySelector("h1");
  if (title && league?.name) title.textContent = league.name;

  const subtitle = document.querySelector(".subtitle");
  if (subtitle && league?.subtitle) subtitle.textContent = league.subtitle;
}

function renderSeasonSelectors() {
  const seasonId = getCurrentSeasonId();
  const selects = [
    document.getElementById("globalSeasonSelect"),
    document.getElementById("dashboardSeasonSelect")
  ].filter(Boolean);

  for (const select of selects) {
    select.innerHTML = state.raw.seasons
      .map((season) => `<option value="${escapeHtml(season.id)}">${escapeHtml(season.name || season.id)}</option>`)
      .join("");
    select.value = seasonId;
  }

  const seasonText = document.getElementById("dashboardSeasonText");
  if (seasonText) seasonText.textContent = `Stagione visualizzata: ${seasonId || "-"}`;
}

function renderDashboard() {
  const currentTeams = state.raw.teams.filter((team) => team.isCurrent !== false);

  const metricClubs = document.getElementById("metricClubs");
  const metricTotalFm = document.getElementById("metricTotalFm");
  const metricAvgFm = document.getElementById("metricAvgFm");
  const metricAlerts = document.getElementById("metricAlerts");

  if (metricClubs) metricClubs.textContent = String(currentTeams.length);
  if (metricTotalFm) metricTotalFm.textContent = "-";
  if (metricAvgFm) metricAvgFm.textContent = "-";
  if (metricAlerts) metricAlerts.textContent = "0";

  setLoadingText("dashboardStandings", "Le classifiche saranno il prossimo modulo da collegare.");
  setLoadingText("dashboardCalendar", "Il calendario sarà aggiunto dopo competizioni e risultati.");
}

function renderTeamsTable() {
  const tableBody = document.getElementById("clubsTableBody");
  if (!tableBody) return;

  if (!state.raw.teams.length) {
    tableBody.innerHTML = `<tr><td colspan="7" class="muted center">Nessuna squadra inserita.</td></tr>`;
    return;
  }

  tableBody.innerHTML = state.raw.teams.map((team, index) => {
    const statusClass = team.isCurrent === false ? "status-muted" : "status-ok";
    const statusText = team.isCurrent === false ? "Storica" : "Attuale";
    const logo = team.logo ? `<img class="club-logo" src="${escapeHtml(team.logo)}" alt="" />` : `<span class="club-logo club-logo-placeholder">${escapeHtml((team.canonicalName || "?").slice(0, 2).toUpperCase())}</span>`;

    return `
      <tr>
        <td data-label="#">${index + 1}</td>
        <td data-label="Club">
          <span class="club-name-with-logo">${logo}<strong>${escapeHtml(getTeamDisplayName(team))}</strong></span>
        </td>
        <td data-label="Presidente">${escapeHtml(getPresidentNames(team.currentPresidentIds || []))}</td>
        <td data-label="Saldo FM" class="number">-</td>
        <td data-label="Rosa" class="number">-</td>
        <td data-label="Stadio" class="number">-</td>
        <td data-label="Stato"><span class="status ${statusClass}">${statusText}</span></td>
      </tr>`;
  }).join("");
}

function renderPlaceholderPages() {
  setLoadingText("newsList", "Modulo News non ancora collegato.");
  setLoadingText("rosterClubCards", "Le rose sono state escluse dalla nuova struttura dati.");
  setLoadingText("listoneTableBody", "Il listone è stato escluso dalla nuova struttura dati.");
  setLoadingText("freeAgentsTableBody", "Gli svincolati sono stati esclusi dalla nuova struttura dati.");
  setLoadingText("competitionsList", "Modulo Competizioni da collegare dopo stagioni, presidenti e squadre.");
  setLoadingText("honorSummary", "Modulo Albo d'oro da collegare dopo competizioni e risultati.");
  setLoadingText("movementsList", "I movimenti FM sono stati esclusi dalla nuova struttura dati.");
  setLoadingText("stadiumsList", "Modulo Stadi da collegare dopo seasonTeams.");
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

function renderAdminArea() {
  const adminPanel = document.getElementById("adminPanel");
  if (!adminPanel) return;

  if (!state.isAdmin) {
    adminPanel.innerHTML = `
      <div class="page-heading">
        <div>
          <p class="eyebrow">Area riservata</p>
          <h2 id="adminTitle">Admin</h2>
          <p>Accedi come amministratore per modificare stagioni, presidenti e squadre.</p>
        </div>
      </div>`;
    return;
  }

  adminPanel.innerHTML = `
    <div class="page-heading">
      <div>
        <p class="eyebrow">Area riservata</p>
        <h2 id="adminTitle">Admin</h2>
        <p>Gestione iniziale Firebase: stagioni, presidenti e squadre.</p>
      </div>
    </div>

    ${renderSeasonAdminPanel()}
    ${renderPresidentAdminPanel()}
    ${renderTeamAdminPanel()}
  `;

  attachAdminHandlers();
}

function renderSeasonAdminPanel() {
  const rows = state.raw.seasons.map((season) => `
    <div class="admin-list-item">
      <span>
        <strong>${escapeHtml(season.name || season.id)}</strong>
        <small>${escapeHtml(season.id)}${season.isCurrent ? " · stagione corrente" : ""}</small>
      </span>
      <span>
        <button class="button button-secondary button-small" type="button" data-admin-edit-season="${escapeHtml(season.id)}">Modifica</button>
        <button class="button button-danger button-small" type="button" data-admin-delete-season="${escapeHtml(season.id)}">Elimina</button>
      </span>
    </div>
  `).join("") || `<p class="muted admin-empty-message">Nessuna stagione inserita.</p>`;

  return `
    <article class="panel" id="adminSeasonsPanel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Firebase</p>
          <h2>Stagioni</h2>
          <p>Crea o modifica le stagioni della lega.</p>
        </div>
      </div>

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
        <label class="checkbox-label span-2">
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
    </article>`;
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

  return `
    <article class="panel" id="adminPresidentsPanel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Firebase</p>
          <h2>Presidenti</h2>
          <p>Anagrafica dei presidenti. Un presidente potrà essere collegato a una o più squadre.</p>
        </div>
      </div>

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
    </article>`;
}

function renderTeamAdminPanel() {
  const presidentOptions = state.raw.presidents.map((president) => `
    <option value="${escapeHtml(president.id)}">${escapeHtml(president.name || president.id)}</option>
  `).join("");

  const rows = state.raw.teams.map((team) => `
    <div class="admin-list-item">
      <span>
        <strong>${escapeHtml(getTeamDisplayName(team))}</strong>
        <small>${team.isCurrent === false ? "squadra storica" : "squadra attuale"} · Presidenti attuali: ${escapeHtml(getPresidentNames(team.currentPresidentIds || []))}</small>
      </span>
      <span>
        <button class="button button-secondary button-small" type="button" data-admin-edit-team="${escapeHtml(team.id)}">Modifica</button>
        <button class="button button-danger button-small" type="button" data-admin-delete-team="${escapeHtml(team.id)}">Elimina</button>
      </span>
    </div>
  `).join("") || `<p class="muted admin-empty-message">Nessuna squadra inserita.</p>`;

  return `
    <article class="panel" id="adminTeamsPanel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Firebase</p>
          <h2>Squadre</h2>
          <p>Inserisci le squadre attuali o storiche. Per ora il presidente è salvato come presidente attuale della squadra; poi lo storicizzeremo in seasonTeams.</p>
        </div>
      </div>

      <form id="adminTeamForm" class="form-grid">
        <input id="adminTeamId" type="hidden" />
        <label>
          Nome squadra
          <input id="adminTeamName" class="input" type="text" placeholder="Es. Real Pastena" required />
        </label>
        <label>
          Logo
          <input id="adminTeamLogo" class="input" type="text" placeholder="Es. assets/logos/real-pastena.png" />
          <small class="field-hint">Per ora inserisci un percorso o URL. Upload immagini lo aggiungiamo dopo.</small>
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
    </article>`;
}

function attachAdminHandlers() {
  const seasonForm = document.getElementById("adminSeasonForm");
  const presidentForm = document.getElementById("adminPresidentForm");
  const teamForm = document.getElementById("adminTeamForm");

  seasonForm?.addEventListener("submit", saveSeason);
  presidentForm?.addEventListener("submit", savePresident);
  teamForm?.addEventListener("submit", saveTeam);

  document.getElementById("adminSeasonReset")?.addEventListener("click", resetSeasonForm);
  document.getElementById("adminPresidentReset")?.addEventListener("click", resetPresidentForm);
  document.getElementById("adminTeamReset")?.addEventListener("click", resetTeamForm);

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

  const payload = {
    canonicalName: document.getElementById("adminTeamName").value.trim(),
    logo: document.getElementById("adminTeamLogo").value.trim(),
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

function editSeason(id) {
  const season = state.raw.seasons.find((item) => item.id === id);
  if (!season) return;

  document.getElementById("adminSeasonId").value = season.id;
  document.getElementById("adminSeasonId").readOnly = true;
  document.getElementById("adminSeasonName").value = season.name || "";
  document.getElementById("adminSeasonStartsOn").value = season.startsOn || "";
  document.getElementById("adminSeasonEndsOn").value = season.endsOn || "";
  document.getElementById("adminSeasonIsCurrent").checked = Boolean(season.isCurrent);
  document.getElementById("adminSeasonsPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function editPresident(id) {
  const president = state.raw.presidents.find((item) => item.id === id);
  if (!president) return;

  document.getElementById("adminPresidentId").value = president.id;
  document.getElementById("adminPresidentName").value = president.name || "";
  document.getElementById("adminPresidentNotes").value = president.notes || "";
  document.getElementById("adminPresidentIsActive").checked = president.isActive !== false;
  document.getElementById("adminPresidentsPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function editTeam(id) {
  const team = state.raw.teams.find((item) => item.id === id);
  if (!team) return;

  document.getElementById("adminTeamId").value = team.id;
  document.getElementById("adminTeamName").value = team.canonicalName || "";
  document.getElementById("adminTeamLogo").value = team.logo || "";
  document.getElementById("adminTeamNotes").value = team.notes || "";
  document.getElementById("adminTeamIsCurrent").checked = team.isCurrent !== false;

  const selected = new Set(team.currentPresidentIds || []);
  Array.from(document.getElementById("adminTeamPresidentIds").options).forEach((option) => {
    option.selected = selected.has(option.value);
  });

  document.getElementById("adminTeamsPanel")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  showMessage("adminTeamStatus", "");
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

async function initializeAppUi() {
  setupNavigation();
  setupAuth();
  updateAdminVisibility();

  try {
    await loadData();
    setError("");
  } catch (error) {
    console.error(error);
    setError("Non riesco a leggere Firestore. Controlla configurazione Firebase e Security Rules.");
  }
}

initializeAppUi();
