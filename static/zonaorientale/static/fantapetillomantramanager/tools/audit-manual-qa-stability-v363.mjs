#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const quiet = process.argv.includes('--quiet');
const cwd = process.cwd();
const candidates = [
  cwd.endsWith('static/zonaorientale') ? cwd : null,
  path.join(cwd, 'static', 'zonaorientale'),
  path.join(cwd, 'zonaorientale'),
  path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
].filter(Boolean);
const siteRoot = candidates.find((candidate) => fs.existsSync(path.join(candidate, 'assets', 'app.js'))) || candidates[0];
const appPath = path.join(siteRoot, 'assets', 'app.js');
const app = fs.readFileSync(appPath, 'utf8');

const checks = [
  ['versione runtime V363', /DEPLOY_EXPECTED_VERSION_V181\s*=\s*["']363["']/.test(app)],
  ['badge checklist V363', app.includes('manual-qa-panel-v358__badge">V363')],
  ['marker stabilita V363', app.includes('ZonaOrientaleManualQaPanelStabilityV363')],
  ['auto refresh protetto', app.includes('shouldDeferAutoRenderV363') && app.includes('autoRenderV363')],
  ['intervallo lento e non distruttivo', app.includes('window.setInterval(autoRenderV363, 7000)') && !app.includes('window.setInterval(render, 2200)')],
  ['dettagli informativi non chiusi mentre aperti', app.includes("root.querySelector('details[open]')")],
  ['select non resetta al change', app.includes('Destinatario simulazione aggiornato') && !app.includes("render('Destinatario simulazione aggiornato')")],
  ['box simulatore full-width', app.includes('is-trade-simulator-v363') && app.includes('grid-column:1/-1')],
  ['select simulatore responsivo', app.includes('grid-template-columns:minmax(0,1fr) auto') && app.includes('max-width:100%')],
  ['istruzioni login presidente chiare', app.includes("esci dall'admin e accedi come quel presidente nello stesso browser")],
  ['simulazione resta local-only', app.includes('firebaseWrites: false') && app.includes('localOnly: true')]
];

const failures = checks.filter(([, ok]) => !ok).map(([label]) => label);
if (!quiet) {
  console.log(`Audit manual QA stability V363: ${failures.length ? 'FAIL' : 'OK'}`);
  if (failures.length) failures.forEach((item) => console.log(`- ${item}`));
}
if (failures.length) process.exit(1);
