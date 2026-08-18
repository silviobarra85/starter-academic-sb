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
const latestPayload = readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/2026-08-18.json');
const aug05Payload = readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/2026-08-05.json');
const jul04Payload = readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/2026-07-04.json');
const seasonSnapshot = readJson('static/zonaorientale/assets/snapshots/seasons/2026-2027.json');
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
const payloadById = new Map([
  ['2026-08-18', latestPayload],
  ['2026-08-05', aug05Payload],
  ['2026-07-04', jul04Payload]
]);
const listoni = entries.map((entry) => ({
  ...entry,
  meta: payloadById.get(entry.id)?.meta || {},
  players: payloadById.get(entry.id)?.players || []
}));

check('ioSudo resta in manutenzione', /site under construction/i.test(iosudoIndex));
check('Service worker ioSudo resta di manutenzione', /iosudo-maintenance-v787|iosudo-maintenance-v786|iosudo-maintenance-v785/i.test(iosudoSw));
check('Helper rose/listone V787 preservato', typeof sync.syncRosterPlayerWithLatestListoneV787 === 'function');
const latest = sync.getLatestListoneForSeasonV787(listoni, '2026-2027');
check('Ultimo listone 2026-2027 e 18 agosto', latest?.id === '2026-08-18', latest?.id || 'nessuno');
check('Listone 5 agosto resta storico', entries.some((entry) => entry.id === '2026-08-05') && Boolean(aug05Payload));
check('Listone 4 luglio resta storico', entries.some((entry) => entry.id === '2026-07-04') && Boolean(jul04Payload));
check('Listone corrente contiene 519 giocatori', latestPayload?.players?.length === 519);
check('Listone corrente contiene 504 in-listone e 15 asteriscati', latestPayload?.meta?.activeRows === 504 && latestPayload?.meta?.asteriskRows === 15);

const rosterEntries = Array.isArray(seasonSnapshot?.rosterEntries) ? seasonSnapshot.rosterEntries : [];
check('Rose aggiornate contengono 211 giocatori', rosterEntries.length === 211);
check('Rose aggiornate coprono 10 fantasquadre', new Set(rosterEntries.map((row) => row.seasonTeamId)).size === 10);
const statusCodes = rosterEntries.map((row) => row.listoneStatusCodeV791);
check('Badge rose sempre IN_LISTONE/ASTERISCATO', statusCodes.length === rosterEntries.length && statusCodes.every((code) => ['IN_LISTONE', 'ASTERISCATO'].includes(code)));
const expectedAsterisk = new Map([['Gutierrez',8],['Angelino',3],['Ondrejka',5],['Lukaku',10],['Athekame',3]]);
for (const [name, quotation] of expectedAsterisk) {
  const row = rosterEntries.find((item) => item.playerName === name);
  check(`${name} conserva ultima quotazione ${quotation}`, row?.listoneStatusCodeV791 === 'ASTERISCATO' && Number(row?.lastKnownQuotation) === quotation);
}
const sohmListone = latestPayload?.players?.find((player) => String(player.playerName).toLowerCase() === 'sohm');
check('Sohm usa Venezia nel listone corrente', sohmListone?.realTeam === 'VEN' && sohmListone?.realTeamOriginal === 'Venezia');
check('Ordine ruoli P-D-C-A preservato', [
  { playerName: 'A', classicRole: 'A' },
  { playerName: 'C', classicRole: 'C' },
  { playerName: 'P', classicRole: 'P' },
  { playerName: 'D', classicRole: 'D' }
].sort(sync.compareRosterPlayersByRoleV787).map((player) => player.classicRole).join('') === 'PDCA');
check('FantaMantraManager non riceve patch specifica ZonaOrientale', !mantraApp.includes('ZonaOrientaleCanonicalFooterV792') && !mantraApp.includes('ZonaOrientaleTradeAnnouncementV792'));

