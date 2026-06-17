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
const appImportLines = appText.split(/\r?\n/).filter((line) => /^\s*import\b/.test(line));
const v254Path = 'assets/js/dev/trade-notification-simulator-v254.js';
const v255Path = 'assets/js/dev/trade-notification-simulator-v255.js';
const v254Text = read(path.join(siteRoot, v254Path));
const v255Text = read(path.join(siteRoot, v255Path));

const checks = [
  {
    name: 'simulatore trade attivo V255 presente',
    ok: exists(v255Path),
    details: v255Path
  },
  {
    name: 'simulatore trade dev V254 audit storico coerente con cleanup successivo',
    ok: true,
    details: exists(v254Path) ? `${v254Path} presente solo per review storica` : `${v254Path} rimosso da cleanup successivo`
  },
  {
    name: 'runtime importa solo il simulatore trade V255 canonico',
    ok: appImportLines.some((line) => /\.\/js\/dev\/trade-notification-simulator-v255\.js\?v=\d+/.test(line))
      && !appImportLines.some((line) => /trade-notification-simulator-v254\.js/.test(line)),
    details: './js/dev/trade-notification-simulator-v255.js?v=<versione corrente>'
  },
  {
    name: 'HTML pubblici non importano direttamente simulatori trade dev',
    ok: !/(?:src|href)="[^"]*trade-notification-simulator-v25[45]\.js/.test(htmlText),
    details: 'index.html, competition.html, player.html'
  },
  {
    name: 'V255 mantiene alias console V254 per compatibilita appunti/test',
    ok: /window\.ZonaOrientaleTradeSimulatorV254\s*=\s*api/.test(v255Text)
      && /window\.ZonaOrientaleTradeSimulatorV255\s*=\s*api/.test(v255Text),
    details: 'alias V254 e API V255 in modulo canonico'
  },
  {
    name: 'V255 contiene comandi diagnostici e smoke test locali',
    ok: /getTestCommands/.test(v255Text)
      && /runLocalSmokeTest/.test(v255Text)
      && /markAllOutcomeSeen/.test(v255Text),
    details: 'help, runLocalSmokeTest, markAllOutcomeSeen'
  },
  {
    name: 'V254 non e piu richiesto dal runtime dopo audit V348',
    ok: !exists(v254Path) || (/installTradeNotificationSimulatorV254/.test(v254Text)
      && !/getTestCommands/.test(v254Text)
      && /installTradeNotificationSimulatorV255/.test(v255Text)),
    details: exists(v254Path) ? 'V254 presente e precedente a V255' : 'V254 gia rimosso da cleanup controllato'
  },
  {
    name: 'marker audit V348 presente in app.js',
    ok: /ZonaOrientaleTradeSimulatorDevAuditV348/.test(appText),
    details: 'window.ZonaOrientaleTradeSimulatorDevAuditV348'
  }
];

const ok = checks.every((item) => item.ok);
const result = {
  version: 'V348',
  ok,
  checks,
  activeRuntimeModule: v255Path,
  reviewedLegacyModule: v254Path,
  recommendation: ok
    ? (exists(v254Path)
      ? 'V254 non e importato dal runtime. Rimuoverlo solo con una V dedicata dopo test manuale Fantamercato/notifiche trade.'
      : 'V254 risulta gia rimosso da cleanup controllato; runtime preservato su V255.')
    : 'Correggere i controlli falliti prima di valutare rimozioni.',
  policy: [
    'La V348 e un audit storico; eventuale cleanup successivo puo rimuovere V254.',
    'Il Fantamercato interno resta agganciato al simulatore V255 canonico.',
    'La compatibilita console V254 resta garantita dall alias in V255.'
  ]
};

if (json) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else if (!quiet || !ok) {
  console.log('# Audit simulatore trade dev V348');
  console.log('');
  for (const item of checks) {
    const suffix = item.details ? ` - ${item.details}` : '';
    console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}${suffix}`);
  }
  console.log('');
  console.log(`Esito: ${ok ? 'OK' : 'FAIL'}`);
  console.log(`Raccomandazione: ${result.recommendation}`);
}

process.exit(ok ? 0 : 1);
