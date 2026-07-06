#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const must = [
  'static/fanta-engine/css/player-tables-mobile-v580.css',
  'static/fanta-engine/js/ui/player-tables-mobile-v580.js',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html'
];
let ok = true;
for (const rel of must) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) { console.error('Missing', rel); ok = false; }
}
for (const league of ['zonaorientale','fantapetillomantramanager']) {
  const index = fs.readFileSync(path.join(root, 'static', league, 'index.html'), 'utf8');
  const cfg = fs.readFileSync(path.join(root, 'static', league, 'assets', 'league-config.json'), 'utf8');
  if (!index.includes('player-tables-mobile-v580.css?v=580')) { console.error('Missing v580 css in', league); ok = false; }
  if (!index.includes('player-tables-mobile-v580.js?v=580')) { console.error('Missing v580 js in', league); ok = false; }
  if (index.includes('player-tables-mobile-v579.css') || index.includes('player-tables-mobile-v579.js')) { console.error('Old v579 table assets still loaded in', league); ok = false; }
  if (!cfg.includes('"currentVersion": "580"')) { console.error('Config not V580 in', league); ok = false; }
}
const css = fs.readFileSync(path.join(root, 'static/fanta-engine/css/player-tables-mobile-v580.css'), 'utf8');
const js = fs.readFileSync(path.join(root, 'static/fanta-engine/js/ui/player-tables-mobile-v580.js'), 'utf8');
for (const token of ['data-player-table-v580="teamarea"','data-player-table-v580="rose"']) {
  if (!css.includes(token) && !js.includes(token)) { console.error('Missing token', token); ok = false; }
}
if (!js.includes("'listone'") && !js.includes('\"listone\"')) { console.error('Missing listone classifier'); ok = false; }
if (!js.includes('sampleListoneStyle') || !js.includes('applyListoneCloneToTarget')) { console.error('Runtime clone helpers missing'); ok = false; }
if (!ok) process.exit(1);
console.log('V580 player tables mobile Listone clone audit OK');
