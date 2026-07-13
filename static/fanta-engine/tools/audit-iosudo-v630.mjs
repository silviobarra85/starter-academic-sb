import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function readJson(rel) { return JSON.parse(read(rel)); }
function fail(msg) { console.error('[ioSudo V630] ' + msg); process.exit(1); }
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
if (manifest.version !== 'V630') fail('manifest non V630');
const app = read('static/fanta-engine/js/apps/iosudo-app-v630.js');
for (const token of ['function sourceHref','renderGlobalView','renderPlayerDetail','Giocatori']) { if (!app.includes(token)) fail('token mancante app: ' + token); }
if (!read('static/iosudo/index.html').includes('iosudo-app-v630.js')) fail('index ioSudo non punta a v630');
if (!read('static/iosudo/sw.js').includes('v630')) fail('service worker non aggiornato a v630');
console.log('[ioSudo V630] Audit OK');
