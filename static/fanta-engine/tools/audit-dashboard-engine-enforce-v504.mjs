#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
let ok = 0, fail = 0; const failures = [];
function abs(p){ return path.join(root,p); }
function exists(p){ return fs.existsSync(abs(p)); }
function read(p){ return fs.readFileSync(abs(p),'utf8'); }
function readJson(p){ return JSON.parse(read(p)); }
function check(c,l){ if(c){ ok++; console.log(`OK  - ${l}`); } else { fail++; failures.push(l); console.error(`FAIL - ${l}`); } }
check(!exists('zonaorientale/static'), 'copia annidata zonaorientale/static assente');
check(!exists('static'), 'cartella accidentale static/static assente');
check(exists('fanta-engine/js/ui/dashboard-cards-engine-v504.js'), 'engine dashboard V504 presente');
check(exists('fanta-engine/js/ui/dashboard-cards-engine-v500.js'), 'engine dashboard V500 preservato come storico/fallback');
check(exists('fanta-engine/data/dashboard-engine-enforce-v504.json'), 'manifest dashboard enforce V504 presente');
const manifest = readJson('fanta-engine/data/dashboard-engine-enforce-v504.json');
check(manifest.version === 'V504', 'manifest versione V504');
check(manifest.defaultMode === 'safe-enforce', 'manifest default safe-enforce');
check(manifest.modes?.includes('observe-first') && manifest.modes?.includes('safe-enforce') && manifest.modes?.includes('enforce'), 'manifest elenca modi supportati');
check(manifest.safeEnforcePolicy?.some(x => x.includes('non forza card pubbliche')), 'manifest protegge card pubbliche');
check(manifest.guardrails?.includes('no Firebase changes'), 'manifest non tocca Firebase');
check(manifest.guardrails?.includes('no EmailJS changes'), 'manifest non tocca EmailJS');
const engine = read('fanta-engine/js/ui/dashboard-cards-engine-v504.js');
check(engine.includes("DASHBOARD_CARDS_ENGINE_VERSION_V504 = 'V504'"), 'costante versione V504');
check(engine.includes('safe-enforce'), 'engine supporta safe-enforce');
check(engine.includes('VISIBILITY_ENFORCE_MODES_V504'), 'engine ha lista modi enforce');
check(engine.includes('shouldMutateVisibilityV504'), 'engine ha policy mutazione visibilita');
check(engine.includes("visibility === 'public'") && engine.includes('return false'), 'safe-enforce non forza card pubbliche');
check(engine.includes('element.hidden = !enabled'), 'engine governa hidden');
check(engine.includes('aria-hidden'), 'engine governa aria-hidden');
check(engine.includes('FantaEngineDashboardCardsRuntimeV500'), 'alias runtime V500 preservato');
check(!engine.includes('ZonaOrientale Salerno'), 'engine senza brand Zona hardcoded');
check(!engine.includes('FantaMantraManager'), 'engine senza brand FMM hardcoded');
check(!engine.includes('service_ttjf7js') && !engine.includes('service_trz4dxe'), 'engine senza service EmailJS hardcoded');
for (const [league, id, name] of [['zonaorientale','zonaorientale','ZonaOrientale Salerno'], ['fantapetillomantramanager','fantapetillomantramanager','FantaMantraManager']]) {
  const cfgPath = `${league}/assets/league-config.json`;
  const cfg = readJson(cfgPath);
  check(cfg.leagueId === id, `${cfgPath} leagueId corretto`);
  check(cfg.name === name, `${cfgPath} nome corretto`);
  check(cfg.currentVersion === 504, `${cfgPath} currentVersion V504`);
  check(cfg.features?.dashboardCardsEngine === true, `${cfgPath} dashboard engine attivo`);
  check(cfg.features?.dashboardCardsEngineVersion === 'V504', `${cfgPath} dashboard engine version V504`);
  check(cfg.features?.dashboardCardsEngineSafeEnforce === true, `${cfgPath} safe enforce attivo`);
  check(cfg.guardrails?.dashboardCardsEngineSafeEnforce === true, `${cfgPath} guardrail safe enforce`);
  check(cfg.guardrails?.dashboardCardsEngineDoesNotDeleteDom === true, `${cfgPath} guardrail non cancella DOM`);
  check(cfg.guardrails?.dashboardCardsEngineNoPublicCardForceHide === true, `${cfgPath} guardrail non forza card pubbliche`);
  check(cfg.dashboardCardsEngine?.version === 'V504', `${cfgPath} dashboard config V504`);
  check(cfg.dashboardCardsEngine?.previousVersion === 'V500', `${cfgPath} dashboard previous V500`);
  check(cfg.dashboardCardsEngine?.mode === 'safe-enforce', `${cfgPath} modalita safe-enforce`);
  check(cfg.dashboardCardsEngine?.usesFeatureCardRegistry === 'V497', `${cfgPath} usa registry V497`);
  const app = read(`${league}/assets/app.js`);
  check(app.includes('dashboard-cards-engine-v504.js?v=504'), `${league} app importa engine V504`);
  check(app.includes('installDashboardCardsEngineV504'), `${league} app installa engine V504`);
  check(app.includes('FantaEngineDashboardCardsRuntimeV504'), `${league} runtime V504 esposto`);
  check(app.includes('FantaEngineDashboardCardsRuntimeV500 = window.FantaEngineDashboardCardsRuntimeV504'), `${league} alias V500 preservato`);
  check(!app.includes('dashboard-cards-engine-v500.js?v=500'), `${league} app non importa engine V500 primario`);
}
check(read('fantapetillomantramanager/assets/app.js').includes('renderRuleProposalsPresidentSectionV479'), 'FMM Proposte regolamento preservate');
check(read('fantapetillomantramanager/assets/app.js').includes('Comunicato avvenuto scambio'), 'FMM Comunicato scambio preservato');
check(read('fantapetillomantramanager/assets/app.js').includes('Svincola'), 'FMM Svincola preservato');
if (fail > 0) { console.error(`\nAudit dashboard enforce V504 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f => console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit dashboard enforce V504 completato: ${ok} OK, ${fail} FAIL`);
