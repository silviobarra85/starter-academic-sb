#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json',
  'static/zonaorientale/assets/js/core/league-config-v443.js',
  'static/fantapetillomantramanager/assets/js/core/league-config-v443.js'
];
const failures = [];
function read(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    failures.push(`missing ${rel}`);
    return '';
  }
  return fs.readFileSync(abs, 'utf8');
}
function assert(condition, message) {
  if (!condition) failures.push(message);
}

for (const rel of requiredFiles) read(rel);

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const app = read(`static/${league}/assets/app.js`);
  const config = JSON.parse(read(`static/${league}/assets/league-config.json`) || '{}');
  const runtimeConfig = read(`static/${league}/assets/js/core/league-config-v443.js`);
  const html = read(`static/${league}/index.html`);

  assert(app.includes('FantaPublicRosterRoleFiltersV586'), `${league}: V586 public roster role filter override not found`);
  assert(app.includes('filterRosterPlayersForPublicV586'), `${league}: public roster filtering is not neutralized`);
  assert(app.includes('ensureRosterRoleFilterControlsV586'), `${league}: public roster role filter DOM insertion is not disabled`);
  assert(app.includes('preservesListoneRoleFilters: true'), `${league}: listone role filters preservation marker missing`);
  assert(app.includes('preservesTeamAreaOperationalRoleFilters: true'), `${league}: team-area operational filters preservation marker missing`);
  assert(String(config.currentVersion) === '586', `${league}: league-config currentVersion is not 586`);
  assert(runtimeConfig.includes("currentVersion: '586'"), `${league}: runtime league config currentVersion is not 586`);
  assert(html.includes('app.js?v=586'), `${league}: app.js cache-buster is not 586`);
  assert(html.includes('league-config-v443.js?v=586'), `${league}: league-config cache-buster is not 586`);
}

const htmlFiles = [
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/competition.html',
  'static/fantapetillomantramanager/competition.html',
  'static/zonaorientale/player.html',
  'static/fantapetillomantramanager/player.html'
];
for (const rel of htmlFiles) {
  const text = read(rel);
  assert(!/table-column-resizer-v57[01]/.test(text), `${rel}: table resize V570/V571 still referenced`);
  assert(!/player-tables-mobile-v5(6[7-9]|7[0-9]|8[0-3])/.test(text), `${rel}: old player table mobile asset still referenced`);
}

const oldAssetPatterns = [
  /^table-column-resizer-v57[01]\.(css|js)$/,
  /^player-tables-mobile-v5(6[7-9]|7[0-9]|8[0-3])\.(css|js)$/,
  /^audit-(table-column-resizer-v57[01]|player-tables-mobile-v5(6[7-9]|7[0-9]|8[0-3]))\.mjs$/
];
const dirs = ['static/fanta-engine/css', 'static/fanta-engine/js/ui', 'static/fanta-engine/tools'];
for (const dir of dirs) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) continue;
  for (const name of fs.readdirSync(abs)) {
    if (oldAssetPatterns.some((pattern) => pattern.test(name))) failures.push(`${dir}/${name}: old experimental asset should be removed`);
  }
}

if (failures.length) {
  console.error('V586 audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('V586 audit passed: public roster role filters disabled, cache-busters aligned, old table assets not referenced.');
