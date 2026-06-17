#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const quiet = process.argv.includes('--quiet');
const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const fail = (message) => {
  console.error(`[V426] ${message}`);
  process.exitCode = 1;
};
const pass = (message) => {
  if (!quiet) console.log(`[V426] ${message}`);
};
const expectIncludes = (content, needle, label) => {
  if (!content.includes(needle)) fail(`${label}: missing ${needle}`);
};
const expectNotIncludes = (content, needle, label) => {
  if (content.includes(needle)) fail(`${label}: stale/unwanted ${needle}`);
};

const index = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const app = read('assets/app.js');
const mobileCss = read('assets/css/refactor/mobile-controls.css');
const styles = read('assets/styles.css');
const check = read('tools/check-zonaorientale.sh');

const deployMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
if (!deployMatch) fail('app deploy version mancante');
const deployVersion = deployMatch ? Number(deployMatch[1]) : 0;
if (deployVersion < 426) fail(`app deploy version inferiore a V426: ${deployVersion || 'non rilevata'}`);

for (const [file, content] of [['index.html', index], ['competition.html', competition], ['player.html', player]]) {
  expectIncludes(content, `?v=${deployVersion}`, `${file} cache-buster runtime corrente`);
  expectIncludes(content, `V${deployVersion}`, `${file} footer runtime corrente`);
  expectNotIncludes(content, '?v=425', `${file} cache-buster stale V425`);
  expectNotIncludes(content, 'V425 consolidamento mobile', `${file} footer stale V425`);
}

expectIncludes(app, 'ZonaOrientaleMobileChecklistV426', 'app V426 checklist marker');
expectIncludes(app, 'ZonaOrientaleMobileTypographyV425', 'app V425 scale marker preserved');
expectNotIncludes(app, 'DEPLOY_EXPECTED_VERSION_V181 = "425"', 'app stale deploy version V425');

for (const literal of ['0.78rem', '0.73rem', '0.66rem', '0.62rem']) {
  expectIncludes(mobileCss, literal, `mobile CSS canonical scale ${literal}`);
}

for (const token of [
  '--zo-mobile-canonical-title-v425',
  '--zo-mobile-canonical-text-v425',
  '--zo-mobile-canonical-meta-v425',
  '--zo-mobile-canonical-label-v425',
  '.mobile-more-sheet',
  '.calciomercato-card',
  '.season-archive-team-card-v196',
  '.team-profile-roster-table',
  '.admin-card'
]) {
  expectIncludes(mobileCss, token, 'mobile CSS final checklist');
}

for (const token of ['player-role-gk', 'player-role-def', 'player-role-mid', 'player-role-fwd']) {
  if (!styles.includes(token) && !mobileCss.includes(token) && !app.includes(token)) {
    fail(`role background token missing: ${token}`);
  }
}

const requiredAuditFiles = [
  'tools/audit-home-calciomercato-mobile-v407.mjs',
  'tools/audit-roster-listone-style-v408.mjs',
  'tools/audit-mobile-player-tables-v409.mjs',
  'tools/audit-calciomercato-mobile-v410.mjs',
  'tools/audit-dashboard-mobile-v411.mjs',
  'tools/audit-mobile-more-menu-v412.mjs',
  'tools/audit-mobile-filters-v413.mjs',
  'tools/audit-teamarea-mobile-v414.mjs',
  'tools/audit-mobile-home-teamprofile-v415.mjs',
  'tools/audit-admin-mobile-v416.mjs',
  'tools/audit-css-asset-cleanup-v417.mjs',
  'tools/audit-mobile-accessibility-v418.mjs',
  'tools/audit-archive-mobile-v419.mjs',
  'tools/audit-mobile-typography-v420.mjs',
  'tools/audit-archive-mobile-typography-v421.mjs',
  'tools/audit-mobile-scale-archive-v422.mjs',
  'tools/audit-mobile-typography-global-v423.mjs',
  'tools/audit-mobile-typography-residue-v424.mjs',
  'tools/audit-mobile-scale-consolidation-v425.mjs'
];
for (const file of requiredAuditFiles) {
  if (!exists(file)) fail(`audit storico mobile mancante: ${file}`);
}

expectIncludes(check, 'audit-mobile-final-checklist-v426.mjs', 'check-zonaorientale V426 gate');

const docsDirCandidates = [
  path.join(root, '..', '..', 'docs', 'zonaorientale'),
  path.join(root, '..', 'docs', 'zonaorientale')
];
const docsDir = docsDirCandidates.find((candidate) => fs.existsSync(candidate)) || docsDirCandidates[0];
const expectedDocs = [
  '00_STATO_CORRENTE_E_INDICE.md',
  '01_FUNZIONALITA_E_CHANGELOG.md',
  '02_ARCHITETTURA_DATI_FIREBASE_SOCCER_DATA.md',
  '03_ADMIN_OPERATIVITA_EMAIL.md',
  '04_CALCIOMERCATO_E_LISTONI.md',
  '05_TEST_AUDIT_REGRESSIONI.md',
  '06_RELEASE_HANDOFF_REFACTOR_STORICO.md',
  '07_PIANIFICAZIONE_ROADMAP_PROSSIME_ATTIVITA.md'
];
for (const file of expectedDocs) {
  if (!fs.existsSync(path.join(docsDir, file))) fail(`doc consolidato mancante: ${file}`);
}

const forbiddenDirs = ['sezioni'];
for (const dir of forbiddenDirs) {
  if (fs.existsSync(path.join(root, dir))) fail(`refactor standalone non desiderato presente: ${dir}/`);
}

if (!process.exitCode) pass('checklist mobile finale V426 verificata');
