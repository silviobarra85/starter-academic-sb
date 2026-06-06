#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const toolDir = path.dirname(__filename);
const siteRoot = path.resolve(toolDir, '..');
const listonePath = process.argv[2] ? path.resolve(process.argv[2]) : path.join(siteRoot, 'assets', 'listoni', '2026-06-04.json');
const outDir = process.argv[3] ? path.resolve(process.argv[3]) : path.join(siteRoot, 'assets', 'soccer-data');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const slugify = (value) => String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') || 'giocatore';
const playerKey = (p) => String(p.fantacalcioId||'').trim() ? 'fc-' + String(p.fantacalcioId).trim() : slugify(p.playerName) + '-' + String(p.realTeam||'').toLowerCase();
const csvEscape = (value) => '"' + String(value ?? '').replace(/"/g, '""') + '"';
const normalizeSearchName = (value) => String(value||'').trim().replace(/\s+/g,' ').replace(/\.$/,'');
const priorityScore = (p) => Math.min(50, Math.round(Number(p.fvm||0)/8)) + Math.min(20, Number(p.quotationCurrent||0)) + Math.min(20, Math.round(Number(p.sourceExtra?.played||0)/2)) + (String(p.fantasyRoster||'').trim() && String(p.fantasyRoster||'').trim().toLowerCase() !== 'svincolati' ? 10 : 0);
const reviewBatchFromIndex = (i) => 'batch-' + String(Math.floor(i/50)+1).padStart(2,'0');
const listone = readJson(listonePath);
const players = Array.isArray(listone.players) ? listone.players : [];
const active = players.filter((p) => String(p.statusCode||'').toUpperCase() === 'IN_LISTONE');
const ranked = active.map((p) => ({p, score: priorityScore(p)})).sort((a,b)=> b.score-a.score || String(a.p.playerName||'').localeCompare(String(b.p.playerName||''),'it'));
const rank = new Map(ranked.map((item, index) => [playerKey(item.p), {priority:index+1, score:item.score, batch:reviewBatchFromIndex(index)}]));
const rows = active.map((p) => {
  const key = playerKey(p);
  const r = rank.get(key);
  const team = p.realTeamOriginal || p.realTeam || '';
  const name = normalizeSearchName(p.playerName);
  const query = [name, team, 'fbref'].filter(Boolean).join(' ');
  return {
    reviewPriority: r.priority,
    reviewBatch: r.batch,
    playerKey: key,
    playerName: p.playerName || '',
    classicRole: p.classicRole || '',
    mantraRoles: p.mantraRoles || '',
    realTeam: p.realTeam || '',
    realTeamOriginal: team,
    fantacalcioId: String(p.fantacalcioId || ''),
    statusCode: 'IN_LISTONE',
    fbrefSearchQuery: query,
    fbrefSearchUrl: 'https://fbref.com/en/search/search.fcgi?search=' + encodeURIComponent(query),
    fbrefId: '', fbrefName: '', fbrefUrl: '', matchStatus: 'needs-review', confidence: '', notes: ''
  };
});
fs.mkdirSync(outDir, {recursive:true});
const payload = { meta: { version:'V372-generated', createdAt:new Date().toISOString(), sourceListoneFile:path.relative(siteRoot, listonePath).replaceAll('\\','/'), onlyStatusCode:'IN_LISTONE', totalListoneRows:players.length, activeRows:active.length, excludedRows:players.length-active.length, liveScraping:false, firebaseWrites:false }, players: rows };
fs.writeFileSync(path.join(outDir,'fbref-player-map.generated.v372.json'), JSON.stringify(payload,null,2)+'\n');
const headers = ['reviewPriority','reviewBatch','playerKey','playerName','classicRole','mantraRoles','realTeam','realTeamOriginal','fantacalcioId','fbrefSearchQuery','fbrefSearchUrl','fbrefId','fbrefName','fbrefUrl','matchStatus','confidence','notes'];
const csv = [headers.join(',')].concat(rows.slice().sort((a,b)=>a.reviewPriority-b.reviewPriority).map((row)=>headers.map((h)=>csvEscape(row[h])).join(','))).join('\n')+'\n';
fs.writeFileSync(path.join(outDir,'fbref-player-map.generated.v372.csv'), csv);
console.log(JSON.stringify({ ok:true, activeRows:active.length, excludedRows:players.length-active.length, outDir }, null, 2));
