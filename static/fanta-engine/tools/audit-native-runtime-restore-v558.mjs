import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const forbiddenInApp = [
  'installNavigationActionsV510',
  'installNavigationDataRefreshV511',
  'installPublicDataAutoloadV526',
  'installDashboardRendererMigrationV527',
  'installDashboardEnforceV528',
  'FantaEngineNavigationDataRefreshRuntimeV511',
  'FantaEnginePublicDataAutoloadRuntimeV526',
  'renderDashboardBeforeV527',
  'renderDashboardBeforeV528',
];
const forbiddenInHtml = [
  'public-data-autoload-v512.js',
  'dashboard-renderer-migration-v527.js',
  'dashboard-enforce-v528.js',
  'navigation-active-singleton-v534.js',
  'navigation-fluidity-v535.js',
  'navigation-performance-guard-v536.js',
  'performance-profiler-lazy-render-v552.js',
  'application-cache-chunked-tables-v553.js',
  'eager-data-preload-v555.js'
];
const errors = [];

for (const league of leagues) {
  const base = path.join(repoRoot, 'static', league);
  const appPath = path.join(base, 'assets', 'app.js');
  const indexPath = path.join(base, 'index.html');
  const configPath = path.join(base, 'assets', 'league-config.json');
  const leagueConfigPath = path.join(base, 'assets', 'js', 'core', 'league-config-v443.js');
  for (const file of [appPath, indexPath, configPath, leagueConfigPath]) {
    if (!fs.existsSync(file)) errors.push(`File mancante: ${file}`);
  }
  if (!fs.existsSync(appPath) || !fs.existsSync(indexPath)) continue;
  const app = fs.readFileSync(appPath, 'utf8');
  const html = fs.readFileSync(indexPath, 'utf8');
  const cfg = fs.existsSync(configPath) ? fs.readFileSync(configPath, 'utf8') : '';
  const lcfg = fs.existsSync(leagueConfigPath) ? fs.readFileSync(leagueConfigPath, 'utf8') : '';
  if (!html.includes('app.js?v=558')) errors.push(`${league}: index non punta ad app.js?v=558`);
  if (!html.includes('league-config-v443.js?v=558')) errors.push(`${league}: index non punta a league-config-v443.js?v=558`);
  if (!cfg.includes('"currentVersion": "558"')) errors.push(`${league}: league-config.json non ha currentVersion 558`);
  if (!lcfg.includes("currentVersion: '558'")) errors.push(`${league}: league-config-v443.js non ha currentVersion 558`);
  if (!app.includes('FantaEngineNativeRuntimeRestoreV558')) errors.push(`${league}: app.js non dichiara NativeRuntimeRestoreV558`);
  for (const token of forbiddenInApp) {
    if (app.includes(token)) errors.push(`${league}: app.js contiene ancora runtime pesante ${token}`);
  }
  for (const token of forbiddenInHtml) {
    if (html.includes(token)) errors.push(`${league}: index contiene ancora preload/import pesante ${token}`);
  }
}

if (errors.length) {
  console.error('Audit V558 fallito:');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}
console.log('Audit V558 superato: runtime nativo ripristinato, wrapper navigazione/autoload/dashboard disattivati e whole-site a ?v=558.');
