#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const requestedRoot = path.resolve(process.argv[2] || '.');
const sourcePrefix = fs.existsSync(path.join(requestedRoot, 'static', 'zonaorientale')) ? 'static' : '';
const root = path.join(requestedRoot, sourcePrefix);
const checks = [];

function file(rel) {
  return path.join(root, rel);
}

function read(rel) {
  const target = file(rel);
  if (!fs.existsSync(target)) throw new Error(`File assente: ${target}`);
  return fs.readFileSync(target, 'utf8');
}

function check(label, condition, detail = '') {
  checks.push({ label, ok: Boolean(condition), detail });
}

const paths = {
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

let engineJs = '';
let zonaJs = '';
let petilloJs = '';
let engineCss = '';
let zonaCss = '';
let petilloCss = '';
let zonaIndex = '';
let petilloIndex = '';
let release = {};

for (const [name, rel] of Object.entries(paths)) {
  check(`esiste ${name}`, fs.existsSync(file(rel)), rel);
}

try {
  engineJs = read(paths.engineJs);
  zonaJs = read(paths.zonaJs);
  petilloJs = read(paths.petilloJs);
  engineCss = read(paths.engineCss);
  zonaCss = read(paths.zonaCss);
  petilloCss = read(paths.petilloCss);
  zonaIndex = read(paths.zonaIndex);
  petilloIndex = read(paths.petilloIndex);
  release = JSON.parse(read(paths.release));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const forbidden = [
  "new MutationObserver(decorate).observe(document.documentElement",
  "[50, 250, 800, 2000, 5000].forEach",
  "document.addEventListener('pointerup', intercept, true)",
  "eyebrow.textContent = 'Visibilità Admin · V755'"
];

for (const [label, source] of [
  ['engine JS', engineJs],
  ['ZonaOrientale JS', zonaJs],
  ['FantaPetillo JS', petilloJs]
]) {
  check(`${label}: contratto V761`, source.includes('adminCardSelectorDesktopHardfixV761'));
  check(`${label}: API V761`, source.includes('LeagueAdminCardCheckboxHardfixV761'));
  check(`${label}: observer mirato`, source.includes("observerMode: 'targeted-added-nodes'"));
  check(`${label}: controlla solo addedNodes`, source.includes('for (const node of mutation.addedNodes)'));
  check(`${label}: decorazione via classe`, source.includes("HARDENED_CLASS = 'admin-card-checkbox-hardfix-v761'"));
  for (const pattern of forbidden) {
    check(`${label}: pattern bloccante assente`, !source.includes(pattern), pattern);
  }
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
  check(`${label}: classe V761 presente`, css.includes('.admin-card-checkbox-hardfix-v761'));
  check(`${label}: vecchio selettore V755 rimosso`, !css.includes('admin-checkbox-hardfix-v755'));
}

check('ZonaOrientale JS cache-bust V761', zonaIndex.includes('admin-card-visibility-v456.js?v=761'));
check('ZonaOrientale CSS cache-bust V761', zonaIndex.includes('admin-card-visibility-v456.css?v=761'));
check('FantaPetillo JS cache-bust V761', petilloIndex.includes('admin-card-visibility-v456.js?v=761'));
check('FantaPetillo CSS cache-bust V761', petilloIndex.includes('admin-card-visibility-v456.css?v=761'));
check('footer ZonaOrientale V761', zonaIndex.includes('Fantacalcio - V761'));
check('release manifest V761', String(release.version) === '761');
check(
  'release manifest include hardfix condiviso',
  Array.isArray(release.runtimeFixes) && release.runtimeFixes.some((item) => String(item).includes('admin-card-visibility-v456.js?v=761'))
);

const failed = checks.filter((item) => !item.ok);
for (const item of checks) {
  const suffix = item.detail ? ` - ${item.detail}` : '';
  console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.label}${suffix}`);
}
console.log(`\nV761 audit: ${checks.length - failed.length}/${checks.length} controlli superati.`);
if (failed.length) process.exit(1);
