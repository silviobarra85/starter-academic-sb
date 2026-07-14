import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const app = read('static/fanta-engine/js/apps/iosudo-app-v658.js');
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

assertOk(index.includes('iosudo-app-v658.js?v=658'), 'index non punta al JS V658');
assertOk(index.includes('iosudo-app-v658.css?v=658'), 'index non punta al CSS V658');
assertOk(index.includes('data-iosudo-version="658"'), 'data-iosudo-version non aggiornato a 658');
assertOk(sw.includes("iosudo-shell-v658"), 'service worker non aggiornato a v658');
assertOk(sw.includes('iosudo-app-v658.js?v=658'), 'service worker non contiene JS V658');
assertOk(app.includes('function restoreScrollPosition'), 'manca restoreScrollPosition');
assertOk(app.includes('const y = window.pageYOffset'), 'manca salvataggio scroll su Mostra altre voci');
assertOk(app.includes('restoreScrollPosition(y)'), 'manca ripristino scroll su Mostra altre voci');
assertOk(app.includes('function liveSummaryCount'), 'manca liveSummaryCount');
assertOk(app.includes("key === 'players'") && app.includes('playerRowsForView().length'), 'conteggio Giocatori non allineato alla vista');
assertOk(app.includes("key === 'friendlies'") && app.includes('collectFriendlyRows'), 'conteggio Amichevoli non allineato alla vista filtrata');

console.log('Audit ioSudo V658 OK', JSON.stringify({ version: 658, preserveScroll: true, summaryCountsAligned: true }));
