import fs from 'fs';
import path from 'path';
const root = process.cwd();
const required = ['static/iosudo/index.html','static/iosudo/sw.js','static/fanta-engine/js/apps/iosudo-app-v622.js','static/fanta-engine/css/iosudo-app-v622.css','static/fanta-engine/data/sudatori/current/manifest.json','static/fanta-engine/data/sudatori/current/sudatori-data.json','static/zonaorientale/assets/league-config.json','static/fantapetillomantramanager/assets/league-config.json'];
function fail(message) { console.error('[ioSudo V622][FAIL]', message); process.exit(1); }
function read(rel) { const file=path.join(root,rel); if(!fs.existsSync(file)) fail('Missing '+rel); const text=fs.readFileSync(file,'utf8'); if(!text.length) fail('Empty '+rel); return text; }
for (const rel of required) read(rel);
const index=read('static/iosudo/index.html');
if(!index.includes('../fanta-engine/css/iosudo-app-v622.css?v=622')) fail('ioSudo CSS V622 not linked');
if(!index.includes('../fanta-engine/js/apps/iosudo-app-v622.js?v=622')) fail('ioSudo JS V622 not linked');
if(!index.includes('data-iosudo-version="622"')) fail('ioSudo data version not bumped');
for (const token of ['data-view="teams"','data-view="players"','data-view="sos"','data-view="rumor"','data-view="official"','data-view="friendlies"']) if(!index.includes(token)) fail('Missing quick view button: '+token);
const app=read('static/fanta-engine/js/apps/iosudo-app-v622.js');
for (const token of ['quickView','setQuickView','renderGlobalView','collectPlayerRows','globalPlayerItem','playerInLatestListone','LISTONE_ROOT','loadLatestListone','collectSosRows','collectMarketRows','collectFriendlyRows','globalFriendlyItem','Ordine crescente per data','Ordine decrescente per data','data-view','loadLeagueRosters','applyLiveRosters','assets/rose/manifest.json']) if(!app.includes(token)) fail('Missing app token: '+token);
const css=read('static/fanta-engine/css/iosudo-app-v622.css');
for (const token of ['iosudo-global-nav','iosudo-global-view','iosudo-global-head','iosudo-compact-row','iosudo-source-chips','iosudo-player-global-row','iosudo-listone-ok','iosudo-listone-missing']) if(!css.includes(token)) fail('Missing CSS token: '+token);
const sw=read('static/iosudo/sw.js');
if(!sw.includes('iosudo-shell-v622')) fail('Service worker cache not V622');
if(!sw.includes('iosudo-app-v622.css?v=622')) fail('Service worker CSS not V622');
if(!sw.includes('iosudo-app-v622.js?v=622')) fail('Service worker JS not V622');
if(!sw.includes('/fanta-engine/data/sudatori/current/')) fail('Service worker network-first missing for Sudatori data');
if(!sw.includes('/assets/rose/')) fail('Service worker network-first missing for live rosters');
if(!sw.includes('/fanta-engine/data/shared-assets/current/assets/listoni/')) fail('Service worker network-first missing for listoni');
if(!sw.includes("cache: 'no-store'")) fail('Service worker data fetch is not network-first/no-store');
for (const league of ['zonaorientale','fantapetillomantramanager']) { const cfg=JSON.parse(read(`static/${league}/assets/league-config.json`)); if(cfg.currentVersion !== '622') fail('Wrong currentVersion in '+league); if(cfg.features?.ioSudoGlobalViews !== 'V622') fail('Missing ioSudoGlobalViews V622 in '+league); if(cfg.features?.ioSudoGlobalPlayers !== 'V622') fail('Missing ioSudoGlobalPlayers V622 in '+league); if(cfg.features?.ioSudoLiveRosters !== 'V622') fail('Missing ioSudoLiveRosters V622 in '+league); }
const data=JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
const summaries=Object.values(data.marketSummaryByTeam || {});
const rumors=summaries.reduce((acc,s)=>acc+(s.talksIncoming||[]).length+(s.talksOutgoing||[]).length,0);
const officials=summaries.reduce((acc,s)=>acc+(s.officialIncoming||[]).length+(s.officialOutgoing||[]).length,0);
const sos=Object.values(data.injuriesByTeam || {}).reduce((acc,list)=>acc+(list||[]).length,0);
const friendlies=Object.values(data.friendliesByTeam || {}).reduce((acc,list)=>acc+(list||[]).length,0);
if(rumors < 170) fail('Too few rumor/trattative rows: '+rumors); if(officials < 200) fail('Too few official rows: '+officials); if(sos < 8) fail('Too few SOS rows after V622: '+sos); if(friendlies < 94) fail('Too few friendlies: '+friendlies);
console.log('[ioSudo V622] Audit OK:', JSON.stringify({rumors,officials,sos,friendlies}));
