import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
let ok=0, fail=0;
function exists(rel){ return fs.existsSync(path.join(root,rel)); }
function read(rel){ return fs.readFileSync(path.join(root,rel),'utf8'); }
function check(cond,msg){ if(cond){ console.log(`OK  - ${msg}`); ok++; } else { console.log(`FAIL - ${msg}`); fail++; } }
const leagues=['zonaorientale','fantapetillomantramanager'];
check(exists('fanta-engine/js/core/public-data-autoload-v512.js'),'engine public data autoload V512 presente');
check(exists('fanta-engine/data/public-data-autoload-v512.json'),'manifest V512 presente');
const engine=read('fanta-engine/js/core/public-data-autoload-v512.js');
check(engine.includes('installPublicDataAutoloadV512'),'export install V512 presente');
check(engine.includes('hashchange'),'engine gestisce hashchange');
check(engine.includes('click'),'engine gestisce click delegato');
check(engine.includes('scheduleBoot'),'engine prevede retry boot');
for (const league of leagues) {
  const app=`${league}/assets/app.js`;
  const cfg=`${league}/assets/league-config.json`;
  const html=`${league}/index.html`;
  check(exists(app),`${app} presente`);
  const appText=read(app);
  check(appText.includes('public-data-autoload-v512.js?v=512'),`${app} importa autoload V512`);
  check(appText.includes('hasRenderablePublicDataV512'),`${app} controllo dati renderizzabili V512`);
  check(appText.includes('loadPublicDataNoAuthV512'),`${app} loader no-auth V512`);
  check(appText.includes('FantaEnginePublicDataRecoveryV512'),`${app} espone recovery V512`);
  check(appText.includes('loadDataForCurrentAuthV100'),`${app} usa loader pubblico esistente`);
  const cfgJson=JSON.parse(read(cfg));
  check(cfgJson.currentVersion===512,`${cfg} currentVersion 512`);
  check(cfgJson.features?.publicDataAutoload===true,`${cfg} feature publicDataAutoload attiva`);
  check(cfgJson.features?.publicDataAutoloadVersion==='V512',`${cfg} feature publicDataAutoloadVersion V512`);
  const htmlText=read(html);
  check(htmlText.includes('?v=512'),`${html} cache-buster V512`);
  check(htmlText.includes('V512'),`${html} footer/versione V512`);
}
check(!exists('static'),'static/static assente dal cwd static');
check(!exists('zonaorientale/static'),'zonaorientale/static assente');
console.log(`\nAudit public data autoload V512: ${ok} OK, ${fail} FAIL`);
if (fail) process.exit(1);
