import fs from 'node:fs';

function readJson(path) { return JSON.parse(fs.readFileSync(path, 'utf8')); }
function assertOk(condition, message) { if (!condition) throw new Error(message); }

const index = fs.readFileSync('static/iosudo/index.html', 'utf8');
assertOk(index.includes('iosudo-app-v700.js?v=700'), 'index non punta al JS V700');
assertOk(index.includes('iosudo-app-v700.css?v=700'), 'index non punta al CSS V700');
assertOk(index.includes('data-iosudo-version="700"'), 'data-iosudo-version non aggiornato a 700');
const sw = fs.readFileSync('static/iosudo/sw.js', 'utf8');
assertOk(sw.includes('iosudo-shell-v700'), 'service worker non aggiornato a V700');
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
assertOk(manifest.version === 'V700', 'manifest version non V700');
assertOk(data.meta && data.meta.version === 'V700', 'data meta version non V700');
assertOk(data.meta.updatedAtTime || data.meta.generatedAt, 'header data+ora non supportato nei dati');
assertOk(data.meta.dedupVersion && String(data.meta.dedupVersion).includes('V700'), 'dedupVersion non aggiornata');
const teamIds = Object.keys(data.playersByTeam || {});
const dupes = [];
for (const teamId of teamIds) {
  const seen = new Set();
  for (const p of data.playersByTeam[teamId] || []) {
    const key = String(p.playerName || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() + '|' + String(p.role || '');
    if (seen.has(key)) dupes.push(teamId + ':' + key);
    seen.add(key);
    if (p.sosFantaFlag) {
      const status = String(p.injuryStatus || p.physicalStatus || '').toLowerCase();
      assertOk(!/disponibile|nessuna segnalazione/.test(status), 'badge SOS improprio su ' + p.playerName);
    }
  }
}
assertOk(dupes.length === 0, 'duplicati esatti playersByTeam: ' + dupes.slice(0, 10).join(', '));
const officialMoves = Object.values(data.officialMovesByTeam || {}).flat().length;
const talks = Object.values(data.teamTransferTalksByTeam || {}).flat().length;
assertOk(officialMoves === manifest.officialMoves, 'conteggio ufficialita non allineato');
assertOk(talks === manifest.teamTransferTalks, 'conteggio rumor/trattative non allineato');
console.log('Audit ioSudo V700 OK', JSON.stringify({players: manifest.players, talks, officialMoves, friendlies: manifest.friendlies, injuries: manifest.injuries, dedup: true, updatedAtTime: manifest.updatedAtTime}));
