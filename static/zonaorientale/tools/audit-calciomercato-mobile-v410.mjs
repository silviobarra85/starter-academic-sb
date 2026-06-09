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
  mobileControls: read('assets/css/refactor/mobile-controls.css'),
  calciomercatoCss: read('assets/css/refactor/calciomercato.css')
};

const expectedVersion = '410';

if (new RegExp(`DEPLOY_EXPECTED_VERSION_V181 = "${expectedVersion}"`).test(files.app)) pass('runtime V410');
else fail('DEPLOY_EXPECTED_VERSION_V181 non allineato a V410');

for (const [name, html] of [['index.html', files.index], ['competition.html', files.competition], ['player.html', files.player]]) {
  if (/V410 Calciomercato mobile compatto/.test(html)) pass(`${name} footer V410 presente`);
  else fail(`${name} footer V410 mancante`);
  const versions = [...html.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
  const unique = [...new Set(versions)];
  if (unique.length === 0 || (unique.length === 1 && unique[0] === expectedVersion)) pass(`${name} cache-buster V410`);
  else fail(`${name} cache-buster non coerenti: ${unique.join(', ')}`);
}

const appVersions = [...files.app.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
const uniqueAppVersions = [...new Set(appVersions)];
if (uniqueAppVersions.length === 0 || (uniqueAppVersions.length === 1 && uniqueAppVersions[0] === expectedVersion)) pass('assets/app.js cache-buster V410');
else fail(`assets/app.js cache-buster non coerenti: ${uniqueAppVersions.join(', ')}`);

if (files.index.includes('assets/css/refactor/calciomercato.css?v=410')) pass('calciomercato.css V410 caricato da index.html');
else fail('calciomercato.css V410 non caricato da index.html');

if (/V410 - Calciomercato mobile: card piu compatte/.test(files.calciomercatoCss)) pass('blocco CSS V410 presente');
else fail('blocco CSS V410 mancante');

const requiredSelectors = [
  'body.is-mobile-ux .calciomercato-grid-v306',
  'body.is-mobile-ux .calciomercato-card-v306',
  'body.is-mobile-ux .calciomercato-card-body-v306 h3',
  'body.is-mobile-ux .calciomercato-card-body-v306 > p',
  'body.is-mobile-ux .calciomercato-card-footer-v306',
  'body.is-mobile-ux .calciomercato-player-chip-v306'
];
for (const selector of requiredSelectors) {
  if (files.calciomercatoCss.includes(selector)) pass(`selector V410 presente: ${selector}`);
  else fail(`selector V410 mancante: ${selector}`);
}

if (/V407 - Calciomercato mobile[\s\S]*\.calciomercato-thumb-v306[\s\S]*display:\s*none\s*!important/.test(files.calciomercatoCss)) {
  pass('V407 preservata: immagini Calciomercato nascoste solo mobile');
} else {
  fail('V407 non preservata: regola immagini mobile mancante');
}

if (/-webkit-line-clamp:\s*3/.test(files.calciomercatoCss)
  && /-webkit-line-clamp:\s*2/.test(files.calciomercatoCss)
  && /min-height:\s*2\.05rem/.test(files.calciomercatoCss)) {
  pass('compattezza card mobile V410 presente');
} else {
  fail('compattezza card mobile V410 incompleta');
}

if (files.app.includes('getVisibleNewsForSeasonV79(4)')) pass('V407 preservata: home a 4 comunicati');
else fail('V407 non preservata: home non a 4 comunicati');

if (files.app.includes('roster-listone-skin-v408') && files.app.includes('roster-listone-wrap-v408')) pass('V408 preservata: stile Listone su Rose');
else fail('V408 non preservata: classi rosa/Listone mancanti');

if (/V409 - Tabelle giocatori mobile piu compatte e leggibili/.test(files.mobileControls)) pass('V409 preservata: blocco tabelle mobile presente');
else fail('V409 non preservata: blocco tabelle mobile mancante');

if (/sezioni\//.test(files.index) || /section-entrypoints/.test(files.index)) fail('trovati riferimenti al refactor pagine standalone');
else pass('nessun ritorno al refactor pagine standalone');

if (!process.exitCode) pass('audit V410 Calciomercato mobile compatto superato');
