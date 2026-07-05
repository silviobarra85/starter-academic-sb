#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const VERSION = '567';
const DATE = '05/07/2026';
const CSS_REL = 'static/fanta-engine/css/roster-sticky-first-col-v567.css';
const failures = [];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}
function readJson(rel) {
  return JSON.parse(read(rel));
}
function check(condition, message) {
  if (!condition) failures.push(message);
}

const css = read(CSS_REL);

check(css.includes('V567 - Mobile: prima colonna rose non trasparente'), 'commento descrittivo V567 assente nel CSS');
check(css.includes('@media (max-width: 900px)'), 'CSS non limitato allo scope mobile');
check(css.includes('#rosterClubCards .roster-player-table'), 'CSS non copre la sezione Rose espansa');
check(css.includes('.mobile-roster-detail-card-v156 .roster-player-table'), 'CSS non copre la card mobile della rosa espansa');
check(css.includes('.team-profile-roster-wrap table.team-profile-roster-table'), 'CSS non copre Area Squadra');
check(css.includes('background-image: none !important'), 'fallback opaco della prima colonna mancante');
check(css.includes('--fanta-roster-sticky-base-v567: #0f172a'), 'colore base opaco V567 mancante');
check(css.includes('--fanta-roster-sticky-gk-v567'), 'variante opaca portieri mancante');
check(css.includes('--fanta-roster-sticky-def-v567'), 'variante opaca difensori mancante');
check(css.includes('--fanta-roster-sticky-mid-v567'), 'variante opaca centrocampisti mancante');
check(css.includes('--fanta-roster-sticky-fwd-v567'), 'variante opaca attaccanti mancante');
check(!css.includes('rgba(245, 158, 11, 0.12)'), 'CSS V567 non deve ripetere background ruolo trasparente legacy');

const leagues = [
  {
    id: 'zonaorientale',
    name: 'ZonaOrientale Salerno',
    config: 'static/zonaorientale/assets/league-config.json',
    js: 'static/zonaorientale/assets/js/core/league-config-v443.js',
    app: 'static/zonaorientale/assets/app.js',
    pages: [
      'static/zonaorientale/index.html',
      'static/zonaorientale/competition.html',
      'static/zonaorientale/player.html'
    ]
  },
  {
    id: 'fantapetillomantramanager',
    name: 'FantaMantraManager',
    config: 'static/fantapetillomantramanager/assets/league-config.json',
    js: 'static/fantapetillomantramanager/assets/js/core/league-config-v443.js',
    app: 'static/fantapetillomantramanager/assets/app.js',
    pages: [
      'static/fantapetillomantramanager/index.html',
      'static/fantapetillomantramanager/competition.html',
      'static/fantapetillomantramanager/player.html'
    ]
  }
];

for (const league of leagues) {
  const cfg = readJson(league.config);
  const cfgJs = read(league.js);
  const app = read(league.app);
  const index = read(league.pages[0]);
  const expectedFooter = `${league.name} · V${VERSION} · Ultimo aggiornamento ${DATE}`;

  check(String(cfg.currentVersion) === VERSION, `${league.id}: currentVersion non V567`);
  check(cfg.features?.rosterStickyFirstColumnOpaque === true, `${league.id}: feature rosterStickyFirstColumnOpaque non attiva`);
  check(cfg.features?.rosterStickyFirstColumnOpaqueVersion === 'V567', `${league.id}: feature version non V567`);
  check(cfg.branding?.footerLastUpdated === DATE, `${league.id}: footerLastUpdated non aggiornato`);
  check(String(cfg.branding?.footerVersion) === VERSION, `${league.id}: footerVersion non V567`);
  check(cfg.rosterStickyFirstColumnV567?.opaqueFirstColumn === true, `${league.id}: metadata rosterStickyFirstColumnV567 mancante`);
  check(cfg.features?.calciomercato === false, `${league.id}: Calciomercato deve restare disattivato`);

  check(cfgJs.includes("currentVersion: '567'"), `${league.id}: fallback JS currentVersion non V567`);
  check(cfgJs.includes('league-config.json?v=567'), `${league.id}: fallback JS CONFIG_URL non V567`);
  check(app.includes('league-config-v443.js?v=567'), `${league.id}: app.js importa league-config non V567`);
  check(app.includes('DEPLOY_EXPECTED_VERSION_V181 = "567"'), `${league.id}: DEPLOY_EXPECTED_VERSION_V181 non V567`);

  check(index.includes('roster-sticky-first-col-v567.css?v=567'), `${league.id}: index non carica CSS V567`);
  check(index.indexOf('roster-listone-table-unification-v551.css') < index.indexOf('roster-sticky-first-col-v567.css'), `${league.id}: CSS V567 deve essere dopo V551`);

  for (const page of league.pages) {
    const text = read(page);
    check(text.includes(expectedFooter), `${league.id}: footer statico non V567 in ${path.basename(page)}`);
    check(text.includes('league-config-v443.js?v=567'), `${league.id}: cache-buster league-config non V567 in ${path.basename(page)}`);
  }
}

if (failures.length) {
  console.error('Audit V567 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Audit V567 OK: prima colonna sticky Rose/Area Squadra opaca da mobile su entrambe le leghe.');
