#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const VERSION = 'V507';
const repoRoot = process.cwd();
const staticRoot = path.join(repoRoot, 'static');
const reservedFirebaseProjects = new Set(['zonaorientale-d07af', 'fantapetillomantramanager']);
const reservedEmailServices = new Set(['service_trz4dxe', 'service_ttjf7js']);
let ok = 0; let fail = 0; const failures = [];
function check(condition, label) { if (condition) { ok += 1; console.log(`OK  - ${label}`); } else { fail += 1; failures.push(label); console.error(`FAIL - ${label}`); } }
function readJson(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function walk(dir) { const out=[]; if(!fs.existsSync(dir)) return out; for(const entry of fs.readdirSync(dir,{withFileTypes:true})){ const p=path.join(dir,entry.name); if(entry.isDirectory()) out.push(...walk(p)); else out.push(p); } return out; }
function hasPlaceholders(dir) { return walk(dir).filter(file => /\.(html|js|json|css|md|example)$/i.test(file) && /__[A-Z0-9_]+__/.test(fs.readFileSync(file,'utf8'))); }
function parseArgs(argv) { const args={ allowDisabledIntegrations:false }; const rest=[]; for(let i=0;i<argv.length;i+=1){ const item=argv[i]; if(item==='--allow-disabled-integrations'){ args.allowDisabledIntegrations=true; continue; } rest.push(item); } args.slug=rest[0]; return args; }
const args = parseArgs(process.argv.slice(2));
if (!args.slug) { console.error(`Uso: node static/fanta-engine/tools/validate-league-config-v507.mjs <slug> [--allow-disabled-integrations]`); process.exit(1); }
const slug = args.slug;
const leagueRoot = path.join(staticRoot, slug);
const docsRoot = path.join(repoRoot, 'docs', slug);
const cfgPath = path.join(leagueRoot, 'assets', 'league-config.json');
check(!fs.existsSync(path.join(staticRoot, 'static')), 'cartella accidentale static/static assente');
check(!fs.existsSync(path.join(staticRoot, 'zonaorientale', 'static')), 'copia annidata zonaorientale/static assente');
check(/^[a-z0-9][a-z0-9-]{2,60}$/.test(slug), 'slug sintatticamente valido');
check(!['zonaorientale','fantapetillomantramanager','fanta-engine','media','static','_league-template'].includes(slug), 'slug non riservato');
check(fs.existsSync(leagueRoot), `static/${slug} presente`);
check(fs.existsSync(docsRoot), `docs/${slug} presente`);
check(fs.existsSync(cfgPath), 'league-config.json presente');
let cfg = {};
try { cfg = readJson(cfgPath); check(true, 'league-config.json JSON valido'); } catch (error) { check(false, `league-config.json JSON valido (${error.message})`); }
if (cfg && Object.keys(cfg).length) {
  check(cfg.leagueId === slug, 'leagueId coincide con slug');
  check(cfg.slug === slug, 'slug config coincide');
  check(typeof cfg.name === 'string' && cfg.name.length >= 3, 'nome lega presente');
  check(String(cfg.basePath || '') === `/${slug}/`, 'basePath canonico');
  check(String(cfg.siteUrl || '').includes(`/${slug}/`), 'siteUrl contiene slug');
  check(String(cfg.currentSeasonId || '').length >= 4, 'seasonId presente');
  check(cfg.templateHardening?.version === 'V507', 'template hardening V507 tracciato');
  check(cfg.guardrails?.requiresConfigValidatorV507 === true, 'guardrail validator V507 presente');
  check(cfg.guardrails?.doesNotAutoEditNetlify === true, 'guardrail Netlify manuale presente');
  const firebaseEnabled = cfg.firebase?.enabled === true || cfg.features?.firebaseAdapter === true;
  const firebaseProject = String(cfg.firebase?.projectId || '').trim();
  if (firebaseEnabled || firebaseProject) check(firebaseProject && !reservedFirebaseProjects.has(firebaseProject), 'Firebase dedicato non riusa projectId di altre leghe');
  else check(args.allowDisabledIntegrations, 'Firebase disabilitato accettato solo in fase template');
  const emailEnabled = cfg.emailJs?.enabled === true || cfg.features?.emailJsAdapter === true;
  const emailService = String(cfg.emailJs?.serviceId || '').trim();
  if (emailEnabled || emailService) check(emailService && !reservedEmailServices.has(emailService), 'EmailJS dedicato non riusa serviceId di altre leghe');
  else check(args.allowDisabledIntegrations, 'EmailJS disabilitato accettato solo in fase template');
}
for (const file of ['index.html','competition.html','player.html','news.html','bilanci.html','assets/app.js','assets/styles.css']) check(fs.existsSync(path.join(leagueRoot,file)), `${file} presente`);
const leaks = [...hasPlaceholders(leagueRoot), ...hasPlaceholders(docsRoot)];
check(leaks.length === 0, `nessun placeholder residuo${leaks.length ? ` (${leaks.slice(0,5).map(p=>path.relative(repoRoot,p)).join(', ')})` : ''}`);
for (const doc of ['README.md','HANDOFF_TEMPLATE_V507.md','GO_LIVE_CHECKLIST_V507.md','CONFIG_VALIDATION_V507.md']) check(fs.existsSync(path.join(docsRoot, doc)), `doc ${doc} presente`);
const netlifyPath = path.join(repoRoot, 'netlify.toml');
if (fs.existsSync(netlifyPath)) {
  const netlify = fs.readFileSync(netlifyPath, 'utf8');
  check(!netlify.includes(`/${slug}/share/news/:id`) || netlify.includes(`league=${slug}`), 'Netlify share news dedicato o non ancora configurato');
} else check(true, 'netlify.toml non presente nel contesto validator');
if (fail > 0) { console.error(`\nValidazione lega ${VERSION} fallita: ${ok} OK, ${fail} FAIL`); failures.forEach(f => console.error(` - ${f}`)); process.exit(1); }
console.log(`\nValidazione lega ${VERSION} completata: ${ok} OK, ${fail} FAIL`);
