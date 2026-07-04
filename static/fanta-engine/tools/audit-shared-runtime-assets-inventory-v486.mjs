#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd().endsWith('/static') ? process.cwd() : path.join(process.cwd(), 'static');
const inventoryPath = path.join(root, 'fanta-engine/data/shared-runtime-assets-inventory-v486.json');
const zoRoot = path.join(root, 'zonaorientale');
const fmmRoot = path.join(root, 'fantapetillomantramanager');
let ok = 0;
let fail = 0;
function check(condition, message) {
  if (condition) {
    ok += 1;
    console.log(`OK  ${message}`);
  } else {
    fail += 1;
    console.error(`FAIL ${message}`);
  }
}
function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}
check(fs.existsSync(inventoryPath), 'inventario runtime V486 presente');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
check(inventory.version === 'V486', 'versione inventario V486');
check(inventory.policy?.noRuntimePathChange === true, 'inventario non cambia path runtime');
check(inventory.policy?.noLocalCopyDeletion === true, 'inventario non cancella copie locali');
check(inventory.summary?.identicalCommonPaths === 60, '60 asset JS/CSS comuni identici censiti');
check(inventory.summary?.differentCommonPaths === 29, '29 asset comuni ma divergenti esclusi dalla centralizzazione automatica');
check(inventory.summary?.onlyFantaMantraManager === 10, '10 asset esclusivi FantaMantraManager riconosciuti');
check(Array.isArray(inventory.identicalCandidates), 'lista candidati identici presente');
check(inventory.identicalCandidates.length === inventory.summary.identicalCommonPaths, 'numero candidati coerente con summary');
const requiredCandidates = [
  'assets/css/refactor/listone.css',
  'assets/css/refactor/calciomercato.css',
  'assets/js/domain/listone.js',
  'assets/js/calciomercato/calciomercato-render-v338.js',
  'assets/js/sections/matchday-draw-tool-v473.js',
  'assets/js/core/constants.js'
];
for (const rel of requiredCandidates) {
  const candidate = inventory.identicalCandidates.find((entry) => entry.path === rel);
  check(Boolean(candidate), `${rel} censito come candidato identico`);
  if (candidate) {
    const zoFile = path.join(zoRoot, rel);
    const fmmFile = path.join(fmmRoot, rel);
    check(fs.existsSync(zoFile), `${rel} presente in ZonaOrientale`);
    check(fs.existsSync(fmmFile), `${rel} presente in FantaMantraManager`);
    check(sha256(zoFile) === candidate.sha256, `${rel} hash ZonaOrientale coerente`);
    check(sha256(fmmFile) === candidate.sha256, `${rel} hash FantaMantraManager coerente`);
  }
}
for (const rel of inventory.differentSharedPaths.map((entry) => entry.path)) {
  check(!inventory.identicalCandidates.some((entry) => entry.path === rel), `${rel} non incluso nei candidati identici`);
}
const mustRemainLeagueSpecific = [
  'assets/app.js',
  'assets/emailjs.js',
  'assets/firebase.js',
  'assets/js/core/league-config-v443.js',
  'assets/js/core/section-registry-v405.js',
  'assets/styles.css'
];
for (const rel of mustRemainLeagueSpecific) {
  check(inventory.differentSharedPaths.some((entry) => entry.path === rel), `${rel} marcato come divergente/lega-specifico`);
}
console.log(`Audit shared runtime assets inventory V486: ${ok} OK, ${fail} FAIL`);
if (fail > 0) process.exit(1);
