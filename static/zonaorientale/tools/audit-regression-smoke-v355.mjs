#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const toolsDir = dirname(__filename);
const siteRoot = resolve(toolsDir, '..');
const repoRoot = resolve(siteRoot, '..', '..');
const docsRoot = resolve(repoRoot, 'docs', 'zonaorientale');
const quiet = process.argv.includes('--quiet');

const failures = [];
const warnings = [];
const passes = [];

const rel = (abs) => relative(repoRoot, abs).replaceAll('\\\\', '/');
const read = (abs) => readFileSync(abs, 'utf8');
const pass = (message) => passes.push(message);
const warn = (message) => warnings.push(message);
const fail = (message) => failures.push(message);

const mustExist = (abs, label = rel(abs)) => {
  if (existsSync(abs)) pass(`${label} presente`);
  else fail(`${label} mancante`);
};

const mustNotExist = (abs, label = rel(abs)) => {
  if (existsSync(abs)) warn(`${label} ancora presente: non rimosso da V367 per policy no-regression`);
  else pass(`${label} assente come previsto`);
};

const appPath = resolve(siteRoot, 'assets', 'app.js');
const indexPath = resolve(siteRoot, 'index.html');
const competitionPath = resolve(siteRoot, 'competition.html');
const playerPath = resolve(siteRoot, 'player.html');

mustExist(appPath, 'assets/app.js');
mustExist(indexPath, 'index.html');
mustExist(competitionPath, 'competition.html');
mustExist(playerPath, 'player.html');

const app = existsSync(appPath) ? read(appPath) : '';
const htmlFiles = [indexPath, competitionPath, playerPath].filter(existsSync);
const htmlJoined = htmlFiles.map(read).join('\n');

if (/DEPLOY_EXPECTED_VERSION_V181\s*=\s*"(35[5-9]|3[6-9][0-9]|[4-9][0-9]{2,})"/.test(app)) pass('DEPLOY_EXPECTED_VERSION_V181 almeno V355');
else fail('DEPLOY_EXPECTED_VERSION_V181 inferiore a V355');

if (app.includes('window.ZonaOrientaleRegressionSmokeSuiteV355')) pass('marker runtime V355 presente');
else fail('marker runtime V355 mancante');

if (app.includes('window.ZonaOrientaleRefactorConsolidationV354')) pass('marker consolidamento V354 preservato');
else fail('marker consolidamento V354 mancante');

if (htmlJoined.includes('?v=354')) fail('HTML contiene ancora cache-buster v=354');
else pass('HTML senza cache-buster v=354');

if (/\?v=(35[5-9]|3[6-9][0-9]|[4-9][0-9]{2,})/.test(htmlJoined)) pass('HTML contiene cache-buster almeno v=355');
else fail('HTML non contiene cache-buster almeno v=355');

if (app.includes('?v=354')) fail('assets/app.js contiene ancora import/cache-buster v=354');
else pass('assets/app.js senza import/cache-buster v=354');

const requiredRuntimeTokens = [
  'createCalciomercatoImageHelpersV334',
  'createCalciomercatoPlayerHelpersV359',
  'createCalciomercatoArticleRendererV338',
  'createCalciomercatoFiltersV339',
  'createCalciomercatoArchiveAdminV340',
  'createSharedHelperBridgeV341',
  'installTradeNotificationSimulatorV255',
  'ZonaOrientaleTradeSimulatorLocalActionsV349',
  'ZonaOrientaleAdminDiagnosticsV343'
];
for (const token of requiredRuntimeTokens) {
  if (app.includes(token)) pass(`runtime token preservato: ${token}`);
  else fail(`runtime token mancante: ${token}`);
}

