import fs from 'node:fs';
const app = fs.readFileSync('static/fanta-engine/js/apps/iosudo-app-v640.js', 'utf8');
const html = fs.readFileSync('static/iosudo/index.html', 'utf8');
const sw = fs.readFileSync('static/iosudo/sw.js', 'utf8');
function assert(cond,msg){ if(!cond){ console.error('[V640][FAIL]',msg); process.exit(1); } }
assert(html.includes('iosudo-app-v640.js?v=640'), 'index v640 js');
assert(html.includes('iosudo-app-v640.css?v=640'), 'index v640 css');
assert(sw.includes('iosudo-shell-v640'), 'service worker v640');
assert(app.includes('playerSourceText'), 'playerSourceText helper');
assert(app.includes('Sorgente:'), 'source label in player card');
assert(app.includes('addListoneRowsToPlayers'), 'listone rows included');
console.log('[V640][OK] ioSudo source labels and listone players verified');
