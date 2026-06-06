#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const quiet = process.argv.includes('--quiet');
let failures = 0;
function log(kind, msg){ if(!quiet || kind === 'FAIL') console.log(`${kind}: ${msg}`); }
function pass(msg){ log('OK', msg); }
function fail(msg){ failures += 1; log('FAIL', msg); }
function readJson(rel){ return JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8')); }

const manifest = readJson('assets/soccer-data/manifest.json');
const mapping = readJson('assets/soccer-data/fbref-player-map.v375.json');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

manifest.currentMapping === 'fbref-player-map.v375.json' ? pass('manifest punta al mapping V375') : fail('manifest non punta a fbref-player-map.v375.json');
manifest.meta?.version === 'V375' ? pass('manifest versione V375') : fail('manifest non e V375');
Array.isArray(mapping.players) && mapping.players.length === 532 ? pass('mapping contiene 532 giocatori IN_LISTONE') : fail(`mapping contiene ${mapping.players?.length || 0} giocatori, attesi 532`);
const excluded = mapping.players.filter((p) => String(p.statusCode || '').toUpperCase() !== 'IN_LISTONE');
excluded.length === 0 ? pass('nessun asteriscato/non-IN_LISTONE nel mapping') : fail(`${excluded.length} record non IN_LISTONE nel mapping`);
const confirmed = mapping.players.filter((p) => p.matchStatus === 'confirmed');
confirmed.length === 150 ? pass('totale mapping confermati V375: 150') : fail(`mapping confermati totali: ${confirmed.length}, attesi 150`);
const batch03 = mapping.players.filter((p) => p.matchStatus === 'confirmed' && p.mappedInRelease === 'V375' && p.reviewBatch === 'batch-03');
batch03.length === 50 ? pass('batch-03 contiene 50 mapping confermati') : fail(`mapping confermati batch-03: ${batch03.length}, attesi 50`);
const missing = confirmed.filter((p) => !p.fbrefId || !p.fbrefName || !p.fbrefUrl || !p.fbrefUrl.includes(`/players/${p.fbrefId}/`));
missing.length === 0 ? pass('tutti i confermati hanno id/nome/url FBref coerenti') : fail(`${missing.length} confermati senza id/nome/url coerenti`);
const badStatus = mapping.players.filter((p) => p.mappedInRelease === 'V375' && p.reviewBatch !== 'batch-03');
badStatus.length === 0 ? pass('nessun mapping V375 fuori batch-03') : fail(`${badStatus.length} mapping V375 fuori batch-03`);
['window.ZonaOrientaleSoccerDataV371','window.ZonaOrientaleSoccerDataMappingAssistantV372','window.ZonaOrientaleSoccerDataFbrefBatchV373','window.ZonaOrientaleSoccerDataFbrefBatchV374','window.ZonaOrientaleSoccerDataFbrefBatchV375','fbref-player-map.v375.json','firebaseWrites: false','liveScraping: false'].forEach((token) => app.includes(token) ? pass(`app token presente: ${token}`) : fail(`app token mancante: ${token}`));
html.includes('Soccer Data') && html.includes('V375') ? pass('HTML Soccer Data aggiornato a V375') : fail('HTML Soccer Data non aggiornato a V375');
if (failures) process.exit(1);
