import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const app = read('static/fanta-engine/js/apps/iosudo-app-v683.js');
const manifest = JSON.parse(read('static/fanta-engine/data/sudatori/current/manifest.json'));
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
function assertOk(condition, message) { if (!condition) throw new Error(message); }
assertOk(index.includes('iosudo-app-v683.js?v=683'), 'index non punta al JS V683');
assertOk(index.includes('iosudo-app-v683.css?v=683'), 'index non punta al CSS V683');
assertOk(index.includes('data-iosudo-version="683"'), 'data-iosudo-version non aggiornato a 683');
assertOk(sw.includes('iosudo-shell-v683'), 'service worker non usa cache V683');
assertOk(String(manifest.uiVersion) === '683', 'manifest uiVersion non aggiornato');
assertOk(String(data.meta.uiVersion) === '683', 'data meta uiVersion non aggiornato');
assertOk(manifest.dataFile === 'sudatori-data.json', 'manifest dataFile mancante');
assertOk(manifest.players === 714, 'conteggio giocatori inatteso');
assertOk(manifest.friendlies === 91, 'conteggio amichevoli inatteso');
assertOk(manifest.teamTransferTalks === 527, 'conteggio trattative inatteso');
assertOk(manifest.officialMoves === 300, 'conteggio ufficialita inatteso');
assertOk(manifest.injuries === 16, 'conteggio SOS inatteso');
assertOk(manifest.sources === 349, 'conteggio fonti inatteso');
assertOk(Array.isArray(data.updateLogV683) && data.updateLogV683.length === 16, 'updateLogV683 non coerente');
assertOk(app.includes('addMarketOnlyPlayersToFastRows(rows, seen);') === false || app.includes('// addMarketOnlyPlayersToFastRows(rows, seen);'), 'GIOCATORI include ancora market-only player');
assertOk(app.includes('formatDateTime'), 'header data/ora non preservato');
assertOk(app.includes('groupedMarketRows(kind)'), 'raggruppamento mercato globale mancante');
assertOk(app.includes('renderTeamMarketPanel(team, summary)'), 'mercato squadra richiudibile mancante');
assertOk(app.includes('renderMarketSubsection') && app.includes('TRATTATIVE IN USCITA'), 'sottosezioni mercato squadra non aggiornate');
console.log('Audit ioSudo V683 OK', JSON.stringify({version:683, players:manifest.players, talks:manifest.teamTransferTalks, official:manifest.officialMoves, friendlies:manifest.friendlies, injuries:manifest.injuries, sources:manifest.sources, updateRows:data.updateLogV683.length}));
