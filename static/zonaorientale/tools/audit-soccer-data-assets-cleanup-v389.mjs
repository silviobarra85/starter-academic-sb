#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const docsRoot = path.resolve(root, '../docs/zonaorientale');
const quiet = process.argv.includes('--quiet');
let failures = 0;
function log(kind, msg){ if(!quiet || kind === 'FAIL') console.log(`${kind}: ${msg}`); }
function pass(msg){ log('OK', msg); }
function fail(msg){ failures += 1; log('FAIL', msg); }
function readJson(rel){ return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }
function exists(rel){ return fs.existsSync(path.join(root, rel)); }

const manifest = readJson('assets/soccer-data/manifest.json');
const mapping = readJson('assets/soccer-data/fbref-player-map.v383.json');
const statsManifest = readJson('assets/soccer-data/stats/manifest.json');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const competition = fs.readFileSync(path.join(root, 'competition.html'), 'utf8');
const player = fs.readFileSync(path.join(root, 'player.html'), 'utf8');

const assetFiles = fs.readdirSync(path.join(root, 'assets/soccer-data'), { withFileTypes: true })
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .sort();
const expectedAssetFiles = ['fbref-player-map.v383.json', 'manifest.json'];
JSON.stringify(assetFiles) === JSON.stringify(expectedAssetFiles)
  ? pass('assets/soccer-data contiene solo manifest e mapping runtime')
  : fail(`assets/soccer-data contiene file inattesi: ${assetFiles.join(', ')}`);

exists('assets/soccer-data/stats/manifest.json') ? pass('stats manifest V389 presente') : fail('stats manifest V389 mancante');
manifest.currentMapping === 'fbref-player-map.v383.json' ? pass('manifest continua a puntare al mapping V383') : fail('manifest non punta a fbref-player-map.v383.json');
manifest.meta?.version === 'V383' ? pass('versione mapping manifest preservata a V383') : fail('manifest mapping version non preservata a V383');
manifest.meta?.assetLayoutVersion === 'V389' ? pass('manifest dichiara asset layout V389') : fail('manifest non dichiara asset layout V389');
manifest.publicAssets?.version === 'V389' ? pass('manifest contiene publicAssets V389') : fail('manifest non contiene publicAssets V389');
manifest.stats?.manifest === 'stats/manifest.json' ? pass('manifest collega stats/manifest.json') : fail('manifest non collega stats/manifest.json');
statsManifest.meta?.version === 'V389' ? pass('stats manifest versione V389') : fail('stats manifest non e V389');
statsManifest.currentSummary === null && statsManifest.currentDetail === null ? pass('nessun dataset statistico reale pubblicato in V389') : fail('stats manifest contiene dataset inattesi');
statsManifest.meta?.liveScraping === false && statsManifest.meta?.firebaseWrites === false ? pass('stats manifest no scraping/no Firebase writes') : fail('stats manifest non conserva i vincoli read-only');

Array.isArray(mapping.players) && mapping.players.length === 532 ? pass('mapping V383 contiene 532 giocatori') : fail(`mapping V383 contiene ${mapping.players?.length || 0} giocatori`);
const confirmed = mapping.players.filter((p) => p.matchStatus === 'confirmed');
const needsReview = mapping.players.filter((p) => p.matchStatus === 'needs-review');
confirmed.length === 531 ? pass('mapping confermati preservati: 531') : fail(`mapping confermati: ${confirmed.length}, attesi 531`);
needsReview.length === 1 ? pass('un solo residuo needs-review preservato') : fail(`needs-review: ${needsReview.length}, atteso 1`);

const archiveDir = path.join(docsRoot, 'archive/soccer-data/mapping-history');
const archivedFiles = fs.existsSync(archiveDir) ? fs.readdirSync(archiveDir).filter((name) => /fbref-(player-map|review-batch)\.v\d+\.(json|csv)$/.test(name)) : [];
archivedFiles.length >= 37 ? pass(`storico archiviato nei docs: ${archivedFiles.length} file`) : fail(`storico archiviato insufficiente: ${archivedFiles.length} file`);
['fbref-player-map.v371.json','fbref-player-map.v382.json','fbref-player-map.v383.csv','fbref-review-batch.v383.csv'].forEach((name) => {
  archivedFiles.includes(name) ? pass(`archivio contiene ${name}`) : fail(`archivio non contiene ${name}`);
});

const forbiddenAssets = ['fbref-player-map.v382.json','fbref-player-map.v383.csv','fbref-review-batch.v383.csv'];
for (const name of forbiddenAssets) {
  !exists(`assets/soccer-data/${name}`) ? pass(`asset pubblico rimosso: ${name}`) : fail(`asset pubblico ancora presente: ${name}`);
}
['SOCCER_DATA_STATS_MANIFEST_URL_V389','window.ZonaOrientaleSoccerDataAssetsCleanupV389','Stats import','firebaseWrites: false','liveScraping: false'].forEach((token) => {
  app.includes(token) ? pass(`app token presente: ${token}`) : fail(`app token mancante: ${token}`);
});
for (const [name, content] of [['index', html], ['competition', competition], ['player', player]]) {
  content.includes('V389 Soccer Data assets cleanup') ? pass(`${name}: footer aggiornato a V389`) : fail(`${name}: footer non aggiornato a V389`);
  const versions = Array.from(new Set((content.match(/\?v=\d+/g) || []).map((item) => item.replace('?v=', ''))));
  versions.length === 1 && versions[0] === '389' ? pass(`${name}: cache-buster aggiornati a 389`) : fail(`${name}: cache-buster non aggiornati a 389 (${versions.join(', ') || 'nessuno'})`);
}
const appVersions = Array.from(new Set((app.match(/\?v=\d+/g) || []).map((item) => item.replace('?v=', ''))));
appVersions.length === 1 && appVersions[0] === '389' ? pass('app.js: cache-buster import aggiornati a 389') : fail(`app.js: cache-buster import non aggiornati a 389 (${appVersions.join(', ') || 'nessuno'})`);
['window.ZonaOrientaleSoccerDataAdminGateV386','window.ZonaOrientaleSoccerDataMobileCleanupV387','window.ZonaOrientaleAdminSnapshotDatesV388','window.ZonaOrientaleSoccerDataAssociationPatchV385'].forEach((token) => {
  app.includes(token) ? pass(`funzionalita precedente preservata: ${token}`) : fail(`funzionalita precedente mancante: ${token}`);
});

if (failures) process.exit(1);
