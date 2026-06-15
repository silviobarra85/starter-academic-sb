#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const scriptDir = path.dirname(new URL(import.meta.url).pathname);
const siteRoot = path.resolve(scriptDir, '..');
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
  check(Number(config.currentVersion) >= 450, 'config currentVersion V450');
  check(config.leagueId === 'fantapetillomantramanager', 'identity clone corretta');
  check(config.firebase?.projectId === 'fantapetillomantramanager', 'projectId Firebase dedicato');
  check(config.firebase?.adminBootstrapEnabled === true, 'Admin bootstrap abilitato in config');
  check(config.features?.admin === true, 'feature Admin attiva');
  check(config.features?.teamArea === false, 'feature Team Area ancora protetta');
  check(config.guardrails?.teamAreaEntrypointsGuardedUntilTeamUsersSeed === true, 'guardrail Team Area presente');
  check(config.guardrails?.firestoreRulesVersion === '450', 'rules V450 registrate');

  ['index.html', 'competition.html', 'player.html', 'bilanci.html'].forEach((page) => {
    const text = read(page);
    const versions = [...new Set((text.match(/\?v=\d+/g) || []).map((m) => m.slice(3)))];
    if (versions.length) check(versions.length === 1 && Number(versions[0]) >= 450, `${page} cache-buster V450+`);
    check(!text.includes('/zonaorientale/') && !text.includes('silviobarra.com/zonaorientale'), `${page} senza URL pubblici ZonaOrientale`);
  });

  const index = read('index.html');
  check(/fanta-petillo-admin-bootstrap-v450\.js\?v=\d+/.test(index), 'index carica guard Admin bootstrap V450 versionato');
  check(!index.includes('fanta-petillo-firebase-bootstrap-v449.js?v=452'), 'guard V449 non caricato in index');

  const guard = read('assets/js/core/fanta-petillo-admin-bootstrap-v450.js');
  check(guard.includes('hidesAdminEntrypoints: false'), 'guard non nasconde Admin');
  check(guard.includes('hidesLoginEntrypoint: false'), 'guard non nasconde login');
  check(guard.includes('hidesTeamAreaEntrypoints: true'), 'guard nasconde Team Area');
  check(guard.includes('noindex,nofollow'), 'guard mantiene noindex');
  check(!guard.includes("'[href=\"#admin\"]'") && !guard.includes("'#openLoginBtn'"), 'guard non disabilita selettori Admin/Login');

  const firebase = read('assets/firebase.js');
  check(firebase.includes('projectId: "fantapetillomantramanager"'), 'Firebase projectId dedicato presente');
  check(!firebase.includes('zonaorientale-d07af') && !firebase.includes('AIzaSyB7YQM3'), 'Firebase ZonaOrientale assente');

  check(exists('tools/firestore-rules-v450.rules'), 'rules V450 presenti');
  const rules = read('tools/firestore-rules-v450.rules');
  check(rules.includes('FantaPetilloMantraManager') && rules.includes('ZonaOrientale V393'), 'rules V450 documentano derivazione');
  check(rules.includes('function isApprovedTeamUser()'), 'rules presidenti complete presenti');
  check(rules.includes('match /transferNegotiations/{negotiationId}'), 'rules trattative complete presenti');
  check(rules.includes('match /soccerDataPlayerStats/{docId}'), 'rules Soccer Data presenti');
  check(rules.includes('match /news/{docId}') && rules.includes('allow write: if isAdmin();'), 'rules news admin-only');
  check(!rules.includes('match /{collectionName}/{documentId}'), 'nessuna wildcard write admin generica nelle rules V450');

  const app = read('assets/app.js');
  check(/DEPLOY_EXPECTED_VERSION_V181 = \"(45[0-9]|[5-9][0-9][0-9])\"/.test(app), 'DEPLOY_EXPECTED_VERSION clone V450+');
  check(app.includes('FantaPetilloAdminBootstrapV450'), 'marker app Admin bootstrap V450');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit Admin bootstrap V450 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit Admin bootstrap V450 superato: ${checks} controlli.`);
