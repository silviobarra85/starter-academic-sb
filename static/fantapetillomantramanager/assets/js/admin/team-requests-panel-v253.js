/* V253 - Admin Team Requests Panel
   First modular extraction from app.js: keep the V249 behavior canonical while
   leaving the inline implementation available as fallback. */

const PANEL_ID = 'adminTeamRequestsPanel';
const COLLECTION_NAME = 'teamRequests';

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeUpper(value) {
  return normalizeText(value).toUpperCase();
}

function timestampToSortValue(value) {
  if (!value) return 0;
  if (typeof value?.toMillis === 'function') return value.toMillis();
  if (typeof value?.seconds === 'number') return value.seconds * 1000;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : String(value);
}

function fallbackEscapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[char]);
}

function getRequestStatus(request = {}) {
  return normalizeUpper(request.status);
}

function getRequestType(request = {}) {
  return normalizeUpper(request.type || request.requestType);
}

function getRequestTopic(request = {}) {
  return normalizeUpper(request.topic);
}

function isCommunicationRequest(request = {}) {
  const type = getRequestType(request);
  const topic = getRequestTopic(request);
  const category = normalizeUpper(request.category);
  return type === 'TEAM_NEWS'
    || type === 'TRANSFER_NEWS'
    || topic === 'COMUNICATO_SQUADRA'
    || topic === 'COMUNICATO_AVVENUTO_SCAMBIO'
    || topic === 'TEAM_NEWS'
    || topic === 'TRANSFER_NEWS'
    || (category === 'COMMUNICATION' && request.needsAdminApproval === true);
}

function isDeletableCommunicationRequest(request = {}) {
  const status = getRequestStatus(request);
  return isCommunicationRequest(request) && ['REJECTED', 'APPROVED', 'ACCEPTED'].includes(status);
}

function getRequestLastActivity(request = {}) {
  return request.updatedAt
    || request.rejectedAt
    || request.approvedAt
    || request.createdAt
    || request.requestedAt
    || request.publishedAt
    || '';
}

function getRequestTitle(request = {}) {
  return request.title
    || request.playerName
    || request.description
    || request.body
    || request.message
    || request.notes
    || 'Richiesta presidente';
}

function getRequestBodyPreview(request = {}) {
  return [
    request.body || request.message || '',
    request.playersInvolved ? `Giocatori: ${request.playersInvolved}` : '',
    request.counterpartyTeamName || request.otherTeamName ? `Squadra coinvolta: ${request.counterpartyTeamName || request.otherTeamName}` : '',
    request.notes || ''
  ].filter(Boolean).join(' · ');
}

function getCssSelectorValue(value) {
  const raw = String(value || '');
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(raw);
  return raw.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}

