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
const mapping = readJson('assets/soccer-data/fbref-player-map.v377.json');
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

String(manifest.currentMapping || '').startsWith('fbref-player-map.v') ? pass(`manifest mapping corrente: ${manifest.currentMapping}`) : fail('manifest mapping corrente non valido');
Number(String(manifest.meta?.version || '').replace(/^V/, '')) >= 377 ? pass(`manifest versione ${manifest.meta?.version} >= V377`) : fail('manifest precedente a V377');
Array.isArray(mapping.players) && mapping.players.length === 532 ? pass('mapping contiene 532 giocatori IN_LISTONE') : fail(`mapping contiene ${mapping.players?.length || 0} giocatori, attesi 532`);
const excluded = mapping.players.filter((p) => String(p.statusCode || '').toUpperCase() !== 'IN_LISTONE');
excluded.length === 0 ? pass('nessun asteriscato/non-IN_LISTONE nel mapping') : fail(`${excluded.length} record non IN_LISTONE nel mapping`);
const confirmed = mapping.players.filter((p) => p.matchStatus === 'confirmed');
confirmed.length === 250 ? pass('totale mapping confermati V377: 250') : fail(`mapping confermati totali: ${confirmed.length}, attesi 250`);
const batch05 = mapping.players.filter((p) => p.matchStatus === 'confirmed' && p.mappedInRelease === 'V377' && p.reviewBatch === 'batch-05');
batch05.length === 50 ? pass('batch-05 contiene 50 mapping confermati') : fail(`mapping confermati batch-05: ${batch05.length}, attesi 50`);
const missing = confirmed.filter((p) => !p.fbrefId || !p.fbrefName || !p.fbrefUrl || !p.fbrefUrl.includes(`/players/${p.fbrefId}/`));
missing.length === 0 ? pass('tutti i confermati hanno id/nome/url FBref coerenti') : fail(`${missing.length} confermati senza id/nome/url coerenti`);
const duplicateIds = new Map();
for (const p of confirmed) duplicateIds.set(p.fbrefId, (duplicateIds.get(p.fbrefId) || 0) + 1);
const duplicates = [...duplicateIds.entries()].filter(([, count]) => count > 1);
duplicates.length === 0 ? pass('nessun fbrefId duplicato tra i confermati') : fail(`fbrefId duplicati: ${duplicates.map(([id]) => id).join(', ')}`);
const badStatus = mapping.players.filter((p) => p.mappedInRelease === 'V377' && p.reviewBatch !== 'batch-05');
badStatus.length === 0 ? pass('nessun mapping V377 fuori batch-05') : fail(`${badStatus.length} mapping V377 fuori batch-05`);
['window.ZonaOrientaleSoccerDataV371','window.ZonaOrientaleSoccerDataMappingAssistantV372','window.ZonaOrientaleSoccerDataFbrefBatchV373','window.ZonaOrientaleSoccerDataFbrefBatchV374','window.ZonaOrientaleSoccerDataFbrefBatchV375','window.ZonaOrientaleSoccerDataFbrefBatchV376','window.ZonaOrientaleSoccerDataFbrefBatchV377','fbref-player-map.v377.json','firebaseWrites: false','liveScraping: false'].forEach((token) => app.includes(token) ? pass(`app token presente: ${token}`) : fail(`app token mancante: ${token}`));
html.includes('Soccer Data') ? pass('HTML Soccer Data presente') : fail('HTML Soccer Data non presente');
if (failures) process.exit(1);
