#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const checks = [];
function check(name, ok, detail = '') { checks.push({ name, ok: Boolean(ok), detail }); }

const cssPath = 'static/fanta-engine/css/player-tables-mobile-v577.css';
const jsPath = 'static/fanta-engine/js/ui/player-tables-mobile-v577.js';
check('CSS V577 exists', exists(cssPath));
check('JS V577 exists', exists(jsPath));

const css = read(cssPath);
const js = read(jsPath);
check('CSS targets teamarea', css.includes('data-player-table-v577="teamarea"'));
check('CSS targets rose', css.includes('data-player-table-v577="rose"'));
check('CSS targets listone', css.includes('data-player-table-v577="listone"'));
check('CSS compact Rose/Area player column', css.includes('--pt-v577-player-compact: clamp(10.25rem, 54vw, 14rem)'));
check('CSS keeps Listone wider column', css.includes('--pt-v577-player-listone: clamp(17rem, 92vw, 27rem)'));
check('CSS forces sticky first column', css.includes('position: sticky') && css.includes('left: 0'));
check('CSS forces role colors', css.includes('--pt-v577-gk-bg') && css.includes('--pt-v577-def-bg') && css.includes('--pt-v577-mid-bg') && css.includes('--pt-v577-fwd-bg'));
check('JS classifies team profile before listone', js.indexOf('team-profile-roster-table') > 0 && js.indexOf('table.classList.contains(\'listone-table\')') > js.indexOf('team-profile-roster-table'));
check('JS writes important inline styles', js.includes("style.setProperty(prop, value, 'important')"));
check('JS includes teamProfilePageBody selector', js.includes('#teamProfilePageBody table'));

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const prefix = `static/${league}`;
  const index = read(`${prefix}/index.html`);
  const competition = read(`${prefix}/competition.html`);
  const player = read(`${prefix}/player.html`);
  const config = JSON.parse(read(`${prefix}/assets/league-config.json`));
  const core = read(`${prefix}/assets/js/core/league-config-v443.js`);
  check(`${league} index loads CSS V577`, index.includes('player-tables-mobile-v577.css?v=577'));
  check(`${league} index loads JS V577`, index.includes('player-tables-mobile-v577.js?v=577'));
  check(`${league} index does not load V576 table tool`, !index.includes('player-tables-mobile-v576'));
  check(`${league} footer V577`, index.includes('V577 · Ultimo aggiornamento 06/07/2026'));
  check(`${league} competition footer V577`, competition.includes('V577 · Ultimo aggiornamento 06/07/2026'));
  check(`${league} player footer V577`, player.includes('V577 · Ultimo aggiornamento 06/07/2026'));
  check(`${league} JSON currentVersion 577`, config.currentVersion === '577');
  check(`${league} JSON footer date 06/07/2026`, config.branding?.footerLastUpdated === '06/07/2026');
  check(`${league} core currentVersion 577`, core.includes("currentVersion: '577'"));
}

const failed = checks.filter((item) => !item.ok);
for (const item of checks) console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}${item.detail ? ` (${item.detail})` : ''}`);
if (failed.length) {
  console.error(`\nAudit V577 failed: ${failed.length} check(s).`);
  process.exit(1);
}
console.log('\nAudit V577 passed.');
