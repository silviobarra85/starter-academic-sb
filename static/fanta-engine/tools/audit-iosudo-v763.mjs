import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));
const fail = (message) => { throw new Error(message); };
const checks = [];
const check = (condition, label) => { if (!condition) fail(label); checks.push(label); };
const norm = (value) => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const runtime = json('static/fanta-engine/data/sudatori/current/sudatori-runtime.json');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
const html = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const js = read('static/fanta-engine/js/apps/iosudo-app-v763.js');
const css = read('static/fanta-engine/css/iosudo-app-v763.css');

check(manifest.version === 'V763', 'manifest V763');
check(runtime.meta?.version === 'V763', 'runtime V763');
check(data.meta?.version === 'V763', 'archivio V763');
check(manifest.appVersion === 'V763', 'appVersion V763');
check(manifest.sourceFile === 'v149_2026-07-23_fantacalcio_serie_a_2026_27_iosudo_v762_aggiornato_0700.xlsx', 'sorgente Excel V149');
check(manifest.updatedAt === '2026-07-23' && manifest.updatedAtTime === '07:00 CEST', 'cutoff 23/07/2026 07:00 CEST');
check(html.includes('iosudo-app-v763.js?v=763'), 'index punta al JS V763');
check(html.includes('iosudo-app-v763.css?v=763'), 'index punta al CSS V763');
check(html.includes('data-iosudo-version="763"'), 'versione HTML 763');
check(sw.includes("iosudo-shell-v763"), 'cache PWA V763');
check(sw.includes('iosudo-app-v763.js?v=763') && sw.includes('iosudo-app-v763.css?v=763'), 'precache asset V763');
check(js.length > 150000 && css.length > 20000, 'asset applicativi completi');

const roster = Object.values(runtime.playersByTeam || {}).flat();
const directory = runtime.playerDirectory || [];
const byId = new Map(directory.map((player) => [player.id, player]));
check(roster.length === 1019 && roster.length === manifest.rosterPlayers, '1019 giocatori nelle rose tecniche');
check(directory.length === 1199 && directory.length === manifest.players, '1199 persone nel catalogo deduplicato');
check(manifest.displayPlayers === 1199 && manifest.playerDirectoryPlayers === 1199, 'conteggi catalogo coerenti');

const directoryIds = new Set();
const displayNames = new Set();
for (const player of directory) {
  check(Boolean(player.id), `ID presente per ${player.playerName || 'giocatore'}`);
  if (directoryIds.has(player.id)) fail(`ID catalogo duplicato: ${player.id}`);
  directoryIds.add(player.id);
  const name = norm(player.playerName);
  if (name && displayNames.has(name)) fail(`Nome catalogo duplicato: ${player.playerName}`);
  if (name) displayNames.add(name);
}
check(directoryIds.size === directory.length, 'ID catalogo univoci');
check(displayNames.size === directory.length, 'nomi visualizzati catalogo univoci');

const rosterIds = new Set();
const rosterExact = new Set();
for (const player of roster) {
  if (rosterIds.has(player.id)) fail(`ID rosa duplicato: ${player.id}`);
  rosterIds.add(player.id);
  const key = [player.teamId, norm(player.playerName), norm(player.role)].join('|');
  if (rosterExact.has(key)) fail(`Duplicato esatto rosa: ${key}`);
  rosterExact.add(key);
}
check(rosterIds.size === roster.length, 'ID rosa univoci');

const massimo = byId.get('bologna-pessina-mas');
const matteo = byId.get('monza-pessina-mas');
check(Boolean(massimo) && massimo.playerName === 'Massimo Pessina' && massimo.teamId === 'bologna' && massimo.role === 'P', 'Massimo Pessina portiere Bologna');
check(Boolean(matteo) && matteo.playerName === 'Matteo Pessina' && matteo.teamId === 'monza' && matteo.role === 'C', 'Matteo Pessina centrocampista Monza');
check(massimo.id !== matteo.id, 'Pessina con ID distinti');
check(!directory.some((p) => norm(p.playerName) === 'pessina mas'), 'nessun Pessina Mas. ambiguo nel catalogo');
check(massimo.identityProtectedV763 === true && matteo.identityProtectedV763 === true, 'protezione strutturale Pessina attiva');

const aleksandar = byId.get('inter-a-stankovic');
const filip = byId.get('venezia-filip-stankovic') || directory.find((p) => p.teamId === 'venezia' && norm(p.playerName) === 'filip stankovic');
check(Boolean(aleksandar) && aleksandar.playerName === 'Aleksandar Stankovic' && aleksandar.teamId === 'inter' && aleksandar.role === 'C', 'Aleksandar Stankovic unico nell’Inter');
check(!byId.has('official-aleksandar-stankovic'), 'duplicato virtuale Aleksandar Stankovic rimosso');
check(Boolean(filip) && filip.playerName === 'Filip Stankovic' && filip.role === 'P', 'Filip Stankovic resta distinto');
check(aleksandar.id !== filip.id, 'Stankovic con ID distinti');

