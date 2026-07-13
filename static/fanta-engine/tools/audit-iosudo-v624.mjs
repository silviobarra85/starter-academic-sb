import fs from 'fs';
import path from 'path';
const root = process.cwd();
const required = ['static/iosudo/index.html','static/iosudo/sw.js','static/fanta-engine/js/apps/iosudo-app-v624.js','static/fanta-engine/css/iosudo-app-v624.css','static/zonaorientale/assets/league-config.json','static/fantapetillomantramanager/assets/league-config.json'];
function fail(message) { console.error('[ioSudo V624][FAIL]', message); process.exit(1); }
function read(rel) { const file=path.join(root,rel); if(!fs.existsSync(file)) fail('Missing '+rel); const text=fs.readFileSync(file,'utf8'); if(!text.length) fail('Empty '+rel); return text; }
for (const rel of required) read(rel);
const index=read('static/iosudo/index.html');
if(!index.includes('../fanta-engine/css/iosudo-app-v624.css?v=624')) fail('ioSudo CSS V624 not linked');
if(!index.includes('../fanta-engine/js/apps/iosudo-app-v624.js?v=624')) fail('ioSudo JS V624 not linked');
if(!index.includes('data-iosudo-version="624"')) fail('ioSudo data version not bumped');
for (const token of ['data-view="teams"','data-view="players"','data-view="sos"','data-view="rumor"','data-view="official"','data-view="friendlies"']) if(!index.includes(token)) fail('Missing quick view button: '+token);
const app=read('static/fanta-engine/js/apps/iosudo-app-v624.js');
for (const token of ['quickView','setQuickView','renderGlobalView','collectPlayerRows','globalPlayerItem','playerInLatestListone','LISTONE_ROOT','loadLatestListone','collectSosRows','collectMarketRows','collectFriendlyRows','globalFriendlyItem','Ordine crescente per data','Ordine decrescente per data','data-view','loadLeagueRosters','applyLiveRosters','assets/rose/manifest.json','virtualPlayers','findPlayerForMarketRow','makeVirtualPlayer','virtualMarketRows','virtualMarketPlayer','marketPlayerName','data-player-id','currentRealTeamText','cleanOriginTeam','roleMatchesMarket','marketNameMatchesPlayer','_iosudoMarketRows','attachedRowsForPlayer','uniqueMarketItems','Squadra reale:','Rosa fantasy:','Listone recente:']) if(!app.includes(token)) fail('Missing app token: '+token);
if(!app.includes("return [canonName(marketPlayerName(row)), roleKeyForRoster(marketPlayerRole(row))]")) fail('Virtual player key must be player/role based, not target-team based');
const css=read('static/fanta-engine/css/iosudo-app-v624.css');
for (const token of ['iosudo-global-nav','iosudo-global-view','iosudo-global-head','iosudo-compact-row','iosudo-source-chips','iosudo-player-global-row','iosudo-listone-ok','iosudo-listone-missing']) if(!css.includes(token)) fail('Missing CSS token: '+token);
const sw=read('static/iosudo/sw.js');
if(!sw.includes('iosudo-shell-v624')) fail('Service worker cache not V624');
if(!sw.includes('iosudo-app-v624.css?v=624')) fail('Service worker CSS not V624');
if(!sw.includes('iosudo-app-v624.js?v=624')) fail('Service worker JS not V624');
if(!sw.includes('/fanta-engine/data/sudatori/current/')) fail('Service worker network-first missing for Sudatori data');
if(!sw.includes('/assets/rose/')) fail('Service worker network-first missing for live rosters');
if(!sw.includes('/fanta-engine/data/shared-assets/current/assets/listoni/')) fail('Service worker network-first missing for listoni');
if(!sw.includes("cache: 'no-store'")) fail('Service worker data fetch is not network-first/no-store');
for (const league of ['zonaorientale','fantapetillomantramanager']) { const cfg=JSON.parse(read(`static/${league}/assets/league-config.json`)); if(cfg.currentVersion !== '624') fail('Wrong currentVersion in '+league); if(cfg.features?.ioSudoGlobalViews !== 'V624') fail('Missing ioSudoGlobalViews V624 in '+league); if(cfg.features?.ioSudoGlobalPlayers !== 'V624') fail('Missing ioSudoGlobalPlayers V624 in '+league); if(cfg.features?.ioSudoPlayersMarketEntries !== 'V624') fail('Missing ioSudoPlayersMarketEntries V624 in '+league); if(cfg.features?.ioSudoPlayersUniqueCards !== 'V624') fail('Missing ioSudoPlayersUniqueCards V624 in '+league); if(cfg.features?.ioSudoPlayersDetailLinks !== 'V624') fail('Missing ioSudoPlayersDetailLinks V624 in '+league); if(cfg.features?.ioSudoPlayerCurrentRealTeam !== 'V624') fail('Missing ioSudoPlayerCurrentRealTeam V624 in '+league); if(cfg.features?.ioSudoLiveRosters !== 'V624') fail('Missing ioSudoLiveRosters V624 in '+league); }
console.log('[ioSudo V624] Audit OK: vista Giocatori deduplicata per giocatore, con dettaglio e fonti cliccabili.');
