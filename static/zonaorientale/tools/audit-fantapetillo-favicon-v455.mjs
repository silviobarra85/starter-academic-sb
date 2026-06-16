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
  check(Number(zonaConfig.currentVersion) >= 456, 'ZonaOrientale currentVersion >= V456');
  check(Number(cloneConfig.currentVersion) >= 456, 'clone currentVersion >= V456');
  check(zonaConfig.firebase?.projectId !== cloneConfig.firebase?.projectId, 'Firebase separati invariati');

  const iconRoot = path.join(cloneRoot, 'assets', 'icons');
  [
    'fantapetillo-favicon-v455-16.png',
    'fantapetillo-favicon-v455-32.png',
    'fantapetillo-apple-touch-icon-v455.png',
    'fantapetillo-android-chrome-192-v455.png',
    'fantapetillo-android-chrome-512-v455.png',
    'fantapetillo-favicon-source.svg'
  ].forEach((name) => check(exists(path.join(iconRoot, name)), `icona clone ${name} presente`));
  check(exists(path.join(cloneRoot, 'favicon.ico')), 'favicon.ico clone presente');

  const source = read(path.join(iconRoot, 'fantapetillo-favicon-source.svg'));
  check(source.includes('FPMM') && source.includes('2026-2027'), 'favicon clone contiene sigla e stagione');

  const pages = ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'news.html'];
  pages.forEach((page) => {
    const html = read(path.join(cloneRoot, page));
    check(html.includes('fantapetillo-favicon-v455-32.png?v=456'), `${page} collega favicon PNG V455`);
    check(html.includes('fantapetillo-apple-touch-icon-v455.png?v=456'), `${page} collega apple touch V455`);
  });

  const manifest = read(path.join(cloneRoot, 'site.webmanifest'));
  check(manifest.includes('fantapetillo-android-chrome-512-v455.png'), 'manifest clone usa icona 512 V455');

  const zonaFirebase = read(path.join(siteRoot, 'assets', 'firebase.js'));
  check(zonaFirebase.includes('zonaorientale-d07af'), 'Firebase ZonaOrientale invariato');
  check(!zonaFirebase.includes('fantapetillomantramanager.firebaseapp.com'), 'Firebase clone non importato in ZonaOrientale');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit favicon FantaPetillo V455 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit favicon FantaPetillo V455 superato: ${checks} controlli.`);
