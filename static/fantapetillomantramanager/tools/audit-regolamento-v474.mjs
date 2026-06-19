#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const quiet = process.argv.includes('--quiet');
const siteRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pdfRel = 'assets/regolamento/regolamento-fantapetillo-mantra-manager-2026-2027-v474.pdf';
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
  check(Number(config.currentVersion) >= 474, 'config currentVersion >= V474');
  check(config.regolamento?.version === '474', 'config regolamento version V474');
  check(config.regolamento?.season === '2026-2027', 'config regolamento season 2026-2027');
  check(config.regolamento?.pdf === `./${pdfRel}`, 'config pdf regolamento V474 collegato');
  check(config.dataPaths?.regolamentoPdf === `./${pdfRel}`, 'dataPaths regolamentoPdf V474 collegato');
  check(config.guardrails?.regolamentoPdf === pdfRel, 'guardrail regolamentoPdf V474 collegato');
  check(config.regolamento?.sourceDocument === 'FANTACALCIO_MANTRA_2026_2027-2.pdf', 'source document V474 registrato');
  check(exists(pdfRel), 'PDF regolamento V474 presente');
  const pdfSize = fs.statSync(path.join(siteRoot, pdfRel)).size;
  check(pdfSize > 2000000, 'PDF regolamento V474 non vuoto');

  const module = read('assets/js/sections/regolamento-section-v402.js');
  check(module.includes('FantaPetilloRegolamentoSectionV474'), 'marker runtime V474 presente');
  check(module.includes(pdfRel), 'link download/apri PDF V474 presente nel runtime');
  check(module.includes('download>Scarica PDF'), 'link download PDF presente');
  check(module.includes('Partecipazione: 40 FM'), 'montepremi crediti partecipazione aggiornato a 40 FM');
  check(module.includes('Vincitore Playoff: 6 FM'), 'montepremi crediti playoff aggiornato a 6 FM');
  check(module.includes('Vincitore Coppa Italia: 8 FM'), 'montepremi crediti Coppa Italia aggiornato a 8 FM');
  check(module.includes('Vincitore Champions League: 9 FM'), 'montepremi crediti Champions aggiornato a 9 FM');
  check(module.includes('Qualificazione Champions League: 3 FM'), 'montepremi crediti qualificazione Champions aggiornato a 3 FM');
  check((module.match(/class="panel rules-section"/g) || []).length >= 15, 'sezioni regolamento strutturate');

  const index = read('index.html');
  const versions = [...new Set((index.match(/\?v=\d+/g) || []).map((m) => m.slice(3)))];
  check(versions.length === 1 && Number(versions[0]) >= 474, 'cache-buster index >= V474');
  check(index.includes('FantaPetilloMantraManager · V474 · Ultimo aggiornamento 19/06/2026'), 'footer fallback index V474');
} catch (error) {
  fail(error?.stack || error?.message || String(error));
}

if (failures) {
  console.error(`Audit regolamento V474 fallito: ${failures}/${checks} controlli falliti.`);
  process.exit(1);
}
if (!quiet) console.log(`Audit regolamento V474 superato: ${checks} controlli.`);
