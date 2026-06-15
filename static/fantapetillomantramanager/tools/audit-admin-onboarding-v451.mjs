#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const siteRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
let failures = 0;
let checks = 0;
function ok(message) { checks += 1; if (!quiet) console.log(`OK: ${message}`); }
function fail(message) { checks += 1; failures += 1; console.error(`FAIL: ${message}`); }
function check(condition, message) { condition ? ok(message) : fail(message); }
function read(rel) { return fs.readFileSync(path.join(siteRoot, rel), 'utf8'); }
function json(rel) { return JSON.parse(read(rel)); }
function exists(rel) { return fs.existsSync(path.join(siteRoot, rel)); }

try {
  const config = json('assets/league-config.json');
  check(Number(config.currentVersion) >= 451, 'config currentVersion V451+');
  check(config.leagueId === 'fantapetillomantramanager', 'identity clone corretta');
  check(config.firebase?.projectId === 'fantapetillomantramanager', 'Firebase dedicato');
  check(config.features?.admin === true, 'Admin attivo');
  check(config.features?.teamArea === false, 'Team Area ancora protetta');
  check(config.guardrails?.adminOnboardingEnabled === true, 'guardrail onboarding Admin presente');
  check(config.guardrails?.firestoreRulesVersion === '450', 'rules restano V450');

  const index = read('index.html');
  check(/fanta-petillo-admin-onboarding-v451\.js\?v=\d+/.test(index), 'index carica onboarding Admin V451 versionato');
  check(/fanta-petillo-admin-bootstrap-v450\.js\?v=\d+/.test(index), 'index mantiene guard Admin bootstrap versionato');
  const versions = [...new Set((index.match(/\?v=\d+/g) || []).map((m) => m.slice(3)))];
  check(versions.length === 1 && Number(versions[0]) >= 451, 'index cache-buster V451+');

  const onboarding = read('assets/js/core/fanta-petillo-admin-onboarding-v451.js');
  check(onboarding.includes('writesToFirebase: false'), 'onboarding non scrive su Firebase');
  check(onboarding.includes('unlocksTeamArea: false'), 'onboarding non sblocca Team Area');
  check(onboarding.includes('adminPublicSnapshotsPanel'), 'onboarding guida agli snapshot pubblici');
  check(onboarding.includes('MutationObserver'), 'onboarding si aggiorna dopo render Admin');

  const guard = read('assets/js/core/fanta-petillo-admin-bootstrap-v450.js');
  check(guard.includes('hidesAdminEntrypoints: false'), 'guard mantiene Admin visibile');
  check(guard.includes('hidesTeamAreaEntrypoints: true'), 'guard mantiene Team Area nascosta');
  check(guard.includes('noindex,nofollow'), 'guard mantiene noindex');

  const app = read('assets/app.js');
  check(/DEPLOY_EXPECTED_VERSION_V181 = \"(45[1-9]|[5-9][0-9][0-9])\"/.test(app), 'DEPLOY_EXPECTED_VERSION clone V451+');
  check(app.includes('FantaPetilloAdminOnboardingV451'), 'marker app onboarding V451');

  const css = read('assets/styles.css');
  check(css.includes('onboarding-panel-v451'), 'CSS onboarding presente');

  const checklist = json('tools/fantapetillo-setup-checklist-v451.json');
  check(checklist.version === 451 && checklist.teamAreaStillGuarded === true, 'checklist setup V451 valida');

  const rules = read('tools/firestore-rules-v450.rules');
  check(rules.includes('function isApprovedTeamUser()'), 'rules V450 complete ancora presenti');
  const firebase = read('assets/firebase.js');
  check(firebase.includes('projectId: "fantapetillomantramanager"'), 'firebase clone dedicato');
  check(!firebase.includes('zonaorientale-d07af'), 'firebase ZonaOrientale assente');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit onboarding V451 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit onboarding V451 superato: ${checks} controlli.`);
