#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const quiet = process.argv.includes('--quiet');
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(scriptDir, '..');
const appPath = path.join(root, 'assets', 'app.js');
const htmlFiles = ['index.html', 'competition.html', 'player.html'].map((name) => path.join(root, name));
const appliedDocsRoot = path.resolve(root, '..', '..', 'docs', 'zonaorientale');
const packageDocsRoot = path.resolve(root, '..', 'docs', 'zonaorientale');
const docsRoot = fs.existsSync(appliedDocsRoot) ? appliedDocsRoot : packageDocsRoot;
const requiredDocs = [
  'FUNZIONALITAV357.md',
  'handoff/HANDOFF_NUOVO_ASSISTENTE_V357.md',
  'refactor/MANUAL_QA_PANEL_V357.md',
  'audit/MANUAL_QA_PANEL_MATRIX_V357.md',
  'test/MANUAL_QA_INTERFACCIA_V357.md',
  'release/RELEASE_V357_MANUAL_QA_PANEL.md'
];
const failures = [];
const checks = [];
const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
const app = read(appPath);
const assert = (condition, label) => {
  checks.push({ label, ok: Boolean(condition) });
  if (!condition) failures.push(label);
};

assert(app.includes('DEPLOY_EXPECTED_VERSION_V181 = "357"'), 'runtime atteso V357');
assert(app.includes('ZonaOrientaleManualQaPanelV357'), 'marker runtime pannello QA V357 presente');
assert(app.includes('manualQaPanelV357'), 'root DOM pannello QA presente');
assert(app.includes('state?.isAdmin') || app.includes('state.isAdmin'), 'gating solo Admin presente');
assert(app.includes('zonaorientale.manualQa.v356'), 'riuso storage tracker V356 presente');
assert(app.includes('simulateIncomingProposal'), 'azione simulatore trade esposta nella checklist');
assert(app.includes('calciomercatoArchiveAdminToolsV323'), 'check Solo Admin Calciomercato presente');
assert(app.includes('exportMarkdown'), 'export riepilogo QA presente');
for (const file of htmlFiles) {
  const html = read(file);
  assert(html.includes('?v=357'), `${path.basename(file)} cache-buster V357`);
  assert(html.includes('V357'), `${path.basename(file)} footer/versione V357`);
}
for (const doc of requiredDocs) {
  assert(fs.existsSync(path.join(docsRoot, doc)), `documento ${doc} presente`);
}

if (!quiet) {
  for (const row of checks) console.log(`${row.ok ? 'OK' : 'FAIL'} ${row.label}`);
}
if (failures.length) {
  console.error(`Audit manual QA panel V357 fallito: ${failures.join('; ')}`);
  process.exit(1);
}
if (!quiet) console.log(`Audit manual QA panel V357 superato: ${checks.length} controlli.`);
