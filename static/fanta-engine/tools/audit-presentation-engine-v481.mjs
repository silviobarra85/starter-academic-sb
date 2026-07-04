import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function ok(name, condition, detail = '') { checks.push({ name, condition: Boolean(condition), detail }); }

const engine = 'fanta-engine/js/core/league-presentation-v481.js';
ok('engine presentazione V481 presente', exists(engine));
if (exists(engine)) {
  const text = read(engine);
  ok('engine esporta applyLeagueRuntimePresentationV481', text.includes('applyLeagueRuntimePresentationV481'));
  ok('engine gestisce footer da config', text.includes('formatFooterTextV481') && text.includes('branding.footerTemplate'));
  ok('engine gestisce mobile More', text.includes('applyMobileMoreLinksV481'));
  ok('engine non contiene nomi lega hardcoded', !/ZonaOrientale Salerno|FantaMantraManager/.test(text));
}

const registry = 'fanta-engine/js/core/unified-section-registry-v480.js';
ok('registry condiviso presente', exists(registry));
if (exists(registry)) {
  const text = read(registry);
  ok('registry emette evento ready', text.includes('fanta-section-registry-ready-v480'));
}

const leagues = [
  ['fantapetillomantramanager', 'FantaMantraManager'],
  ['zonaorientale', 'ZonaOrientale Salerno'],
  ['zonaorientale/static', 'ZonaOrientale Salerno']
];

for (const [league, displayName] of leagues) {
  const cfgJs = `${league}/assets/js/core/league-config-v443.js`;
  const cfgJson = `${league}/assets/league-config.json`;
  ok(`${league}: league-config JS presente`, exists(cfgJs));
  if (exists(cfgJs)) {
    const text = read(cfgJs);
    ok(`${league}: carica motore comune V481`, text.includes('league-presentation-v481.js') && text.includes('PRESENTATION_ENGINE_V481'));
    ok(`${league}: config URL cache-buster 481`, text.includes("league-config.json?v=481"));
    ok(`${league}: fallback V445 preservato`, text.includes('V481-fallback') && text.includes('applyMetaTagsV445'));
    ok(`${league}: runtime dichiara commonPresentationEngine`, text.includes('commonPresentationEngine: true'));
  }
  ok(`${league}: league-config JSON presente`, exists(cfgJson));
  if (exists(cfgJson)) {
    const data = JSON.parse(read(cfgJson));
    ok(`${league}: currentVersion 481`, String(data.currentVersion) === '481');
    ok(`${league}: guardrail commonPresentationEngineV481`, data.guardrails?.commonPresentationEngineV481 === true);
    ok(`${league}: nome config coerente`, String(data.branding?.siteName || data.name || '').includes(displayName.split(' ')[0]));
  }
  for (const html of ['index.html', 'competition.html', 'player.html']) {
    const rel = `${league}/${html}`;
    if (!exists(rel)) continue;
    const text = read(rel);
    ok(`${league}/${html}: cache-buster 481`, text.includes('v=481'));
    ok(`${league}/${html}: footer V481 se presente`, !text.includes('data-league-footer-v445') || text.includes('V481'));
  }
}

const fmmIndex = read('fantapetillomantramanager/index.html');
const zoIndex = read('zonaorientale/index.html');
ok('FantaMantra index non cita ZonaOrientale nel branding', !/ZonaOrientale Salerno/.test(fmmIndex));
ok('ZonaOrientale index non cita FantaMantraManager nel branding', !/FantaMantraManager/.test(zoIndex));
ok("FUNZIONALITA'.md non incluso nel motore V481", !exists("zonaorientale/FUNZIONALITA'.md") && !exists("docs/zonaorientale/FUNZIONALITA'.md"));

const failures = checks.filter((item) => !item.condition);
for (const item of checks) {
  console.log(`${item.condition ? 'OK' : 'FAIL'} - ${item.name}${item.detail ? ` (${item.detail})` : ''}`);
}
console.log(`Audit V481 presentation engine: ${checks.length - failures.length} OK, ${failures.length} FAIL`);
if (failures.length) process.exit(1);
