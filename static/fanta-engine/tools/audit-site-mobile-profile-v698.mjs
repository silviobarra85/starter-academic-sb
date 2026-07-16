import fs from 'node:fs';
const z = fs.readFileSync('static/zonaorientale/assets/app.js','utf8');
const f = fs.readFileSync('static/fantapetillomantramanager/assets/app.js','utf8');
const zi = fs.readFileSync('static/zonaorientale/index.html','utf8');
function ok(c,m){ if(!c) throw new Error(m); }
for (const [name,txt] of [['zona',z],['fpm',f]]) {
  ok(txt.includes('fantaSiteProfileMovementsV698'), name + ' manca patch V698');
  ok(txt.includes('site-mobile-profile-movement-note-v698'), name + ' non mostra note movimenti');
  ok(txt.includes('Fantacalcio - V698 - Aggiornato al 16/07/2026'), name + ' footer non V698');
}
ok(zi.includes('app.js?v=698'), 'index zona non cache-buster V698');
ok(zi.includes('site-performance-v698.css?v=698'), 'index zona css non V698');
console.log('Audit site mobile profile V698 OK');
