#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const siteRoot = path.resolve(path.dirname(__filename), '..');
let ok = 0;
let total = 0;

function read(rel) {
  return fs.readFileSync(path.join(siteRoot, rel), 'utf8');
}
function check(label, condition) {
  total += 1;
  if (!condition) {
    console.error(`x ${label}`);
    return;
  }
  ok += 1;
}

const index = read('index.html');
const app = read('assets/app.js');
const sectionJs = read('assets/js/sections/bilanci-snapshot-section-v435.js');
const sectionCss = read('assets/css/refactor/bilanci-snapshot-v435.css');
const checkScript = read('tools/check-zonaorientale.sh');

check('runtime deploy almeno V438 in app.js', /DEPLOY_EXPECTED_VERSION_V181\s*=\s*"(438|439)"/.test(app));
check('footer e cache-buster almeno V438 in index', (/\?v=(438|439)/.test(index) && (index.includes('V438 fix mobile bilanci') || index.includes('V439 menu Altro pagine standalone'))));
check('marker runtime V438 presente', app.includes('ZonaOrientaleBilanciMobileFixV438'));
check('sezione Bilanci non mostra fonte tecnica nel pannello', !index.includes('La tabella viene calcolata da') && !sectionJs.includes('<span>Fonte</span>') && !sectionJs.includes('bilanci-source-note-v435'));
check('controlli Bilanci sono strutturalmente sotto il titolo', /bilanci-header-title-v437[^"]*bilanci-header-title-v438[\s\S]*<h2>Bilancio stagione<\/h2>[\s\S]*bilanci-controls-under-title-v438/.test(index));
check('CSS V438 forza layout controlli sotto titolo su mobile', sectionCss.includes('V438 - Bilanci: fix mobile effettivi') && sectionCss.includes('.bilanci-controls-under-title-v438') && sectionCss.includes('@media (max-width: 920px)'));
check('CSS V438 rinforza sticky della colonna Voce', sectionCss.includes('border-collapse: separate') && sectionCss.includes('position: -webkit-sticky') && sectionCss.includes('left: 0 !important') && sectionCss.includes('th.bilanci-row-label-v435'));
check('card dettagli mese partono chiuse', sectionJs.includes('<details class="bilanci-month-card-v435">') && !sectionJs.includes('index === 0 ?'));
check('Bilanci resta senza dataset assets/bilanci', sectionJs.includes('assets/snapshots/seasons/manifest.json') && !sectionJs.includes('assets/bilanci'));
check('check principale integra audit V438', checkScript.includes('audit-bilanci-mobile-v438.mjs'));

if (ok !== total) {
  console.error(`Audit bilanci mobile V438 completato: ${ok}/${total} controlli superati.`);
  process.exit(1);
}
console.log('Audit bilanci mobile V438 superato.');
