import fs from 'fs';
import path from 'path';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/soccer-data/manifest.json'), 'utf8'));
const statsManifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/soccer-data/stats/manifest.json'), 'utf8'));
const summaryPath = path.join(root, 'assets/soccer-data/stats', statsManifest.currentSummary || '');
const csvPath = path.join(root, 'assets/soccer-data/stats', statsManifest.currentSummaryCsvTemplate || '');
const mapping = JSON.parse(fs.readFileSync(path.join(root, 'assets/soccer-data/fbref-player-map.v383.json'), 'utf8'));
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const csv = fs.readFileSync(csvPath, 'utf8').trimEnd().split(/\r?\n/);
const app = fs.readFileSync(path.join(root, 'assets/app.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const players = Array.isArray(summary.players) ? summary.players : [];
const mappingPlayers = Array.isArray(mapping.players) ? mapping.players : [];
const missingKeys = mappingPlayers.filter((item) => !players.some((row) => row.playerKey === item.playerKey));
const compiled = players.filter((entry) => ['matches','starts','minutes','goals','assists','xg','npxg','xa','xag','yellowCards','redCards'].some((key) => entry?.[key] !== null && entry?.[key] !== undefined && String(entry?.[key]).trim() !== '')).length;
const checks = {
  manifestStatsV390: manifest.stats?.version === 'V390',
  currentSummaryConfigured: manifest.stats?.currentSummary === 'player-stats-summary-2025-2026.v001.json',
  statsManifestV390: statsManifest.meta?.version === 'V390',
  summaryExists: fs.existsSync(summaryPath),
  csvExists: fs.existsSync(csvPath),
  summaryRowsMatchMapping: players.length === mappingPlayers.length && missingKeys.length === 0,
  csvRowsMatchSummary: csv.length === players.length + 1,
  noCompiledFakeStats: compiled === 0,
  appLoadsSummary: app.includes('loadSoccerDataStatsSummaryV390') && app.includes('getSoccerDataStatsEntriesV390'),
  adminDownloadsPresent: index.includes('soccerDataDownloadStatsTemplateV390') && index.includes('soccerDataDownloadStatsSummaryV390'),
  soccerDataPublicReadonlyPreserved: app.includes('ZonaOrientaleSoccerDataPublicReadonlyV389'),
  mappingPreserved: manifest.currentMapping === 'fbref-player-map.v383.json'
};
const failed = Object.entries(checks).filter(([, value]) => !value);
console.log(JSON.stringify({ ok: failed.length === 0, checks, rows: players.length, csvRows: csv.length - 1, compiledRows: compiled, missingKeys: missingKeys.slice(0, 5).map((item) => item.playerKey) }, null, 2));
if (failed.length) process.exit(1);
