import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const errors = [];

function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push(`File mancante: ${rel}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

for (const league of leagues) {
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  const config = read(`static/${league}/assets/league-config.json`);

  if (!index.includes('app.js?v=551')) errors.push(`${league}: index non punta ad app.js?v=551`);
  if (!index.includes('roster-listone-table-unification-v551.css?v=551')) errors.push(`${league}: CSS V551 non collegato`);
  if (!index.includes('V551')) errors.push(`${league}: footer/versione V551 non trovata`);
  if (!config.includes('"currentVersion": "551"')) errors.push(`${league}: league-config non allineato a 551`);
  if (!app.includes('renderRosterPlayerTable: (...args) => renderRosterPlayerTable(...args)')) {
    errors.push(`${league}: helper Rose non usa delegate dinamico renderRosterPlayerTable V551`);
  }
  if (!app.includes('<th class="roster-col-status">Stato</th>')) {
    errors.push(`${league}: header Stato assente dal renderer Rose`);
  }
  if (!app.includes('renderRosterPlayerStatusV551')) {
    errors.push(`${league}: renderer Stato Rose V551 assente`);
  }
  if (!app.includes('roster-listone-skin-v550')) {
    errors.push(`${league}: skin Listone/Rose non preservata nel renderer Rose`);
  }
}

const css = read('static/fanta-engine/css/roster-listone-table-unification-v551.css');
for (const token of [
  '.desktop-roster-table-v156 .roster-detail-row .roster-player-table',
  '.mobile-roster-detail-card-v156 .roster-player-table',
  'td:first-child',
  '--fanta-table-font-v550'
]) {
  if (!css.includes(token)) errors.push(`CSS V551 non contiene: ${token}`);
}

const roadmap = read('docs/OVERLAY_ROADMAP.md');
if (!roadmap.includes('V551')) errors.push('Roadmap non aggiornata a V551');
const handoff = read('docs/AI_ASSISTANT_HANDOFF_CURRENT.md');
if (!handoff.includes('V551')) errors.push('AI_ASSISTANT_HANDOFF_CURRENT non aggiornato a V551');

if (errors.length) {
  console.error('Audit V551 fallito:');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Audit V551 superato: renderer Espandi/Riduci Rose sincronizzato con stile Listone, colonna Stato presente, prima colonna colorata e runtime whole-site a ?v=551.');
