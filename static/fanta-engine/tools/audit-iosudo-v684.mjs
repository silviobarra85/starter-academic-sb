import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const app = read('static/fanta-engine/js/apps/iosudo-app-v684.js');
const manifest = JSON.parse(read('static/fanta-engine/data/sudatori/current/manifest.json'));
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
function assertOk(condition, message) { if (!condition) throw new Error(message); }
assertOk(index.includes('iosudo-app-v684.js?v=684'), 'index non punta al JS V684');
assertOk(index.includes('iosudo-app-v684.css?v=684'), 'index non punta al CSS V684');
assertOk(index.includes('data-iosudo-version="684"'), 'data-iosudo-version non aggiornato a 684');
assertOk(sw.includes('iosudo-shell-v684'), 'service worker non usa cache V684');
assertOk(String(manifest.uiVersion) === '684', 'manifest uiVersion non aggiornato');
assertOk(String(data.meta.uiVersion) === '684', 'data meta uiVersion non aggiornato');
assertOk(manifest.dataFile === 'sudatori-data.json', 'manifest dataFile mancante');
assertOk(manifest.players === 714, 'conteggio giocatori inatteso');
assertOk(manifest.friendlies === 91, 'conteggio amichevoli inatteso');
assertOk(manifest.teamTransferTalks === 540, 'conteggio trattative inatteso');
assertOk(manifest.officialMoves === 303, 'conteggio ufficialita inatteso');
assertOk(manifest.injuries === 16, 'conteggio SOS inatteso');
assertOk(manifest.sources === 361, 'conteggio fonti inatteso');
assertOk(Array.isArray(data.updateLogV684) && data.updateLogV684.length === 19, 'updateLogV684 non coerente');
assertOk(app.includes('addMarketOnlyPlayersToFastRows(rows, seen);') === false || app.includes('// addMarketOnlyPlayersToFastRows(rows, seen);'), 'GIOCATORI include ancora market-only player');
assertOk(app.includes('formatDateTime'), 'header data/ora non preservato');
assertOk(app.includes('groupedMarketRows(kind)'), 'raggruppamento mercato globale mancante');
assertOk(app.includes('renderTeamMarketPanel(team, summary)'), 'mercato squadra richiudibile mancante');
assertOk(app.includes('renderMarketSubsection') && app.includes('TRATTATIVE IN USCITA'), 'sottosezioni mercato squadra non aggiornate');
console.log('Audit ioSudo V684 OK', JSON.stringify({version:684, players:manifest.players, talks:manifest.teamTransferTalks, official:manifest.officialMoves, friendlies:manifest.friendlies, injuries:manifest.injuries, sources:manifest.sources, updateRows:data.updateLogV684.length}));
