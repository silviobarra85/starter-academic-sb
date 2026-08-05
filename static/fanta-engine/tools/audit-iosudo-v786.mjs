import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || process.cwd());
const failures = [];
const checks = [];
function read(p) { const f = path.join(root, p); if (!fs.existsSync(f)) { failures.push(`File mancante: ${p}`); return ''; } return fs.readFileSync(f, 'utf8'); }
function readJson(p) { const t = read(p); if (!t) return null; try { return JSON.parse(t); } catch (error) { failures.push(`JSON non valido: ${p} (${error.message})`); return null; } }
function check(label, condition, details = '') { const ok = Boolean(condition); checks.push({ label, ok, details }); if (!ok) failures.push(details ? `${label}: ${details}` : label); }

const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const manifest = readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/manifest.json');
const latestPayload = readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/2026-08-05.json');
const oldPayload = readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/2026-07-04.json');
const rosterPayload = readJson('static/zonaorientale/assets/rose/2026-2027-2026-07-05.json');
const zonaApp = read('static/zonaorientale/assets/app.js');
const mantraApp = read('static/fantapetillomantramanager/assets/app.js');

const moduleUrl = pathToFileURL(path.join(root, 'static/fanta-engine/js/core/roster-listone-sync-v786.js')).href;
const sync = await import(moduleUrl);
const entries = Array.isArray(manifest?.listoni) ? manifest.listoni : [];
const listoni = entries.map((entry) => ({
  ...entry,
  meta: entry.id === '2026-08-05' ? latestPayload?.meta : entry.id === '2026-07-04' ? oldPayload?.meta : {},
  players: entry.id === '2026-08-05' ? latestPayload?.players || [] : entry.id === '2026-07-04' ? oldPayload?.players || [] : []
}));

check('ioSudo manutenzione V786', index.includes('ioSudo V786') && /site under construction/i.test(index));
check('Service worker manutenzione V786', sw.includes('iosudo-maintenance-v786'));
check('Nuovo helper FantaEngine importabile', typeof sync.getLatestListoneForSeasonV786 === 'function');
const latest = sync.getLatestListoneForSeasonV786(listoni, '2026-2027');
check('Ultimo listone stagione 2026-2027', latest?.id === '2026-08-05', latest?.id || 'nessuno');
check('Listone storico conservato', entries.some((entry) => entry.id === '2026-07-04') && Boolean(oldPayload));
check('ID non usati come chiave identità', read('static/fanta-engine/js/core/roster-listone-sync-v786.js').includes('Gli ID Fantacalcio non sono usati per il matching'));

const rosterPlayers = (rosterPayload?.rosters || []).flatMap((roster) => (roster.players || []).map((player) => ({ ...player, seasonId: '2026-2027' })));
const statuses = rosterPlayers.map((player) => sync.getRosterListoneStatusV786(listoni, player, '2026-2027'));
const inListone = statuses.filter((status) => status.code === 'IN_LISTONE').length;
const asterisk = statuses.filter((status) => status.code === 'ASTERISCATO').length;
check('Tutti i giocatori ricevono un badge', statuses.length === rosterPlayers.length && statuses.every((status) => ['IN_LISTONE', 'ASTERISCATO'].includes(status.code)));
check('Rose ZonaOrientale: 210 in listone', inListone === 210, String(inListone));
check('Rose ZonaOrientale: 20 asteriscati', asterisk === 20, String(asterisk));

const sampleIn = rosterPlayers.find((player) => sync.getRosterListoneStatusV786(listoni, player, '2026-2027').code === 'IN_LISTONE');
const sampleOut = rosterPlayers.find((player) => sync.getRosterListoneStatusV786(listoni, player, '2026-2027').code === 'ASTERISCATO');
const syncedIn = sync.syncRosterPlayerWithLatestListoneV786(listoni, sampleIn, '2026-2027');
const syncedOut = sync.syncRosterPlayerWithLatestListoneV786(listoni, sampleOut, '2026-2027');
check('Giocatore presente usa dati ultimo listone', syncedIn.inLatestListoneV786 === true && syncedIn.latestListoneIdV786 === '2026-08-05' && Boolean(syncedIn.fantacalcioId));
check('Giocatore assente resta in rosa ma asteriscato', syncedOut.inLatestListoneV786 === false && syncedOut.listoneStatusCodeV786 === 'ASTERISCATO' && Boolean(syncedOut.playerName));

for (const [label, app] of [['ZonaOrientale', zonaApp], ['FantaMantraManager', mantraApp]]) {
  check(`${label} importa helper condiviso V786`, app.includes('roster-listone-sync-v786.js?v=786'));
  check(`${label} usa ultimo listone per le rose`, app.includes('getLatestListoneForSeasonV786(state?.listoni || [], seasonId)'));
  check(`${label} non usa il listone storico selezionato`, app.includes('findLatestListonePlayerForRosterPlayerV786(state?.listoni || [], player, seasonId)'));
  check(`${label} sincronizza schede squadra`, app.includes('renderTeamProfileContentV786'));
  check(`${label} badge binari permanenti`, app.includes('statuses: Object.freeze(["IN_LISTONE", "ASTERISCATO"])'));
  check(`${label} footer V786`, app.includes('Fantacalcio - V786 - Aggiornato al 05/08/2026'));
}

console.log(`Audit ioSudo/rose-listone V786: ${checks.filter((item) => item.ok).length}/${checks.length} controlli superati.`);
for (const item of checks) console.log(`${item.ok ? 'OK' : 'ERRORE'} - ${item.label}${item.details && !item.ok ? ` (${item.details})` : ''}`);
if (failures.length) {
  console.error(`Audit V786 fallito: ${failures.length} problemi.`);
  process.exit(1);
}
