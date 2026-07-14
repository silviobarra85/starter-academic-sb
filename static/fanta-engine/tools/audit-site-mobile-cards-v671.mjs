import fs from 'node:fs';
function read(path){ return fs.readFileSync(path, 'utf8'); }
function assertOk(condition, message){ if (!condition) throw new Error(message); }
const css = read('static/fanta-engine/css/site-performance-v671.css');
const zonaIndex = read('static/zonaorientale/index.html');
const fmmIndex = read('static/fantapetillomantramanager/index.html');
const zonaApp = read('static/zonaorientale/assets/app.js');
const fmmApp = read('static/fantapetillomantramanager/assets/app.js');
assertOk(zonaIndex.includes('site-performance-v671.css?v=671'), 'zona index non punta a CSS V671');
assertOk(fmmIndex.includes('site-performance-v671.css?v=671'), 'fmm index non punta a CSS V671');
assertOk(css.includes('site-mobile-fullwidth-card-cell-v671'), 'CSS V671 manca cella fullwidth');
assertOk(css.includes('min(calc(100dvw - 1.25rem), 48rem)'), 'CSS V671 manca larghezza viewport');
assertOk(css.includes('tr[class*="site-mobile-card-row-v"][data-fpt-v584-role]'), 'CSS V671 manca neutralizzazione ruolo legacy');
for (const [name, app] of [['zona', zonaApp], ['fmm', fmmApp]]) {
  assertOk(app.includes('siteMobileCardsFullWidthV671'), `${name} app manca runtime V671`);
  assertOk(app.includes("cell.classList.remove('fpt-v584-col-player')"), `${name} app non rimuove classe sticky legacy`);
  assertOk(app.includes("tr.removeAttribute('data-fpt-v584-role')"), `${name} app non rimuove attributo role legacy dalla row-card`);
  assertOk(app.includes('FantaSiteMobileCardsV671'), `${name} app manca marker V671`);
}
console.log('Audit site mobile cards V671 OK', JSON.stringify({version:671, fullWidthRuntime:true, neutralizesLegacyV584:true}));
