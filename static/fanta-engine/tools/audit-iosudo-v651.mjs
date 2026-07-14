import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = read('static/fanta-engine/js/apps/iosudo-app-v651.js');
const css = read('static/fanta-engine/css/iosudo-app-v651.css');
const html = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

assert(html.includes('data-iosudo-version="651"'), 'index non punta a data-iosudo-version 651');
assert(html.includes('iosudo-app-v651.css?v=651'), 'index non carica CSS v651');
assert(html.includes('iosudo-app-v651.js?v=651'), 'index non carica JS v651');
assert(sw.includes("iosudo-shell-v651"), 'service worker cache non aggiornata a v651');
assert(sw.includes('iosudo-app-v651.css?v=651'), 'service worker non precache CSS v651');
assert(sw.includes('iosudo-app-v651.js?v=651'), 'service worker non precache JS v651');
assert(app.includes('fastPlayerRowsCache'), 'manca cache compatta GIOCATORI V651');
assert(app.includes('collectFastPlayerRows'), 'manca collector compatto GIOCATORI V651');
assert(app.includes('_iosudoFastPlayerRow'), 'manca flag righe compatte GIOCATORI');
assert(app.includes('compactSourcesHtml'), 'manca rendering fonti compatto per mercato');
assert(app.includes('iosudo-market-row-compact'), 'manca classe righe mercato compatte');
assert(app.includes("if (view === 'players') return 36"), 'limite iniziale GIOCATORI non ridotto a 36');
assert(app.includes("if (view === 'rumor' || view === 'official') return 40"), 'limite iniziale RUMOR/UFFICIALITA non ridotto a 40');
assert(app.includes('data-iosudo-more'), 'manca pulsante Mostra altre voci');
assert(app.includes('function bindTeamPanel() {\n    // V651'), 'bindTeamPanel non e delegato/noop V651');
assert(app.includes('function bindPlayerDetail() {\n    // V651'), 'bindPlayerDetail non e delegato/noop V651');
assert(app.includes("state.quickView === 'players' ? 140 : 70"), 'debounce V651 non trovato');
assert(css.includes('content-visibility: auto'), 'CSS content-visibility non trovato');
assert(css.includes('iosudo-source-more'), 'CSS fonti compatte non trovato');
assert(sw.includes("event.request.mode === 'navigate'"), 'service worker non usa network-first sulla shell');

console.log('Audit ioSudo V651 OK', JSON.stringify({
  version: 651,
  fastPlayers: true,
  compactMarketRows: true,
  progressiveLists: true,
  delegatedFocus: true,
  contentVisibility: true,
  shellNetworkFirst: true
}));
