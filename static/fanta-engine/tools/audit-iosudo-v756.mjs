import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));
const fail = (message) => { throw new Error(message); };
const checks = [];
const check = (condition, label) => { if (!condition) fail(label); checks.push(label); };
const norm = (value) => String(value || '').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

const runtime = json('static/fanta-engine/data/sudatori/current/sudatori-runtime.json');
const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
const app = read('static/fanta-engine/js/apps/iosudo-app-v756.js');
const css = read('static/fanta-engine/css/iosudo-app-v756.css');
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

check(manifest.version === 'V756', 'manifest V756');
check(manifest.appVersion === 'V756', 'appVersion V756');
check(runtime.meta?.version === 'V756', 'runtime V756');
check(data.meta?.version === 'V756', 'archive V756');
check(index.includes('iosudo-app-v756.js?v=756'), 'index JS V756');
check(index.includes('iosudo-app-v756.css?v=756'), 'index CSS V756');
check(index.includes('data-iosudo-version="756"'), 'data version V756');
check(sw.includes("iosudo-shell-v756"), 'service worker cache V756');
check(css.length > 10000, 'CSS V756 presente');

const roster = Object.values(runtime.playersByTeam || {}).flat();
const rosterById = new Map(roster.map((p) => [String(p.id || ''), p]));
const directory = runtime.playerDirectory || [];
const players = directory.map((entry) => rosterById.get(String(entry.id || '')) || entry);
const byId = new Map();
const byName = new Map();
for (const player of players) {
  check(Boolean(player?.id), 'ID catalogo presente');
  if (byId.has(player.id)) fail(`ID catalogo duplicato: ${player.id}`);
  byId.set(player.id, player);
  const key = norm(player.playerName || player.canonicalFullName);
  if (!key) fail(`Nome vuoto: ${player.id}`);
  if (byName.has(key)) fail(`Nome visualizzato duplicato: ${key} -> ${byName.get(key)}, ${player.id}`);
  byName.set(key, player.id);
}
check(roster.length === 1020, 'rose tecniche deduplicate = 1020');
check(players.length === 1182, 'catalogo unificato = 1182');
check(players.length === manifest.players, 'catalogo = manifest.players');
check(byId.size === manifest.playerDirectoryPlayers, 'ID catalogo = manifest');
check(directory.filter((x) => Object.keys(x).length === 1 && x.id).length === roster.length,
  'directory runtime compatta: rose referenziate per ID');

const listonePlayers = players.filter((p) => p.fantacalcioId || p.listone?.fantacalcioId);
const fantaIds = new Set();
for (const player of listonePlayers) {
  const fid = String(player.fantacalcioId || player.listone?.fantacalcioId || '');
  if (!fid) continue;
  if (fantaIds.has(fid)) fail(`ID Fantacalcio duplicato nel catalogo: ${fid}`);
  fantaIds.add(fid);
  const listRole = String(player.listone?.classicRole || player.listone?.role || '').charAt(0).toUpperCase();
  if (listRole) check(String(player.role || '').charAt(0).toUpperCase() === listRole,
    `ruolo listone autorevole ${fid}/${player.playerName}`);
}
check(fantaIds.size === 663, 'tutte le 663 righe del listone rappresentate una volta');

const sourceRows = [];
for (const summary of Object.values(runtime.marketSummaryByTeam || {})) {
  for (const key of ['officialIncoming','officialOutgoing','officialRenewals','talksIncoming','talksOutgoing']) {
    for (const item of summary[key] || []) sourceRows.push([key, item]);
  }
}
for (const rows of Object.values(runtime.injuriesByTeam || {})) for (const item of rows || []) sourceRows.push(['injuries', item]);
for (const rows of Object.values(runtime.formationsByTeam || {})) for (const item of rows || []) sourceRows.push(['formations', item]);
for (const match of Object.values(runtime.friendlyPlayerStatsByMatch || {})) {
  for (const item of match.players || []) {
    const role = String(item.role || '').trim().charAt(0).toUpperCase();
    const name = String(item.playerName || item.target || '').trim();
    if (!['P', 'D', 'C', 'A'].includes(role) || /^autogol\b/i.test(name)) continue;
    sourceRows.push(['friendlies', item]);
  }
}

