import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/sudatori-data.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/manifest.json', 'utf8'));
function assert(cond,msg){ if(!cond){ console.error('[V640][FAIL]',msg); process.exit(1); } }
assert(manifest.version === 'V640', 'manifest version');
assert((manifest.current || manifest.dataFile) === 'sudatori-data.json', 'manifest current/dataFile');
assert(data.meta.version === 'V640', 'data meta version');
assert(Array.isArray(data.updateLogV640) && data.updateLogV640.length >= 4, 'updateLogV640');
assert(Array.isArray(data.missingPreciseArticlesV640) && data.missingPreciseArticlesV640.length === 0, 'missing precise articles empty');
assert((data.marketSummaryByTeam?.roma?.officialIncoming || []).some(x => /dybala/i.test(x.playerName || x.target || '')), 'Dybala official in Roma summary');
console.log('[V640][OK] Sudatori data', { talks: manifest.teamTransferTalks, officialIncoming: manifest.officialIncoming, officialOutgoing: manifest.officialOutgoing, sources: manifest.sources });
