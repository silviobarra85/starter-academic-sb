#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const version = '520';
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const runtimeFiles = ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'news.html'];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function check(condition, message) {
  if (!condition) {
    console.error(`ERRORE V520: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`OK V520: ${message}`);
  }
}

for (const league of leagues) {
  const leagueRoot = `static/${league}`;
  for (const file of runtimeFiles) {
    const rel = `${leagueRoot}/${file}`;
    if (!exists(rel)) continue;
    const text = read(rel);
    check(!text.includes('league-config-v443.js?v=512'), `${rel} non richiama league-config V512`);
    check(!text.includes('assets/app.js?v=512'), `${rel} non richiama app V512`);
    check(!text.includes('· V512 ·'), `${rel} non mostra footer V512`);
  }

  const index = read(`${leagueRoot}/index.html`);
  check(index.includes('league-config-v443.js?v=520'), `${league} index carica league-config V520`);
  check(index.includes('assets/app.js?v=520'), `${league} index carica app V520`);

  const app = read(`${leagueRoot}/assets/app.js`);
  check(app.includes('public-data-autoload-v512.js?v=520'), `${league} app carica public-data-autoload con cache V520`);
  check(app.includes('league-config-v443.js?v=520'), `${league} app importa league-config V520`);

  const service = read(`${leagueRoot}/assets/js/data/static-files-service.js`);
  check(!service.includes('league-config-v443.js?v=512'), `${league} static-files-service non importa league-config V512`);
  check(service.includes('league-config-v443.js?v=520'), `${league} static-files-service importa league-config V520`);

  const cfg = read(`${leagueRoot}/assets/js/core/league-config-v443.js`);
  check(cfg.includes('formValidatorsV506: true'), `${league} league-config definisce formValidatorsV506`);
  check(cfg.includes("./assets/league-config.json?v=520"), `${league} league-config carica JSON V520`);

  const json = JSON.parse(read(`${leagueRoot}/assets/league-config.json`));
  check(json.currentVersion === 520, `${league} currentVersion 520`);
}

const autoload = read('static/fanta-engine/js/core/public-data-autoload-v512.js');
check(autoload.includes('function installPublicDataAutoloadV520'), 'public-data-autoload definisce alias V520');
check(autoload.includes('installPublicDataAutoloadV519'), 'public-data-autoload mantiene alias V519');

if (process.exitCode) {
  process.exit(process.exitCode);
}
console.log('Audit V520 superato: entrypoint runtime e pagine standalone ripuliti da V512.');
