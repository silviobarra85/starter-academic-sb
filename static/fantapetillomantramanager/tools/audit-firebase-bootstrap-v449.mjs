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
  check(Number(config.currentVersion) >= 449, 'config currentVersion V449');
  check(config.leagueId === 'fantapetillomantramanager' && config.slug === 'fantapetillomantramanager', 'identity clone corretta');
  check(config.guardrails?.dedicatedFirebaseProject === true, 'guardrail Firebase dedicato presente');
  check(config.guardrails?.firebaseDisabled === false, 'Firebase non piu disabilitato in config');
  check(config.firebase?.projectId === 'fantapetillomantramanager', 'projectId Firebase dedicato in config');
  check(config.firebase?.productionReady === false && config.firebase?.rulesRequired === true, 'bootstrap non produzione e rules richieste');
  check((config.features?.admin === false || config.features?.admin === true) && config.features?.teamArea === false, 'admin/teamArea ancora guardati');

  ['index.html', 'competition.html', 'player.html'].forEach((page) => {
    const text = read(page);
    check(text.includes('fanta-petillo-firebase-bootstrap-v449.js?v=452'), `${page} carica guard V449`);
    const versions = [...new Set((text.match(/\?v=\d+/g) || []).map((m) => m.slice(3)))];
    check(versions.length === 1 && Number(versions[0]) >= 449, `${page} cache-buster V449+`);
    check(!text.includes('/zonaorientale/') && !text.includes('silviobarra.com/zonaorientale'), `${page} senza URL pubblici ZonaOrientale`);
  });

  const guard = exists('assets/js/core/fanta-petillo-admin-bootstrap-v450.js') ? read('assets/js/core/fanta-petillo-admin-bootstrap-v450.js') : read('assets/js/core/fanta-petillo-firebase-bootstrap-v449.js');
  check(guard.includes('MutationObserver') && guard.includes('noindex,nofollow'), 'guard V449/V450 osserva DOM e aggiunge noindex');
  check(guard.includes('href="#teamarea"') || guard.includes('TEAM_AREA_SELECTORS_V450'), 'guard V449/V450 copre Team Area');
  check(guard.includes('realFirebaseConnected: true') || guard.includes('adminBootstrapEnabled: true'), 'guard V449/V450 dichiara Firebase reale collegato');

  const firebase = read('assets/firebase.js');
  check(firebase.includes('initializeApp(firebaseConfig)'), 'Firebase reale inizializzato');
  check(firebase.includes('fantapetillomantramanager.firebaseapp.com'), 'authDomain FantaPetillo presente');
  check(firebase.includes('projectId: "fantapetillomantramanager"'), 'projectId FantaPetillo presente');
  check(firebase.includes('getFirestore(app)') && firebase.includes('getAuth(app)'), 'Firestore/Auth inizializzati');
  check(!firebase.includes('zonaorientale-d07af') && !firebase.includes('AIzaSyB7YQM3'), 'Firebase ZonaOrientale assente');
  check(!firebase.includes('Firebase disabled sandbox adapter') && !firebase.includes('firebaseDisabled: true'), 'stub Firebase sandbox rimosso');

  const app = read('assets/app.js');
  check(/DEPLOY_EXPECTED_VERSION_V181 = "(449|450)"/.test(app), 'DEPLOY_EXPECTED_VERSION clone V449+');
  check(app.includes('FantaPetilloFirebaseBootstrapV449') || app.includes('FantaPetilloAdminBootstrapV450'), 'marker app Firebase/Admin bootstrap V449+');
  check(!app.includes('zonaorientale-d07af'), 'app senza projectId ZonaOrientale');

  const rules = exists('tools/firestore-rules-v450.rules') ? read('tools/firestore-rules-v450.rules') : read('tools/firestore-rules-v449.rules');
  check(rules.includes('rules_version = \'2\''), 'rules Firestore V449 presenti');
  check(rules.includes('match /admins/{uid}') && rules.includes('function isAdmin()'), 'rules con admins/isAdmin');
  check((rules.includes('match /pendingUsers/{uid}') || rules.includes('match /pendingUsers/{userId}')) && (rules.includes('match /teamUsers/{uid}') || rules.includes('match /teamUsers/{userId}')), 'rules utenti presenti');
  check(rules.includes('allow read: if true;') && rules.includes('allow create, update, delete: if isAdmin();'), 'rules letture pubbliche/write admin per raccolte dati');

  check(exists('assets/snapshots/seasons/2025-2026.json'), 'snapshot placeholder presente');
  check(!exists('assets/snapshots/seasons/2004-2005.json'), 'snapshot storico ZonaOrientale assente');
  check(exists('assets/listoni/manifest.json') && exists('assets/rose/manifest.json'), 'manifest placeholder presenti');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit Firebase bootstrap V449 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit Firebase bootstrap V449 superato: ${checks} controlli.`);
