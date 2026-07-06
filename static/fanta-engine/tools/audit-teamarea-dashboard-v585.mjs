import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'static/fanta-engine/css/president-teamarea-mobile-v585.css',
  'static/fanta-engine/js/ui/president-teamarea-mobile-v585.js',
  'static/fanta-engine/tools/cleanup-teamarea-dashboard-v585.sh',
  'static/fanta-engine/css/player-tables-mobile-v584.css',
  'static/fanta-engine/js/ui/player-tables-mobile-v584.js'
];
const leagueFiles = [
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html'
];
const configFiles = [
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json',
  'static/zonaorientale/assets/js/core/league-config-v443.js',
  'static/fantapetillomantramanager/assets/js/core/league-config-v443.js'
];
const errors = [];
function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function exists(file) {
  return fs.existsSync(path.join(root, file));
}
required.forEach((file) => {
  if (!exists(file)) errors.push(`Missing required file: ${file}`);
});
leagueFiles.forEach((file) => {
  const html = read(file);
  if (!html.includes('president-teamarea-mobile-v585.css?v=585')) errors.push(`${file} does not load V585 CSS`);
  if (!html.includes('president-teamarea-mobile-v585.js?v=585')) errors.push(`${file} does not load V585 JS`);
  if (!html.includes('player-tables-mobile-v584.css?v=584')) errors.push(`${file} lost consolidated V584 table CSS`);
  if (html.includes('table-column-resizer-v570') || html.includes('table-column-resizer-v571')) errors.push(`${file} still loads table resize assets`);
});
configFiles.forEach((file) => {
  const content = read(file);
  if (!content.includes('585')) errors.push(`${file} not updated to version 585`);
});
['static/zonaorientale/assets/app.js', 'static/fantapetillomantramanager/assets/app.js'].forEach((file) => {
  const js = read(file);
  if (js.includes('<h2>Proponi svincolo</h2>')) errors.push(`${file} still has Proponi svincolo title`);
  if (!js.includes('<h2>Proponi trattativa</h2>')) errors.push(`${file} missing Proponi trattativa title`);
});
const v585js = read('static/fanta-engine/js/ui/president-teamarea-mobile-v585.js');
[
  'teamarea-dashboard-mobile-v585-active',
  'data-teamarea-open-panel-v585',
  'teamarea-toggle-v585',
  'team-area-profile-action',
  'president-dashboard-actions-v369',
  'Proponi trattativa'
].forEach((token) => {
  if (!v585js.includes(token)) errors.push(`V585 JS missing token: ${token}`);
});
const obsoleteLoadedTokens = ['table-column-resizer-v570', 'table-column-resizer-v571', 'player-tables-mobile-v583'];
leagueFiles.forEach((file) => {
  const html = read(file);
  obsoleteLoadedTokens.forEach((token) => {
    if (html.includes(token)) errors.push(`${file} still references obsolete ${token}`);
  });
});
if (errors.length) {
  console.error('V585 audit failed:');
  errors.forEach((err) => console.error(`- ${err}`));
  process.exit(1);
}
console.log('V585 teamarea dashboard audit passed.');
