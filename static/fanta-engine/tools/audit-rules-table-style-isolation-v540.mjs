#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

function assert(condition, message) {
  if (!condition) {
    console.error(`ERRORE V540: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`OK - ${message}`);
  }
}

const leagues = ['zonaorientale', 'fantapetillomantramanager'];

assert(exists('static/fanta-engine/css/rules-table-isolation-v540.css'), 'CSS fanta-engine di isolamento Regolamento presente');
const css = read('static/fanta-engine/css/rules-table-isolation-v540.css');
assert(css.includes('.app-page[data-page="regolamento"] .rules-table'), 'CSS scopa esplicitamente app-page regolamento rules-table');
assert(css.includes('player-role-def') && css.includes('zo-role-bg-v405-def'), 'CSS neutralizza classi ruolo sulle rules-table');
assert(css.includes('box-shadow: none !important'), 'CSS rimuove left bar ruolo nelle tabelle regolamento');

for (const league of leagues) {
  const label = league === 'zonaorientale' ? 'ZonaOrientale' : 'FantaPetilloMantraManager';
  const index = read(`static/${league}/index.html`);
  const app = read(`static/${league}/assets/app.js`);
  const config = read(`static/${league}/assets/league-config.json`);

  assert(index.includes('rules-table-isolation-v540.css?v=540'), `${label} carica CSS isolamento Regolamento V540`);
  assert(index.includes('./assets/app.js?v=540'), `${label} carica app.js con cache-buster V540`);
  assert(index.includes('· V540 ·'), `${label} footer principale aggiornato a V540`);
  assert(app.includes('isPlayerRoleBackgroundCandidateRowV540'), `${label} app.js contiene guardia candidate-row V540`);
  assert(app.includes('.rules-table-wrap, .rules-section, .regulation-panel, .rules-inline-wrap, [data-page="regolamento"]'), `${label} guardia esclude il Regolamento dalle colorazioni ruolo`);
  assert(app.includes('table.listone-table') && app.includes('table.roster-season-table'), `${label} guardia preserva tabelle Listone/Rose come candidate`);
  assert(app.includes('version: \'V540-guarded-V406-compat-V404\''), `${label} runtime role background dichiara V540 guarded`);
  assert(config.includes('"currentVersion": "540"'), `${label} league-config currentVersion a 540`);
  assert(config.includes('"rulesTableIsolationV540"'), `${label} league-config registra rulesTableIsolationV540`);
}

assert(exists('docs/RULES_TABLE_STYLE_ISOLATION_V540.md'), 'Doc V540 presente');
assert(exists('docs/AI_ASSISTANT_HANDOFF_V540.md'), 'Handoff V540 presente');
assert(read('docs/OVERLAY_ROADMAP.md').includes('Aggiornamento V540 - Rules table style isolation'), 'Roadmap aggiornata con V540');
assert(read('docs/CENTRALIZATION_STATUS_V521.md').includes('Aggiornamento V540 - Isolamento stile tabelle Regolamento'), 'Centralization status aggiornato con V540');

if (process.exitCode) {
  process.exit(process.exitCode);
}
console.log('Audit V540 superato: tabelle Regolamento isolate dalle colorazioni ruolo, Listone/Rose preservati e runtime whole-site a ?v=540.');
