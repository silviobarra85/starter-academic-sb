import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const manifest = readJson('static/fanta-engine/data/sudatori/current/manifest.json');
const runtime = readJson('static/fanta-engine/data/sudatori/current/sudatori-runtime.json');
const archive = readJson('static/fanta-engine/data/sudatori/current/sudatori-data.json');
const html = readText('static/iosudo/index.html');
const sw = readText('static/iosudo/sw.js');
const app = readText('static/fanta-engine/js/apps/iosudo-app-v769.js');

assert(manifest.version === 'V769', `manifest versione ${manifest.version}`);
assert(runtime.meta?.version === 'V769', `runtime versione ${runtime.meta?.version}`);
assert(html.includes('ioSudo V769') && html.includes('data-iosudo-version="769"'), 'header V769 non sincronizzato');
assert(html.includes('iosudo-app-v769.js?v=769') && html.includes('iosudo-app-v769.css?v=769'), 'asset V769 non sincronizzati');
assert(sw.includes("iosudo-shell-v769"), 'cache V769 non sincronizzata');
assert(app.includes('validatedSosFlagV769') && app.includes("sosFlagMode: 'active-injury-index-only'"), 'guardia SOS V769 assente');

const roster = Object.values(runtime.playersByTeam || {}).flat();
const rosterById = new Map(roster.map((player) => [player.id, player]));
const directory = (runtime.playerDirectory || []).map((item) => {
  if (item && Object.keys(item).length === 1 && rosterById.has(item.id)) return rosterById.get(item.id);
  return item;
});

const ids = directory.map((player) => player.id);
assert(new Set(ids).size === ids.length, 'ID giocatore duplicati');
const names = directory.map((player) => String(player.playerName || '').trim().toLocaleLowerCase('it-IT'));
assert(new Set(names).size === names.length, 'nomi completi duplicati');

const mass = rosterById.get('bologna-pessina-mas');
const matt = rosterById.get('monza-pessina-mas');
assert(mass?.role === 'P' && mass?.playerName === 'Massimo Pessina', 'Massimo Pessina non valido');
assert(matt?.role === 'C' && matt?.playerName === 'Matteo Pessina', 'Matteo Pessina non valido');
assert(!matt.listone, 'Matteo Pessina non deve ereditare il listone di Massimo');

const activeInjuries = Object.values(runtime.injuriesByTeam || {}).flat();
const activeIds = new Set(activeInjuries.map((item) => item.canonicalPlayerId).filter(Boolean));
assert(activeInjuries.length === 34, `righe SOS attive ${activeInjuries.length}, attese 34`);
assert(activeIds.size === activeInjuries.length, 'duplicati nelle righe SOS attive');

let flagged = 0;
let falsePositive = 0;
let falseNegative = 0;
for (const player of roster) {
  const expected = activeIds.has(player.id);
  const publicFlag = player.sosFantaFlag === true;
  const indexedFlag = player.sosFlagActiveV769 === true;
  if (publicFlag) flagged += 1;
  if ((publicFlag || indexedFlag) && !expected) falsePositive += 1;
  if ((!publicFlag || !indexedFlag) && expected) falseNegative += 1;
}
assert(flagged === activeIds.size, `badge SOS ${flagged}, segnalazioni attive ${activeIds.size}`);
assert(falsePositive === 0, `falsi positivi SOS ${falsePositive}`);
assert(falseNegative === 0, `falsi negativi SOS ${falseNegative}`);
assert(flagged < roster.length / 4, 'badge SOS assegnato a una quota anomala della rosa');

const neutralRows = roster.filter((player) => /nessuna segnalazione|nessun infortunio|monitoraggio chiuso/i.test(String(player.physicalStatus || player.injuryStatus || '')));
assert(neutralRows.every((player) => !player.sosFantaFlag || activeIds.has(player.id)), 'stato neutro trasformato in SOS senza segnalazione attiva');

const find = (id) => directory.find((player) => player.id === id);
assert(find('venezia-akor-adams') && find('listone-6646'), 'Adams non distinti');
assert(find('atalanta-giovane-atalanta') && find('napoli-giovane-napoli'), 'Giovane non distinti');
assert(find('milan-yunus-musah')?.teamName === 'Milan', 'Yunus Musah non associato al Milan');
assert(find('inter-massolin')?.playerName === 'Yanis Massolin', 'Yanis Massolin non valido');
assert(directory.filter((player) => player.playerName === 'Alessio Romagnoli').length === 1, 'Alessio Romagnoli duplicato');

const operationalCollections = [archive.officialMoves || [], archive.teamTransferTalks || [], archive.injuries || []];
for (const collection of operationalCollections) {
  for (const item of collection) {
    assert(item.canonicalPlayerId && ids.includes(item.canonicalPlayerId), `riga senza identità ${item.playerName || item.title || ''}`);
  }
}

console.log(`Audit ioSudo V769 OK - ${flagged} badge SOS attivi su ${roster.length} giocatori, falsi positivi 0, catalogo ${directory.length}.`);