export function installAdminTeamRequestsPanelV253(context = {}) {
  const {
    state,
    db,
    collection,
    getDocs,
    deleteDoc,
    doc,
    escapeHtml = fallbackEscapeHtml,
    renderAdminPanel,
    requestStatusLabel = (value) => value || 'N/D',
    requestTypeLabel = (value) => value || 'Richiesta',
    getSeasonTeamDisplayName = () => '',
    approveTeamRequest = () => {},
    rejectTeamRequest = () => {},
    loadAdminUserCollections = null,
    renderAll = null,
    expandAdminPanel = null,
    setError = null,
    getRenderTeamRequestsAdminPanel,
    setRenderTeamRequestsAdminPanel,
    getAttachAdminHandlers,
    setAttachAdminHandlers,
    getToggleAdminPanel,
    setToggleAdminPanel
  } = context;

  if (!state || !db || !collection || !getDocs || !deleteDoc || !doc || typeof renderAdminPanel !== 'function') {
    return {
      version: 'V253',
      installed: false,
      reason: 'missing-context'
    };
  }

  state.adminTeamRequestsRefreshingV253 = false;
  state.adminTeamRequestsDeletingV253 = state.adminTeamRequestsDeletingV253 || new Set();

  function renderActionButtons(request = {}) {
    const id = escapeHtml(request.id || '');
    const status = getRequestStatus(request);
    if (status === 'PENDING') {
      return `<button class="button button-primary button-small" type="button" data-approve-team-request-v253="${id}">Approva</button><button class="button button-danger button-small" type="button" data-reject-team-request-v253="${id}">Rifiuta</button>`;
    }
    const deleteButton = isDeletableCommunicationRequest(request)
      ? `<button class="button button-danger button-small" type="button" data-delete-team-request-v253="${id}">Elimina da Firebase</button>`
      : '';
    return `<span class="status status-muted">${escapeHtml(requestStatusLabel(request.status))}</span>${deleteButton}`;
  }

  async function refreshTeamRequests(options = {}) {
    if (!state.isAdmin || state.adminTeamRequestsRefreshingV253) return false;
    const { render = true, expand = true } = options;
    state.adminTeamRequestsRefreshingV253 = true;
    document.querySelectorAll('[data-admin-refresh-team-requests-v253]').forEach((button) => {
      button.disabled = true;
      button.textContent = 'Aggiornamento...';
    });
    document.querySelectorAll('[data-admin-team-requests-status-v253]').forEach((statusNode) => {
      statusNode.textContent = 'Rileggo le richieste presidenti da Firebase...';
      statusNode.classList.remove('error');
    });

    try {
      if (typeof loadAdminUserCollections === 'function') {
        await loadAdminUserCollections({ render, expandPanelId: PANEL_ID });
      } else {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        state.raw.teamRequests = snapshot.docs.map((documentSnapshot) => ({
          id: documentSnapshot.id,
          ...documentSnapshot.data()
        }));
        state.adminUserCollectionsLoadedV175 = true;
        if (render && typeof renderAll === 'function') renderAll();
      }
      document.querySelectorAll('[data-admin-team-requests-status-v253]').forEach((statusNode) => {
        statusNode.textContent = 'Richieste aggiornate da Firebase.';
        statusNode.classList.remove('error');
      });
      if (expand && typeof expandAdminPanel === 'function') window.setTimeout(() => expandAdminPanel(PANEL_ID), 0);
      return true;
    } catch (error) {
      console.error('Errore refresh richieste presidenti V253', error);
      document.querySelectorAll('[data-admin-team-requests-status-v253]').forEach((statusNode) => {
        statusNode.textContent = error?.message || 'Errore durante aggiornamento richieste.';
        statusNode.classList.add('error');
      });
      return false;
    } finally {
      state.adminTeamRequestsRefreshingV253 = false;
      document.querySelectorAll('[data-admin-refresh-team-requests-v253]').forEach((button) => {
        button.disabled = false;
        button.textContent = 'Aggiorna richieste';
      });
    }
  }

  async function deleteCommunicationTeamRequest(requestId) {
    const request = (state.raw.teamRequests || []).find((item) => item.id === requestId);
    if (!request) {
      setError?.('Richiesta non trovata in memoria. Premi Aggiorna richieste e riprova.');
      return;
    }
    if (!isDeletableCommunicationRequest(request)) {
      setError?.('Puoi eliminare da Firebase solo comunicati approvati o rifiutati.');
      return;
    }
    if (state.adminTeamRequestsDeletingV253.has(requestId)) return;

    const status = getRequestStatus(request);
    const title = getRequestTitle(request);
    const extra = status === 'APPROVED' || status === 'ACCEPTED'
      ? "\n\nNota: se il comunicato e' gia stato pubblicato nelle News, questa azione elimina solo la richiesta in teamRequests e non cancella la news pubblicata."
      : '';
    if (!window.confirm(`Eliminare definitivamente da Firebase "${title}"? L'operazione non e' reversibile.${extra}`)) return;

    state.adminTeamRequestsDeletingV253.add(requestId);
    const selectorValue = getCssSelectorValue(requestId);
    document.querySelectorAll(`[data-delete-team-request-v253="${selectorValue}"]`).forEach((button) => {
      button.disabled = true;
      button.textContent = 'Elimino...';
    });

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, requestId));
      state.raw.teamRequests = (state.raw.teamRequests || []).filter((item) => item.id !== requestId);
      document.querySelectorAll('[data-admin-team-requests-status-v253]').forEach((statusNode) => {
        statusNode.textContent = 'Comunicazione eliminata da Firebase.';
        statusNode.classList.remove('error');
      });
      if (typeof renderAll === 'function') renderAll();
      if (typeof expandAdminPanel === 'function') window.setTimeout(() => expandAdminPanel(PANEL_ID), 0);
    } catch (error) {
      console.error('Errore eliminazione comunicato V253', error);
      setError?.(`Non riesco a eliminare il comunicato. ${error?.message || error}`);
      document.querySelectorAll('[data-admin-team-requests-status-v253]').forEach((statusNode) => {
        statusNode.textContent = error?.message || 'Errore durante eliminazione da Firebase.';
        statusNode.classList.add('error');
      });
    } finally {
      state.adminTeamRequestsDeletingV253.delete(requestId);
      document.querySelectorAll(`[data-delete-team-request-v253="${selectorValue}"]`).forEach((button) => {
        button.disabled = false;
        button.textContent = 'Elimina da Firebase';
      });
    }
  }

  function renderPanel() {
    const requests = (state.raw.teamRequests || [])
      .slice()
      .sort((a, b) => {
        const left = timestampToSortValue(getRequestLastActivity(a));
        const right = timestampToSortValue(getRequestLastActivity(b));
        if (typeof left === 'number' && typeof right === 'number') return right - left;
        return String(right || '').localeCompare(String(left || ''));
      });

    const rows = requests.map((request) => {
      const typeLabel = requestTypeLabel(request.type || request.requestType);
      const teamLabel = getSeasonTeamDisplayName(request.seasonTeamId) || request.teamName || request.seasonTeamId || 'Squadra non indicata';
      const authorLabel = request.createdByName || request.createdByEmail || request.createdBy || 'Presidente';
      const bodyPreview = getRequestBodyPreview(request);
      return `
      <div class="admin-list-item admin-team-request-item-v253" data-team-request-id-v253="${escapeHtml(request.id || '')}">
        <span>
          <strong>${escapeHtml(typeLabel)} · ${escapeHtml(teamLabel)}</strong>
          <small>${escapeHtml(authorLabel)} · ${escapeHtml(requestStatusLabel(request.status))}</small>
          <small>${escapeHtml(getRequestTitle(request))}</small>
          ${bodyPreview ? `<small>${escapeHtml(bodyPreview)}</small>` : ''}
        </span>
        <span class="admin-request-actions-v253">
          ${renderActionButtons(request)}
        </span>
      </div>`;
    }).join('') || '<p class="muted admin-empty-message">Nessuna richiesta presidente.</p>';

    const toolbar = `
    <div class="form-actions admin-team-requests-refresh-v253">
      <button class="button button-secondary button-small" type="button" data-admin-refresh-team-requests-v253>Aggiorna richieste</button>
      <span class="form-status" data-admin-team-requests-status-v253>Lista modulare V253: usa Aggiorna richieste per rileggere Firebase.</span>
    </div>`;

    return renderAdminPanel(
      PANEL_ID,
      'Presidenti',
      'Richieste presidenti',
      'Pannello modulare V253: approva o rifiuta richieste presidente; i comunicati approvati o rifiutati possono essere eliminati dal registro teamRequests.',
      `${toolbar}<div class="admin-list">${rows}</div>`
    );
  }

  const previousPanelRenderer = typeof getRenderTeamRequestsAdminPanel === 'function'
    ? getRenderTeamRequestsAdminPanel()
    : null;
  if (typeof setRenderTeamRequestsAdminPanel === 'function') {
    setRenderTeamRequestsAdminPanel(renderPanel);
  }

  const previousAttachAdminHandlers = typeof getAttachAdminHandlers === 'function'
    ? getAttachAdminHandlers()
    : null;
  if (typeof setAttachAdminHandlers === 'function') {
    setAttachAdminHandlers(function attachAdminHandlersV253() {
      previousAttachAdminHandlers?.();
      document.querySelectorAll('[data-admin-refresh-team-requests-v253]').forEach((button) => {
        if (button.dataset.v253Handler === '1') return;
        button.dataset.v253Handler = '1';
        button.addEventListener('click', () => refreshTeamRequests({ render: true, expand: true }));
      });
      document.querySelectorAll('[data-approve-team-request-v253]').forEach((button) => {
        if (button.dataset.v253Handler === '1') return;
        button.dataset.v253Handler = '1';
        button.addEventListener('click', () => approveTeamRequest(button.dataset.approveTeamRequestV253));
      });
      document.querySelectorAll('[data-reject-team-request-v253]').forEach((button) => {
        if (button.dataset.v253Handler === '1') return;
        button.dataset.v253Handler = '1';
        button.addEventListener('click', () => rejectTeamRequest(button.dataset.rejectTeamRequestV253));
      });
      document.querySelectorAll('[data-delete-team-request-v253]').forEach((button) => {
        if (button.dataset.v253Handler === '1') return;
        button.dataset.v253Handler = '1';
        button.addEventListener('click', () => deleteCommunicationTeamRequest(button.dataset.deleteTeamRequestV253));
      });
    });
  }

  const previousToggleAdminPanel = typeof getToggleAdminPanel === 'function'
    ? getToggleAdminPanel()
    : null;
  if (typeof setToggleAdminPanel === 'function') {
    setToggleAdminPanel(function toggleAdminPanelV253(panelId) {
      previousToggleAdminPanel?.(panelId);
      if (panelId !== PANEL_ID || !state.isAdmin) return;
      const panel = document.getElementById(panelId);
      const isOpen = panel && !panel.classList.contains('is-collapsed');
      if (isOpen && !state.adminUserCollectionsLoadedV175) {
        refreshTeamRequests({ render: true, expand: true });
      }
    });
  }

  return {
    version: 'V253',
    installed: true,
    modularPanel: true,
    fallbackRendererKept: typeof previousPanelRenderer === 'function',
    refreshAttribute: 'data-admin-refresh-team-requests-v253',
    deleteAttribute: 'data-delete-team-request-v253',
    helpers: {
      refreshTeamRequests,
      deleteCommunicationTeamRequest,
      isCommunicationRequest,
      isDeletableCommunicationRequest
    }
  };
}
