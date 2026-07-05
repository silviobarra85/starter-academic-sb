import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const required = [
  'static/fanta-engine/css/player-tables-mobile-v575.css',
  'static/fanta-engine/js/ui/player-tables-mobile-v575.js',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json',
  'static/zonaorientale/assets/js/core/league-config-v443.js',
  'static/fantapetillomantramanager/assets/js/core/league-config-v443.js'
];

const failures = [];
const read = (file) => readFileSync(join(root, file), 'utf8');

for (const file of required) {
  if (!existsSync(join(root, file))) failures.push(`Missing ${file}`);
}

if (!failures.length) {
  const css = read('static/fanta-engine/css/player-tables-mobile-v575.css');
  const js = read('static/fanta-engine/js/ui/player-tables-mobile-v575.js');
  for (const token of [
    'fanta-player-table-v575-teamarea',
    'fanta-player-table-v575-rose',
    'fanta-player-table-v575-listone',
    'fanta-role-p-v575',
    'fanta-role-d-v575',
    'fanta-role-c-v575',
    'fanta-role-a-v575',
    'position: sticky',
    'background: var(--pt-v575-gk-bg)',
    'white-space: normal'
  ]) {
    if (!css.includes(token)) failures.push(`CSS token missing: ${token}`);
  }
  for (const token of [
    'FantaPlayerTablesMobileV575',
    'MutationObserver',
    'team-profile-roster-table',
    'roster-player-table',
    'listone-table',
    'fanta-player-table-v575-teamarea',
    'fanta-player-table-v575-rose'
  ]) {
    if (!js.includes(token)) failures.push(`JS token missing: ${token}`);
  }
  for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
    const index = read(`static/${league}/index.html`);
    const config = read(`static/${league}/assets/league-config.json`);
    const configJs = read(`static/${league}/assets/js/core/league-config-v443.js`);
    if (!index.includes('player-tables-mobile-v575.css?v=575')) failures.push(`${league}: missing CSS v575 link`);
    if (!index.includes('player-tables-mobile-v575.js?v=575')) failures.push(`${league}: missing JS v575 link`);
    if (index.includes('table-column-resizer-v570') || index.includes('table-column-resizer-v571')) failures.push(`${league}: resize script/css still linked`);
    if (!config.includes('"currentVersion": "575"')) failures.push(`${league}: config currentVersion not 575`);
    if (!configJs.includes("currentVersion: '575'")) failures.push(`${league}: JS config currentVersion not 575`);
  }
}

if (failures.length) {
  console.error('V575 audit failed');
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}
console.log('V575 audit passed: mobile player tables are forced by runtime classes and separated CSS.');
