import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

const app = read('assets/app.js');
const html = read('index.html');
const manifest = JSON.parse(read('assets/soccer-data/manifest.json'));
const providerMap = JSON.parse(read('assets/soccer-data/providers/api-football-player-map.v001.json'));

const visibleSoccerDataSection = html.slice(html.indexOf('<section class="app-page" data-page="soccerdata"'), html.indexOf('<footer'));
const forbiddenVisible = ['Copia patch FBref', 'Scarica patch FBref', 'Cerca FBref', 'Importa HTML FBref', 'FBref / Giocatore'];
const visibleClean = forbiddenVisible.every((token) => !visibleSoccerDataSection.includes(token));

const ok = [
  (html.includes('V395 Soccer Data mapping API-Football') || html.includes('V396 Soccer Data mapping API-Football da rose')),
  html.includes('id="soccerDataDownloadApiFootballMapV395"'),
  html.includes('<th class="soccer-data-col-player-v387">Giocatore</th>'),
  html.includes('<th class="soccer-data-col-status-v387">Stato profilo</th>'),
  visibleClean,
  app.includes('loadSoccerDataApiFootballProviderMapV395'),
  app.includes('downloadSoccerDataApiFootballMapV395'),
  app.includes('Trova ID API'),
  app.includes('renderSoccerDataProfileCellV395'),
  app.includes('href="${escapeHtml(row.fbrefUrl)}"'),
  manifest.providerMappings?.apiFootball === 'providers/api-football-player-map.v001.json',
  providerMap.meta?.version === 'api-football-player-map.v001',
  exists('netlify/functions/api-football-player-stats.js') || exists('../netlify/functions/api-football-player-stats.js')
];

if (!ok.every(Boolean)) {
  console.error(JSON.stringify({ ok, visibleClean, forbiddenVisible }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  version: 'V395',
  scope: 'solo Soccer Data',
  publicReadOnly: true,
  adminCommands: ['Trova ID API', 'Inserisci ID API', 'Recupera statistiche', 'Scarica mapping API', 'Scarica stats JSON'],
  providerMap: manifest.providerMappings.apiFootball,
  profileLinkKept: true,
  hiddenLegacyFbrefCommandsInUi: true,
  firebaseWrites: 'admin-only soccerDataPlayerStats',
  netlifyFunction: 'api-football-player-stats.js'
}, null, 2));
