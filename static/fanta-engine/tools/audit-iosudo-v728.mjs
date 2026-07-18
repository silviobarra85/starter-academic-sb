import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync(new URL('../data/sudatori/current/sudatori-data.json', import.meta.url), 'utf8'));
const meta = data.meta || {};
const fail = (msg) => { console.error('Audit ioSudo V728 FAIL:', msg); process.exit(1); };
if (meta.version !== 'V728') fail(`version ${meta.version}`);
const arrs = (key) => Object.values(data[key] || {}).flatMap(v => Array.isArray(v) ? v : []);
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const players = arrs('playersByTeam');
const ids = players.map(p => p.id).filter(Boolean);
if (new Set(ids).size !== ids.length) fail('ID giocatori duplicati');
if (meta.players !== 1038) fail(`conteggio giocatori atteso 1038, trovato ${meta.players}`);
if ((data.officialityControlV728?.activeOfficialRumors ?? meta.activeOfficialRumors) !== 0) fail('rumor attivi su ufficialita');
for (const n of ['edon zhegrova','vasilije adzic','lloyd kelly','jonas rouhi','arkadiusz milik','lois openda','pierre kalulu','daniele rugani','juan cabal','fabio miretti']) {
  if (!players.some(p => norm(p.playerName) === n)) fail(`${n} non normalizzato`);
}
if (players.some(p => p.teamId === 'juventus' && norm(p.playerName) === 'zhegrova')) fail('Zhegrova generico ancora presente');
for (const n of ['pellini','carrascosa','gabellini']) {
  const p = players.find(p => p.teamId === 'torino' && norm(p.playerName) === n);
  if (!p || !p.nonActiveSlot) fail(`${n} Torino aggregato/non-slot mancante`);
}
const torino = data.friendlyPlayerStatsByMatch?.['torino 2026 07 18 torino pinzolo valrendena'];
if (!torino) fail('tabellino Torino-Pinzolo mancante');
if ((torino.players || []).length !== 22) fail(`righe Torino attese 22, trovate ${(torino.players || []).length}`);
if ((torino.totals || {}).goals !== 13) fail('gol Torino-Pinzolo attesi 13');
if (!data.friendlyPlayerStatsByMatch?.['juventus 2026 07 18 basilea juventus']) fail('tabellino Juventus-Basilea mancante');
if (!data.friendlyPlayerStatsByMatch?.['bologna 2026 07 18 bologna arminia bielefeld']) fail('tabellino Bologna-Arminia mancante');
if (!data.friendlyPlayerStatsByMatch?.['sassuolo 2026 07 16 sassuolo alta anaunia']) fail('tabellino Sassuolo-Alta Anaunia mancante');
const teamFriendlies = data.friendliesByTeam?.torino || [];
for (let i = 1; i < teamFriendlies.length; i++) {
  const a = Date.parse((teamFriendlies[i-1].date || '9999-12-31') + 'T00:00:00Z');
  const b = Date.parse((teamFriendlies[i].date || '9999-12-31') + 'T00:00:00Z');
  if (a > b) fail('amichevoli Torino non ordinate per data');
}
console.log('Audit ioSudo V728 OK');
console.log(JSON.stringify({ version: meta.version, players: meta.players, playersRows: meta.playersRows, officialMoves: meta.officialMoves, teamTransferTalks: meta.teamTransferTalks, injuries: meta.injuries, friendlies: meta.friendlies, friendlyMatchDetails: meta.friendlyMatchDetails, friendlyPlayerStats: meta.friendlyPlayerStats, sources: meta.sources }, null, 2));
