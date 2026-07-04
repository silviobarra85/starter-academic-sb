#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));

function assert(condition, message) {
  if (!condition) errors.push(message);
}

const modulePath = 'static/fanta-engine/js/ui/performance-profiler-lazy-render-v552.js';
assert(exists(modulePath), `Modulo mancante: ${modulePath}`);
if (exists(modulePath)) {
  const mod = read(modulePath);
  assert(mod.includes('installPerformanceProfilerLazyRenderV552'), 'Export installPerformanceProfilerLazyRenderV552 mancante.');
  assert(mod.includes('fetchWithStaticJsonCacheV552'), 'Cache fetch JSON statici V552 mancante.');
  assert(mod.includes('content-visibility'), 'Content visibility V552 mancante.');
  assert(mod.includes('doesNotReplaceRouter: true'), 'Guardrail router V552 mancante.');
}

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const appPath = `static/${league}/assets/app.js`;
  const indexPath = `static/${league}/index.html`;
  const cfgPath = `static/${league}/assets/league-config.json`;
  assert(exists(appPath), `app.js mancante per ${league}`);
  assert(exists(indexPath), `index.html mancante per ${league}`);
  assert(exists(cfgPath), `league-config.json mancante per ${league}`);
  if (exists(appPath)) {
    const app = read(appPath);
    assert(app.includes('performance-profiler-lazy-render-v552.js?v=552'), `Import V552 mancante in ${appPath}`);
    assert(app.includes('FantaEnginePerformanceOptimizationRuntimeV552'), `Install runtime V552 mancante in ${appPath}`);
    assert(!app.includes('?v=551'), `Residuo cache-buster ?v=551 in ${appPath}`);
  }
  if (exists(indexPath)) {
    const index = read(indexPath);
    assert(index.includes('app.js?v=552'), `app.js non allineato a V552 in ${indexPath}`);
    assert(index.includes('league-config-v443.js?v=552'), `league-config non allineato a V552 in ${indexPath}`);
    assert(index.includes('performance-profiler-lazy-render-v552.js?v=552'), `Modulepreload V552 mancante in ${indexPath}`);
    assert(index.includes('V552'), `Footer/versione V552 non trovata in ${indexPath}`);
  }
  if (exists(cfgPath)) {
    const cfg = JSON.parse(read(cfgPath));
    assert(String(cfg.currentVersion) === '552', `currentVersion non 552 in ${cfgPath}`);
    assert(cfg.performanceOptimizationV552?.version === 'V552', `metadata performanceOptimizationV552 mancante in ${cfgPath}`);
  }
}

for (const doc of [
  'docs/PERFORMANCE_OPTIMIZATION_V552.md',
  'docs/AI_ASSISTANT_HANDOFF_V552.md',
  'docs/AI_ASSISTANT_HANDOFF_CURRENT.md',
  'docs/OVERLAY_ROADMAP.md'
]) {
  assert(exists(doc), `Documento mancante: ${doc}`);
}

if (errors.length) {
  console.error('Audit V552 fallito:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('Audit V552 superato: performance profiler/lazy render attivo, cache JSON statici, runtime whole-site a ?v=552 e docs/handoff aggiornati.');
