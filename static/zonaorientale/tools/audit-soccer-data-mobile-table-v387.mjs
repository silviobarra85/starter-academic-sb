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
const manifest = readJson('assets/soccer-data/manifest.json');
const mapping = readJson('assets/soccer-data/fbref-player-map.v383.json');
const docsIndexPath = path.join(root, '../docs/zonaorientale/FUNZIONALITA\'.md');
const docsIndex = fs.existsSync(docsIndexPath) ? fs.readFileSync(docsIndexPath, 'utf8') : '';

const expectedVersion = (app.match(/const DEPLOY_EXPECTED_VERSION_V181 = "(\d+)";/) || [])[1] || '';
expectedVersion === '387' ? pass('DEPLOY_EXPECTED_VERSION_V181 allineato a V387') : fail(`runtime non V387: ${expectedVersion || 'assente'}`);

for (const [name, content] of [['index', html], ['competition', competition], ['player', player]]) {
  content.includes('V387 Soccer Data mobile cleanup') ? pass(`${name}: footer V387 presente`) : fail(`${name}: footer V387 assente`);
  const versions = Array.from(new Set((content.match(/\?v=\d+/g) || []).map((item) => item.replace('?v=', ''))));
  versions.length === 1 && versions[0] === '387' ? pass(`${name}: cache-buster V387 allineato`) : fail(`${name}: cache-buster non V387 (${versions.join(', ') || 'nessuno'})`);
}
const appVersions = Array.from(new Set((app.match(/\?v=\d+/g) || []).map((item) => item.replace('?v=', ''))));
appVersions.length === 1 && appVersions[0] === '387' ? pass('app.js: cache-buster V387 allineati') : fail(`app.js: cache-buster non V387 (${appVersions.join(', ') || 'nessuno'})`);

manifest.currentMapping === 'fbref-player-map.v383.json' ? pass('manifest mantiene mapping V383') : fail('manifest non mantiene mapping V383');
manifest.meta?.firebaseWrites === false ? pass('manifest conferma no Firebase writes') : fail('manifest non conferma no Firebase writes');
manifest.meta?.liveScraping === false ? pass('manifest conferma no live scraping') : fail('manifest non conferma no live scraping');
Array.isArray(mapping.players) && mapping.players.length === 532 ? pass('mapping V383 invariato: 532 giocatori') : fail(`mapping V383 contiene ${mapping.players?.length || 0} giocatori`);
const confirmed = mapping.players.filter((p) => p.matchStatus === 'confirmed');
confirmed.length === 531 ? pass('mapping V383 invariato: 531 confermati') : fail(`confermati ${confirmed.length}, attesi 531`);
const needsReview = mapping.players.filter((p) => p.matchStatus === 'needs-review');
needsReview.length === 1 && needsReview[0]?.playerKey === 'fc-7262' ? pass('mapping V383 invariato: Balentien unico needs-review') : fail(`needs-review non attesi: ${needsReview.map((p) => p.playerKey).join(', ')}`);

const soccerSection = (html.match(/<section class="app-page" data-page="soccerdata"[\s\S]*?<\/section>\s*<\/section>/) || [''])[0];
soccerSection ? pass('sezione Soccer Data trovata') : fail('sezione Soccer Data non trovata');
[
  'soccer-data-col-player-v387',
  'soccer-data-col-role-v387',
  'soccer-data-col-team-v387',
  'soccer-data-col-roster-v387',
  'soccer-data-col-quote-v387',
  'soccer-data-col-fvm-v387',
  'soccer-data-col-status-v387'
].forEach((token) => {
  soccerSection.includes(token) ? pass(`header colonna presente: ${token}`) : fail(`header colonna mancante: ${token}`);
  app.includes(token) ? pass(`render/stile colonna presente: ${token}`) : fail(`render/stile colonna mancante: ${token}`);
});

[
  'window.ZonaOrientaleSoccerDataMobileCleanupV387',
  'reusesListoneMobilePattern: true',
  '.soccer-data-table-wrap-v371{max-height:min(72vh,620px)!important;overflow:auto!important;-webkit-overflow-scrolling:touch;}',
  'table-layout:fixed!important;width:680px!important;min-width:680px!important;font-size:.58rem!important;',
  'th:nth-child(1),.soccer-data-table-wrap-v371 table.soccer-data-table-v371 td:nth-child(1){width:190px!important;min-width:190px!important;max-width:190px!important;white-space:normal!important;',
  'th:nth-child(2),.soccer-data-table-wrap-v371 table.soccer-data-table-v371 td:nth-child(2){width:58px!important;',
  'th:nth-child(3),.soccer-data-table-wrap-v371 table.soccer-data-table-v371 td:nth-child(3){width:48px!important;',
  'th:nth-child(4),.soccer-data-table-wrap-v371 table.soccer-data-table-v371 td:nth-child(4){width:88px!important;',
  'th:nth-child(7),.soccer-data-table-wrap-v371 table.soccer-data-table-v371 td:nth-child(7){width:108px!important;',
  '.soccer-data-association-field-v385 .input{width:100%!important;min-width:0!important;font-size:.58rem!important;min-height:30px!important;',
  'body.is-mobile-ux .soccer-data-table-wrap-v371 table.soccer-data-table-v371'
].forEach((token) => app.includes(token) ? pass(`mobile CSS token presente: ${token}`) : fail(`mobile CSS token mancante: ${token}`));

[
  'function isAdminOnlyPageV386',
  'return pageName === "admin" || pageName === "soccerdata";',
  'window.ZonaOrientaleSoccerDataAdminGateV386',
  'window.ZonaOrientaleSoccerDataAssociationPatchV385',
  'window.ZonaOrientaleSoccerDataTableCleanupV384',
  'window.ZonaOrientaleSoccerDataFbrefBatchV383'
].forEach((token) => app.includes(token) ? pass(`funzionalita precedente preservata: ${token}`) : fail(`funzionalita precedente mancante: ${token}`));

if (docsIndex) {
  !docsIndex.includes('V387 Soccer Data mobile cleanup') ? pass("FUNZIONALITA'.md non modificato per V387") : fail("FUNZIONALITA'.md contiene V387, non doveva essere aggiornato");
}

if (failures) process.exit(1);
