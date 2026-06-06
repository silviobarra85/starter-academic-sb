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
  console.error('[audit-soccer-data-v371] site root non trovato');
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
const manifestPath = path.join(siteRoot, 'assets', 'soccer-data', 'manifest.json');
const mappingPath = path.join(siteRoot, 'assets', 'soccer-data', 'fbref-player-map.v371.json');
const mappingCsvPath = path.join(siteRoot, 'assets', 'soccer-data', 'fbref-player-map.v371.csv');
const latestListonePath = path.join(siteRoot, 'assets', 'listoni', '2026-06-04.json');
const checkPath = path.join(siteRoot, 'tools', 'check-zonaorientale.sh');
const files = [appPath, indexPath, competitionPath, playerPath, manifestPath, mappingPath, mappingCsvPath, latestListonePath, checkPath];
for (const file of files) {
  if (fileExists(file)) pass(`${relSite(file)} presente`);
  else fail(`${relSite(file)} mancante`);
}

const app = fileExists(appPath) ? read(appPath) : '';
const index = fileExists(indexPath) ? read(indexPath) : '';
const check = fileExists(checkPath) ? read(checkPath) : '';

if (fileExists(appPath)) {
  const syntax = spawnSync(process.execPath, ['--check', appPath], { encoding: 'utf8' });
  if (syntax.status === 0) pass('assets/app.js sintassi ok');
  else fail(`assets/app.js sintassi ko: ${syntax.stderr || syntax.stdout}`.trim());
}

