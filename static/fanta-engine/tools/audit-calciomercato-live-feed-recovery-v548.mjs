#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const failures = [];
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}
function assert(condition, message) {
  if (!condition) failures.push(message);
}

for (const league of leagues) {
  const appRel = `static/${league}/assets/app.js`;
  const htmlRel = `static/${league}/index.html`;
  const configRel = `static/${league}/assets/league-config.json`;
  const leagueConfigRel = `static/${league}/assets/js/core/league-config-v443.js`;
  const app = read(appRel);
  const html = read(htmlRel);
  const config = JSON.parse(read(configRel));
  const leagueConfig = read(leagueConfigRel);
  assert(html.includes('assets/app.js?v=548'), `${league}: index non punta ad app.js?v=548`);
  assert(String(config.currentVersion) === '548', `${league}: currentVersion non e 548`);
  assert(leagueConfig.includes("currentVersion: '548'"), `${league}: league-config runtime non e 548`);
  assert(app.includes('fetchCalciomercatoAutomaticDataV548'), `${league}: manca retry live V548`);
  assert(app.includes('buildCalciomercatoAutomaticUrlV548({ includeDateRange: false })'), `${league}: manca retry live senza range data`);
  assert(app.includes('daysToLoad = availableDays.slice(-3)'), `${league}: manca fallback ultimi giorni archivio`);
  assert(app.includes('FantaEngineCalciomercatoLiveFeedRecoveryV548'), `${league}: manca marker runtime V548`);
  assert(app.includes('/.netlify/functions/calciomercato-feed?v=548'), `${league}: funzione Calciomercato non cache-bustata a v548`);
  assert(!exists(`static/${league}/assets/calciomercato`), `${league}: fallback locale calciomercato ancora presente`);
  assert(!exists(`static/${league}/assets/listoni`), `${league}: fallback locale listoni ancora presente`);
}
assert(exists('static/fanta-engine/data/shared-assets/current/assets/calciomercato/links.json'), 'links.json centrale mancante');
assert(exists('static/fanta-engine/data/shared-assets/current/assets/calciomercato/archive/manifest.json'), 'manifest archivio centrale mancante');

if (failures.length) {
  console.error('Audit V548 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Audit V548 superato: Calciomercato recupera live via Netlify Function con retry senza range, fallback ultimi giorni archivio centrale e runtime whole-site a ?v=548.');
