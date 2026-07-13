import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const fail = (msg) => { console.error('AUDIT V621 FAIL:', msg); process.exit(1); };
const read = (rel) => { const abs = path.join(root, rel); if (!fs.existsSync(abs)) fail('missing ' + rel); return fs.readFileSync(abs, 'utf8'); };
const json = (rel) => JSON.parse(read(rel));
const sum = (obj) => Object.values(obj || {}).reduce((a,b)=>a+(Array.isArray(b)?b.length:0),0);
const norm = (v) => String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
if (manifest.version !== 'V621' || data.meta.version !== 'V621') fail('versione manifest/data non V621');
if (!manifest.liveRosterRuntime || !data.meta.liveRosterRuntime) fail('live roster runtime non marcato');
if ((data.teams||[]).length !== 20) fail('squadre diverse da 20');
if (sum(data.playersByTeam) !== manifest.players) fail('conteggio giocatori non coerente');
if (sum(data.friendliesByTeam) !== manifest.friendlies) fail('conteggio amichevoli non coerente');
if (sum(data.teamTransferTalksByTeam) !== manifest.teamTransferTalks) fail('conteggio trattative non coerente');
if ((data.sources||[]).length !== manifest.sources) fail('conteggio fonti non coerente');
if ((data.retreatFriendliesControlSourcesV621||[]).length !== manifest.extraControlFriendliesSourcesAddedV621) fail('fonti controllo ritiri V621 non coerenti');
let officialIn=0, officialOut=0, talks=0;
for (const [tid, summary] of Object.entries(data.marketSummaryByTeam || {})) {
  for (const key of ['officialIncoming','officialOutgoing','talksIncoming','talksOutgoing']) if (!Array.isArray(summary[key])) fail(`marketSummary ${tid} manca ${key}`);
  officialIn += summary.officialIncoming.length; officialOut += summary.officialOutgoing.length; talks += summary.talksIncoming.length + summary.talksOutgoing.length;
  const seen = new Set();
  for (const t of [...summary.talksIncoming, ...summary.talksOutgoing]) { const key = norm(t.target || t.playerName || ''); if (seen.has(key)) fail(`trattativa duplicata in ${tid} per ${t.target}`); seen.add(key); }
  const official = new Set([...summary.officialIncoming, ...summary.officialOutgoing].map(x => norm(x.playerName || x.target || '')));
  for (const t of [...summary.talksIncoming, ...summary.talksOutgoing]) { const key = norm(t.target || t.playerName || ''); if (official.has(key)) fail(`ufficialita ancora in trattative: ${tid} ${t.target}`); }
}
if (officialIn !== manifest.officialIncoming || officialOut !== manifest.officialOutgoing) fail('conteggio ufficialita non coerente');
if (talks < 170) fail('troppe poche trattative aggregate: ' + talks);
const js = read('static/fanta-engine/js/sections/sudatori-section-v621.js');
for (const token of ['loadLeagueRosters','applyLiveRosters','fantasyRosterLabel','assets/rose/manifest.json','liveRosterFor','leagueBaseUrl']) if (!js.includes(token)) fail('token runtime rose mancante: ' + token);
for (const league of ['zonaorientale','fantapetillomantramanager']) {
  const html = read(`static/${league}/index.html`);
  if (!html.includes('sudatori-section-v621.css?v=621')) fail('CSS Sudatori V621 non linkato in ' + league);
  if (!html.includes('sudatori-section-v621.js?v=621')) fail('JS Sudatori V621 non linkato in ' + league);
  const cfg = json(`static/${league}/assets/league-config.json`);
  if (cfg.currentVersion !== '621') fail('currentVersion non 621 in ' + league);
  if (cfg.features?.sudatoriLiveRosters !== 'V621') fail('feature sudatoriLiveRosters non V621 in ' + league);
}
console.log('AUDIT V621 OK', JSON.stringify({teams:data.teams.length, players:manifest.players, friendlies:manifest.friendlies, talks:manifest.teamTransferTalks, officialIn, officialOut, sources:manifest.sources}));
