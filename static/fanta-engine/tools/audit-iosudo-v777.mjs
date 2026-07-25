import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const dataDir=path.join(root,'static/fanta-engine/data/sudatori/current');
const manifest=JSON.parse(fs.readFileSync(path.join(dataDir,'manifest.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(dataDir,'sudatori-runtime.json'),'utf8'));
const assert=(c,m)=>{if(!c)throw new Error(m)};
assert(manifest.version==='V777','manifest non V777');
assert(fs.readFileSync(path.join(root,'static/iosudo/index.html'),'utf8').includes('V777'),'header non V777');
assert(fs.readFileSync(path.join(root,'static/iosudo/sw.js'),'utf8').includes('iosudo-shell-v777'),'cache non V777');
let incoming=0,outgoing=0,other=0;
for(const s of Object.values(data.marketSummaryByTeam||{})){incoming+=(s.talksIncoming||[]).length;outgoing+=(s.talksOutgoing||[]).length;other+=(s.talksOther||[]).length;}
assert(incoming+outgoing+other===manifest.teamTransferTalks,`rumor runtime ${incoming+outgoing+other} != manifest ${manifest.teamTransferTalks}`);
assert(incoming+outgoing+other>0,'rumor runtime vuoti');
const expected={
 'como 2026 07 24 como paris fc':24,
 'udinese 2026 07 24 udinese swansea':23,
 'monza 2026 07 24 galatasaray monza':22,
 'cagliari 2026 07 23 cagliari sampdoria':22,
 'roma 2026 07 23 roma trastevere':22,
 'sassuolo 2026 07 16 sassuolo alta anaunia':26
};
for(const [k,n] of Object.entries(expected)){assert(data.friendlyPlayerStatsByMatch[k],`tabellino mancante ${k}`);assert(data.friendlyPlayerStatsByMatch[k].players.length===n,`righe ${k}: ${data.friendlyPlayerStatsByMatch[k].players.length}`)}
const ids=(data.playerDirectory||[]).map(x=>x.id); assert(new Set(ids).size===ids.length,'ID giocatore duplicati');
const scuderi=(data.playersByTeam?.fiorentina||[]).filter(x=>String(x.playerName||'').toLowerCase()==='scuderi'); assert(scuderi.length===0,'Scuderi ancora in rosa');
const stats=Object.values(data.friendlyPlayerStatsByMatch||{}).reduce((n,x)=>n+(x.players||[]).length,0);
assert(stats===manifest.friendlyPlayerStats,`statistiche ${stats} != manifest ${manifest.friendlyPlayerStats}`);
assert(stats===664,`tabellini incompleti: ${stats}/664 righe workbook`);
console.log(`Audit ioSudo V777 OK - rumor ${incoming+outgoing+other} (${incoming} entrata, ${outgoing} uscita, ${other} altro), tabellini ${Object.keys(data.friendlyPlayerStatsByMatch||{}).length}, prestazioni ${stats}.`);
