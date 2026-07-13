import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
function readJson(rel) { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(msg) { console.error('[Sudatori V630] ' + msg); process.exit(1); }
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
if (manifest.version !== 'V630') fail('manifest non V630');
if (data.meta?.version !== 'V630') fail('data meta non V630');
if (manifest.dateLogicalRowsV630 !== 13) fail('conteggio righe date logiche errato');
if ((manifest.sources || 0) < 128) fail('fonti V630 non caricate');
if (!Array.isArray(data.v630AppliedRows) || data.v630AppliedRows.length !== 13) fail('log righe V630 mancante');
let hasDybala = false;
let hasVergara = false;
for (const cards of Object.values(data.teamTransferTalksByTeam || {})) {
  for (const card of cards || []) {
    const s = JSON.stringify(card);
    if (s.includes('Dybala') && s.includes('Rinnovo quasi fatto')) hasDybala = true;
    if (s.includes('Vergara') && s.includes('Giornata decisiva rinnovo')) hasVergara = true;
  }
}
if (!hasDybala) fail('aggiornamento Dybala non trovato');
if (!hasVergara) fail('aggiornamento Vergara non trovato');
const js = read('static/fanta-engine/js/sections/sudatori-section-v630.js');
for (const token of ['itemArticleUrlV630','loadLeagueRosters']) { if (!js.includes(token)) fail('token mancante in Sudatori JS: ' + token); }
console.log('[Sudatori V630] Audit OK');
