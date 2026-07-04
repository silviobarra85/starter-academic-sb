#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const requiredFiles = [
  'static/fanta-engine/js/ui/dashboard-enforce-v528.js',
  'docs/DASHBOARD_ENFORCE_V528.md',
  'docs/AI_ASSISTANT_HANDOFF_V528.md'
];

function fail(message) {
  console.error(`Audit V528 fallito: ${message}`);
  process.exit(1);
}

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) fail(`file mancante ${rel}`);
  return fs.readFileSync(full, 'utf8');
}

for (const rel of requiredFiles) read(rel);

const enforce = read('static/fanta-engine/js/ui/dashboard-enforce-v528.js');
[
  'installDashboardEnforceV528',
  'enforceDashboardGuardsV528',
  'findProtectedRoleRootsV528',
  'replacesLocalRenderers: false',
  'protectsAdminFlows: true',
  'protectsPresidentFlows: true',
  'firebaseWrites: false',
  'emailjsChanged: false'
].forEach((needle) => {
  if (!enforce.includes(needle)) fail(`modulo enforce V528 non contiene ${needle}`);
});

for (const league of leagues) {
  const app = read(`static/${league}/assets/app.js`);
  const index = read(`static/${league}/index.html`);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  const cfgJs = read(`static/${league}/assets/js/core/league-config-v443.js`);
  if (!app.includes('dashboard-enforce-v528.js?v=528')) fail(`${league}: app non importa dashboard enforce V528`);
  if (!app.includes('applyDashboardEnforceV528')) fail(`${league}: wrapper enforce V528 assente`);
  if (!app.includes('FantaEngineDashboardEnforceRuntimeV528')) fail(`${league}: runtime enforce V528 non installato`);
  if (!app.includes('replacesLocalRenderers: false')) fail(`${league}: guardrail renderer locali assente`);
  if (!index.includes('dashboard-enforce-v528.js?v=528')) fail(`${league}: preload enforce V528 assente`);
  if (!index.includes('app.js?v=528')) fail(`${league}: app.js non e a ?v=528`);
  if (!index.includes('V528')) fail(`${league}: footer/versione V528 assente`);
  if (String(cfg.currentVersion) !== '528') fail(`${league}: currentVersion non e 528`);
  if (cfg.features?.dashboardEnforceVersion !== 'V528') fail(`${league}: feature dashboardEnforce V528 assente`);
  if (!cfg.dashboardEnforceV528 || cfg.dashboardEnforceV528.replacesLocalRenderers !== false) fail(`${league}: config dashboardEnforceV528 non sicura`);
  if (!cfgJs.includes('dashboardEnforceV528: true')) fail(`${league}: league-config runtime non pubblica V528`);
  const staleQueries = ['assets/app.js?v=527', 'league-config-v443.js?v=527', 'public-data-autoload-v512.js?v=527', 'dashboard-renderer-migration-v527.js?v=527'];
  for (const stale of staleQueries) {
    if (index.includes(stale) || app.includes(stale)) fail(`${league}: residuo cache-buster ${stale}`);
  }
}

const roadmap = read('docs/OVERLAY_ROADMAP.md');
if (!roadmap.includes('V528 - Dashboard enforce guard')) fail('roadmap non aggiornata a V528');
console.log('Audit V528 superato: dashboard enforce whole-site attivo, renderer locali preservati e runtime a ?v=528.');
