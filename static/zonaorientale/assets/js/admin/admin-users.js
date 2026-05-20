export function createAdminUserApprovalHelpersV129({
  state,
  escapeHtml,
  requestStatusLabel,
  getSeasonTeamById,
  getTeamById,
  renderAdminPanel
}) {
  function renderApprovedUserSummary(user) {
    const seasonTeam = getSeasonTeamById(user.seasonTeamId);
    const team = getTeamById(user.teamId);
    const label = user.displayName || user.email || user.id || "Utente";
    const teamLabel = seasonTeam?.name || team?.canonicalName || user.teamName || user.seasonTeamId || "Squadra non associata";
    const meta = [
      user.email || "",
      user.seasonId || seasonTeam?.seasonId || "",
      teamLabel,
      requestStatusLabel(user.status || "ACTIVE")
    ].filter(Boolean).join(" · ");
    return `
      <div class="admin-list-item admin-user-approval-item admin-user-approved-item">
        <span>
          <strong>${escapeHtml(label)}</strong>
          <small>${escapeHtml(meta)}</small>
        </span>
        <span><span class="status status-success">APPROVATO</span></span>
      </div>`;
  }

  function renderPendingUserApprovalRow(user, presidentOptions, teamOptions, seasonTeamOptions) {
    return `
      <div class="admin-list-item admin-user-approval-item">
        <span>
          <strong>${escapeHtml(user.displayName || user.email || user.id)}</strong>
          <small>${escapeHtml(user.email || "")} · ${escapeHtml(requestStatusLabel(user.status))}</small>
        </span>
        <span class="admin-approval-controls">
          <select class="input" id="approvePresident_${escapeHtml(user.id)}"><option value="">Presidente...</option>${presidentOptions}</select>
          <select class="input" id="approveTeam_${escapeHtml(user.id)}"><option value="">Squadra madre...</option>${teamOptions}</select>
          <select class="input" id="approveSeasonTeam_${escapeHtml(user.id)}"><option value="">Rosa/stagione...</option>${seasonTeamOptions}</select>
          <button class="button button-primary button-small" type="button" data-approve-user="${escapeHtml(user.id)}">Approva</button>
          <button class="button button-danger button-small" type="button" data-reject-user="${escapeHtml(user.id)}">Rifiuta</button>
        </span>
      </div>`;
  }

  function buildApprovedUsers(pendingUsers, teamUsers) {
    const approvedByUid = new Map();

    pendingUsers
      .filter((item) => item.status === "APPROVED")
      .forEach((item) => approvedByUid.set(item.id, item));

    teamUsers
      .filter((item) => item.status !== "DISABLED")
      .forEach((item) => {
        if (!approvedByUid.has(item.id)) approvedByUid.set(item.id, item);
      });

    return Array.from(approvedByUid.values()).sort((a, b) => {
      const aName = a.displayName || a.email || a.id || "";
      const bName = b.displayName || b.email || b.id || "";
      return String(aName).localeCompare(String(bName), "it", { sensitivity: "base" });
    });
  }

  function renderPendingUsersPanel() {
    const pendingUsers = state.raw.pendingUsers || [];
    const pending = pendingUsers.filter((item) => item.status !== "APPROVED");
    const approved = buildApprovedUsers(pendingUsers, state.raw.teamUsers || []);

    const presidentOptions = state.raw.presidents.map((president) => `<option value="${escapeHtml(president.id)}">${escapeHtml(president.name || president.id)}</option>`).join("");
    const teamOptions = state.raw.teams.map((team) => `<option value="${escapeHtml(team.id)}">${escapeHtml(team.canonicalName || team.id)}</option>`).join("");
    const seasonTeamOptions = state.raw.seasonTeams.map((seasonTeam) => `<option value="${escapeHtml(seasonTeam.id)}">${escapeHtml(seasonTeam.seasonId)} · ${escapeHtml(seasonTeam.name || seasonTeam.id)}</option>`).join("");

    const pendingRows = pending.map((user) => renderPendingUserApprovalRow(user, presidentOptions, teamOptions, seasonTeamOptions)).join("") || `<p class="muted admin-empty-message">Nessun utente in attesa.</p>`;
    const approvedRows = approved.map(renderApprovedUserSummary).join("") || `<p class="muted admin-empty-message">Nessun utente approvato.</p>`;

    return renderAdminPanel("adminPendingUsersPanel", "Utenti", "Accetta utenti", "Approva i presidenti registrati, rifiuta eliminando la richiesta e consulta gli accessi gia approvati.", `
      <div class="admin-subsection-block">
        <h3>Richieste in attesa</h3>
        <div class="admin-list">${pendingRows}</div>
      </div>
      <div class="admin-subsection-block">
        <h3>Accessi approvati</h3>
        <p class="muted">Elenco degli utenti gia accettati: utile per verificare quali presidenti non hanno ancora richiesto l'accesso.</p>
        <div class="admin-list">${approvedRows}</div>
      </div>`);
  }

  return {
    renderApprovedUserSummary,
    renderPendingUserApprovalRow,
    buildApprovedUsers,
    renderPendingUsersPanel
  };
}
