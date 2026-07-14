import fs from 'node:fs';

function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const cssPath = 'static/fanta-engine/css/site-performance-v670.css';
const css = fs.readFileSync(cssPath, 'utf8');
const zonaIndex = fs.readFileSync('static/zonaorientale/index.html', 'utf8');
const fmmIndex = fs.readFileSync('static/fantapetillomantramanager/index.html', 'utf8');

assertOk(css.includes('V670 - Fix reale larghezza card mobile'), 'CSS V670 non trovato');
assertOk(css.includes('body.player-table-mobile-v584-active'), 'Override V584 non presente');
assertOk(css.includes('td.fpt-v584-col-player'), 'Neutralizzazione td.fpt-v584-col-player non presente');
assertOk(css.includes('position: static !important'), 'Sticky legacy non neutralizzato');
assertOk(css.includes('width: calc(100dvw'), 'Larghezza responsive card non impostata');
assertOk(css.includes('background: transparent !important'), 'Sfondo legacy non neutralizzato');
assertOk(zonaIndex.includes('site-performance-v670.css?v=670'), 'ZonaOrientale non punta al CSS V670');
assertOk(fmmIndex.includes('site-performance-v670.css?v=670'), 'FantaPetillo non punta al CSS V670');

console.log('Audit site mobile cards V670 OK', JSON.stringify({
  version: 670,
  fixesLegacyTd: true,
  responsiveWidth: true,
  greenBackgroundNeutralized: true,
  siteOnly: true
}));
