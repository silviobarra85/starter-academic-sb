#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
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
  calciomercatoCss: read('assets/css/refactor/calciomercato.css'),
  mobileCss: existsSync(join(root, 'assets/css/refactor/mobile-controls.css')) ? read('assets/css/refactor/mobile-controls.css') : ''
};

if (/DEPLOY_EXPECTED_VERSION_V181 = "407"/.test(files.app)) pass('runtime V407');
else fail('DEPLOY_EXPECTED_VERSION_V181 non allineato a V407');

for (const [name, html] of [['index.html', files.index], ['competition.html', files.competition], ['player.html', files.player]]) {
  if (/V407 home comunicati e calciomercato mobile/.test(html)) pass(`${name} footer V407 presente`);
  else fail(`${name} footer V407 mancante`);
  const versions = [...html.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
  const unique = [...new Set(versions)];
  if (unique.length === 0 || (unique.length === 1 && unique[0] === '407')) pass(`${name} cache-buster V407`);
  else fail(`${name} cache-buster non coerenti: ${unique.join(', ')}`);
}

const appVersions = [...files.app.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
const uniqueAppVersions = [...new Set(appVersions)];
if (uniqueAppVersions.length === 0 || (uniqueAppVersions.length === 1 && uniqueAppVersions[0] === '407')) pass('assets/app.js cache-buster V407');
else fail(`assets/app.js cache-buster non coerenti: ${uniqueAppVersions.join(', ')}`);

if (files.app.includes('Le ultime 4 comunicazioni pubblicate nella stagione selezionata.') && files.app.includes('getVisibleNewsForSeasonV79(4)')) {
  pass('home mostra 4 comunicati');
} else {
  fail('home non configurata a 4 comunicati');
}
if (!files.app.includes('Le ultime 3 comunicazioni pubblicate nella stagione selezionata.') && !files.app.includes('getVisibleNewsForSeasonV79(3)')) {
  pass('rimosso limite home a 3 comunicati');
} else {
  fail('restano riferimenti home a 3 comunicati');
}

if (/V407 - Calciomercato mobile/.test(files.calciomercatoCss)
  && /@media \(max-width: 720px\)[\s\S]*\.calciomercato-thumb-v306[\s\S]*display:\s*none\s*!important/.test(files.calciomercatoCss)
  && /@media \(max-width: 720px\)[\s\S]*\.calciomercato-card-v306[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*!important/.test(files.calciomercatoCss)) {
  pass('Calciomercato mobile senza anteprime immagine');
} else {
  fail('regola mobile per nascondere anteprime Calciomercato mancante');
}

const beforeV407Css = files.calciomercatoCss.split('/* V407 - Calciomercato mobile')[0] || '';
if (/\.calciomercato-thumb-v306[^{]*\{[^}]*display:\s*none\s*!important/i.test(beforeV407Css)) {
  fail('trovato display:none globale sulle anteprime Calciomercato prima del blocco V407');
} else {
  pass('desktop Calciomercato non nasconde globalmente le anteprime');
}

if (!/sezioni\//.test(files.index) && !/section-entrypoints/.test(files.index)) pass('nessun ritorno al refactor pagine standalone');
else fail('trovati riferimenti al refactor pagine standalone');

if (/V406 - Mobile safety/.test(files.mobileCss)) pass('mobile safety precedente preservata');
else fail('mobile safety V406 non preservata');

if (!process.exitCode) pass('audit V407 home e Calciomercato mobile superato');
