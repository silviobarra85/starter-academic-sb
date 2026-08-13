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
const zonaCompetition = read('static/zonaorientale/competition.html');
const zonaPlayer = read('static/zonaorientale/player.html');
const zonaConfig = readJson('static/zonaorientale/assets/league-config.json');
const zonaConfigJs = read('static/zonaorientale/assets/js/core/league-config-v443.js');
const staticFilesService = read('static/zonaorientale/assets/js/data/static-files-service.js');
const uiCore = read('static/zonaorientale/assets/js/core/ui.js');
const bilanciSection = read('static/zonaorientale/assets/js/sections/bilanci-snapshot-section-v435.js');
const featureRegistrySource = read('static/fanta-engine/js/core/feature-card-registry-v497.js');
const release = readJson('static/zonaorientale/release.json');
const mantraApp = read('static/fantapetillomantramanager/assets/app.js');

const syncModulePath = path.join(root, 'static/fanta-engine/js/core/roster-listone-sync-v787.js');
const sync = await import(pathToFileURL(syncModulePath).href);
const registryModulePath = path.join(root, 'static/fanta-engine/js/core/feature-card-registry-v497.js');
const registryModule = await import(pathToFileURL(registryModulePath).href + `?audit=${Date.now()}`);

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
check('FantaMantraManager non riceve patch ZonaOrientale V790', !mantraApp.includes('ZonaOrientaleCanonicalFooterV790') && !mantraApp.includes('ZonaOrientaleTradeAnnouncementV790'));

const footerLabel = 'Fantacalcio - V790 - Aggiornato al 13/08/2026';
check('Footer canonico V790 presente in app', zonaApp.includes('const ZONAORIENTALE_RELEASE_V790') && zonaApp.includes(footerLabel));
check('Observer canonico unico V790 presente', zonaApp.includes('footerCanonicalObserverV790'));
check('Tutti i writer footer legacy delegano al canonico V790', (zonaApp.match(/ZonaOrientaleCanonicalFooterV790\?\.active/g) || []).length >= 20);
const v694Start = zonaApp.indexOf('/* V694 - Profilo squadra');
const v698Start = zonaApp.indexOf('/* V698 - Profilo squadra');
const v694Block = v694Start >= 0 && v698Start > v694Start ? zonaApp.slice(v694Start, v698Start) : '';
check('Writer V694 non puo scrivere V694 nel runtime V790', v694Block.includes('ZonaOrientaleCanonicalFooterV790?.active') && v694Block.indexOf('ZonaOrientaleCanonicalFooterV790?.active') < v694Block.indexOf('footerVersionV694'));
check('Home parte gia con footer V790', zonaIndex.includes(footerLabel));
check('Competition parte gia con footer V790', zonaCompetition.includes(footerLabel));
check('Player parte gia con footer V790', zonaPlayer.includes(footerLabel));
check('Entrypoint app cache-buster V790', zonaIndex.includes('./assets/app.js?v=790') && release?.entrypoint === 'assets/app.js?v=790');
check('Core league config usa un solo cache-buster V790 in home', zonaIndex.includes('league-config-v443.js?v=790') && !zonaIndex.includes('league-config-v443.js?v=761'));
check('Core league config usa V790 in competition/player', zonaCompetition.includes('league-config-v443.js?v=790') && zonaPlayer.includes('league-config-v443.js?v=790'));
check('Dipendenze interne non creano una seconda istanza V761 del config loader', [zonaApp, staticFilesService, uiCore, bilanciSection].every((source) => !source.includes('league-config-v443.js?v=761')));
check('Config runtime V790', zonaConfig?.currentVersion === '790' && zonaConfig?.branding?.footerLastUpdated === '13/08/2026' && zonaConfig?.branding?.footerVersion === 790);
check('Fallback config e fetch V790', zonaConfigJs.includes("currentVersion: '790'") && zonaConfigJs.includes("league-config.json?v=790"));

