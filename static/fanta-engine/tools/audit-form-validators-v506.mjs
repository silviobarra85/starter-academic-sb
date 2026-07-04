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
check(exists('fanta-engine/js/core/form-validators-v506.js'), 'modulo form validators V506 presente');
check(exists('fanta-engine/data/form-validators-v506.json'), 'manifest form validators V506 presente');
check(exists('fanta-engine/js/tools/matchday-draw-engine-v506.js'), 'matchday draw engine V506 presente');
const manifest = readJson('fanta-engine/data/form-validators-v506.json');
check(manifest.version === 'V506', 'manifest versione V506');
check(manifest.module === 'fanta-engine/js/core/form-validators-v506.js', 'manifest punta al modulo corretto');
check(manifest.firstRuntimeConsumer === 'fanta-engine/js/tools/matchday-draw-engine-v506.js', 'manifest traccia primo consumer runtime');
check(manifest.guardrails?.includes('no Firebase changes'), 'manifest guardrail no Firebase');
check(manifest.guardrails?.includes('no EmailJS changes'), 'manifest guardrail no EmailJS');
const validators = read('fanta-engine/js/core/form-validators-v506.js');
for (const token of ['FORM_VALIDATORS_VERSION_V506','normalizeTextV506','toIntegerV506','clampIntegerV506','parseIntegerTokensV506','uniqueSortedIntegersV506','validateRequiredV506','validateIntegerRangeV506','validateRangeOrderV506','buildValidationSummaryV506','escapeHtmlV506','installFormValidatorsV506']) check(validators.includes(token), `validator export ${token}`);
check(!validators.includes('ZonaOrientale Salerno'), 'validators senza brand Zona hardcoded');
check(!validators.includes('FantaMantraManager'), 'validators senza brand FMM hardcoded');
check(!validators.includes('service_ttjf7js') && !validators.includes('service_trz4dxe'), 'validators senza EmailJS service hardcoded');
check(!validators.includes('firebase') && !validators.includes('Firestore'), 'validators senza Firebase/Firestore');
const engine = read('fanta-engine/js/tools/matchday-draw-engine-v506.js');
check(engine.includes("../core/form-validators-v506.js"), 'matchday engine importa validators V506');
check(engine.includes("MATCHDAY_DRAW_ENGINE_VERSION_V506 = 'V506'"), 'matchday engine versione V506');
check(engine.includes('parseIntegerTokensV506'), 'matchday engine usa parser comune');
check(engine.includes('clampIntegerV506'), 'matchday engine usa clamp comune');
check(engine.includes('validators: \'V506\''), 'payload matchday traccia validators V506');
check(!engine.includes('ZonaOrientale Salerno'), 'matchday engine senza brand Zona hardcoded');
check(!engine.includes('FantaMantraManager'), 'matchday engine senza brand FMM hardcoded');
for (const league of ['zonaorientale','fantapetillomantramanager']) {
  const cfg = readJson(`${league}/assets/league-config.json`);
  check(cfg.currentVersion === 506, `${league} currentVersion V506`);
  check(cfg.features?.formValidators === true, `${league} form validators attivi`);
  check(cfg.features?.formValidatorsVersion === 'V506', `${league} form validators version V506`);
  check(cfg.features?.toolFormValidatorsVersion === 'V506', `${league} tool form validators V506`);
  check(cfg.features?.toolEngineVersion === 'V506', `${league} tool engine V506`);
  check(cfg.features?.matchdayDrawToolEngine === 'V506', `${league} matchday tool engine V506`);
  check(cfg.guardrails?.formValidatorsNoBusinessLogic === true, `${league} guardrail no business logic`);
  check(cfg.guardrails?.formValidatorsNoFirebaseEmailJsMutation === true, `${league} guardrail no Firebase/EmailJS mutation`);
  check(cfg.formValidators?.version === 'V506', `${league} formValidators config V506`);
  const wrapper = read(`${league}/assets/js/sections/matchday-draw-tool-v473.js`);
  check(wrapper.includes('matchday-draw-engine-v506.js?v=506'), `${league} wrapper importa engine V506`);
  check(wrapper.includes('initMatchdayDrawToolV506'), `${league} wrapper inizializza V506`);
  check(wrapper.includes('initMatchdayDrawToolFallbackV473'), `${league} fallback locale V473 preservato`);
  const loader = read(`${league}/assets/js/core/league-config-v443.js`);
  check(loader.includes("currentVersion: '506'"), `${league} loader currentVersion 506`);
  check(loader.includes('league-config.json?v=506'), `${league} loader fetch config V506`);
  check(loader.includes('formValidatorsV506'), `${league} loader traccia form validators`);
}
if (fail > 0) { console.error(`\nAudit form validators V506 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f => console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit form validators V506 completato: ${ok} OK, ${fail} FAIL`);
