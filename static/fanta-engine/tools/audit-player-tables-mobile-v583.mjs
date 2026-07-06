import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'static/fanta-engine/css/player-tables-mobile-v583.css',
  'static/fanta-engine/js/ui/player-tables-mobile-v583.js',
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

const css = read('static/fanta-engine/css/player-tables-mobile-v583.css');
const js = read('static/fanta-engine/js/ui/player-tables-mobile-v583.js');

[
  'data-player-table-v583',
  'data-fpt-v583-role="p"',
  'data-fpt-v583-role="d"',
  'data-fpt-v583-role="c"',
  'data-fpt-v583-role="a"',
  '--pt-v583-teamarea-status: 8rem',
  '--pt-v583-rose-status: 4.75rem',
  '--pt-v583-listone-status: 5.25rem',
  '--pt-v583-listone-roster: 6.25rem',
  '--pt-v583-listone-change: 6.25rem',
  '--pt-v583-free-agent-fg: #fde68a',
  'position: sticky',
  'color: var(--pt-v583-fg)'
].forEach((needle) => css.includes(needle) ? pass(`CSS contains ${needle}`) : fail(`CSS missing ${needle}`));

[
  'FantaPlayerTablesMobileV583',
  'data-player-table-v583',
  'classifyTable',
  "status: { teamarea: '8rem', rose: '4.75rem', listone: '5.25rem'",
  "listoneRoster: '6.25rem'",
  "listoneChange: '6.25rem'",
  'markFreeAgents',
  'clearLegacyRoleClassesDeep',
  "setProperty(prop, value, 'important')",
  'forceWhiteText'
].forEach((needle) => js.includes(needle) ? pass(`JS contains ${needle}`) : fail(`JS missing ${needle}`));

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = read(`static/${league}/index.html`);
  const config = JSON.parse(read(`static/${league}/assets/league-config.json`));
  index.includes('player-tables-mobile-v583.css?v=583') ? pass(`${league} loads V583 CSS`) : fail(`${league} does not load V583 CSS`);
  index.includes('player-tables-mobile-v583.js?v=583') ? pass(`${league} loads V583 JS`) : fail(`${league} does not load V583 JS`);
  !/player-tables-mobile-v5(70|71|72|73|74|75|76|77|78|79|80|81|82)\.(css|js)/.test(index) ? pass(`${league} no old player-table runtime in index`) : fail(`${league} still references old player-table runtime`);
  config.currentVersion === '583' ? pass(`${league} currentVersion 583`) : fail(`${league} currentVersion is ${config.currentVersion}`);
}

if (!ok) process.exit(1);
console.log('V583 player mobile tables audit passed');
