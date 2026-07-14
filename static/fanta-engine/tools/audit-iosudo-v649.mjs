import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const fail = (message) => { throw new Error(message); };
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
const manifest = JSON.parse(read('static/fanta-engine/data/sudatori/current/manifest.json'));
const app = read('static/fanta-engine/js/apps/iosudo-app-v649.js');
const html = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

if (manifest.version !== 'V649') fail('manifest non aggiornato a V649');
if (data.meta?.version !== 'V649') fail('sudatori-data meta.version non aggiornato a V649');
if (!html.includes('iosudo-app-v649.js?v=649') || !html.includes('iosudo-app-v649.css?v=649')) fail('index ioSudo non punta a V649');
if (!sw.includes('iosudo-shell-v649') || !sw.includes('iosudo-app-v649.js?v=649')) fail('service worker non punta a V649');
if (!app.includes('handleResultsClick') || !app.includes('niente listener per-card')) fail('event delegation V649 non presente');
if (!app.includes('FRIENDLY_NON_MATCH_RE_V649') || !app.includes('isRealFriendlyMatch')) fail('filtro amichevoli V649 non presente');
if (!app.includes('return;\n  }\n\n  function scheduleRenderResults')) fail('cache GIOCATORI lazy non rilevata');
if (!app.includes('visibleRows') || !app.includes('rows.slice(0, 220)')) fail('cap render GIOCATORI non rilevato');

const badFriendlies = [];
for (const [teamId, rows] of Object.entries(data.friendliesByTeam || {})) {
  for (const row of rows || []) {
    const event = String(row.event || '');
    if (/guida|ritir|radun|convocat|verifica|calendario|TuttoFantacalcio|Corriere|fonti|amichevoli non ancora/i.test(event)) {
      badFriendlies.push({ teamId, event });
    }
    if (!/\S\s*[-–—]\s*\S/.test(event)) badFriendlies.push({ teamId, event, reason: 'not-match-shaped' });
  }
}
if (badFriendlies.length) fail('amichevoli non partita ancora presenti: ' + JSON.stringify(badFriendlies.slice(0, 5)));
if ((manifest.friendliesFilteredOutV649 || 0) < 1) fail('nessuna riga non partita filtrata, controllo sospetto');
if ((manifest.players || 0) < 700) fail('conteggio giocatori troppo basso');
if ((manifest.officialMoves || 0) < 250) fail('conteggio ufficialita troppo basso');

console.log('Audit ioSudo V649 OK', JSON.stringify({
  players: manifest.players,
  friendlies: manifest.friendlies,
  filteredFriendlies: manifest.friendliesFilteredOutV649,
  talks: manifest.teamTransferTalks,
  officialMoves: manifest.officialMoves,
  lazyPlayers: true,
  delegatedNavigation: true
}));
