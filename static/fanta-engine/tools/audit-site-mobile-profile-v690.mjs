import { readFileSync } from 'node:fs';
const z = readFileSync('static/zonaorientale/assets/app.js','utf8');
const f = readFileSync('static/fantapetillomantramanager/assets/app.js','utf8');
const zi = readFileSync('static/zonaorientale/index.html','utf8');
const css = readFileSync('static/fanta-engine/css/site-performance-v690.css','utf8');
function assertOk(c,m){ if(!c) throw new Error(m); }
for (const [name, app] of [['zonaorientale',z],['fmm',f]]) {
  assertOk(app.includes('fantaSiteTeamProfileCardsV690'), name + ': patch profilo squadra mancante');
  assertOk(app.includes('team-profile-movement-card-v690'), name + ': card movimenti responsive mancanti');
  assertOk(app.includes('team-profile-news-card-v690'), name + ': card comunicati responsive mancanti');
}
assertOk(zi.includes('site-performance-v690.css?v=690'), 'index sito non punta CSS V690');
assertOk(css.includes('team-profile-movement-card-v690'), 'CSS movimenti V690 mancante');
assertOk(css.includes('max-width: min(100%, calc(100dvw - 1.5rem))'), 'CSS width mobile adattiva mancante');
console.log('Audit site V690 OK');
