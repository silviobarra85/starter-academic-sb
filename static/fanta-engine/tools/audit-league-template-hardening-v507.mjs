#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd(); let ok = 0, fail = 0; const failures = [];
function abs(p){ return path.join(root,p); }
function exists(p){ return fs.existsSync(abs(p)); }
function read(p){ return fs.readFileSync(abs(p),'utf8'); }
function readJson(p){ return JSON.parse(read(p)); }
function check(c,l){ if(c){ ok++; console.log(`OK  - ${l}`); } else { fail++; failures.push(l); console.error(`FAIL - ${l}`); } }

check(!exists('zonaorientale/static'), 'copia annidata zonaorientale/static assente');
check(!exists('static'), 'cartella accidentale static/static assente');
check(exists('_league-template'), 'template nuova lega presente');
check(exists('fanta-engine/tools/create-league-v507.mjs'), 'create-league V507 presente');
check(exists('fanta-engine/tools/validate-league-config-v507.mjs'), 'validator V507 presente');
check(exists('fanta-engine/data/league-template-hardening-v507.json'), 'manifest hardening V507 presente');
const manifest = readJson('fanta-engine/data/league-template-hardening-v507.json');
check(manifest.version === 'V507', 'manifest versione V507');
check(manifest.createScript === 'fanta-engine/tools/create-league-v507.mjs', 'manifest create script V507');
check(manifest.validatorScript === 'fanta-engine/tools/validate-league-config-v507.mjs', 'manifest validator script V507');
check(manifest.guardrails?.includes('non aggiorna netlify.toml automaticamente'), 'manifest guardrail Netlify manuale');
const create = read('fanta-engine/tools/create-league-v507.mjs');
for (const token of ['VERSION = \'V507\'','RESERVED_SLUGS','--dry-run','validate-league-config-v507.mjs','assertNoPlaceholderLeak','requiresConfigValidatorV507','GO_LIVE_CHECKLIST_V507.md','CONFIG_VALIDATION_V507.md']) check(create.includes(token), `create script token ${token}`);
check(!create.includes('service_ttjf7js') && !create.includes('service_trz4dxe'), 'create script senza service EmailJS hardcoded');
check(!create.includes('zonaorientale-d07af'), 'create script senza projectId Firebase hardcoded');
check(create.includes('RESERVED_SLUGS') && create.includes('fantapetillomantramanager'), 'create script blocca slug riservati noti');
const validator = read('fanta-engine/tools/validate-league-config-v507.mjs');
for (const token of ['VERSION = \'V507\'','reservedFirebaseProjects','reservedEmailServices','--allow-disabled-integrations','templateHardening','GO_LIVE_CHECKLIST_V507.md','Netlify share news']) check(validator.includes(token), `validator token ${token}`);
check(validator.includes('zonaorientale-d07af') && validator.includes('fantapetillomantramanager'), 'validator blocca riuso progetti noti');
const tcfg = readJson('_league-template/assets/league-config.json');
check(tcfg.templateSource === 'fanta-engine V507', 'template config source V507');
check(tcfg.templateHardening?.version === 'V507', 'template config hardening V507');
check(tcfg.guardrails?.requiresConfigValidatorV507 === true, 'template config guardrail validator');
check(tcfg.guardrails?.doesNotAutoEditNetlify === true, 'template config guardrail Netlify');
for (const file of ['_league-template/index.html','_league-template/competition.html','_league-template/player.html','_league-template/news.html','_league-template/bilanci.html','_league-template/assets/app.js','_league-template/README.md','_league-template/docs/README.md']) { const text = read(file); check(text.includes('V507'), `${file} aggiornato a V507`); check(!text.includes('V502'), `${file} senza residui V502`); }
check(read('_league-template/assets/app.js').includes('data-template-warning-v507'), 'template app warning V507');
for (const [league, name] of [['zonaorientale','ZonaOrientale Salerno'],['fantapetillomantramanager','FantaMantraManager']]) {
  const cfg = readJson(`${league}/assets/league-config.json`);
  check(cfg.currentVersion === 507, `${league} currentVersion V507`);
  check(cfg.features?.leagueTemplateHardening === true, `${league} feature hardening attiva`);
  check(cfg.features?.leagueTemplateHardeningVersion === 'V507', `${league} hardening version V507`);
  check(cfg.features?.leagueTemplateValidatorVersion === 'V507', `${league} validator version V507`);
  check(cfg.guardrails?.leagueTemplateHardeningV507 === true, `${league} guardrail hardening V507`);
  check(cfg.leagueTemplateEngine?.version === 'V507', `${league} leagueTemplateEngine V507`);
  check(String(cfg.leagueTemplateEngine?.validatorScript || '').includes('validate-league-config-v507.mjs'), `${league} validator script in config`);
  check(cfg.name === name, `${league} nome preservato`);
}
// Smoke generation on temporary slug inside static/docs, then remove.
const tempSlug = 'audit-v507-temp';
try {
  const { spawnSync } = await import('node:child_process');
  const script = abs('fanta-engine/tools/create-league-v507.mjs');
  const res = spawnSync(process.execPath, [script, tempSlug, '--name', 'Audit V507 Temp', '--short', 'AVT', '--season', '2026-2027', '--force'], { cwd: path.resolve(root, '..'), encoding: 'utf8' });
  check(res.status === 0, `create-league V507 genera temp (${(res.stderr || '').trim()})`);
  check(exists(`${tempSlug}/assets/league-config.json`), 'temp config generato');
  check(fs.existsSync(path.join(root, '..', 'docs', tempSlug, 'GO_LIVE_CHECKLIST_V507.md')), 'temp checklist docs generata');
  fs.rmSync(abs(tempSlug), { recursive: true, force: true });
  fs.rmSync(path.join(root, '..', 'docs', tempSlug), { recursive: true, force: true });
} catch (error) { check(false, `create-league V507 genera temp (${error.message})`); }
if (fail > 0) { console.error(`\nAudit template hardening V507 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f => console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit template hardening V507 completato: ${ok} OK, ${fail} FAIL`);
