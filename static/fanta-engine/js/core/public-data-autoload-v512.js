const PUBLIC_DATA_AUTOLOAD_VERSION_V512 = 'V512';

function cleanPageV512(value, fallback = 'dashboard') {
  const page = String(value || '').replace(/^#/, '').trim();
  return page || fallback;
}

function pageFromWindowV512(win) {
  return cleanPageV512(win?.location?.hash || 'dashboard');
}


function shouldRefreshScheduledPageV523(meta = {}) {
  if (meta?.lockPage === true) return false;
  if (meta?.followCurrentPage === true) return true;
  const reason = String(meta?.reason || '').toLowerCase();
  return reason.includes('install')
    || reason.includes('boot')
    || reason.includes('load')
    || reason.includes('startup');
}

function resolveScheduledPageV523(win, getPage, scheduledPage, meta = {}) {
  const fallbackPage = cleanPageV512(scheduledPage || 'dashboard');
  if (!win || !shouldRefreshScheduledPageV523(meta)) return fallbackPage;
  const currentPage = cleanPageV512(getPage?.() || win.location?.hash || fallbackPage, fallbackPage);
  return currentPage || fallbackPage;
}

function defaultActivatePageV512(win, page) {
  if (!win?.document) return false;
  const doc = win.document;
  const targetPage = cleanPageV512(page);
  const pages = Array.from(doc.querySelectorAll('.app-page[data-page]'));
  if (!pages.length) return false;
  pages.forEach((section) => {
    const active = section.dataset.page === targetPage;
    section.classList.toggle('is-active', active);
    section.hidden = false;
    section.setAttribute('aria-hidden', active ? 'false' : 'true');
  });
  doc.querySelectorAll('[data-page-link], [data-v42-page-link]').forEach((link) => {
    const linkPage = cleanPageV512(link.dataset.pageLink || link.dataset.v42PageLink || link.getAttribute('href') || '');
    link.classList.toggle('is-active', linkPage === targetPage);
    if (linkPage === targetPage) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  return true;
}


function isUserIntentMetaV525(meta = {}) {
  const reason = String(meta?.reason || '').toLowerCase();
  return reason.includes('click')
    || reason.includes('hashchange')
    || reason.includes('setapppage')
    || reason.includes('navigation');
}

function isBootTimerMetaV525(meta = {}) {
  const reason = String(meta?.reason || '').toLowerCase();
  return reason.includes('install')
    || reason.includes('boot')
    || reason.includes('load')
    || reason.includes('startup');
}

function shouldSkipDuplicateRunV525(runtime, page, meta = {}, hasRenderableData = () => false) {
  if (!runtime?.lastRun || meta?.forceLoad) return false;
  const reason = String(meta?.reason || '').toLowerCase();
  if (reason.includes('click') || reason.includes('hashchange') || reason.includes('setapppage')) return false;
  const samePage = cleanPageV512(runtime.lastRun.page || '') === cleanPageV512(page || '');
  const freshEnough = Date.now() - Number(runtime.lastRunAtV525 || 0) < 1400;
  return samePage && freshEnough && Boolean(hasRenderableData(page, meta));
}

function createPublicDataAutoloadV512(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const logger = options.logger || (typeof console !== 'undefined' ? console : { warn() {}, info() {} });
  const delays = Array.isArray(options.delays) && options.delays.length ? options.delays : [0, 120, 600, 1600, 3200];
  const getPage = typeof options.getPage === 'function' ? options.getPage : () => pageFromWindowV512(win);
  const hasRenderableData = typeof options.hasRenderableData === 'function' ? options.hasRenderableData : () => true;
  const loadPublicData = typeof options.loadPublicData === 'function' ? options.loadPublicData : async () => true;
  const renderPage = typeof options.renderPage === 'function' ? options.renderPage : () => {};
  const activatePage = typeof options.activatePage === 'function' ? options.activatePage : (page) => defaultActivatePageV512(win, page);
  const shouldHandlePage = typeof options.shouldHandlePage === 'function' ? options.shouldHandlePage : () => true;
  const afterRun = typeof options.afterRun === 'function' ? options.afterRun : () => {};
  const runtime = {
    version: PUBLIC_DATA_AUTOLOAD_VERSION_V512,
    installed: false,
    timers: [],
    timerMetasV525: new Map(),
    lastUserIntentAtV525: 0,
    lastRunAtV525: 0,
    pending: null,
    lastRun: null,
    clearTimers() {
      if (!win) return;
      this.timers.splice(0).forEach((timer) => {
        win.clearTimeout(timer);
        this.timerMetasV525?.delete?.(timer);
      });
    },
    clearBootTimersForIntentV525(meta = {}) {
      if (!win || !isUserIntentMetaV525(meta)) return;
      this.lastUserIntentAtV525 = Date.now();
      this.timers.slice().forEach((timer) => {
        const timerMeta = this.timerMetasV525?.get?.(timer) || {};
        if (!isBootTimerMetaV525(timerMeta)) return;
        win.clearTimeout(timer);
        this.timerMetasV525?.delete?.(timer);
        this.timers = this.timers.filter((item) => item !== timer);
      });
    },
    schedule(meta = {}) {
      if (!win) return this;
      const scheduledPage = cleanPageV512(meta.page || getPage());
      this.clearBootTimersForIntentV525(meta);
      if (!shouldHandlePage(scheduledPage, meta)) return this;
      const delay = Number.isFinite(Number(meta.delayMs)) ? Number(meta.delayMs) : 0;
      const timer = win.setTimeout(() => {
        this.timers = this.timers.filter((item) => item !== timer);
        this.timerMetasV525?.delete?.(timer);
        const page = resolveScheduledPageV523(win, getPage, scheduledPage, meta);
        if (!shouldHandlePage(page, { ...meta, scheduledPage })) return;
        this.run({ ...meta, page, scheduledPage }).catch((error) => logger.warn?.('Public data autoload V512 non completato', error));
      }, Math.max(0, delay));
      this.timers.push(timer);
      this.timerMetasV525?.set?.(timer, { ...meta, page: scheduledPage, delayMs: delay });
      return this;
    },
    scheduleBoot(meta = {}) {
      delays.forEach((delayMs) => this.schedule({ ...meta, reason: meta.reason || 'boot-v512', delayMs }));
      return this;
    },
    async run(meta = {}) {
      const initialPage = cleanPageV512(meta.page || getPage());
      if (!shouldHandlePage(initialPage, meta)) return false;
      if (shouldSkipDuplicateRunV525(this, initialPage, meta, hasRenderableData)) return true;
      if (this.pending) return this.pending;
      this.pending = (async () => {
        let page = initialPage;
        const hadRenderableData = Boolean(hasRenderableData(page, meta));
        activatePage(page, meta);
        if (!hadRenderableData || meta.forceLoad) {
          await loadPublicData({ ...meta, page, hadRenderableData });
        }
        const freshPage = resolveScheduledPageV523(win, getPage, page, { ...meta, afterLoad: true });
        if (freshPage !== page && shouldHandlePage(freshPage, { ...meta, scheduledPage: meta.scheduledPage || initialPage })) {
          page = freshPage;
          activatePage(page, {
            ...meta,
            stalePage: initialPage,
            reason: `${meta.reason || 'run'}-fresh-page-v523`
          });
        }
        const hasRenderableDataAfter = Boolean(hasRenderableData(page, meta));
        renderPage(page, { ...meta, page, initialPage, hadRenderableData, hasRenderableDataAfter });
        this.lastRun = {
          version: PUBLIC_DATA_AUTOLOAD_VERSION_V512,
          page,
          initialPage,
          scheduledPage: meta.scheduledPage || initialPage,
          reason: meta.reason || 'run',
          hadRenderableData,
          hasRenderableDataAfter,
          at: new Date().toISOString()
        };
        this.lastRunAtV525 = Date.now();
        afterRun(this.lastRun);
        return hasRenderableDataAfter;
      })().finally(() => { this.pending = null; });
      return this.pending;
    },
    install() {
      if (!win || this.installed) return this;
      this.onHashChange = () => this.schedule({ reason: 'hashchange-v512', page: pageFromWindowV512(win), forceLoad: false });
      this.onClick = (event) => {
        const target = event.target?.closest?.('[data-page-link], [data-v42-page-link], a[href^="#"]');
        if (!target) return;
        const page = cleanPageV512(target.dataset.pageLink || target.dataset.v42PageLink || target.getAttribute('href') || '');
        if (!shouldHandlePage(page, { reason: 'click-v512' })) return;
        this.schedule({ reason: 'click-v512', page, delayMs: 30 });
      };
      this.onLoad = () => this.scheduleBoot({ reason: 'window-load-v512', forceLoad: false });
      win.addEventListener?.('hashchange', this.onHashChange);
      win.document?.addEventListener?.('click', this.onClick, true);
      win.addEventListener?.('load', this.onLoad);
      this.installed = true;
      this.scheduleBoot({ reason: 'install-v512', forceLoad: false });
      return this;
    },
    uninstall() {
      if (!win || !this.installed) return this;
      win.removeEventListener?.('hashchange', this.onHashChange);
      win.document?.removeEventListener?.('click', this.onClick, true);
      win.removeEventListener?.('load', this.onLoad);
      this.clearTimers();
      this.installed = false;
      return this;
    }
  };
  return runtime;
}

function installPublicDataAutoloadV512(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const runtime = createPublicDataAutoloadV512(options).install();
  if (win) {
    win.FantaEnginePublicDataAutoloadV512 = runtime;
    win.FantaEnginePublicDataAutoloadRuntimeV512 = runtime;
  }
  return runtime;
}

const PUBLIC_DATA_AUTOLOAD_VERSION_V515 = 'V515';
const PUBLIC_DATA_AUTOLOAD_VERSION_V516 = 'V516';
const PUBLIC_DATA_AUTOLOAD_VERSION_V517 = 'V517';
const PUBLIC_DATA_AUTOLOAD_VERSION_V518 = 'V518';
const PUBLIC_DATA_AUTOLOAD_VERSION_V519 = 'V519';
const PUBLIC_DATA_AUTOLOAD_VERSION_V520 = 'V520';
const PUBLIC_DATA_AUTOLOAD_VERSION_V521 = 'V521';
const PUBLIC_DATA_AUTOLOAD_VERSION_V522 = 'V522';
const PUBLIC_DATA_AUTOLOAD_VERSION_V523 = 'V523';
const PUBLIC_DATA_AUTOLOAD_VERSION_V524 = 'V524';
const PUBLIC_DATA_AUTOLOAD_VERSION_V525 = 'V525';
const PUBLIC_DATA_AUTOLOAD_VERSION_V526 = 'V526';

function createPublicDataAutoloadV515(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function createPublicDataAutoloadV516(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function createPublicDataAutoloadV517(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function createPublicDataAutoloadV518(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function createPublicDataAutoloadV519(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function createPublicDataAutoloadV520(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function createPublicDataAutoloadV521(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function createPublicDataAutoloadV522(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function createPublicDataAutoloadV523(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function createPublicDataAutoloadV524(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function createPublicDataAutoloadV525(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function createPublicDataAutoloadV526(options = {}) {
  return createPublicDataAutoloadV512(options);
}

function exposePublicDataAutoloadAliasV512(win, runtime, version) {
  if (!win || !version) return runtime;
  win[`FantaEnginePublicDataAutoload${version}`] = runtime;
  win[`FantaEnginePublicDataAutoloadRuntime${version}`] = runtime;
  return runtime;
}

function installPublicDataAutoloadAliasV512(options = {}, version = 'V512') {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const runtime = installPublicDataAutoloadV512(options);
  return exposePublicDataAutoloadAliasV512(win, runtime, version);
}

function installPublicDataAutoloadV515(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V515);
}

function installPublicDataAutoloadV516(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V516);
}

function installPublicDataAutoloadV517(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V517);
}

function installPublicDataAutoloadV518(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V518);
}

function installPublicDataAutoloadV519(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V519);
}

function installPublicDataAutoloadV520(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V520);
}

function installPublicDataAutoloadV521(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V521);
}

function installPublicDataAutoloadV522(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V522);
}

function installPublicDataAutoloadV523(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V523);
}

function installPublicDataAutoloadV524(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V524);
}

function installPublicDataAutoloadV525(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V525);
}

function installPublicDataAutoloadV526(options = {}) {
  return installPublicDataAutoloadAliasV512(options, PUBLIC_DATA_AUTOLOAD_VERSION_V526);
}

export {
  PUBLIC_DATA_AUTOLOAD_VERSION_V512,
  PUBLIC_DATA_AUTOLOAD_VERSION_V515,
  PUBLIC_DATA_AUTOLOAD_VERSION_V516,
  PUBLIC_DATA_AUTOLOAD_VERSION_V517,
  PUBLIC_DATA_AUTOLOAD_VERSION_V518,
  PUBLIC_DATA_AUTOLOAD_VERSION_V519,
  PUBLIC_DATA_AUTOLOAD_VERSION_V520,
  PUBLIC_DATA_AUTOLOAD_VERSION_V521,
  PUBLIC_DATA_AUTOLOAD_VERSION_V522,
  PUBLIC_DATA_AUTOLOAD_VERSION_V523,
  PUBLIC_DATA_AUTOLOAD_VERSION_V524,
  PUBLIC_DATA_AUTOLOAD_VERSION_V525,
  PUBLIC_DATA_AUTOLOAD_VERSION_V526,
  createPublicDataAutoloadV512,
  createPublicDataAutoloadV515,
  createPublicDataAutoloadV516,
  createPublicDataAutoloadV517,
  createPublicDataAutoloadV518,
  createPublicDataAutoloadV519,
  createPublicDataAutoloadV520,
  createPublicDataAutoloadV521,
  createPublicDataAutoloadV522,
  createPublicDataAutoloadV523,
  createPublicDataAutoloadV524,
  createPublicDataAutoloadV525,
  createPublicDataAutoloadV526,
  installPublicDataAutoloadV512,
  installPublicDataAutoloadV515,
  installPublicDataAutoloadV516,
  installPublicDataAutoloadV517,
  installPublicDataAutoloadV518,
  installPublicDataAutoloadV519,
  installPublicDataAutoloadV520,
  installPublicDataAutoloadV521,
  installPublicDataAutoloadV522,
  installPublicDataAutoloadV523,
  installPublicDataAutoloadV524,
  installPublicDataAutoloadV525,
  installPublicDataAutoloadV526,
  resolveScheduledPageV523,
  shouldRefreshScheduledPageV523,
  isUserIntentMetaV525,
  isBootTimerMetaV525,
  shouldSkipDuplicateRunV525,
  defaultActivatePageV512,
  cleanPageV512
};
