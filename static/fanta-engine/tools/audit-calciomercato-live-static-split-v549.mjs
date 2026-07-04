#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'static/zonaorientale/assets/app.js',
  'static/fantapetillomantramanager/assets/app.js',
  'netlify/functions/calciomercato-feed.js',
  'docs/CALCIOMERCATO_LIVE_STATIC_SPLIT_V549.md',
  'docs/AI_ASSISTANT_HANDOFF_V549.md',
  'docs/AI_ASSISTANT_HANDOFF_CURRENT.md'
];
const errors = [];
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) errors.push(`File mancante: ${rel}`);
}
for (const rel of ['static/zonaorientale/assets/app.js', 'static/fantapetillomantramanager/assets/app.js']) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8');
  if (!text.includes('FantaEngineCalciomercatoLiveStaticSplitV549')) errors.push(`Runtime V549 non installato: ${rel}`);
  if (!text.includes('CALCIOMERCATO_LIVE_WINDOW_HOURS_V549 = 72')) errors.push(`Live window 3 giorni non impostata: ${rel}`);
  if (!text.includes('loadOlderCalciomercatoArticlesV549')) errors.push(`Older articles static archive non installato: ${rel}`);
  if (!text.includes('calciomercato-feed?v=549')) errors.push(`Feed cache-buster V549 mancante: ${rel}`);
}
const fn = fs.readFileSync(path.join(root, 'netlify/functions/calciomercato-feed.js'), 'utf8');
if (!fn.includes("version: 'V549'")) errors.push('Netlify function non marca risposta V549');
if (!fn.includes('dateFallbackUsed')) errors.push('Netlify function senza fallback no-range V549');
if (!fn.includes('fanta-engine/data/shared-assets/current/assets/calciomercato/links.json')) errors.push('Netlify function non usa config centrale');
for (const rel of [
  'static/zonaorientale/assets/calciomercato',
  'static/fantapetillomantramanager/assets/calciomercato'
]) {
  if (fs.existsSync(path.join(root, rel))) errors.push(`Fallback locale ancora presente: ${rel}`);
}
if (errors.length) {
  console.error('Audit V549 fallito:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Audit V549 superato: Calciomercato live ultimi 3 giorni via Netlify Function, archivio statico centrale per storico e runtime whole-site a ?v=549.');
