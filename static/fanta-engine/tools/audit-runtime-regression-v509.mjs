#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd(); let ok = 0, fail = 0; const failures = [];
function abs(p){return path.join(root,p)}; function exists(p){return fs.existsSync(abs(p))}; function read(p){return fs.readFileSync(abs(p),'utf8')}; function readJson(p){return JSON.parse(read(p))}; function check(c,l){if(c){ok++;console.log(`OK  - ${l}`)}else{fail++;failures.push(l);console.error(`FAIL - ${l}`)}};
function collectAttrs(text, attrName){ const out=[]; const rx=new RegExp(`${attrName}=["']([^"']+)["']`,'gi'); let m; while((m=rx.exec(text))) out.push(m[1]); return out; }
function stripQuery(v){ return String(v||'').split('#')[0].split('?')[0]; }
function resolveFrom(file, ref){ const clean=stripQuery(ref); if(!clean || clean.includes('${') || clean.startsWith('http:') || clean.startsWith('https:') || clean.startsWith('mailto:') || clean.startsWith('tel:') || clean.startsWith('#') || clean.startsWith('/.netlify/')) return null; if(clean.startsWith('/')) return clean.slice(1); return path.normalize(path.join(path.dirname(file), clean)); }
function checkRefs(file,label){ const text=read(file); const refs=[...collectAttrs(text,'href'),...collectAttrs(text,'src'),...collectAttrs(text,'data-local-fallback')]; const misses=[]; for(const ref of refs){ const res=resolveFrom(file,ref); if(!res) continue; if(!exists(res)) misses.push(`${ref} -> ${res}`); } check(misses.length===0, `${label} asset presenti${misses.length ? ` (${misses.slice(0,8).join('; ')})` : ''}`); }
function noTerms(file, terms, label){ const text=read(file).replace(/<script[\s\S]*?<\/script>/gi,''); const hits=terms.filter(t=>text.includes(t)); check(hits.length===0, `${label}${hits.length ? ` (${hits.join(', ')})` : ''}`); }
check(exists('fanta-engine'), 'motore comune presente');
check(!exists('zonaorientale/static'), 'copia annidata ZonaOrientale assente');
check(!exists('static'), 'cartella accidentale static/static assente');
for (const [cfgPath, leagueId, name] of [['zonaorientale/assets/league-config.json','zonaorientale','ZonaOrientale Salerno'],['fantapetillomantramanager/assets/league-config.json','fantapetillomantramanager','FantaMantraManager']]) {
  const cfg=readJson(cfgPath);
  check(cfg.leagueId===leagueId, `${cfgPath} leagueId corretto`);
  check(cfg.name===name, `${cfgPath} nome corretto`);
  check(cfg.currentVersion===509, `${cfgPath} currentVersion V509`);
  for (const [key,label] of [['unifiedSectionRegistry','registry unico'],['sharedAssetsCentralized','shared assets'],['sharedCssCentralized','shared CSS'],['commonDataPathAdapter','data adapter'],['sharedJsModulesCentralized','moduli JS'],['uiComponentsEngine','UI components'],['featureCardRegistry','feature registry'],['emailJsAdapter','EmailJS adapter'],['firebaseAdapter','Firebase adapter'],['dashboardCardsEngine','dashboard cards'],['toolEngine','tool engine'],['dashboardRendererHelpers','renderer helpers'],['browserSmokeTests','browser smoke'],['formValidators','form validators'],['dashboardRendererMigration','renderer migration']]) check(cfg.features?.[key]===true, `${cfgPath} ${label} attivo`);
  check(cfg.features?.dashboardRendererMigrationVersion==='V509', `${cfgPath} renderer migration V509`);
}
for (const file of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html','fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html','fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html']) { check(exists(file), `${file} presente`); checkRefs(file, file); check(read(file).includes('?v=509'), `${file} cache-buster V509`); }
for (const file of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html']){ check(read(file).includes('ZonaOrientale Salerno · V509 · Ultimo aggiornamento 24/06/2026'), `footer ZonaOrientale V509 in ${file}`); noTerms(file,['FantaMantraManager','FantaPetillo','fantapetillomantramanager'],`${file} senza contaminazione FMM`); }
for (const file of ['fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html']){ check(read(file).includes('FantaMantraManager · V509 · Ultimo aggiornamento 24/06/2026'), `footer FMM V509 in ${file}`); noTerms(file,['ZonaOrientale','zonaorientale'],`${file} senza contaminazione ZonaOrientale`); }
for (const file of ['zonaorientale/assets/js/core/league-config-v443.js','fantapetillomantramanager/assets/js/core/league-config-v443.js']){ const text=read(file); check(text.includes("currentVersion: '509'"),`${file} runtime V509`); check(text.includes('league-config.json?v=509'),`${file} fetch config V509`); check(text.includes('dashboardRendererMigrationV509'),`${file} traccia renderer migration V509`); check(!text.includes('audit clone FantaPetillo'),`${file} senza clone footer`); }
for (const file of ['fanta-engine/js/core/unified-section-registry-v480.js','fanta-engine/js/core/league-presentation-v481.js','fanta-engine/js/core/data-paths-v490.js','fanta-engine/js/ui/components-v496.js','fanta-engine/js/core/feature-card-registry-v497.js','fanta-engine/js/email/emailjs-adapter-v498.js','fanta-engine/js/firebase/firebase-adapter-v499.js','fanta-engine/js/ui/dashboard-cards-engine-v504.js','fanta-engine/js/ui/dashboard-renderer-helpers-v505.js','fanta-engine/js/ui/dashboard-renderer-helpers-v509.js','fanta-engine/js/core/form-validators-v506.js','fanta-engine/js/tools/matchday-draw-engine-v506.js','fanta-engine/data/dashboard-renderer-migration-v509.json','fanta-engine/data/league-template-hardening-v507.json']) check(exists(file),`motore asset presente ${file}`);
for (const file of ['zonaorientale/assets/app.js','fantapetillomantramanager/assets/app.js']) { const text=read(file); check(text.includes('dashboard-cards-engine-v504.js?v=504'),`${file} usa dashboard engine V504`); check(text.includes('dashboard-renderer-helpers-v509.js?v=509'),`${file} usa dashboard renderer helpers V509`); check(text.includes('renderAdminCollapsiblePanelV509'),`${file} render Admin V509`); check(text.includes('renderPresidentDashboardMetricV509'),`${file} metriche Presidente V509`); }
const fmmApp=read('fantapetillomantramanager/assets/app.js');
check(fmmApp.includes('renderRuleProposalsPresidentSectionV479'), 'FMM Proposte regolamento preservate');
check(fmmApp.includes('Comunicato avvenuto scambio'), 'FMM comunicato scambio preservato');
check(fmmApp.includes('Svincola'), 'FMM svincola preservato');
check(read('fantapetillomantramanager/assets/emailjs.js').includes('service_ttjf7js'), 'FMM EmailJS dedicato');
check(read('zonaorientale/assets/emailjs.js').includes('service_trz4dxe'), 'Zona EmailJS preservato');
check(!read('zonaorientale/assets/emailjs.js').includes('service_ttjf7js'), 'Zona non usa service FMM');
check(exists('../docs/OVERLAY_ROADMAP.md'), 'doc overlay roadmap presente');
if(fail>0){ console.error(`\nAudit regressione runtime V509 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f=>console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit regressione runtime V509 completato: ${ok} OK, ${fail} FAIL`);
