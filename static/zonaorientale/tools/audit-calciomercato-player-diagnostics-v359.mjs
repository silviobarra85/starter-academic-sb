#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const quiet = process.argv.includes('--quiet');
const toolDir = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const candidates = [
  resolve(cwd, 'static', 'zonaorientale'),
  resolve(cwd, 'zonaorientale'),
  resolve(cwd),
  resolve(toolDir, '..')
];
const root = candidates.find((candidate) => existsSync(join(candidate, 'assets', 'app.js')));
const fail = (message) => { console.error(`[audit-calciomercato-player-diagnostics-v359] ${message}`); process.exit(1); };
if (!root) fail('site root non trovato');
const appPath = join(root, 'assets', 'app.js');
const modulePath = join(root, 'assets', 'js', 'calciomercato', 'calciomercato-players-v359.js');
if (!existsSync(appPath)) fail(`app.js non trovato: ${appPath}`);
if (!existsSync(modulePath)) fail(`modulo V359 non trovato: ${modulePath}`);
const app = readFileSync(appPath, 'utf8');
const mod = readFileSync(modulePath, 'utf8');
const version = Number(app.match(/DEPLOY_EXPECTED_VERSION_V181\s*=\s*["'](\d+)["']/)?.[1] || 0);
const requiredAppMarkers = [
  'createCalciomercatoPlayerHelpersV359',
  'calciomercato-players-v359.js?v=',
  'ZonaOrientaleCalciomercatoPlayerMatchingV359',
  'ZonaOrientaleCalciomercatoPlayerDiagnosticsV359',
  'buildCalciomercatoPlayerDiagnosticsReportV359',
  'calciomercato-player-diagnostics',
  'Report giocatori'
];
const requiredModuleMarkers = [
  'export function createCalciomercatoPlayerHelpersV359',
  'buildPlayerDiagnosticsV359',
  'configured-alias',
  'compact-full-name',
  'N\'Doye',
  'Kvaratskhelia'
];
const missingApp = requiredAppMarkers.filter((needle) => !app.includes(needle));
const missingModule = requiredModuleMarkers.filter((needle) => !mod.includes(needle));
if (version < 359) missingApp.push(`DEPLOY_EXPECTED_VERSION_V181 >= 359 (trovato ${version || 'n/d'})`);
if (missingApp.length) fail(`marker app mancanti: ${missingApp.join(', ')}`);
if (missingModule.length) fail(`marker modulo mancanti: ${missingModule.join(', ')}`);
if (/createCalciomercatoPlayerHelpersV340/.test(app)) fail('app.js contiene ancora import/riferimento runtime a createCalciomercatoPlayerHelpersV340');
if (!quiet) console.log(`[audit-calciomercato-player-diagnostics-v359] OK - diagnostica V359 presente con runtime V${version}.`);
