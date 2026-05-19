/* Mobile table setup.
   Tables keep the readable mobile classes/sticky styling, but table-level
   collapse buttons are disabled: only the parent section toggle is shown. */
export function setupMobileTables() {
  let tableSequence = 0;
  let scheduled = false;

  function getTableWrapper(table) {
    return table.closest(
      ".table-wrap, .mobile-tabular-wrap, .compact-table, .standing-table-wrap, .roster-dialog-table, .mini-table-wrap, .honor-table-wrap"
    );
  }

  function removeTableControls(wrapper) {
    const tableId = wrapper?.dataset?.v45TableId;
    if (!tableId) return;

    const controls = wrapper.previousElementSibling;
    if (
      controls
      && controls.classList.contains("mobile-table-actions")
      && controls.dataset.controlsTable === tableId
    ) {
      controls.remove();
    }
  }

  function ensureTable(table) {
    if (!table || table.dataset.v45MobileControls === "skip") return;

    const wrapper = getTableWrapper(table);
    if (!wrapper) return;

    wrapper.classList.add("v45-mobile-table-wrap");
    table.classList.add("v45-mobile-table");

    if (!wrapper.dataset.v45TableId) {
      tableSequence += 1;
      wrapper.dataset.v45TableId = `v45-mobile-table-${tableSequence}`;
    }

    wrapper.classList.remove("mobile-table-is-collapsed");
    removeTableControls(wrapper);
  }

  function ensureMobileTables() {
    scheduled = false;
    document.querySelectorAll("table").forEach(ensureTable);
  }

  function scheduleEnsureMobileTables() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(ensureMobileTables);
  }

  if (document.body) {
    const observer = new MutationObserver(scheduleEnsureMobileTables);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", scheduleEnsureMobileTables);
  window.addEventListener("load", scheduleEnsureMobileTables);
  window.addEventListener("resize", scheduleEnsureMobileTables);
  scheduleEnsureMobileTables();
}
