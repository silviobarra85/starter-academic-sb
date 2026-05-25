export function installAdminPublicationWorkflowRefactorV213(deps = {}) {
  const {
    state,
    escapeHtml,
    normalizePreflightDateV179,
    getPreflightSummaryV179,
    renderPreflightResultsHtmlV179,
    PUBLIC_ASSET_PREFLIGHT_STORAGE_KEY_V179 = "zonaOrientalePublicAssetPreflightV179",
    runPublicAssetsPreflightV179: initialRunPublicAssetsPreflightV179,
    readAdminPublicationRemindersV189,
    getAdminStartupModeLabelV178,
    getAdminPublicationActionsV189,
    getRenderAdminArea,
    setRenderAdminArea,
    getRenderAdminLightGate,
    setRenderAdminLightGate,
    getRenderAdminHelpPanel,
    setRenderAdminHelpPanel,
    setRunPublicAssetsPreflight
  } = deps;

  let renderAdminArea = typeof getRenderAdminArea === "function" ? getRenderAdminArea() : null;
  let renderAdminLightGateV178 = typeof getRenderAdminLightGate === "function" ? getRenderAdminLightGate() : null;
  let renderAdminHelpPanelV185 = typeof getRenderAdminHelpPanel === "function" ? getRenderAdminHelpPanel() : null;
  let runPublicAssetsPreflightV179 = initialRunPublicAssetsPreflightV179;

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




/* V203 - Publication status sync and clearer honor preflight wording.
   The V190 publication status cards and the V179 public asset preflight both
   check the same JSON files. Before V203, clicking "Controlla solo asset
   pubblici" refreshed only the table below the cards, so the cards could keep
   stale "Failed to fetch" values from a previous check. V203 synchronizes the
   cards after a successful asset preflight and clarifies that palmares can be
   derived from honorRows when honor.json has no dedicated palmares array. */
const ZO_RELEASE_VERSION_V203 = "203";

const validateHonorSnapshotPreflightBeforeV203 = typeof validateHonorSnapshotPreflightV179 === "function" ? validateHonorSnapshotPreflightV179 : null;
if (validateHonorSnapshotPreflightBeforeV203) {
  validateHonorSnapshotPreflightV179 = function validateHonorSnapshotPreflightV203(payload) {
    const snapshot = payload?.snapshot && typeof payload.snapshot === "object" ? payload.snapshot : payload;
    const honorRows = Array.isArray(snapshot?.honorRows) ? snapshot.honorRows.length : 0;
    const palmares = Array.isArray(snapshot?.palmares) ? snapshot.palmares.length : 0;
    const fifaRanking = Array.isArray(snapshot?.fifaRanking) ? snapshot.fifaRanking.length : 0;
    if (!honorRows && !palmares && !fifaRanking) {
      return { status: "error", detail: "nessun dato honor/palmarès/FIFA trovato" };
    }
    const generatedAt = snapshot?.generatedAt || payload?.generatedAt || "";
    const generatedText = generatedAt ? ` · ${normalizePreflightDateV179(generatedAt)}` : "";
    const palmaresText = palmares
      ? `${palmares} palmarès dedicati`
      : (honorRows ? "palmarès calcolabile dall'albo" : "0 palmarès dedicati");
    return {
      status: "ok",
      detail: `${honorRows} albo · ${palmaresText} · ${fifaRanking} ranking${generatedText}`
    };
  };
}

function getPublicAssetsPreflightResultForStatusV203(result) {
  if (result?.results?.length) return result;
  const current = state.publicAssetsPreflightV179;
  if (current?.results?.length) return current;
  return null;
}

function syncPublicationStatusFromPreflightV203(preflightResult) {
  const preflight = getPublicAssetsPreflightResultForStatusV203(preflightResult);
  if (!preflight?.results?.length || typeof buildPublicationStatusRowsV190 !== "function") return null;
  const rows = buildPublicationStatusRowsV190(preflight);
  const payload = {
    checkedAt: new Date().toISOString(),
    summary: typeof summarizePublicationStatusRowsV190 === "function" ? summarizePublicationStatusRowsV190(rows) : null,
    rows,
    preflightSummary: preflight.summary || (typeof getPreflightSummaryV179 === "function" ? getPreflightSummaryV179(preflight.results) : null),
    syncedFromPreflightV203: true
  };
  if (typeof writePublicationStatusV190 === "function") writePublicationStatusV190(payload);
  if (typeof renderPublicationStatusPanelV190 === "function" && document.getElementById("publicationStatusMountV190")) {
    renderPublicationStatusPanelV190(payload);
  }
  return payload;
}

const runPublicAssetsPreflightBeforeV203 = typeof runPublicAssetsPreflightV179 === "function" ? runPublicAssetsPreflightV179 : null;
if (runPublicAssetsPreflightBeforeV203) {
  runPublicAssetsPreflightV179 = async function runPublicAssetsPreflightV203(options = {}) {
    const result = await runPublicAssetsPreflightBeforeV203(options);
    const targetId = options?.targetId || "";
    const shouldSyncStatus = targetId === "publicationStatusPreflightReportV190" || options?.syncPublicationStatusV203 === true;
    if (shouldSyncStatus) {
      syncPublicationStatusFromPreflightV203(result);
      const target = targetId ? document.getElementById(targetId) : null;
      if (target && result?.results?.length) {
        target.innerHTML = renderPreflightResultsHtmlV179(result.results);
      }
    }
    return result;
  };
}

const runPublicationStatusBeforeV203 = typeof runPublicationStatusV190 === "function" ? runPublicationStatusV190 : null;
if (runPublicationStatusBeforeV203) {
  runPublicationStatusV190 = async function runPublicationStatusV203(options = {}) {
    const payload = await runPublicationStatusBeforeV203(options);
    const hasFetchFailure = Array.isArray(payload?.rows) && payload.rows.some((row) => String(row?.detail || "").toLowerCase().includes("failed to fetch"));
    const lastPreflight = state.publicAssetsPreflightV179;
    const lastSummary = lastPreflight?.summary;
    if (hasFetchFailure && lastSummary && Number(lastSummary.error || 0) === 0) {
      return syncPublicationStatusFromPreflightV203(lastPreflight) || payload;
    }
    return payload;
  };
}

if (window.ZonaOrientalePublicationStatus) {
  window.ZonaOrientalePublicationStatus.syncFromPreflight = function syncFromPreflightV203() {
    return syncPublicationStatusFromPreflightV203(state.publicAssetsPreflightV179);
  };
  window.ZonaOrientalePublicationStatus.reset = function resetPublicationStatusV203() {
    try { localStorage.removeItem(PUBLICATION_STATUS_STORAGE_KEY_V190); } catch (_) {}
    try { sessionStorage.removeItem(PUBLIC_ASSET_PREFLIGHT_STORAGE_KEY_V179); } catch (_) {}
    state.publicAssetsPreflightV179 = null;
    if (typeof renderPublicationStatusPanelV190 === "function") renderPublicationStatusPanelV190(null);
    return true;
  };
}




  if (typeof setRenderAdminArea === "function" && typeof renderAdminArea === "function") setRenderAdminArea(renderAdminArea);
  if (typeof setRenderAdminLightGate === "function" && typeof renderAdminLightGateV178 === "function") setRenderAdminLightGate(renderAdminLightGateV178);
  if (typeof setRenderAdminHelpPanel === "function" && typeof renderAdminHelpPanelV185 === "function") setRenderAdminHelpPanel(renderAdminHelpPanelV185);
  if (typeof setRunPublicAssetsPreflight === "function" && typeof runPublicAssetsPreflightV179 === "function") setRunPublicAssetsPreflight(runPublicAssetsPreflightV179);

  return {
    buildPublicationStatusRowsV190,
    summarizePublicationStatusRowsV190,
    writePublicationStatusV190,
    readPublicationStatusV190,
    runPublicationStatusV190,
    renderPublicationStatusPanelV190,
    buildPublishWizardPayloadV191,
    readPublishWizardPayloadV191,
    getPublishWizardCommandsV191,
    copyPublishWizardTextV191,
    syncPublicationStatusFromPreflightV203,
    runPublicAssetsPreflightV179
  };
}
