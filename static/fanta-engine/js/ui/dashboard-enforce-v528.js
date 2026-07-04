/* Fanta engine V528 - Dashboard enforce guard.
 * Conservative hardening layer: it enforces guardrails around the gradual
 * dashboard renderer migration without replacing local renderers.
 */

export const DASHBOARD_ENFORCE_VERSION_V528 = 'V528';

function getWindowV528(options = {}) {
  return options.window || (typeof window !== 'undefined' ? window : null);
}

function getDocumentV528(options = {}) {
  return options.document || (typeof document !== 'undefined' ? document : null);
}

function normalizePageV528(value) {
  return String(value || 'dashboard').replace(/^#/, '').trim() || 'dashboard';
}

function getCurrentPageV528(options = {}) {
  if (typeof options.getCurrentPage === 'function') {
    return normalizePageV528(options.getCurrentPage());
  }
  const win = getWindowV528(options);
  return normalizePageV528(win?.location?.hash || 'dashboard');
}

function getSeasonIdV528(options = {}) {
  return typeof options.getSeasonId === 'function' ? String(options.getSeasonId() || '') : '';
}

function getLeagueIdV528(options = {}) {
  return typeof options.getLeagueId === 'function' ? String(options.getLeagueId() || '') : '';
}

function uniqueNodesV528(nodes = []) {
  return Array.from(new Set(nodes.filter(Boolean)));
}

function selectAllV528(doc, selectors = []) {
  if (!doc) return [];
  const nodes = [];
  selectors.forEach((selector) => {
    try {
      doc.querySelectorAll?.(selector)?.forEach((node) => nodes.push(node));
    } catch (_) {
      // Ignore invalid selectors supplied by callers; enforcement must not break boot.
    }
  });
  return uniqueNodesV528(nodes);
}

export function findDashboardRootsV528({ document: doc } = {}) {
  return selectAllV528(doc, [
    '[data-page="dashboard"]',
    '#dashboard',
    '.dashboard-page',
    'main'
  ]);
}

export function findProtectedRoleRootsV528({ document: doc } = {}) {
  return selectAllV528(doc, [
    '#adminPanel',
    '[data-page="admin"]',
    '.admin-panel',
    '[data-page="teamarea"]',
    '#teamarea',
    '#teamArea',
    '#presidentDashboard',
    '[data-president-dashboard]',
    '.president-dashboard'
  ]);
}

function markNodesV528(nodes, attrs = {}) {
  nodes.forEach((node) => {
    if (!node?.dataset) return;
    Object.entries(attrs).forEach(([key, value]) => {
      node.dataset[key] = String(value);
    });
  });
}

export function buildDashboardEnforceReportV528(options = {}) {
  const doc = getDocumentV528(options);
  const page = normalizePageV528(options.page || getCurrentPageV528(options));
  const dashboardRoots = findDashboardRootsV528({ document: doc });
  const roleRoots = findProtectedRoleRootsV528({ document: doc });
  const bridgeReport = typeof options.bridgeReportBuilder === 'function'
    ? options.bridgeReportBuilder()
    : options.bridgeReport || null;
  const migrationRuntime = options.dashboardMigration || null;
  return Object.freeze({
    version: DASHBOARD_ENFORCE_VERSION_V528,
    status: 'guarded',
    page,
    seasonId: String(options.seasonId || getSeasonIdV528(options) || ''),
    leagueId: String(options.leagueId || getLeagueIdV528(options) || ''),
    dashboardRoots: dashboardRoots.length,
    protectedRoleRoots: roleRoots.length,
    bridgeRuntimeAvailable: Boolean(migrationRuntime),
    bridgeReportAvailable: Boolean(bridgeReport),
    replacesLocalRenderers: false,
    blocksDashboardOverride: true,
    protectsAdminFlows: true,
    protectsPresidentFlows: true,
    firebaseWrites: false,
    emailjsChanged: false,
    sharedAssetsCurrentPreserved: true,
    localFallbacksPreserved: true
  });
}

export function enforceDashboardGuardsV528(options = {}) {
  const doc = getDocumentV528(options);
  const win = getWindowV528(options);
  const page = normalizePageV528(options.page || getCurrentPageV528(options));
  const seasonId = String(options.seasonId || getSeasonIdV528(options) || '');
  const leagueId = String(options.leagueId || getLeagueIdV528(options) || '');
  const reason = String(options.reason || 'enforce-v528');
  const dashboardRoots = findDashboardRootsV528({ document: doc });
  const roleRoots = findProtectedRoleRootsV528({ document: doc });

  markNodesV528(dashboardRoots, {
    dashboardEnforceV528: DASHBOARD_ENFORCE_VERSION_V528,
    dashboardEnforceModeV528: 'guard-local-renderers',
    dashboardEnforceReasonV528: reason,
    dashboardEnforcePageV528: page,
    dashboardEnforceSeasonV528: seasonId,
    dashboardEnforceLeagueV528: leagueId
  });
  markNodesV528(roleRoots, {
    dashboardEnforceV528: DASHBOARD_ENFORCE_VERSION_V528,
    dashboardEnforceProtectedRoleV528: 'true',
    dashboardEnforceRolePolicyV528: 'preserve-local-flows'
  });

  const report = buildDashboardEnforceReportV528({
    ...options,
    page,
    seasonId,
    leagueId,
    bridgeReport: options.bridgeReport
  });
  if (win) {
    win.FantaEngineDashboardEnforceLastReportV528 = report;
  }
  return report;
}

export function installDashboardEnforceV528(options = {}) {
  const win = getWindowV528(options);
  const api = Object.freeze({
    version: DASHBOARD_ENFORCE_VERSION_V528,
    mode: 'guard-local-renderers',
    enforceOnly: true,
    replacesLocalRenderers: false,
    blocksDashboardOverride: true,
    protectsAdminFlows: true,
    protectsPresidentFlows: true,
    firebaseWrites: false,
    emailjsChanged: false,
    sharedAssetsCurrentPreserved: true,
    localFallbacksPreserved: true,
    findDashboardRoots: (props = {}) => findDashboardRootsV528({ ...options, ...props }),
    findProtectedRoleRoots: (props = {}) => findProtectedRoleRootsV528({ ...options, ...props }),
    buildReport: (props = {}) => buildDashboardEnforceReportV528({ ...options, ...props }),
    enforce: (props = {}) => enforceDashboardGuardsV528({ ...options, ...props })
  });
  if (win) {
    win.FantaEngineDashboardEnforceRuntimeV528 = api;
  }
  return api;
}

export const FANTA_ENGINE_DASHBOARD_ENFORCE_V528 = Object.freeze({
  version: DASHBOARD_ENFORCE_VERSION_V528,
  scope: 'whole-site-dashboard-enforce-guard',
  enforceOnly: true,
  replacesLocalRenderers: false,
  blocksDashboardOverride: true,
  protectsAdminFlows: true,
  protectsPresidentFlows: true,
  firebaseWrites: false,
  emailjsChanged: false,
  sharedAssetsCurrentPreserved: true,
  localFallbacksPreserved: true
});
