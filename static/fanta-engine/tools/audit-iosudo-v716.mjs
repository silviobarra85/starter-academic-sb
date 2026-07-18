
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const readText = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const js = readText('static/fanta-engine/js/apps/iosudo-app-v716.js');
const css = readText('static/fanta-engine/css/iosudo-app-v716.css');
const sw = readText('static/iosudo/sw.js');
function assertOk(cond, msg) { if (!cond) { console.error('Audit V716 FAILED:', msg); process.exit(1); } }
const norm = (v) => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const aliases = new Map([
 ['k thuram','khephren thuram'],['thuram k','khephren thuram'],['khephren thuram','khephren thuram'],
 ['n gonzalez','nico gonzalez'],['gonzalez n','nico gonzalez'],['nico gonzalez','nico gonzalez'],
 ['chalobah','trevoh chalobah'],['trevoh chalobah','trevoh chalobah'],['oulai','christ inao oulai'],['christ inao oulai','christ inao oulai'],
 ['gallo','antonino gallo'],['antonino gallo','antonino gallo'],['cheddira','walid cheddira'],['walid cheddira','walid cheddira'],
 ['nicolussi caviglia','hans nicolussi caviglia'],['hans nicolussi caviglia','hans nicolussi caviglia'],['y fofana','youssouf fofana'],['fofana y','youssouf fofana'],['youssouf fofana','youssouf fofana'],
 ['d berardi','domenico berardi'],['berardi d','domenico berardi'],['domenico berardi','domenico berardi'],['m kone','manu kone'],['kone m','manu kone'],['manu kone','manu kone'],['l moro','luca moro'],['moro l','luca moro'],['luca moro','luca moro'],
 ['vojvoda','mergim vojvoda'],['mergim vojvoda','mergim vojvoda'],['zaniolo','nicolo zaniolo'],['nicolo zaniolo','nicolo zaniolo'],['celik','zeki celik'],['zeki celik','zeki celik'],['valdepenas','victor valdepenas'],['victor valdepenas','victor valdepenas'],['soule','matias soule'],['matias soule','matias soule'],['pinamonti','andrea pinamonti'],['andrea pinamonti','andrea pinamonti'],['pulisic','christian pulisic'],['christian pulisic','christian pulisic'],['ricci','samuele ricci'],['samuele ricci','samuele ricci'],['rabiot','adrien rabiot'],['adrien rabiot','adrien rabiot'],['tomori','fikayo tomori'],['fikayo tomori','fikayo tomori']
]);
const canon = (v) => aliases.get(norm(v)) || norm(v);
const isActiveStatus = (status) => !/(chius|superat|archiv|sfumat|duplicat|storic)/i.test(String(status || ''));
const sumRows = (obj) => Object.values(obj || {}).reduce((a, rows) => a + (rows || []).length, 0);
const countFriendlyStats = () => Object.values(data.friendlyPlayerStatsByMatch || {}).reduce((a, row) => a + (Array.isArray(row?.players) ? row.players.length : Array.isArray(row?.playerStats) ? row.playerStats.length : 0), 0);
assertOk(manifest.version === 'V716', 'manifest non aggiornato a V716');
assertOk(data.meta?.version === 'V716', 'data meta non aggiornata a V716');
assertOk(sw.includes('iosudo-shell-v716'), 'service worker non usa cache V716');
assertOk(sw.includes('iosudo-app-v716.js?v=716'), 'service worker non cachea JS V716');
assertOk(sw.includes('iosudo-app-v716.css?v=716'), 'service worker non cachea CSS V716');
assertOk(js.includes("['vojvoda', 'mergim vojvoda']"), 'alias Vojvoda assente in JS');
assertOk(js.includes("['rabiot', 'adrien rabiot']"), 'alias Rabiot assente in JS');
assertOk(js.includes('const hasSosInXi = (player && playerHasSos(player))'), 'patch SOS XI dal player assente');
assertOk(js.includes('function renderFriendlyDetail(matchKey, teamId)'), 'renderFriendlyDetail assente');
assertOk(css.includes('iosudo-friendly-badge'), 'CSS badge amichevoli assente');
assertOk((data.teams || []).length === 20, 'teams non sono 20');
assertOk(manifest.players === sumRows(data.playersByTeam), 'conteggio players manifest non coerente');
assertOk(manifest.officialMoves === sumRows(data.officialMovesByTeam), 'conteggio officialMoves manifest non coerente');
assertOk(manifest.teamTransferTalks === sumRows(data.teamTransferTalksByTeam), 'conteggio teamTransferTalks manifest non coerente');
assertOk(manifest.friendlies === sumRows(data.friendliesByTeam), 'conteggio friendlies manifest non coerente');
assertOk(manifest.injuries === sumRows(data.injuriesByTeam), 'conteggio injuries manifest non coerente');
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
assertOk((data.activeOfficialRumorsAuditV716 || []).length === 0, 'activeOfficialRumorsAuditV716 non vuoto');
const allPlayers = Object.values(data.playersByTeam || {}).flat();
for (const bad of ['Vojvoda','Zaniolo','Celik','Valdepenas','Soulé','Pinamonti','Pulisic','Ricci','Rabiot','Tomori']) {
  assertOk(!allPlayers.some((p) => String(p.playerName || '') === bad), 'nome breve confermato ancora visibile in playersByTeam: ' + bad);
}
assertOk(Array.isArray(data.confirmedDuplicateAliasesV716) && data.confirmedDuplicateAliasesV716.length === 10, 'alias confermati V716 non archiviati');
assertOk(Array.isArray(data.duplicateNameCandidatesV716) && data.duplicateNameCandidatesV716.length === 10, 'lista 10 nuovi potenziali duplicati V716 assente');
const casale = (data.injuriesByTeam?.bologna || []).find((r) => canon(r.playerName || r.target) === 'casale' && isActiveStatus(r.status));
assertOk(Boolean(casale && /box|monitor/i.test(String(casale.status + ' ' + casale.note))), 'Casale SOS V70 non inserito');
const thuram = (data.injuriesByTeam?.juventus || []).find((r) => canon(r.playerName || r.target) === 'khephren thuram' && isActiveStatus(r.status));
assertOk(Boolean(thuram && String(thuram.url || '').includes('juve-thuram')), 'Khephren Thuram SOS V70 non rafforzato');
const degea = (data.injuriesByTeam?.fiorentina || []).find((r) => canon(r.playerName || r.target) === 'david de gea' && isActiveStatus(r.status));
assertOk(Boolean(degea && String(degea.url || '').includes('de-gea')), 'David De Gea SOS V70 non rafforzato');
const atalantaFriendly = (data.friendliesByTeam?.atalanta || []).find((item) => /atalanta-athletic club/i.test(String(item.event || item.playerName || '')));
assertOk(Boolean(atalantaFriendly && String(atalantaFriendly.url || '').includes('trofeo-achille') && atalantaFriendly.hasPlayerStats !== true), 'Atalanta-Athletic Club v71 assente o con tabellino improprio');
const desplanches = (data.teamTransferTalksByTeam?.frosinone || []).find((t) => canon(t.playerName || t.target) === 'sebastiano desplanches' && t.updateFlag === 'V716');
assertOk(Boolean(desplanches && /visite/i.test(String(desplanches.status || '') + String(desplanches.note || ''))), 'Desplanches V71 non aggiornato');
const oulai = (data.teamTransferTalksByTeam?.fiorentina || []).find((t) => canon(t.playerName || t.target) === 'christ inao oulai' && t.updateFlag === 'V716');
assertOk(Boolean(oulai && /non ufficial/i.test(String(oulai.status || '') + String(oulai.note || ''))), 'Oulai V71 non aggiornato/non marcato non ufficiale');
const sassuoloAlta = (data.friendliesByTeam?.sassuolo || []).find((item) => String(item.event || '') === 'Sassuolo-Alta Anaunia');
assertOk(Boolean(sassuoloAlta && sassuoloAlta.hasPlayerStats === true && Array.isArray(sassuoloAlta.playerStats) && sassuoloAlta.playerStats.length === 26), 'Tabellino Sassuolo-Alta Anaunia non integro');
console.log('Audit ioSudo V716 OK', JSON.stringify({ players: manifest.players, talks: manifest.teamTransferTalks, official: manifest.officialMoves, injuries: manifest.injuries, friendlies: manifest.friendlies, sources: manifest.sources, activeOfficialRumors: manifest.activeOfficialRumors, duplicateExactPlayers: manifest.duplicateExactPlayers, duplicatePlayerIds: manifest.duplicatePlayerIds, confirmedAliases: manifest.confirmedAliasesV716, duplicateCandidates: manifest.duplicateCandidatesV716 }));
