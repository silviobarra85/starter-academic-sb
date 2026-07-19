import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync(new URL('../data/sudatori/current/sudatori-data.json', import.meta.url), 'utf8'));
const meta = data.meta || {};
const fail = (msg) => { console.error('Audit ioSudo V736 FAIL:', msg); process.exit(1); };
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const arrs = (key) => Object.values(data[key] || {}).flatMap(v => Array.isArray(v) ? v : []);
const players = arrs('playersByTeam');
const ids = players.map(p => p.id).filter(Boolean);
if (meta.version !== 'V736') fail(`version ${meta.version}`);
if (new Set(ids).size !== ids.length) fail('ID giocatori duplicati');
const exactKeys = players.map(p => [p.teamId, norm(p.playerName), p.role].join('|'));
if (new Set(exactKeys).size !== exactKeys.length) fail('duplicati esatti squadra+nome+ruolo');

if (meta.overlayGeneratedAt !== '2026-07-19T14:15:00+02:00') fail('timestamp overlay mancante');
for (const n of ['gabriele calvani','seydou fini','gustav isaksen','gaetano oristanio','riccardo sottil','nicolas trabucchi','coulibaly w','giovane napoli','pessina mas','samuel chukwueze']) {
  if (!players.some(p => norm(p.playerName) === n)) fail('alias confermato mancante: ' + n);
}
const injuries = arrs('injuriesByTeam');
for (const n of ['lorenzo lucca','matteo politano','antonio vergara']) {
  if (!injuries.some(x => norm(x.playerName) === n && norm(x.teamName) === 'napoli')) fail('SOS Napoli mancante: ' + n);
}
const lazioFriendlies = (data.friendliesByTeam || {}).lazio || [];
for (const m of ['lazio lazio u20','lazio flaminia civita castellana']) {
  const row = lazioFriendlies.find(x => norm(x.event) === m);
  if (!row || row.time !== '16:00') fail('orario Lazio non corretto: ' + m);
}
if ((meta.activeOfficialRumors || 0) !== 0) fail('rumor attivi su ufficialità');
if (!Array.isArray(data.duplicatePairCandidatesV736) || data.duplicatePairCandidatesV736.length !== 10) fail('coppie candidati duplicate mancanti');
console.log('Audit ioSudo V736 OK');
console.log(JSON.stringify({ version: meta.version, players: meta.players, officialMoves: meta.officialMoves, teamTransferTalks: meta.teamTransferTalks, injuries: meta.injuries, friendlies: meta.friendlies, friendlyMatchDetails: meta.friendlyMatchDetails, friendlyPlayerStats: meta.friendlyPlayerStats, sources: meta.sources, aliasRows: meta.aliasRows, overlayGeneratedAt: meta.overlayGeneratedAt }, null, 2));
