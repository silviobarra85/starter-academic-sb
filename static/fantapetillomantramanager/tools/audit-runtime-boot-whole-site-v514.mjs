import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

for (const league of leagues) {
  const base = `static/${league}`;
  const configJs = read(`${base}/assets/js/core/league-config-v443.js`);
  const configJson = JSON.parse(read(`${base}/assets/league-config.json`));
  const index = read(`${base}/index.html`);
  const competition = read(`${base}/competition.html`);
  const player = read(`${base}/player.html`);
  const app = read(`${base}/assets/app.js`);
  const service = read(`${base}/assets/js/data/static-files-service.js`);
  const ui = read(`${base}/assets/js/core/ui.js`);
  const bilanci = read(`${base}/assets/js/sections/bilanci-snapshot-section-v435.js`);

  check(configJson.currentVersion === 514, `${league}: league-config.json currentVersion non e V514`);
  check(configJs.includes("currentVersion: '514'"), `${league}: fallback JS non e V514`);
  check(configJs.includes('league-config.json?v=514'), `${league}: config JSON cache-buster non e V514`);
  check(configJs.includes('formValidatorsV506: true'), `${league}: formValidatorsV506 non e booleano esplicito`);
  check(!configJs.includes('formValidatorsV506, leagueTemplateHardeningV507'), `${league}: shorthand formValidatorsV506 ancora presente`);
  check(index.includes('league-config-v443.js?v=514') && index.includes('assets/app.js?v=514'), `${league}: index non carica runtime V514`);
  check(competition.includes('league-config-v443.js?v=514'), `${league}: competition non carica config V514`);
  check(player.includes('league-config-v443.js?v=514'), `${league}: player non carica config V514`);
  check(app.includes('league-config-v443.js?v=514'), `${league}: app.js importa config non V514`);
  check(service.includes('league-config-v443.js?v=514'), `${league}: static-files-service importa config non V514`);
  check(ui.includes('league-config-v443.js?v=514'), `${league}: ui importa config non V514`);
  check(bilanci.includes('league-config-v443.js?v=514'), `${league}: bilanci snapshot importa config non V514`);
}

if (failures.length) {
  console.error('[audit-runtime-boot-whole-site-v514] FAIL');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('[audit-runtime-boot-whole-site-v514] OK - runtime boot fix applicato a tutto il sito.');
