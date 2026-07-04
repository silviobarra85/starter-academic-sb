#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const requiredFiles = [
  'static/fanta-engine/js/ui/dashboard-renderer-extraction-v529.js',
  'docs/DASHBOARD_RENDERER_EXTRACTION_V529.md',
  'docs/AI_ASSISTANT_HANDOFF_V529.md'
];

function fail(message) {
  console.error(`Audit V529 fallito: ${message}`);
  process.exit(1);
}

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) fail(`file mancante ${rel}`);
  return fs.readFileSync(full, 'utf8');
}

for (const rel of requiredFiles) read(rel);

const extraction = read('static/fanta-engine/js/ui/dashboard-renderer-extraction-v529.js');
[
  'installDashboardRendererExtractionV529',
  'syncPublicDashboardMetricsV529',
  'buildDashboardMetricSnapshotV529',
  'metricClubs',
  'metricTotalFm',
  'metricAlerts',
  'metricAlertsReason',
  'replacesLocalRenderers: false',
  'fallbackLocalSyncAvailable: true',
  'firebaseWrites: false',
  'emailjsChanged: false'
].forEach((needle) => {
  if (!extraction.includes(needle)) fail(`modulo extraction V529 non contiene ${needle}`);
});

for (const league of leagues) {
  const app = read(`static/${league}/assets/app.js`);
  const index = read(`static/${league}/index.html`);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  const cfgJs = read(`static/${league}/assets/js/core/league-config-v443.js`);
  if (!app.includes('dashboard-renderer-extraction-v529.js?v=529')) fail(`${league}: app non importa extraction V529`);
  if (!app.includes('FantaEngineDashboardRendererExtractionRuntimeV529')) fail(`${league}: runtime extraction V529 non installato`);
  if (!app.includes('extractionRuntime.syncPublicMetrics')) fail(`${league}: V527 metric sync non passa da extraction V529`);
  if (!app.includes('fallbackLocalSyncAvailable: true')) fail(`${league}: fallback locale V529 non documentato nel runtime`);
  if (!index.includes('dashboard-renderer-extraction-v529.js?v=529')) fail(`${league}: preload extraction V529 assente`);
  if (!index.includes('app.js?v=529')) fail(`${league}: app.js non e a ?v=529`);
  if (!index.includes('V529')) fail(`${league}: footer/versione V529 assente`);
  if (String(cfg.currentVersion) !== '529') fail(`${league}: currentVersion non e 529`);
  if (cfg.features?.dashboardRendererExtractionVersion !== 'V529') fail(`${league}: feature dashboardRendererExtraction V529 assente`);
  if (!cfg.dashboardRendererExtractionV529 || cfg.dashboardRendererExtractionV529.replacesLocalRenderers !== false) fail(`${league}: config dashboardRendererExtractionV529 non sicura`);
  if (!cfgJs.includes('dashboardRendererExtractionV529: true')) fail(`${league}: league-config runtime non pubblica V529`);
  const staleQueries = ['assets/app.js?v=528', 'league-config-v443.js?v=528', 'public-data-autoload-v512.js?v=528', 'dashboard-enforce-v528.js?v=528'];
  for (const stale of staleQueries) {
    if (index.includes(stale) || app.includes(stale)) fail(`${league}: residuo cache-buster ${stale}`);
  }
}

const roadmap = read('docs/OVERLAY_ROADMAP.md');
if (!roadmap.includes('V529 - Dashboard renderer extraction controllata')) fail('roadmap non aggiornata a V529');
console.log('Audit V529 superato: dashboard renderer extraction controllata, fallback locale preservato e runtime a ?v=529.');
