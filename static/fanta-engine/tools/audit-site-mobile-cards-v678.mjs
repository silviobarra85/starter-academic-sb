import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function assertOk(condition, message) { if (!condition) throw new Error(message); }

const zApp = read('static/zonaorientale/assets/app.js');
const fApp = read('static/fantapetillomantramanager/assets/app.js');
const css = read('static/fanta-engine/css/site-performance-v678.css');
const zIndex = read('static/zonaorientale/index.html');
const fIndex = read('static/fantapetillomantramanager/index.html');

for (const [name, app] of [['zonaorientale', zApp], ['fantapetillomantramanager', fApp]]) {
  assertOk(app.includes('fantaSiteListoneMobileCardsV678'), `${name}: runtime V678 assente`);
  assertOk(app.includes('FIELD_ORDER'), `${name}: campi listone completi assenti`);
  assertOk(app.includes('site-listone-change-corner-v678'), `${name}: badge modifica in basso assente`);
  assertOk(app.includes('marketFieldRemoved: true'), `${name}: rimozione Mercato non dichiarata`);
  assertOk(app.includes('listoneFieldsFromJson: true'), `${name}: campi JSON listone non dichiarati`);
  assertOk(app.includes('MutationObserver'), `${name}: guard footer non presente`);
}

assertOk(css.includes('site-mobile-listone-player-card-v678'), 'CSS card V678 assente');
assertOk(css.includes('site-listone-change-corner-v678'), 'CSS badge modifica V678 assente');
assertOk(zIndex.includes('site-performance-v678.css?v=678'), 'ZonaOrientale non punta al CSS V678');
assertOk(fIndex.includes('site-performance-v678.css?v=678'), 'FantaPetillo non punta al CSS V678');
assertOk(zIndex.includes('assets/app.js?v=678'), 'ZonaOrientale non punta ad app.js V678');
assertOk(fIndex.includes('assets/app.js?v=678'), 'FantaPetillo non punta ad app.js V678');
assertOk(zIndex.includes('V678'), 'Footer ZonaOrientale non aggiornato a V678');
assertOk(fIndex.includes('V678'), 'Footer FantaPetillo non aggiornato a V678');

console.log('Audit site mobile cards V678 OK', JSON.stringify({
  version: 678,
  basedOn: 676,
  listoneMobileDivLayout: true,
  marketFieldRemoved: true,
  changeBadgeBottomRight: true,
  footerGuard: true
}));
