import fs from 'node:fs';

function assertOk(condition, message) {
  if (!condition) throw new Error(message);
}

const index = fs.readFileSync('static/iosudo/index.html', 'utf8');
const sw = fs.readFileSync('static/iosudo/sw.js', 'utf8');
const js = fs.readFileSync('static/fanta-engine/js/apps/iosudo-app-v708.js', 'utf8');
const css = fs.readFileSync('static/fanta-engine/css/iosudo-app-v708.css', 'utf8');
const manifest = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/manifest.json', 'utf8'));
const data = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/sudatori-data.json', 'utf8'));

assertOk(index.includes('iosudo-app-v708.js?v=708'), 'index non punta al JS V708');
assertOk(index.includes('iosudo-app-v708.css?v=708'), 'index non punta al CSS V708');
assertOk(index.includes('data-iosudo-version="708"'), 'index non ha data-iosudo-version 708');
assertOk(sw.includes('iosudo-shell-v708'), 'service worker non usa cache V708');
assertOk(sw.includes('iosudo-app-v708.js?v=708'), 'service worker non cachea JS V708');
assertOk(sw.includes('iosudo-app-v708.css?v=708'), 'service worker non cachea CSS V708');
assertOk(manifest.version === 'V708', 'manifest non aggiornato a V708');
assertOk(data.meta?.version === 'V708', 'sudatori-data meta.version non aggiornato a V708');
assertOk(Boolean(manifest.updatedAtTime), 'manifest senza updatedAtTime');
assertOk((data.teams || []).length === 20, 'teams non sono 20');
assertOk(Object.keys(data.playersByTeam || {}).length === 20, 'playersByTeam incompleto');
assertOk(js.includes('function renderFriendlyDetail(matchKey, teamId)'), 'renderFriendlyDetail assente');
assertOk(js.includes('data-friendly-detail-key'), 'handler scheda amichevole assente');
assertOk(css.includes('iosudo-friendly-badge'), 'CSS badge amichevoli assente');

const seenExact = new Set();
const seenIds = new Set();
const exactDuplicates = [];
const idDuplicates = [];
for (const [teamId, rows] of Object.entries(data.playersByTeam || {})) {
  for (const p of rows || []) {
    const key = [teamId, String(p.playerName || '').toLowerCase().trim(), String(p.role || '').toUpperCase().slice(0,1)].join('::');
    if (seenExact.has(key)) exactDuplicates.push(key);
    seenExact.add(key);
    const id = String(p.id || '');
    if (!id) idDuplicates.push('missing-id');
    else if (seenIds.has(id)) idDuplicates.push(id);
    seenIds.add(id);
  }
}
assertOk(exactDuplicates.length === 0, 'duplicati esatti in playersByTeam: ' + exactDuplicates.slice(0, 5).join(', '));
assertOk(idDuplicates.length === 0, 'ID giocatori duplicati: ' + idDuplicates.slice(0, 5).join(', '));
assertOk(manifest.dedupVersion && manifest.dedupVersion.includes('V708'), 'dedupVersion non aggiornata a V708');
assertOk(manifest.activeOfficialRumors === 0, 'restano rumor attivi per giocatori ufficiali: ' + manifest.activeOfficialRumors);
assertOk((data.activeOfficialRumorsAuditV708 || []).length === 0, 'activeOfficialRumorsAuditV708 non vuoto');
assertOk((data.officialTalksFilteredV707 || []).length >= 1, 'nessuna trattativa archiviata post-ufficialita V707');

const activeInjuryDuplicates = [];
for (const rows of Object.values(data.injuriesByTeam || {})) {
  for (const item of rows || []) {
    if (/duplicato|superata/i.test(String(item.status || ''))) activeInjuryDuplicates.push(item.playerName || 'n.d.');
  }
}
assertOk(activeInjuryDuplicates.length === 0, 'infortuni attivi contengono righe duplicate/superate: ' + activeInjuryDuplicates.join(', '));

const sassuolo = data.friendliesByTeam?.sassuolo || [];
const sassuoloAlta = sassuolo.find((item) => String(item.event || '') === 'Sassuolo-Alta Anaunia');
assertOk(Boolean(sassuoloAlta), 'Sassuolo-Alta Anaunia non trovata in friendliesByTeam.sassuolo');
assertOk(sassuoloAlta.hasPlayerStats === true, 'Sassuolo-Alta Anaunia senza flag hasPlayerStats');
assertOk((sassuoloAlta.result || sassuoloAlta.score) === '22-1', 'Risultato Sassuolo-Alta Anaunia non 22-1');
assertOk(Array.isArray(sassuoloAlta.playerStats) && sassuoloAlta.playerStats.length === 26, 'Tabellino Sassuolo-Alta Anaunia non ha 26 righe');
const statRows = sassuoloAlta.playerStats;
const pinamonti = statRows.find((row) => row.playerName === 'Pinamonti');
const mulattieri = statRows.find((row) => row.playerName === 'Mulattieri');
const berardi = statRows.find((row) => row.playerName === 'Domenico Berardi');
const ownGoal = statRows.find((row) => Number(row.ownGoals || 0) === 1);
assertOk(pinamonti && Number(pinamonti.goals) === 3 && Number(pinamonti.minutes) === 45, 'Pinamonti tabellino non corretto');
assertOk(mulattieri && Number(mulattieri.goals) === 3 && Number(mulattieri.minutes) === 20, 'Mulattieri tabellino non corretto');
assertOk(berardi && Number(berardi.minutes) === 0, 'Berardi non impiegato non tracciato');
assertOk(Boolean(ownGoal), 'Autogol avversario non tracciato');


const roma = data.friendliesByTeam?.roma || [];
const newportCounty = roma.find((item) => String(item.event || '') === 'Newport County-Roma');
const oldNewport = roma.find((item) => String(item.event || '') === 'Newport-Roma');
const cardiff = roma.find((item) => String(item.event || '') === 'Cardiff City-Roma');
const brighton = roma.find((item) => String(item.event || '') === 'Brighton-Roma');
assertOk(Boolean(newportCounty), 'Newport County-Roma non normalizzata in V708');
assertOk(!oldNewport, 'Vecchia denominazione Newport-Roma ancora presente in V708');
assertOk(cardiff && String(cardiff.time || '').includes('locale'), 'Cardiff City-Roma senza orario locale/CEST V708');
assertOk(brighton && /American Express Stadium/.test(String(brighton.venue || '')), 'Brighton-Roma senza sede aggiornata V708');
assertOk((data.friendliesPatchedV708 || []).length >= 5, 'Patch amichevoli Roma V708 incompleta');

const matchDetails = data.friendlyPlayerStatsByMatch || {};
assertOk(Object.keys(matchDetails).length >= 1, 'friendlyPlayerStatsByMatch vuoto');
assertOk(manifest.friendlyMatchDetails >= 1, 'manifest friendlyMatchDetails non aggiornato');
console.log('Audit ioSudo V708 OK', JSON.stringify({
  players: manifest.players,
  talks: manifest.teamTransferTalks,
  official: manifest.officialMoves,
  friendlies: manifest.friendlies,
  injuries: manifest.injuries,
  friendlyMatchDetails: manifest.friendlyMatchDetails,
  friendlyPlayerStats: manifest.friendlyPlayerStats,
  duplicateExact: 0
}));
