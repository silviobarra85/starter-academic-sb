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
  mobileControls: read('assets/css/refactor/mobile-controls.css'),
  calciomercatoCss: read('assets/css/refactor/calciomercato.css')
};

const expectedVersion = (files.app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/) || [null, '409'])[1];
const expectedNumber = Number(expectedVersion);

if (Number.isFinite(expectedNumber) && expectedNumber >= 409) pass(`runtime V${expectedVersion} compatibile con audit V409`);
else fail('DEPLOY_EXPECTED_VERSION_V181 inferiore a V409 o non rilevato');

for (const [name, html] of [['index.html', files.index], ['competition.html', files.competition], ['player.html', files.player]]) {
  if (new RegExp(`V${expectedVersion} `).test(html)) pass(`${name} footer V${expectedVersion} presente`);
  else fail(`${name} footer V${expectedVersion} mancante`);
  const versions = [...html.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
  const unique = [...new Set(versions)];
  if (unique.length === 0 || (unique.length === 1 && unique[0] === expectedVersion)) pass(`${name} cache-buster V${expectedVersion}`);
  else fail(`${name} cache-buster non coerenti: ${unique.join(', ')}`);
}

const appVersions = [...files.app.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
const uniqueAppVersions = [...new Set(appVersions)];
if (uniqueAppVersions.length === 0 || (uniqueAppVersions.length === 1 && uniqueAppVersions[0] === expectedVersion)) pass(`assets/app.js cache-buster V${expectedVersion}`);
else fail(`assets/app.js cache-buster non coerenti: ${uniqueAppVersions.join(', ')}`);

if (files.index.includes(`assets/css/refactor/mobile-controls.css?v=${expectedVersion}`)) pass(`mobile-controls V${expectedVersion} caricato da index.html`);
else fail(`mobile-controls V${expectedVersion} non caricato da index.html`);

if (/V409 - Tabelle giocatori mobile piu compatte e leggibili/.test(files.mobileControls)) pass('blocco CSS V409 presente');
else fail('blocco CSS V409 mancante in mobile-controls.css');

const requiredMobileSelectors = [
  'body.is-mobile-ux .listone-table-wrap',
  'body.is-mobile-ux .roster-listone-wrap-v408',
  'body.is-mobile-ux .roster-dialog-table',
  'body.is-mobile-ux .listone-player-cell .link-button',
  'body.is-mobile-ux .roster-player-cell .link-button',
  'body.is-mobile-ux .roster-listone-skin-v408 .link-button',
  'body.is-mobile-ux .roster-dialog-players-table .link-button'
];
for (const selector of requiredMobileSelectors) {
  if (files.mobileControls.includes(selector)) pass(`selector mobile preservato: ${selector}`);
  else fail(`selector mobile mancante: ${selector}`);
}

if (/min-height:\s*30px\s*!important/.test(files.mobileControls)
  && /font-variant-numeric:\s*tabular-nums/.test(files.mobileControls)
  && /scroll-snap-type:\s*x proximity/.test(files.mobileControls)) {
  pass('ottimizzazioni mobile V409 presenti');
} else {
  fail('ottimizzazioni mobile V409 incomplete');
}

if (files.app.includes('getVisibleNewsForSeasonV79(4)') && !files.app.includes('getVisibleNewsForSeasonV79(3)')) pass('V407 preservata: home a 4 comunicati');
else fail('V407 non preservata: limite comunicati home non corretto');

if (/V407 - Calciomercato mobile/.test(files.calciomercatoCss)
  && /@media \(max-width: 720px\)[\s\S]*\.calciomercato-thumb-v306[\s\S]*display:\s*none\s*!important/.test(files.calciomercatoCss)) {
  pass('V407 preservata: anteprime Calciomercato nascoste solo da mobile');
} else {
  fail('V407 non preservata: regola mobile Calciomercato mancante');
}

if (files.app.includes('roster-listone-skin-v408') && files.app.includes('roster-listone-wrap-v408')) pass('V408 preservata: skin Listone nelle rose');
else fail('V408 non preservata: classi rosa/Listone mancanti');

if (/sezioni\//.test(files.index) || /section-entrypoints/.test(files.index)) fail('trovati riferimenti al refactor pagine standalone');
else pass('nessun ritorno al refactor pagine standalone');

if (!process.exitCode) pass('audit V409 tabelle mobile compatte superato');
