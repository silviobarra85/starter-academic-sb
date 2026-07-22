import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));
const fail = (message) => { throw new Error(message); };
const norm = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const compact = (value) => norm(value).replace(/[^a-z0-9]+/g, '');
const direction = (value) => {
  const s = norm(value);
  if (s.includes('entrat') || s.includes('acquisto') || s.includes('tesseramento')) return 'incoming';
  if (s.includes('uscit') || s.includes('cession')) return 'outgoing';
  if (s.includes('rinnovo') || s.includes('permanenza')) return 'renewal';
  return '';
};

const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const runtime = json('static/fanta-engine/data/sudatori/current/sudatori-runtime.json');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
const indexHtml = read('static/iosudo/index.html');
const serviceWorker = read('static/iosudo/sw.js');
const appJs = read('static/fanta-engine/js/apps/iosudo-app-v752.js');
const css = read('static/fanta-engine/css/iosudo-app-v752.css');

const checks = [];
const check = (condition, label) => {
  if (!condition) fail(label);
  checks.push(label);
};

check(manifest.version === 'V752', 'manifest.version = V752');
check(manifest.appVersion === 'V752', 'manifest.appVersion = V752');
check(manifest.dataFile === 'sudatori-runtime.json', 'manifest usa il payload runtime');
check(data.meta?.version === 'V752', 'meta dataset = V752');
check(runtime.meta?.version === 'V752', 'meta runtime = V752');
check(indexHtml.includes('iosudo-app-v752.js?v=752'), 'index punta a JS V752');
check(indexHtml.includes('iosudo-app-v752.css?v=752'), 'index punta a CSS V752');
check(indexHtml.includes('data-iosudo-version="752"'), 'data-iosudo-version = 752');
check(serviceWorker.includes("iosudo-shell-v752"), 'cache service worker = V752');
check(serviceWorker.includes('iosudo-app-v752.js?v=752'), 'service worker precache JS V752');
check(serviceWorker.includes('iosudo-app-v752.css?v=752'), 'service worker precache CSS V752');
check(!indexHtml.includes('iosudo-app-v751'), 'nessun riferimento V751 nell index');
check(appJs.length > 100000, 'bundle JS V752 presente');
check(css.length > 10000, 'CSS V752 presente');

const players = Object.values(runtime.playersByTeam || {}).flat();
const ids = new Set();
const exact = new Set();
for (const player of players) {
  check(Boolean(player.id), `ID presente per ${player.teamName || player.teamId}/${player.playerName}`);
  if (ids.has(player.id)) fail(`ID giocatore duplicato: ${player.id}`);
  ids.add(player.id);
  const key = [player.teamId, compact(player.playerName), norm(player.role)].join('|');
  if (exact.has(key)) fail(`Duplicato esatto squadra+nome+ruolo: ${key}`);
  exact.add(key);
}
check(players.length === manifest.players, 'conteggio giocatori runtime = manifest');
check(players.length === manifest.displayPlayers, 'conteggio header/giocatori = displayPlayers');
check(players.length === 1054, 'conteggio giocatori V752 = 1054');
check(ids.has('inter-matteo-zamarian'), 'Matteo Zamarian presente');
check(ids.has('torino-luka-tomic'), 'Luka Tomic presente');
check(ids.has('roma-ndicka'), 'ID principale Evan Ndicka presente');
check(!ids.has('roma-n-dicka'), 'ID duplicato N\'Dicka rimosso');
check(!ids.has('lazio-giacomo-giacomone'), 'Giacomone Lazio rimosso');

const officialIndex = new Map();
for (const [teamId, rows] of Object.entries(runtime.marketSummaryByTeam || {})) {
  const officials = [...(rows.officialIncoming || []), ...(rows.officialOutgoing || []), ...(rows.officialRenewals || [])];
  for (const item of officials) {
    const key = [teamId, direction(item.directionLabel || item.direction), compact(item.playerName || item.target)].join('|');
    if (!officialIndex.has(key)) officialIndex.set(key, []);
    officialIndex.get(key).push(item);
  }
}
let activeOfficialRumors = 0;
for (const [teamId, rows] of Object.entries(runtime.marketSummaryByTeam || {})) {
  const talks = [...(rows.incoming || []), ...(rows.outgoing || []), ...(rows.talks || [])];
  for (const talk of talks) {
    const key = [teamId, direction(talk.directionLabel || talk.direction), compact(talk.playerName || talk.target)].join('|');
    if (officialIndex.has(key)) activeOfficialRumors += 1;
  }
}
check(activeOfficialRumors === 0, 'rumor attivi su ufficialità = 0');
check((data.activeOfficialRumorsAuditV752 || []).length === 0, 'audit ufficialità salvato = 0');

