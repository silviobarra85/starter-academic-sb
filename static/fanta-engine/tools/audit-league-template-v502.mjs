#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); let ok=0, fail=0; const failures=[];
function abs(p){return path.join(root,p)}; function exists(p){return fs.existsSync(abs(p))}; function read(p){return fs.readFileSync(abs(p),'utf8')}; function readJson(p){return JSON.parse(read(p))};
function check(c,l){if(c){ok++;console.log(`OK  - ${l}`)}else{fail++;failures.push(l);console.error(`FAIL - ${l}`)}};
check(!exists('static'), 'cartella accidentale static/static assente');
check(!exists('zonaorientale/static'), 'copia annidata zonaorientale/static assente');
const manifest='fanta-engine/data/league-template-v502.json';
const script='fanta-engine/tools/create-league-v502.mjs';
check(exists(manifest),'manifest template V502 presente');
check(exists(script),'script create-league V502 presente');
const m=readJson(manifest);
check(m.version==='V502','manifest versione V502');
check(m.mode==='template-only-no-runtime-impact','manifest mode no runtime impact');
check(m.templatePath==='_league-template','manifest path template corretto');
check(m.scriptPath==='fanta-engine/tools/create-league-v502.mjs','manifest path script corretto');
for (const g of ['non modifica le leghe esistenti','non crea Firebase project','non crea EmailJS service/template','non aggiorna netlify.toml automaticamente','richiede revisione manuale prima del go-live']) check(m.guardrails.includes(g),`manifest guardrail: ${g}`);
const files=['_league-template/README.md','_league-template/index.html','_league-template/competition.html','_league-template/player.html','_league-template/news.html','_league-template/bilanci.html','_league-template/assets/styles.css','_league-template/assets/app.js','_league-template/assets/league-config.json','_league-template/assets/firebase.js.example','_league-template/assets/emailjs.js.example'];
for (const f of files) check(exists(f),`template file presente ${f}`);
for (const f of ['_league-template/index.html','_league-template/assets/league-config.json','_league-template/assets/app.js']) { const t=read(f); check(t.includes('__LEAGUE_SLUG__'),`${f} contiene placeholder slug`); check(t.includes('__CACHE_VERSION__'),`${f} contiene placeholder cache`); }
const st=read(script);
check(st.includes('assertSlug'),'script valida slug');
check(st.includes('--force'),'script supporta force esplicito');
check(st.includes('Destinazione gia esistente'),'script evita overwrite involontario');
check(st.includes('docs') && st.includes('writeDocs'), 'script crea docs');
check(!st.includes('service_ttjf7js'),'script senza service FMM hardcoded');
check(!st.includes('service_trz4dxe'),'script senza service Zona hardcoded');
check(!st.includes('zonaorientale-d07af'),'script senza Firebase Zona hardcoded');
check(!st.includes('fantapetillomantramanager"'),'script senza slug FMM generato');
for(const league of ['zonaorientale','fantapetillomantramanager']){
  const cfg=readJson(`${league}/assets/league-config.json`);
  check(cfg.currentVersion===502,`${league} currentVersion V502`);
  check(cfg.features?.leagueTemplateEngine===true,`${league} feature template engine attiva`);
  check(cfg.features?.leagueTemplateEngineVersion==='V502',`${league} template engine version V502`);
  check(cfg.guardrails?.leagueTemplateNoRuntimeImpact===true,`${league} guardrail no runtime impact`);
  check(cfg.guardrails?.newLeagueRequiresManualConfigReview===true,`${league} guardrail review manuale nuova lega`);
}
check(exists('../docs/AI_ASSISTANT_HANDOFF_V502.md'),'handoff AI V502 presente');
check(exists('../docs/LEAGUE_TEMPLATE_ENGINE_V502.md'),'doc globale template V502 presente');
check(exists('../docs/zonaorientale/HANDOFF_V502_LEAGUE_TEMPLATE.md'),'handoff Zona V502 presente');
check(exists('../docs/fantapetillomantramanager/HANDOFF_V502_LEAGUE_TEMPLATE.md'),'handoff FMM V502 presente');
if(fail>0){console.error(`\nAudit template nuova lega V502 fallito: ${ok} OK, ${fail} FAIL`);failures.forEach(f=>console.error(` - ${f}`));process.exit(1)}
console.log(`\nAudit template nuova lega V502 completato: ${ok} OK, ${fail} FAIL`);
