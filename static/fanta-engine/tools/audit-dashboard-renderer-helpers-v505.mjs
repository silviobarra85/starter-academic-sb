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
check(exists('fanta-engine/js/ui/dashboard-renderer-helpers-v505.js'), 'dashboard renderer helpers V505 presente');
check(exists('fanta-engine/data/dashboard-renderer-helpers-v505.json'), 'manifest renderer helpers V505 presente');
const manifest = readJson('fanta-engine/data/dashboard-renderer-helpers-v505.json');
check(manifest.version === 'V505', 'manifest versione V505');
check(manifest.module === 'fanta-engine/js/ui/dashboard-renderer-helpers-v505.js', 'manifest punta al modulo corretto');
check(manifest.runtimeUse?.adminCollapsiblePanel?.includes('renderAdminPanel'), 'manifest traccia migrazione renderAdminPanel');
check(manifest.guardrails?.includes('no Firebase changes'), 'manifest non tocca Firebase');
check(manifest.guardrails?.includes('no EmailJS changes'), 'manifest non tocca EmailJS');
const helper = read('fanta-engine/js/ui/dashboard-renderer-helpers-v505.js');
check(helper.includes("DASHBOARD_RENDERER_HELPERS_VERSION_V505 = 'V505'"), 'costante versione V505');
check(helper.includes('renderCollapsiblePanelV505'), 'helper renderCollapsiblePanel presente');
check(helper.includes('renderDashboardActionCardV505'), 'helper action card presente');
check(helper.includes('renderMetricCardV505'), 'helper metric card presente');
check(helper.includes('installDashboardRendererHelpersV505'), 'installer runtime presente');
check(helper.includes('data-admin-toggle-panel'), 'helper preserva toggle admin');
check(helper.includes('dashboardRendererV505'), 'helper marca data dashboardRendererV505');
check(!helper.includes('ZonaOrientale Salerno'), 'helper senza brand Zona hardcoded');
check(!helper.includes('FantaMantraManager'), 'helper senza brand FMM hardcoded');
check(!helper.includes('service_ttjf7js') && !helper.includes('service_trz4dxe'), 'helper senza service EmailJS hardcoded');
for (const [league, id, name] of [['zonaorientale','zonaorientale','ZonaOrientale Salerno'], ['fantapetillomantramanager','fantapetillomantramanager','FantaMantraManager']]) {
  const cfgPath = `${league}/assets/league-config.json`;
  const cfg = readJson(cfgPath);
  check(cfg.leagueId === id, `${cfgPath} leagueId corretto`);
  check(cfg.name === name, `${cfgPath} nome corretto`);
  check(cfg.currentVersion === 505, `${cfgPath} currentVersion V505`);
  check(cfg.features?.dashboardRendererHelpers === true, `${cfgPath} renderer helpers attivo`);
  check(cfg.features?.dashboardRendererHelpersVersion === 'V505', `${cfgPath} renderer helpers version V505`);
  check(cfg.features?.dashboardRendererAdminPanelMigrated === true, `${cfgPath} admin panel migrato`);
  check(cfg.guardrails?.dashboardRendererNoBusinessLogic === true, `${cfgPath} guardrail niente business logic`);
  check(cfg.guardrails?.dashboardRendererNoFirebaseEmailJsMutation === true, `${cfgPath} guardrail niente Firebase/EmailJS`);
  check(cfg.dashboardRendererHelpers?.version === 'V505', `${cfgPath} dashboardRendererHelpers config V505`);
  check(cfg.dashboardRendererHelpers?.migratedRenderers?.includes('renderAdminPanel'), `${cfgPath} renderAdminPanel tracciato`);
  const app = read(`${league}/assets/app.js`);
  check(app.includes('dashboard-renderer-helpers-v505.js?v=505'), `${league} app importa renderer helpers V505`);
  check(app.includes('installDashboardRendererHelpersV505'), `${league} app installa renderer helpers V505`);
  check(app.includes('FantaEngineDashboardRendererHelpersRuntimeV505'), `${league} runtime renderer helpers esposto`);
  check(app.includes('renderCollapsiblePanelV505({'), `${league} renderAdminPanel delega al helper comune`);
  check(!app.includes('<article class="panel admin-collapsible-panel ${isCollapsed ? "is-collapsed" : ""}" id="${panelId}">'), `${league} vecchia shell hardcoded renderAdminPanel rimossa`);
}
check(read('fantapetillomantramanager/assets/app.js').includes('renderRuleProposalsPresidentSectionV479'), 'FMM Proposte regolamento preservate');
check(read('fantapetillomantramanager/assets/app.js').includes('Comunicato avvenuto scambio'), 'FMM Comunicato scambio preservato');
check(read('fantapetillomantramanager/assets/app.js').includes('Svincola'), 'FMM Svincola preservato');
if (fail > 0) { console.error(`\nAudit dashboard renderer helpers V505 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f => console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit dashboard renderer helpers V505 completato: ${ok} OK, ${fail} FAIL`);
