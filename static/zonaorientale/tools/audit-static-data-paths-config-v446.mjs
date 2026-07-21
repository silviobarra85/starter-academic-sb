#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const siteRoot = path.resolve(path.dirname(__filename), '..');
let ok = 0;
let total = 0;

function read(rel) {
  return fs.readFileSync(path.join(siteRoot, rel), 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(siteRoot, rel));
}
function check(label, condition) {
  total += 1;
  if (!condition) {
    console.error(`x ${label}`);
    return;
  }
  ok += 1;
}
function readJson(rel) {
  return JSON.parse(read(rel));
}

const config = readJson('assets/league-config.json');
const loader = read('assets/js/core/league-config-v443.js');
const app = read('assets/app.js');
const staticFiles = read('assets/js/data/static-files-service.js');
const bilanci = read('assets/js/sections/bilanci-snapshot-section-v435.js');
const coreUi = read('assets/js/core/ui.js');
const competition = read('competition.html');
const checkScript = read('tools/check-zonaorientale.sh');

const requiredPaths = [
  'publicConfig',
  'seasonSnapshotsManifest',
  'seasonSnapshotsBase',
  'honorSnapshot',
  'listoniManifest',
  'listoniBase',
  'rostersManifest',
  'rostersBase',
  'competitionsManifest',
  'competitionsBase',
  'logosBase',
  'calciomercatoLinks',
  'calciomercatoArchiveManifest',
  'calciomercatoArchiveBase'
];

check('config V446 presente', Number(config.currentVersion) >= 446);
check('dataPaths completi in league-config', requiredPaths.every((key) => typeof config.dataPaths?.[key] === 'string' && config.dataPaths[key].length));
check('guardrail staticDataPathsFromConfig attivo', config.guardrails?.staticDataPathsFromConfig === true);
check('loader espone helper path statici V446', loader.includes('DEFAULT_DATA_PATHS_V446') && loader.includes('getLeagueDataPathV446') && loader.includes('joinLeagueDataPathV446') && loader.includes('getLeagueLogoPathV446'));
check('loader non introduce Firebase', !loader.includes('firebase') && !loader.includes('collection(') && !loader.includes('getDocs'));
check('app importa helper path V446', app.includes('getLeagueDataPathV446') && app.includes('joinLeagueDataPathV446') && app.includes('withLeagueCacheBusterV446'));
check('app usa config per config pubblica/snapshot/honor', app.includes('getPublicConfigUrlV446') && app.includes('getStaticSeasonSnapshotsManifestUrlV446') && app.includes('getStaticHonorSnapshotUrlV446'));
check('app usa config per calciomercato statico/archivio', app.includes('getCalciomercatoStaticUrlV446') && app.includes('getCalciomercatoArchiveManifestUrlV446') && app.includes('getCalciomercatoArchiveDayUrlV446'));
check('reader listoni rose competizioni usa dataPaths', staticFiles.includes("resolveLeagueDataPathV537('listoniManifest'") && staticFiles.includes("joinLeagueDataPathV537('rostersBase'") && staticFiles.includes("resolveLeagueDataPathV537('competitionsManifest'"));
check('Bilanci snapshot usa dataPaths senza cambiare sezione V435', bilanci.includes('getBilanciSnapshotPathsV446') && bilanci.includes('joinLeagueDataPathV446(\'seasonSnapshotsBase\'') && bilanci.includes('getLeagueWhatsappBilanciUrlV443'));
check('logo helper usa logosBase da config', coreUi.includes('getLeagueLogoPathV446') && competition.includes('getLeagueLogoPathV446'));
check('competition standalone usa competitionsBase da config', competition.includes('getLeagueDataPathV446("competitionsManifest"') && competition.includes('joinLeagueDataPathV446("competitionsBase"'));
check('marker V446 presente', app.includes('ZonaOrientaleStaticDataPathsFromConfigV446') && app.includes('static-data-paths-from-config'));
check('check principale integra audit V446', checkScript.includes('audit-static-data-paths-config-v446.mjs'));
check('file precedenti ancora presenti', exists('tools/audit-runtime-presentation-config-v445.mjs') && exists('tools/audit-hardcoded-league-refs-v444.mjs') && exists('tools/audit-league-config-v443.mjs'));

if (ok !== total) {
  console.error(`Audit static data paths config V446 completato: ${ok}/${total} controlli superati.`);
  process.exit(1);
}
console.log('Audit static data paths config V446 superato.');
