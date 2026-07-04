#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd().endsWith('/static') ? process.cwd() : path.join(process.cwd(), 'static');
const REPO = path.dirname(ROOT);
const checks = [];
function ok(label, condition, detail = '') {
  checks.push({ label, condition: Boolean(condition), detail });
}
function fileExists(rel) {
  return fs.existsSync(path.join(REPO, rel));
}
function read(rel) {
  return fs.readFileSync(path.join(REPO, rel), 'utf8');
}
function contains(rel, pattern) {
  if (!fileExists(rel)) return false;
  return pattern.test(read(rel));
}
const docs = [
  'docs/fantapetillomantramanager/00_STATO_CORRENTE_E_INDICE.md',
  'docs/fantapetillomantramanager/01_FUNZIONALITA_E_CHANGELOG.md',
  'docs/fantapetillomantramanager/02_ARCHITETTURA_DATI_FIREBASE_EMAILJS.md',
  'docs/fantapetillomantramanager/03_ADMIN_E_PRESIDENTI.md',
  'docs/fantapetillomantramanager/04_ROADMAP_MOTORE_UNICO.md',
  'docs/fantapetillomantramanager/HANDOFF_V483_DOCS_CONSOLIDATE.md'
];
for (const rel of docs) ok(`doc presente: ${rel}`, fileExists(rel));
ok('README FantaMantraManager indica docs canonici', contains('docs/fantapetillomantramanager/README.md', /00_STATO_CORRENTE_E_INDICE\.md/));
ok('changelog canonico cita V483', contains('docs/fantapetillomantramanager/01_FUNZIONALITA_E_CHANGELOG.md', /V483/));
ok('architettura cita Firebase dedicato FantaMantraManager', contains('docs/fantapetillomantramanager/02_ARCHITETTURA_DATI_FIREBASE_EMAILJS.md', /fantapetillomantramanager/));
ok('admin/presidenti cita dashboard presidente non visibile ad admin', contains('docs/fantapetillomantramanager/03_ADMIN_E_PRESIDENTI.md', /Dashboard Presidente.*Admin|Admin.*Dashboard Presidente/s));
ok('roadmap cita listoni e calciomercato comuni come candidato motore centrale', contains('docs/fantapetillomantramanager/04_ROADMAP_MOTORE_UNICO.md', /listoni.*calciomercato|calciomercato.*listoni/s));
ok('FantaMantra config cita V483', contains('static/fantapetillomantramanager/assets/league-config.json', /V483 consolida/));
ok('ZonaOrientale config cita V483 senza contenuti Fanta specifici runtime', contains('static/zonaorientale/assets/league-config.json', /V483 consolida/));
for (const rel of [
  'static/fantapetillomantramanager/index.html',
  'static/fantapetillomantramanager/competition.html',
  'static/fantapetillomantramanager/player.html',
  'static/fantapetillomantramanager/news.html',
  'static/fantapetillomantramanager/bilanci.html',
  'static/zonaorientale/index.html',
  'static/zonaorientale/competition.html',
  'static/zonaorientale/player.html',
]) {
  ok(`footer/cache-buster V483: ${rel}`, contains(rel, /V483|\?v=483/));
}
ok('non e stata creata cartella comune listoni in questa patch', !fileExists('static/fanta-engine/data/listoni'));
ok('non e stata creata cartella comune calciomercato in questa patch', !fileExists('static/fanta-engine/data/calciomercato'));
const failed = checks.filter(c => !c.condition);
for (const c of checks) console.log(`${c.condition ? 'OK' : 'FAIL'} - ${c.label}${c.detail ? ` (${c.detail})` : ''}`);
if (failed.length) {
  console.error(`Audit docs consolidation V483: ${checks.length - failed.length} OK, ${failed.length} FAIL`);
  process.exit(1);
}
console.log(`Audit docs consolidation V483: ${checks.length} OK, 0 FAIL`);
