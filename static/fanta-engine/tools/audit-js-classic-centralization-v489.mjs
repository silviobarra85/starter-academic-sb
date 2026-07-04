#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

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
function hash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(root, filePath))).digest('hex');
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

const manifestPath = 'fanta-engine/data/shared-js-classic-assets-v489.json';
check(exists(manifestPath), 'manifest JS classici V489 presente');
const manifest = readJson(manifestPath);
check(manifest.version === 'V489', 'manifest versione V489');
check(manifest.centralizedFiles.length === 3, 'tre script classici centralizzati');
check(manifest.policy.preserveLocalCopies === true, 'policy preserva copie locali');
check(manifest.policy.doNotCentralizeModulesYet === true, 'policy non centralizza moduli ES');

for (const item of manifest.centralizedFiles) {
  check(exists(item.centralPath), `script centrale presente ${item.path}`);
  check(hash(item.centralPath) === item.sha256, `hash centrale coerente ${item.path}`);
  for (const leagueRoot of ['zonaorientale', 'fantapetillomantramanager', 'zonaorientale/static']) {
    const localPath = `${leagueRoot}/${item.path}`;
    check(exists(localPath), `fallback locale preservato ${localPath}`);
    check(hash(localPath) === item.sha256, `fallback locale identico ${localPath}`);
  }
}

const zonaConfig = readJson('zonaorientale/assets/league-config.json');
const zonaNestedConfig = readJson('zonaorientale/static/assets/league-config.json');
const fmmConfig = readJson('fantapetillomantramanager/assets/league-config.json');
check(zonaConfig.currentVersion === 489, 'ZonaOrientale currentVersion V489');
check(zonaNestedConfig.currentVersion === 489, 'ZonaOrientale annidato currentVersion V489');
check(fmmConfig.currentVersion === 489, 'FantaMantraManager currentVersion V489');
check(zonaConfig.features.sharedJsClassicCentralized === true, 'feature JS classici centralizzati ZonaOrientale');
check(fmmConfig.features.sharedJsClassicCentralized === true, 'feature JS classici centralizzati FantaMantraManager');
check(zonaConfig.guardrails.sharedJsClassicCentralizedWithFallback === true, 'fallback JS classici ZonaOrientale dichiarato');
check(fmmConfig.guardrails.sharedJsClassicCentralizedWithFallback === true, 'fallback JS classici FantaMantraManager dichiarato');
check(zonaConfig.guardrails.doNotDeleteLeagueLocalJsCopiesYet === true, 'copie locali JS ZonaOrientale non cancellate');
check(fmmConfig.guardrails.doNotDeleteLeagueLocalJsCopiesYet === true, 'copie locali JS FantaMantraManager non cancellate');

const runtimeNeedleTop = '../fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js?v=489';
const runtimeNeedleNested = '../../fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js?v=489';
const fallbackNeedle = 'data-local-fallback="./assets/js/core/admin-card-visibility-v456.js?v=489"';
const zonaIndex = read('zonaorientale/index.html');
const zonaNestedIndex = read('zonaorientale/static/index.html');
const fmmIndex = read('fantapetillomantramanager/index.html');
check(zonaIndex.includes(runtimeNeedleTop), 'ZonaOrientale index carica JS classico da fanta-engine');
check(fmmIndex.includes(runtimeNeedleTop), 'FantaMantraManager index carica JS classico da fanta-engine');
check(zonaNestedIndex.includes(runtimeNeedleNested), 'ZonaOrientale annidato carica JS classico da fanta-engine');
check(zonaIndex.includes(fallbackNeedle), 'ZonaOrientale fallback locale JS presente');
check(fmmIndex.includes(fallbackNeedle), 'FantaMantraManager fallback locale JS presente');
check(zonaNestedIndex.includes(fallbackNeedle), 'ZonaOrientale annidato fallback locale JS presente');
check(zonaIndex.includes('data-engine-js-v489="true"'), 'ZonaOrientale marker engine JS V489 presente');
check(fmmIndex.includes('data-engine-js-v489="true"'), 'FantaMantraManager marker engine JS V489 presente');
check(zonaNestedIndex.includes('data-engine-js-v489="true"'), 'ZonaOrientale annidato marker engine JS V489 presente');
check(!zonaIndex.includes('./assets/js/core/admin-card-visibility-v456.js?v=489" defer></script>'), 'ZonaOrientale non usa piu script locale diretto');
check(!fmmIndex.includes('./assets/js/core/admin-card-visibility-v456.js?v=489" defer></script>'), 'FantaMantraManager non usa piu script locale diretto');

for (const file of ['zonaorientale/index.html', 'zonaorientale/competition.html', 'zonaorientale/player.html', 'zonaorientale/static/index.html', 'zonaorientale/static/competition.html', 'zonaorientale/static/player.html']) {
  check(read(file).includes('ZonaOrientale Salerno · V489 · Ultimo aggiornamento 24/06/2026'), `footer V489 ZonaOrientale in ${file}`);
}
for (const file of ['fantapetillomantramanager/index.html', 'fantapetillomantramanager/competition.html', 'fantapetillomantramanager/player.html']) {
  check(read(file).includes('FantaMantraManager · V489 · Ultimo aggiornamento 24/06/2026'), `footer V489 FantaMantraManager in ${file}`);
}

if (fail > 0) {
  console.error(`\nAudit JS classici V489 fallito: ${ok} OK, ${fail} FAIL`);
  for (const item of failures) console.error(` - ${item}`);
  process.exit(1);
}
console.log(`\nAudit JS classici V489: ${ok} OK, ${fail} FAIL`);
