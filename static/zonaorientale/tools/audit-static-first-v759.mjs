import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const json = (relative) => JSON.parse(read(relative));
const failures = [];
const checks = [];

function check(condition, message, details = '') {
  checks.push({ ok: Boolean(condition), message, details });
  if (!condition) failures.push(details ? `${message}: ${details}` : message);
}

const index = read('static/zonaorientale/index.html');
const app = read('static/zonaorientale/assets/app.js');
const repository = read('static/zonaorientale/assets/js/data/repository-v222.js');
const leagueConfigJs = read('static/zonaorientale/assets/js/core/league-config-v443.js');
const leagueConfig = json('static/zonaorientale/assets/league-config.json');
const netlify = read('netlify.toml');

check(index.includes('./assets/app.js?v=759'), 'index carica app V759');
check(index.includes('league-config-v443.js?v=759'), 'index carica la configurazione canonica V759');
check(!index.includes('xlsx.full.min.js'), 'SheetJS non blocca il percorso pubblico');
check(!/from\s+["']\.\/firebase\.js["']/.test(app), 'Firebase non e importato staticamente da app.js');
check(app.includes('import("./firebase.js")'), 'Firebase resta disponibile tramite import dinamico');
check(!/^\s*import[^\n]*firestore-service/m.test(repository), 'repository non importa Firestore nel grafo iniziale');
check(repository.includes('await import("./firestore-service.js")'), 'repository carica Firestore solo su richiesta');
check(app.includes('createStaticFirstBootstrapV759'), 'app usa il coordinatore static-first del FantaEngine');
check(!app.includes('zonaOrientaleStaticDataEmergencyV758'), 'override emergenziale dati V758 rimosso');
check(!app.includes('zonaOrientaleMobileBootHardfixV756'), 'watchdog boot V756 rimosso');
check(!app.includes('zonaOrientaleNoBootLoaderV757'), 'watchdog boot V757 rimosso');
check(app.includes('DEPLOY_EXPECTED_VERSION_V181 = "759"'), 'diagnostica deploy allineata a V759');
check(leagueConfig.currentVersion === '759', 'league-config JSON allineato a V759');
check(leagueConfigJs.includes("currentVersion: '759'"), 'fallback league-config allineato a V759');
check(leagueConfigJs.includes("league-config.json?v=759"), 'config JSON usa cache-buster V759');

const configRefs = [];
for (const relative of [
  'static/zonaorientale/index.html',
  'static/zonaorientale/competition.html',
  'static/zonaorientale/player.html',
  'static/zonaorientale/assets/app.js',
  'static/zonaorientale/assets/js/core/ui.js',
  'static/zonaorientale/assets/js/data/static-files-service.js',
  'static/zonaorientale/assets/js/sections/bilanci-snapshot-section-v435.js'
]) {
  const source = read(relative);
  for (const match of source.matchAll(/league-config-v443\.js\?v=(\d+)/g)) {
    configRefs.push({ relative, version: match[1] });
  }
}
check(configRefs.length > 0 && configRefs.every((entry) => entry.version === '759'), 'unica istanza URL del modulo league-config', JSON.stringify(configRefs.filter((entry) => entry.version !== '759')));

const publicConfig = json('static/zonaorientale/assets/public/config.json');
const seasonManifest = json('static/zonaorientale/assets/snapshots/seasons/manifest.json');
const currentSeason = String(publicConfig.currentSeasonId || '');
const currentEntry = (seasonManifest.snapshots || []).find((entry) => String(entry.seasonId) === currentSeason);
check(Boolean(currentSeason), 'config pubblica dichiara la stagione corrente');
check(Boolean(currentEntry?.file), 'manifest contiene lo snapshot della stagione corrente');

if (currentEntry?.file) {
  const snapshotPath = `static/zonaorientale/assets/snapshots/seasons/${currentEntry.file}`;
  const snapshot = json(snapshotPath);
  check(snapshot.seasonId === currentSeason, 'snapshot corrente coerente con la config');
  check(Array.isArray(snapshot.seasonTeams) && snapshot.seasonTeams.length > 0, 'snapshot contiene le squadre stagionali');
  check(Array.isArray(snapshot.rosterEntries) && snapshot.rosterEntries.length > 0, 'snapshot contiene le rose');
  check(Array.isArray(snapshot.competitions) && snapshot.competitions.length > 0, 'snapshot contiene le competizioni');
  check(Array.isArray(snapshot.fmMovements), 'snapshot contiene i movimenti FM');
}
const honor = json('static/zonaorientale/assets/snapshots/honor.json');
check(Boolean(honor && typeof honor === 'object'), 'snapshot albo d oro valido');

const iosudoManifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
const runtimeRelative = `static/fanta-engine/data/sudatori/current/${iosudoManifest.dataFile}`;
const runtime = json(runtimeRelative);
const runtimeKeys = [
  'meta', 'teams', 'playersByTeam', 'formationsByTeam',
  'marketSummaryByTeam', 'injuriesByTeam', 'friendliesByTeam',
  'friendlyPlayerStatsByMatch'
];
check(iosudoManifest.runtimePayloadVersion === 'V759', 'manifest ioSudo dichiara payload runtime V759');
check(runtimeKeys.every((key) => Object.hasOwn(runtime, key)), 'payload ioSudo contiene tutte le chiavi runtime');
const runtimeBytes = fs.statSync(path.join(root, runtimeRelative)).size;
const archiveBytes = fs.statSync(path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json')).size;
check(runtimeBytes < archiveBytes * 0.4, 'payload ioSudo ridotto di almeno il 60%', `${runtimeBytes}/${archiveBytes}`);

for (const route of [
  '/zonaorientale/assets/public/*',
  '/zonaorientale/assets/snapshots/*',
  '/fanta-engine/data/sudatori/current/*',
  '/fanta-engine/data/shared-assets/current/*'
]) {
  check(netlify.includes(`for = "${route}"`), `header cache presente per ${route}`);
}
check((netlify.match(/max-age=0, must-revalidate/g) || []).length >= 4, 'dataset mutabili configurati per revalidation');

const coordinatorUrl = pathToFileURL(path.join(root, 'static/fanta-engine/js/core/static-first-bootstrap-v759.js')).href;
const { createStaticFirstBootstrapV759 } = await import(coordinatorUrl);
const order = [];
const bootstrap = createStaticFirstBootstrapV759({
  loadPublicData: async () => {
    order.push('public-start');
    await Promise.resolve();
    order.push('public-ready');
    return { ok: true };
  },
  hasUsableData: () => true,
  startAuth: async () => {
    order.push('auth-start');
    throw new Error('auth-offline-test');
  },
  logger: { warn() {}, error() {}, info() {} }
});
const publicResult = await bootstrap.start();
await Promise.resolve();
await Promise.resolve();
check(publicResult?.ok === true, 'bootstrap restituisce il risultato pubblico');
check(order.indexOf('public-ready') !== -1 && order.indexOf('auth-start') > order.indexOf('public-ready'), 'auth parte solo dopo i dati pubblici', order.join(' > '));
check(bootstrap.diagnostics().publicError === '', 'assenza errore pubblico nel test coordinatore');

for (const item of checks) {
  console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.message}${item.details && !item.ok ? ` (${item.details})` : ''}`);
}
if (failures.length) {
  console.error(`\n[audit-static-first-v759] FAIL: ${failures.length} controllo/i`);
  process.exit(1);
}
console.log(`\n[audit-static-first-v759] OK - ${checks.length} controlli superati.`);
console.log(JSON.stringify({
  currentSeason,
  runtimeBytes,
  archiveBytes,
  reductionPercent: Number((100 - runtimeBytes / archiveBytes * 100).toFixed(1)),
  order
}, null, 2));
