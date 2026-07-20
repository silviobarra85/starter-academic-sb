import fs from 'fs';
const data=JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/sudatori-data.json','utf8'));
const meta=data.meta||{};
let ids=[]; let exact=new Set(); let exactDups=0;
for (const [team,rows] of Object.entries(data.playersByTeam||{})) {
  for (const p of rows||[]) {
    if (p.id) ids.push(p.id);
    const k=[team,(p.playerName||'').toLowerCase(),(p.role||'').toLowerCase()].join('|');
    if (exact.has(k)) exactDups++; else exact.add(k);
  }
}
const idDups=ids.length-new Set(ids).size;
const friendlyDetails=Object.values(data.friendlyPlayerStatsByMatch||{});
const missing=friendlyDetails.filter(m=>!(m.result||m.finalScore||m.score));
const orphan=friendlyDetails.filter(m=>!m.matchKey && !m.event);
if (idDups) throw new Error('ID duplicati: '+idDups);
if (exactDups) throw new Error('Duplicati esatti squadra+nome+ruolo: '+exactDups);
if (missing.length) throw new Error('Tabellini senza risultato: '+missing.map(m=>m.event).join(', '));
if (orphan.length) throw new Error('Tabellini senza chiave/evento: '+orphan.length);
console.log('Audit ioSudo V742 OK');
console.log(JSON.stringify({players:ids.length, friendlyMatchDetails:friendlyDetails.length, friendlyPlayerStats:friendlyDetails.reduce((a,m)=>a+(m.players||[]).length,0), duplicateIds:idDups, exactDups},null,2));
