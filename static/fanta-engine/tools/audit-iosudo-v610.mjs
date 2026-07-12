import fs from 'fs';
import path from 'path';

const root = process.cwd();
const required = [
  'static/iosudo/index.html',
  'static/iosudo/manifest.webmanifest',
  'static/iosudo/sw.js',
  'static/iosudo/assets/icon.svg',
  'static/iosudo/assets/icon-192.png',
  'static/iosudo/assets/icon-512.png',
  'static/zonaorientale/iosudo/index.html',
  'static/fantapetillomantramanager/iosudo/index.html',
  'static/fanta-engine/js/apps/iosudo-app-v610.js',
  'static/fanta-engine/css/iosudo-app-v610.css',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json'
];

function fail(message) {
  console.error('[ioSudo V610][FAIL]', message);
  process.exit(1);
}

function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) fail('Missing ' + rel);
  return fs.readFileSync(file, 'utf8');
}

for (const rel of required) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) fail('Missing ' + rel);
  const stat = fs.statSync(file);
  if (!stat.size) fail('Empty ' + rel);
}

const index = read('static/iosudo/index.html');
if (!index.includes('../fanta-engine/css/iosudo-app-v610.css?v=610')) fail('ioSudo CSS not linked');
if (!index.includes('../fanta-engine/js/apps/iosudo-app-v610.js?v=610')) fail('ioSudo JS not linked');
if (!index.includes('manifest.webmanifest')) fail('ioSudo webmanifest not linked');
if (!index.includes('iosudo-topbar')) fail('Compact topbar missing');
if (!index.includes('iosudoLeagueName')) fail('League name placeholder missing');
if (!index.includes('personaggio che suda')) fail('Sweating fantacalcio logo alt missing');

const app = read('static/fanta-engine/js/apps/iosudo-app-v610.js');
if (!app.includes("../fanta-engine/data/sudatori/current/")) fail('App does not read shared Sudatori data root');
if (!app.includes('manifest.json')) fail('App does not load current Sudatori manifest');
if (!app.includes('marketSummaryByTeam')) fail('App does not use market summary');
if (!app.includes('formationsByTeam')) fail('App does not use formations');
if (!app.includes('injuriesByTeam')) fail('App does not use injuries');
if (!app.includes('sideRank')) fail('Pitch side ordering helper missing');
if (!app.includes('roleOrder')) fail('Rosa role ordering helper missing');
if (!app.includes('setupLeagueChrome')) fail('League chrome setup missing');

const css = read('static/fanta-engine/css/iosudo-app-v610.css');
if (!css.includes('iosudo-topbar')) fail('Compact topbar CSS missing');
if (!css.includes('iosudo-logo')) fail('Logo CSS missing');

const icon = read('static/iosudo/assets/icon.svg');
if (!icon.includes('4-3-3?') || !icon.includes('ioSudo')) fail('New sweating formation logo not detected');

const sw = read('static/iosudo/sw.js');
if (!sw.includes('/fanta-engine/data/sudatori/current/')) fail('Service worker must use network-first for shared data');
if (!sw.includes("cache: 'no-store'")) fail('Service worker data fetch is not network-first/no-store');

const manifest = JSON.parse(read('static/iosudo/manifest.webmanifest'));
if (manifest.short_name !== 'ioSudo') fail('Wrong PWA short_name');
if (manifest.start_url !== '/iosudo/') fail('Wrong PWA start_url');
if (!Array.isArray(manifest.icons) || manifest.icons.length < 3) fail('PWA icons incomplete');

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const html = read(`static/${league}/index.html`);
  if (!html.includes('data-iosudo-link-v610="true"')) fail('Missing ioSudo link in ' + league + ' index');
  const redirect = read(`static/${league}/iosudo/index.html`);
  if (!redirect.includes('/iosudo/')) fail('Missing ioSudo redirect in ' + league);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  if (cfg.currentVersion !== '610') fail('Wrong currentVersion in ' + league);
  if (!cfg.features || cfg.features.ioSudoPwa !== true) fail('Missing ioSudo feature flag in ' + league);
}

console.log('[ioSudo V610] Audit OK: compact header, sweating logo, shared data source, league links and rosa role order verified.');
