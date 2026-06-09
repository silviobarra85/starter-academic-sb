#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const quiet = process.argv.includes('--quiet');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const failures = [];
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const assert = (condition, message) => { if (!condition) failures.push(message); };

const app = read('assets/app.js');
const index = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const check = read('tools/check-zonaorientale.sh');
const mobileCss = read('assets/css/refactor/mobile-controls.css');
const styles = read('assets/styles.css');

const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = Number(runtimeMatch?.[1] || 0);
assert(runtimeVersion >= 428, `runtime inferiore a V428: ${runtimeVersion || 'non rilevato'}`);
assert(app.includes('ZonaOrientalePreMergeCleanupV428'), 'marker ZonaOrientalePreMergeCleanupV428 mancante');
assert(app.includes('ZonaOrientaleLegacyWarningCleanupV427'), 'marker V427 non preservato');
assert(app.includes('ZonaOrientaleMobileChecklistV426'), 'marker V426 non preservato');
assert(app.includes('ZonaOrientaleMobileTypographyV425'), 'marker V425 non preservato');

for (const [name, html] of [['index.html', index], ['competition.html', competition], ['player.html', player]]) {
  assert(/V4(28|29|30)/.test(html), `${name} footer V428+ mancante`);
  assert(html.includes(`?v=${runtimeVersion}`) || name === 'player.html', `${name} cache-buster runtime V${runtimeVersion} mancante`);
  assert(!html.includes('?v=427'), `${name} contiene cache-buster V427 stale`);
  assert(!html.includes('?v=426'), `${name} contiene cache-buster V426 stale`);
}
assert(!app.includes('?v=427'), 'assets/app.js contiene ancora import/fetch ?v=427');
assert(!app.includes('?v=426'), 'assets/app.js contiene ancora import/fetch ?v=426');
assert(!index.includes('role-backgrounds-v405r2'), 'index richiama asset sperimentali role-backgrounds-v405r2');
assert(!index.includes('sezioni/'), 'refactor pagine standalone rientrato in index.html');
assert(!exists('sezioni'), 'cartella sezioni/ presente: refactor standalone non desiderato');

for (const literal of ['0.78rem', '0.73rem', '0.66rem', '0.62rem']) {
  assert(mobileCss.includes(literal), `scala mobile canonica mancante: ${literal}`);
}
for (const token of ['player-role-gk', 'player-role-def', 'player-role-mid', 'player-role-fwd']) {
  assert(styles.includes(token) || mobileCss.includes(token) || app.includes(token), `colore ruolo mancante: ${token}`);
}

const requiredAudits = [
  'audit-home-calciomercato-mobile-v407.mjs',
  'audit-roster-listone-style-v408.mjs',
  'audit-mobile-player-tables-v409.mjs',
  'audit-calciomercato-mobile-v410.mjs',
  'audit-dashboard-mobile-v411.mjs',
  'audit-mobile-more-menu-v412.mjs',
  'audit-mobile-filters-v413.mjs',
  'audit-teamarea-mobile-v414.mjs',
  'audit-mobile-home-teamprofile-v415.mjs',
  'audit-admin-mobile-v416.mjs',
  'audit-css-asset-cleanup-v417.mjs',
  'audit-mobile-accessibility-v418.mjs',
  'audit-archive-mobile-v419.mjs',
  'audit-mobile-typography-v420.mjs',
  'audit-archive-mobile-typography-v421.mjs',
  'audit-mobile-scale-archive-v422.mjs',
  'audit-mobile-typography-global-v423.mjs',
  'audit-mobile-typography-residue-v424.mjs',
  'audit-mobile-scale-consolidation-v425.mjs',
  'audit-mobile-final-checklist-v426.mjs',
  'audit-legacy-warning-cleanup-v427.mjs'
];
for (const file of requiredAudits) {
  assert(exists(`tools/${file}`), `audit precedente mancante: tools/${file}`);
}
assert(check.includes('audit-premerge-cleanup-v428.mjs'), 'check-zonaorientale non include gate V428');

const docsCandidates = [
  path.resolve(root, '..', '..', 'docs', 'zonaorientale'),
  path.resolve(root, '..', 'docs', 'zonaorientale')
];
const docsRoot = docsCandidates.find((candidate) => fs.existsSync(candidate));
const docsFiles = [
  '00_STATO_CORRENTE_E_INDICE.md',
  '01_FUNZIONALITA_E_CHANGELOG.md',
  '02_ARCHITETTURA_DATI_FIREBASE_SOCCER_DATA.md',
  '03_ADMIN_OPERATIVITA_EMAIL.md',
  '04_CALCIOMERCATO_E_LISTONI.md',
  '05_TEST_AUDIT_REGRESSIONI.md',
  '06_RELEASE_HANDOFF_REFACTOR_STORICO.md',
  '07_PIANIFICAZIONE_ROADMAP_PROSSIME_ATTIVITA.md'
];
if (docsRoot) {
  for (const file of docsFiles) {
    const docPath = path.join(docsRoot, file);
    assert(fs.existsSync(docPath), `doc consolidato mancante: ${file}`);
    const content = fs.readFileSync(docPath, 'utf8');
    assert(content.includes('V428'), `doc consolidato non aggiornato a V428: ${file}`);
  }
}

const macosArtifacts = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.name === '.DS_Store' || entry.name === '__MACOSX' || entry.name.startsWith('._')) {
      macosArtifacts.push(path.relative(root, full));
    }
    if (entry.isDirectory()) walk(full);
  }
};
walk(root);
assert(macosArtifacts.length === 0, `artefatti macOS presenti: ${macosArtifacts.join(', ')}`);

if (failures.length) {
  console.error('Audit pre-merge cleanup V428 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
if (!quiet) console.log('Audit pre-merge cleanup V428 superato.');
