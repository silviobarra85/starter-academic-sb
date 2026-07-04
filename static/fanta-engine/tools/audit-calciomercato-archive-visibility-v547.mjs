#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const failures = [];
const read = (relative) => fs.readFileSync(path.join(ROOT, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(ROOT, relative));

const files = [
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'static/zonaorientale/assets/js/core/league-config-v443.js',
  'static/fantapetillomantramanager/assets/js/core/league-config-v443.js',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json',
  'docs/CALCIOMERCATO_ARCHIVE_VISIBILITY_V547.md',
  'docs/AI_ASSISTANT_HANDOFF_V547.md',
  'docs/AI_ASSISTANT_HANDOFF_CURRENT.md'
];

for (const file of files) {
  if (!exists(file)) failures.push(`File mancante: ${file}`);
}

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const appPath = `static/${league}/assets/app.js`;
  if (exists(appPath)) {
    const app = read(appPath);
    if (!app.includes('ensureCalciomercatoVisibleArchiveRangeV547')) failures.push(`Guardia V547 mancante in ${appPath}`);
    if (!app.includes('setCalciomercatoRangeToArchiveDaysV547')) failures.push(`Allineamento range V547 mancante in ${appPath}`);
    if (!app.includes('/.netlify/functions/calciomercato-feed?v=547')) failures.push(`Feed Calciomercato non allineato a v=547 in ${appPath}`);
    if (!app.includes('localFallbacksRequired: false')) failures.push(`Guardrail fallback locali mancante in ${appPath}`);
  }

  const configPath = `static/${league}/assets/league-config.json`;
  if (exists(configPath)) {
    const config = JSON.parse(read(configPath));
    if (String(config.currentVersion) !== '547') failures.push(`currentVersion non V547 in ${configPath}`);
    if (Number(config.version) !== 547) failures.push(`version non 547 in ${configPath}`);
    if (!config.calciomercatoArchiveVisibilityV547) failures.push(`metadata calciomercatoArchiveVisibilityV547 mancante in ${configPath}`);
  }

  const indexPath = `static/${league}/index.html`;
  if (exists(indexPath) && !read(indexPath).includes('app.js?v=547')) failures.push(`index non carica app.js?v=547 in ${indexPath}`);
}

const centralManifest = 'static/fanta-engine/data/shared-assets/current/assets/calciomercato/archive/manifest.json';
if (!exists(centralManifest)) {
  failures.push(`Manifest centrale Calciomercato mancante: ${centralManifest}`);
} else {
  const manifest = JSON.parse(read(centralManifest));
  const days = Array.isArray(manifest.availableDays) ? manifest.availableDays : [];
  if (!days.length) failures.push('Manifest centrale Calciomercato senza availableDays');
  const latest = days.slice().sort().slice(-1)[0];
  if (latest && !exists(`static/fanta-engine/data/shared-assets/current/assets/calciomercato/archive/${latest}.json`)) {
    failures.push(`Ultimo giorno archivio indicato dal manifest non trovato: ${latest}.json`);
  }
}

for (const legacy of [
  'static/zonaorientale/assets/calciomercato',
  'static/fantapetillomantramanager/assets/calciomercato'
]) {
  if (exists(legacy)) failures.push(`Fallback locale Calciomercato ancora presente: ${legacy}`);
}

if (failures.length) {
  console.error('Audit V547 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Audit V547 superato: Calciomercato mostra gli articoli dell archivio centrale allineando il range visibile, senza ripristinare fallback locali e runtime whole-site a ?v=547.');
