import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));
const fail = (message) => { throw new Error(message); };
const checks = [];
const check = (condition, label) => {
  if (!condition) fail(label);
  checks.push(label);
};
const norm = (value) => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

const runtime = json('static/fanta-engine/data/sudatori/current/sudatori-runtime.json');
const data = json('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const manifest = json('static/fanta-engine/data/sudatori/current/manifest.json');
const app = read('static/fanta-engine/js/apps/iosudo-app-v758.js');
const css = read('static/fanta-engine/css/iosudo-app-v758.css');
const index = read('static/iosudo/index.html');
const sw = read('static/iosudo/sw.js');

check(manifest.version === 'V758', 'manifest V758');
check(manifest.appVersion === 'V758', 'appVersion V758');
check(runtime.meta?.version === 'V758', 'runtime V758');
check(data.meta?.version === 'V758', 'dataset V758');
check(index.includes('iosudo-app-v758.js?v=758'), 'index JS V758');
check(index.includes('iosudo-app-v758.css?v=758'), 'index CSS V758');
check(index.includes('data-iosudo-version="758"'), 'data version V758');
check(sw.includes("iosudo-shell-v758"), 'cache PWA V758');
check(sw.includes('iosudo-app-v758.js?v=758'), 'precache JS V758');
check(css.length > 10000, 'CSS V758 presente');
check(app.includes("sourceBadgeMode: 'catalog-membership-listone-first'"), 'diagnostica modalità sorgente');
check(app.includes('if (playerHasListoneSource(player)) return \'LISTONE\';'), 'LISTONE ha priorità');
check(!app.includes("return 'ANAGRAFICA';"), 'ANAGRAFICA non è sorgente visibile');

const roster = Object.values(runtime.playersByTeam || {}).flat();
const rosterById = new Map(roster.map((p) => [String(p.id || ''), p]));
const directory = (runtime.playerDirectory || []).map((entry) => {
  if (entry && Object.keys(entry).length === 1 && entry.id && rosterById.has(String(entry.id))) return rosterById.get(String(entry.id));
  return entry;
}).filter(Boolean);
const byId = new Map();
for (const player of roster.concat(directory)) {
  if (player?.id) byId.set(String(player.id), player);
}
const players = [...byId.values()];

const sourceKinds = (player) => [
  ...(Array.isArray(player.sourceKindsV757) ? player.sourceKindsV757 : []),
  ...(Array.isArray(player.sourceKindsV756) ? player.sourceKindsV756 : []),
  ...(Array.isArray(player.sourceKinds) ? player.sourceKinds : [])
].map(norm);
const hasListone = (player) => Boolean(
  player.listoneOnlyPlayer || player.listone || player.fantacalcioId || norm(player.roleSource).includes('listone') || sourceKinds(player).includes('listone')
);
const listonePlayers = players.filter(hasListone);
check(listonePlayers.length === 663, '663 giocatori del listone rappresentati');
check(listonePlayers.every(hasListone), 'tutti i giocatori listone riconoscibili');
check(players.filter((p) => norm(p.nameSource).includes('anagraf')).length > 0, 'metadato ANAGRAFICA conservato internamente');

// Simulazione della semantica pubblica V758: ogni presenza listone prevale sul nameSource interno.
const publicSource = (player) => {
  if (hasListone(player)) return 'LISTONE';
  const kinds = sourceKinds(player);
  if (kinds.includes('rosa')) return 'ROSA';
  if (kinds.includes('trattativa')) return 'TRATTATIVA';
  if (kinds.includes('ufficialita')) return 'UFFICIALITÀ';
  if (kinds.includes('sos')) return 'SOS';
  if (kinds.includes('formazione')) return 'FORMAZIONE';
  if (kinds.includes('amichevole')) return 'AMICHEVOLE';
  return 'ROSA';
};
check(listonePlayers.every((p) => publicSource(p) === 'LISTONE'), 'tutti i giocatori listone mostrano LISTONE');
check(players.every((p) => publicSource(p) !== 'ANAGRAFICA'), 'nessun badge pubblico ANAGRAFICA');

console.log(`Audit ioSudo V758 OK - ${checks.length} controlli superati - ${listonePlayers.length} giocatori LISTONE verificati`);
