#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LEAGUES = ['zonaorientale', 'fantapetillomantramanager'];
const disabledRuntimeImports = [
  'quick-navigation-smoke-v532.js',
  'navigation-active-singleton-v534.js',
  'navigation-fluidity-v535.js'
];

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(`Audit V536 fallito: ${message}`);
    process.exit(1);
  }
}

for (const league of LEAGUES) {
  const appRel = `static/${league}/assets/app.js`;
  const indexRel = `static/${league}/index.html`;
  const configRel = `static/${league}/assets/league-config.json`;
  const app = read(appRel);
  const index = read(indexRel);
  const config = JSON.parse(read(configRel));

  assert(app.includes('?v=536'), `${appRel} non e' allineato a ?v=536.`);
  assert(index.includes('./assets/app.js?v=536'), `${indexRel} non carica app.js?v=536.`);
  assert(Number(config.currentVersion) === 536, `${configRel} non ha currentVersion 536.`);

  for (const disabled of disabledRuntimeImports) {
    assert(!app.includes(disabled), `${appRel} importa ancora ${disabled}.`);
    assert(!index.includes(disabled), `${indexRel} pre-carica ancora ${disabled}.`);
  }

  assert(app.includes('installNavigationActionsV510'), `${appRel} deve preservare il navigation actions engine storico.`);
  assert(app.includes('installNavigationDataRefreshV511'), `${appRel} deve preservare il refresh dati navigazione storico.`);
  assert(app.includes('installPublicDataAutoloadV526'), `${appRel} deve preservare l'autoload pubblico stabilizzato.`);
}

const roadmap = read('docs/OVERLAY_ROADMAP.md');
const handoff = read('docs/AI_ASSISTANT_HANDOFF_V536.md');
assert(roadmap.includes('V536 - Restore native navigation speed'), 'Roadmap non aggiornata a V536.');
assert(handoff.includes('overlay_v536_restore_native_navigation_whole_site.zip'), 'Handoff V536 non aggiornato.');

console.log('Audit V536 superato: navigazione ripristinata al percorso nativo leggero, runtime whole-site a ?v=536 e docs/handoff aggiornati.');
