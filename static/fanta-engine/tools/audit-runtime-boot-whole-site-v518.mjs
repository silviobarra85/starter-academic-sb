import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
let failures = 0;

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function check(condition, label) {
  if (condition) console.log(`OK ${label}`);
  else {
    failures += 1;
    console.error(`FAIL ${label}`);
  }
}

const publicAutoload = read('static/fanta-engine/js/core/public-data-autoload-v512.js');
check(publicAutoload.includes('installPublicDataAutoloadV518'), 'engine autoload esporta alias V518');
check(publicAutoload.includes('installPublicDataAutoloadV516'), 'engine autoload mantiene alias compatibile V516');
check(publicAutoload.includes('installPublicDataAutoloadV515'), 'engine autoload mantiene alias compatibile V515');
check(publicAutoload.includes('installPublicDataAutoloadV512'), 'engine autoload mantiene export V512 originale');

for (const league of leagues) {
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  const loader = read(`static/${league}/assets/js/core/league-config-v443.js`);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));

  check(index.includes('assets/app.js?v=518'), `${league}: index carica app.js V518`);
  check(index.includes('league-config-v443.js?v=518'), `${league}: index carica config V518`);
  check(app.includes('installPublicDataAutoloadV518'), `${league}: app.js importa/install public autoload V518`);
  check(app.includes('public-data-autoload-v512.js?v=518'), `${league}: app.js forza cache-buster engine autoload V518`);
  check(!app.includes('installPublicDataAutoloadV515 } from'), `${league}: app.js non richiede export V515 come import principale`);
  check(loader.includes('formValidatorsV506: true'), `${league}: formValidatorsV506 e flag esplicito`);
  check(!loader.includes('formValidatorsV506,\n'), `${league}: nessun shorthand formValidatorsV506 non definito`);
  check(loader.includes('league-config.json?v=518'), `${league}: loader fetch config V518`);
  check(cfg.currentVersion === 518, `${league}: league-config currentVersion 518`);

  const staleSearch = [index, app, loader].join('\n');
  check(!staleSearch.includes('league-config-v443.js?v=512'), `${league}: nessun richiamo a league-config V512 nei runtime principali`);
}

if (failures) {
  console.error(`Audit V518 fallito: ${failures} errori.`);
  process.exit(1);
}
console.log('Audit V518 superato: runtime whole-site allineato e nessun richiamo residuo a league-config V512.');
