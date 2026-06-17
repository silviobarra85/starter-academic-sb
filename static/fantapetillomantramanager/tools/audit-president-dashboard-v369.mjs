#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const quiet = process.argv.includes('--quiet');
const __filename = fileURLToPath(import.meta.url);
const toolDir = path.dirname(__filename);
const cwd = process.cwd();
const normalize = (value) => path.resolve(value);
const candidates = [
  normalize(path.join(cwd, 'static', 'zonaorientale')),
  normalize(path.join(cwd, 'zonaorientale')),
  normalize(cwd),
  normalize(path.join(toolDir, '..'))
];
const siteRoot = candidates.find((candidate) => fs.existsSync(path.join(candidate, 'assets', 'app.js')));
if (!siteRoot) {
  console.error('[audit-president-dashboard-v369] site root non trovato');
  process.exit(1);
}

const repoCandidates = [normalize(path.join(siteRoot, '..', '..')), normalize(path.join(siteRoot, '..')), normalize(cwd)];
const docsRoot = repoCandidates.map((root) => path.join(root, 'docs', 'zonaorientale')).find((candidate) => fs.existsSync(candidate));
const failures = [];
const warnings = [];
const passes = [];
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const pass = (message) => passes.push(message);
const read = (file) => fs.readFileSync(file, 'utf8');
const fileExists = (file) => fs.existsSync(file) && fs.statSync(file).isFile();
const consolidatedDocFiles = docsRoot ? [
  '00_STATO_CORRENTE_E_INDICE.md',
  '01_FUNZIONALITA_E_CHANGELOG.md',
  '02_ARCHITETTURA_DATI_FIREBASE_SOCCER_DATA.md',
  '03_ADMIN_OPERATIVITA_EMAIL.md',
  '04_CALCIOMERCATO_E_LISTONI.md',
  '05_TEST_AUDIT_REGRESSIONI.md',
  '06_RELEASE_HANDOFF_REFACTOR_STORICO.md',
  '07_PIANIFICAZIONE_ROADMAP_PROSSIME_ATTIVITA.md'
].map((name) => path.join(docsRoot, name)).filter(fileExists) : [];
const consolidatedDocsText = consolidatedDocFiles.map(read).join('\n');
function hasConsolidatedDoc(relativeDoc) {
  return consolidatedDocsText.includes(`\`${relativeDoc}\``)
    || consolidatedDocsText.includes(`## `) && consolidatedDocsText.includes(relativeDoc)
    || consolidatedDocsText.includes(`Percorso originale: \`${relativeDoc}\``);
}
function requireDocOrConsolidated(relativeDoc, label) {
  const target = path.join(docsRoot, relativeDoc);
  if (fileExists(target)) pass(`${label} presente: ${relativeDoc}`);
  else if (hasConsolidatedDoc(relativeDoc)) pass(`${label} presente nella documentazione consolidata: ${relativeDoc}`);
  else fail(`${label} mancante: ${relativeDoc}`);
}
function requireProtectedFunctionalityDoc(label) {
  const protectedDoc = path.join(docsRoot, "FUNZIONALITA'.md");
  if (fileExists(protectedDoc)) pass("FUNZIONALITA'.md presente e protetto");
  else if (hasConsolidatedDoc("FUNZIONALITA'.md")) pass("FUNZIONALITA'.md presente nella documentazione consolidata");
  else fail("FUNZIONALITA'.md mancante");
}

const relSite = (file) => path.relative(siteRoot, file).replaceAll('\\', '/');
const appPath = path.join(siteRoot, 'assets', 'app.js');
const indexPath = path.join(siteRoot, 'index.html');
const competitionPath = path.join(siteRoot, 'competition.html');
const playerPath = path.join(siteRoot, 'player.html');
const checkPath = path.join(siteRoot, 'tools', 'check-zonaorientale.sh');
const app = fileExists(appPath) ? read(appPath) : '';

for (const file of [appPath, indexPath, competitionPath, playerPath, checkPath]) {
  if (fileExists(file)) pass(`${relSite(file)} presente`);
  else fail(`${relSite(file)} mancante`);
}

if (fileExists(appPath)) {
  const syntax = spawnSync(process.execPath, ['--check', appPath], { encoding: 'utf8' });
  if (syntax.status === 0) pass('assets/app.js sintassi ok');
  else fail(`assets/app.js sintassi ko: ${syntax.stderr || syntax.stdout}`.trim());
}

