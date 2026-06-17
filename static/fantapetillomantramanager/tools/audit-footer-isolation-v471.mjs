#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(siteRoot, '..', '..');

const htmlFiles = ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'news.html'];
const specs = [
  {
    label: 'ZonaOrientale',
    dir: path.join(repoRoot, 'static', 'zonaorientale'),
    required: /ZonaOrientale/i,
    forbidden: /(fantapetillomantramanager|fanta\s*petillo|petillo|audit\s*clone|clone\s*fanta|setup\s*standard\s*admin|cleanup\s*audit\s*multi-lega)/i,
    expectedPrefix: 'ZonaOrientale Salerno · V471',
  },
  {
    label: 'FantaPetilloMantraManager',
    dir: path.join(repoRoot, 'static', 'fantapetillomantramanager'),
    required: /FantaPetilloMantraManager/i,
    forbidden: /(zonaorientale|zona\s*orientale|audit\s*clone|clone\s*fanta|setup\s*standard\s*admin|cleanup\s*audit\s*multi-lega)/i,
    expectedPrefix: 'FantaPetilloMantraManager · V471',
  },
];
let failures = 0;

for (const spec of specs) {
  for (const htmlName of htmlFiles) {
    const file = path.join(spec.dir, htmlName);
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    const footers = html.match(/<footer\b[\s\S]*?<\/footer>/gi) || [];
    if (footers.length === 0 && ['index.html', 'competition.html', 'player.html'].includes(htmlName)) {
      console.error(`FAIL: footer mancante in ${path.relative(repoRoot, file)}`);
      failures += 1;
      continue;
    }
    for (const footer of footers) {
      const text = footer.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      if (!spec.required.test(text)) {
        console.error(`FAIL: footer ${spec.label} senza nome lega corretto: ${path.relative(repoRoot, file)}`);
        failures += 1;
      }
      if (!text.includes(spec.expectedPrefix)) {
        console.error(`FAIL: footer ${spec.label} non normalizzato V471: ${path.relative(repoRoot, file)} -> ${text}`);
        failures += 1;
      }
      if (spec.forbidden.test(text)) {
        console.error(`FAIL: footer ${spec.label} contiene riferimento/etichetta vietata: ${path.relative(repoRoot, file)} -> ${text}`);
        failures += 1;
      }
    }
  }
}

if (failures > 0) process.exit(1);
console.log('OK: footer V471 normalizzati e isolati tra le due leghe');
