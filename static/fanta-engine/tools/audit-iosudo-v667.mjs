import fs from 'node:fs';
function read(path){ return fs.readFileSync(path,'utf8'); }
function assertOk(condition, message){ if(!condition) throw new Error(message); }
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const app = read('static/fanta-engine/js/apps/iosudo-app-v667.js');
const manifest = JSON.parse(read('static/fanta-engine/data/sudatori/current/manifest.json'));
assertOk(index.includes('iosudo-app-v667.js?v=667'), 'index non punta al JS V667');
assertOk(index.includes('iosudo-app-v667.css?v=667'), 'index non punta al CSS V667');
assertOk(index.includes('data-iosudo-version="667"'), 'data-iosudo-version non aggiornato a 667');
assertOk(sw.includes('iosudo-shell-v667'), 'service worker non usa cache V667');
assertOk(app.includes('formatDateTime'), 'ioSudo non include formatDateTime');
assertOk(app.includes('updatedAtTime') && app.includes('ore '), 'header ioSudo non mostra anche ora');
assertOk(String(manifest.uiVersion) === '667', 'manifest uiVersion non aggiornato');
console.log('Audit ioSudo V667 OK', JSON.stringify({version:667, headerDateTime:true, uiVersion:manifest.uiVersion}));
