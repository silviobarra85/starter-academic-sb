import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = read('static/fanta-engine/js/apps/iosudo-app-v650.js');
const css = read('static/fanta-engine/css/iosudo-app-v650.css');
const html = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

assert(html.includes('data-iosudo-version="650"'), 'index non punta a data-iosudo-version 650');
assert(html.includes('iosudo-app-v650.css?v=650'), 'index non carica CSS v650');
assert(html.includes('iosudo-app-v650.js?v=650'), 'index non carica JS v650');
assert(sw.includes("iosudo-shell-v650"), 'service worker cache non aggiornata a v650');
assert(sw.includes('iosudo-app-v650.css?v=650'), 'service worker non precache CSS v650');
assert(sw.includes('iosudo-app-v650.js?v=650'), 'service worker non precache JS v650');
assert(app.includes('globalRowsCache'), 'manca cache righe globali');
assert(app.includes('visibleCaps'), 'manca limite progressivo righe visibili');
assert(app.includes('data-iosudo-more'), 'manca pulsante Mostra altre voci');
assert(app.includes('handleFocusClick'), 'manca handler delegato focus');
assert(app.includes('function bindTeamPanel() {\n    // V650'), 'bindTeamPanel non e delegato/noop V650');
assert(app.includes('function bindPlayerDetail() {\n    // V650'), 'bindPlayerDetail non e delegato/noop V650');
assert(app.includes("state.quickView === 'players' ? 220 : 90"), 'debounce V650 non trovato');
assert(css.includes('content-visibility: auto'), 'CSS content-visibility non trovato');
assert(css.includes('iosudo-more-button'), 'CSS mostra altre voci non trovato');
assert(sw.includes("event.request.mode === 'navigate'"), 'service worker non usa network-first sulla shell');

console.log('Audit ioSudo V650 OK', JSON.stringify({
  version: 650,
  globalRowsCache: true,
  progressiveLists: true,
  delegatedFocus: true,
  contentVisibility: true,
  shellNetworkFirst: true
}));
