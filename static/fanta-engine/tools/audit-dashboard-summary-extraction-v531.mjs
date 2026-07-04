#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];

function fail(message) {
  console.error(`Audit V531 fallito: ${message}`);
  process.exit(1);
}

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) fail(`file mancante ${rel}`);
  return fs.readFileSync(full, 'utf8');
}

function readJson(rel) {
  try { return JSON.parse(read(rel)); }
  catch (error) { fail(`JSON non valido ${rel}: ${error.message}`); }
}

function ensureNoStaleQuery(league, label, source) {
  const stale = ['?v=512', '?v=523', '?v=524', '?v=525', '?v=526', '?v=527', '?v=528', '?v=529', '?v=530'];
  for (const needle of stale) {
    if (source.includes(needle)) fail(`${league}: residuo ${needle} in ${label}`);
  }
}

const moduleSource = read('static/fanta-engine/js/ui/dashboard-summary-extraction-v531.js');
for (const needle of [
  'export function createDashboardPublicSummaryV531',
  'export function installDashboardSummaryExtractionV531',
  'replacesLocalRenderers: false',
  'touchesFirebase: false',
  'touchesEmailJs: false',
  'touchesData: false'
]) {
  if (!moduleSource.includes(needle)) fail(`modulo V531 incompleto: ${needle}`);
}

for (const league of leagues) {
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  const cfgJs = read(`static/${league}/assets/js/core/league-config-v443.js`);
  const staticService = read(`static/${league}/assets/js/data/static-files-service.js`);
  const cfg = readJson(`static/${league}/assets/league-config.json`);

  ensureNoStaleQuery(league, 'index.html', index);
  ensureNoStaleQuery(league, 'app.js', app);
  ensureNoStaleQuery(league, 'league-config JS', cfgJs);
  ensureNoStaleQuery(league, 'static service', staticService);

  if (!index.includes('app.js?v=531')) fail(`${league}: index non carica app.js?v=531`);
  if (!index.includes('dashboard-summary-extraction-v531.js?v=531')) fail(`${league}: modulepreload summary extraction V531 assente`);
  if (!app.includes('installDashboardSummaryExtractionV531')) fail(`${league}: app non importa/installa summary extraction V531`);
  if (!app.includes('FantaEngineDashboardSummaryExtractionRuntimeV531')) fail(`${league}: runtime summary extraction V531 assente in app`);
  if (!app.includes('FantaEngineDashboardRendererExtractionRuntimeV529')) fail(`${league}: extraction V529 non preservata`);
  if (!app.includes('FantaEngineDashboardEnforceRuntimeV528')) fail(`${league}: enforce V528 non preservato`);
  if (!app.includes('FantaEngineDashboardRoleSmokeV530')) fail(`${league}: smoke V530 non preservato`);
  if (!cfgJs.includes("currentVersion: '531'")) fail(`${league}: league-config JS non pubblica currentVersion 531`);
  if (!cfgJs.includes('dashboardSummaryExtractionV531: true')) fail(`${league}: flag dashboardSummaryExtractionV531 assente`);
  if (String(cfg.currentVersion) !== '531') fail(`${league}: currentVersion JSON non e 531`);
  if (cfg.features?.dashboardSummaryExtractionVersion !== 'V531') fail(`${league}: feature dashboardSummaryExtraction V531 assente`);
  if (!cfg.dashboardSummaryExtractionV531 || cfg.dashboardSummaryExtractionV531.replacesLocalRenderers !== false) fail(`${league}: config summary extraction V531 non sicura`);
  if (!staticService.includes('shared-assets/current')) fail(`${league}: shared-assets/current non preservato`);
  for (const id of ['metricClubs', 'metricTotalFm', 'metricAlerts', 'metricAlertsReason']) {
    if (!index.includes(`id="${id}"`)) fail(`${league}: metrica dashboard mancante ${id}`);
  }
  for (const id of ['adminPanel', 'loginDialog', 'loginForm']) {
    if (!index.includes(`id="${id}"`)) fail(`${league}: flusso Admin non preservato ${id}`);
  }
  for (const needle of ['renderPresidentDashboardV369', 'renderPresidentDashboardMetricV369', 'president-dashboard-rosters-v212.js']) {
    if (!app.includes(needle)) fail(`${league}: flusso Presidente non preservato: ${needle}`);
  }
}

const roadmap = read('docs/OVERLAY_ROADMAP.md');
if (!roadmap.includes('V531 - Seconda micro-estrazione dashboard')) fail('roadmap non aggiornata a V531');
const doc = read('docs/DASHBOARD_SUMMARY_EXTRACTION_V531.md');
if (!doc.includes('additive-only') || !doc.includes('fallback')) fail('documentazione V531 incompleta');

console.log('Audit V531 superato: seconda micro-estrazione dashboard additive-only, renderer locali preservati e runtime a ?v=531.');
