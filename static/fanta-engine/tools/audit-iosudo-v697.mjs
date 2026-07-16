import fs from 'node:fs';

function assertOk(condition, message) { if (!condition) throw new Error(message); }
const manifest = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/manifest.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/sudatori-data.json', 'utf8'));
const index = fs.readFileSync('static/iosudo/index.html', 'utf8');
const sw = fs.readFileSync('static/iosudo/sw.js', 'utf8');
assertOk(manifest.uiVersion === 697, 'manifest uiVersion non e V697');
assertOk(manifest.version === 'V697', 'manifest version non e V697');
assertOk(index.includes('iosudo-app-v697.js?v=697'), 'index non punta al JS V697');
assertOk(index.includes('iosudo-app-v697.css?v=697'), 'index non punta al CSS V697');
assertOk(index.includes('data-iosudo-version="697"'), 'index data-iosudo-version non e 697');
assertOk(sw.includes('iosudo-shell-v697'), 'service worker cache non e V697');
assertOk(Array.isArray(data.teams) && data.teams.length === 20, 'teams non sono 20');
assertOk(data.playersByTeam && Object.keys(data.playersByTeam).length === 20, 'playersByTeam incompleto');
const players = Object.values(data.playersByTeam).flat();
assertOk(players.length === manifest.players, 'conteggio players manifest non allineato');
assertOk(players.length > 700, 'troppi pochi giocatori');
const playerKeys = new Set();
let dupes = [];
for (const p of players) {
  const role = String(p.role || '').charAt(0).toUpperCase();
  const team = String(p.teamId || '').toLowerCase();
  const name = String(p.playerName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  const key = team + '|' + role + '|' + name;
  if (playerKeys.has(key)) dupes.push(key);
  playerKeys.add(key);
}
assertOk(dupes.length === 0, 'duplicati esatti in playersByTeam: ' + dupes.slice(0,10).join(', '));
assertOk(data.rulesPlayersV697 && String(data.rulesPlayersV697).includes('deduplica'), 'regole dedup V697 mancanti');
assertOk(manifest.updatedAtTime && manifest.updatedAtTime.includes('T'), 'updatedAtTime manca nell header dati');
console.log('Audit ioSudo V697 OK', JSON.stringify({players: manifest.players, talks: manifest.teamTransferTalks, official: manifest.officialMoves, friendlies: manifest.friendlies, sources: manifest.sources, dedup: true}));
