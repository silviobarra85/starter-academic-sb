#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const quiet = process.argv.includes('--quiet');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const cssPath = path.join(root, 'assets/css/refactor/mantra-role-filters-v441.css');
const css = fs.readFileSync(cssPath, 'utf8');

const required = [
  'MANTRA_ROLE_ORDER_V441 = Object.freeze(["Por", "Dc", "Dd", "Ds", "B", "E", "M", "C", "W", "T", "A", "Pc"])',
  'data-listone-mantra-role-filter-v441',
  'data-roster-mantra-role-filter-v441',
  'data-teamarea-mantra-role-filter-v441',
  'getFilteredListonePlayersV441',
  'getSortedFreeAgentsV441',
  'renderRosterPlayerTableV441',
  'renderUserAreaV441',
  'ZonaOrientaleMantraRoleFiltersV441'
];

const failures = [];
for (const token of required) {
  if (!app.includes(token)) failures.push(`Token mancante in app.js: ${token}`);
}
if (!index.includes('mantra-role-filters-v441.css?v=452')) failures.push('CSS V441 non collegato in index.html');
if (!css.includes('listone-mantra-role-filters-v441')) failures.push('CSS V441 non contiene classi Listone');
if (!css.includes('role-filter-panel-v441')) failures.push('CSS V441 non contiene pannello filtri');
if (!/DEPLOY_EXPECTED_VERSION_V181 = "(442|443|444|445|446)"/.test(app)) failures.push('DEPLOY_EXPECTED_VERSION_V181 non compatibile con V441+');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
if (!quiet) console.log('Audit filtri ruoli Mantra V441 superato.');
