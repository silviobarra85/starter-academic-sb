#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../../..');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const runtimeVersion = '539';
const requiredDocs = [
  'docs/MERGE_READINESS_RELEASE_CANDIDATE_V539.md',
  'docs/AI_ASSISTANT_HANDOFF_V539.md',
  'docs/OVERLAY_ROADMAP.md',
  'docs/CENTRALIZATION_STATUS_V521.md'
];
const requiredEngineFiles = [
  'static/fanta-engine/js/core/public-data-autoload-v512.js',
  'static/fanta-engine/js/core/season-data-adapter-v526.js',
  'static/fanta-engine/js/core/season-path-resolver-v537.js',
  'static/fanta-engine/js/ui/navigation-performance-guard-v536.js',
  'static/fanta-engine/data/shared-assets/current/fallback-readiness-v538.json',
  'static/fanta-engine/data/release-candidates/release-candidate-v539.json'
];

function relPath(...parts) { return path.join(repoRoot, ...parts); }
function exists(rel) { return fs.existsSync(relPath(rel)); }
function read(rel) { return fs.readFileSync(relPath(rel), 'utf8'); }
function assert(condition, message) {
  if (!condition) {
    console.error(`Audit V539 fallito: ${message}`);
    process.exit(1);
  }
}
function listFiles(rootAbs) {
  if (!fs.existsSync(rootAbs)) return [];
  const out = [];
  for (const entry of fs.readdirSync(rootAbs, { withFileTypes: true })) {
    const abs = path.join(rootAbs, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(abs));
    else if (entry.isFile()) out.push(abs);
  }
  return out.sort();
}
function sha(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

for (const rel of requiredDocs) {
  assert(exists(rel), `${rel} mancante`);
  assert(read(rel).includes('V539'), `${rel} non cita V539`);
}
for (const rel of requiredEngineFiles) {
  assert(exists(rel), `${rel} mancante`);
}

const rc = JSON.parse(read('static/fanta-engine/data/release-candidates/release-candidate-v539.json'));
assert(rc.version === 'V539', 'release candidate manifest non e V539');
assert(rc.releaseCandidate === true, 'releaseCandidate deve essere true');
assert(rc.functionalChanges === false, 'V539 non deve dichiarare modifiche funzionali');
assert(rc.wholeSiteOverlay === true, 'V539 deve essere whole-site');
assert(rc.guardrails?.deletesLocalFallbacks === false, 'V539 non deve cancellare fallback locali');
assert(rc.guardrails?.firebaseChanged === false, 'V539 non deve cambiare Firebase');
assert(rc.guardrails?.emailjsChanged === false, 'V539 non deve cambiare EmailJS');
assert(rc.guardrails?.adminChanged === false, 'V539 non deve cambiare Admin');
assert(rc.guardrails?.presidentChanged === false, 'V539 non deve cambiare Presidente');
assert(rc.guardrails?.docsUpdated === true, 'docsUpdated mancante nel manifest');
assert(rc.guardrails?.handoffUpdated === true, 'handoffUpdated mancante nel manifest');

const fallback = JSON.parse(read('static/fanta-engine/data/shared-assets/current/fallback-readiness-v538.json'));
assert(fallback.version === 'V538', 'fallback readiness V538 mancante o errato');
assert(fallback.readinessOnly === true, 'fallback readiness deve essere readinessOnly');
assert(fallback.deletesLocalFallbacks === false, 'fallback readiness non deve cancellare file');
assert(fallback.summary?.differentFallbackFiles === 0, 'fallback differenti non zero');
assert(fallback.summary?.missingFallbackFiles === 0, 'fallback mancanti non zero');
assert(fallback.summary?.extraFallbackFiles === 0, 'fallback extra non zero');

// Verify central shared assets still match local fallback copies.
for (const kind of ['listoni', 'calciomercato']) {
  const centralRoot = relPath('static/fanta-engine/data/shared-assets/current/assets', kind);
  const centralFiles = listFiles(centralRoot);
  assert(centralFiles.length > 0, `nessun file centrale per ${kind}`);
  const centralByRel = new Map(centralFiles.map((abs) => [path.relative(centralRoot, abs).replaceAll(path.sep, '/'), sha(abs)]));
  for (const league of leagues) {
    const localRoot = relPath('static', league, 'assets', kind);
    assert(fs.existsSync(localRoot), `fallback locale ${league}/${kind} mancante`);
    const localFiles = listFiles(localRoot);
    assert(localFiles.length === centralFiles.length, `numero fallback ${league}/${kind} diverso dal centrale`);
    const seen = new Set();
    for (const abs of localFiles) {
      const rel = path.relative(localRoot, abs).replaceAll(path.sep, '/');
      seen.add(rel);
      assert(centralByRel.has(rel), `file fallback extra ${league}/${kind}/${rel}`);
      assert(centralByRel.get(rel) === sha(abs), `hash fallback diverso ${league}/${kind}/${rel}`);
    }
    for (const rel of centralByRel.keys()) {
      assert(seen.has(rel), `fallback mancante ${league}/${kind}/${rel}`);
    }
  }
}

const forbiddenRuntimeResidues = [
  'league-config-v443.js?v=512',
  'assets/app.js?v=512',
  'public-data-autoload-v512.js?v=518',
  'public-data-autoload-v512.js?v=519',
  'public-data-autoload-v512.js?v=520',
  'public-data-autoload-v512.js?v=521',
  'public-data-autoload-v512.js?v=522',
  'public-data-autoload-v512.js?v=523',
  'public-data-autoload-v512.js?v=524',
  'public-data-autoload-v512.js?v=525',
  'public-data-autoload-v512.js?v=526',
  'public-data-autoload-v512.js?v=527',
  'public-data-autoload-v512.js?v=528',
  'public-data-autoload-v512.js?v=529',
  'public-data-autoload-v512.js?v=530',
  'public-data-autoload-v512.js?v=531',
  'public-data-autoload-v512.js?v=532',
  'public-data-autoload-v512.js?v=533',
  'public-data-autoload-v512.js?v=534',
  'public-data-autoload-v512.js?v=535',
  'public-data-autoload-v512.js?v=536',
  'public-data-autoload-v512.js?v=537',
  'public-data-autoload-v512.js?v=538',
  'formValidatorsV506,',
  'shared-assets/v485'
];

for (const league of leagues) {
  const configRel = `static/${league}/assets/league-config.json`;
  const config = JSON.parse(read(configRel));
  assert(config.currentVersion === runtimeVersion, `${configRel} currentVersion non e ${runtimeVersion}`);
  assert(config.mergeReadinessReleaseCandidateV539?.enabled === true, `${configRel} flag V539 mancante`);
  assert(config.mergeReadinessReleaseCandidateV539?.functionalChanges === false, `${configRel} deve dichiarare functionalChanges false`);
  assert(config.mergeReadinessReleaseCandidateV539?.deletesLocalFallbacks === false, `${configRel} deve dichiarare deletesLocalFallbacks false`);
  assert(config.dataPaths?.listoniManifest?.includes('shared-assets/current'), `${configRel} listoni non punta a shared-assets/current`);
  assert(config.dataPaths?.calciomercatoLinks?.includes('shared-assets/current'), `${configRel} calciomercato non punta a shared-assets/current`);
  assert(config.sharedAssetsFallbackCleanupReadinessV538?.deletesLocalFallbacks === false, `${configRel} readiness V538 non preservata`);

  for (const rel of ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'news.html', 'assets/app.js', 'assets/js/data/static-files-service.js', 'assets/js/core/league-config-v443.js']) {
    const target = `static/${league}/${rel}`;
    const text = read(target);
    if (['index.html', 'assets/app.js', 'assets/js/data/static-files-service.js'].includes(rel)) {
      assert(text.includes(`?v=${runtimeVersion}`) || text.includes(`V${runtimeVersion}`), `${target} non risulta aggiornato a V539`);
    }
    assert(!text.includes('?v=538'), `${target} contiene ancora ?v=538`);
    for (const residue of forbiddenRuntimeResidues) {
      assert(!text.includes(residue), `${target} contiene residuo ${residue}`);
    }
  }

  const app = read(`static/${league}/assets/app.js`);
  assert(app.includes('navigation-performance-guard-v536.js?v=539'), `${league} app non preserva navigation-performance-guard V536 con cache V539`);
  assert(app.includes('season-path-resolver-v537.js?v=539'), `${league} app non preserva season-path-resolver V537 con cache V539`);
  assert(app.includes('installPublicDataAutoloadV526'), `${league} app deve importare installPublicDataAutoloadV526`);

  const leagueConfig = read(`static/${league}/assets/js/core/league-config-v443.js`);
  assert(leagueConfig.includes('formValidatorsV506: true'), `${league} league-config non contiene formValidatorsV506: true`);
}

// Public data autoload export sanity: no undefined V517/V518 style aggregate-only exports.
const autoload = read('static/fanta-engine/js/core/public-data-autoload-v512.js');
for (const name of ['installPublicDataAutoloadV512','installPublicDataAutoloadV520','installPublicDataAutoloadV526']) {
  assert(autoload.includes(`function ${name}`), `${name} non definito in public-data-autoload`);
  assert(autoload.includes(name), `${name} non esportato in public-data-autoload`);
}

console.log('Audit V539 superato: release candidate whole-site pronta, runtime a ?v=539, docs/handoff aggiornati e guardrail preservati.');
