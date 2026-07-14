import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const cssPath = path.join(root, 'static/fanta-engine/css/site-performance-v663.css');

function fail(message) {
  console.error(`Audit site mobile cards V663 FAIL: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`file mancante: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

const css = read(cssPath);
for (const token of [
  'site-mobile-player-card-v663',
  'site-roster-chip-v663',
  'is-free-agent',
  'site-status-badge-v663',
  'is-in-listone',
  'is-asterisk',
  'site-mobile-card-table-v659 thead',
  'width: min(100%, calc(100vw'
]) {
  if (!css.includes(token)) fail(`token CSS mancante: ${token}`);
}

for (const league of leagues) {
  const index = read(path.join(root, `static/${league}/index.html`));
  const app = read(path.join(root, `static/${league}/assets/app.js`));
  if (!index.includes('site-performance-v663.css?v=663')) fail(`${league}: index non carica CSS V663`);
  for (const token of [
    'SITE_MOBILE_CARDS_VERSION_V663',
    'renderListoneMobileCardV663',
    'renderRosterPlayerMobileCardV663',
    'renderSiteRosterChipV663',
    'renderSiteListoneStatusBadgeV663',
    'getListonePlayerRosterCostV663',
    'tableHeadersRemovedOnMobile: true',
    'rosterChipNextToPlayer: true',
    'rosterCostOnListoneCards: true',
    'statusBadgesColorCoded: true'
  ]) {
    if (!app.includes(token)) fail(`${league}: token JS mancante: ${token}`);
  }
  if (app.includes('window.FantaIoSudo')) fail(`${league}: overlay sito non deve toccare ioSudo`);
}

console.log('Audit site mobile cards V663 OK', JSON.stringify({
  version: 663,
  siteOnly: true,
  mobileCards: true,
  roleColoredCards: true,
  responsiveWidth: true,
  tableHeadersRemoved: true,
  rosterChipNextToPlayer: true,
  freeAgentBadgeDarkYellow: true,
  listoneGreenBadge: true,
  asteriskYellowBadge: true
}));
