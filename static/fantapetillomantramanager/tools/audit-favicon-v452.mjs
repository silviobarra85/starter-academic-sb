#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const siteRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
let failures = 0;
let checks = 0;
function ok(message) { checks += 1; if (!quiet) console.log(`OK: ${message}`); }
function fail(message) { checks += 1; failures += 1; console.error(`FAIL: ${message}`); }
function check(condition, message) { condition ? ok(message) : fail(message); }
function read(rel) { return fs.readFileSync(path.join(siteRoot, rel), 'utf8'); }
function json(rel) { return JSON.parse(read(rel)); }
function exists(rel) { return fs.existsSync(path.join(siteRoot, rel)); }

try {
  const config = json('assets/league-config.json');
  check(Number(config.currentVersion) >= 452, 'config currentVersion >= V452');
  check(config.leagueId === 'fantapetillomantramanager', 'identity clone corretta');

  const required = [
    'favicon.ico',
    'assets/icons/favicon-16x16.png',
    'assets/icons/favicon-32x32.png',
    'assets/icons/apple-touch-icon.png',
    'assets/icons/android-chrome-192x192.png',
    'assets/icons/android-chrome-512x512.png',
    'assets/icons/fantapetillo-favicon-source.svg'
  ];
  required.forEach((rel) => check(exists(rel), `${rel} presente`));

  const source = read('assets/icons/fantapetillo-favicon-source.svg');
  check(source.includes('FPMM'), 'source SVG contiene sigla FPMM');
  check(source.includes('2026-2027'), 'source SVG contiene stagione 2026-2027');

  const manifest = json('site.webmanifest');
  check(manifest.icons?.some((icon) => icon.src === './assets/icons/android-chrome-192x192.png'), 'manifest collega icona 192');
  check(manifest.icons?.some((icon) => icon.src === './assets/icons/android-chrome-512x512.png'), 'manifest collega icona 512');

  const index = read('index.html');
  check(/href="\.\/favicon\.ico\?v=\d+"/.test(index), 'index collega favicon.ico versionata');
  check(/favicon-32x32\.png\?v=\d+/.test(index), 'index collega favicon 32 versionata');
  check(/favicon-16x16\.png\?v=\d+/.test(index), 'index collega favicon 16 versionata');
  check(/apple-touch-icon\.png\?v=\d+/.test(index), 'index collega apple touch icon versionata');
  check(index.includes('android-chrome-512x512.png'), 'index usa icona 512 per metadata social');

  const versions = [...new Set((index.match(/\?v=\d+/g) || []).map((m) => m.slice(3)))];
  check(versions.length === 1 && versions[0] === config.currentVersion, `cache-buster index V${config.currentVersion}`);
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit favicon V452 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit favicon V452 superato: ${checks} controlli.`);
