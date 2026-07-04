#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd(); let ok = 0, fail = 0; const failures = [];
function abs(p){return path.join(root,p)}; function exists(p){return fs.existsSync(abs(p))}; function read(p){return fs.readFileSync(abs(p),'utf8')}; function readJson(p){return JSON.parse(read(p))};
function check(c,l){if(c){ok++;console.log(`OK  - ${l}`)}else{fail++;failures.push(l);console.error(`FAIL - ${l}`)}}
check(exists('fanta-engine/js/ui/dashboard-renderer-helpers-v509.js'), 'helper renderer V509 presente');
check(exists('fanta-engine/data/dashboard-renderer-migration-v509.json'), 'manifest renderer V509 presente');
const helper = read('fanta-engine/js/ui/dashboard-renderer-helpers-v509.js');
for (const token of ['DASHBOARD_RENDERER_MIGRATION_VERSION_V509','renderAdminCollapsiblePanelV509','renderPresidentDashboardMetricV509','installDashboardRendererHelpersV509']) check(helper.includes(token), `helper contiene ${token}`);
check(helper.includes("dashboard-renderer-helpers-v505.js?v=505"), 'helper V509 riusa base V505');
check(!helper.includes('service_ttjf7js') && !helper.includes('service_trz4dxe'), 'helper V509 senza service EmailJS hardcoded');
check(!helper.includes('ZonaOrientale Salerno') && !helper.includes('FantaMantraManager'), 'helper V509 senza brand hardcoded');
const manifest = readJson('fanta-engine/data/dashboard-renderer-migration-v509.json');
check(manifest.version === 'V509', 'manifest versione V509');
check(Array.isArray(manifest.guardrails) && manifest.guardrails.length >= 4, 'manifest guardrail presenti');
for (const [app, league] of [['zonaorientale/assets/app.js','ZonaOrientale'],['fantapetillomantramanager/assets/app.js','FantaMantraManager']]) {
  const text = read(app);
  check(text.includes('dashboard-renderer-helpers-v509.js?v=509'), `${league} importa helper V509`);
  check(text.includes('installDashboardRendererHelpersV509'), `${league} installa runtime V509`);
  check(text.includes('FantaEngineDashboardRendererMigrationRuntimeV509'), `${league} runtime globale V509`);
  check(text.includes('renderAdminCollapsiblePanelV509({'), `${league} renderAdminPanel delega V509`);
  check(text.includes('renderPresidentDashboardMetricV509({'), `${league} metriche presidente delegano V509`);
  check(text.includes('renderRuleProposalsPresidentSectionV479') || league === 'ZonaOrientale', `${league} proposte regolamento preservate se presenti`);
}
for (const [cfgPath, leagueId] of [['zonaorientale/assets/league-config.json','zonaorientale'],['fantapetillomantramanager/assets/league-config.json','fantapetillomantramanager']]) {
  const cfg = readJson(cfgPath);
  check(cfg.currentVersion === 509, `${cfgPath} currentVersion V509`);
  check(cfg.leagueId === leagueId, `${cfgPath} leagueId corretto`);
  check(cfg.features?.dashboardRendererMigration === true, `${cfgPath} dashboardRendererMigration attivo`);
  check(cfg.features?.dashboardRendererMigrationVersion === 'V509', `${cfgPath} dashboardRendererMigrationVersion V509`);
  check(cfg.features?.dashboardRendererHelpersVersion === 'V509', `${cfgPath} dashboardRendererHelpersVersion V509`);
  check(cfg.guardrails?.dashboardRendererMigrationNoFirebaseWrites === true, `${cfgPath} guardrail no Firebase writes`);
}
for (const file of ['zonaorientale/index.html','zonaorientale/competition.html','zonaorientale/player.html','fantapetillomantramanager/index.html','fantapetillomantramanager/competition.html','fantapetillomantramanager/player.html','fantapetillomantramanager/news.html','fantapetillomantramanager/bilanci.html']) check(read(file).includes('?v=509'), `${file} cache-buster V509`);
for (const file of ['zonaorientale/assets/js/core/league-config-v443.js','fantapetillomantramanager/assets/js/core/league-config-v443.js']) { const text = read(file); check(text.includes("currentVersion: '509'"), `${file} runtime V509`); check(text.includes('league-config.json?v=509'), `${file} fetch config V509`); check(text.includes('dashboardRendererMigrationV509'), `${file} flag dashboard renderer V509`); }
check(!exists('zonaorientale/static'), 'static/zonaorientale/static assente');
check(!exists('static'), 'static/static assente');
check(fs.existsSync(path.join(root, '../docs/OVERLAY_ROADMAP.md')), 'docs/OVERLAY_ROADMAP.md presente');
check(read('../docs/OVERLAY_ROADMAP.md').includes('V510 - Report centralizzazione'), 'roadmap contiene V510');
check(read('../docs/AI_ASSISTANT_HANDOFF_V509.md').includes('docs/OVERLAY_ROADMAP.md'), 'handoff AI richiama roadmap overlay');
if(fail>0){console.error(`\nAudit dashboard renderer migration V509 fallito: ${ok} OK, ${fail} FAIL`);failures.forEach(f=>console.error(` - ${f}`));process.exit(1)}
console.log(`\nAudit dashboard renderer migration V509 completato: ${ok} OK, ${fail} FAIL`);
