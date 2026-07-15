import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'static/fanta-engine/css/site-performance-v681.css',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html'
];
for (const file of files) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`File mancante: ${file}`);
}
const app = fs.readFileSync(path.join(root, 'static/zonaorientale/assets/app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'static/fanta-engine/css/site-performance-v681.css'), 'utf8');
const index = fs.readFileSync(path.join(root, 'static/zonaorientale/index.html'), 'utf8');
function ok(cond, msg){ if (!cond) throw new Error(msg); }
ok(app.includes('FantaSiteMobileCardsV681'), 'marker JS V681 mancante');
ok(app.includes('site-listone-change-corner-v681'), 'corner badge V681 mancante');
ok(app.includes('INVARIATO') && app.includes('NUOVO') && app.includes('QT.A'), 'label modifica V681 mancanti');
ok(css.includes('site-listone-change-badge-v681') && css.includes('min-width: clamp(6.8rem'), 'CSS badge leggibile mancante');
ok(index.includes('site-performance-v681.css?v=681'), 'index non punta a CSS V681');
console.log('Audit site mobile cards V681 OK');
