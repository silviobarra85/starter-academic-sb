import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const requestedRoot = path.resolve(process.argv[2] || process.cwd());
const sourcePrefix = fs.existsSync(path.join(requestedRoot, 'static', 'zonaorientale')) ? 'static' : '';
const at = (...parts) => path.join(requestedRoot, sourcePrefix, ...parts);
const rel = (...parts) => path.join(sourcePrefix, ...parts).replaceAll('\\', '/');
const failures = [];
const checks = [];

function check(condition, message, details = '') {
  checks.push({ ok: Boolean(condition), message, details });
  if (!condition) failures.push(details ? `${message}: ${details}` : message);
}
function read(...parts) { return fs.readFileSync(at(...parts), 'utf8'); }
function json(...parts) { return JSON.parse(read(...parts)); }
function exists(...parts) { return fs.existsSync(at(...parts)); }

const index = read('zonaorientale', 'index.html');
const app = read('zonaorientale', 'assets', 'app.js');
const leagueConfigJs = read('zonaorientale', 'assets', 'js', 'core', 'league-config-v443.js');
const leagueConfig = json('zonaorientale', 'assets', 'league-config.json');
const release = json('zonaorientale', 'release.json');

check(index.includes("import(entryUrlV760)"), 'entrypoint intercetta gli errori del grafo moduli');
check(index.includes("./assets/app.js?v=761"), 'index richiede app.js con cache-bust release V761');
check(release.version === '761', 'release manifest allineato a V761');
check(release.entrypoint === 'assets/app.js?v=761', 'release manifest punta all entrypoint V761');
check(index.includes('Fantacalcio - V761 - Aggiornato al 22/07/2026'), 'footer home allineato a V761');
check(!/<script[^>]+src="\.\/assets\/app\.js\?v=761"/i.test(index), 'app non e caricata con uno script modulo non osservabile');
check(!app.includes('from "../../fanta-engine/js/core/static-first-bootstrap-v760.js'), 'bootstrap pubblico senza dipendenza statica cross-root');
check(app.includes('function createStaticFirstBootstrapV760'), 'facade bootstrap locale V760 presente');
check(app.includes('loadPublicDataForSelectedSeasonV760'), 'loader pubblico V760 presente');
check(app.includes('const publicConfig = await loadStaticPublicConfigV171()') && !app.includes('const publicConfig = await zonaDataRepositoryV222.loadPublicConfig('), 'bootstrap usa config statica senza fallback Firebase');
check(app.includes('loadStaticPublicSeasonSnapshotV172(seasonId)') && app.includes('loadStaticHonorSnapshotV173()'), 'bootstrap usa snapshot statici senza fallback Firebase');
check(app.includes('fanta:public-core-ready-v760'), 'evento primo render pubblico presente');
check(app.includes('fanta:static-assets-ready-v760'), 'evento asset complementari presente');
check(app.indexOf('if (render) renderAll();') < app.indexOf('zonaDataRepositoryV222.loadStaticAssets()', app.indexOf('loadPublicDataForSelectedSeasonV760')), 'primo render precede gli asset complementari');
check(app.includes('DEPLOY_EXPECTED_VERSION_V181 = "761"'), 'diagnostica deploy attende V761');
check(leagueConfig.currentVersion === '761', 'league-config JSON allineato a V761');
check(String(leagueConfig.lastOverlay || '').startsWith('V761'), 'league-config registra overlay V761');
check(leagueConfigJs.includes("currentVersion: '761'"), 'fallback league-config allineato a V761');
check(leagueConfigJs.includes('league-config.json?v=761'), 'config JSON usa cache-buster V761');
check(exists('fanta-engine', 'js', 'core', 'static-first-bootstrap-v760.js'), 'contratto canonico FantaEngine V760 pubblicato');

const essentialFiles = [
  ['zonaorientale', 'assets', 'public', 'config.json'],
  ['zonaorientale', 'assets', 'snapshots', 'seasons', 'manifest.json'],
  ['zonaorientale', 'assets', 'snapshots', 'honor.json'],
  ['zonaorientale', 'assets', 'app.js'],
  ['zonaorientale', 'assets', 'js', 'core', 'league-config-v443.js']
];
for (const parts of essentialFiles) check(exists(...parts), `file essenziale presente: ${parts.join('/')}`);
for (const item of release.essential || []) {
  const resolved = path.resolve(at('zonaorientale'), item);
  check(fs.existsSync(resolved), `release manifest file presente: ${item}`);
}

const publicConfig = json('zonaorientale', 'assets', 'public', 'config.json');
const seasonManifest = json('zonaorientale', 'assets', 'snapshots', 'seasons', 'manifest.json');
const currentSeason = String(publicConfig.currentSeasonId || leagueConfig.currentSeasonId || '').trim();
const currentEntry = (seasonManifest.snapshots || []).find((entry) => String(entry.seasonId) === currentSeason);
check(Boolean(currentSeason), 'stagione corrente definita');
check(Boolean(currentEntry?.file), 'manifest contiene lo snapshot corrente');
if (currentEntry?.file) {
  const snapshot = json('zonaorientale', 'assets', 'snapshots', 'seasons', currentEntry.file);
  check(snapshot.seasonId === currentSeason, 'snapshot corrente coerente');
  check(Array.isArray(snapshot.seasonTeams) && snapshot.seasonTeams.length > 0, 'snapshot contiene squadre stagionali');
  check(Array.isArray(snapshot.rosterEntries) && snapshot.rosterEntries.length > 0, 'snapshot contiene rose');
  check(Array.isArray(snapshot.competitions), 'snapshot contiene competizioni');
}

// Tutti gli import statici relativi di app.js devono risolversi nel deploy.
const appPath = at('zonaorientale', 'assets', 'app.js');
const importPattern = /^\s*import(?:[\s\S]*?from\s*)?["']([^"']+)["'];?/gm;
const missingImports = [];
for (const match of app.matchAll(importPattern)) {
  const specifier = match[1];
  if (!specifier.startsWith('.')) continue;
  const clean = specifier.split('?')[0].split('#')[0];
  const resolved = path.resolve(path.dirname(appPath), clean);
  if (!fs.existsSync(resolved)) missingImports.push(specifier);
}
check(missingImports.length === 0, 'tutti gli import statici di app.js esistono', missingImports.join(', '));

const engineUrl = pathToFileURL(at('fanta-engine', 'js', 'core', 'static-first-bootstrap-v760.js')).href;
const engine = await import(engineUrl);
const order = [];
const bootstrap = engine.createStaticFirstBootstrapV760({
  loadPublicData: async () => {
    order.push('public');
    return { ok: true, staticAssetsPending: true };
  },
  hasUsableData: () => true,
  startAuth: async () => { order.push('auth'); throw new Error('auth-offline-test'); },
  logger: { warn() {}, error() {}, info() {} }
});
await bootstrap.start();
await Promise.resolve();
await Promise.resolve();
check(order.join('>') === 'public>auth', 'Firebase parte dopo il nucleo pubblico', order.join('>'));
check(bootstrap.diagnostics().publicError === '', 'contratto FantaEngine senza errore pubblico');
check(bootstrap.diagnostics().staticAssetsPhase === 'background', 'diagnostica distingue asset complementari');

for (const item of checks) console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.message}${item.details && !item.ok ? ` (${item.details})` : ''}`);
if (failures.length) {
  console.error(`\n[audit-static-first-v760] FAIL: ${failures.length} controllo/i`);
  process.exit(1);
}
console.log(`\n[audit-static-first-v760] OK - ${checks.length} controlli superati su ${rel('') || '.'}.`);
