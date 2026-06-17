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
const passes = [];
const rel = (abs) => relative(repoRoot, abs).replaceAll('\\\\', '/');
const read = (abs) => readFileSync(abs, 'utf8');
const pass = (message) => passes.push(message);
const fail = (message) => failures.push(message);
const mustExist = (abs) => existsSync(abs) ? pass(`${rel(abs)} presente`) : fail(`${rel(abs)} mancante`);

const htmlFiles = ['index.html', 'competition.html', 'player.html'].map((name) => resolve(siteRoot, name));
const appPath = resolve(siteRoot, 'assets', 'app.js');
const stylesPath = resolve(siteRoot, 'assets', 'styles.css');
const mobileControlsPath = resolve(siteRoot, 'assets', 'css', 'refactor', 'mobile-controls.css');
const docsFiles = [
  '00_STATO_CORRENTE_E_INDICE.md',
  '05_TEST_AUDIT_REGRESSIONI.md',
  '06_RELEASE_HANDOFF_REFACTOR_STORICO.md',
  '07_PIANIFICAZIONE_ROADMAP_PROSSIME_ATTIVITA.md'
].map((name) => resolve(docsRoot, name));

for (const file of [...htmlFiles, appPath, stylesPath, mobileControlsPath, ...docsFiles]) mustExist(file);

const html = htmlFiles.filter(existsSync).map(read).join('\n');
const app = existsSync(appPath) ? read(appPath) : '';
const styles = existsSync(stylesPath) ? read(stylesPath) : '';
const mobileControls = existsSync(mobileControlsPath) ? read(mobileControlsPath) : '';
const docsText = docsFiles.filter(existsSync).map(read).join('\n');

if (html.includes('role-backgrounds-v405r2')) fail('index/html contiene ancora riferimenti agli asset sperimentali role-backgrounds-v405r2');
else pass('riferimenti role-backgrounds-v405r2 rimossi dagli HTML');

const versionMatches = [...`${html}\n${app}`.matchAll(/\?v=([0-9][0-9]*)/g)].map((match) => match[1]);
const uniqueVersions = [...new Set(versionMatches)].sort();
if (uniqueVersions.length === 1 && uniqueVersions[0] === '405') pass('cache-buster numerici allineati a 405');
else fail(`cache-buster non allineati: ${uniqueVersions.join(', ') || 'nessuno'}`);

for (const file of htmlFiles) {
  if (!existsSync(file)) continue;
  const content = read(file);
  const name = relative(siteRoot, file);
  if (content.includes('V405 mobile cleanup')) pass(`${name} contiene footer V405 mobile cleanup`);
  else fail(`${name} non contiene footer V405 mobile cleanup`);
}

const requiredRoleTokens = [
  'player-role-gk',
  'player-role-def',
  'player-role-mid',
  'player-role-fwd',
  'ZonaOrientaleRoleBackgroundsV404'
];
for (const token of requiredRoleTokens) {
  if (styles.includes(token) || app.includes(token)) pass(`token colori ruolo preservato: ${token}`);
  else fail(`token colori ruolo mancante: ${token}`);
}

const mobileTokens = [
  'V405M - Pulizia conservativa mobile',
  '-webkit-tap-highlight-color',
  'scrollbar-gutter: stable',
  'env(safe-area-inset-bottom',
  'focus-visible'
];
for (const token of mobileTokens) {
  if (mobileControls.includes(token)) pass(`ottimizzazione mobile presente: ${token}`);
  else fail(`ottimizzazione mobile mancante: ${token}`);
}

if (docsText.includes('V405M - Pulizia mobile conservativa')) pass('documentazione consolidata aggiornata per V405M');
else fail('documentazione consolidata non aggiornata per V405M');

if (!quiet) {
  for (const message of passes) console.log(`OK ${message}`);
  for (const message of failures) console.error(`FAIL ${message}`);
  console.log(`\nAudit mobile cleanup V405M: ${passes.length} ok, ${failures.length} errori.`);
}

if (failures.length > 0) process.exit(1);
