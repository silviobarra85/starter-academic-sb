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

const appText = read(appFile);
const htmlText = [indexFile, competitionFile, playerFile].map(read).join('\n');
const importLines = appText.split(/\r?\n/).filter((line) => /^\s*import\b/.test(line));
const topLevelPath = 'assets/js/trade-notification-simulator-v255.js';
const canonicalPath = 'assets/js/dev/trade-notification-simulator-v255.js';
const legacyDevPath = 'assets/js/dev/trade-notification-simulator-v254.js';

const checks = [
  {
    name: 'simulatore trade canonico V255 presente in assets/js/dev',
    ok: exists(canonicalPath),
    details: canonicalPath
  },
  {
    name: 'runtime importa solo il simulatore trade canonico da assets/js/dev',
    ok: importLines.some((line) => /\.\/js\/dev\/trade-notification-simulator-v255\.js\?v=\d+/.test(line))
      && !importLines.some((line) => /\.\/js\/trade-notification-simulator-v255\.js/.test(line)),
    details: './js/dev/trade-notification-simulator-v255.js?v=<versione corrente>'
  },
  {
    name: 'duplicato top-level trade-notification-simulator-v255.js rimosso',
    ok: !exists(topLevelPath),
    details: topLevelPath
  },
  {
    name: 'HTML pubblici non linkano il duplicato top-level',
    ok: !/(?:src|href)="[^"]*assets\/js\/trade-notification-simulator-v255\.js/.test(htmlText),
    details: 'index.html, competition.html, player.html'
  },
  {
    name: 'legacy dev V254 resta candidato review e non import runtime',
    ok: !importLines.some((line) => /trade-notification-simulator-v254\.js/.test(line)),
    details: exists(legacyDevPath) ? `${legacyDevPath} ancora presente ma non importato` : `${legacyDevPath} non presente`
  },
  {
    name: 'marker V347 presente in app.js',
    ok: /ZonaOrientaleTradeSimulatorCleanupV347/.test(appText),
    details: 'window.ZonaOrientaleTradeSimulatorCleanupV347'
  }
];

const ok = checks.every((item) => item.ok);
const result = {
  version: 'V347',
  ok,
  checks,
  removed: [topLevelPath],
  preserved: [canonicalPath],
  stillReview: [legacyDevPath, 'assets/js/refactor/admin-publication-workflow-v213.js', 'assets/css/mobile-hotfix-v166.css', 'assets/css/mobile-hotfix-v167.css', 'assets/css/refactor/theme-light-suspended.css', 'assets/js/domain/competitions.js']
};

if (json) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else if (!quiet || !ok) {
  console.log('# Audit cleanup simulatore trade V347');
  console.log('');
  for (const item of checks) {
    const suffix = item.details ? ` - ${item.details}` : '';
    console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}${suffix}`);
  }
  console.log('');
  console.log(`Esito: ${ok ? 'OK' : 'FAIL'}`);
}

process.exit(ok ? 0 : 1);
