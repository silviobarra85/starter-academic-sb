#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const quiet = process.argv.includes('--quiet');
const root = path.resolve(process.cwd());
const expectedVersions = ['439', '440', '441', '442', '443', '444', '445', '446', '447', '448', '449', '450', '451', '452'];
const requiredHashes = [
  '#news',
  '#clubs',
  '#bilanci',
  '#honor',
  '#stats',
  '#archive',
  '#compare',
  '#regolamento',
  '#fantamercato',
  '#calciomercato',
  '#listone',
  '#admin'
];
const files = ['index.html', 'competition.html', 'player.html'];
const results = [];

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function push(ok, label, details = '') {
  results.push({ ok, label, details });
}

for (const file of files) {
  const html = read(file);
  push(expectedVersions.some((version) => html.includes(`?v=${version}`)), `${file}: cache-buster V439+`);
  push(html.includes('V439 menu Altro pagine standalone') || html.includes('V440 link WhatsApp Bilanci') || html.includes('V441 filtri ruoli Mantra') || html.includes('V442 titoli sopra filtri') || html.includes('V444 audit hard-coded multi-lega') || html.includes('V446 path dati statici da config') || html.includes('V447 clone sandbox FantaPetillo') || html.includes('V449 Firebase FantaPetillo') || html.includes('V450 Admin bootstrap FantaPetillo') || html.includes('V452 favicon FantaPetillo') || html.includes('V449 Firebase FantaPetillo'), `${file}: footer V439+`);
  push(html.includes('id="mobileMoreSheet"'), `${file}: menu Altro presente`);
  push(html.includes('id="mobileMoreBtn"'), `${file}: bottone Altro presente`);
  for (const hash of requiredHashes) {
    const href = file === 'index.html' ? `href="${hash}"` : `href="./${hash}"`;
    push(html.includes(href), `${file}: voce ${hash} presente`, href);
  }
}

const app = read('assets/app.js');
push(/DEPLOY_EXPECTED_VERSION_V181\s*=\s*"(439|440|441|442|443|444|445|446|447|448|449|450|451|452)"/.test(app), 'app.js: DEPLOY_EXPECTED_VERSION_V181 V439+');
push(app.includes('ZonaOrientaleStandaloneMoreMenuV439'), 'app.js: marker V439 menu standalone');

const failed = results.filter((item) => !item.ok);
if (!quiet) {
  for (const item of results) {
    const prefix = item.ok ? 'PASS' : 'FAIL';
    console.log(`${prefix} ${item.label}${item.details ? ` (${item.details})` : ''}`);
  }
}
if (failed.length) {
  console.error(`Audit mobile more standalone V439 fallito: ${failed.length} controlli non superati.`);
  process.exit(1);
}
if (!quiet) console.log('Audit mobile more standalone V439 superato.');
