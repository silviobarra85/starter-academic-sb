import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
function ok(name, pass, detail = '') { checks.push({ name, pass, detail }); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

const css = 'static/fanta-engine/css/sudatori-section-v594.css';
const js = 'static/fanta-engine/js/sections/sudatori-section-v594.js';
const dataPath = 'static/fanta-engine/data/sudatori/current/sudatori-data.json';
const manifestPath = 'static/fanta-engine/data/sudatori/current/manifest.json';

ok('CSS V594 presente', exists(css), css);
ok('JS V594 presente', exists(js), js);
ok('Dati Sudatori presenti', exists(dataPath), dataPath);
ok('Manifest Sudatori presente', exists(manifestPath), manifestPath);

if (exists(js)) {
  const source = read(js);
  ok('Campetto renderPitch presente', /function\s+renderPitch\s*\(/.test(source), 'renderPitch');
  ok('Matching canonico presente', /canonicalName/.test(source) && /listoneByCanon/.test(source), 'canonicalName/listoneByCanon');
  ok('Versione runtime V594', /const VERSION = 'V594'/.test(source), 'VERSION V594');
  ok('Render trattative presente', /function\s+renderTransferTalks\s*\(/.test(source), 'renderTransferTalks');
}
if (exists(css)) {
  const source = read(css);
  ok('CSS campetto presente', /sudatori-pitch-v594/.test(source), 'sudatori-pitch-v594');
  ok('CSS trattative presente', /sudatori-transfer-talks-v594/.test(source), 'sudatori-transfer-talks-v594');
}
if (exists(manifestPath)) {
  const manifest = JSON.parse(read(manifestPath));
  ok('Manifest V594', manifest.version === 'V594', manifest.version);
  ok('Listone 2026-07-04 dichiarato', manifest.listoneFile === '2026-07-04.json', manifest.listoneFile);
  ok('Matching migliorato oltre V592', Number(manifest.listoneMatchedPlayers || 0) >= 450, String(manifest.listoneMatchedPlayers));
}
if (exists(dataPath)) {
  const data = JSON.parse(read(dataPath));
  ok('Meta V594', data.meta?.version === 'V594', data.meta?.version);
  const napoli = data.playersByTeam?.napoli || [];
  const mil = napoli.find((p) => /milinkovic/i.test(p.playerName || ''));
  ok('Milinkovic-Savic Napoli matcha listone', !!(mil && mil.listone && /Milinkovic-Savic V\./.test(mil.listone.playerName || '')), mil ? `${mil.playerName} -> ${mil.listone?.playerName || 'null'}` : 'non trovato');
  ok('Milinkovic-Savic ha rosa fantacalcio', !!(mil && String(mil.fantasyRoster || '').trim()), mil?.fantasyRoster || 'vuoto');
  const teamsWithXi = Object.values(data.playersByTeam || {}).filter((players) => (players || []).some((p) => p.probableXi || p.formationPosition)).length;
  ok('Probabili formazioni disponibili', teamsWithXi >= 18, `${teamsWithXi} squadre`);
  const talks = data.teamTransferTalksByTeam || {};
  const talksCount = Object.values(talks).reduce((sum, items) => sum + (Array.isArray(items) ? items.length : 0), 0);
  ok('Trattative squadra disponibili', talksCount >= 100, `${talksCount} trattative`);
  ok('Atalanta ha trattative', (talks.atalanta || []).length >= 1, `${(talks.atalanta || []).length} trattative Atalanta`);
}
for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = `static/${league}/index.html`;
  if (exists(index)) {
    const html = read(index);
    ok(`${league}: CSS Sudatori V594 referenziato`, html.includes('sudatori-section-v594.css?v=594'), index);
    ok(`${league}: JS Sudatori V594 referenziato`, html.includes('sudatori-section-v594.js?v=594'), index);
  }
  const cfg = `static/${league}/assets/league-config.json`;
  if (exists(cfg)) {
    const config = JSON.parse(read(cfg));
    ok(`${league}: currentVersion V594`, String(config.currentVersion) === '594', config.currentVersion);
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) {
  console.log(`${c.pass ? 'OK' : 'FAIL'} - ${c.name}${c.detail ? ` (${c.detail})` : ''}`);
}
if (failed.length) {
  console.error(`\nAudit V594 fallito: ${failed.length} errori.`);
  process.exit(1);
}
console.log('\nAudit V594 superato.');
