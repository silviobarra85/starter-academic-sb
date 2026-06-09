#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const quiet = process.argv.includes('--quiet');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const failures = [];
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const assert = (condition, message) => { if (!condition) failures.push(message); };

const app = read('assets/app.js');
const mobileCss = read('assets/css/refactor/mobile-controls.css');
const check = read('tools/check-zonaorientale.sh');
const index = read('index.html');
const competition = read('competition.html');
const player = read('player.html');

const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = Number(runtimeMatch?.[1] || 0);
assert(runtimeVersion >= 429, `runtime precedente a V429: ${runtimeVersion || 'non rilevato'}`);
assert(app.includes('ZonaOrientaleAdminMobileHeaderFixV429'), 'marker ZonaOrientaleAdminMobileHeaderFixV429 mancante');
assert(index.includes(`V${runtimeVersion}`), 'footer index runtime corrente mancante');
assert(competition.includes(`V${runtimeVersion}`), 'footer competition runtime corrente mancante');
assert(player.includes(`V${runtimeVersion}`), 'footer player runtime corrente mancante');
for (const content of [index, competition, player, app]) {
  assert(!content.includes('?v=428'), 'cache-buster V428 ancora presente');
}

const requiredCss = [
  'V429 - Admin mobile: titoli leggibili',
  'body.is-mobile-ux #adminPanel .admin-category-heading',
  'body.is-mobile-ux #adminPanel .admin-category-body > .panel .panel-header',
  'body.is-mobile-ux #adminPanel .admin-subsection-headerline',
  'grid-template-columns: minmax(0, 1fr) auto',
  'grid-template-columns: minmax(0, 1fr) !important',
  'overflow-wrap: normal',
  'word-break: normal',
  'hyphens: none',
  '[data-admin-toggle-panel]',
  '[data-admin-toggle-category-v313]',
  '[data-admin-toggle-standalone-v313]'
];
for (const token of requiredCss) {
  assert(mobileCss.includes(token), `CSS V429 mancante: ${token}`);
}

assert(app.includes('? "Apri" : "Riduci"') || app.includes('? "Apri" : "Riduci";'), 'label Admin collassato non compatta ad Apri/Riduci');
assert(check.includes('audit-admin-mobile-header-v429.mjs'), 'check-zonaorientale non include audit V429');

if (failures.length) {
  console.error('Audit titoli Admin mobile V429 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
if (!quiet) console.log('Audit titoli Admin mobile V429 superato.');
