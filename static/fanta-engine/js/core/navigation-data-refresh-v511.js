const NAVIGATION_DATA_REFRESH_VERSION_V511 = 'V511';

function defaultPageFromHashV511(win) {
  return String(win?.location?.hash || '').replace(/^#/, '') || 'dashboard';
}

function createNavigationDataRefreshV511(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const delayMs = Number.isFinite(Number(options.delayMs)) ? Number(options.delayMs) : 80;
  const getCurrentPage = typeof options.getCurrentPage === 'function' ? options.getCurrentPage : () => defaultPageFromHashV511(win);
  const pageFromHash = typeof options.pageFromHash === 'function' ? options.pageFromHash : () => defaultPageFromHashV511(win);
  const hasData = typeof options.hasData === 'function' ? options.hasData : () => true;
  const ensureDataReady = typeof options.ensureDataReady === 'function' ? options.ensureDataReady : async () => true;
  const renderPage = typeof options.renderPage === 'function' ? options.renderPage : () => {};
  const shouldRefreshPage = typeof options.shouldRefreshPage === 'function' ? options.shouldRefreshPage : () => true;
  const logger = options.logger || (typeof console !== 'undefined' ? console : { warn() {} });

  const runtime = {
    version: NAVIGATION_DATA_REFRESH_VERSION_V511,
    installed: false,
    pendingTimer: 0,
    runningPromise: null,
    lastRun: null,
    schedule(meta = {}) {
      if (!win) return this;
      const page = String(meta.page || getCurrentPage() || pageFromHash() || 'dashboard').replace(/^#/, '') || 'dashboard';
      if (!shouldRefreshPage(page, meta)) return this;
      if (this.pendingTimer) win.clearTimeout(this.pendingTimer);
      this.pendingTimer = win.setTimeout(() => {
        this.pendingTimer = 0;
        this.run({ ...meta, page }).catch((error) => logger.warn?.('Navigation data refresh V511 non completato', error));
      }, delayMs);
      return this;
    },
    async run(meta = {}) {
      const page = String(meta.page || getCurrentPage() || pageFromHash() || 'dashboard').replace(/^#/, '') || 'dashboard';
      if (!shouldRefreshPage(page, meta)) return false;
      if (this.runningPromise) return this.runningPromise;
      this.runningPromise = (async () => {
        const hadDataBefore = Boolean(hasData(page, meta));
        await ensureDataReady({ ...meta, page, hadDataBefore });
        renderPage(page, { ...meta, hadDataBefore, hasDataAfter: Boolean(hasData(page, meta)) });
        this.lastRun = {
          version: NAVIGATION_DATA_REFRESH_VERSION_V511,
          page,
          reason: meta.reason || meta.source || 'navigation',
          hadDataBefore,
          hasDataAfter: Boolean(hasData(page, meta)),
          at: new Date().toISOString()
        };
        return true;
      })().finally(() => { this.runningPromise = null; });
      return this.runningPromise;
    },
    install() {
      if (!win || this.installed) return this;
      this.onHashChange = () => this.schedule({ reason: 'hashchange', page: pageFromHash() });
      this.onLoad = () => this.schedule({ reason: 'window-load', page: pageFromHash() });
      win.addEventListener?.('hashchange', this.onHashChange);
      win.addEventListener?.('load', this.onLoad);
      this.installed = true;
      this.schedule({ reason: 'install', page: pageFromHash() });
      return this;
    },
    uninstall() {
      if (!win || !this.installed) return this;
      win.removeEventListener?.('hashchange', this.onHashChange);
      win.removeEventListener?.('load', this.onLoad);
      if (this.pendingTimer) win.clearTimeout(this.pendingTimer);
      this.pendingTimer = 0;
      this.installed = false;
      return this;
    }
  };
  return runtime;
}

function installNavigationDataRefreshV511(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const runtime = createNavigationDataRefreshV511(options).install();
  if (win) {
    win.FantaEngineNavigationDataRefreshV511 = runtime;
    win.FantaEngineNavigationDataRefreshRuntimeV511 = runtime;
  }
  return runtime;
}

export {
  NAVIGATION_DATA_REFRESH_VERSION_V511,
  createNavigationDataRefreshV511,
  installNavigationDataRefreshV511
};
