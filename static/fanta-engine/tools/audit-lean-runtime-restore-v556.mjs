#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LEAGUES = ['zonaorientale', 'fantapetillomantramanager'];
const DISABLED = [
  'navigation-active-singleton-v534.js',
  'navigation-fluidity-v535.js',
  'navigation-performance-guard-v536.js',
  'performance-profiler-lazy-render-v552.js',
  'application-cache-chunked-tables-v553.js',
  'eager-data-preload-v555.js'
];
const REQUIRED = [
  'public-data-autoload-v512.js?v=556',
  'season-data-adapter-v526.js?v=556',
  'season-path-resolver-v537.js?v=556',
  'dashboard-renderer-migration-v527.js?v=556',
  'dashboard-enforce-v528.js?v=556',
  'FantaEngineLeanRuntimeRestoreV556'
];

function read(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) throw new Error(`File mancante: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

const errors = [];
for (const league of LEAGUES) {
  const app = read(`static/${league}/assets/app.js`);
  const html = read(`static/${league}/index.html`);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  if (cfg.currentVersion !== '556') errors.push(`${league}: league-config currentVersion non e' 556`);
  if (!String(html).includes('assets/app.js?v=556')) errors.push(`${league}: index non punta ad app.js?v=556`);
  if (!String(html).includes('league-config-v443.js?v=556')) errors.push(`${league}: index non punta a league-config ?v=556`);
  for (const name of DISABLED) {
    if (app.includes(`import {`) && app.includes(name)) errors.push(`${league}: app importa ancora ${name}`);
    if (html.includes(name)) errors.push(`${league}: index pre-carica ancora ${name}`);
  }
  const forbiddenSymbols = [
    'installNavigationActiveSingletonV534',
    'installNavigationFluidityV535',
    'installNavigationPerformanceGuardV536',
    'installPerformanceProfilerLazyRenderV552',
    'installApplicationCacheChunkedTablesV553',
    'installEagerDataPreloadV555'
  ];
  for (const symbol of forbiddenSymbols) {
    if (app.includes(symbol)) errors.push(`${league}: app contiene ancora ${symbol}`);
  }
  for (const marker of REQUIRED) {
    if (!app.includes(marker) && !html.includes(marker)) errors.push(`${league}: manca marker/runtime richiesto ${marker}`);
  }
}

const sharedListoni = 'static/fanta-engine/data/shared-assets/current/assets/listoni/manifest.json';
const sharedCalcio = 'static/fanta-engine/data/shared-assets/current/assets/calciomercato/links.json';
if (!fs.existsSync(path.join(ROOT, sharedListoni))) errors.push(`Asset centrale mancante: ${sharedListoni}`);
if (!fs.existsSync(path.join(ROOT, sharedCalcio))) errors.push(`Asset centrale mancante: ${sharedCalcio}`);

if (errors.length) {
  console.error('Audit V556 fallito:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Audit V556 superato: runtime lean ripristinato, layer sperimentali disattivati, asset centrali preservati e whole-site a ?v=556.');
