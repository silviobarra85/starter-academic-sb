import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] || process.cwd());
const failures = [];
const checks = [];
function read(p) { const f = path.join(root, p); if (!fs.existsSync(f)) { failures.push(`File mancante: ${p}`); return ''; } return fs.readFileSync(f, 'utf8'); }
function readJson(p) { const t = read(p); if (!t) return null; try { return JSON.parse(t); } catch (error) { failures.push(`JSON non valido: ${p} (${error.message})`); return null; } }
function check(label, condition, details = '') { const ok = Boolean(condition); checks.push({ label, ok, details }); if (!ok) failures.push(details ? `${label}: ${details}` : label); }

const iosudoIndex = read('static/iosudo/index.html');
const iosudoSw = read('static/iosudo/sw.js');
const manifest = readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/manifest.json');
const latestPayload = readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/2026-08-05.json');
const oldPayload = readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/2026-07-04.json');
const rosterPayload = readJson('static/zonaorientale/assets/rose/2026-2027-2026-07-05.json');
const zonaApp = read('static/zonaorientale/assets/app.js');
const mantraApp = read('static/fantapetillomantramanager/assets/app.js');
const zonaIndex = read('static/zonaorientale/index.html');
const mantraIndex = read('static/fantapetillomantramanager/index.html');
const release = readJson('static/zonaorientale/release.json');

const modulePath = path.join(root, 'static/fanta-engine/js/core/roster-listone-sync-v787.js');
const sync = await import(pathToFileURL(modulePath).href);
const entries = Array.isArray(manifest?.listoni) ? manifest.listoni : [];
const listoni = entries.map((entry) => ({
  ...entry,
  meta: entry.id === '2026-08-05' ? latestPayload?.meta : entry.id === '2026-07-04' ? oldPayload?.meta : {},
  players: entry.id === '2026-08-05' ? latestPayload?.players || [] : entry.id === '2026-07-04' ? oldPayload?.players || [] : []
}));

check('ioSudo manutenzione V787', iosudoIndex.includes('ioSudo V787') && /site under construction/i.test(iosudoIndex));
check('Service worker manutenzione V787', iosudoSw.includes('iosudo-maintenance-v787'));
check('Helper V787 importabile', typeof sync.syncRosterPlayerWithLatestListoneV787 === 'function');
const latest = sync.getLatestListoneForSeasonV787(listoni, '2026-2027');
check('Ultimo listone stagione 2026-2027', latest?.id === '2026-08-05', latest?.id || 'nessuno');
check('Listone storico conservato', entries.some((entry) => entry.id === '2026-07-04') && Boolean(oldPayload));
check('ID Fantacalcio non usati come chiave identita', read('static/fanta-engine/js/core/roster-listone-sync-v787.js').includes('Gli ID Fantacalcio non sono usati per il matching'));

const rosterPlayers = (rosterPayload?.rosters || []).flatMap((roster) => (roster.players || []).map((player) => ({ ...player, seasonId: '2026-2027' })));
const statuses = rosterPlayers.map((player) => sync.getRosterListoneStatusV787(listoni, player, '2026-2027'));
const inListone = statuses.filter((status) => status.code === 'IN_LISTONE').length;
const asterisk = statuses.filter((status) => status.code === 'ASTERISCATO').length;
check('Tutti i giocatori ricevono un badge', statuses.length === rosterPlayers.length && statuses.every((status) => ['IN_LISTONE', 'ASTERISCATO'].includes(status.code)));
check('Rose ZonaOrientale: 210 in listone', inListone === 210, String(inListone));
check('Rose ZonaOrientale: 20 asteriscati', asterisk === 20, String(asterisk));

const sohmSource = rosterPlayers.find((player) => String(player.playerName).toLowerCase() === 'sohm');
const sohmSynced = sync.syncRosterPlayerWithLatestListoneV787(listoni, sohmSource, '2026-2027');
check('Sohm resta nella fantasquadra senza riscrivere lo snapshot', sohmSource?.realTeam === 'BOL');
check('Sohm usa la squadra dell ultimo listone', sohmSynced?.realTeam === 'VEN' && sohmSynced?.realTeamOriginal === 'Venezia', `${sohmSynced?.realTeam}/${sohmSynced?.realTeamOriginal}`);
check('Sohm usa quotazione corrente del nuovo listone', Number(sohmSynced?.quotationCurrent) === 5, String(sohmSynced?.quotationCurrent));

const roleSamples = [
  { playerName: 'Attaccante', classicRole: 'A' },
  { playerName: 'Centrocampista', classicRole: 'C' },
  { playerName: 'Portiere', classicRole: 'P' },
  { playerName: 'Difensore', classicRole: 'D' }
].sort(sync.compareRosterPlayersByRoleV787);
check('Ordine ruoli canonico P-D-C-A', roleSamples.map((player) => player.classicRole).join('') === 'PDCA');

for (const [label, app, index] of [
  ['ZonaOrientale', zonaApp, zonaIndex],
  ['FantaMantraManager', mantraApp, mantraIndex]
]) {
  check(`${label} importa helper condiviso V787`, app.includes('roster-listone-sync-v787.js?v=787'));
  check(`${label} sincronizza ogni renderer di rosa`, app.includes('renderRosterPlayerTableV787'));
  check(`${label} sincronizza scheda squadra`, app.includes('renderTeamProfileContentV787'));
  check(`${label} usa squadra ultimo listone`, app.includes('realTeamCodeV787'));
  check(`${label} ordina il ruolo con rank numerico`, app.includes('getRosterRoleOrderV787(synced)'));
  check(`${label} resetta P-D-C-A all apertura squadra`, app.includes('resetRosterRoleOrderV787'));
  check(`${label} ascolta eventi statici su window`, app.includes('window.addEventListener("fanta:static-assets-ready-v760"'));
  if (label === 'ZonaOrientale') check(`${label} conserva entrypoint static-first V761`, index.includes('assets/app.js?v=761'));
  else check(`${label} cache-buster app V787`, index.includes('assets/app.js?v=787'));
  check(`${label} footer V787`, app.includes('Fantacalcio - V787 - Aggiornato al 05/08/2026'));
}
check('Release static-first ZonaOrientale preservata', release?.version === '763' && release?.entrypoint === 'assets/app.js?v=761');

console.log(`Audit ioSudo/rose-listone V787: ${checks.filter((item) => item.ok).length}/${checks.length} controlli superati.`);
for (const item of checks) console.log(`${item.ok ? 'OK' : 'ERRORE'} - ${item.label}${item.details && !item.ok ? ` (${item.details})` : ''}`);
if (failures.length) {
  console.error(`Audit V787 fallito: ${failures.length} problemi.`);
  process.exit(1);
}
