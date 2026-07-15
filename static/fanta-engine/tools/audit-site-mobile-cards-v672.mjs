import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}
function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const cssPath = 'static/fanta-engine/css/site-performance-v672.css';
const css = read(cssPath);
assertOk(css.includes('V667 - mobile cards final polish'), 'CSS V672 deve contenere la base stabile V667');
assertOk(css.includes('V672 - rollback mirato'), 'CSS V672 deve documentare il rollback');
assertOk(!css.includes('V670 - Fix reale larghezza'), 'CSS V672 non deve contenere il fix V670');
assertOk(!css.includes('V671 - Fix assoluto'), 'CSS V672 non deve contenere il fix V671');
assertOk(!css.includes('site-mobile-fullwidth-card-cell-v671'), 'CSS V672 non deve usare celle fullwidth V671');

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  assertOk(index.includes('site-performance-v672.css?v=672'), `${league}: index non punta a site-performance V672`);
  assertOk(index.includes('data-site-performance-v672="true"'), `${league}: data-site-performance V672 mancante`);
  assertOk(index.includes('V672'), `${league}: footer/index non aggiornato a V672`);
  assertOk(app.includes('FantaSiteMobileCardsV672'), `${league}: marker runtime V672 mancante`);
  assertOk(app.includes('renderListoneMobileCardV668'), `${league}: renderer V668 non preservato`);
  assertOk(!app.includes('siteMobileCardsFullWidthV671'), `${league}: runtime V671 ancora presente`);
  assertOk(!app.includes("classList.remove('fpt-v584-col-player')"), `${league}: rimozione classe fpt-v584-col-player ancora presente`);
  assertOk(!app.includes('site-mobile-fullwidth-card-cell-v671'), `${league}: classe fullwidth V671 ancora presente`);
}

console.log('Audit site mobile cards V672 OK', JSON.stringify({
  version: 672,
  cssRestoredToV667Base: true,
  v668RendererKept: true,
  noV671Runtime: true,
  fptCellClassPreserved: true
}));
