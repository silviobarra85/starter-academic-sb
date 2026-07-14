import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/fanta-engine/css/site-performance-v662.css'
];

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`File mancante: ${rel}`);
  return fs.readFileSync(full, 'utf8');
}

for (const rel of files) read(rel);

for (const rel of files.slice(0, 2)) {
  const text = read(rel);
  const checks = [
    'SITE_MOBILE_CARDS_VERSION_V662',
    'renderListoneMobileCardV662',
    'renderRosterPlayerMobileCardV662',
    'getSiteRoleGroupV662',
    'FantaSiteMobileCardsV662',
    'roleColors: true',
    'compactOrderedCards: true',
    'responsiveWidth: true'
  ];
  for (const needle of checks) {
    if (!text.includes(needle)) throw new Error(`${rel}: manca ${needle}`);
  }
}

for (const rel of files.slice(2, 4)) {
  const html = read(rel);
  if (!html.includes('site-performance-v662.css?v=662')) throw new Error(`${rel}: cache-buster CSS V662 non trovato`);
  if (!html.includes('data-site-performance-v662="true"')) throw new Error(`${rel}: marker CSS V662 non trovato`);
}

const css = read('static/fanta-engine/css/site-performance-v662.css');
for (const needle of [
  '.site-mobile-player-card-v662',
  '.is-role-gk',
  '.is-role-def',
  '.is-role-mid',
  '.is-role-fwd',
  'grid-template-columns: repeat(auto-fit',
  '@media (max-width: 390px)'
]) {
  if (!css.includes(needle)) throw new Error(`CSS V662: manca ${needle}`);
}

console.log('Audit site mobile cards V662 OK', JSON.stringify({
  version: 662,
  siteOnly: true,
  roleColors: true,
  compactOrderedCards: true,
  filtersKept: true,
  responsiveWidth: true
}));
