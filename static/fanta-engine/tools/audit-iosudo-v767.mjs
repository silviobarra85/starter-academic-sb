#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const runtime = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-runtime.json'));
const archive = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
const manifest = JSON.parse(read('static/fanta-engine/data/sudatori/current/manifest.json'));
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const js = read('static/fanta-engine/js/apps/iosudo-app-v767.js');

let checks = 0;
function ok(condition, message) {
  checks += 1;
  if (!condition) throw new Error(message);
}
function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}
function roleOf(player) {
  return String(player?.role || player?.classicRole || player?.rosterRole || '').toUpperCase().charAt(0);
}

ok(manifest.version === 'V767', `manifest versione ${manifest.version}`);
ok(manifest.appVersion === 'V767', `appVersion ${manifest.appVersion}`);
ok(manifest.runtimePayloadVersion === 'V767', `runtimePayloadVersion ${manifest.runtimePayloadVersion}`);
ok(runtime.meta?.version === 'V767', `runtime versione ${runtime.meta?.version}`);
ok(archive.meta?.version === 'V767', `archivio versione ${archive.meta?.version}`);
ok(String(manifest.sourceFile || '').includes('v151_'), 'sorgente non V151');
ok(String(manifest.updatedAtTime || '').includes('18:25'), 'cutoff manifest non 18:25');

ok(index.includes('<title>ioSudo V767 - Per i SUDATORI</title>'), 'title V767 non aggiornato');
ok(index.includes('data-iosudo-version="767"'), 'data-iosudo-version non V767');
ok(index.includes('aria-label="Versione applicazione V767">V767</span>'), 'header visibile non V767');
ok(index.includes('iosudo-app-v767.js?v=767'), 'JS V767 non referenziato');
ok(index.includes('iosudo-app-v767.css?v=767'), 'CSS V767 non referenziato');
ok(sw.includes("iosudo-shell-v767"), 'cache V767 non aggiornata');
ok(sw.includes('iosudo-app-v767.js?v=767'), 'precache JS non V767');
ok(sw.includes('iosudo-app-v767.css?v=767'), 'precache CSS non V767');

const roster = Object.values(runtime.playersByTeam || {}).flat();
const rosterById = new Map(roster.map((p) => [String(p.id || ''), p]));
const players = (runtime.playerDirectory || []).map((entry) => {
  const full = Object.assign({}, rosterById.get(String(entry.id || '')) || {}, entry);
  return full;
});
const byId = new Map(players.map((p) => [String(p.id || ''), p]));
ok(byId.size === players.length, 'ID giocatori duplicati nel catalogo');
ok(new Set(roster.map((p) => String(p.id || ''))).size === roster.length, 'ID duplicati nel roster tecnico');

const names = new Map();
for (const player of players) {
  const name = normalize(player.playerName);
  if (!name) continue;
  if (!names.has(name)) names.set(name, []);
  names.get(name).push(player.id);
}
const duplicateNames = [...names.entries()].filter(([, ids]) => ids.length > 1);
ok(duplicateNames.length === 0, `nomi visualizzati duplicati: ${JSON.stringify(duplicateNames)}`);

const fantaIds = new Map();
for (const player of players) {
  const id = player.fantacalcioId || player.listone?.fantacalcioId || player.idFantacalcio;
  if (id == null || id === '') continue;
  const key = String(id);
  if (!fantaIds.has(key)) fantaIds.set(key, []);
  fantaIds.get(key).push(player.id);
}
const duplicateFantaIds = [...fantaIds.entries()].filter(([, ids]) => new Set(ids).size > 1);
ok(duplicateFantaIds.length === 0, `ID Fantacalcio duplicati: ${JSON.stringify(duplicateFantaIds)}`);

// Romagnoli: una sola persona e una sola trattativa attiva pubblicata.
const romagnoliPlayers = players.filter((p) => normalize(p.playerName).includes('romagnoli'));
ok(romagnoliPlayers.length === 1, `giocatori Romagnoli: ${romagnoliPlayers.length}`);
ok(romagnoliPlayers[0]?.id === 'lazio-alessio-romagnoli', 'ID Romagnoli non canonico');
ok(romagnoliPlayers[0]?.playerName === 'Alessio Romagnoli', 'nome Romagnoli non completo');
ok(romagnoliPlayers[0]?.teamId === 'lazio', 'Romagnoli non associato alla Lazio');
ok(roleOf(romagnoliPlayers[0]) === 'D', `ruolo Romagnoli ${roleOf(romagnoliPlayers[0])}`);
const romagnoliTalks = (archive.teamTransferTalks || []).filter((x) => x.canonicalPlayerId === 'lazio-alessio-romagnoli');
ok(romagnoliTalks.length === 1, `trattative attive Romagnoli: ${romagnoliTalks.length}`);
ok(!(archive.teamTransferTalks || []).some((x) => normalize(x.playerName) === 'romagnoli'), 'trattativa con solo cognome Romagnoli');

