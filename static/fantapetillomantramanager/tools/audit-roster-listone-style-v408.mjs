#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd().endsWith('/tools') ? join(process.cwd(), '..') : process.cwd();
const read = (rel) => readFileSync(join(root, rel), 'utf8');
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
};
const pass = (msg) => {
  if (!process.argv.includes('--quiet')) console.log(`OK: ${msg}`);
};

const files = {
  index: read('index.html'),
  competition: read('competition.html'),
  player: read('player.html'),
  app: read('assets/app.js'),
  styles: read('assets/styles.css'),
  calciomercatoCss: read('assets/css/refactor/calciomercato.css')
};

const runtimeMatch = files.app.match(/DEPLOY_EXPECTED_VERSION_V181 = "([0-9]+)"/);
const runtimeVersion = runtimeMatch ? runtimeMatch[1] : '';
if (Number(runtimeVersion) >= 408) pass(`runtime V${runtimeVersion} preserva feature V408`);
else fail('DEPLOY_EXPECTED_VERSION_V181 inferiore a V408 o mancante');

for (const [name, html] of [['index.html', files.index], ['competition.html', files.competition], ['player.html', files.player]]) {
  if (runtimeVersion && new RegExp(`V${runtimeVersion}`).test(html)) pass(`${name} footer allineato a V${runtimeVersion}`);
  else fail(`${name} footer non allineato al runtime V${runtimeVersion || 'n/d'}`);
  const versions = [...html.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
  const unique = [...new Set(versions)];
  if (unique.length === 0 || (unique.length === 1 && unique[0] === runtimeVersion)) pass(`${name} cache-buster allineato a V${runtimeVersion}`);
  else fail(`${name} cache-buster non coerenti: ${unique.join(', ')}`);
}

const appVersions = [...files.app.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
const uniqueAppVersions = [...new Set(appVersions)];
if (uniqueAppVersions.length === 0 || (uniqueAppVersions.length === 1 && uniqueAppVersions[0] === runtimeVersion)) pass(`assets/app.js cache-buster allineati a V${runtimeVersion}`);
else fail(`assets/app.js cache-buster non coerenti: ${uniqueAppVersions.join(', ')}`);

if (files.app.includes('getVisibleNewsForSeasonV79(4)') && !files.app.includes('getVisibleNewsForSeasonV79(3)')) pass('V407 preservata: home a 4 comunicati');
else fail('V407 non preservata: limite comunicati home non corretto');

if (/V407 - Calciomercato mobile/.test(files.calciomercatoCss)
  && /@media \(max-width: 720px\)[\s\S]*\.calciomercato-thumb-v306[\s\S]*display:\s*none\s*!important/.test(files.calciomercatoCss)) {
  pass('V407 preservata: anteprime Calciomercato nascoste solo da mobile');
} else {
  fail('V407 non preservata: regola mobile Calciomercato mancante');
}

const rosterTablePattern = /<table class="mobile-tabular listone-table roster-main-table roster-player-table roster-listone-skin-v408">/;
const rosterWrapPattern = /<div class="table-wrap mobile-tabular-wrap listone-table-wrap roster-table-wrap roster-inline-table-wrap roster-listone-wrap-v408">/;
if (rosterTablePattern.test(files.app) && rosterWrapPattern.test(files.app)) pass('tabella rosa espansa usa skin Listone V408');
else fail('tabella rosa espansa non usa classi Listone V408');

const expectedHeaders = [
  'renderRosterSortButton("playerName", "Giocatore")',
  'renderRosterSortButton("role", "R (RM)")',
  'renderRosterSortButton("realTeam", "Sq")',
  'renderRosterSortButton("cost", "Costo", true)',
  'renderRosterSortButton("quotationCurrent", "Qt.A", true)'
];
for (const header of expectedHeaders) {
  if (files.app.includes(header)) pass(`colonna preservata: ${header}`);
  else fail(`colonna rosa mancante o rinominata: ${header}`);
}

const expectedCells = [
  'data-label="Giocatore" class="roster-col-player"',
  'data-label="R (RM)" class="roster-col-role"',
  'data-label="Sq" class="roster-col-team"',
  'data-label="Costo" class="number roster-col-cost"',
  'data-label="Qt.A" class="number roster-col-qta"'
];
for (const cell of expectedCells) {
  if (files.app.includes(cell)) pass(`cella preservata: ${cell}`);
  else fail(`cella rosa mancante o rinominata: ${cell}`);
}

if (/V408 - Rosa squadra espansa con stile Listone/.test(files.styles)
  && /\.roster-listone-skin-v408[\s\S]*font-size:\s*0\.82rem\s*!important/.test(files.styles)
  && /\.roster-listone-skin-v408 th,[\s\S]*padding:\s*8px 7px\s*!important/.test(files.styles)
  && /body\.is-mobile-ux[\s\S]*\.roster-listone-skin-v408[\s\S]*font-size:\s*0\.62rem\s*!important/.test(files.styles)) {
  pass('CSS V408 allinea font e celle allo stile Listone');
} else {
  fail('CSS V408 stile Listone mancante o incompleto');
}

if (!/sezioni\//.test(files.index) && !/section-entrypoints/.test(files.index)) pass('nessun ritorno al refactor pagine standalone');
else fail('trovati riferimenti al refactor pagine standalone');

if (!process.exitCode) pass('audit V408 rosa stile Listone superato');
