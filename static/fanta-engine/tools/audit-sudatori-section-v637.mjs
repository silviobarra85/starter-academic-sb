import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/sudatori-data.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/manifest.json', 'utf8'));
function assert(cond, msg){ if(!cond){ console.error('[V637][FAIL]', msg); process.exit(1); }}
assert(manifest.version === 'V637', 'manifest version V637');
assert(manifest.current === 'sudatori-data.json', 'manifest.current');
assert(data.meta.version === 'V637', 'data meta version');
assert((data.updateLogV637 || []).length >= 4, 'updateLogV637');
assert(Array.isArray(data.missingPreciseArticlesV637) && data.missingPreciseArticlesV637.length === 0, 'missingPreciseArticlesV637 empty');
console.log('[V637][OK] Sudatori data', { players: manifest.players, talks: manifest.teamTransferTalks, officialIncoming: manifest.officialIncoming, officialOutgoing: manifest.officialOutgoing, injuries: manifest.injuries, sources: manifest.sources });
