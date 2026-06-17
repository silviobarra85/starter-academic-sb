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

  function getLatestTeamSnapshotGeneratedAt() {
    const snapshots = Object.values(state.teamSnapshotCache || {});
    const dates = snapshots
      .map((snapshot) => snapshot?.generatedAt || snapshot?.updatedAt || snapshot?.createdAt || "")
      .filter(Boolean)
      .map((value) => {
        try {
          const date = typeof value?.toDate === "function"
            ? value.toDate()
            : typeof value?.seconds === "number"
              ? new Date(value.seconds * 1000)
              : new Date(value);
          return Number.isNaN(date.getTime()) ? null : date;
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => b.getTime() - a.getTime());
    return dates[0]?.toISOString() || "";
  }

  function renderSnapshotActionButton({ id, variant = "button-secondary", title, dateText, type = "button" }) {
    return `<button id="${escapeHtml(id)}" class="button ${escapeHtml(variant)} snapshot-action-button" type="${escapeHtml(type)}">
      <span class="snapshot-button-title">${escapeHtml(title)}</span>
      <span class="snapshot-button-date">Ultimo: ${escapeHtml(dateText || "non trovato")}</span>
    </button>`;
  }

  function renderBasePanel() {
    const seasonId = getCurrentSeasonId();
    const seasonGenerated = getSnapshotDateText(getCurrentSeasonSnapshotGeneratedAt());
    const honorGenerated = getSnapshotDateText(getHonorSnapshotGeneratedAt());
    const teamGenerated = getSnapshotDateText(getLatestTeamSnapshotGeneratedAt());
    return renderAdminPanel("adminPublicSnapshotsPanel", "Ottimizzazione", "Snapshot pubblici", "Genera documenti leggeri. Il sito pubblico legge questi snapshot invece delle raccolte complete.", `
      <div class="snapshot-actions-grid">
        ${renderSnapshotActionButton({ id: "adminGenerateSelectedSeasonSnapshot", variant: "button-primary", title: `Aggiorna stagione selezionata (${seasonId || "-"})`, dateText: seasonGenerated })}
        ${renderSnapshotActionButton({ id: "adminGenerateAllSeasonSnapshots", title: "Aggiorna tutte le stagioni", dateText: seasonGenerated })}
        ${renderSnapshotActionButton({ id: "adminGenerateHonorSnapshot", title: "Aggiorna Albo/FIFA", dateText: honorGenerated })}
        ${renderSnapshotActionButton({ id: "adminGenerateTeamSnapshots", title: "Aggiorna schede squadra", dateText: teamGenerated })}
        ${renderSnapshotActionButton({ id: "adminGenerateEverythingSnapshots", variant: "button-primary", title: "Aggiorna tutto", dateText: `Stagione ${seasonGenerated} · Albo ${honorGenerated}` })}
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
    const teamGenerated = getSnapshotDateText(getLatestTeamSnapshotGeneratedAt());

    if (state.isAdmin && typeof scheduleLoadPublicSnapshotDates === "function") {
      setTimeout(() => scheduleLoadPublicSnapshotDates(seasonId), 0);
    }

    return renderAdminPanel("adminPublicSnapshotsPanel", "Ottimizzazione", "Snapshot pubblici", "Genera documenti leggeri. Il sito pubblico legge questi snapshot invece delle raccolte complete.", `
      <div class="snapshot-actions-grid">
        ${renderSnapshotActionButton({ id: "adminGenerateSelectedSeasonSnapshot", variant: "button-primary", title: `Aggiorna stagione selezionata (${seasonId || "-"})`, dateText: seasonGenerated })}
        ${renderSnapshotActionButton({ id: "adminGenerateNewsSnapshot", title: "Aggiorna comunicati", dateText: seasonGenerated })}
        ${renderSnapshotActionButton({ id: "adminGenerateCompetitionDataSnapshot", title: "Aggiorna competizioni e classifiche", dateText: seasonGenerated })}
        ${renderSnapshotActionButton({ id: "adminGenerateAllSeasonSnapshots", title: "Aggiorna tutte le stagioni", dateText: seasonGenerated })}
        ${renderSnapshotActionButton({ id: "adminGenerateHonorSnapshot", title: "Aggiorna Albo/FIFA", dateText: honorGenerated })}
        ${renderSnapshotActionButton({ id: "adminGenerateTeamSnapshots", title: "Aggiorna schede squadra", dateText: teamGenerated })}
        ${renderSnapshotActionButton({ id: "adminGenerateEverythingSnapshots", variant: "button-primary", title: "Aggiorna tutto", dateText: `Stagione ${seasonGenerated} · Albo ${honorGenerated}` })}
      </div>
      <p id="adminPublicSnapshotsStatus" class="form-status"></p>
      <div class="snapshot-last-updates">
        <small class="field-hint"><strong>Ultimo snapshot stagione selezionata:</strong> ${escapeHtml(seasonGenerated)}.</small>
        <small class="field-hint"><strong>Ultimo snapshot Albo/FIFA:</strong> ${escapeHtml(honorGenerated)}.</small>
      </div>
      <small class="field-hint">Per pubblicare un comunicato: salva/approva il comunicato, premi <strong>Aggiorna comunicati</strong>, poi scarica/applica lo snapshot stagione se vuoi renderlo stabile anche nei JSON statici dopo logout/refresh. Il link WhatsApp dinamico legge gia il comunicato da Firebase.</small>
      <small class="field-hint">Comunicati, competizioni e classifiche della stagione sono dentro <code>publicSeasonSnapshots/${escapeHtml(seasonId || "stagione")}</code>. Albo e FIFA sono dentro <code>publicSnapshots/honor</code>.</small>`);
  }

  return {
    formatSnapshotTimestamp,
    getSnapshotDateText,
    getCurrentSeasonSnapshotGeneratedAt,
    renderBasePanel,
    renderFullPanel,
    renderSnapshotActionButton
  };
}
