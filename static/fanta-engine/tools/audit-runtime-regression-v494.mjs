#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let ok = 0;
let fail = 0;
const failures = [];

function abs(filePath) {
  return path.join(root, filePath);
}

function exists(filePath) {
  return fs.existsSync(abs(filePath));
}

function read(filePath) {
  return fs.readFileSync(abs(filePath), 'utf8');
}

function readJson(filePath) {
  return JSON.parse(read(filePath));
}

function check(condition, label) {
  if (condition) {
    ok += 1;
    console.log(`OK  - ${label}`);
  } else {
    fail += 1;
    failures.push(label);
    console.error(`FAIL - ${label}`);
  }
}

function stripQuery(value) {
  return String(value || '').split('#')[0].split('?')[0];
}

function resolveFrom(file, ref) {
  const clean = stripQuery(ref);
  if (!clean || clean.includes('${') || clean.startsWith('http:') || clean.startsWith('https:') || clean.startsWith('mailto:') || clean.startsWith('tel:') || clean.startsWith('#')) return null;
  if (clean.startsWith('/.netlify/')) return null;
  if (clean.startsWith('/')) return clean.slice(1);
  return path.normalize(path.join(path.dirname(file), clean));
}

function collectAttrs(text, attrName) {
  const out = [];
  const regex = new RegExp(`${attrName}=["']([^"']+)["']`, 'gi');
  let match;
  while ((match = regex.exec(text))) out.push(match[1]);
  return out;
}

function listHtml(dir) {
  const absolute = abs(dir);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute)
    .filter((name) => name.endsWith('.html'))
    .map((name) => path.join(dir, name));
}

function checkRefs(file, label) {
  const text = read(file);
  const refs = [
    ...collectAttrs(text, 'href'),
    ...collectAttrs(text, 'src'),
    ...collectAttrs(text, 'data-local-fallback'),
  ];
  const misses = [];
  for (const ref of refs) {
    const resolved = resolveFrom(file, ref);
    if (!resolved) continue;
    if (!exists(resolved)) misses.push(`${ref} -> ${resolved}`);
  }
  check(misses.length === 0, `${label} senza riferimenti asset mancanti${misses.length ? ` (${misses.slice(0, 8).join('; ')})` : ''}`);
}

function checkIncludes(file, fragment, label) {
  check(read(file).includes(fragment), label);
}

function ensureNoPublicCrossTerms(file, forbiddenTerms, label) {
  const text = read(file).replace(/<script[\s\S]*?<\/script>/gi, '');
  const hits = forbiddenTerms.filter((term) => text.includes(term));
  check(hits.length === 0, `${label}${hits.length ? ` (${hits.join(', ')})` : ''}`);
}

const zonaRoot = 'zonaorientale';
const zonaNestedRoot = 'zonaorientale/static';
const fmmRoot = 'fantapetillomantramanager';

check(exists('fanta-engine'), 'motore comune presente');
check(exists(`${zonaRoot}/assets/league-config.json`), 'config ZonaOrientale presente');
check(exists(`${zonaNestedRoot}/assets/league-config.json`), 'config ZonaOrientale annidata presente');
check(exists(`${fmmRoot}/assets/league-config.json`), 'config FantaMantraManager presente');

const configs = [
  [`${zonaRoot}/assets/league-config.json`, 'zonaorientale', 'ZonaOrientale Salerno'],
  [`${zonaNestedRoot}/assets/league-config.json`, 'zonaorientale', 'ZonaOrientale Salerno'],
  [`${fmmRoot}/assets/league-config.json`, 'fantapetillomantramanager', 'FantaMantraManager'],
];
for (const [cfgPath, leagueId, name] of configs) {
  const cfg = readJson(cfgPath);
  check(cfg.leagueId === leagueId, `${cfgPath} leagueId corretto`);
  check(cfg.name === name, `${cfgPath} nome pubblico corretto`);
  check(cfg.currentVersion === 494, `${cfgPath} currentVersion V494`);
  check(cfg.features?.unifiedSectionRegistry === true, `${cfgPath} registry unico attivo`);
  check(cfg.features?.sharedAssetsCentralized === true, `${cfgPath} shared assets centralizzati`);
  check(cfg.features?.sharedCssCentralized === true, `${cfgPath} shared CSS centralizzati`);
  check(cfg.features?.commonDataPathAdapter === true, `${cfgPath} data path adapter attivo`);
  check(cfg.features?.sharedJsModulesCentralized === true, `${cfgPath} moduli JS centralizzati`);
  check(cfg.features?.runtimeRegressionAudit === true, `${cfgPath} audit regressione runtime abilitato`);
  check(cfg.guardrails?.manualRegressionChecklistRequired === true, `${cfgPath} checklist manuale obbligatoria`);
}

