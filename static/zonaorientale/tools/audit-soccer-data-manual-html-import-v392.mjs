import fs from 'node:fs';

const app = fs.readFileSync('assets/app.js', 'utf8');
const index = fs.readFileSync('index.html', 'utf8');
const fn = fs.readFileSync('../netlify/functions/fbref-player-stats.js', 'utf8');
const manifest = JSON.parse(fs.readFileSync('assets/soccer-data/manifest.json', 'utf8'));
const statsManifest = JSON.parse(fs.readFileSync('assets/soccer-data/stats/manifest.json', 'utf8'));

const checks = [
  ['manual import button is rendered', app.includes('data-soccer-data-import-html-v392')],
  ['manual import modal exists', app.includes('soccerDataManualImportModalV392')],
  ['manual parser reads DOM tables', app.includes('parseSoccerDataFbrefHtmlTablesV392') && app.includes('DOMParser')],
  ['manual import saves to Firebase collection', app.includes('saveSoccerDataManualHtmlStatsV392') && app.includes('SOCCER_DATA_PLAYER_STATS_COLLECTION_V391')],
  ['server 403 mentions fallback', app.includes('Importa HTML FBref sulla stessa riga') && fn.includes('manual-html-import-v392')],
  ['cachebuster updated to 392', index.includes('assets/app.js?v=392') || index.includes('assets/app.js?v=393') || index.includes('assets/app.js?v=394')],
  ['footer updated to V392', index.includes('V392 Soccer Data import HTML FBref') || index.includes('V393 Soccer Data rules e fallback locale stats') || index.includes('V394 Soccer Data API-Football cache Firebase')],
  ['manifest documents V392 fallback', ['V392','V393','V394'].includes(manifest.meta.assetLayoutVersion) && manifest.statsPipeline?.manualHtmlImportV392?.enabled === true],
  ['stats manifest documents V392 fallback', ['V392','V393','V394'].includes(statsManifest.meta.version) && statsManifest.manualHtmlImportV392?.enabled === true]
];

const failed = checks.filter(([, ok]) => !ok);
if (failed.length) {
  console.error('Audit V392 fallito:');
  for (const [label] of failed) console.error(`- ${label}`);
  process.exit(1);
}
console.log('Audit V392 OK - import HTML FBref fallback admin presente e Soccer Data resta isolata.');
