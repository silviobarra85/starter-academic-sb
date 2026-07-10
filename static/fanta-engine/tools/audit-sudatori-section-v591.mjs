import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'static/fanta-engine/css/sudatori-section-v591.css',
  'static/fanta-engine/js/sections/sudatori-section-v591.js',
  'static/fanta-engine/data/sudatori/current/manifest.json',
  'static/fanta-engine/data/sudatori/current/sudatori-data.json',
  'static/zonaorientale/index.html',
  'static/fantapetillomantramanager/index.html'
];
const errors = [];
const ok = [];
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
for (const rel of required) {
  if (!exists(rel)) errors.push(`Manca ${rel}`);
  else ok.push(`OK presente ${rel}`);
}
for (const league of ['zonaorientale','fantapetillomantramanager']) {
  const index = read(`static/${league}/index.html`);
  if (!index.includes('sudatori-section-v591.css')) errors.push(`${league}: CSS Sudatori non referenziato`);
  if (!index.includes('sudatori-section-v591.js')) errors.push(`${league}: JS Sudatori non referenziato`);
  if (!index.includes('V591')) errors.push(`${league}: footer/cache-buster non aggiornato a V591`);
  const cfg = JSON.parse(read(`static/${league}/assets/league-config.json`));
  if (cfg.currentVersion !== '591') errors.push(`${league}: currentVersion ${cfg.currentVersion} invece di 591`);
  if (!cfg.features?.sudatoriStandaloneSection) errors.push(`${league}: feature flag sudatoriStandaloneSection assente`);
}
const manifest = JSON.parse(read('static/fanta-engine/data/sudatori/current/manifest.json'));
const data = JSON.parse(read('static/fanta-engine/data/sudatori/current/sudatori-data.json'));
if (manifest.current !== 'sudatori-data.json') errors.push('Manifest Sudatori current non punta a sudatori-data.json');
if (data.meta?.version !== 'V591') errors.push('Data Sudatori non marca V591');
if ((data.teams || []).length < 20) errors.push(`Squadre Sudatori insufficienti: ${(data.teams || []).length}`);
const totalPlayers = Object.values(data.playersByTeam || {}).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
if (totalPlayers < 600) errors.push(`Giocatori Sudatori insufficienti: ${totalPlayers}`);
const totalFriendlies = Object.values(data.friendliesByTeam || {}).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0);
if (totalFriendlies < 40) errors.push(`Amichevoli Sudatori insufficienti: ${totalFriendlies}`);
if (read('static/fanta-engine/js/sections/sudatori-section-v591.js').includes('firebase')) errors.push('Il modulo Sudatori non deve usare Firebase');

if (errors.length) {
  console.error('Audit Sudatori V591 FALLITO');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('Audit Sudatori V591 OK');
console.log(`Squadre: ${data.teams.length}, giocatori: ${totalPlayers}, amichevoli: ${totalFriendlies}`);
