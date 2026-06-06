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

const manifest = readJson('assets/soccer-data/manifest.json');
const mapping = readJson('assets/soccer-data/fbref-player-map.v383.json');
const app = read('assets/app.js');
const html = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const soccerSectionMatch = html.match(/<section class="app-page" data-page="soccerdata"[\s\S]*?<\/section>\s*<\/section>/);
const soccerSection = soccerSectionMatch ? soccerSectionMatch[0] : '';
const expectedVersion = (app.match(/const DEPLOY_EXPECTED_VERSION_V181 = \"(\d+)\";/) || [])[1] || '';
const expectedAtLeastV384 = Number(expectedVersion) >= 384;

manifest.currentMapping === 'fbref-player-map.v383.json' ? pass('manifest mantiene mapping V383') : fail('manifest non mantiene fbref-player-map.v383.json');
manifest.meta?.firebaseWrites === false ? pass('manifest conferma no Firebase writes') : fail('manifest non conferma no Firebase writes');
manifest.meta?.liveScraping === false ? pass('manifest conferma no live scraping') : fail('manifest non conferma no live scraping');

Array.isArray(mapping.players) && mapping.players.length === 532 ? pass('mapping V383 invariato: 532 giocatori IN_LISTONE') : fail(`mapping contiene ${mapping.players?.length || 0} giocatori, attesi 532`);
const confirmed = mapping.players.filter((p) => p.matchStatus === 'confirmed');
confirmed.length === 531 ? pass('mapping V383 invariato: 531 confermati') : fail(`confermati: ${confirmed.length}, attesi 531`);
const needsReview = mapping.players.filter((p) => p.matchStatus === 'needs-review');
needsReview.length === 1 && needsReview[0]?.playerKey === 'fc-7262' ? pass('mapping V383 invariato: un needs-review Balentien') : fail(`needs-review non attesi: ${needsReview.map((p) => p.playerKey).join(', ')}`);

soccerSection ? pass('sezione Soccer Data trovata in index') : fail('sezione Soccer Data non trovata in index');
soccerSection.includes('<th>FBref / Giocatore</th>') ? pass('prima colonna Soccer Data aggiornata a FBref / Giocatore') : fail('header FBref / Giocatore mancante');
soccerSection.includes('<th>Stato mapping</th>') ? pass('colonna Stato mapping presente') : fail('colonna Stato mapping mancante');
!soccerSection.includes('<th>Azione</th>') ? pass('header Azione rimosso dalla tabella Soccer Data') : fail('header Azione ancora presente in Soccer Data');
!soccerSection.includes('<th>FBref</th>') ? pass('vecchia colonna FBref separata rimossa') : fail('vecchia colonna FBref separata ancora presente');
soccerSection.includes('colspan="7"') ? pass('colspan Soccer Data allineato a 7 colonne') : fail('colspan Soccer Data non allineato a 7 colonne');
(html.includes('V384 Soccer Data table cleanup') || html.includes('V385 Soccer Data associazione FBref') || html.includes('V386 Soccer Data solo admin')) ? pass('footer runtime V384+ presente') : fail('footer runtime V384+ assente');

[
  'function isSoccerDataReviewRowV384',
  'function renderSoccerDataReviewActionsV384',
  'function renderSoccerDataMappingStatusCellV384',
  'data-label="FBref / Giocatore"',
  'data-label="Stato mapping"',
  'window.ZonaOrientaleSoccerDataTableCleanupV384',
  'window.ZonaOrientaleSoccerDataFbrefBatchV383',
  'window.ZonaOrientaleSoccerDataMappingAssistantV372',
  'window.ZonaOrientaleSoccerDataV371',
  'fbref-player-map.v383.json',
  'firebaseWrites: false',
  'liveScraping: false'
].forEach((token) => app.includes(token) ? pass(`app token presente: ${token}`) : fail(`app token mancante: ${token}`));
expectedAtLeastV384 ? pass(`DEPLOY_EXPECTED_VERSION_V181 >= V384 (${expectedVersion})`) : fail(`DEPLOY_EXPECTED_VERSION_V181 non >= V384 (${expectedVersion || 'assente'})`);

!app.includes('data-label="Azione"><a class="button button-secondary button-small" href="${escapeHtml(searchUrl)}"') ? pass('azioni non sono piu una colonna dedicata') : fail('vecchia cella Azione ancora presente nel render Soccer Data');
app.includes('isSoccerDataReviewRowV384(row)') && app.includes('data-soccer-data-copy-row-v372') ? pass('azioni inline conservate per review/non mappati') : fail('azioni inline review/non mappati non rilevate');
app.includes('Listone: ${escapeHtml(player.playerName || \'-\')}') ? pass('nome listone conservato come dettaglio secondario') : fail('nome listone non conservato come dettaglio');

const appOldVersions = app.match(/\?v=382/g) || [];
appOldVersions.length === 0 ? pass('app.js: nessun cache-buster V382 residuo') : fail(`app.js: ${appOldVersions.length} cache-buster V382 residui`);
(app.includes('?v=384') || app.includes('?v=385') || app.includes('?v=386')) ? pass('app.js: cache-buster V384+ presente') : fail('app.js: cache-buster V384+ assente');

for (const [name, content] of [['index', html], ['competition', competition], ['player', player]]) {
  const oldVersions = content.match(/\?v=382/g) || [];
  oldVersions.length === 0 ? pass(`${name}: nessun cache-buster V382 residuo`) : fail(`${name}: ${oldVersions.length} cache-buster V382 residui`);
  (content.includes('?v=384') || content.includes('?v=385') || content.includes('?v=386')) ? pass(`${name}: cache-buster V384+ presente`) : fail(`${name}: cache-buster V384+ assente`);
}

if (failures) process.exit(1);
