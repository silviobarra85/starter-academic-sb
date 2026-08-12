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
const zonaIndex = read('static/zonaorientale/index.html');
const zonaConfig = readJson('static/zonaorientale/assets/league-config.json');
const zonaConfigJs = read('static/zonaorientale/assets/js/core/league-config-v443.js');
const release = readJson('static/zonaorientale/release.json');
const mantraApp = read('static/fantapetillomantramanager/assets/app.js');

const modulePath = path.join(root, 'static/fanta-engine/js/core/roster-listone-sync-v787.js');
const sync = await import(pathToFileURL(modulePath).href);
const entries = Array.isArray(manifest?.listoni) ? manifest.listoni : [];
const listoni = entries.map((entry) => ({
  ...entry,
  meta: entry.id === '2026-08-05' ? latestPayload?.meta : entry.id === '2026-07-04' ? oldPayload?.meta : {},
  players: entry.id === '2026-08-05' ? latestPayload?.players || [] : entry.id === '2026-07-04' ? oldPayload?.players || [] : []
}));

check('ioSudo resta in manutenzione', /site under construction/i.test(iosudoIndex));
check('Service worker ioSudo resta di manutenzione', /iosudo-maintenance-v787|iosudo-maintenance-v786|iosudo-maintenance-v785/i.test(iosudoSw));
check('Helper rose/listone V787 preservato', typeof sync.syncRosterPlayerWithLatestListoneV787 === 'function');
const latest = sync.getLatestListoneForSeasonV787(listoni, '2026-2027');
check('Ultimo listone 2026-2027 resta 2026-08-05', latest?.id === '2026-08-05', latest?.id || 'nessuno');
check('Listone 2026-07-04 resta storico', entries.some((entry) => entry.id === '2026-07-04') && Boolean(oldPayload));

const rosterPlayers = (rosterPayload?.rosters || []).flatMap((roster) => (roster.players || []).map((player) => ({ ...player, seasonId: '2026-2027' })));
const statuses = rosterPlayers.map((player) => sync.getRosterListoneStatusV787(listoni, player, '2026-2027'));
check('Badge rose sempre IN_LISTONE/ASTERISCATO', statuses.length === rosterPlayers.length && statuses.every((status) => ['IN_LISTONE', 'ASTERISCATO'].includes(status.code)));
const sohmSource = rosterPlayers.find((player) => String(player.playerName).toLowerCase() === 'sohm');
const sohmSynced = sync.syncRosterPlayerWithLatestListoneV787(listoni, sohmSource, '2026-2027');
check('Sohm usa Venezia dal listone corrente', sohmSynced?.realTeam === 'VEN' && sohmSynced?.realTeamOriginal === 'Venezia');
check('Ordine ruoli P-D-C-A preservato', [
  { playerName: 'A', classicRole: 'A' },
  { playerName: 'C', classicRole: 'C' },
  { playerName: 'P', classicRole: 'P' },
  { playerName: 'D', classicRole: 'D' }
].sort(sync.compareRosterPlayersByRoleV787).map((player) => player.classicRole).join('') === 'PDCA');
check('FantaMantraManager non toccato dalla patch V788', !mantraApp.includes('ZonaOrientaleCanonicalFooterV788') && !mantraApp.includes('ZonaOrientaleTradeAnnouncementV788'));

check('Footer canonico V788 presente', zonaApp.includes('const ZONAORIENTALE_RELEASE_V788') && zonaApp.includes('Fantacalcio - V788 - Aggiornato al 12/08/2026'));
check('Observer canonico footer V788 presente', zonaApp.includes('footerCanonicalObserverV788'));
check('Writer legacy footer delegano al canonico', (zonaApp.match(/ZonaOrientaleCanonicalFooterV788\?\.active/g) || []).length >= 19);
check('Entrypoint ZonaOrientale cache-buster V788', zonaIndex.includes('./assets/app.js?v=788'));
check('Footer HTML V788', zonaIndex.includes('Fantacalcio - V788 - Aggiornato al 12/08/2026'));
check('Release metadata V788', release?.version === '788' && release?.entrypoint === 'assets/app.js?v=788');
check('Config runtime V788', zonaConfig?.currentVersion === '788' && zonaConfig?.branding?.footerLastUpdated === '12/08/2026');
check('Config abilita scambio presidente', zonaConfig?.features?.presidentTradeAnnouncement === true);
const tradeCard = zonaConfig?.featureCardRegistry?.cards?.find((card) => card?.id === 'trade-announcement');
check('Card trade-announcement attiva', tradeCard?.enabled === true && tradeCard?.featureKey === 'presidentTradeAnnouncement' && tradeCard?.hiddenForAdmin === true);
check('Fallback config V788 e scambio attivo', zonaConfigJs.includes("currentVersion: '788'") && zonaConfigJs.includes('presidentTradeAnnouncement: true') && zonaConfigJs.includes("id: 'trade-announcement'"));
check('Flusso canonico V242 preservato', zonaApp.includes('buildBaseTeamRequestPayloadV34("TRANSFER_NEWS")') && zonaApp.includes('sendTransferCommunicationEmailV242'));
check('Destinatario Caparrotti preservato', zonaApp.includes('TRANSFER_COMMUNICATION_RECIPIENT_V242 = "caparrotti86@yahoo.it"'));
check('EmailJS usato dal flusso scambio', zonaApp.includes('await emailModule.sendTransferEmail({'));
check('Riattivazione runtime V788 presente', zonaApp.includes('activateZonaTradeAnnouncementV788') && zonaApp.includes('enableZonaTradeAnnouncementRegistryV788'));
check('Scambio limitato a ZonaOrientale', zonaApp.includes('getLeagueConfigValueV443?.("leagueId", "zonaorientale")'));
check('Admin non riceve la card presidente', zonaApp.includes('if (!isZonaOrientaleRuntimeV788() || state?.isAdmin) return false;'));

console.log(`Audit V788 footer/scambio/rose: ${checks.filter((item) => item.ok).length}/${checks.length} controlli superati.`);
for (const item of checks) console.log(`${item.ok ? 'OK' : 'ERRORE'} - ${item.label}${item.details && !item.ok ? ` (${item.details})` : ''}`);
if (failures.length) {
  console.error(`Audit V788 fallito: ${failures.length} problemi.`);
  process.exit(1);
}
