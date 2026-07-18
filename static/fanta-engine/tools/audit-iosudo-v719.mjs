import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataPath = path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifestPath = path.join(root, 'static/fanta-engine/data/sudatori/current/manifest.json');
const jsPath = path.join(root, 'static/fanta-engine/js/apps/iosudo-app-v719.js');
const cssPath = path.join(root, 'static/fanta-engine/css/iosudo-app-v719.css');
const swPath = path.join(root, 'static/iosudo/sw.js');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const sw = fs.readFileSync(swPath, 'utf8');
function assertOk(cond, msg) { if (!cond) { throw new Error(msg); } }
function norm(v) { return String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
const alias = new Map([
  ['lucca','lorenzo lucca'], ['taremi','mehdi taremi'], ['aebischer','michel aebischer'], ['pobega','tommaso pobega'], ['karlsson','jesper karlsson'], ['mandragora','rolando mandragora'], ['nzola','m bala nzola'], ['caprile','elia caprile'], ['s esposito','sebastiano esposito'], ['f esposito','francesco pio esposito'], ['pio esposito','francesco pio esposito']
]);
function canon(v) { const n = norm(v); return alias.get(n) || n; }
assertOk(manifest.version === 'V719', 'manifest non V719');
assertOk(data.meta && data.meta.version === 'V719', 'meta non V719');
assertOk(js.includes('iosudo') && js.includes('V719'), 'JS non marcato V719');
assertOk(css.includes('V719'), 'CSS non marcato V719');
assertOk(sw.includes('iosudo-shell-v719') && sw.includes('iosudo-app-v719.js?v=719'), 'service worker non aggiornato V719');
assertOk(js.includes("['s esposito', 'sebastiano esposito']"), 'alias S. Esposito assente');
assertOk(js.includes("['f esposito', 'francesco pio esposito']"), 'alias F. Esposito assente');
assertOk(!js.includes("['esposito',"), 'alias generico Esposito non consentito');
assertOk(!js.includes("['pessina', 'matteo pessina']"), 'alias globale Pessina non consentito');
const players = Object.entries(data.playersByTeam || {}).flatMap(([teamId, rows]) => (rows || []).map((p) => ({...p, teamId})));
const ids = new Set();
const duplicateIds = [];
const playerKeys = new Set();
const duplicatePlayers = [];
for (const p of players) {
  const id = p.id || '';
  if (!id || ids.has(id)) duplicateIds.push(id || 'missing');
  ids.add(id);
  const key = [p.teamId, canon(p.playerName), String(p.role || '').toUpperCase().slice(0,1)].join('::');
  if (playerKeys.has(key)) duplicatePlayers.push(key);
  playerKeys.add(key);
}
assertOk(duplicateIds.length === 0, 'ID giocatori duplicati: ' + duplicateIds.join(', '));
assertOk(duplicatePlayers.length === 0, 'duplicati esatti giocatori: ' + duplicatePlayers.join(', '));
const cagliariEsp = (data.playersByTeam?.cagliari || []).find((p) => norm(p.playerName) === 'sebastiano esposito');
const interEsp = (data.playersByTeam?.inter || []).find((p) => norm(p.playerName) === 'francesco pio esposito');
assertOk(Boolean(cagliariEsp), 'Sebastiano Esposito Cagliari assente');
assertOk(Boolean(interEsp), 'Francesco Pio Esposito Inter assente');
assertOk(!(data.playersByTeam?.inter || []).some((p) => norm(p.playerName) === 'sebastiano esposito'), 'Sebastiano Esposito finito su Inter');
assertOk((data.playersByTeam?.monza || []).some((p) => norm(p.playerName) === 'matteo pessina'), 'Matteo Pessina Monza assente');
assertOk((data.playersByTeam?.bologna || []).some((p) => norm(p.playerName) === 'pessina'), 'Pessina Bologna non deve essere rinominato globalmente');
const bolognaFriendly = (data.friendliesByTeam?.bologna || []).find((f) => norm(f.playerName || f.target || f.event).includes('arminia'));
assertOk(Boolean(bolognaFriendly), 'Bologna-Arminia non trovata');
assertOk(/0-3|parziale|NON_COMPILATO_PARZIALE/i.test(String(bolognaFriendly.status || '') + ' ' + String(bolognaFriendly.partialScore || '') + ' ' + String(bolognaFriendly.tabellinoStatus || '')), 'Bologna-Arminia non aggiornata come parziale live');
assertOk(Array.isArray(data.duplicateNameCandidatesV719) && data.duplicateNameCandidatesV719.length === 10, '10 candidati duplicati V719 assenti');
assertOk((data.activeOfficialRumorsAuditV719 || data.audit?.v719 || {}).activeOfficialRumors === 0 || manifest.activeOfficialRumors === 0, 'rumor attivi su ufficialità non zero');
console.log('Audit ioSudo V719 OK', JSON.stringify({ players: players.length, officialMoves: manifest.officialMoves, teamTransferTalks: manifest.teamTransferTalks, injuries: manifest.injuries, friendlies: manifest.friendlies, sources: manifest.sources, duplicateCandidates: data.duplicateNameCandidatesV719.length }));
