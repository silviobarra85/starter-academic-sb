#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const root = process.cwd();
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function json(rel){ return JSON.parse(read(rel)); }
function fail(msg){ console.error('[audit ioSudo V636] FAIL:', msg); process.exit(1); }
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');
const js = read('static/fanta-engine/js/apps/iosudo-app-v636.js');
const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');
if (!index.includes('iosudo-app-v636.js?v=636')) fail('index non punta a JS V636');
if (!index.includes('iosudo-app-v636.css?v=636')) fail('index non punta a CSS V636');
if (!sw.includes('iosudo-shell-v636')) fail('service worker cache non V636');
if (!sw.includes('iosudo-app-v636.js?v=636')) fail('service worker non precache JS V636');
if (!js.includes('NAME_ALIAS_V636')) fail('alias nomi V636 mancanti');
if (!js.includes("['kilicksoy', 'kilicsoy']")) fail('alias Kilicksoy/Kilicsoy mancante');
if (!js.includes("['brooke norton cuffy', 'norton cuffy']")) fail('alias Brooke Norton-Cuffy/Norton-Cuffy mancante');
if (!js.includes('applyLiveRosterMatchToPlayer')) fail('applicazione rose live ai virtual player mancante');
if (!js.includes('shouldShowInGlobalPlayers')) fail('filtro fuori Serie A nella lista GIOCATORI mancante');
if (!js.includes('isOfficiallyOutOfSerieA')) fail('controllo ufficialmente fuori Serie A mancante');
if (!js.includes('laterSerieALink')) fail('salvaguardia aggiornamenti successivi Serie A mancante');
if (!data.meta || data.meta.version !== 'V636') fail('dataset non marcato V636');
const dataText = JSON.stringify(data);
if (!/Kilicksoy/.test(dataText) || !/Dybala/.test(dataText) || !/Brooke Norton-Cuffy/.test(dataText)) fail('casi di controllo non presenti nel dataset');
let dybalaRoster = null;
try {
  const rosterManifest = json('static/zonaorientale/assets/rose/manifest.json');
  const seasonId = data.meta.seasonId || '2026-2027';
  const entry = (rosterManifest.rosters || []).filter(e => String(e.seasonId || '') === seasonId).sort((a,b) => String(b.loadedAt || b.id || '').localeCompare(String(a.loadedAt || a.id || ''), 'it'))[0];
  if (entry && entry.file) {
    const roster = json('static/zonaorientale/assets/rose/' + entry.file);
    for (const team of roster.rosters || []) {
      for (const player of team.players || []) {
        if (/^dybala$/i.test(String(player.playerName || player.name || '').trim())) dybalaRoster = team.name || team.teamName || '';
      }
    }
  }
} catch (error) {
  // Repo parziale: non bloccare se le rose non sono incluse.
}
if (dybalaRoster && !/Real Pisistrius/i.test(dybalaRoster)) fail('Dybala trovato in una rosa inattesa: ' + dybalaRoster);
console.log('[audit ioSudo V636] OK', {
  aliases: ['Kilicksoy/Kilicsoy', 'Brooke Norton-Cuffy/Norton-Cuffy'],
  hideOutOfSerieA: true,
  virtualLiveRosters: true,
  dybalaFantasyRoster: dybalaRoster || 'non verificato in repo parziale'
});
