#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const VERSION = 'V524';
const BASE_GENERATOR_VERSION = 'V507';
const RESERVED_SLUGS = new Set(['zonaorientale', 'fantapetillomantramanager', 'fanta-engine', 'media', 'static', '_league-template']);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticRoot = path.resolve(__dirname, '..', '..');
const repoRoot = path.resolve(staticRoot, '..');
const baseGenerator = path.join(__dirname, 'create-league-v507.mjs');
const validator = path.join(__dirname, 'validate-league-config-v507.mjs');

function usage() {
  console.log(`Uso: node static/fanta-engine/tools/create-league-wizard-v524.mjs [--slug nuova-lega] [--name "Nome Lega"] [--short "NL"] [--season "2026-2027"] [--site-url "https://..."] [--dry-run] [--force] [--yes] [--write-plan file.json]`);
}

function parseArgs(argv) {
  const args = { dryRun: false, force: false, yes: false, season: '2026-2027' };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (item === '--help' || item === '-h') { args.help = true; continue; }
    if (item === '--dry-run') { args.dryRun = true; continue; }
    if (item === '--force') { args.force = true; continue; }
    if (item === '--yes' || item === '-y') { args.yes = true; continue; }
    if (item === '--slug') { args.slug = argv[++i]; continue; }
    if (item === '--name') { args.name = argv[++i]; continue; }
    if (item === '--short') { args.short = argv[++i]; continue; }
    if (item === '--season') { args.season = argv[++i]; continue; }
    if (item === '--site-url') { args.siteUrl = argv[++i]; continue; }
    if (item === '--write-plan') { args.writePlan = argv[++i]; continue; }
    if (!args.slug) { args.slug = item; continue; }
    throw new Error(`Argomento non riconosciuto: ${item}`);
  }
  return args;
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
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

async function promptMissing(args) {
  if (args.help) return args;
  const interactive = Boolean(input.isTTY && output.isTTY);
  if (!interactive) {
    if (!args.name || !args.slug) throw new Error('In modalita non interattiva servono almeno --slug e --name.');
    return args;
  }
  const rl = readline.createInterface({ input, output });
  try {
    if (!args.name) args.name = (await rl.question('Nome lega: ')).trim();
    if (!args.slug) {
      const suggested = slugify(args.name);
      const answer = (await rl.question(`Slug [${suggested}]: `)).trim();
      args.slug = answer || suggested;
    }
    if (!args.short) {
      const answer = (await rl.question(`Nome breve [${args.name}]: `)).trim();
      args.short = answer || args.name;
    }
    if (!args.season) {
      const answer = (await rl.question('Stagione [2026-2027]: ')).trim();
      args.season = answer || '2026-2027';
    }
    if (!args.siteUrl) {
      const suggested = `https://silviobarra.com/${args.slug}/`;
      const answer = (await rl.question(`URL pubblico [${suggested}]: `)).trim();
      args.siteUrl = answer || suggested;
    }
  } finally {
    rl.close();
  }
  return args;
}

