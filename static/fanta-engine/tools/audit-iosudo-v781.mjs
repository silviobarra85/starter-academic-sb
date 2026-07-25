import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const dir=path.join(root,'static/fanta-engine/data/sudatori/current');
const manifest=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8'));
const data=JSON.parse(fs.readFileSync(path.join(dir,'sudatori-runtime.json'),'utf8'));
const archive=JSON.parse(fs.readFileSync(path.join(dir,'sudatori-data.json'),'utf8'));
const assert=(c,m)=>{if(!c)throw new Error(m)};
assert(manifest.version==='V781','manifest non V781');
const html=fs.readFileSync(path.join(root,'static/iosudo/index.html'),'utf8');
assert(html.includes('V781')&&html.includes('iosudo-app-v781.js?v=781'),'header/app non V781');
assert(fs.readFileSync(path.join(root,'static/iosudo/sw.js'),'utf8').includes('iosudo-shell-v781'),'cache non V781');
const summaries=Object.values(data.marketSummaryByTeam||{});
const outgoing=summaries.flatMap(s=>s.officialOutgoing||[]);
const incoming=summaries.flatMap(s=>s.officialIncoming||[]);
const outKeys=outgoing.map(x=>`${x.teamId}|${x.canonicalPlayerId}`);
assert(outgoing.length===158,`uscite ${outgoing.length}/158`);
assert(new Set(outKeys).size===outKeys.length,'uscite duplicate');
assert(archive.officialMoves.length===378,`ufficialita archivio ${archive.officialMoves.length}/378`);
for(const team of data.teams||[]) assert((data.marketSummaryByTeam[team.id]?.officialOutgoing||[]).length>0,`uscite assenti per ${team.id}`);
const must=[
 ['milan','milan-ismael-bennacer','Al-Gharafa'],
 ['udinese','udinese-iker-bravo','Watford'],
 ['atalanta','atalanta-godfrey','Rangers Glasgow'],
 ['inter','inter-acerbi','Svincolato']
];
for(const [team,id,dest] of must){const x=(data.marketSummaryByTeam[team]?.officialOutgoing||[]).find(r=>r.canonicalPlayerId===id);assert(x&&x.origin===dest,`uscita mancante ${id} -> ${dest}`)}
let tin=0,tout=0,tother=0; const talkKeys=[];
for(const s of summaries){tin+=(s.talksIncoming||[]).length;tout+=(s.talksOutgoing||[]).length;tother+=(s.talksOther||[]).length;for(const t of [...(s.talksIncoming||[]),...(s.talksOutgoing||[]),...(s.talksOther||[])])talkKeys.push(`${t.teamId}|${t.canonicalPlayerId}|${t.direction}`)}
assert(tin+tout+tother===176,`rumor ${tin+tout+tother}/176`);assert(new Set(talkKeys).size===talkKeys.length,'trattative duplicate');
const roster=Object.values(data.playersByTeam||{}).flat();assert(roster.length===732,`roster ${roster.length}/732`);
const directory=data.playerDirectory||[];const ids=directory.map(x=>x.id);assert(ids.length===1187,`catalogo ${ids.length}/1187`);assert(new Set(ids).size===ids.length,'ID duplicati');
const rosterById=new Map(roster.map(x=>[x.id,x]));const names=directory.map(x=>{const p=Object.keys(x).length===1?rosterById.get(x.id):x;return String(p?.playerName||x.id).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()});assert(new Set(names).size===names.length,'nomi visualizzati duplicati');
const details=Object.keys(data.friendlyPlayerStatsByMatch||{}).length;const stats=Object.values(data.friendlyPlayerStatsByMatch||{}).reduce((n,x)=>n+(x.players||[]).length,0);assert(details===33&&stats===687,`tabellini ${details}/33, prestazioni ${stats}/687`);
assert((data.playerDirectory||[]).some(x=>x.id==='milan-ismael-bennacer'),'Bennacer non conservato nel catalogo storico');
const dirById=new Map(directory.map(x=>[x.id,x]));const resolve=id=>{const x=dirById.get(id);return x&&Object.keys(x).length===1?rosterById.get(id):x};assert(resolve('monza-pessina-mas')?.role==='C','Matteo Pessina non C');assert(resolve('bologna-pessina-mas')?.role==='P','Massimo Pessina non P');
console.log(`Audit ioSudo V781 OK - uscite 158 su 20 squadre, ufficialita 378, rumor 176, roster 732, catalogo 1187, tabellini 33, duplicati 0.`);
