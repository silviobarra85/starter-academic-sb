import fs from 'node:fs';
const app = fs.readFileSync('static/fanta-engine/js/apps/iosudo-app-v639.js', 'utf8');
const html = fs.readFileSync('static/iosudo/index.html', 'utf8');
const sw = fs.readFileSync('static/iosudo/sw.js', 'utf8');
function assert(cond,msg){ if(!cond){ console.error('[V639][FAIL]',msg); process.exit(1); } }
assert(html.includes('iosudo-app-v639.js?v=639'), 'index v639 js');
assert(html.includes('iosudo-app-v639.css?v=639'), 'index v639 css');
assert(sw.includes('iosudo-shell-v639'), 'service worker v639');
assert(app.includes('playerSourceText'), 'playerSourceText helper');
assert(app.includes('Sorgente:'), 'source label in player card');
assert(app.includes('addListoneRowsToPlayers'), 'listone rows included');
console.log('[V639][OK] ioSudo source labels and listone players verified');
