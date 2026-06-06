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
const mapping = readJson('assets/soccer-data/fbref-player-map.v383.json');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

manifest.currentMapping === 'fbref-player-map.v383.json' ? pass('manifest punta al mapping V383') : fail('manifest non punta a fbref-player-map.v383.json');
manifest.meta?.version === 'V383' ? pass('manifest versione V383') : fail('manifest non e V383');
Array.isArray(mapping.players) && mapping.players.length === 532 ? pass('mapping contiene 532 giocatori IN_LISTONE') : fail(`mapping contiene ${mapping.players?.length || 0} giocatori, attesi 532`);
const excluded = mapping.players.filter((p) => String(p.statusCode || '').toUpperCase() !== 'IN_LISTONE');
excluded.length === 0 ? pass('nessun asteriscato/non-IN_LISTONE nel mapping') : fail(`${excluded.length} record non IN_LISTONE nel mapping`);
const confirmed = mapping.players.filter((p) => p.matchStatus === 'confirmed');
confirmed.length === 531 ? pass('totale mapping confermati V383: 531') : fail(`mapping confermati totali: ${confirmed.length}, attesi 531`);
const batch11 = mapping.players.filter((p) => p.matchStatus === 'confirmed' && p.mappedInRelease === 'V383' && p.reviewBatch === 'batch-11');
batch11.length === 31 ? pass('batch-11 contiene 31 mapping confermati') : fail(`mapping confermati batch-11: ${batch11.length}, attesi 31`);
const needsReview = mapping.players.filter((p) => p.matchStatus === 'needs-review');
needsReview.length === 1 && needsReview[0]?.playerKey === 'fc-7262' ? pass('un solo residuo needs-review: Balentien') : fail(`needs-review residui non attesi: ${needsReview.map((p) => p.playerKey).join(', ')}`);
const missing = confirmed.filter((p) => !p.fbrefId || !p.fbrefName || !p.fbrefUrl || !p.fbrefUrl.includes(`/players/${p.fbrefId}/`));
missing.length === 0 ? pass('tutti i confermati hanno id/nome/url FBref coerenti') : fail(`${missing.length} confermati senza id/nome/url coerenti`);
const duplicateIds = new Map();
for (const p of confirmed) duplicateIds.set(p.fbrefId, (duplicateIds.get(p.fbrefId) || 0) + 1);
const duplicates = [...duplicateIds.entries()].filter(([, count]) => count > 1);
duplicates.length === 0 ? pass('nessun fbrefId duplicato tra i confermati') : fail(`fbrefId duplicati: ${duplicates.map(([id]) => id).join(', ')}`);
const badStatus = mapping.players.filter((p) => p.mappedInRelease === 'V383' && p.reviewBatch !== 'batch-11');
badStatus.length === 0 ? pass('nessun mapping V383 fuori batch-11') : fail(`${badStatus.length} mapping V383 fuori batch-11`);
['window.ZonaOrientaleSoccerDataV371','window.ZonaOrientaleSoccerDataMappingAssistantV372','window.ZonaOrientaleSoccerDataFbrefBatchV373','window.ZonaOrientaleSoccerDataFbrefBatchV374','window.ZonaOrientaleSoccerDataFbrefBatchV375','window.ZonaOrientaleSoccerDataFbrefBatchV376','window.ZonaOrientaleSoccerDataFbrefBatchV377','window.ZonaOrientaleSoccerDataFbrefBatchV378','window.ZonaOrientaleSoccerDataFbrefBatchV379','window.ZonaOrientaleSoccerDataFbrefBatchV380','window.ZonaOrientaleSoccerDataFbrefBatchV381','window.ZonaOrientaleSoccerDataFbrefBatchV382','window.ZonaOrientaleSoccerDataFbrefBatchV383','fbref-player-map.v383.json','firebaseWrites: false','liveScraping: false'].forEach((token) => app.includes(token) ? pass(`app token presente: ${token}`) : fail(`app token mancante: ${token}`));
html.includes('Soccer Data') && (html.includes('V383') || html.includes('V384') || html.includes('V385') || html.includes('V386')) ? pass('HTML Soccer Data presente in runtime V383/V384/V385/V386') : fail('HTML Soccer Data non rilevato in runtime V383/V384/V385/V386');
if (failures) process.exit(1);
