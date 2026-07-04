#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const requiredFiles = [
  'static/fanta-engine/js/ui/dashboard-renderer-migration-v527.js',
  'docs/DASHBOARD_RENDERER_BRIDGE_V527.md',
  'docs/AI_ASSISTANT_HANDOFF_V527.md'
];

function fail(message) {
  console.error(`Audit V527 fallito: ${message}`);
  process.exit(1);
}

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) fail(`file mancante ${rel}`);
  return fs.readFileSync(full, 'utf8');
}

for (const rel of requiredFiles) read(rel);

const bridge = read('static/fanta-engine/js/ui/dashboard-renderer-migration-v527.js');
[
  'installDashboardRendererMigrationV527',
  'decorateDashboardRootV527',
  'syncDashboardMetricValueV527',
  'replacesLocalRenderers: false',
  'firebaseWrites: false',
  'emailjsChanged: false'
].forEach((needle) => {
  if (!bridge.includes(needle)) fail(`bridge V527 non contiene ${needle}`);
});

for (const league of leagues) {
  const app = read(`static/${league}/assets/app.js`);
  const index = read(`static/${league}/index.html`);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  const cfgJs = read(`static/${league}/assets/js/core/league-config-v443.js`);
  if (!app.includes('dashboard-renderer-migration-v527.js?v=527')) fail(`${league}: app non importa il bridge V527`);
  if (!app.includes('applyDashboardRendererMigrationV527')) fail(`${league}: wrapper post-render V527 assente`);
  if (!app.includes('replacesLocalRenderers: false')) fail(`${league}: guardrail renderer locali assente`);
  if (!index.includes('dashboard-renderer-migration-v527.js?v=527')) fail(`${league}: modulepreload V527 assente`);
  if (!index.includes('app.js?v=527')) fail(`${league}: app.js non e a ?v=527`);
  if (!index.includes('V527')) fail(`${league}: footer/versione V527 assente`);
  if (String(cfg.currentVersion) !== '527') fail(`${league}: currentVersion non e 527`);
  if (cfg.features?.dashboardRendererPostRenderBridgeVersion !== 'V527') fail(`${league}: feature bridge V527 assente`);
  if (!cfg.dashboardRendererMigrationV527 || cfg.dashboardRendererMigrationV527.replacesLocalRenderers !== false) fail(`${league}: config dashboardRendererMigrationV527 non sicura`);
  if (!cfgJs.includes('dashboardRendererMigrationV527: true')) fail(`${league}: league-config runtime non pubblica V527`);
  if (app.includes('league-config-v443.js?v=526') || index.includes('assets/app.js?v=526')) fail(`${league}: residui cache-buster V526 negli entrypoint`);
}

const roadmap = read('docs/OVERLAY_ROADMAP.md');
if (!roadmap.includes('V527 - Dashboard renderer bridge')) fail('roadmap non aggiornata a V527');
console.log('Audit V527 superato: bridge renderer dashboard whole-site, renderer locali preservati e runtime a ?v=527.');
