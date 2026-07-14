import fs from 'node:fs';

function ok(condition, message) {
  if (!condition) throw new Error(message);
}
function read(path) {
  ok(fs.existsSync(path), `Missing ${path}`);
  return fs.readFileSync(path, 'utf8');
}

const iosudoIndex = read('static/iosudo/index.html');
const iosudoJsPath = 'static/fanta-engine/js/apps/iosudo-app-v665.js';
const iosudoCssPath = 'static/fanta-engine/css/iosudo-app-v665.css';
const swPath = 'static/iosudo/sw.js';
const siteCssPath = 'static/fanta-engine/css/site-performance-v665.css';
const bootPath = 'static/fanta-engine/js/ui/boot-preloader-v665.js';
const manifestPath = 'static/fanta-engine/data/sudatori/current/manifest.json';
const zonaIndexPath = 'static/zonaorientale/index.html';
const zonaAppPath = 'static/zonaorientale/assets/app.js';
const fmmAppPath = 'static/fantapetillomantramanager/assets/app.js';

const iosudoJs = read(iosudoJsPath);
const iosudoCss = read(iosudoCssPath);
const sw = read(swPath);
const siteCss = read(siteCssPath);
const boot = read(bootPath);
const manifest = JSON.parse(read(manifestPath));
const zonaIndex = read(zonaIndexPath);
const zonaApp = read(zonaAppPath);
const fmmApp = read(fmmAppPath);

ok(iosudoIndex.includes('iosudo-app-v665.js') && iosudoIndex.includes('iosudo-app-v665.css'), 'index ioSudo non punta alla V665');
ok(sw.includes('iosudo-app-v665.js') || sw.includes('IOSUDO_CACHE_V665') || sw.includes('v665'), 'service worker ioSudo non aggiornato alla V665');
ok(iosudoJs.includes('IO_SUDO') || iosudoJs.includes('ioSudo') || iosudoJs.includes('iosudo'), 'JS ioSudo V665 non riconoscibile');
ok(iosudoCss.length > 1000, 'CSS ioSudo V665 troppo piccolo o vuoto');
ok(Number(manifest.uiVersion) === 665, 'manifest ioSudo non V665');
ok(manifest.globalPlayersMarketOnly === false, 'GIOCATORI non risulta in modalita leggera');
ok(siteCss.includes('listone-main-panel') && siteCss.includes('background-image: none'), 'fix sfondo listone V665 non presente');
ok(boot.includes('maxWaitMs: 7600') && boot.includes('Michele'), 'boot preloader V665 non aggiornato');
ok(zonaIndex.includes('boot-preloader-v665.js') && zonaIndex.includes('site-performance-v665.css'), 'index sito non cache-busted V665');
ok(zonaApp.includes('FantaSiteMobileCardsV665') && zonaApp.includes('forceFooterVersionV665'), 'patch sito ZonaOrientale V665 mancante');
ok(fmmApp.includes('FantaSiteMobileCardsV665') && fmmApp.includes('forceFooterVersionV665'), 'patch sito FMM V665 mancante');

console.log('Audit ioSudo V665 OK', JSON.stringify({
  compatibilityAudit: true,
  uiVersion: manifest.uiVersion,
  players: manifest.players,
  talks: manifest.teamTransferTalks,
  official: manifest.officialMoves,
  friendlies: manifest.friendlies,
  sitePatch: true
}));
