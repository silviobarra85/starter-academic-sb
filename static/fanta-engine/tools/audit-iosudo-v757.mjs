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
const dateValue = (value) => {
  const t = Date.parse(String(value || ''));
  return Number.isFinite(t) ? t : 0;
};

const runtime = json('static/fanta-engine/data/sudatori/current/sudatori-runtime.json');
const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
const app = read('static/fanta-engine/js/apps/iosudo-app-v757.js');
const css = read('static/fanta-engine/css/iosudo-app-v757.css');
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

check(manifest.version === 'V757', 'manifest V757');
check(manifest.appVersion === 'V757', 'appVersion V757');
check(runtime.meta?.version === 'V757', 'runtime V757');
check(data.meta?.version === 'V757', 'archive V757');
check(index.includes('iosudo-app-v757.js?v=757'), 'index JS V757');
check(index.includes('iosudo-app-v757.css?v=757'), 'index CSS V757');
check(index.includes('data-iosudo-version="757"'), 'data version V757');
check(sw.includes("iosudo-shell-v757"), 'service worker cache V757');
check(css.length > 10000, 'CSS V757 presente');
check(manifest.sourceFile.includes('v146_'), 'sorgente Excel v146');

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
check(roster.length === 1018, 'rose tecniche deduplicate = 1018');
check(players.length === 1198, 'catalogo unificato = 1198');
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

const akor = byId.get('venezia-akor-adams');
const che = byId.get('listone-6646');
check(akor?.playerName === 'Akor Adams', 'Akor Adams identità corretta');
check(akor?.teamId === 'venezia', 'Akor Adams al Venezia');
check(akor?.role === 'A', 'Akor Adams ruolo A');
check(che?.playerName === 'Che Adams', 'Che Adams identità corretta');
check(che?.teamId === 'torino', 'Che Adams al Torino');
check(che?.role === 'A', 'Che Adams ruolo A');
check(akor.id !== che.id, 'Akor Adams e Che Adams distinti');
check(!byId.has('torino-akor-adams'), 'vecchio ID errato Torino-Akor rimosso');
check(!players.some((p) => norm(p.playerName) === 'adams'), 'nessuna identità generica Adams');

check(byId.has('atalanta-daniel-maldini'), 'Daniel Maldini canonico presente');
check(!byId.has('lazio-daniel-maldini'), 'extra-listone Daniel Maldini assorbito');
check(byId.has('fiorentina-riccardo-sottil'), 'Riccardo Sottil canonico presente');
check(!byId.has('lecce-riccardo-sottil'), 'extra-listone Riccardo Sottil assorbito');
check(byId.get('inter-massolin')?.playerName === 'Yanis Massolin', 'Massolin = Yanis Massolin');
check(!players.some((p) => norm(p.playerName) === 'rabby nzingoula massolin'), 'accorpamento Rabby Nzingoula Massolin assente');

check(manifest.officialMoves === 422, '422 ufficialità');
check(manifest.teamTransferTalks === 225, '225 rumor/trattative attivi');
check(manifest.transfermarktRumors === 14, '14 rumor Transfermarkt attivi');
check(manifest.injuries === 26, '26 SOS attivi');
check(manifest.friendlies === 106, '106 amichevoli');
check(manifest.friendlyMatchDetails === 27, '27 tabellini');
check(manifest.friendlyPlayerStats === 541, '541 prestazioni amichevoli');

const sourceRows = [];
const officialByCanonical = new Map();
for (const [teamId, summary] of Object.entries(runtime.marketSummaryByTeam || {})) {
  for (const key of ['officialIncoming','officialOutgoing','officialRenewals','talksIncoming','talksOutgoing']) {
    for (const item of summary[key] || []) {
      sourceRows.push([key, item]);
      if (key.startsWith('official')) {
        const ids = [...new Set([...(item.canonicalPlayerIds || []), item.canonicalPlayerId].filter(Boolean))];
        for (const id of ids) {
          const dir = key === 'officialOutgoing' ? 'outgoing' : String(item.direction || 'incoming');
          const k = `${teamId}|${dir}|${id}`;
          officialByCanonical.set(k, Math.max(officialByCanonical.get(k) || 0, dateValue(item.date || item.updatedAt)));
        }
      }
    }
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
let invalidOfficialRumors = 0;
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
    if (key.startsWith('talks')) {
      const dir = key === 'talksOutgoing' ? 'outgoing' : 'incoming';
      const officialTime = officialByCanonical.get(`${item.teamId}|${dir}|${id}`) || 0;
      const talkTime = dateValue(item.date || item.updatedAt);
      if (officialTime && officialTime >= talkTime) invalidOfficialRumors += 1;
    }
  }
  linkedRows += 1;
}
check(linkedRows === 1433, 'tutte le 1433 righe operative collegate');
check(invalidOfficialRumors === 0, 'nessun rumor attivo superato da ufficialità');
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

check(app.includes('function buildPlayerCatalogIndexesV757()'), 'motore catalogo indicizzato presente');
check(app.includes("lookupMode: 'player-id-map-o1'"), 'lookup O(1) dichiarato');
check(app.includes("detailMode: 'preindexed-sources-no-global-scan'"), 'dettaglio senza scansione globale');
const detailStart = app.indexOf('function playerDetailModel(player)');
const detailEnd = app.indexOf('function renderPlayerDetailUnsafeV757', detailStart);
const detailBody = app.slice(detailStart, detailEnd);
check(!detailBody.includes('attachMarketRowsForPlayer'), 'dettaglio non esegue attach/scansione mercato');
check(!detailBody.includes('teamInjuries('), 'dettaglio non scansiona infortuni squadra');
check(!detailBody.includes('teamFormation('), 'dettaglio non scansiona formazione squadra');
check(app.includes('function navigateHashV757'), 'navigazione History API presente');
check(!app.includes('window.location.hash = '), 'nessuna assegnazione diretta hash che duplica il render');
check(app.includes("window.addEventListener('popstate'"), 'back/forward gestito');
check(app.includes('function renderPlayerDetailUnsafeV757'), 'render dettaglio isolato');
check(app.includes('[ioSudo V757] errore dettaglio giocatore'), 'error boundary dettaglio presente');

console.log(`Audit ioSudo V757 OK - ${checks.length} controlli superati - lookup ${lookupMs.toFixed(2)} ms`);
