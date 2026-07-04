#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const VERSION = 'V507';
const RESERVED_SLUGS = new Set(['zonaorientale', 'fantapetillomantramanager', 'fanta-engine', 'media', 'static', '_league-template']);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(staticRoot, '..');
const templateRoot = path.join(staticRoot, '_league-template');
const validatorScript = path.join(__dirname, 'validate-league-config-v507.mjs');

function usage() {
  console.log(`Uso: node static/fanta-engine/tools/create-league-v507.mjs <slug> --name "Nome Lega" [--short "NL"] [--season "2026-2027"] [--version 507] [--site-url "https://..."] [--dry-run] [--force]`);
}

function parseArgs(argv) {
  const args = { force: false, dryRun: false, season: '2026-2027', version: '507' };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--force') { args.force = true; continue; }
    if (item === '--dry-run') { args.dryRun = true; continue; }
    if (item === '--name') { args.name = argv[++i]; continue; }
    if (item === '--short') { args.short = argv[++i]; continue; }
    if (item === '--season') { args.season = argv[++i]; continue; }
    if (item === '--version') { args.version = argv[++i]; continue; }
    if (item === '--site-url') { args.siteUrl = argv[++i]; continue; }
    rest.push(item);
  }
  args.slug = rest[0];
  return args;
}

function assertSlug(slug) {
  if (!slug || !/^[a-z0-9][a-z0-9-]{2,60}$/.test(slug)) {
    throw new Error('Slug non valido. Usa solo minuscole, numeri e trattini, lunghezza 3-61.');
  }
  if (RESERVED_SLUGS.has(slug)) throw new Error(`Slug riservato: ${slug}`);
  if (slug.includes('--')) throw new Error('Slug non valido: evita trattini doppi.');
}

function assertHumanLabel(value, label) {
  if (!value || String(value).trim().length < 3) throw new Error(`${label} obbligatorio e troppo corto.`);
  if (String(value).includes('__')) throw new Error(`${label} contiene placeholder non valido.`);
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
    if (textLike) fs.writeFileSync(dest, replaceAll(fs.readFileSync(src, 'utf8'), replacements), 'utf8');
    else fs.copyFileSync(src, dest);
  }
}

function writeDocs(docsRoot, replacements) {
  fs.mkdirSync(docsRoot, { recursive: true });
  const title = replacements.__LEAGUE_NAME__;
  const slug = replacements.__LEAGUE_SLUG__;
  const season = replacements.__SEASON_ID__;
  fs.writeFileSync(path.join(docsRoot, 'README.md'), `# ${title}\n\nCartella documentale generata da fanta-engine ${VERSION}.\n\nStato: template, non produzione.\n\n## Checklist rapida\n\n- completare assets/league-config.json;\n- creare progetto Firebase dedicato o lasciare Firebase disabilitato;\n- creare servizio/template EmailJS dedicati o lasciare EmailJS disabilitato;\n- aggiungere dati reali e snapshot pubblici;\n- valutare redirect Netlify;\n- eseguire audit statici e test browser;\n- verificare mobile, footer e separazione dalle altre leghe.\n`, 'utf8');
  fs.writeFileSync(path.join(docsRoot, 'HANDOFF_TEMPLATE_V507.md'), `# Handoff template V507\n\nLega: ${title}\nSlug: ${slug}\nStagione: ${season}\n\nQuesta lega e' stata generata da template V507. Non considerarla pronta per produzione senza revisione manuale.\n`, 'utf8');
  fs.writeFileSync(path.join(docsRoot, 'GO_LIVE_CHECKLIST_V507.md'), `# Checklist go-live V507 - ${title}\n\n- [ ] Config senza placeholder ` + '`__...__`' + `\n- [ ] basePath e siteUrl coerenti con /${slug}/\n- [ ] Firebase dedicato oppure disabilitato\n- [ ] EmailJS dedicato oppure disabilitato\n- [ ] dati reali inseriti\n- [ ] redirect Netlify rivisti manualmente\n- [ ] audit statici verdi\n- [ ] smoke test browser verdi\n- [ ] verifica mobile manuale\n- [ ] nessuna contaminazione con ZonaOrientale o FantaMantraManager\n`, 'utf8');
  fs.writeFileSync(path.join(docsRoot, 'CONFIG_VALIDATION_V507.md'), `# Validazione config V507\n\nEseguire dalla root repo:\n\n` + '```bash' + `\nnode static/fanta-engine/tools/validate-league-config-v507.mjs ${slug}\n` + '```' + `\n\nIl validatore non pubblica, non modifica Firebase, non invia email e non aggiorna Netlify.\n`, 'utf8');
}

