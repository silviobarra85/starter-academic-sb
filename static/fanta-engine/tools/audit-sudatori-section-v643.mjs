#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const root = process.cwd();
const dataPath = path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifestPath = path.join(root, 'static/fanta-engine/data/sudatori/current/manifest.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
function count(obj) { return Object.values(obj || {}).reduce((s, arr) => s + (Array.isArray(arr) ? arr.length : 0), 0); }
if (manifest.current !== 'sudatori-data.json') throw new Error('manifest.current non punta a sudatori-data.json');
if (!data.marketSummaryByTeam || !data.officialMovesByTeam) throw new Error('market summary/official moves mancanti');
if ((data.teams || []).length !== 20) throw new Error('numero squadre non valido');
if (count(data.injuriesByTeam) < 8) throw new Error('SOS/infortunati sotto atteso');
const official = Object.values(data.marketSummaryByTeam).reduce((s, v) => s + (v.officialIncoming||[]).length + (v.officialOutgoing||[]).length, 0);
const talks = Object.values(data.marketSummaryByTeam).reduce((s, v) => s + (v.talksIncoming||[]).length + (v.talksOutgoing||[]).length, 0);
if (official < 250) throw new Error('ufficialita aggregate troppo poche: ' + official);
if (talks < 200) throw new Error('trattative aggregate troppo poche: ' + talks);
console.log('Audit Sudatori V643 OK', JSON.stringify({ teams:data.teams.length, official, talks, injuries: count(data.injuriesByTeam), sources:(data.sources||[]).length }));
