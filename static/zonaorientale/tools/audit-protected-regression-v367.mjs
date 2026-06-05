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
  console.error('[audit-protected-regression-v367] site root non trovato');
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
const rel = (file) => path.relative(siteRoot, file).replaceAll('\\\\', '/');
const stripAssetRef = (ref) => ref.split('#')[0].split('?')[0];
const fileExists = (file) => fs.existsSync(file) && fs.statSync(file).isFile();
const walk = (dir, predicate = () => true, out = []) => {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, predicate, out);
    else if (predicate(full)) out.push(full);
  }
  return out;
};

const appPath = path.join(siteRoot, 'assets', 'app.js');
const indexPath = path.join(siteRoot, 'index.html');
const competitionPath = path.join(siteRoot, 'competition.html');
const playerPath = path.join(siteRoot, 'player.html');
const htmlFiles = [indexPath, competitionPath, playerPath].filter(fileExists);

for (const file of [appPath, indexPath, competitionPath, playerPath]) {
  if (fileExists(file)) pass(`${rel(file)} presente`);
  else fail(`${rel(file)} mancante`);
}

const app = fileExists(appPath) ? read(appPath) : '';
const expectedVersionMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181\s*=\s*["'](\d+)["']/);
const expectedVersion = expectedVersionMatch?.[1] || '';
if (Number(expectedVersion) >= 367) pass(`DEPLOY_EXPECTED_VERSION_V181 >= 367: ${expectedVersion}`);
else fail(`DEPLOY_EXPECTED_VERSION_V181 inferiore a 367 o non trovato: ${expectedVersion || 'non trovato'}`);

for (const htmlFile of htmlFiles) {
  const html = read(htmlFile);
  const name = path.basename(htmlFile);
  if (expectedVersion && html.includes(`V${expectedVersion}`)) pass(`${name} footer/versione corrente V${expectedVersion} presente`);
  else fail(`${name} footer/versione corrente V${expectedVersion || 'n/d'} mancante`);
  const versions = [...html.matchAll(/[?&]v=(\d+)/g)].map((match) => match[1]);
  const unique = [...new Set(versions)];
  if (unique.length && expectedVersion && unique.every((version) => version === expectedVersion)) pass(`${name} cache-buster allineati a v=${expectedVersion}`);
  else fail(`${name} cache-buster non allineati alla versione corrente ${expectedVersion || 'n/d'}: ${unique.join(', ') || 'nessuno'}`);

  const assetRefs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((ref) => ref.startsWith('./') || ref.startsWith('../') || ref.startsWith('assets/'))
    .map(stripAssetRef)
    .filter((ref) => /\.(css|js|json|ico|png|jpg|jpeg|webp|svg|webmanifest)$/i.test(ref));
  for (const ref of assetRefs) {
    const target = path.resolve(path.dirname(htmlFile), ref);
    if (fileExists(target)) pass(`${name} link locale ok: ${ref}`);
    else fail(`${name} link locale mancante: ${ref}`);
  }
}

const jsFiles = walk(path.join(siteRoot, 'assets'), (file) => file.endsWith('.js'));
for (const jsFile of jsFiles) {
  const result = spawnSync(process.execPath, ['--check', jsFile], { encoding: 'utf8' });
  if (result.status === 0) pass(`sintassi JS ok: ${rel(jsFile)}`);
  else fail(`sintassi JS ko: ${rel(jsFile)} ${result.stderr || result.stdout}`.trim());
}

const localImportPattern = /(?:from\s+["']|import\s*\(\s*["'])(\.\.?\/[^"']+)["']/g;
for (const jsFile of jsFiles) {
  const source = read(jsFile);
  for (const match of source.matchAll(localImportPattern)) {
    const ref = stripAssetRef(match[1]);
    const target = path.resolve(path.dirname(jsFile), ref);
    if (fileExists(target)) pass(`import locale ok: ${rel(jsFile)} -> ${ref}`);
    else fail(`import locale mancante: ${rel(jsFile)} -> ${ref}`);
  }
}

const jsonFiles = walk(path.join(siteRoot, 'assets'), (file) => file.endsWith('.json'));
for (const jsonFile of jsonFiles) {
  try {
    JSON.parse(read(jsonFile));
    pass(`JSON valido: ${rel(jsonFile)}`);
  } catch (error) {
    fail(`JSON non valido: ${rel(jsonFile)} ${error.message}`);
  }
}

const requiredAppTokens = [
  'window.ZonaOrientaleManualQaPanelV358',
  'window.ZonaOrientaleCalciomercatoPlayerDiagnosticsV359',
  'window.ZonaOrientaleTradeSimulatorPanelV361',
  'window.ZonaOrientaleTradeSimulatorTargetPanelV362',
  'window.ZonaOrientaleTradeSimulatorTargetResolutionV364',
  'window.ZonaOrientaleProtectedStabilizationV365',
  'window.ZonaOrientaleTradeDomainHardeningV366',
  'window.ZonaOrientaleProtectedRegressionSuiteV367',
  'installTradeNotificationSimulatorV255',
  'ZonaOrientaleTradeSimulatorLocalActionsV349',
  'createCalciomercatoPlayerHelpersV359',
  'createSharedHelperBridgeV341',
  'updateNegotiationStatusV119'
];
for (const token of requiredAppTokens) {
  if (app.includes(token)) pass(`token runtime preservato: ${token}`);
  else fail(`token runtime mancante: ${token}`);
}

const requiredFiles = [
  'assets/js/dev/trade-notification-simulator-v255.js',
  'assets/js/market/transfer-market.js',
  'assets/js/calciomercato/calciomercato-players-v359.js',
  'assets/js/utils/shared-helper-bridge-v341.js',
  'assets/css/refactor/calciomercato.css',
  'assets/css/refactor/listone.css',
  'assets/css/mobile-suite-v168.css',
  'assets/competitions/manifest.json',
  'assets/calciomercato/links.json',
  'assets/calciomercato/archive/manifest.json'
];
for (const relativeFile of requiredFiles) {
  const target = path.join(siteRoot, relativeFile);
  if (fileExists(target)) pass(`file protetto presente: ${relativeFile}`);
  else fail(`file protetto mancante: ${relativeFile}`);
}

if (docsRoot) {
  const protectedDoc = path.join(docsRoot, "FUNZIONALITA'.md");
  if (fileExists(protectedDoc)) pass("FUNZIONALITA'.md presente e protetto");
  else fail("FUNZIONALITA'.md mancante");
  const requiredDocs = [
    'AI_HANDOFF_ZONAORIENTALE_CURRENT.md',
    'CURRENT_STATE.md',
    'release/RELEASE_V367_SMOKE_TEST_PROTETTI.md',
    'audit/PROTECTED_REGRESSION_MATRIX_V367.md',
    'test/SMOKE_TEST_AUTOMATICI_V367.md',
    'handoff/HANDOFF_NUOVO_ASSISTENTE_V367.md'
  ];
  for (const relativeDoc of requiredDocs) {
    const target = path.join(docsRoot, relativeDoc);
    if (fileExists(target)) pass(`doc V367 presente: ${relativeDoc}`);
    else fail(`doc V367 mancante: ${relativeDoc}`);
  }
} else {
  warn('docs/zonaorientale non trovata: controllo documentale V367 saltato');
}

if (!quiet) {
  for (const message of passes) console.log(`OK: ${message}`);
  for (const message of warnings) console.warn(`WARN: ${message}`);
  for (const message of failures) console.error(`FAIL: ${message}`);
  console.log(`\nAudit protected regression V367: ${passes.length} ok, ${warnings.length} warning, ${failures.length} errori.`);
}

if (failures.length) process.exit(1);
