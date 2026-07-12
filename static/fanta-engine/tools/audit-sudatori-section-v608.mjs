#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataPath = path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifestPath = path.join(root, 'static/fanta-engine/data/sudatori/current/manifest.json');
const jsPath = path.join(root, 'static/fanta-engine/js/sections/sudatori-section-v608.js');
const cssPath = path.join(root, 'static/fanta-engine/css/sudatori-section-v608.css');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const fail = (msg) => { console.error(`[audit-sudatori-v608] ${msg}`); process.exit(1); };
if (manifest.version !== 'V608' || data.meta.version !== 'V608') fail('versione manifest/data non V608');
if (!Array.isArray(data.teams) || data.teams.length !== 20) fail('numero squadre non valido');
const players = Object.values(data.playersByTeam || {}).reduce((n, arr) => n + (arr || []).length, 0);
if (players !== manifest.players) fail(`conteggio giocatori non coerente: ${players} != ${manifest.players}`);
const formationBad = Object.entries(data.formationsByTeam || {}).filter(([, arr]) => (arr || []).length !== 11);
if (formationBad.length) fail(`formazioni non a 11: ${formationBad.map(([k]) => k).join(', ')}`);
const summaries = data.marketSummaryByTeam || {};
for (const team of data.teams) {
  const s = summaries[team.id];
  if (!s) fail(`riepilogo mercato mancante per ${team.name}`);
  for (const key of ['officialIncoming','officialOutgoing','talksIncoming','talksOutgoing']) {
    if (!Array.isArray(s[key])) fail(`blocco ${key} mancante per ${team.name}`);
  }
}
for (const [teamId, talks] of Object.entries(data.teamTransferTalksByTeam || {})) {
  const seen = new Set();
  const officialOut = new Set(((data.officialMovesByTeam?.[teamId]?.outgoing) || []).map((x) => String(x.playerName || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()));
  for (const talk of talks || []) {
    const key = String(talk.target || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    if (seen.has(key)) fail(`card duplicata in trattative ${teamId}: ${talk.target}`);
    seen.add(key);
    if (officialOut.has(key)) fail(`ufficialità in uscita presente ancora nelle trattative ${teamId}: ${talk.target}`);
    if (!Array.isArray(talk.sources) || !talk.sources.length) fail(`fonti aggregate mancanti per ${teamId}/${talk.target}`);
  }
}
if (!fs.existsSync(jsPath) || !fs.readFileSync(jsPath,'utf8').includes('renderMarketOverview')) fail('JS V608 riepilogo mercato mancante');
if (!fs.existsSync(cssPath) || !fs.readFileSync(cssPath,'utf8').includes('sudatori-market-overview-v608')) fail('CSS V608 riepilogo mercato mancante');
console.log(`[audit-sudatori-v608] OK: ${data.teams.length} squadre, ${players} giocatori, ${manifest.teamTransferTalks} card trattative, ${manifest.officialMoves} ufficialità.`);
