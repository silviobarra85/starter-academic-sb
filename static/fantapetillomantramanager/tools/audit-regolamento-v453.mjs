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
function exists(rel) { return fs.existsSync(path.join(siteRoot, rel)); }
function json(rel) { return JSON.parse(read(rel)); }
try {
  const config = json('assets/league-config.json');
  check(Number(config.currentVersion) >= 453, 'config currentVersion >= V453');
  check(config.regolamento?.season === '2026-2027', 'config regolamento season 2026-2027');
  check(config.regolamento?.pdf === './assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027.pdf', 'config pdf regolamento collegato');
  check(exists('assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027.pdf'), 'PDF regolamento presente');
  const pdfSize = fs.statSync(path.join(siteRoot, 'assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027.pdf')).size;
  check(pdfSize > 1000000, 'PDF regolamento non vuoto');
  const module = read('assets/js/sections/regolamento-section-v402.js');
  check(module.includes('FantaPetilloRegolamentoSectionV453'), 'marker runtime V453 presente');
  check(module.includes('Fantacalcio MANTRA&reg; Manageriale 2026-2027'), 'titolo regolamento 2026-2027 presente');
  check(module.includes('download>Scarica PDF'), 'link download PDF presente');
  check((module.match(/class="panel rules-section"/g) || []).length >= 15, 'sezioni regolamento strutturate');
  check(module.includes('Montepremi') && module.includes('1120&euro;'), 'montepremi sintetizzato');
  check(module.includes('D-Factor') && module.includes('Fairplay'), 'modificatori sintetizzati');
  const index = read('index.html');
  const versions = [...new Set((index.match(/\?v=\d+/g) || []).map((m) => m.slice(3)))];
  check(versions.length === 1 && Number(versions[0]) >= 453, 'cache-buster index >= V453');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}
if (failures) {
  console.error(`Audit regolamento V453 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit regolamento V453 superato: ${checks} controlli.`);
