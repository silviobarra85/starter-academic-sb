#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const quiet = process.argv.includes('--quiet');
const checks = [];
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function check(label, ok) {
  checks.push({ label, ok: Boolean(ok) });
  if (!quiet) console.log(`${ok ? 'OK' : 'FAIL'}: ${label}`);
}

const app = read('assets/app.js');
const css = read('assets/css/refactor/mobile-controls.css');
const index = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const checkScript = read('tools/check-zonaorientale.sh');

const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = Number(runtimeMatch?.[1] || 0);
check('runtime atteso >= V431', runtimeVersion >= 431);
check('footer index runtime corrente', index.includes(`V${runtimeVersion}`));
check('footer competition runtime corrente', competition.includes(`V${runtimeVersion}`));
check('footer player runtime corrente', player.includes(`V${runtimeVersion}`));
check('cache-buster index runtime corrente', !index.includes('?v=430') && index.includes(`?v=${runtimeVersion}`));
check('cache-buster app import runtime corrente', !app.includes('?v=430') && app.includes(`?v=${runtimeVersion}`));
check('marker runtime TeamArea V431', app.includes('ZonaOrientaleTeamAreaMobileCompactV431'));
check('helper ordinamento TeamArea V431', app.includes('function applyTeamAreaMobileCompactV431'));
check('dashboard V369 portata in cima al body', app.includes('target.prepend(mainDashboard)'));
check('notifiche V370 subito dopo dashboard', app.includes('mainDashboard.insertAdjacentElement("afterend", notificationCenter)'));
check('scheda squadra compattata con classe V431', app.includes('teamarea-summary-compact-v431'));
check('dashboard secondaria preservata e marcata', app.includes('teamarea-dashboard-secondary-v431') && app.includes('data-teamarea-secondary-dashboard-v431'));
check('form operativi preservati e marcati', app.includes('trade-proposal-panel, .trade-list-panel, #teamNewsRequestForm'));
check('CSS V431 presente', css.includes('V431 - Area Squadra mobile compatta'));
check('CSS compatta Dashboard Presidente V369', css.includes('.teamarea-dashboard-primary-v431') && css.includes('.president-dashboard-metrics-v369'));
check('CSS compatta Notifiche Presidente V370', css.includes('.teamarea-notification-compact-v431') && css.includes('.president-notification-metrics-v370'));
check('CSS compatta scheda nome squadra', css.includes('.teamarea-summary-compact-v431') && css.includes('.user-request-grid'));
check('CSS accorpa metriche in griglia', css.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'));
check('CSS mantiene layout stretto a 2 colonne', css.includes('@media (max-width: 380px)') && css.includes('repeat(2, minmax(0, 1fr))'));
check('gate V431 nel check principale', checkScript.includes('audit-teamarea-mobile-v431.mjs'));

const failed = checks.filter((item) => !item.ok);
if (failed.length) {
  if (!quiet) {
    console.error(`Audit V431 fallito: ${failed.length}/${checks.length} controlli non superati.`);
  }
  process.exit(1);
}
if (!quiet) console.log(`Audit V431 superato: ${checks.length}/${checks.length} controlli superati.`);
