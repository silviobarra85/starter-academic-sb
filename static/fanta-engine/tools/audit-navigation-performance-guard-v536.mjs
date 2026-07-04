#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../../..');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const requiredDocs = [
  'docs/NAVIGATION_PERFORMANCE_GUARD_V536.md',
  'docs/AI_ASSISTANT_HANDOFF_V536.md',
  'docs/OVERLAY_ROADMAP.md',
  'docs/CENTRALIZATION_STATUS_V521.md'
];

function read(rel) { return fs.readFileSync(path.join(repoRoot, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(repoRoot, rel)); }
function assert(condition, message) {
  if (!condition) {
    console.error(`Audit V536 fallito: ${message}`);
    process.exit(1);
  }
}

const moduleRel = 'static/fanta-engine/js/ui/navigation-performance-guard-v536.js';
assert(exists(moduleRel), `${moduleRel} mancante`);
const moduleText = read(moduleRel);
assert(moduleText.includes('export function installNavigationPerformanceGuardV536'), 'export installNavigationPerformanceGuardV536 mancante');
assert(moduleText.includes('patchAutoloadV536'), 'patchAutoloadV536 mancante');
assert(moduleText.includes('patchRefreshV536'), 'patchRefreshV536 mancante');
assert(moduleText.includes('navigation-fluidity-v535'), 'deve intercettare i duplicati V535');
assert(moduleText.includes('callsSetAppPage: false'), 'il modulo deve dichiarare callsSetAppPage false');
assert(moduleText.includes('rendersDataDirectly: false'), 'il modulo deve dichiarare rendersDataDirectly false');
assert(moduleText.includes('firebaseWrites: false'), 'il modulo deve dichiarare firebaseWrites false');
assert(moduleText.includes('emailjsChanged: false'), 'il modulo deve dichiarare emailjsChanged false');

for (const league of leagues) {
  const appRel = `static/${league}/assets/app.js`;
  const indexRel = `static/${league}/index.html`;
  const serviceRel = `static/${league}/assets/js/data/static-files-service.js`;
  const configRel = `static/${league}/assets/league-config.json`;
  const app = read(appRel);
  const index = read(indexRel);
  const service = read(serviceRel);
  const config = JSON.parse(read(configRel));

  assert(app.includes('navigation-fluidity-v535.js?v=536'), `${appRel} deve mantenere V535 fluidity cache-bustata a v536`);
  assert(app.includes('navigation-performance-guard-v536.js?v=536'), `${appRel} non importa performance guard V536`);
  assert(app.includes('FantaEngineNavigationPerformanceGuardRuntimeV536'), `${appRel} non installa il runtime V536`);
  assert(app.includes('hasRenderablePublicDataV519'), `${appRel} non passa hasRenderablePublicDataV519 al guard`);
  assert(index.includes('navigation-performance-guard-v536.js?v=536'), `${indexRel} non fa preload del guard V536`);
  assert(index.includes('assets/app.js?v=536'), `${indexRel} non punta app.js a v536`);
  assert(index.includes('V536'), `${indexRel} non mostra footer/versione V536`);
  assert(service.includes('league-config-v443.js?v=536'), `${serviceRel} non usa league-config v536`);
  assert(config.currentVersion === '536', `${configRel} currentVersion non e 536`);
  assert(config.navigationPerformanceGuardV536?.enabled === true, `${configRel} flag navigationPerformanceGuardV536 mancante`);
  for (const rel of [appRel, indexRel, serviceRel]) {
    assert(!read(rel).includes('?v=535'), `${rel} contiene ancora ?v=535`);
  }
}

for (const rel of requiredDocs) {
  assert(exists(rel), `${rel} mancante`);
  assert(read(rel).includes('V536'), `${rel} non cita V536`);
}

console.log('Audit V536 superato: navigation performance guard whole-site, V535 mantenuta ma render duplicati pesanti soppressi e runtime a ?v=536.');
