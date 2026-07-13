import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const fail = (msg) => { console.error('AUDIT V628 FAIL:', msg); process.exit(1); };
const read = (rel) => { const abs = path.join(root, rel); if (!fs.existsSync(abs)) fail('missing ' + rel); return fs.readFileSync(abs, 'utf8'); };
const json = (rel) => JSON.parse(read(rel));
const sum = (obj) => Object.values(obj || {}).reduce((a,b)=>a+(Array.isArray(b)?b.length:0),0);
const norm = (v) => String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
if (manifest.version !== 'V628' || data.meta.version !== 'V628') fail('versione manifest/data non V628');
if (!manifest.liveRosterRuntime || !data.meta.liveRosterRuntime) fail('live roster runtime non marcato');
if ((data.teams||[]).length !== 20) fail('squadre diverse da 20');
if (sum(data.playersByTeam) !== manifest.players) fail('conteggio giocatori non coerente');
if (sum(data.friendliesByTeam) !== manifest.friendlies) fail('conteggio amichevoli non coerente');
if (sum(data.teamTransferTalksByTeam) !== manifest.teamTransferTalks) fail('conteggio trattative non coerente');
if ((data.sources||[]).length !== manifest.sources) fail('conteggio fonti non coerente');
if (sum(data.injuriesByTeam) !== manifest.injuries) fail('conteggio SOS non coerente');
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
if (talks !== manifest.teamTransferTalks) fail('conteggio talks summary non coerente');
if (manifest.sources < 120) fail('fonti attese almeno 120');
if (manifest.articleLinksMode !== 'ARTICLE_URL_FIRST_NO_GENERIC_FALLBACK') fail('articleLinksMode non attivo');
if (!manifest.articleSourceAuditRows || manifest.articleSourceAuditRows < 60) fail('audit fonti articolo non tracciato');
if (manifest.recoveredArticleRowsV628 < 50) fail('recupero fonti v8 non tracciato');
if (manifest.recoveredArticleRowsOkV628 < 20) fail('troppi pochi recuperi OK v8');
if (manifest.missingPreciseArticlesV628 < 1) fail('lista articoli mancanti V628 non tracciata');
const veneziaOut = data.marketSummaryByTeam?.venezia?.officialOutgoing || [];
if (!veneziaOut.some(x => norm(x.playerName).includes('doumbia'))) fail('Doumbia I. uscita Venezia non presente');
const milanTalks = [...(data.marketSummaryByTeam?.milan?.talksIncoming||[]), ...(data.marketSummaryByTeam?.milan?.talksOutgoing||[])];
if (!milanTalks.some(x => norm(x.playerName).includes('leao'))) fail('Rafael Leao rumor Milan non presente');

let articleUrls = 0;
let genericSerieA = 0;
for (const summary of Object.values(data.marketSummaryByTeam || {})) {
  for (const item of [...(summary.talksIncoming||[]), ...(summary.talksOutgoing||[]), ...(summary.officialIncoming||[]), ...(summary.officialOutgoing||[])]) {
    const sources = Array.isArray(item.sources) && item.sources.length ? item.sources : [item];
    for (const src of sources) {
      const url = String(src.articleUrl || src.url || src.source || '');
      if (/^https?:\/\//.test(url)) articleUrls++;
      if (/tuttomercatoweb\.com\/serie-a\/?$/.test(url)) genericSerieA++;
    }
  }
}
if (articleUrls < 250) fail('troppi pochi URL articolo/pagina puntuali nelle fonti mercato');
if (genericSerieA > 0) fail('rimangono link generici TMW /serie-a nelle card mercato');
if (!manifest.genericLinksSuppressedV628 || manifest.genericLinksSuppressedV628 < 1) fail('nessun link generico/DA_VERIFICARE soppresso: controllo V628 non applicato');

const js = read('static/fanta-engine/js/sections/sudatori-section-v628.js');
for (const token of ['itemArticleUrlV628','loadLeagueRosters','applyLiveRosters','fantasyRosterLabel','assets/rose/manifest.json','liveRosterFor','leagueBaseUrl']) if (!js.includes(token)) fail('token runtime rose mancante: ' + token);
for (const league of ['zonaorientale','fantapetillomantramanager']) {
  const html = read(`static/${league}/index.html`);
  if (!html.includes('sudatori-section-v628.css?v=628')) fail('CSS Sudatori V628 non linkato in ' + league);
  if (!html.includes('sudatori-section-v628.js?v=628')) fail('JS Sudatori V628 non linkato in ' + league);
  const cfg = json(`static/${league}/assets/league-config.json`);
  if (cfg.currentVersion !== '628') fail('currentVersion non 628 in ' + league);
  if (cfg.features?.sudatoriLiveRosters !== 'V628') fail('feature sudatoriLiveRosters non V628 in ' + league);
}
console.log('AUDIT V628 OK', JSON.stringify({teams:data.teams.length, players:manifest.players, friendlies:manifest.friendlies, talks:manifest.teamTransferTalks, officialIn, officialOut, sources:manifest.sources, injuries: manifest.injuries}));
