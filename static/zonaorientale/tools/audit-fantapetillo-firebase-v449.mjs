#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const siteRoot = path.resolve(scriptDir, '..');
const staticRoot = path.resolve(siteRoot, '..');
const cloneSlug = 'fantapetillomantramanager';
const cloneRoot = path.join(staticRoot, cloneSlug);
const docsRoot = path.resolve(siteRoot, '..', '..', 'docs');
let failures = 0;
let checks = 0;
function ok(message) { checks += 1; if (!quiet) console.log(`OK: ${message}`); }
function fail(message) { checks += 1; failures += 1; console.error(`FAIL: ${message}`); }
function check(condition, message) { condition ? ok(message) : fail(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function json(file) { return JSON.parse(read(file)); }
function exists(rel, base = cloneRoot) { return fs.existsSync(path.join(base, rel)); }

try {
  const zonaConfig = json(path.join(siteRoot, 'assets', 'league-config.json'));
  check(Number(zonaConfig.currentVersion) >= 449, 'ZonaOrientale currentVersion V449');
  check(zonaConfig.guardrails?.cloneFirebaseProjectConnected === 'bootstrap-v449', 'ZonaOrientale traccia collegamento Firebase clone V449');
  check(zonaConfig.firebaseBootstrap?.projectId === 'fantapetillomantramanager', 'ZonaOrientale registra projectId clone');

  const zonaFirebase = read(path.join(siteRoot, 'assets', 'firebase.js'));
  check(zonaFirebase.includes('zonaorientale-d07af'), 'Firebase ZonaOrientale invariato');
  check(!zonaFirebase.includes('fantapetillomantramanager.firebaseapp.com'), 'Firebase FantaPetillo non importato in ZonaOrientale');

  const cloneConfig = json(path.join(cloneRoot, 'assets', 'league-config.json'));
  check(Number(cloneConfig.currentVersion) >= 449, 'clone currentVersion V449');
  check(cloneConfig.firebase?.projectId === 'fantapetillomantramanager', 'clone collegato a Firebase dedicato');
  check(cloneConfig.guardrails?.firebaseDisabled === false, 'clone non usa piu stub firebaseDisabled');
  check(cloneConfig.guardrails?.doNotUseZonaOrientaleFirebase === true, 'guardrail anti-contaminazione Firebase ZonaOrientale presente');
  check((cloneConfig.features?.admin === false || cloneConfig.features?.admin === true) && cloneConfig.features?.teamArea === false, 'entrypoint live ancora guardati');

  const cloneFirebase = read(path.join(cloneRoot, 'assets', 'firebase.js'));
  check(cloneFirebase.includes('fantapetillomantramanager.firebaseapp.com'), 'clone firebase authDomain dedicato');
  check(cloneFirebase.includes('projectId: "fantapetillomantramanager"'), 'clone firebase projectId dedicato');
  check(!cloneFirebase.includes('zonaorientale-d07af') && !cloneFirebase.includes('AIzaSyB7YQM3'), 'clone non contiene Firebase ZonaOrientale');

  ['index.html', 'competition.html', 'player.html', 'bilanci.html'].forEach((page) => {
    const file = path.join(cloneRoot, page);
    const text = read(file);
    const versions = [...new Set((text.match(/\?v=\d+/g) || []).map((m) => m.slice(3)))];
    if (versions.length) check(versions.length === 1 && Number(versions[0]) >= 449, `${page} cache-buster V449`);
    check(!text.includes('/zonaorientale/') && !text.includes('silviobarra.com/zonaorientale'), `${page} senza URL pubblici ZonaOrientale`);
  });

  check(exists('tools/firestore-rules-v449.rules'), 'rules Firestore V449 incluse nel clone');
  const rules = read(path.join(cloneRoot, 'tools', 'firestore-rules-v449.rules'));
  check(rules.includes('match /admins/{uid}') && rules.includes('function isAdmin()'), 'rules con admins/isAdmin');
  check(rules.includes('allow read: if true;') && rules.includes('allow create, update, delete: if isAdmin();'), 'rules conservative dati pubblici/write admin');

  const readmePath = path.join(docsRoot, cloneSlug, 'README.md');
  const setupPath = path.join(docsRoot, cloneSlug, 'FIREBASE_SETUP_V449.md');
  check(fs.existsSync(readmePath), 'README clone presente');
  check(fs.existsSync(setupPath), 'documento Firebase setup V449 presente');
  const readme = fs.existsSync(readmePath) ? read(readmePath) : '';
  check(readme.includes('V449') && readme.includes('Firebase reale dedicato'), 'README clone aggiornato V449');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit Firebase clone V449 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit Firebase clone V449 superato: ${checks} controlli.`);
