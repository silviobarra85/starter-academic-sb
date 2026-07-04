#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const cwd = process.cwd();
const staticRoot = fs.existsSync(path.join(cwd, 'static')) ? path.join(cwd, 'static') : cwd;
const repoRoot = path.dirname(staticRoot);
const docsRoot = path.join(repoRoot, 'docs');
const engineRoot = path.join(staticRoot, 'fanta-engine');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const expectedVersion = '521';
const centralManifestPath = path.join(engineRoot, 'data/shared-assets-centralization-v485.json');
const centralStatusDoc = path.join(docsRoot, 'CENTRALIZATION_STATUS_V521.md');
const roadmapDoc = path.join(docsRoot, 'OVERLAY_ROADMAP.md');

let failures = 0;

function fail(message) {
  failures += 1;
  console.error(`FAIL ${message}`);
}

function pass(message) {
  console.log(`OK   ${message}`);
}

function check(condition, message) {
  if (condition) pass(message);
  else fail(message);
}

function readText(file) {
  return fs.readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function listTextFiles(root, matcher) {
  const results = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      if (item.isDirectory()) walk(full);
      else if (!matcher || matcher(full)) results.push(full);
    }
  }
  walk(root);
  return results;
}

check(fs.existsSync(centralStatusDoc), 'documento CENTRALIZATION_STATUS_V521 presente');
check(fs.existsSync(roadmapDoc) && readText(roadmapDoc).includes('V522 - Shared assets single-upload workflow'), 'roadmap aggiornata con V522 shared assets');
check(fs.existsSync(centralManifestPath), 'manifest centralizzazione shared assets V485 presente');

const autoloadPath = path.join(engineRoot, 'js/core/public-data-autoload-v512.js');
const autoload = readText(autoloadPath);
check(autoload.includes('const PUBLIC_DATA_AUTOLOAD_VERSION_V521'), 'public-data-autoload definisce costante V521');
check(autoload.includes('function installPublicDataAutoloadV521'), 'public-data-autoload definisce install V521');
check(autoload.includes('installPublicDataAutoloadV521,'), 'public-data-autoload esporta install V521');

for (const league of leagues) {
  const leagueRoot = path.join(staticRoot, league);
  const config = readJson(path.join(leagueRoot, 'assets/league-config.json'));
  const app = readText(path.join(leagueRoot, 'assets/app.js'));
  const loader = readText(path.join(leagueRoot, 'assets/js/core/league-config-v443.js'));
  const staticFiles = readText(path.join(leagueRoot, 'assets/js/data/static-files-service.js'));
  check(String(config.currentVersion) === expectedVersion, `${league}: currentVersion V521`);
  check(config.features?.centralizationStatus === true, `${league}: feature centralizationStatus attiva`);
  check(config.features?.sharedAssetsSingleUploadCandidate === true, `${league}: candidato upload unico asset comuni tracciato`);
  check(config.features?.sharedAssetsCentralized === true, `${league}: sharedAssetsCentralized ancora attivo`);
  check(config.guardrails?.doNotDeleteLocalSharedAssetsWithoutFallbackAudit === true, `${league}: guardrail anti-cancellazione asset locali presente`);
  check(app.includes('public-data-autoload-v512.js?v=521'), `${league}: app carica public-data-autoload con cache-buster V521`);
  check(app.includes('installPublicDataAutoloadV521'), `${league}: app usa alias installPublicDataAutoloadV521`);
  check(app.includes('DEPLOY_EXPECTED_VERSION_V181 = "521"'), `${league}: DEPLOY_EXPECTED_VERSION allineato a V521`);
  check(loader.includes('league-config.json?v=521'), `${league}: loader config JSON cache-buster V521`);
  check(loader.includes('version: \'V521\''), `${league}: window league config pubblicata come V521`);
  check(staticFiles.includes('league-config-v443.js?v=521'), `${league}: static-files-service importa league-config V521`);

  for (const htmlName of ['index.html', 'competition.html', 'player.html']) {
    const htmlPath = path.join(leagueRoot, htmlName);
    if (!fs.existsSync(htmlPath)) continue;
    const html = readText(htmlPath);
    check(html.includes('league-config-v443.js?v=521'), `${league}/${htmlName}: league-config cache-buster V521`);
    check(html.includes('V521'), `${league}/${htmlName}: footer/runtime V521 presente`);
  }
}

const textFiles = leagues.flatMap((league) => listTextFiles(path.join(staticRoot, league), (file) => /\.(html|js|json)$/.test(file)));
const staleRuntimeRefs = textFiles.filter((file) => readText(file).includes('league-config-v443.js?v=512'));
check(staleRuntimeRefs.length === 0, 'nessun residuo league-config-v443.js?v=512 nelle leghe');

const centralManifest = readJson(centralManifestPath);
check(centralManifest.runtime?.listoniPrimary?.includes('fanta-engine/data/shared-assets/v485/assets/listoni/'), 'manifest centrale: listoni primary in fanta-engine');
check(centralManifest.runtime?.calciomercatoPrimary?.includes('fanta-engine/data/shared-assets/v485/assets/calciomercato/'), 'manifest centrale: calciomercato primary in fanta-engine');
check(centralManifest.guardrails?.localCopiesPreserved === true, 'manifest centrale: copie locali preservate');
check(centralManifest.guardrails?.deleteLeagueLocalCopies === false, 'manifest centrale: nessuna cancellazione locale');

const manifestFiles = Array.isArray(centralManifest.files) ? centralManifest.files : [];
check(manifestFiles.length >= 42, 'manifest centrale contiene almeno 42 file asset comuni');

let identicalCentralCopies = 0;
let checkedCopies = 0;
for (const item of manifestFiles) {
  const central = path.join(staticRoot, item.centralPath);
  check(fs.existsSync(central), `centrale presente: ${item.path}`);
  const centralHash = fs.existsSync(central) ? hashFile(central) : '';
  if (item.sha256) check(centralHash === item.sha256, `hash centrale manifest valido: ${item.path}`);
  for (const league of leagues) {
    const local = path.join(staticRoot, league, item.path);
    checkedCopies += 1;
    if (!fs.existsSync(local)) {
      fail(`${league}: fallback locale mancante per ${item.path}`);
      continue;
    }
    const localHash = hashFile(local);
    if (localHash === centralHash) identicalCentralCopies += 1;
    else fail(`${league}: fallback locale diverso dal centrale per ${item.path}`);
  }
}

check(identicalCentralCopies === checkedCopies, `asset comuni centrali e fallback locali identici (${identicalCentralCopies}/${checkedCopies})`);

if (failures) {
  console.error(`\nAudit V521 fallito: ${failures} problema/i.`);
  process.exit(1);
}

console.log('\nAudit V521 superato: roadmap riallineata, runtime V521 e Listoni/Calciomercato centralizzati con fallback identici.');
