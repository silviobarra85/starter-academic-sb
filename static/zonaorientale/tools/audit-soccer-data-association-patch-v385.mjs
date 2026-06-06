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
function exists(rel){ return fs.existsSync(path.join(root, rel)); }

const app = read('assets/app.js');
const html = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const manifest = readJson('assets/soccer-data/manifest.json');
const mapping = readJson('assets/soccer-data/fbref-player-map.v383.json');
const soccerSectionMatch = html.match(/<section class="app-page" data-page="soccerdata"[\s\S]*?<\/section>\s*<\/section>/);
const soccerSection = soccerSectionMatch ? soccerSectionMatch[0] : '';

const expectedVersion = (app.match(/const DEPLOY_EXPECTED_VERSION_V181 = "(\d+)";/) || [])[1];
Number(expectedVersion) >= 385 ? pass(`DEPLOY_EXPECTED_VERSION_V181 >= V385 (${expectedVersion})`) : fail(`versione runtime non V385+: ${expectedVersion || 'assente'}`);

for (const [name, content] of [['index', html], ['competition', competition], ['player', player]]) {
  (content.includes('V385 Soccer Data associazione FBref') || content.includes('V386 Soccer Data solo admin') || content.includes('V387 Soccer Data mobile cleanup')) ? pass(`${name}: footer V385+ presente`) : fail(`${name}: footer V385+ assente`);
  const versions = Array.from(new Set((content.match(/\?v=\d+/g) || []).map((item) => item.replace('?v=', ''))));
  versions.length === 1 && Number(versions[0]) >= 385 ? pass(`${name}: cache-buster V385+ allineato (${versions[0]})`) : fail(`${name}: cache-buster non allineati (${versions.join(', ') || 'nessuno'})`);
}
const appVersions = Array.from(new Set((app.match(/\?v=\d+/g) || []).map((item) => item.replace('?v=', ''))));
appVersions.length === 1 && Number(appVersions[0]) >= 385 ? pass(`app.js: import/fetch cache-buster V385+ allineati (${appVersions[0]})`) : fail(`app.js: cache-buster non allineati (${appVersions.join(', ') || 'nessuno'})`);

manifest.currentMapping === 'fbref-player-map.v383.json' ? pass('manifest mantiene mapping V383') : fail('manifest non mantiene fbref-player-map.v383.json');
manifest.meta?.firebaseWrites === false ? pass('manifest conferma no Firebase writes') : fail('manifest non conferma no Firebase writes');
manifest.meta?.liveScraping === false ? pass('manifest conferma no live scraping') : fail('manifest non conferma no live scraping');
!exists('assets/soccer-data/fbref-player-map.v385.json') ? pass('nessun mapping V385 creato automaticamente') : fail('fbref-player-map.v385.json non dovrebbe esistere in V385');

Array.isArray(mapping.players) && mapping.players.length === 532 ? pass('mapping V383 invariato: 532 giocatori') : fail(`mapping V383 contiene ${mapping.players?.length || 0} giocatori, attesi 532`);
const confirmed = mapping.players.filter((p) => p.matchStatus === 'confirmed');
confirmed.length === 531 ? pass('mapping V383 invariato: 531 confermati') : fail(`confermati ${confirmed.length}, attesi 531`);
const needsReview = mapping.players.filter((p) => p.matchStatus === 'needs-review');
needsReview.length === 1 && needsReview[0]?.playerKey === 'fc-7262' ? pass('mapping V383 invariato: un needs-review Balentien') : fail(`needs-review non attesi: ${needsReview.map((p) => p.playerKey).join(', ')}`);

soccerSection ? pass('sezione Soccer Data trovata') : fail('sezione Soccer Data non trovata');
soccerSection.includes('FBref / Giocatore') ? pass('colonna FBref / Giocatore presente') : fail('colonna FBref / Giocatore assente');
soccerSection.includes('Stato mapping') ? pass('colonna Stato mapping presente') : fail('colonna Stato mapping assente');
!soccerSection.includes('<th>Azione</th>') ? pass('colonna Azione separata assente') : fail('colonna Azione separata ancora presente');
['soccerDataCopyPatchV385','soccerDataDownloadPatchV385','Copia patch FBref','Scarica patch FBref'].forEach((token) => soccerSection.includes(token) ? pass(`index token presente: ${token}`) : fail(`index token mancante: ${token}`));

[
  'state.soccerDataAssociationDraftsV385',
  'function parseSoccerDataFbrefPlayerUrlV385',
  'function buildSoccerDataAssociationDraftV385',
  'function getSoccerDataAssociationPatchPayloadV385',
  'function prepareSoccerDataAssociationDraftV385',
  'function downloadSoccerDataAssociationPatchV385',
  'data-soccer-data-fbref-url-input-v385',
  'data-soccer-data-fbref-name-input-v385',
  'data-soccer-data-prepare-fbref-v385',
  'data-soccer-data-copy-draft-v385',
  'data-soccer-data-remove-draft-v385',
  'Copia dati mapping',
  'Prepara mapping',
  'window.ZonaOrientaleSoccerDataAssociationPatchV385',
  'storage: \'localStorage only\'',
  'firebaseWrites: false',
  'liveScraping: false',
  'window.ZonaOrientaleSoccerDataTableCleanupV384',
  'window.ZonaOrientaleSoccerDataFbrefBatchV383',
  'window.ZonaOrientaleSoccerDataMappingAssistantV372',
  'window.ZonaOrientaleSoccerDataV371'
].forEach((token) => app.includes(token) ? pass(`app token presente: ${token}`) : fail(`app token mancante: ${token}`));

app.includes('new URL(value, \'https://fbref.com\')') && app.includes("host !== 'fbref.com'") && app.includes('/en/players/') ? pass('parser URL FBref limitato ai profili giocatore') : fail('parser URL FBref non rilevato o non limitato');
app.includes("baseMapping: state.soccerDataManifestV371?.currentMapping || SOCCER_DATA_BASE_MAPPING_FILE_V371") ? pass('patch dichiara il mapping base') : fail('patch non dichiara il mapping base');
app.includes("matchStatus: 'confirmed'") && app.includes("confidence: 'manual-v385'") ? pass('patch produce mapping manuale confermato ma marcato V385') : fail('patch non marca correttamente il mapping manuale V385');
app.includes("window.alert?.('Nessuna patch FBref pronta") ? pass('export patch vuota bloccata con messaggio') : fail('export patch vuota non gestita');

const v385BlockMatch = app.match(/state\.soccerDataAssociationDraftsV385[\s\S]*?async function ensureSoccerDataLoadedAndRenderedV371/);
const v385Block = v385BlockMatch ? v385BlockMatch[0] : '';
v385Block ? pass('blocco V385 isolato trovato') : fail('blocco V385 non trovato');
const forbiddenInV385 = [
  'firebase.firestore().collection',
  'setDoc(',
  'addDoc(',
  'updateDoc(',
  'deleteDoc(',
  'fetch(`https://fbref.com',
  'fetch("https://fbref.com',
  "fetch('https://fbref.com"
];
for (const token of forbiddenInV385) {
  !v385Block.includes(token) ? pass(`nessun uso vietato nel blocco V385: ${token}`) : fail(`uso vietato nel blocco V385: ${token}`);
}

if (failures) process.exit(1);
