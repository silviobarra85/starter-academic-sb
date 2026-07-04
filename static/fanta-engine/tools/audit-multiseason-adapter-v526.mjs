#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = {
  zonaorientale: '2025-2026',
  fantapetillomantramanager: '2026-2027'
};
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

assertIncludes('static/fanta-engine/js/core/season-data-adapter-v526.js', 'installSeasonDataAdapterV526', 'adapter V526 export install');
assertIncludes('static/fanta-engine/js/core/season-data-adapter-v526.js', "'listoni'", 'adapter dati condivisi listoni');
assertIncludes('static/fanta-engine/js/core/season-data-adapter-v526.js', "'calciomercato'", 'adapter dati condivisi calciomercato');
assertIncludes('static/fanta-engine/js/core/public-data-autoload-v512.js', 'installPublicDataAutoloadV526', 'autoload alias V526');
assertIncludes('static/fanta-engine/js/core/public-data-autoload-v512.js', 'PUBLIC_DATA_AUTOLOAD_VERSION_V526', 'autoload version V526');

for (const [league, expectedSeason] of Object.entries(leagues)) {
  const prefix = `static/${league}`;
  for (const page of ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'news.html']) {
    const pageRel = `${prefix}/${page}`;
    const pageText = read(pageRel);
    if (pageText.includes('league-config-v443.js') || pageText.includes('app.js?v=')) {
      if (!pageText.includes('?v=526')) errors.push(`${league} ${page} cache-buster V526 assente su pagina runtime`);
    }
    if (pageText.includes('league-config-v443.js?v=512')) errors.push(`${league} ${page} contiene ancora runtime V512`);
  }
  assertIncludes(`${prefix}/index.html`, 'season-data-adapter-v526.js?v=526', `${league} modulepreload season adapter`);
  assertIncludes(`${prefix}/index.html`, `· V526 ·`, `${league} footer V526`);
  assertIncludes(`${prefix}/assets/app.js`, 'installSeasonDataAdapterV526', `${league} app install adapter`);
  assertIncludes(`${prefix}/assets/app.js`, 'installPublicDataAutoloadV526', `${league} app autoload V526`);
  assertIncludes(`${prefix}/assets/app.js`, 'FantaEngineSeasonDataAdapterRuntimeV526', `${league} runtime adapter marker`);
  assertNotIncludes(`${prefix}/assets/app.js`, 'installPublicDataAutoloadV525', `${league} no import V525`);
  assertIncludes(`${prefix}/assets/js/core/league-config-v443.js`, "CONFIG_URL_V443 = './assets/league-config.json?v=526'", `${league} config URL V526`);
  assertIncludes(`${prefix}/assets/js/core/league-config-v443.js`, 'multiSeasonDataAdapterV526: true', `${league} config runtime marker V526`);
  assertIncludes(`${prefix}/assets/js/core/league-config-v443.js`, "currentVersion: '526'", `${league} default currentVersion V526`);

  const config = JSON.parse(read(`${prefix}/assets/league-config.json`));
  if (config.currentVersion !== 526) errors.push(`${league} currentVersion atteso 526, trovato ${config.currentVersion}`);
  if (config.currentSeasonId !== expectedSeason) errors.push(`${league} currentSeasonId atteso ${expectedSeason}, trovato ${config.currentSeasonId}`);
  if (!Array.isArray(config.seasons) || !config.seasons.some((item) => item.id === expectedSeason || item.seasonId === expectedSeason)) {
    errors.push(`${league} seasons non contiene ${expectedSeason}`);
  }
  if (!config.features?.multiSeasonDataAdapter) errors.push(`${league} feature multiSeasonDataAdapter assente`);
  if (!config.multiSeasonDataAdapterV526?.metadataOnly) errors.push(`${league} multiSeasonDataAdapterV526 assente o non metadataOnly`);
  if (!config.multiSeasonDataAdapterV526?.sharedDataKinds?.includes('listoni')) errors.push(`${league} listoni non classificato shared`);
  if (!config.multiSeasonDataAdapterV526?.sharedDataKinds?.includes('calciomercato')) errors.push(`${league} calciomercato non classificato shared`);
}

assertIncludes('docs/OVERLAY_ROADMAP.md', 'V526 - Adapter dati multi-season', 'roadmap V526');
assertIncludes('docs/MULTI_SEASON_DATA_ADAPTER_V526.md', 'Adapter dati multi-season', 'doc V526');

if (errors.length) {
  console.error('Audit V526 fallito:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Audit V526 superato: adapter multi-season attivo, asset comuni preservati e runtime whole-site a ?v=526.');
