#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-runtime.json'));
const archive = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
const manifest = JSON.parse(read('static/fanta-engine/data/sudatori/current/manifest.json'));
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const js = read('static/fanta-engine/js/apps/iosudo-app-v766.js');

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
function allObjects(rootValue) {
  const result = [];
  const stack = [rootValue];
  const seen = new Set();
  while (stack.length) {
    const value = stack.pop();
    if (!value || typeof value !== 'object' || seen.has(value)) continue;
    seen.add(value);
    if (!Array.isArray(value)) result.push(value);
    Object.values(value).forEach((child) => {
      if (child && typeof child === 'object') stack.push(child);
    });
  }
  return result;
}

ok(manifest.version === 'V766', 'manifest versione ' + manifest.version);
ok(manifest.appVersion === 'V766', 'appVersion ' + manifest.appVersion);
ok(manifest.runtimePayloadVersion === 'V766', 'runtimePayloadVersion ' + manifest.runtimePayloadVersion);
ok(data.meta.version === 'V766', 'runtime versione ' + data.meta.version);
ok(archive.meta.version === 'V766', 'archivio versione ' + archive.meta.version);
ok(manifest.sourceFile.includes('v150_'), 'sorgente non V150');

ok(index.includes('iosudo-app-v766.js?v=766'), 'JS V766 non referenziato');
ok(index.includes('iosudo-app-v766.css?v=766'), 'CSS V766 non referenziato');
ok(index.includes('data-iosudo-version="766"'), 'data-iosudo-version non V766');
ok(index.includes('aria-label="Versione applicazione V766">V766</span>'), 'header V766 non aggiornato');
ok(index.includes('<title>ioSudo V766 - Per i SUDATORI</title>'), 'title V766 non aggiornato');
ok(sw.includes("iosudo-shell-v766"), 'cache V766 non aggiornata');
ok(sw.includes('iosudo-app-v766.css?v=766'), 'precache CSS non V766');
ok(sw.includes('iosudo-app-v766.js?v=766'), 'precache JS non V766');

const roster = Object.values(data.playersByTeam || {}).flat();
const rosterById = new Map(roster.map((p) => [String(p.id || ''), p]));
const directory = data.playerDirectory || [];
const players = directory.map((entry) => rosterById.has(String(entry.id || ''))
  ? Object.assign({}, rosterById.get(String(entry.id)), entry)
  : entry);
const byId = new Map(players.map((p) => [String(p.id || ''), p]));
ok(byId.size === players.length, 'ID giocatori duplicati');
ok(new Set(roster.map((p) => p.id)).size === roster.length, 'duplicati nel roster tecnico');

const massimo = byId.get('bologna-pessina-mas');
const matteo = byId.get('monza-pessina-mas');
ok(Boolean(massimo), 'manca Massimo Pessina');
ok(Boolean(matteo), 'manca Matteo Pessina');
ok(massimo.playerName === 'Massimo Pessina', 'nome Massimo errato');
ok(massimo.teamName === 'Bologna', 'squadra Massimo errata');
ok(massimo.role === 'P', 'ruolo Massimo ' + massimo.role);
ok(String(massimo.fantacalcioId || massimo.listone?.fantacalcioId || '') === '7172', 'ID listone Massimo errato');
ok(matteo.playerName === 'Matteo Pessina', 'nome Matteo errato');
ok(matteo.teamName === 'Monza', 'squadra Matteo errata');
ok(matteo.role === 'C', 'ruolo Matteo ' + matteo.role);
ok(!matteo.listone, 'Matteo ha ereditato un record listone');
ok(String(matteo.fantacalcioId || '') !== '7172', 'Matteo ha ereditato ID Fantacalcio di Massimo');
ok(normalize(matteo.originalName) === 'matteo pessina', 'originalName Matteo ambiguo: ' + matteo.originalName);
ok(!(matteo.nameAliasesV755 || []).some((x) => ['pessina', 'pessina mas'].includes(normalize(x))), 'alias ambiguo ancora associato a Matteo');
ok(matteo.formationPosition === 'CC', 'formazione Matteo non CC');