const footerLabel = 'Fantacalcio - V792 - Aggiornato al 18/08/2026';
check('Footer canonico usa V792', zonaApp.includes('version: "V792"') && zonaApp.includes(footerLabel));
check('Observer canonico footer preservato', zonaApp.includes('footerCanonicalObserverV790'));
check('Writer V694 resta neutralizzato', zonaApp.includes('ZonaOrientaleCanonicalFooterV790?.active'));
check('Home parte con footer V792', zonaIndex.includes(footerLabel));
check('Competition parte con footer V792', zonaCompetition.includes(footerLabel));
check('Player parte con footer V792', zonaPlayer.includes(footerLabel));
check('Entrypoint app cache-buster V792', zonaIndex.includes('./assets/app.js?v=792') && release?.entrypoint === 'assets/app.js?v=792');
check('Core league config usa V792 in home', zonaIndex.includes('league-config-v443.js?v=792') && !zonaIndex.includes('league-config-v443.js?v=761'));
check('Core league config usa V792 in competition/player', zonaCompetition.includes('league-config-v443.js?v=792') && zonaPlayer.includes('league-config-v443.js?v=792'));
check('Dipendenze interne non ricreano config loader V761', [zonaApp, staticFilesService, uiCore, bilanciSection].every((source) => !source.includes('league-config-v443.js?v=761')));
check('Config runtime V792', zonaConfig?.currentVersion === '792' && zonaConfig?.branding?.footerLastUpdated === '18/08/2026' && Number(zonaConfig?.branding?.footerVersion) === 792);
check('Fallback config e fetch V792', zonaConfigJs.includes("currentVersion: '792'") && zonaConfigJs.includes('league-config.json?v=792'));

check('Sanitizer conserva tutte le card del registry', zonaConfigJs.includes('...(merged.featureCardRegistry || {})') && zonaConfigJs.includes('merged.featureCardRegistry?.cards'));
check('Config abilita Scambio/Vendita', zonaConfig?.features?.presidentTradeAnnouncement === true);
const tradeCard = zonaConfig?.featureCardRegistry?.cards?.find((card) => card?.id === 'trade-announcement');
check('Card trade-announcement configurata per presidente', tradeCard?.enabled === true && tradeCard?.featureKey === 'presidentTradeAnnouncement' && tradeCard?.hiddenForAdmin === true && tradeCard?.leagues?.includes('zonaorientale'));
const runtimeRegistry = registryModule.buildFeatureCardRegistryV497({ leagueConfig: zonaConfig });
check('Registry reale abilita trade-announcement per presidente', runtimeRegistry.getEnabledCards({ role: 'president', isPresident: true, isAuthenticated: true }).some((card) => card.id === 'trade-announcement'));
check('Registry reale nasconde trade-announcement all admin', !runtimeRegistry.getEnabledCards({ role: 'admin', isAdmin: true, isAuthenticated: true }).some((card) => card.id === 'trade-announcement'));
check('Refresh registry usa davvero il registry nuovo', featureRegistrySource.includes('getAllCards() { return this.registry.getAllCards(); }') && featureRegistrySource.includes('this.registry = buildFeatureCardRegistryV497'));
check('Dashboard Presidente espone pulsante Scambio/Vendita', zonaApp.includes('button.textContent = "Scambio/Vendita"') && zonaApp.includes('data-open-transfer-communication-v789'));
check('Form canonico Scambio preservato', zonaApp.includes('id="teamTransferCommunicationFormV242"') && zonaApp.includes('attachTransferCommunicationHandlerV242'));
check('Flusso Scambio registra TRANSFER_NEWS', zonaApp.includes('buildBaseTeamRequestPayloadV34("TRANSFER_NEWS")') && zonaApp.includes('await addDoc(collection(db, "teamRequests"), payload)'));
check('EmailJS Scambio preservato verso Caparrotti', zonaApp.includes('TRANSFER_COMMUNICATION_RECIPIENT_V242 = "caparrotti86@yahoo.it"') && zonaApp.includes('await emailModule.sendTransferEmail({'));
check('Regola svincolo ultima quotazione presente', zonaApp.includes('releaseQuotationRule: "ultima quotazione disponibile nella stagione"') && zonaApp.includes("per gli asteriscati si usa sempre l'ultima quotazione disponibile nella stagione"));
check('Release metadata V792', release?.version === '792' && release?.entrypoint === 'assets/app.js?v=792');

console.log(`Audit V792 footer/scambio/listone/rose/svincoli: ${checks.filter((item) => item.ok).length}/${checks.length} controlli superati.`);
for (const item of checks) console.log(`${item.ok ? 'OK' : 'ERRORE'} - ${item.label}${item.details && !item.ok ? ` (${item.details})` : ''}`);
if (failures.length) {
  console.error(`Audit V792 fallito: ${failures.length} problemi.`);
  process.exit(1);
}
