import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const readText = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const js = readText('static/fanta-engine/js/apps/iosudo-app-v718.js');
const css = readText('static/fanta-engine/css/iosudo-app-v718.css');
const sw = readText('static/iosudo/sw.js');
function assertOk(cond, msg) { if (!cond) { console.error('Audit V718 FAILED:', msg); process.exit(1); } }
const norm = (v) => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const aliases = new Map([
 ['k thuram','khephren thuram'],['thuram k','khephren thuram'],['khephren thuram','khephren thuram'],
 ['n gonzalez','nico gonzalez'],['gonzalez n','nico gonzalez'],['nico gonzalez','nico gonzalez'],
 ['chalobah','trevoh chalobah'],['trevoh chalobah','trevoh chalobah'],['oulai','christ inao oulai'],['christ inao oulai','christ inao oulai'],
 ['gallo','antonino gallo'],['antonino gallo','antonino gallo'],['cheddira','walid cheddira'],['walid cheddira','walid cheddira'],
 ['nicolussi caviglia','hans nicolussi caviglia'],['hans nicolussi caviglia','hans nicolussi caviglia'],['y fofana','youssouf fofana'],['fofana y','youssouf fofana'],['youssouf fofana','youssouf fofana'],
 ['d berardi','domenico berardi'],['berardi d','domenico berardi'],['domenico berardi','domenico berardi'],['m kone','manu kone'],['kone m','manu kone'],['manu kone','manu kone'],['l moro','luca moro'],['moro l','luca moro'],['luca moro','luca moro'],
 ['vojvoda','mergim vojvoda'],['mergim vojvoda','mergim vojvoda'],['zaniolo','nicolo zaniolo'],['nicolo zaniolo','nicolo zaniolo'],['celik','zeki celik'],['zeki celik','zeki celik'],['valdepenas','victor valdepenas'],['victor valdepenas','victor valdepenas'],['soule','matias soule'],['matias soule','matias soule'],['pinamonti','andrea pinamonti'],['andrea pinamonti','andrea pinamonti'],['pulisic','christian pulisic'],['christian pulisic','christian pulisic'],['ricci','samuele ricci'],['samuele ricci','samuele ricci'],['rabiot','adrien rabiot'],['adrien rabiot','adrien rabiot'],['tomori','fikayo tomori'],['fikayo tomori','fikayo tomori'],
 ['lucumi','jhon lucumi'],['jhon lucumi','jhon lucumi'],['de gea','david de gea'],['david de gea','david de gea'],['dossena','alberto dossena'],['alberto dossena','alberto dossena'],['bernabe','adrian bernabe'],['bernabe','adrian bernabe'],['adrian bernabe','adrian bernabe'],['lauriente','armand lauriente'],['armand lauriente','armand lauriente'],['chakvetadze','giorgi chakvetadze'],['giorgi chakvetadze','giorgi chakvetadze'],['de silvestri','lorenzo de silvestri'],['de silvestri','lorenzo de silvestri'],['lorenzo de silvestri','lorenzo de silvestri'],['di gregorio','michele di gregorio'],['michele di gregorio','michele di gregorio'],['di lorenzo','giovanni di lorenzo'],['giovanni di lorenzo','giovanni di lorenzo'],['frattesi','davide frattesi'],['davide frattesi','davide frattesi']
]);
const canon = (v) => aliases.get(norm(String(v || '').replace('*',''))) || norm(String(v || '').replace('*',''));
const sumRows = (obj) => Object.values(obj || {}).reduce((a, rows) => a + (Array.isArray(rows) ? rows.length : 0), 0);
const countFriendlyStats = () => Object.values(data.friendlyPlayerStatsByMatch || {}).reduce((a, row) => a + (Array.isArray(row?.players) ? row.players.length : Array.isArray(row?.playerStats) ? row.playerStats.length : 0), 0);
assertOk(manifest.version === 'V718', 'manifest non aggiornato a V718');
assertOk(data.meta?.version === 'V718', 'data meta non aggiornata a V718');
assertOk(sw.includes('iosudo-shell-v718'), 'service worker non usa cache V718');
assertOk(sw.includes('iosudo-app-v718.js?v=718'), 'service worker non cachea JS V718');
assertOk(sw.includes('iosudo-app-v718.css?v=718'), 'service worker non cachea CSS V718');
assertOk(js.includes("['lucumi', 'jhon lucumi']"), 'alias Lucumi assente in JS');
assertOk(js.includes("['di lorenzo', 'giovanni di lorenzo']"), 'alias Di Lorenzo assente in JS');
assertOk(css.includes('V718'), 'CSS non marcato V718');
assertOk(js.includes("['zemura', 'jordan zemura']"), 'alias Zemura assente in JS');
assertOk(js.includes("['vlahovic', 'dusan vlahovic']"), 'alias Vlahovic assente in JS');
assertOk(js.includes('const hasSosInXi = (player && playerHasSos(player))'), 'patch SOS XI dal player assente');
assertOk(js.includes('function renderFriendlyDetail(matchKey, teamId)'), 'renderFriendlyDetail assente');
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
const allPlayers = Object.values(data.playersByTeam || {}).flat();
for (const bad of ['Lucumi','De Gea','Dossena','Bernabe','Lauriente','Chakvetadze','De Silvestri','Di Gregorio','Di Lorenzo','Frattesi']) {
  assertOk(!allPlayers.some((p) => String(p.playerName || '').replace('*','') === bad), 'nome breve confermato ancora visibile in playersByTeam: ' + bad);
}
assertOk(Array.isArray(data.confirmedDuplicateAliasesV718) && data.confirmedDuplicateAliasesV718.length === 10, 'alias confermati V718 non archiviati');
assertOk(Array.isArray(data.duplicateNameCandidatesV718) && data.duplicateNameCandidatesV718.length === 10, 'lista 10 nuovi potenziali duplicati V718 assente');
const caccavo = (data.playersByTeam?.bologna || []).find((p) => canon(p.playerName) === 'luigi caccavo');
assertOk(Boolean(caccavo && /prestito|juve stabia/i.test(String(caccavo.marketStatus || '') + ' ' + String(caccavo.marketDetail || ''))), 'Luigi Caccavo non aggiornato come prestito esterno');
const caccavoOut = (data.officialMovesByTeam?.bologna || []).find((m) => canon(m.playerName || m.target) === 'luigi caccavo' && norm(m.direction) === 'outgoing');
assertOk(Boolean(caccavoOut && String(caccavoOut.url || '').includes('caccavo-alla-juve-stabia')), 'Ufficialità uscita Caccavo assente');
for (const name of ['Iker Bravo','Jordan Zemura','Martin Payero']) {
  const row = (data.teamTransferTalksByTeam?.udinese || []).find((t) => canon(t.playerName || t.target) === canon(name));
  assertOk(Boolean(row && /watford/i.test(String(row.status || '') + ' ' + String(row.note || '')) && String(row.url || '').includes('calciomercato-news-trattative-oggi-18-luglio')), 'Trattativa Udinese-Watford V718 mancante: ' + name);
}
const atalantaU23 = (data.friendliesByTeam?.atalanta || []).find((item) => /under 23|u23/i.test(String(item.event || item.playerName || '')));
assertOk(Boolean(atalantaU23 && String(atalantaU23.url || '').includes('preseason-2026-27') && atalantaU23.hasPlayerStats !== true), 'Atalanta-U23 V718 assente o con tabellino improprio');
const sassuoloAlta = (data.friendliesByTeam?.sassuolo || []).find((item) => String(item.event || '') === 'Sassuolo-Alta Anaunia');
assertOk(Boolean(sassuoloAlta && sassuoloAlta.hasPlayerStats === true && Array.isArray(sassuoloAlta.playerStats) && sassuoloAlta.playerStats.length === 26), 'Tabellino Sassuolo-Alta Anaunia non integro');

