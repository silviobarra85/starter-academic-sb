#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const root = process.cwd();
const data = JSON.parse(fs.readFileSync(path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json'), 'utf8'));
const app = fs.readFileSync(path.join(root, 'static/fanta-engine/js/apps/iosudo-app-v643.js'), 'utf8');
if (!app.includes("quickView === 'players'") && !app.includes('quickView === "players"')) throw new Error('vista GIOCATORI non rilevata');
if (!app.includes('playerSourceText')) throw new Error('sorgente giocatore non rilevata');
if (!app.includes('injuriesForPlayer')) throw new Error('fix SOS/dettaglio giocatore mancante');
if (!data.marketSummaryByTeam || !data.friendliesByTeam) throw new Error('dati ioSudo incompleti');
const talks = Object.values(data.marketSummaryByTeam).reduce((s, v) => s + (v.talksIncoming||[]).length + (v.talksOutgoing||[]).length, 0);
console.log('Audit ioSudo V643 OK', JSON.stringify({ talks, sources:(data.sources||[]).length, log:(data.updateLogV643||[]).length }));
