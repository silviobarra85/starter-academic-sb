#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, '..');
const appFile = path.join(siteRoot, 'assets', 'app.js');
const app = fs.readFileSync(appFile, 'utf8');

const checks = [
  ['renderAdminArea', /function\s+renderAdminArea\s*\(/.test(app) || /renderAdminArea\s*=\s*function/.test(app)],
  ['attachAdminHandlers', /function\s+attachAdminHandlers\s*\(/.test(app) || /attachAdminHandlers\s*=\s*function/.test(app)],
  ['renderAdminPanel', /function\s+renderAdminPanel\s*\(/.test(app)],
  ['pannello Diagnostica dati', /adminDataDiagnosticsPanelV276/.test(app)],
  ['pulsante Aggiorna diagnostica', /data-refresh-diagnostics-v276/.test(app)],
  ['timestamp refresh V343', /data-admin-diagnostics-last-refresh-v343/.test(app)],
  ['toggle diagnostica V321', /toggleAdminDataDiagnosticsPanelV321/.test(app)],
  ['richieste presidenti Admin', /ZonaOrientaleTeamRequestsV253|ZonaOrientaleTeamRequestsV249/.test(app)],
  ['convertitore listone Admin', /ListoneConverter|renderListoneConverterAdminPanel|Converti listone/.test(app)],
  ['Calciomercato Solo Admin V340', /ZonaOrientaleCalciomercatoArchiveAdminV340/.test(app)],
];

const failed = checks.filter(([, ok]) => !ok);
for (const [label, ok] of checks) {
  console.log(`${ok ? 'OK' : 'FAIL'}: ${label}`);
}

if (failed.length) {
  console.error(`Audit Admin V343 fallito: ${failed.length} controlli non superati.`);
  process.exitCode = 1;
} else {
  console.log('Audit Admin V343 OK: wiring statico delle funzioni Admin principali presente.');
}
