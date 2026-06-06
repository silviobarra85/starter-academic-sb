#!/usr/bin/env node
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../assets/app.js', import.meta.url), 'utf8');
const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const fn = readFileSync(new URL('../../netlify/functions/api-football-player-stats.js', import.meta.url), 'utf8');
const manifest = readFileSync(new URL('../assets/soccer-data/manifest.json', import.meta.url), 'utf8');

const checks = [
  ['diagnostics button in index', index.includes('soccerDataApiFootballDiagnosticsV397')],
  ['diagnostics handler in app', app.includes('runSoccerDataApiFootballDiagnosticsV397')],
  ['season candidates helper', app.includes('getSoccerDataApiFootballSeasonCandidatesV397')],
  ['teams fallback metadata', app.includes('seasonFallbackUsed') && app.includes('attempts')],
  ['function status action', fn.includes("action === 'status'") && fn.includes("callApiFootball('/status'")],
  ['function API error handling', fn.includes('hasApiFootballErrors') && fn.includes('API-Football ha restituito errore')],
  ['function season candidates', fn.includes('buildSeasonCandidates') && fn.includes('seasonCandidates')],
  ['manifest V397', manifest.includes('V397') && manifest.includes('fallback stagioni')]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('Audit V397 failed:');
  failed.forEach(([name]) => console.error(`- ${name}`));
  process.exit(1);
}
console.log('Audit V397 ok: API-Football diagnostics and season fallback present.');
