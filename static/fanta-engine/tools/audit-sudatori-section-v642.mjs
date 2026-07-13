import fs from 'node:fs';
const manifest = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/manifest.json', 'utf8'));
const dataFile = manifest.dataFile || manifest.current || 'sudatori-data.json';
const data = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/' + dataFile, 'utf8'));
function assert(cond,msg){ if(!cond){ console.error('[V642][FAIL]',msg); process.exit(1); } }
assert(data && data.teams && data.teams.length >= 20, 'teams loaded');
assert(data.playersByTeam && Object.keys(data.playersByTeam).length >= 20, 'playersByTeam loaded');
assert(manifest.current === 'sudatori-data.json' || manifest.dataFile === 'sudatori-data.json', 'manifest points to sudatori-data.json');
console.log('[V642][OK] Sudatori data manifest verified');
