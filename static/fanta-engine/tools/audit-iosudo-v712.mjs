import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const readText = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const js = readText('static/fanta-engine/js/apps/iosudo-app-v712.js');
const css = readText('static/fanta-engine/css/iosudo-app-v712.css');
const sw = readText('static/iosudo/sw.js');
function assertOk(cond, msg) { if (!cond) { console.error('Audit V712 FAILED:', msg); process.exit(1); } }
const slug = (v) => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
assertOk(manifest.version === 'V712', 'manifest non aggiornato a V712');
assertOk(data.meta?.version === 'V712', 'data meta non aggiornata a V712');
assertOk(sw.includes('iosudo-shell-v712'), 'service worker non usa cache V712');
assertOk(sw.includes('iosudo-app-v712.js?v=712'), 'service worker non cachea JS V712');
assertOk(sw.includes('iosudo-app-v712.css?v=712'), 'service worker non cachea CSS V712');
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
assertOk((data.activeOfficialRumorsAuditV712 || []).length === 0, 'activeOfficialRumorsAuditV712 non vuoto');
const requiredTalks = [
  ['udinese','Mergim Vojvoda'], ['udinese','Jordan Zemura'], ['udinese','Martin Payero'], ['udinese','Iker Bravo'],
  ['bologna','Jaden Philogene'], ['bologna','Mikel Amondarain'], ['roma','Alan Varela'], ['inter','Ivan Perisic'],
  ['sassuolo','Luca Moro'], ['venezia','Takehiro Tomiyasu'], ['fiorentina','Johan Bakayoko'], ['fiorentina','Oulai'],
  ['como','Chalobah'], ['lazio','John Kennedy'], ['juventus','Gleison Bremer']
];
for (const [teamId, player] of requiredTalks) {
  const hit = (data.teamTransferTalksByTeam?.[teamId] || []).some((item) => slug(item.playerName || item.target).includes(slug(player)) || slug(player).includes(slug(item.playerName || item.target)));
  assertOk(hit, 'trattativa V66 assente: ' + teamId + ' ' + player);
}
const cagliariVojvoda = (data.teamTransferTalksByTeam?.cagliari || []).filter((item) => /vojvoda/.test(slug(item.playerName || item.target)));
assertOk(cagliariVojvoda.length === 0, 'Vojvoda resta attivo nel Cagliari dopo chiusura v66');
assertOk((data.teamTransferTalksClosedV712 || []).some((item) => item.teamId === 'cagliari' && /vojvoda/.test(slug(item.playerName || item.target))), 'Vojvoda Cagliari non archiviato in V712');
assertOk((data.transfermarktRumors || []).length === 48, 'conteggio TM rumors inatteso');
const tmRequired = ['alan-varela','ivan-perisic','jaden-philogene','luca-moro','takehiro-tomiyasu','john-kennedy','jordan-zemura','martin-payero'];
for (const p of tmRequired) {
  assertOk((data.transfermarktRumors || []).some((item) => slug(item.playerName || item.target) === p), 'rumor TM assente: ' + p);
}
const buongiornoPlayer = (data.playersByTeam?.napoli || []).find((p) => /buongiorno/.test(slug(p.playerName)));
const buongiornoFormation = (data.formationsByTeam?.napoli || []).find((p) => /buongiorno/.test(slug(p.playerName)));
const buongiornoInjury = (data.injuriesByTeam?.napoli || []).find((p) => /buongiorno/.test(slug(p.playerName || p.target)));
assertOk(Boolean(buongiornoPlayer && buongiornoPlayer.sosFantaFlag === true), 'Buongiorno non ha sosFantaFlag nel player');
assertOk(Boolean(buongiornoFormation && buongiornoFormation.sosFantaFlag === true), 'Buongiorno non ha sosFantaFlag nella formation');
assertOk(/non ancora confermato/.test(String(buongiornoInjury?.note || '')), 'nota Buongiorno v66 non aggiornata');
const sassuolo = data.friendliesByTeam?.sassuolo || [];
const sassuoloAlta = sassuolo.find((item) => String(item.event || '') === 'Sassuolo-Alta Anaunia');
assertOk(Boolean(sassuoloAlta), 'Sassuolo-Alta Anaunia non trovata');
assertOk(sassuoloAlta.hasPlayerStats === true, 'Sassuolo-Alta Anaunia senza flag hasPlayerStats');
assertOk(Array.isArray(sassuoloAlta.playerStats) && sassuoloAlta.playerStats.length === 26, 'Tabellino Sassuolo-Alta Anaunia non ha 26 righe');
assertOk(manifest.players === 777, 'Conteggio giocatori inatteso: ' + manifest.players);
assertOk(manifest.officialMoves === 366, 'Conteggio ufficialità inatteso: ' + manifest.officialMoves);
assertOk(manifest.teamTransferTalks === 452, 'Conteggio trattative inatteso: ' + manifest.teamTransferTalks);
assertOk(manifest.injuries === 22, 'Conteggio infortuni inatteso: ' + manifest.injuries);
console.log('Audit ioSudo V712 OK', JSON.stringify({ players: manifest.players, talks: manifest.teamTransferTalks, official: manifest.officialMoves, injuries: manifest.injuries, friendlies: manifest.friendlies, transfermarktRumors: manifest.transfermarktRumors, activeOfficialRumors: manifest.activeOfficialRumors, duplicateExact: manifest.duplicateExact, xiSosBadgeFromPlayer: manifest.xiSosBadgeFromPlayer }));