// Altro duplicato certo trovato nel V151: Christian Comotto.
ok(!byId.has('official-christian-comotto'), 'vecchio duplicato official-christian-comotto ancora presente');
const comotto = byId.get('milan-comotto');
ok(Boolean(comotto), 'manca Christian Comotto canonico');
ok(comotto?.playerName === 'Christian Comotto', `nome Comotto ${comotto?.playerName}`);
ok(roleOf(comotto) === 'C', `ruolo Comotto ${roleOf(comotto)}`);
const allCanonicalIds = new Set(players.map((p) => String(p.id || '')));
for (const row of archive.teamTransferTalks || []) {
  ok(allCanonicalIds.has(String(row.canonicalPlayerId || '')), `trattativa senza identità: ${row.playerName}`);
  ok(row.canonicalPlayerId !== 'official-christian-comotto', 'trattativa ancora collegata al duplicato Comotto');
}

// Duplicati operativi nelle trattative attive.
const talkKeys = new Set();
for (const row of archive.teamTransferTalks || []) {
  const key = [row.teamId, row.canonicalPlayerId, row.direction, row.date, row.url].join('|');
  ok(!talkKeys.has(key), `trattativa duplicata: ${key}`);
  talkKeys.add(key);
}

// Protezioni identità già consolidate.
const massimo = byId.get('bologna-pessina-mas');
const matteo = byId.get('monza-pessina-mas');
ok(massimo?.playerName === 'Massimo Pessina' && roleOf(massimo) === 'P', 'Massimo Pessina non Bologna/P');
ok(matteo?.playerName === 'Matteo Pessina' && roleOf(matteo) === 'C', 'Matteo Pessina non Monza/C');
ok(byId.get('venezia-akor-adams')?.playerName === 'Akor Adams', 'Akor Adams non protetto');
ok(byId.get('listone-6646')?.playerName === 'Che Adams', 'Che Adams non protetto');
ok(byId.get('atalanta-giovane-atalanta')?.playerName === 'Samuel Giovane', 'Samuel Giovane non protetto');
ok(byId.get('napoli-giovane-napoli')?.playerName === 'Giovane Santana do Nascimento', 'Giovane Napoli non protetto');
ok(byId.get('milan-yunus-musah')?.teamId === 'milan', 'Yunus Musah non associato al Milan');

ok(byId.get('market-fedde-leysen')?.playerName === 'Fedde Leysen', 'manca Fedde Leysen');
ok(byId.get('market-lorenzo-pirola')?.playerName === 'Lorenzo Pirola', 'manca Lorenzo Pirola');
ok((archive.injuries || []).some((x) => x.canonicalPlayerId === 'roma-pisilli'), 'manca infortunio Pisilli');
ok(!(archive.teamTransferTalks || []).some((x) => normalize(x.playerName).includes('garnacho') && x.teamId === 'roma'), 'Garnacho ancora attivo per la Roma');
const romaTrastevere = (archive.friendlies || []).filter((x) => x.teamId === 'roma' && normalize(x.event || x.playerName) === 'roma trastevere');
ok(romaTrastevere.length === 1, `Roma-Trastevere duplicata: ${romaTrastevere.length}`);

ok(manifest.players === players.length, 'conteggio manifest giocatori');
ok(manifest.counts?.rosterPlayers === roster.length, 'conteggio roster manifest');
ok(manifest.officialMoves === 447, 'conteggio ufficialità');
ok(manifest.teamTransferTalks === (archive.teamTransferTalks || []).length, 'conteggio trattative');
ok(manifest.teamTransferTalks === 199, `trattative attese 199, trovate ${manifest.teamTransferTalks}`);
ok(manifest.transfermarktRumors === 15, 'conteggio rumor Transfermarkt');
ok(manifest.injuries === 28, 'conteggio infortuni');
ok(manifest.friendlies === 107, 'conteggio amichevoli');
ok(manifest.friendlyPlayerStats === 550, 'conteggio prestazioni');
ok(manifest.sources === 827, `conteggio fonti ${manifest.sources}`);
ok(manifest.duplicateAuditV767?.romagnoliPlayers?.length === 1, 'audit manifest Romagnoli incoerente');
ok(manifest.duplicateAuditV767?.confirmedMerge?.['official-christian-comotto'] === 'milan-comotto', 'redirect Comotto assente');

// Regression guard della correzione Pessina nel runtime.
ok(js.includes('function listoneMatchesProtectedPessinaV767'), 'protezione listone Pessina assente in V767');
ok(js.includes('const protectedRole = protectedRoleForPlayerV767(player);'), 'ruolo protetto Pessina assente in V767');

console.log(`Audit ioSudo V767 OK - ${checks} controlli superati - giocatori ${players.length}, roster ${roster.length}, Romagnoli unico, Comotto deduplicato.`);
