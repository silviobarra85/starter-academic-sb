import fs from 'node:fs';
const data=JSON.parse(fs.readFileSync(new URL('../data/sudatori/current/sudatori-data.json', import.meta.url),'utf8'));
const m=data.manifest||{};
const players=Object.values(data.playersByTeam||{}).flat();
const ids=new Set(); const dupIds=[]; const exact=new Set(); const dupExact=[];
for (const p of players){ if(ids.has(p.id)) dupIds.push(p.id); ids.add(p.id); const k=[p.teamId,p.playerName,p.role].join('::').toLowerCase(); if(exact.has(k)) dupExact.push(k); exact.add(k); }
const officialNames=new Set(Object.values(data.officialMovesByTeam||{}).flat().map(x=>String(x.playerName||'').toLowerCase()));
const activeOfficialRumors=Object.values(data.teamTransferTalksByTeam||{}).flat().filter(x=>officialNames.has(String(x.playerName||'').toLowerCase()));
if(m.version!=='V741') throw new Error('Manifest version mismatch');
if(dupIds.length) throw new Error('Duplicate IDs: '+dupIds.slice(0,5).join(', '));
if(dupExact.length) throw new Error('Duplicate exact players: '+dupExact.slice(0,5).join(', '));
if(activeOfficialRumors.length) throw new Error('Active official rumors: '+activeOfficialRumors.slice(0,5).map(x=>x.playerName).join(', '));
if(!data.protectedDisambiguationsV741?.length) throw new Error('Missing V741 disambiguations');
console.log('Audit ioSudo V741 OK');
console.log(JSON.stringify({players:players.length, officialMoves:m.officialMoves, talks:m.teamTransferTalks, injuries:m.injuries, friendlies:m.friendlies, friendlyDetails:m.friendlyMatchDetails, friendlyRows:m.friendlyPlayerStats, sources:m.sources}, null, 2));
