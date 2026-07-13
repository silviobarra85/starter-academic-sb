import fs from 'fs';
import path from 'path';
const root = process.cwd();
const required = [
  'static/iosudo/index.html',
  'static/iosudo/sw.js',
  'static/fanta-engine/js/apps/iosudo-app-v627.js',
  'static/fanta-engine/css/iosudo-app-v627.css',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json'
];
function fail(message) { console.error('[ioSudo V627][FAIL]', message); process.exit(1); }
function read(rel) { const file = path.join(root, rel); if (!fs.existsSync(file)) fail('Missing ' + rel); const text = fs.readFileSync(file, 'utf8'); if (!text.length) fail('Empty ' + rel); return text; }
for (const rel of required) read(rel);
const index = read('static/iosudo/index.html');
if (!index.includes('../fanta-engine/css/iosudo-app-v627.css?v=627')) fail('ioSudo CSS V627 not linked');
if (!index.includes('../fanta-engine/js/apps/iosudo-app-v627.js?v=627')) fail('ioSudo JS V627 not linked');
if (!index.includes('data-iosudo-version="627"')) fail('ioSudo data version not bumped');
for (const token of ['data-view="teams"','data-view="players"','data-view="sos"','data-view="rumor"','data-view="official"','data-view="friendlies"']) {
  if (!index.includes(token)) fail('Missing quick view button: ' + token);
}
const app = read('static/fanta-engine/js/apps/iosudo-app-v627.js');
for (const token of ['function sourceHref','articleUrl || item.preciseArticleUrl','function renderGlobalView','collectPlayerRows','globalPlayerItem','data-player-id','function bindCards','renderPlayerDetail','virtualPlayers','virtualMarketRows','sourcesHtml','detailSection','Trattative e rumors','SOS / infortuni','Listone recente:','Rosa fantasy:','currentRealTeamText']) {
  if (!app.includes(token)) fail('Missing app token: ' + token);
}
const renderGlobalStart = app.indexOf('function renderGlobalView');
const renderGlobalEnd = app.indexOf('function setQuickView', renderGlobalStart);
if (renderGlobalStart === -1 || renderGlobalEnd === -1) fail('renderGlobalView block not isolated');
const renderGlobalBlock = app.slice(renderGlobalStart, renderGlobalEnd);
if (!renderGlobalBlock.includes('bindCards();')) fail('renderGlobalView must bind cards after rendering global rows');
if (!renderGlobalBlock.includes('mapper = globalPlayerItem')) fail('Players global view must use globalPlayerItem');
const bindCardsStart = app.indexOf('function bindCards');
const bindCardsEnd = app.indexOf('function parseHash', bindCardsStart);
if (bindCardsStart === -1 || bindCardsEnd === -1) fail('bindCards block not isolated');
const bindCardsBlock = app.slice(bindCardsStart, bindCardsEnd);
if (!bindCardsBlock.includes("querySelectorAll('[data-player-id]')")) fail('bindCards must attach to data-player-id cards');
if (!bindCardsBlock.includes('renderPlayerDetail(node.getAttribute(\'data-player-id\')')) fail('bindCards must open player detail from global cards');
const css = read('static/fanta-engine/css/iosudo-app-v627.css');
for (const token of ['iosudo-global-nav','iosudo-global-view','iosudo-global-head','iosudo-player-global-row','iosudo-player-row-button','cursor: pointer','iosudo-listone-ok','iosudo-listone-missing']) {
  if (!css.includes(token)) fail('Missing CSS token: ' + token);
}
const sw = read('static/iosudo/sw.js');
if (!sw.includes('iosudo-shell-v627')) fail('Service worker cache not V627');
if (!sw.includes('iosudo-app-v627.css?v=627')) fail('Service worker CSS not V627');
if (!sw.includes('iosudo-app-v627.js?v=627')) fail('Service worker JS not V627');
if (!sw.includes('/fanta-engine/data/sudatori/current/')) fail('Service worker network-first missing for Sudatori data');
if (!sw.includes('/assets/rose/')) fail('Service worker network-first missing for live rosters');
if (!sw.includes('/fanta-engine/data/shared-assets/current/assets/listoni/')) fail('Service worker network-first missing for listoni');
for (const league of ['zonaorientale','fantapetillomantramanager']) {
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  if (cfg.currentVersion !== '627') fail('Wrong currentVersion in ' + league);
  if (cfg.features?.ioSudoGlobalPlayerCardClick !== 'V627') fail('Missing ioSudoGlobalPlayerCardClick V627 in ' + league);
  if (cfg.features?.ioSudoPlayerDetailFromGlobalView !== 'V627') fail('Missing ioSudoPlayerDetailFromGlobalView V627 in ' + league);
}
console.log('[ioSudo V627] Audit OK: card GIOCATORI cliccabili, dettaglio giocatore e fonti articolo puntuali attive.');
