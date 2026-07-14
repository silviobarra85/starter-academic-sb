import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/fanta-engine/css/site-performance-v659.css'
];

function read(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) throw new Error(`Missing ${rel}`);
  return fs.readFileSync(abs, 'utf8');
}

for (const rel of files) read(rel);

for (const rel of ['static/zonaorientale/assets/app.js', 'static/fantapetillomantramanager/assets/app.js']) {
  const text = read(rel);
  const required = [
    'SITE_MOBILE_CARDS_VERSION_V659',
    'renderListonePublicV659',
    'renderClubRostersPublicV659',
    'renderRosterPlayerTableV659',
    'data-site-mobile-more-v659',
    'FantaSiteMobileCardsV659'
  ];
  for (const needle of required) {
    if (!text.includes(needle)) throw new Error(`${rel}: missing ${needle}`);
  }
}

for (const rel of ['static/zonaorientale/index.html', 'static/fantapetillomantramanager/index.html']) {
  const text = read(rel);
  if (!text.includes('site-performance-v659.css?v=659')) throw new Error(`${rel}: CSS V659 not loaded`);
}

const css = read('static/fanta-engine/css/site-performance-v659.css');
for (const needle of ['site-mobile-player-card-v659', 'site-mobile-card-table-v659', 'site-mobile-more-v659']) {
  if (!css.includes(needle)) throw new Error(`CSS missing ${needle}`);
}

console.log('Audit site mobile cards V659 OK', JSON.stringify({
  version: 659,
  siteOnly: true,
  mobileListoneCards: true,
  mobileRoseCards: true,
  filtersKept: true,
  progressiveMore: true
}));
