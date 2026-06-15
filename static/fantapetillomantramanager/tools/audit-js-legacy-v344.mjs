#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, '..');
const appFile = path.join(siteRoot, 'assets', 'app.js');
const calciomercatoJsDir = path.join(siteRoot, 'assets', 'js', 'calciomercato');

const requiredFiles = [
  'calciomercato-images-v334.js',
  'calciomercato-render-v338.js',
  'calciomercato-filters-v339.js',
  'calciomercato-admin-v340.js',
  'calciomercato-players-v359.js'
].map((name) => path.join(calciomercatoJsDir, name));

const removedFiles = [
  'calciomercato-players-v335.js',
  'calciomercato-players-v337.js'
].map((name) => path.join(calciomercatoJsDir, name));

function rel(file) {
  return path.relative(siteRoot, file).split(path.sep).join('/');
}

function read(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

const appText = read(appFile);
const appImportLines = appText.split(/\r?\n/).filter((line) => /^\s*import\b/.test(line));
const checks = [];

for (const file of requiredFiles) {
  checks.push({
    name: `modulo attivo presente: ${rel(file)}`,
    ok: fs.existsSync(file)
  });
}

for (const file of removedFiles) {
  checks.push({
    name: `modulo legacy rimosso: ${rel(file)}`,
    ok: !fs.existsSync(file)
  });
}

checks.push({
  name: 'app.js importa createCalciomercatoPlayerHelpersV359',
  ok: /import\s*\{\s*createCalciomercatoPlayerHelpersV359\s*\}/.test(appText)
});
checks.push({
  name: 'app.js non importa moduli player V335/V337',
  ok: !appImportLines.some((line) => /calciomercato-players-v33[57]\.js/.test(line))
});
checks.push({
  name: 'wrapper tag giocatore V335 preservato',
  ok: /function\s+renderCalciomercatoPlayerTagsV335\s*\(/.test(appText)
});
checks.push({
  name: 'wrapper hash/modal timeline V335 preservato',
  ok: /function\s+activateCalciomercatoPlayerTimelineFromHashV335\s*\(/.test(appText)
});
checks.push({
  name: 'diagnostica V344 esposta',
  ok: /ZonaOrientaleJsLegacyCleanupV344/.test(appText)
});

const ok = checks.every((item) => item.ok);
const quiet = process.argv.includes('--quiet');
const json = process.argv.includes('--json');

if (json) {
  process.stdout.write(`${JSON.stringify({ version: 'V344', ok, checks }, null, 2)}\n`);
} else if (!quiet || !ok) {
  console.log('# Audit JS legacy Calciomercato V344');
  for (const item of checks) {
    console.log(`${item.ok ? 'OK' : 'FAIL'} - ${item.name}`);
  }
}

if (!ok) process.exitCode = 1;
