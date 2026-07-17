import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const readText = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const js = readText('static/fanta-engine/js/apps/iosudo-app-v713.js');
const css = readText('static/fanta-engine/css/iosudo-app-v713.css');
const sw = readText('static/iosudo/sw.js');
function assertOk(cond, msg) { if (!cond) { console.error('Audit V713 FAILED:', msg); process.exit(1); } }
const slug = (v) => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
assertOk(manifest.version === 'V713', 'manifest non aggiornato a V713');
assertOk(data.meta?.version === 'V713', 'data meta non aggiornata a V713');
assertOk(sw.includes('iosudo-shell-v713'), 'service worker non usa cache V713');
assertOk(sw.includes('iosudo-app-v713.js?v=713'), 'service worker non cachea JS V713');
assertOk(sw.includes('iosudo-app-v713.css?v=713'), 'service worker non cachea CSS V713');
assertOk(js.includes('const hasSosInXi = (player && playerHasSos(player))'), 'patch SOS XI dal player assente');
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
assertOk((data.activeOfficialRumorsAuditV713 || []).length === 0, 'activeOfficialRumorsAuditV713 non vuoto');
const hamedPlayer = (data.playersByTeam?.genoa || []).find((p) => slug(p.playerName) === 'hamed-junior-traore');
const hamedInjury = (data.injuriesByTeam?.genoa || []).find((p) => slug(p.playerName || p.target) === 'hamed-junior-traore');
assertOk(Boolean(hamedPlayer), 'Hamed Junior Traorè non trovato in Genoa');
assertOk(hamedPlayer.sosFantaFlag === true, 'Hamed Junior Traorè non ha sosFantaFlag');
assertOk(/transfermarkt/i.test(String(hamedPlayer.injurySource || hamedPlayer.injuryStatus || '')), 'Hamed Junior Traorè non ha fonte/stato TM');
assertOk(Boolean(hamedInjury), 'Hamed Junior Traorè non trovato in injuriesByTeam Genoa');
assertOk(/non ufficiale|bollettino/i.test(String(hamedInjury.note || hamedInjury.sourceVerificationNote || '')), 'Hamed injury non segnato come monitoraggio prudenziale');
const hamedCount = (data.playersByTeam?.genoa || []).filter((p) => slug(p.playerName) === 'hamed-junior-traore').length;
assertOk(hamedCount === 1, 'duplicato Hamed Junior Traorè in rosa Genoa');
const buongiornoPlayer = (data.playersByTeam?.napoli || []).find((p) => /buongiorno/.test(slug(p.playerName)));
const buongiornoFormation = (data.formationsByTeam?.napoli || []).find((p) => /buongiorno/.test(slug(p.playerName)));
assertOk(Boolean(buongiornoPlayer && buongiornoPlayer.sosFantaFlag === true), 'Buongiorno non ha sosFantaFlag nel player');
assertOk(Boolean(buongiornoFormation && buongiornoFormation.sosFantaFlag === true), 'Buongiorno non ha sosFantaFlag nella formation');
const sassuolo = data.friendliesByTeam?.sassuolo || [];
const sassuoloAlta = sassuolo.find((item) => String(item.event || '') === 'Sassuolo-Alta Anaunia');
assertOk(Boolean(sassuoloAlta), 'Sassuolo-Alta Anaunia non trovata');
assertOk(sassuoloAlta.hasPlayerStats === true, 'Sassuolo-Alta Anaunia senza flag hasPlayerStats');
assertOk(Array.isArray(sassuoloAlta.playerStats) && sassuoloAlta.playerStats.length === 26, 'Tabellino Sassuolo-Alta Anaunia non ha 26 righe');
assertOk((data.friendliesFilteredOutV713 || []).some((item) => /calendario amichevoli sky/i.test(String(item.event || ''))), 'controllo amichevoli Sky v67 non archiviato');
assertOk(manifest.players === 777, 'Conteggio giocatori inatteso: ' + manifest.players);
assertOk(manifest.officialMoves === 366, 'Conteggio ufficialità inatteso: ' + manifest.officialMoves);
assertOk(manifest.teamTransferTalks === 452, 'Conteggio trattative inatteso: ' + manifest.teamTransferTalks);
assertOk(manifest.injuries === 23, 'Conteggio infortuni inatteso: ' + manifest.injuries);
assertOk(manifest.friendlies === 117, 'Conteggio amichevoli inatteso: ' + manifest.friendlies);
assertOk(manifest.sources === 629, 'Conteggio fonti inatteso: ' + manifest.sources);
console.log('Audit ioSudo V713 OK', JSON.stringify({ players: manifest.players, talks: manifest.teamTransferTalks, official: manifest.officialMoves, injuries: manifest.injuries, friendlies: manifest.friendlies, sources: manifest.sources, activeOfficialRumors: manifest.activeOfficialRumors, duplicateExact: manifest.duplicateExact, xiSosBadgeFromPlayer: manifest.xiSosBadgeFromPlayer }));
