#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const requiredTargets = ['dashboard', 'listone', 'calciomercato'];

function fail(message) {
  console.error(`Audit V532 fallito: ${message}`);
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

function extractDataPages(html) {
  const pages = new Set();
  const rx = /data-page="([^"]+)"/g;
  let match;
  while ((match = rx.exec(html))) pages.add(match[1]);
  return pages;
}

function extractNavPages(html) {
  const pages = new Set();
  const rx = /data-page-link="([^"]+)"/g;
  let match;
  while ((match = rx.exec(html))) pages.add(match[1]);
  return pages;
}

function ensureNoStaleCriticalQueries(league, label, source) {
  for (const needle of ['league-config-v443.js?v=512', 'app.js?v=531', 'public-data-autoload-v512.js?v=531', 'quick-navigation-smoke-v532.js?v=531']) {
    if (source.includes(needle)) fail(`${league}: residuo critico ${needle} in ${label}`);
  }
}

const moduleSource = read('static/fanta-engine/js/ui/quick-navigation-smoke-v532.js');
for (const needle of [
  'export function createQuickNavigationSmokeReportV532',
  'export function installQuickNavigationSmokeV532',
  'replacesNavigation: false',
  'mutatesHash: false',
  'callsSetAppPage: false',
  'touchesFirebase: false',
  'touchesEmailJs: false',
  'touchesData: false'
]) {
  if (!moduleSource.includes(needle)) fail(`modulo quick navigation V532 incompleto: ${needle}`);
}
if (/setAppPageV\d*\s*\(/.test(moduleSource) || /location\.hash\s*=/.test(moduleSource)) {
  fail('modulo V532 non deve chiamare setAppPage ne mutare location.hash');
}

for (const league of leagues) {
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  const cfgJs = read(`static/${league}/assets/js/core/league-config-v443.js`);
  const staticService = read(`static/${league}/assets/js/data/static-files-service.js`);
  const cfg = readJson(`static/${league}/assets/league-config.json`);
  const pages = extractDataPages(index);
  const navPages = extractNavPages(index);

  ensureNoStaleCriticalQueries(league, 'index.html', index);
  ensureNoStaleCriticalQueries(league, 'app.js', app);
  ensureNoStaleCriticalQueries(league, 'league-config JS', cfgJs);
  ensureNoStaleCriticalQueries(league, 'static service', staticService);

  if (!index.includes('app.js?v=532')) fail(`${league}: index non carica app.js?v=532`);
  if (!index.includes('public-data-autoload-v512.js?v=532')) fail(`${league}: index non preload public autoload ?v=532`);
  if (!index.includes('quick-navigation-smoke-v532.js?v=532')) fail(`${league}: index non preload quick navigation V532`);
  if (!index.includes('V532')) fail(`${league}: footer/versione V532 assente`);
  if (!app.includes('installQuickNavigationSmokeV532')) fail(`${league}: app non importa/installa quick navigation V532`);
  if (!app.includes('FantaEngineQuickNavigationSmokeRuntimeV532')) fail(`${league}: runtime quick navigation V532 assente`);
  if (!app.includes('FantaEngineDashboardSummaryExtractionRuntimeV531')) fail(`${league}: summary extraction V531 non preservata`);
  if (!app.includes('FantaEngineDashboardRoleSmokeV530')) fail(`${league}: smoke ruolo V530 non preservato`);
  if (!app.includes('FantaEngineDashboardRendererExtractionRuntimeV529')) fail(`${league}: extraction V529 non preservata`);
  if (String(cfg.currentVersion) !== '532') fail(`${league}: currentVersion JSON non e 532`);
  if (cfg.features?.quickNavigationSmokeVersion !== 'V532') fail(`${league}: feature quickNavigationSmoke V532 assente`);
  if (!cfg.quickNavigationSmokeV532 || cfg.quickNavigationSmokeV532.replacesNavigation !== false) fail(`${league}: config quickNavigation V532 non sicura`);
  if (!cfgJs.includes("currentVersion: '532'")) fail(`${league}: league-config JS non pubblica currentVersion 532`);
  if (!cfgJs.includes('quickNavigationSmokeV532: true')) fail(`${league}: league-config JS non pubblica quickNavigationSmokeV532`);
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
if (!roadmap.includes('V532 - Smoke interazioni rapide Dashboard/Listone/Calciomercato')) fail('roadmap non aggiornata a V532');
if (!roadmap.includes('Overlay rimanenti consigliati dopo V532: 4')) fail('roadmap non contiene conteggio overlay rimanenti');
const doc = read('docs/QUICK_NAVIGATION_SMOKE_V532.md');
if (!doc.includes('Dashboard/Listone/Calciomercato') || !doc.includes('additive-only')) fail('documentazione V532 incompleta');
const handoff = read('docs/AI_ASSISTANT_HANDOFF_V532.md');
if (!handoff.includes('Overlay rimanenti consigliati: 4')) fail('handoff V532 non contiene conteggio overlay rimanenti');

console.log('Audit V532 superato: smoke interazioni rapide Dashboard/Listone/Calciomercato, runtime whole-site a ?v=532 e docs/handoff aggiornati.');