const expectedVersion = app.match(/DEPLOY_EXPECTED_VERSION_V181\s*=\s*["'](\d+)["']/)?.[1] || '';
if (Number(expectedVersion || 0) >= 369) pass(`DEPLOY_EXPECTED_VERSION_V181 >= 369: ${expectedVersion}`);
else fail(`DEPLOY_EXPECTED_VERSION_V181 inferiore a 369: ${expectedVersion || 'non trovato'}`);

for (const [name, file] of [['index.html', indexPath], ['competition.html', competitionPath], ['player.html', playerPath]]) {
  const html = fileExists(file) ? read(file) : '';
  if (expectedVersion && html.includes(`V${expectedVersion}`)) pass(`${name} footer/versione V${expectedVersion} presente`);
  else fail(`${name} footer/versione corrente mancante: V${expectedVersion || 'non trovata'}`);
  const unique = [...new Set(Array.from(html.matchAll(/[?&]v=(\d+)/g)).map((match) => match[1]))];
  if (unique.length && unique.every((version) => version === expectedVersion)) pass(`${name} cache-buster allineati a v=${expectedVersion}`);
  else fail(`${name} cache-buster non allineati a v=${expectedVersion}: ${unique.join(', ') || 'nessuno'}`);
}

const uniqueAppVersions = [...new Set(Array.from(app.matchAll(/[?&]v=(\d+)/g)).map((match) => match[1]))];
if (!uniqueAppVersions.length || uniqueAppVersions.every((version) => version === expectedVersion)) pass(`assets/app.js import/cache statici allineati a v=${expectedVersion}`);
else fail(`assets/app.js import/cache statici non allineati a v=${expectedVersion}: ${uniqueAppVersions.join(', ')}`);

const requiredTokens = [
  'window.ZonaOrientalePresidentDashboardV369',
  'renderPresidentDashboardV369',
  'buildPresidentDashboardPayloadV369',
  'renderUserAreaApprovedBeforeV369',
  'data-president-dashboard-scroll-v369',
  'president-dashboard-v369',
  'tradeProposalForm',
  'trade-list-panel',
  'teamNewsRequestForm',
  'data-trade-accept',
  'data-trade-reject',
  'window.ZonaOrientaleAdminPublicationDashboardV368',
  'window.ZonaOrientaleProtectedRegressionSuiteV367',
  'window.ZonaOrientaleTradeDomainHardeningV366'
];
for (const token of requiredTokens) {
  if (app.includes(token)) pass(`token protetto presente: ${token}`);
  else fail(`token protetto mancante: ${token}`);
}

if (app.includes('firebaseWrites: false') && app.includes('replacesExistingSections: false')) pass('Dashboard Presidente V369 dichiarata read-only e non sostitutiva');
else fail('Dashboard Presidente V369 non dichiara read-only/non sostitutiva');

if (fileExists(checkPath)) {
  const check = read(checkPath);
  if (check.includes('audit-president-dashboard-v369.mjs')) pass('check-zonaorientale richiama audit V369');
  else fail('check-zonaorientale non richiama audit V369');
}

if (docsRoot) {
  requireProtectedFunctionalityDoc('V369');
  const requiredDocs = [
    'AI_HANDOFF_ZONAORIENTALE_CURRENT.md',
    'CURRENT_STATE.md',
    'FUNZIONALITAV369.md',
    'release/RELEASE_V369_DASHBOARD_PRESIDENTE_PROTETTA.md',
    'audit/PRESIDENT_DASHBOARD_MATRIX_V369.md',
    'test/PRESIDENT_DASHBOARD_V369.md',
    'handoff/HANDOFF_NUOVO_ASSISTENTE_V369.md'
  ];
  for (const relativeDoc of requiredDocs) requireDocOrConsolidated(relativeDoc, 'doc V369');
} else {
  warn('docs/zonaorientale non trovata: controllo documentale V369 saltato');
}

if (!quiet) {
  for (const message of passes) console.log(`OK: ${message}`);
  for (const message of warnings) console.warn(`WARN: ${message}`);
  for (const message of failures) console.error(`FAIL: ${message}`);
  console.log(`\nAudit Dashboard Presidente V369: ${passes.length} ok, ${warnings.length} warning, ${failures.length} errori.`);
}

if (failures.length) process.exit(1);
