/* Fanta engine V529 - Dashboard renderer extraction controllata.
 * Primo passo di estrazione reale: sposta nel motore comune la sincronizzazione
 * non critica dei metadati metriche dashboard, lasciando invariati i renderer locali.
 */

export const DASHBOARD_RENDERER_EXTRACTION_VERSION_V529 = 'V529';

export const DEFAULT_PUBLIC_DASHBOARD_METRICS_V529 = Object.freeze([
  Object.freeze({ id: 'metricClubs', label: 'club' }),
  Object.freeze({ id: 'metricTotalFm', label: 'fantamilioni' }),
  Object.freeze({ id: 'metricAlerts', label: 'alert' }),
  Object.freeze({ id: 'metricAlertsReason', label: 'motivo-alert' })
]);

function getWindowV529(options = {}) {
  return options.window || (typeof window !== 'undefined' ? window : null);
}

function getDocumentV529(options = {}) {
  return options.document || (typeof document !== 'undefined' ? document : null);
}

function normalizePageV529(value) {
  return String(value || 'dashboard').replace(/^#/, '').trim() || 'dashboard';
}

function normalizeMetricDefinitionsV529(metrics = DEFAULT_PUBLIC_DASHBOARD_METRICS_V529) {
  if (!Array.isArray(metrics)) return Array.from(DEFAULT_PUBLIC_DASHBOARD_METRICS_V529);
  return metrics
    .map((metric) => {
      if (Array.isArray(metric)) return { id: metric[0], label: metric[1] || metric[0] };
      return { id: metric?.id, label: metric?.label || metric?.id };
    })
    .filter((metric) => String(metric.id || '').trim());
}

function getTextV529(node) {
  return String(node?.textContent || '').replace(/\s+/g, ' ').trim();
}

export function buildDashboardMetricSnapshotV529({ document: doc, metrics = DEFAULT_PUBLIC_DASHBOARD_METRICS_V529 } = {}) {
  const targetDoc = getDocumentV529({ document: doc });
  const definitions = normalizeMetricDefinitionsV529(metrics);
  const snapshot = definitions.map((metric) => {
    const node = targetDoc?.getElementById?.(metric.id) || null;
    return Object.freeze({
      id: String(metric.id),
      label: String(metric.label || metric.id),
      exists: Boolean(node),
      value: getTextV529(node)
    });
  });
  return Object.freeze(snapshot);
}

export function syncPublicDashboardMetricsV529(options = {}) {
  const targetDoc = getDocumentV529(options);
  const migration = options.dashboardMigration || options.migrationRuntime || null;
  const metrics = normalizeMetricDefinitionsV529(options.metrics);
  const source = String(options.source || 'extraction-v529');
  const synced = [];
  const missing = [];

  metrics.forEach((metric) => {
    const node = targetDoc?.getElementById?.(metric.id) || null;
    if (!node) {
      missing.push(String(metric.id));
      return;
    }
    if (migration && typeof migration.syncDashboardMetric === 'function') {
      migration.syncDashboardMetric({ id: metric.id, label: metric.label, source });
    } else if (node.dataset) {
      node.dataset.dashboardRendererExtractionV529 = DASHBOARD_RENDERER_EXTRACTION_VERSION_V529;
      node.dataset.dashboardMetricSourceV529 = source;
      node.dataset.dashboardMetricLabelV529 = String(metric.label || metric.id);
    }
    synced.push(String(metric.id));
  });

  const report = Object.freeze({
    version: DASHBOARD_RENDERER_EXTRACTION_VERSION_V529,
    extraction: 'public-dashboard-metric-sync',
    page: normalizePageV529(options.page || options.getCurrentPage?.()),
    seasonId: String(options.seasonId || options.getSeasonId?.() || ''),
    leagueId: String(options.leagueId || options.getLeagueId?.() || ''),
    source,
    metricDefinitions: metrics.length,
    syncedMetrics: synced.length,
    missingMetrics: missing,
    snapshot: buildDashboardMetricSnapshotV529({ document: targetDoc, metrics }),
    replacesLocalRenderers: false,
    fallbackLocalSyncAvailable: true,
    protectsAdminFlows: true,
    protectsPresidentFlows: true,
    firebaseWrites: false,
    emailjsChanged: false,
    sharedAssetsCurrentPreserved: true,
    localFallbacksPreserved: true
  });

  const win = getWindowV529(options);
  if (win) win.FantaEngineDashboardRendererExtractionLastReportV529 = report;
  return report;
}

export function buildDashboardRendererExtractionReportV529(options = {}) {
  const snapshot = buildDashboardMetricSnapshotV529(options);
  return Object.freeze({
    version: DASHBOARD_RENDERER_EXTRACTION_VERSION_V529,
    extraction: 'public-dashboard-metric-sync',
    page: normalizePageV529(options.page || options.getCurrentPage?.()),
    seasonId: String(options.seasonId || options.getSeasonId?.() || ''),
    leagueId: String(options.leagueId || options.getLeagueId?.() || ''),
    metricDefinitions: snapshot.length,
    existingMetrics: snapshot.filter((metric) => metric.exists).length,
    replacesLocalRenderers: false,
    fallbackLocalSyncAvailable: true,
    protectsAdminFlows: true,
    protectsPresidentFlows: true,
    firebaseWrites: false,
    emailjsChanged: false,
    sharedAssetsCurrentPreserved: true,
    localFallbacksPreserved: true
  });
}

export function installDashboardRendererExtractionV529(options = {}) {
  const win = getWindowV529(options);
  const doc = getDocumentV529(options);
  const dashboardMigration = options.dashboardMigration || null;
  const api = Object.freeze({
    version: DASHBOARD_RENDERER_EXTRACTION_VERSION_V529,
    extraction: 'public-dashboard-metric-sync',
    controlledExtraction: true,
    replacesLocalRenderers: false,
    fallbackLocalSyncAvailable: true,
    protectsAdminFlows: true,
    protectsPresidentFlows: true,
    firebaseWrites: false,
    emailjsChanged: false,
    sharedAssetsCurrentPreserved: true,
    localFallbacksPreserved: true,
    defaultMetrics: DEFAULT_PUBLIC_DASHBOARD_METRICS_V529,
    buildSnapshot: (props = {}) => buildDashboardMetricSnapshotV529({ document: doc, ...options, ...props }),
    syncPublicMetrics: (props = {}) => syncPublicDashboardMetricsV529({ document: doc, dashboardMigration, ...options, ...props }),
    buildReport: (props = {}) => buildDashboardRendererExtractionReportV529({ document: doc, ...options, ...props })
  });
  if (win) win.FantaEngineDashboardRendererExtractionRuntimeV529 = api;
  return api;
}

export const FANTA_ENGINE_DASHBOARD_RENDERER_EXTRACTION_V529 = Object.freeze({
  version: DASHBOARD_RENDERER_EXTRACTION_VERSION_V529,
  scope: 'whole-site-dashboard-renderer-extraction',
  extraction: 'public-dashboard-metric-sync',
  controlledExtraction: true,
  replacesLocalRenderers: false,
  fallbackLocalSyncAvailable: true,
  touchesFirebase: false,
  touchesEmailJs: false,
  touchesAdminFlows: false,
  touchesPresidentFlows: false,
  preservesSharedAssetsCurrent: true,
  preservesLocalFallbacks: true
});
