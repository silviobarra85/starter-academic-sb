#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cssPath = path.join(root, 'static/fanta-engine/css/teamarea-roster-first-col-compact-v569.css');
const css = fs.readFileSync(cssPath, 'utf8');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

assert(css.includes('.team-profile-listone-wrap-v415'), 'CSS V569 non e scoped su Area Squadra / profilo squadra.');
assert(css.includes('30vw'), 'CSS V569 non riduce la prima colonna al target mobile 30vw.');
assert(css.includes('max-width: calc(clamp(6.25rem, 30vw, 9rem) - 12px)'), 'CSS V569 non limita il contenuto interno della prima colonna.');
assert(css.includes('white-space: normal'), 'CSS V569 deve evitare un nome forzatamente tutto su una riga nella colonna compatta.');
assert(!css.includes('#rosterClubCards'), 'CSS V569 non deve influenzare direttamente le Rose espanse.');
assert(!css.includes('[data-page="listone"]'), 'CSS V569 non deve influenzare direttamente il Listone.');

for (const league of leagues) {
  const base = path.join(root, 'static', league);
  const index = fs.readFileSync(path.join(base, 'index.html'), 'utf8');
  const app = fs.readFileSync(path.join(base, 'assets/app.js'), 'utf8');
  const cfg = JSON.parse(fs.readFileSync(path.join(base, 'assets/league-config.json'), 'utf8'));
  const cfgJs = fs.readFileSync(path.join(base, 'assets/js/core/league-config-v443.js'), 'utf8');

  assert(index.includes('teamarea-roster-first-col-compact-v569.css?v=569'), `${league}: index non carica il CSS V569.`);
  assert(index.indexOf('roster-mobile-column-fit-v568.css?v=568') < index.indexOf('teamarea-roster-first-col-compact-v569.css?v=569'), `${league}: il CSS V569 deve essere caricato dopo V568.`);
  assert(index.includes('app.js?v=569'), `${league}: cache-buster app.js non aggiornato a V569.`);
  assert(index.includes('· V569 ·'), `${league}: footer index non aggiornato a V569.`);
  assert(fs.readFileSync(path.join(base, 'competition.html'), 'utf8').includes('· V569 ·'), `${league}: footer competition non aggiornato a V569.`);
  assert(fs.readFileSync(path.join(base, 'player.html'), 'utf8').includes('· V569 ·'), `${league}: footer player non aggiornato a V569.`);
  assert(app.includes('league-config-v443.js?v=569'), `${league}: import config in app.js non aggiornato a V569.`);
  assert(app.includes('DEPLOY_EXPECTED_VERSION_V181 = "569"'), `${league}: deploy expected version non aggiornato a V569.`);
  assert(cfg.currentVersion === '569', `${league}: currentVersion config non e 569.`);
  assert(cfg.features?.teamareaRosterFirstColumnCompactVersion === 'V569', `${league}: feature V569 assente dalla config.`);
  assert(cfg.branding?.footerVersion === 569, `${league}: footerVersion config non e 569.`);
  assert(cfgJs.includes("currentVersion: '569'"), `${league}: fallback config js non aggiornato a V569.`);
  assert(cfgJs.includes('league-config.json?v=569'), `${league}: cache-buster league-config.json non aggiornato a V569.`);
}

if (errors.length) {
  console.error('Audit V569 fallito:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Audit V569 OK: prima colonna Area Squadra mobile compatta e isolata da Rose/Listone.');
