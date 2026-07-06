#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const checks = [];
function check(name, ok, detail = '') { checks.push({ name, ok: Boolean(ok), detail }); }

const cssPath = 'static/fanta-engine/css/player-tables-mobile-v578.css';
const jsPath = 'static/fanta-engine/js/ui/player-tables-mobile-v578.js';
check('CSS V578 exists', exists(cssPath));
check('JS V578 exists', exists(jsPath));

const css = read(cssPath);
const js = read(jsPath);
check('CSS targets teamarea', css.includes('data-player-table-v578="teamarea"'));
check('CSS targets rose', css.includes('data-player-table-v578="rose"'));
check('CSS targets listone', css.includes('data-player-table-v578="listone"'));
check('CSS halves Listone player column', css.includes('--pt-v578-player-listone: clamp(8.5rem, 46vw, 13.5rem)'));
check('CSS halves Rose/Area player column', css.includes('--pt-v578-player-compact: clamp(5.25rem, 28vw, 7rem)'));
check('CSS forces sticky first column', css.includes('position: sticky') && css.includes('left: 0'));
check('CSS forces role colors', css.includes('--pt-v578-gk-bg') && css.includes('--pt-v578-def-bg') && css.includes('--pt-v578-mid-bg') && css.includes('--pt-v578-fwd-bg'));
check('JS has V578 namespace', js.includes('FantaPlayerTablesMobileV578') && js.includes("var VERSION = 'v578'"));
check('JS writes compact Listone player width inline', js.includes("player: 'clamp(8.5rem, 46vw, 13.5rem)'"));
check('JS writes compact Rose/Area player width inline', js.includes("player: 'clamp(5.25rem, 28vw, 7rem)'"));
check('JS classifies team profile before listone', js.indexOf('team-profile-roster-table') > 0 && js.indexOf("table.classList.contains('listone-table')") > js.indexOf('team-profile-roster-table'));
check('JS writes important inline styles', js.includes("style.setProperty(prop, value, 'important')"));
check('JS includes teamProfilePageBody selector', js.includes('#teamProfilePageBody table'));

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const prefix = `static/${league}`;
  const index = read(`${prefix}/index.html`);
  const competition = read(`${prefix}/competition.html`);
  const player = read(`${prefix}/player.html`);
  const config = JSON.parse(read(`${prefix}/assets/league-config.json`));
  const core = read(`${prefix}/assets/js/core/league-config-v443.js`);
  check(`${league} index loads CSS V578`, index.includes('player-tables-mobile-v578.css?v=578'));
  check(`${league} index loads JS V578`, index.includes('player-tables-mobile-v578.js?v=578'));
  check(`${league} index does not load V577 table tool`, !index.includes('player-tables-mobile-v577'));
  check(`${league} footer V578`, index.includes('V578 · Ultimo aggiornamento 06/07/2026'));
  check(`${league} competition footer V578`, competition.includes('V578 · Ultimo aggiornamento 06/07/2026'));
  check(`${league} player footer V578`, player.includes('V578 · Ultimo aggiornamento 06/07/2026'));
  check(`${league} JSON currentVersion 578`, config.currentVersion === '578');
  check(`${league} JSON footer date 06/07/2026`, config.branding?.footerLastUpdated === '06/07/2026');
  check(`${league} core currentVersion 578`, core.includes("currentVersion: '578'"));
}

const failed = checks.filter((item) => !item.ok);
for (const item of checks) console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}${item.detail ? ` (${item.detail})` : ''}`);
if (failed.length) {
  console.error(`\nAudit V578 failed: ${failed.length} check(s).`);
  process.exit(1);
}
console.log('\nAudit V578 passed.');
