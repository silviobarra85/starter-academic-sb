const NAVIGATION_ACTIONS_VERSION_V510 = 'V510';

function normalizePageIdV510(value, fallback = 'dashboard') {
  const raw = String(value || '').trim().replace(/^#/, '');
  return raw || fallback;
}

function isModifiedNavigationClickV510(event) {
  return Boolean(event?.metaKey || event?.ctrlKey || event?.shiftKey || event?.altKey || event?.button > 0);
}

function getActionTargetV510(event) {
  const target = event?.target;
  if (!target || typeof target.closest !== 'function') return null;
  return target.closest('[data-page-link], [data-v42-page-link]');
}

function getPageFromTargetV510(target) {
  if (!target) return '';
  const fromData = target.dataset?.v42PageLink || target.dataset?.pageLink || '';
  if (fromData) return normalizePageIdV510(fromData);
  const href = target.getAttribute?.('href') || '';
  if (href.startsWith('#')) return normalizePageIdV510(href);
  return '';
}

function shouldHandleTargetV510(target, event) {
  if (!target) return false;
  if (target.dataset?.navigationDisabled === 'true') return false;
  if (target.matches?.('[data-open-team-profile]')) return false;
  if (target.closest?.('[data-open-team-profile]')) return false;
  if (target.tagName === 'A') {
    const href = target.getAttribute('href') || '';
    const targetAttr = target.getAttribute('target') || '';
    if (targetAttr && targetAttr !== '_self') return false;
    if (href && !href.startsWith('#')) return false;
  }
  return !isModifiedNavigationClickV510(event);
}

function defaultSetPageV510(page, context = {}) {
  const doc = context.document || (typeof document !== 'undefined' ? document : null);
  const win = context.window || (typeof window !== 'undefined' ? window : null);
  if (!doc) return page;
  const targetPage = normalizePageIdV510(page);
  doc.querySelectorAll('.app-page').forEach((node) => {
    node.classList.toggle('is-active', node.dataset?.page === targetPage);
  });
  doc.querySelectorAll('[data-page-link]').forEach((node) => {
    node.classList.toggle('active', node.dataset?.pageLink === targetPage);
  });
  if (win && win.location?.hash !== `#${targetPage}`) {
    try { win.history.pushState(null, '', `#${targetPage}`); }
    catch (_) { win.location.hash = targetPage; }
  }
  return targetPage;
}

function createNavigationActionsV510(options = {}) {
  const doc = options.document || (typeof document !== 'undefined' ? document : null);
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const normalizePage = typeof options.normalizePage === 'function'
    ? (page) => options.normalizePage(page) || normalizePageIdV510(page)
    : normalizePageIdV510;
  const getCurrentPage = typeof options.getCurrentPage === 'function' ? options.getCurrentPage : () => '';
  const setPage = typeof options.setPage === 'function' ? options.setPage : (page, meta) => defaultSetPageV510(page, { ...meta, document: doc, window: win });
  const isAdminOnlyPage = typeof options.isAdminOnlyPage === 'function' ? options.isAdminOnlyPage : () => false;
  const isAdmin = typeof options.isAdmin === 'function' ? options.isAdmin : () => false;
  const promptAdminLogin = typeof options.promptAdminLogin === 'function' ? options.promptAdminLogin : () => {};
  const beforeNavigate = typeof options.beforeNavigate === 'function' ? options.beforeNavigate : () => {};
  const afterNavigate = typeof options.afterNavigate === 'function' ? options.afterNavigate : () => {};
  const api = {
    version: NAVIGATION_ACTIONS_VERSION_V510,
    lastNavigation: null,
    normalizePage,
    resolvePageFromTarget: getPageFromTargetV510,
    navigate(rawPage, meta = {}) {
      let page = normalizePage(rawPage || 'dashboard');
      const originalPage = page;
      if (isAdminOnlyPage(page) && !isAdmin()) {
        promptAdminLogin(page);
        page = normalizePage('dashboard');
      }
      beforeNavigate({ page, originalPage, ...meta });
      const result = setPage(page, { page, originalPage, ...meta });
      afterNavigate({ page, originalPage, result, ...meta });
      this.lastNavigation = {
        version: NAVIGATION_ACTIONS_VERSION_V510,
        page,
        originalPage,
        source: meta.source || 'api',
        selector: meta.selector || '',
        at: new Date().toISOString()
      };
      return this.lastNavigation;
    },
    handleClick(event) {
      const target = getActionTargetV510(event);
      if (!shouldHandleTargetV510(target, event)) return false;
      const page = getPageFromTargetV510(target);
      if (!page) return false;
      event.preventDefault?.();
      event.stopPropagation?.();
      this.navigate(page, {
        source: target.dataset?.v42PageLink ? 'data-v42-page-link' : 'data-page-link',
        selector: target.dataset?.v42PageLink ? '[data-v42-page-link]' : '[data-page-link]',
        target,
        event
      });
      return true;
    },
    handleHashChange(event) {
      const page = normalizePageIdV510(win?.location?.hash || 'dashboard');
      if (!page || page === normalizePageIdV510(getCurrentPage())) return false;
      this.navigate(page, { source: 'hashchange', event });
      return true;
    },
    install() {
      if (!doc || this.installed) return this;
      this.boundClick = (event) => this.handleClick(event);
      this.boundHashChange = (event) => this.handleHashChange(event);
      doc.addEventListener('click', this.boundClick, true);
      win?.addEventListener?.('hashchange', this.boundHashChange);
      this.installed = true;
      return this;
    },
    uninstall() {
      if (!doc || !this.installed) return this;
      doc.removeEventListener('click', this.boundClick, true);
      win?.removeEventListener?.('hashchange', this.boundHashChange);
      this.installed = false;
      return this;
    }
  };
  return api;
}

function installNavigationActionsV510(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const runtime = createNavigationActionsV510(options).install();
  if (win) {
    win.FantaEngineNavigationActionsV510 = runtime;
    win.FantaEngineNavigationActionsRuntimeV510 = runtime;
  }
  return runtime;
}

export {
  NAVIGATION_ACTIONS_VERSION_V510,
  createNavigationActionsV510,
  getPageFromTargetV510,
  installNavigationActionsV510,
  normalizePageIdV510,
  shouldHandleTargetV510
};
