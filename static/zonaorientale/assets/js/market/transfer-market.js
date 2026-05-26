// Helper puri e renderer leggeri per Fantamercato e trattative.
// Estratti da assets/app.js in V128 per ridurre la crescita dell'orchestratore.

export function createTransferMarketHelpersV128(ctx) {
  const {
    state,
    escapeHtml,
    normalizeKey,
    normalizePlayerName,
    formatFm,
    parseDecimalValue,
    getApprovedTeamUser,
    getCurrentSeasonId,
    getSeasonTeamsForSeason,
    getSeasonTeamById,
    getRosterForSeasonTeam,
    getSeasonTeamDisplayName,
    getTeamFmBalance,
    sortRosterPlayersForDisplay
  } = ctx;

  function getApprovedSeasonTeamId() {
    return getApprovedTeamUser?.()?.seasonTeamId || "";
  }

  function getApprovedPresidentId() {
    return getApprovedTeamUser?.()?.presidentId || "";
  }

  function isOwnSeasonTeam(seasonTeamId) {
    return Boolean(seasonTeamId && seasonTeamId === getApprovedSeasonTeamId());
  }

  function getActiveSeasonTeamsForTrades(seasonId = getCurrentSeasonId()) {
    const ownId = getApprovedSeasonTeamId();
    const presidentId = getApprovedPresidentId();
    return getSeasonTeamsForSeason(seasonId).filter((seasonTeam) => {
      if (!seasonTeam?.id || seasonTeam.id === ownId) return false;
      if (seasonTeam.isHistorical || seasonTeam.isActive === false || seasonTeam.status === "NON_ATTIVA") return false;
      if (presidentId && Array.isArray(seasonTeam.presidentIds) && seasonTeam.presidentIds.includes(presidentId)) return false;
      return true;
    });
  }

  function getPlayerMarketKey(player) {
    return [normalizePlayerName(player?.playerName || player?.name || ""), normalizeKey(player?.realTeam || "")].filter(Boolean).join("__");
  }

  function getRosterPlayerByKey(seasonTeamId, playerKey) {
    const roster = getRosterForSeasonTeam(getSeasonTeamById(seasonTeamId));
    return (roster?.players || []).find((player) => getPlayerMarketKey(player) === playerKey) || null;
  }

  function getRosterCount(seasonTeamId) {
    const roster = getRosterForSeasonTeam(getSeasonTeamById(seasonTeamId));
    return Number(roster?.players?.length || 0);
  }

  function getActiveTransferListings(seasonId = getCurrentSeasonId()) {
    return (state.raw?.transferListings || []).filter((listing) =>
      listing.seasonId === seasonId && String(listing.status || "ACTIVE").toUpperCase() === "ACTIVE"
    );
  }

  function getListingForPlayer(seasonTeamId, player) {
    const key = getPlayerMarketKey(player);
    return getActiveTransferListings(player?.seasonId || getCurrentSeasonId()).find((listing) =>
      listing.seasonTeamId === seasonTeamId && (listing.playerKey === key || normalizePlayerName(listing.playerName) === normalizePlayerName(player?.playerName || ""))
    ) || null;
  }

  function renderTransferBadge(player, seasonTeamId) {
    const listing = getListingForPlayer(seasonTeamId || player?.seasonTeamId, player);
    if (!listing) return "";
    if (isOwnSeasonTeam(listing.seasonTeamId)) {
      return `<button class="status status-transfermarket transfer-badge-button" type="button" data-transfer-edit-listing="${escapeHtml(listing.id)}" title="Modifica o togli dal mercato">TRASF</button>`;
    }
    return `<span class="status status-transfermarket" title="Giocatore trasferibile">TRASF</span>`;
  }

  function renderRosterMarketAction(player, seasonTeamId) {
    if (!isOwnSeasonTeam(seasonTeamId)) return "";
    const listing = getListingForPlayer(seasonTeamId, player);
    const playerKey = getPlayerMarketKey(player);
    if (listing) {
      return `<button class="button button-secondary button-small" type="button" data-transfer-edit-listing="${escapeHtml(listing.id)}">Modifica</button>`;
    }
    return `<button class="button button-secondary button-small" type="button" data-transfer-list-player="${escapeHtml(playerKey)}" data-season-team-id="${escapeHtml(seasonTeamId)}">Metti in vendita</button>`;
  }

  function getTransferListingById(id) {
    return (state.raw?.transferListings || []).find((listing) => listing.id === id) || null;
  }

  function getNegotiationById(id) {
    return (state.raw?.transferNegotiations || []).find((item) => item.id === id) || null;
  }

  function serializePlayerRef(player, seasonTeamId) {
    return {
      playerKey: getPlayerMarketKey(player),
      playerName: player?.playerName || "",
      realTeam: player?.realTeam || "",
      rosterRole: player?.rosterRole || player?.role || player?.classicRole || "",
      cost: player?.cost ?? player?.rosterCost ?? "",
      seasonTeamId
    };
  }

  function formatPlayerRefs(players) {
    if (!players?.length) return "-";
    return players.map((player) => `${player.playerName || "-"}${player.realTeam ? ` (${player.realTeam})` : ""}`).join(", ");
  }

  function renderFmPart(value) {
    const amount = Number(value || 0);
    return amount ? `${formatFm(amount)} FM` : "-";
  }

  function getNegotiationStatusLabel(status) {
    const normalized = String(status || "PENDING").toUpperCase();
    const labels = { PENDING: "In attesa", ACCEPTED: "Accettata", REJECTED: "Rifiutata", CANCELLED: "Annullata" };
    return labels[normalized] || normalized;
  }

  function renderNegotiationStatusBadge(status) {
    const normalized = String(status || "PENDING").toUpperCase();
    const cls = normalized === "ACCEPTED" ? "status-ok" : normalized === "REJECTED" || normalized === "CANCELLED" ? "status-danger" : "status-warning";
    return `<span class="status ${cls}">${escapeHtml(getNegotiationStatusLabel(normalized))}</span>`;
  }

  function getNegotiationCompactSummary(item, isSent) {
    const offered = [formatPlayerRefs(item.offeredPlayers || []), renderFmPart(item.offeredFm)].filter((value) => value && value !== "-").join(" + ") || "-";
    const requested = [formatPlayerRefs(item.requestedPlayers || []), renderFmPart(item.requestedFm)].filter((value) => value && value !== "-").join(" + ") || "-";
    return isSent
      ? `Offri: ${offered} · Chiedi: ${requested}`
      : `Ricevi: ${offered} · Cedi: ${requested}`;
  }

  function getNegotiationTitle(item, perspectiveTeamId) {
    const otherId = item.fromSeasonTeamId === perspectiveTeamId ? item.toSeasonTeamId : item.fromSeasonTeamId;
    const direction = item.fromSeasonTeamId === perspectiveTeamId ? "A" : "Da";
    return `${direction} ${getSeasonTeamDisplayName(otherId) || "squadra"}`;
  }

  function renderNegotiationCard(item, kind, currentSeasonTeamId) {
    const isSent = kind === "sent";
    const status = String(item.status || "PENDING").toUpperCase();
    const canCancel = isSent && status === "PENDING";
    const canAnswer = !isSent && status === "PENDING";
    const compactSummary = getNegotiationCompactSummary(item, isSent);
    return `
      <details class="trade-card ${isSent ? "trade-card-sent" : "trade-card-received"}" data-trade-card-id="${escapeHtml(item.id || "")}" data-trade-status="${escapeHtml(status)}">
        <summary>
          <span><strong>${escapeHtml(getNegotiationTitle(item, currentSeasonTeamId))}</strong><small>${escapeHtml(item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString("it-IT") : item.createdAt || "")}</small><small class="trade-card-compact-summary-v238">${escapeHtml(compactSummary)} · Esito: ${escapeHtml(getNegotiationStatusLabel(status))}</small></span>
          ${renderNegotiationStatusBadge(status)}
        </summary>
        <div class="trade-card-body">
          <div class="trade-summary-grid">
            <div><span class="metric-label">Offerti</span><strong>${escapeHtml(formatPlayerRefs(item.offeredPlayers || []))}</strong><small>${escapeHtml(renderFmPart(item.offeredFm))}</small></div>
            <div><span class="metric-label">Richiesti</span><strong>${escapeHtml(formatPlayerRefs(item.requestedPlayers || []))}</strong><small>${escapeHtml(renderFmPart(item.requestedFm))}</small></div>
          </div>
          <p class="trade-outcome-summary-v238"><strong>Esito:</strong> ${escapeHtml(getNegotiationStatusLabel(status))}</p>
          ${item.note ? `<p class="trade-note">${escapeHtml(item.note)}</p>` : ""}
          <div class="form-actions trade-actions">
            ${canCancel ? `<button class="button button-danger button-small" type="button" data-trade-cancel="${escapeHtml(item.id)}">Annulla proposta</button>` : ""}
            ${canAnswer ? `<button class="button button-primary button-small" type="button" data-trade-accept="${escapeHtml(item.id)}">Approva</button><button class="button button-danger button-small" type="button" data-trade-reject="${escapeHtml(item.id)}">Rifiuta</button>` : ""}
          </div>
        </div>
      </details>`;
  }

  function renderNegotiationsList(currentSeasonTeamId, kind) {
    const seasonId = getCurrentSeasonId();
    const sent = kind === "sent";
    const items = (state.raw?.transferNegotiations || [])
      .filter((item) => item.seasonId === seasonId)
      .filter((item) => sent ? item.fromSeasonTeamId === currentSeasonTeamId : item.toSeasonTeamId === currentSeasonTeamId)
      .sort((a, b) => String(b.createdAt?.seconds || b.createdAt || "").localeCompare(String(a.createdAt?.seconds || a.createdAt || ""), "it"));
    if (!items.length) return `<p class="muted">Nessuna trattativa ${sent ? "inviata" : "ricevuta"}.</p>`;
    return items.map((item) => renderNegotiationCard(item, kind, currentSeasonTeamId)).join("");
  }

  function renderTradePlayerOptions(seasonTeamId, selectedKeys = []) {
    const selected = new Set(selectedKeys || []);
    const roster = getRosterForSeasonTeam(getSeasonTeamById(seasonTeamId));
    return sortRosterPlayersForDisplay(roster?.players || []).map((player) => {
      const key = getPlayerMarketKey(player);
      return `<option value="${escapeHtml(key)}" ${selected.has(key) ? "selected" : ""}>${escapeHtml(player.playerName || "-")} · ${escapeHtml(player.realTeam || "-")}</option>`;
    }).join("");
  }

  function getSelectedValues(id) {
    const node = document.getElementById(id);
    return node ? Array.from(node.selectedOptions || []).map((option) => option.value).filter(Boolean) : [];
  }

  function getSelectedPlayerRefs(seasonTeamId, keys) {
    return (keys || []).map((key) => {
      const player = getRosterPlayerByKey(seasonTeamId, key);
      return player ? serializePlayerRef(player, seasonTeamId) : null;
    }).filter(Boolean);
  }

  function getTradeFormValidation() {
    const approved = getApprovedTeamUser?.();
    const fromTeamId = approved?.seasonTeamId || "";
    const toTeamId = document.getElementById("tradeTargetTeam")?.value || "";
    const offeredKeys = getSelectedValues("tradeOfferedPlayers");
    const requestedKeys = getSelectedValues("tradeRequestedPlayers");
    const offeredFm = parseDecimalValue(document.getElementById("tradeOfferedFm")?.value || "") || 0;
    const requestedFm = parseDecimalValue(document.getElementById("tradeRequestedFm")?.value || "") || 0;
    const messages = [];

    if (!approved) messages.push("Account presidente non attivo.");
    if (!toTeamId) messages.push("Seleziona la squadra con cui vuoi trattare.");
    if (!offeredKeys.length && !requestedKeys.length && !offeredFm && !requestedFm) messages.push("Inserisci almeno un giocatore o un rimborso FM nella proposta.");
    if (!requestedKeys.length && !requestedFm) messages.push("Inserisci almeno cosa stai chiedendo alla squadra destinataria.");
    if (offeredFm < 0 || requestedFm < 0) messages.push("I rimborsi FM devono essere positivi.");

    const fromBalance = getTeamFmBalance(fromTeamId);
    const toBalance = getTeamFmBalance(toTeamId);
    if (offeredFm > fromBalance) messages.push(`Non puoi offrire ${formatFm(offeredFm)} FM: saldo disponibile ${formatFm(fromBalance)}.`);
    if (requestedFm > toBalance) messages.push(`La squadra destinataria non ha ${formatFm(requestedFm)} FM disponibili.`);

    const fromAfter = getRosterCount(fromTeamId) - offeredKeys.length + requestedKeys.length;
    const toAfter = getRosterCount(toTeamId) - requestedKeys.length + offeredKeys.length;
    if (fromAfter > 30) messages.push(`La tua rosa arriverebbe a ${fromAfter} giocatori: massimo 30.`);
    if (toAfter > 30) messages.push(`La rosa destinataria arriverebbe a ${toAfter} giocatori: massimo 30.`);

    return { valid: messages.length === 0, messages, fromTeamId, toTeamId, offeredKeys, requestedKeys, offeredFm, requestedFm };
  }

  function updateTradeTargetPlayers() {
    const targetSelect = document.getElementById("tradeTargetTeam");
    const requestedSelect = document.getElementById("tradeRequestedPlayers");
    if (!targetSelect || !requestedSelect) return;
    const selected = getSelectedValues("tradeRequestedPlayers");
    requestedSelect.innerHTML = renderTradePlayerOptions(targetSelect.value, selected);
  }

  function validateTradeForm() {
    const status = document.getElementById("tradeValidationStatus");
    const button = document.getElementById("tradeSubmitButton");
    const validation = getTradeFormValidation();
    if (status) {
      status.innerHTML = validation.messages.length
        ? validation.messages.map((message) => `<span class="trade-alert">${escapeHtml(message)}</span>`).join("")
        : `<span class="trade-alert trade-alert-ok">Proposta valida. Puoi inviarla.</span>`;
    }
    if (button) button.disabled = !validation.valid;
    return validation;
  }

  return {
    getApprovedSeasonTeamId,
    getApprovedPresidentId,
    isOwnSeasonTeam,
    getActiveSeasonTeamsForTrades,
    getPlayerMarketKey,
    getRosterPlayerByKey,
    getRosterCount,
    getActiveTransferListings,
    getListingForPlayer,
    renderTransferBadge,
    renderRosterMarketAction,
    getTransferListingById,
    getNegotiationById,
    serializePlayerRef,
    formatPlayerRefs,
    renderFmPart,
    renderNegotiationStatusBadge,
    getNegotiationTitle,
    renderNegotiationCard,
    renderNegotiationsList,
    renderTradePlayerOptions,
    getSelectedValues,
    getSelectedPlayerRefs,
    getTradeFormValidation,
    updateTradeTargetPlayers,
    validateTradeForm
  };
}
