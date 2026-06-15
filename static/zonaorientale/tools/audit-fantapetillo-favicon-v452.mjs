#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const siteRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const staticRoot = path.resolve(siteRoot, '..');
const cloneRoot = path.join(staticRoot, 'fantapetillomantramanager');
let failures = 0;
let checks = 0;
function ok(message) { checks += 1; if (!quiet) console.log(`OK: ${message}`); }
function fail(message) { checks += 1; failures += 1; console.error(`FAIL: ${message}`); }
function check(condition, message) { condition ? ok(message) : fail(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function json(file) { return JSON.parse(read(file)); }
function exists(file) { return fs.existsSync(file); }

try {
  const zonaConfig = json(path.join(siteRoot, 'assets', 'league-config.json'));
  const cloneConfig = json(path.join(cloneRoot, 'assets', 'league-config.json'));
  check(zonaConfig.currentVersion === '452', 'ZonaOrientale currentVersion V452');
  check(cloneConfig.currentVersion === '452', 'clone currentVersion V452');
  check(zonaConfig.firebase?.projectId !== cloneConfig.firebase?.projectId, 'Firebase separati invariati');

  const iconRoot = path.join(cloneRoot, 'assets', 'icons');
  [
    'favicon-16x16.png',
    'favicon-32x32.png',
    'apple-touch-icon.png',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'fantapetillo-favicon-source.svg'
  ].forEach((name) => check(exists(path.join(iconRoot, name)), `icona clone ${name} presente`));
  check(exists(path.join(cloneRoot, 'favicon.ico')), 'favicon.ico clone presente');

  const source = read(path.join(iconRoot, 'fantapetillo-favicon-source.svg'));
  check(source.includes('FPMM') && source.includes('2026-2027'), 'favicon clone contiene sigla e stagione');

  const cloneIndex = read(path.join(cloneRoot, 'index.html'));
  check(cloneIndex.includes('android-chrome-512x512.png'), 'metadata clone puntano a icona FantaPetillo');
  check(!cloneIndex.includes('silviobarra.com/zonaorientale'), 'metadata clone non puntano a ZonaOrientale');

  const zonaFirebase = read(path.join(siteRoot, 'assets', 'firebase.js'));
  check(zonaFirebase.includes('zonaorientale-d07af'), 'Firebase ZonaOrientale invariato');
  check(!zonaFirebase.includes('fantapetillomantramanager.firebaseapp.com'), 'Firebase clone non importato in ZonaOrientale');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit favicon FantaPetillo V452 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit favicon FantaPetillo V452 superato: ${checks} controlli.`);
