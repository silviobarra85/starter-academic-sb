#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const REPO_ROOT = process.cwd();
const CENTRAL_ROOT = path.join(REPO_ROOT, 'static', 'fanta-engine', 'data', 'shared-assets', 'current', 'assets');
const LOCAL_ROOTS = [
  path.join(REPO_ROOT, 'static', 'zonaorientale', 'assets'),
  path.join(REPO_ROOT, 'static', 'fantapetillomantramanager', 'assets')
];
const TARGETS = ['listoni', 'calciomercato'];
const execute = process.argv.includes('--yes');

function exists(p) {
  return fs.existsSync(p);
}

function walkFiles(dir) {
  if (!exists(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile()) out.push(full);
    }
  }
  return out.sort();
}

function digest(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function relativeMap(dir) {
  const map = new Map();
  for (const file of walkFiles(dir)) {
    map.set(path.relative(dir, file).split(path.sep).join('/'), digest(file));
  }
  return map;
}

function compareDirs(centralDir, localDir) {
  const central = relativeMap(centralDir);
  const local = relativeMap(localDir);
  const missing = [];
  const extra = [];
  const different = [];
  for (const [rel, hash] of central) {
    if (!local.has(rel)) missing.push(rel);
    else if (local.get(rel) !== hash) different.push(rel);
  }
  for (const rel of local.keys()) {
    if (!central.has(rel)) extra.push(rel);
  }
  return { centralCount: central.size, localCount: local.size, missing, extra, different };
}

const report = [];
const blockers = [];

for (const target of TARGETS) {
  const centralDir = path.join(CENTRAL_ROOT, target);
  if (!exists(centralDir)) blockers.push(`Path centrale mancante: ${path.relative(REPO_ROOT, centralDir)}`);
}

for (const localRoot of LOCAL_ROOTS) {
  for (const target of TARGETS) {
    const centralDir = path.join(CENTRAL_ROOT, target);
    const localDir = path.join(localRoot, target);
    if (!exists(localDir)) {
      report.push({ path: path.relative(REPO_ROOT, localDir), status: 'already-absent' });
      continue;
    }
    const cmp = compareDirs(centralDir, localDir);
    const ok = !cmp.missing.length && !cmp.extra.length && !cmp.different.length;
    report.push({ path: path.relative(REPO_ROOT, localDir), status: ok ? 'ready-to-delete' : 'blocked', ...cmp });
    if (!ok) {
      blockers.push(`Fallback non identico al centrale: ${path.relative(REPO_ROOT, localDir)}`);
    }
  }
}

if (blockers.length) {
  console.error('Cleanup V543 bloccato. Dettagli:');
  for (const item of blockers) console.error(`- ${item}`);
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}

if (!execute) {
  console.log('Dry-run cleanup V543 superato. Per cancellare i fallback locali eseguire con --yes.');
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}

for (const localRoot of LOCAL_ROOTS) {
  for (const target of TARGETS) {
    const localDir = path.join(localRoot, target);
    if (exists(localDir)) fs.rmSync(localDir, { recursive: true, force: true });
  }
}

console.log('Cleanup V543 completato: fallback locali Listoni/Calciomercato rimossi.');
console.log(JSON.stringify(report, null, 2));
