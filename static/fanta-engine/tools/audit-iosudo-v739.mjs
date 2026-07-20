import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync(new URL('../data/sudatori/current/sudatori-data.json', import.meta.url), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(new URL('../data/sudatori/current/manifest.json', import.meta.url), 'utf8'));
const players = Object.values(data.playersByTeam || {}).flat();
const ids = new Map();
const exact = new Map();
for (const p of players) {
  ids.set(p.id, (ids.get(p.id)||0)+1);
  const k = `${p.teamName}|${p.playerName}|${p.role||''}`;
  exact.set(k, (exact.get(k)||0)+1);
}
const idDup = [...ids.entries()].filter(([,n])=>n>1);
const exactDup = [...exact.entries()].filter(([,n])=>n>1);
const talks = Object.values(data.teamTransferTalksByTeam || {}).flat();
const officials = new Set(Object.values(data.officialMovesByTeam || {}).flat().map(x => String(x.playerName||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')));
const activeOfficialRumors = talks.filter(x => officials.has(String(x.playerName||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')));
const stats = Object.values(data.friendlyPlayerStatsByTeam || {}).flat();
const errors = [];
if (manifest.version !== 'V739') errors.push(`manifest version ${manifest.version}`);
if (players.length !== manifest.players) errors.push(`players mismatch ${players.length} != ${manifest.players}`);
if (idDup.length) errors.push(`duplicate ids ${idDup.length}`);
if (exactDup.length) errors.push(`duplicate exact ${exactDup.length}`);
if (activeOfficialRumors.length) errors.push(`active official rumors ${activeOfficialRumors.length}`);
if (Object.keys(data.friendlyPlayerStatsByMatch || {}).length !== manifest.friendlyMatchDetails) errors.push('friendly match details mismatch');
if (stats.length !== manifest.friendlyPlayerStats) errors.push('friendly player stats mismatch');
if (errors.length) { console.error('Audit ioSudo V739 FAILED'); for (const e of errors) console.error('-', e); process.exit(1); }
console.log('Audit ioSudo V739 OK');
console.log(JSON.stringify({version: manifest.version, players: players.length, officialMoves: manifest.officialMoves, talks: manifest.teamTransferTalks, injuries: manifest.injuries, friendlies: manifest.friendlies, friendlyMatchDetails: manifest.friendlyMatchDetails, friendlyPlayerStats: manifest.friendlyPlayerStats, activeOfficialRumors: activeOfficialRumors.length}, null, 2));
