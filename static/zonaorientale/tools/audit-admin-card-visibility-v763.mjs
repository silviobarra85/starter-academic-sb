#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const requestedRoot = path.resolve(process.argv[2] || '.');
const sourcePrefix = fs.existsSync(path.join(requestedRoot, 'static', 'zonaorientale')) ? 'static' : '';
const root = path.join(requestedRoot, sourcePrefix);
const checks = [];

function target(rel) { return path.join(root, rel); }
function read(rel) {
  const file = target(rel);
  if (!fs.existsSync(file)) throw new Error(`File assente: ${file}`);
  return fs.readFileSync(file, 'utf8');
}
function check(label, condition, detail = '') { checks.push({ label, ok: Boolean(condition), detail }); }

const files = {
  engineJs: 'fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js',
  zonaJs: 'zonaorientale/assets/js/core/admin-card-visibility-v456.js',
  petilloJs: 'fantapetillomantramanager/assets/js/core/admin-card-visibility-v456.js',
  engineCss: 'fanta-engine/css/shared/v487/assets/css/refactor/admin-card-visibility-v456.css',
  zonaCss: 'zonaorientale/assets/css/refactor/admin-card-visibility-v456.css',
  petilloCss: 'fantapetillomantramanager/assets/css/refactor/admin-card-visibility-v456.css',
  zonaIndex: 'zonaorientale/index.html',
  petilloIndex: 'fantapetillomantramanager/index.html',
  release: 'zonaorientale/release.json'
};

for (const [name, rel] of Object.entries(files)) check(`esiste ${name}`, fs.existsSync(target(rel)), rel);

let engineJs = '';
let zonaJs = '';
let petilloJs = '';
let engineCss = '';
let zonaCss = '';
let petilloCss = '';
let zonaIndex = '';
let petilloIndex = '';
let release = {};
try {
  engineJs = read(files.engineJs);
  zonaJs = read(files.zonaJs);
  petilloJs = read(files.petilloJs);
  engineCss = read(files.engineCss);
  zonaCss = read(files.zonaCss);
  petilloCss = read(files.petilloCss);
  zonaIndex = read(files.zonaIndex);
  petilloIndex = read(files.petilloIndex);
  release = JSON.parse(read(files.release));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const sources = [
  ['engine JS', engineJs],
  ['ZonaOrientale JS', zonaJs],
  ['FantaPetillo JS', petilloJs]
];

for (const [label, source] of sources) {
  check(`${label}: release V763`, source.includes('const RELEASE = "V763"'));
  check(`${label}: controller unico con guard`, source.includes('const RUNTIME_GUARD = "__leagueAdminCardVisibilityV763"'));
  check(`${label}: listener click sul solo controllo`, source.includes('control.addEventListener("click"'));
  check(`${label}: listener change sul solo controllo`, source.includes('control.addEventListener("change"'));
  check(`${label}: nessun listener click globale`, !source.includes('document.addEventListener("click"'));
  check(`${label}: nessun listener pointerup globale`, !source.includes("document.addEventListener('pointerup'"));
  check(`${label}: nessuna inversione manuale checkbox`, !source.includes('nextChecked = !input.checked'));
  check(`${label}: fallback stato in memoria`, source.includes('storageMode = "memory"'));
  check(`${label}: localStorage non obbligatorio`, source.includes('function storageCandidates()'));
  check(`${label}: render idempotente tramite firma`, source.includes('controlSignature !== nextSignature'));
  check(`${label}: observer limitato al pannello Admin`, source.includes('const root = getAdminPanel()'));
  check(`${label}: observer ignora il selettore`, source.includes('mutation.target?.closest?.(`#${CONTROL_ID}`)'));
  check(`${label}: self-test interazioni presente`, source.includes('runInteractionSelfTest'));
  check(`${label}: hardfix V761 rimosso`, !source.includes('adminCardSelectorDesktopHardfixV761'));
  check(`${label}: loop V755 assente`, !source.includes('new MutationObserver(decorate).observe(document.documentElement'));
}

check('JS engine e fallback Zona identici', engineJs === zonaJs);
check('JS engine e fallback FantaPetillo identici', engineJs === petilloJs);
check('CSS engine e fallback Zona identici', engineCss === zonaCss);
check('CSS engine e fallback FantaPetillo identici', engineCss === petilloCss);

for (const [label, css] of [
  ['engine CSS', engineCss],
  ['ZonaOrientale CSS', zonaCss],
  ['FantaPetillo CSS', petilloCss]
]) {
  check(`${label}: contratto V763`, css.includes('[data-admin-card-runtime="V763"]'));
  check(`${label}: hack pointer V761 rimosso`, !css.includes('.admin-card-checkbox-hardfix-v761'));
}

check('ZonaOrientale JS cache-bust V763', zonaIndex.includes('admin-card-visibility-v456.js?v=763'));
check('ZonaOrientale CSS cache-bust V763', zonaIndex.includes('admin-card-visibility-v456.css?v=763'));
check('FantaPetillo JS cache-bust V763', petilloIndex.includes('admin-card-visibility-v456.js?v=763'));
check('FantaPetillo CSS cache-bust V763', petilloIndex.includes('admin-card-visibility-v456.css?v=763'));
check('footer ZonaOrientale V763', zonaIndex.includes('Fantacalcio - V763'));
check('release manifest V763', String(release.version) === '763');
check(
  'release manifest include controller condiviso V763',
  Array.isArray(release.runtimeFixes) && release.runtimeFixes.some((item) => String(item).includes('admin-card-visibility-v456.js?v=763'))
);

const failed = checks.filter((item) => !item.ok);
for (const item of checks) {
  const suffix = item.detail ? ` - ${item.detail}` : '';
  console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.label}${suffix}`);
}
console.log(`\nV763 audit: ${checks.length - failed.length}/${checks.length} controlli superati.`);
if (failed.length) process.exit(1);
