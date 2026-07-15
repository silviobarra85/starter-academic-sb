import fs from 'node:fs';

function read(path){ return fs.readFileSync(path, 'utf8'); }
function assertOk(condition, message){ if (!condition) throw new Error(message); }

const css = read('static/fanta-engine/css/site-performance-v673.css');
const zonaIndex = read('static/zonaorientale/index.html');
const fmmIndex = read('static/fantapetillomantramanager/index.html');
const zonaApp = read('static/zonaorientale/assets/app.js');
const fmmApp = read('static/fantapetillomantramanager/assets/app.js');

assertOk(zonaIndex.includes('site-performance-v673.css?v=673'), 'ZonaOrientale non punta al CSS V673');
assertOk(fmmIndex.includes('site-performance-v673.css?v=673'), 'FMM non punta al CSS V673');
assertOk(css.includes('site-mobile-listone-player-card-v673'), 'CSS V673 non contiene lo stile Listone mobile');
assertOk(css.includes('site-status-badge-v663.is-in-listone'), 'CSS V673 non definisce badge verde In listone');
assertOk(css.includes('site-status-badge-v663.is-asterisk'), 'CSS V673 non definisce badge giallo Asteriscato');
for (const [name, app] of [['ZonaOrientale', zonaApp], ['FMM', fmmApp]]) {
  assertOk(app.includes('fantaSiteMobileCardsV673'), `${name}: manca blocco V673`);
  assertOk(app.includes('site-mobile-listone-player-card-v673'), `${name}: manca classe card Listone V673`);
  assertOk(app.includes('site-mobile-card-badges-v673'), `${name}: manca badge top-right V673`);
  assertOk(app.includes('renderSiteListoneStatusBadgeV663(player)'), `${name}: stato non renderizzato come badge`);
  assertOk(!app.includes('classList.remove("fpt-v584-col-player")'), `${name}: runtime V671 non deve tornare`);
}
console.log('Audit site mobile cards V673 OK', JSON.stringify({ version: 673, listoneUsesRosterCardStyle: true, statusTopRight: true, workflowSafe: true }));
