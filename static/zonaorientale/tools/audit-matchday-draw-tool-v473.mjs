#!/usr/bin/env node
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const errors = [];
const checks = [];

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function assert(condition, message) {
  checks.push(message);
  if (!condition) errors.push(message);
}

const index = read('index.html');
const jsPath = 'assets/js/sections/matchday-draw-tool-v473.js';
const cssPath = 'assets/css/matchday-draw-tool-v473.css';
const config = JSON.parse(read('assets/league-config.json'));

assert(index.includes('data-page="sorteggio"'), 'index contiene pagina sorteggio');
assert(index.includes('data-page-link="sorteggio"'), 'index contiene link navigazione sorteggio');
assert(index.includes(`${cssPath}?v=473`), 'CSS sorteggio collegato con cache-buster V473');
assert(index.includes(`${jsPath}?v=473`), 'JS sorteggio collegato con cache-buster V473');
assert(existsSync(join(root, jsPath)), 'JS sorteggio presente');
assert(existsSync(join(root, cssPath)), 'CSS sorteggio presente');
assert(config.currentVersion === '473', 'league-config currentVersion V473');
assert(config.features?.matchdayDrawTool === true, 'feature matchdayDrawTool attiva');
assert(String(config.guardrails?.matchdayDrawToolVersion || '') === '473', 'guardrail matchdayDrawToolVersion V473');
assert(String(config.status?.lastOverlay || '').includes('V473'), 'status lastOverlay aggiornato a V473');
assert(index.includes('V473 · Ultimo aggiornamento 19/06/2026'), 'footer HTML V473 aggiornato');
assert(!index.includes('?v=472'), 'nessun cache-buster V472 residuo in index');

if (errors.length) {
  console.error('Audit sorteggio V473 fallito:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Audit sorteggio V473 OK (${checks.length} check).`);
