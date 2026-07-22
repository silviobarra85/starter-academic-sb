import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));
const checks = [];
const check = (condition, label) => {
  if (!condition) throw new Error(label);
  checks.push(label);
};
const norm = (value) => String(value || '').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const role = (value) => {
  const key = String(value || '').trim().toUpperCase().charAt(0);
  return ['C', 'M', 'T', 'W'].includes(key) ? 'C' : key;
};

const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const runtime = json('static/fanta-engine/data/sudatori/current/sudatori-runtime.json');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
const app = read('static/fanta-engine/js/apps/iosudo-app-v755.js');
const css = read('static/fanta-engine/css/iosudo-app-v755.css');
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

check(manifest.version === 'V755', 'manifest V755');
check(manifest.appVersion === 'V755', 'appVersion V755');
check(runtime.meta?.version === 'V755', 'runtime V755');
check(data.meta?.version === 'V755', 'archive V755');
check(index.includes('iosudo-app-v755.js?v=755'), 'index JS V755');
check(index.includes('iosudo-app-v755.css?v=755'), 'index CSS V755');
check(index.includes('data-iosudo-version="755"'), 'data version 755');
check(sw.includes("iosudo-shell-v755"), 'service worker V755');
check(app.includes('function displayPlayerName'), 'helper nome canonico');
check(app.includes('function knownPlayerForItem'), 'resolver identita card');
check(app.includes('function selectUniqueMarketIdentity'), 'resolver mercato univoco');
check(app.includes('marketRowResolvedPlayerCache: new Map()'), 'cache resolver mercato');
check(app.includes('function marketRowResolutionKey'), 'chiave cache resolver mercato');
check(app.includes('const resolved = findPlayerForMarketRow(row);'), 'righe mercato risolte con identita canonica');
check(app.includes('function playerContextMarketItem'), 'renderer rumor contestuale');
check(app.includes("detailSection('Trattative e rumors', talks, playerContextMarketItem)"), 'rumor dettaglio senza identita ripetuta');
check(!app.includes("detailSection('Trattative e rumors', talks, marketItem)"), 'vecchio renderer rumor rimosso dal dettaglio');
check(app.includes("toLocaleUpperCase('it-IT')"), 'nomi mostrati in maiuscolo');
check(!app.includes('Listone recente:'), 'dicitura Listone recente assente');
check(css.includes('.iosudo-badge-source-anagrafica'), 'CSS sorgente anagrafica');
check(css.includes('.iosudo-player-context-market-row'), 'CSS rumor contestuale');

const players = Object.values(runtime.playersByTeam || {}).flat();
check(players.length === 1034, '1034 giocatori dopo deduplica Fini');
check(players.length === manifest.players, 'conteggio manifest coerente');
const byId = new Map();
const exact = new Set();
for (const player of players) {
  check(Boolean(player.id), `ID presente ${player.playerName}`);
  check(!byId.has(player.id), `ID univoco ${player.id}`);
  byId.set(player.id, player);
  const key = [player.teamId, norm(player.playerName), role(player.role)].join('|');
  check(!exact.has(key), `identita esatta univoca ${key}`);
  exact.add(key);
  check(Boolean(player.canonicalFullName), `nome canonico presente ${player.id}`);
  check(Array.isArray(player.nameAliasesV755) && player.nameAliasesV755.length > 0, `alias canonici presenti ${player.id}`);
  check(['LISTONE','ROSA','TRATTATIVA','UFFICIALITÀ','SOS','FORMAZIONE','AMICHEVOLE','ANAGRAFICA'].includes(player.nameSource), `sorgente nome valida ${player.id}`);
  if (player.listone) {
    check(role(player.role) === role(player.listone.classicRole || player.listone.role), `ruolo listone prioritario ${player.id}`);
    check(player.roleSource === 'LISTONE', `sorgente ruolo listone ${player.id}`);
  }
}

