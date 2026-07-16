import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function ok(condition, message) { if (!condition) throw new Error(message); }

const zIndex = read('static/zonaorientale/index.html');
const fIndex = read('static/fantapetillomantramanager/index.html');
const js = read('static/fanta-engine/js/ui/boot-preloader-v699.js');
const css = read('static/fanta-engine/css/boot-preloader-v699.css');

for (const [name, html] of [['zonaorientale', zIndex], ['fantapetillomantramanager', fIndex]]) {
  ok(html.includes('boot-preloader-v699.css?v=699'), `${name}: CSS preloader non punta a V699`);
  ok(html.includes('boot-preloader-v699.js?v=699'), `${name}: JS preloader non punta a V699`);
  ok(html.includes('data-fanta-boot-preloader-css-v699'), `${name}: data attr CSS V699 assente`);
  ok(html.includes('data-fanta-boot-preloader-v699'), `${name}: data attr JS V699 assente`);
}

ok(js.includes('bootPreloaderV699'), 'funzione bootPreloaderV699 assente');
ok(js.includes('shuffleMessages'), 'shuffleMessages assente: le frasi non sono randomizzate');
ok(js.includes('Gianluca Tozzi Caparrotti:'), 'frasi con autore assenti');
ok(js.includes('Mario Guariglia:'), 'frasi con autore Mario assenti');
ok(js.includes('messagePool.length'), 'conteggio messaggi non esposto');
ok((js.match(/: “/g) || []).length >= 20, 'troppo poche frasi con autore');
ok(css.includes('overflow-wrap:anywhere'), 'CSS non protegge frasi lunghe');

console.log('Audit site preloader V699 OK', JSON.stringify({ version: 699, iconicQuotes: true, randomMessages: true }));
