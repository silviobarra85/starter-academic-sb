#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
const quiet = process.argv.includes('--quiet');
const siteRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const cloneRoot = path.resolve(siteRoot, '..', 'fantapetillomantramanager');
let failures = 0;
let checks = 0;
function ok(message) { checks += 1; if (!quiet) console.log(`OK: ${message}`); }
function fail(message) { checks += 1; failures += 1; console.error(`FAIL: ${message}`); }
function check(condition, message) { condition ? ok(message) : fail(message); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function json(file) { return JSON.parse(read(file)); }
function checkSite(root, label) {
  const config = json(path.join(root, 'assets', 'league-config.json'));
  const index = read(path.join(root, 'index.html'));
  const runtime = read(path.join(root, 'assets', 'js', 'core', 'admin-card-visibility-v455.js'));
  const css = read(path.join(root, 'assets', 'css', 'refactor', 'admin-card-visibility-v455.css'));
  check(config.currentVersion === '455', `${label} currentVersion V455`);
  check(index.includes('admin-card-visibility-v455.css?v=466'), `${label} CSS linkato`);
  check(index.includes('admin-card-visibility-v455.js?v=466'), `${label} JS linkato`);
  check(runtime.includes('manualQaPanelV358') && runtime.includes('showQaChecklist'), `${label} toggle QA presente`);
  check(runtime.includes('setSelectedCards([])'), `${label} default nessuna card selezionata`);
  check(css.includes('.admin-card-hidden-v455') && css.includes('.admin-category-empty-v455'), `${label} CSS card/category hidden`);
}
try {
  checkSite(siteRoot, 'ZonaOrientale');
  checkSite(cloneRoot, 'FantaPetillo');
  const zonaFirebase = read(path.join(siteRoot, 'assets', 'firebase.js'));
  const cloneFirebase = read(path.join(cloneRoot, 'assets', 'firebase.js'));
  check(zonaFirebase.includes('zonaorientale-d07af'), 'Firebase ZonaOrientale invariato');
  check(!zonaFirebase.includes('fantapetillomantramanager.firebaseapp.com'), 'Firebase FantaPetillo non importato in ZonaOrientale');
  check(cloneFirebase.includes('fantapetillomantramanager.firebaseapp.com'), 'Firebase FantaPetillo invariato nel clone');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}
if (failures) {
  console.error(`Audit selettore card Admin V455 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit selettore card Admin V455 superato: ${checks} controlli.`);
