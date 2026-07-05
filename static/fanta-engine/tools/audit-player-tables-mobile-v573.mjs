#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const fail = [];
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function assert(cond, msg) { if (!cond) fail.push(msg); }

const css = read('static/fanta-engine/css/player-tables-mobile-v573.css');
assert(css.includes('V573 - Mobile player tables reset'), 'CSS V573 presente');
assert(css.includes('player-role-gk') && css.includes('player-role-def') && css.includes('player-role-mid') && css.includes('player-role-fwd'), 'CSS copre tutti i ruoli P/D/C/A');
assert(css.includes('position: sticky !important') && css.includes('left: 0 !important'), 'CSS blocca la prima colonna');
assert(css.includes('top: 0 !important'), 'CSS blocca anche la riga intestazione');
assert(css.includes('white-space: normal !important') && css.includes('text-overflow: clip !important'), 'CSS impedisce troncamento nomi');
assert(css.includes('clamp(17rem, 92vw, 27rem)') && css.includes('clamp(20rem, 108vw, 30rem)'), 'CSS raddoppia la colonna giocatore');
assert(css.includes('width: 3.25rem !important'), 'CSS dimezza/compatta la colonna Stato');
assert(css.includes('width: 3.75rem !important'), 'CSS uniforma Costo e Qt.A');
assert(css.includes('[data-page="listone"] table.listone-table'), 'CSS ha scope Listone');
assert(css.includes('team-profile-roster-table'), 'CSS ha scope Rose');
assert(css.includes('roster-inline-table-wrap'), 'CSS ha scope Area Squadra/Dashboard');

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = read(`static/${league}/index.html`);
  const config = JSON.parse(read(`static/${league}/assets/league-config.json`));
  const jsConfig = read(`static/${league}/assets/js/core/league-config-v443.js`);
  for (const token of ['table-column-resizer-v570', 'table-column-resizer-v571', 'FantaTableResizeV571', 'resizeTabelle=1']) {
    assert(!index.includes(token), `${league}: index non carica piu resize ${token}`);
  }
  for (const oldCss of ['roster-sticky-first-col-v567.css', 'roster-mobile-column-fit-v568.css', 'teamarea-roster-first-col-compact-v569.css']) {
    assert(!index.includes(oldCss), `${league}: rimosso vecchio CSS incrementale ${oldCss}`);
  }
  assert(index.includes('player-tables-mobile-v573.css?v=573'), `${league}: CSS V573 caricato`);
  assert(index.includes('V573'), `${league}: footer HTML V573`);
  assert(config.currentVersion === '573', `${league}: currentVersion V573`);
  assert(config.playerTablesMobileV573?.status === 'enabled', `${league}: metadata V573 in config`);
  assert(!('tableColumnResizerV571' in config), `${league}: metadata resize V571 rimossa`);
  assert(jsConfig.includes("currentVersion: '573'"), `${league}: fallback JS V573`);
}

if (fail.length) {
  console.error('Audit V573 fallito:');
  for (const item of fail) console.error(`- ${item}`);
  process.exit(1);
}
console.log('Audit V573 OK - colonne mobile tabelle giocatori tarate e resize rimosso.');
