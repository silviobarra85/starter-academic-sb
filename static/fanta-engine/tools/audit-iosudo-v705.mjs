import fs from 'node:fs';

function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const index = fs.readFileSync('static/iosudo/index.html', 'utf8');
const sw = fs.readFileSync('static/iosudo/sw.js', 'utf8');
const js = fs.readFileSync('static/fanta-engine/js/apps/iosudo-app-v705.js', 'utf8');
const manifest = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/manifest.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/sudatori-data.json', 'utf8'));

assertOk(index.includes('iosudo-app-v705.js?v=705'), 'index non punta al JS V705');
assertOk(index.includes('iosudo-app-v705.css?v=705'), 'index non punta al CSS V705');
assertOk(sw.includes('iosudo-shell-v705'), 'service worker non usa cache V705');
assertOk(sw.includes('iosudo-app-v705.js?v=705'), 'service worker non cachea JS V705');
assertOk(manifest.version === 'V705', 'manifest non aggiornato a V705');
assertOk(Boolean(manifest.updatedAtTime), 'manifest senza updatedAtTime');
assertOk((data.teams || []).length === 20, 'teams non sono 20');
assertOk(Object.keys(data.playersByTeam || {}).length === 20, 'playersByTeam incompleto');
assertOk(js.includes('function teamCounters(teamId, summary)'), 'fix contatori V703 assente');
assertOk(js.includes('function teamFormationMeta(teamId)'), 'fix modulo/allenatore V702 assente');

const seen = new Set();
const exactDuplicates = [];
for (const [teamId, rows] of Object.entries(data.playersByTeam || {})) {
  for (const p of rows || []) {
    const key = [teamId, String(p.playerName || '').toLowerCase().trim(), String(p.role || '').toUpperCase().slice(0,1)].join('::');
    if (seen.has(key)) exactDuplicates.push(key);
    seen.add(key);
  }
}
assertOk(exactDuplicates.length === 0, 'duplicati esatti in playersByTeam: ' + exactDuplicates.slice(0, 5).join(', '));
assertOk(manifest.dedupVersion && manifest.dedupVersion.includes('V705'), 'dedupVersion non aggiornata a V705');
console.log('Audit ioSudo V705 OK', JSON.stringify({players: manifest.players, talks: manifest.teamTransferTalks, official: manifest.officialMoves, friendlies: manifest.friendlies, injuries: manifest.injuries, duplicateExact: 0}));
