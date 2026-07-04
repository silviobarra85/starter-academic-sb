#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); let ok=0, fail=0; const failures=[];
function abs(p){return path.join(root,p)}; function exists(p){return fs.existsSync(abs(p))}; function read(p){return fs.readFileSync(abs(p),'utf8')}; function readJson(p){return JSON.parse(read(p))};
function check(c,l){if(c){ok++;console.log(`OK  - ${l}`)}else{fail++;failures.push(l);console.error(`FAIL - ${l}`)}};
check(exists('fanta-engine/tools/playwright-smoke-v508.mjs'), 'script Playwright V508 presente');
check(exists('fanta-engine/tools/playwright-smoke-v503.mjs'), 'script Playwright V503 preservato');
check(exists('fanta-engine/data/playwright-hardening-v508.json'), 'manifest Playwright V508 presente');
const manifest=readJson('fanta-engine/data/playwright-hardening-v508.json');
check(manifest.version==='V508', 'manifest versione V508');
check(manifest.script==='fanta-engine/tools/playwright-smoke-v508.mjs', 'manifest punta allo script V508');
check(Array.isArray(manifest.viewports) && manifest.viewports.some(v=>v.id==='mobile') && manifest.viewports.some(v=>v.id==='desktop'), 'manifest include mobile e desktop');
check(manifest.pages?.includes('/zonaorientale/') && manifest.pages?.includes('/fantapetillomantramanager/bilanci.html'), 'manifest include pagine delle due leghe');
check(manifest.cliFlags?.includes('--headed') && manifest.cliFlags?.includes('--mobile-only') && manifest.cliFlags?.includes('--desktop-only'), 'manifest include flag CLI utili');
const script=read('fanta-engine/tools/playwright-smoke-v508.mjs');
for (const token of ['EXPECTED_VERSION = \'V508\'', 'mobile', 'desktop', 'REPORT_DIR', 'toMarkdownReport', 'playwright-smoke-v508', 'FANTA_BASE_URL', 'FANTA_SITE_PREFIX', '--headed', '--mobile-only', '--desktop-only']) check(script.includes(token), `script contiene ${token}`);
check(script.includes('no Firebase') || script.includes('Firebase writes') || script.includes('non fa login'), 'script/documentazione runtime non mutativa');
for(const [cfgPath,id,name] of [['zonaorientale/assets/league-config.json','zonaorientale','ZonaOrientale Salerno'],['fantapetillomantramanager/assets/league-config.json','fantapetillomantramanager','FantaMantraManager']]){
  const cfg=readJson(cfgPath);
  check(cfg.currentVersion===508, `${cfgPath} currentVersion V508`);
  check(cfg.leagueId===id && cfg.name===name, `${cfgPath} identita preservata`);
  check(cfg.features?.playwrightHardening===true, `${cfgPath} playwright hardening attivo`);
  check(cfg.features?.playwrightHardeningVersion==='V508', `${cfgPath} playwright hardening V508`);
  check(cfg.features?.browserSmokeTestsVersion==='V508', `${cfgPath} browser smoke version V508`);
  check(cfg.guardrails?.playwrightChecksMobileDesktop===true, `${cfgPath} guardrail mobile desktop`);
}
for(const file of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html','fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html','fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html']){
  const text=read(file); check(text.includes('?v=508'), `${file} cache-buster V508`);
}
for(const file of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html']) check(read(file).includes('ZonaOrientale Salerno · V508 · Ultimo aggiornamento 24/06/2026'), `footer Zona V508 in ${file}`);
for(const file of ['fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html']) check(read(file).includes('FantaMantraManager · V508 · Ultimo aggiornamento 24/06/2026'), `footer FMM V508 in ${file}`);
for(const file of ['zonaorientale/assets/js/core/league-config-v443.js','fantapetillomantramanager/assets/js/core/league-config-v443.js']){ const text=read(file); check(text.includes("currentVersion: '508'"),`${file} runtime V508`); check(text.includes('league-config.json?v=508'),`${file} fetch config V508`); check(text.includes('playwrightHardeningV508'),`${file} traccia hardening V508`); }
for(const doc of ['../docs/AI_ASSISTANT_HANDOFF_V508.md','../docs/BROWSER_SMOKE_TESTS_HARDENING_V508.md','../docs/zonaorientale/HANDOFF_V508_PLAYWRIGHT_HARDENING.md','../docs/fantapetillomantramanager/HANDOFF_V508_PLAYWRIGHT_HARDENING.md']) check(exists(doc), `doc presente ${doc}`);
check(!exists('static'), 'cartella accidentale static/static assente');
check(!exists('zonaorientale/static'), 'cartella annidata zonaorientale/static assente');
if(fail>0){console.error(`\nAudit Playwright hardening V508 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f=>console.error(` - ${f}`)); process.exit(1)}
console.log(`\nAudit Playwright hardening V508 completato: ${ok} OK, ${fail} FAIL`);
