(function tableColumnResizerV571() {
  "use strict";

  const STORAGE_KEY = "fantaTableResizeV571Enabled";
  const LEGACY_STORAGE_KEY = "fantaTableResizeV570Enabled";
  const LOG_PREFIX = "[Fanta V571 colonne]";
  const MIN_WIDTH = 42;
  const MAX_WIDTH = 560;
  const RESCAN_DELAY = 160;

  const TABLE_DEFINITIONS = [
    {
      key: "teamarea-roster",
      label: "Area Squadra - Rosa",
      selector: "#teamAreaBody .team-profile-roster-table, #teamAreaBody .roster-player-table, #teamAreaBody .roster-main-table",
      cssScope: ".teamarea-roster-table-v571"
    },
    {
      key: "rose-expanded",
      label: "Rose - Rosa espansa",
      selector: "[data-page='clubs'] .roster-player-table, [data-page='clubs'] .roster-main-table, [data-page='clubs'] .team-profile-roster-table, #rosterDialog .team-profile-roster-table",
      cssScope: ".rose-expanded-table-v571"
    },
    {
      key: "listone",
      label: "Listone",
      selector: "[data-page='listone'] table.listone-table",
      cssScope: ".listone-table-v571"
    }
  ];

  let enabled = false;
  let observer = null;
  let resizeState = null;
  let scanTimer = 0;
  let badgeNode = null;

  function getParams() {
    try { return new URLSearchParams(window.location.search || ""); }
    catch (_) { return new URLSearchParams(); }
  }

  function getStoredEnabled() {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return true;
      if (localStorage.getItem(LEGACY_STORAGE_KEY) === "1") return true;
    } catch (_) {}
    return false;
  }

  function shouldEnableFromLocation() {
    const params = getParams();
    const enableValues = ["1", "true", "yes", "on"];
    const disableValues = ["0", "false", "no", "off"];
    const raw = params.get("resizeTabelle") || params.get("tableSizer") || params.get("resizeTables") || "";
    const normalized = String(raw).trim().toLowerCase();
    if (enableValues.includes(normalized)) return true;
    if (disableValues.includes(normalized)) return false;
    if ((window.location.hash || "").toLowerCase().includes("resize-tabelle")) return true;
    return getStoredEnabled();
  }

  function setStoredEnabled(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
      localStorage.setItem(LEGACY_STORAGE_KEY, value ? "1" : "0");
    } catch (_) {}
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function safeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function getHeaderCells(table) {
    return Array.from(table.querySelectorAll("thead tr:first-child th"));
  }

  function getColumnCount(table) {
    const headerCount = getHeaderCells(table).length;
    if (headerCount) return headerCount;
    const firstRow = table.querySelector("tr");
    return firstRow ? firstRow.children.length : 0;
  }

  function getColumnLabels(table) {
    const headers = getHeaderCells(table);
    if (headers.length) return headers.map((cell, index) => safeText(cell.textContent.replace(/\d+px/g, "")) || `Colonna ${index + 1}`);
    const firstRow = table.querySelector("tr");
    return firstRow ? Array.from(firstRow.children).map((cell, index) => safeText(cell.textContent) || `Colonna ${index + 1}`) : [];
  }

  function getDefinitionForTable(table) {
    return TABLE_DEFINITIONS.find((definition) => {
      try { return table.matches(definition.selector); }
      catch (_) { return false; }
    }) || null;
  }

  function getVisibleWidth(cell, fallback) {
    const rect = cell?.getBoundingClientRect?.();
    if (rect && rect.width > 0) return Math.round(rect.width);
    return fallback;
  }

  function ensureColgroup(table) {
    const count = getColumnCount(table);
    if (!count) return null;
    let colgroup = table.querySelector(":scope > colgroup[data-fanta-table-resize-v571]");
    if (!colgroup) {
      colgroup = document.createElement("colgroup");
      colgroup.dataset.fantaTableResizeV571 = "true";
      table.insertBefore(colgroup, table.firstChild);
    }
    while (colgroup.children.length < count) colgroup.appendChild(document.createElement("col"));
    while (colgroup.children.length > count) colgroup.removeChild(colgroup.lastElementChild);
    return colgroup;
  }

  function getWidths(table) {
    const colgroup = table.querySelector(":scope > colgroup[data-fanta-table-resize-v571]");
    const cols = colgroup ? Array.from(colgroup.children) : [];
    const headers = getHeaderCells(table);
    const count = getColumnCount(table);
    const widths = [];
    for (let index = 0; index < count; index += 1) {
      const fromCol = parseFloat(cols[index]?.style.width || "");
      const measured = getVisibleWidth(headers[index], index === 0 ? 112 : 86);
      widths.push(Math.round(clamp(Number.isFinite(fromCol) && fromCol > 0 ? fromCol : measured, MIN_WIDTH, MAX_WIDTH)));
    }
    return widths;
  }

  function setWidths(table, widths) {
    const colgroup = ensureColgroup(table);
    if (!colgroup) return;
    let total = 0;
    widths.forEach((width, index) => {
      const normalized = Math.round(clamp(Number(width) || MIN_WIDTH, MIN_WIDTH, MAX_WIDTH));
      colgroup.children[index].style.width = `${normalized}px`;
      total += normalized;
    });
    table.style.tableLayout = "fixed";
    table.style.width = `${total}px`;
    table.style.minWidth = `${total}px`;
    table.dataset.fantaResizeWidthsV571 = widths.map((width) => Math.round(width)).join(",");
    updateHeaderLabels(table, widths);
  }

  function updateHeaderLabels(table, widths) {
    getHeaderCells(table).forEach((cell, index) => {
      let label = cell.querySelector(":scope > .fanta-table-resize-label-v571");
      if (!label) {
        label = document.createElement("span");
        label.className = "fanta-table-resize-label-v571";
        cell.appendChild(label);
      }
      label.textContent = `${Math.round(widths[index] || 0)}px`;
    });
  }

  function removeHeaderLabels(table) {
    table.querySelectorAll(".fanta-table-resize-label-v571").forEach((node) => node.remove());
  }

  function addHandles(table) {
    const headers = getHeaderCells(table);
    headers.forEach((cell, index) => {
      if (cell.querySelector(":scope > .fanta-table-resize-handle-v571")) return;
      const handle = document.createElement("span");
      handle.className = "fanta-table-resize-handle-v571";
      handle.setAttribute("role", "separator");
      handle.setAttribute("aria-orientation", "vertical");
      handle.setAttribute("tabindex", "0");
      handle.setAttribute("aria-label", `Ridimensiona ${safeText(cell.textContent) || `colonna ${index + 1}`}`);
      handle.dataset.fantaColumnIndexV571 = String(index);
      handle.title = "Trascina lateralmente per ridimensionare la colonna";
      const grip = document.createElement("span");
      grip.className = "fanta-table-resize-grip-v571";
      grip.setAttribute("aria-hidden", "true");
      grip.textContent = "<>";
      handle.appendChild(grip);
      handle.addEventListener("pointerdown", onHandlePointerDown);
      handle.addEventListener("keydown", onHandleKeyDown);
      handle.addEventListener("dblclick", onHandleDoubleClick);
      cell.appendChild(handle);
    });
  }

  function removeHandles(table) {
    table.querySelectorAll(".fanta-table-resize-handle-v571").forEach((node) => node.remove());
  }

  function classifyAndMark(table, definition) {
    table.classList.add("fanta-table-resizable-v571");
    table.dataset.fantaTableResizeKeyV571 = definition.key;
    table.dataset.fantaTableResizeLabelV571 = definition.label;
    table.dataset.fantaTableResizeScopeV571 = definition.cssScope;
    if (definition.key === "teamarea-roster") table.classList.add("teamarea-roster-table-v571");
    if (definition.key === "rose-expanded") table.classList.add("rose-expanded-table-v571");
    if (definition.key === "listone") table.classList.add("listone-table-v571");
  }

  function setupTable(table) {
    if (!enabled || !table || table.dataset.fantaTableResizeReadyV571 === "1") return;
    const definition = getDefinitionForTable(table);
    if (!definition) return;
    const rect = table.getBoundingClientRect();
    if (!rect.width && !table.offsetParent) return;
    classifyAndMark(table, definition);
    const widths = getWidths(table);
    setWidths(table, widths);
    addHandles(table);
    table.dataset.fantaTableResizeReadyV571 = "1";
  }

  function teardownTable(table) {
    if (!table?.classList?.contains("fanta-table-resizable-v571")) return;
    removeHandles(table);
    removeHeaderLabels(table);
    const colgroup = table.querySelector(":scope > colgroup[data-fanta-table-resize-v571]");
    colgroup?.remove();
    table.style.tableLayout = "";
    table.style.width = "";
    table.style.minWidth = "";
    table.classList.remove("fanta-table-resizable-v571", "teamarea-roster-table-v571", "rose-expanded-table-v571", "listone-table-v571", "fanta-table-resizing-v571");
    delete table.dataset.fantaTableResizeReadyV571;
    delete table.dataset.fantaResizeWidthsV571;
  }

  function scanTables() {
    if (!enabled) return;
    TABLE_DEFINITIONS.forEach((definition) => {
      document.querySelectorAll(definition.selector).forEach((table) => setupTable(table));
    });
  }

  function scheduleScan() {
    if (!enabled) return;
    clearTimeout(scanTimer);
    scanTimer = window.setTimeout(scanTables, RESCAN_DELAY);
  }

  function cssVariableName(table, index) {
    const key = table.dataset.fantaTableResizeKeyV571 || "table";
    return `--fanta-${key}-col-${index + 1}`;
  }

  function buildCssSnippet(table, widths, labels) {
    const scope = table.dataset.fantaTableResizeScopeV571 || ".fanta-table-resizable-v571";
    const variables = widths.map((width, index) => `  ${cssVariableName(table, index)}: ${Math.round(width)}px; /* ${labels[index] || `Colonna ${index + 1}`} */`).join("\n");
    const colRules = widths.map((_, index) => `  ${scope} col:nth-child(${index + 1}) { width: var(${cssVariableName(table, index)}); }`).join("\n");
    return `:root {\n${variables}\n}\n\n@media (max-width: 760px) {\n${colRules}\n}`;
  }

  function getTableReport(table) {
    const widths = getWidths(table);
    const labels = getColumnLabels(table);
    return {
      key: table.dataset.fantaTableResizeKeyV571 || "table",
      label: table.dataset.fantaTableResizeLabelV571 || "Tabella",
      widths,
      labels,
      columns: widths.map((width, index) => ({
        index: index + 1,
        column: labels[index] || `Colonna ${index + 1}`,
        widthPx: Math.round(width),
        cssVar: cssVariableName(table, index)
      })),
      css: buildCssSnippet(table, widths, labels)
    };
  }

  function getAllReports() {
    return Array.from(document.querySelectorAll(".fanta-table-resizable-v571")).map((table) => getTableReport(table));
  }

  function logReport(table, reason = "resize") {
    const report = getTableReport(table);
    window.fantaTableResizeV571Last = report;
    const allReports = getAllReports();
    window.fantaTableResizeV571All = allReports;
    console.info(`${LOG_PREFIX} ${report.label} (${reason})`);
    try { console.table(report.columns); } catch (_) {}
    console.info(`${LOG_PREFIX} CSS da copiare per ${report.label}:\n${report.css}`);
    console.info(`${LOG_PREFIX} Tutte le tabelle disponibili in window.fantaTableResizeV571All`, allReports);
    return report;
  }

  function ensureBadge() {
    if (badgeNode) return;
    badgeNode = document.createElement("div");
    badgeNode.className = "fanta-table-resize-badge-v571";
    badgeNode.innerHTML = "<strong>Ridimensionamento tabelle V571 attivo</strong><span>Usa gli indicatori <code>&lt;&gt;</code> tra le colonne. Da mobile trascina il pulsante laterale con il dito. A fine drag la Console stampa i pixel.</span>";
    document.body.appendChild(badgeNode);
  }

  function updateBadgeDuringResize(table, index, width) {
    ensureBadge();
    const labels = getColumnLabels(table);
    const label = labels[index] || `Colonna ${index + 1}`;
    const tableLabel = table.dataset.fantaTableResizeLabelV571 || "Tabella";
    badgeNode.innerHTML = `<strong>${tableLabel}</strong><span>${label}: <code>${Math.round(width)}px</code></span><small>Rilascia per stampare i valori in Console.</small>`;
  }

  function resetBadgeText() {
    if (!badgeNode) return;
    badgeNode.innerHTML = "<strong>Ridimensionamento tabelle V571 attivo</strong><span>Trascina gli indicatori <code>&lt;&gt;</code>. Usa <code>FantaTableResizeV571.print()</code> per ristampare.</span>";
  }

  function onHandlePointerDown(event) {
    if (!enabled) return;
    const handle = event.currentTarget;
    const table = handle.closest("table");
    if (!table) return;
    const index = Number(handle.dataset.fantaColumnIndexV571 || 0);
    const widths = getWidths(table);
    resizeState = {
      table,
      handle,
      index,
      startX: event.clientX,
      startWidth: widths[index] || MIN_WIDTH,
      widths,
      pointerId: event.pointerId
    };
    table.classList.add("fanta-table-resizing-v571");
    handle.classList.add("fanta-table-resize-handle-active-v571");
    updateBadgeDuringResize(table, index, widths[index] || MIN_WIDTH);
    handle.setPointerCapture?.(event.pointerId);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp, { once: true });
    window.addEventListener("pointercancel", onPointerUp, { once: true });
    event.preventDefault();
  }

  function onPointerMove(event) {
    if (!resizeState) return;
    const delta = event.clientX - resizeState.startX;
    const nextWidth = clamp(resizeState.startWidth + delta, MIN_WIDTH, MAX_WIDTH);
    resizeState.widths[resizeState.index] = nextWidth;
    setWidths(resizeState.table, resizeState.widths);
    updateBadgeDuringResize(resizeState.table, resizeState.index, nextWidth);
    event.preventDefault();
  }

  function onPointerUp() {
    if (!resizeState) return;
    const table = resizeState.table;
    table.classList.remove("fanta-table-resizing-v571");
    resizeState.handle?.classList?.remove("fanta-table-resize-handle-active-v571");
    setWidths(table, resizeState.widths);
    logReport(table, "fine ridimensionamento");
    resizeState = null;
    resetBadgeText();
    window.removeEventListener("pointermove", onPointerMove);
  }

  function onHandleKeyDown(event) {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const handle = event.currentTarget;
    const table = handle.closest("table");
    if (!table) return;
    const index = Number(handle.dataset.fantaColumnIndexV571 || 0);
    const widths = getWidths(table);
    const step = event.shiftKey ? 20 : 6;
    widths[index] = clamp((widths[index] || MIN_WIDTH) + (event.key === "ArrowRight" ? step : -step), MIN_WIDTH, MAX_WIDTH);
    setWidths(table, widths);
    updateBadgeDuringResize(table, index, widths[index]);
    logReport(table, "tastiera");
    event.preventDefault();
  }

  function onHandleDoubleClick(event) {
    const handle = event.currentTarget;
    const table = handle.closest("table");
    if (!table) return;
    const index = Number(handle.dataset.fantaColumnIndexV571 || 0);
    const headers = getHeaderCells(table);
    const widths = getWidths(table);
    widths[index] = clamp(getVisibleWidth(headers[index], widths[index] || 86), MIN_WIDTH, MAX_WIDTH);
    setWidths(table, widths);
    logReport(table, "doppio click");
    event.preventDefault();
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver(scheduleScan);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    window.addEventListener("hashchange", scheduleScan);
    window.addEventListener("resize", scheduleScan);
    document.addEventListener("click", scheduleScan, true);
  }

  function stopObserver() {
    observer?.disconnect();
    observer = null;
    window.removeEventListener("hashchange", scheduleScan);
    window.removeEventListener("resize", scheduleScan);
    document.removeEventListener("click", scheduleScan, true);
  }

  function enable(options = {}) {
    enabled = true;
    setStoredEnabled(true);
    document.documentElement.classList.add("fanta-table-resize-v571-enabled");
    if (!options.silent) console.info(`${LOG_PREFIX} attivo. Usa FantaTableResizeV571.print() per ristampare le misure.`);
    ensureBadge();
    resetBadgeText();
    startObserver();
    scanTables();
    window.setTimeout(scanTables, 600);
    window.setTimeout(scanTables, 1400);
    window.setTimeout(scanTables, 2600);
  }

  function disable() {
    enabled = false;
    setStoredEnabled(false);
    stopObserver();
    document.documentElement.classList.remove("fanta-table-resize-v571-enabled");
    document.querySelectorAll(".fanta-table-resizable-v571").forEach((table) => teardownTable(table));
    badgeNode?.remove();
    badgeNode = null;
    console.info(`${LOG_PREFIX} disattivato.`);
  }

  function print() {
    scanTables();
    const reports = getAllReports();
    window.fantaTableResizeV571All = reports;
    if (!reports.length) {
      console.warn(`${LOG_PREFIX} nessuna tabella trovata. Apri Area Squadra, Rose o Listone e riprova.`);
      return [];
    }
    reports.forEach((report) => {
      console.info(`${LOG_PREFIX} ${report.label}`);
      try { console.table(report.columns); } catch (_) {}
      console.info(report.css);
    });
    return reports;
  }

  window.FantaTableResizeV571 = {
    enable,
    disable,
    print,
    scan: scanTables,
    reports: getAllReports,
    version: "571"
  };

  window.FantaTableResizeV570 = window.FantaTableResizeV571;

  const params = getParams();
  const raw = params.get("resizeTabelle") || params.get("tableSizer") || params.get("resizeTables") || "";
  if (["0", "false", "no", "off"].includes(String(raw).trim().toLowerCase())) {
    setStoredEnabled(false);
    return;
  }

  if (shouldEnableFromLocation()) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => enable({ silent: true }), { once: true });
    else enable({ silent: true });
  }
})();
