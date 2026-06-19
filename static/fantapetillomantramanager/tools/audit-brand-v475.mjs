#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
function check(condition, label) {
  checks.push({ condition: Boolean(condition), label });
}
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

const config = JSON.parse(read('assets/league-config.json'));
const index = read('index.html');
const leagueJs = read('assets/js/core/league-config-v443.js');
const manifest = JSON.parse(read('site.webmanifest'));

check(config.name === 'FantaMantraManager', 'config.name aggiornato a FantaMantraManager');
check(config.shortName === 'FantaMantra', 'config.shortName aggiornato');
check(config.currentVersion === '475', 'versione config V475');
check(config.branding?.homeEyebrow === 'Lega Fantacalcio', 'rimosso eyebrow configurazione dalla dashboard');
check(config.branding?.homeTitle === 'FantaMantraManager', 'titolo dashboard da config aggiornato');
check(!/Lega Fantacalcio in configurazione/i.test(JSON.stringify(config)), 'nessun testo Lega Fantacalcio in configurazione in config');
check(index.includes('brand-title-row-v475') && index.includes('fantamantramanager-logo-v475.png'), 'logo inserito accanto al nome in dashboard');
check(index.includes('assets/css/fantamantramanager-brand-v475.css?v=475'), 'CSS brand V475 collegato');
check(index.includes('FantaMantraManager · V475 · Ultimo aggiornamento 19/06/2026'), 'footer fallback index V475');
check(!index.includes('FantaPetilloMantraManager'), 'index senza vecchio nome completo');
check(exists('assets/logos/fantamantramanager-logo-v475.png'), 'logo V475 presente');
check(exists('assets/icons/fantamantramanager-favicon-v475-16.png'), 'favicon 16 V475 presente');
check(exists('assets/icons/fantamantramanager-favicon-v475-32.png'), 'favicon 32 V475 presente');
check(exists('assets/icons/fantamantramanager-apple-touch-icon-v475.png'), 'apple touch icon V475 presente');
check(exists('assets/icons/fantamantramanager-android-chrome-512-v475.png'), 'android icon 512 V475 presente');
check(exists('favicon.ico'), 'favicon.ico presente');
check(manifest.name === 'FantaMantraManager' && manifest.short_name === 'FantaMantra', 'manifest aggiornato');
check(leagueJs.includes('league-config.json?v=475'), 'league-config runtime carica JSON V475');
check(config.slug === 'fantapetillomantramanager' && config.basePath === '/fantapetillomantramanager/', 'slug/basePath preservati');
check(path.basename(root) === 'fantapetillomantramanager', 'audit eseguito dalla cartella fantapetillomantramanager');

const failed = checks.filter((item) => !item.condition);
checks.forEach((item) => console.log(`${item.condition ? 'OK' : 'FAIL'} - ${item.label}`));
if (failed.length) {
  console.error(`Audit brand V475 fallito: ${failed.map((item) => item.label).join('; ')}`);
  process.exit(1);
}
console.log('OK: brand FantaMantraManager V475 applicato senza toccare ZonaOrientale.');
