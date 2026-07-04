#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let ok = 0;
let fail = 0;
const failures = [];

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), 'utf8');
}
function readJson(filePath) {
  return JSON.parse(read(filePath));
}
function exists(filePath) {
  return fs.existsSync(path.join(root, filePath));
}
function check(condition, label) {
  if (condition) {
    ok += 1;
    console.log(`OK  - ${label}`);
  } else {
    fail += 1;
    failures.push(label);
    console.error(`FAIL - ${label}`);
  }
}

const enginePath = 'fanta-engine/js/core/data-paths-v490.js';
check(exists(enginePath), 'adapter data-path V490 presente nel motore comune');
const engine = read(enginePath);
check(engine.includes('resolveLeagueDataPathV490'), 'adapter espone resolveLeagueDataPathV490');
check(engine.includes('joinLeagueDataPathV490'), 'adapter espone joinLeagueDataPathV490');
check(engine.includes('fetchJsonWithFallbackV490'), 'adapter espone fetchJsonWithFallbackV490');
check(engine.includes('touchesFirebase: false'), 'adapter dichiara che non tocca Firebase');
check(engine.includes('touchesEmailJs: false'), 'adapter dichiara che non tocca EmailJS');

for (const svc of [
  'zonaorientale/assets/js/data/static-files-service.js',
  'zonaorientale/static/assets/js/data/static-files-service.js',
  'fantapetillomantramanager/assets/js/data/static-files-service.js'
]) {
  const text = read(svc);
  check(text.includes('DATA_PATH_ENGINE_CANDIDATES_V490'), `${svc} carica candidato motore data-path`);
  check(text.includes('data-paths-v490.js'), `${svc} punta al data-path adapter V490`);
  check(text.includes('league-config-v443.js?v=490'), `${svc} importa league-config cache-buster V490`);
  check(text.includes('fetchJsonWithLocalFallbackV490'), `${svc} usa fetch JSON con fallback V490`);
  check(text.includes('resolveLeagueDataPathV490'), `${svc} usa resolveLeagueDataPathV490`);
  check(text.includes('joinLeagueDataPathV490'), `${svc} usa joinLeagueDataPathV490`);
  check(text.includes('../fanta-engine/data/shared-assets/v485/assets/listoni/manifest.json'), `${svc} mantiene primary centralizzato listoni V485`);
  check(text.includes('./assets/listoni/manifest.json'), `${svc} mantiene fallback locale listoni`);
  check(text.includes("'./assets/rose/manifest.json'"), `${svc} rose restano lega-specifiche locali`);
  check(text.includes("'./assets/competitions/manifest.json'"), `${svc} competizioni restano lega-specifiche locali`);
}

for (const cfgPath of [
  'zonaorientale/assets/league-config.json',
  'zonaorientale/static/assets/league-config.json',
  'fantapetillomantramanager/assets/league-config.json'
]) {
  const cfg = readJson(cfgPath);
  check(cfg.currentVersion === 490, `${cfgPath} currentVersion V490`);
  check(cfg.features.commonDataPathAdapter === true, `${cfgPath} feature adapter data-path attiva`);
  check(cfg.guardrails.commonDataPathAdapterWithLocalFallback === true, `${cfgPath} fallback locale adapter dichiarato`);
  check(cfg.guardrails.doNotDeleteLeagueLocalDataCopiesYet === true, `${cfgPath} copie dati locali non cancellate`);
  check(cfg.guardrails.doNotCentralizeFirebaseOrEmailJs === true, `${cfgPath} Firebase/EmailJS non centralizzati`);
  check(cfg.dataPaths.listoniManifest.includes('fanta-engine/data/shared-assets/v485/'), `${cfgPath} listoni primary centralizzato preservato`);
  check(cfg.dataPaths.listoniManifestFallback === './assets/listoni/manifest.json', `${cfgPath} listoni fallback locale preservato`);
  check(cfg.dataPaths.rostersManifest === './assets/rose/manifest.json', `${cfgPath} rose restano locali`);
  check(cfg.dataPaths.competitionsManifest === './assets/competitions/manifest.json', `${cfgPath} competizioni restano locali`);
}

for (const jsPath of [
  'zonaorientale/assets/js/core/league-config-v443.js',
  'zonaorientale/static/assets/js/core/league-config-v443.js',
  'fantapetillomantramanager/assets/js/core/league-config-v443.js'
]) {
  const text = read(jsPath);
  check(text.includes("league-config.json?v=490"), `${jsPath} carica config con cache-buster V490`);
  check(text.includes("version: 'V490'"), `${jsPath} pubblica runtime V490`);
  check(text.includes('commonDataPathAdapterReady: true'), `${jsPath} dichiara adapter data-path pronto`);
}

for (const file of ['zonaorientale/index.html', 'zonaorientale/competition.html', 'zonaorientale/player.html', 'zonaorientale/static/index.html', 'zonaorientale/static/competition.html', 'zonaorientale/static/player.html']) {
  const text = read(file);
  check(text.includes('ZonaOrientale Salerno · V490 · Ultimo aggiornamento 24/06/2026'), `footer V490 ZonaOrientale in ${file}`);
  check(text.includes('?v=490'), `cache-buster V490 presente in ${file}`);
}
for (const file of ['fantapetillomantramanager/index.html', 'fantapetillomantramanager/competition.html', 'fantapetillomantramanager/player.html']) {
  const text = read(file);
  check(text.includes('FantaMantraManager · V490 · Ultimo aggiornamento 24/06/2026'), `footer V490 FantaMantraManager in ${file}`);
  check(text.includes('?v=490'), `cache-buster V490 presente in ${file}`);
}
for (const file of ['fantapetillomantramanager/bilanci.html', 'fantapetillomantramanager/news.html']) {
  const text = read(file);
  check(text.includes('?v=490'), `cache-buster V490 presente in ${file}`);
  check(!text.includes('V489'), `nessun footer/cache stale V489 in ${file}`);
}

check(exists('fanta-engine/data/shared-assets/v485/assets/listoni/manifest.json'), 'asset centralizzati listoni V485 ancora presenti');
check(exists('fanta-engine/data/shared-assets/v485/assets/calciomercato/archive/manifest.json'), 'asset centralizzati calciomercato V485 ancora presenti');
check(exists('zonaorientale/assets/listoni/manifest.json'), 'fallback listoni ZonaOrientale ancora presente');
check(exists('fantapetillomantramanager/assets/listoni/manifest.json'), 'fallback listoni FantaMantraManager ancora presente');

if (fail > 0) {
  console.error(`\nAudit data-path adapter V490 fallito: ${ok} OK, ${fail} FAIL`);
  for (const item of failures) console.error(` - ${item}`);
  process.exit(1);
}
console.log(`\nAudit data-path adapter V490: ${ok} OK, ${fail} FAIL`);
