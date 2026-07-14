import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = read('static/fanta-engine/js/apps/iosudo-app-v652.js');
const css = read('static/fanta-engine/css/iosudo-app-v652.css');
const html = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

assert(html.includes('data-iosudo-version="652"'), 'index non punta a data-iosudo-version 652');
assert(html.includes('iosudo-app-v652.css?v=652'), 'index non carica CSS v652');
assert(html.includes('iosudo-app-v652.js?v=652'), 'index non carica JS v652');
assert(sw.includes("iosudo-shell-v652"), 'service worker cache non aggiornata a v652');
assert(sw.includes('iosudo-app-v652.css?v=652'), 'service worker non precache CSS v652');
assert(sw.includes('iosudo-app-v652.js?v=652'), 'service worker non precache JS v652');
assert(app.includes('fastPlayerRowsCache'), 'manca cache compatta GIOCATORI V652');
assert(app.includes('collectFastPlayerRows'), 'manca collector compatto GIOCATORI V652');
assert(app.includes('_iosudoFastPlayerRow'), 'manca flag righe compatte GIOCATORI');
assert(app.includes('compactSourcesHtml'), 'manca rendering fonti compatto per mercato');
assert(app.includes('iosudo-market-row-compact'), 'manca classe righe mercato compatte');
assert(app.includes("if (view === 'players') return 36"), 'limite iniziale GIOCATORI non ridotto a 36');
assert(app.includes("if (view === 'rumor' || view === 'official') return 40"), 'limite iniziale RUMOR/UFFICIALITA non ridotto a 40');
assert(app.includes('data-iosudo-more'), 'manca pulsante Mostra altre voci');
assert(app.includes('function bindTeamPanel() {\n    // V652'), 'bindTeamPanel non e delegato/noop V652');
assert(app.includes('playerDetailCache: new Map()'), 'manca cache dettaglio giocatore V652');
assert(app.includes('playerMarketRowsCache: new Map()'), 'manca cache righe mercato per giocatore V652');
assert(app.includes('marketRowsForKnownPlayer'), 'manca filtro leggero righe mercato per dettaglio giocatore');
assert(app.includes('playerDetailModel'), 'manca modello cache dettaglio giocatore');
assert(app.includes('function bindPlayerDetail() {\n    // V652'), 'bindPlayerDetail non e delegato/noop V652');
assert(app.includes("state.quickView === 'players' ? 140 : 70"), 'debounce V652 non trovato');
assert(css.includes('content-visibility: auto'), 'CSS content-visibility non trovato');
assert(css.includes('iosudo-source-more'), 'CSS fonti compatte non trovato');
assert(sw.includes("event.request.mode === 'navigate'"), 'service worker non usa network-first sulla shell');

console.log('Audit ioSudo V652 OK', JSON.stringify({
  version: 652,
  fastPlayers: true,
  compactMarketRows: true,
  progressiveLists: true,
  delegatedFocus: true,
  fastPlayerDetail: true,
  contentVisibility: true,
  shellNetworkFirst: true
}));
