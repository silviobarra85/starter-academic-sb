#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const errors = [];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

if (!exists('static/fanta-engine/js/ui/eager-data-preload-v555.js')) {
  errors.push('Modulo eager-data-preload-v555.js mancante.');
} else {
  const mod = read('static/fanta-engine/js/ui/eager-data-preload-v555.js');
  for (const token of [
    'installEagerDataPreloadV555',
    'after-first-paint-background-prefetch',
    'doesNotBlockInitialPaint: true',
    'firebaseWrites: false',
    'emailjsChanged: false'
  ]) {
    if (!mod.includes(token)) errors.push(`Modulo V555 senza token richiesto: ${token}`);
  }
}

for (const league of leagues) {
  const appRel = `static/${league}/assets/app.js`;
  const htmlRel = `static/${league}/index.html`;
  const cfgRel = `static/${league}/assets/league-config.json`;
  const lcRel = `static/${league}/assets/js/core/league-config-v443.js`;
  const app = read(appRel);
  const html = read(htmlRel);
  const cfg = JSON.parse(read(cfgRel));
  const lc = read(lcRel);

  if (!app.includes('installEagerDataPreloadV555')) errors.push(`${appRel}: import/install V555 mancante.`);
  if (!app.includes('FantaEngineEagerDataPreloadRuntimeV555')) errors.push(`${appRel}: runtime V555 mancante.`);
  if (!app.includes('assets/snapshots/seasons/manifest.json')) errors.push(`${appRel}: seed snapshots mancante.`);
  if (!app.includes('assets/rose/manifest.json')) errors.push(`${appRel}: seed rose mancante.`);
  if (!app.includes('assets/competitions/manifest.json')) errors.push(`${appRel}: seed competizioni mancante.`);
  if (!app.includes('shared-assets/current/assets/listoni/manifest.json')) errors.push(`${appRel}: seed listoni condivisi mancante.`);
  if (!app.includes('shared-assets/current/assets/calciomercato/archive/manifest.json')) errors.push(`${appRel}: seed calciomercato archivio mancante.`);
  if (app.includes('?v=554')) errors.push(`${appRel}: residuo ?v=554.`);

  if (!html.includes('eager-data-preload-v555.js?v=555')) errors.push(`${htmlRel}: modulepreload V555 mancante.`);
  if (!html.includes('assets/app.js?v=555')) errors.push(`${htmlRel}: app non allineata a v=555.`);
  if (!html.includes('· V555 ·')) errors.push(`${htmlRel}: footer non allineato a V555.`);
  if (html.includes('?v=554')) errors.push(`${htmlRel}: residuo ?v=554.`);

  if (String(cfg.currentVersion) !== '555') errors.push(`${cfgRel}: currentVersion non e' 555.`);
  if (cfg.features?.eagerDataPreloadV555 !== true) errors.push(`${cfgRel}: flag eagerDataPreloadV555 mancante.`);
  if (!lc.includes("currentVersion: '555'")) errors.push(`${lcRel}: fallback currentVersion non e' 555.`);
}

for (const rel of [
  'docs/OVERLAY_ROADMAP.md',
  'docs/CENTRALIZATION_STATUS_V521.md',
  'docs/PERFORMANCE_EAGER_PRELOAD_V555.md',
  'docs/AI_ASSISTANT_HANDOFF_V555.md',
  'docs/AI_ASSISTANT_HANDOFF_CURRENT.md'
]) {
  if (!exists(rel)) errors.push(`Documento mancante: ${rel}`);
}

if (errors.length) {
  console.error('Audit V555 fallito:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Audit V555 superato: eager data preload carica in background i JSON statici principali dopo il primo paint, runtime whole-site a ?v=555 e docs/handoff aggiornati.');
