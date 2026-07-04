#!/usr/bin/env node
// V559 - Audit preloader bootstrap multi-lega.
// Verifica presenza overlay su entrambe le leghe e assenza di layer runtime pesanti reintrodotti.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const errors = [];

function read(rel) {
  const abs = join(root, rel);
  if (!existsSync(abs)) {
    errors.push(`File mancante: ${rel}`);
    return '';
  }
  return readFileSync(abs, 'utf8');
}

for (const league of leagues) {
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  if (!index.includes('boot-preloader-v559.css?v=559')) errors.push(`${league}: CSS preloader non caricato`);
  if (!index.includes('id="fantaBootPreloader"')) errors.push(`${league}: markup preloader assente`);
  if (!index.includes('boot-preloader-v559.js?v=559')) errors.push(`${league}: JS preloader non caricato`);
  if (!index.includes('?v=559')) errors.push(`${league}: cache-buster V559 assente`);
  if (!index.includes('V559 · Ultimo aggiornamento 28/06/2026')) errors.push(`${league}: footer V559 assente`);
  if (!app.includes('fanta:app-ready-v559')) errors.push(`${league}: segnale ready V559 assente da app.js`);
}

const css = read('static/fanta-engine/css/boot-preloader-v559.css');
const js = read('static/fanta-engine/js/ui/boot-preloader-v559.js');
if (!css.includes('.fanta-boot-preloader-spinner')) errors.push('CSS: spinner assente');
if (!css.includes('prefers-reduced-motion')) errors.push('CSS: reduced-motion non gestito');
if (!js.includes('visualOnly: true')) errors.push('JS: marker visualOnly assente');
if (!js.includes('firebaseChanged: false')) errors.push('JS: marker Firebase invariato assente');
if (!js.includes('routerChanged: false')) errors.push('JS: marker router invariato assente');

const zoApp = read('static/zonaorientale/assets/app.js');
const forbiddenRuntime = [
  'navigation-data-refresh-v511.js?v=559',
  'public-data-autoload-v526.js?v=559',
  'dashboard-enforce-v528.js?v=559',
  'eager-data-preload-v555.js?v=559'
];
for (const token of forbiddenRuntime) {
  if (zoApp.includes(token)) errors.push(`Runtime pesante reintrodotto: ${token}`);
}

if (errors.length) {
  console.error('Audit V559 fallito:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Audit V559 OK: preloader bootstrap installato su entrambe le leghe, senza reintrodurre layer pesanti.');
