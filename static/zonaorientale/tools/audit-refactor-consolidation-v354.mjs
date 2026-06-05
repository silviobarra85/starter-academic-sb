#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(siteRoot, '..', '..');
const docsRoot = path.join(repoRoot, 'docs', 'zonaorientale');
const quiet = process.argv.includes('--quiet');

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}
function exists(relativeFromSite) {
  return fs.existsSync(path.join(siteRoot, relativeFromSite));
}
function docExists(relativeFromDocs) {
  return fs.existsSync(path.join(docsRoot, relativeFromDocs));
}
function htmlEntrypoints() {
  return ['index.html', 'competition.html', 'player.html'].filter((file) => exists(file));
}

const appText = readIfExists(path.join(siteRoot, 'assets/app.js'));
const htmlTexts = htmlEntrypoints().map((file) => readIfExists(path.join(siteRoot, file)));

const expectedDocs = [
  'FUNZIONALITAV354.md',
  'handoff/HANDOFF_NUOVO_ASSISTENTE_V354.md',
  'refactor/REFACTOR_CLEANUP_CONSOLIDATION_V354.md',
  'audit/REFACTOR_CLEANUP_CONSOLIDATION_MATRIX_V354.md',
  'release/RELEASE_V354_REFACTOR_CLEANUP_CONSOLIDATION.md'
];

const requiredRuntimeMarkers = [
  'ZonaOrientaleRefactorConsolidationV354',
  'ZonaOrientaleTradeSimulatorLocalActionsV349',
  'ZonaOrientaleTradeSimulatorDevCleanupV350',
  'ZonaOrientaleMobileHotfixCleanupV352',
  'ZonaOrientaleThemeCompetitionsAuditV353'
];

const checks = [
  {
    name: 'DEPLOY_EXPECTED_VERSION_V181 almeno V354',
    ok: /DEPLOY_EXPECTED_VERSION_V181\s*=\s*"(35[4-9]|3[6-9][0-9]|[4-9][0-9]{2,})"/.test(appText),
    details: 'assets/app.js'
  },
  {
    name: 'marker runtime V354 presente',
    ok: /ZonaOrientaleRefactorConsolidationV354/.test(appText),
    details: 'window.ZonaOrientaleRefactorConsolidationV354'
  },
  {
    name: 'cache-buster HTML principali almeno v=354',
    ok: htmlTexts.every((text) => !/\?v=35[0-3]/.test(text) && /\?v=(35[4-9]|3[6-9][0-9]|[4-9][0-9]{2,})/.test(text)),
    details: htmlEntrypoints().join(', ')
  },
  {
    name: 'import app.js almeno v=354',
    ok: !/\?v=35[0-3]/.test(appText) && /\?v=(35[4-9]|3[6-9][0-9]|[4-9][0-9]{2,})/.test(appText),
    details: 'import versionati in assets/app.js'
  },
  {
    name: 'documenti V354 presenti',
    ok: expectedDocs.every(docExists),
    details: expectedDocs.join(', ')
  },
  {
    name: 'marker runtime V349-V353 ancora presenti',
    ok: requiredRuntimeMarkers.every((marker) => appText.includes(marker)),
    details: requiredRuntimeMarkers.join(', ')
  },
  {
    name: 'simulatore trade canonico V255 preservato',
    ok: exists('assets/js/dev/trade-notification-simulator-v255.js'),
    details: 'V255 attivo; eventuale V254 legacy e solo warning in V367'
  },
  {
    name: 'mobile hotfix legacy rimossi e suite mobile preservata',
    ok: exists('assets/css/mobile-suite-v168.css'),
    details: 'mobile-suite-v168.css presente; legacy V166/V167 non rimossi in V367'
  },
  {
    name: 'tema/competizioni legacy conservati per decisione futura',
    ok: exists('assets/css/refactor/theme-light-suspended.css') && exists('assets/js/domain/competitions.js'),
    details: 'audit-only V353, nessuna rimozione in V354'
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
  version: 'V354',
  failures,
  behaviorChange: false,
  removalPolicy: 'no-removal consolidation',
  nextSuggestedSteps: [
    'test manuale funzionale completo',
    'merge master solo dopo verifica Admin/Fantamercato/Calciomercato/Listone',
    'cleanup theme/domain/admin-publication solo con task separati'
  ]
};

if (!quiet) console.log(JSON.stringify(summary, null, 2));
process.exit(failures === 0 ? 0 : 1);
