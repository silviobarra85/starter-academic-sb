#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const fail = (message) => {
  console.error(`AUDIT V565 FAILED: ${message}`);
  process.exit(1);
};
const ok = (message) => console.log(`OK: ${message}`);

const appFile = 'static/zonaorientale/assets/app.js';
const indexFile = 'static/zonaorientale/index.html';
const app = read(appFile);
const index = read(indexFile);

if (!app.includes('V565 - Account presidente con logo coerente alla stagione selezionata')) fail('patch V565 mancante in app.js');
if (!app.includes('resolvePresidentAccountSeasonTeamForSelectedSeasonV565')) fail('resolver stagione selezionata mancante');
if (!app.includes('findPresidentAccountSeasonTeamByTeamV565')) fail('lookup per teamId mancante');
if (!app.includes('findPresidentAccountSeasonTeamByPresidentV565')) fail('lookup fallback per presidentId mancante');
if (!app.includes('getPresidentAccountSeasonTeamV229 = function getPresidentAccountSeasonTeamV565')) fail('override seasonTeam account mancante');
if (!app.includes('renderPresidentAccountButtonContentV229 = function renderPresidentAccountButtonContentV565')) fail('override rendering pulsante account mancante');
if (!app.includes('renderTeamLogo(teamName, logo, "president-account-logo-v229")')) fail('render logo account presidente non trovato');
if (!app.includes('Pres. ${escapeHtml(surname)}')) fail('label Pres. Cognome non preservata');
if (!app.includes('renderAll = function renderAllV565')) fail('refresh post-render del pulsante mancante');

if (!index.includes('./assets/app.js?v=565')) fail('cache-buster app.js V565 mancante in index.html');
if (!index.includes('ZonaOrientale Salerno · V565')) fail('footer V565 mancante');
if (!index.includes('release-panel-header-v564.css?v=564')) fail('CSS V564 header svincola non preservato');

const season2025Path = path.join(root, 'static/zonaorientale/assets/snapshots/seasons/2025-2026.json');
const season2026Path = path.join(root, 'static/zonaorientale/assets/snapshots/seasons/2026-2027.json');
if (fs.existsSync(season2025Path) && fs.existsSync(season2026Path)) {
  const s2025 = JSON.parse(fs.readFileSync(season2025Path, 'utf8'));
  const s2026 = JSON.parse(fs.readFileSync(season2026Path, 'utf8'));
  const oldTeam = (s2025.seasonTeams || []).find((team) => team.teamId === 'team_001');
  const newTeam = (s2026.seasonTeams || []).find((team) => team.teamId === 'team_001');
  if (oldTeam && newTeam) {
    const oldLogo = oldTeam.logo || (s2025.teams || []).find((team) => team.id === 'team_001')?.logo || '';
    const newLogo = newTeam.logo || (s2026.teams || []).find((team) => team.id === 'team_001')?.logo || '';
    if (!oldLogo.includes('real_pisistrius.png')) fail('logo storico 2025-2026 Real Pisistrius non riconosciuto');
    if (!newLogo.includes('real_pisistrius_2.png')) fail('logo 2026-2027 Real Pisistrius non riconosciuto');
    ok('dataset Real Pisistrius stagionale coerente: 2025 vecchio logo, 2026 nuovo logo');
  }
}

ok('V565 account presidente usa logo della stagione selezionata e mantiene label Pres.');
