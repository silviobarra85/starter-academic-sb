#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const quiet = process.argv.includes('--quiet');
const toolDir = path.dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();
const candidates = [
  path.resolve(cwd, 'static', 'zonaorientale'),
  path.resolve(cwd, 'zonaorientale'),
  path.resolve(cwd),
  path.resolve(toolDir, '..')
];
const siteRoot = candidates.find((candidate) => fs.existsSync(path.join(candidate, 'assets', 'app.js')));
if (!siteRoot) {
  console.error('[audit-trade-simulator-target-v362] site root non trovato');
  process.exit(1);
}
const app = fs.readFileSync(path.join(siteRoot, 'assets', 'app.js'), 'utf8');
const version = Number(app.match(/DEPLOY_EXPECTED_VERSION_V181\s*=\s*["'](\d+)["']/)?.[1] || 0);
const checks = [
  ['DEPLOY_EXPECTED_VERSION_V181 >= 362', version >= 362],
  ['Target panel runtime V362', app.includes('ZonaOrientaleTradeSimulatorTargetPanelV362')],
  ['LocalStorage target simulations', app.includes('zonaorientale.tradeSimulatorTargetPanel.v362.rows')],
  ['Selettore destinatario presidente', app.includes('data-trade-target-v362')],
  ['Bottone Simula per presidente', app.includes('incoming-target') && app.includes('Simula per presidente')],
  ['Persistenza targetedByAdminV362', app.includes('targetedByAdminV362')],
  ['Checklist item dedicato V362', app.includes('trade-simulator-target-president')],
  ['No Firebase writes for target panel', app.includes('firebaseWrites: false')]
];
let failed = 0;
for (const [label, ok] of checks) {
  if (!quiet) console.log(`${ok ? 'OK' : 'FAIL'}: ${label}`);
  if (!ok) failed += 1;
}
if (failed) process.exit(1);
if (!quiet) console.log(`OK: audit simulatore target presidente V362 completato con runtime V${version}.`);