check('Sanitizer conserva tutte le card del registry', zonaConfigJs.includes('...(merged.featureCardRegistry || {})') && zonaConfigJs.includes('merged.featureCardRegistry?.cards'));
check('Config abilita Scambio/Vendita', zonaConfig?.features?.presidentTradeAnnouncement === true);
const tradeCard = zonaConfig?.featureCardRegistry?.cards?.find((card) => card?.id === 'trade-announcement');
check('Card trade-announcement configurata per presidente', tradeCard?.enabled === true && tradeCard?.featureKey === 'presidentTradeAnnouncement' && tradeCard?.hiddenForAdmin === true && tradeCard?.leagues?.includes('zonaorientale'));
const runtimeRegistry = registryModule.buildFeatureCardRegistryV497({ leagueConfig: zonaConfig });
check('Registry reale abilita trade-announcement per presidente', runtimeRegistry.getEnabledCards({ role: 'president', isPresident: true, isAuthenticated: true }).some((card) => card.id === 'trade-announcement'));
check('Registry reale nasconde trade-announcement all admin', !runtimeRegistry.getEnabledCards({ role: 'admin', isAdmin: true, isAuthenticated: true }).some((card) => card.id === 'trade-announcement'));
check('Refresh registry usa davvero il registry nuovo', featureRegistrySource.includes('getAllCards() { return this.registry.getAllCards(); }') && featureRegistrySource.includes('this.registry = buildFeatureCardRegistryV497'));
const disabledConfig = { ...zonaConfig, features: { ...(zonaConfig?.features || {}), presidentTradeAnnouncement: false } };
const api = registryModule.installFeatureCardRegistryV497({ window: {}, leagueConfig: disabledConfig });
const beforeRefresh = api.getEnabledCards({ role: 'president', isPresident: true, isAuthenticated: true }).some((card) => card.id === 'trade-announcement');
api.refresh({ leagueConfig: zonaConfig });
const afterRefresh = api.getEnabledCards({ role: 'president', isPresident: true, isAuthenticated: true }).some((card) => card.id === 'trade-announcement');
check('Refresh registry passa da disabilitato ad abilitato', beforeRefresh === false && afterRefresh === true);
check('V790 ascolta evento auth realmente emesso dal sito', zonaApp.includes('"fanta:auth-state-v760"'));
check('Dashboard Presidente espone pulsante Scambio/Vendita', zonaApp.includes('button.textContent = "Scambio/Vendita"') && zonaApp.includes('data-open-transfer-communication-v789'));
check('Pulsante Scambio/Vendita apre il pannello collassato', zonaApp.includes('openZonaTradeV790') && zonaApp.includes('panel.classList.toggle("is-collapsed-v432", !expanded)'));
check('Form canonico V242 preservato', zonaApp.includes('id="teamTransferCommunicationFormV242"') && zonaApp.includes('attachTransferCommunicationHandlerV242'));
check('Flusso canonico registra TRANSFER_NEWS', zonaApp.includes('buildBaseTeamRequestPayloadV34("TRANSFER_NEWS")') && zonaApp.includes('await addDoc(collection(db, "teamRequests"), payload)'));
check('EmailJS V242 preservato verso Caparrotti', zonaApp.includes('TRANSFER_COMMUNICATION_RECIPIENT_V242 = "caparrotti86@yahoo.it"') && zonaApp.includes('await emailModule.sendTransferEmail({'));
check('Release metadata V790', release?.version === '790' && release?.entrypoint === 'assets/app.js?v=790');

console.log(`Audit V790 footer/scambio/rose: ${checks.filter((item) => item.ok).length}/${checks.length} controlli superati.`);
for (const item of checks) console.log(`${item.ok ? 'OK' : 'ERRORE'} - ${item.label}${item.details && !item.ok ? ` (${item.details})` : ''}`);
if (failures.length) {
  console.error(`Audit V790 fallito: ${failures.length} problemi.`);
  process.exit(1);
}
