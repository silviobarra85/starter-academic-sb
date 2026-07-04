#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const requiredTargets = ['dashboard', 'listone', 'calciomercato', 'bilanci', 'fantamercato', 'sorteggio'];

function fail(message) {
  console.error(`Audit V533 fallito: ${message}`);
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

function extractValues(source, attr) {
  const values = new Set();
  const rx = new RegExp(`${attr}="([^"]+)"`, 'g');
  let match;
  while ((match = rx.exec(source))) values.add(match[1]);
  return values;
}

function ensureNoStaleCriticalQueries(league, label, source) {
  for (const needle of ['league-config-v443.js?v=512', 'app.js?v=532', 'public-data-autoload-v512.js?v=532', 'quick-navigation-smoke-v532.js?v=532', 'dashboard-section-status-extraction-v533.js?v=532']) {
    if (source.includes(needle)) fail(`${league}: residuo critico ${needle} in ${label}`);
  }
}

const moduleSource = read('static/fanta-engine/js/ui/dashboard-section-status-extraction-v533.js');
for (const needle of [
  'export function createDashboardSectionStatusReportV533',
  'export function installDashboardSectionStatusExtractionV533',
  'public-dashboard-section-status',
  'replacesLocalRenderers: false',
  'mutatesDom: false',
  'mutatesHash: false',
  'callsSetAppPage: false',
  'touchesFirebase: false',
  'touchesEmailJs: false',
  'touchesData: false'
]) {
  if (!moduleSource.includes(needle)) fail(`modulo dashboard section status V533 incompleto: ${needle}`);
}
if (/setAppPageV?\d*\s*\(/.test(moduleSource) || /location\.hash\s*=/.test(moduleSource) || /innerHTML\s*=/.test(moduleSource)) {
  fail('modulo V533 non deve chiamare setAppPage, mutare location.hash o scrivere innerHTML');
}

for (const league of leagues) {
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  const cfgJs = read(`static/${league}/assets/js/core/league-config-v443.js`);
  const staticService = read(`static/${league}/assets/js/data/static-files-service.js`);
  const cfg = readJson(`static/${league}/assets/league-config.json`);
  const pages = extractValues(index, 'data-page');
  const navPages = extractValues(index, 'data-page-link');

  ensureNoStaleCriticalQueries(league, 'index.html', index);
  ensureNoStaleCriticalQueries(league, 'app.js', app);
  ensureNoStaleCriticalQueries(league, 'league-config JS', cfgJs);
  ensureNoStaleCriticalQueries(league, 'static service', staticService);

  if (!index.includes('app.js?v=533')) fail(`${league}: index non carica app.js?v=533`);
  if (!index.includes('public-data-autoload-v512.js?v=533')) fail(`${league}: index non preload public autoload ?v=533`);
  if (!index.includes('quick-navigation-smoke-v532.js?v=533')) fail(`${league}: index non preload quick navigation ?v=533`);
  if (!index.includes('dashboard-section-status-extraction-v533.js?v=533')) fail(`${league}: index non preload dashboard section status V533`);
  if (!index.includes('V533')) fail(`${league}: footer/versione V533 assente`);
  if (!app.includes('installDashboardSectionStatusExtractionV533')) fail(`${league}: app non importa/installa dashboard section status V533`);
  if (!app.includes('FantaEngineDashboardSectionStatusExtractionRuntimeV533')) fail(`${league}: runtime dashboard section status V533 assente`);
  if (!app.includes('FantaEngineQuickNavigationSmokeRuntimeV532')) fail(`${league}: quick navigation V532 non preservato`);
  if (!app.includes('FantaEngineDashboardSummaryExtractionRuntimeV531')) fail(`${league}: summary extraction V531 non preservata`);
  if (!app.includes('FantaEngineDashboardRoleSmokeV530')) fail(`${league}: smoke ruolo V530 non preservato`);
  if (!app.includes('FantaEngineDashboardRendererExtractionRuntimeV529')) fail(`${league}: extraction V529 non preservata`);
  if (String(cfg.currentVersion) !== '533') fail(`${league}: currentVersion JSON non e 533`);
  if (cfg.features?.dashboardSectionStatusExtractionVersion !== 'V533') fail(`${league}: feature dashboardSectionStatusExtraction V533 assente`);
  if (!cfg.dashboardSectionStatusExtractionV533 || cfg.dashboardSectionStatusExtractionV533.replacesLocalRenderers !== false) fail(`${league}: config dashboardSectionStatus V533 non sicura`);
  if (!cfgJs.includes("currentVersion: '533'")) fail(`${league}: league-config JS non pubblica currentVersion 533`);
  if (!cfgJs.includes('dashboardSectionStatusExtractionV533: true')) fail(`${league}: league-config JS non pubblica dashboardSectionStatusExtractionV533`);
  if (!staticService.includes('shared-assets/current')) fail(`${league}: shared-assets/current non preservato`);
  for (const target of requiredTargets) {
    if (!pages.has(target)) fail(`${league}: sezione data-page mancante ${target}`);
    if (!navPages.has(target)) fail(`${league}: nav data-page-link mancante ${target}`);
  }
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

const sharedManifest = read('static/fanta-engine/data/shared-assets/current/manifest-v522.json');
if (!sharedManifest.includes('listoni') || !sharedManifest.includes('calciomercato')) fail('manifest shared-assets/current incompleto');

const roadmap = read('docs/OVERLAY_ROADMAP.md');
if (!roadmap.includes('V533 - Terza micro-estrazione dashboard')) fail('roadmap non aggiornata a V533');
if (!roadmap.includes('Overlay rimanenti consigliati dopo V533: 3')) fail('roadmap non contiene conteggio overlay rimanenti dopo V533');
const doc = read('docs/DASHBOARD_SECTION_STATUS_EXTRACTION_V533.md');
if (!doc.includes('public-dashboard-section-status') || !doc.includes('additive-only')) fail('documentazione V533 incompleta');
const handoff = read('docs/AI_ASSISTANT_HANDOFF_V533.md');
if (!handoff.includes('Overlay rimanenti consigliati: 3')) fail('handoff V533 non contiene conteggio overlay rimanenti');

console.log('Audit V533 superato: terza micro-estrazione dashboard additive-only, runtime whole-site a ?v=533 e docs/handoff aggiornati.');
