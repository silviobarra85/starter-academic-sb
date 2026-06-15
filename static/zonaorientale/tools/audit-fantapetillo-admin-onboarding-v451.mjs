#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const siteRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const staticRoot = path.resolve(siteRoot, '..');
const cloneRoot = path.join(staticRoot, 'fantapetillomantramanager');
const docsRoot = path.resolve(siteRoot, '..', '..', 'docs');
let failures = 0;
let checks = 0;
function ok(message) { checks += 1; if (!quiet) console.log(`OK: ${message}`); }
function fail(message) { checks += 1; failures += 1; console.error(`FAIL: ${message}`); }
function check(condition, message) { condition ? ok(message) : fail(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function json(file) { return JSON.parse(read(file)); }

try {
  const zonaConfig = json(path.join(siteRoot, 'assets', 'league-config.json'));
  check(Number(zonaConfig.currentVersion) >= 451, 'ZonaOrientale currentVersion V451+');
  check(zonaConfig.guardrails?.cloneAdminOnboardingReady === true, 'ZonaOrientale traccia onboarding clone V451');
  const zonaFirebase = read(path.join(siteRoot, 'assets', 'firebase.js'));
  check(zonaFirebase.includes('zonaorientale-d07af'), 'Firebase ZonaOrientale invariato');
  check(!zonaFirebase.includes('fantapetillomantramanager.firebaseapp.com'), 'Firebase FantaPetillo non importato in ZonaOrientale');

  const cloneConfig = json(path.join(cloneRoot, 'assets', 'league-config.json'));
  check(Number(cloneConfig.currentVersion) >= 451, 'clone currentVersion V451+');
  check(cloneConfig.features?.admin === true, 'Admin clone ancora abilitato');
  check(cloneConfig.features?.teamArea === false, 'Team Area clone ancora protetta');
  check(cloneConfig.guardrails?.adminOnboardingEnabled === true, 'guardrail onboarding presente nel clone');

  const index = read(path.join(cloneRoot, 'index.html'));
  check(index.includes('fanta-petillo-admin-onboarding-v451.js?v=453'), 'clone carica onboarding V451');
  check(index.includes('fanta-petillo-admin-bootstrap-v450.js?v=453'), 'clone mantiene guard V450 con cache V451+');

  const onboarding = read(path.join(cloneRoot, 'assets', 'js', 'core', 'fanta-petillo-admin-onboarding-v451.js'));
  check(onboarding.includes('writesToFirebase: false') && onboarding.includes('unlocksTeamArea: false'), 'onboarding e solo guida read-only');

  const setupDoc = path.join(docsRoot, 'fantapetillomantramanager', 'PRIMO_SETUP_DATI_V451.md');
  check(fs.existsSync(setupDoc), 'doc setup dati V451 presente');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit onboarding clone V451 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit onboarding clone V451 superato: ${checks} controlli.`);
