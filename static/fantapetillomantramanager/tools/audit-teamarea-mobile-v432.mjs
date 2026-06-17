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
assert(runtimeVersion >= 432, `runtime precedente a V432: ${runtimeVersion || 'non rilevato'}`);
assert(index.includes(`V${runtimeVersion}`), 'footer index runtime corrente mancante');
assert(competition.includes(`V${runtimeVersion}`), 'footer competition runtime corrente mancante');
assert(player.includes(`V${runtimeVersion}`), 'footer player runtime corrente mancante');
for (const content of [index, competition, player, app]) {
  assert(!content.includes('?v=431'), 'cache-buster V431 ancora presente');
}

const requiredAppTokens = [
  'ZonaOrientaleTeamAreaMobileCompactV432',
  'function getTeamAreaDashboardPrimaryV432',
  '.president-dashboard-v369, #presidentDashboardV369',
  'function ensureTeamAreaCollapsiblePanelV432',
  'teamarea-collapsible-v432',
  'is-collapsed-v432',
  'teamTransferCommunicationPanelV242',
  'teamPlayerReleasePanelV261',
  'data-teamarea-toggle-v432',
  'form comunicato scambio V242 e svincolo V261 preservati'
];
for (const token of requiredAppTokens) {
  assert(app.includes(token), `app.js V432 mancante: ${token}`);
}

const requiredCssTokens = [
  'V432 - Area Squadra mobile ordinata',
  '.teamarea-dashboard-primary-v432',
  '.teamarea-dashboard-secondary-v432',
  'display: none !important',
  '.president-dashboard-badge-v369',
  'grid-template-columns: repeat(2, minmax(0, 1fr)) !important',
  '.president-dashboard-actions-v369',
  '.teamarea-collapsible-v432.is-collapsed-v432 > :not(.panel-header)',
  '.teamarea-collapse-toggle-v432'
];
for (const token of requiredCssTokens) {
  assert(mobileCss.includes(token), `CSS V432 mancante: ${token}`);
}

assert(check.includes('audit-teamarea-mobile-v432.mjs'), 'check-zonaorientale non include audit V432');
assert(app.includes('renderAllV432') && app.includes('renderUserAreaV432'), 'render hook V432 mancanti');
assert(app.includes('event.target.closest?.("[data-teamarea-toggle-v432]")'), 'handler toggle V432 mancante');

if (failures.length) {
  console.error('Audit Area Squadra mobile V432 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
if (!quiet) console.log('Audit Area Squadra mobile V432 superato.');
