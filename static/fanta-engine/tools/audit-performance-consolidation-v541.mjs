#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const VERSION = '541';
const leagues = [
  { slug: 'zonaorientale', label: 'ZonaOrientale', season: '2025-2026' },
  { slug: 'fantapetillomantramanager', label: 'FantaPetilloMantraManager', season: '2026-2027' }
];

function fail(message) {
  console.error(`ERRORE V541: ${message}`);
  process.exit(1);
}
function assert(condition, message) {
  if (!condition) fail(message);
  console.log(`OK - ${message}`);
}
function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) fail(`file mancante: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}
function sizeOf(rel) {
  const target = path.join(root, rel);
  if (!fs.existsSync(target)) return 0;
  const stat = fs.statSync(target);
  if (stat.isFile()) return stat.size;
  let total = 0;
  for (const entry of fs.readdirSync(target)) {
    total += sizeOf(path.join(rel, entry));
  }
  return total;
}
function human(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

assert(exists('docs/PERFORMANCE_CONSOLIDATION_V541.md'), 'documento V541 presente');
assert(exists('docs/AI_ASSISTANT_HANDOFF_V541.md'), 'handoff V541 presente');
assert(exists('docs/AI_ASSISTANT_HANDOFF_CURRENT.md'), 'handoff CURRENT presente');
assert(exists('docs/OVERLAY_ROADMAP.md'), 'roadmap presente');
assert(exists('docs/CENTRALIZATION_STATUS_V521.md'), 'centralization status presente');
assert(exists('static/fanta-engine/css/rules-table-isolation-v540.css'), 'CSS isolamento Regolamento V540 preservato');
assert(exists('static/fanta-engine/data/shared-assets/current/assets/listoni'), 'asset comuni Listoni current presenti');
assert(exists('static/fanta-engine/data/shared-assets/current/assets/calciomercato'), 'asset comuni Calciomercato current presenti');

const report = [];
for (const league of leagues) {
  const base = `static/${league.slug}`;
  const configText = read(`${base}/assets/league-config.json`);
  const config = JSON.parse(configText);
  assert(config.currentVersion === VERSION, `${league.label}: currentVersion V${VERSION}`);
  assert(config.currentSeasonId === league.season, `${league.label}: currentSeasonId ${league.season}`);
  assert(config.features?.performanceConsolidationVersion === 'V541', `${league.label}: feature performanceConsolidation V541`);
  assert(config.performanceConsolidationV541?.runtimeBehaviorChanges === false, `${league.label}: V541 non cambia comportamento runtime`);

  const app = read(`${base}/assets/app.js`);
  assert(app.includes('?v=541'), `${league.label}: app.js importa moduli con cache-buster V541`);
  assert(app.includes('DEPLOY_EXPECTED_VERSION_V181 = "541"') || app.includes("DEPLOY_EXPECTED_VERSION_V181 = '541'"), `${league.label}: DEPLOY_EXPECTED_VERSION allineato a V541`);
  assert(app.includes('installNavigationPerformanceGuardV536'), `${league.label}: performance guard V536 preservata`);

  const cfgJs = read(`${base}/assets/js/core/league-config-v443.js`);
  assert(cfgJs.includes("currentVersion: '541'") || cfgJs.includes('currentVersion: "541"'), `${league.label}: fallback league-config JS a V541`);

  const pages = ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'news.html'];
  for (const page of pages) {
    if (!exists(`${base}/${page}`)) continue;
    const html = read(`${base}/${page}`);
    assert(!html.includes('?v=540') && !html.includes('?v=539') && !html.includes('?v=512'), `${league.label}/${page}: nessun cache-buster vecchio V540/V539/V512`);
    if (page === 'index.html') {
      assert(html.includes('./assets/app.js?v=541'), `${league.label}/${page}: app.js V541`);
      assert(html.includes('rules-table-isolation-v540.css?v=541'), `${league.label}/${page}: CSS isolamento Regolamento preservato con cache-buster V541`);
    }
  }

  report.push({
    league: league.slug,
    snapshots: human(sizeOf(`${base}/assets/snapshots`)),
    rosters: human(sizeOf(`${base}/assets/rose`)),
    competitions: human(sizeOf(`${base}/assets/competitions`)),
    listoniFallback: human(sizeOf(`${base}/assets/listoni`)),
    calciomercatoFallback: human(sizeOf(`${base}/assets/calciomercato`))
  });
}

const shared = {
  listoni: human(sizeOf('static/fanta-engine/data/shared-assets/current/assets/listoni')),
  calciomercato: human(sizeOf('static/fanta-engine/data/shared-assets/current/assets/calciomercato'))
};
console.log('\nInventario peso dati V541:');
for (const row of report) {
  console.log(`- ${row.league}: snapshots ${row.snapshots}; rose ${row.rosters}; competitions ${row.competitions}; fallback listoni ${row.listoniFallback}; fallback calciomercato ${row.calciomercatoFallback}`);
}
console.log(`- shared-assets/current: listoni ${shared.listoni}; calciomercato ${shared.calciomercato}`);

assert(read('docs/OVERLAY_ROADMAP.md').includes('Aggiornamento V541'), 'roadmap aggiornata con V541');
assert(read('docs/CENTRALIZATION_STATUS_V521.md').includes('Aggiornamento V541'), 'centralization status aggiornata con V541');

console.log('\nAudit V541 superato: consolidamento prestazionale/documentale, runtime whole-site a ?v=541, nessuna nuova funzione runtime.');
