#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const required = [
  'static/fanta-engine/js/ui/static-roster-editor-v587.js',
  'static/fanta-engine/css/static-roster-editor-v587.css',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/rose/manifest.json',
  'static/fantapetillomantramanager/assets/rose/manifest.json',
  'static/fanta-engine/data/shared-assets/current/assets/listoni/manifest.json'
];

const errors = [];
function read(rel) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    errors.push(`missing ${rel}`);
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}

for (const rel of required) read(rel);

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = read(`static/${league}/index.html`);
  const config = JSON.parse(read(`static/${league}/assets/league-config.json`) || '{}');
  const runtime = read(`static/${league}/assets/js/core/league-config-v443.js`);
  if (!index.includes('static-roster-editor-v587.css')) errors.push(`${league} index missing V587 css`);
  if (!index.includes('static-roster-editor-v587.js')) errors.push(`${league} index missing V587 js`);
  if (!index.includes('V587')) errors.push(`${league} index footer/cache missing V587`);
  if (String(config.currentVersion) !== '587') errors.push(`${league} config currentVersion not 587`);
  if (!runtime.includes("currentVersion: '587'")) errors.push(`${league} league-config-v443 currentVersion not 587`);
  const manifest = JSON.parse(read(`static/${league}/assets/rose/manifest.json`) || '{}');
  if (!Array.isArray(manifest.rosters)) errors.push(`${league} rose manifest invalid`);
}

const editorJs = read('static/fanta-engine/js/ui/static-roster-editor-v587.js');
for (const needle of [
  'assets/rose/manifest.json',
  'data/shared-assets/current/assets/listoni/manifest.json',
  'Scarica JSON rosa',
  'Scarica manifest',
  'playerCount',
  'moveDuplicate'
]) {
  if (!editorJs.includes(needle)) errors.push(`editor missing ${needle}`);
}

if (errors.length) {
  console.error('Audit V587 failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Audit V587 OK: editor rose statiche installato e configurato.');
