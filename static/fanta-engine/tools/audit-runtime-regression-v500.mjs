#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let ok = 0, fail = 0;
const failures = [];
function abs(p){ return path.join(root,p); }
function exists(p){ return fs.existsSync(abs(p)); }
function read(p){ return fs.readFileSync(abs(p),'utf8'); }
function readJson(p){ return JSON.parse(read(p)); }
function check(c,l){ if(c){ok++; console.log(`OK  - ${l}`);} else {fail++; failures.push(l); console.error(`FAIL - ${l}`);} }
function collectAttrs(text, attrName){ const out=[]; const rx=new RegExp(`${attrName}=["']([^"']+)["']`,'gi'); let m; while((m=rx.exec(text))) out.push(m[1]); return out; }
function stripQuery(v){ return String(v||'').split('#')[0].split('?')[0]; }
function resolveFrom(file, ref){ const clean=stripQuery(ref); if(!clean || clean.includes('${') || clean.startsWith('http:') || clean.startsWith('https:') || clean.startsWith('mailto:') || clean.startsWith('tel:') || clean.startsWith('#') || clean.startsWith('/.netlify/')) return null; if(clean.startsWith('/')) return clean.slice(1); return path.normalize(path.join(path.dirname(file), clean)); }
function checkRefs(file,label){ const text=read(file); const refs=[...collectAttrs(text,'href'),...collectAttrs(text,'src'),...collectAttrs(text,'data-local-fallback')]; const misses=[]; for(const ref of refs){ const res=resolveFrom(file,ref); if(!res) continue; if(!exists(res)) misses.push(`${ref} -> ${res}`); } check(misses.length===0, `${label} asset presenti${misses.length ? ` (${misses.slice(0,8).join('; ')})` : ''}`); }
function noTerms(file, terms, label){ const text=read(file).replace(/<script[\s\S]*?<\/script>/gi,''); const hits=terms.filter(t=>text.includes(t)); check(hits.length===0, `${label}${hits.length ? ` (${hits.join(', ')})` : ''}`); }

check(exists('fanta-engine'), 'motore comune presente');
check(!exists('zonaorientale/static'), 'copia annidata ZonaOrientale assente');
for (const [cfgPath, leagueId, name] of [['zonaorientale/assets/league-config.json','zonaorientale','ZonaOrientale Salerno'],['fantapetillomantramanager/assets/league-config.json','fantapetillomantramanager','FantaMantraManager']]) {
  const cfg=readJson(cfgPath);
  check(cfg.leagueId===leagueId, `${cfgPath} leagueId corretto`);
  check(cfg.name===name, `${cfgPath} nome corretto`);
  check(cfg.currentVersion===500, `${cfgPath} currentVersion V500`);
  check(cfg.features?.unifiedSectionRegistry===true, `${cfgPath} registry unico attivo`);
  check(cfg.features?.sharedAssetsCentralized===true, `${cfgPath} shared assets centralizzati`);
  check(cfg.features?.sharedCssCentralized===true, `${cfgPath} shared CSS centralizzati`);
  check(cfg.features?.commonDataPathAdapter===true, `${cfgPath} data adapter attivo`);
  check(cfg.features?.sharedJsModulesCentralized===true, `${cfgPath} moduli JS centralizzati`);
  check(cfg.features?.uiComponentsEngine===true, `${cfgPath} UI components engine attivo`);
  check(cfg.features?.featureCardRegistry===true, `${cfgPath} feature card registry attivo`);
  check(cfg.features?.firebaseAdapter===true, `${cfgPath} Firebase adapter attivo`);
  check(cfg.features?.firebaseAdapterVersion==='V499', `${cfgPath} Firebase adapter V499`);
  check(cfg.features?.dashboardCardsEngine===true, `${cfgPath} dashboard cards engine attivo`);
  check(cfg.features?.dashboardCardsEngineVersion==='V500', `${cfgPath} dashboard cards engine V500`);
  check(cfg.features?.nestedZonaStaticCleanup===true, `${cfgPath} cleanup nested tracciato`);
}

