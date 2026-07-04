#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const errors = [];
const requiredCentral = [
  'static/fanta-engine/data/shared-assets/current/assets/calciomercato/links.json',
  'static/fanta-engine/data/shared-assets/current/assets/calciomercato/archive/manifest.json'
];

for (const rel of requiredCentral) {
  if (!fs.existsSync(path.join(root, rel))) errors.push(`Asset centrale mancante: ${rel}`);
}

for (const league of leagues) {
  const base = `static/${league}`;
  const app = path.join(root, base, 'assets/app.js');
  const index = path.join(root, base, 'index.html');
  const cfg = path.join(root, base, 'assets/league-config.json');
  const core = path.join(root, base, 'assets/js/core/league-config-v443.js');
  for (const file of [app, index, cfg, core]) {
    if (!fs.existsSync(file)) errors.push(`File mancante: ${path.relative(root, file)}`);
  }
  if (!fs.existsSync(app)) continue;
  const appText = fs.readFileSync(app, 'utf8');
  if (!appText.includes('getFantaEngineSharedAssetUrlCandidatesV545')) errors.push(`${base}/assets/app.js non contiene il resolver candidati V545`);
  if (!appText.includes('central-path-unavailable')) errors.push(`${base}/assets/app.js non contiene fallback configurato V545`);
  if (!appText.includes('calciomercato-feed?v=545')) errors.push(`${base}/assets/app.js non punta alla funzione Calciomercato ?v=545`);
  if (appText.includes('Impossibile leggere le fonti automatiche, il path centrale calciomercato e l\'archivio statico.')) {
    errors.push(`${base}/assets/app.js contiene ancora il messaggio hard-fail Calciomercato pre-V545`);
  }
  if (fs.existsSync(index) && !fs.readFileSync(index, 'utf8').includes('assets/app.js?v=545')) errors.push(`${base}/index.html non punta ad app.js?v=545`);
  if (fs.existsSync(cfg)) {
    const data = JSON.parse(fs.readFileSync(cfg, 'utf8'));
    if (String(data.currentVersion) !== '545') errors.push(`${base}/assets/league-config.json currentVersion != 545`);
    const links = data?.dataPaths?.calciomercatoLinks || '';
    if (!String(links).includes('fanta-engine/data/shared-assets/current/assets/calciomercato/links.json')) errors.push(`${base}/assets/league-config.json calciomercatoLinks non centrale`);
  }
  if (fs.existsSync(core)) {
    const text = fs.readFileSync(core, 'utf8');
    if (!text.includes("currentVersion: '545'")) errors.push(`${base}/league-config-v443.js default currentVersion non 545`);
    if (!text.includes("league-config.json?v=545")) errors.push(`${base}/league-config-v443.js CONFIG_URL non 545`);
  }
}

const functionPath = path.join(root, 'netlify/functions/calciomercato-feed.js');
if (fs.existsSync(functionPath)) {
  const text = fs.readFileSync(functionPath, 'utf8');
  if (!text.includes('/fanta-engine/data/shared-assets/current/assets/calciomercato/links.json')) {
    errors.push('netlify/functions/calciomercato-feed.js non cerca il links.json centrale');
  }
} else {
  errors.push('Funzione Netlify calciomercato-feed.js mancante');
}

if (errors.length) {
  console.error('Audit V545 fallito:');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log('Audit V545 superato: Calciomercato usa candidati path centrali robusti, fallback locali non richiesti e runtime whole-site a ?v=545.');
