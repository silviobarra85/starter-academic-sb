import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

const app = read('assets/app.js');
const html = read('index.html');
const manifest = JSON.parse(read('assets/soccer-data/manifest.json'));
const statsManifest = JSON.parse(read('assets/soccer-data/stats/manifest.json'));
const functionPath = exists('../netlify/functions/api-football-player-stats.js')
  ? '../netlify/functions/api-football-player-stats.js'
  : 'netlify/functions/api-football-player-stats.js';
const netlifyFunction = exists(functionPath) ? read(functionPath) : '';

const visibleSoccerDataSection = html.slice(html.indexOf('<section class="app-page" data-page="soccerdata"'), html.indexOf('<footer'));
const ok = [
  html.includes('V396 Soccer Data mapping API-Football da rose') || html.includes('V397 Soccer Data diagnostica API-Football rose'),
  html.includes('id="soccerDataFetchApiFootballSquadsV396"'),
  html.includes('id="soccerDataGenerateApiFootballMapV396"'),
  visibleSoccerDataSection.includes('Scarica rose Serie A API'),
  visibleSoccerDataSection.includes('Genera mapping da rose'),
  app.includes('SOCCER_DATA_API_FOOTBALL_SERIE_A_LEAGUE_ID_V396 = 135'),
  app.includes('fetchSoccerDataApiFootballSerieASquadsV396'),
  app.includes('generateSoccerDataApiFootballMappingFromSquadsV396'),
  app.includes('getSoccerDataApiFootballCandidatesFromSquadsV396'),
  app.includes('squad-cache-v396'),
  ['V396','V397'].includes(manifest.meta?.assetLayoutVersion),
  ['V396','V397'].includes(manifest.stats?.version),
  manifest.statsPipeline?.apiFootballV396?.leagueId === 135,
  ['V396','V397'].includes(statsManifest.meta?.version),
  netlifyFunction.includes("action === 'teams'"),
  netlifyFunction.includes("action === 'squad'"),
  netlifyFunction.includes("callApiFootball('/teams'"),
  netlifyFunction.includes("callApiFootball('/players/squads'"),
];

if (!ok.every(Boolean)) {
  console.error(JSON.stringify({ ok, functionPath, manifestVersion: manifest.meta?.assetLayoutVersion }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  version: manifest.meta?.assetLayoutVersion || 'V396',
  scope: 'solo Soccer Data',
  publicReadOnly: true,
  adminCommands: ['Scarica rose Serie A API', 'Genera mapping da rose', 'Scarica mapping API', 'Recupera statistiche'],
  apiProvider: 'api-football',
  leagueId: 135,
  strategy: '1 teams request + one squad request per Serie A team; mapping local/export statico; no API for public reads',
  netlifyFunction: functionPath,
  firebaseWrites: 'solo cache stats admin esistente'
}, null, 2));
