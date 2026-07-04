#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); let ok=0, fail=0; const failures=[];
function abs(p){return path.join(root,p)}; function exists(p){return fs.existsSync(abs(p))}; function read(p){return fs.readFileSync(abs(p),'utf8')}; function readJson(p){return JSON.parse(read(p))}; function check(c,l){if(c){ok++;console.log(`OK  - ${l}`)}else{fail++;failures.push(l);console.error(`FAIL - ${l}`)}};
function textNoScripts(p){return read(p).replace(/<script[\s\S]*?<\/script>/gi,'')}
function noTerms(p,terms,label){const t=textNoScripts(p);const hits=terms.filter(x=>t.includes(x));check(hits.length===0,`${label}${hits.length?` (${hits.join(', ')})`:''}`)}
check(!exists('zonaorientale/static'), 'copia annidata zonaorientale/static assente');
for(const [p,id,name] of [['zonaorientale/assets/league-config.json','zonaorientale','ZonaOrientale Salerno'],['fantapetillomantramanager/assets/league-config.json','fantapetillomantramanager','FantaMantraManager']]){const c=readJson(p);check(c.leagueId===id,`${p} leagueId corretto`);check(c.name===name,`${p} nome corretto`);check(c.currentVersion===496,`${p} versione V496`)}
for(const p of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html']){noTerms(p,['FantaMantraManager','FantaPetillo','fantapetillomantramanager'],`${p} senza contaminazione FMM`);check(read(p).includes('ZonaOrientale Salerno · V496 · Ultimo aggiornamento 24/06/2026'),`${p} footer Zona V496`)}
for(const p of ['fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html','fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html']){noTerms(p,['ZonaOrientale Salerno','/zonaorientale/','zonaorientale/static'],`${p} senza contaminazione Zona runtime`)}
check(read('zonaorientale/assets/emailjs.js').includes('service_trz4dxe'),'Zona EmailJS service proprio');
check(!read('zonaorientale/assets/emailjs.js').includes('service_ttjf7js'),'Zona non usa service FMM');
check(read('fantapetillomantramanager/assets/emailjs.js').includes('service_ttjf7js'),'FMM EmailJS service proprio');
check(!read('fantapetillomantramanager/news.html').includes('news-ujE2CqJMjzkYhhjzZZHD'),'FMM news senza ID storico Zona');
check(read('../netlify.toml').includes('/zonaorientale/static/*'),'Netlify redirect sicurezza per nested path');
check(read('fanta-engine/js/ui/components-v496.js').includes('UI_VERSION_V496'),'UI engine V496 presente');
check(!read('fanta-engine/js/ui/components-v496.js').includes('ZonaOrientale Salerno'),'UI engine senza brand Zona hardcoded');
check(!read('fanta-engine/js/ui/components-v496.js').includes('FantaMantraManager'),'UI engine senza brand FMM hardcoded');
if(fail>0){console.error(`\nAudit anti-contaminazione V496 fallito: ${ok} OK, ${fail} FAIL`);failures.forEach(f=>console.error(` - ${f}`));process.exit(1)}
console.log(`\nAudit anti-contaminazione V496 completato: ${ok} OK, ${fail} FAIL`);
