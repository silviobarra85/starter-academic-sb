#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
let failures = 0;
function read(rel) {
  return readFileSync(join(root, 'static', rel), 'utf8');
}
function check(condition, message) {
  if (condition) console.log(`OK ${message}`);
  else { console.error(`FAIL ${message}`); failures += 1; }
}
for (const league of leagues) {
  const base = `${league}`;
  const required = [
    `${base}/index.html`,
    `${base}/competition.html`,
    `${base}/player.html`,
    `${base}/assets/app.js`,
    `${base}/assets/league-config.json`,
    `${base}/assets/js/core/league-config-v443.js`,
    `${base}/assets/js/core/ui.js`,
    `${base}/assets/js/data/static-files-service.js`,
    `${base}/assets/js/sections/bilanci-snapshot-section-v435.js`,
  ];
  for (const rel of required) check(existsSync(join(root, 'static', rel)), `${league}: esiste ${rel}`);
  const index = read(`${base}/index.html`);
  const competition = read(`${base}/competition.html`);
  const player = read(`${base}/player.html`);
  const app = read(`${base}/assets/app.js`);
  const cfg = JSON.parse(read(`${base}/assets/league-config.json`));
  const loader = read(`${base}/assets/js/core/league-config-v443.js`);
  const service = read(`${base}/assets/js/data/static-files-service.js`);
  const ui = read(`${base}/assets/js/core/ui.js`);
  const bilanci = read(`${base}/assets/js/sections/bilanci-snapshot-section-v435.js`);
  const joined = [index, competition, player, app, loader, service, ui, bilanci, JSON.stringify(cfg)].join('\n');
  check(index.includes('league-config-v443.js?v=515') && index.includes('assets/app.js?v=515'), `${league}: index carica runtime V515`);
  check(competition.includes('league-config-v443.js?v=515'), `${league}: competition carica config V515`);
  check(player.includes('league-config-v443.js?v=515'), `${league}: player carica config V515`);
  check(app.includes('league-config-v443.js?v=515'), `${league}: app.js importa config V515`);
  check(service.includes('league-config-v443.js?v=515'), `${league}: static-files-service importa config V515`);
  check(ui.includes('league-config-v443.js?v=515'), `${league}: ui importa config V515`);
  check(bilanci.includes('league-config-v443.js?v=515'), `${league}: bilanci snapshot importa config V515`);
  check(loader.includes('formValidatorsV506: true') && !loader.includes('formValidatorsV506, leagueTemplateHardeningV507'), `${league}: formValidatorsV506 non è shorthand non definita`);
  check(loader.includes('league-config.json?v=515'), `${league}: loader fetch config V515`);
  check(cfg.currentVersion === 515, `${league}: league-config currentVersion 515`);
  check(!joined.includes('?v=512') && !joined.includes('V512'), `${league}: nessun residuo V512 nei file runtime critici`);
}
if (failures) {
  console.error(`Audit V515 fallito: ${failures} errori.`);
  process.exit(1);
}
console.log('Audit V515 superato: runtime whole-site allineato e ReferenceError rimosso.');
