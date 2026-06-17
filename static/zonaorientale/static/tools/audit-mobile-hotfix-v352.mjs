#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const toolsDir = path.dirname(__filename);
const siteRoot = path.resolve(toolsDir, '..');
const appFile = path.join(siteRoot, 'assets', 'app.js');
const indexFile = path.join(siteRoot, 'index.html');
const competitionFile = path.join(siteRoot, 'competition.html');
const playerFile = path.join(siteRoot, 'player.html');
const quiet = process.argv.includes('--quiet');
const json = process.argv.includes('--json');

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}
function exists(relPath) {
  return fs.existsSync(path.join(siteRoot, relPath));
}
function htmlContains(pattern) {
  return [indexFile, competitionFile, playerFile].some((file) => pattern.test(read(file)));
}

const appText = read(appFile);
const mobileSuite = read(path.join(siteRoot, 'assets/css/mobile-suite-v168.css'));
const htmlText = [indexFile, competitionFile, playerFile].map(read).join('\n');

const checks = [
  {
    name: 'mobile hotfix V166 rimosso come file sciolto',
    ok: !exists('assets/css/mobile-hotfix-v166.css'),
    details: 'assets/css/mobile-hotfix-v166.css'
  },
  {
    name: 'mobile hotfix V167 rimosso come file sciolto',
    ok: !exists('assets/css/mobile-hotfix-v167.css'),
    details: 'assets/css/mobile-hotfix-v167.css'
  },
  {
    name: 'mobile-suite V168 resta presente',
    ok: exists('assets/css/mobile-suite-v168.css'),
    details: 'asset mobile consolidato attivo'
  },
  {
    name: 'mobile-suite contiene sezioni consolidate V166/V167',
    ok: /mobile-hotfix-v166\.css/.test(mobileSuite) && /mobile-hotfix-v167\.css/.test(mobileSuite),
    details: 'le regole legacy restano inglobate nella suite'
  },
  {
    name: 'HTML non linkano mobile-hotfix V166/V167',
    ok: !htmlContains(/mobile-hotfix-v16[67]\.css/),
    details: 'index, competition, player'
  },
  {
    name: 'HTML continuano a linkare mobile-suite e mobile-chrome',
    ok: /mobile-suite-v168\.css\?v=352/.test(htmlText)
      && /mobile-chrome-v223\.css\?v=352/.test(htmlText),
    details: 'cache-buster V352'
  },
  {
    name: 'marker runtime V352 presente',
    ok: /ZonaOrientaleMobileHotfixCleanupV352/.test(appText),
    details: 'window.ZonaOrientaleMobileHotfixCleanupV352'
  }
];

const ok = checks.every((item) => item.ok);
const result = {
  version: 'V352',
  ok,
  checks,
  removedFiles: [
    'assets/css/mobile-hotfix-v166.css',
    'assets/css/mobile-hotfix-v167.css'
  ],
  protectedAreas: [
    'mobile bottom navigation',
    'menu mobile Altro',
    'layout mobile light/dark',
    'tabelle mobile Rose/Listone',
    'card mobile Calciomercato'
  ]
};

if (json) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else if (!quiet || !ok) {
  console.log('# Audit mobile hotfix cleanup V352');
  console.log('');
  for (const item of checks) {
    const suffix = item.details ? ` - ${item.details}` : '';
    console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}${suffix}`);
  }
  console.log('');
  console.log(`Esito: ${ok ? 'OK' : 'FAIL'}`);
}

process.exit(ok ? 0 : 1);