const requiredFiles = [
  resolve(siteRoot, 'assets/js/calciomercato/calciomercato-images-v334.js'),
  resolve(siteRoot, 'assets/js/calciomercato/calciomercato-players-v359.js'),
  resolve(siteRoot, 'assets/js/calciomercato/calciomercato-render-v338.js'),
  resolve(siteRoot, 'assets/js/calciomercato/calciomercato-filters-v339.js'),
  resolve(siteRoot, 'assets/js/calciomercato/calciomercato-admin-v340.js'),
  resolve(siteRoot, 'assets/js/utils/shared-helpers-v295.js'),
  resolve(siteRoot, 'assets/js/utils/shared-helper-bridge-v341.js'),
  resolve(siteRoot, 'assets/js/dev/trade-notification-simulator-v255.js'),
  resolve(siteRoot, 'assets/css/refactor/calciomercato.css'),
  resolve(siteRoot, 'assets/css/refactor/listone.css'),
  resolve(siteRoot, 'assets/css/mobile-suite-v168.css'),
  resolve(siteRoot, 'assets/calciomercato/links.json'),
  resolve(siteRoot, 'assets/calciomercato/archive/manifest.json')
];
for (const file of requiredFiles) mustExist(file);

const removedFiles = [
  resolve(siteRoot, 'assets/css/refactor/mobile-controls-v291.css'),
  resolve(siteRoot, 'assets/css/refactor/rosters-tables-v291.css'),
  resolve(siteRoot, 'assets/css/refactor/mobile-controls-v292.css'),
  resolve(siteRoot, 'assets/css/refactor/rosters-tables-v292.css'),
  resolve(siteRoot, 'assets/css/refactor/theme-light-suspended-v292.css'),
  resolve(siteRoot, 'assets/js/calciomercato/calciomercato-players-v335.js'),
  resolve(siteRoot, 'assets/js/calciomercato/calciomercato-players-v337.js'),
  resolve(siteRoot, 'assets/js/utils/shared-helpers-v294.js'),
  resolve(siteRoot, 'assets/js/trade-notification-simulator-v255.js'),
  resolve(siteRoot, 'assets/js/dev/trade-notification-simulator-v254.js'),
  resolve(siteRoot, 'assets/css/mobile-hotfix-v166.css'),
  resolve(siteRoot, 'assets/css/mobile-hotfix-v167.css')
];
for (const file of removedFiles) mustNotExist(file);

const preservedLegacyFiles = [
  resolve(siteRoot, 'assets/js/refactor/admin-publication-workflow-v213.js'),
  resolve(siteRoot, 'assets/css/refactor/theme-light-suspended.css'),
  resolve(siteRoot, 'assets/js/domain/competitions.js')
];
for (const file of preservedLegacyFiles) {
  if (existsSync(file)) pass(`${rel(file)} conservato per rollback/audit`);
  else warn(`${rel(file)} non trovato: verificarne eventuale rimozione manuale`);
}

const docs = [
  resolve(docsRoot, 'FUNZIONALITAV355.md'),
  resolve(docsRoot, 'handoff/HANDOFF_NUOVO_ASSISTENTE_V355.md'),
  resolve(docsRoot, 'refactor/REGRESSION_SMOKE_SUITE_V355.md'),
  resolve(docsRoot, 'audit/REGRESSION_SMOKE_MATRIX_V355.md'),
  resolve(docsRoot, 'release/RELEASE_V355_REGRESSION_SMOKE_SUITE.md'),
  resolve(docsRoot, 'test/TEST_MANUALE_COMPLETO_V355.md')
];
for (const doc of docs) mustExist(doc);

const protectedDoc = resolve(docsRoot, "FUNZIONALITA'.md");
mustExist(protectedDoc, "docs/zonaorientale/FUNZIONALITA'.md protetto");

if (!quiet) {
  for (const message of passes) console.log(`OK ${message}`);
  for (const message of warnings) console.warn(`WARN ${message}`);
  for (const message of failures) console.error(`FAIL ${message}`);
  console.log(`\nAudit regression smoke V355: ${passes.length} ok, ${warnings.length} warning, ${failures.length} errori.`);
}

if (failures.length > 0) process.exit(1);
