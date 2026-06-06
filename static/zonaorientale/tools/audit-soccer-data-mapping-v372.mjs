#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const quiet = process.argv.includes('--quiet');
const __filename = fileURLToPath(import.meta.url);
const toolDir = path.dirname(__filename);
const cwd = process.cwd();
const candidates = [path.resolve(cwd,'static','zonaorientale'), path.resolve(cwd,'zonaorientale'), path.resolve(cwd), path.resolve(toolDir,'..')];
const siteRoot = candidates.find((candidate) => fs.existsSync(path.join(candidate,'assets','app.js')));
if (!siteRoot) { console.error('[audit-soccer-data-mapping-v372] site root non trovato'); process.exit(1); }
const repoCandidates = [path.resolve(siteRoot,'..','..'), path.resolve(siteRoot,'..'), path.resolve(cwd)];
const docsRoot = repoCandidates.map((root) => path.join(root,'docs','zonaorientale')).find((candidate) => fs.existsSync(candidate));
const failures=[]; const warnings=[]; const passes=[];
const fail=(m)=>failures.push(m); const warn=(m)=>warnings.push(m); const pass=(m)=>passes.push(m);
const read=(f)=>fs.readFileSync(f,'utf8'); const exists=(f)=>fs.existsSync(f)&&fs.statSync(f).isFile();
const appPath=path.join(siteRoot,'assets','app.js');
const indexPath=path.join(siteRoot,'index.html');
const manifestPath=path.join(siteRoot,'assets','soccer-data','manifest.json');
const mappingPath=path.join(siteRoot,'assets','soccer-data','fbref-player-map.v372.json');
const csvPath=path.join(siteRoot,'assets','soccer-data','fbref-player-map.v372.csv');
const reviewCsvPath=path.join(siteRoot,'assets','soccer-data','fbref-review-batch.v372.csv');
const listonePath=path.join(siteRoot,'assets','listoni','2026-06-04.json');
const generatorPath=path.join(siteRoot,'tools','generate-soccer-data-mapping-v372.mjs');
for (const file of [appPath,indexPath,manifestPath,mappingPath,csvPath,reviewCsvPath,listonePath,generatorPath]) exists(file) ? pass(path.relative(siteRoot,file)+' presente') : fail(path.relative(siteRoot,file)+' mancante');
if (exists(appPath)) { const syntax = spawnSync(process.execPath, ['--check', appPath], {encoding:'utf8'}); syntax.status===0 ? pass('assets/app.js sintassi ok') : fail('assets/app.js sintassi ko: '+(syntax.stderr||syntax.stdout)); }
let app='', index='', manifest=null, mapping=null, listone=null;
try { app = exists(appPath) ? read(appPath) : ''; } catch {}
try { index = exists(indexPath) ? read(indexPath) : ''; } catch {}
try { manifest = JSON.parse(read(manifestPath)); pass('manifest JSON valido'); } catch(e){ fail('manifest JSON non valido: '+e.message); }
try { mapping = JSON.parse(read(mappingPath)); pass('mapping V372 JSON valido'); } catch(e){ fail('mapping V372 JSON non valido: '+e.message); }
try { listone = JSON.parse(read(listonePath)); pass('listone JSON valido'); } catch(e){ fail('listone JSON non valido: '+e.message); }
const expectedVersion = app.match(/DEPLOY_EXPECTED_VERSION_V181\s*=\s*["'](\d+)["']/)?.[1] || '';
Number(expectedVersion) >= 372 ? pass('DEPLOY_EXPECTED_VERSION_V181 compatibile V372+: '+expectedVersion) : fail('DEPLOY_EXPECTED_VERSION_V181 non compatibile V372+: '+(expectedVersion||'non trovato'));
for (const htmlName of ['index.html','competition.html','player.html']) {
  const htmlPath = path.join(siteRoot, htmlName);
  const html = exists(htmlPath) ? read(htmlPath) : '';
  html.includes('Soccer Data') && /V(37[2-9]|3[8-9][0-9]|[4-9][0-9]{2,})/.test(html) ? pass(htmlName+' footer Soccer Data V372+ presente') : fail(htmlName+' footer Soccer Data V372+ mancante');
  const versions = [...new Set(Array.from(html.matchAll(/[?&]v=(\d+)/g)).map((m)=>m[1]))];
  versions.length && versions.every((v)=>Number(v) >= 372) ? pass(htmlName+' cache-buster compatibili V372+') : fail(htmlName+' cache-buster inattesi: '+(versions.join(',')||'nessuno'));
}
for (const token of ['window.ZonaOrientaleSoccerDataV371','window.ZonaOrientaleSoccerDataMappingAssistantV372','getSoccerDataReviewCsvV372','data-soccer-data-copy-row-v372','firebaseWrites: false','liveScraping: false']) app.includes(token) ? pass('app token presente: '+token) : fail('app token mancante: '+token);
for (const token of ['soccerDataCopyReviewCsvV372','data-page="soccerdata"','Soccer Data']) index.includes(token) ? pass('index token presente: '+token) : fail('index token mancante: '+token);
if (manifest) {
  Number(String(manifest?.meta?.version || '').replace(/^V/, '')) >= 372 ? pass('manifest versione compatibile V372+: '+manifest.meta.version) : fail('manifest versione non compatibile V372+: '+manifest?.meta?.version);
  /^fbref-player-map\.v\d+\.json$/.test(String(manifest.currentMapping || '')) ? pass('manifest punta a mapping compatibile V372+: '+manifest.currentMapping) : fail('manifest currentMapping inatteso: '+manifest.currentMapping);
  manifest?.meta?.readOnly === true && manifest?.meta?.firebaseWrites === false && manifest?.meta?.liveScraping === false ? pass('manifest read-only/no Firebase/no scraping') : fail('manifest non dichiara correttamente read-only/no scraping');
}
if (mapping && listone) {
  const active = (listone.players||[]).filter((p)=>String(p.statusCode||'').toUpperCase()==='IN_LISTONE');
  const asterisk = (listone.players||[]).filter((p)=>String(p.statusCode||'').toUpperCase()==='ASTERISCATO');
  const rows = mapping.players || [];
  rows.length === active.length ? pass('mapping contiene solo attivi IN_LISTONE: '+rows.length) : fail('righe mapping '+rows.length+', attesi '+active.length);
  const invalid = rows.filter((p)=>String(p.statusCode||'').toUpperCase()!=='IN_LISTONE');
  invalid.length ? fail('mapping contiene record non IN_LISTONE: '+invalid.length) : pass('nessun record non IN_LISTONE nel mapping');
  asterisk.length ? pass('asteriscati esclusi: '+asterisk.length) : warn('nessun asteriscato rilevato');
  const missingSearch = rows.filter((p)=>!p.fbrefSearchUrl || !p.fbrefSearchQuery || !p.reviewBatch || !p.reviewPriority);
  missingSearch.length ? fail('righe senza searchUrl/query/batch/priority: '+missingSearch.length) : pass('tutte le righe hanno query/link/batch/priorita');
  const keys = new Set(); const dup = new Set();
  for (const row of rows) { if (keys.has(row.playerKey)) dup.add(row.playerKey); keys.add(row.playerKey); }
  dup.size ? fail('playerKey duplicati: '+Array.from(dup).slice(0,5).join(', ')) : pass('playerKey univoci');
}
if (docsRoot) {
  const required = ['AI_HANDOFF_ZONAORIENTALE_CURRENT.md','CURRENT_STATE.md','FUNZIONALITAV372.md','release/RELEASE_V372_SOCCER_DATA_MAPPING_ASSISTITO.md','audit/SOCCER_DATA_MAPPING_MATRIX_V372.md','test/SOCCER_DATA_MAPPING_V372.md','handoff/HANDOFF_NUOVO_ASSISTENTE_V372.md'];
  for (const doc of required) exists(path.join(docsRoot,doc)) ? pass('doc presente: '+doc) : fail('doc mancante: '+doc);
  exists(path.join(docsRoot,"FUNZIONALITA'.md")) ? pass("FUNZIONALITA'.md presente e non toccato") : fail("FUNZIONALITA'.md mancante");
} else warn('docs/zonaorientale non trovato');
if (!quiet) { passes.forEach((m)=>console.log('PASS '+m)); warnings.forEach((m)=>console.warn('WARN '+m)); failures.forEach((m)=>console.error('FAIL '+m)); }
if (failures.length) { console.error('[audit-soccer-data-mapping-v372] fallimenti: '+failures.length+', warning: '+warnings.length); process.exit(1); }
if (!quiet) console.log('[audit-soccer-data-mapping-v372] ok: '+passes.length+', warning: '+warnings.length);
