#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const root = process.cwd();
const manifestPath = path.join(root, 'static/fanta-engine/data/sudatori/current/manifest.json');
const dataPath = path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
function fail(msg){ console.error('[audit V635] FAIL:', msg); process.exit(1); }
if (manifest.version !== 'V635') fail('manifest.version non V635');
if (manifest.current !== 'sudatori-data.json') fail('manifest.current errato');
if (!data.meta || data.meta.version !== 'V635') fail('data.meta.version non V635');
if ((data.meta.marketRowsRoleFixedV635 || 0) < 90) fail('troppi pochi ruoli corretti nelle righe mercato');
const teams = data.teams || [];
if (teams.length !== 20) fail('numero squadre inatteso');
console.log('[audit V635] OK Sudatori data', { version: manifest.version, roleFixes: data.meta.marketRowsRoleFixedV635, currentTeams: data.meta.officialOutgoingCurrentTeamResolvedV635 });
