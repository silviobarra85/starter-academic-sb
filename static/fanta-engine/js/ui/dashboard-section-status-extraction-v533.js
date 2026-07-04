/**
 * V533 - Dashboard section status extraction.
 *
 * Terza micro-estrazione dashboard: centralizza una lettura non critica dello stato
 * delle sezioni pubbliche collegate alla dashboard, senza sostituire renderer locali.
 */

const DEFAULT_SECTION_TARGETS_V533 = Object.freeze([
  'dashboard',
  'listone',
  'calciomercato',
  'bilanci',
  'fantamercato',
  'sorteggio'
]);

function normalizePageV533(value) {
  const raw = String(value || '').trim().replace(/^#/, '').split('?')[0].split('&')[0];
  return raw || 'dashboard';
}

function uniqueV533(values) {
  return [...new Set(values.filter(Boolean))];
}

function getDocumentV533(options = {}) {
  return options.document || options.window?.document || globalThis.document || null;
}

function getWindowV533(options = {}) {
  return options.window || globalThis.window || null;
}

function queryAllSafeV533(doc, selector) {
  try { return Array.from(doc?.querySelectorAll?.(selector) || []); }
  catch (_) { return []; }
}

function getLinkedPagesV533(doc) {
  return uniqueV533(queryAllSafeV533(doc, '[data-page-link]').map((node) => normalizePageV533(node.getAttribute('data-page-link'))));
}

function getSectionPagesV533(doc) {
  return uniqueV533(queryAllSafeV533(doc, '[data-page]').map((node) => normalizePageV533(node.getAttribute('data-page'))));
}

function getActivePageV533(doc, win, options = {}) {
  try {
    const node = doc?.querySelector?.('[data-page].is-active, [data-page].active, [data-page][aria-hidden="false"]');
    const page = normalizePageV533(node?.getAttribute?.('data-page') || '');
    if (page) return page;
  } catch (_) {}
  try {
    const statePage = normalizePageV533(options.getCurrentPage?.());
    if (statePage) return statePage;
  } catch (_) {}
  try { return normalizePageV533(win?.location?.hash || 'dashboard'); }
  catch (_) { return 'dashboard'; }
}

function findDashboardMetricStatusV533(doc) {
  const ids = ['metricClubs', 'metricTotalFm', 'metricAlerts', 'metricAlertsReason'];
  return ids.reduce((acc, id) => {
    const node = doc?.getElementById?.(id);
    acc[id] = {
      present: Boolean(node),
      hasText: Boolean(String(node?.textContent || '').trim()),
      textLength: String(node?.textContent || '').trim().length
    };
    return acc;
  }, {});
}

export function createDashboardSectionStatusReportV533(options = {}) {
  const doc = getDocumentV533(options);
  const win = getWindowV533(options);
  const targets = Array.isArray(options.targets) && options.targets.length
    ? uniqueV533(options.targets.map(normalizePageV533))
    : [...DEFAULT_SECTION_TARGETS_V533];
  const linkedPages = getLinkedPagesV533(doc);
  const sectionPages = getSectionPagesV533(doc);
  const activePage = getActivePageV533(doc, win, options);
  const statusByTarget = targets.reduce((acc, target) => {
    acc[target] = {
      navLinked: linkedPages.includes(target),
      sectionPresent: sectionPages.includes(target),
      active: activePage === target
    };
    return acc;
  }, {});
  const missingTargets = targets.filter((target) => !statusByTarget[target].navLinked || !statusByTarget[target].sectionPresent);

  return {
    version: 'V533',
    scope: 'dashboard-section-status-extraction',
    extraction: 'public-dashboard-section-status',
    targets,
    activePage,
    linkedPages,
    sectionPages,
    statusByTarget,
    missingTargets,
    metrics: findDashboardMetricStatusV533(doc),
    replacesLocalRenderers: false,
    mutatesDom: false,
    mutatesHash: false,
    callsSetAppPage: false,
    touchesFirebase: false,
    touchesEmailJs: false,
    touchesData: false,
    protectsAdminFlows: true,
    protectsPresidentFlows: true,
    sharedAssetsCurrentPreserved: true,
    localFallbacksPreserved: true,
    generatedAt: new Date().toISOString()
  };
}

export function installDashboardSectionStatusExtractionV533(options = {}) {
  const win = getWindowV533(options);
  const runtime = {
    version: 'V533',
    scope: 'dashboard-section-status-extraction',
    extraction: 'public-dashboard-section-status',
    targets: Array.isArray(options.targets) && options.targets.length
      ? uniqueV533(options.targets.map(normalizePageV533))
      : [...DEFAULT_SECTION_TARGETS_V533],
    replacesLocalRenderers: false,
    mutatesDom: false,
    mutatesHash: false,
    callsSetAppPage: false,
    touchesFirebase: false,
    touchesEmailJs: false,
    touchesData: false,
    getReport: () => createDashboardSectionStatusReportV533(options),
    refresh: () => {
      const report = createDashboardSectionStatusReportV533(options);
      if (win) win.FantaEngineDashboardSectionStatusExtractionLastReportV533 = report;
      return report;
    }
  };

  if (win) {
    win.FantaEngineDashboardSectionStatusExtractionRuntimeV533 = runtime;
    runtime.refresh();
    if (typeof win.addEventListener === 'function') {
      win.addEventListener('hashchange', () => runtime.refresh(), { passive: true });
      win.addEventListener('pageshow', () => runtime.refresh(), { passive: true });
    }
    setTimeout(() => runtime.refresh(), 240);
    setTimeout(() => runtime.refresh(), 900);
  }

  return runtime;
}

export default installDashboardSectionStatusExtractionV533;
