#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const siteRoot = path.resolve(scriptDir, '..');
const staticRoot = path.resolve(siteRoot, '..');
const cloneSlug = 'fantapetillomantramanager';
const cloneRoot = path.join(staticRoot, cloneSlug);
const docsRoot = path.resolve(siteRoot, '..', '..', 'docs');
const cloneDocs = path.join(docsRoot, cloneSlug, 'README.md');
let failures = 0;
function ok(message) { if (!quiet) console.log(`OK: ${message}`); }
function fail(message) { failures += 1; console.error(`FAIL: ${message}`); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function readJson(file) { return JSON.parse(read(file)); }
function exists(rel, base = cloneRoot) { return fs.existsSync(path.join(base, rel)); }

try {
  const zonaConfig = readJson(path.join(siteRoot, 'assets', 'league-config.json'));
  if (Number(zonaConfig.currentVersion) >= 447) ok(`ZonaOrientale currentVersion V${zonaConfig.currentVersion}`); else fail('ZonaOrientale currentVersion inferiore a V447');
  if (zonaConfig.guardrails?.cloneSandboxCreated === true) ok('guardrail cloneSandboxCreated presente'); else fail('guardrail cloneSandboxCreated mancante');

  if (fs.existsSync(cloneRoot)) ok('cartella clone presente'); else fail('cartella clone mancante');
  ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'assets/league-config.json', 'assets/firebase.js'].forEach((rel) => {
    if (exists(rel)) ok(`${rel} presente nel clone`); else fail(`${rel} mancante nel clone`);
  });

  const cloneConfig = readJson(path.join(cloneRoot, 'assets', 'league-config.json'));
  if (cloneConfig.leagueId === cloneSlug && cloneConfig.slug === cloneSlug) ok('identity clone corretta'); else fail('identity clone non corretta');
  if (cloneConfig.name === 'FantaPetilloMantraManager') ok('nome clone corretto'); else fail('nome clone non corretto');
  if (Number(cloneConfig.currentVersion) >= 447) ok(`versione clone V${cloneConfig.currentVersion}`); else fail('versione clone inferiore a V447');
  if (cloneConfig.basePath === `/${cloneSlug}/`) ok('basePath clone corretto'); else fail('basePath clone non corretto');
  if (cloneConfig.sandbox?.enabled === true && cloneConfig.sandbox?.firebase === 'disabled') ok('sandbox Firebase disabilitato in config'); else fail('sandbox Firebase non disabilitato in config');
  if (cloneConfig.features?.admin === false && cloneConfig.features?.teamArea === false) ok('feature live rischiose disabilitate in config'); else fail('feature live rischiose non disabilitate');

  const firebaseText = read(path.join(cloneRoot, 'assets', 'firebase.js'));
  if (!firebaseText.includes('zonaorientale-d07af') && !firebaseText.includes('gstatic.com/firebasejs')) ok('Firebase ZonaOrientale non importato nel clone'); else fail('Firebase reale ancora presente nel clone');
  if (firebaseText.includes('Firebase disabled sandbox adapter')) ok('stub Firebase sandbox presente'); else fail('stub Firebase sandbox non riconosciuto');

  const htmlFiles = ['index.html', 'competition.html', 'player.html', 'bilanci.html'];
  for (const file of htmlFiles) {
    const text = read(path.join(cloneRoot, file));
    if (text.includes('FantaPetilloMantraManager')) ok(`${file} branding clone`); else fail(`${file} senza branding clone`);
    const versions = [...new Set((text.match(/\?v=\d+/g) || []).map((item) => item.slice(3)))];
    if (!versions.length && file === 'bilanci.html') ok(`${file} redirect senza asset versionati`);
    else if (versions.length === 1 && Number(versions[0]) >= 447) ok(`${file} cache-buster V${versions[0]}`);
    else fail(`${file} cache-buster non allineati: ${versions.join(',')}`);
  }

  if (exists('assets/snapshots/seasons/2025-2026.json')) ok('snapshot sandbox minimo presente'); else fail('snapshot sandbox minimo mancante');
  if (!exists('assets/snapshots/seasons/2004-2005.json')) ok('storico ZonaOrientale non copiato nei dati clone'); else fail('dati storici ZonaOrientale copiati nel clone');
  if (exists('assets/listoni/2026-06-07.json', siteRoot)) fail('listone duplicato 2026-06-07 reinserito in ZonaOrientale'); else ok('listone duplicato 2026-06-07 non reinserito');
  if (fs.existsSync(cloneDocs)) ok('documentazione clone presente'); else fail('documentazione clone mancante');
} catch (error) {
  fail(error?.message || String(error));
}

if (failures) process.exit(1);
if (!quiet) console.log('Audit clone sandbox V447 superato.');
