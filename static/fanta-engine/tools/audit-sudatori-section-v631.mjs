import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function readJson(rel) { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
function assert(ok, msg) { if (!ok) throw new Error(msg); }

const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
assert(manifest.version === 'V631', 'manifest version non V631');
assert(typeof manifest.current === 'string' && manifest.current === 'sudatori-data.json', 'manifest.current deve puntare a sudatori-data.json');
assert(manifest.dataFile === 'sudatori-data.json', 'manifest.dataFile mancante');
assert(data.meta && data.meta.version === 'V631', 'data meta version non V631');
assert(Array.isArray(data.teams) && data.teams.length === 20, 'teams non valide');
assert(data.playersByTeam && Object.keys(data.playersByTeam).length >= 20, 'playersByTeam non valido');
const jsPath = path.join(root, 'static/fanta-engine/js/sections/sudatori-section-v631.js');
const js = fs.readFileSync(jsPath, 'utf8');
assert(js.includes('sudatoriDataFileFromManifest'), 'loader robusto manifest mancante');
console.log('[V631 audit] OK - manifest.current/dataFile puntano a sudatori-data.json e loader robusto presente');