function buildPlan(args) {
  assertSlug(args.slug);
  assertHumanLabel(args.name, 'Nome lega');
  const shortName = args.short || args.name;
  const siteUrl = args.siteUrl || `https://silviobarra.com/${args.slug}/`;
  return {
    version: VERSION,
    mode: args.dryRun ? 'dry-run' : 'write',
    generator: `create-league-${BASE_GENERATOR_VERSION.toLowerCase()}.mjs`,
    slug: args.slug,
    name: args.name,
    shortName,
    season: args.season || '2026-2027',
    siteUrl,
    creates: [`static/${args.slug}/`, `docs/${args.slug}/`],
    sharedAssetsDefaults: {
      listoniManifest: '../fanta-engine/data/shared-assets/current/assets/listoni/manifest.json',
      listoniBase: '../fanta-engine/data/shared-assets/current/assets/listoni/',
      calciomercatoLinks: '../fanta-engine/data/shared-assets/current/assets/calciomercato/links.json',
      calciomercatoArchiveManifest: '../fanta-engine/data/shared-assets/current/assets/calciomercato/archive/manifest.json',
      calciomercatoArchiveBase: '../fanta-engine/data/shared-assets/current/assets/calciomercato/archive/'
    },
    localFallbacks: {
      listoniManifestFallback: './assets/listoni/manifest.json',
      listoniBaseFallback: './assets/listoni/',
      calciomercatoLinksFallback: './assets/calciomercato/links.json',
      calciomercatoArchiveManifestFallback: './assets/calciomercato/archive/manifest.json',
      calciomercatoArchiveBaseFallback: './assets/calciomercato/archive/'
    },
    manualSteps: [
      'configurare Firebase dedicato oppure lasciarlo disabilitato',
      'configurare EmailJS dedicato oppure lasciarlo disabilitato',
      'verificare redirect Netlify manualmente',
      'inserire dati specifici di lega',
      'eseguire validator e smoke test prima del go-live'
    ]
  };
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function patchGeneratedConfig(plan) {
  const cfgPath = path.join(staticRoot, plan.slug, 'assets', 'league-config.json');
  const config = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
  config.currentVersion = 524;
  config.templateSource = 'fanta-engine V524 guided configurator over V507 generator';
  config.features = {
    ...(config.features || {}),
    sharedAssetsSingleUpload: true,
    sharedAssetsSingleUploadVersion: 'V522',
    leagueConfigurator: true,
    leagueConfiguratorVersion: VERSION
  };
  config.guardrails = {
    ...(config.guardrails || {}),
    sharedAssetsPrimaryPathRequired: true,
    localSharedAssetFallbacksPreserved: true,
    leagueConfiguratorDoesNotAutoEditNetlify: true,
    leagueConfiguratorDoesNotCreateIntegrations: true
  };
  config.dataPaths = {
    ...(config.dataPaths || {}),
    publicConfig: './assets/public/config.json',
    seasonSnapshotsManifest: './assets/snapshots/seasons/manifest.json',
    seasonSnapshotsBase: './assets/snapshots/seasons/',
    honorSnapshot: './assets/snapshots/honor.json',
    listoniManifest: plan.sharedAssetsDefaults.listoniManifest,
    listoniBase: plan.sharedAssetsDefaults.listoniBase,
    listoniManifestFallback: plan.localFallbacks.listoniManifestFallback,
    listoniBaseFallback: plan.localFallbacks.listoniBaseFallback,
    rostersManifest: './assets/rose/manifest.json',
    rostersBase: './assets/rose/',
    competitionsManifest: './assets/competitions/manifest.json',
    competitionsBase: './assets/competitions/',
    logosBase: './assets/logos/',
    calciomercatoLinks: plan.sharedAssetsDefaults.calciomercatoLinks,
    calciomercatoArchiveManifest: plan.sharedAssetsDefaults.calciomercatoArchiveManifest,
    calciomercatoArchiveBase: plan.sharedAssetsDefaults.calciomercatoArchiveBase,
    calciomercatoLinksFallback: plan.localFallbacks.calciomercatoLinksFallback,
    calciomercatoArchiveManifestFallback: plan.localFallbacks.calciomercatoArchiveManifestFallback,
    calciomercatoArchiveBaseFallback: plan.localFallbacks.calciomercatoArchiveBaseFallback
  };
  config.leagueConfiguratorV524 = {
    version: VERSION,
    generatedBy: 'create-league-wizard-v524.mjs',
    baseGenerator: 'create-league-v507.mjs',
    sharedAssetsPrimary: true,
    localFallbacksPreserved: true,
    netlifyAutoEdit: false,
    firebaseAutoCreate: false,
    emailJsAutoCreate: false,
    goLiveStatus: 'not-ready'
  };
  writeJson(cfgPath, config);
}

function writeWizardDocs(plan) {
  const docsRoot = path.join(repoRoot, 'docs', plan.slug);
  fs.mkdirSync(docsRoot, { recursive: true });
  fs.writeFileSync(path.join(docsRoot, 'WIZARD_CONFIG_V524.md'), `# Wizard config V524 - ${plan.name}\n\nLega generata con configuratore guidato V524 sopra il generator V507.\n\n## Percorsi asset comuni\n\n- Listoni: \`${plan.sharedAssetsDefaults.listoniBase}\`\n- Calciomercato: \`${plan.sharedAssetsDefaults.calciomercatoArchiveBase}\`\n\nLe copie locali restano fallback di sicurezza. Non caricare Listoni/Calciomercato due volte se il path centrale e' aggiornato.\n\n## Prima del go-live\n\n- Firebase dedicato o disabilitato.\n- EmailJS dedicato o disabilitato.\n- Redirect Netlify rivisti manualmente.\n- Dati specifici della lega inseriti.\n- Validator e smoke test eseguiti.\n`, 'utf8');
}

function runChecked(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, { cwd: repoRoot, encoding: 'utf8', ...options });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  if (result.status !== 0) throw new Error(`Comando fallito: ${cmd} ${args.join(' ')}`);
  return result;
}

try {
  const args = await promptMissing(parseArgs(process.argv.slice(2)));
  if (args.help) { usage(); process.exit(0); }
  const plan = buildPlan(args);
  if (args.writePlan) writeJson(path.resolve(repoRoot, args.writePlan), plan);
  console.log(JSON.stringify(plan, null, 2));
  if (args.dryRun) process.exit(0);
  if (!args.yes && !(input.isTTY && output.isTTY)) throw new Error('Per scrivere in modalita non interattiva usa --yes.');
  if (!fs.existsSync(baseGenerator)) throw new Error(`Generator base non trovato: ${baseGenerator}`);
  const generatorArgs = [baseGenerator, plan.slug, '--name', plan.name, '--short', plan.shortName, '--season', plan.season, '--version', '524', '--site-url', plan.siteUrl];
  if (args.force) generatorArgs.push('--force');
  runChecked(process.execPath, generatorArgs);
  patchGeneratedConfig(plan);
  writeWizardDocs(plan);
  runChecked(process.execPath, [validator, plan.slug, '--allow-disabled-integrations']);
  console.log(`OK - Wizard ${VERSION}: lega generata in static/${plan.slug} con asset comuni centralizzati e fallback locali.`);
  console.log('TODO - netlify.toml, Firebase, EmailJS e dati reali restano manuali.');
} catch (error) {
  console.error(`Errore create-league wizard ${VERSION}: ${error.message}`);
  process.exit(1);
}
