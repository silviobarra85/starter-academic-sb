#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const repoRoot = process.cwd();
const staticRoot = path.join(repoRoot, 'static');
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
let ok = 0;
let fail = 0;
const failures = [];
function check(condition, label) {
  if (condition) { ok += 1; console.log(`OK  - ${label}`); }
  else { fail += 1; failures.push(label); console.error(`FAIL - ${label}`); }
}
function read(file) { return fs.readFileSync(file, 'utf8'); }
function json(file) { return JSON.parse(read(file)); }

const wizard = path.join(staticRoot, 'fanta-engine/tools/create-league-wizard-v524.mjs');
const manifest = path.join(staticRoot, 'fanta-engine/data/league-configurator-v524.json');
const templateCfg = path.join(staticRoot, '_league-template/assets/league-config.json');
const publicAutoload = path.join(staticRoot, 'fanta-engine/js/core/public-data-autoload-v512.js');
check(fs.existsSync(wizard), 'wizard V524 presente');
check(fs.existsSync(manifest), 'manifest configuratore V524 presente');
check(fs.existsSync(templateCfg), 'template league-config presente');
check(read(publicAutoload).includes('installPublicDataAutoloadV524'), 'export/autoload V524 presente');
const dry = spawnSync(process.execPath, [wizard, '--slug', 'lega-test-v524', '--name', 'Lega Test V524', '--dry-run'], { cwd: repoRoot, encoding: 'utf8' });
check(dry.status === 0 && dry.stdout.includes('sharedAssetsDefaults') && dry.stdout.includes('static/lega-test-v524/'), 'wizard dry-run non scrive e produce piano condiviso');
check(!fs.existsSync(path.join(staticRoot, 'lega-test-v524')), 'dry-run non crea static/lega-test-v524');
const tpl = json(templateCfg);
check(tpl.features?.leagueConfiguratorVersion === 'V524', 'template traccia leagueConfigurator V524');
check(tpl.dataPaths?.listoniManifest === '../fanta-engine/data/shared-assets/current/assets/listoni/manifest.json', 'template Listoni punta a shared-assets/current');
check(tpl.dataPaths?.calciomercatoArchiveBase === '../fanta-engine/data/shared-assets/current/assets/calciomercato/archive/', 'template Calciomercato punta a shared-assets/current');
check(tpl.dataPaths?.listoniManifestFallback === './assets/listoni/manifest.json', 'template mantiene fallback Listoni locale');
check(tpl.dataPaths?.calciomercatoLinksFallback === './assets/calciomercato/links.json', 'template mantiene fallback Calciomercato locale');
for (const league of leagues) {
  const root = path.join(staticRoot, league);
  const cfg = json(path.join(root, 'assets/league-config.json'));
  check(cfg.currentVersion === 524, `${league}: currentVersion 524`);
  check(cfg.features?.leagueConfiguratorVersion === 'V524', `${league}: feature leagueConfigurator V524 tracciata`);
  check(cfg.dataPaths?.listoniManifest?.includes('../fanta-engine/data/shared-assets/current/'), `${league}: Listoni ancora su shared-assets/current`);
  check(cfg.dataPaths?.calciomercatoArchiveBase?.includes('../fanta-engine/data/shared-assets/current/'), `${league}: Calciomercato ancora su shared-assets/current`);
  check(read(path.join(root, 'index.html')).includes('V524'), `${league}: footer/runtime V524 in index`);
  check(read(path.join(root, 'assets/app.js')).includes('installPublicDataAutoloadV524'), `${league}: app importa autoload V524`);
}
check(fs.existsSync(path.join(repoRoot, 'docs/LEAGUE_CONFIGURATOR_V524.md')), 'doc LEAGUE_CONFIGURATOR_V524 presente');
check(read(path.join(repoRoot, 'docs/OVERLAY_ROADMAP.md')).includes('V525 - Adapter dati multi-season'), 'roadmap aggiornata al prossimo V525');
if (fail > 0) {
  console.error(`\nAudit V524 fallito: ${ok} OK, ${fail} FAIL`);
  failures.forEach((item) => console.error(` - ${item}`));
  process.exit(1);
}
console.log(`\nAudit V524 superato: configuratore guidato pronto, asset comuni default e baseline runtime a ?v=524.`);
