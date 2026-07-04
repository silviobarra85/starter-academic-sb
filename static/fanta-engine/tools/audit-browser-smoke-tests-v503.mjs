#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
let ok = 0, fail = 0; const failures = [];
function abs(p){ return path.join(root,p); }
function exists(p){ return fs.existsSync(abs(p)); }
function read(p){ return fs.readFileSync(abs(p),'utf8'); }
function readJson(p){ return JSON.parse(read(p)); }
function check(c,l){ if(c){ ok++; console.log(`OK  - ${l}`); } else { fail++; failures.push(l); console.error(`FAIL - ${l}`); } }

check(!exists('zonaorientale/static'), 'copia annidata zonaorientale/static assente');
check(!exists('static'), 'cartella accidentale static/static assente');
check(exists('fanta-engine/tools/playwright-smoke-v503.mjs'), 'script Playwright V503 presente');
check(exists('fanta-engine/data/browser-smoke-tests-v503.json'), 'manifest browser smoke V503 presente');
const manifest = readJson('fanta-engine/data/browser-smoke-tests-v503.json');
check(manifest.version === 'V503', 'manifest versione V503');
check(manifest.script === 'fanta-engine/tools/playwright-smoke-v503.mjs', 'manifest punta allo script corretto');
check(Array.isArray(manifest.pages) && manifest.pages.length === 8, 'manifest elenca 8 pagine smoke');
check(manifest.guardrails?.includes('no Firebase writes'), 'manifest vieta write Firebase');
check(manifest.guardrails?.includes('no EmailJS sends'), 'manifest vieta invii EmailJS');
const smoke = read('fanta-engine/tools/playwright-smoke-v503.mjs');
check(smoke.includes("await import('playwright')"), 'script importa Playwright dinamicamente');
check(smoke.includes('FANTA_BASE_URL'), 'script supporta FANTA_BASE_URL');
check(smoke.includes('FANTA_SITE_PREFIX'), 'script supporta FANTA_SITE_PREFIX');
check(smoke.includes('/zonaorientale/'), 'script testa ZonaOrientale home');
check(smoke.includes('/fantapetillomantramanager/'), 'script testa FantaMantraManager home');
check(smoke.includes('console error'), 'script intercetta console error');
check(smoke.includes('request failed'), 'script intercetta request failed');
check(smoke.includes('HTTP 400') || smoke.includes('status >= 400'), 'script intercetta HTTP >= 400');
check(smoke.includes('footer/versione'), 'script controlla versione footer');
check(!smoke.includes('service_ttjf7js'), 'script non contiene service EmailJS FMM');
check(!smoke.includes('service_trz4dxe'), 'script non contiene service EmailJS Zona');
check(!smoke.includes('setDoc(') && !smoke.includes('addDoc(') && !smoke.includes('updateDoc(') && !smoke.includes('deleteDoc('), 'script non scrive Firebase');

for (const [cfgPath, id, name] of [['zonaorientale/assets/league-config.json','zonaorientale','ZonaOrientale Salerno'], ['fantapetillomantramanager/assets/league-config.json','fantapetillomantramanager','FantaMantraManager']]) {
  const cfg = readJson(cfgPath);
  check(cfg.leagueId === id, `${cfgPath} leagueId corretto`);
  check(cfg.name === name, `${cfgPath} nome corretto`);
  check(cfg.currentVersion === 503, `${cfgPath} currentVersion V503`);
  check(cfg.features?.browserSmokeTests === true, `${cfgPath} browser smoke attivo`);
  check(cfg.features?.browserSmokeTestsVersion === 'V503', `${cfgPath} browser smoke V503`);
  check(cfg.features?.playwrightSmokeTests === true, `${cfgPath} Playwright smoke attivo`);
  check(cfg.guardrails?.browserTestsNoProductionMutation === true, `${cfgPath} guardrail no production mutation`);
  check(cfg.guardrails?.browserTestsDoNotWriteFirebase === true, `${cfgPath} guardrail no Firebase write`);
}

for (const file of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html','fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html','fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html']) {
  const text = read(file);
  check(text.includes('?v=503'), `${file} cache-buster V503`);
}
for (const file of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html','fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html']) {
  const text = read(file);
  check(text.includes('V503'), `${file} footer/runtime V503`);
}
check(exists('fanta-engine/tools/audit-runtime-regression-v503.mjs'), 'audit runtime V503 presente');
check(exists('fanta-engine/tools/audit-multileague-contamination-v503.mjs'), 'audit contaminazione V503 presente');
check(exists('../docs/AI_ASSISTANT_HANDOFF_V503.md'), 'handoff AI V503 presente');
check(exists('../docs/BROWSER_SMOKE_TESTS_V503.md'), 'doc globale browser smoke V503 presente');
check(exists('../docs/zonaorientale/HANDOFF_V503_BROWSER_SMOKE_TESTS.md'), 'handoff Zona V503 presente');
check(exists('../docs/fantapetillomantramanager/HANDOFF_V503_BROWSER_SMOKE_TESTS.md'), 'handoff FMM V503 presente');

if (fail > 0) { console.error(`\nAudit browser smoke V503 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f => console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit browser smoke V503 completato: ${ok} OK, ${fail} FAIL`);
