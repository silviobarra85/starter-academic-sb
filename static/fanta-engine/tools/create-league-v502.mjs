#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VERSION = 'V502';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(staticRoot, '..');
const templateRoot = path.join(staticRoot, '_league-template');

function usage() {
  console.log(`Uso: node static/fanta-engine/tools/create-league-v502.mjs <slug> --name "Nome Lega" [--short "NL"] [--season "2026-2027"] [--version 502] [--force]`);
}

function parseArgs(argv) {
  const args = { force: false, season: '2026-2027', version: '502' };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--force') { args.force = true; continue; }
    if (item === '--name') { args.name = argv[++i]; continue; }
    if (item === '--short') { args.short = argv[++i]; continue; }
    if (item === '--season') { args.season = argv[++i]; continue; }
    if (item === '--version') { args.version = argv[++i]; continue; }
    rest.push(item);
  }
  args.slug = rest[0];
  return args;
}

function assertSlug(slug) {
  if (!slug || !/^[a-z0-9][a-z0-9-]{2,60}$/.test(slug)) {
    throw new Error('Slug non valido. Usa solo minuscole, numeri e trattini, lunghezza 3-61.');
  }
  if (['zonaorientale', 'fantapetillomantramanager', 'fanta-engine', 'media', 'static'].includes(slug)) {
    throw new Error(`Slug riservato: ${slug}`);
  }
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function replaceAll(content, replacements) {
  let out = content;
  for (const [from, to] of Object.entries(replacements)) out = out.split(from).join(to);
  return out;
}

function copyTemplate(srcRoot, destRoot, replacements) {
  for (const src of walk(srcRoot)) {
    const rel = path.relative(srcRoot, src);
    if (rel.startsWith(`docs${path.sep}`)) continue;
    const dest = path.join(destRoot, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const textLike = /\.(html|js|json|css|md|example)$/i.test(src);
    if (textLike) {
      fs.writeFileSync(dest, replaceAll(fs.readFileSync(src, 'utf8'), replacements), 'utf8');
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

function writeDocs(docsRoot, replacements) {
  fs.mkdirSync(docsRoot, { recursive: true });
  const readme = `# ${replacements.__LEAGUE_NAME__}\n\nCartella documentale generata da fanta-engine ${VERSION}.\n\n## Checklist prima del go-live\n\n- completare assets/league-config.json;\n- creare progetto Firebase dedicato o disabilitare le funzioni Firebase;\n- creare servizio/template EmailJS dedicati o disabilitare le funzioni email;\n- aggiungere dati reali e snapshot pubblici;\n- valutare redirect Netlify;\n- eseguire audit e test browser;\n- verificare mobile, footer e separazione dalle altre leghe.\n`;
  fs.writeFileSync(path.join(docsRoot, 'README.md'), readme, 'utf8');
  fs.writeFileSync(path.join(docsRoot, 'HANDOFF_TEMPLATE_V502.md'), `# Handoff template V502\n\nLega: ${replacements.__LEAGUE_NAME__}\nSlug: ${replacements.__LEAGUE_SLUG__}\nStagione: ${replacements.__SEASON_ID__}\n\nQuesta lega e' stata generata da template. Non considerarla pronta per produzione senza revisione manuale.\n`, 'utf8');
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (!args.slug || !args.name) { usage(); process.exit(1); }
  assertSlug(args.slug);
  if (!fs.existsSync(templateRoot)) throw new Error(`Template non trovato: ${templateRoot}`);

  const destLeague = path.join(staticRoot, args.slug);
  const destDocs = path.join(repoRoot, 'docs', args.slug);
  if (!args.force && (fs.existsSync(destLeague) || fs.existsSync(destDocs))) {
    throw new Error('Destinazione gia esistente. Usa --force solo se sai cosa stai sovrascrivendo.');
  }
  if (args.force) {
    fs.rmSync(destLeague, { recursive: true, force: true });
    fs.rmSync(destDocs, { recursive: true, force: true });
  }
  const shortName = args.short || args.name;
  const replacements = {
    '__LEAGUE_SLUG__': args.slug,
    '__LEAGUE_NAME__': args.name,
    '__LEAGUE_SHORT_NAME__': shortName,
    '__SEASON_ID__': args.season,
    '__CACHE_VERSION__': String(args.version)
  };
  copyTemplate(templateRoot, destLeague, replacements);
  writeDocs(destDocs, replacements);
  console.log(`OK - creata nuova lega template: static/${args.slug}`);
  console.log(`OK - creata documentazione: docs/${args.slug}`);
  console.log('TODO - configura Firebase, EmailJS, dati, Netlify e audit prima del go-live.');
} catch (error) {
  console.error(`Errore create-league ${VERSION}: ${error.message}`);
  process.exit(1);
}
