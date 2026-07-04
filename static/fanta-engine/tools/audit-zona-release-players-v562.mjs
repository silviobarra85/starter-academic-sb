#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const checks = [];
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function ok(name, pass, detail = '') {
  checks.push({ name, pass: Boolean(pass), detail });
}
function includesAll(text, needles) {
  return needles.every((needle) => text.includes(needle));
}

const configRel = 'static/zonaorientale/assets/league-config.json';
const jsConfigRel = 'static/zonaorientale/assets/js/core/league-config-v443.js';
const indexRel = 'static/zonaorientale/index.html';
const appRel = 'static/zonaorientale/assets/app.js';
const fmmConfigRel = 'static/fantapetillomantramanager/assets/league-config.json';

let config = null;
try {
  config = JSON.parse(read(configRel));
  ok('league-config.json valido', true, configRel);
} catch (error) {
  ok('league-config.json valido', false, error.message);
}

if (config) {
  const releaseCard = config.featureCardRegistry?.cards?.find((card) => card?.id === 'release-players');
  ok('ZonaOrientale currentVersion V562', config.currentVersion === '562', `currentVersion=${config.currentVersion}`);
  ok('ZonaOrientale currentSeasonId 2026-2027', config.currentSeasonId === '2026-2027', `currentSeasonId=${config.currentSeasonId}`);
  ok('multiSeason currentSeasonId 2026-2027', config.multiSeasonDataAdapterV526?.currentSeasonId === '2026-2027', `currentSeasonId=${config.multiSeasonDataAdapterV526?.currentSeasonId}`);
  ok('feature presidentReleasePlayers attiva', config.features?.presidentReleasePlayers === true, `value=${config.features?.presidentReleasePlayers}`);
  ok('card release-players attiva', releaseCard?.enabled === true, `enabled=${releaseCard?.enabled}`);
  ok('card release-players visibility president', releaseCard?.visibility === 'president', `visibility=${releaseCard?.visibility}`);
  ok('card release-players collegata a featureKey', releaseCard?.featureKey === 'presidentReleasePlayers', `featureKey=${releaseCard?.featureKey}`);
  ok('selector dashboard release-players presente', Array.isArray(config.dashboardCardsEngine?.selectors?.['release-players']) && config.dashboardCardsEngine.selectors['release-players'].includes('#teamPlayerReleasePanelV261'));
  const seasons = Array.isArray(config.seasons) ? config.seasons : [];
  ok('stagione 2026-2027 marcata corrente', seasons.some((season) => season?.id === '2026-2027' && season?.current === true));
}

const jsConfig = read(jsConfigRel);
ok('fallback JS config V562', includesAll(jsConfig, ["currentVersion: '562'", "currentSeasonId: '2026-2027'", "presidentReleasePlayers: true", "league-config.json?v=562"]), jsConfigRel);

const index = read(indexRel);
ok('index cache-buster V562', index.includes('?v=562') && !index.includes('?v=561'), indexRel);
ok('footer ZonaOrientale V562', index.includes('ZonaOrientale Salerno · V562'), indexRel);
ok('Calciomercato resta fuori dalla nav', !index.includes('href="#calciomercato"') && !index.includes('data-page="calciomercato"'), 'V561 preservata');

const app = read(appRel);
ok('pannello Svincola presente nel runtime', includesAll(app, ['teamPlayerReleasePanelV261', 'Svincola Giocatori']), appRel);
ok('Calciomercato resta disattivato nel runtime', includesAll(app, ['CALCIOMERCATO_DISABLED_V561', 'Calciomercato disattivato']), 'V561 preservata');

try {
  const fmm = JSON.parse(read(fmmConfigRel));
  const fmmRelease = fmm.featureCardRegistry?.cards?.find((card) => card?.id === 'release-players');
  ok('FantaMantraManager non regredito: release ancora attivo', fmm.features?.presidentReleasePlayers === true && fmmRelease?.enabled === true, fmmConfigRel);
} catch (error) {
  ok('FantaMantraManager config leggibile', false, error.message);
}

const failed = checks.filter((check) => !check.pass);
for (const check of checks) {
  const icon = check.pass ? 'ok' : 'FAIL';
  console.log(`${icon} - ${check.name}${check.detail ? ` (${check.detail})` : ''}`);
}
if (failed.length) {
  console.error(`\nAudit V562 fallito: ${failed.length} controllo/i non superato/i.`);
  process.exit(1);
}
console.log('\nAudit V562 superato: Svincola Giocatori attivo su ZonaOrientale e guardrail V561 preservati.');