for (const payload of [data, archive]) {
  const objects = allObjects(payload);
  const matteoRows = objects.filter((item) => String(item.id || item.canonicalPlayerId || '') === 'monza-pessina-mas'
    || normalize(item.playerName || item.target || item.name || item.canonicalFullName || '') === 'matteo pessina');
  ok(matteoRows.length > 0, 'nessuna occorrenza Matteo nel payload');
  for (const item of matteoRows) {
    if (item.role != null) ok(item.role === 'C', 'occorrenza Matteo con ruolo ' + item.role);
    if (item.classicRole != null) ok(item.classicRole === 'C', 'occorrenza Matteo classicRole ' + item.classicRole);
    if (item.rosterRole != null) ok(item.rosterRole === 'C', 'occorrenza Matteo rosterRole ' + item.rosterRole);
    if (item.listone) {
      const team = normalize(item.listone.realTeamOriginal || item.listone.realTeam || item.listone.teamName);
      const role = String(item.listone.classicRole || item.listone.role || '').toUpperCase().charAt(0);
      ok(team === 'monza' && role === 'C', 'Matteo collegato al listone Bologna/P');
    }
  }
}

// Regression guard: the weak matcher must not use a team-scoped alias outside its team.
ok(js.includes('if (item.teamOnly && teams.size && !teams.has(entryTeam)) return;'), 'guard teamOnly assente nel matching debole');
ok(js.includes('if (!teamMatches && !roleMatches) return null;'), 'guard conflitto squadra+ruolo assente');
ok(js.includes('function listoneMatchesProtectedPessinaV766'), 'protezione listone Pessina assente');
ok(js.includes('if (!listoneMatchesProtectedPessinaV766(player, listone)) return false;'), 'sameListonePerson non protetto');
ok(js.includes('if (!listoneMatchesProtectedPessinaV766(player, item)) return;'), 'applyListoneToPlayer non protetto');
const displayStart = js.indexOf('function displayRoleForPlayer(player)');
const protectedRolePos = js.indexOf('const protectedRole = protectedRoleForPlayerV766(player);', displayStart);
const listonePos = js.indexOf('const listone = latestListoneFor(player) || player.listone;', displayStart);
ok(displayStart >= 0 && protectedRolePos > displayStart && listonePos > protectedRolePos, 'ruolo protetto non prioritario rispetto al listone');

const listonePath = path.join(root, 'static/fanta-engine/data/shared-assets/current/assets/listoni/2026-07-04.json');
if (fs.existsSync(listonePath)) {
  const listonePayload = JSON.parse(fs.readFileSync(listonePath, 'utf8'));
  const rows = (listonePayload.players || []).filter((p) => normalize(p.playerName || p.name).includes('pessina'));
  ok(rows.length === 1, 'numero Pessina nel listone: ' + rows.length);
  const row = rows[0];
  ok(String(row.fantacalcioId || '') === '7172', 'Pessina listone non è Massimo');
  ok(String(row.classicRole || row.role || '').toUpperCase().charAt(0) === 'P', 'Pessina listone non P');
  ok(normalize(row.realTeamOriginal || row.realTeam) === 'bologna' || normalize(row.realTeamOriginal || row.realTeam) === 'bol', 'Pessina listone non Bologna');
  const protectedMatchForMatteo = normalize(row.realTeamOriginal || row.realTeam) === 'monza'
    && String(row.classicRole || row.role || '').toUpperCase().charAt(0) === 'C';
  ok(!protectedMatchForMatteo, 'regressione: Massimo sarebbe accettato per Matteo');
}

ok(manifest.officialMoves === 447, 'conteggio ufficialità');
ok(manifest.teamTransferTalks === 206, 'conteggio trattative');
ok(manifest.transfermarktRumors === 15, 'conteggio TM');
ok(manifest.injuries === 27, 'conteggio infortuni');
ok(manifest.friendlies === 107, 'conteggio amichevoli');
ok(manifest.friendlyPlayerStats === 550, 'conteggio prestazioni');

console.log(`Audit ioSudo V766 OK - ${checks} controlli superati - Matteo Pessina C, Massimo Pessina P.`);
