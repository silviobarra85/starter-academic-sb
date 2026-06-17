#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, '..');
const snapshotFile = path.join(siteRoot, 'assets', 'snapshots', 'seasons', '2026-2027.json');
const configFile = path.join(siteRoot, 'assets', 'league-config.json');
const manifestFile = path.join(siteRoot, 'assets', 'snapshots', 'seasons', 'manifest.json');

function readJson(file) {
  if (!fs.existsSync(file)) {
    console.error(`FAIL: file mancante: ${path.relative(siteRoot, file)}`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.error(`FAIL: JSON non valido: ${path.relative(siteRoot, file)} (${error.message})`);
    process.exit(1);
  }
}

const snapshot = readJson(snapshotFile);
const config = readJson(configFile);
const manifest = readJson(manifestFile);

if (!config || config.leagueId !== 'fantapetillomantramanager') {
  console.error('FAIL: league-config non identifica fantapetillomantramanager');
  process.exit(1);
}

const manifestText = JSON.stringify(manifest);
if (!manifestText.includes('2026-2027')) {
  console.error('FAIL: manifest snapshot non contiene 2026-2027');
  process.exit(1);
}

const arrays = ['teams', 'squadre', 'clubs', 'seasonTeams', 'rosters', 'movements', 'fmMovements', 'competitions', 'matches'];
let totalItems = 0;
for (const key of arrays) {
  if (Array.isArray(snapshot[key])) totalItems += snapshot[key].length;
}

const meta = snapshot.meta || snapshot.metadata || snapshot.info || {};
const mode = totalItems > 0 ? 'popolato da Admin standard' : 'vuoto da Admin standard';
console.log(`OK: snapshot 2026-2027 valido (${mode}, elementi=${totalItems})`);
if (meta && typeof meta === 'object') console.log(`OK: metadati snapshot letti (${Object.keys(meta).length} chiavi)`);
