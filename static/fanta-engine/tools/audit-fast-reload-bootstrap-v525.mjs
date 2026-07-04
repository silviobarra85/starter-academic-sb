#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const errors = [];

function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push(`File mancante: ${rel}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function assertIncludes(rel, pattern, label) {
  const text = read(rel);
  if (!text.includes(pattern)) errors.push(`${label}: atteso '${pattern}' in ${rel}`);
}

function assertNotIncludes(rel, pattern, label) {
  const text = read(rel);
  if (text.includes(pattern)) errors.push(`${label}: residuo '${pattern}' in ${rel}`);
}

for (const league of leagues) {
  const prefix = `static/${league}`;
  for (const page of ['index.html', 'competition.html', 'player.html']) {
    assertIncludes(`${prefix}/${page}`, '?v=525', `${league} ${page} cache-buster V525`);
    assertNotIncludes(`${prefix}/${page}`, 'league-config-v443.js?v=512', `${league} ${page} no runtime V512`);
  }
  assertIncludes(`${prefix}/index.html`, 'rel="modulepreload" href="./assets/app.js?v=525"', `${league} modulepreload app`);
  assertIncludes(`${prefix}/index.html`, 'public-data-autoload-v512.js?v=525', `${league} modulepreload autoload`);
  assertIncludes(`${prefix}/index.html`, `· V525 ·`, `${league} footer V525`);
  assertIncludes(`${prefix}/assets/app.js`, 'installPublicDataAutoloadV525', `${league} app importa autoload V525`);
  assertIncludes(`${prefix}/assets/app.js`, 'delays: [0, 60, 240, 900]', `${league} delays ridotti V525`);
  assertIncludes(`${prefix}/assets/app.js`, 'FantaEngineFastReloadBootstrapV525', `${league} fast reload marker`);
  assertNotIncludes(`${prefix}/assets/app.js`, 'installPublicDataAutoloadV524', `${league} no import V524`);
  assertIncludes(`${prefix}/assets/js/core/league-config-v443.js`, "CONFIG_URL_V443 = './assets/league-config.json?v=525'", `${league} config URL V525`);
  const config = JSON.parse(read(`${prefix}/assets/league-config.json`));
  if (config.currentVersion !== 525) errors.push(`${league} currentVersion atteso 525, trovato ${config.currentVersion}`);
  if (!config.fastReloadBootstrapV525?.reducesDelayedBootTimers) errors.push(`${league} fastReloadBootstrapV525 assente o non valido`);
}

const autoload = read('static/fanta-engine/js/core/public-data-autoload-v512.js');
for (const token of [
  "PUBLIC_DATA_AUTOLOAD_VERSION_V525",
  "createPublicDataAutoloadV525",
  "installPublicDataAutoloadV525",
  "clearBootTimersForIntentV525",
  "shouldSkipDuplicateRunV525"
]) {
  if (!autoload.includes(token)) errors.push(`Modulo public-data-autoload senza ${token}`);
}

assertIncludes('docs/OVERLAY_ROADMAP.md', 'V525 - Fast reload bootstrap', 'roadmap V525');
assertIncludes('docs/FAST_RELOAD_BOOTSTRAP_V525.md', 'Fast reload bootstrap', 'doc V525');

if (errors.length) {
  console.error('Audit V525 fallito:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Audit V525 superato: fast reload bootstrap whole-site, timer tardivi ridotti e runtime a ?v=525.');
