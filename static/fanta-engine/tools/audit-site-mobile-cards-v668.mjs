import { readFileSync, existsSync } from 'node:fs';

function read(path) {
  if (!existsSync(path)) throw new Error(`File mancante: ${path}`);
  return readFileSync(path, 'utf8');
}
function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const css = read('static/fanta-engine/css/site-performance-v668.css');
const zonaApp = read('static/zonaorientale/assets/app.js');
const fmmApp = read('static/fantapetillomantramanager/assets/app.js');
const zonaIndex = read('static/zonaorientale/index.html');
const fmmIndex = read('static/fantapetillomantramanager/index.html');

for (const index of [zonaIndex, fmmIndex]) {
  assertOk(index.includes('site-performance-v668.css?v=668'), 'index non punta al CSS V668');
}
for (const app of [zonaApp, fmmApp]) {
  assertOk(app.includes('SITE_MOBILE_CARDS_VERSION_V668'), 'app non contiene blocco V668');
  assertOk(app.includes('LISTONE_COLUMNS_REMOVED_FROM_CONTROLS_V668'), 'filtri/controlli listone non ripuliti');
  assertOk(app.includes('renderSiteMobileFixedFieldV668'), 'box fissi V668 assenti');
  assertOk(app.includes('renderListoneMobileCardV668'), 'card listone V668 assente');
  assertOk(app.includes('renderRosterPlayerMobileCardV668'), 'card rose V668 assente');
  for (const key of ['sourceSheet','rosterCost','quotationDiffMantra','rosterRole','quotationInitialMantra','quotationCurrentMantra']) {
    assertOk(app.includes(key), `chiave rimossa ${key} non gestita`);
  }
}
assertOk(css.includes('td.fpt-v584-col-player'), 'CSS non neutralizza td.fpt-v584-col-player');
assertOk(css.includes('site-mobile-card-field-v668'), 'CSS box fissi V668 assente');
assertOk(css.includes('text-transform: uppercase'), 'CSS maiuscolo giocatori assente');

console.log('Audit site mobile cards V668 OK', JSON.stringify({
  version: 668,
  removedListoneControls: true,
  fixedFieldBoxes: true,
  neutralFptV584Background: true,
  uppercasePlayerNames: true
}));
