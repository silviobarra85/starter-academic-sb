import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'static/fanta-engine/css/site-performance-v679.css',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html'
];
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function assertOk(condition, message){ if (!condition) throw new Error(message); }
for (const rel of files) assertOk(fs.existsSync(path.join(root, rel)), `File mancante: ${rel}`);
const app = read('static/zonaorientale/assets/app.js');
const css = read('static/fanta-engine/css/site-performance-v679.css');
const index = read('static/zonaorientale/index.html');
assertOk(app.includes('FantaSiteMobileCardsV679'), 'Hook V679 mancante');
assertOk(app.includes('visibleFieldsFilterRemoved: true'), 'Rimozione Campi visibili non marcata');
assertOk(app.includes('site-listone-change-corner-v679'), 'Badge modifica V679 mancante');
assertOk(app.includes('quotationDiffMantra') && app.includes('fvmMantra') && app.includes('rosterSourceV589'), 'Esclusioni richieste mancanti');
assertOk(css.includes('site-mobile-listone-player-card-v679'), 'CSS card V679 mancante');
assertOk(css.includes('font-size: clamp(.68rem'), 'Badge modifica non ingrandito');
assertOk(css.includes('#listoneColumnControls'), 'CSS per nascondere Campi visibili mancante');
assertOk(index.includes('site-performance-v679.css?v=679'), 'Index non punta al CSS V679');
console.log('Audit site mobile cards V679 OK', JSON.stringify({ version: 679, visibleFieldsFilterRemoved: true, excludedBoxes: true, largerChangeBadge: true }));
