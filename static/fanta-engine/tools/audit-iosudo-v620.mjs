import fs from 'fs';
import path from 'path';

const root = process.cwd();
const required = [
  'static/iosudo/index.html',
  'static/iosudo/sw.js',
  'static/fanta-engine/js/apps/iosudo-app-v620.js',
  'static/fanta-engine/css/iosudo-app-v620.css',
  'static/fanta-engine/data/sudatori/current/manifest.json',
  'static/fanta-engine/data/sudatori/current/sudatori-data.json',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json'
];

function fail(message) {
  console.error('[ioSudo V620][FAIL]', message);
  process.exit(1);
}
function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) fail('Missing ' + rel);
  const text = fs.readFileSync(file, 'utf8');
  if (!text.length) fail('Empty ' + rel);
  return text;
}
function norm(value) {
  return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

for (const rel of required) read(rel);

const index = read('static/iosudo/index.html');
if (!index.includes('../fanta-engine/css/iosudo-app-v620.css?v=620')) fail('ioSudo CSS V620 not linked');
if (!index.includes('../fanta-engine/js/apps/iosudo-app-v620.js?v=620')) fail('ioSudo JS V620 not linked');
if (!index.includes('data-iosudo-version="620"')) fail('ioSudo data version not bumped');
for (const token of ['data-view="teams"','data-view="sos"','data-view="rumor"','data-view="official"','data-view="friendlies"']) {
  if (!index.includes(token)) fail('Missing quick view button: ' + token);
}

const app = read('static/fanta-engine/js/apps/iosudo-app-v620.js');
for (const token of [
  'quickView',
  'setQuickView',
  'renderGlobalView',
  'collectSosRows',
  'collectMarketRows',
  'collectFriendlyRows',
  'globalFriendlyItem',
  'Ordine crescente per data',
  'Ordine decrescente per data',
  'data-view',
  'loadLeagueRosters',
  'applyLiveRosters',
  'assets/rose/manifest.json'
]) {
  if (!app.includes(token)) fail('Missing app token: ' + token);
}
if (app.includes("querySelectorAll('[data-filter]')")) fail('Old data-filter binding still present');

const css = read('static/fanta-engine/css/iosudo-app-v620.css');
for (const token of ['iosudo-global-nav','iosudo-global-view','iosudo-global-head','iosudo-compact-row','iosudo-source-chips']) {
  if (!css.includes(token)) fail('Missing CSS token: ' + token);
}

const sw = read('static/iosudo/sw.js');
if (!sw.includes('iosudo-shell-v620')) fail('Service worker cache not V620');
if (!sw.includes('iosudo-app-v620.css?v=620')) fail('Service worker CSS not V620');
if (!sw.includes('iosudo-app-v620.js?v=620')) fail('Service worker JS not V620');
if (!sw.includes('/fanta-engine/data/sudatori/current/')) fail('Service worker network-first missing for Sudatori data');
if (!sw.includes('/assets/rose/')) fail('Service worker network-first missing for live rosters');
if (!sw.includes("cache: 'no-store'")) fail('Service worker data fetch is not network-first/no-store');

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  if (cfg.currentVersion !== '620') fail('Wrong currentVersion in ' + league);
  if (cfg.features?.ioSudoGlobalViews !== 'V620') fail('Missing ioSudoGlobalViews feature flag in ' + league);
  if (cfg.features?.ioSudoLiveRosters !== 'V620') fail('Missing ioSudoLiveRosters feature flag in ' + league);
}

const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
const summaries = Object.values(data.marketSummaryByTeam || {});
const rumors = summaries.reduce((acc, s) => acc + (s.talksIncoming || []).length + (s.talksOutgoing || []).length, 0);
const officials = summaries.reduce((acc, s) => acc + (s.officialIncoming || []).length + (s.officialOutgoing || []).length, 0);
const sos = Object.values(data.injuriesByTeam || {}).reduce((acc, list) => acc + (list || []).length, 0);
const friendlies = Object.values(data.friendliesByTeam || {}).reduce((acc, list) => acc + (list || []).length, 0);
if (rumors < 100) fail('Too few rumor/trattative rows: ' + rumors);
if (officials < 100) fail('Too few official rows: ' + officials);
if (sos < 1) fail('No SOS rows found');
if (friendlies < 50) fail('Too few friendly rows: ' + friendlies);

console.log('[ioSudo V620] Audit OK:', JSON.stringify({ rumors, officials, sos, friendlies }));
