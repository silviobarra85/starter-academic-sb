import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const dataDir=path.join(root,'static/fanta-engine/data/sudatori/current');
const manifest=JSON.parse(fs.readFileSync(path.join(dataDir,'manifest.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(dataDir,'sudatori-runtime.json'),'utf8'));
const assert=(c,m)=>{if(!c)throw new Error(m)};
assert(manifest.version==='V778','manifest non V778');
const html=fs.readFileSync(path.join(root,'static/iosudo/index.html'),'utf8');
assert(html.includes('V778')&&html.includes('iosudo-app-v778.js?v=778'),'header/app non V778');
assert(fs.readFileSync(path.join(root,'static/iosudo/sw.js'),'utf8').includes('iosudo-shell-v778'),'cache non V778');
let incoming=0,outgoing=0,other=0;
const talkKeys=[];
for(const s of Object.values(data.marketSummaryByTeam||{})){
 incoming+=(s.talksIncoming||[]).length;outgoing+=(s.talksOutgoing||[]).length;other+=(s.talksOther||[]).length;
 for(const t of [...(s.talksIncoming||[]),...(s.talksOutgoing||[]),...(s.talksOther||[])]) talkKeys.push(`${t.teamId}|${t.canonicalPlayerId}|${t.direction}`);
}
assert(incoming+outgoing+other===175,`rumor runtime ${incoming+outgoing+other}/175`);
assert(new Set(talkKeys).size===talkKeys.length,'trattative duplicate');
const findTalk=(team,name)=>Object.values(data.marketSummaryByTeam||{}).flatMap(s=>s.talks||[]).find(t=>t.teamId===team&&String(t.playerName).toLowerCase().includes(name));
assert(findTalk('milan','rafael leao')?.status.includes('SMENTITA'),'Leao non aggiornato');
assert(findTalk('lazio','john kennedy')?.updatedAt==='2026-07-25','John Kennedy non aggiornato');
assert(findTalk('monza','yanis massolin')?.updatedAt==='2026-07-25','Massolin Monza non aggiornato');
const expected={'cagliari 2026 07 23 cagliari sampdoria':22,'roma 2026 07 23 roma trastevere':22,'como 2026 07 24 como paris fc':24,'udinese 2026 07 24 udinese swansea':23,'monza 2026 07 24 galatasaray monza':22};
for(const [k,n] of Object.entries(expected)){assert(data.friendlyPlayerStatsByMatch[k],`tabellino mancante ${k}`);assert(data.friendlyPlayerStatsByMatch[k].players.length===n,`righe ${k}`)}
const c=data.friendlyPlayerStatsByMatch['cagliari 2026 07 23 cagliari sampdoria'];
assert((c.source||'').includes('cagliaricalcio.com'),'fonte ufficiale Cagliari assente');
const stats=Object.values(data.friendlyPlayerStatsByMatch||{}).reduce((n,x)=>n+(x.players||[]).length,0);
assert(stats===664,`prestazioni ${stats}/664`);
const ids=(data.playerDirectory||[]).map(x=>x.id);assert(new Set(ids).size===ids.length,'ID giocatore duplicati');
console.log(`Audit ioSudo V778 OK - rumor ${incoming+outgoing+other} (${incoming} entrata, ${outgoing} uscita, ${other} altro), tabellini ${Object.keys(data.friendlyPlayerStatsByMatch).length}, prestazioni ${stats}, duplicati 0.`);
