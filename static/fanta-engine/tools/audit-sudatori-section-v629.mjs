import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
function readJson(rel) { return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(msg) { console.error('[Sudatori V629] ' + msg); process.exit(1); }
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const data = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
if (manifest.version !== 'V629') fail('manifest non V629');
if (data.meta?.version !== 'V629') fail('data meta non V629');
if (manifest.recoveredArticleRowsV629 !== 43) fail('conteggio righe recupero v9 errato');
if (manifest.recoveredArticleRowsOkV629 !== 33) fail('conteggio recuperi OK v9 errato');
if (manifest.missingPreciseArticlesV629 !== 10) fail('conteggio articoli mancanti v9 errato');
if (manifest.articleLinksMode !== 'ARTICLE_URL_FIRST_NO_GENERIC_FALLBACK') fail('articleLinksMode non attivo');
if ((manifest.players || 0) < 700) fail('troppi pochi giocatori');
if ((manifest.teamTransferTalks || 0) < 180) fail('troppo poche trattative aggregate');
let badClickable = 0;
function walk(o) {
  if (Array.isArray(o)) return o.forEach(walk);
  if (!o || typeof o !== 'object') return;
  const ver = String(o.sourceVerification || '').toLowerCase();
  const typ = String(o.sourceType || '').toLowerCase();
  const url = String(o.articleUrl || o.url || o.source || o.href || '');
  if ((ver.includes('da verificare') || typ.includes('fonte generica') || typ.includes('pagina generica') || typ.includes('pagina aggregata')) && /^https?:\/\//.test(url)) badClickable += 1;
  Object.values(o).forEach(walk);
}
walk(data);
if (badClickable) fail('fonti DA_VERIFICARE ancora cliccabili: ' + badClickable);
const js = read('static/fanta-engine/js/sections/sudatori-section-v629.js');
for (const token of ['itemArticleUrlV629','loadLeagueRosters']) { if (!js.includes(token)) fail('token mancante in Sudatori JS: ' + token); }
console.log('[Sudatori V629] Audit OK');
