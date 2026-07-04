import {
  defaultEscapeHtmlV505,
  normalizeFeatureCardIdV505,
  renderCollapsiblePanelV505,
  renderDashboardActionCardV505,
  renderMetricCardV505
} from './dashboard-renderer-helpers-v505.js?v=505';

const DASHBOARD_RENDERER_MIGRATION_VERSION_V509 = 'V509';

function getEscapeHtmlV509(options = {}) {
  return typeof options.escapeHtml === 'function' ? options.escapeHtml : defaultEscapeHtmlV505;
}

function normalizeRendererIdV509(value, fallback = 'dashboard-card') {
  return normalizeFeatureCardIdV505(value || fallback);
}

function renderAdminCollapsiblePanelV509(options = {}) {
  const escapeHtml = getEscapeHtmlV509(options);
  return renderCollapsiblePanelV505({
    ...options,
    escapeHtml,
    extraData: {
      ...(options.extraData || {}),
      dashboardRendererMigrationV509: DASHBOARD_RENDERER_MIGRATION_VERSION_V509,
      dashboardRendererSourceV509: 'admin-collapsible-panel'
    }
  });
}

function renderPresidentDashboardMetricV509({
  label = '',
  value = '',
  detail = '',
  className = 'president-dashboard-metric-v369',
  featureCardId = '',
  escapeHtml = defaultEscapeHtmlV505
} = {}) {
  const html = renderMetricCardV505({ label, value, hint: detail, className, escapeHtml });
  const feature = normalizeRendererIdV509(featureCardId || `president-metric-${label}`);
  return html.replace('<article ', `<article data-feature-card-id="${escapeHtml(feature)}" data-dashboard-renderer-v509="${DASHBOARD_RENDERER_MIGRATION_VERSION_V509}" data-dashboard-renderer-category-v509="president-metric" `);
}

function renderPresidentActionCardV509(options = {}) {
  const escapeHtml = getEscapeHtmlV509(options);
  return renderDashboardActionCardV505({
    visibility: 'president',
    category: 'president-dashboard',
    ...options,
    escapeHtml
  }).replace('<article ', `<article data-dashboard-renderer-v509="${DASHBOARD_RENDERER_MIGRATION_VERSION_V509}" `);
}

function renderDashboardEmptyStateV509({ message = 'Nessun dato disponibile.', className = 'muted', escapeHtml = defaultEscapeHtmlV505 } = {}) {
  return `<p class="${escapeHtml(className)}" data-dashboard-renderer-v509="${DASHBOARD_RENDERER_MIGRATION_VERSION_V509}">${escapeHtml(message)}</p>`;
}

function decorateDashboardRendererNodeV509(element, { source = 'legacy-renderer', featureCardId = '', category = '' } = {}) {
  if (!element) return null;
  element.dataset.dashboardRendererV509 = DASHBOARD_RENDERER_MIGRATION_VERSION_V509;
  element.dataset.dashboardRendererSourceV509 = source;
  if (featureCardId) element.dataset.featureCardId = normalizeRendererIdV509(featureCardId);
  if (category) element.dataset.dashboardRendererCategoryV509 = category;
  return element;
}

function installDashboardRendererHelpersV509(options = {}) {
  const win = options.window || (typeof window !== 'undefined' ? window : null);
  const escapeHtml = getEscapeHtmlV509(options);
  const baseHelpers = options.baseHelpers || null;
  const api = Object.freeze({
    version: DASHBOARD_RENDERER_MIGRATION_VERSION_V509,
    baseVersion: baseHelpers?.version || 'V505',
    gradualMigration: true,
    noFirebaseWrites: true,
    noEmailChanges: true,
    renderAdminCollapsiblePanel: (props = {}) => renderAdminCollapsiblePanelV509({ ...props, escapeHtml: props.escapeHtml || escapeHtml }),
    renderPresidentDashboardMetric: (props = {}) => renderPresidentDashboardMetricV509({ ...props, escapeHtml: props.escapeHtml || escapeHtml }),
    renderPresidentActionCard: (props = {}) => renderPresidentActionCardV509({ ...props, escapeHtml: props.escapeHtml || escapeHtml }),
    renderDashboardEmptyState: (props = {}) => renderDashboardEmptyStateV509({ ...props, escapeHtml: props.escapeHtml || escapeHtml }),
    decorateDashboardRendererNode: decorateDashboardRendererNodeV509,
    normalizeRendererId: normalizeRendererIdV509
  });
  if (win) {
    win.FantaEngineDashboardRendererHelpersV509 = api;
    win.FantaEngineDashboardRendererMigrationRuntimeV509 = api;
  }
  return api;
}

export {
  DASHBOARD_RENDERER_MIGRATION_VERSION_V509,
  decorateDashboardRendererNodeV509,
  installDashboardRendererHelpersV509,
  normalizeRendererIdV509,
  renderAdminCollapsiblePanelV509,
  renderDashboardEmptyStateV509,
  renderPresidentActionCardV509,
  renderPresidentDashboardMetricV509
};
