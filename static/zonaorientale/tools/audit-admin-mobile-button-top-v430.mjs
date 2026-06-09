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
assert(runtimeVersion === 430, `runtime non V430: ${runtimeVersion || 'non rilevato'}`);
assert(app.includes('ZonaOrientaleAdminMobileButtonTopV430'), 'marker ZonaOrientaleAdminMobileButtonTopV430 mancante');
assert(index.includes('V430 Admin mobile pulsante sopra'), 'footer index V430 mancante');
assert(competition.includes('V430 Admin mobile pulsante sopra'), 'footer competition V430 mancante');
assert(player.includes('V430 Admin mobile pulsante sopra'), 'footer player V430 mancante');
for (const content of [index, competition, player, app]) {
  assert(!content.includes('?v=429'), 'cache-buster V429 ancora presente');
}

const requiredCss = [
  'V430 - Admin mobile: Apri/Riduci sopra il titolo',
  'grid-template-areas:',
  '"admin-toggle"',
  '"admin-title"',
  'grid-area: admin-toggle',
  'grid-area: admin-title',
  'justify-self: start',
  'width: auto !important',
  'max-width: max-content',
  '[data-admin-toggle-panel]',
  '[data-admin-toggle-category-v313]',
  '[data-admin-toggle-standalone-v313]'
];
for (const token of requiredCss) {
  assert(mobileCss.includes(token), `CSS V430 mancante: ${token}`);
}

assert(check.includes('audit-admin-mobile-button-top-v430.mjs'), 'check-zonaorientale non include audit V430');

if (failures.length) {
  console.error('Audit Admin mobile pulsante sopra V430 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
if (!quiet) console.log('Audit Admin mobile pulsante sopra V430 superato.');
