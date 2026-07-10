#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const root = process.cwd();
const dataPath = path.join(root, 'static/fanta-engine/data/sudatori/current/sudatori-data.json');
const jsPath = path.join(root, 'static/fanta-engine/js/sections/sudatori-section-v592.js');
const cssPath = path.join(root, 'static/fanta-engine/css/sudatori-section-v592.css');
function fail(msg){ console.error('FAIL', msg); process.exitCode = 1; }
function ok(msg){ console.log('OK', msg); }
if (!fs.existsSync(dataPath)) fail('missing sudatori-data.json'); else ok('data exists');
if (!fs.existsSync(jsPath)) fail('missing sudatori-section-v592.js'); else ok('js exists');
if (!fs.existsSync(cssPath)) fail('missing sudatori-section-v592.css'); else ok('css exists');
const data = JSON.parse(fs.readFileSync(dataPath,'utf8'));
if (data.meta.version !== 'V592') fail('data meta version is not V592'); else ok('data version V592');
const players = Object.values(data.playersByTeam || {}).flat();
const meret = players.find(p => String(p.playerName).toLowerCase() === 'meret');
if (!meret) fail('Meret missing from Sudatori data');
else if (!meret.listone || meret.listone.status !== 'In listone') fail('Meret is not matched to listone');
else ok('Meret matched to listone');
if (!meret || !meret.fantasyRoster) fail('Meret missing fantasy roster from listone'); else ok('fantasy roster present');
const js = fs.readFileSync(jsPath,'utf8');
if (!js.includes('Rosa fantacalcio')) fail('JS does not render Rosa fantacalcio column'); else ok('Rosa fantacalcio column rendered');
if (!js.includes('Mercato') || !js.includes('Probabile formazione')) fail('JS missing market/formations panel labels'); else ok('market/formations rendered');
if (process.exitCode) process.exit(process.exitCode);
console.log('Audit V592 completed');
