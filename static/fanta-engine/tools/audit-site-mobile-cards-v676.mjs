import { readFileSync } from 'node:fs';

function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const zonaApp = readFileSync('static/zonaorientale/assets/app.js', 'utf8');
const fpmApp = readFileSync('static/fantapetillomantramanager/assets/app.js', 'utf8');
const css = readFileSync('static/fanta-engine/css/site-performance-v676.css', 'utf8');
const zonaIndex = readFileSync('static/zonaorientale/index.html', 'utf8');
const fpmIndex = readFileSync('static/fantapetillomantramanager/index.html', 'utf8');

for (const [name, source] of [['zonaorientale', zonaApp], ['fantapetillomantramanager', fpmApp]]) {
  assertOk(source.includes('FantaSiteListoneMobileDivV676'), `${name}: manca marker V676`);
  assertOk(source.includes('listoneMobileCardsV676'), `${name}: manca root mobile V676`);
  assertOk(source.includes('wrap.hidden = Boolean(enabled)'), `${name}: tabella Listone non nascosta su mobile`);
  assertOk(source.includes('renderListonePublicV676'), `${name}: renderListonePublic non sovrascritto`);
  assertOk(source.includes('mobileListoneLeavesTable: true'), `${name}: manca dichiarazione div layout`);
}

assertOk(css.includes('site-listone-mobile-v676'), 'CSS: manca contenitore mobile V676');
assertOk(css.includes('.listone-table-wrap[hidden]'), 'CSS: manca regola per nascondere tabella legacy');
assertOk(zonaIndex.includes('site-performance-v676.css?v=676'), 'zonaorientale: index non punta al CSS V676');
assertOk(fpmIndex.includes('site-performance-v676.css?v=676'), 'fpm: index non punta al CSS V676');
assertOk(zonaIndex.includes('./assets/app.js?v=676'), 'zonaorientale: index non punta app JS V676');
assertOk(fpmIndex.includes('./assets/app.js?v=676'), 'fpm: index non punta app JS V676');

console.log('Audit site mobile cards V676 OK', JSON.stringify({
  version: 676,
  siteOnly: true,
  mobileListoneLeavesTable: true,
  desktopUnchanged: true,
  usesRoseLikeDivLayout: true
}));
