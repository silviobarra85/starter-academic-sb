/**
 * V532 - Quick navigation smoke and observer.
 *
 * Osserva in modo additive-only i passaggi rapidi Dashboard/Listone/Calciomercato.
 * Non cambia hash, non chiama setAppPage, non renderizza dati e non sostituisce renderer locali.
 */

const QUICK_NAV_TARGETS_V532 = Object.freeze(['dashboard', 'listone', 'calciomercato']);
const MAX_EVENTS_V532 = 24;

function normalizePageV532(value) {
  const raw = String(value || '').trim().replace(/^#/, '').split('?')[0].split('&')[0];
  return raw || 'dashboard';
}

function safeNowV532() {
  try {
    if (globalThis.performance && typeof globalThis.performance.now === 'function') return globalThis.performance.now();
  } catch (_) {}
  return Date.now();
}

function getCurrentHashPageV532(win) {
  try { return normalizePageV532(win?.location?.hash || 'dashboard'); }
  catch (_) { return 'dashboard'; }
}

function getActivePageV532(doc) {
  try {
    const node = doc?.querySelector?.('[data-page].is-active, [data-page].active, [data-page][aria-hidden="false"]');
    return normalizePageV532(node?.getAttribute?.('data-page') || '');
  } catch (_) {
    return '';
  }
}

function getLinkedPagesV532(doc) {
  const values = [];
  try {
    doc?.querySelectorAll?.('[data-page-link]')?.forEach((node) => {
      const page = normalizePageV532(node.getAttribute('data-page-link'));
      if (page && !values.includes(page)) values.push(page);
    });
  } catch (_) {}
  return values;
}

function createEventV532(reason, options = {}) {
  const win = options.window || globalThis.window;
  const doc = options.document || win?.document || globalThis.document;
  let statePage = '';
  try { statePage = normalizePageV532(options.getCurrentPage?.()); } catch (_) { statePage = ''; }
  return {
    reason: String(reason || 'unknown'),
    at: new Date().toISOString(),
    t: safeNowV532(),
    hashPage: getCurrentHashPageV532(win),
    statePage: statePage || '',
    activePage: getActivePageV532(doc),
    targetPagesPresent: QUICK_NAV_TARGETS_V532.every((page) => getLinkedPagesV532(doc).includes(page)),
    linkedTargets: getLinkedPagesV532(doc).filter((page) => QUICK_NAV_TARGETS_V532.includes(page))
  };
}

function buildReportV532(events, options = {}) {
  const latest = events[events.length - 1] || createEventV532('init', options);
  const quickTargets = events.filter((event) => QUICK_NAV_TARGETS_V532.includes(event.hashPage) || QUICK_NAV_TARGETS_V532.includes(event.statePage));
  const possibleDashboardFallback = quickTargets.some((event, index) => {
    const prev = quickTargets[index - 1];
    if (!prev) return false;
    return prev.hashPage !== 'dashboard' && event.hashPage === 'dashboard' && (event.t - prev.t) < 1200;
  });
  return {
    version: 'V532',
    scope: 'quick-navigation-smoke-observer',
    targets: [...QUICK_NAV_TARGETS_V532],
    replacesNavigation: false,
    mutatesHash: false,
    callsSetAppPage: false,
    replacesLocalRenderers: false,
    touchesFirebase: false,
    touchesEmailJs: false,
    touchesData: false,
    protectsAdminFlows: true,
    protectsPresidentFlows: true,
    sharedAssetsCurrentPreserved: true,
    localFallbacksPreserved: true,
    eventCount: events.length,
    latest,
    possibleDashboardFallback,
    events: events.slice(-MAX_EVENTS_V532),
    generatedAt: new Date().toISOString()
  };
}

export function createQuickNavigationSmokeReportV532(options = {}) {
  return buildReportV532([createEventV532('snapshot', options)], options);
}

export function installQuickNavigationSmokeV532(options = {}) {
  const win = options.window || globalThis.window;
  const events = [];

  function record(reason = 'manual') {
    const event = createEventV532(reason, options);
    events.push(event);
    while (events.length > MAX_EVENTS_V532) events.shift();
    const report = buildReportV532(events, options);
    if (win) {
      win.FantaEngineQuickNavigationSmokeLastReportV532 = report;
    }
    return report;
  }

  const runtime = {
    version: 'V532',
    scope: 'quick-navigation-smoke-observer',
    targets: [...QUICK_NAV_TARGETS_V532],
    replacesNavigation: false,
    mutatesHash: false,
    callsSetAppPage: false,
    replacesLocalRenderers: false,
    touchesFirebase: false,
    touchesEmailJs: false,
    touchesData: false,
    record,
    getReport: () => buildReportV532(events, options)
  };

  if (win) {
    win.FantaEngineQuickNavigationSmokeRuntimeV532 = runtime;
    record('install');
    if (typeof win.addEventListener === 'function') {
      win.addEventListener('hashchange', () => record('hashchange'), { passive: true });
      win.addEventListener('pageshow', () => record('pageshow'), { passive: true });
    }
    const schedule = typeof win.requestAnimationFrame === 'function'
      ? (fn) => win.requestAnimationFrame(fn)
      : (fn) => setTimeout(fn, 0);
    schedule(() => record('first-frame'));
    setTimeout(() => record('post-boot-240ms'), 240);
    setTimeout(() => record('post-boot-900ms'), 900);
  }

  return runtime;
}

export default installQuickNavigationSmokeV532;
