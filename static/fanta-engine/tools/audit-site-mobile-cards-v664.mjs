import { readFileSync } from 'node:fs';

const files = [
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/fanta-engine/css/site-performance-v664.css'
];

function read(path) {
  return readFileSync(path, 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const zona = read(files[0]);
const fmm = read(files[1]);
const zonaHtml = read(files[2]);
const fmmHtml = read(files[3]);
const css = read(files[4]);

for (const source of [zona, fmm]) {
  assert(source.includes('SITE_MOBILE_CARDS_VERSION_V664'), 'missing V664 JS marker');
  assert(source.includes('renderListoneChangeBadgeV664'), 'missing compact change badge');
  assert(source.includes('renderRosterPlayerMobileCardV664'), 'missing roster V664 card');
  assert(source.includes('renderTeamProfileRosterCardsV664'), 'missing team profile roster cards');
  assert(source.includes('listoneDuplicateTeamRemoved: true'), 'missing listone duplicate-team flag');
  assert(source.includes('rosterDuplicateRoleTeamRemoved: true'), 'missing roster duplicate flag');
  assert(!source.includes('renderSiteMobileCompactFieldV664("Sq"'), 'team field duplicated in V664 grid');
  assert(!source.includes('renderSiteMobileCompactFieldV664("R / RM"'), 'role field duplicated in V664 grid');
}

for (const html of [zonaHtml, fmmHtml]) {
  assert(html.includes('site-performance-v664.css?v=664'), 'index does not load V664 CSS');
  assert(html.includes('assets/app.js?v=664'), 'index does not cache-bust app.js V664');
  assert(html.includes('V664'), 'footer version not updated');
}

assert(css.includes('site-mobile-card-wrap-v664'), 'missing neutral wrapper css');
assert(css.includes('site-listone-change-badge-v664'), 'missing bottom-right change badge css');
assert(css.includes('team-profile-roster-cards-v664'), 'missing team profile card css');
assert(css.includes('background: transparent !important'), 'missing transparent wrapper css');

console.log('Audit site mobile cards V664 OK', JSON.stringify({
  version: 664,
  siteOnly: true,
  listoneDuplicateTeamRemoved: true,
  rosterDuplicateRoleTeamRemoved: true,
  neutralOuterContainer: true,
  teamProfileRosterCards: true,
  footerVersion: true
}));
