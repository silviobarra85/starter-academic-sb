#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const VERSION = '566';
const FOOTER = `ZonaOrientale Salerno · V${VERSION} · Ultimo aggiornamento 04/07/2026`;
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

const cfg = readJson('static/zonaorientale/assets/league-config.json');
const cfgJs = read('static/zonaorientale/assets/js/core/league-config-v443.js');
const app = read('static/zonaorientale/assets/app.js');
const index = read('static/zonaorientale/index.html');
const competition = read('static/zonaorientale/competition.html');
const player = read('static/zonaorientale/player.html');

check(String(cfg.currentVersion) === VERSION, 'league-config.json currentVersion non allineato a V566');
check(cfg.branding?.footerLastUpdated === '04/07/2026', 'league-config.json footerLastUpdated non allineato');
check(String(cfg.branding?.footerVersion) === VERSION, 'league-config.json branding.footerVersion non allineato');
check(cfg.footerConfigSyncV566?.version === 'V566', 'metadata footerConfigSyncV566 mancante');

check(cfgJs.includes("currentVersion: '566'"), 'fallback league-config-v443.js currentVersion non V566');
check(cfgJs.includes("league-config.json?v=566"), 'league-config-v443.js CONFIG_URL non V566');
check(cfgJs.includes("version: 'V566'"), 'league-config-v443.js metadata runtime non V566');
check(cfgJs.includes("getLeagueConfigValueV443('currentVersion'"), 'footer runtime non usa currentVersion da config');
check(cfgJs.includes("setTextForSelectorV445('[data-league-footer-v445]'"), 'footer runtime non aggiorna data-league-footer-v445');

check(app.includes('league-config-v443.js?v=566'), 'app.js importa league-config con cache-buster non V566');
check(app.includes('DEPLOY_EXPECTED_VERSION_V181 = "566"'), 'DEPLOY_EXPECTED_VERSION_V181 non V566');

for (const [name, text] of [['index.html', index], ['competition.html', competition], ['player.html', player]]) {
  check(text.includes(FOOTER), `${name} footer statico non V566`);
  check(text.includes('data-league-footer-v445'), `${name} manca data-league-footer-v445`);
  check(!/data-league-footer-v445>[^<]*V563/.test(text), `${name} contiene footer statico V563`);
}
check(index.includes('./assets/app.js?v=566'), 'index.html app.js cache-buster non V566');
check(index.includes('boot-preloader-v560.css?v=566'), 'index.html preloader css cache-buster non V566');
check(index.includes('boot-preloader-v560.js?v=566'), 'index.html preloader js cache-buster non V566');
check(competition.includes('league-config-v443.js?v=566'), 'competition.html league-config cache-buster non V566');
check(player.includes('league-config-v443.js?v=566'), 'player.html league-config cache-buster non V566');

check(cfg.features?.calciomercato === false, 'Calciomercato deve restare disattivato');
check(cfg.features?.presidentReleasePlayers === true, 'Svincola Giocatori deve restare attivo');
check(cfg.currentSeasonId === '2026-2027', 'stagione corrente ZonaOrientale non 2026-2027');

if (failures.length) {
  console.error('Audit V566 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Audit V566 OK: footer ZonaOrientale allineato a config/cache-buster V566.');
