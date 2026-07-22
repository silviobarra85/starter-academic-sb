import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));
const fail = (message) => { throw new Error(message); };
const check = (condition, label) => {
  if (!condition) fail(label);
  checks.push(label);
};
const norm = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();
const compact = (value) => norm(value).replace(/\s+/g, '');
const dateValue = (value) => {
  const time = Date.parse(String(value || ''));
  return Number.isFinite(time) ? time : 0;
};

const checks = [];
const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const runtime = json('static/fanta-engine/data/sudatori/current/sudatori-runtime.json');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
const indexHtml = read('static/iosudo/index.html');
const serviceWorker = read('static/iosudo/sw.js');
const appJs = read('static/fanta-engine/js/apps/iosudo-app-v753.js');
const css = read('static/fanta-engine/css/iosudo-app-v753.css');

check(manifest.version === 'V753', 'manifest V753');
check(manifest.appVersion === 'V753', 'appVersion V753');
check(data.meta?.version === 'V753', 'dataset V753');
check(runtime.meta?.version === 'V753', 'runtime V753');
check(indexHtml.includes('iosudo-app-v753.js?v=753'), 'index JS V753');
check(indexHtml.includes('iosudo-app-v753.css?v=753'), 'index CSS V753');
check(indexHtml.includes('data-iosudo-version="753"'), 'data-iosudo-version 753');
check(serviceWorker.includes("iosudo-shell-v753"), 'cache PWA V753');
check(serviceWorker.includes('iosudo-app-v753.js?v=753'), 'precache JS V753');
check(serviceWorker.includes('iosudo-app-v753.css?v=753'), 'precache CSS V753');
check(appJs.includes("text: 'RINNOVO', cls: 'iosudo-badge-renewal'"), 'badge RINNOVO nel JS');
check(css.includes('.iosudo-badge-renewal'), 'stile badge rinnovo');
check(appJs.includes('const ar = roleOrder(a.role);') &&
      appJs.indexOf('const ar = roleOrder(a.role);', appJs.indexOf('function teamPlayersList')) <
      appJs.indexOf('const bt = playerLatestNewsTime(b);', appJs.indexOf('function teamPlayersList')),
      'ordinamento rosa P-D-C-A prima della recenza');

const players = Object.values(runtime.playersByTeam || {}).flat();
const ids = new Set();
const exact = new Set();
for (const player of players) {
  check(Boolean(player.id), `ID presente: ${player.teamName}/${player.playerName}`);
  if (ids.has(player.id)) fail(`ID duplicato: ${player.id}`);
  ids.add(player.id);
  const key = [player.teamId, compact(player.playerName), norm(player.role)].join('|');
  if (exact.has(key)) fail(`Duplicato esatto squadra+nome+ruolo: ${key}`);
  exact.add(key);
}
check(players.length === manifest.players, 'conteggio giocatori = manifest');
check(players.length === 1053, 'conteggio giocatori V753 = 1053');
check(ids.has('lecce-alex-sala'), 'Alex Sala canonicalizzato');
check(!ids.has('lecce-a-sala'), 'vecchio ID A. Sala rimosso');
check(!ids.has('atalanta-oliveri'), 'Andrea Oliveri rimosso dalla rosa Atalanta');

const official = Object.values(data.officialMovesByTeam || {}).flat();
const renewals = official.filter((item) => item.isRenewal === true);
check(official.length === manifest.officialMoves, 'conteggio ufficialità = manifest');
check(renewals.length === 27, '27 rinnovi ufficiali reali');
check(renewals.every((item) => !norm([
  item.officialCategory, item.formula, item.note
].join(' ')).includes('primo contratto professionistico')), 'primi contratti esclusi dai rinnovi');
check(official.filter((item) => norm(item.officialCategory).includes('primo contratto professionistico'))
  .every((item) => item.isRenewal === false), 'flag primi contratti corretto');
check(players.filter((player) => player.hasRenewal).length >= 20, 'badge rinnovo collegato ai giocatori di rosa');

const talks = Object.values(data.teamTransferTalksByTeam || {}).flat();
check(talks.length === manifest.teamTransferTalks, 'conteggio trattative = manifest');
const latestOfficial = new Map();
for (const item of official) {
  if (!['incoming', 'outgoing'].includes(item.direction)) continue;
  const key = [item.teamId, item.direction, compact(item.playerName || item.target)].join('|');
  latestOfficial.set(key, Math.max(latestOfficial.get(key) || 0, dateValue(item.date || item.updatedAt)));
}
let invalidTalks = 0;
for (const talk of talks) {
  const key = [talk.teamId, talk.direction, compact(talk.playerName || talk.target)].join('|');
  const officialTime = latestOfficial.get(key) || 0;
  const talkTime = dateValue(talk.date || talk.updatedAt);
  if (officialTime && officialTime >= talkTime) invalidTalks += 1;
}
check(invalidTalks === 0, 'nessun rumor attivo superato da ufficialità');
check(talks.every((talk) => dateValue(talk.date || talk.updatedAt) >= Date.parse('2026-07-15')),
  'finestra rumor di sette giorni applicata');

const injuries = Object.values(runtime.injuriesByTeam || {}).flat();
check(injuries.length === manifest.injuries, 'conteggio SOS = manifest');
check(injuries.some((x) => x.teamId === 'roma' && compact(x.playerName).includes('robiniovaz')), 'Robinio Vaz SOS presente');
check(injuries.some((x) => x.teamId === 'napoli' && compact(x.playerName).includes('billygilmour')), 'Billy Gilmour SOS presente');
check(!injuries.some((x) => x.teamId === 'napoli' && compact(x.playerName).endsWith('lucca')), 'Lucca rientrato e rimosso dal SOS');

const friendlies = Object.values(runtime.friendliesByTeam || {}).flat();
const matchDetails = runtime.friendlyPlayerStatsByMatch || {};
const stats = Object.values(matchDetails).flatMap((match) => match.players || []);
check(friendlies.length === manifest.friendlies, 'conteggio amichevoli = manifest');
check(Object.keys(matchDetails).length === manifest.friendlyMatchDetails, 'conteggio tabellini = manifest');
check(stats.length === manifest.friendlyPlayerStats, 'conteggio prestazioni = manifest');
const friendlyKeys = new Set(friendlies.map((x) => x.matchKey).filter(Boolean));
check(Object.keys(matchDetails).every((key) => friendlyKeys.has(key)), 'tutti i tabellini collegati a un matchKey');
check(friendlies.some((x) => x.matchKey === 'inter 2026 07 22 sv aasen inter' && x.result === '0-16'),
  'SV Aasen-Inter 0-16 presente');
check(matchDetails['inter 2026 07 22 sv aasen inter']?.players?.length === 23,
  'tabellino Inter con 23 giocatori');
check(!friendlies.some((x) => /basilea.*juventus.*bologna.*arminia.*atalanta/i.test(String(x.event || ''))),
  'nessuna amichevole aggregata errata');
check(!friendlies.some((x) => /aralanta/i.test(String(x.event || ''))), 'nessun typo Aralanta');

check(manifest.duplicateIds === 0, 'manifest duplicateIds = 0');
check(manifest.duplicatesExact === 0, 'manifest duplicatesExact = 0');
check(manifest.activeOfficialRumors === 0, 'manifest activeOfficialRumors = 0');

console.log(`Audit ioSudo V753 OK - ${checks.length} controlli superati`);
