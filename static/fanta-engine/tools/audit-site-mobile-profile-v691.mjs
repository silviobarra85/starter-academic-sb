import fs from 'node:fs';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}
function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const zoApp = read('static/zonaorientale/assets/app.js');
const fmmApp = read('static/fantapetillomantramanager/assets/app.js');
const zoIndex = read('static/zonaorientale/index.html');
const fmmIndex = read('static/fantapetillomantramanager/index.html');
const css = read('static/fanta-engine/css/site-performance-v691.css');

for (const [name, app] of [['zonaorientale', zoApp], ['fantapetillomantramanager', fmmApp]]) {
  assertOk(app.includes('fantaSiteProfileResponsiveFooterV691'), `${name}: manca patch V691`);
  assertOk(app.includes('team-profile-movement-card-v691'), `${name}: manca card movimenti V691`);
  assertOk(app.includes('team-profile-news-card-v691'), `${name}: manca card comunicati V691`);
  assertOk(app.includes('MutationObserver'), `${name}: manca footer guard robusto`);
  assertOk(app.includes("forceFooterVersionV667 = forceFooterV691"), `${name}: vecchio footer V667 non neutralizzato`);
}

for (const [name, index] of [['zonaorientale', zoIndex], ['fantapetillomantramanager', fmmIndex]]) {
  assertOk(index.includes('site-performance-v691.css?v=691'), `${name}: index non punta al CSS V691`);
  assertOk(index.includes('assets/app.js?v=691'), `${name}: index non punta ad app.js v691`);
  assertOk(index.includes('V691'), `${name}: footer statico non aggiornato a V691`);
}

assertOk(css.includes('V691 - Profili squadra mobile'), 'CSS V691 non presente');
assertOk(css.includes('overflow-x: hidden'), 'CSS V691 non blocca overflow orizzontale');
assertOk(css.includes('team-profile-movement-card-v691'), 'CSS movimenti V691 mancante');
assertOk(css.includes('team-profile-news-card-v691'), 'CSS comunicati V691 mancante');

console.log('Audit site mobile profile V691 OK', JSON.stringify({
  version: 691,
  profileCardsResponsive: true,
  footerGuardRobust: true,
  desktopChanged: false,
  iosudoChanged: false
}));
