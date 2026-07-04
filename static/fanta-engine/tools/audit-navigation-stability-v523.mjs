#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
const failures = [];
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function ok(condition, message) { if (!condition) failures.push(message); }

const autoloadPath = 'static/fanta-engine/js/core/public-data-autoload-v512.js';
ok(exists(autoloadPath), `${autoloadPath} mancante`);
const autoload = read(autoloadPath);
ok(autoload.includes('PUBLIC_DATA_AUTOLOAD_VERSION_V523'), 'export/const V523 mancante in public-data-autoload');
ok(autoload.includes('installPublicDataAutoloadV523'), 'installPublicDataAutoloadV523 mancante');
ok(autoload.includes('resolveScheduledPageV523'), 'resolveScheduledPageV523 mancante');
ok(autoload.includes('shouldRefreshScheduledPageV523'), 'shouldRefreshScheduledPageV523 mancante');
ok(autoload.includes('stalePage: initialPage'), 'run V523 non traccia stalePage/initialPage');
ok(autoload.includes('scheduledPage'), 'schedule V523 non traccia scheduledPage');

for (const league of leagues) {
  const base = `static/${league}`;
  const app = read(`${base}/assets/app.js`);
  const cfg = JSON.parse(read(`${base}/assets/league-config.json`));
  const leagueConfigModule = read(`${base}/assets/js/core/league-config-v443.js`);
  const staticFilesService = read(`${base}/assets/js/data/static-files-service.js`);

  ok(cfg.currentVersion === 523, `${league}: currentVersion non e' 523`);
  ok(app.includes('installPublicDataAutoloadV523'), `${league}: app.js non importa/usa installPublicDataAutoloadV523`);
  ok(app.includes('FantaEnginePublicDataAutoloadRuntimeV523'), `${league}: runtime autoload V523 non esposto`);
  ok(app.includes('FantaEngineNavigationStabilityV523'), `${league}: marker navigation stability V523 mancante`);
  ok(app.includes("'calciomercato'"), `${league}: calciomercato non e' riconosciuto come hash statico`);
  ok(app.includes("'bilanci'"), `${league}: bilanci non e' riconosciuto come hash statico`);
  ok(!app.includes('installPublicDataAutoloadV522'), `${league}: residuo installPublicDataAutoloadV522 in app.js`);
  ok(leagueConfigModule.includes('league-config.json?v=523'), `${league}: league-config module non carica json v523`);
  ok(staticFilesService.includes('league-config-v443.js?v=523'), `${league}: static-files-service non importa league-config v523`);
  ok(cfg.navigationStabilityV523?.protectedPages?.includes('listone'), `${league}: config V523 non protegge listone`);
  ok(cfg.navigationStabilityV523?.protectedPages?.includes('calciomercato'), `${league}: config V523 non protegge calciomercato`);
  ok(String(cfg.sharedAssetsSingleUploadV522?.primaryRoot || '').replace(/\/$/, '') === '../fanta-engine/data/shared-assets/current/assets', `${league}: shared-assets current non preservato come primaryRoot`);

  for (const page of ['index.html', 'competition.html', 'player.html', 'bilanci.html', 'news.html']) {
    const rel = `${base}/${page}`;
    if (!exists(rel)) continue;
    const html = read(rel);
    ok(!html.includes('?v=522'), `${league}/${page}: residuo cache-buster v522`);
    ok(!html.includes('· V522 ·'), `${league}/${page}: footer V522 residuo`);
  }
}

const roadmap = read('docs/OVERLAY_ROADMAP.md');
ok(roadmap.includes('V523 - Stabilita navigazione asset comuni'), 'roadmap non aggiornata a V523');
ok(exists('docs/NAVIGATION_STABILITY_V523.md'), 'documento NAVIGATION_STABILITY_V523.md mancante');

if (failures.length) {
  console.error('Audit V523 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Audit V523 superato: timer autoload fresh-page, runtime whole-site a ?v=523 e asset comuni V522 preservati.');
