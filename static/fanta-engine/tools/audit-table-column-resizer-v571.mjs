#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const version = '571';
const requiredFiles = [
  'static/fanta-engine/css/table-column-resizer-v571.css',
  'static/fanta-engine/js/ui/table-column-resizer-v571.js',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json',
  'static/zonaorientale/assets/js/core/league-config-v443.js',
  'static/fantapetillomantramanager/assets/js/core/league-config-v443.js'
];

const htmlFiles = [
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html'
];

const footerFiles = [
  'static/zonaorientale/index.html',
  'static/zonaorientale/competition.html',
  'static/zonaorientale/player.html',
  'static/fantapetillomantramanager/index.html',
  'static/fantapetillomantramanager/competition.html',
  'static/fantapetillomantramanager/player.html'
];

const errors = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

for (const file of requiredFiles) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing required file: ${file}`);
}

for (const file of htmlFiles) {
  if (!fs.existsSync(path.join(root, file))) continue;
  const text = read(file);
  if (!text.includes('table-column-resizer-v571.css?v=571')) errors.push(`${file}: missing V571 CSS reference`);
  if (!text.includes('table-column-resizer-v571.js?v=571')) errors.push(`${file}: missing V571 JS reference`);
  if (text.includes('table-column-resizer-v570.css') || text.includes('table-column-resizer-v570.js')) errors.push(`${file}: still references V570 resizer`);
  if (!text.includes('data-table-column-resizer-v571="true"')) errors.push(`${file}: missing V571 data marker`);
}

for (const file of footerFiles) {
  if (!fs.existsSync(path.join(root, file))) continue;
  const text = read(file);
  if (!text.includes(`V${version}`)) errors.push(`${file}: static footer/cache marker does not include V${version}`);
  if (text.includes('v=570')) errors.push(`${file}: still contains cache-buster v=570`);
}

for (const file of [
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json'
]) {
  if (!fs.existsSync(path.join(root, file))) continue;
  const json = JSON.parse(read(file));
  if (json.currentVersion !== version) errors.push(`${file}: currentVersion is ${json.currentVersion}, expected ${version}`);
  if (!json.tableColumnResizerV571 || json.tableColumnResizerV571.version !== 'V571') errors.push(`${file}: missing tableColumnResizerV571 metadata`);
}

for (const file of [
  'static/zonaorientale/assets/js/core/league-config-v443.js',
  'static/fantapetillomantramanager/assets/js/core/league-config-v443.js'
]) {
  if (!fs.existsSync(path.join(root, file))) continue;
  const text = read(file);
  if (!text.includes("currentVersion: '571'")) errors.push(`${file}: fallback currentVersion not V571`);
}

const css = read('static/fanta-engine/css/table-column-resizer-v571.css');
for (const needle of ['fanta-table-resize-handle-v571', '@media (max-width: 760px)', 'width: 44px', 'touch-action: none']) {
  if (!css.includes(needle)) errors.push(`CSS missing expected mobile indicator rule: ${needle}`);
}

const js = read('static/fanta-engine/js/ui/table-column-resizer-v571.js');
for (const needle of ['FantaTableResizeV571', 'fanta-table-resize-handle-v571', 'updateBadgeDuringResize', 'window.FantaTableResizeV570 = window.FantaTableResizeV571']) {
  if (!js.includes(needle)) errors.push(`JS missing expected V571 behavior: ${needle}`);
}

if (errors.length) {
  console.error('V571 table column resizer audit failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('V571 table column resizer audit passed.');
