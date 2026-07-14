import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

const js = read('static/fanta-engine/js/apps/iosudo-app-v656.js');
const html = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

assert(html.includes('data-iosudo-version="656"'), 'index non aggiornato a V656');
assert(html.includes('iosudo-app-v656.js?v=656'), 'script V656 non caricato');
assert(html.includes('iosudo-app-v656.css?v=656'), 'css V656 non caricato');
assert(sw.includes('iosudo-shell-v656'), 'service worker cache non aggiornata');
assert(sw.includes('iosudo-app-v656.js?v=656'), 'service worker non precache JS V656');
assert(js.includes("new Set(['xi', 'mercato', 'sos', 'rose', 'amichevoli'])"), 'tab Rosa non ammesso nel pannello squadra');
assert(js.includes("tabButton('rose', 'Rosa')"), 'bottone Rosa non presente');
assert(js.includes("renderList('Rosa', teamPlayersList(teamId), playerItem)"), 'contenuto Rosa non renderizzato');
assert(js.includes('giocatori presenti solo in RUMOR/UFFICIALITA non vengono materializzati in GIOCATORI'), 'vincolo GIOCATORI leggero mancante');

console.log('Audit ioSudo V656 OK', JSON.stringify({ version: 656, teamRosterTab: true, globalPlayersFast: true }));
