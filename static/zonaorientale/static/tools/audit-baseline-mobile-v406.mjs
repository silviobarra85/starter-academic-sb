#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd().endsWith('/tools') ? join(process.cwd(), '..') : process.cwd();
const read = (rel) => readFileSync(join(root, rel), 'utf8');
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  process.exitCode = 1;
};
const pass = (msg) => console.log(`OK: ${msg}`);

const index = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const app = read('assets/app.js');
const styles = read('assets/styles.css');
const mobile = read('assets/css/refactor/mobile-controls.css');

for (const rel of [
  'assets/js/core/section-registry-v405.js',
  'assets/js/sections/regolamento-section-v402.js',
  'assets/js/sections/compare-section-v403.js',
  'assets/js/sections/stats-section-v404.js',
  'assets/js/sections/archive-section-v405.js'
]) {
  existsSync(join(root, rel)) ? pass(`${rel} presente`) : fail(`${rel} mancante`);
}

if (/DEPLOY_EXPECTED_VERSION_V181 = "406"/.test(app)) pass('DEPLOY_EXPECTED_VERSION_V181 allineato a V406');
else fail('DEPLOY_EXPECTED_VERSION_V181 non allineato a V406');

for (const [name, html] of [['index.html', index], ['competition.html', competition], ['player.html', player]]) {
  if (/V406 baseline mobile pulita/.test(html)) pass(`${name} footer V406 presente`);
  else fail(`${name} footer V406 mancante`);
  const versions = [...html.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
  const unique = [...new Set(versions)];
  if (unique.length === 0 || (unique.length === 1 && unique[0] === '406')) pass(`${name} cache-buster coerenti`);
  else fail(`${name} cache-buster non coerenti: ${unique.join(', ')}`);
}

const appVersions = [...app.matchAll(/\?v=([0-9][0-9A-Za-z]*)/g)].map((m) => m[1]);
const uniqueAppVersions = [...new Set(appVersions)];
if (uniqueAppVersions.length === 0 || (uniqueAppVersions.length === 1 && uniqueAppVersions[0] === '406')) pass('assets/app.js cache-buster coerenti');
else fail(`assets/app.js cache-buster non coerenti: ${uniqueAppVersions.join(', ')}`);

for (const forbidden of ['role-backgrounds-v405r2.css', 'role-backgrounds-v405r2.js']) {
  if (!index.includes(forbidden) && !app.includes(forbidden)) pass(`${forbidden} non collegato al runtime`);
  else fail(`${forbidden} ancora collegato al runtime`);
}

if (/ZonaOrientaleRoleBackgroundsV404/.test(app) && /version: 'V406-compat-V404'/.test(app)) pass('colori ruolo consolidati nel runtime canonico');
else fail('colori ruolo non consolidati nel runtime canonico');

if (!/ZonaOrientaleRoleBackgroundsV405R/.test(app) && !/__zonaOrientaleRoleBackgroundObserverV405R/.test(app)) pass('observer duplicato colori ruolo rimosso');
else fail('observer duplicato colori ruolo ancora presente');

for (const token of [
  'zo-role-bg-v405-gk',
  'zo-role-bg-v405-def',
  'zo-role-bg-v405-mid',
  'zo-role-bg-v405-fwd',
  'player-role-gk',
  'player-role-def',
  'player-role-mid',
  'player-role-fwd'
]) {
  if (app.includes(token) && styles.includes(token)) pass(`${token} coperto da JS e CSS`);
  else fail(`${token} non coperto da JS e CSS`);
}

for (const token of ['V406 - Mobile safety', 'overflow-x: hidden', 'min-height: 44px', 'safe-area-inset-bottom']) {
  if (mobile.includes(token)) pass(`mobile-controls.css contiene ${token}`);
  else fail(`mobile-controls.css non contiene ${token}`);
}

if (!/sezioni\//.test(index) && !/section-entrypoints/.test(index)) pass('nessun ritorno al refactor pagine standalone');
else fail('trovati riferimenti al refactor pagine standalone');

if (!process.exitCode) pass('audit baseline mobile V406 superato');
