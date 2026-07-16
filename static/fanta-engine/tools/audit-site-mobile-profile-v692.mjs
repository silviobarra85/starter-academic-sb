import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}
function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const appZo = read('static/zonaorientale/assets/app.js');
const appFpm = read('static/fantapetillomantramanager/assets/app.js');
const css = read('static/fanta-engine/css/site-performance-v692.css');
const indexZo = read('static/zonaorientale/index.html');
const indexFpm = read('static/fantapetillomantramanager/index.html');

for (const [name, app] of [['zonaorientale', appZo], ['fantapetillomantramanager', appFpm]]) {
  assertOk(app.includes('fantaSiteMobileRostersAndProfileV692'), `${name}: manca blocco V692`);
  assertOk(app.includes('marketActivityMobileCardsV692'), `${name}: manca container mobile movimenti Tutte le Rose`);
  assertOk(app.includes('site-mobile-market-table-hidden-v692'), `${name}: manca hide table mobile V692`);
  assertOk(app.includes("const VERSION_LABEL = 'Fantacalcio - V692 - Profili mobile responsive'"), `${name}: footer non aggiornato a V692`);
}

assertOk(css.includes('site-mobile-market-movement-card-v692'), 'CSS: manca card movimenti Tutte le Rose V692');
assertOk(css.includes('team-profile-movement-card-v691'), 'CSS: manca ripristino scuro movimenti profilo');
assertOk(css.includes('background: linear-gradient(135deg, rgba(15, 23, 42'), 'CSS: manca background scuro');
assertOk(indexZo.includes('site-performance-v692.css?v=692'), 'index ZonaOrientale non punta CSS V692');
assertOk(indexFpm.includes('site-performance-v692.css?v=692'), 'index FPM non punta CSS V692');
assertOk(indexZo.includes('app.js?v=692'), 'index ZonaOrientale non punta app V692');
assertOk(indexFpm.includes('app.js?v=692'), 'index FPM non punta app V692');

console.log('Audit site mobile profile V692 OK');
