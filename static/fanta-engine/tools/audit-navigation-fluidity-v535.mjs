#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../../..');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const requiredDocs = [
  'docs/NAVIGATION_FLUIDITY_V535.md',
  'docs/AI_ASSISTANT_HANDOFF_V535.md',
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
    console.error(`Audit V535 fallito: ${message}`);
    process.exit(1);
  }
}

const moduleRel = 'static/fanta-engine/js/ui/navigation-fluidity-v535.js';
assert(exists(moduleRel), `${moduleRel} mancante`);
const moduleText = read(moduleRel);
assert(moduleText.includes('export function installNavigationFluidityV535'), 'export installNavigationFluidityV535 mancante');
assert(moduleText.includes('queueAfterPaintV535'), 'queueAfterPaintV535 mancante');
assert(moduleText.includes('patchScrollToV535'), 'patchScrollToV535 mancante');
assert(moduleText.includes('disableBroadSingletonObserverV535'), 'disableBroadSingletonObserverV535 mancante');
assert(moduleText.includes('callsSetAppPage: false'), 'il modulo deve dichiarare callsSetAppPage false');
assert(moduleText.includes('mutatesHash: false'), 'il modulo deve dichiarare mutatesHash false');
assert(moduleText.includes('rendersDataDirectly: false'), 'il modulo deve dichiarare rendersDataDirectly false');

for (const league of leagues) {
  const appRel = `static/${league}/assets/app.js`;
  const indexRel = `static/${league}/index.html`;
  const serviceRel = `static/${league}/assets/js/data/static-files-service.js`;
  const configRel = `static/${league}/assets/league-config.json`;
  const app = read(appRel);
  const index = read(indexRel);
  const service = read(serviceRel);
  const config = JSON.parse(read(configRel));

  assert(app.includes('navigation-fluidity-v535.js?v=535'), `${appRel} non importa navigation-fluidity V535`);
  assert(app.includes('FantaEngineNavigationFluidityRuntimeV535'), `${appRel} non installa il runtime V535`);
  assert(index.includes('navigation-fluidity-v535.js?v=535'), `${indexRel} non fa preload del modulo V535`);
  assert(index.includes('assets/app.js?v=535'), `${indexRel} non punta app.js a v535`);
  assert(index.includes('V535'), `${indexRel} non mostra footer/versione V535`);
  assert(service.includes('league-config-v443.js?v=535'), `${serviceRel} non usa league-config v535`);
  assert(config.currentVersion === '535', `${configRel} currentVersion non e 535`);
  assert(config.navigationFluidityV535?.enabled === true, `${configRel} flag navigationFluidityV535 mancante`);

  for (const rel of [appRel, indexRel, serviceRel]) {
    assert(!read(rel).includes('?v=534'), `${rel} contiene ancora ?v=534`);
  }
}

for (const rel of requiredDocs) {
  assert(exists(rel), `${rel} mancante`);
  assert(read(rel).includes('V535'), `${rel} non cita V535`);
}

console.log('Audit V535 superato: navigation fluidity whole-site, feedback piu rapido e runtime a ?v=535.');
