#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let ok = 0;
let fail = 0;
const failures = [];
function read(filePath) { return fs.readFileSync(path.join(root, filePath), 'utf8'); }
function readJson(filePath) { return JSON.parse(read(filePath)); }
function exists(filePath) { return fs.existsSync(path.join(root, filePath)); }
function check(condition, label) {
  if (condition) { ok += 1; console.log(`OK  - ${label}`); }
  else { fail += 1; failures.push(label); console.error(`FAIL - ${label}`); }
}
const manifestPath = 'fanta-engine/data/shared-js-dependency-inventory-v488.json';
check(exists(manifestPath), 'manifest inventario dipendenze JS V488 presente');
const manifest = readJson(manifestPath);
check(manifest.version === 'V488', 'manifest versione V488');
check(manifest.policy?.noRuntimePathChange === true, 'policy no runtime path change attiva');
check(manifest.policy?.noLocalCopyDeletion === true, 'policy no local copy deletion attiva');
check(manifest.policy?.noJsCentralizationYet === true, 'policy no JS centralization yet attiva');
check(manifest.summary?.identicalJsCandidates === 38, '38 JS comuni identici censiti');
check(manifest.summary?.moduleLikeCandidates > 0, 'moduli ES rilevati');
check(manifest.summary?.classicCandidates > 0, 'script classici rilevati');
check(manifest.summary?.withStaticImports > 0, 'import statici rilevati');
check(manifest.summary?.withLeagueConfigDependency >= 1, 'dipendenze league-config rilevate');
check(manifest.summary?.recommendations?.['candidate-central-classic-with-fallback'] >= 1, 'candidati classic centralizzabili censiti');
check(Array.isArray(manifest.records) && manifest.records.length === 38, 'records JS completi');
const paths = new Set(manifest.records.map((item) => item.path));
check(paths.has('assets/js/data/static-files-service.js'), 'static-files-service censito');
check(paths.has('assets/js/sections/matchday-draw-tool-v473.js'), 'matchday draw tool censito');
check(paths.has('assets/js/domain/listone.js'), 'domain listone censito');
check(paths.has('assets/js/calciomercato/calciomercato-players-v359.js'), 'calciomercato players V359 censito');
const staticService = manifest.records.find((item) => item.path === 'assets/js/data/static-files-service.js');
check(staticService?.centralizationRecommendation === 'keep-local-until-config-adapter', 'static-files-service resta locale fino ad adapter config');
const moduleWithImports = manifest.records.filter((item) => item.flags?.hasStaticImports);
check(moduleWithImports.every((item) => Array.isArray(item.imports)), 'moduli con import hanno dettagli imports');
const classicCandidates = manifest.records.filter((item) => item.centralizationRecommendation === 'candidate-central-classic-with-fallback');
check(classicCandidates.length >= 1, 'almeno un candidato classic con fallback');

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const config = readJson(`${league}/assets/league-config.json`);
  check(config.currentVersion === 488, `${league} currentVersion V488`);
  check(config.version === 488, `${league} version V488`);
  check(config.ui?.footerVersion === 488, `${league} footerVersion V488`);
  check(config.runtime?.sharedRuntimeJsInventoryVersion === '488', `${league} runtime sharedRuntimeJsInventoryVersion 488`);
  check(config.runtime?.sharedRuntimeJsMode === 'local-copies-preserved', `${league} JS runtime ancora locale`);
}
const nested = readJson('zonaorientale/static/assets/league-config.json');
check(nested.currentVersion === 488, 'zonaorientale nested currentVersion V488');
check(nested.ui?.footerVersion === 488, 'zonaorientale nested footerVersion V488');

const htmlFiles = [
  'zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html',
  'zonaorientale/static/index.html','zonaorientale/static/competition.html','zonaorientale/static/player.html',
  'fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html'
];
for (const file of htmlFiles) {
  const text = read(file);
  check(text.includes('v=488'), `${file} usa cache-buster V488`);
  check(!text.includes('../fanta-engine/js/shared/v488'), `${file} non punta a JS centrale V488`);
}
if (fail > 0) {
  console.error(`\nAudit JS dependency inventory V488 fallito: ${ok} OK, ${fail} FAIL`);
  for (const item of failures) console.error(` - ${item}`);
  process.exit(1);
}
console.log(`\nAudit JS dependency inventory V488: ${ok} OK, ${fail} FAIL`);
