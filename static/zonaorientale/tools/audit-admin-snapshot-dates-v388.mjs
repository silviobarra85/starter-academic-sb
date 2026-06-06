#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const quiet = process.argv.includes('--quiet');
let failures = 0;
function log(kind, msg){ if(!quiet || kind === 'FAIL') console.log(`${kind}: ${msg}`); }
function pass(msg){ log('OK', msg); }
function fail(msg){ failures += 1; log('FAIL', msg); }
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function readJson(rel){ return JSON.parse(read(rel)); }

const app = read('assets/app.js');
const html = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const publicSnapshots = read('assets/js/admin/public-snapshots.js');
const manifest = readJson('assets/soccer-data/manifest.json');
const mapping = readJson('assets/soccer-data/fbref-player-map.v383.json');
const docsIndexPath = path.join(root, '../docs/zonaorientale/FUNZIONALITA\'.md');
const docsIndex = fs.existsSync(docsIndexPath) ? fs.readFileSync(docsIndexPath, 'utf8') : '';
const v388DocPath = path.join(root, '../docs/zonaorientale/FUNZIONALITAV388.md');

const expectedVersion = (app.match(/const DEPLOY_EXPECTED_VERSION_V181 = "(\d+)";/) || [])[1] || '';
expectedVersion === '388' ? pass('DEPLOY_EXPECTED_VERSION_V181 allineato a V388') : fail(`runtime non V388: ${expectedVersion || 'assente'}`);

for (const [name, content] of [['index', html], ['competition', competition], ['player', player]]) {
  content.includes('V388 Snapshot comunicati admin') ? pass(`${name}: footer V388 presente`) : fail(`${name}: footer V388 assente`);
  const versions = Array.from(new Set((content.match(/\?v=\d+/g) || []).map((item) => item.replace('?v=', ''))));
  versions.length === 1 && versions[0] === '388' ? pass(`${name}: cache-buster V388 allineato`) : fail(`${name}: cache-buster non V388 (${versions.join(', ') || 'nessuno'})`);
}
const appVersions = Array.from(new Set((app.match(/\?v=\d+/g) || []).map((item) => item.replace('?v=', ''))));
appVersions.length === 1 && appVersions[0] === '388' ? pass('app.js: cache-buster V388 allineati') : fail(`app.js: cache-buster non V388 (${appVersions.join(', ') || 'nessuno'})`);

[
  'function refreshAdminPublicSnapshotDatesV388',
  'function rememberGeneratedStaticSeasonSnapshotsV388',
  'window.ZonaOrientaleAdminSnapshotDatesV388',
  'adminGenerateNewsSnapshot',
  'adminGenerateCompetitionDataSnapshot',
  'adminDownloadPublicConfig',
  'adminDownloadSelectedStaticSeasonSnapshot',
  'adminDownloadStaticSeasonSnapshots',
  'adminDownloadStaticHonorSnapshot',
  'refreshAdminPublicSnapshotDatesV388();'
].forEach((token) => app.includes(token) ? pass(`token V388 presente: ${token}`) : fail(`token V388 mancante: ${token}`));

[
  'state.publicConfigV171 = normalizePublicConfigV171(payload) || payload;',
  'rememberGeneratedStaticSeasonSnapshotsV388(manifest, entries);',
  'state.staticHonorSnapshotV173 = normalizeStaticHonorSnapshotV173(payload) || state.staticHonorSnapshotV173;',
  'expandAdminPanel("adminPublicSnapshotsPanel");'
].forEach((token) => app.includes(token) ? pass(`refresh data/UX presente: ${token}`) : fail(`refresh data/UX mancante: ${token}`));

[
  'Per pubblicare un comunicato',
  'Aggiorna comunicati',
  'JSON statici dopo logout/refresh',
  'Il link WhatsApp dinamico legge gia il comunicato da Firebase'
].forEach((token) => publicSnapshots.includes(token) ? pass(`guida comunicati presente: ${token}`) : fail(`guida comunicati mancante: ${token}`));

manifest.currentMapping === 'fbref-player-map.v383.json' ? pass('manifest mantiene mapping V383') : fail('manifest non mantiene mapping V383');
const confirmed = (mapping.players || []).filter((p) => p.matchStatus === 'confirmed');
const needsReview = (mapping.players || []).filter((p) => p.matchStatus === 'needs-review');
confirmed.length === 531 ? pass('mapping V383 invariato: 531 confermati') : fail(`mapping confermati ${confirmed.length}, attesi 531`);
needsReview.length === 1 && needsReview[0]?.playerKey === 'fc-7262' ? pass('mapping V383 invariato: Balentien unico needs-review') : fail(`needs-review non attesi: ${needsReview.map((p) => p.playerKey).join(', ')}`);

[
  'window.ZonaOrientaleSoccerDataMobileCleanupV387',
  'window.ZonaOrientaleSoccerDataAdminGateV386',
  'window.ZonaOrientaleSoccerDataAssociationPatchV385',
  'window.ZonaOrientaleSoccerDataTableCleanupV384',
  'window.ZonaOrientaleSoccerDataFbrefBatchV383'
].forEach((token) => app.includes(token) ? pass(`funzionalita precedente preservata: ${token}`) : fail(`funzionalita precedente mancante: ${token}`));

if (docsIndex) {
  !docsIndex.includes('V388 Snapshot comunicati admin') ? pass("FUNZIONALITA'.md non modificato per V388") : fail("FUNZIONALITA'.md contiene V388, non doveva essere aggiornato");
}
fs.existsSync(v388DocPath) ? pass('documento FUNZIONALITAV388.md presente') : fail('documento FUNZIONALITAV388.md mancante');

if (failures) process.exit(1);
