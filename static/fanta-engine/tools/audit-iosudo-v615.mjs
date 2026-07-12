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
  'static/fanta-engine/js/apps/iosudo-app-v615.js',
  'static/fanta-engine/css/iosudo-app-v615.css',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json'
];

function fail(message) {
  console.error('[ioSudo V615][FAIL]', message);
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
if (!index.includes('../fanta-engine/css/iosudo-app-v615.css?v=615')) fail('ioSudo CSS not linked');
if (!index.includes('../fanta-engine/js/apps/iosudo-app-v615.js?v=615')) fail('ioSudo JS not linked');
if (!index.includes('manifest.webmanifest')) fail('ioSudo webmanifest not linked');
if (!index.includes('iosudo-topbar')) fail('Compact topbar missing');
if (!index.includes('iosudoLeagueName')) fail('League name placeholder missing');
if (!index.includes('personaggio che suda')) fail('Sweating fantacalcio logo alt missing');

const app = read('static/fanta-engine/js/apps/iosudo-app-v615.js');
if (!app.includes("../fanta-engine/data/sudatori/current/")) fail('App does not read shared Sudatori data root');
if (!app.includes('manifest.json')) fail('App does not load current Sudatori manifest');
if (!app.includes('marketSummaryByTeam')) fail('App does not use market summary');
if (!app.includes('formationsByTeam')) fail('App does not use formations');
if (!app.includes('injuriesByTeam')) fail('App does not use injuries');
if (!app.includes('sideRank')) fail('Pitch side ordering helper missing');
if (!app.includes('roleOrder')) fail('Rosa role ordering helper missing');
if (!app.includes('setupLeagueChrome')) fail('League chrome setup missing');
if (!app.includes('renderPlayerDetail')) fail('Player detail renderer missing');
if (!app.includes('data-player-detail-id')) fail('Clickable player detail hooks missing');
if (!app.includes('playerForFormationItem')) fail('Pitch player resolver missing');
if (!app.includes('officialOutgoingForPlayer')) fail('Official outgoing detail helper missing');
if (!app.includes('is-team-open')) fail('Team-open UI state missing');
if (!app.includes('roleClass')) fail('Role color class helper missing');
if (!app.includes('teamThemeClass')) fail('Team theme helper missing');
if (!app.includes('iosudo-team-theme-nerazzurro')) fail('Team theme class mapping missing');
if (!app.includes('sourcesHtml')) fail('Separate market sources renderer missing');
if (!app.includes('sourceHref')) fail('Source href fallback helper missing');
if (!app.includes('normalizeFormationLine')) fail('Formation line normalizer missing');
if (!app.includes('splitSourceNameTokens')) fail('Combined source-name splitter missing');
if (!app.includes('CalcioLecce')) fail('CalcioLecce source fallback missing');
if (!app.includes('Eurosport')) fail('Eurosport source fallback missing');

const css = read('static/fanta-engine/css/iosudo-app-v615.css');
if (!css.includes('iosudo-topbar')) fail('Compact topbar CSS missing');
if (!css.includes('iosudo-logo')) fail('Logo CSS missing');
if (!css.includes('iosudo-player-role-p')) fail('Portiere role color missing');
if (!css.includes('iosudo-player-role-d')) fail('Difensore role color missing');
if (!css.includes('iosudo-player-role-c')) fail('Centrocampista role color missing');
if (!css.includes('iosudo-player-role-a')) fail('Attaccante role color missing');
if (!css.includes('.iosudo-shell.is-team-open .iosudo-search-card')) fail('Search card hidden state missing');
if (!css.includes('position: sticky')) fail('Sticky team menu CSS missing');
if (!css.includes('iosudo-team-theme-nerazzurro')) fail('Nerazzurro team card theme missing');
if (!css.includes('iosudo-team-theme-bianconero')) fail('Bianconero team card theme missing');
if (!css.includes('repeating-linear-gradient')) fail('Team card stripes missing');
if (!css.includes('iosudo-source-chips')) fail('Separate clickable source chips CSS missing');

const icon = read('static/iosudo/assets/icon.svg');
if (!icon.includes('4-3-3?') || !icon.includes('ioSudo')) fail('New sweating formation logo not detected');

const sw = read('static/iosudo/sw.js');
if (!sw.includes('/fanta-engine/data/sudatori/current/')) fail('Service worker must use network-first for shared data');
if (!sw.includes("cache: 'no-store'")) fail('Service worker data fetch is not network-first/no-store');

const manifest = JSON.parse(read('static/iosudo/manifest.webmanifest'));
if (manifest.short_name !== 'ioSudo') fail('Wrong PWA short_name');
if (manifest.start_url !== '/iosudo/') fail('Wrong PWA start_url');
if (!Array.isArray(manifest.icons) || manifest.icons.length < 3) fail('PWA icons incomplete');


const dataPath = path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');
if (fs.existsSync(dataPath)) {
  const sudatori = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  function simpleNorm(value) {
    return String(value || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }
  function auditLine(item, module) {
    const text = simpleNorm(item.formationLine || item.sourceLine || '');
    const position = String(item.position || item.sourcePosition || '').toUpperCase();
    const mod = String(module || '').trim();
    if (/goalkeeper|portiere|porta/.test(text) || position === 'P') return 'goalkeeper';
    if (/^(DD|DS|DC|DCD|DCS|BRACCIO|BRC)/.test(position)) return 'defense';
    if (mod === '4-2-3-1') {
      if (/^(PC|A)$/.test(position)) return 'attack';
      if (/^(AD|AS|TQ|SP)$/.test(position)) return 'attacking_midfield';
      if (/^(CC|MED|M|ED|ES|E)$/.test(position)) return 'midfield';
    }
    if (mod === '4-3-2-1' || mod === '3-4-2-1') {
      if (/^(PC|A)$/.test(position)) return 'attack';
      if (/^(TQ|SP|AD|AS)$/.test(position)) return 'attacking_midfield';
      if (/^(CC|MED|M|ED|ES|E)$/.test(position)) return 'midfield';
    }
    if (mod === '4-3-1-2') {
      if (/^(TQ)$/.test(position)) return 'attacking_midfield';
      if (/^(PC|SP|AD|AS|A)$/.test(position)) return 'attack';
      if (/^(CC|MED|M|ED|ES|E)$/.test(position)) return 'midfield';
    }
    if (/attackingmidfield|attacking midfield/.test(text) || /^(TQ|SP)$/.test(position)) return 'attacking_midfield';
    if (/midfield|centrocampo/.test(text) || /^(CC|MED|M|ED|ES|E)$/.test(position)) return 'midfield';
    if (/attack|attacco/.test(text) || /^(PC|AD|AS|A)$/.test(position)) return 'attack';
    if (/defense|difesa/.test(text)) return 'defense';
    return 'midfield';
  }
  for (const team of sudatori.teams || []) {
    const module = team.formationModule || team.module || '';
    if (!['4-2-3-1', '4-3-2-1', '4-3-1-2', '3-4-2-1'].includes(module)) continue;
    const rows = new Set((sudatori.formationsByTeam?.[team.id] || []).map((item) => auditLine(item, module)));
    for (const requiredLine of ['attack', 'attacking_midfield', 'midfield', 'defense']) {
      if (!rows.has(requiredLine)) fail(`Missing ${requiredLine} row for ${team.name} ${module}`);
    }
  }
}

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const html = read(`static/${league}/index.html`);
  if (!html.includes('data-iosudo-link-v615="true"')) fail('Missing ioSudo link in ' + league + ' index');
  const redirect = read(`static/${league}/iosudo/index.html`);
  if (!redirect.includes('/iosudo/')) fail('Missing ioSudo redirect in ' + league);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  if (cfg.currentVersion !== '615') fail('Wrong currentVersion in ' + league);
  if (!cfg.features || cfg.features.ioSudoPwa !== true) fail('Missing ioSudo feature flag in ' + league);
}

console.log('[ioSudo V615] Audit OK: separate clickable market sources, player detail links, role colors, team-card stripes, hidden search state, sticky team menu, shared data source and league links verified.');
