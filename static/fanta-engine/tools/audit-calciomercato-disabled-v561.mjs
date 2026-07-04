#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const failures = [];

function read(path) {
  const full = resolve(root, path);
  if (!existsSync(full)) {
    failures.push(`MISSING ${path}`);
    return '';
  }
  return readFileSync(full, 'utf8');
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function check(condition, message) {
  if (condition) pass(message);
  else failures.push(`FAIL ${message}`);
}

for (const league of leagues) {
  const base = `static/${league}`;
  const index = read(`${base}/index.html`);
  const app = read(`${base}/assets/app.js`);
  const config = read(`${base}/assets/league-config.json`);
  const leagueConfig = read(`${base}/assets/js/core/league-config-v443.js`);
  const player = read(`${base}/player.html`);
  const competition = read(`${base}/competition.html`);

  check(index.includes('V561'), `${league}: footer/cache-buster V561 presente in index`);
  check(!index.includes('data-page="calciomercato"'), `${league}: sezione HTML Calciomercato rimossa`);
  check(!index.includes('data-page-link="calciomercato"'), `${league}: nav Calciomercato rimossa da index`);
  check(!index.includes('href="#calciomercato"'), `${league}: link hash Calciomercato rimossi da index`);
  check(!index.includes('calciomercato.css'), `${league}: CSS Calciomercato non caricato dalla home`);
  check(!player.includes('./#calciomercato') && !competition.includes('./#calciomercato'), `${league}: link Calciomercato rimossi da player/competition`);

  check(!/^import \{ createCalciomercato/m.test(app), `${league}: import statici moduli Calciomercato rimossi`);
  check(app.includes('FantaEngineCalciomercatoDisabledV561'), `${league}: guard runtime V561 presente`);
  check(app.includes('loadCalciomercatoDataV561'), `${league}: loader Calciomercato sostituito da no-op V561`);
  check(app.includes('automaticExternalFetch: false'), `${league}: fetch esterno dichiarato disattivato`);
  check(app.includes('staticArchiveFetch: false'), `${league}: archivio statico articoli dichiarato disattivato`);

  check(config.includes('"currentVersion": "561"'), `${league}: league-config currentVersion V561`);
  check(config.includes('"calciomercato": false'), `${league}: feature Calciomercato false in JSON`);
  check(!config.includes('"href": "#calciomercato"'), `${league}: mobileMore JSON senza Calciomercato`);
  check(leagueConfig.includes("currentVersion: '561'"), `${league}: default league-config JS aggiornato a V561`);
  check(leagueConfig.includes('calciomercato: false'), `${league}: default feature Calciomercato false`);
  check(!leagueConfig.includes("id: 'calciomercato', href: '#calciomercato'"), `${league}: default mobileMore JS senza Calciomercato`);
}

const feed = read('netlify/functions/calciomercato-feed.js');
check(feed.includes("sourceMode: 'disabled-v561'"), 'Netlify calciomercato-feed risponde disabled-v561');
check(!feed.includes('fetch(') && !feed.includes('https://www.tuttomercatoweb.com') && !feed.includes('DEFAULT_SOURCES'), 'Netlify calciomercato-feed non contiene recuperi esterni');

const docs = read('docs/CALCIOMERCATO_DISABLED_V561.md') + read('docs/AI_ASSISTANT_HANDOFF_V561.md');
check(docs.includes('V561'), 'documentazione V561 presente');

if (failures.length) {
  console.error('\nAudit V561 fallito:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('\nAudit V561 superato: Calciomercato rimosso e recupero articoli bloccato.');
