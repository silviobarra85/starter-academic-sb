#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const quiet = process.argv.includes('--quiet');
const failures = [];
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const assert = (cond, msg) => { if (!cond) failures.push(msg); };

const app = read('assets/app.js');
const index = read('index.html');
const competition = read('competition.html');
const player = read('player.html');
const check = read('tools/check-zonaorientale.sh');

const runtimeMatch = app.match(/DEPLOY_EXPECTED_VERSION_V181 = "(\d+)"/);
const runtimeVersion = Number(runtimeMatch?.[1] || 0);
assert(runtimeVersion >= 427, `DEPLOY_EXPECTED_VERSION_V181 inferiore a V427: ${runtimeVersion || 'non rilevato'}`);
assert(app.includes('ZonaOrientaleLegacyWarningCleanupV427'), 'marker runtime V427 mancante');
assert(app.includes('ZonaOrientaleMobileChecklistV426'), 'guardrail V426 non preservato');
assert(app.includes('ZonaOrientaleMobileTypographyV425'), 'scala mobile V425 non preservata');
for (const [name, html] of [['index.html', index], ['competition.html', competition], ['player.html', player]]) {
  assert(html.includes(`V${runtimeVersion}`), `${name} footer runtime corrente mancante`);
  assert(!html.includes('?v=426'), `${name} contiene ancora cache-buster ?v=426`);
  assert(!html.includes('?v=427') || runtimeVersion === 427, `${name} contiene cache-buster V427 stale`);
  assert(html.includes(`?v=${runtimeVersion}`) || name === 'player.html', `${name} non contiene cache-buster runtime corrente`);
}
assert(!app.includes('?v=426'), 'assets/app.js contiene ancora import/fetch ?v=426');
assert(!app.includes('?v=427') || runtimeVersion === 427, 'assets/app.js contiene ancora import/fetch ?v=427');
assert(check.includes('Audit pulizia warning legacy V427'), 'check-zonaorientale non include audit V427');
assert(!index.includes('role-backgrounds-v405r2'), 'index.html richiama ancora asset sperimentali role-backgrounds-v405r2');
assert(!index.includes('sezioni/'), 'refactor standalone sezioni rientrato in index.html');

const legacyCss = ['assets/css/mobile-hotfix-v166.css', 'assets/css/mobile-hotfix-v167.css'];
for (const rel of legacyCss) {
  assert(exists(rel), `${rel} non presente: la pulizia V427 non deve cancellare storico/fallback legacy`);
  assert(!index.includes(rel), `${rel} ancora collegato a index.html`);
  assert(!competition.includes(rel), `${rel} ancora collegato a competition.html`);
  assert(!player.includes(rel), `${rel} ancora collegato a player.html`);
}
assert(app.includes('disableSoccerDataSectionV398') || exists('tools/audit-soccer-data-removed-v398.mjs'), 'guardrail rimozione Soccer Data V398 non rilevato');
assert(check.includes('storico Soccer Data non piu nel gate runtime'), 'check non riclassifica i tool Soccer Data storici come advisory');

if (failures.length) {
  console.error('Audit pulizia warning legacy V427 fallito:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
if (!quiet) {
  console.log('Audit pulizia warning legacy V427 superato.');
}
