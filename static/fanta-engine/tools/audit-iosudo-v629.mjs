import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function readJson(rel) { return JSON.parse(read(rel)); }
function fail(msg) { console.error('[ioSudo V629] ' + msg); process.exit(1); }
const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
if (manifest.version !== 'V629') fail('manifest non V629');
const app = read('static/fanta-engine/js/apps/iosudo-app-v629.js');
for (const token of ['function sourceHref','articleUrl || item.preciseArticleUrl','function renderGlobalView','function renderPlayerDetail']) { if (!app.includes(token)) fail('token mancante app: ' + token); }
if (!read('static/iosudo/index.html').includes('iosudo-app-v629.js')) fail('index ioSudo non punta a v629');
if (!read('static/iosudo/sw.js').includes('v629')) fail('service worker non aggiornato a v629');
console.log('[ioSudo V629] Audit OK');
