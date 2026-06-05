#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const toolsDir = dirname(__filename);
const siteRoot = resolve(toolsDir, '..');
const repoRoot = resolve(siteRoot, '..', '..');
const packageDocsRoot = resolve(siteRoot, '..', 'docs', 'zonaorientale');
const docsRoot = existsSync(resolve(repoRoot, 'docs', 'zonaorientale')) ? resolve(repoRoot, 'docs', 'zonaorientale') : packageDocsRoot;
const quiet = process.argv.includes('--quiet');

const failures = [];
const warnings = [];
const passes = [];
const rel = (abs) => relative(repoRoot, abs).replaceAll('\\\\', '/');
const read = (abs) => readFileSync(abs, 'utf8');
const pass = (message) => passes.push(message);
const warn = (message) => warnings.push(message);
const fail = (message) => failures.push(message);
const mustExist = (abs, label = rel(abs)) => existsSync(abs) ? pass(`${label} presente`) : fail(`${label} mancante`);

const appPath = resolve(siteRoot, 'assets', 'app.js');
const indexPath = resolve(siteRoot, 'index.html');
const competitionPath = resolve(siteRoot, 'competition.html');
const playerPath = resolve(siteRoot, 'player.html');

for (const file of [appPath, indexPath, competitionPath, playerPath]) mustExist(file);

const app = existsSync(appPath) ? read(appPath) : '';
const html = [indexPath, competitionPath, playerPath].filter(existsSync).map(read).join('\n');

if (/DEPLOY_EXPECTED_VERSION_V181\s*=\s*"(35[6-9]|3[6-9][0-9]|[4-9][0-9]{2,})"/.test(app)) pass('DEPLOY_EXPECTED_VERSION_V181 almeno V356');
else fail('DEPLOY_EXPECTED_VERSION_V181 inferiore a V356');

if (app.includes('window.ZonaOrientaleManualQaTrackerV356')) pass('marker runtime Manual QA V356 presente');
else fail('marker runtime Manual QA V356 mancante');

if (app.includes('window.ZonaOrientaleRegressionSmokeSuiteV355')) pass('marker regression smoke V355 preservato');
else fail('marker regression smoke V355 mancante');

if (app.includes('storageKey = \'zonaorientale.manualQa.v356\'')) pass('storageKey localStorage V356 presente');
else fail('storageKey localStorage V356 mancante');

const requiredMethods = ['const mark =', 'const reset =', 'const summary =', 'const exportMarkdown =', 'const runSmokeTest ='];
for (const token of requiredMethods) {
  if (app.includes(token)) pass(`metodo tracker preservato: ${token}`);
  else fail(`metodo tracker mancante: ${token}`);
}

const requiredChecks = [
  'auth-admin',
  'calciomercato-feed',
  'calciomercato-player-modal',
  'trade-simulator',
  'mobile-nav',
  'competitions'
];
for (const token of requiredChecks) {
  if (app.includes(token)) pass(`checkpoint QA presente: ${token}`);
  else fail(`checkpoint QA mancante: ${token}`);
}

if (html.includes('?v=355')) fail('HTML contiene ancora cache-buster v=355');
else pass('HTML senza cache-buster v=355');
if (/\?v=(35[6-9]|3[6-9][0-9]|[4-9][0-9]{2,})/.test(html)) pass('HTML contiene cache-buster almeno v=356');
else fail('HTML non contiene cache-buster almeno v=356');
if (app.includes('?v=355')) fail('assets/app.js contiene ancora import/cache-buster v=355');
else pass('assets/app.js senza import/cache-buster v=355');
if (/\?v=(35[6-9]|3[6-9][0-9]|[4-9][0-9]{2,})/.test(app)) pass('assets/app.js contiene cache-buster almeno v=356');
else fail('assets/app.js non contiene cache-buster almeno v=356');

const docs = [
  resolve(docsRoot, 'FUNZIONALITAV356.md'),
  resolve(docsRoot, 'handoff/HANDOFF_NUOVO_ASSISTENTE_V356.md'),
  resolve(docsRoot, 'refactor/MANUAL_QA_TRACKER_V356.md'),
  resolve(docsRoot, 'audit/MANUAL_QA_TRACKER_MATRIX_V356.md'),
  resolve(docsRoot, 'release/RELEASE_V356_MANUAL_QA_TRACKER.md'),
  resolve(docsRoot, 'test/MANUAL_QA_TRACKER_COMANDI_V356.md')
];
for (const doc of docs) mustExist(doc);

const protectedDoc = resolve(docsRoot, "FUNZIONALITA'.md");
if (existsSync(protectedDoc)) pass("docs/zonaorientale/FUNZIONALITA'.md protetto presente");
else warn("docs/zonaorientale/FUNZIONALITA'.md non incluso nello zip parziale: verificare nel repository completo");

if (!quiet) {
  for (const message of passes) console.log(`OK ${message}`);
  for (const message of warnings) console.warn(`WARN ${message}`);
  for (const message of failures) console.error(`FAIL ${message}`);
  console.log(`\nAudit manual QA tracker V356: ${passes.length} ok, ${warnings.length} warning, ${failures.length} errori.`);
}

if (failures.length > 0) process.exit(1);
