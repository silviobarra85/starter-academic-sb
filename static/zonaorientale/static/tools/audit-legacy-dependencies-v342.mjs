#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, '..');
const assetsRoot = path.join(siteRoot, 'assets');
const htmlFiles = ['index.html', 'competition.html', 'player.html', 'news.html']
  .map((name) => path.join(siteRoot, name))
  .filter((file) => fs.existsSync(file));

const args = new Set(process.argv.slice(2));
const jsonMode = args.has('--json');
const quiet = args.has('--quiet');

function rel(file) {
  return path.relative(siteRoot, file).split(path.sep).join('/');
}

function walk(dir, predicate = () => true) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, predicate));
    } else if (entry.isFile() && predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

function read(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

function stripQuery(value) {
  return String(value || '').split('#', 1)[0].split('?', 1)[0].trim();
}

function isIgnoredReference(value) {
  return !value
    || value.includes('${')
    || value.includes('}')
    || /\s/.test(value)
    || value.startsWith('#')
    || value.startsWith('//')
    || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(value);
}

function resolveReference(sourceFile, rawValue) {
  let value = stripQuery(rawValue);
  if (isIgnoredReference(value)) return null;
  if (value.startsWith('/zonaorientale/')) {
    value = value.slice('/zonaorientale/'.length);
  } else if (value.startsWith('/')) {
    return null;
  }
  let absolute;
  if (value.startsWith('./') || value.startsWith('../')) {
    absolute = path.resolve(path.dirname(sourceFile), value);
  } else if (value.startsWith('assets/') || value.endsWith('.html')) {
    absolute = path.resolve(siteRoot, value);
  } else {
    absolute = path.resolve(path.dirname(sourceFile), value);
  }
  if (!absolute.startsWith(siteRoot)) return null;
  return absolute;
}

const codeFiles = walk(assetsRoot, (file) => /\.(?:js|mjs|css)$/i.test(file));
const scannedFiles = [...htmlFiles, ...codeFiles];
const referencePattern = /(?:href|src)\s*=\s*["']([^"']+)["']|import\s+(?:[^"'()]+?\s+from\s+)?["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|url\(\s*["']?([^"')]+)["']?\s*\)/g;
const references = new Map();
const missingReferences = [];

for (const source of scannedFiles) {
  const text = read(source);
  for (const match of text.matchAll(referencePattern)) {
    const raw = match[1] || match[2] || match[3] || match[4];
    const target = resolveReference(source, raw);
    if (!target) continue;
    const targetRel = rel(target);
    if (!references.has(targetRel)) references.set(targetRel, new Set());
    references.get(targetRel).add(rel(source));
    if (!fs.existsSync(target)) {
      missingReferences.push({ source: rel(source), raw, target: targetRel });
    }
  }
}

function versionInfo(fileRel) {
  const parsed = path.posix.parse(fileRel);
  const match = parsed.name.match(/^(.*)-v(\d+)$/i);
  if (!match) return null;
  return {
    prefix: `${parsed.dir}/${match[1]}`.replace(/^\//, ''),
    version: Number(match[2]),
    ext: parsed.ext,
  };
}

const allCodeRel = codeFiles.map(rel).sort();
const referencedCode = new Set([...references.keys()].filter((item) => /\.(?:js|mjs|css)$/i.test(item)));
const grouped = new Map();
for (const fileRel of allCodeRel) {
  const info = versionInfo(fileRel);
  if (!info) continue;
  const key = `${info.prefix}${info.ext}`;
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key).push({ fileRel, ...info });
}
for (const group of grouped.values()) group.sort((a, b) => b.version - a.version);

const stableCounterparts = new Map();
for (const fileRel of allCodeRel) {
  const info = versionInfo(fileRel);
  if (!info) continue;
  const stableRel = `${info.prefix}${info.ext}`;
  if (allCodeRel.includes(stableRel)) stableCounterparts.set(fileRel, stableRel);
}

const candidateOrphans = [];
for (const fileRel of allCodeRel) {
  if (referencedCode.has(fileRel)) continue;
  if (fileRel === 'assets/app.js') continue;
  const info = versionInfo(fileRel);
  const stable = stableCounterparts.get(fileRel) || null;
  const group = info ? grouped.get(`${info.prefix}${info.ext}`) || [] : [];
  const newestInGroup = group[0]?.fileRel || null;
  const reason = stable
    ? `ha alias/stabile ${stable}`
    : newestInGroup && newestInGroup !== fileRel
      ? `versione piu recente nello stesso gruppo: ${newestInGroup}`
      : 'non referenziato direttamente da HTML/import/CSS url';
  candidateOrphans.push({ file: fileRel, reason, referencedBy: references.get(fileRel)?.size || 0 });
}

const superseded = candidateOrphans.filter((item) => /-v\d+\.(?:js|css|mjs)$/i.test(item.file));
const stableUnused = candidateOrphans.filter((item) => !/-v\d+\.(?:js|css|mjs)$/i.test(item.file));

const result = {
  version: 'V342',
  siteRoot,
  scanned: {
    html: htmlFiles.length,
    code: codeFiles.length,
    references: references.size,
  },
  missingReferences,
  superseded,
  stableUnused,
  notes: [
    'Questo audit non autorizza cancellazioni automatiche.',
    'Prima di rimuovere un file candidato, verificare grep, import dinamici, test browser e storico release.',
    'I moduli legacy possono rimanere presenti come fallback o documentazione tecnica.'
  ],
};

if (jsonMode) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else {
  console.log('# Audit dipendenze legacy V342');
  console.log('');
  console.log(`Sito: ${siteRoot}`);
  console.log(`HTML analizzati: ${result.scanned.html}`);
  console.log(`JS/CSS/MJS analizzati: ${result.scanned.code}`);
  console.log(`Riferimenti locali rilevati: ${result.scanned.references}`);
  console.log('');
  if (missingReferences.length) {
    console.log('## Riferimenti locali mancanti');
    for (const item of missingReferences.slice(0, 80)) {
      console.log(`- ${item.source} -> ${item.raw} => ${item.target}`);
    }
    if (missingReferences.length > 80) console.log(`- ... altri ${missingReferences.length - 80}`);
    console.log('');
  } else {
    console.log('OK: nessun riferimento locale mancante rilevato.');
    console.log('');
  }
  console.log('## Candidati versionati superati');
  if (superseded.length) {
    for (const item of superseded) console.log(`- ${item.file} (${item.reason})`);
  } else {
    console.log('- Nessun candidato versionato superato rilevato.');
  }
  console.log('');
  if (!quiet) {
    console.log('## Altri JS/CSS non referenziati direttamente');
    if (stableUnused.length) {
      for (const item of stableUnused) console.log(`- ${item.file} (${item.reason})`);
    } else {
      console.log('- Nessun altro candidato rilevato.');
    }
    console.log('');
  }
  console.log('## Regola di sicurezza');
  for (const note of result.notes) console.log(`- ${note}`);
}

if (missingReferences.length) process.exitCode = 1;
