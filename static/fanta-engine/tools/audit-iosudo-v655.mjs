import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/sudatori-data.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/manifest.json', 'utf8'));
const app = fs.readFileSync('static/fanta-engine/js/apps/iosudo-app-v655.js', 'utf8');
const index = fs.readFileSync('static/iosudo/index.html', 'utf8');
const sw = fs.readFileSync('static/iosudo/sw.js', 'utf8');
function assert(cond, msg) { if (!cond) { throw new Error(msg); } }
const players = Object.values(data.playersByTeam || {}).reduce((n, arr) => n + arr.length, 0);
const talks = Object.values(data.teamTransferTalksByTeam || {}).reduce((n, arr) => n + arr.length, 0);
const official = Object.values(data.officialMovesByTeam || {}).reduce((n, obj) => n + (obj.incoming || []).length + (obj.outgoing || []).length, 0);
const friendlies = Object.values(data.friendliesByTeam || {}).reduce((n, arr) => n + arr.length, 0);
assert(index.includes('iosudo-app-v655.js?v=655'), 'index non punta alla shell V655');
assert(sw.includes('iosudo-shell-v655'), 'service worker non aggiornato a V655');
assert(manifest.uiVersion === 655, 'manifest uiVersion non V655');
assert(manifest.players === players, 'conteggio giocatori manifest non allineato');
assert(manifest.teamTransferTalks === talks, 'conteggio trattative manifest non allineato');
assert(manifest.officialMoves === official, 'conteggio ufficialita manifest non allineato');
assert(manifest.friendlies === friendlies, 'conteggio amichevoli manifest non allineato');
assert(data.rulesPlayersV655 && data.rulesPlayersV655.marketOnlyPlayersInGlobalPlayers === false, 'regola GIOCATORI solo-rumor non impostata');
assert(app.includes('// addMarketOnlyPlayersToFastRows(rows, seen);'), 'i giocatori solo-rumor risultano ancora materializzati in GIOCATORI');
assert(!/^[ \t]*addMarketOnlyPlayersToFastRows\(rows, seen\);/m.test(app), 'addMarketOnlyPlayersToFastRows ancora attiva in GIOCATORI');
assert((data.updateLogV655 || []).length >= 1, 'updateLogV655 mancante');
console.log('Audit ioSudo V655 OK', JSON.stringify({ players, talks, official, friendlies, updateRows: data.updateLogV655.length, marketOnlyPlayersInGlobalPlayers: false }));
