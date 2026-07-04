#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd(); let ok = 0, fail = 0; const failures = [];
function abs(p){ return path.join(root,p); }
function exists(p){ return fs.existsSync(abs(p)); }
function read(p){ return fs.readFileSync(abs(p),'utf8'); }
function readJson(p){ return JSON.parse(read(p)); }
function check(c,l){ if(c){ok++; console.log(`OK  - ${l}`)} else {fail++; failures.push(l); console.error(`FAIL - ${l}`)} }
const ui = 'fanta-engine/js/ui/components-v496.js';
check(exists(ui), 'UI components engine V496 presente');
const uiText = read(ui);
for (const token of ['UI_VERSION_V496', 'setTextForSelectorV496', 'setMetaContentV496', 'setCanonicalV496', 'formatTemplateV496', 'normalizeIconV496', 'resolveHashHrefV496', 'showToastV496', 'installFantaUiV496']) check(uiText.includes(token), `export/funzione UI presente ${token}`);
check(!uiText.includes('zonaorientale'), 'UI engine senza riferimenti ZonaOrientale');
check(!uiText.includes('fantapetillomantramanager'), 'UI engine senza riferimenti FantaMantraManager');
const presentation = read('fanta-engine/js/core/league-presentation-v481.js');
check(presentation.includes('../ui/components-v496.js'), 'presentation engine importa UI V496');
check(presentation.includes("PRESENTATION_VERSION_V481 = 'V496'"), 'presentation engine runtime V496');
check(presentation.includes('installFantaUiV496'), 'presentation engine installa UI V496');
check(presentation.includes('uiComponentsEngine: UI_VERSION_V496'), 'presentation engine traccia UI V496');
for (const cfgPath of ['zonaorientale/assets/league-config.json','fantapetillomantramanager/assets/league-config.json']) {
  const cfg = readJson(cfgPath);
  check(cfg.currentVersion === 496, `${cfgPath} currentVersion V496`);
  check(cfg.features?.uiComponentsEngine === true, `${cfgPath} feature uiComponentsEngine attiva`);
  check(cfg.features?.uiComponentsEngineVersion === 'V496', `${cfgPath} feature uiComponentsEngineVersion V496`);
}
for (const p of ['zonaorientale/assets/js/core/league-config-v443.js','fantapetillomantramanager/assets/js/core/league-config-v443.js']) {
  const text = read(p);
  check(text.includes('uiComponentsEngineV496'), `${p} runtime traccia UI V496`);
  check(text.includes('league-config.json?v=496'), `${p} fetch config V496`);
}
for (const doc of ['../docs/AI_ASSISTANT_HANDOFF_V496.md','../docs/fantapetillomantramanager/UI_COMPONENTS_ENGINE_V496.md','../docs/zonaorientale/UI_COMPONENTS_ENGINE_V496.md']) check(exists(doc), `doc presente ${doc}`);
if(fail>0){ console.error(`\nAudit UI components V496 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f=>console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit UI components V496 completato: ${ok} OK, ${fail} FAIL`);
