#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../../..');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const requiredDocs = [
  'docs/NAVIGATION_ACTIVE_SINGLETON_V534.md',
  'docs/AI_ASSISTANT_HANDOFF_V534.md',
  'docs/OVERLAY_ROADMAP.md',
  'docs/CENTRALIZATION_STATUS_V521.md'
];

function read(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(repoRoot, rel));
}
function assert(condition, message) {
  if (!condition) {
    console.error(`Audit V534 fallito: ${message}`);
    process.exit(1);
  }
}

const moduleRel = 'static/fanta-engine/js/ui/navigation-active-singleton-v534.js';
assert(exists(moduleRel), `${moduleRel} mancante`);
const moduleText = read(moduleRel);
assert(moduleText.includes('export function installNavigationActiveSingletonV534'), 'export installNavigationActiveSingletonV534 mancante');
assert(moduleText.includes('callsSetAppPage: false'), 'il modulo deve dichiarare callsSetAppPage false');
assert(moduleText.includes('mutatesHash: false'), 'il modulo deve dichiarare mutatesHash false');
assert(moduleText.includes('staleActiveLinksRemoved'), 'report staleActiveLinksRemoved mancante');

for (const league of leagues) {
  const appRel = `static/${league}/assets/app.js`;
  const indexRel = `static/${league}/index.html`;
  const serviceRel = `static/${league}/assets/js/data/static-files-service.js`;
  const configRel = `static/${league}/assets/league-config.json`;
  const app = read(appRel);
  const index = read(indexRel);
  const service = read(serviceRel);
  const config = JSON.parse(read(configRel));

  assert(app.includes('navigation-active-singleton-v534.js?v=534'), `${appRel} non importa navigation-active-singleton V534`);
  assert(app.includes('FantaEngineNavigationActiveSingletonRuntimeV534'), `${appRel} non installa il runtime V534`);
  assert(index.includes('navigation-active-singleton-v534.js?v=534'), `${indexRel} non fa preload del modulo V534`);
  assert(index.includes('assets/app.js?v=534'), `${indexRel} non punta app.js a v534`);
  assert(index.includes('V534'), `${indexRel} non mostra footer/versione V534`);
  assert(service.includes('league-config-v443.js?v=534'), `${serviceRel} non usa league-config v534`);
  assert(config.currentVersion === '534', `${configRel} currentVersion non e 534`);
  assert(config.navigationActiveSingletonV534?.enabled === true, `${configRel} flag navigationActiveSingletonV534 mancante`);

  for (const rel of [appRel, indexRel, serviceRel]) {
    assert(!read(rel).includes('?v=533'), `${rel} contiene ancora ?v=533`);
  }
}

for (const rel of requiredDocs) {
  assert(exists(rel), `${rel} mancante`);
  assert(read(rel).includes('V534'), `${rel} non cita V534`);
}

console.log('Audit V534 superato: navigation active singleton whole-site, un solo target nav attivo e runtime a ?v=534.');
