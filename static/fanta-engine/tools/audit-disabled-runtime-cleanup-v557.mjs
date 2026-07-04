#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const toolsDir = path.dirname(__filename);
const repoRoot = path.resolve(toolsDir, '../../..');

const read = (rel) => fs.readFileSync(path.join(repoRoot, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(repoRoot, rel));
const failures = [];

const requiredFiles = [
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json',
  'docs/OVERLAY_ROADMAP.md',
  'docs/AI_ASSISTANT_HANDOFF_CURRENT.md',
  'docs/AI_ASSISTANT_HANDOFF_V557.md',
  'docs/DISABLED_RUNTIME_CLEANUP_V557.md'
];

for (const rel of requiredFiles) {
  if (!exists(rel)) failures.push(`File mancante: ${rel}`);
}

const runtimeFiles = [
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js'
];

for (const rel of runtimeFiles) {
  if (!exists(rel)) continue;
  const text = read(rel);
  if (!text.includes('?v=557') && !text.includes('V557')) {
    failures.push(`File non allineato a V557: ${rel}`);
  }
}

const disabledRuntimeFiles = [
  'static/fanta-engine/js/ui/navigation-active-singleton-v534.js',
  'static/fanta-engine/js/ui/navigation-fluidity-v535.js',
  'static/fanta-engine/js/ui/navigation-performance-guard-v536.js',
  'static/fanta-engine/js/ui/performance-profiler-lazy-render-v552.js',
  'static/fanta-engine/js/ui/application-cache-chunked-tables-v553.js',
  'static/fanta-engine/js/ui/eager-data-preload-v555.js'
];

for (const rel of disabledRuntimeFiles) {
  if (exists(rel)) failures.push(`Modulo runtime disattivato ancora presente: ${rel}`);
}

const importNeedles = disabledRuntimeFiles.map((rel) => rel.split('/').pop());
for (const rel of runtimeFiles) {
  if (!exists(rel)) continue;
  const text = read(rel);
  for (const needle of importNeedles) {
    const imported = text.includes(`import('../../fanta-engine/js/ui/${needle}`)
      || text.includes(`import "../../fanta-engine/js/ui/${needle}`)
      || text.includes(`modulepreload`) && text.includes(needle);
    if (imported) failures.push(`Import/preload runtime disattivato ancora presente in ${rel}: ${needle}`);
  }
}

if (failures.length) {
  console.error('Audit V557 fallito:');
  for (const item of failures) console.error(`- ${item}`);
  console.error('\nSe fallisce solo per moduli ancora presenti, esegui:');
  console.error('node static/fanta-engine/tools/cleanup-disabled-runtime-modules-v557.mjs --yes');
  process.exit(1);
}

console.log('Audit V557 superato: runtime lean validato, moduli sperimentali disattivati rimossi fisicamente e whole-site a ?v=557.');
