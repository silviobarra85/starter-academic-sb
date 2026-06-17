#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(new URL('..', import.meta.url).pathname);
function read(file){ return fs.readFileSync(path.join(root,file),'utf8'); }
function exists(file){ return fs.existsSync(path.join(root,file)); }
function assert(condition, message){ if(!condition){ console.error(`FAIL: ${message}`); process.exitCode = 1; } }
const index = read('index.html');
const blocked = [
  'fanta-petillo-setup-kit-v458',
  'fanta-petillo-real-data-validator-v459',
  'fanta-petillo-firestore-seed-preview-v460',
  'fanta-petillo-firestore-import-v461',
  'fanta-petillo-real-data-workflow-v462',
  'fanta-petillo-public-snapshot-builder-v463',
  'fanta-petillo-team-area-readiness-v464',
  'fanta-petillo-launch-readiness-v465'
];
for (const token of blocked) assert(!index.includes(token), `${token} non deve essere caricato in index.html`);
assert(index.includes('fanta-petillo-admin-standard-setup-v467.js'), 'script setup standard Admin mancante');
assert(index.includes('fanta-petillo-admin-standard-setup-v467.css'), 'css setup standard Admin mancante');
assert(index.includes('fanta-petillo-share-netlify-v466.js'), 'script share Netlify V466 mancante');
const snap = JSON.parse(read('assets/snapshots/seasons/2026-2027.json'));
assert(snap.setupStatus === 'standard-admin-v467' || snap.setupStatus === 'standard-admin-v468', 'snapshot 2026-2027 non marcato setup standard Admin');
assert(Array.isArray(snap.teams) && snap.teams.length === 0, 'snapshot 2026-2027 deve essere vuoto finche si usa Admin standard');
const snapshotText = read('assets/snapshots/seasons/2026-2027.json');
assert(!/Placeholder|placeholder-data-v457|fpmm-club/i.test(snapshotText), 'snapshot contiene ancora placeholder V457');
const cfg = JSON.parse(read('assets/public/config.json'));
assert(cfg.setupStatus === 'standard-admin-v467' || cfg.setupStatus === 'standard-admin-v468', 'config pubblica non marcata setup standard Admin');
const obsoleteFiles = [
  'assets/js/core/fanta-petillo-setup-kit-v458.js',
  'assets/js/core/fanta-petillo-real-data-validator-v459.js',
  'assets/js/core/fanta-petillo-firestore-seed-preview-v460.js',
  'assets/js/core/fanta-petillo-firestore-import-v461.js',
  'assets/js/core/fanta-petillo-real-data-workflow-v462.js',
  'assets/js/core/fanta-petillo-public-snapshot-builder-v463.js',
  'assets/js/core/fanta-petillo-team-area-readiness-v464.js',
  'assets/js/core/fanta-petillo-launch-readiness-v465.js',
  'assets/css/refactor/fanta-petillo-setup-kit-v458.css',
  'assets/css/refactor/fanta-petillo-real-data-validator-v459.css',
  'assets/css/refactor/fanta-petillo-firestore-seed-preview-v460.css',
  'assets/css/refactor/fanta-petillo-firestore-import-v461.css',
  'assets/css/refactor/fanta-petillo-real-data-workflow-v462.css',
  'assets/css/refactor/fanta-petillo-public-snapshot-builder-v463.css',
  'assets/css/refactor/fanta-petillo-team-area-readiness-v464.css',
  'assets/css/refactor/fanta-petillo-launch-readiness-v465.css',
  'tools/fantapetillo-placeholder-seed-v457.json',
  'assets/setup/fantapetillo-real-teams-template-v458.csv',
  'assets/setup/fantapetillo-real-teams-template-v458.json'
];
for (const file of obsoleteFiles) assert(!exists(file), `file tecnico obsoleto ancora presente: ${file}`);
if (!process.exitCode) console.log('OK audit setup standard Admin V468');