const injuryRows = Object.values(runtime.injuriesByTeam || {}).flat();
check(injuryRows.length === manifest.injuries, 'conteggio SOS = manifest');
for (const injury of injuryRows) {
  const matches = players.filter((p) => p.teamId === injury.teamId && compact(p.playerName) === compact(injury.playerName));
  if (matches.length === 1 && matches[0].probableXi) {
    check(Boolean(matches[0].sosFantaFlag || matches[0].injuryStatus || matches[0].physicalStatus), `badge SOS disponibile negli XI: ${injury.teamName}/${injury.playerName}`);
  }
}

const friendlies = Object.values(runtime.friendliesByTeam || {}).flat();
const matchKeys = new Set();
for (const match of friendlies) {
  check(Boolean(match.matchKey), `matchKey presente: ${match.teamName}/${match.event}`);
  if (matchKeys.has(match.matchKey)) fail(`matchKey duplicato: ${match.matchKey}`);
  matchKeys.add(match.matchKey);
  const event = norm(match.event);
  if (event.includes('aralanta')) fail(`Refuso Aralanta: ${match.event}`);
  if (event.includes('basilea juventus') && event.includes('bologna arminia')) fail(`Aggregato errato: ${match.event}`);
}
check(friendlies.length === manifest.friendlies, 'conteggio amichevoli = manifest');
const atalantaU23 = friendlies.filter((m) => norm(m.event).includes('atalanta atalanta u23'));
check(atalantaU23.length <= 1, 'Atalanta-Atalanta U23 non duplicata');

const details = Object.values(runtime.friendlyPlayerStatsByMatch || {});
let statCount = 0;
for (const detail of details) {
  check(matchKeys.has(detail.matchKey), `tabellino collegato: ${detail.matchKey}`);
  check(Boolean(detail.result || detail.finalScore || detail.score), `risultato tabellino presente: ${detail.matchKey}`);
  for (const player of detail.players || []) {
    statCount += 1;
    check(Boolean(player.playerName || player.name || player.target), `nome giocatore nel tabellino ${detail.matchKey}`);
  }
}
check(details.length === manifest.friendlyMatchDetails, 'conteggio tabellini = manifest');
check(statCount === manifest.friendlyPlayerStats, 'conteggio righe tabellini = manifest');

const expectedRuntimeKeys = [...(data.meta?.runtimePayloadKeys || [])].sort();
check(JSON.stringify(Object.keys(runtime).sort()) === JSON.stringify(expectedRuntimeKeys), 'runtime contiene solo le sezioni dichiarate');
check(manifest.runtimeDataBytes === fs.statSync(path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-runtime.json')).size, 'dimensione runtime nel manifest corretta');
check(manifest.archiveDataBytes === fs.statSync(path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json')).size, 'dimensione archivio nel manifest corretta');
check(manifest.runtimeDataBytes < manifest.archiveDataBytes, 'payload runtime più piccolo dell archivio');

console.log(`Audit ioSudo V752 OK - ${checks.length} controlli`);
console.log(JSON.stringify({
  version: manifest.version,
  players: players.length,
  officialMoves: manifest.officialMoves,
  talks: manifest.teamTransferTalks,
  transfermarktRumors: manifest.transfermarktRumors,
  injuries: injuryRows.length,
  friendlies: friendlies.length,
  friendlyMatchDetails: details.length,
  friendlyPlayerStats: statCount,
  duplicateIds: 0,
  exactDuplicates: 0,
  activeOfficialRumors,
  runtimeBytes: manifest.runtimeDataBytes,
  archiveBytes: manifest.archiveDataBytes
}, null, 2));
