#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function readJson(file) {
  return JSON.parse(read(file));
}
function check(condition, message) {
  if (!condition) failures.push(message);
  else console.log(`ok - ${message}`);
}

const app = read('static/zonaorientale/assets/app.js');
const core = read('static/zonaorientale/assets/js/core/league-config-v443.js');
const index = read('static/zonaorientale/index.html');
const cfg = readJson('static/zonaorientale/assets/league-config.json');

const releaseCard = (cfg.featureCardRegistry?.cards || []).find((card) => card.id === 'release-players');

check(cfg.leagueId === 'zonaorientale', 'config ZonaOrientale preservata');
check(cfg.currentVersion === '563', 'league-config aggiornata a V563');
check(cfg.currentSeasonId === '2026-2027', 'stagione corrente ZonaOrientale 2026-2027 preservata');
check(cfg.features?.calciomercato === false, 'Calciomercato resta disattivato');
check(cfg.features?.presidentReleasePlayers === true, 'feature presidentReleasePlayers attiva');
check(releaseCard?.enabled === true, 'card release-players abilitata in config');
check(releaseCard?.visibility === 'president', 'card release-players visibile solo ai presidenti');
check(releaseCard?.featureKey === 'presidentReleasePlayers', 'card release-players agganciata alla feature corretta');
check(releaseCard?.hiddenForAdmin === true, 'card release-players nascosta in sessione admin');

check(core.includes("currentVersion: '563'"), 'default runtime currentVersion V563');
check(core.includes("currentSeasonId: '2026-2027'"), 'default runtime currentSeasonId 2026-2027');
check(core.includes('presidentReleasePlayers: true'), 'default runtime abilita presidentReleasePlayers');
check(core.includes("id: 'release-players'"), 'default runtime contiene override release-players');
check(core.includes("enabled: true"), 'default runtime abilita release-players prima del fetch async');
check(core.includes("league-config.json?v=563"), 'fetch league-config cache-buster V563');
check(core.includes('ZonaOrientaleReleasePlayersBootstrapV563'), 'marker bootstrap V563 presente');

check(app.includes('league-config-v443.js?v=563'), 'app importa league-config V563');
check(app.includes('ZonaOrientalePlayerReleaseV563'), 'runtime fix V563 presente in app.js');
check(app.includes('enableZonaReleasePlayersRegistryV563'), 'registry V497 patchato dal runtime fix');
check(app.includes('activateZonaReleasePlayersPanelV563'), 'pannello Svincola Giocatori riattivato dopo render');
check(app.includes('teamPlayerReleaseSelectV261'), 'select giocatori da svincolare preservata');
check(app.includes('sendPlayerReleaseEmailV266'), 'invio email svincolo ZonaOrientale preservato');
check(app.includes('caparrotti86@yahoo.it'), 'destinatario lega ZonaOrientale preservato');
check(app.includes('FantaEngineCalciomercatoDisabledV561'), 'guardrail Calciomercato V561 preservato');
check(!app.includes('import { createCalciomercatoImageHelpersV334 }'), 'import statici Calciomercato non reintrodotti');

check(index.includes('app.js?v=563'), 'index usa app.js V563');
check(index.includes('ZonaOrientale Salerno · V563'), 'footer index V563');

const overlayFiles = fs.readdirSync(path.join(root, 'static'));
check(!overlayFiles.includes('fantapetillomantramanager'), 'overlay V563 non modifica FantaPetilloMantraManager');

if (failures.length) {
  console.error('\nAudit V563 fallito:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('\nAudit V563 superato.');
