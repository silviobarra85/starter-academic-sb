#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../../..');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const requiredDocs = [
  'docs/MULTISEASON_PATH_RESOLVER_V537.md',
  'docs/AI_ASSISTANT_HANDOFF_V537.md',
  'docs/OVERLAY_ROADMAP.md',
  'docs/CENTRALIZATION_STATUS_V521.md'
];

function read(rel) { return fs.readFileSync(path.join(repoRoot, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(repoRoot, rel)); }
function assert(condition, message) {
  if (!condition) {
    console.error(`Audit V537 fallito: ${message}`);
    process.exit(1);
  }
}

const moduleRel = 'static/fanta-engine/js/core/season-path-resolver-v537.js';
assert(exists(moduleRel), `${moduleRel} mancante`);
const moduleText = read(moduleRel);
assert(moduleText.includes('export function installSeasonPathResolverV537'), 'export installSeasonPathResolverV537 mancante');
assert(moduleText.includes('resolveLeagueDataPathWithSeasonV537'), 'resolveLeagueDataPathWithSeasonV537 mancante');
assert(moduleText.includes('joinLeagueDataPathWithSeasonV537'), 'joinLeagueDataPathWithSeasonV537 mancante');
assert(moduleText.includes('physicalMigration: false'), 'il resolver deve dichiarare physicalMigration false');
assert(moduleText.includes('firebaseWrites: false'), 'il resolver deve dichiarare firebaseWrites false');
assert(moduleText.includes('emailjsChanged: false'), 'il resolver deve dichiarare emailjsChanged false');
assert(moduleText.includes('sharedAssetsCurrentPreserved: true'), 'il resolver deve preservare shared-assets/current');

for (const league of leagues) {
  const appRel = `static/${league}/assets/app.js`;
  const indexRel = `static/${league}/index.html`;
  const serviceRel = `static/${league}/assets/js/data/static-files-service.js`;
  const configRel = `static/${league}/assets/league-config.json`;
  const app = read(appRel);
  const index = read(indexRel);
  const service = read(serviceRel);
  const config = JSON.parse(read(configRel));

  assert(app.includes('season-path-resolver-v537.js?v=537'), `${appRel} non importa il resolver V537`);
  assert(app.includes('FantaEngineSeasonPathResolverRuntimeV537'), `${appRel} non installa il runtime V537`);
  assert(index.includes('season-path-resolver-v537.js?v=537'), `${indexRel} non fa preload del resolver V537`);
  assert(index.includes('assets/app.js?v=537'), `${indexRel} non punta app.js a v537`);
  assert(index.includes('V537'), `${indexRel} non mostra footer/versione V537`);
  assert(service.includes('SEASON_PATH_RESOLVER_CANDIDATES_V537'), `${serviceRel} non carica il resolver V537`);
  assert(service.includes('resolveLeagueDataPathV537'), `${serviceRel} non usa resolveLeagueDataPathV537`);
  assert(service.includes("{ kind: 'listoni' }"), `${serviceRel} non classifica listoni come shared`);
  assert(service.includes("{ kind: 'rosters' }"), `${serviceRel} non classifica rosters come season-scoped`);
  assert(service.includes("{ kind: 'competitions' }"), `${serviceRel} non classifica competitions come season-scoped`);
  assert(service.includes('league-config-v443.js?v=537'), `${serviceRel} non usa league-config v537`);
  assert(config.currentVersion === '537', `${configRel} currentVersion non e 537`);
  assert(config.multiSeasonPathResolverV537?.enabled === true, `${configRel} flag multiSeasonPathResolverV537 mancante`);
  assert(config.multiSeasonPathResolverV537?.physicalMigration === false, `${configRel} deve dichiarare physicalMigration false`);
  assert(config.dataPaths?.listoniManifest?.includes('shared-assets/current'), `${configRel} listoni deve restare su shared-assets/current`);
  assert(config.dataPaths?.calciomercatoLinks?.includes('shared-assets/current'), `${configRel} calciomercato deve restare su shared-assets/current`);
  for (const rel of [appRel, indexRel, serviceRel]) {
    assert(!read(rel).includes('?v=536'), `${rel} contiene ancora ?v=536`);
  }
}

for (const rel of requiredDocs) {
  assert(exists(rel), `${rel} mancante`);
  assert(read(rel).includes('V537'), `${rel} non cita V537`);
}

console.log('Audit V537 superato: multi-season path resolver attivo, asset comuni preservati, dati per-stagione non migrati e runtime a ?v=537.');
