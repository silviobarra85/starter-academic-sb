import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const readText = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const js = readText('static/fanta-engine/js/apps/iosudo-app-v711.js');
const css = readText('static/fanta-engine/css/iosudo-app-v711.css');
const sw = readText('static/iosudo/sw.js');
function assertOk(cond, msg) { if (!cond) { console.error('Audit V711 FAILED:', msg); process.exit(1); } }
const slug = (v) => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
assertOk(manifest.version === 'V711', 'manifest non aggiornato a V711');
assertOk(data.meta?.version === 'V711', 'data meta non aggiornata a V711');
assertOk(sw.includes('iosudo-shell-v711'), 'service worker non usa cache V711');
assertOk(sw.includes('iosudo-app-v711.js?v=711'), 'service worker non cachea JS V711');
assertOk(sw.includes('iosudo-app-v711.css?v=711'), 'service worker non cachea CSS V711');
assertOk(js.includes('function renderFriendlyDetail(matchKey, teamId)'), 'renderFriendlyDetail assente');
assertOk(css.includes('iosudo-friendly-badge'), 'CSS badge amichevoli assente');
assertOk((data.teams || []).length === 20, 'teams non sono 20');
const seenExact = new Set(); const seenIds = new Set(); const exactDuplicates = []; const idDuplicates = [];
for (const [teamId, rows] of Object.entries(data.playersByTeam || {})) {
  for (const p of rows || []) {
    const key = [teamId, slug(p.playerName), String(p.role || '').toUpperCase().slice(0, 1)].join('::');
    if (seenExact.has(key)) exactDuplicates.push(key); seenExact.add(key);
    const id = String(p.id || ''); if (!id) idDuplicates.push('missing-id'); else if (seenIds.has(id)) idDuplicates.push(id); seenIds.add(id);
  }
}
assertOk(exactDuplicates.length === 0, 'duplicati esatti in playersByTeam: ' + exactDuplicates.slice(0, 5).join(', '));
assertOk(idDuplicates.length === 0, 'ID giocatori duplicati: ' + idDuplicates.slice(0, 5).join(', '));
assertOk(manifest.activeOfficialRumors === 0, 'restano rumor attivi per giocatori ufficiali: ' + manifest.activeOfficialRumors);
assertOk((data.activeOfficialRumorsAuditV711 || []).length === 0, 'activeOfficialRumorsAuditV711 non vuoto');
const sassOfficials = data.officialMovesByTeam?.sassuolo || [];
const muhOff = sassOfficials.find((item) => slug(item.playerName) === 'tarik-muharemovic' && item.direction === 'outgoing' && /sassuolocalcio\.it/.test(String(item.url || item.articleUrl || '')));
assertOk(Boolean(muhOff), 'Ufficialità uscita Muharemovic Sassuolo-Leeds assente');
const sassPlayers = data.playersByTeam?.sassuolo || [];
const muhPlayer = sassPlayers.find((p) => slug(p.playerName).includes('muharemovic'));
assertOk(Boolean(muhPlayer), 'Muharemovic assente dalla rosa storica Sassuolo');
assertOk(muhPlayer.probableXi === false, 'Muharemovic non disattivato da Probabile XI');
assertOk(/ceduto ufficiale|fuori rosa/i.test(String(muhPlayer.marketStatus || '') + ' ' + String(muhPlayer.note || '')), 'Muharemovic non marcato ceduto/fuori rosa');
for (const teamId of ['sassuolo', 'juventus']) {
  const active = (data.teamTransferTalksByTeam?.[teamId] || []).filter((item) => slug(item.playerName || item.target).includes('muharemovic'));
  assertOk(active.length === 0, 'Muharemovic ancora nei rumor attivi ' + teamId + ': ' + active.length);
}
assertOk((data.officialTalksClosedV711 || []).length === 8, 'Trattative chiuse V711 inattese');
const koloActive = (data.teamTransferTalksByTeam?.juventus || []).some((item) => /kolo/.test(slug(item.playerName || item.target)));
const lucumiActive = (data.teamTransferTalksByTeam?.juventus || []).some((item) => /lucumi/.test(slug(item.playerName || item.target)));
assertOk(koloActive, 'Kolo Muani autonomo chiuso per errore');
assertOk(lucumiActive, 'Lucumì autonomo chiuso per errore');
const sassuolo = data.friendliesByTeam?.sassuolo || [];
const sassuoloAlta = sassuolo.find((item) => String(item.event || '') === 'Sassuolo-Alta Anaunia');
assertOk(Boolean(sassuoloAlta), 'Sassuolo-Alta Anaunia non trovata');
assertOk(sassuoloAlta.hasPlayerStats === true, 'Sassuolo-Alta Anaunia senza flag hasPlayerStats');
assertOk(Array.isArray(sassuoloAlta.playerStats) && sassuoloAlta.playerStats.length === 26, 'Tabellino Sassuolo-Alta Anaunia non ha 26 righe');
assertOk(manifest.players === 777, 'Conteggio giocatori inatteso: ' + manifest.players);
assertOk(manifest.officialMoves === 366, 'Conteggio ufficialità inatteso: ' + manifest.officialMoves);
assertOk(manifest.teamTransferTalks === 446, 'Conteggio trattative inatteso: ' + manifest.teamTransferTalks);
assertOk(manifest.injuries === 22, 'Conteggio infortuni inatteso: ' + manifest.injuries);
console.log('Audit ioSudo V711 OK', JSON.stringify({ players: manifest.players, talks: manifest.teamTransferTalks, official: manifest.officialMoves, injuries: manifest.injuries, friendlies: manifest.friendlies, closedV711: (data.officialTalksClosedV711 || []).length, duplicateExact: 0 }));
