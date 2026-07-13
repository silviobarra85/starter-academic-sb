import fs from 'node:fs';
const app = fs.readFileSync('static/fanta-engine/js/apps/iosudo-app-v642.js', 'utf8');
const html = fs.readFileSync('static/iosudo/index.html', 'utf8');
const sw = fs.readFileSync('static/iosudo/sw.js', 'utf8');
function assert(cond,msg){ if(!cond){ console.error('[V642][FAIL]',msg); process.exit(1); } }
assert(html.includes('iosudo-app-v642.js?v=642'), 'index v642 js');
assert(html.includes('iosudo-app-v642.css?v=642'), 'index v642 css');
assert(sw.includes('iosudo-shell-v642'), 'service worker v642');
assert(app.includes('function injuriesForPlayer(player)'), 'injuriesForPlayer helper defined');
assert(app.includes('injuriesForPlayer(player).length > 0'), 'SOS uses injuriesForPlayer helper');
assert(app.includes('playerSourceText'), 'playerSourceText present');
assert(app.includes('Sorgente:'), 'source label present in player card');
console.log('[V642][OK] ioSudo players view injury source helper verified');
