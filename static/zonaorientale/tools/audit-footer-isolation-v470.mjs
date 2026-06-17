#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(siteRoot, '..', '..');

const specs = [
  {
    label: 'ZonaOrientale',
    dir: path.join(repoRoot, 'static', 'zonaorientale'),
    forbidden: /(fantapetillomantramanager|fanta\s*petillo|petillo)/i,
    message: 'ZonaOrientale non deve citare FantaPetilloMantraManager nel footer',
  },
  {
    label: 'FantaPetilloMantraManager',
    dir: path.join(repoRoot, 'static', 'fantapetillomantramanager'),
    forbidden: /(zonaorientale|zona\s*orientale)/i,
    message: 'FantaPetilloMantraManager non deve citare ZonaOrientale nel footer',
  },
];

const htmlFiles = ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'news.html'];
let failures = 0;

for (const spec of specs) {
  for (const htmlName of htmlFiles) {
    const file = path.join(spec.dir, htmlName);
    if (!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file, 'utf8');
    const footers = html.match(/<footer\b[\s\S]*?<\/footer>/gi) || [];
    for (const footer of footers) {
      if (spec.forbidden.test(footer)) {
        console.error(`FAIL: ${spec.message}: ${path.relative(repoRoot, file)}`);
        failures += 1;
      }
    }
  }
}

if (failures > 0) process.exit(1);
console.log('OK: footer isolati tra ZonaOrientale e FantaPetilloMantraManager');
