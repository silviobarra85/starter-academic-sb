#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const REQUIRED_PAGES = ['dashboard', 'admin', 'listone', 'calciomercato'];
const REQUIRED_NAV = ['dashboard', 'listone', 'calciomercato'];
const REQUIRED_DASHBOARD_IDS = ['dashboardStandings', 'dashboardCalendar', 'metricClubs', 'metricTotalFm', 'metricAlerts'];
const REQUIRED_ADMIN_IDS = ['adminPanel', 'adminTitle', 'loginDialog', 'loginForm'];
const REQUIRED_PRESIDENT_APP_NEEDLES = [
  'renderPresidentDashboardV369',
  'renderPresidentDashboardMetricV369',
  'getApprovedTeamUser',
  'president-dashboard-rosters-v212.js'
];

function fail(message) {
  console.error(`Smoke V530 fallito: ${message}`);
  process.exit(1);
}

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) fail(`file mancante ${rel}`);
  return fs.readFileSync(full, 'utf8');
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

function ensureNoStaleVersions(league, files) {
  const stale = ['?v=512', '?v=523', '?v=524', '?v=525', '?v=526', '?v=527', '?v=528', '?v=529'];
  for (const [label, source] of Object.entries(files)) {
    for (const needle of stale) {
      if (source.includes(needle)) fail(`${league}: residuo ${needle} in ${label}`);
    }
  }
}

for (const league of leagues) {
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  const cfgJs = read(`static/${league}/assets/js/core/league-config-v443.js`);
  const staticService = read(`static/${league}/assets/js/data/static-files-service.js`);

  ensureNoStaleVersions(league, { index, app, cfgJs, staticService });

  if (!index.includes('app.js?v=530')) fail(`${league}: index non carica app.js?v=530`);
  if (!index.includes('public-data-autoload-v512.js?v=530')) fail(`${league}: index non preload public autoload ?v=530`);
  if (!index.includes('dashboard-renderer-extraction-v529.js?v=530')) fail(`${league}: index non preload extraction V529 con cache V530`);
  if (!index.includes('V530')) fail(`${league}: footer/versione V530 assente`);
  if (String(cfg.currentVersion) !== '530') fail(`${league}: currentVersion non e 530`);
  if (cfg.features?.dashboardRoleSmokeVersion !== 'V530') fail(`${league}: feature dashboardRoleSmoke V530 assente`);
  if (!cfg.dashboardRoleSmokeV530 || cfg.dashboardRoleSmokeV530.replacesLocalRenderers !== false) fail(`${league}: config smoke V530 non sicura`);
  if (!cfgJs.includes("currentVersion: '530'")) fail(`${league}: league-config JS non pubblica currentVersion 530`);
  if (!cfgJs.includes('dashboardRoleSmokeV530: true')) fail(`${league}: league-config JS non pubblica dashboardRoleSmokeV530`);

  const pages = extractDataPages(index);
  const navPages = extractNavPages(index);
  for (const page of REQUIRED_PAGES) {
    if (!pages.has(page)) fail(`${league}: sezione data-page mancante ${page}`);
  }
  for (const page of REQUIRED_NAV) {
    if (!navPages.has(page)) fail(`${league}: nav data-page-link mancante ${page}`);
  }
  if (!index.includes('data-page-link="admin"')) fail(`${league}: link Admin non presente`);
  for (const id of REQUIRED_DASHBOARD_IDS) {
    if (!index.includes(`id="${id}"`)) fail(`${league}: elemento dashboard mancante ${id}`);
  }
  for (const id of REQUIRED_ADMIN_IDS) {
    if (!index.includes(`id="${id}"`)) fail(`${league}: elemento admin mancante ${id}`);
  }
  for (const needle of REQUIRED_PRESIDENT_APP_NEEDLES) {
    if (!app.includes(needle)) fail(`${league}: flusso Presidente non contiene ${needle}`);
  }
  if (!app.includes('FantaEngineDashboardRoleSmokeV530')) fail(`${league}: marker runtime smoke V530 assente in app`);
  if (!app.includes('FantaEngineDashboardRendererExtractionRuntimeV529')) fail(`${league}: extraction V529 non preservata`);
  if (!app.includes('FantaEngineDashboardEnforceRuntimeV528')) fail(`${league}: enforce V528 non preservato`);
  if (!staticService.includes('shared-assets/current')) fail(`${league}: static service non usa shared-assets/current`);
}

const sharedManifest = read('static/fanta-engine/data/shared-assets/current/manifest-v522.json');
if (!sharedManifest.includes('listoni') || !sharedManifest.includes('calciomercato')) fail('manifest shared-assets/current incompleto');

const roadmap = read('docs/OVERLAY_ROADMAP.md');
if (!roadmap.includes('V530 - Dashboard/Admin/Presidente smoke baseline')) fail('roadmap non aggiornata a V530');

console.log('Smoke V530 superato: Dashboard/Admin/Presidente preservati, runtime whole-site a ?v=530 e asset comuni invariati.');
