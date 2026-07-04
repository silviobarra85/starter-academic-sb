#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
let ok = 0;
let fail = 0;
const failures = [];

function read(filePath) { return fs.readFileSync(path.join(root, filePath), 'utf8'); }
function readJson(filePath) { return JSON.parse(read(filePath)); }
function exists(filePath) { return fs.existsSync(path.join(root, filePath)); }
function sha256(filePath) { return crypto.createHash('sha256').update(fs.readFileSync(path.join(root, filePath))).digest('hex'); }
function check(condition, label) {
  if (condition) { ok += 1; console.log(`OK  - ${label}`); }
  else { fail += 1; failures.push(label); console.error(`FAIL - ${label}`); }
}

const manifestPath = 'fanta-engine/data/shared-css-assets-v487.json';
check(exists(manifestPath), 'manifest CSS condivisi V487 presente');
const manifest = readJson(manifestPath);
check(manifest.version === 'V487', 'manifest marcato V487');
check(manifest.summary.centralizedCssFiles === 22, '22 CSS comuni centralizzati');
check(manifest.policy.localFallbackPreserved === true, 'fallback locale dichiarato');
check(manifest.policy.localCopiesDeleted === false, 'copie locali non cancellate');
check(manifest.policy.jsRuntimeMoved === false, 'JS runtime non spostati in V487');

for (const item of manifest.items) {
  const central = item.centralPath;
  check(exists(central), `CSS centrale presente: ${central}`);
  check(sha256(central) === item.sha256, `hash CSS centrale corretto: ${item.path}`);
  for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
    const local = `${league}/${item.path}`;
    check(exists(local), `fallback locale preservato: ${local}`);
    check(sha256(local) === item.sha256, `fallback locale identico al centrale: ${local}`);
  }
  const nested = `zonaorientale/static/${item.path}`;
  if (exists(nested)) {
    check(sha256(nested) === item.sha256, `fallback annidato ZonaOrientale identico: ${nested}`);
  }
}

const topPages = [
  'zonaorientale/index.html',
  'zonaorientale/competition.html',
  'zonaorientale/player.html',
  'fantapetillomantramanager/index.html',
  'fantapetillomantramanager/competition.html',
  'fantapetillomantramanager/player.html'
];
const nestedPages = [
  'zonaorientale/static/index.html',
  'zonaorientale/static/competition.html',
  'zonaorientale/static/player.html'
].filter(exists);
for (const page of topPages) {
  const text = read(page);
  check(text.includes('data-engine-css-v487="true"'), `link CSS centrale presente in ${page}`);
  check(text.includes('data-local-fallback="./assets/'), `fallback locale linkato in ${page}`);
  check(text.includes('../fanta-engine/css/shared/v487/'), `path CSS motore comune relativo corretto in ${page}`);
  check(!text.includes('?v=486'), `cache-buster V486 assente in ${page}`);
}
for (const page of nestedPages) {
  const text = read(page);
  check(text.includes('data-engine-css-v487="true"'), `link CSS centrale presente in ${page}`);
  check(text.includes('data-local-fallback="./assets/'), `fallback locale linkato in ${page}`);
  check(text.includes('../../fanta-engine/css/shared/v487/'), `path CSS motore comune annidato corretto in ${page}`);
  check(!text.includes('?v=486'), `cache-buster V486 assente in ${page}`);
}

for (const cfgPath of ['zonaorientale/assets/league-config.json', 'zonaorientale/static/assets/league-config.json', 'fantapetillomantramanager/assets/league-config.json']) {
  const cfg = readJson(cfgPath);
  check(cfg.currentVersion === 487, `currentVersion 487 in ${cfgPath}`);
  check(cfg.version === 487, `version 487 in ${cfgPath}`);
  check(cfg.branding?.footerVersion === 487, `footerVersion 487 in ${cfgPath}`);
  check(cfg.features?.sharedCssCentralized === true, `feature sharedCssCentralized attiva in ${cfgPath}`);
  check(cfg.runtime?.sharedCssMode === 'central-css-with-local-fallback', `runtime sharedCssMode corretto in ${cfgPath}`);
}

check(read('zonaorientale/index.html').includes('ZonaOrientale Salerno · V487 · Ultimo aggiornamento 24/06/2026'), 'footer ZonaOrientale V487 in home');
check(read('fantapetillomantramanager/index.html').includes('FantaMantraManager · V487 · Ultimo aggiornamento 24/06/2026'), 'footer FantaMantraManager V487 in home');

if (fail > 0) {
  console.error(`\nAudit CSS centralization V487 fallito: ${ok} OK, ${fail} FAIL`);
  for (const item of failures) console.error(` - ${item}`);
  process.exit(1);
}
console.log(`\nAudit CSS centralization V487: ${ok} OK, ${fail} FAIL`);
