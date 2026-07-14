import fs from 'node:fs';
function read(path){ return fs.readFileSync(path,'utf8'); }
function assertOk(condition, message){ if(!condition) throw new Error(message); }
const css = read('static/fanta-engine/css/site-performance-v667.css');
const boot = read('static/fanta-engine/js/ui/boot-preloader-v667.js');
for (const league of ['zonaorientale','fantapetillomantramanager']) {
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  const config = JSON.parse(read(`static/${league}/assets/league-config.json`));
  assertOk(index.includes('site-performance-v667.css?v=667'), `${league}: index non punta al CSS V667`);
  assertOk(index.includes('boot-preloader-v667.js?v=667'), `${league}: index non punta al preloader V667`);
  assertOk(index.includes('app.js?v=667'), `${league}: app cachebuster non V667`);
  assertOk(app.includes('SITE_MOBILE_CARDS_VERSION_V667'), `${league}: app manca blocco V667`);
  assertOk(String(config.currentVersion) === '667', `${league}: league-config currentVersion non V667`);
}
assertOk(css.includes('listoneGreenBackgroundFixedAtSource') || css.includes('V667 - mobile cards final polish'), 'CSS V667 mancante');
assertOk(css.includes('text-transform: uppercase'), 'CSS V667 non mette nomi in maiuscolo');
assertOk(boot.includes('Forza Salernitana') && boot.includes('Zio Dino, Tano e Tozzi sono la Cupola'), 'messaggi preloader V667 mancanti');
console.log('Audit site mobile cards V667 OK', JSON.stringify({version:667, neutralListone:true, uppercaseNames:true, preloaderMessages:true}));
