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
  check(Number(config.currentVersion) >= 448, `config currentVersion V${config.currentVersion}`);
  check(config.leagueId === 'fantapetillomantramanager' && config.slug === 'fantapetillomantramanager', 'identity clone corretta');
  check(config.sandbox?.enabled === true && (config.sandbox?.firebase === 'disabled' || config.sandbox?.firebase === 'dedicated-project-connected-bootstrap'), 'sandbox/Firebase stato compatibile V448+');
  check(config.guardrails?.readyForFirebaseConfig === true, 'readyForFirebaseConfig tracciato');
  check((config.features?.admin === false || config.features?.admin === true) && config.features?.teamArea === false, 'admin/teamArea disabilitati');

  ['index.html', 'competition.html', 'player.html'].forEach((page) => {
    const text = read(page);
    check(text.includes('fanta-petillo-sandbox-v448.js?v=466') || text.includes('fanta-petillo-firebase-bootstrap-v449.js?v=466'), `${page} carica guard V448/V449`);
    const versions = [...new Set((text.match(/\?v=\d+/g) || []).map((m) => m.slice(3)))];
    check(versions.length === 1 && Number(versions[0]) >= 448, `${page} cache-buster V${versions[0]}`);
    check(!text.includes('/zonaorientale/') && !text.includes('silviobarra.com/zonaorientale'), `${page} senza URL pubblici ZonaOrientale`);
  });

  const guard = exists('assets/js/core/fanta-petillo-firebase-bootstrap-v449.js') ? read('assets/js/core/fanta-petillo-firebase-bootstrap-v449.js') : read('assets/js/core/fanta-petillo-sandbox-v448.js');
  check(guard.includes('MutationObserver') && guard.includes('noindex,nofollow'), 'guard V448/V449 osserva DOM e aggiunge noindex');
  check(guard.includes('href="#admin"') && guard.includes('href="#teamarea"'), 'guard V448/V449 copre entrypoint admin/teamarea');

  const firebase = read('assets/firebase.js');
  check(firebase.includes('Firebase disabled sandbox adapter') || firebase.includes('fantapetillomantramanager.firebaseapp.com'), 'Firebase stub o dedicato attivo');
  check(firebase.includes('firebaseDisabled: true') || firebase.includes('FantaPetilloFirebaseConfigV449'), 'marker Firebase clone presente');
  check(!firebase.includes('zonaorientale-d07af') && !firebase.includes('AIzaSyB7YQM3'), 'nessuna config Firebase ZonaOrientale nel clone');

  check(exists('assets/snapshots/seasons/2025-2026.json'), 'snapshot placeholder presente');
  check(!exists('assets/snapshots/seasons/2004-2005.json'), 'snapshot storico ZonaOrientale assente');
  check(exists('assets/listoni/manifest.json') && exists('assets/rose/manifest.json'), 'manifest placeholder presenti');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit clone runtime QA V448 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit clone runtime QA V448 superato: ${checks} controlli.`);