const htmlFiles=['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html','fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html','fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html'];
for (const file of htmlFiles){ check(exists(file), `${file} presente`); checkRefs(file, `${file}`); check(read(file).includes('?v=500'), `${file} cache-buster V500`); }
for (const file of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html']){ check(read(file).includes('ZonaOrientale Salerno · V500 · Ultimo aggiornamento 24/06/2026'), `footer ZonaOrientale V500 in ${file}`); noTerms(file,['FantaMantraManager','FantaPetillo','fantapetillomantramanager'],`${file} senza contaminazione FMM`); }
for (const file of ['fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html']){ check(read(file).includes('FantaMantraManager · V500 · Ultimo aggiornamento 24/06/2026'), `footer FMM V500 in ${file}`); noTerms(file,['ZonaOrientale','zonaorientale'],`${file} senza contaminazione ZonaOrientale`); }
noTerms('fantapetillomantramanager/news.html',['news-ujE2CqJMjzkYhhjzZZHD'],'news FMM senza ID storico ZonaOrientale');

for (const file of ['zonaorientale/assets/js/core/league-config-v443.js','fantapetillomantramanager/assets/js/core/league-config-v443.js']){ const text=read(file); check(text.includes("currentVersion: '500'"),`${file} runtime V500`); check(text.includes('league-config.json?v=500'),`${file} fetch config V500`);
  check(text.includes('uiComponentsEngineV496'),`${file} traccia UI components`);
  check(text.includes('dashboardCardsEngineV500'),`${file} traccia dashboard cards V500`); check(!text.includes('audit clone FantaPetillo'),`${file} senza clone footer`); }

for (const file of ['fanta-engine/js/core/unified-section-registry-v480.js','fanta-engine/js/core/league-presentation-v481.js','fanta-engine/js/core/data-paths-v490.js','fanta-engine/js/ui/components-v496.js','fanta-engine/js/core/feature-card-registry-v497.js','fanta-engine/js/ui/dashboard-cards-engine-v500.js','fanta-engine/data/shared-assets/v485/assets/listoni/manifest.json','fanta-engine/data/shared-assets/v485/assets/calciomercato/links.json','fanta-engine/data/shared-css-assets-v487.json','fanta-engine/data/shared-js-modules-v491.json']) check(exists(file),`motore asset presente ${file}`);

for (const file of ['zonaorientale/assets/js/data/static-files-service.js','fantapetillomantramanager/assets/js/data/static-files-service.js']){ const text=read(file); check(text.includes('data-paths-v490.js'),`${file} usa adapter V490`); check(text.includes('listoniManifestFallback'),`${file} fallback listoni locale`); }
const fmmApp=read('fantapetillomantramanager/assets/app.js');
check(fmmApp.includes('renderRuleProposalsPresidentSectionV479'), 'FMM Proposte regolamento preservate');
check(fmmApp.includes('Comunicato avvenuto scambio'), 'FMM comunicato scambio preservato');
check(fmmApp.includes('Svincola'), 'FMM svincola preservato');
check(read('fantapetillomantramanager/assets/emailjs.js').includes('service_ttjf7js'), 'FMM EmailJS dedicato');
check(read('zonaorientale/assets/emailjs.js').includes('service_trz4dxe'), 'Zona EmailJS preservato');
check(!read('zonaorientale/assets/emailjs.js').includes('service_ttjf7js'), 'Zona non usa service FMM');


for (const file of ['zonaorientale/assets/emailjs.js','fantapetillomantramanager/assets/emailjs.js']) {
  const text = read(file);
  check(text.includes('emailjs-adapter-v498.js'), `${file} usa adapter EmailJS V498`);
  check(text.includes('createEmailJsSenderV498'), `${file} crea sender EmailJS comune`);
}
check(exists('fanta-engine/js/email/emailjs-adapter-v498.js'), 'motore EmailJS adapter V498 presente');
check(exists('fanta-engine/js/firebase/firebase-adapter-v499.js'), 'motore Firebase adapter V499 presente');
check(exists('fanta-engine/js/ui/dashboard-cards-engine-v500.js'), 'motore dashboard cards V500 presente');

if(fail>0){ console.error(`\nAudit regressione runtime V500 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f=>console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit regressione runtime V500 completato: ${ok} OK, ${fail} FAIL`);
