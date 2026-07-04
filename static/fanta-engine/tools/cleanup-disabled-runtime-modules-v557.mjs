#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const toolsDir = path.dirname(__filename);
const repoRoot = path.resolve(toolsDir, '../../..');
const yes = process.argv.includes('--yes');

const candidates = [
  'static/fanta-engine/js/ui/navigation-active-singleton-v534.js',
  'static/fanta-engine/js/ui/navigation-fluidity-v535.js',
  'static/fanta-engine/js/ui/navigation-performance-guard-v536.js',
  'static/fanta-engine/js/ui/performance-profiler-lazy-render-v552.js',
  'static/fanta-engine/js/ui/application-cache-chunked-tables-v553.js',
  'static/fanta-engine/js/ui/eager-data-preload-v555.js'
];

const existing = candidates.filter((rel) => fs.existsSync(path.join(repoRoot, rel)));

if (!yes) {
  console.log('Cleanup V557 dry-run: moduli runtime disattivati candidati alla rimozione fisica:');
  for (const rel of candidates) {
    console.log(`${fs.existsSync(path.join(repoRoot, rel)) ? 'present ' : 'assente '} ${rel}`);
  }
  console.log('\nRiesegui con --yes per cancellare solo i file presenti in questa lista.');
  process.exit(0);
}

for (const rel of existing) {
  const abs = path.join(repoRoot, rel);
  fs.rmSync(abs, { force: true });
  console.log(`rimosso ${rel}`);
}

if (!existing.length) {
  console.log('Cleanup V557: nessun modulo runtime disattivato da rimuovere.');
} else {
  console.log(`Cleanup V557 completato: rimossi ${existing.length} file runtime disattivati.`);
}
