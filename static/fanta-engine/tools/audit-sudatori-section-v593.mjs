import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
function ok(name, pass, detail = '') { checks.push({ name, pass, detail }); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

const css = 'static/fanta-engine/css/sudatori-section-v593.css';
const js = 'static/fanta-engine/js/sections/sudatori-section-v593.js';
const dataPath = 'static/fanta-engine/data/sudatori/current/sudatori-data.json';
const manifestPath = 'static/fanta-engine/data/sudatori/current/manifest.json';

ok('CSS V593 presente', exists(css), css);
ok('JS V593 presente', exists(js), js);
ok('Dati Sudatori presenti', exists(dataPath), dataPath);
ok('Manifest Sudatori presente', exists(manifestPath), manifestPath);

if (exists(js)) {
  const source = read(js);
  ok('Campetto renderPitch presente', /function\s+renderPitch\s*\(/.test(source), 'renderPitch');
  ok('Matching canonico presente', /canonicalName/.test(source) && /listoneByCanon/.test(source), 'canonicalName/listoneByCanon');
  ok('Versione runtime V593', /const VERSION = 'V593'/.test(source), 'VERSION V593');
}
if (exists(css)) {
  const source = read(css);
  ok('CSS campetto presente', /sudatori-pitch-v593/.test(source), 'sudatori-pitch-v593');
}
if (exists(manifestPath)) {
  const manifest = JSON.parse(read(manifestPath));
  ok('Manifest V593', manifest.version === 'V593', manifest.version);
  ok('Listone 2026-07-04 dichiarato', manifest.listoneFile === '2026-07-04.json', manifest.listoneFile);
  ok('Matching migliorato oltre V592', Number(manifest.listoneMatchedPlayers || 0) >= 450, String(manifest.listoneMatchedPlayers));
}
if (exists(dataPath)) {
  const data = JSON.parse(read(dataPath));
  ok('Meta V593', data.meta?.version === 'V593', data.meta?.version);
  const napoli = data.playersByTeam?.napoli || [];
  const mil = napoli.find((p) => /milinkovic/i.test(p.playerName || ''));
  ok('Milinkovic-Savic Napoli matcha listone', !!(mil && mil.listone && /Milinkovic-Savic V\./.test(mil.listone.playerName || '')), mil ? `${mil.playerName} -> ${mil.listone?.playerName || 'null'}` : 'non trovato');
  ok('Milinkovic-Savic ha rosa fantacalcio', !!(mil && String(mil.fantasyRoster || '').trim()), mil?.fantasyRoster || 'vuoto');
  const teamsWithXi = Object.values(data.playersByTeam || {}).filter((players) => (players || []).some((p) => p.probableXi || p.formationPosition)).length;
  ok('Probabili formazioni disponibili', teamsWithXi >= 18, `${teamsWithXi} squadre`);
}
for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = `static/${league}/index.html`;
  if (exists(index)) {
    const html = read(index);
    ok(`${league}: CSS Sudatori V593 referenziato`, html.includes('sudatori-section-v593.css?v=593'), index);
    ok(`${league}: JS Sudatori V593 referenziato`, html.includes('sudatori-section-v593.js?v=593'), index);
  }
  const cfg = `static/${league}/assets/league-config.json`;
  if (exists(cfg)) {
    const config = JSON.parse(read(cfg));
    ok(`${league}: currentVersion V593`, String(config.currentVersion) === '593', config.currentVersion);
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) {
  console.log(`${c.pass ? 'OK' : 'FAIL'} - ${c.name}${c.detail ? ` (${c.detail})` : ''}`);
}
if (failed.length) {
  console.error(`\nAudit V593 fallito: ${failed.length} errori.`);
  process.exit(1);
}
console.log('\nAudit V593 superato.');
