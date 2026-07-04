#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../..');
const staticRoot = path.join(repoRoot, 'static');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const expectedVersion = '522';
const currentRoot = path.join(staticRoot, 'fanta-engine/data/shared-assets/current');
const requiredCentralFiles = [
  'assets/listoni/manifest.json',
  'assets/calciomercato/links.json',
  'assets/calciomercato/archive/manifest.json',
  'manifest-v522.json',
  'README.md'
];

function fail(message) {
  console.error(`Audit V522 fallito: ${message}`);
  process.exit(1);
}

function read(rel) {
  const abs = path.join(repoRoot, rel);
  if (!fs.existsSync(abs)) fail(`file mancante: ${rel}`);
  return fs.readFileSync(abs, 'utf8');
}

function readJson(rel) {
  try { return JSON.parse(read(rel)); }
  catch (error) { fail(`JSON non valido: ${rel} (${error.message})`); }
}

function hashFile(abs) {
  return crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
}

for (const rel of requiredCentralFiles) {
  const abs = path.join(currentRoot, rel);
  if (!fs.existsSync(abs)) fail(`asset centrale current mancante: ${rel}`);
}

const centralManifest = readJson('static/fanta-engine/data/shared-assets/current/manifest-v522.json');
if (centralManifest.version !== 522) fail('manifest-v522.json non dichiara version 522');
if (!centralManifest.uploadPolicy?.uploadOnce) fail('manifest-v522.json non abilita uploadOnce');
if (!centralManifest.uploadPolicy?.leagueLocalCopiesAreFallbackOnly) fail('manifest-v522.json non marca le copie locali come fallback');

const centralFiles = Array.isArray(centralManifest.files) ? centralManifest.files : [];
if (centralFiles.length < 40) fail(`manifest-v522.json contiene solo ${centralFiles.length} file, attesi asset comuni completi`);
for (const item of centralFiles) {
  const abs = path.join(currentRoot, item.path || '');
  if (!fs.existsSync(abs)) fail(`file dichiarato nel manifest current mancante: ${item.path}`);
  const actual = hashFile(abs);
  if (item.sha256 && item.sha256 !== actual) fail(`hash non allineato per ${item.path}`);
}

const autoload = read('static/fanta-engine/js/core/public-data-autoload-v512.js');
for (const token of ['PUBLIC_DATA_AUTOLOAD_VERSION_V522', 'createPublicDataAutoloadV522', 'installPublicDataAutoloadV522']) {
  if (!autoload.includes(token)) fail(`public-data-autoload senza ${token}`);
}

for (const slug of leagues) {
  const cfg = readJson(`static/${slug}/assets/league-config.json`);
  if (cfg.currentVersion !== 522) fail(`${slug}: currentVersion non e' 522`);
  if (cfg.runtime?.publicDataAutoloadVersion !== 'V522') fail(`${slug}: publicDataAutoloadVersion non e' V522`);
  if (cfg.runtime?.sharedAssetsSingleUploadVersion !== 'V522') fail(`${slug}: sharedAssetsSingleUploadVersion non e' V522`);
  const paths = cfg.dataPaths || {};
  for (const [key, value] of Object.entries({
    listoniManifest: '../fanta-engine/data/shared-assets/current/assets/listoni/manifest.json',
    listoniBase: '../fanta-engine/data/shared-assets/current/assets/listoni/',
    calciomercatoLinks: '../fanta-engine/data/shared-assets/current/assets/calciomercato/links.json',
    calciomercatoArchiveManifest: '../fanta-engine/data/shared-assets/current/assets/calciomercato/archive/manifest.json',
    calciomercatoArchiveBase: '../fanta-engine/data/shared-assets/current/assets/calciomercato/archive/'
  })) {
    if (paths[key] !== value) fail(`${slug}: dataPaths.${key} non punta a current`);
  }
  for (const fallbackKey of ['listoniManifestFallback', 'listoniBaseFallback', 'calciomercatoLinksFallback', 'calciomercatoArchiveManifestFallback', 'calciomercatoArchiveBaseFallback']) {
    if (!String(paths[fallbackKey] || '').startsWith('./assets/')) fail(`${slug}: fallback locale ${fallbackKey} non preservato`);
  }

  const app = read(`static/${slug}/assets/app.js`);
  if (!app.includes('installPublicDataAutoloadV522')) fail(`${slug}: app.js non importa installPublicDataAutoloadV522`);
  if (!app.includes('public-data-autoload-v512.js?v=522')) fail(`${slug}: app.js non usa cache-buster public-data-autoload v522`);
  if (app.includes('installPublicDataAutoloadV521')) fail(`${slug}: app.js contiene ancora installPublicDataAutoloadV521`);

  const staticService = read(`static/${slug}/assets/js/data/static-files-service.js`);
  if (!staticService.includes('league-config-v443.js?v=522')) fail(`${slug}: static-files-service non importa league-config v522`);
  if (staticService.includes('shared-assets/v485')) fail(`${slug}: static-files-service contiene ancora shared-assets/v485`);
  if (!staticService.includes('shared-assets/current/assets/listoni/manifest.json')) fail(`${slug}: static-files-service non punta al manifest listoni current`);

  const leagueRuntime = read(`static/${slug}/assets/js/core/league-config-v443.js`);
  if (leagueRuntime.includes('shared-assets/v485')) fail(`${slug}: league-config-v443.js contiene ancora shared-assets/v485`);
  if (!leagueRuntime.includes('shared-assets/current/assets/calciomercato/archive/')) fail(`${slug}: league-config-v443.js non punta al calciomercato current`);
  if (!leagueRuntime.includes('formValidatorsV506: true')) fail(`${slug}: formValidatorsV506 non e' esplicito true`);

  for (const page of ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'news.html']) {
    const html = read(`static/${slug}/${page}`);
    if (html.includes('?v=521')) fail(`${slug}/${page}: contiene ancora ?v=521`);
    if (html.includes('?v=512')) fail(`${slug}/${page}: contiene ancora ?v=512`);
    if (page === 'index.html' && !html.includes('?v=522')) fail(`${slug}/${page}: non contiene cache-buster ?v=522`);
  }

  const publicationWorkflow = read(`static/${slug}/assets/js/refactor/admin-publication-workflow-v213.js`);
  if (publicationWorkflow.includes(`static/${slug}/assets/listoni/manifest.json`)) fail(`${slug}: workflow pubblicazione listoni suggerisce ancora upload per-lega`);
  if (!publicationWorkflow.includes('static/fanta-engine/data/shared-assets/current/assets/listoni/manifest.json')) fail(`${slug}: workflow pubblicazione non suggerisce upload centrale listoni`);

  const calciomercatoAdmin = read(`static/${slug}/assets/js/calciomercato/calciomercato-admin-v340.js`);
  if (calciomercatoAdmin.includes('<code>assets/calciomercato/archive/</code>')) fail(`${slug}: pannello calciomercato suggerisce ancora path locale`);
  if (!calciomercatoAdmin.includes('fanta-engine/data/shared-assets/current/assets/calciomercato/archive/')) fail(`${slug}: pannello calciomercato non suggerisce path centrale`);
}

console.log('Audit V522 superato: upload unico Listoni/Calciomercato su fanta-engine current, fallback locali preservati e runtime allineato a ?v=522.');
