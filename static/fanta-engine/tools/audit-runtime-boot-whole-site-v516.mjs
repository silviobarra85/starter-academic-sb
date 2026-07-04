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
check(publicAutoload.includes('installPublicDataAutoloadV516'), 'engine autoload esporta alias V516');
check(publicAutoload.includes('installPublicDataAutoloadV515'), 'engine autoload mantiene alias compatibile V515');
check(publicAutoload.includes('installPublicDataAutoloadV512'), 'engine autoload mantiene export V512 originale');

for (const league of leagues) {
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  const loader = read(`static/${league}/assets/js/core/league-config-v443.js`);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));

  check(index.includes('assets/app.js?v=516'), `${league}: index carica app.js V516`);
  check(index.includes('league-config-v443.js?v=516'), `${league}: index carica config V516`);
  check(app.includes('installPublicDataAutoloadV516'), `${league}: app.js importa/install public autoload V516`);
  check(app.includes('public-data-autoload-v512.js?v=516'), `${league}: app.js forza cache-buster engine autoload V516`);
  check(!app.includes('installPublicDataAutoloadV515 } from'), `${league}: app.js non richiede export V515 come import principale`);
  check(loader.includes('formValidatorsV506: true'), `${league}: formValidatorsV506 e flag esplicito`);
  check(!loader.includes('formValidatorsV506,\n'), `${league}: nessun shorthand formValidatorsV506 non definito`);
  check(loader.includes('league-config.json?v=516'), `${league}: loader fetch config V516`);
  check(cfg.currentVersion === 516, `${league}: league-config currentVersion 516`);
}

if (failures) {
  console.error(`Audit V516 fallito: ${failures} errori.`);
  process.exit(1);
}
console.log('Audit V516 superato: export autoload compatibile e runtime whole-site allineato.');
