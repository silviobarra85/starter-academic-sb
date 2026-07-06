#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const checks = [];
function check(name, ok, detail = '') { checks.push({ name, ok: Boolean(ok), detail }); }

const cssPath = 'static/fanta-engine/css/player-tables-mobile-v579.css';
const jsPath = 'static/fanta-engine/js/ui/player-tables-mobile-v579.js';
check('CSS V579 exists', exists(cssPath));
check('JS V579 exists', exists(jsPath));

const css = read(cssPath);
const js = read(jsPath);
check('CSS targets teamarea', css.includes('data-player-table-v579="teamarea"'));
check('CSS targets rose', css.includes('data-player-table-v579="rose"'));
check('CSS targets listone', css.includes('data-player-table-v579="listone"'));
check('CSS keeps compact Listone player column', css.includes('--pt-v579-player-listone: clamp(8.5rem, 46vw, 13.5rem)'));
check('CSS halves Rose/Area player column', css.includes('--pt-v579-player-compact: clamp(5.25rem, 28vw, 7rem)'));
check('CSS forces sticky first column', css.includes('position: sticky') && css.includes('left: 0'));
check('CSS forces Listone palette role colors', css.includes('rgba(245, 158, 11, 0.16)') && css.includes('rgba(34, 197, 94, 0.14)') && css.includes('rgba(56, 189, 248, 0.14)') && css.includes('rgba(248, 113, 113, 0.14)'));
check('JS has V579 namespace', js.includes('FantaPlayerTablesMobileV579') && js.includes("var VERSION = 'v579'"));
check('JS writes compact Listone player width inline', js.includes("player: 'clamp(8.5rem, 46vw, 13.5rem)'"));
check('JS writes compact Rose/Area player width inline', js.includes("player: 'clamp(5.25rem, 28vw, 7rem)'"));
check('CSS increases Stato column to 3.75rem', css.includes('width: 3.75rem !important') && css.includes('.fpt-v579-col-status'));
check('JS increases Stato column to 3.75rem', js.includes("important(cell, 'width', '3.75rem')") && js.includes('fpt-v579-col-status'));
check('JS applies first-column Listone gradient', js.includes('roleFirstBackground') && js.includes("important(cell, 'background', firstBackground)"));
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
  check(`${league} index loads CSS V579`, index.includes('player-tables-mobile-v579.css?v=579'));
  check(`${league} index loads JS V579`, index.includes('player-tables-mobile-v579.js?v=579'));
  check(`${league} index does not load V577 table tool`, !index.includes('player-tables-mobile-v577'));
  check(`${league} footer V579`, index.includes('V579 · Ultimo aggiornamento 06/07/2026'));
  check(`${league} competition footer V579`, competition.includes('V579 · Ultimo aggiornamento 06/07/2026'));
  check(`${league} player footer V579`, player.includes('V579 · Ultimo aggiornamento 06/07/2026'));
  check(`${league} JSON currentVersion 579`, config.currentVersion === '579');
  check(`${league} JSON footer date 06/07/2026`, config.branding?.footerLastUpdated === '06/07/2026');
  check(`${league} core currentVersion 579`, core.includes("currentVersion: '579'"));
}

const failed = checks.filter((item) => !item.ok);
for (const item of checks) console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}${item.detail ? ` (${item.detail})` : ''}`);
if (failed.length) {
  console.error(`\nAudit V579 failed: ${failed.length} check(s).`);
  process.exit(1);
}
console.log('\nAudit V579 passed.');
