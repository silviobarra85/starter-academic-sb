#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd(); let ok = 0, fail = 0; const failures = [];
function abs(p){ return path.join(root,p); }
function exists(p){ return fs.existsSync(abs(p)); }
function read(p){ return fs.readFileSync(abs(p),'utf8'); }
function readJson(p){ return JSON.parse(read(p)); }
function check(cond,label){ if(cond){ ok++; console.log(`OK  - ${label}`); } else { fail++; failures.push(label); console.error(`FAIL - ${label}`); } }
check(exists('fanta-engine/js/core/navigation-data-refresh-v511.js'), 'navigation data refresh engine V511 presente');
check(exists('fanta-engine/data/navigation-data-refresh-v511.json'), 'manifest navigation data refresh V511 presente');
const engine = read('fanta-engine/js/core/navigation-data-refresh-v511.js');
check(engine.includes('NAVIGATION_DATA_REFRESH_VERSION_V511'), 'engine espone versione V511');
check(engine.includes('hashchange'), 'engine ascolta hashchange');
check(engine.includes('ensureDataReady'), 'engine supporta ensureDataReady');
check(engine.includes('renderPage'), 'engine supporta renderPage');
const manifest = readJson('fanta-engine/data/navigation-data-refresh-v511.json');
check(manifest.version === 'V511', 'manifest versione V511');
check(Array.isArray(manifest.fixes) && manifest.fixes.length >= 3, 'manifest documenta fix');
for (const cfgPath of ['zonaorientale/assets/league-config.json','fantapetillomantramanager/assets/league-config.json']) {
  const cfg = readJson(cfgPath);
  check(cfg.currentVersion === 511, `${cfgPath} currentVersion V511`);
  check(cfg.features?.navigationDataRefresh === true, `${cfgPath} navigation data refresh attivo`);
  check(cfg.features?.staticFirstPublicDataRecovery === true, `${cfgPath} static-first recovery attivo`);
  check(cfg.guardrails?.publicDataMustRenderAfterHashNavigation === true, `${cfgPath} guardrail render dopo hash`);
}
for (const file of ['zonaorientale/assets/app.js','fantapetillomantramanager/assets/app.js']) {
  const text = read(file);
  check(text.includes('navigation-data-refresh-v511.js?v=511'), `${file} importa engine V511`);
  check(text.includes('loadStaticPublicFallbackDataV511'), `${file} fallback static-first presente`);
  check(text.includes('loadPublicDataForSelectedSeasonV511'), `${file} wrapper loader pubblico V511`);
  check(text.includes('FantaEngineNavigationDataRefreshRuntimeV511'), `${file} runtime V511 installato`);
  check(text.includes('setAppPageV511'), `${file} wrapper navigazione V511 presente`);
  check(text.includes('renderCurrentPublicPageV511'), `${file} render pagina corrente V511 presente`);
  check(text.includes('league-config-v443.js?v=511'), `${file} importa league-config con cache V511`);
}
for (const file of ['zonaorientale/assets/js/data/static-files-service.js','fantapetillomantramanager/assets/js/data/static-files-service.js']) {
  const text = read(file);
  check(text.includes('league-config-v443.js?v=511'), `${file} importa league-config V511`);
}
for (const file of ['zonaorientale/index.html','fantapetillomantramanager/index.html']) {
  const text = read(file);
  check(text.includes('./assets/app.js?v=511'), `${file} app cache V511`);
  check(text.includes('league-config-v443.js?v=511'), `${file} league-config cache V511`);
}
check(exists('../docs/NAVIGATION_DATA_REFRESH_V511.md'), 'doc V511 presente');
check(read('../docs/OVERLAY_ROADMAP.md').includes('V511'), 'roadmap aggiornata a V511');
if (fail > 0) { console.error(`\nAudit navigation data refresh V511 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f => console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit navigation data refresh V511 completato: ${ok} OK, ${fail} FAIL`);