const sourceIndex = new Map(players.map((p) => [p.id, { talks: [], officialIn: [], officialOut: [], injuries: [], formations: [], friendlies: [] }]));
let linkedRows = 0;
for (const [key, item] of sourceRows) {
  const ids = [...new Set([...(item.canonicalPlayerIds || []), item.canonicalPlayerId].filter(Boolean))];
  check(ids.length > 0, `riga sorgente collegata: ${key}/${item.playerName || item.target || ''}`);
  for (const id of ids) {
    check(byId.has(id), `canonicalPlayerId esistente: ${id}`);
    const bucket = sourceIndex.get(id);
    const bucketKey = key.startsWith('talks') ? 'talks'
      : key === 'officialOutgoing' ? 'officialOut'
      : key.startsWith('official') ? 'officialIn' : key;
    bucket[bucketKey].push(item);
  }
  linkedRows += 1;
}
check(linkedRows === 1228, 'tutte le 1228 righe operative collegate');
check(sourceIndex.size === players.length, 'indice sorgenti creato per ogni giocatore');

const start = performance.now();
let hitCount = 0;
const ids = [...byId.keys()];
for (let i = 0; i < 250000; i += 1) {
  const id = ids[i % ids.length];
  if (byId.get(id) && sourceIndex.get(id)) hitCount += 1;
}
const lookupMs = performance.now() - start;
check(hitCount === 250000, '250000 lookup dettaglio completati');
check(lookupMs < 1500, `lookup indicizzato rapido (${lookupMs.toFixed(2)} ms)`);

const massolin = byId.get('inter-massolin');
check(massolin?.playerName === 'Yanis Massolin', 'Massolin = Yanis Massolin');
check(massolin?.role === 'C', 'Yanis Massolin ruolo C');
check(!players.some((p) => norm(p.playerName) === 'rabby nzingoula massolin'), 'accorpamento Rabby Nzingoula Massolin assente');
check(byId.get('lecce-coulibaly-w')?.playerName === 'Lassana Coulibaly', 'Lassana Coulibaly disambiguato');
check(byId.get('sassuolo-coulibaly-w')?.playerName === 'Woyo Coulibaly', 'Woyo Coulibaly disambiguato');
check(byId.get('juventus-kostic')?.playerName === 'Filip Kostić', 'Filip Kostic protetto');
check(byId.get('milan-kostic')?.playerName === 'Andrej Kostić', 'Andrej Kostić protetto');
check(byId.get('bologna-pessina-mas')?.playerName === 'Massimo Pessina', 'Massimo Pessina protetto');
check(byId.get('monza-pessina-mas')?.playerName === 'Matteo Pessina', 'Matteo Pessina protetto');

check(app.includes('function buildPlayerCatalogIndexesV756()'), 'motore catalogo indicizzato presente');
check(app.includes("lookupMode: 'player-id-map-o1'"), 'lookup O(1) dichiarato');
check(app.includes("detailMode: 'preindexed-sources-no-global-scan'"), 'dettaglio senza scansione globale');
const detailStart = app.indexOf('function playerDetailModel(player)');
const detailEnd = app.indexOf('function renderPlayerDetailUnsafeV756', detailStart);
const detailBody = app.slice(detailStart, detailEnd);
check(!detailBody.includes('attachMarketRowsForPlayer'), 'dettaglio non esegue attach/scansione mercato');
check(!detailBody.includes('teamInjuries('), 'dettaglio non scansiona infortuni squadra');
check(!detailBody.includes('teamFormation('), 'dettaglio non scansiona formazione squadra');
check(app.includes('function navigateHashV756'), 'navigazione History API presente');
check(!app.includes('window.location.hash = '), 'nessuna assegnazione diretta hash che duplica il render');
check(app.includes("window.addEventListener('popstate'"), 'back/forward gestito');
check(app.includes('function renderPlayerDetailUnsafeV756'), 'render dettaglio isolato');
check(app.includes("[ioSudo V756] errore dettaglio giocatore"), 'error boundary dettaglio presente');
check(!app.includes('V723: non materializza più i giocatori presenti solo nel listone'), 'esclusione listone-only rimossa');
check(!app.includes('addMarketOnlyPlayersToFastRows(rows, seen);'), 'materializzazione mercato runtime legacy rimossa');

console.log(`Audit ioSudo V756 OK - ${checks.length} controlli superati - lookup ${lookupMs.toFixed(2)} ms`);
