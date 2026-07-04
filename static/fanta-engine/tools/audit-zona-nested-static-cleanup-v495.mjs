#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let ok = 0;
let fail = 0;
const failures = [];
function abs(filePath) { return path.join(root, filePath); }
function exists(filePath) { return fs.existsSync(abs(filePath)); }
function read(filePath) { return fs.readFileSync(abs(filePath), 'utf8'); }
function readJson(filePath) { return JSON.parse(read(filePath)); }
function check(condition, label) {
  if (condition) { ok += 1; console.log(`OK  - ${label}`); }
  else { fail += 1; failures.push(label); console.error(`FAIL - ${label}`); }
}
function walk(dir) {
  const out = [];
  const full = abs(dir);
  if (!fs.existsSync(full)) return out;
  for (const name of fs.readdirSync(full)) {
    const rel = path.join(dir, name);
    const stat = fs.statSync(abs(rel));
    if (stat.isDirectory()) out.push(...walk(rel));
    else out.push(rel);
  }
  return out;
}
function grepFiles(files, pattern) {
  const hits = [];
  for (const file of files) {
    const normalized = file.replaceAll('\\', '/');
    if (normalized.includes('/tools/')) continue;
    if (normalized.includes('/docs/')) continue;
    if (path.basename(file).startsWith('audit-')) continue;
    if (path.basename(file).includes('cleanup')) continue;
    if (file.endsWith('.md')) continue;
    const text = read(file);
    if (pattern.test(text)) hits.push(file);
  }
  return hits;
}

const planPath = 'fanta-engine/data/nested-zona-static-cleanup-plan-v495.json';
check(exists(planPath), 'manifest cleanup nested V495 presente');
const plan = readJson(planPath);
check(plan.version === 'V495', 'manifest V495 corretto');
check(plan.policy?.physicalDeletionRequiredByGitRm === true, 'manifest richiede git rm esplicito');
check(plan.policy?.runDeleteAfterApplyingOverlay === true, 'manifest indica ordine overlay poi git rm');
check(plan.target?.path === 'static/zonaorientale/static', 'target cleanup corretto');

check(!exists('zonaorientale/static'), 'copia annidata zonaorientale/static rimossa');
check(exists('zonaorientale/index.html'), 'ZonaOrientale canonico presente');
check(exists('zonaorientale/competition.html'), 'ZonaOrientale competition canonico presente');
check(exists('zonaorientale/player.html'), 'ZonaOrientale player canonico presente');
check(exists('fantapetillomantramanager/index.html'), 'FantaMantraManager canonico presente');
check(exists('fanta-engine'), 'motore comune presente');

const cfgs = [
  ['zonaorientale/assets/league-config.json', 'zonaorientale', 'ZonaOrientale Salerno'],
  ['fantapetillomantramanager/assets/league-config.json', 'fantapetillomantramanager', 'FantaMantraManager'],
];
for (const [file, leagueId, name] of cfgs) {
  const cfg = readJson(file);
  check(cfg.currentVersion === 495, `${file} currentVersion V495`);
  check(cfg.leagueId === leagueId, `${file} leagueId corretto`);
  check(cfg.name === name, `${file} nome corretto`);
  check(cfg.features?.nestedZonaStaticCleanup === true, `${file} flag cleanup nested attivo`);
  check(cfg.guardrails?.zonaNestedStaticRemoved === true, `${file} guardrail nested removed`);
  check(cfg.guardrails?.localFallbackCopiesRemainRequired === true, `${file} fallback locali preservati`);
}

const htmlFiles = [
  'zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html',
  'fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html',
  'fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html',
];
for (const file of htmlFiles) {
  check(exists(file), `${file} presente`);
  check(read(file).includes('?v=495'), `${file} cache-buster V495`);
}
for (const file of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html']) {
  check(read(file).includes('ZonaOrientale Salerno · V495 · Ultimo aggiornamento 24/06/2026'), `footer ZonaOrientale V495 in ${file}`);
}
for (const file of ['fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html']) {
  check(read(file).includes('FantaMantraManager · V495 · Ultimo aggiornamento 24/06/2026'), `footer FMM V495 in ${file}`);
}

const canonFiles = [
  'zonaorientale/assets/js/core/league-config-v443.js',
  'fantapetillomantramanager/assets/js/core/league-config-v443.js',
];
for (const file of canonFiles) {
  const text = read(file);
  check(text.includes("currentVersion: '495'"), `${file} currentVersion runtime V495`);
  check(text.includes('league-config.json?v=495'), `${file} fetch config V495`);
  check(!text.includes('audit clone FantaPetillo'), `${file} senza footer clone hard-coded`);
}

const allRuntimeFiles = [
  ...walk('zonaorientale'),
  ...walk('fantapetillomantramanager'),
  ...walk('fanta-engine'),
].filter((file) => !file.includes('/tools/') && !file.includes('/data/nested-zona-static-cleanup-plan-v495.json'));
const nestedHits = grepFiles(allRuntimeFiles, /zonaorientale\/static|\/zonaorientale\/static|static\/zonaorientale\/static/g);
check(nestedHits.length === 0, `nessun riferimento runtime a zonaorientale/static${nestedHits.length ? ` (${nestedHits.slice(0, 8).join(', ')})` : ''}`);

check(read('../netlify.toml').includes('from = "/zonaorientale/static/*"'), 'redirect Netlify sicurezza nested presente');
check(read('../netlify.toml').includes('to = "/zonaorientale/:splat"'), 'redirect Netlify punta al path canonico');

if (fail > 0) {
  console.error(`\nAudit cleanup nested V495 fallito: ${ok} OK, ${fail} FAIL`);
  for (const item of failures) console.error(` - ${item}`);
  process.exit(1);
}
console.log(`\nAudit cleanup nested V495 completato: ${ok} OK, ${fail} FAIL`);
