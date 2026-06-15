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
try {
  const zonaConfig = json(path.join(siteRoot, 'assets', 'league-config.json'));
  const cloneConfig = json(path.join(cloneRoot, 'assets', 'league-config.json'));
  check(zonaConfig.currentVersion === '453', 'ZonaOrientale currentVersion V453');
  check(cloneConfig.currentVersion === '453', 'clone currentVersion V453');
  check(cloneConfig.regolamento?.season === '2026-2027', 'clone regolamento season 2026-2027');
  check(fs.existsSync(path.join(cloneRoot, 'assets', 'regolamento', 'regolamento-fantapetillo-mantra-manager-2026-2027.pdf')), 'PDF regolamento clone presente');
  const module = read(path.join(cloneRoot, 'assets', 'js', 'sections', 'regolamento-section-v402.js'));
  check(module.includes('FantaPetilloRegolamentoSectionV453'), 'runtime regolamento V453 nel clone');
  check(module.includes('download>Scarica PDF'), 'download PDF nel clone');
  const zonaFirebase = read(path.join(siteRoot, 'assets', 'firebase.js'));
  check(zonaFirebase.includes('zonaorientale-d07af'), 'Firebase ZonaOrientale invariato');
  check(!zonaFirebase.includes('fantapetillomantramanager.firebaseapp.com'), 'Firebase FantaPetillo non importato in ZonaOrientale');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}
if (failures) {
  console.error(`Audit regolamento FantaPetillo V453 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit regolamento FantaPetillo V453 superato: ${checks} controlli.`);
