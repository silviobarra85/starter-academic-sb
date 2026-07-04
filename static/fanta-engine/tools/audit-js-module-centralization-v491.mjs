#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
let ok = 0;
let fail = 0;
const failures = [];

const safeModules = [
  'assets/js/calciomercato/calciomercato-images-v334.js',
  'assets/js/calciomercato/calciomercato-players-v340.js',
  'assets/js/core/constants.js',
  'assets/js/core/dom.js',
  'assets/js/core/utils.js',
  'assets/js/domain/entities.js',
  'assets/js/domain/labels.js',
  'assets/js/domain/news.js',
  'assets/js/market/transfer-market.js',
  'assets/js/mobile/mobile-rosters.js',
  'assets/js/mobile/mobile-tables.js',
  'assets/js/refactor/public-admin-render-orchestrator-v221.js',
];

const runtimePrimary = safeModules.filter((item) => item !== 'assets/js/calciomercato/calciomercato-players-v340.js');

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), 'utf8');
}

function exists(filePath) {
  return fs.existsSync(path.join(root, filePath));
}

function sha(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(root, filePath))).digest('hex');
}

function readJson(filePath) {
  return JSON.parse(read(filePath));
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

check(exists('fanta-engine/data/shared-js-modules-v491.json'), 'manifest moduli JS V491 presente');
const manifest = readJson('fanta-engine/data/shared-js-modules-v491.json');
check(manifest.version === 'V491', 'manifest versione V491');
check(manifest.summary.centralizedModules === safeModules.length, 'manifest conta moduli centralizzati');
check(manifest.summary.runtimePrimaryImports === runtimePrimary.length, 'manifest conta import runtime primari');

for (const rel of safeModules) {
  const enginePath = `fanta-engine/js/shared/v491/${rel}`;
  const zonaPath = `zonaorientale/${rel}`;
  const fmmPath = `fantapetillomantramanager/${rel}`;
  check(exists(enginePath), `modulo centrale esiste: ${rel}`);
  check(exists(zonaPath), `copia locale ZonaOrientale mantenuta: ${rel}`);
  check(exists(fmmPath), `copia locale FantaMantraManager mantenuta: ${rel}`);
  check(sha(enginePath) === sha(zonaPath), `modulo centrale identico a ZonaOrientale: ${rel}`);
  check(sha(enginePath) === sha(fmmPath), `modulo centrale identico a FantaMantraManager: ${rel}`);
  const text = read(enginePath);
  check(!/^\s*import\s/m.test(text), `modulo centrale senza import statici: ${rel}`);
  check(!/(service_ttjf7js|EMAILJS|emailjs|firebase|onAuthStateChanged|Firestore)/i.test(text), `modulo centrale senza Firebase/EmailJS: ${rel}`);
}

const appTargets = [
  ['zonaorientale/assets/app.js', '../../'],
  ['fantapetillomantramanager/assets/app.js', '../../'],
  ['zonaorientale/static/assets/app.js', '../../../'],
];
for (const [appPath, prefix] of appTargets) {
  const text = read(appPath);
  check(text.includes('FantaEngineJsModuleCentralizationV491'), `${appPath} espone marker V491`);
  for (const rel of runtimePrimary) {
    const expected = `${prefix}fanta-engine/js/shared/v491/${rel}?v=491`;
    check(text.includes(expected), `${appPath} importa dal motore: ${rel}`);
  }
}

for (const cfgPath of [
  'zonaorientale/assets/league-config.json',
  'zonaorientale/static/assets/league-config.json',
  'fantapetillomantramanager/assets/league-config.json',
]) {
  const cfg = readJson(cfgPath);
  check(cfg.currentVersion === 491, `${cfgPath} currentVersion V491`);
  check(cfg.features?.sharedJsModulesCentralized === true, `${cfgPath} flag sharedJsModulesCentralized`);
  check(cfg.guardrails?.doNotDeleteLeagueLocalJsCopiesYet === true, `${cfgPath} guardrail copie JS locali`);
}

for (const jsPath of [
  'zonaorientale/assets/js/core/league-config-v443.js',
  'zonaorientale/static/assets/js/core/league-config-v443.js',
  'fantapetillomantramanager/assets/js/core/league-config-v443.js',
]) {
  const text = read(jsPath);
  check(text.includes("league-config.json?v=491"), `${jsPath} carica config V491`);
  check(text.includes("version: 'V491'"), `${jsPath} runtime V491`);
}

for (const file of ['zonaorientale/index.html', 'zonaorientale/competition.html', 'zonaorientale/player.html', 'zonaorientale/static/index.html', 'zonaorientale/static/competition.html', 'zonaorientale/static/player.html']) {
  const text = read(file);
  check(text.includes('ZonaOrientale Salerno · V491 · Ultimo aggiornamento 24/06/2026'), `footer V491 ZonaOrientale in ${file}`);
  check(text.includes('?v=491'), `cache-buster V491 in ${file}`);
}

for (const file of ['fantapetillomantramanager/index.html', 'fantapetillomantramanager/competition.html', 'fantapetillomantramanager/player.html']) {
  const text = read(file);
  check(text.includes('FantaMantraManager · V491 · Ultimo aggiornamento 24/06/2026'), `footer V491 FantaMantraManager in ${file}`);
  check(text.includes('?v=491'), `cache-buster V491 in ${file}`);
}

if (fail > 0) {
  console.error(`\nAudit centralizzazione moduli JS V491 fallito: ${ok} OK, ${fail} FAIL`);
  process.exit(1);
}
console.log(`\nAudit centralizzazione moduli JS V491: ${ok} OK, ${fail} FAIL`);
