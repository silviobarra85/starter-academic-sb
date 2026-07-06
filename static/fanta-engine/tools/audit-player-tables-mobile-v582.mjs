import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'static/fanta-engine/css/player-tables-mobile-v582.css',
  'static/fanta-engine/js/ui/player-tables-mobile-v582.js',
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

const css = read('static/fanta-engine/css/player-tables-mobile-v582.css');
const js = read('static/fanta-engine/js/ui/player-tables-mobile-v582.js');

[
  'data-player-table-v582',
  'fpt-v582-role-p',
  'fpt-v582-role-d',
  'fpt-v582-role-c',
  'fpt-v582-role-a',
  '--pt-v582-gk-bg',
  '--pt-v582-def-bg',
  '--pt-v582-mid-bg',
  '--pt-v582-fwd-bg',
  'position: sticky',
  '--pt-v582-player',
  '--pt-v582-status',
  'color: var(--pt-v582-fg)'
].forEach((needle) => css.includes(needle) ? pass(`CSS contains ${needle}`) : fail(`CSS missing ${needle}`));

[
  'FantaPlayerTablesMobileV582',
  'data-player-table-v582',
  'classifyTable',
  'teamarea',
  'rose',
  'listone',
  "setProperty(prop, value, 'important')",
  'forceWhiteText'
].forEach((needle) => js.includes(needle) ? pass(`JS contains ${needle}`) : fail(`JS missing ${needle}`));

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = read(`static/${league}/index.html`);
  const config = JSON.parse(read(`static/${league}/assets/league-config.json`));
  index.includes('player-tables-mobile-v582.css?v=582') ? pass(`${league} loads V582 CSS`) : fail(`${league} does not load V582 CSS`);
  index.includes('player-tables-mobile-v582.js?v=582') ? pass(`${league} loads V582 JS`) : fail(`${league} does not load V582 JS`);
  !index.includes('player-tables-mobile-v581') && !index.includes('player-tables-mobile-v580') ? pass(`${league} no old table runtime in index`) : fail(`${league} still references old runtime`);
  config.currentVersion === '582' ? pass(`${league} currentVersion 582`) : fail(`${league} currentVersion is ${config.currentVersion}`);
}

if (!ok) process.exit(1);
console.log('V582 player mobile tables audit passed');
