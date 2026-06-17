#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd().endsWith('/tools') ? join(process.cwd(), '..') : process.cwd();
const read = (rel) => readFileSync(join(root, rel), 'utf8');
const quiet = process.argv.includes('--quiet');
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
};
const pass = (msg) => {
  if (!quiet) console.log(`OK: ${msg}`);
};

const files = {
  index: read('index.html'),
  competition: read('competition.html'),
  player: read('player.html'),
  app: read('assets/app.js'),
  mobileControls: read('assets/css/refactor/mobile-controls.css'),
  calciomercatoCss: read('assets/css/refactor/calciomercato.css')
};

const expectedVersion = '411';

if (new RegExp(`DEPLOY_EXPECTED_VERSION_V181 = "${expectedVersion}"`).test(files.app)) pass('runtime V411');
else fail('DEPLOY_EXPECTED_VERSION_V181 non allineato a V411');

for (const [name, html] of [['index.html', files.index], ['competition.html', files.competition], ['player.html', files.player]]) {
  if (/V411 dashboard mobile compatta/.test(html)) pass(`${name} footer V411 presente`);
  else fail(`${name} footer V411 mancante`);
  const versions = [...html.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
  const unique = [...new Set(versions)];
  if (unique.length === 0 || (unique.length === 1 && unique[0] === expectedVersion)) pass(`${name} cache-buster V411`);
  else fail(`${name} cache-buster non coerenti: ${unique.join(', ')}`);
}

const appVersions = [...files.app.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
const uniqueAppVersions = [...new Set(appVersions)];
if (uniqueAppVersions.length === 0 || (uniqueAppVersions.length === 1 && uniqueAppVersions[0] === expectedVersion)) pass('assets/app.js cache-buster V411');
else fail(`assets/app.js cache-buster non coerenti: ${uniqueAppVersions.join(', ')}`);

if (files.index.includes('assets/css/refactor/mobile-controls.css?v=411')) pass('mobile-controls.css V411 caricato da index.html');
else fail('mobile-controls.css V411 non caricato da index.html');

if (/V411 - Dashboard mobile piu compatta e leggibile/.test(files.mobileControls)) pass('blocco CSS V411 presente');
else fail('blocco CSS V411 mancante');

const requiredSelectors = [
  'body.is-mobile-ux .app-page[data-page="dashboard"] .section-panel',
  'body.is-mobile-ux .app-page[data-page="dashboard"] .dashboard-subsection',
  'body.is-mobile-ux .app-page[data-page="dashboard"] .cards-grid',
  'body.is-mobile-ux .app-page[data-page="dashboard"] .metric-card',
  'body.is-mobile-ux .app-page[data-page="dashboard"] .dashboard-news-card.dashboard-news-details',
  'body.is-mobile-ux .app-page[data-page="dashboard"] .dashboard-news-preview'
];
for (const selector of requiredSelectors) {
  if (files.mobileControls.includes(selector)) pass(`selector V411 presente: ${selector}`);
  else fail(`selector V411 mancante: ${selector}`);
}

if (/-webkit-line-clamp:\s*2/.test(files.mobileControls) && /min-height:\s*38px/.test(files.mobileControls)) {
  pass('compattezza dashboard mobile V411 presente');
} else {
  fail('compattezza dashboard mobile V411 incompleta');
}

if (files.app.includes('getVisibleNewsForSeasonV79(4)')) pass('V407 preservata: home a 4 comunicati');
else fail('V407 non preservata: home non a 4 comunicati');

if (/V407 - Calciomercato mobile[\s\S]*\.calciomercato-thumb-v306[\s\S]*display:\s*none\s*!important/.test(files.calciomercatoCss)) {
  pass('V407 preservata: immagini Calciomercato nascoste solo mobile');
} else {
  fail('V407 non preservata: regola immagini mobile mancante');
}

if (files.app.includes('roster-listone-skin-v408') && files.app.includes('roster-listone-wrap-v408')) pass('V408 preservata: stile Listone su Rose');
else fail('V408 non preservata: classi rosa/Listone mancanti');

if (/V409 - Tabelle giocatori mobile piu compatte e leggibili/.test(files.mobileControls)) pass('V409 preservata: blocco tabelle mobile presente');
else fail('V409 non preservata: blocco tabelle mobile mancante');

if (/V410 - Calciomercato mobile: card piu compatte/.test(files.calciomercatoCss)) pass('V410 preservata: blocco Calciomercato mobile presente');
else fail('V410 non preservata: blocco Calciomercato mobile mancante');

if (/sezioni\//.test(files.index) || /section-entrypoints/.test(files.index)) fail('trovati riferimenti al refactor pagine standalone');
else pass('nessun ritorno al refactor pagine standalone');

if (!process.exitCode) pass('audit V411 dashboard mobile compatta superato');
