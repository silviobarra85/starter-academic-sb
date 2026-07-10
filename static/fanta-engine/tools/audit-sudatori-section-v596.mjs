import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
function ok(name, pass, detail = '') { checks.push({ name, pass, detail }); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function expectedModule(raw) {
  const m = String(raw || '').match(/\d\s*-\s*\d(?:\s*-\s*\d){0,2}/);
  return m ? m[0].replace(/\s+/g, '') : String(raw || '').trim();
}
function moduleParts(module) { return String(module || '').split('-').map((x) => Number(x)).filter(Boolean); }
function expectedCounts(module) {
  const p = moduleParts(module);
  if (p.length === 3) return { defense: p[0], midfield: p[1], attack: p[2] };
  if (p.length === 4) return { defense: p[0], midfield: p[1], attackingMidfield: p[2], attack: p[3] };
  return null;
}
function countLines(items) {
  const out = {};
  for (const x of items || []) out[x.formationLine || ''] = (out[x.formationLine || ''] || 0) + 1;
  return out;
}

const css = 'static/fanta-engine/css/sudatori-section-v596.css';
const js = 'static/fanta-engine/js/sections/sudatori-section-v596.js';
const dataPath = 'static/fanta-engine/data/sudatori/current/sudatori-data.json';
const manifestPath = 'static/fanta-engine/data/sudatori/current/manifest.json';

ok('CSS V596 presente', exists(css), css);
ok('JS V596 presente', exists(js), js);
ok('Dati Sudatori presenti', exists(dataPath), dataPath);
ok('Manifest Sudatori presente', exists(manifestPath), manifestPath);

if (exists(js)) {
  const source = read(js);
  ok('Versione runtime V596', /const VERSION = 'V596'/.test(source), 'VERSION V596');
  ok('Render infortunati presente', /function\s+renderInjuries\s*\(/.test(source), 'renderInjuries');
  ok('Campetto usa formationsByTeam', /function\s+getFormation\s*\(/.test(source) && /getFormation\(team\.id\)/.test(source), 'getFormation');
  ok('Badge fisico presente', /physicalBadgeFromText/.test(source), 'physicalBadgeFromText');
}
if (exists(css)) {
  const source = read(css);
  ok('CSS infortunati presente', /sudatori-injuries-v596/.test(source), 'sudatori-injuries-v596');
  ok('CSS stato fisico presente', /sudatori-physical-v596/.test(source), 'sudatori-physical-v596');
}
if (exists(manifestPath)) {
  const manifest = JSON.parse(read(manifestPath));
  ok('Manifest V596', manifest.version === 'V596', manifest.version);
  ok('Infortuni dichiarati', Number(manifest.injuries || 0) >= 6, String(manifest.injuries));
}
if (exists(dataPath)) {
  const data = JSON.parse(read(dataPath));
  ok('Meta V596', data.meta?.version === 'V596', data.meta?.version);
  ok('Infortunati caricati', Number(data.meta?.injuries || 0) >= 6, String(data.meta?.injuries));
  ok('Infortuni by team presente', Object.values(data.injuriesByTeam || {}).flat().length >= 6, String(Object.values(data.injuriesByTeam || {}).flat().length));
  const ata = data.formationsByTeam?.atalanta || [];
  ok('Atalanta: Kossounou in XI', ata.some((p) => /kossounou/i.test(p.playerName || '')), ata.map((p) => p.playerName).join(', '));
  ok('Atalanta: Hien non in XI', !ata.some((p) => /^hien$/i.test(p.playerName || '')), ata.map((p) => p.playerName).join(', '));
  const laz = data.formationsByTeam?.lazio || [];
  ok('Lazio: Cancellieri in XI', laz.some((p) => /cancellieri/i.test(p.playerName || '')), laz.map((p) => p.playerName).join(', '));
  ok('Lazio: Isaksen non in XI', !laz.some((p) => /isaksen/i.test(p.playerName || '')), laz.map((p) => p.playerName).join(', '));
  let shapeOk = true;
  let shapeDetail = [];
  for (const team of data.teams || []) {
    const items = data.formationsByTeam?.[team.id] || [];
    const module = team.formationModule || expectedModule(team.module);
    const exp = expectedCounts(module);
    const got = countLines(items);
    if (!items.length || !exp || got.goalkeeper !== 1 || Object.entries(exp).some(([k, v]) => got[k] !== v)) {
      shapeOk = false;
      shapeDetail.push(`${team.name}:${module}:${JSON.stringify(got)}`);
    }
    if (items.some((x) => x.moduleUsed !== module)) {
      shapeOk = false;
      shapeDetail.push(`${team.name}:moduleUsed mismatch`);
    }
  }
  ok('Tutti i campetti rispettano il modulo dichiarato', shapeOk, shapeDetail.slice(0, 4).join(' | '));
}
for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = `static/${league}/index.html`;
  if (exists(index)) {
    const html = read(index);
    ok(`${league}: CSS Sudatori V596 referenziato`, html.includes('sudatori-section-v596.css?v=596'), index);
    ok(`${league}: JS Sudatori V596 referenziato`, html.includes('sudatori-section-v596.js?v=596'), index);
  }
  const cfg = `static/${league}/assets/league-config.json`;
  if (exists(cfg)) {
    const config = JSON.parse(read(cfg));
    ok(`${league}: currentVersion V596`, String(config.currentVersion) === '596', config.currentVersion);
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) console.log(`${c.pass ? 'OK' : 'FAIL'} - ${c.name}${c.detail ? ` (${c.detail})` : ''}`);
if (failed.length) {
  console.error(`\nAudit V596 fallito: ${failed.length} errori.`);
  process.exit(1);
}
console.log('\nAudit V596 superato.');
