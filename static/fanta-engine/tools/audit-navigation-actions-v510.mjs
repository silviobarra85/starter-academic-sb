#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd(); let ok = 0, fail = 0; const failures = [];
function abs(p){ return path.join(root,p); }
function exists(p){ return fs.existsSync(abs(p)); }
function read(p){ return fs.readFileSync(abs(p),'utf8'); }
function readJson(p){ return JSON.parse(read(p)); }
function check(cond,label){ if(cond){ ok++; console.log(`OK  - ${label}`); } else { fail++; failures.push(label); console.error(`FAIL - ${label}`); } }
check(exists('fanta-engine/js/ui/navigation-actions-v510.js'), 'navigation actions engine V510 presente');
check(exists('fanta-engine/data/navigation-actions-v510.json'), 'manifest navigation actions V510 presente');
const engine = read('fanta-engine/js/ui/navigation-actions-v510.js');
check(engine.includes('NAVIGATION_ACTIONS_VERSION_V510'), 'engine espone versione V510');
check(engine.includes('[data-page-link], [data-v42-page-link]'), 'engine intercetta data-page-link e data-v42-page-link');
check(engine.includes('stopPropagation'), 'engine evita doppio handling dei listener statici senza bloccare altri listener document-level');
check(engine.includes('hashchange'), 'engine gestisce hashchange');
check(engine.includes('installNavigationActionsV510'), 'engine installabile');
const manifest = readJson('fanta-engine/data/navigation-actions-v510.json');
check(manifest.version === 'V510', 'manifest versione V510');
check(Array.isArray(manifest.handledSelectors) && manifest.handledSelectors.includes('[data-page-link]') && manifest.handledSelectors.includes('[data-v42-page-link]'), 'manifest documenta selettori gestiti');
for (const [cfgPath, id] of [['zonaorientale/assets/league-config.json','zonaorientale'], ['fantapetillomantramanager/assets/league-config.json','fantapetillomantramanager']]) {
  const cfg = readJson(cfgPath);
  check(cfg.currentVersion === 510, `${cfgPath} currentVersion V510`);
  check(cfg.features?.navigationActionsEngine === true, `${cfgPath} feature navigation actions attiva`);
  check(cfg.features?.navigationActionsEngineVersion === 'V510', `${cfgPath} feature version V510`);
  check(cfg.guardrails?.dynamicNavigationButtonsHandled === true, `${cfgPath} guardrail pulsanti dinamici`);
}
for (const file of ['zonaorientale/assets/app.js','fantapetillomantramanager/assets/app.js']) {
  const text = read(file);
  check(text.includes('navigation-actions-v510.js?v=510'), `${file} importa navigation engine V510`);
  check(text.includes('installNavigationActionsV510'), `${file} installa navigation engine V510`);
  check(text.includes('setAppPageV42(page)'), `${file} delega a setAppPageV42`);
  check(text.includes("ensureV34Dom?.()"), `${file} prepara pagine dinamiche prima della navigazione`);
  check(text.includes('scheduleMobilePageTopV172?.()'), `${file} mantiene scroll mobile post-navigazione`);
  check(text.includes("openTeamProfilePageV42"), `${file} preserva teamprofile`);
}
for (const html of ['zonaorientale/index.html','fantapetillomantramanager/index.html']) {
  const text = read(html);
  const dataPageCount = (text.match(/data-page-link=/g) || []).length;
  check(dataPageCount >= 15, `${html} contiene link sezione`);
  check(text.includes('?v=510'), `${html} cache-buster V510`);
}
for (const app of ['zonaorientale/assets/app.js','fantapetillomantramanager/assets/app.js']) {
  const text = read(app);
  const legacyButtons = (text.match(/data-v42-page-link/g) || []).length;
  check(legacyButtons >= 5, `${app} contiene pulsanti legacy coperti dal fix`);
}
check(exists('../docs/OVERLAY_ROADMAP.md'), 'roadmap overlay presente');
check(read('../docs/OVERLAY_ROADMAP.md').includes('V510'), 'roadmap aggiornata a V510');
if (fail > 0) { console.error(`\nAudit navigation actions V510 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f => console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit navigation actions V510 completato: ${ok} OK, ${fail} FAIL`);
