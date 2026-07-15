import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const appPaths = [
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js'
];
const indexPaths = [
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html'
];

for (const path of appPaths) {
  const app = read(path);
  assertOk(app.includes('fantaSiteMobileCardsV675'), `${path}: manca blocco V675`);
  assertOk(app.includes('site-mobile-listone-player-card-v675'), `${path}: manca classe card Listone V675`);
  assertOk(app.includes('site-mobile-card-grid-v659 site-mobile-card-grid-v662 site-mobile-card-grid-v663 site-mobile-card-grid-v664 site-mobile-card-grid-v668 site-mobile-card-grid-v675'), `${path}: griglia Listone non allineata alle Rose V668`);
  assertOk(app.includes('site-mobile-roster-player-card-v659 site-mobile-roster-player-card-v662 site-mobile-roster-player-card-v663 site-mobile-roster-player-card-v664 site-mobile-roster-player-card-v668'), `${path}: card Listone non eredita classi Rose`);
  assertOk(app.includes('renderSiteListoneStatusBadgeV663(player)'), `${path}: stato Listone non usato come badge`);
  assertOk(!app.includes('fantaSiteMobileCardsV671'), `${path}: non deve tornare runtime V671`);
}

for (const path of indexPaths) {
  const html = read(path);
  assertOk(html.includes('site-performance-v675.css?v=675'), `${path}: index non punta al CSS V675`);
}

const css = read('static/fanta-engine/css/site-performance-v675.css');
assertOk(css.includes('V675 - Listone mobile usa la stessa griglia/stile delle card Rose V668'), 'CSS V675 mancante');
assertOk(css.includes('.site-mobile-listone-player-card-v675 .site-mobile-card-grid-v675'), 'CSS V675 non gestisce griglia Listone');

console.log('Audit site mobile cards V675 OK', JSON.stringify({
  version: 675,
  siteOnly: true,
  listoneUsesRosterCardClasses: true,
  statusTopRight: true
}));
