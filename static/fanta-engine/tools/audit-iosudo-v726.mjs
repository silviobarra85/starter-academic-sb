import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync(new URL('../data/sudatori/current/sudatori-data.json', import.meta.url), 'utf8'));
const meta = data.meta || {};
const fail = (msg) => { console.error('Audit ioSudo V726 FAIL:', msg); process.exit(1); };
if (meta.version !== 'V726') fail(`version ${meta.version}`);
const arrs = (key) => Object.values(data[key] || {}).flatMap(v => Array.isArray(v) ? v : []);
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const players = arrs('playersByTeam');
const ids = players.map(p => p.id).filter(Boolean);
if (new Set(ids).size !== ids.length) fail('ID giocatori duplicati');
if (meta.players !== 1032) fail(`conteggio giocatori atteso 1032, trovato ${meta.players}`);
if ((data.officialityControlV726?.activeOfficialRumors ?? meta.activeOfficialRumors) !== 0) fail('rumor attivi su ufficialita');
const torinoNames = players.filter(p => p.teamId === 'torino').map(p => norm(p.playerName));
if (!torinoNames.includes('kugyela') || !torinoNames.includes('luongo')) fail('Kugyela/Luongo Torino mancanti');
const fioNames = players.filter(p => p.teamId === 'fiorentina').map(p => norm(p.playerName));
if (!fioNames.includes('albert gudmundsson')) fail('Albert Gudmundsson non normalizzato');
if (fioNames.filter(n => n === 'albert gudmundsson').length !== 1) fail('Albert Gudmundsson duplicato in Fiorentina');
for (const n of ['ange yoan bonny','gianluca scamacca','mattia zaccagni','federico gatti','teun koopmeiners','kenan yildiz','matteo politano']) {
  if (!players.some(p => norm(p.playerName) === n)) fail(`${n} non normalizzato`);
}
const basilea = (data.friendliesByTeam?.juventus || []).find(x => norm(x.event || x.playerName).includes('basilea juventus'));
if (!basilea || !norm(basilea.status).includes('giocata 0 0')) fail('Basilea-Juventus non aggiornata a 0-0 v84');
const torinoFriendly = (data.friendliesByTeam?.torino || []).find(x => norm(x.event || x.playerName).includes('torino pinzolo'));
if (!torinoFriendly || !norm(torinoFriendly.status).includes('formazioni ufficiali')) fail('Torino-Pinzolo non aggiornato v84');
if (!data.friendlyPlayerStatsByMatch?.['bologna 2026 07 18 bologna arminia bielefeld']) fail('tabellino Bologna-Arminia mancante');
if (!data.friendlyPlayerStatsByMatch?.['sassuolo 2026 07 16 sassuolo alta anaunia']) fail('tabellino Sassuolo-Alta Anaunia mancante');
console.log('Audit ioSudo V726 OK');
console.log(JSON.stringify({ version: meta.version, players: meta.players, playersRows: meta.playersRows, officialMoves: meta.officialMoves, teamTransferTalks: meta.teamTransferTalks, injuries: meta.injuries, friendlies: meta.friendlies, friendlyMatchDetails: meta.friendlyMatchDetails, friendlyPlayerStats: meta.friendlyPlayerStats, sources: meta.sources }, null, 2));
