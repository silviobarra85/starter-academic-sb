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
  'static/fanta-engine/js/apps/iosudo-app-v618.js',
  'static/fanta-engine/css/iosudo-app-v618.css',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json'
];

function fail(message) {
  console.error('[ioSudo V618][FAIL]', message);
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
if (!index.includes('../fanta-engine/css/iosudo-app-v618.css?v=618')) fail('ioSudo CSS V618 not linked');
if (!index.includes('../fanta-engine/js/apps/iosudo-app-v618.js?v=618')) fail('ioSudo JS V618 not linked');
if (!index.includes('data-iosudo-version="618"')) fail('ioSudo data version not bumped');

const app = read('static/fanta-engine/js/apps/iosudo-app-v618.js');
for (const token of [
  '../fanta-engine/data/sudatori/current/',
  'manifest.json',
  'loadLeagueRosters',
  'applyLiveRosters',
  'fantasyRosterText',
  'assets/rose/manifest.json',
  'liveRosterFor',
  'leagueBaseUrl',
  'iosudo-team-theme-bologna',
  'iosudo-team-theme-cagliari',
  'iosudo-team-theme-genoa',
  'sourcesHtml',
  'normalizeFormationLine'
]) {
  if (!app.includes(token)) fail('Missing app token: ' + token);
}

const css = read('static/fanta-engine/css/iosudo-app-v618.css');
for (const cls of [
  'iosudo-team-theme-atalanta','iosudo-team-theme-inter','iosudo-team-theme-bologna','iosudo-team-theme-cagliari','iosudo-team-theme-genoa','iosudo-team-theme-lazio','iosudo-team-theme-napoli','iosudo-team-theme-juventus','iosudo-team-theme-udinese','iosudo-team-theme-lecce','iosudo-team-theme-roma','iosudo-team-theme-frosinone','iosudo-team-theme-monza','iosudo-team-theme-fiorentina','iosudo-team-theme-milan','iosudo-team-theme-parma','iosudo-team-theme-torino','iosudo-team-theme-venezia','iosudo-team-theme-sassuolo'
]) {
  if (!css.includes(cls)) fail('Missing CSS team theme: ' + cls);
}
if (!css.includes('repeating-linear-gradient')) fail('Team card stripes missing');
if (!css.includes('iosudo-source-chips')) fail('Source chips CSS missing');

const sw = read('static/iosudo/sw.js');
if (!sw.includes('iosudo-shell-v618')) fail('Service worker cache not V618');
if (!sw.includes('/fanta-engine/data/sudatori/current/')) fail('Service worker network-first missing for Sudatori data');
if (!sw.includes('/assets/rose/')) fail('Service worker network-first missing for live rosters');
if (!sw.includes("cache: 'no-store'")) fail('Service worker data fetch is not network-first/no-store');

const manifest = JSON.parse(read('static/iosudo/manifest.webmanifest'));
if (manifest.short_name !== 'ioSudo') fail('Wrong PWA short_name');
if (manifest.start_url !== '/iosudo/') fail('Wrong PWA start_url');

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const html = read(`static/${league}/index.html`);
  if (!html.includes('data-iosudo-link-v618="true"')) fail('Missing ioSudo link in ' + league + ' index');
  const redirect = read(`static/${league}/iosudo/index.html`);
  if (!redirect.includes('/iosudo/')) fail('Missing ioSudo redirect in ' + league);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  if (cfg.currentVersion !== '618') fail('Wrong currentVersion in ' + league);
  if (cfg.features?.ioSudoLiveRosters !== 'V618') fail('Missing ioSudoLiveRosters feature flag in ' + league);
}

const zonaManifest = JSON.parse(read('static/zonaorientale/assets/rose/manifest.json'));
const latest = (zonaManifest.rosters || []).filter((entry) => entry.seasonId === '2026-2027').sort((a,b) => String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || ''), 'it'))[0];
if (!latest?.file) fail('Missing latest Zona Orientale 2026-2027 roster file');
const zonaRoster = JSON.parse(read('static/zonaorientale/assets/rose/' + latest.file));
const rosterPlayers = (zonaRoster.rosters || []).flatMap((team) => (team.players || []).map((p) => ({ ...p, fantasyRoster: team.name })));
if (rosterPlayers.length < 100) fail('Zona live roster seems too small');
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
const allSudatori = Object.values(data.playersByTeam || {}).flat();
const indexRoster = new Set(rosterPlayers.map((p) => `${norm(p.playerName)}::${norm(p.realTeam)}::${norm(p.role).slice(0,1)}`));
let directMatches = 0;
for (const p of allSudatori) {
  const realTeam = norm(p.listone?.realTeam || p.teamId || p.teamName);
  const key = `${norm(p.playerName)}::${realTeam}::${norm(p.role).slice(0,1)}`;
  if (indexRoster.has(key)) directMatches += 1;
}
if (directMatches < 120) fail('Too few direct matches between Sudatori and live Zona rosters: ' + directMatches);

console.log('[ioSudo V618] Audit OK:', JSON.stringify({ liveRosterFile: latest.file, rosterPlayers: rosterPlayers.length, directMatches }));
