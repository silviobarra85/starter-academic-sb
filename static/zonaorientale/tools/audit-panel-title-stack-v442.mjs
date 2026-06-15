#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const quiet = process.argv.includes('--quiet');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const fail = (msg) => { console.error(`FAIL ${msg}`); process.exitCode = 1; };
const pass = (msg) => { if (!quiet) console.log(`PASS ${msg}`); };
const assert = (cond, msg) => cond ? pass(msg) : fail(msg);

const index = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const css = read('assets/css/refactor/panel-title-stack-v442.css');
const app = read('assets/app.js');

assert(index.includes('panel-title-stack-v442.css?v=451'), 'CSS V442 caricato in index');
assert(competition.includes('panel-title-stack-v442.css?v=451'), 'CSS V442 caricato in competition');
assert(player.includes('panel-title-stack-v442.css?v=451'), 'CSS V442 caricato in player');
assert(css.includes('.panel-header:has(> .filters-row)'), 'header con filtri impilato');
assert(css.includes('.panel-header:has(> .role-filter-panel-v441)'), 'header Rose con filtri ruoli Mantra impilato');
assert(css.includes('.panel-header:has(> .column-controls)'), 'header Listone con controlli colonne impilato');
assert(css.includes('grid-template-columns: minmax(0, 1fr)'), 'titolo e controlli su una sola colonna');
assert(css.includes('.listone-main-panel > .panel-header'), 'protezione specifica Listone presente');
assert(/DEPLOY_EXPECTED_VERSION_V181 = "(442|443|444|445|446|447|448|449|450|451)"/.test(app), 'runtime atteso V442+');

if (!process.exitCode) pass('audit V442 titoli sopra filtri superato');
