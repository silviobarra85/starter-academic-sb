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
function exists(rel) {
  return fs.existsSync(path.join(siteRoot, rel));
}
function check(label, condition) {
  total += 1;
  if (!condition) {
    console.error(`x ${label}`);
    return;
  }
  ok += 1;
}
function json(rel) {
  return JSON.parse(read(rel));
}

const index = read('index.html');
const app = read('assets/app.js');
const registry = read('assets/js/core/section-registry-v405.js');
const sectionJs = read('assets/js/sections/bilanci-snapshot-section-v435.js');
const sectionCss = read('assets/css/refactor/bilanci-snapshot-v435.css');
const checkScript = read('tools/check-zonaorientale.sh');
const manifest = json('assets/snapshots/seasons/manifest.json');
const currentSeason = json('assets/snapshots/seasons/2025-2026.json');

check('runtime deploy almeno V435 in app.js', /DEPLOY_EXPECTED_VERSION_V181\s*=\s*"(435|436|437|438|439|440|441|442|443|444|445|446|447|448|449|450|451|452)"/.test(app));
check('marker runtime bilanci V435 presente', app.includes('ZonaOrientaleBilanciSnapshotRuntimeV435'));
check('index contiene sezione bilanci', index.includes('data-page="bilanci"') && index.includes('bilanciSeasonSelectV435'));
check('nav desktop contiene Bilanci', index.includes('href="#bilanci" class="nav-link"'));
check('menu mobile contiene Bilanci', index.includes('data-page-link="bilanci"') && index.includes('Bilanci squadre'));
check('CSS bilanci collegato', /assets\/css\/refactor\/bilanci-snapshot-v435\.css\?v=(435|436|437|438|439|440|441|442|443|444|445|446|447|448|449|450|451|452)/.test(index));
check('JS bilanci collegato', /assets\/js\/sections\/bilanci-snapshot-section-v435\.js\?v=(435|436|437|438|439|440|441|442|443|444|445|446|447|448|449|450|451|452)/.test(index));
check('section registry conosce bilanci', registry.includes('bilanci: Object.freeze') && registry.includes('Bilanci squadre'));
check('JS legge snapshot stagioni', sectionJs.includes('assets/snapshots/seasons/manifest.json') && sectionJs.includes('fmMovements'));
check('JS non legge dataset assets/bilanci', !sectionJs.includes('assets/bilanci'));
check('cartella assets/bilanci non creata', !exists('assets/bilanci'));
check('CSS mobile/sticky presente', sectionCss.includes('position: sticky') && sectionCss.includes('@media'));
check('manifest snapshot stagioni disponibile', Array.isArray(manifest.snapshots) && manifest.snapshots.length >= 1);
check('stagione 2025-2026 contiene movimenti FM', Array.isArray(currentSeason.fmMovements) && currentSeason.fmMovements.length > 0);
check('check principale integra audit V435', checkScript.includes('audit-bilanci-snapshot-v435.mjs'));
check('badge V434 resta collegato', /assets\/device-badge-v434\.css\?v=(435|436|437|438|439|440|441|442|443|444|445|446|447|448|449|450|451|452)/.test(index) && /assets\/device-badge-v434\.js\?v=(435|436|437|438|439|440|441|442|443|444|445|446|447|448|449|450|451|452)/.test(index));

if (ok !== total) {
  console.error(`Audit bilanci snapshot V435 completato: ${ok}/${total} controlli superati.`);
  process.exit(1);
}
console.log('Audit bilanci snapshot V435 superato.');
