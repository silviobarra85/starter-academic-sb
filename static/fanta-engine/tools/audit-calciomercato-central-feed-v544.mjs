#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const requiredFiles = [
  'static/fanta-engine/data/shared-assets/current/assets/calciomercato/links.json',
  'static/fanta-engine/data/shared-assets/current/assets/calciomercato/archive/manifest.json',
  'netlify/functions/calciomercato-feed.js',
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'static/zonaorientale/assets/league-config.json',
  'static/fantapetillomantramanager/assets/league-config.json'
];

function read(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    failures.push(`File mancante: ${rel}`);
    return '';
  }
  return fs.readFileSync(abs, 'utf8');
}

for (const rel of requiredFiles) read(rel);

const centralLinks = '/fanta-engine/data/shared-assets/current/assets/calciomercato/links.json';
const centralArchive = '/fanta-engine/data/shared-assets/current/assets/calciomercato/archive/manifest.json';

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const app = read(`static/${league}/assets/app.js`);
  if (!app.includes(centralLinks)) failures.push(`${league}: app.js non contiene fallback assoluto al links.json centrale`);
  if (!app.includes(centralArchive)) failures.push(`${league}: app.js non contiene fallback assoluto al manifest archivio centrale`);
  if (!app.includes('Nessun archivio nel range corrente: uso gli ultimi giorni archiviati dal path centrale.')) {
    failures.push(`${league}: manca fallback agli ultimi giorni archiviati`);
  }
  if (!app.includes('FantaEngineCalciomercatoCentralFeedFixV544')) failures.push(`${league}: manca marker runtime V544`);
  const cfg = read(`static/${league}/assets/league-config.json`);
  if (!/"currentVersion"\s*:\s*"544"/.test(cfg)) failures.push(`${league}: league-config.json non allineato a currentVersion 544`);
}

const fn = read('netlify/functions/calciomercato-feed.js');
if (!fn.includes('/fanta-engine/data/shared-assets/current/assets/calciomercato/links.json')) {
  failures.push('calciomercato-feed.js non legge il links.json centrale');
}
if (!fn.includes('/zonaorientale/assets/calciomercato/links.json') || !fn.includes('/fantapetillomantramanager/assets/calciomercato/links.json')) {
  failures.push('calciomercato-feed.js non mantiene fallback legacy di sicurezza');
}

for (const rel of [
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html'
]) {
  const html = read(rel);
  if (!html.includes('assets/app.js?v=544')) failures.push(`${rel}: app.js non allineato a ?v=544`);
}

for (const dir of [
  'static/zonaorientale/assets/calciomercato',
  'static/fantapetillomantramanager/assets/calciomercato'
]) {
  if (fs.existsSync(path.join(root, dir))) {
    failures.push(`Fallback locale ancora presente dopo cleanup: ${dir}`);
  }
}

if (failures.length) {
  console.error('Audit V544 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Audit V544 superato: Calciomercato legge il path centrale fanta-engine, funzione Netlify aggiornata e runtime whole-site a ?v=544.');
