#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).split(path.sep).join('/');
    if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'public') continue;
    if (entry.isDirectory()) {
      out.push(rel + '/');
      walk(full, out);
    } else {
      out.push(rel);
    }
  }
  return out;
}

const all = walk(root);
const dsStore = all.filter((rel) => path.basename(rel) === '.DS_Store');
const macosx = all.filter((rel) => rel.split('/').includes('__MACOSX') || rel === '__MACOSX/');

if (dsStore.length) {
  failures.push(`Trovati file .DS_Store: ${dsStore.slice(0, 20).join(', ')}`);
}
if (macosx.length) {
  failures.push(`Trovate cartelle/file __MACOSX: ${macosx.slice(0, 20).join(', ')}`);
}
if (exists('scripts/init_kickstart.sh')) {
  failures.push('Trovato scripts/init_kickstart.sh: script obsoleto del template Kickstart/Academic da rimuovere.');
}

const requiredDocs = [
  'docs/SAFE_REPO_CLEANUP_V542.md',
  'docs/AI_ASSISTANT_HANDOFF_V542.md',
  'docs/AI_ASSISTANT_HANDOFF_CURRENT.md',
  'docs/OVERLAY_ROADMAP.md',
  'docs/CENTRALIZATION_STATUS_V521.md',
];
for (const rel of requiredDocs) {
  if (!exists(rel)) failures.push(`Documento mancante: ${rel}`);
}

const versionChecks = [
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json',
];
for (const rel of versionChecks) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    failures.push(`File runtime mancante: ${rel}`);
    continue;
  }
  const content = fs.readFileSync(file, 'utf8');
  if (!content.includes('542') && !content.includes('V542') && !content.includes('v=542')) {
    failures.push(`File non allineato a V542: ${rel}`);
  }
}

if (failures.length) {
  console.error('Audit V542 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error('\nEsegui prima la pulizia:');
  console.error('find . -name ".DS_Store" -delete');
  console.error('find . -name "__MACOSX" -type d -prune -exec rm -rf {} +');
  console.error('rm -f scripts/init_kickstart.sh');
  console.error('rmdir scripts 2>/dev/null || true');
  process.exit(1);
}

console.log('Audit V542 superato: pulizia sicura repo completata, runtime whole-site a ?v=542 e docs/handoff aggiornati.');
