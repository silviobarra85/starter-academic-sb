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
const canonicalPath = 'assets/js/dev/trade-notification-simulator-v255.js';
const legacyPath = 'assets/js/dev/trade-notification-simulator-v254.js';
const canonicalText = read(path.join(siteRoot, canonicalPath));

const checks = [
  {
    name: 'simulatore trade canonico V255 presente',
    ok: exists(canonicalPath),
    details: canonicalPath
  },
  {
    name: 'runtime importa solo il simulatore trade canonico V255',
    ok: importLines.some((line) => /\.\/js\/dev\/trade-notification-simulator-v255\.js\?v=\d+/.test(line))
      && !importLines.some((line) => /trade-notification-simulator-v254\.js/.test(line)),
    details: './js/dev/trade-notification-simulator-v255.js?v=<versione corrente>'
  },
  {
    name: 'vecchio simulatore trade dev V254 rimosso',
    ok: !exists(legacyPath),
    details: legacyPath
  },
  {
    name: 'HTML pubblici non linkano simulatori trade dev direttamente',
    ok: !/(?:src|href)="[^"]*trade-notification-simulator-v25[45]\.js/.test(htmlText),
    details: 'index.html, competition.html, player.html'
  },
  {
    name: 'V255 mantiene alias console V254 e V255',
    ok: /window\.ZonaOrientaleTradeSimulatorV254\s*=\s*api/.test(canonicalText)
      && /window\.ZonaOrientaleTradeSimulatorV255\s*=\s*api/.test(canonicalText),
    details: 'compatibilita comandi console storici'
  },
  {
    name: 'azioni locali V349 su simulazioni preservate',
    ok: /ZonaOrientaleTradeSimulatorLocalActionsV349/.test(appText)
      && /isLocalTradeSimulationV349/.test(appText)
      && /updateLocalTradeSimulationStatusV349/.test(appText),
    details: 'Rifiuta/Accetta simulati senza Firebase'
  },
  {
    name: 'marker cleanup V350 presente in app.js',
    ok: /ZonaOrientaleTradeSimulatorDevCleanupV350/.test(appText),
    details: 'window.ZonaOrientaleTradeSimulatorDevCleanupV350'
  }
];

const ok = checks.every((item) => item.ok);
const result = {
  version: 'V350',
  ok,
  checks,
  removed: [legacyPath],
  preserved: [canonicalPath, 'window.ZonaOrientaleTradeSimulatorV254 alias', 'window.ZonaOrientaleTradeSimulatorV255'],
  protectedAreas: ['Fantamercato interno', 'notifiche trattative', 'simulatore locale V349', 'badge notifiche presidente']
};

if (json) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else if (!quiet || !ok) {
  console.log('# Audit cleanup simulatore trade dev V350');
  console.log('');
  for (const item of checks) {
    const suffix = item.details ? ` - ${item.details}` : '';
    console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}${suffix}`);
  }
  console.log('');
  console.log(`Esito: ${ok ? 'OK' : 'FAIL'}`);
}

process.exit(ok ? 0 : 1);
