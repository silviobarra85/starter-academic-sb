import fs from 'node:fs';

function read(path) { return fs.readFileSync(path, 'utf8'); }
function assert(condition, message) { if (!condition) throw new Error(message); }
function json(path) { return JSON.parse(read(path)); }

const app = read('static/fanta-engine/js/apps/iosudo-app-v654.js');
const css = read('static/fanta-engine/css/iosudo-app-v654.css');
const html = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');

assert(html.includes('data-iosudo-version="654"'), 'index non punta a data-iosudo-version 654');
assert(html.includes('iosudo-app-v654.css?v=654'), 'index non carica CSS v654');
assert(html.includes('iosudo-app-v654.js?v=654'), 'index non carica JS v654');
assert(sw.includes('iosudo-shell-v654'), 'service worker cache non aggiornata a v654');
assert(app.includes('Gianluca Di Marzio'), 'manca label compatta Gianluca Di Marzio');
assert(app.includes('compactHostname'), 'manca fallback compatto hostname');
assert(app.includes('playerDetailCache: new Map()'), 'cache dettaglio giocatore V652/V653 assente');
assert(app.includes('addMarketOnlyPlayersToFastRows'), 'inclusione giocatori solo rumor assente');
assert(css.includes('text-overflow:ellipsis'), 'CSS fonte compatta mancante');
assert(manifest.version === 'V654', 'manifest non V654');
assert(data.meta.version === 'V654', 'data meta non V654');
assert((data.teamTransferTalksByTeam.roma || []).some(x => /Summerville/i.test(x.playerName || '')), 'Summerville non presente nei rumor Roma');
assert((data.teamTransferTalksByTeam.roma || []).some(x => /Garnacho/i.test(x.playerName || '')), 'Garnacho non presente nei rumor Roma');
assert((data.teamTransferTalksByTeam.inter || []).some(x => /Djed Spence/i.test(x.playerName || '')), 'Djed Spence non presente nei rumor Inter');
const longLabels = [];
Object.values(data.teamTransferTalksByTeam).flat().forEach(x => {
  if (/^https?:\/\//i.test(String(x.sourceName || x.sourceLabel || ''))) longLabels.push(x.playerName);
});
assert(longLabels.length === 0, 'sourceName/sourceLabel contiene ancora URL lunghi: ' + longLabels.slice(0,5).join(', '));
console.log('Audit ioSudo V654 OK', JSON.stringify({
  version: 654,
  players: manifest.players,
  talks: manifest.teamTransferTalks,
  officialMoves: manifest.officialMoves,
  friendlies: manifest.friendlies,
  extraRows: manifest.extraUpdateRowsV654,
  compactSources: true
}));
