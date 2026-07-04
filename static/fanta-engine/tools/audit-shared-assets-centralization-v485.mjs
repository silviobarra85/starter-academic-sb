#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const VERSION = 485;
const root = process.cwd().endsWith('/static') ? process.cwd() : path.resolve(process.cwd());
const centralRoot = path.join(root, 'fanta-engine', 'data', 'shared-assets', 'v485');
const manifestPath = path.join(root, 'fanta-engine', 'data', 'shared-assets-centralization-v485.json');
const inventoryPath = path.join(root, 'fanta-engine', 'data', 'shared-assets-inventory-v484.json');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const results = [];

function ok(label, details = '') { results.push({ ok: true, label, details }); }
function fail(label, details = '') { results.push({ ok: false, label, details }); }
function exists(p) { return fs.existsSync(p); }
function read(filePath) { return fs.readFileSync(filePath, 'utf8'); }
function readJson(filePath) { return JSON.parse(read(filePath)); }
function sha256(filePath) { return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex'); }
function check(condition, label, details = '') { condition ? ok(label, details) : fail(label, details); }

check(exists(centralRoot), 'root centrale shared-assets/v485 presente');
check(exists(manifestPath), 'manifest centralizzazione V485 presente');
check(exists(inventoryPath), 'inventario V484 sorgente presente');

const manifest = exists(manifestPath) ? readJson(manifestPath) : { files: [] };
const inventory = exists(inventoryPath) ? readJson(inventoryPath) : { files: [] };
check(manifest.version === VERSION, 'manifest V485 ha versione corretta', `version=${manifest.version}`);
check(manifest.guardrails?.localCopiesPreserved === true, 'guardrail manifest: copie locali preservate');
check(manifest.guardrails?.deleteLeagueLocalCopies === false, 'guardrail manifest: non cancellare copie locali');
check(manifest.totals?.files === 42, 'manifest V485 registra 42 file centrali', JSON.stringify(manifest.totals || {}));
check(Array.isArray(inventory.files) && inventory.files.length === 42, 'inventario V484 contiene 42 file sorgente');

let centralOk = 0;
let localOk = 0;
for (const item of manifest.files || []) {
  const central = path.join(root, item.centralPath);
  if (!exists(central)) {
    fail(`file centrale presente: ${item.centralPath}`);
    continue;
  }
  const hash = sha256(central);
  check(hash === item.sha256, `hash centrale coerente: ${item.path}`);
  centralOk += 1;
  for (const lg of leagues) {
    const local = path.join(root, lg, item.path);
    if (!exists(local)) {
      fail(`${lg}: copia locale preservata ${item.path}`);
      continue;
    }
    const same = sha256(local) === hash;
    check(same, `${lg}: copia locale identica al centrale ${item.path}`);
    if (same) localOk += 1;
  }
}
check(centralOk === 42, 'tutti i 42 file centrali sono presenti');
check(localOk === 84, 'tutte le 84 copie locali sono preservate e identiche');

for (const lg of leagues) {
  const cfgPath = path.join(root, lg, 'assets', 'league-config.json');
  const cfg = readJson(cfgPath);
  check(cfg.currentVersion === VERSION, `${lg}: currentVersion V485`, `currentVersion=${cfg.currentVersion}`);
  check(cfg.features?.sharedAssetsCentralized === true, `${lg}: feature sharedAssetsCentralized attiva`);
  check(cfg.guardrails?.sharedAssetsCentralizedWithFallback === true, `${lg}: guardrail fallback attivo`);
  check(cfg.guardrails?.preserveLeagueLocalListoniCalciomercato === true, `${lg}: guardrail copie locali attivo`);
  check(String(cfg.dataPaths?.listoniManifest || '').includes('../fanta-engine/data/shared-assets/v485/assets/listoni/manifest.json'), `${lg}: listoni manifest punta al centrale`);
  check(String(cfg.dataPaths?.listoniManifestFallback || '') === './assets/listoni/manifest.json', `${lg}: fallback manifest listoni locale`);
  check(String(cfg.dataPaths?.listoniBase || '').includes('../fanta-engine/data/shared-assets/v485/assets/listoni/'), `${lg}: listoni base punta al centrale`);
  check(String(cfg.dataPaths?.listoniBaseFallback || '') === './assets/listoni/', `${lg}: fallback base listoni locale`);
  check(String(cfg.dataPaths?.calciomercatoLinks || '').includes('../fanta-engine/data/shared-assets/v485/assets/calciomercato/links.json'), `${lg}: calciomercato links punta al centrale`);
  check(String(cfg.dataPaths?.calciomercatoLinksFallback || '') === './assets/calciomercato/links.json', `${lg}: fallback calciomercato links locale`);
  check(String(cfg.dataPaths?.calciomercatoArchiveBase || '').includes('../fanta-engine/data/shared-assets/v485/assets/calciomercato/archive/'), `${lg}: archivio calciomercato punta al centrale`);
  check(String(cfg.dataPaths?.calciomercatoArchiveBaseFallback || '') === './assets/calciomercato/archive/', `${lg}: fallback archivio calciomercato locale`);

  const app = read(path.join(root, lg, 'assets', 'app.js'));
  check(app.includes('getCalciomercatoStaticUrlsV485'), `${lg}: app usa candidate URL Calciomercato V485`);
  check(app.includes('fetchCalciomercatoJsonWithFallbackV485'), `${lg}: app usa fallback JSON Calciomercato V485`);
  check(app.includes('getCalciomercatoArchiveDayUrlsV485'), `${lg}: app usa fallback archivio Calciomercato V485`);

  const staticService = read(path.join(root, lg, 'assets', 'js', 'data', 'static-files-service.js'));
  check(staticService.includes('fetchJsonWithLocalFallbackV485'), `${lg}: servizio listoni usa fallback locale V485`);
  check(staticService.includes('listoniManifestFallback'), `${lg}: servizio listoni legge manifest fallback`);
  check(staticService.includes('listoniBaseFallback'), `${lg}: servizio listoni legge base fallback`);
}

const nestedConfigPath = path.join(root, 'zonaorientale', 'static', 'assets', 'league-config.json');
if (exists(nestedConfigPath)) {
  const nested = readJson(nestedConfigPath);
  check(nested.currentVersion === VERSION, 'ZonaOrientale nested static: versione V485');
  check(nested.runtime?.sharedAssetsMode === 'local-copy-for-nested-static', 'ZonaOrientale nested static resta su copie locali');
}

for (const result of results) {
  console.log(`${result.ok ? 'OK' : 'FAIL'} - ${result.label}${result.details ? ` :: ${result.details}` : ''}`);
}
const failures = results.filter((r) => !r.ok).length;
console.log(`Audit shared assets centralization V485: ${results.length - failures} OK, ${failures} FAIL`);
if (failures > 0) process.exit(1);
