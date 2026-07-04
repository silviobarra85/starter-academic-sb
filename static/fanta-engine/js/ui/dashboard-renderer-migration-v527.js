/* Fanta engine V527 - Dashboard renderer migration bridge.
 * Conservative post-render bridge: it decorates existing dashboard DOM nodes and
 * synchronizes public metric metadata without replacing local dashboard renderers.
 * This is intentionally additive and reversible.
 */

import {
  defaultEscapeHtmlV505,
  normalizeFeatureCardIdV505
} from './dashboard-renderer-helpers-v505.js?v=505';

export const DASHBOARD_RENDERER_MIGRATION_VERSION_V527 = 'V527';

function asTextV527(value, fallback = '') {
  const text = String(value ?? fallback ?? '').trim();
  return text || String(fallback ?? '').trim();
}

function getDocumentV527(options = {}) {
  return options.document || (typeof document !== 'undefined' ? document : null);
}

function getEscapeHtmlV527(options = {}) {
  return typeof options.escapeHtml === 'function' ? options.escapeHtml : defaultEscapeHtmlV505;
}

export function decorateDashboardRootV527({ root, document: doc, page = 'dashboard', seasonId = '', leagueId = '' } = {}) {
  const targetRoot = root || getDocumentV527({ document: doc })?.querySelector?.('[data-page="dashboard"], #dashboard, .dashboard-page, main');
  if (!targetRoot) return null;
  targetRoot.dataset.dashboardRendererMigrationV527 = DASHBOARD_RENDERER_MIGRATION_VERSION_V527;
  targetRoot.dataset.dashboardRendererBridgeV527 = 'post-render';
  targetRoot.dataset.dashboardRendererPageV527 = asTextV527(page, 'dashboard');
  if (seasonId) targetRoot.dataset.dashboardRendererSeasonV527 = asTextV527(seasonId);
  if (leagueId) targetRoot.dataset.dashboardRendererLeagueV527 = asTextV527(leagueId);
  return targetRoot;
}

export function syncDashboardMetricValueV527({ document: doc, id, value, label = '', source = 'post-render' } = {}) {
  const target = getDocumentV527({ document: doc })?.getElementById?.(id);
  if (!target) return null;
  if (value !== undefined && value !== null) target.textContent = String(value);
  target.dataset.dashboardRendererMigrationV527 = DASHBOARD_RENDERER_MIGRATION_VERSION_V527;
  target.dataset.dashboardMetricIdV527 = normalizeFeatureCardIdV505(id || 'dashboard-metric');
  target.dataset.dashboardMetricSourceV527 = asTextV527(source, 'post-render');
  if (label) target.dataset.dashboardMetricLabelV527 = asTextV527(label);
  return target;
}

export function decorateDashboardContainersV527({ document: doc, selectors = [] } = {}) {
  const targetDoc = getDocumentV527({ document: doc });
  if (!targetDoc) return [];
  const defaultSelectors = [
    '#dashboardStandings',
    '#dashboardCalendar',
    '[data-dashboard-section]',
    '.dashboard-subsection',
    '.dashboard-competition-summary'
  ];
  const decorated = [];
  [...defaultSelectors, ...selectors].forEach((selector) => {
    targetDoc.querySelectorAll?.(selector)?.forEach((node) => {
      if (!node || decorated.includes(node)) return;
      node.dataset.dashboardRendererMigrationV527 = DASHBOARD_RENDERER_MIGRATION_VERSION_V527;
      node.dataset.dashboardRendererBridgeV527 = 'container-decoration';
      decorated.push(node);
    });
  });
  return decorated;
}

export function buildDashboardRendererMigrationReportV527({ document: doc } = {}) {
  const targetDoc = getDocumentV527({ document: doc });
  if (!targetDoc) {
    return Object.freeze({ version: DASHBOARD_RENDERER_MIGRATION_VERSION_V527, available: false, metrics: 0, containers: 0 });
  }
  const metrics = targetDoc.querySelectorAll?.('[data-dashboard-metric-id-v527]')?.length || 0;
  const containers = targetDoc.querySelectorAll?.('[data-dashboard-renderer-bridge-v527]')?.length || 0;
  return Object.freeze({
    version: DASHBOARD_RENDERER_MIGRATION_VERSION_V527,
    available: true,
    metrics,
    containers,
    replacesLocalRenderers: false,
    firebaseWrites: false,
    emailjsChanged: false
  });
}

export function installDashboardRendererMigrationV527(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const doc = getDocumentV527(options);
  const escapeHtml = getEscapeHtmlV527(options);
  const baseHelpers = options.baseHelpers || null;
  const api = Object.freeze({
    version: DASHBOARD_RENDERER_MIGRATION_VERSION_V527,
    baseVersion: baseHelpers?.version || 'V509',
    gradualMigration: true,
    postRenderBridge: true,
    replacesLocalRenderers: false,
    firebaseWrites: false,
    emailjsChanged: false,
    noAdminRoleChanges: true,
    noPresidentRoleChanges: true,
    escapeHtml,
    decorateDashboardRoot: (props = {}) => decorateDashboardRootV527({ document: doc, ...props }),
    syncDashboardMetric: (props = {}) => syncDashboardMetricValueV527({ document: doc, ...props }),
    decorateDashboardContainers: (props = {}) => decorateDashboardContainersV527({ document: doc, ...props }),
    buildReport: (props = {}) => buildDashboardRendererMigrationReportV527({ document: doc, ...props })
  });
  if (win) {
    win.FantaEngineDashboardRendererMigrationRuntimeV527 = api;
    win.FantaEngineDashboardRendererBridgeV527 = api;
  }
  return api;
}

export const FANTA_ENGINE_DASHBOARD_RENDERER_MIGRATION_V527 = Object.freeze({
  version: DASHBOARD_RENDERER_MIGRATION_VERSION_V527,
  gradualMigration: true,
  postRenderBridge: true,
  replacesLocalRenderers: false,
  touchesFirebase: false,
  touchesEmailJs: false,
  touchesAdminFlows: false,
  touchesPresidentFlows: false,
  preservesSharedAssetsCurrent: true,
  preservesLocalFallbacks: true
});
