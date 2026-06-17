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
const helperV294 = path.join(siteRoot, 'assets', 'js', 'utils', 'shared-helpers-v294.js');
const helperV295 = path.join(siteRoot, 'assets', 'js', 'utils', 'shared-helpers-v295.js');
const bridgeV341 = path.join(siteRoot, 'assets', 'js', 'utils', 'shared-helper-bridge-v341.js');
const quiet = process.argv.includes('--quiet');

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function pass(label, details = '') {
  return { ok: true, label, details };
}

function fail(label, details = '') {
  return { ok: false, label, details };
}

function checkNoRuntimeReference() {
  const app = read(appFile);
  const htmlFiles = [indexFile, competitionFile, playerFile];
  const offenders = [];
  if (/import\s+[^;]*shared-helpers-v294\.js/.test(app) || /from\s+[\"'][^\"']*shared-helpers-v294\.js/.test(app)) {
    offenders.push(path.relative(siteRoot, appFile));
  }
  htmlFiles.forEach((file) => {
    const text = read(file);
    if (/(src|href)=\"[^\"]*shared-helpers-v294\.js/.test(text)) {
      offenders.push(path.relative(siteRoot, file));
    }
  });
  if (offenders.length) {
    return fail('nessun import/link runtime a shared-helpers-v294.js', offenders.join(', '));
  }
  return pass('nessun import/link runtime a shared-helpers-v294.js');
}

function checkActiveHelpers() {
  const missing = [];
  if (!fs.existsSync(helperV295)) missing.push('assets/js/utils/shared-helpers-v295.js');
  if (!fs.existsSync(bridgeV341)) missing.push('assets/js/utils/shared-helper-bridge-v341.js');
  if (missing.length) {
    return fail('helper attivi presenti', missing.join(', '));
  }
  return pass('helper attivi presenti', 'V295 + bridge V341');
}

function checkImportWiring() {
  const app = read(appFile);
  const expected = [
    'shared-helpers-v295.js?v=',
    'shared-helper-bridge-v341.js?v=',
    'createSharedHelperBridgeV341',
    'ZonaOrientaleSharedHelperBridgeV341',
    'csvEscapeV278',
    'buildListoneChangeExportCsvV278',
    'normalizeListoneSearchKeyV269',
    'normalizeDiagnosticKeyV303',
    'normalizeCalciomercatoValueV306'
  ];
  const missing = expected.filter((token) => !app.includes(token));
  if (missing.length) {
    return fail('wiring helper V295/V341 preservato', missing.join(', '));
  }
  return pass('wiring helper V295/V341 preservato');
}

function checkLegacyFileRemoved() {
  if (fs.existsSync(helperV294)) {
    return fail('shared-helpers-v294.js rimosso', 'file ancora presente: assets/js/utils/shared-helpers-v294.js');
  }
  return pass('shared-helpers-v294.js rimosso');
}

const results = [
  checkLegacyFileRemoved(),
  checkNoRuntimeReference(),
  checkActiveHelpers(),
  checkImportWiring()
];

if (!quiet) {
  console.log('Audit shared helper legacy V345');
  results.forEach((result) => {
    const icon = result.ok ? 'OK' : 'FAIL';
    const suffix = result.details ? ` - ${result.details}` : '';
    console.log(`${icon}: ${result.label}${suffix}`);
  });
}

if (results.some((result) => !result.ok)) {
  process.exit(1);
}
