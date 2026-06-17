#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const toolsDir = path.dirname(__filename);
const siteRoot = path.resolve(toolsDir, '..');
const repoRoot = path.resolve(siteRoot, '..', '..');
const quiet = process.argv.includes('--quiet');
const jsonOnly = process.argv.includes('--json');
const baselinePath = path.join(toolsDir, 'hardcoded-league-refs-v444.json');

const textExtensions = new Set([
  '.html', '.js', '.mjs', '.css', '.json', '.md', '.sh', '.toml', '.txt'
]);
const ignoredDirs = new Set([
  '.git', 'node_modules', '__MACOSX', 'assets/listoni', 'assets/rose', 'assets/snapshots', 'assets/competitions', 'assets/logos'
]);
const ignoredFiles = new Set([
  'tools/hardcoded-league-refs-v444.json',
  'tools/audit-hardcoded-league-refs-v444.mjs'
]);
const tokens = [
  { key: 'slugLower', label: 'zonaorientale', needle: 'zonaorientale', next: 'league-config slug/basePath; do not rename runtime namespaces yet' },
  { key: 'namespaceCamel', label: 'ZonaOrientale', needle: 'ZonaOrientale', next: 'runtime namespace; keep stable before clone sandbox' },
  { key: 'spacedName', label: 'Zona Orientale', needle: 'Zona Orientale', next: 'human text/legacy branding' },
  { key: 'publicSiteUrl', label: 'silviobarra.com/zonaorientale', needle: 'silviobarra.com/zonaorientale', next: 'siteUrl/share URL from league-config' },
  { key: 'absoluteBasePath', label: '/zonaorientale/', needle: '/zonaorientale/', next: 'basePath from league-config after metadata/share pass' },
  { key: 'shareNews', label: 'share/news', needle: 'share/news', next: 'share route and Netlify news-share parametrization' },
  { key: 'bilanciLanding', label: 'bilanci.html', needle: 'bilanci.html', next: 'WhatsApp/Open Graph landing from league-config' },
  { key: 'logosPath', label: 'assets/logos', needle: 'assets/logos', next: 'logosBasePath from league-config in data-path pass' },
  { key: 'deployVersion', label: 'DEPLOY_EXPECTED_VERSION', needle: 'DEPLOY_EXPECTED_VERSION', next: 'version remains global deployment guardrail' }
];

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function shouldSkipDir(absPath) {
  const rel = toPosix(path.relative(siteRoot, absPath));
  if (!rel || rel.startsWith('..')) return false;
  return Array.from(ignoredDirs).some((dir) => rel === dir || rel.startsWith(`${dir}/`));
}

function isTextFile(absPath) {
  const ext = path.extname(absPath);
  if (!textExtensions.has(ext)) return false;
  try {
    const stat = fs.statSync(absPath);
    if (stat.size > 2_500_000) return false;
    const fd = fs.openSync(absPath, 'r');
    const buffer = Buffer.alloc(Math.min(512, stat.size));
    fs.readSync(fd, buffer, 0, buffer.length, 0);
    fs.closeSync(fd);
    return !buffer.includes(0);
  } catch {
    return false;
  }
}

function collectFiles(root, source) {
  if (!fs.existsSync(root)) return [];
  const out = [];
  function walk(current) {
    const stat = fs.statSync(current);
    if (stat.isDirectory()) {
      if (source === 'site' && shouldSkipDir(current)) return;
      for (const entry of fs.readdirSync(current)) walk(path.join(current, entry));
      return;
    }
    if (!stat.isFile() || !isTextFile(current)) return;
    const rel = source === 'site'
      ? toPosix(path.relative(siteRoot, current))
      : toPosix(path.relative(repoRoot, current));
    if (ignoredFiles.has(rel)) return;
    out.push({ absPath: current, relPath: rel, source });
  }
  walk(root);
  return out;
}

function classify(record, line) {
  const rel = record.relPath;
  if (record.source === 'docs') return 'docs';
  if (record.source === 'netlify' || rel === 'netlify.toml' || rel.startsWith('netlify/')) return 'netlify';
  if (rel === 'assets/league-config.json' || rel.includes('league-config-v443')) return 'league-config';
  if (rel.startsWith('tools/')) return 'audit-tools';
  if (rel.endsWith('.html') || rel.startsWith('comunicati/')) return 'public-pages-metadata';
  if (rel === 'assets/app.js' || rel.startsWith('assets/js/')) return 'runtime-code';
  if (rel.startsWith('assets/css/') || rel === 'assets/styles.css') return 'styles';
  if (rel.startsWith('assets/public/') || rel.startsWith('assets/calciomercato/')) return 'data-config';
  if (line.includes('Firebase') || line.includes('firebase')) return 'firebase-adjacent';
  return 'other-static';
}

