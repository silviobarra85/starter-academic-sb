import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/sudatori-data.json','utf8'));
const manifest = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/manifest.json','utf8'));
const fail = (msg) => { console.error('AUDIT V616 FAIL:', msg); process.exit(1); };
const sum = (obj) => Object.values(obj || {}).reduce((a,b)=>a+(Array.isArray(b)?b.length:0),0);
const norm = (v) => String(v || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
if (manifest.version !== 'V616' || data.meta.version !== 'V616') fail('versione manifest/data non V616');
if ((data.teams||[]).length !== 20) fail('squadre diverse da 20');
if (sum(data.playersByTeam) !== manifest.players) fail('conteggio giocatori non coerente');
if (sum(data.friendliesByTeam) !== manifest.friendlies) fail('conteggio amichevoli non coerente');
if (sum(data.teamTransferTalksByTeam) !== manifest.teamTransferTalks) fail('conteggio trattative non coerente');
let officialIn=0, officialOut=0;
for (const [tid, summary] of Object.entries(data.marketSummaryByTeam || {})) {
  for (const key of ['officialIncoming','officialOutgoing','talksIncoming','talksOutgoing']) if (!Array.isArray(summary[key])) fail(`marketSummary ${tid} manca ${key}`);
  officialIn += summary.officialIncoming.length; officialOut += summary.officialOutgoing.length;
  const seen = new Set();
  for (const t of [...summary.talksIncoming, ...summary.talksOutgoing]) {
    const key = norm(t.target || t.playerName || '');
    if (seen.has(key)) fail(`trattativa duplicata in ${tid} per ${t.target}`);
    seen.add(key);
  }
  const official = new Set([...summary.officialIncoming, ...summary.officialOutgoing].map(x => norm(x.playerName || x.target || '')));
  for (const t of [...summary.talksIncoming, ...summary.talksOutgoing]) {
    const key = norm(t.target || t.playerName || '');
    if (official.has(key)) fail(`ufficialita ancora in trattative: ${tid} ${t.target}`);
  }
}
if (officialIn !== manifest.officialIncoming || officialOut !== manifest.officialOutgoing) fail('conteggio ufficialita non coerente');
if (manifest.officialMoves !== manifest.officialIncoming + manifest.officialOutgoing) fail('officialMoves non coerente');
const ata = (data.playersByTeam.atalanta || []).find(p => norm(p.playerName)==='gaetano');
if (!ata || !ata.newAcquisition) fail('Gaetano Atalanta non risulta NUOVO/newAcquisition');
const gila = (data.playersByTeam.milan || []).find(p => norm(p.playerName)==='gila');
if (gila && !gila.newAcquisition) fail('Gila Milan dovrebbe risultare NUOVO dopo ufficialita Sky');
console.log('AUDIT V616 OK', JSON.stringify({teams:data.teams.length, players:manifest.players, friendlies:manifest.friendlies, talks:manifest.teamTransferTalks, officialIn, officialOut, injuries:manifest.injuries, filteredOfficialTalks:manifest.filteredOfficialTalks}));
