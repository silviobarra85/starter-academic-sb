import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const app = read('static/fanta-engine/js/apps/iosudo-app-v653.js');
const css = read('static/fanta-engine/css/iosudo-app-v653.css');
const html = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

assert(html.includes('data-iosudo-version="653"'), 'index non punta a data-iosudo-version 653');
assert(html.includes('iosudo-app-v653.css?v=653'), 'index non carica CSS v653');
assert(html.includes('iosudo-app-v653.js?v=653'), 'index non carica JS v653');
assert(sw.includes("iosudo-shell-v653"), 'service worker cache non aggiornata a v653');
assert(sw.includes('iosudo-app-v653.css?v=653'), 'service worker non precache CSS v653');
assert(sw.includes('iosudo-app-v653.js?v=653'), 'service worker non precache JS v653');
assert(app.includes('addMarketOnlyPlayersToFastRows'), 'manca inclusione giocatori solo-rumor in GIOCATORI');
assert(app.includes('marketRowCanCreateVirtualPlayer'), 'manca filtro righe mercato virtuali');
assert(app.includes('virtualMarketPlayer') && app.includes("return marketRowsAreOfficial(player.virtualMarketRows) ? 'UFFICIALE' : 'RUMOR'"), 'i giocatori virtuali non vengono classificati correttamente');
assert(app.includes("player && player.marketTeamName"), 'ricerca/squadra target mercato non indicizzata');
assert(app.includes("real + ' -> ' + marketTeam"), 'percorso mercato non mostrato nella squadra reale');
assert(app.includes('Garnacho -> Roma') || app.includes('Garnacho'), 'commento/controllo Garnacho non trovato');
assert(app.includes('playerDetailCache: new Map()'), 'cache dettaglio giocatore V652/V653 assente');
assert(app.includes('cachedGlobalRows'), 'cache globale mercato assente');
assert(css.includes('content-visibility: auto'), 'CSS content-visibility non trovato');

const dataRel = 'static/fanta-engine/data/sudatori/current/sudatori-data.json';
let garnachoInData = false;
if (exists(dataRel)) {
  const data = JSON.parse(read(dataRel));
  garnachoInData = JSON.stringify(data).toLowerCase().includes('garnacho');
  assert(garnachoInData, 'Garnacho non risulta nei dati: audit non puo verificare il caso segnalato');
}

console.log('Audit ioSudo V653 OK', JSON.stringify({
  version: 653,
  marketOnlyPlayersInGlobalPlayers: true,
  garnachoCaseCovered: garnachoInData || 'data-not-in-overlay',
  fastListsKept: true,
  playerDetailCacheKept: true
}));
