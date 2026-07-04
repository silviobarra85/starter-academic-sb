#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
let ok = 0;
let fail = 0;
const failures = [];

function abs(filePath) { return path.join(root, filePath); }
function exists(filePath) { return fs.existsSync(abs(filePath)); }
function read(filePath) { return fs.readFileSync(abs(filePath), 'utf8'); }
function readJson(filePath) { return JSON.parse(read(filePath)); }
function sha256(filePath) { return crypto.createHash('sha256').update(fs.readFileSync(abs(filePath))).digest('hex'); }
function check(condition, label) {
  if (condition) { ok += 1; console.log(`OK  - ${label}`); }
  else { fail += 1; failures.push(label); console.error(`FAIL - ${label}`); }
}

const planPath = 'fanta-engine/data/local-duplicate-cleanup-plan-v494.json';
check(exists(planPath), 'manifest cleanup readiness V494 presente');
const plan = readJson(planPath);
check(plan.version === 'V494', 'manifest V494 corretto');
check(plan.policy?.physicalDeletionInThisOverlay === false, 'V494 non elimina fisicamente file');
check(plan.policy?.localFallbackCopiesRemainRequired === true, 'fallback locali ancora richiesti');
check(plan.summary?.noFilesDeleted === true, 'manifest dichiara nessuna cancellazione');
check(plan.summary?.centralFilesTracked === 79, '79 file centralizzati tracciati come candidati cleanup');

const configs = [
  'zonaorientale/assets/league-config.json',
  'zonaorientale/static/assets/league-config.json',
  'fantapetillomantramanager/assets/league-config.json',
];
for (const file of configs) {
  const cfg = readJson(file);
  check(cfg.currentVersion === 494, `${file} currentVersion V494`);
  check(cfg.features?.localDuplicateCleanupReadiness === true, `${file} readiness cleanup attiva`);
  check(cfg.guardrails?.localFallbackCopiesRemainRequired === true, `${file} fallback locali preservati`);
  check(cfg.guardrails?.noPhysicalDeletionInV494 === true, `${file} nessuna cancellazione fisica V494`);
}

for (const category of plan.categories) {
  check(category.count > 0, `${category.name} contiene file candidati`);
  for (const item of category.items) {
    check(exists(item.centralPath), `${category.name}: central presente ${item.centralPath}`);
    if (item.sha256) check(sha256(item.centralPath) === item.sha256, `${category.name}: sha centrale stabile ${item.path}`);
    check(exists(`zonaorientale/${item.path}`), `${category.name}: fallback ZonaOrientale presente ${item.path}`);
    check(exists(`fantapetillomantramanager/${item.path}`), `${category.name}: fallback FantaMantraManager presente ${item.path}`);
  }
}

const htmlFiles = [
  'zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html',
  'zonaorientale/static/index.html','zonaorientale/static/competition.html','zonaorientale/static/player.html',
  'fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html',
  'fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html',
];
for (const file of htmlFiles) {
  check(exists(file), `${file} presente`);
  check(read(file).includes('?v=494'), `${file} cache-buster V494`);
}
for (const file of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html','zonaorientale/static/index.html','zonaorientale/static/competition.html','zonaorientale/static/player.html']) {
  check(read(file).includes('ZonaOrientale Salerno · V494 · Ultimo aggiornamento 24/06/2026'), `footer ZonaOrientale V494 in ${file}`);
}
for (const file of ['fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html']) {
  check(read(file).includes('FantaMantraManager · V494 · Ultimo aggiornamento 24/06/2026'), `footer FMM V494 in ${file}`);
}

for (const file of ['zonaorientale/assets/js/data/static-files-service.js','zonaorientale/static/assets/js/data/static-files-service.js','fantapetillomantramanager/assets/js/data/static-files-service.js']) {
  const text = read(file);
  check(text.includes('data-paths-v490.js'), `${file} conserva adapter data paths`);
  check(text.includes('Fallback'), `${file} conserva fallback locale testuale`);
}

if (fail > 0) {
  console.error(`\nAudit cleanup readiness V494 fallito: ${ok} OK, ${fail} FAIL`);
  for (const item of failures) console.error(` - ${item}`);
  process.exit(1);
}
console.log(`\nAudit cleanup readiness V494 completato: ${ok} OK, ${fail} FAIL`);
