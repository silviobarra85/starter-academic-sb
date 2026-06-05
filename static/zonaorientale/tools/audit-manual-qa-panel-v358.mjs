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
const fail = (message) => { console.error(`[audit-manual-qa-panel-v358] ${message}`); process.exit(1); };
if (!root) fail('site root non trovato');
const appPath = join(root, 'assets', 'app.js');
const app = readFileSync(appPath, 'utf8');
const versionMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181\s*=\s*["'](\d+)["']/);
const version = Number(versionMatch?.[1] || 0);
const required = [
  'ZonaOrientaleManualQaPanelV358',
  'manualQaPanelV358',
  'zonaorientale.manualQaPanel.v358.expanded',
  'runAutoChecks',
  'markArea',
  'copyExport',
  'Auto-check',
  'OK area',
  'Reset area'
];
const missing = required.filter((needle) => !app.includes(needle));
if (version < 358) missing.push(`DEPLOY_EXPECTED_VERSION_V181 >= 358 (trovato ${version || 'n/d'})`);
if (missing.length) fail(`Missing markers: ${missing.join(', ')}`);
if (!quiet) console.log(`[audit-manual-qa-panel-v358] OK - Manual QA panel presente con runtime V${version}.`);
