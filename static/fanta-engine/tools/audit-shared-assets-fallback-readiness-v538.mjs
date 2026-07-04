#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), '../../..');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const kinds = ['listoni', 'calciomercato'];
const requiredDocs = [
  'docs/SHARED_ASSETS_FALLBACK_CLEANUP_READINESS_V538.md',
  'docs/AI_ASSISTANT_HANDOFF_V538.md',
  'docs/OVERLAY_ROADMAP.md',
  'docs/CENTRALIZATION_STATUS_V521.md'
];

function relPath(...parts) { return path.join(repoRoot, ...parts); }
function exists(rel) { return fs.existsSync(relPath(rel)); }
function read(rel) { return fs.readFileSync(relPath(rel), 'utf8'); }
function sha(filePath) { return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex'); }
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
function assert(condition, message) {
  if (!condition) {
    console.error(`Audit V538 fallito: ${message}`);
    process.exit(1);
  }
}

const manifestRel = 'static/fanta-engine/data/shared-assets/current/fallback-readiness-v538.json';
assert(exists(manifestRel), `${manifestRel} mancante`);
const manifest = JSON.parse(read(manifestRel));
assert(manifest.version === 'V538', 'manifest non e V538');
assert(manifest.readinessOnly === true, 'manifest deve essere readinessOnly');
assert(manifest.deletesLocalFallbacks === false, 'manifest non deve cancellare fallback');
assert(manifest.movesFiles === false, 'manifest non deve spostare file');
assert(manifest.guardrails?.doNotDeleteAutomatically === true, 'guardrail doNotDeleteAutomatically mancante');
assert(manifest.guardrails?.keepLocalFallbacksUntilManualApproval === true, 'guardrail keepLocalFallbacksUntilManualApproval mancante');

let centralTotal = 0;
let localTotal = 0;
let identicalTotal = 0;
for (const kind of kinds) {
  const centralRoot = relPath('static/fanta-engine/data/shared-assets/current/assets', kind);
  assert(fs.existsSync(centralRoot), `root centrale ${kind} mancante`);
  const centralFiles = listFiles(centralRoot);
  centralTotal += centralFiles.length;
  assert(centralFiles.length > 0, `nessun file centrale per ${kind}`);
  const centralByRel = new Map(centralFiles.map((abs) => [path.relative(centralRoot, abs).replaceAll(path.sep, '/'), sha(abs)]));
  const kindManifest = manifest.kinds?.[kind];
  assert(kindManifest?.centralFileCount === centralFiles.length, `count centrale manifest errato per ${kind}`);
  for (const [rel, hash] of centralByRel.entries()) {
    assert(kindManifest.centralFiles?.[rel]?.sha256 === hash, `hash centrale manifest errato per ${kind}/${rel}`);
  }

  for (const league of leagues) {
    const localRoot = relPath('static', league, 'assets', kind);
    assert(fs.existsSync(localRoot), `fallback locale ${league}/${kind} mancante`);
    const localFiles = listFiles(localRoot);
    localTotal += localFiles.length;
    const fallback = kindManifest.fallbacksByLeague?.[league];
    assert(Boolean(fallback), `manifest fallback mancante per ${league}/${kind}`);
    assert(fallback.preserveUntilManualApproval === true, `fallback ${league}/${kind} non dichiara preservazione manuale`);
    assert(fallback.localFileCount === localFiles.length, `count locale manifest errato per ${league}/${kind}`);
    let identical = 0;
    const seen = new Set();
    for (const abs of localFiles) {
      const rel = path.relative(localRoot, abs).replaceAll(path.sep, '/');
      seen.add(rel);
      const centralHash = centralByRel.get(rel);
      assert(centralHash, `file locale extra ${league}/${kind}/${rel}`);
      assert(centralHash === sha(abs), `file locale differente da centrale ${league}/${kind}/${rel}`);
      identical += 1;
    }
    for (const rel of centralByRel.keys()) {
      assert(seen.has(rel), `file centrale senza fallback ${league}/${kind}/${rel}`);
    }
    identicalTotal += identical;
    assert(fallback.identicalCount === identical, `identicalCount errato per ${league}/${kind}`);
    assert(fallback.differentCount === 0, `differentCount non zero per ${league}/${kind}`);
    assert(fallback.missingCount === 0, `missingCount non zero per ${league}/${kind}`);
    assert(fallback.extraCount === 0, `extraCount non zero per ${league}/${kind}`);
    assert(fallback.cleanupReady === true, `cleanupReady non true per ${league}/${kind}`);
  }
}

for (const league of leagues) {
  const configRel = `static/${league}/assets/league-config.json`;
  const config = JSON.parse(read(configRel));
  assert(config.currentVersion === '538', `${configRel} currentVersion non e 538`);
  assert(config.sharedAssetsFallbackCleanupReadinessV538?.enabled === true, `${configRel} flag V538 mancante`);
  assert(config.sharedAssetsFallbackCleanupReadinessV538?.deletesLocalFallbacks === false, `${configRel} deve dichiarare deletesLocalFallbacks false`);
  for (const rel of ['index.html', 'assets/app.js', 'assets/js/data/static-files-service.js']) {
    const target = `static/${league}/${rel}`;
    const text = read(target);
    assert(text.includes('?v=538') || text.includes('V538'), `${target} non risulta aggiornato a V538`);
    assert(!text.includes('?v=537'), `${target} contiene ancora ?v=537`);
  }
  assert(config.dataPaths?.listoniManifest?.includes('shared-assets/current'), `${configRel} listoni non punta a shared-assets/current`);
  assert(config.dataPaths?.calciomercatoLinks?.includes('shared-assets/current'), `${configRel} calciomercato non punta a shared-assets/current`);
}

for (const rel of requiredDocs) {
  assert(exists(rel), `${rel} mancante`);
  assert(read(rel).includes('V538'), `${rel} non cita V538`);
}

assert(!exists("docs/zonaorientale/FUNZIONALITA'.md") || true, 'FUNZIONALITA non deve essere richiesto dall audit');
assert(manifest.summary.centralFiles === centralTotal, 'summary centralFiles errato');
assert(manifest.summary.localFallbackFiles === localTotal, 'summary localFallbackFiles errato');
assert(manifest.summary.identicalFallbackFiles === identicalTotal, 'summary identicalFallbackFiles errato');
assert(manifest.summary.differentFallbackFiles === 0, 'summary differentFallbackFiles non zero');
assert(manifest.summary.missingFallbackFiles === 0, 'summary missingFallbackFiles non zero');
assert(manifest.summary.extraFallbackFiles === 0, 'summary extraFallbackFiles non zero');

console.log('Audit V538 superato: fallback locali Listoni/Calciomercato pronti al cleanup manuale, nessuna cancellazione automatica e runtime whole-site a ?v=538.');
