#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const VERSION = '554';
const LEAGUES = ['zonaorientale', 'fantapetillomantramanager'];
const DEBUG_MODULES = [
  'dashboard-renderer-extraction-v529',
  'dashboard-summary-extraction-v531',
  'quick-navigation-smoke-v532',
  'dashboard-section-status-extraction-v533'
];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

const errors = [];
function check(condition, message) {
  if (!condition) errors.push(message);
}

for (const league of LEAGUES) {
  const appRel = `static/${league}/assets/app.js`;
  const htmlRel = `static/${league}/index.html`;
  const cfgRel = `static/${league}/assets/league-config.json`;
  check(exists(appRel), `Manca ${appRel}`);
  check(exists(htmlRel), `Manca ${htmlRel}`);
  check(exists(cfgRel), `Manca ${cfgRel}`);
  if (!exists(appRel) || !exists(htmlRel) || !exists(cfgRel)) continue;

  const app = read(appRel);
  const html = read(htmlRel);
  const cfg = JSON.parse(read(cfgRel));

  check(cfg.currentVersion === VERSION, `${cfgRel} non ha currentVersion ${VERSION}`);
  check(html.includes(`assets/app.js?v=${VERSION}`), `${htmlRel} non punta app.js?v=${VERSION}`);
  check(html.includes(`league-config-v443.js?v=${VERSION}`), `${htmlRel} non punta league-config-v443.js?v=${VERSION}`);
  check(html.includes(`V${VERSION}`), `${htmlRel} non mostra V${VERSION}`);
  check(app.includes('FantaEngineProductionDebugLoadingRuntimeV554'), `${appRel} non installa runtime V554`);
  check(app.includes('FANTA_ENGINE_DEBUG_ENABLED_V554'), `${appRel} non definisce flag debug V554`);

  for (const mod of DEBUG_MODULES) {
    check(!app.includes(`from "../../fanta-engine/js/ui/${mod}.js?v=${VERSION}"`), `${appRel} importa staticamente ${mod}`);
    check(app.includes(`import('../../fanta-engine/js/ui/${mod}.js?v=${VERSION}')`), `${appRel} non carica dinamicamente ${mod}`);
    check(!html.includes(`modulepreload" href="../fanta-engine/js/ui/${mod}.js?v=${VERSION}`), `${htmlRel} pre-carica ancora ${mod}`);
  }

  const requiredRuntimeModules = [
    'navigation-active-singleton-v534.js?v=554',
    'navigation-fluidity-v535.js?v=554',
    'navigation-performance-guard-v536.js?v=554',
    'performance-profiler-lazy-render-v552.js?v=554',
    'application-cache-chunked-tables-v553.js?v=554'
  ];
  for (const mod of requiredRuntimeModules) {
    check(app.includes(mod) || html.includes(mod), `${league}: modulo runtime richiesto non trovato: ${mod}`);
  }
}

const docs = [
  'docs/OVERLAY_ROADMAP.md',
  'docs/CENTRALIZATION_STATUS_V521.md',
  'docs/PRODUCTION_DEBUG_LOADING_V554.md',
  'docs/AI_ASSISTANT_HANDOFF_V554.md',
  'docs/AI_ASSISTANT_HANDOFF_CURRENT.md'
];
for (const doc of docs) check(exists(doc), `Documento mancante: ${doc}`);

if (errors.length) {
  console.error('Audit V554 fallito:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Audit V554 superato: moduli diagnostici caricati solo con debug flag, runtime whole-site a ?v=554 e docs/handoff aggiornati.');
