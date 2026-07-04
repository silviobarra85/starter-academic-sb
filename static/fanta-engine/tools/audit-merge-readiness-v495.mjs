#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); const repo=path.dirname(root); let ok=0, fail=0; const failures=[];
function ex(p){return fs.existsSync(path.join(root,p))}; function exRepo(p){return fs.existsSync(path.join(repo,p))}; function read(p){return fs.readFileSync(path.join(root,p),'utf8')}; function readRepo(p){return fs.readFileSync(path.join(repo,p),'utf8')}; function readJson(p){return JSON.parse(read(p))}; function check(c,l){if(c){ok++;console.log(`OK  - ${l}`)}else{fail++;failures.push(l);console.error(`FAIL - ${l}`)}};
check(!ex('zonaorientale/static'),'copia annidata rimossa prima del merge');
check(ex('zonaorientale/index.html'),'ZonaOrientale canonica presente');
check(ex('fantapetillomantramanager/index.html'),'FMM canonico presente');
check(ex('fanta-engine'),'motore comune presente');
for(const p of ['zonaorientale/assets/league-config.json','fantapetillomantramanager/assets/league-config.json']){const c=readJson(p);check(c.currentVersion===495,`${p} V495`);check(c.features?.nestedZonaStaticCleanup===true,`${p} cleanup nested tracciato`)}
for(const p of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html','fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html','fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html']){check(ex(p),`${p} presente`);check(read(p).includes('?v=495'),`${p} cache V495`)}
for(const p of ['fanta-engine/tools/audit-zona-nested-static-cleanup-v495.mjs','fanta-engine/tools/audit-runtime-regression-v495.mjs','fanta-engine/tools/audit-multileague-contamination-v495.mjs','fanta-engine/data/nested-zona-static-cleanup-plan-v495.json'])check(ex(p),`tool V495 presente ${p}`);
check(readRepo('netlify.toml').includes('from = "/zonaorientale/static/*"'),'netlify redirect nested presente');
check(readRepo('netlify.toml').includes('to = "/zonaorientale/:splat"'),'netlify redirect canonico presente');
for(const p of ['docs/zonaorientale/NESTED_STATIC_CLEANUP_V495.md','docs/zonaorientale/HANDOFF_V495_NESTED_STATIC_CLEANUP.md','docs/fantapetillomantramanager/HANDOFF_V495_NESTED_STATIC_CLEANUP.md','docs/fantapetillomantramanager/MERGE_BRANCH_CHECKLIST_V495.md','docs/zonaorientale/MERGE_BRANCH_CHECKLIST_V495.md']) check(exRepo(p),`doc V495 presente ${p}`);
check(!exRepo("docs/zonaorientale/FUNZIONALITA'.md") || !readRepo("docs/zonaorientale/FUNZIONALITA'.md").includes('V495 - Cleanup nested static'), "FUNZIONALITA'.md non modificato da V495");
if(fail>0){console.error(`\nAudit merge readiness V495 fallito: ${ok} OK, ${fail} FAIL`);failures.forEach(f=>console.error(` - ${f}`));process.exit(1)}
console.log(`\nAudit merge readiness V495 completato: ${ok} OK, ${fail} FAIL`);