const htmlPages = [
  `${zonaRoot}/index.html`, `${zonaRoot}/competition.html`, `${zonaRoot}/player.html`,
  `${zonaNestedRoot}/index.html`, `${zonaNestedRoot}/competition.html`, `${zonaNestedRoot}/player.html`,
  `${fmmRoot}/index.html`, `${fmmRoot}/competition.html`, `${fmmRoot}/player.html`, `${fmmRoot}/news.html`, `${fmmRoot}/bilanci.html`,
];
for (const file of htmlPages) {
  check(exists(file), `${file} presente`);
  checkRefs(file, `${file} asset`);
  check(read(file).includes('?v=494'), `${file} cache-buster V494 presente`);
}

for (const file of [`${zonaRoot}/index.html`, `${zonaRoot}/competition.html`, `${zonaRoot}/player.html`, `${zonaNestedRoot}/index.html`, `${zonaNestedRoot}/competition.html`, `${zonaNestedRoot}/player.html`]) {
  checkIncludes(file, 'ZonaOrientale Salerno · V494 · Ultimo aggiornamento 24/06/2026', `footer V494 ZonaOrientale in ${file}`);
  ensureNoPublicCrossTerms(file, ['FantaMantraManager', 'FantaPetillo', 'fantapetillomantramanager'], `${file} senza contaminazione FantaMantra`);
}
for (const file of [`${fmmRoot}/index.html`, `${fmmRoot}/competition.html`, `${fmmRoot}/player.html`]) {
  checkIncludes(file, 'FantaMantraManager · V494 · Ultimo aggiornamento 24/06/2026', `footer V494 FantaMantraManager in ${file}`);
  ensureNoPublicCrossTerms(file, ['ZonaOrientale', 'zonaorientale'], `${file} senza contaminazione ZonaOrientale`);
}
ensureNoPublicCrossTerms(`${fmmRoot}/news.html`, ['news-ujE2CqJMjzkYhhjzZZHD'], 'news FantaMantraManager senza ID storico ZonaOrientale');

const loaderFiles = [
  `${zonaRoot}/assets/js/core/league-config-v443.js`,
  `${zonaNestedRoot}/assets/js/core/league-config-v443.js`,
  `${fmmRoot}/assets/js/core/league-config-v443.js`,
];
for (const file of loaderFiles) {
  const text = read(file);
  check(text.includes("currentVersion: '494'"), `${file} currentVersion runtime V494`);
  check(text.includes('league-config.json?v=494'), `${file} fetch config V494`);
  check(text.includes("version: 'V494'"), `${file} marker runtime V494`);
  check(!text.includes('audit clone FantaPetillo'), `${file} senza footer clone hard-coded`);
}

const registryFiles = [
  'fanta-engine/js/core/unified-section-registry-v480.js',
  `${zonaRoot}/assets/js/core/section-registry-v405.js`,
  `${zonaNestedRoot}/assets/js/core/section-registry-v405.js`,
  `${fmmRoot}/assets/js/core/section-registry-v405.js`,
];
for (const file of registryFiles) check(exists(file), `registry presente: ${file}`);
checkIncludes('fanta-engine/js/core/unified-section-registry-v480.js', 'FantaLeagueSectionRegistryV480', 'registry unificato espone namespace V480');

const presentationFiles = [
  'fanta-engine/js/core/league-presentation-v481.js',
  'fanta-engine/js/core/data-paths-v490.js',
  'fanta-engine/data/shared-assets/v485/assets/listoni/manifest.json',
  'fanta-engine/data/shared-assets/v485/assets/calciomercato/links.json',
  'fanta-engine/data/shared-css-assets-v487.json',
  'fanta-engine/data/shared-js-dependency-inventory-v488.json',
  'fanta-engine/data/shared-js-modules-v491.json',
];
for (const file of presentationFiles) check(exists(file), `asset motore comune presente: ${file}`);

for (const file of [`${zonaRoot}/assets/js/data/static-files-service.js`, `${zonaNestedRoot}/assets/js/data/static-files-service.js`, `${fmmRoot}/assets/js/data/static-files-service.js`]) {
  const text = read(file);
  check(text.includes('data-paths-v490.js'), `${file} usa adapter data paths V490`);
  check(text.includes('listoniManifestFallback'), `${file} mantiene fallback listoni locali`);
}

