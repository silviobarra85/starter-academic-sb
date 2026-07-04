import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.cwd());
const checks = [];
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function check(condition, label) { checks.push({ ok: Boolean(condition), label }); }

const sites = [
  { id: 'fantapetillomantramanager', rel: 'fantapetillomantramanager', expectedName: 'FantaMantraManager', expectedVersion: '480' },
  { id: 'zonaorientale', rel: 'zonaorientale', expectedName: 'ZonaOrientale', expectedVersion: '480' }
];

check(exists('fanta-engine/js/core/unified-section-registry-v480.js'), 'motore condiviso fanta-engine V480 presente');
const engine = read('fanta-engine/js/core/unified-section-registry-v480.js');
check(engine.includes('createUnifiedSectionRegistryV480'), 'factory createUnifiedSectionRegistryV480 presente');
check(engine.includes('listNavItems'), 'helper listNavItems presente');
check(engine.includes('listDashboardCards'), 'helper listDashboardCards presente');

for (const site of sites) {
  const base = site.rel;
  check(exists(`${base}/assets/js/core/section-registry-v405.js`), `${site.id}: wrapper registry presente`);
  check(exists(`${base}/assets/app.js`), `${site.id}: app.js presente`);
  check(exists(`${base}/assets/league-config.json`), `${site.id}: league-config presente`);
  check(exists(`${base}/index.html`), `${site.id}: index.html presente`);
  const registry = read(`${base}/assets/js/core/section-registry-v405.js`);
  const app = read(`${base}/assets/app.js`);
  const index = read(`${base}/index.html`);
  const config = JSON.parse(read(`${base}/assets/league-config.json`));
  check(registry.includes('createUnifiedSectionRegistryV480'), `${site.id}: registry usa factory condivisa`);
  check(engine.includes('FantaLeagueSectionRegistryV480'), `${site.id}: alias globale comune installato dal motore`);
  check(app.includes('FantaLeagueSectionRegistryV480'), `${site.id}: app preferisce registry comune`);
  check(app.includes('listNavItems?.("mobilePrimary")'), `${site.id}: stato menu mobile legge mobilePrimary dal registry`);
  check(index.includes('section-registry-v405.js?v=480'), `${site.id}: cache-buster registry V480`);
  check(index.includes('assets/app.js?v=480'), `${site.id}: cache-buster app V480`);
  check(config.currentVersion === site.expectedVersion, `${site.id}: currentVersion V480`);
  check(config.guardrails?.unifiedSectionRegistryVersion === '480', `${site.id}: guardrail unifiedSectionRegistryVersion V480`);
}

// Import dei registri in ambiente Node con window simulato.
global.window = {};
await import(pathToFileURL(path.join(root, 'fantapetillomantramanager/assets/js/core/section-registry-v405.js')).href + '?audit=fmm');
check(global.window.FantaLeagueSectionRegistryV480?.leagueId === 'fantapetillomantramanager', 'import FMM: leagueId corretto');
check(global.window.FantaLeagueSectionRegistryV480?.isKnownPage('ruleproposals'), 'import FMM: ruleproposals registrata');
check(global.window.FantaLeagueSectionRegistryV480?.listNavItems('mobilePrimary').some((page) => page.id === 'teamarea'), 'import FMM: teamarea mobilePrimary');

global.window = {};
await import(pathToFileURL(path.join(root, 'zonaorientale/assets/js/core/section-registry-v405.js')).href + '?audit=zo');
check(global.window.FantaLeagueSectionRegistryV480?.leagueId === 'zonaorientale', 'import ZonaOrientale: leagueId corretto');
check(!global.window.FantaLeagueSectionRegistryV480?.isKnownPage('ruleproposals'), 'import ZonaOrientale: nessuna ruleproposals FMM');
check(global.window.FantaLeagueSectionRegistryV480?.listNavItems('mobilePrimary').some((page) => page.id === 'teamarea'), 'import ZonaOrientale: teamarea mobilePrimary');

let ok = 0;
let fail = 0;
for (const item of checks) {
  if (item.ok) {
    ok += 1;
    console.log(`OK - ${item.label}`);
  } else {
    fail += 1;
    console.error(`FAIL - ${item.label}`);
  }
}
console.log(`\nAudit V480 registry unico: ${ok} OK, ${fail} FAIL`);
if (fail) process.exit(1);
