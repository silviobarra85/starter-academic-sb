import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const leagues = ['zonaorientale', 'fantapetillomantramanager'];
let ok = true;

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    ok = false;
    console.error(`FAIL ${message}`);
  } else {
    console.log(`OK   ${message}`);
  }
}

for (const league of leagues) {
  const app = read(`static/${league}/assets/app.js`);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  const html = read(`static/${league}/index.html`);
  assert(cfg.currentVersion === '589', `${league}: currentVersion V589`);
  assert(html.includes('app.js?v=589'), `${league}: app.js cache-buster V589`);
  assert(!app.includes('if (player.fantasyRoster) return player;'), `${league}: listone non conserva fantasyRoster stale`);
  assert(app.includes('fantasyRoster: "Svincolati"'), `${league}: giocatori non trovati in assets/rose diventano Svincolati`);
  assert(app.includes('rosterSourceV589: "assets/rose"'), `${league}: arricchimento listone tracciato da assets/rose`);
}

if (!ok) process.exit(1);
