import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(); let ok=0, fail=0;
const exists=(r)=>fs.existsSync(path.join(root,r));
const read=(r)=>fs.readFileSync(path.join(root,r),'utf8');
function check(c,m){ if(c){console.log(`OK  - ${m}`); ok++;} else {console.log(`FAIL - ${m}`); fail++;}}
for (const league of ['zonaorientale','fantapetillomantramanager']) {
  for (const page of ['index.html','competition.html','player.html']) if (exists(`${league}/${page}`)) {
    const s=read(`${league}/${page}`); check(s.includes('?v=512'),`${league}/${page} cache V512`);
  }
  const cfg=JSON.parse(read(`${league}/assets/league-config.json`));
  check(cfg.currentVersion===512,`${league} config V512`);
  check(cfg.features?.publicDataAutoload===true,`${league} autoload V512 attivo`);
  const app=read(`${league}/assets/app.js`);
  check(app.includes('installPublicDataAutoloadV512'),`${league} app installa V512`);
  check(!app.includes('static/zonaorientale/static'),`${league} app non punta alla copia nested`);
}
for (const rel of ['fanta-engine/js/core/public-data-autoload-v512.js','fanta-engine/js/core/navigation-data-refresh-v511.js','fanta-engine/js/ui/navigation-actions-v510.js']) check(exists(rel),`asset runtime presente ${rel}`);
check(!exists('static'),'static/static assente');
check(!exists('zonaorientale/static'),'zonaorientale/static assente');
console.log(`\nAudit regressione runtime V512: ${ok} OK, ${fail} FAIL`); if(fail) process.exit(1);
