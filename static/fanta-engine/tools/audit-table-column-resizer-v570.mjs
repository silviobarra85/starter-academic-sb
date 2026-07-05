#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'static/fanta-engine/css/table-column-resizer-v570.css',
  'static/fanta-engine/js/ui/table-column-resizer-v570.js',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json',
  'static/zonaorientale/assets/js/core/league-config-v443.js',
  'static/fantapetillomantramanager/assets/js/core/league-config-v443.js'
];

const failures = [];
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

for (const file of requiredFiles) {
  if (!exists(file)) failures.push(`File mancante: ${file}`);
}

if (!failures.length) {
  const css = read('static/fanta-engine/css/table-column-resizer-v570.css');
  const js = read('static/fanta-engine/js/ui/table-column-resizer-v570.js');
  const checks = [
    [css.includes('fanta-table-resize-v570-enabled'), 'CSS non contiene il guard opt-in fanta-table-resize-v570-enabled'],
    [css.includes('fanta-table-resize-handle-v570'), 'CSS non contiene le maniglie resize'],
    [js.includes('resizeTabelle'), 'JS non contiene attivazione con resizeTabelle=1'],
    [js.includes('FantaTableResizeV570'), 'JS non espone window.FantaTableResizeV570'],
    [js.includes('teamarea-roster'), 'JS non censisce Area Squadra'],
    [js.includes('rose-expanded'), 'JS non censisce Rose espanse'],
    [js.includes('listone'), 'JS non censisce Listone'],
    [js.includes('console.table'), 'JS non stampa misure in DevTools Console'],
    [js.includes('DevTools Console'), 'JS non mostra istruzione DevTools nel badge'],
  ];
  for (const [ok, message] of checks) if (!ok) failures.push(message);

  for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
    const index = read(`static/${league}/index.html`);
    const competition = read(`static/${league}/competition.html`);
    const player = read(`static/${league}/player.html`);
    const json = JSON.parse(read(`static/${league}/assets/league-config.json`));
    const configJs = read(`static/${league}/assets/js/core/league-config-v443.js`);
    const leagueLabel = league === 'zonaorientale' ? 'ZonaOrientale' : 'FantaPetilloMantraManager';

    const leagueChecks = [
      [index.includes('table-column-resizer-v570.css?v=570'), `${leagueLabel}: CSS V570 non incluso in index`],
      [index.includes('table-column-resizer-v570.js?v=570'), `${leagueLabel}: JS V570 non incluso in index`],
      [index.includes('· V570 ·'), `${leagueLabel}: footer index non V570`],
      [competition.includes('· V570 ·'), `${leagueLabel}: footer competition non V570`],
      [player.includes('· V570 ·'), `${leagueLabel}: footer player non V570`],
      [index.includes('league-config-v443.js?v=570'), `${leagueLabel}: cache-buster config index non V570`],
      [competition.includes('league-config-v443.js?v=570'), `${leagueLabel}: cache-buster config competition non V570`],
      [player.includes('league-config-v443.js?v=570'), `${leagueLabel}: cache-buster config player non V570`],
      [json.currentVersion === '570', `${leagueLabel}: league-config.json currentVersion non 570`],
      [configJs.includes("currentVersion: '570'"), `${leagueLabel}: league-config-v443.js currentVersion non 570`]
    ];
    for (const [ok, message] of leagueChecks) if (!ok) failures.push(message);
  }
}

if (failures.length) {
  console.error('Audit V570 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Audit V570 OK: strumento resize colonne tabelle giocatori attivo solo in opt-in e footer/cache-buster allineati.');
