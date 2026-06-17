export function installTradeNotificationSimulatorV254(deps = {}) {
  const {
    state,
    db,
    collection,
    addDoc,
    serverTimestamp,
    getCurrentSeasonId,
    getApprovedTeamUser,
    getApprovedSeasonTeamId,
    getSeasonTeamsForSeason,
    getSeasonTeamDisplayName,
    renderUserArea,
    renderTransferMarketPage,
    applyTradeNotificationBadges,
    ensureTransferMarketData,
    loadTransferMarketCollections,
    acknowledgeTradeOutcomeNotifications,
    acknowledgeSingleTradeOutcome,
    setAppPage
  } = deps;

  const SIM_SOURCE = 'dev-simulator-v254';
  const DEFAULT_OFFERED_PLAYER = {
    playerName: 'Giocatore test offerto',
    rosterRole: 'C',
    realTeam: 'TEST',
    playerKey: 'sim-offered-v254'
  };
  const DEFAULT_REQUESTED_PLAYER = {
    playerName: 'Giocatore test richiesto',
    rosterRole: 'A',
    realTeam: 'TEST',
    playerKey: 'sim-requested-v254'
  };

  function ensureRawNegotiations() {
    if (!state.raw) state.raw = {};
    if (!Array.isArray(state.raw.transferNegotiations)) state.raw.transferNegotiations = [];
    return state.raw.transferNegotiations;
  }

  function ensureLocalStore() {
    if (!Array.isArray(state.tradeNotificationSimulatorLocalRowsV254)) state.tradeNotificationSimulatorLocalRowsV254 = [];
    return state.tradeNotificationSimulatorLocalRowsV254;
  }

  function mergeLocalSimulations() {
    const rows = ensureRawNegotiations();
    const localRows = ensureLocalStore();
    localRows.forEach((item) => {
      if (!rows.some((row) => String(row.id || '') === String(item.id || ''))) rows.unshift(item);
    });
    return { merged: localRows.length, total: rows.length };
  }

  function getCurrentTeamId() {
    if (typeof getApprovedSeasonTeamId === 'function') {
      const fromHelper = getApprovedSeasonTeamId();
      if (fromHelper) return fromHelper;
    }
    if (typeof getApprovedTeamUser === 'function') {
      const approved = getApprovedTeamUser();
      if (approved?.seasonTeamId) return approved.seasonTeamId;
    }
    return '';
  }

  function getCurrentSeason() {
    return typeof getCurrentSeasonId === 'function' ? getCurrentSeasonId() : '';
  }

  function getTeams() {
    const seasonId = getCurrentSeason();
    if (typeof getSeasonTeamsForSeason !== 'function') return [];
    return getSeasonTeamsForSeason(seasonId) || [];
  }

  function getTeamName(teamId) {
    if (!teamId) return '';
    if (typeof getSeasonTeamDisplayName === 'function') {
      return getSeasonTeamDisplayName(teamId) || teamId;
    }
    return teamId;
  }

  function pickOtherTeamId(currentTeamId, preferred = '') {
    if (preferred && preferred !== currentTeamId) return preferred;
    const teams = getTeams();
    return teams.find((team) => team.id && team.id !== currentTeamId)?.id || preferred || 'sim-other-team-v254';
  }

  function clonePlayer(player, seasonTeamId, fallback) {
    return {
      ...fallback,
      ...(player || {}),
      seasonTeamId
    };
  }

  function makeLocalTimestamp() {
    return new Date().toISOString();
  }

  function makeTradePayload(options = {}) {
    const currentTeamId = options.currentSeasonTeamId || getCurrentTeamId();
    if (!currentTeamId && !options.toSeasonTeamId && !options.fromSeasonTeamId) {
      throw new Error('Nessuna squadra presidente attiva: accedi come presidente oppure indica fromSeasonTeamId/toSeasonTeamId.');
    }
    const direction = options.direction || 'incoming';
    const otherTeamId = pickOtherTeamId(currentTeamId, options.otherSeasonTeamId || options.fromSeasonTeamId || options.toSeasonTeamId || '');
    const fromSeasonTeamId = options.fromSeasonTeamId || (direction === 'incoming' ? otherTeamId : currentTeamId);
    const toSeasonTeamId = options.toSeasonTeamId || (direction === 'incoming' ? currentTeamId : otherTeamId);
    const status = String(options.status || (direction === 'resolved-sent' ? 'ACCEPTED' : 'PENDING')).toUpperCase();
    const now = makeLocalTimestamp();
    const id = options.id || `sim_v254_${direction}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const payload = {
      id,
      seasonId: options.seasonId || getCurrentSeason(),
      fromSeasonTeamId,
      fromTeamName: options.fromTeamName || getTeamName(fromSeasonTeamId),
      toSeasonTeamId,
      toTeamName: options.toTeamName || getTeamName(toSeasonTeamId),
      offeredPlayers: options.offeredPlayers || [clonePlayer(options.offeredPlayer, fromSeasonTeamId, DEFAULT_OFFERED_PLAYER)],
      requestedPlayers: options.requestedPlayers || [clonePlayer(options.requestedPlayer, toSeasonTeamId, DEFAULT_REQUESTED_PLAYER)],
      offeredFm: Number(options.offeredFm || 0),
      requestedFm: Number(options.requestedFm || 0),
      note: options.note || 'Simulazione notifiche trattative V254',
      status,
      source: SIM_SOURCE,
      localOnly: options.localOnly !== false,
      createdBy: options.createdBy || state.user?.uid || 'simulator-v254',
      createdByName: options.createdByName || 'Simulatore notifiche',
      createdAt: options.createdAt || now,
      updatedAt: options.updatedAt || now,
      outcomeSeenByFromUid: options.outcomeSeenByFromUid === true,
      outcomeSeenMarkerByFromUid: options.outcomeSeenMarkerByFromUid || '',
      outcomeSeenByUid: options.outcomeSeenByUid || ''
    };
    if (status === 'ACCEPTED') payload.acceptedAt = options.acceptedAt || now;
    if (status === 'REJECTED') payload.rejectedAt = options.rejectedAt || now;
    return payload;
  }

  function renderAfterSimulation(options = {}) {
    try { renderUserArea?.(); } catch (error) { console.warn('Render area presidente non completato', error); }
    try { renderTransferMarketPage?.(); } catch (error) { console.warn('Render fantamercato non completato', error); }
    try { applyTradeNotificationBadges?.(); } catch (error) { console.warn('Badge trattative non aggiornato', error); }
    if (options.openTeamArea) {
      try {
        if (typeof setAppPage === 'function') setAppPage('teamarea');
        else window.location.hash = '#teamarea';
      } catch (_) {
        window.location.hash = '#teamarea';
      }
      window.setTimeout(() => {
        document.querySelector('.trade-list-panel')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }

  function upsertLocalTrade(item, options = {}) {
    const rows = ensureRawNegotiations();
    const localRows = ensureLocalStore();
    const index = rows.findIndex((row) => String(row.id || '') === String(item.id || ''));
    if (index >= 0) rows.splice(index, 1, item);
    else rows.unshift(item);
    const localIndex = localRows.findIndex((row) => String(row.id || '') === String(item.id || ''));
    if (localIndex >= 0) localRows.splice(localIndex, 1, item);
    else localRows.unshift(item);
    renderAfterSimulation(options);
    return item;
  }

  function getContext() {
    const currentSeasonTeamId = getCurrentTeamId();
    const teams = getTeams().map((team) => ({
      id: team.id,
      name: team.name || getTeamName(team.id),
      isCurrent: team.id === currentSeasonTeamId
    }));
    const stateInfo = state.tradeNotificationLastStateV238 || state.tradeNotificationLastDetailedStateV239 || null;
    return {
      version: 'V254',
      userUid: state.user?.uid || '',
      isAdmin: Boolean(state.isAdmin),
      seasonId: getCurrentSeason(),
      currentSeasonTeamId,
      currentTeamName: getTeamName(currentSeasonTeamId),
      otherTeams: teams.filter((team) => !team.isCurrent),
      notificationState: stateInfo
    };
  }

  function simulateIncomingProposal(options = {}) {
    const currentTeamId = getCurrentTeamId();
    const payload = makeTradePayload({
      ...options,
      direction: 'incoming',
      status: options.status || 'PENDING',
      toSeasonTeamId: options.toSeasonTeamId || currentTeamId,
      fromSeasonTeamId: options.fromSeasonTeamId || pickOtherTeamId(currentTeamId, options.otherSeasonTeamId || '')
    });
    return upsertLocalTrade(payload, { openTeamArea: options.openTeamArea !== false });
  }

  function simulateResolvedSentProposal(options = {}) {
    const currentTeamId = getCurrentTeamId();
    const status = String(options.status || 'ACCEPTED').toUpperCase();
    if (status !== 'ACCEPTED' && status !== 'REJECTED') {
      throw new Error('Usa status ACCEPTED o REJECTED per simulare un esito.');
    }
    const payload = makeTradePayload({
      ...options,
      direction: 'resolved-sent',
      status,
      fromSeasonTeamId: options.fromSeasonTeamId || currentTeamId,
      toSeasonTeamId: options.toSeasonTeamId || pickOtherTeamId(currentTeamId, options.otherSeasonTeamId || ''),
      outcomeSeenByFromUid: false,
      outcomeSeenMarkerByFromUid: '',
      outcomeSeenByUid: ''
    });
    return upsertLocalTrade(payload, { openTeamArea: options.openTeamArea !== false });
  }

  function resolveLocalIncomingProposal(status = 'REJECTED') {
    const currentTeamId = getCurrentTeamId();
    const normalized = String(status || 'REJECTED').toUpperCase();
    if (normalized !== 'ACCEPTED' && normalized !== 'REJECTED') throw new Error('Status valido: ACCEPTED o REJECTED.');
    const rows = ensureRawNegotiations();
    const item = rows.find((row) => row.source === SIM_SOURCE && row.localOnly && row.toSeasonTeamId === currentTeamId && String(row.status || 'PENDING').toUpperCase() === 'PENDING');
    if (!item) throw new Error('Nessuna proposta locale ricevuta in attesa da chiudere.');
    item.status = normalized;
    item.updatedAt = makeLocalTimestamp();
    if (normalized === 'ACCEPTED') item.acceptedAt = item.updatedAt;
    if (normalized === 'REJECTED') item.rejectedAt = item.updatedAt;
    renderAfterSimulation({ openTeamArea: true });
    return item;
  }

  async function createFirebaseSentProposal(options = {}) {
    if (!options.confirm) {
      throw new Error('Questa funzione scrive davvero in Firebase. Richiamala con { confirm: true }.');
    }
    const currentTeamId = getCurrentTeamId();
    if (!currentTeamId) throw new Error('Accedi come presidente prima di creare una proposta Firebase.');
    const payload = makeTradePayload({
      ...options,
      direction: 'sent',
      status: options.status || 'PENDING',
      fromSeasonTeamId: currentTeamId,
      toSeasonTeamId: options.toSeasonTeamId || pickOtherTeamId(currentTeamId, options.otherSeasonTeamId || ''),
      localOnly: false,
      source: 'console-simulator-v254',
      createdAt: serverTimestamp?.() || makeLocalTimestamp(),
      updatedAt: serverTimestamp?.() || makeLocalTimestamp()
    });
    delete payload.id;
    const ref = await addDoc(collection(db, 'transferNegotiations'), payload);
    try { await loadTransferMarketCollections?.(); } catch (error) { console.warn('Reload trattative non completato', error); }
    renderAfterSimulation({ openTeamArea: true });
    return { id: ref.id, ...payload };
  }

  async function reloadFromFirebase() {
    if (typeof ensureTransferMarketData === 'function') {
      await ensureTransferMarketData({ force: true, reason: 'simulator-v254' });
    } else if (typeof loadTransferMarketCollections === 'function') {
      await loadTransferMarketCollections();
    }
    renderAfterSimulation({ openTeamArea: false });
    return state.raw?.transferNegotiations || [];
  }

  function clearLocalSimulations() {
    const rows = ensureRawNegotiations();
    const before = rows.length;
    state.tradeNotificationSimulatorLocalRowsV254 = [];
    state.raw.transferNegotiations = rows.filter((row) => row.source !== SIM_SOURCE && row.source !== 'console-simulator-v254-local');
    renderAfterSimulation({ openTeamArea: false });
    return { removed: before - state.raw.transferNegotiations.length, remaining: state.raw.transferNegotiations.length };
  }

  async function markAllOutcomeSeen() {
    try { await acknowledgeTradeOutcomeNotifications?.(); } catch (error) { console.warn('Ack globale non completato', error); }
    const currentTeamId = getCurrentTeamId();
    const rows = ensureRawNegotiations().filter((row) => row.fromSeasonTeamId === currentTeamId && ['ACCEPTED', 'REJECTED'].includes(String(row.status || '').toUpperCase()));
    for (const row of rows) {
      try { await acknowledgeSingleTradeOutcome?.(row.id); } catch (_) { /* fallback locale gia gestito dal sito */ }
      row.outcomeSeenByFromUid = true;
      row.outcomeSeenMarkerByFromUid = row.outcomeSeenMarkerByFromUid || `${String(row.status || '').toUpperCase()}:${String(row.updatedAt || row.acceptedAt || row.rejectedAt || '')}`;
      row.outcomeSeenByUid = state.user?.uid || row.outcomeSeenByUid || '';
    }
    renderAfterSimulation({ openTeamArea: false });
    return { marked: rows.length };
  }

  const api = {
    version: 'V254',
    localOnlyByDefault: true,
    getContext,
    simulateIncomingProposal,
    simulateResolvedSentProposal,
    resolveLocalIncomingProposal,
    createFirebaseSentProposal,
    reloadFromFirebase,
    mergeLocalSimulations,
    clearLocalSimulations,
    markAllOutcomeSeen
  };

  window.FantaPetilloTradeSimulatorV254 = api;
  return api;
}
