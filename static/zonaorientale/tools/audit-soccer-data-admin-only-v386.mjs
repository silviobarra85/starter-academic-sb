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
const docsIndex = fs.existsSync(path.join(root, '../docs/zonaorientale/FUNZIONALITA\'.md'))
  ? read('../docs/zonaorientale/FUNZIONALITA\'.md')
  : '';

const expectedVersion = (app.match(/const DEPLOY_EXPECTED_VERSION_V181 = "(\d+)";/) || [])[1] || '';
Number(expectedVersion) >= 386 ? pass(`DEPLOY_EXPECTED_VERSION_V181 >= V386 (${expectedVersion})`) : fail(`runtime non V386+: ${expectedVersion || 'assente'}`);

for (const [name, content] of [['index', html], ['competition', competition], ['player', player]]) {
  (content.includes('V386 Soccer Data solo admin') || content.includes('V387 Soccer Data mobile cleanup')) ? pass(`${name}: footer V386+ presente`) : fail(`${name}: footer V386+ assente`);
  const versions = Array.from(new Set((content.match(/\?v=\d+/g) || []).map((item) => item.replace('?v=', ''))));
  versions.length === 1 && Number(versions[0]) >= 386 ? pass(`${name}: cache-buster V386+ allineato (${versions[0]})`) : fail(`${name}: cache-buster non V386+ (${versions.join(', ') || 'nessuno'})`);
}
const appVersions = Array.from(new Set((app.match(/\?v=\d+/g) || []).map((item) => item.replace('?v=', ''))));
appVersions.length === 1 && Number(appVersions[0]) >= 386 ? pass(`app.js: cache-buster V386+ allineati (${appVersions[0]})`) : fail(`app.js: cache-buster non V386+ (${appVersions.join(', ') || 'nessuno'})`);

manifest.currentMapping === 'fbref-player-map.v383.json' ? pass('manifest mantiene mapping V383') : fail('manifest non mantiene mapping V383');
manifest.meta?.firebaseWrites === false ? pass('manifest conferma no Firebase writes') : fail('manifest non conferma no Firebase writes');
manifest.meta?.liveScraping === false ? pass('manifest conferma no live scraping') : fail('manifest non conferma no live scraping');
Array.isArray(mapping.players) && mapping.players.length === 532 ? pass('mapping V383 invariato: 532 giocatori') : fail(`mapping V383 contiene ${mapping.players?.length || 0} giocatori`);
const confirmed = mapping.players.filter((p) => p.matchStatus === 'confirmed');
confirmed.length === 531 ? pass('mapping V383 invariato: 531 confermati') : fail(`confermati ${confirmed.length}, attesi 531`);
const needsReview = mapping.players.filter((p) => p.matchStatus === 'needs-review');
needsReview.length === 1 && needsReview[0]?.playerKey === 'fc-7262' ? pass('mapping V383 invariato: Balentien unico needs-review') : fail(`needs-review non attesi: ${needsReview.map((p) => p.playerKey).join(', ')}`);

html.includes('class="nav-link nav-link-admin hidden" data-page-link="soccerdata"') ? pass('link desktop Soccer Data nascosto ai non-admin') : fail('link desktop Soccer Data non protetto da nav-link-admin hidden');
html.includes('class="mobile-more-link nav-link-admin hidden" data-page-link="soccerdata"') ? pass('link mobile Soccer Data nascosto ai non-admin') : fail('link mobile Soccer Data non protetto da nav-link-admin hidden');

[
  'function isAdminOnlyPageV386',
  'return pageName === "admin" || pageName === "soccerdata";',
  'function promptAdminLoginForPageV386',
  'function redirectAdminOnlyPageIfNeededV386',
  'redirectAdminOnlyPageIfNeededV386();',
  'if (isAdminOnlyPageV386(targetPage) && !state.isAdmin)',
  'if (!state.isAdmin && !options.allowWhenLocked) return state.soccerDataManifestV371;',
  'function setSoccerDataControlsLockedV386',
  'Soccer Data e associazioni FBref sono disponibili solo per admin.',
  'window.ZonaOrientaleSoccerDataAdminGateV386',
  'window.ZonaOrientaleSoccerDataAssociationPatchV385',
  'window.ZonaOrientaleSoccerDataTableCleanupV384',
  'window.ZonaOrientaleSoccerDataFbrefBatchV383'
].forEach((token) => app.includes(token) ? pass(`app token presente: ${token}`) : fail(`app token mancante: ${token}`));

const v386GateBlock = (app.match(/function isAdminOnlyPageV386[\s\S]*?function setupNavigation/) || [])[0] || '';
const v386SoccerBlock = (app.match(/function setSoccerDataControlsLockedV386[\s\S]*?function getSoccerDataAssociationCsvV371/) || [])[0] || '';
(v386GateBlock && v386SoccerBlock) ? pass('blocchi V386 isolati trovati') : fail('blocchi V386 non trovati');
for (const token of ['setDoc(', 'addDoc(', 'updateDoc(', 'deleteDoc(', 'firebase.firestore().collection', 'fetch(`https://fbref.com', 'fetch("https://fbref.com', "fetch('https://fbref.com"]) {
  !v386GateBlock.includes(token) && !v386SoccerBlock.includes(token)
    ? pass(`nessun uso vietato nei blocchi V386: ${token}`)
    : fail(`uso vietato nei blocchi V386: ${token}`);
}

app.includes('.soccer-data-fbref-link-v384{display:inline-flex;align-items:center;gap:.22rem;text-decoration:none;color:var(--primary);font-weight:700;}')
  ? pass('link giocatore FBref colorato in verde')
  : fail('stile verde link FBref non trovato');
app.includes('.soccer-data-fbref-link-v384:hover,.soccer-data-fbref-link-v384:focus{color:var(--primary-dark);text-decoration:underline;}')
  ? pass('hover/focus link FBref verde scuro')
  : fail('hover/focus link FBref non aggiornato');

if (docsIndex) {
  !docsIndex.includes('V386 Soccer Data solo admin') ? pass("FUNZIONALITA'.md non modificato per V386") : fail("FUNZIONALITA'.md contiene V386, non doveva essere aggiornato");
}

if (failures) process.exit(1);
