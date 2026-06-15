#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const siteRoot = path.resolve(path.dirname(__filename), '..');
let ok = 0;
let total = 0;

function read(rel) {
  return fs.readFileSync(path.join(siteRoot, rel), 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(siteRoot, rel));
}
function check(label, condition) {
  total += 1;
  if (!condition) {
    console.error(`x ${label}`);
    return;
  }
  ok += 1;
}
function readJson(rel) {
  return JSON.parse(read(rel));
}

const config = readJson('assets/league-config.json');
const loader = read('assets/js/core/league-config-v443.js');
const index = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const bilanci = read('bilanci.html');
const app = read('assets/app.js');
const newsShare = read('assets/js/domain/news-share-v228.js');
const bilanciSection = read('assets/js/sections/bilanci-snapshot-section-v435.js');
const checkScript = read('tools/check-zonaorientale.sh');

check('config V445+ presente', Number(config.currentVersion) >= 445);
check('branding config completo', config.branding?.siteName === 'ZonaOrientale Salerno' && config.branding?.pages?.home?.canonicalUrl === 'https://silviobarra.com/zonaorientale/');
check('config contiene pagine metadata principali', ['home', 'competition', 'player', 'bilanci'].every((key) => config.branding?.pages?.[key]?.title && config.branding?.pages?.[key]?.description));
check('config contiene menu mobile Altro', Array.isArray(config.branding?.mobileMore) && config.branding.mobileMore.length >= 12 && config.branding.mobileMore.some((item) => item.id === 'bilanci'));
check('loader applica metadata runtime da config', loader.includes('applyLeagueRuntimePresentationV445') && loader.includes('applyMetaTagsV445') && loader.includes('getLeaguePageMetadataV445'));
check('loader applica menu mobile Altro da config', loader.includes('applyMobileMoreLinksV445') && loader.includes('branding.mobileMore'));
check('loader espone share base da config', loader.includes('getLeagueSiteUrlV443') && loader.includes('getLeagueNewsShareBaseUrlV445'));
check('loader non tocca Firebase', !loader.includes('firebase') && !loader.includes('collection('));
check('home carica loader/cache V445 e data page', index.includes('league-config-v443.js?v=451') && index.includes('assets/app.js?v=451') && index.includes('data-league-page="home"'));
check('standalone caricano loader/cache V445 e data page', competition.includes('league-config-v443.js?v=451') && player.includes('league-config-v443.js?v=451') && competition.includes('data-league-page="competition"') && player.includes('data-league-page="player"'));
check('footer V445 parametrizzabile', index.includes('data-league-footer-v445') && competition.includes('data-league-footer-v445') && player.includes('data-league-footer-v445'));
check('menu mobile Altro ha hook config', index.includes('data-league-mobile-more="bilanci"') && competition.includes('data-league-mobile-more="bilanci"') && player.includes('data-league-mobile-more="bilanci"'));
check('header home usa hook config', index.includes('data-league-text-v445="homeTitle"') && index.includes('data-league-text-v445="homeSubtitle"'));
check('app usa siteUrl da config per share comunicati', app.includes('getLeagueSiteUrlV443') && app.includes('getNewsShareBaseUrlV230()') && app.includes('siteName: getLeagueConfigValueV443'));
check('news-share supporta siteName/shortName opzionali', newsShare.includes('options.siteName') && newsShare.includes('options.shortName') && newsShare.includes('escapeNewsHtmlAttributeV228(siteName)'));
check('Bilanci continua a usare config con fallback', bilanciSection.includes('league-config-v443.js?v=451') && bilanciSection.includes('getLeagueWhatsappBilanciUrlV443'));
check('bilanci landing resta statica con metadata ZonaOrientale', bilanci.includes('Bilanci FM · ZonaOrientale Salerno') && bilanci.includes('https://silviobarra.com/zonaorientale/bilanci.html'));
check('app marker V445 presente', app.includes('ZonaOrientalePresentationFromConfigV445') && app.includes('metadata-menu-share-from-config'));
check('check principale integra audit V445', checkScript.includes('audit-runtime-presentation-config-v445.mjs'));

if (ok !== total) {
  console.error(`Audit runtime presentation config V445 completato: ${ok}/${total} controlli superati.`);
  process.exit(1);
}
console.log('Audit runtime presentation config V445 superato.');
