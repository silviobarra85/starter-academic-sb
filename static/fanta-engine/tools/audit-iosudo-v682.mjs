import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const app = read('static/fanta-engine/js/apps/iosudo-app-v682.js');
const manifest = JSON.parse(read('static/fanta-engine/data/sudatori/current/manifest.json'));
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
function assertOk(condition, message) { if (!condition) throw new Error(message); }
assertOk(index.includes('iosudo-app-v682.js?v=682'), 'index non punta al JS V682');
assertOk(index.includes('iosudo-app-v682.css?v=682'), 'index non punta al CSS V682');
assertOk(index.includes('data-iosudo-version="682"'), 'data-iosudo-version non aggiornato a 682');
assertOk(sw.includes('iosudo-shell-v682'), 'service worker non usa cache V682');
assertOk(String(manifest.uiVersion) === '682', 'manifest uiVersion non aggiornato');
assertOk(String(data.meta.uiVersion) === '682', 'data meta uiVersion non aggiornato');
assertOk(manifest.dataFile === 'sudatori-data.json', 'manifest dataFile mancante');
assertOk(manifest.players === 714, 'conteggio giocatori inatteso');
assertOk(manifest.friendlies === 90, 'conteggio amichevoli inatteso');
assertOk(manifest.teamTransferTalks === 484, 'conteggio trattative inatteso');
assertOk(manifest.officialMoves === 299, 'conteggio ufficialita inatteso');
assertOk(manifest.injuries === 14, 'conteggio SOS inatteso');
assertOk(manifest.sources === 318, 'conteggio fonti inatteso');
assertOk(app.includes('addMarketOnlyPlayersToFastRows(rows, seen);') === false || app.includes('// addMarketOnlyPlayersToFastRows(rows, seen);'), 'GIOCATORI include ancora market-only player');
assertOk(app.includes('formatDateTime'), 'header data/ora non preservato');
assertOk(app.includes('groupedMarketRows(kind)'), 'raggruppamento mercato globale mancante');
assertOk(app.includes('renderTeamMarketPanel(team, summary)'), 'mercato squadra richiudibile mancante');
assertOk(app.includes('renderMarketSubsection') && app.includes('TRATTATIVE IN USCITA'), 'sottosezioni mercato squadra non aggiornate');
console.log('Audit ioSudo V682 OK', JSON.stringify({version:682, players:manifest.players, talks:manifest.teamTransferTalks, official:manifest.officialMoves, friendlies:manifest.friendlies, injuries:manifest.injuries, sources:manifest.sources, headerDateTime:true, groupedMarketCards:true}));
