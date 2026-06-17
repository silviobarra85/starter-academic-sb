#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, '..');
const quiet = process.argv.includes('--quiet');

function rel(file) {
  return file.replace(/\\/g, '/');
}

function readIfExists(relativePath) {
  const absolutePath = path.join(siteRoot, relativePath);
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
}

function exists(relativePath) {
  return fs.existsSync(path.join(siteRoot, relativePath));
}

function htmlEntrypoints() {
  return ['index.html', 'competition.html', 'player.html', 'news.html']
    .filter((file) => exists(file));
}

function htmlContains(pattern) {
  return htmlEntrypoints().some((file) => pattern.test(readIfExists(file)));
}

function runtimeHasStaticImportForDomainCompetitions() {
  const candidates = [
    'assets/app.js',
    ...htmlEntrypoints()
  ];
  return candidates.some((file) => {
    const text = readIfExists(file);
    return /import\s+[^;]*["'][^"']*assets\/js\/domain\/competitions\.js["']/.test(text)
      || /from\s+["'][^"']*assets\/js\/domain\/competitions\.js["']/.test(text)
      || /import\s*\(\s*["'][^"']*assets\/js\/domain\/competitions\.js["']\s*\)/.test(text);
  });
}

const themeFile = 'assets/css/refactor/theme-light-suspended.css';
const domainModule = 'assets/js/domain/competitions.js';
const appText = readIfExists('assets/app.js');
const themeText = readIfExists(themeFile);
const domainText = readIfExists(domainModule);

const checks = [
  {
    name: 'theme-light-suspended.css conservato',
    ok: exists(themeFile),
    details: themeFile
  },
  {
    name: 'theme-light-suspended.css non importato dagli HTML',
    ok: !htmlContains(/css\/refactor\/theme-light-suspended\.css/),
    details: 'la Light mode resta sospesa/non caricata'
  },
  {
    name: 'theme-light-suspended.css contiene marker di sospensione',
    ok: /CSS Light sospeso|Light sospeso|non caricato/i.test(themeText),
    details: 'il file resta archivio/rollback, non CSS attivo'
  },
  {
    name: 'domain/competitions.js conservato per audit',
    ok: exists(domainModule),
    details: domainModule
  },
  {
    name: 'domain/competitions.js non importato staticamente dal runtime corrente',
    ok: !runtimeHasStaticImportForDomainCompetitions(),
    details: 'le funzioni competizione canoniche restano inline in app.js'
  },
  {
    name: 'funzioni competizione inline presenti in app.js',
    ok: /function\s+getCompetitionTypeOrderV52/.test(appText)
      && /function\s+compareCompetitionsForPublicDisplayV52/.test(appText)
      && /function\s+getSeasonCompetitionsForPublicDisplayV52/.test(appText),
    details: 'Dashboard Competizioni e competition.html restano agganciate alle funzioni inline'
  },
  {
    name: 'modulo domain/competitions.js esporta helper V52',
    ok: /export\s+function\s+getCompetitionTypeOrderV52/.test(domainText)
      && /export\s+function\s+getSeasonCompetitionsForPublicDisplayV52/.test(domainText),
    details: 'duplicato storico valutabile solo in cleanup successivo'
  },
  {
    name: 'marker runtime V353 presente',
    ok: /ZonaOrientaleThemeCompetitionsAuditV353/.test(appText),
    details: 'window.ZonaOrientaleThemeCompetitionsAuditV353'
  }
];

let failures = 0;
for (const check of checks) {
  if (!check.ok) failures += 1;
  if (!quiet) {
    console.log(`${check.ok ? 'OK' : 'FAIL'}: ${check.name} - ${check.details}`);
  }
}

const summary = {
  ok: failures === 0,
  version: 'V353',
  failures,
  audited: [rel(themeFile), rel(domainModule)],
  removalPolicy: 'audit-only'
};

if (!quiet) {
  console.log(JSON.stringify(summary, null, 2));
}

process.exit(failures === 0 ? 0 : 1);
