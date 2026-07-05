#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const assert = (cond, msg) => { if (!cond) failures.push(msg); };

const cssFile = 'static/fanta-engine/css/roster-mobile-column-fit-v568.css';
assert(exists(cssFile), `missing ${cssFile}`);
const css = exists(cssFile) ? read(cssFile) : '';
assert(css.includes('roster-col-player'), 'V568 CSS must target player column');
assert(css.includes('max-width: none'), 'V568 CSS must remove fixed max-width from player column');
assert(css.includes('text-overflow: clip'), 'V568 CSS must disable ellipsis on player column');
assert(css.includes('roster-col-cost'), 'V568 CSS must target cost column');
assert(css.includes('width: 1%'), 'V568 CSS must shrink cost/qta columns to content width');

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const indexFile = `static/${league}/index.html`;
  const appFile = `static/${league}/assets/app.js`;
  const cfgFile = `static/${league}/assets/league-config.json`;
  const jsCfgFile = `static/${league}/assets/js/core/league-config-v443.js`;
  assert(exists(indexFile), `missing ${indexFile}`);
  assert(exists(appFile), `missing ${appFile}`);
  assert(exists(cfgFile), `missing ${cfgFile}`);
  assert(exists(jsCfgFile), `missing ${jsCfgFile}`);
  const index = exists(indexFile) ? read(indexFile) : '';
  const app = exists(appFile) ? read(appFile) : '';
  const cfg = exists(cfgFile) ? JSON.parse(read(cfgFile)) : {};
  const jsCfg = exists(jsCfgFile) ? read(jsCfgFile) : '';
  assert(index.includes('roster-sticky-first-col-v567.css'), `${league}: V567 opaque CSS must remain loaded`);
  assert(index.includes('roster-mobile-column-fit-v568.css?v=568'), `${league}: V568 CSS link missing from index`);
  assert(index.indexOf('roster-sticky-first-col-v567.css') < index.indexOf('roster-mobile-column-fit-v568.css'), `${league}: V568 CSS must load after V567 CSS`);
  assert(app.includes('DEPLOY_EXPECTED_VERSION_V181 = "568"'), `${league}: app expected version must be 568`);
  assert(app.includes('league-config-v443.js?v=568'), `${league}: app must import config with v568 cachebuster`);
  assert(String(cfg.currentVersion) === '568', `${league}: league-config currentVersion must be 568`);
  assert(cfg.rosterMobileColumnFitV568?.version === 'V568', `${league}: V568 config marker missing`);
  assert(jsCfg.includes("currentVersion: '568'"), `${league}: JS fallback currentVersion must be 568`);
}

if (failures.length) {
  console.error('V568 audit failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('V568 audit OK: roster mobile columns adapt to content and cache-busters are aligned.');
