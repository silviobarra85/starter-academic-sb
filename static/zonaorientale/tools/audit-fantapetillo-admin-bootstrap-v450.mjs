#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const siteRoot = path.resolve(scriptDir, '..');
const staticRoot = path.resolve(siteRoot, '..');
const cloneRoot = path.join(staticRoot, 'fantapetillomantramanager');
let docsRoot = path.resolve(siteRoot, '..', '..', 'docs');
if (!fs.existsSync(docsRoot)) docsRoot = path.resolve(siteRoot, '..', 'docs');
let failures = 0;
let checks = 0;
function ok(message) { checks += 1; if (!quiet) console.log(`OK: ${message}`); }
function fail(message) { checks += 1; failures += 1; console.error(`FAIL: ${message}`); }
function check(condition, message) { condition ? ok(message) : fail(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function json(file) { return JSON.parse(read(file)); }

try {
  const zonaConfig = json(path.join(siteRoot, 'assets', 'league-config.json'));
  check(Number(zonaConfig.currentVersion) >= 450, 'ZonaOrientale currentVersion V450');
  check(zonaConfig.guardrails?.cloneAdminBootstrapReady === true, 'ZonaOrientale traccia Admin bootstrap clone V450');
  const zonaFirebase = read(path.join(siteRoot, 'assets', 'firebase.js'));
  check(zonaFirebase.includes('zonaorientale-d07af'), 'Firebase ZonaOrientale invariato');
  check(!zonaFirebase.includes('fantapetillomantramanager.firebaseapp.com'), 'Firebase FantaPetillo non importato in ZonaOrientale');

  const cloneConfig = json(path.join(cloneRoot, 'assets', 'league-config.json'));
  check(Number(cloneConfig.currentVersion) >= 450, 'clone currentVersion V450');
  check(cloneConfig.firebase?.projectId === 'fantapetillomantramanager', 'clone su Firebase dedicato');
  check(cloneConfig.features?.admin === true, 'Admin clone abilitato');
  check(cloneConfig.features?.teamArea === false, 'Team Area clone ancora protetta');
  check(cloneConfig.guardrails?.doNotUseZonaOrientaleFirebase === true, 'guardrail anti-contaminazione presente');

  const cloneFirebase = read(path.join(cloneRoot, 'assets', 'firebase.js'));
  check(cloneFirebase.includes('projectId: "fantapetillomantramanager"'), 'clone firebase projectId dedicato');
  check(!cloneFirebase.includes('zonaorientale-d07af') && !cloneFirebase.includes('AIzaSyB7YQM3'), 'clone non contiene Firebase ZonaOrientale');

  const rules = read(path.join(cloneRoot, 'tools', 'firestore-rules-v450.rules'));
  check(rules.includes('function isApprovedTeamUser()'), 'rules V450 complete da ZonaOrientale presenti');
  check(rules.includes('match /soccerDataPlayerStats/{docId}'), 'rules V450 includono Soccer Data');
  check(!rules.includes('match /{collectionName}/{documentId}'), 'rules V450 senza wildcard generica');

  const guard = read(path.join(cloneRoot, 'assets', 'js', 'core', 'fanta-petillo-admin-bootstrap-v450.js'));
  check(guard.includes('hidesAdminEntrypoints: false') && guard.includes('hidesTeamAreaEntrypoints: true'), 'guard V450 sblocca Admin e protegge Team Area');

  const setupPath = path.join(docsRoot, 'fantapetillomantramanager', 'FIREBASE_SETUP_V450.md');
  check(fs.existsSync(setupPath), 'documento Firebase setup V450 presente');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit Admin bootstrap clone V450 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit Admin bootstrap clone V450 superato: ${checks} controlli.`);
