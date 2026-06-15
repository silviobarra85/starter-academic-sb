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

const index = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const app = read('assets/app.js');
const loader = read('assets/js/core/league-config-v443.js');
const bilanciSection = read('assets/js/sections/bilanci-snapshot-section-v435.js');
const config = readJson('assets/league-config.json');
const checkScript = read('tools/check-zonaorientale.sh');

check('league-config.json presente', exists('assets/league-config.json'));
check('league-config slug ZonaOrientale', config.leagueId === 'zonaorientale' && config.slug === 'zonaorientale');
check('league-config nome pubblico invariato', config.name === 'ZonaOrientale Salerno' && config.shortName === 'ZonaOrientale');
check('league-config path pubblici invariati', config.basePath === '/zonaorientale/' && config.siteUrl === 'https://silviobarra.com/zonaorientale/');
check('league-config versione V445+', Number(config.currentVersion) >= 445);
check('league-config candidato seconda lega tracciato', config.futureLeagueCandidate?.provisionalName === 'FantaPetilloMantraManager');
check('guardrail config-only attivi', config.guardrails?.configOnly === true && config.guardrails?.noFirebaseRefactor === true && config.guardrails?.noSnapshotRefactor === true && config.guardrails?.noAdminRefactor === true);
check('loader V443 presente', exists('assets/js/core/league-config-v443.js'));
check('loader pubblica window.ZonaOrientaleLeagueConfigV443', loader.includes('window.ZonaOrientaleLeagueConfigV443') && loader.includes('loadLeagueConfigV443'));
check('loader espone presentazione runtime V445', loader.includes('applyLeagueRuntimePresentationV445') && loader.includes('ZonaOrientaleLeagueRuntimePresentationV445'));
check('index carica loader V443', index.includes('league-config-v443.js?v=446'));
check('standalone caricano loader V443', competition.includes('league-config-v443.js?v=446') && player.includes('league-config-v443.js?v=446'));
check('cache-buster runtime V445+', index.includes(`assets/app.js?v=${config.currentVersion}`) && !index.includes('?v=442') && !index.includes('?v=444'));
check('footer V445 aggiornato', index.includes(`V${config.currentVersion}`) && competition.includes(`V${config.currentVersion}`) && player.includes(`V${config.currentVersion}`));
check('DEPLOY_EXPECTED_VERSION V445', app.includes(`DEPLOY_EXPECTED_VERSION_V181 = "${config.currentVersion}"`));
check('marker runtime V443 presente', app.includes('ZonaOrientaleMultiLeagueConfigV443') && app.includes('behaviorChanged: false'));
check('Bilanci usa config con fallback', bilanciSection.includes('getLeagueWhatsappBilanciUrlV443') && bilanciSection.includes('https://silviobarra.com/zonaorientale/bilanci.html'));
check('check principale integra audit V443', checkScript.includes('audit-league-config-v443.mjs'));
check('nessun refactor Firebase nel loader', !loader.includes('firebase') && !loader.includes('collection(') && !loader.includes('getDocs'));

if (ok !== total) {
  console.error(`Audit league config V443 completato: ${ok}/${total} controlli superati.`);
  process.exit(1);
}
console.log('Audit league config V443 superato.');
