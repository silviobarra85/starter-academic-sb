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
try {
  const config = json('assets/league-config.json');
  check(config.currentVersion === '455', 'config currentVersion V455');
  const index = read('index.html');
  check(index.includes('admin-card-visibility-v455.css?v=466'), 'CSS selettore Admin linkato');
  check(index.includes('admin-card-visibility-v455.js?v=466'), 'JS selettore Admin linkato');
  const versions = [...new Set((index.match(/\?v=\d+/g) || []).map((m) => m.slice(3)))];
  check(versions.length === 1 && versions[0] === '454', 'cache-buster index V455');
  const js = read('assets/js/core/admin-card-visibility-v455.js');
  check(js.includes('defaultVisibleCards') || js.includes('selectedCards'), 'runtime selettore card presente');
  check(js.includes('manualQaPanelV358') && js.includes('showQaChecklist'), 'toggle Checklist QA presente');
  check(js.includes('setSelectedCards([])') && js.includes('Nascondi tutte'), 'default/azione nascondi tutte presente');
  const css = read('assets/css/refactor/admin-card-visibility-v455.css');
  check(css.includes('.admin-card-hidden-v455') && css.includes('.admin-qa-hidden-v454'), 'CSS nascondimento card e QA presente');
  const app = read('assets/app.js');
  check(app.includes('LeagueAdminCardVisibilityReleaseV455'), 'marker release V455 in app.js');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}
if (failures) {
  console.error(`Audit selettore card Admin V455 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit selettore card Admin V455 superato: ${checks} controlli.`);
