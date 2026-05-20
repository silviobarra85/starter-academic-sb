export function createPublicSnapshotAdminHelpersV129({
  state,
  escapeHtml,
  renderAdminPanel,
  getCurrentSeasonId,
  scheduleLoadPublicSnapshotDates
}) {
  function formatSnapshotTimestamp(value) {
    if (!value) return "-";
    try {
      const date = typeof value?.toDate === "function"
        ? value.toDate()
        : typeof value?.seconds === "number"
          ? new Date(value.seconds * 1000)
          : new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" });
    } catch (error) {
      return String(value);
    }
  }

  function getSnapshotDateText(value) {
    const formatted = formatSnapshotTimestamp(value);
    return formatted && formatted !== "-" ? formatted : "non trovato";
  }

  function getCurrentSeasonSnapshotGeneratedAt() {
    const seasonId = getCurrentSeasonId();
    const snapshot = seasonId ? state.publicSeasonSnapshots?.[seasonId] : null;
    return snapshot?.generatedAt || snapshot?.updatedAt || snapshot?.createdAt || "";
  }

  function getHonorSnapshotGeneratedAt() {
    return state.publicHonorSnapshot?.generatedAt || state.publicHonorSnapshot?.updatedAt || state.publicHonorSnapshot?.createdAt || "";
  }

  function renderBasePanel() {
    const seasonId = getCurrentSeasonId();
    const seasonGenerated = formatSnapshotTimestamp(getCurrentSeasonSnapshotGeneratedAt());
    const honorGenerated = formatSnapshotTimestamp(getHonorSnapshotGeneratedAt());
    return renderAdminPanel("adminPublicSnapshotsPanel", "Ottimizzazione", "Snapshot pubblici", "Genera documenti leggeri. Il sito pubblico legge questi snapshot invece delle raccolte complete.", `
      <div class="snapshot-actions-grid">
        <button id="adminGenerateSelectedSeasonSnapshot" class="button button-primary" type="button">Aggiorna stagione selezionata (${escapeHtml(seasonId || "-")})</button>
        <button id="adminGenerateAllSeasonSnapshots" class="button button-secondary" type="button">Aggiorna tutte le stagioni</button>
        <button id="adminGenerateHonorSnapshot" class="button button-secondary" type="button">Aggiorna Albo/FIFA</button>
        <button id="adminGenerateTeamSnapshots" class="button button-secondary" type="button">Aggiorna schede squadra</button>
        <button id="adminGenerateEverythingSnapshots" class="button button-primary" type="button">Aggiorna tutto</button>
      </div>
      <p id="adminPublicSnapshotsStatus" class="form-status"></p>
      <div class="snapshot-last-updates">
        <small class="field-hint"><strong>Ultimo snapshot stagione selezionata:</strong> ${escapeHtml(seasonGenerated)}.</small>
        <small class="field-hint"><strong>Ultimo snapshot Albo/FIFA:</strong> ${escapeHtml(honorGenerated)}.</small>
      </div>
      <small class="field-hint">Se aggiorni dati ufficiali, rigenera gli snapshot pubblici.</small>`);
  }

  function renderFullPanel() {
    const seasonId = getCurrentSeasonId();
    const seasonSnapshot = seasonId ? state.publicSeasonSnapshots?.[seasonId] : null;
    const seasonGenerated = getSnapshotDateText(seasonSnapshot?.generatedAt || seasonSnapshot?.updatedAt || seasonSnapshot?.createdAt || "");
    const honorGenerated = getSnapshotDateText(getHonorSnapshotGeneratedAt());

    if (state.isAdmin && typeof scheduleLoadPublicSnapshotDates === "function") {
      setTimeout(() => scheduleLoadPublicSnapshotDates(seasonId), 0);
    }

    return renderAdminPanel("adminPublicSnapshotsPanel", "Ottimizzazione", "Snapshot pubblici", "Genera documenti leggeri. Il sito pubblico legge questi snapshot invece delle raccolte complete.", `
      <div class="snapshot-actions-grid">
        <button id="adminGenerateSelectedSeasonSnapshot" class="button button-primary" type="button">Aggiorna stagione selezionata (${escapeHtml(seasonId || "-")})</button>
        <button id="adminGenerateNewsSnapshot" class="button button-secondary" type="button">Aggiorna comunicati</button>
        <button id="adminGenerateCompetitionDataSnapshot" class="button button-secondary" type="button">Aggiorna competizioni e classifiche</button>
        <button id="adminGenerateAllSeasonSnapshots" class="button button-secondary" type="button">Aggiorna tutte le stagioni</button>
        <button id="adminGenerateHonorSnapshot" class="button button-secondary" type="button">Aggiorna Albo/FIFA</button>
        <button id="adminGenerateTeamSnapshots" class="button button-secondary" type="button">Aggiorna schede squadra</button>
        <button id="adminGenerateEverythingSnapshots" class="button button-primary" type="button">Aggiorna tutto</button>
      </div>
      <p id="adminPublicSnapshotsStatus" class="form-status"></p>
      <div class="snapshot-last-updates">
        <small class="field-hint"><strong>Ultimo snapshot stagione selezionata:</strong> ${escapeHtml(seasonGenerated)}.</small>
        <small class="field-hint"><strong>Ultimo snapshot Albo/FIFA:</strong> ${escapeHtml(honorGenerated)}.</small>
      </div>
      <small class="field-hint">Comunicati, competizioni e classifiche della stagione sono dentro <code>publicSeasonSnapshots/${escapeHtml(seasonId || "stagione")}</code>. Albo e FIFA sono dentro <code>publicSnapshots/honor</code>.</small>`);
  }

  return {
    formatSnapshotTimestamp,
    getSnapshotDateText,
    getCurrentSeasonSnapshotGeneratedAt,
    renderBasePanel,
    renderFullPanel
  };
}
