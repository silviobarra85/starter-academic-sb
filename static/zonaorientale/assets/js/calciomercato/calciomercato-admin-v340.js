/*
 * V340 - Pannello Solo Admin / archivio Calciomercato estratto in modulo protetto.
 *
 * Il modulo gestisce solo il rendering del box admin e il toggle Espandi/Riduci.
 * Non scarica feed, non modifica gli archivi JSON, non scrive Firebase e non cambia
 * la logica di download giorno/intervallo esistente in app.js.
 */

export function createCalciomercatoArchiveAdminV340(deps = {}) {
  const escapeHtml = typeof deps.escapeHtml === "function"
    ? deps.escapeHtml
    : (value) => String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");

  const getState = typeof deps.getState === "function" ? deps.getState : () => ({});
  const getBounds = typeof deps.getBounds === "function" ? deps.getBounds : () => ({ from: null, to: null });
  const getDayKeys = typeof deps.getDayKeys === "function" ? deps.getDayKeys : () => [];
  const getSelectedDay = typeof deps.getSelectedDay === "function" ? deps.getSelectedDay : () => "";
  const getAvailableDays = typeof deps.getAvailableDays === "function" ? deps.getAvailableDays : () => [];
  const renderDiagnostics = typeof deps.renderDiagnostics === "function" ? deps.renderDiagnostics : () => "";
  const archiveStartDate = deps.archiveStartDate || "";

  function isExpanded(state = getState()) {
    return state.archiveAdminExpandedV326 === true;
  }

  function buildViewModel(state = getState()) {
    const bounds = getBounds();
    const days = getDayKeys(bounds.from, bounds.to);
    const selectedDay = getSelectedDay();
    const availableDays = getAvailableDays();
    const loadedDays = Array.isArray(state.archiveLoadedDaysV323) ? state.archiveLoadedDaysV323 : [];
    const archiveArticles = Array.isArray(state.archiveArticlesV323) ? state.archiveArticlesV323 : [];
    return {
      expanded: isExpanded(state),
      days,
      selectedDay,
      availableDays,
      loadedDays,
      archiveCount: archiveArticles.length,
      busy: !!state.archiveDownloadBusyV323,
      status: state.archiveStatusV323 || "",
      archiveStartDate
    };
  }

  function render(viewModel = buildViewModel()) {
    const vm = viewModel && typeof viewModel === "object" ? viewModel : buildViewModel();
    return `<div class="compact-card calciomercato-archive-tools-card-v323 calciomercato-archive-tools-card-v324 calciomercato-archive-tools-card-v326 calciomercato-archive-tools-card-v340${vm.expanded ? "" : " is-collapsed"}">
      <div class="calciomercato-archive-head-v326">
        <div>
          <span class="eyebrow">Solo Admin</span>
          <h3>Archivio statico Calciomercato</h3>
          <small class="muted">Archivio disponibile: ${escapeHtml(String(vm.availableDays.length))} giorni · giorni caricati nel range: ${escapeHtml(String(vm.loadedDays.length || 0))} · articoli statici nel range: ${escapeHtml(String(vm.archiveCount))} · partenza archivio ${escapeHtml(vm.archiveStartDate)}.</small>
        </div>
        <button id="calciomercatoArchiveToggleV326" class="button button-secondary button-small calciomercato-archive-toggle-v326" type="button" aria-expanded="${vm.expanded ? "true" : "false"}" aria-controls="calciomercatoArchiveBodyV326">${vm.expanded ? "Riduci" : "Espandi"}</button>
      </div>
      <div id="calciomercatoArchiveBodyV326" class="calciomercato-archive-body-v326" ${vm.expanded ? "" : "hidden"}>
        <p>Scarica JSON giornalieri e verifica copertura dello storico. Copia poi i file una sola volta in <code>../fanta-engine/data/shared-assets/current/assets/calciomercato/archive/</code>.</p>
        <div class="calciomercato-archive-actions-v323">
          <button id="calciomercatoDownloadArchiveDayV323" class="button button-secondary button-small" type="button" ${vm.busy ? "disabled" : ""}>Scarica JSON giorno ${escapeHtml(vm.selectedDay)}</button>
          <button id="calciomercatoDownloadArchiveRangeV323" class="button button-primary button-small" type="button" ${vm.busy || !vm.days.length ? "disabled" : ""}>Scarica JSON intervallo (${escapeHtml(String(vm.days.length))})</button>
        </div>
        ${renderDiagnostics()}
        ${vm.status ? `<p class="form-status calciomercato-archive-status-v323">${escapeHtml(vm.status)}</p>` : ""}
      </div>
    </div>`;
  }

  function renderInto(target, options = {}) {
    if (!target) return null;
    const state = getState();
    const isAdmin = options.isAdmin === true;
    if (!isAdmin) {
      target.classList.add("hidden");
      target.innerHTML = "";
      return null;
    }
    target.classList.remove("hidden");
    const viewModel = buildViewModel(state);
    target.innerHTML = render(viewModel);
    return viewModel;
  }

  function setExpanded(expanded, state = getState()) {
    if (state && typeof state === "object") state.archiveAdminExpandedV326 = expanded === true;
    const button = document.getElementById("calciomercatoArchiveToggleV326");
    const body = document.getElementById("calciomercatoArchiveBodyV326");
    const card = button?.closest?.(".calciomercato-archive-tools-card-v326");
    if (button) {
      button.setAttribute("aria-expanded", expanded ? "true" : "false");
      button.textContent = expanded ? "Riduci" : "Espandi";
    }
    if (body) {
      body.hidden = !expanded;
      if (expanded) body.removeAttribute("hidden");
      else body.setAttribute("hidden", "");
    }
    card?.classList.toggle("is-collapsed", !expanded);
  }

  function toggle(state = getState()) {
    const next = !isExpanded(state);
    setExpanded(next, state);
    return next;
  }

  return {
    version: "V340",
    buildViewModel,
    isExpanded,
    render,
    renderInto,
    setExpanded,
    toggle
  };
}
