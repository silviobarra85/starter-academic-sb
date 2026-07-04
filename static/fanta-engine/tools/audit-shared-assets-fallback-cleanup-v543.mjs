#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];
const notes = [];

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}
function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}
function json(rel) {
  return JSON.parse(read(rel));
}
function walkFiles(rel) {
  const dir = path.join(ROOT, rel);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile()) out.push(path.relative(ROOT, full).split(path.sep).join('/'));
    }
  }
  return out.sort();
}
function assert(cond, msg) { if (!cond) errors.push(msg); }

const centralListoni = 'static/fanta-engine/data/shared-assets/current/assets/listoni';
const centralCalcio = 'static/fanta-engine/data/shared-assets/current/assets/calciomercato';
assert(exists(`${centralListoni}/manifest.json`), 'Manifest listoni centrale mancante.');
assert(exists(`${centralCalcio}/links.json`), 'links.json calciomercato centrale mancante.');
assert(exists(`${centralCalcio}/archive/manifest.json`), 'Manifest archivio calciomercato centrale mancante.');
notes.push(`listoni centrali: ${walkFiles(centralListoni).length} file`);
notes.push(`calciomercato centrale: ${walkFiles(centralCalcio).length} file`);

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const base = `static/${league}`;
  assert(!exists(`${base}/assets/listoni`), `${league}: fallback locale assets/listoni ancora presente. Eseguire cleanup V543 --yes.`);
  assert(!exists(`${base}/assets/calciomercato`), `${league}: fallback locale assets/calciomercato ancora presente. Eseguire cleanup V543 --yes.`);

  const configPath = `${base}/assets/league-config.json`;
  const cfg = json(configPath);
  assert(String(cfg.currentVersion) === '543', `${league}: currentVersion non e' 543.`);
  assert(Number(cfg.version) === 543, `${league}: version non e' 543.`);
  assert(cfg.sharedAssetsFallbackCleanupV543?.enabled === true, `${league}: flag sharedAssetsFallbackCleanupV543 mancante.`);
  const dataPaths = cfg.dataPaths || {};
  for (const key of ['listoniManifestFallback','listoniBaseFallback','calciomercatoLinksFallback','calciomercatoArchiveManifestFallback','calciomercatoArchiveBaseFallback']) {
    assert(!(key in dataPaths), `${league}: dataPaths contiene ancora ${key}.`);
  }

  const app = read(`${base}/assets/app.js`);
  assert(app.includes('?v=543'), `${league}: app.js non contiene cache-buster V543.`);
  assert(!app.includes('calciomercatoLinksFallback'), `${league}: app.js contiene ancora calciomercatoLinksFallback.`);
  assert(!app.includes('calciomercatoArchiveManifestFallback'), `${league}: app.js contiene ancora calciomercatoArchiveManifestFallback.`);
  assert(!app.includes('calciomercatoArchiveBaseFallback'), `${league}: app.js contiene ancora calciomercatoArchiveBaseFallback.`);
  assert(!app.includes('url: "assets/listoni/manifest.json"'), `${league}: preflight listoni punta ancora al fallback locale.`);
  assert(!app.includes('const CALCIOMERCATO_STATIC_URL_V306 = "./assets/calciomercato/links.json";'), `${league}: calciomercato default punta ancora al fallback locale.`);

  const coreCfg = read(`${base}/assets/js/core/league-config-v443.js`);
  assert(!coreCfg.includes('listoniManifestFallback'), `${league}: league-config-v443 contiene ancora listoniManifestFallback.`);
  assert(!coreCfg.includes('calciomercatoLinksFallback'), `${league}: league-config-v443 contiene ancora calciomercatoLinksFallback.`);
  assert(coreCfg.includes("currentVersion: '543'"), `${league}: league-config-v443 non allineato a currentVersion 543.`);

  const index = read(`${base}/index.html`);
  assert(index.includes('V543'), `${league}: footer/index non allineato a V543.`);
  assert(index.includes('assets/app.js?v=543'), `${league}: index non carica app.js?v=543.`);
}

for (const rel of [
  'docs/OVERLAY_ROADMAP.md',
  'docs/CENTRALIZATION_STATUS_V521.md',
  'docs/SHARED_ASSETS_FALLBACK_CLEANUP_V543.md',
  'docs/AI_ASSISTANT_HANDOFF_V543.md',
  'docs/AI_ASSISTANT_HANDOFF_CURRENT.md'
]) assert(exists(rel), `Doc mancante: ${rel}`);

if (errors.length) {
  console.error('Audit V543 fallito:');
  for (const err of errors) console.error(`- ${err}`);
  if (notes.length) console.error(notes.join('\n'));
  process.exit(1);
}
console.log('Audit V543 superato: fallback locali Listoni/Calciomercato rimossi dal workflow, asset centrali preservati e runtime whole-site a ?v=543.');
console.log(notes.join('\n'));
