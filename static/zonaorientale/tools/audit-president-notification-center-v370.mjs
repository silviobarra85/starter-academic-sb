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
  console.error('[audit-president-notification-center-v370] site root non trovato');
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
if (Number(expectedVersion || 0) >= 370) pass(`DEPLOY_EXPECTED_VERSION_V181 >= 370: ${expectedVersion}`);
else fail(`DEPLOY_EXPECTED_VERSION_V181 inferiore a 370: ${expectedVersion || 'non trovato'}`);

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
  'window.ZonaOrientalePresidentNotificationCenterV370',
  'renderPresidentNotificationCenterV370',
  'buildPresidentNotificationCenterRowsV370',
  'renderUserAreaApprovedBeforeV370',
  'data-president-notification-scroll-v370',
  'data-president-notification-ack-trades-v370',
  'president-notification-center-v370',
  'acknowledgeTradeOutcomeNotificationsV238',
  'window.ZonaOrientalePresidentDashboardV369',
  'window.ZonaOrientaleAdminPublicationDashboardV368',
  'window.ZonaOrientaleProtectedRegressionSuiteV367',
  'window.ZonaOrientaleTradeDomainHardeningV366',
  'tradeProposalForm',
  'trade-list-panel',
  'teamNewsRequestForm',
  'data-trade-accept',
  'data-trade-reject'
];
for (const token of requiredTokens) {
  if (app.includes(token)) pass(`token protetto presente: ${token}`);
  else fail(`token protetto mancante: ${token}`);
}

if (app.includes('firebaseWrites: false') && app.includes('replacesExistingSections: false')) pass('Centro notifiche dichiara read-only e non sostitutivo');
else fail('Centro notifiche non dichiara read-only/non sostitutivo');

if (app.includes('renderPresidentNotificationCenterV370(approved)') && app.includes('renderUserAreaApprovedBeforeV370(approved)')) pass('Centro notifiche inserito tramite wrapper conservativo renderUserAreaApprovedV119');
else fail('Wrapper conservativo Area squadra V370 non rilevato');

if (fileExists(checkPath)) {
  const check = read(checkPath);
  if (check.includes('audit-president-notification-center-v370.mjs')) pass('check-zonaorientale richiama audit V370');
  else fail('check-zonaorientale non richiama audit V370');
}

if (docsRoot) {
  const protectedDoc = path.join(docsRoot, "FUNZIONALITA'.md");
  if (fileExists(protectedDoc)) pass("FUNZIONALITA'.md presente e non richiesto per V370");
  else fail("FUNZIONALITA'.md mancante");
  const requiredDocs = [
    'AI_HANDOFF_ZONAORIENTALE_CURRENT.md',
    'CURRENT_STATE.md',
    'FUNZIONALITAV370.md',
    'release/RELEASE_V370_CENTRO_NOTIFICHE_PRESIDENTE.md',
    'audit/PRESIDENT_NOTIFICATION_CENTER_MATRIX_V370.md',
    'test/PRESIDENT_NOTIFICATION_CENTER_V370.md',
    'handoff/HANDOFF_NUOVO_ASSISTENTE_V370.md'
  ];
  for (const relativeDoc of requiredDocs) {
    const target = path.join(docsRoot, relativeDoc);
    if (fileExists(target)) pass(`doc V370 presente: ${relativeDoc}`);
    else fail(`doc V370 mancante: ${relativeDoc}`);
  }
} else {
  warn('docs/zonaorientale non trovata: controllo documentale V370 saltato');
}

if (!quiet) {
  for (const message of passes) console.log(`OK: ${message}`);
  for (const message of warnings) console.warn(`WARN: ${message}`);
  for (const message of failures) console.error(`FAIL: ${message}`);
  console.log(`\nAudit Centro notifiche presidente V370: ${passes.length} ok, ${warnings.length} warning, ${failures.length} errori.`);
}

if (failures.length) process.exit(1);
