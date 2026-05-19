/* Mobile table controls and readable sticky tables.
   The controls are hidden on desktop; on mobile every table can be collapsed/expanded
   and every table scrolls inside its own wrapper with sticky header/first column. */
export function setupMobileTables() {
  let tableSequence = 0;
  let scheduled = false;

  function getTableWrapper(table) {
    return table.closest(
      ".table-wrap, .mobile-tabular-wrap, .compact-table, .standing-table-wrap, .roster-dialog-table, .mini-table-wrap, .honor-table-wrap"
    );
  }

  function updateToggleLabel(button, wrapper) {
    const isCollapsed = wrapper.classList.contains("mobile-table-is-collapsed");
    button.textContent = isCollapsed ? "Espandi" : "Riduci";
    button.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  }

  function ensureControlsForTable(table) {
    if (!table || table.dataset.v45MobileControls === "skip") return;

    const wrapper = getTableWrapper(table);
    if (!wrapper) return;

    wrapper.classList.add("v45-mobile-table-wrap");
    table.classList.add("v45-mobile-table");

    if (!wrapper.dataset.v45TableId) {
      tableSequence += 1;
      wrapper.dataset.v45TableId = `v45-mobile-table-${tableSequence}`;
    }

    let controls = wrapper.previousElementSibling;
    const needsControls = !controls
      || !controls.classList.contains("mobile-table-actions")
      || controls.dataset.controlsTable !== wrapper.dataset.v45TableId;

    if (needsControls) {
      controls = document.createElement("div");
      controls.className = "mobile-table-actions";
      controls.dataset.controlsTable = wrapper.dataset.v45TableId;
      controls.innerHTML = `<button class="button button-secondary button-small mobile-table-toggle" type="button" data-mobile-table-toggle="${wrapper.dataset.v45TableId}" aria-expanded="true">Riduci</button>`;
      wrapper.parentNode?.insertBefore(controls, wrapper);
    }

    const button = controls.querySelector("[data-mobile-table-toggle]");
    if (button) updateToggleLabel(button, wrapper);
  }

  function ensureMobileTables() {
    scheduled = false;
    document.querySelectorAll("table").forEach(ensureControlsForTable);
  }

  function scheduleEnsureMobileTables() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(ensureMobileTables);
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-mobile-table-toggle]");
    if (!button) return;

    const tableId = button.dataset.mobileTableToggle;
    const safeTableId = tableId ? String(tableId).replaceAll("\\", "\\\\").replaceAll('"', '\\"') : "";
    const wrapper = safeTableId ? document.querySelector(`[data-v45-table-id="${safeTableId}"]`) : null;
    if (!wrapper) return;

    wrapper.classList.toggle("mobile-table-is-collapsed");
    updateToggleLabel(button, wrapper);
  }, true);

  if (document.body) {
    const observer = new MutationObserver(scheduleEnsureMobileTables);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", scheduleEnsureMobileTables);
  window.addEventListener("load", scheduleEnsureMobileTables);
  window.addEventListener("resize", scheduleEnsureMobileTables);
  scheduleEnsureMobileTables();
}
