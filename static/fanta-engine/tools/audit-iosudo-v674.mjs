import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const app = read('static/fanta-engine/js/apps/iosudo-app-v674.js');
const manifest = JSON.parse(read('static/fanta-engine/data/sudatori/current/manifest.json'));
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
function assertOk(condition, message) { if (!condition) throw new Error(message); }
assertOk(index.includes('iosudo-app-v674.js?v=674'), 'index non punta al JS V674');
assertOk(index.includes('iosudo-app-v674.css?v=674'), 'index non punta al CSS V674');
assertOk(index.includes('data-iosudo-version="674"'), 'data-iosudo-version non aggiornato a 674');
assertOk(sw.includes('iosudo-shell-v674'), 'service worker non usa cache V674');
assertOk(String(manifest.uiVersion) === '674', 'manifest uiVersion non aggiornato');
assertOk(String(data.meta.uiVersion) === '674', 'data meta uiVersion non aggiornato');
assertOk(manifest.dataFile === 'sudatori-data.json', 'manifest dataFile mancante');
assertOk(manifest.players === 714, 'conteggio giocatori inatteso');
assertOk(manifest.friendlies === 90, 'conteggio amichevoli inatteso');
assertOk(manifest.teamTransferTalks === 468, 'conteggio trattative inatteso');
assertOk(manifest.officialMoves === 298, 'conteggio ufficialita inatteso');
assertOk(manifest.injuries === 12, 'conteggio SOS inatteso');
assertOk(manifest.sources === 300, 'conteggio fonti inatteso');
assertOk(app.includes('addMarketOnlyPlayersToFastRows(rows, seen);') === false || app.includes('// addMarketOnlyPlayersToFastRows(rows, seen);'), 'GIOCATORI include ancora market-only player');
assertOk(app.includes('formatDateTime'), 'header data/ora non preservato');
console.log('Audit ioSudo V674 OK', JSON.stringify({version:674, players:manifest.players, talks:manifest.teamTransferTalks, official:manifest.officialMoves, friendlies:manifest.friendlies, injuries:manifest.injuries, sources:manifest.sources, headerDateTime:true}));
