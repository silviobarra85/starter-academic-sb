import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const readText = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const js = readText('static/fanta-engine/js/apps/iosudo-app-v714.js');
const css = readText('static/fanta-engine/css/iosudo-app-v714.css');
const sw = readText('static/iosudo/sw.js');
function assertOk(cond, msg) { if (!cond) { console.error('Audit V714 FAILED:', msg); process.exit(1); } }
const norm = (v) => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const canon = (v) => {
  const n = norm(v);
  const aliases = new Map([
    ['k thuram','khephren thuram'],['thuram k','khephren thuram'],['khephren thuram','khephren thuram'],
    ['n gonzalez','nico gonzalez'],['gonzalez n','nico gonzalez'],['chalobah','trevoh chalobah'],
    ['oulai','christ inao oulai'],['cheddira','walid cheddira'],['gallo','antonino gallo']
  ]);
  return aliases.get(n) || n;
};
const isActiveStatus = (status) => !/(chius|superat|archiv|sfumat|duplicat|storic)/i.test(String(status || ''));
const sumRows = (obj) => Object.values(obj || {}).reduce((a, rows) => a + (rows || []).length, 0);
const countFriendlyStats = () => Object.values(data.friendlyPlayerStatsByMatch || {}).reduce((a, row) => a + (Array.isArray(row?.players) ? row.players.length : Array.isArray(row?.playerStats) ? row.playerStats.length : 0), 0);
assertOk(manifest.version === 'V714', 'manifest non aggiornato a V714');
assertOk(data.meta?.version === 'V714', 'data meta non aggiornata a V714');
assertOk(sw.includes('iosudo-shell-v714'), 'service worker non usa cache V714');
assertOk(sw.includes('iosudo-app-v714.js?v=714'), 'service worker non cachea JS V714');
assertOk(sw.includes('iosudo-app-v714.css?v=714'), 'service worker non cachea CSS V714');
assertOk(js.includes("['k thuram', 'khephren thuram']"), 'alias K. Thuram assente in JS');
assertOk(js.includes('const hasSosInXi = (player && playerHasSos(player))'), 'patch SOS XI dal player assente');
assertOk(js.includes('function renderFriendlyDetail(matchKey, teamId)'), 'renderFriendlyDetail assente');
assertOk(css.includes('iosudo-friendly-badge'), 'CSS badge amichevoli assente');
assertOk((data.teams || []).length === 20, 'teams non sono 20');
assertOk(manifest.players === sumRows(data.playersByTeam), 'conteggio players manifest non coerente');
assertOk(manifest.officialMoves === sumRows(data.officialMovesByTeam), 'conteggio officialMoves manifest non coerente');
assertOk(manifest.teamTransferTalks === sumRows(data.teamTransferTalksByTeam), 'conteggio teamTransferTalks manifest non coerente');
assertOk(manifest.friendlies === sumRows(data.friendliesByTeam), 'conteggio friendlies manifest non coerente');
assertOk(manifest.friendlyPlayerStats === countFriendlyStats(), 'conteggio friendlyPlayerStats manifest non coerente');
const seenExact = new Set(); const seenIds = new Set(); const exactDuplicates = []; const idDuplicates = [];
for (const [teamId, rows] of Object.entries(data.playersByTeam || {})) {
  for (const p of rows || []) {
    const key = [teamId, canon(p.playerName), String(p.role || '').toUpperCase().slice(0, 1)].join('::');
    if (seenExact.has(key)) exactDuplicates.push(key); seenExact.add(key);
    const id = String(p.id || ''); if (!id) idDuplicates.push('missing-id'); else if (seenIds.has(id)) idDuplicates.push(id); seenIds.add(id);
  }
}
assertOk(exactDuplicates.length === 0, 'duplicati esatti in playersByTeam: ' + exactDuplicates.slice(0, 5).join(', '));
assertOk(idDuplicates.length === 0, 'ID giocatori duplicati: ' + idDuplicates.slice(0, 5).join(', '));
assertOk(manifest.duplicateExactPlayers === 0, 'manifest segnala duplicati esatti');
assertOk(manifest.duplicatePlayerIds === 0, 'manifest segnala ID duplicati');
assertOk(manifest.activeOfficialRumors === 0, 'restano rumor attivi per giocatori ufficiali: ' + manifest.activeOfficialRumors);
assertOk((data.activeOfficialRumorsAuditV714 || []).length === 0, 'activeOfficialRumorsAuditV714 non vuoto');
const juvePlayers = data.playersByTeam?.juventus || [];
const thuramPlayer = juvePlayers.find((p) => canon(p.playerName) === 'khephren thuram');
const thuramShort = juvePlayers.filter((p) => norm(p.playerName) === 'k thuram');
const thuramFormation = (data.formationsByTeam?.juventus || []).find((p) => canon(p.playerName) === 'khephren thuram');
const thuramInjury = (data.injuriesByTeam?.juventus || []).find((p) => canon(p.playerName || p.target) === 'khephren thuram' && !/duplicato|superata/i.test(String(p.status || '')));
assertOk(Boolean(thuramPlayer), 'Khephren Thuram non trovato in Juventus');
assertOk(thuramShort.length === 0, 'K. Thuram ancora presente come playerName in rosa Juventus');
assertOk(thuramPlayer.sosFantaFlag === true, 'Khephren Thuram non ha sosFantaFlag nel player');
assertOk(Boolean(thuramFormation && thuramFormation.sosFantaFlag === true), 'Khephren Thuram non ha SOS nella formazione Juventus');
assertOk(Boolean(thuramInjury), 'Khephren Thuram non trovato come infortunio/SOS attivo');
const edOfficial = (data.officialMovesByTeam?.atalanta || []).filter((o) => canon(o.playerName || o.player) === 'ederson' && /ufficiale/i.test(String(o.status || o.statusLabel || '')));
assertOk(edOfficial.length >= 1, 'Ederson rinnovo ufficiale non trovato');
const edTalks = Object.values(data.teamTransferTalksByTeam || {}).flat().filter((t) => canon(t.playerName || t.player || t.target) === 'ederson' && isActiveStatus(t.status || t.statusLabel));
assertOk(edTalks.length === 0, 'Ederson resta nelle trattative attive');
const edTm = (data.transfermarktRumors || []).filter((t) => canon(t.playerName || t.player || t.target) === 'ederson' && isActiveStatus(t.status || t.statusLabel || t.operativeStatus));
assertOk(edTm.length === 0, 'Ederson resta nei rumor TM attivi');
const sassuoloAlta = (data.friendliesByTeam?.sassuolo || []).find((item) => String(item.event || '') === 'Sassuolo-Alta Anaunia');
assertOk(Boolean(sassuoloAlta), 'Sassuolo-Alta Anaunia non trovata');
assertOk(sassuoloAlta.hasPlayerStats === true, 'Sassuolo-Alta Anaunia senza flag hasPlayerStats');
assertOk(Array.isArray(sassuoloAlta.playerStats) && sassuoloAlta.playerStats.length === 26, 'Tabellino Sassuolo-Alta Anaunia non ha 26 righe');
assertOk((data.friendliesFilteredOutV714 || []).length >= 1, 'controllo amichevoli V68 non archiviato');
assertOk(Array.isArray(data.duplicateNameCandidatesV714) && data.duplicateNameCandidatesV714.length === 10, 'lista 10 potenziali duplicati assente');
console.log('Audit ioSudo V714 OK', JSON.stringify({ players: manifest.players, talks: manifest.teamTransferTalks, official: manifest.officialMoves, injuries: manifest.injuries, friendlies: manifest.friendlies, sources: manifest.sources, activeOfficialRumors: manifest.activeOfficialRumors, duplicateExactPlayers: manifest.duplicateExactPlayers, duplicatePlayerIds: manifest.duplicatePlayerIds, duplicateCandidates: manifest.duplicateCandidatesV714 }));
