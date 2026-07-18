import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync(new URL('../data/sudatori/current/sudatori-data.json', import.meta.url), 'utf8'));
const meta = data.meta || {};
const fail = (msg) => { console.error('Audit ioSudo V727 FAIL:', msg); process.exit(1); };
if (meta.version !== 'V727') fail(`version ${meta.version}`);
const arrs = (key) => Object.values(data[key] || {}).flatMap(v => Array.isArray(v) ? v : []);
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const players = arrs('playersByTeam');
const ids = players.map(p => p.id).filter(Boolean);
if (new Set(ids).size !== ids.length) fail('ID giocatori duplicati');
if (meta.players !== 1036) fail(`conteggio giocatori atteso 1036, trovato ${meta.players}`);
if ((data.officialityControlV727?.activeOfficialRumors ?? meta.activeOfficialRumors) !== 0) fail('rumor attivi su ufficialita');
for (const n of ['tommaso ebone','davide veroli','jacopo fazzini','adrian lahdo','pietro comuzzo','robin gosens','jonas harder','amir richardson','federico dimarco','benjamin pavard']) {
  if (!players.some(p => norm(p.playerName) === n)) fail(`${n} non normalizzato`);
}
for (const n of ['justin oboavwoduo','adin licina','augusto owusu']) {
  const p = players.find(p => p.teamId === 'juventus' && norm(p.playerName) === n);
  if (!p || !p.nonActiveSlot) fail(`${n} Juventus Next Gen/non-slot mancante`);
}
const basilea = (data.friendliesByTeam?.juventus || []).find(x => norm(x.event || x.playerName).includes('basilea juventus'));
if (!basilea || !norm(basilea.status).includes('tabellino ufficiale')) fail('Basilea-Juventus non aggiornata a tabellino ufficiale v86');
if (!data.friendlyPlayerStatsByMatch?.['juventus 2026 07 18 basilea juventus']) fail('tabellino Juventus-Basilea mancante');
const juveStats = data.friendlyPlayerStatsByMatch['juventus 2026 07 18 basilea juventus'].players || [];
if (juveStats.length !== 23) fail(`righe tabellino Juventus attese 23, trovate ${juveStats.length}`);
if (!juveStats.some(x => norm(x.playerName)==='jeff ekhator' && String(x.injuryGame || '').includes('SI'))) fail('Ekhator non segnato INF gara nel tabellino Juventus');
if (!data.friendlyPlayerStatsByMatch?.['bologna 2026 07 18 bologna arminia bielefeld']) fail('tabellino Bologna-Arminia mancante');
if (!data.friendlyPlayerStatsByMatch?.['sassuolo 2026 07 16 sassuolo alta anaunia']) fail('tabellino Sassuolo-Alta Anaunia mancante');
console.log('Audit ioSudo V727 OK');
console.log(JSON.stringify({ version: meta.version, players: meta.players, playersRows: meta.playersRows, officialMoves: meta.officialMoves, teamTransferTalks: meta.teamTransferTalks, injuries: meta.injuries, friendlies: meta.friendlies, friendlyMatchDetails: meta.friendlyMatchDetails, friendlyPlayerStats: meta.friendlyPlayerStats, sources: meta.sources }, null, 2));
