#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const errors = [];
const required = [
  'roster-listone-table-unification-v550.css',
  'renderRosterPlayerStatusV550',
  'roster-col-status',
  'data-roster-status-v550',
  'roster-listone-skin-v550',
  'team-profile-status-cell',
  'V550'
];

function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    errors.push(`File mancante: ${rel}`);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

const css = read('static/fanta-engine/css/roster-listone-table-unification-v550.css');
[
  'table.listone-table',
  'table.roster-player-table.roster-listone-skin-v408',
  'roster-col-status',
  'zo-role-bg-v405-gk',
  'zo-role-bg-v405-def',
  'zo-role-bg-v405-mid',
  'zo-role-bg-v405-fwd'
].forEach((needle) => {
  if (!css.includes(needle)) errors.push(`CSS V550 non contiene ${needle}`);
});

for (const league of leagues) {
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  const config = read(`static/${league}/assets/league-config.json`);

  if (!index.includes('app.js?v=550')) errors.push(`${league}: index non punta ad app.js?v=550`);
  if (!index.includes('roster-listone-table-unification-v550.css?v=550')) errors.push(`${league}: CSS V550 non caricato`);
  if (!index.includes('V550')) errors.push(`${league}: footer/versione V550 non presente in index`);
  if (!config.includes('"currentVersion": "550"')) errors.push(`${league}: league-config currentVersion non V550`);
  for (const needle of required) {
    if (!app.includes(needle) && !index.includes(needle) && !config.includes(needle)) {
      errors.push(`${league}: marker mancante ${needle}`);
    }
  }
  if (app.includes('function renderRosterPlayerStatusV550') === false) errors.push(`${league}: helper Stato Rose assente`);
  if (app.includes('<th class="roster-col-status">Stato</th>') === false) errors.push(`${league}: header Stato Rose assente`);
  if (app.includes('data-label="Stato" class="roster-col-status"') === false) errors.push(`${league}: cella Stato Rose assente`);
  if (app.includes('team-profile-status-cell roster-col-status') === false) errors.push(`${league}: cella Stato Scheda squadra assente`);
  if (app.includes('data-player-role=') === false) errors.push(`${league}: role marker prima colonna assente`);
}

const docs = [
  'docs/OVERLAY_ROADMAP.md',
  'docs/CENTRALIZATION_STATUS_V521.md',
  'docs/ROSTER_LISTONE_TABLE_UNIFICATION_V550.md',
  'docs/AI_ASSISTANT_HANDOFF_V550.md',
  'docs/AI_ASSISTANT_HANDOFF_CURRENT.md'
];
for (const doc of docs) {
  const body = read(doc);
  if (!body.includes('V550')) errors.push(`${doc}: non cita V550`);
}

if (errors.length) {
  console.error('Audit V550 fallito:');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Audit V550 superato: stile Listone/Rose unificato, colonna Stato nelle Rose, prima colonna ruolo colorata e runtime whole-site a ?v=550.');
