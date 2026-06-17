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

function rel(file) {
  return path.relative(siteRoot, file).split(path.sep).join('/');
}

function exists(relPath) {
  return fs.existsSync(path.join(siteRoot, relPath));
}

function grepFiles(pattern, files) {
  const hits = [];
  for (const file of files) {
    const text = read(file);
    if (pattern.test(text)) hits.push(rel(file));
  }
  return hits;
}

const runtimeFiles = [appFile, indexFile, competitionFile, playerFile].filter(fs.existsSync);
const appText = read(appFile);
const appImportLines = appText.split(/\r?\n/).filter((line) => /^\s*import\b/.test(line));

const currentVersion = appText.match(/DEPLOY_EXPECTED_VERSION_V181\s*=\s*"(\d+)"/)?.[1] || '\d+';

const candidates = [
  {
    file: 'assets/js/dev/trade-notification-simulator-v254.js',
    status: exists('assets/js/dev/trade-notification-simulator-v254.js') ? 'candidate-review' : 'not-present',
    reason: 'versione dev precedente rispetto a assets/js/dev/trade-notification-simulator-v255.js',
    recommendation: 'non rimuovere automaticamente: verificare workflow test/notifiche trade prima di cleanup mirato'
  },
  {
    file: 'assets/js/trade-notification-simulator-v255.js',
    status: exists('assets/js/trade-notification-simulator-v255.js') ? 'candidate-review' : 'not-present',
    reason: 'copia top-level non importata dal runtime; app.js importa assets/js/dev/trade-notification-simulator-v255.js',
    recommendation: 'probabile duplicato, ma rimuovere solo con V dedicata e grep completo'
  },
  {
    file: 'assets/js/refactor/admin-publication-workflow-v213.js',
    status: exists('assets/js/refactor/admin-publication-workflow-v213.js') ? 'candidate-review' : 'not-present',
    reason: 'modulo storico non importato direttamente nel runtime corrente',
    recommendation: 'non rimuovere senza test Admin pubblicazione/comunicati'
  },
  {
    file: 'assets/css/mobile-hotfix-v166.css',
    status: exists('assets/css/mobile-hotfix-v166.css') ? 'unexpected-present-after-v352' : 'removed-v352',
    reason: 'hotfix mobile precedente inglobato in assets/css/mobile-suite-v168.css',
    recommendation: 'rimosso in V352; mantenere mobile-suite-v168.css e audit dedicato V352'
  },
  {
    file: 'assets/css/mobile-hotfix-v167.css',
    status: exists('assets/css/mobile-hotfix-v167.css') ? 'unexpected-present-after-v352' : 'removed-v352',
    reason: 'hotfix mobile storico inglobato in assets/css/mobile-suite-v168.css',
    recommendation: 'rimosso in V352; mantenere mobile-suite-v168.css e audit dedicato V352'
  },
  {
    file: 'assets/css/refactor/theme-light-suspended.css',
    status: exists('assets/css/refactor/theme-light-suspended.css') ? 'audited-v353-kept' : 'not-present',
    reason: 'CSS Light sospeso/storico non importato dagli HTML correnti',
    recommendation: 'audit V353 completato: conservare finche non si decide una policy dedicata per la Light mode'
  },
  {
    file: 'assets/js/domain/competitions.js',
    status: exists('assets/js/domain/competitions.js') ? 'audited-v353-kept' : 'not-present',
    reason: 'modulo dominio storico non importato direttamente; funzioni canoniche inline in app.js',
    recommendation: 'audit V353 completato: non rimuovere senza test manuale dedicato su Competizioni'
  }
];

const checks = [];
checks.push({
  name: 'runtime continua a importare simulatore trade attivo da cartella dev',
  ok: appImportLines.some((line) => /\.\/js\/dev\/trade-notification-simulator-v255\.js\?v=\d+/.test(line)),
  details: 'assets/js/dev/trade-notification-simulator-v255.js? versione corrente'
});
checks.push({
  name: 'nessun import runtime ai moduli player rimossi V335/V337',
  ok: !appImportLines.some((line) => /calciomercato-players-v33[57]\.js/.test(line))
    && grepFiles(/(?:src|href)=\"[^\"]*calciomercato-players-v33[57]\.js/, [indexFile, competitionFile, playerFile].filter(fs.existsSync)).length === 0,
  details: 'menzioni documentali/diagnostiche in app.js sono consentite'
});
checks.push({
  name: 'nessun import runtime a shared-helpers-v294.js',
  ok: !appImportLines.some((line) => /shared-helpers-v294\.js/.test(line))
    && grepFiles(/(?:src|href)=\"[^\"]*shared-helpers-v294\.js/, [indexFile, competitionFile, playerFile].filter(fs.existsSync)).length === 0,
  details: 'menzioni documentali/diagnostiche in app.js sono consentite'
});
checks.push({
  name: 'moduli refactor Calciomercato attivi ancora importati',
  ok: [
    'calciomercato-images-v334.js?v=' + currentVersion,
    'calciomercato-render-v338.js?v=' + currentVersion,
    'calciomercato-filters-v339.js?v=' + currentVersion,
    'calciomercato-admin-v340.js?v=' + currentVersion,
    'calciomercato-players-v359.js?v=' + currentVersion
  ].every((token) => appText.includes(token))
});
checks.push({
  name: 'diagnostica V346 esposta in app.js',
  ok: /ZonaOrientaleMinorLegacyAuditV346/.test(appText)
});

const ok = checks.every((item) => item.ok);
const result = {
  version: 'V346',
  ok,
  checks,
  candidates,
  policy: [
    'La V346 non cancella file.',
    'Ogni candidato richiede una V dedicata con grep, audit e test browser mirati.',
    'Preservare sempre Calciomercato, Admin, Listone, Rose, Dashboard Presidente, Fantamercato, mobile navigation e Netlify Functions.'
  ]
};

if (json) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else if (!quiet || !ok) {
  console.log('# Audit candidati legacy minori V346');
  console.log('');
  console.log('## Controlli runtime');
  for (const item of checks) {
    const suffix = item.details ? ` - ${item.details}` : '';
    console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}${suffix}`);
  }
  console.log('');
  console.log('## Candidati da non cancellare automaticamente');
  for (const item of candidates) {
    console.log(`- ${item.file} [${item.status}] ${item.reason}. ${item.recommendation}`);
  }
}

if (!ok) process.exitCode = 1;
