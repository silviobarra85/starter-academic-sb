import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const readText = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const js = readText('static/fanta-engine/js/apps/iosudo-app-v715.js');
const css = readText('static/fanta-engine/css/iosudo-app-v715.css');
const sw = readText('static/iosudo/sw.js');
function assertOk(cond, msg) { if (!cond) { console.error('Audit V715 FAILED:', msg); process.exit(1); } }
const norm = (v) => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const canon = (v) => {
  const n = norm(v);
  const aliases = new Map([
    ['k thuram','khephren thuram'],['thuram k','khephren thuram'],['khephren thuram','khephren thuram'],
    ['n gonzalez','nico gonzalez'],['gonzalez n','nico gonzalez'],['nico gonzalez','nico gonzalez'],
    ['chalobah','trevoh chalobah'],['trevoh chalobah','trevoh chalobah'],
    ['oulai','christ inao oulai'],['christ inao oulai','christ inao oulai'],
    ['gallo','antonino gallo'],['antonino gallo','antonino gallo'],
    ['cheddira','walid cheddira'],['walid cheddira','walid cheddira'],
    ['nicolussi caviglia','hans nicolussi caviglia'],['hans nicolussi caviglia','hans nicolussi caviglia'],
    ['y fofana','youssouf fofana'],['fofana y','youssouf fofana'],['youssouf fofana','youssouf fofana'],
    ['d berardi','domenico berardi'],['berardi d','domenico berardi'],['domenico berardi','domenico berardi'],
    ['m kone','manu kone'],['kone m','manu kone'],['manu kone','manu kone'],
    ['l moro','luca moro'],['moro l','luca moro'],['luca moro','luca moro']
  ]);
  return aliases.get(n) || n;
};
const isActiveStatus = (status) => !/(chius|superat|archiv|sfumat|duplicat|storic)/i.test(String(status || ''));
const sumRows = (obj) => Object.values(obj || {}).reduce((a, rows) => a + (rows || []).length, 0);
const countFriendlyStats = () => Object.values(data.friendlyPlayerStatsByMatch || {}).reduce((a, row) => a + (Array.isArray(row?.players) ? row.players.length : Array.isArray(row?.playerStats) ? row.playerStats.length : 0), 0);
assertOk(manifest.version === 'V715', 'manifest non aggiornato a V715');
assertOk(data.meta?.version === 'V715', 'data meta non aggiornata a V715');
assertOk(sw.includes('iosudo-shell-v715'), 'service worker non usa cache V715');
assertOk(sw.includes('iosudo-app-v715.js?v=715'), 'service worker non cachea JS V715');
assertOk(sw.includes('iosudo-app-v715.css?v=715'), 'service worker non cachea CSS V715');
assertOk(js.includes("['k thuram', 'khephren thuram']"), 'alias K. Thuram assente in JS');
assertOk(js.includes("['nicolussi caviglia', 'hans nicolussi caviglia']"), 'alias Nicolussi Caviglia assente in JS');
assertOk(js.includes("['y fofana', 'youssouf fofana']"), 'alias Y. Fofana assente in JS');
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
assertOk((data.activeOfficialRumorsAuditV715 || []).length === 0, 'activeOfficialRumorsAuditV715 non vuoto');
const allPlayers = Object.values(data.playersByTeam || {}).flat();
for (const bad of ['N. Gonzalez','Gallo','Y. Fofana','Cheddira','Nicolussi Caviglia','M. Kone','D. Berardi','L. Moro']) {
  assertOk(!allPlayers.some((p) => String(p.playerName || '') === bad), 'nome breve confermato ancora visibile in playersByTeam: ' + bad);
}
assertOk(Array.isArray(data.confirmedDuplicateAliasesV715) && data.confirmedDuplicateAliasesV715.length === 10, 'alias confermati V715 non archiviati');
assertOk(Array.isArray(data.duplicateNameCandidatesV715) && data.duplicateNameCandidatesV715.length === 10, 'lista 10 nuovi potenziali duplicati V715 assente');
const belotti = (data.officialMovesByTeam?.cagliari || []).filter((o) => canon(o.playerName || o.target) === 'belotti');
assertOk(belotti.length >= 1 && belotti.every((o) => String(o.url || '').includes('cagliari-belotti-calciomercato-news')), 'Belotti Cagliari non aggiornato a Sky v69');
const oulai = (data.teamTransferTalksByTeam?.fiorentina || []).find((t) => canon(t.playerName || t.target) === 'christ inao oulai' && isActiveStatus(t.status));
assertOk(Boolean(oulai && String(oulai.url || '').includes('fiorentina-oulai-calciomercato-news') && /non ufficial/i.test(String(oulai.status || ''))), 'Oulai V69 non aggiornato/non marcato non ufficiale');
const vojvoda = (data.teamTransferTalksByTeam?.udinese || []).find((t) => canon(t.playerName || t.target) === 'mergim vojvoda' && isActiveStatus(t.status));
assertOk(Boolean(vojvoda && String(vojvoda.url || '').includes('udinese-vojvoda-visite-mediche')), 'Vojvoda V69 non aggiornato a video Sky');
const zaniolo = (data.teamTransferTalksByTeam?.udinese || []).find((t) => canon(t.playerName || t.target) === 'nicolo zaniolo' && t.updateFlag === 'V715');
assertOk(Boolean(zaniolo && /monitoraggio/i.test(String(zaniolo.status || ''))), 'Zaniolo monitoraggio V69 assente');
const roma = (data.teamTransferTalksByTeam?.roma || []).find((t) => /philogene|ouahdi/i.test(String(t.playerName || t.target || '')) && t.updateFlag === 'V715');
assertOk(Boolean(roma), 'Roma esterni V69 assente');
const juveFriendly = (data.friendliesByTeam?.juventus || []).find((item) => String(item.event || '') === 'Basilea-Juventus');
assertOk(Boolean(juveFriendly && String(juveFriendly.url || '').includes('amichevole-i-convocati-per-basilea-juventus')), 'Basilea-Juventus non aggiornata a fonte convocati');
assertOk(!juveFriendly.hasPlayerStats, 'Basilea-Juventus non deve avere tabellino giocatori al controllo mattutino');
const sassuoloAlta = (data.friendliesByTeam?.sassuolo || []).find((item) => String(item.event || '') === 'Sassuolo-Alta Anaunia');
assertOk(Boolean(sassuoloAlta), 'Sassuolo-Alta Anaunia non trovata');
assertOk(sassuoloAlta.hasPlayerStats === true, 'Sassuolo-Alta Anaunia senza flag hasPlayerStats');
assertOk(Array.isArray(sassuoloAlta.playerStats) && sassuoloAlta.playerStats.length === 26, 'Tabellino Sassuolo-Alta Anaunia non ha 26 righe');
assertOk((data.friendliesFilteredOutV715 || []).length === 1, 'controllo amichevoli V715 non archiviato');
console.log('Audit ioSudo V715 OK', JSON.stringify({ players: manifest.players, talks: manifest.teamTransferTalks, official: manifest.officialMoves, injuries: manifest.injuries, friendlies: manifest.friendlies, sources: manifest.sources, activeOfficialRumors: manifest.activeOfficialRumors, duplicateExactPlayers: manifest.duplicateExactPlayers, duplicatePlayerIds: manifest.duplicatePlayerIds, confirmedAliases: manifest.confirmedAliasesV715, duplicateCandidates: manifest.duplicateCandidatesV715 }));
