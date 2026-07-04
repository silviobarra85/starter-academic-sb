#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const VERSION = 484;
const root = process.cwd().endsWith('/static') ? process.cwd() : path.resolve(process.cwd());
const engineRoot = path.join(root, 'fanta-engine');
const inventoryPath = path.join(engineRoot, 'data', 'shared-assets-inventory-v484.json');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const candidateRoots = [
  'assets/listoni',
  'assets/calciomercato',
  'assets/js/calciomercato',
  'assets/js/admin/listone-converter.js',
  'assets/js/domain/listone.js',
  'assets/css/refactor/listone.css',
  'assets/css/refactor/calciomercato.css'
];

const results = [];
function ok(label, details = '') { results.push({ ok: true, label, details }); }
function fail(label, details = '') { results.push({ ok: false, label, details }); }
function sha256(filePath) { return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex'); }
function collectFiles(baseDir, rel) {
  const full = path.join(baseDir, rel);
  if (!fs.existsSync(full)) return [];
  const stat = fs.statSync(full);
  if (stat.isFile()) return [rel];
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullEntry = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullEntry);
      if (entry.isFile()) out.push(path.relative(baseDir, fullEntry).replace(/\\/g, '/'));
    }
  };
  walk(full);
  return out;
}

if (!fs.existsSync(inventoryPath)) {
  fail('Inventario V484 presente', `Manca ${inventoryPath}`);
} else {
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
  if (inventory.version === VERSION) ok('Inventario versione V484'); else fail('Inventario versione V484', `version=${inventory.version}`);
  if (inventory.scope && inventory.scope.includes('no runtime paths')) ok('Inventario osservativo, non runtime'); else fail('Inventario osservativo, non runtime');
  if (inventory.totals?.candidateFiles === 42) ok('Inventario registra 42 file candidati'); else fail('Inventario registra 42 file candidati', JSON.stringify(inventory.totals));
  if (inventory.totals?.identicalFiles === 42) ok('Inventario registra 42 file identici'); else fail('Inventario registra 42 file identici', JSON.stringify(inventory.totals));
  if (inventory.recommendation?.doNotDeleteLeagueLocalCopiesYet === true) ok('Guardrail: non cancellare copie locali'); else fail('Guardrail: non cancellare copie locali');
}

for (const lg of leagues) {
  const baseDir = path.join(root, lg);
  if (fs.existsSync(baseDir)) ok(`Cartella lega presente: ${lg}`); else fail(`Cartella lega presente: ${lg}`);
  for (const rel of candidateRoots) {
    const full = path.join(baseDir, rel);
    if (fs.existsSync(full)) ok(`${lg}: candidato presente ${rel}`); else fail(`${lg}: candidato presente ${rel}`);
  }
}

const relPaths = new Set();
for (const rel of candidateRoots) {
  for (const lg of leagues) {
    collectFiles(path.join(root, lg), rel).forEach((p) => relPaths.add(p));
  }
}

let identical = 0;
let different = 0;
for (const rel of [...relPaths].sort()) {
  const paths = leagues.map((lg) => path.join(root, lg, rel));
  const missing = paths.filter((p) => !fs.existsSync(p));
  if (missing.length) {
    fail(`File condiviso presente in entrambe le leghe: ${rel}`, missing.join(', '));
    different += 1;
    continue;
  }
  const hashes = paths.map((p) => sha256(p));
  if (new Set(hashes).size === 1) {
    identical += 1;
  } else {
    different += 1;
    fail(`Hash diverso per candidato comune: ${rel}`, hashes.join(' vs '));
  }
}

if (identical === 42) ok('Tutti i 42 candidati sono identici tra le due leghe'); else fail('Tutti i 42 candidati sono identici tra le due leghe', `identical=${identical}, different=${different}`);
if (different === 0) ok('Nessun candidato listone/calciomercato differisce'); else fail('Nessun candidato listone/calciomercato differisce', `different=${different}`);

const forbiddenCentralPaths = [
  path.join(root, 'fanta-engine', 'data', 'listoni'),
  path.join(root, 'fanta-engine', 'data', 'calciomercato')
];
for (const p of forbiddenCentralPaths) {
  if (!fs.existsSync(p)) ok(`Nessuno spostamento runtime in ${path.relative(root, p)}`); else fail(`Nessuno spostamento runtime in ${path.relative(root, p)}`, 'La V484 deve essere solo inventario.');
}

for (const lg of leagues) {
  const cfgPath = path.join(root, lg, 'assets', 'league-config.json');
  const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  if (cfg.currentVersion === VERSION) ok(`${lg}: currentVersion V484`); else fail(`${lg}: currentVersion V484`, `currentVersion=${cfg.currentVersion}`);
  if (cfg.features?.sharedAssetsInventory === true) ok(`${lg}: feature sharedAssetsInventory attiva`); else fail(`${lg}: feature sharedAssetsInventory attiva`);
  if (cfg.guardrails?.sharedAssetsInventoryOnly === true) ok(`${lg}: guardrail inventory-only attivo`); else fail(`${lg}: guardrail inventory-only attivo`);
}

for (const result of results) {
  const prefix = result.ok ? 'OK' : 'FAIL';
  console.log(`${prefix} - ${result.label}${result.details ? ` :: ${result.details}` : ''}`);
}
const failures = results.filter((r) => !r.ok).length;
console.log(`Audit shared assets inventory V484: ${results.length - failures} OK, ${failures} FAIL`);
if (failures > 0) process.exit(1);
