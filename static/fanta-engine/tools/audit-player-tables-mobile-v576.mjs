import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const required = [
  'static/fanta-engine/css/player-tables-mobile-v576.css',
  'static/fanta-engine/js/ui/player-tables-mobile-v576.js'
];

const failures = [];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) failures.push(`Missing ${rel}`);
}

const css = fs.existsSync(path.join(root, required[0])) ? fs.readFileSync(path.join(root, required[0]), 'utf8') : '';
const js = fs.existsSync(path.join(root, required[1])) ? fs.readFileSync(path.join(root, required[1]), 'utf8') : '';
[
  'player-table-mobile-v576-active',
  'fanta-player-table-v576-teamarea',
  'fanta-player-table-v576-rose',
  'fanta-player-table-v576-listone',
  'section[data-page="clubs"] #rosterClubCards table.roster-player-table',
  'table.team-profile-roster-table',
  'var(--pt-v576-gk-bg)',
  'var(--pt-v576-def-bg)',
  'var(--pt-v576-mid-bg)',
  'var(--pt-v576-fwd-bg)'
].forEach((needle) => {
  if (!css.includes(needle)) failures.push(`CSS missing ${needle}`);
});
[
  'FantaPlayerTablesMobileV576',
  'classifyTable',
  'fanta-player-table-v576-teamarea',
  'fanta-player-table-v576-rose',
  'fanta-player-table-v576-listone',
  'fpt-v576-role-p',
  'MutationObserver'
].forEach((needle) => {
  if (!js.includes(needle)) failures.push(`JS missing ${needle}`);
});

for (const league of leagues) {
  const htmlPath = path.join(root, 'static', league, 'index.html');
  const configPath = path.join(root, 'static', league, 'assets', 'league-config.json');
  const corePath = path.join(root, 'static', league, 'assets', 'js', 'core', 'league-config-v443.js');
  if (!fs.existsSync(htmlPath)) failures.push(`Missing ${htmlPath}`);
  else {
    const html = fs.readFileSync(htmlPath, 'utf8');
    if (!html.includes('player-tables-mobile-v576.css?v=576')) failures.push(`${league} index missing V576 CSS`);
    if (!html.includes('player-tables-mobile-v576.js?v=576')) failures.push(`${league} index missing V576 JS`);
    if (html.includes('player-tables-mobile-v575.css') || html.includes('player-tables-mobile-v575.js')) failures.push(`${league} index still loads V575 player table assets`);
    if (!html.includes('V576')) failures.push(`${league} index footer/cache not V576`);
  }
  if (!fs.existsSync(configPath)) failures.push(`Missing ${configPath}`);
  else {
    const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (String(cfg.currentVersion) !== '576') failures.push(`${league} currentVersion is ${cfg.currentVersion}, expected 576`);
  }
  if (!fs.existsSync(corePath)) failures.push(`Missing ${corePath}`);
  else {
    const core = fs.readFileSync(corePath, 'utf8');
    if (!core.includes('576')) failures.push(`${league} core config missing 576`);
  }
}

if (failures.length) {
  console.error('Audit V576 failed:');
  failures.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log('Audit V576 passed: player table mobile specificity override is wired for both leagues.');
