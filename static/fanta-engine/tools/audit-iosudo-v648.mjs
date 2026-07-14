import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const exists = (p) => fs.existsSync(path.join(root, p));
const fail = (message) => {
  console.error('Audit ioSudo V648 FAIL:', message);
  process.exit(1);
};

const jsPath = 'static/fanta-engine/js/apps/iosudo-app-v648.js';
const cssPath = 'static/fanta-engine/css/iosudo-app-v648.css';
const indexPath = 'static/iosudo/index.html';
const swPath = 'static/iosudo/sw.js';

[jsPath, cssPath, indexPath, swPath].forEach((p) => {
  if (!exists(p)) fail(`missing ${p}`);
});

const js = read(jsPath);
const css = read(cssPath);
const index = read(indexPath);
const sw = read(swPath);

if (!index.includes('data-iosudo-version="648"')) fail('index data-iosudo-version is not 648');
if (!index.includes('iosudo-app-v648.css?v=648')) fail('index does not load v648 CSS');
if (!index.includes('iosudo-app-v648.js?v=648')) fail('index does not load v648 JS');
if (!sw.includes("IOSUDO_CACHE = 'iosudo-shell-v648'")) fail('service worker cache is not v648');
if (!sw.includes('iosudo-app-v648.css?v=648') || !sw.includes('iosudo-app-v648.js?v=648')) fail('service worker shell is not v648');

if (!js.includes('function excelSerialDate(value)')) fail('excel serial parser missing');
if (!js.includes('const serialDate = excelSerialDate(text);\n    if (serialDate) return serialDate.getTime();')) fail('dateValue does not handle Excel serials before Date.parse');
if (!js.includes("text.match(/^\\+0*(\\d{5})(?:-01(?:-01)?)?$/)")) fail('expanded Excel serial guard missing');
if (js.includes("tabButton('rose', 'Rosa')")) fail('team player/Rosa tab is still exposed');
if (!js.includes("new Set(['xi', 'mercato', 'sos', 'amichevoli'])")) fail('team tab whitelist missing');
if (!css.includes('.iosudo-shell.is-team-open .iosudo-results')) fail('global results are not hidden while a team/player panel is open');

console.log('Audit ioSudo V648 OK', JSON.stringify({
  iosudoVersion: 648,
  teamPlayersViewRemoved: true,
  excelSerialDates: true,
  globalPlayersHiddenInTeamPanel: true
}));
