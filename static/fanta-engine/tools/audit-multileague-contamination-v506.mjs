#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); let ok=0, fail=0; const failures=[];
function abs(p){return path.join(root,p)}; function exists(p){return fs.existsSync(abs(p))}; function read(p){return fs.readFileSync(abs(p),'utf8')}; function readJson(p){return JSON.parse(read(p))}; function check(c,l){if(c){ok++;console.log(`OK  - ${l}`)}else{fail++;failures.push(l);console.error(`FAIL - ${l}`)}};
function textNoScripts(p){return read(p).replace(/<script[\s\S]*?<\/script>/gi,'')}
function noTerms(p,terms,label){const t=textNoScripts(p);const hits=terms.filter(x=>t.includes(x));check(hits.length===0,`${label}${hits.length?` (${hits.join(', ')})`:''}`)}
check(!exists('zonaorientale/static'), 'copia annidata zonaorientale/static assente');
check(!exists('static'), 'cartella accidentale static/static assente');
for(const [p,id,name] of [['zonaorientale/assets/league-config.json','zonaorientale','ZonaOrientale Salerno'],['fantapetillomantramanager/assets/league-config.json','fantapetillomantramanager','FantaMantraManager']]){const c=readJson(p);check(c.leagueId===id,`${p} leagueId corretto`);check(c.name===name,`${p} nome corretto`);check(c.currentVersion===506,`${p} versione V506`);check(c.features?.formValidatorsVersion==='V506',`${p} form validators V506`)}
for(const p of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html']){noTerms(p,['FantaMantraManager','FantaPetillo','fantapetillomantramanager'],`${p} senza contaminazione FMM`);check(read(p).includes('ZonaOrientale Salerno · V506 · Ultimo aggiornamento 24/06/2026'),`${p} footer Zona V506`)}
for(const p of ['fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html','fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html']){noTerms(p,['ZonaOrientale Salerno','/zonaorientale/','zonaorientale/static'],`${p} senza contaminazione Zona runtime`)}
check(read('zonaorientale/assets/emailjs.js').includes('service_trz4dxe'),'Zona EmailJS service proprio');
check(!read('zonaorientale/assets/emailjs.js').includes('service_ttjf7js'),'Zona non usa service FMM');
check(read('fantapetillomantramanager/assets/emailjs.js').includes('service_ttjf7js'),'FMM EmailJS service proprio');
check(!read('fantapetillomantramanager/news.html').includes('news-ujE2CqJMjzkYhhjzZZHD'),'FMM news senza ID storico Zona');
check(read('../netlify.toml').includes('/zonaorientale/static/*'),'Netlify redirect sicurezza per nested path');
for (const [file, token, label] of [
  ['fanta-engine/js/ui/components-v496.js','UI_VERSION_V496','UI engine'],
  ['fanta-engine/js/email/emailjs-adapter-v498.js','EMAILJS_ADAPTER_VERSION_V498','EmailJS adapter'],
  ['fanta-engine/js/firebase/firebase-adapter-v499.js','FIREBASE_ADAPTER_VERSION_V499','Firebase adapter'],
  ['fanta-engine/js/ui/dashboard-cards-engine-v504.js','DASHBOARD_CARDS_ENGINE_VERSION_V504','Dashboard cards engine'],
  ['fanta-engine/js/ui/dashboard-renderer-helpers-v505.js','DASHBOARD_RENDERER_HELPERS_VERSION_V505','Dashboard renderer helpers'],
  ['fanta-engine/js/core/form-validators-v506.js','FORM_VALIDATORS_VERSION_V506','Form validators'],
  ['fanta-engine/js/tools/matchday-draw-engine-v506.js','MATCHDAY_DRAW_ENGINE_VERSION_V506','Tool engine V506']
]) { const text=read(file); check(text.includes(token), `${label} presente`); check(!text.includes('ZonaOrientale Salerno'), `${label} senza brand Zona hardcoded`); check(!text.includes('FantaMantraManager'), `${label} senza brand FMM hardcoded`); check(!text.includes('service_ttjf7js') && !text.includes('service_trz4dxe'), `${label} senza service EmailJS hardcoded`); }
check(read('fanta-engine/js/tools/matchday-draw-engine-v506.js').includes('../core/form-validators-v506.js'), 'Tool engine usa validators comuni');
check(read('fanta-engine/tools/playwright-smoke-v503.mjs').includes('FANTA_BASE_URL'), 'Playwright smoke V503 preservato');
check(read('fanta-engine/js/core/feature-card-registry-v497.js').includes('FEATURE_CARD_REGISTRY_VERSION_V497'),'feature card registry V497 preservato');
if(fail>0){console.error(`\nAudit anti-contaminazione V506 fallito: ${ok} OK, ${fail} FAIL`);failures.forEach(f=>console.error(` - ${f}`));process.exit(1)}
console.log(`\nAudit anti-contaminazione V506 completato: ${ok} OK, ${fail} FAIL`);
