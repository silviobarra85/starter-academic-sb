import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const app = read('static/fanta-engine/js/apps/iosudo-app-v669.js');
const manifest = JSON.parse(read('static/fanta-engine/data/sudatori/current/manifest.json'));
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
function assertOk(condition, message) { if (!condition) throw new Error(message); }
assertOk(index.includes('iosudo-app-v669.js?v=669'), 'index non punta al JS V669');
assertOk(index.includes('iosudo-app-v669.css?v=669'), 'index non punta al CSS V669');
assertOk(index.includes('data-iosudo-version="669"'), 'data-iosudo-version non aggiornato a 669');
assertOk(sw.includes('iosudo-shell-v669'), 'service worker non usa cache V669');
assertOk(String(manifest.uiVersion) === '669', 'manifest uiVersion non aggiornato');
assertOk(String(data.meta.uiVersion) === '669', 'data meta uiVersion non aggiornato');
assertOk(manifest.dataFile === 'sudatori-data.json', 'manifest dataFile mancante');
assertOk(manifest.players === 714, 'conteggio giocatori inatteso');
assertOk(manifest.friendlies === 90, 'conteggio amichevoli inatteso');
assertOk(manifest.teamTransferTalks === 420, 'conteggio trattative inatteso');
assertOk(manifest.officialMoves === 296, 'conteggio ufficialita inatteso');
assertOk(manifest.injuries === 11, 'conteggio SOS inatteso');
assertOk(app.includes('addMarketOnlyPlayersToFastRows(rows, seen);') === false || app.includes('// addMarketOnlyPlayersToFastRows(rows, seen);'), 'GIOCATORI include ancora market-only player');
assertOk(app.includes('formatDateTime'), 'header data/ora non preservato');
console.log('Audit ioSudo V669 OK', JSON.stringify({version:669, players:manifest.players, talks:manifest.teamTransferTalks, official:manifest.officialMoves, friendlies:manifest.friendlies, injuries:manifest.injuries, headerDateTime:true}));
