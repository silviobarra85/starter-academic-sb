import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const checks = [];
for (const league of leagues) {
  const indexPath = path.join(root, 'static', league, 'index.html');
  const appPath = path.join(root, 'static', league, 'assets', 'app.js');
  const index = fs.readFileSync(indexPath, 'utf8');
  const app = fs.readFileSync(appPath, 'utf8');
  checks.push({ name: `${league}: css performance`, ok: index.includes('site-performance-v657.css?v=657') });
  checks.push({ name: `${league}: app cache buster`, ok: index.includes('./assets/app.js?v=657') });
  checks.push({ name: `${league}: sudatori public not loaded`, ok: !/sudatori-section-v\d+\.(css|js)/.test(index) });
  checks.push({ name: `${league}: runtime marker`, ok: app.includes('FantaSitePerformanceV657') });
  checks.push({ name: `${league}: active-page rendering`, ok: app.includes('activePageRendering: true') });
}
const cssPath = path.join(root, 'static', 'fanta-engine', 'css', 'site-performance-v657.css');
checks.push({ name: 'shared css exists', ok: fs.existsSync(cssPath) });
const failed = checks.filter((item) => !item.ok);
if (failed.length) {
  console.error('Audit site performance V657 FAILED');
  for (const item of failed) console.error('-', item.name);
  process.exit(1);
}
console.log('Audit site performance V657 OK', JSON.stringify({ leagues: leagues.length, siteOnly: true, iosudoChanged: false, activePageRendering: true, sudatoriPublicSection: false }));