const che = byId.get('listone-6646');
const akor = byId.get('venezia-akor-adams');
check(Boolean(che) && che.playerName === 'Che Adams' && che.teamId === 'torino', 'Che Adams Torino');
check(Boolean(akor) && akor.playerName === 'Akor Adams' && akor.teamId === 'venezia', 'Akor Adams Venezia');
check(che.id !== akor.id, 'Adams distinti');
const giovaneAta = byId.get('atalanta-giovane-atalanta');
const giovaneNap = byId.get('napoli-giovane-napoli');
check(giovaneAta?.playerName === 'Samuel Giovane' && giovaneAta.role === 'C', 'Samuel Giovane Atalanta C');
check(giovaneNap?.playerName === 'Giovane Santana do Nascimento' && giovaneNap.role === 'A', 'Giovane Santana do Nascimento Napoli A');
check(giovaneAta.id !== giovaneNap.id, 'Giovane distinti');
check(byId.get('milan-yunus-musah')?.teamId === 'milan', 'Yunus Musah associato al Milan');
check(byId.get('inter-massolin')?.playerName === 'Yanis Massolin', 'Massolin canonicalizzato come Yanis Massolin');
check(byId.get('juventus-kostic')?.playerName === 'Filip Kostić', 'Filip Kostic Juventus distinto');
check(byId.get('milan-kostic')?.playerName === 'Andrej Kostić', 'Andrej Kostić Milan distinto');

const carlos = byId.get('market-carlos-espi');
const mitaj = byId.get('market-mario-mitaj');
check(Boolean(carlos) && carlos.playerName === 'Carlos Espí' && carlos.role === 'A' && carlos.catalogOnly === true, 'Carlos Espí aggiunto dalle trattative');
check(Boolean(mitaj) && mitaj.playerName === 'Mario Mitaj' && mitaj.role === 'D' && mitaj.catalogOnly === true, 'Mario Mitaj aggiunto dalle trattative');

const summary = runtime.marketSummaryByTeam || {};
const hasTalk = (teamId, bucket, name, date) => (summary[teamId]?.[bucket] || []).some((row) => norm(row.playerName) === norm(name) && row.date === date);
check(hasTalk('milan', 'talksOutgoing', 'Francesco Camarda', '2026-07-23'), 'rumor Camarda aggiornato');
check(hasTalk('lazio', 'talksIncoming', 'Carlos Espí', '2026-07-23'), 'rumor Carlos Espí Lazio');
check(hasTalk('bologna', 'talksIncoming', 'Carlos Espí', '2026-07-23'), 'rumor Carlos Espí Bologna');
check(hasTalk('genoa', 'talksIncoming', 'Mario Mitaj', '2026-07-23'), 'rumor Mario Mitaj Genoa');
check(hasTalk('inter', 'talksIncoming', 'Cristian Romero', '2026-07-23'), 'rumor Cristian Romero Inter');
check(hasTalk('fiorentina', 'talksIncoming', 'Tolu Arokodare', '2026-07-23'), 'rumor Arokodare Fiorentina');
check(hasTalk('genoa', 'talksIncoming', 'Tolu Arokodare', '2026-07-23'), 'rumor Arokodare Genoa');
check(hasTalk('bologna', 'talksOutgoing', 'Riccardo Orsolini', '2026-07-23'), 'rumor Orsolini aggiornato');
check(hasTalk('lecce', 'talksOutgoing', 'Lameck Banda', '2026-07-23'), 'rumor Banda aggiornato');
const romaTalks = [...(summary.roma?.talksIncoming || []), ...(summary.roma?.talksOutgoing || [])];
check(!romaTalks.some((row) => norm(row.playerName).includes('summerville')), 'Summerville escluso dai rumor attivi Roma');

const lucca = (runtime.injuriesByTeam?.napoli || []).find((row) => norm(row.playerName) === 'lorenzo lucca');
check(Boolean(lucca) && lucca.date === '2026-07-23', 'Lorenzo Lucca aggiornato al 23 luglio');
check(norm(lucca?.injuryDetail).includes('distorsione') && norm(lucca?.injuryDetail).includes('caviglia'), 'diagnosi Lucca: distorsione alla caviglia');
check(String(lucca?.url || '').includes('sport.sky.it'), 'fonte Sky per Lucca');

const napoliArezzo = runtime.friendlyPlayerStatsByMatch?.['napoli 2026 07 22 napoli arezzo'];
check(Boolean(napoliArezzo) && napoliArezzo.players?.length === 24, 'Napoli-Arezzo con 24 giocatori');
check(napoliArezzo?.totals?.players === 24 && napoliArezzo?.totals?.used === 24, 'totali Napoli-Arezzo coerenti');

check(manifest.officialMoves === 422, '422 ufficialità sorgente');
check(manifest.teamTransferTalks === 229, '229 trattative attive');
check(manifest.transfermarktRumors === 14, '14 rumor Transfermarkt');
check(manifest.injuries === 26, '26 SOS attivi');
check(manifest.friendlies === 106, '106 amichevoli');
check(manifest.friendlyMatchDetails === 27, '27 tabellini');
check(manifest.friendlyPlayerStats === 551, '551 prestazioni individuali');
check(manifest.sources === 828 && (data.sources || []).length === 828, '828 fonti deduplicate');
check(manifest.duplicateIds === 0 && manifest.duplicatesExact === 0, 'manifest senza duplicati');
check(manifest.playersDuplicateAuditV763?.duplicateDirectoryDisplayNames === 0, 'audit nomi catalogo senza duplicati');
check(manifest.playersDuplicateAuditV763?.pessinaProtected === true, 'audit protezione Pessina');
check(manifest.playersDuplicateAuditV763?.stankovicMerged === true, 'audit fusione Aleksandar Stankovic');
check(manifest.playersDuplicateAuditV763?.newAmbiguousCases === 0, 'nessun nuovo caso ambiguo');

console.log(`Audit ioSudo V763 OK - ${checks.length} controlli superati`);
