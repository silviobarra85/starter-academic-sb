import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const fail = (message) => {
  console.error(`FAIL V394: ${message}`);
  process.exit(1);
};
const assert = (condition, message) => { if (!condition) fail(message); };

const app = read('assets/app.js');
const index = read('index.html');
const fnPath = path.join(root, '..', 'netlify', 'functions', 'api-football-player-stats.js');
assert(fs.existsSync(fnPath), 'Netlify Function API-Football mancante');
const fn = fs.readFileSync(fnPath, 'utf8');

assert(app.includes('SOCCER_DATA_API_FOOTBALL_STATS_FUNCTION_V394'), 'costante function API-Football mancante');
assert(app.includes('searchSoccerDataApiFootballIdV394'), 'ricerca ID API-Football non presente');
assert(app.includes('fetchAndSaveSoccerDataApiFootballStatsV394'), 'recupero/salvataggio API-Football non presente');
assert(app.includes('buildSoccerDataApiFootballSavePayloadV394'), 'payload Firebase API-Football non presente');
assert(app.includes('soccerDataPlayerStats'), 'collection stats Firebase non preservata');
assert(app.includes('data-soccer-data-fetch-api-football-v394'), 'pulsante riga Recupera API-Football mancante');
assert(app.includes('formatSoccerDataUpdatedAtV394'), 'format data aggiornamento mancante');
assert(index.includes('soccer-data-col-updated-v394'), 'colonna Aggiornato mancante in index');
assert(index.includes('Aggiornato'), 'testo colonna Aggiornato mancante');
assert(index.includes('app.js?v=394') || index.includes('app.js?v=396'), 'cache buster index non aggiornato a V394/V396');
assert(index.includes('V394 Soccer Data API-Football cache Firebase') || index.includes('V396 Soccer Data mapping API-Football da rose'), 'footer V394/V396 non aggiornato');
assert(fn.includes('ZONAORIENTALE_API_FOOTBALL_KEY'), 'variabile ambiente Netlify API-Football mancante');
assert(fn.includes('https://v3.football.api-sports.io'), 'endpoint API-Football non presente');
assert(fn.includes('x-apisports-key'), 'header API-Football non presente');
assert(fn.includes('verifyAdmin'), 'verifica admin function mancante');
assert(fn.includes('action === \'search\''), 'action search non presente');
assert(fn.includes("action: 'stats'"), 'action stats non presente');
assert(exists('../docs/zonaorientale/FUNZIONALITAV394.md'), 'doc FUNZIONALITAV394 mancante');
assert(exists('../docs/zonaorientale/HANDOFF_V394_SOCCER_DATA_API_FOOTBALL.md'), 'handoff V394 mancante');

console.log('OK V394 Soccer Data API-Football: provider server-side, Firebase cache, export JSON e colonna Aggiornato presenti.');