const eng = (data.playersByTeam?.como || []).find((p) => canon(p.playerName) === 'yannik engelhardt');
assertOk(Boolean(eng && /friburgo|freiburg/i.test(String(eng.marketStatus || '') + ' ' + String(eng.marketDetail || ''))), 'Yannik Engelhardt non aggiornato come uscita al Friburgo');
const rav = (data.playersByTeam?.monza || []).find((p) => canon(p.playerName) === 'luca ravanelli');
assertOk(Boolean(rav && /sampdoria/i.test(String(rav.marketStatus || '') + ' ' + String(rav.marketDetail || ''))), 'Luca Ravanelli non aggiornato come uscita alla Sampdoria');
const engOut = (data.officialMovesByTeam?.como || []).find((m) => canon(m.playerName || m.target) === 'yannik engelhardt' && norm(m.direction) === 'outgoing');
assertOk(Boolean(engOut && String(engOut.url || '').includes('yannik-engelhardt-passa-al-friburgo')), 'Ufficialità uscita Engelhardt assente');
const ravOut = (data.officialMovesByTeam?.monza || []).find((m) => canon(m.playerName || m.target) === 'luca ravanelli' && norm(m.direction) === 'outgoing');
assertOk(Boolean(ravOut && String(ravOut.url || '').includes('luca-ravanelli-alla-sampdoria')), 'Ufficialità uscita Ravanelli assente');
assertOk(!(data.teamTransferTalksByTeam?.como || []).some((t) => canon(t.playerName || t.target) === 'yannik engelhardt'), 'Rumor attivo su Engelhardt ancora presente');
for (const bad of ['Zemura','Suzuki','Zanaga','Sommer','Massolin','Amey','Bondo','Vlahovic','Milinkovic-Savic','Frendrup']) {
  assertOk(!allPlayers.some((p) => String(p.playerName || '').replace('*','') === bad), 'nome breve confermato ancora visibile in playersByTeam: ' + bad);
}
assertOk(Array.isArray(data.confirmedDuplicateAliasesV718) && data.confirmedDuplicateAliasesV718.length === 10, 'alias confermati V718 non archiviati');
assertOk(Array.isArray(data.duplicateNameCandidatesV718) && data.duplicateNameCandidatesV718.length === 10, 'lista 10 nuovi potenziali duplicati V718 assente');

console.log('Audit ioSudo V718 OK', JSON.stringify({ players: manifest.players, official: manifest.officialMoves, talks: manifest.teamTransferTalks, injuries: manifest.injuries, friendlies: manifest.friendlies, sources: manifest.sources, activeOfficialRumors: manifest.activeOfficialRumors, duplicateExactPlayers: manifest.duplicateExactPlayers, duplicatePlayerIds: manifest.duplicatePlayerIds, confirmedAliases: manifest.confirmedAliasesV718, duplicateCandidates: manifest.duplicateCandidatesV718 }));