check(!byId.has('genoa-seydou-fini-2'), 'duplicato EXTRA_LISTONE Seydou Fini rimosso');
check(byId.get('genoa-seydou-fini')?.fantacalcioId === '6506', 'ID listone Seydou Fini mantenuto');
check(data.canonicalNameAuditV755?.confirmedDuplicateMerges?.length === 1, 'una fusione duplicato certa registrata');

const rowe = byId.get('bologna-rowe');
check(rowe?.playerName === 'Jonathan Rowe', 'Rowe canonicalizzato Jonathan Rowe');
check(rowe?.canonicalFullName === 'Jonathan Rowe', 'nome canonico Rowe');
check(rowe?.role === 'C', 'Jonathan Rowe ruolo C');
check(rowe?.nameSource === 'TRATTATIVA', 'sorgente nome Rowe trattativa');
check(rowe?.nameAliasesV755?.some((x) => norm(x) === 'rowe'), 'alias Rowe conservato');
check(rowe?.nameAliasesV755?.some((x) => norm(x) === 'jonathan rowe'), 'alias Jonathan Rowe conservato');

const roweTalks = runtime.marketSummaryByTeam?.bologna?.talksOutgoing?.filter((x) => norm(x.playerName).includes('rowe')) || [];
check(roweTalks.length === 1, 'una sola riga rumor Rowe');
check(roweTalks[0]?.playerName === 'Jonathan Rowe', 'rumor usa Jonathan Rowe');
check(roweTalks[0]?.role === 'C', 'rumor Rowe riallineato a C');
check(roweTalks[0]?.canonicalPlayerId === 'bologna-rowe', 'rumor collegato a ID Rowe');

const nameAudit = data.canonicalNameAuditV755 || {};
check(nameAudit.changedPlayersCount === 108, '108 nomi ampliati');
check(nameAudit.ambiguousCount === 1, 'una sola espansione ambigua');
check(Boolean(nameAudit.ambiguous?.['inter-massolin']), 'Massolin resta ambiguo');
check(byId.get('inter-massolin')?.playerName === 'Massolin', 'Massolin non fuso automaticamente');
check(manifest.canonicalNameChanges === 108, 'manifest nome cambiati 108');
check(manifest.canonicalNameAmbiguities === 1, 'manifest ambiguita 1');

const operational = [];
for (const [teamId, summary] of Object.entries(runtime.marketSummaryByTeam || {})) {
  for (const key of ['officialIncoming','officialOutgoing','officialRenewals','talksIncoming','talksOutgoing','injuries']) {
    for (const item of summary?.[key] || []) operational.push([teamId, item]);
  }
}
for (const [teamId, rows] of Object.entries(runtime.injuriesByTeam || {})) {
  for (const item of rows || []) operational.push([teamId, item]);
}
for (const [teamId, rows] of Object.entries(runtime.formationsByTeam || {})) {
  for (const item of rows || []) operational.push([teamId, item]);
}
for (const match of Object.values(runtime.friendlyPlayerStatsByMatch || {})) {
  for (const item of match.players || []) operational.push([item.teamId || match.teamId, item]);
}
let linked = 0;
for (const [teamId, item] of operational) {
  if (!item?.canonicalPlayerId) continue;
  linked += 1;
  const player = byId.get(item.canonicalPlayerId);
  check(Boolean(player), `item collegato a giocatore esistente ${item.canonicalPlayerId}`);
  check(norm(item.playerName || item.target) === norm(player.playerName), `nome item canonico ${item.canonicalPlayerId}`);
  if (item.role || item.roleBrief) check(role(item.role || item.roleBrief) === role(player.role), `ruolo item canonico ${item.canonicalPlayerId}`);
  if (teamId && player.teamId === teamId) check(true, `team item coerente ${item.canonicalPlayerId}`);
}
check(linked > 900, 'oltre novecento righe operative collegate canonicamente');

console.log(`Audit ioSudo V755 OK - ${checks.length} controlli superati`);
