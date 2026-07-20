import fs from 'fs';
const data = JSON.parse(fs.readFileSync(new URL('../data/sudatori/current/sudatori-data.json', import.meta.url), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(new URL('../data/sudatori/current/manifest.json', import.meta.url), 'utf8'));
const players = Object.values(data.playersByTeam || {}).flat();
const errors=[];
if (manifest.version !== 'V740') errors.push('versione manifest errata');
if ((data.meta||{}).version !== 'V740') errors.push('versione dati errata');
if (players.length !== manifest.players) errors.push(`players mismatch ${players.length}/${manifest.players}`);
const ids=new Set(); const dupIds=[]; const exact=new Map();
for (const p of players) { if(ids.has(p.id)) dupIds.push(p.id); ids.add(p.id); const k=`${p.teamId}|${String(p.playerName||'').toLowerCase()}|${p.role||''}`; exact.set(k,(exact.get(k)||0)+1); }
if(dupIds.length) errors.push('id duplicati '+dupIds.length);
const exactDup=[...exact].filter(([,n])=>n>1); if(exactDup.length) errors.push('duplicati esatti '+exactDup.length);
const udinese=data.playersByTeam.udinese||[];
if(!udinese.some(p=>p.playerName==='Leonardo Daniel Ulineia Buta')) errors.push('Buta canonico assente');
if(udinese.some(p=>p.playerName==='A. Buta'||p.playerName==='L. Buta')) errors.push('Buta abbreviato ancora presente');
if(Number(manifest.activeOfficialRumors||0)!==0) errors.push('rumor su ufficialita non zero');
if(errors.length){console.error('Audit ioSudo V740 FAILED'); for(const e of errors) console.error('-',e); process.exit(1);}
console.log('Audit ioSudo V740 OK');
console.log(JSON.stringify({players: players.length, officialMoves: manifest.officialMoves, talks: manifest.teamTransferTalks, injuries: manifest.injuries, friendlies: manifest.friendlies, friendlyMatchDetails: manifest.friendlyMatchDetails, friendlyPlayerStats: manifest.friendlyPlayerStats, sources: manifest.sources}, null, 2));