const expectedVersion = app.match(/DEPLOY_EXPECTED_VERSION_V181\s*=\s*["'](\d+)["']/)?.[1] || '';
if (Number(expectedVersion) >= 371) pass(`DEPLOY_EXPECTED_VERSION_V181 compatibile con V371: ${expectedVersion}`);
else fail(`DEPLOY_EXPECTED_VERSION_V181 sotto V371: ${expectedVersion || 'non trovato'}`);

for (const [name, file] of [['index.html', indexPath], ['competition.html', competitionPath], ['player.html', playerPath]]) {
  const html = fileExists(file) ? read(file) : '';
  if (/V(37[1-9]|3[8-9][0-9]|[4-9][0-9]{2,}) .*Soccer Data|V371 Soccer Data protetto/.test(html)) pass(`${name} footer Soccer Data V371+ presente`);
  else fail(`${name} footer Soccer Data V371+ mancante`);
  const unique = [...new Set(Array.from(html.matchAll(/[?&]v=(\d+)/g)).map((match) => match[1]))];
  if (unique.length && unique.every((version) => Number(version) >= 371)) pass(`${name} cache-buster compatibili V371+`);
  else fail(`${name} cache-buster sotto V371: ${unique.join(', ') || 'nessuno'}`);
}

const uniqueAppVersions = [...new Set(Array.from(app.matchAll(/[?&]v=(\d+)/g)).map((match) => match[1]))];
if (!uniqueAppVersions.length || uniqueAppVersions.every((version) => Number(version) >= 371)) pass('assets/app.js import/cache statici compatibili V371+');
else fail(`assets/app.js import/cache statici sotto V371: ${uniqueAppVersions.join(', ')}`);

const requiredIndexTokens = [
  'data-page-link="soccerdata"',
  'data-page="soccerdata"',
  'soccerDataTableBodyV371',
  'soccerDataCopyCsvV371',
  'soccerDataDownloadMapV371'
];
for (const token of requiredIndexTokens) {
  if (index.includes(token)) pass(`index token Soccer Data presente: ${token}`);
  else fail(`index token Soccer Data mancante: ${token}`);
}

const requiredAppTokens = [
  'window.ZonaOrientaleSoccerDataV371',
  'isSoccerDataActiveListonePlayerV371',
  "code === 'IN_LISTONE'",
  'SOCCER_DATA_MANIFEST_URL_V371',
  'fbref-player-map.v371.json',
  'firebaseWrites: false',
  'liveScraping: false',
  'replacesExistingSections: false',
  'window.ZonaOrientalePresidentNotificationCenterV370',
  'window.ZonaOrientalePresidentDashboardV369',
  'window.ZonaOrientaleAdminPublicationDashboardV368'
];
for (const token of requiredAppTokens) {
  if (app.includes(token)) pass(`app token protetto presente: ${token}`);
  else fail(`app token protetto mancante: ${token}`);
}

if (check.includes('audit-soccer-data-v371.mjs')) pass('check-zonaorientale richiama audit Soccer Data V371');
else fail('check-zonaorientale non richiama audit Soccer Data V371');

let manifest = null;
let mapping = null;
let listone = null;
try { manifest = JSON.parse(read(manifestPath)); pass('manifest Soccer Data JSON valido'); } catch (error) { fail(`manifest Soccer Data JSON non valido: ${error.message}`); }
try { mapping = JSON.parse(read(mappingPath)); pass('mapping Soccer Data JSON valido'); } catch (error) { fail(`mapping Soccer Data JSON non valido: ${error.message}`); }
try { listone = JSON.parse(read(latestListonePath)); pass('listone 2026-06-04 JSON valido'); } catch (error) { fail(`listone JSON non valido: ${error.message}`); }

if (manifest) {
  if (Number(String(manifest?.meta?.version || '').replace(/^V/, '')) >= 371) pass(`manifest versione compatibile V371+: ${manifest.meta.version}`);
  else fail('manifest versione V371+ mancante');
  if (manifest?.meta?.readOnly === true && manifest?.meta?.firebaseWrites === false && manifest?.meta?.liveScraping === false) pass('manifest dichiara read-only/no Firebase/no scraping live');
  else fail('manifest non dichiara chiaramente read-only/no Firebase/no scraping live');
  if (/^fbref-player-map\.v\d+\.json$/.test(String(manifest.currentMapping || ''))) pass(`manifest punta a mapping Soccer Data compatibile: ${manifest.currentMapping}`);
  else fail(`manifest currentMapping inatteso: ${manifest.currentMapping || 'vuoto'}`);
}

if (mapping && listone) {
  const activeRows = (listone.players || []).filter((player) => String(player.statusCode || '').toUpperCase() === 'IN_LISTONE');
  const asteriskRows = (listone.players || []).filter((player) => String(player.statusCode || '').toUpperCase() === 'ASTERISCATO');
  if ((mapping.players || []).length === activeRows.length) pass(`mapping contiene solo attivi IN_LISTONE: ${activeRows.length}`);
  else fail(`mapping righe ${mapping.players?.length || 0}, attesi IN_LISTONE ${activeRows.length}`);
  const invalid = (mapping.players || []).filter((player) => String(player.statusCode || '').toUpperCase() !== 'IN_LISTONE');
  if (!invalid.length) pass('nessun asteriscato/non attivo nel mapping');
  else fail(`mapping contiene ${invalid.length} record non IN_LISTONE`);
  if (asteriskRows.length > 0) pass(`asteriscati esclusi dal mapping: ${asteriskRows.length}`);
  else warn('nessun asteriscato trovato nel listone sorgente');
  const duplicateKeys = new Set();
  const seen = new Set();
  for (const player of mapping.players || []) {
    if (seen.has(player.playerKey)) duplicateKeys.add(player.playerKey);
    seen.add(player.playerKey);
  }
  if (!duplicateKeys.size) pass('playerKey mapping univoci');
  else fail(`playerKey duplicati nel mapping: ${Array.from(duplicateKeys).slice(0, 5).join(', ')}`);
}

if (docsRoot) {
  const protectedDoc = path.join(docsRoot, "FUNZIONALITA'.md");
  if (fileExists(protectedDoc)) pass("FUNZIONALITA'.md presente e non richiesto per V371");
  else fail("FUNZIONALITA'.md mancante");
  const requiredDocs = [
    'AI_HANDOFF_ZONAORIENTALE_CURRENT.md',
    'CURRENT_STATE.md',
    'FUNZIONALITAV371.md',
    'release/RELEASE_V371_SOCCER_DATA_PROTETTO.md',
    'audit/SOCCER_DATA_MATRIX_V371.md',
    'test/SOCCER_DATA_V371.md',
    'handoff/HANDOFF_NUOVO_ASSISTENTE_V371.md'
  ];
  for (const relativeDoc of requiredDocs) {
    const target = path.join(docsRoot, relativeDoc);
    if (fileExists(target)) pass(`documento presente: ${relativeDoc}`);
    else fail(`documento mancante: ${relativeDoc}`);
  }
} else {
  warn('docs/zonaorientale non trovato: audit documentale parziale');
}

if (!quiet) {
  passes.forEach((message) => console.log(`PASS ${message}`));
  warnings.forEach((message) => console.warn(`WARN ${message}`));
  failures.forEach((message) => console.error(`FAIL ${message}`));
}

if (failures.length) {
  console.error(`[audit-soccer-data-v371] fallimenti: ${failures.length}, warning: ${warnings.length}`);
  process.exit(1);
}
if (!quiet) console.log(`[audit-soccer-data-v371] ok: ${passes.length}, warning: ${warnings.length}`);
