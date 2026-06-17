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
assert(runtimeVersion >= 433, `runtime precedente a V433: ${runtimeVersion || 'non rilevato'}`);
assert(index.includes(`V${runtimeVersion}`), 'footer index runtime corrente mancante');
assert(competition.includes(`V${runtimeVersion}`), 'footer competition runtime corrente mancante');
assert(player.includes(`V${runtimeVersion}`), 'footer player runtime corrente mancante');
for (const content of [index, competition, player, app]) {
  assert(!content.includes('?v=432'), 'cache-buster V432 ancora presente');
}

const requiredAppTokens = [
  'ZonaOrientaleTeamAreaMobileCompactV433',
  'function applyTeamAreaMobileCompactV433',
  'teamarea-mobile-compact-v433',
  'teamarea-notification-hidden-v433',
  'data-teamarea-notifications-hidden-v433',
  'teamarea-low-priority-panel-v433',
  'teamTransferCommunicationPanelV242',
  'teamPlayerReleasePanelV261',
  'target.append(panel)',
  'Notifiche Presidente V370 nascoste solo come card mobile, dati e handler preservati'
];
for (const token of requiredAppTokens) {
  assert(app.includes(token), `app.js V433 mancante: ${token}`);
}

const requiredCssTokens = [
  'V433 - Area Squadra mobile semplificata',
  '.teamarea-dashboard-primary-v433',
  '.teamarea-notification-hidden-v433',
  'display: none !important',
  '.teamarea-low-priority-panel-v433',
  'order: 12 !important',
  '.teamarea-hub-compact-v433 .mobile-teamarea-actions-v144',
  '.president-dashboard-actions-v369',
  'grid-template-columns: repeat(2, minmax(0, 1fr)) !important'
];
for (const token of requiredCssTokens) {
  assert(mobileCss.includes(token), `CSS V433 mancante: ${token}`);
}

assert(check.includes('audit-teamarea-mobile-v433.mjs'), 'check-zonaorientale non include audit V433');
assert(app.includes('renderAllV433') && app.includes('renderUserAreaV433'), 'render hook V433 mancanti');
assert(!mobileCss.includes('word-break: break-all'), 'word-break: break-all vietato nel CSS mobile');

if (failures.length) {
  console.error('Audit Area Squadra mobile V433 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
if (!quiet) console.log('Audit Area Squadra mobile V433 superato.');
