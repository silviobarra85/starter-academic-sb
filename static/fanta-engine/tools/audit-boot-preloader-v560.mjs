#!/usr/bin/env node
// V560 - Audit preloader interactive-ready multi-lega.
// Verifica taratura su readiness reale e rotazione del solo anello, senza layer runtime pesanti.

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
  if (!index.includes('boot-preloader-v560.css?v=560')) errors.push(`${league}: CSS preloader V560 non caricato`);
  if (!index.includes('id="fantaBootPreloader"')) errors.push(`${league}: markup preloader assente`);
  if (!index.includes('boot-preloader-v560.js?v=560')) errors.push(`${league}: JS preloader V560 non caricato`);
  if (!index.includes('?v=560')) errors.push(`${league}: cache-buster V560 assente`);
  if (!index.includes('V560 · Ultimo aggiornamento 28/06/2026')) errors.push(`${league}: footer V560 assente`);
  if (index.includes('boot-preloader-v559.js?v=559') || index.includes('boot-preloader-v559.css?v=559')) errors.push(`${league}: riferimento V559 ancora attivo in index`);
  if (!app.includes('scheduleBootPreloaderReadyV560')) errors.push(`${league}: scheduler ready V560 assente da app.js`);
  if (!app.includes('fanta:app-rendered-v560')) errors.push(`${league}: evento app-rendered V560 assente da app.js`);
  if (app.includes('fanta:app-ready-v559')) errors.push(`${league}: vecchio evento V559 ancora presente in app.js`);
}

const css = read('static/fanta-engine/css/boot-preloader-v560.css');
const js = read('static/fanta-engine/js/ui/boot-preloader-v560.js');
if (!css.includes('@keyframes fantaBootPreloaderSpinV560')) errors.push('CSS: keyframes V560 assenti');
if (!css.includes('.fanta-boot-preloader-spinner::before')) errors.push('CSS: rotazione anello pseudo-elemento assente');
if (/\.fanta-boot-preloader-spinner\s*\{[^}]*animation:/s.test(css)) errors.push('CSS: anima ancora il contenitore spinner, quindi ruoterebbe anche il numero');
if (!css.includes('.fanta-boot-preloader-percent')) errors.push('CSS: percentuale assente');
if (!css.includes('transform: none')) errors.push('CSS: percentuale non bloccata esplicitamente');
if (!css.includes('prefers-reduced-motion')) errors.push('CSS: reduced-motion non gestito');
if (!js.includes("readyEvent: 'fanta:app-rendered-v560'")) errors.push('JS: readyEvent V560 assente');
if (!js.includes('waitsForWindowLoad: true')) errors.push('JS: gate window.load assente');
if (!js.includes('waitsForControls: true')) errors.push('JS: gate controlli assente');
if (!js.includes('waitsForQuietFrame: true')) errors.push('JS: gate quiet frame assente');
if (!js.includes('visualOnly: true')) errors.push('JS: marker visualOnly assente');
if (!js.includes('firebaseChanged: false')) errors.push('JS: marker Firebase invariato assente');
if (!js.includes('emailjsChanged: false')) errors.push('JS: marker EmailJS invariato assente');
if (!js.includes('routerChanged: false')) errors.push('JS: marker router invariato assente');
if (js.includes("window.addEventListener('load', () => {\n    setTarget") || js.includes("complete('Pronto.')") && js.includes('5200')) {
  errors.push('JS: possibile chiusura V559 basata su solo window.load rilevata');
}

const forbiddenRuntime = [
  'navigation-data-refresh-v511.js?v=560',
  'public-data-autoload-v526.js?v=560',
  'dashboard-enforce-v528.js?v=560',
  'eager-data-preload-v555.js?v=560'
];
for (const league of leagues) {
  const app = read(`static/${league}/assets/app.js`);
  for (const token of forbiddenRuntime) {
    if (app.includes(token)) errors.push(`${league}: runtime pesante reintrodotto: ${token}`);
  }
}

const docs = [
  'docs/BOOT_PRELOADER_V560.md',
  'docs/AI_ASSISTANT_HANDOFF_V560.md',
  'docs/AI_ASSISTANT_HANDOFF_CURRENT.md',
  'docs/OVERLAY_ROADMAP.md',
  'docs/zonaorientale/00_STATO_CORRENTE_E_INDICE.md',
  'docs/fantapetillomantramanager/00_STATO_CORRENTE_E_INDICE.md'
];
for (const rel of docs) {
  const content = read(rel);
  if (!content.includes('V560')) errors.push(`${rel}: riferimento V560 assente`);
}

if (errors.length) {
  console.error('Audit V560 fallito:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Audit V560 OK: preloader tarato su interfaccia pronta, percentuale ferma, nessun layer runtime pesante reintrodotto.');
