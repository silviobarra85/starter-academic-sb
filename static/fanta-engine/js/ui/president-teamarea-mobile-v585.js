(function presidentTeamAreaMobileV585() {
  'use strict';

  const VERSION = 'V585';
  const MOBILE_QUERY = '(max-width: 900px), (hover: none) and (pointer: coarse)';
  const OPEN_PROFILE_SELECTOR = '[data-open-team-profile]';
  const PANEL_DEFS = [
    { key: 'trade-proposal', selector: '.trade-proposal-panel', label: 'Proponi trattativa', title: 'Proponi trattativa' },
    { key: 'trade-list', selector: '.trade-list-panel', label: 'Trattative' },
    { key: 'team-news', selector: '#teamNewsRequestForm', label: 'Comunicato squadra' },
    { key: 'transfer-communication', selector: '#teamTransferCommunicationPanelV242, #teamTransferCommunicationFormV242, #teamTransferCommunicationFormV50', label: 'Scambio comunicato' },
    { key: 'player-release', selector: '#teamPlayerReleasePanelV261, #teamPlayerReleaseFormV261', label: 'Svincoli' }
  ];
  const QUICK_ACTIONS = [
    { type: 'link', href: '#clubs', page: 'clubs', icon: '👥', title: 'Tutte le rose', small: 'lega' },
    { type: 'link', href: '#fantamercato', page: 'fantamercato', icon: '🔁', title: 'Mercato', small: 'trasferibili' },
    { type: 'panel', key: 'trade-proposal', icon: '✍️', title: 'Proponi', small: 'trattativa' },
    { type: 'panel', key: 'trade-list', icon: '🤝', title: 'Trattative', small: 'storico' },
    { type: 'panel', key: 'team-news', icon: '📰', title: 'Comunicato', small: 'squadra' },
    { type: 'panel', key: 'transfer-communication', icon: '🔁', title: 'Scambio', small: 'comunicato' },
    { type: 'panel', key: 'player-release', icon: '✂️', title: 'Svincoli', small: 'email' },
    { type: 'profile', icon: '🛡️', title: 'Pagina', small: 'squadra' }
  ];

  const memory = window.__teamareaV585PanelState || (window.__teamareaV585PanelState = Object.create(null));
  let observer = null;
  let rafPending = false;

  function isMobile() {
    try {
      return window.matchMedia(MOBILE_QUERY).matches;
    } catch (_) {
      return true;
    }
  }

  function qsa(selector, root = document) {
    return Array.from(root.querySelectorAll(selector));
  }

  function getTeamAreaBody() {
    return document.getElementById('teamAreaBody') || document.querySelector('[data-page="teamarea"]');
  }

  function findPanel(def) {
    const selectors = String(def.selector || '').split(',').map((item) => item.trim()).filter(Boolean);
    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (!node) continue;
      return node.classList?.contains('panel') ? node : (node.closest?.('.panel') || node);
    }
    return null;
  }

  function findPanelByKey(key) {
    const def = PANEL_DEFS.find((item) => item.key === key);
    return def ? findPanel(def) : null;
  }

  function setImportantStyle(node, property, value) {
    if (!node || !node.style) return;
    node.style.setProperty(property, value, 'important');
  }

  function normalizePanelTitle(panel, def) {
    const title = panel?.querySelector?.('.panel-header h2, h2');
    if (!title) return;
    const clean = String(title.textContent || '').trim().toLowerCase();
    if (def.title || clean === 'proponi svincolo' || clean === 'proponi proposta') {
      title.textContent = def.title || def.label;
    }
  }

  function ensureHeader(panel, def) {
    let header = panel.querySelector(':scope > .panel-header') || panel.querySelector('.panel-header');
    if (!header) {
      header = document.createElement('div');
      header.className = 'panel-header compact';
      const wrap = document.createElement('div');
      const h2 = document.createElement('h2');
      h2.textContent = def.label;
      wrap.appendChild(h2);
      header.appendChild(wrap);
      panel.prepend(header);
    }
    return header;
  }

  function collapsePanel(panel, def, collapsed, userAction) {
    if (!panel) return;
    panel.classList.toggle('is-collapsed-v585', Boolean(collapsed));
    panel.classList.toggle('is-collapsed-v432', Boolean(collapsed));
    panel.dataset.teamareaV585Collapsed = collapsed ? '1' : '0';
    if (userAction) {
      memory[def.key] = collapsed ? 'collapsed' : 'expanded';
      panel.dataset.teamareaV585Touched = '1';
    }
    const button = panel.querySelector(':scope > .panel-header [data-teamarea-toggle-v585], .panel-header [data-teamarea-toggle-v585]');
    if (button) {
      button.textContent = collapsed ? 'Apri' : 'Riduci';
      button.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      button.setAttribute('aria-label', `${collapsed ? 'Apri' : 'Riduci'} ${def.label}`);
    }
  }

  function ensureToggle(panel, def) {
    const header = ensureHeader(panel, def);
    qsa('[data-teamarea-toggle-v432], [data-teamarea-toggle-v585]', header).forEach((button) => button.remove());
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button-secondary button-small teamarea-toggle-v585';
    button.dataset.teamareaToggleV585 = def.key;
    button.dataset.teamareaToggleLabelV585 = def.label;
    header.appendChild(button);
    const remembered = memory[def.key];
    const collapsed = remembered ? remembered === 'collapsed' : true;
    collapsePanel(panel, def, collapsed, false);
  }

  function enhancePanels() {
    PANEL_DEFS.forEach((def) => {
      const panel = findPanel(def);
      if (!panel) return;
      panel.classList.add('teamarea-panel-v585', `teamarea-panel-v585-${def.key}`);
      panel.dataset.teamareaPanelV585 = def.key;
      normalizePanelTitle(panel, def);
      ensureToggle(panel, def);
    });
  }

  function getCurrentTeamId(root) {
    const profile = root?.querySelector?.('.mobile-teamarea-open-profile-v167[data-open-team-profile], .team-area-profile-action [data-open-team-profile], .president-dashboard-v369 [data-open-team-profile], [data-open-team-profile]');
    return profile?.getAttribute?.('data-open-team-profile') || '';
  }

  function makeAction(action, teamId) {
    const tag = action.type === 'link' ? 'a' : 'button';
    const el = document.createElement(tag);
    el.className = 'mobile-teamarea-action-v144 teamarea-quick-action-v585';
    if (action.type === 'link') {
      el.setAttribute('href', action.href);
      el.dataset.pageLink = action.page;
    } else {
      el.type = 'button';
      if (action.type === 'profile') {
        if (!teamId) return null;
        el.dataset.openTeamProfile = teamId;
      } else {
        el.dataset.teamareaOpenPanelV585 = action.key;
      }
    }
    el.innerHTML = `<span>${action.icon}</span><strong>${action.title}</strong><small>${action.small}</small>`;
    return el;
  }

  function rebuildQuickActions() {
    const root = getTeamAreaBody();
    const actions = document.querySelector('#mobileTeamAreaHubV144 .mobile-teamarea-actions-v144');
    if (!root || !actions) return;
    const teamId = getCurrentTeamId(root);
    actions.classList.add('teamarea-quick-actions-v585');
    const htmlSignature = QUICK_ACTIONS.map((item) => item.type + ':' + (item.key || item.page || item.title)).join('|') + ':' + teamId;
    if (actions.dataset.teamareaQuickActionsV585 === htmlSignature) return;
    actions.innerHTML = '';
    QUICK_ACTIONS.forEach((action) => {
      const node = makeAction(action, teamId);
      if (node) actions.appendChild(node);
    });
    actions.dataset.teamareaQuickActionsV585 = htmlSignature;
  }

  function hideDuplicateDashboardActions() {
    qsa('.president-dashboard-actions-v369').forEach((node) => {
      node.dataset.teamareaDashboardActionsMovedV585 = 'true';
      node.setAttribute('aria-hidden', 'true');
      setImportantStyle(node, 'display', 'none');
    });
    qsa('.team-area-profile-action').forEach((node) => {
      node.dataset.teamareaProfileActionMovedV585 = 'true';
      node.setAttribute('aria-hidden', 'true');
      setImportantStyle(node, 'display', 'none');
    });
  }

  function openPanelAndScroll(key) {
    const def = PANEL_DEFS.find((item) => item.key === key);
    if (!def) return false;
    enhancePanels();
    const panel = findPanel(def);
    if (!panel) return false;
    collapsePanel(panel, def, false, true);
    const target = panel.querySelector('form, .grid-two, .trade-lists-grid') || panel;
    window.setTimeout(() => {
      try { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (_) { target.scrollIntoView(); }
    }, 40);
    return true;
  }

  function apply() {
    rafPending = false;
    const root = getTeamAreaBody();
    if (!root || !isMobile()) return;
    document.body.classList.add('teamarea-dashboard-mobile-v585-active');
    enhancePanels();
    hideDuplicateDashboardActions();
    rebuildQuickActions();
  }

  function scheduleApply() {
    if (rafPending) return;
    rafPending = true;
    window.requestAnimationFrame(apply);
  }

  document.addEventListener('click', (event) => {
    const toggle = event.target.closest?.('[data-teamarea-toggle-v585]');
    if (toggle) {
      event.preventDefault();
      event.stopPropagation();
      const key = toggle.dataset.teamareaToggleV585;
      const def = PANEL_DEFS.find((item) => item.key === key);
      const panel = toggle.closest?.('.teamarea-panel-v585');
      if (!def || !panel) return;
      collapsePanel(panel, def, !panel.classList.contains('is-collapsed-v585'), true);
      return;
    }

    const openButton = event.target.closest?.('[data-teamarea-open-panel-v585]');
    if (openButton) {
      event.preventDefault();
      event.stopPropagation();
      const ok = openPanelAndScroll(openButton.dataset.teamareaOpenPanelV585);
      if (!ok) scheduleApply();
    }
  }, true);

  document.addEventListener('DOMContentLoaded', () => {
    scheduleApply();
    observer = new MutationObserver(scheduleApply);
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(scheduleApply, 150);
    window.setTimeout(scheduleApply, 700);
  });

  window.addEventListener('hashchange', () => window.setTimeout(scheduleApply, 80));
  window.addEventListener('load', () => window.setTimeout(scheduleApply, 120));

  window.FantaTeamAreaMobileV585 = Object.freeze({ version: VERSION, apply: scheduleApply, openPanel: openPanelAndScroll });
})();
