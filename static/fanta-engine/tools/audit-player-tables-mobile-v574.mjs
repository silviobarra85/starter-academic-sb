import { readFileSync, existsSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const assert = (condition, message) => {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
    return;
  }
  console.log(`OK: ${message}`);
};

const cssPath = 'static/fanta-engine/css/player-tables-mobile-v574.css';
assert(existsSync(cssPath), 'CSS V574 presente');
const css = read(cssPath);

assert(css.includes('.roster-inline-table-wrap'), 'Scope Area Squadra presente');
assert(css.includes('.team-profile-roster-wrap'), 'Scope Rose presente');
assert(css.includes('[data-page="listone"] table.listone-table'), 'Scope Listone presente');
assert(css.includes('player-role-gk') && css.includes('player-role-def') && css.includes('player-role-mid') && css.includes('player-role-fwd'), 'Colori righe per ruolo presenti');
assert(css.includes('position: sticky !important') && css.includes('left: 0 !important'), 'Prima colonna sticky presente');
assert(css.includes('top: 0 !important'), 'Header sticky presente');
assert(css.includes('white-space: normal !important') && css.includes('overflow-wrap: anywhere !important'), 'Nome giocatore non troncato');
assert(css.includes('font-size: 0.68rem'), 'Font mobile Listone applicato');
assert(!css.includes('table-column-resizer'), 'Resize tabelle non reintrodotto');

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const indexPath = `static/${league}/index.html`;
  const index = read(indexPath);
  assert(index.includes('player-tables-mobile-v574.css?v=574'), `${league}: CSS V574 caricato`);
  assert(!index.includes('player-tables-mobile-v573.css?v=573'), `${league}: CSS V573 non caricato in index`);

  const cfg = read(`static/${league}/assets/league-config.json`);
  assert(cfg.includes('"currentVersion": "574"'), `${league}: currentVersion JSON V574`);

  const jsCfg = read(`static/${league}/assets/js/core/league-config-v443.js`);
  assert(jsCfg.includes("currentVersion: '574'"), `${league}: currentVersion runtime V574`);
}

if (process.exitCode) process.exit(process.exitCode);
