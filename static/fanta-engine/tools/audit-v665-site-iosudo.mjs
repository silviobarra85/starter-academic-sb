import fs from 'node:fs';
const must = [
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'static/fanta-engine/css/site-performance-v665.css',
  'static/fanta-engine/js/ui/boot-preloader-v665.js',
  'static/fanta-engine/data/sudatori/current/manifest.json',
  'static/iosudo/index.html'
];
for (const p of must) if (!fs.existsSync(p)) throw new Error(`Missing ${p}`);
const css = fs.readFileSync('static/fanta-engine/css/site-performance-v665.css','utf8');
const boot = fs.readFileSync('static/fanta-engine/js/ui/boot-preloader-v665.js','utf8');
const manifest = JSON.parse(fs.readFileSync('static/fanta-engine/data/sudatori/current/manifest.json','utf8'));
const idx = fs.readFileSync('static/zonaorientale/index.html','utf8');
const app = fs.readFileSync('static/zonaorientale/assets/app.js','utf8');
function ok(cond,msg){ if(!cond) throw new Error(msg); }
ok(css.includes('listone-main-panel') && css.includes('background-image: none'), 'sfondo listone non neutralizzato');
ok(boot.includes('maxWaitMs: 7600') && boot.includes('Michele'), 'boot preloader V665 non aggiornato');
ok(manifest.uiVersion === 665 && manifest.globalPlayersMarketOnly === false, 'manifest ioSudo non V665');
ok(idx.includes('boot-preloader-v665.js?v=665') && idx.includes('site-performance-v665.css?v=665') && idx.includes('assets/app.js?v=665'), 'index non cache-busted V665');
ok(app.includes('FantaSiteMobileCardsV665') && app.includes('forceFooterVersionV665'), 'app patch V665 mancante');
console.log('Audit V665 OK', JSON.stringify({ uiVersion: manifest.uiVersion, players: manifest.players, talks: manifest.teamTransferTalks, official: manifest.officialMoves, friendlies: manifest.friendlies, sources: manifest.sources }));
