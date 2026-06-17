#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(new URL('..', import.meta.url).pathname);
function read(file){ return fs.readFileSync(path.join(root,file),'utf8'); }
function assert(condition, message){ if(!condition){ console.error(`FAIL: ${message}`); process.exitCode = 1; } }
const index = read('index.html');
const blocked = [
  'fanta-petillo-setup-kit-v458',
  'fanta-petillo-real-data-validator-v459',
  'fanta-petillo-firestore-seed-preview-v460',
  'fanta-petillo-firestore-import-v461',
  'fanta-petillo-real-data-workflow-v462',
  'fanta-petillo-public-snapshot-builder-v463',
  'fanta-petillo-team-area-readiness-v464'
];
for (const token of blocked) assert(!index.includes(token), `${token} non deve essere caricato in index.html`);
assert(index.includes('fanta-petillo-admin-standard-setup-v467.js'), 'script setup standard V467 mancante');
assert(index.includes('fanta-petillo-admin-standard-setup-v467.css'), 'css setup standard V467 mancante');
const snap = JSON.parse(read('assets/snapshots/seasons/2026-2027.json'));
assert(snap.setupStatus === 'standard-admin-v467', 'snapshot 2026-2027 non marcato standard-admin-v467');
assert(Array.isArray(snap.teams) && snap.teams.length === 0, 'snapshot 2026-2027 deve essere vuoto finche si usa Admin standard');
const snapshotText = read('assets/snapshots/seasons/2026-2027.json');
assert(!/Placeholder|placeholder-data-v457|fpmm-club/i.test(snapshotText), 'snapshot contiene ancora placeholder V457');
const cfg = JSON.parse(read('assets/public/config.json'));
assert(cfg.setupStatus === 'standard-admin-v467', 'config pubblica non marcata standard-admin-v467');
if (!process.exitCode) console.log('OK audit standard Admin V467');
