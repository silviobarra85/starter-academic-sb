#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const root = process.cwd();
function fail(msg){ console.error('[audit Sudatori V636] FAIL:', msg); process.exit(1); }
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'static/fanta-engine/data/sudatori/current/manifest.json'), 'utf8'));
const data = JSON.parse(fs.readFileSync(path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json'), 'utf8'));
if (manifest.version !== 'V636') fail('manifest.version non V636');
if (manifest.current !== 'sudatori-data.json') fail('manifest.current errato');
if (!data.meta || data.meta.version !== 'V636') fail('data.meta.version non V636');
if (data.meta.players !== 714) fail('conteggio giocatori inatteso');
if ((data.teams || []).length !== 20) fail('numero squadre inatteso');
if (!data.meta.ioSudoPlayersAliasFix || !data.meta.ioSudoHideOfficialOutOfSerieA) fail('metadati fix ioSudo V636 mancanti');
console.log('[audit Sudatori V636] OK', { version: manifest.version, teams: data.teams.length, players: data.meta.players });