function lineSnippet(line, needle) {
  const index = line.indexOf(needle);
  const start = Math.max(0, index - 70);
  const end = Math.min(line.length, index + needle.length + 70);
  return line.slice(start, end).replace(/\s+/g, ' ').trim();
}

function buildMap() {
  const files = [
    ...collectFiles(siteRoot, 'site'),
    ...collectFiles(path.join(repoRoot, 'docs', 'zonaorientale'), 'docs'),
    ...collectFiles(path.join(repoRoot, 'netlify'), 'netlify')
  ];
  const netlifyToml = path.join(repoRoot, 'netlify.toml');
  if (fs.existsSync(netlifyToml) && isTextFile(netlifyToml)) {
    files.push({ absPath: netlifyToml, relPath: 'netlify.toml', source: 'netlify' });
  }

  const summary = {};
  for (const token of tokens) {
    summary[token.key] = {
      label: token.label,
      totalMatches: 0,
      fileCount: 0,
      categories: {},
      topFiles: [],
      samples: [],
      nextAction: token.next
    };
  }

  for (const file of files) {
    const content = fs.readFileSync(file.absPath, 'utf8');
    const lines = content.split(/\r?\n/);
    for (const token of tokens) {
      let perFile = 0;
      for (let lineNo = 0; lineNo < lines.length; lineNo += 1) {
        const line = lines[lineNo];
        let pos = line.indexOf(token.needle);
        while (pos !== -1) {
          const bucket = summary[token.key];
          const category = classify(file, line);
          bucket.totalMatches += 1;
          perFile += 1;
          bucket.categories[category] = (bucket.categories[category] || 0) + 1;
          if (bucket.samples.length < 8) {
            bucket.samples.push({
              file: file.relPath,
              line: lineNo + 1,
              category,
              snippet: lineSnippet(line, token.needle)
            });
          }
          pos = line.indexOf(token.needle, pos + token.needle.length);
        }
      }
      if (perFile > 0) {
        const bucket = summary[token.key];
        bucket.fileCount += 1;
        bucket.topFiles.push({ file: file.relPath, matches: perFile });
      }
    }
  }

  for (const bucket of Object.values(summary)) {
    bucket.topFiles.sort((a, b) => b.matches - a.matches || a.file.localeCompare(b.file));
    bucket.topFiles = bucket.topFiles.slice(0, 12);
  }

  return {
    generatedBy: 'audit-hardcoded-league-refs-v444.mjs',
    version: 'V444',
    purpose: 'Inventory hard-coded league identity, public URLs, share routes, logo paths and deploy-version guardrails before multi-league refactors.',
    guardrail: 'Observation-only audit: no runtime behavior is changed and existing ZonaOrientale namespaces are intentionally preserved.',
    scannedRoots: files.reduce((acc, file) => ({ ...acc, [file.source]: (acc[file.source] || 0) + 1 }), {}),
    tokens: summary
  };
}

const map = buildMap();
const failures = [];
if (!fs.existsSync(path.join(siteRoot, 'assets', 'league-config.json'))) failures.push('assets/league-config.json mancante');
if (!map.tokens.slugLower.totalMatches) failures.push('nessun riferimento zonaorientale trovato: audit non significativo');
if (!map.tokens.namespaceCamel.totalMatches) failures.push('nessun namespace ZonaOrientale trovato: audit non significativo');
if (!map.tokens.publicSiteUrl.totalMatches) failures.push('nessun URL pubblico zonaorientale trovato: audit incompleto');
if (!map.tokens.deployVersion.totalMatches) failures.push('DEPLOY_EXPECTED_VERSION non trovato');

if (jsonOnly) {
  process.stdout.write(`${JSON.stringify(map, null, 2)}\n`);
} else if (!quiet) {
  console.log('Audit hard-coded league refs V444 - mappa osservativa');
  console.log(`File scansionati: ${Object.entries(map.scannedRoots).map(([k, v]) => `${k}:${v}`).join(', ')}`);
  for (const [key, bucket] of Object.entries(map.tokens)) {
    const categories = Object.entries(bucket.categories).map(([k, v]) => `${k}:${v}`).join(', ') || '-';
    console.log(`- ${key} (${bucket.label}): ${bucket.totalMatches} match in ${bucket.fileCount} file | ${categories}`);
  }
}

if (!fs.existsSync(baselinePath)) {
  failures.push('baseline tools/hardcoded-league-refs-v444.json mancante');
} else {
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  if (baseline.generatedBy !== map.generatedBy || baseline.version !== map.version) {
    failures.push('baseline V444 non riconosciuta');
  }
  if (!baseline.tokens?.slugLower?.totalMatches || !baseline.tokens?.namespaceCamel?.totalMatches) {
    failures.push('baseline V444 senza conteggi principali');
  }
}

if (failures.length) {
  for (const failure of failures) console.error(`x ${failure}`);
  process.exit(1);
}
if (!quiet && !jsonOnly) console.log('Audit hard-coded league refs V444 superato.');