for (const cfgPath of [`${zonaRoot}/assets/league-config.json`, `${zonaNestedRoot}/assets/league-config.json`, `${fmmRoot}/assets/league-config.json`]) {
  const cfg = readJson(cfgPath);
  check(String(cfg.dataPaths?.listoniManifest || '').includes('fanta-engine/data/shared-assets/v485'), `${cfgPath} listone primario centralizzato`);
  check(String(cfg.dataPaths?.listoniManifestFallback || '').includes('./assets/listoni/manifest.json'), `${cfgPath} listone fallback locale`);
  check(String(cfg.dataPaths?.calciomercatoLinks || '').includes('fanta-engine/data/shared-assets/v485'), `${cfgPath} calciomercato primario centralizzato`);
  check(String(cfg.dataPaths?.calciomercatoLinksFallback || '').includes('./assets/calciomercato/links.json'), `${cfgPath} calciomercato fallback locale`);
  check(String(cfg.dataPaths?.rostersManifest || '').startsWith('./assets/rose/'), `${cfgPath} rose restano locali`);
  check(String(cfg.dataPaths?.competitionsManifest || '').startsWith('./assets/competitions/'), `${cfgPath} competizioni restano locali`);
}

const appFiles = [`${zonaRoot}/assets/app.js`, `${zonaNestedRoot}/assets/app.js`, `${fmmRoot}/assets/app.js`];
for (const file of appFiles) {
  const text = read(file);
  check(text.includes('FantaEngineJsModuleCentralizationV491'), `${file} marker centralizzazione moduli V491`);
  check(text.includes('fanta-engine/js/shared/v491/assets/js/core/constants.js'), `${file} importa constants dal motore`);
  check(text.includes('fanta-engine/js/shared/v491/assets/js/core/dom.js'), `${file} importa dom dal motore`);
  check(text.includes('fanta-engine/js/shared/v491/assets/js/domain/entities.js'), `${file} importa domain entities dal motore`);
}

const emailZona = read(`${zonaRoot}/assets/emailjs.js`);
const emailFmm = read(`${fmmRoot}/assets/emailjs.js`);
check(emailZona.includes('EMAILJS_SERVICE_ID = "service_trz4dxe"'), 'EmailJS ZonaOrientale service originale');
check(!emailZona.includes('service_ttjf7js'), 'EmailJS ZonaOrientale non usa service FantaMantraManager');
check(emailFmm.includes('EMAILJS_SERVICE_ID = "service_ttjf7js"'), 'EmailJS FantaMantraManager service dedicato');
check(emailFmm.includes('EMAILJS_TRANSFER_TEMPLATE_ID = "template_svkkhlr"'), 'EmailJS FantaMantraManager template comunicato scambio');
check(emailFmm.includes('EMAILJS_DEFAULT_RECIPIENT = "barra.silvio@gmail.com"'), 'EmailJS FantaMantraManager destinatario corretto');
check(!emailFmm.includes('caparrotti86@yahoo.it'), 'EmailJS FantaMantraManager senza destinatario legacy');

const fmmApp = read(`${fmmRoot}/assets/app.js`);
check(fmmApp.includes('renderRuleProposalsPresidentSectionV479'), 'Proposte regolamento FantaMantraManager preservate');
check(fmmApp.includes('ruleProposals'), 'collection ruleProposals preservata');
check(fmmApp.includes('FANTAMANTRA_MANAGER_EMAILJS_SERVICE_ID_V478'), 'service EmailJS presidente FMM preservato in app');
check(fmmApp.includes('Comunicato avvenuto scambio'), 'card Comunicato avvenuto scambio preservata');
check(fmmApp.includes('Svincola'), 'funzione/card Svincola preservata');
check(fmmApp.includes('if (state.isAdmin) return') || fmmApp.includes('state.isAdmin'), 'logica admin preservata in app');
checkIncludes(`${fmmRoot}/assets/js/sections/regolamento-section-v402.js`, 'regolamento-fantapetillo-mantra-manager-2026-2027-v474.pdf', 'regolamento FantaMantraManager V474 preservato');
check(exists(`${fmmRoot}/assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027-v474.pdf`), 'PDF regolamento FantaMantraManager presente');

for (const file of [
  'fanta-engine/tools/audit-unified-section-registry-v480.mjs',
  'fanta-engine/tools/audit-presentation-engine-v481.mjs',
  'fanta-engine/tools/audit-multileague-contamination-v491.mjs',
  'fanta-engine/tools/audit-js-module-centralization-v491.mjs',
  'fanta-engine/tools/audit-runtime-regression-v494.mjs',
]) check(exists(file), `audit/tool presente: ${file}`);

if (fail > 0) {
  console.error(`\nAudit regressione runtime V494 fallito: ${ok} OK, ${fail} FAIL`);
  for (const item of failures) console.error(` - ${item}`);
  process.exit(1);
}
console.log(`\nAudit regressione runtime V494 completato: ${ok} OK, ${fail} FAIL`);
