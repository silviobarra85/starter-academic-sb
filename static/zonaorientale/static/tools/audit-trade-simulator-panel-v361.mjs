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
  console.error('[audit-trade-simulator-panel-v361] site root non trovato');
  process.exit(1);
}
const app = fs.readFileSync(path.join(siteRoot, 'assets', 'app.js'), 'utf8');
const version = Number(app.match(/DEPLOY_EXPECTED_VERSION_V181\s*=\s*["'](\d+)["']/)?.[1] || 0);
const required = [
  ['version >= V361', version >= 361],
  ['runtime marker', /ZonaOrientaleTradeSimulatorPanelV361/.test(app)],
  ['qa check id', /trade-simulator-panel/.test(app)],
  ['local-only statement', /firebaseWritesForSimulations:\s*false/.test(app)],
  ['simulate incoming UI button', /data-trade-simulator-v361="incoming"/.test(app)],
  ['simulate accepted UI button', /data-trade-simulator-v361="accepted"/.test(app)],
  ['simulate rejected UI button', /data-trade-simulator-v361="rejected"/.test(app)],
  ['clear simulations UI button', /data-trade-simulator-v361="clear"/.test(app)],
  ['refresh badges UI button', /data-trade-simulator-v361="badges"/.test(app)],
  ['uses V255 simulator API', /simulateIncomingProposal[\s\S]*simulateResolvedSentProposal[\s\S]*clearLocalSimulations/.test(app)],
  ['preserves V349 local actions', /ZonaOrientaleTradeSimulatorLocalActionsV349/.test(app)],
  ['qa panel smoke includes trade panel', /Boolean\(window\.ZonaOrientaleTradeSimulatorPanelV361\)/.test(app)]
];
const failures = required.filter(([, ok]) => !ok).map(([label]) => label);
if (!quiet) {
  console.log(`[audit-trade-simulator-panel-v361] ${failures.length ? 'FAIL' : 'OK'} (runtime V${version})`);
  failures.forEach((failure) => console.log(`- ${failure}`));
}
if (failures.length) process.exit(1);
