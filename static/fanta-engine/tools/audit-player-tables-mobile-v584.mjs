import fs from 'fs';
import path from 'path';

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
let ok = true;
const fail = (msg) => { console.error('FAIL', msg); ok = false; };
const pass = (msg) => console.log('OK', msg);

const required = [
  'static/fanta-engine/css/player-tables-mobile-v584.css',
  'static/fanta-engine/js/ui/player-tables-mobile-v584.js',
  'static/fanta-engine/tools/cleanup-player-tables-mobile-v584.sh'
];
for (const rel of required) exists(rel) ? pass(`${rel} presente`) : fail(`${rel} mancante`);

const leagues = ['zonaorientale', 'fantapetillomantramanager'];
for (const league of leagues) {
  const indexRel = `static/${league}/index.html`;
  const index = read(indexRel);
  index.includes('player-tables-mobile-v584.css?v=584') ? pass(`${league}: CSS V584 caricato`) : fail(`${league}: CSS V584 non caricato`);
  index.includes('player-tables-mobile-v584.js?v=584') ? pass(`${league}: JS V584 caricato`) : fail(`${league}: JS V584 non caricato`);
  index.includes('data-player-tables-mobile-v584="true"') ? pass(`${league}: data marker V584`) : fail(`${league}: marker V584 mancante`);
  for (let v = 567; v <= 583; v += 1) {
    if (index.includes(`v${v}`) && index.includes(`player-tables-mobile-v${v}`)) fail(`${league}: index carica ancora player table V${v}`);
    if (index.includes(`table-column-resizer-v${v}`)) fail(`${league}: index carica ancora resize V${v}`);
  }
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  String(cfg.currentVersion) === '584' ? pass(`${league}: currentVersion 584`) : fail(`${league}: currentVersion non 584`);
  const core = read(`static/${league}/assets/js/core/league-config-v443.js`);
  core.includes("currentVersion: '584'") ? pass(`${league}: core config 584`) : fail(`${league}: core config non 584`);
}

const css = read('static/fanta-engine/css/player-tables-mobile-v584.css');
const js = read('static/fanta-engine/js/ui/player-tables-mobile-v584.js');
['data-player-table-v584', 'fpt-v584-role-p', 'fpt-v584-role-d', 'fpt-v584-role-c', 'fpt-v584-role-a'].forEach((token) => {
  css.includes(token) || js.includes(token) ? pass(`token ${token}`) : fail(`token ${token} mancante`);
});

const obsoleteFiles = [
  'static/fanta-engine/css/roster-sticky-first-col-v567.css',
  'static/fanta-engine/css/roster-mobile-column-fit-v568.css',
  'static/fanta-engine/css/teamarea-roster-first-col-compact-v569.css',
  'static/fanta-engine/css/table-column-resizer-v570.css',
  'static/fanta-engine/css/table-column-resizer-v571.css',
  'static/fanta-engine/js/ui/table-column-resizer-v570.js',
  'static/fanta-engine/js/ui/table-column-resizer-v571.js',
  'static/fanta-engine/css/player-tables-mobile-v583.css',
  'static/fanta-engine/js/ui/player-tables-mobile-v583.js'
];
for (const rel of obsoleteFiles) {
  exists(rel) ? fail(`${rel} dovrebbe essere rimosso dal cleanup`) : pass(`${rel} rimosso`);
}

if (!ok) process.exit(1);
console.log('V584 player tables cleanup audit passed.');
