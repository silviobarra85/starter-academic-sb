#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const repoRoot = path.resolve(root, '..');
let ok = 0;
let fail = 0;
const failures = [];

function abs(filePath) {
  return path.join(root, filePath);
}

function repoAbs(filePath) {
  return path.join(repoRoot, filePath);
}

function exists(filePath) {
  return fs.existsSync(abs(filePath));
}

function existsRepo(filePath) {
  return fs.existsSync(repoAbs(filePath));
}

function read(filePath) {
  return fs.readFileSync(abs(filePath), 'utf8');
}

function readRepo(filePath) {
  return fs.readFileSync(repoAbs(filePath), 'utf8');
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

function checkIncludes(filePath, fragment, label) {
  check(read(filePath).includes(fragment), label);
}

function checkRepoIncludes(filePath, fragment, label) {
  check(readRepo(filePath).includes(fragment), label);
}

const configs = [
  ['zonaorientale/assets/league-config.json', 'zonaorientale', 'ZonaOrientale Salerno'],
  ['zonaorientale/static/assets/league-config.json', 'zonaorientale', 'ZonaOrientale Salerno'],
  ['fantapetillomantramanager/assets/league-config.json', 'fantapetillomantramanager', 'FantaMantraManager'],
];

for (const [file, leagueId, name] of configs) {
  const cfg = readJson(file);
  check(cfg.currentVersion === 494, `${file} currentVersion V494`);
  check(cfg.leagueId === leagueId, `${file} leagueId corretto`);
  check(cfg.name === name, `${file} nome pubblico corretto`);
  check(cfg.features?.unifiedSectionRegistry === true, `${file} registry unico preservato`);
  check(cfg.features?.antiContaminationAudit === true, `${file} anti-contaminazione preservata`);
  check(cfg.features?.sharedAssetsCentralized === true, `${file} shared data assets preservati`);
  check(cfg.features?.sharedCssCentralized === true, `${file} shared CSS preservati`);
  check(cfg.features?.commonDataPathAdapter === true, `${file} data path adapter preservato`);
  check(cfg.features?.sharedJsModulesCentralized === true, `${file} moduli JS condivisi preservati`);
  check(cfg.features?.runtimeRegressionAudit === true, `${file} audit regressione preservato`);
  check(cfg.features?.mergeReadinessDocs === true, `${file} docs merge readiness attive`);
  check(cfg.features?.mergeReadinessAudit === true, `${file} audit merge readiness attivo`);
  check(cfg.features?.localDuplicateCleanupReadiness === true, `${file} cleanup readiness V494 attiva`);
  check(cfg.guardrails?.noPhysicalDeletionInV494 === true, `${file} nessuna cancellazione fisica V494`);
  check(cfg.guardrails?.manualRegressionChecklistRequired === true, `${file} checklist manuale richiesta`);
  check(cfg.guardrails?.localFallbackCopiesRemainRequired === true, `${file} fallback locali da mantenere`);
  check(cfg.guardrails?.noLocalDuplicateCleanupWithoutExplicitRequest === true, `${file} no cleanup duplicati senza richiesta`);
  check(String(cfg.dataPaths?.calciomercatoLinksFallback || '').includes('./assets/calciomercato/links.json'), `${file} fallback calciomercato locale in config`);
  check(String(cfg.dataPaths?.listoniManifestFallback || '').includes('./assets/listoni/manifest.json'), `${file} fallback listoni locale in config`);
}

const htmlFiles = [
  'zonaorientale/index.html', 'zonaorientale/competition.html', 'zonaorientale/player.html',
  'zonaorientale/static/index.html', 'zonaorientale/static/competition.html', 'zonaorientale/static/player.html',
  'fantapetillomantramanager/index.html', 'fantapetillomantramanager/competition.html', 'fantapetillomantramanager/player.html',
  'fantapetillomantramanager/news.html', 'fantapetillomantramanager/bilanci.html',
];
for (const file of htmlFiles) {
  check(exists(file), `${file} presente`);
  check(read(file).includes('?v=494'), `${file} cache-buster V494`);
}
for (const file of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html','zonaorientale/static/index.html','zonaorientale/static/competition.html','zonaorientale/static/player.html']) {
  checkIncludes(file, 'ZonaOrientale Salerno · V494 · Ultimo aggiornamento 24/06/2026', `footer ZonaOrientale V494 in ${file}`);
}
for (const file of ['fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html']) {
  checkIncludes(file, 'FantaMantraManager · V494 · Ultimo aggiornamento 24/06/2026', `footer FantaMantraManager V494 in ${file}`);
}

const engineFiles = [
  'fanta-engine/js/core/unified-section-registry-v480.js',
  'fanta-engine/js/core/league-presentation-v481.js',
  'fanta-engine/data/shared-assets-inventory-v484.json',
  'fanta-engine/data/shared-assets/v485/assets/listoni/manifest.json',
  'fanta-engine/data/shared-assets/v485/assets/calciomercato/links.json',
  'fanta-engine/data/shared-runtime-assets-inventory-v486.json',
  'fanta-engine/data/shared-css-assets-v487.json',
  'fanta-engine/data/shared-js-dependency-inventory-v488.json',
  'fanta-engine/js/shared/v489/assets/js/core/admin-card-visibility-v456.js',
  'fanta-engine/js/core/data-paths-v490.js',
  'fanta-engine/data/shared-js-modules-v491.json',
  'fanta-engine/tools/audit-runtime-regression-v494.mjs',
  'fanta-engine/tools/audit-multileague-contamination-v494.mjs',
  'fanta-engine/tools/audit-merge-readiness-v494.mjs',
  'fanta-engine/data/local-duplicate-cleanup-plan-v494.json',
  'fanta-engine/tools/audit-local-duplicate-cleanup-readiness-v494.mjs',
];
for (const file of engineFiles) check(exists(file), `motore/tool presente: ${file}`);

for (const file of ['zonaorientale/assets/js/data/static-files-service.js','zonaorientale/static/assets/js/data/static-files-service.js','fantapetillomantramanager/assets/js/data/static-files-service.js']) {
  const text = read(file);
  check(text.includes('data-paths-v490.js'), `${file} usa adapter V490`);
  check(text.includes('listoniManifestFallback'), `${file} fallback listoni locale`);
  check(text.includes('listoniBaseFallback'), `${file} fallback base listoni locale`);
}

const fmmApp = read('fantapetillomantramanager/assets/app.js');
check(fmmApp.includes('renderRuleProposalsPresidentSectionV479'), 'FMM Proposte regolamento preservate');
check(fmmApp.includes('ruleProposals'), 'FMM collection ruleProposals preservata');
check(fmmApp.includes('Comunicato avvenuto scambio'), 'FMM card comunicato scambio preservata');
check(fmmApp.includes('Svincola'), 'FMM card/funzione svincola preservata');
check(fmmApp.includes('FANTAMANTRA_MANAGER_EMAILJS_SERVICE_ID_V478'), 'FMM EmailJS presidente preservato');
check(read('fantapetillomantramanager/assets/emailjs.js').includes('service_ttjf7js'), 'FMM EmailJS service dedicato');
check(read('zonaorientale/assets/emailjs.js').includes('service_trz4dxe'), 'ZonaOrientale EmailJS service preservato');
check(!read('zonaorientale/assets/emailjs.js').includes('service_ttjf7js'), 'ZonaOrientale non usa service FMM');

const docsFiles = [
  'docs/fantapetillomantramanager/00_STATO_CORRENTE_E_INDICE.md',
  'docs/fantapetillomantramanager/01_FUNZIONALITA_E_CHANGELOG.md',
  'docs/fantapetillomantramanager/02_ARCHITETTURA_DATI_FIREBASE_EMAILJS.md',
  'docs/fantapetillomantramanager/03_ADMIN_E_PRESIDENTI.md',
  'docs/fantapetillomantramanager/04_ROADMAP_MOTORE_UNICO.md',
  'docs/fantapetillomantramanager/MERGE_BRANCH_CHECKLIST_V494.md',
  'docs/fantapetillomantramanager/LOCAL_DUPLICATE_CLEANUP_V494.md',
  'docs/fantapetillomantramanager/POST_V494_IMPROVEMENTS.md',
  'docs/fantapetillomantramanager/HANDOFF_V494_LOCAL_DUPLICATE_CLEANUP_READINESS.md',
  'docs/zonaorientale/00_STATO_CORRENTE_E_INDICE.md',
  'docs/zonaorientale/05_TEST_AUDIT_REGRESSIONI.md',
  'docs/zonaorientale/07_PIANIFICAZIONE_ROADMAP_PROSSIME_ATTIVITA.md',
  'docs/zonaorientale/MERGE_BRANCH_CHECKLIST_V494.md',
  'docs/zonaorientale/LOCAL_DUPLICATE_CLEANUP_V494.md',
  'docs/zonaorientale/HANDOFF_V494_LOCAL_DUPLICATE_CLEANUP_READINESS.md',
];
for (const file of docsFiles) check(existsRepo(file), `documentazione presente: ${file}`);
checkRepoIncludes('docs/fantapetillomantramanager/MERGE_BRANCH_CHECKLIST_V494.md', 'V480-V494', 'checklist FMM copre V480-V494');
checkRepoIncludes('docs/zonaorientale/MERGE_BRANCH_CHECKLIST_V494.md', 'V480-V494', 'checklist ZonaOrientale copre V480-V494');
check(!existsRepo("docs/zonaorientale/FUNZIONALITA'.md") || !readRepo("docs/zonaorientale/FUNZIONALITA'.md").includes('V494 - Merge readiness'), "FUNZIONALITA'.md non aggiornato da V494");

if (fail > 0) {
  console.error(`\nAudit merge readiness V494 fallito: ${ok} OK, ${fail} FAIL`);
  for (const item of failures) console.error(` - ${item}`);
  process.exit(1);
}
console.log(`\nAudit merge readiness V494 completato: ${ok} OK, ${fail} FAIL`);
