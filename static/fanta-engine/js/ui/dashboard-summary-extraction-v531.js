/**
 * V531 - Dashboard public summary extraction.
 *
 * Seconda micro-estrazione dashboard verso fanta-engine.
 * Legge e pubblica solo un summary dei blocchi dashboard pubblici gia renderizzati.
 * Non sostituisce renderer locali, non scrive Firebase, non tocca EmailJS e non cambia dati.
 */

const DEFAULT_METRIC_IDS_V531 = [
  'metricClubs',
  'metricTotalFm',
  'metricAlerts',
  'metricAlertsReason'
];

const DEFAULT_SECTION_IDS_V531 = [
  'dashboardStandings',
  'dashboardCalendar',
  'dashboardTopScorers',
  'dashboardNews',
  'dashboardAlerts'
];

function safeTextV531(node) {
  return String(node?.textContent || '').replace(/\s+/g, ' ').trim();
}

function safeIdListV531(root, ids) {
  const doc = root?.document || root;
  if (!doc || typeof doc.getElementById !== 'function') return [];
  return ids.map((id) => {
    const node = doc.getElementById(id);
    return {
      id,
      present: Boolean(node),
      text: safeTextV531(node)
    };
  });
}

function currentPageFromOptionsV531(options) {
  try {
    const raw = options?.getCurrentPage?.();
    return String(raw || 'dashboard').replace(/^#/, '') || 'dashboard';
  } catch (_) {
    return 'dashboard';
  }
}

function getValueV531(fn, fallback = '') {
  try {
    const value = fn?.();
    return value == null ? fallback : String(value);
  } catch (_) {
    return fallback;
  }
}

export function createDashboardPublicSummaryV531(options = {}) {
  const win = options.window || globalThis.window;
  const doc = options.document || win?.document || globalThis.document;
  const metricIds = Array.isArray(options.metricIds) && options.metricIds.length ? options.metricIds : DEFAULT_METRIC_IDS_V531;
  const sectionIds = Array.isArray(options.sectionIds) && options.sectionIds.length ? options.sectionIds : DEFAULT_SECTION_IDS_V531;
  const page = currentPageFromOptionsV531(options);
  const metrics = safeIdListV531(doc, metricIds);
  const sections = safeIdListV531(doc, sectionIds);
  const activeSection = doc?.querySelector?.('[data-page].is-active, [data-page].active, [data-page][aria-hidden="false"]')?.getAttribute?.('data-page') || '';
  return {
    version: 'V531',
    extraction: 'public-dashboard-summary',
    replacesLocalRenderers: false,
    fallbackLocalRenderersAvailable: true,
    touchesFirebase: false,
    touchesEmailJs: false,
    touchesData: false,
    protectsAdminFlows: true,
    protectsPresidentFlows: true,
    leagueId: getValueV531(options.getLeagueId, ''),
    seasonId: getValueV531(options.getSeasonId, ''),
    currentPage: page,
    activeSection,
    metrics,
    sections,
    presentMetricCount: metrics.filter((item) => item.present).length,
    presentSectionCount: sections.filter((item) => item.present).length,
    generatedAt: new Date().toISOString()
  };
}

export function installDashboardSummaryExtractionV531(options = {}) {
  const win = options.window || globalThis.window;
  let lastReport = null;

  function collect() {
    lastReport = createDashboardPublicSummaryV531(options);
    if (win) {
      win.FantaEngineDashboardSummaryExtractionLastReportV531 = lastReport;
    }
    return lastReport;
  }

  function requestSummaryRefresh(reason = 'manual') {
    const report = collect();
    if (win) {
      win.FantaEngineDashboardSummaryExtractionLastReasonV531 = String(reason || 'manual');
    }
    return report;
  }

  const runtime = {
    version: 'V531',
    scope: 'dashboard-public-summary-extraction',
    extraction: 'public-dashboard-summary',
    replacesLocalRenderers: false,
    fallbackLocalRenderersAvailable: true,
    touchesFirebase: false,
    touchesEmailJs: false,
    touchesData: false,
    collect,
    requestSummaryRefresh,
    getLastReport: () => lastReport
  };

  if (win) {
    win.FantaEngineDashboardSummaryExtractionRuntimeV531 = runtime;
    const refresh = () => requestSummaryRefresh('boot');
    if (typeof win.queueMicrotask === 'function') {
      win.queueMicrotask(refresh);
    } else {
      setTimeout(refresh, 0);
    }
  } else {
    collect();
  }

  return runtime;
}

export default installDashboardSummaryExtractionV531;
