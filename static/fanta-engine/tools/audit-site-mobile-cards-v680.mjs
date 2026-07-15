import fs from 'node:fs';

function read(file){ return fs.readFileSync(file, 'utf8'); }
function assertOk(condition, message){ if (!condition) throw new Error(message); }

const app = read('static/zonaorientale/assets/app.js');
const app2 = read('static/fantapetillomantramanager/assets/app.js');
const css = read('static/fanta-engine/css/site-performance-v680.css');
const index = read('static/zonaorientale/index.html');

for (const [name, source] of [['zonaorientale', app], ['fantapetillo', app2]]) {
  assertOk(source.includes('FantaSiteMobileCardsV680'), `${name}: manca marker V680`);
  assertOk(source.includes('listoneCostRestored: true'), `${name}: costo listone non ripristinato`);
  assertOk(source.includes('rosterMarketBoxRemoved: true'), `${name}: box mercato rose non rimossa`);
  assertOk(source.includes('rosterAllPlayersRendered: true'), `${name}: rose non tutte renderizzate`);
  assertOk(source.includes('renderRosterPlayerTableV680'), `${name}: override rose assente`);
  assertOk(source.includes('renderTeamProfileRosterCardsV680'), `${name}: override profilo rosa assente`);
}
assertOk(css.includes('site-listone-change-corner-v680'), 'CSS badge modifica V680 assente');
assertOk(css.includes('site-performance-v680') || index.includes('site-performance-v680.css?v=680'), 'index non punta al CSS V680');
assertOk(!app.includes('renderSiteMobileFixedFieldV680("Mercato"'), 'Mercato non deve essere box nelle rose');
console.log('Audit site mobile cards V680 OK');
