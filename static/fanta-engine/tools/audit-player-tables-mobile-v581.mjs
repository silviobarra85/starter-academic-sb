import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'static/fanta-engine/css/player-tables-mobile-v581.css',
  'static/fanta-engine/js/ui/player-tables-mobile-v581.js',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json'
];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

let ok = true;
function pass(msg) { console.log(`OK ${msg}`); }
function fail(msg) { ok = false; console.error(`FAIL ${msg}`); }

for (const file of required) {
  if (fs.existsSync(path.join(root, file))) pass(`${file} exists`);
  else fail(`${file} missing`);
}

const css = read('static/fanta-engine/css/player-tables-mobile-v581.css');
const js = read('static/fanta-engine/js/ui/player-tables-mobile-v581.js');

[
  'data-player-table-v581',
  'fpt-v581-role-p',
  'fpt-v581-role-d',
  'fpt-v581-role-c',
  'fpt-v581-role-a',
  '--pt-v581-gk-bg',
  '--pt-v581-def-bg',
  '--pt-v581-mid-bg',
  '--pt-v581-fwd-bg',
  'position: sticky',
  '--pt-v581-player'
].forEach((needle) => css.includes(needle) ? pass(`CSS contains ${needle}`) : fail(`CSS missing ${needle}`));

[
  'FantaPlayerTablesMobileV581',
  'data-player-table-v581',
  'classifyTable',
  'teamarea',
  'rose',
  'listone',
  "setProperty(prop, value, 'important')",
  'player-table-mobile-v580-active'
].forEach((needle) => js.includes(needle) ? pass(`JS contains ${needle}`) : fail(`JS missing ${needle}`));

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = read(`static/${league}/index.html`);
  const config = JSON.parse(read(`static/${league}/assets/league-config.json`));
  index.includes('player-tables-mobile-v581.css?v=581') ? pass(`${league} loads V581 CSS`) : fail(`${league} does not load V581 CSS`);
  index.includes('player-tables-mobile-v581.js?v=581') ? pass(`${league} loads V581 JS`) : fail(`${league} does not load V581 JS`);
  !index.includes('player-tables-mobile-v580') ? pass(`${league} no V580 table runtime in index`) : fail(`${league} still references V580 runtime`);
  config.currentVersion === '581' ? pass(`${league} currentVersion 581`) : fail(`${league} currentVersion is ${config.currentVersion}`);
}

if (!ok) process.exit(1);
console.log('V581 player mobile tables audit passed');
