#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); let ok=0, fail=0; const failures=[];
function abs(p){return path.join(root,p)}; function exists(p){return fs.existsSync(abs(p))}; function read(p){return fs.readFileSync(abs(p),'utf8')}; function readJson(p){return JSON.parse(read(p))}; function check(c,l){if(c){ok++;console.log(`OK  - ${l}`)}else{fail++;failures.push(l);console.error(`FAIL - ${l}`)}};
function textNoScripts(p){return read(p).replace(/<script[\s\S]*?<\/script>/gi,'')}
function noTerms(p,terms,label){const t=textNoScripts(p);const hits=terms.filter(x=>t.includes(x));check(hits.length===0,`${label}${hits.length?` (${hits.join(', ')})`:''}`)}
check(!exists('zonaorientale/static'), 'copia annidata zonaorientale/static assente');
check(!exists('static'), 'cartella accidentale static/static assente');
for(const [p,id,name] of [['zonaorientale/assets/league-config.json','zonaorientale','ZonaOrientale Salerno'],['fantapetillomantramanager/assets/league-config.json','fantapetillomantramanager','FantaMantraManager']]){const c=readJson(p);check(c.leagueId===id,`${p} leagueId corretto`);check(c.name===name,`${p} nome corretto`);check(c.currentVersion===510,`${p} versione V510`);check(c.features?.navigationActionsEngineVersion==='V510',`${p} navigation actions V510`)}
for(const p of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html']){noTerms(p,['FantaMantraManager','FantaPetillo','fantapetillomantramanager'],`${p} senza contaminazione FMM`);check(read(p).includes('ZonaOrientale Salerno · V510 · Ultimo aggiornamento 24/06/2026'),`${p} footer Zona V510`)}
for(const p of ['fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html','fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html']){noTerms(p,['ZonaOrientale Salerno','/zonaorientale/','zonaorientale/static'],`${p} senza contaminazione Zona runtime`)}
check(read('zonaorientale/assets/emailjs.js').includes('service_trz4dxe'),'Zona EmailJS service proprio');
check(!read('zonaorientale/assets/emailjs.js').includes('service_ttjf7js'),'Zona non usa service FMM');
check(read('fantapetillomantramanager/assets/emailjs.js').includes('service_ttjf7js'),'FMM EmailJS service proprio');
for (const [file, token, label] of [
  ['fanta-engine/js/ui/components-v496.js','UI_VERSION_V496','UI engine'],
  ['fanta-engine/js/email/emailjs-adapter-v498.js','EMAILJS_ADAPTER_VERSION_V498','EmailJS adapter'],
  ['fanta-engine/js/firebase/firebase-adapter-v499.js','FIREBASE_ADAPTER_VERSION_V499','Firebase adapter'],
  ['fanta-engine/js/ui/dashboard-cards-engine-v504.js','DASHBOARD_CARDS_ENGINE_VERSION_V504','Dashboard cards engine'],
  ['fanta-engine/js/ui/dashboard-renderer-helpers-v509.js','DASHBOARD_RENDERER_MIGRATION_VERSION_V509','Dashboard renderer helpers V509'],
  ['fanta-engine/js/ui/navigation-actions-v510.js','NAVIGATION_ACTIONS_VERSION_V510','Navigation actions V510'],
  ['fanta-engine/js/core/form-validators-v506.js','FORM_VALIDATORS_VERSION_V506','Form validators']
]) { const text=read(file); check(text.includes(token), `${label} presente`); check(!text.includes('ZonaOrientale Salerno'), `${label} senza brand Zona hardcoded`); check(!text.includes('FantaMantraManager'), `${label} senza brand FMM hardcoded`); check(!text.includes('service_ttjf7js') && !text.includes('service_trz4dxe'), `${label} senza service EmailJS hardcoded`); }
const engine = read('fanta-engine/js/ui/navigation-actions-v510.js');
check(!engine.includes('firebase') && !engine.includes('Firestore'), 'Navigation V510 non tocca Firebase');
check(!engine.includes('emailjs'), 'Navigation V510 non tocca EmailJS');
check(read('../docs/OVERLAY_ROADMAP.md').includes('V511 - Report centralizzazione'), 'roadmap overlay aggiornata al prossimo step');
if(fail>0){console.error(`\nAudit anti-contaminazione V510 fallito: ${ok} OK, ${fail} FAIL`);failures.forEach(f=>console.error(` - ${f}`));process.exit(1)}
console.log(`\nAudit anti-contaminazione V510 completato: ${ok} OK, ${fail} FAIL`);
