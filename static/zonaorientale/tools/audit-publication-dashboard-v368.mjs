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
  console.error('[audit-publication-dashboard-v368] site root non trovato');
  process.exit(1);
}

const repoCandidates = [
  normalize(path.join(siteRoot, '..', '..')),
  normalize(path.join(siteRoot, '..')),
  normalize(cwd)
];
const docsRoot = repoCandidates
  .map((root) => path.join(root, 'docs', 'zonaorientale'))
  .find((candidate) => fs.existsSync(candidate));

const failures = [];
const warnings = [];
const passes = [];
const fail = (message) => failures.push(message);
const warn = (message) => warnings.push(message);
const pass = (message) => passes.push(message);
const read = (file) => fs.readFileSync(file, 'utf8');
const fileExists = (file) => fs.existsSync(file) && fs.statSync(file).isFile();
const relSite = (file) => path.relative(siteRoot, file).replaceAll('\\\\', '/');

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
if (Number(expectedVersion || 0) >= 368) pass(`DEPLOY_EXPECTED_VERSION_V181 >= 368: ${expectedVersion}`);
else fail(`DEPLOY_EXPECTED_VERSION_V181 inferiore a 368: ${expectedVersion || 'non trovato'}`);

for (const htmlFile of [indexPath, competitionPath, playerPath]) {
  if (!fileExists(htmlFile)) continue;
  const html = read(htmlFile);
  const name = path.basename(htmlFile);
  if (html.includes(`V${expectedVersion}`)) pass(`${name} footer/versione V${expectedVersion} presente`);
  else fail(`${name} footer/versione V${expectedVersion} mancante`);
  const versions = [...html.matchAll(/[?&]v=(\d+)/g)].map((match) => match[1]);
  const unique = [...new Set(versions)];
  if (unique.length && unique.every((version) => version === expectedVersion)) pass(`${name} cache-buster allineati a v=${expectedVersion}`);
  else fail(`${name} cache-buster non allineati a v=${expectedVersion}: ${unique.join(', ') || 'nessuno'}`);
}

const appVersions = [...app.matchAll(/[?&]v=(\d+)/g)].map((match) => match[1]);
const uniqueAppVersions = [...new Set(appVersions)];
if (!uniqueAppVersions.length || uniqueAppVersions.every((version) => version === expectedVersion)) pass(`assets/app.js import/cache statici allineati a v=${expectedVersion}`);
else fail(`assets/app.js import/cache statici non allineati a v=${expectedVersion}: ${uniqueAppVersions.join(', ')}`);

const requiredTokens = [
  'window.ZonaOrientaleAdminPublicationDashboardV368',
  'ADMIN_PUBLICATION_DASHBOARD_MOUNT_ID_V368',
  'renderAdminPublicationDashboardPanelV368',
  'runAdminPublicationDashboardV368',
  'getAdminPublicationDashboardChecklistTextV368',
  'data-run-publication-dashboard-v368',
  'ZonaOrientaleProtectedRegressionSuiteV367',
  'readAdminPublicationRemindersV189',
  'runPublicationStatusV190',
  'renderPublishWizardPanelV191'
];
for (const token of requiredTokens) {
  if (app.includes(token)) pass(`token V368/protetto presente: ${token}`);
  else fail(`token V368/protetto mancante: ${token}`);
}

if (app.includes('Number(expected) >= 367') && app.includes('footer.includes(`V${expected}`)')) {
  pass('smoke runtime V367 tollerante verso release successive');
} else {
  fail('smoke runtime V367 non risulta tollerante verso release successive');
}

if (fileExists(checkPath)) {
  const check = read(checkPath);
  if (check.includes('audit-publication-dashboard-v368.mjs')) pass('check-zonaorientale richiama audit V368');
  else fail('check-zonaorientale non richiama audit V368');
}

if (docsRoot) {
  const protectedDoc = path.join(docsRoot, "FUNZIONALITA'.md");
  if (fileExists(protectedDoc)) pass("FUNZIONALITA'.md presente e non richiesto per V368");
  else fail("FUNZIONALITA'.md mancante");
  const requiredDocs = [
    'AI_HANDOFF_ZONAORIENTALE_CURRENT.md',
    'CURRENT_STATE.md',
    'FUNZIONALITAV368.md',
    'release/RELEASE_V368_DASHBOARD_PUBBLICAZIONE_ADMIN.md',
    'audit/PUBLICATION_DASHBOARD_MATRIX_V368.md',
    'test/PUBLICATION_DASHBOARD_ADMIN_V368.md',
    'handoff/HANDOFF_NUOVO_ASSISTENTE_V368.md'
  ];
  for (const relativeDoc of requiredDocs) {
    const target = path.join(docsRoot, relativeDoc);
    if (fileExists(target)) pass(`doc V368 presente: ${relativeDoc}`);
    else fail(`doc V368 mancante: ${relativeDoc}`);
  }
} else {
  warn('docs/zonaorientale non trovata: controllo documentale V368 saltato');
}

if (!quiet) {
  for (const message of passes) console.log(`OK: ${message}`);
  for (const message of warnings) console.warn(`WARN: ${message}`);
  for (const message of failures) console.error(`FAIL: ${message}`);
  console.log(`\nAudit publication dashboard V368: ${passes.length} ok, ${warnings.length} warning, ${failures.length} errori.`);
}

if (failures.length) process.exit(1);
