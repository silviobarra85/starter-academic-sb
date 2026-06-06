#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
let failures = 0;
function ok(msg){ console.log(`OK: ${msg}`); }
function fail(msg){ failures += 1; console.log(`FAIL: ${msg}`); }
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function readJson(rel){ return JSON.parse(read(rel)); }

const html = read('index.html');
const app = read('assets/app.js');
const manifest = readJson('assets/soccer-data/manifest.json');
const mapping = readJson('assets/soccer-data/fbref-player-map.v383.json');
const doc = fs.readFileSync(path.resolve(root, '../docs/zonaorientale/FUNZIONALITAV389.md'), 'utf8');

const desktopSoccerLink = '<a href="#soccerdata" class="nav-link" data-page-link="soccerdata">Soccer Data</a>';
const mobileSoccerLink = '<a href="#soccerdata" class="mobile-more-link" data-page-link="soccerdata"><span class="mobile-more-icon">⚽</span><span>Soccer Data</span></a>';

html.includes(desktopSoccerLink)
  ? ok('link desktop Soccer Data pubblico')
  : fail('link desktop Soccer Data non pubblico o non trovato');
html.includes(mobileSoccerLink)
  ? ok('link mobile Soccer Data pubblico')
  : fail('link mobile Soccer Data non pubblico o non trovato');

html.includes('soccer-data-admin-controls-v389 nav-link-admin hidden')
  ? ok('comandi amministrazione Soccer Data protetti da classe admin')
  : fail('comandi amministrazione Soccer Data non protetti nel markup');
html.includes('I comandi di associazione, patch') && html.includes('restano disponibili solo agli admin')
  ? ok('testo pagina chiarisce sola lettura pubblica e comandi admin')
  : fail('testo pagina Soccer Data non aggiornato');

app.includes('function isAdminOnlyPageV386(pageName) {\n  return pageName === "admin";\n}')
  ? ok('solo pagina Admin resta admin-only')
  : fail('Soccer Data risulta ancora admin-only nella navigazione');
!app.includes('pageName === "admin" || pageName === "soccerdata"')
  ? ok('rimosso blocco navigazione admin-only per Soccer Data')
  : fail('blocco admin-only Soccer Data ancora presente');
!app.includes('Accedi come admin per visualizzare Soccer Data') && !app.includes('Soccer Data e associazioni FBref sono disponibili solo per admin')
  ? ok('rimosso messaggio di blocco non-admin in render Soccer Data')
  : fail('render Soccer Data contiene ancora messaggi di blocco non-admin');
app.includes('async function loadSoccerDataManifestV371(options = {}) {\n  if (state.soccerDataLoadingV371)')
  ? ok('manifest Soccer Data caricabile anche non-admin')
  : fail('manifest Soccer Data sembra ancora bloccato per non-admin');
app.includes("if (!state.isAdmin) return '';\n  if (!isSoccerDataReviewRowV384(row)) return '';")
  ? ok('pannello associazione riga visibile solo admin')
  : fail('pannello associazione riga non protetto admin');
['soccerDataCopyCsvV371','soccerDataCopyReviewCsvV372','soccerDataDownloadMapV371','soccerDataCopyPatchV385','soccerDataDownloadPatchV385'].every((id) => app.includes(id))
  ? ok('comandi export/patch ancora presenti')
  : fail('comandi export/patch mancanti');
(app.match(/if \(!state\.isAdmin\) return;/g) || []).length >= 8
  ? ok('handler comandi Soccer Data protetti lato JS')
  : fail('handler comandi Soccer Data non sufficientemente protetti');
app.includes('window.ZonaOrientaleSoccerDataPublicReadonlyV389')
  ? ok('runtime marker pubblico read-only V389 presente')
  : fail('runtime marker pubblico read-only V389 mancante');

manifest.publicAccess?.sectionVisibleToAll === true && manifest.publicAccess?.adminCommandsOnlyForAdmin === true
  ? ok('manifest documenta accesso pubblico read-only e comandi admin')
  : fail('manifest non documenta correttamente accesso pubblico read-only');
Array.isArray(mapping.players) && mapping.players.length === 532 && mapping.players.filter((p) => p.matchStatus === 'confirmed').length === 531
  ? ok('mapping V383 invariato: 532 righe / 531 confermate')
  : fail('mapping V383 alterato');
doc.includes('La sezione Soccer Data torna visibile a tutti in sola lettura') && doc.includes('I comandi amministrativi Soccer Data restano solo admin')
  ? ok('documentazione V389 aggiornata')
  : fail('documentazione V389 non aggiornata');

if (failures) process.exit(1);