function patchGeneratedConfig(configPath, args) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.siteUrl = args.siteUrl || `https://silviobarra.com/${args.slug}/`;
  config.templateSource = 'fanta-engine V507';
  config.templateHardening = {
    version: 'V507',
    checklistRequired: true,
    validatorScript: '../fanta-engine/tools/validate-league-config-v507.mjs',
    goLiveStatus: 'not-ready'
  };
  config.features = { ...(config.features || {}), leagueTemplateHardening: true, leagueTemplateHardeningVersion: 'V507', leagueTemplateValidator: true, leagueTemplateValidatorVersion: 'V507' };
  config.guardrails = { ...(config.guardrails || {}), requiresConfigValidatorV507: true, requiresGoLiveChecklistV507: true, doesNotAutoEditNetlify: true };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

function assertNoPlaceholderLeak(targetRoot) {
  const leaks = [];
  for (const file of walk(targetRoot)) {
    if (!/\.(html|js|json|css|md|example)$/i.test(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (/__[A-Z0-9_]+__/.test(text)) leaks.push(path.relative(targetRoot, file));
  }
  if (leaks.length) throw new Error(`Placeholder residui nei file generati: ${leaks.slice(0, 8).join(', ')}`);
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (!args.slug || !args.name) { usage(); process.exit(1); }
  assertSlug(args.slug);
  assertHumanLabel(args.name, 'Nome lega');
  if (!fs.existsSync(templateRoot)) throw new Error(`Template non trovato: ${templateRoot}`);
  if (fs.existsSync(path.join(staticRoot, 'static'))) throw new Error('Cartella accidentale static/static presente: rimuoverla prima di generare nuove leghe.');
  if (fs.existsSync(path.join(staticRoot, 'zonaorientale', 'static'))) throw new Error('Cartella annidata static/zonaorientale/static presente: rimuoverla prima di generare nuove leghe.');

  const destLeague = path.join(staticRoot, args.slug);
  const destDocs = path.join(repoRoot, 'docs', args.slug);
  if (!args.force && (fs.existsSync(destLeague) || fs.existsSync(destDocs))) throw new Error('Destinazione gia esistente. Usa --force solo se sai cosa stai sovrascrivendo.');
  const shortName = args.short || args.name;
  const replacements = {
    '__LEAGUE_SLUG__': args.slug,
    '__LEAGUE_NAME__': args.name,
    '__LEAGUE_SHORT_NAME__': shortName,
    '__SEASON_ID__': args.season,
    '__CACHE_VERSION__': String(args.version)
  };
  const planned = [`static/${args.slug}`, `docs/${args.slug}`];
  if (args.dryRun) {
    console.log(`DRY-RUN ${VERSION} - creerei: ${planned.join(', ')}`);
    process.exit(0);
  }
  if (args.force) { fs.rmSync(destLeague, { recursive: true, force: true }); fs.rmSync(destDocs, { recursive: true, force: true }); }
  copyTemplate(templateRoot, destLeague, replacements);
  patchGeneratedConfig(path.join(destLeague, 'assets', 'league-config.json'), args);
  writeDocs(destDocs, replacements);
  assertNoPlaceholderLeak(destLeague);
  assertNoPlaceholderLeak(destDocs);
  const validation = spawnSync(process.execPath, [validatorScript, args.slug, '--allow-disabled-integrations'], { cwd: repoRoot, encoding: 'utf8' });
  process.stdout.write(validation.stdout || '');
  process.stderr.write(validation.stderr || '');
  if (validation.status !== 0) throw new Error('Validazione V507 fallita dopo generazione.');
  console.log(`OK - creata nuova lega template: static/${args.slug}`);
  console.log(`OK - creata documentazione: docs/${args.slug}`);
  console.log('TODO - configura Firebase, EmailJS, dati, Netlify e audit prima del go-live.');
} catch (error) {
  console.error(`Errore create-league ${VERSION}: ${error.message}`);
  process.exit(1);
}
