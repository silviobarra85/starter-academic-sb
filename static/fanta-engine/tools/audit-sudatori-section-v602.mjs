import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const checks = [];
function ok(name, pass, detail = '') { checks.push({ name, pass, detail }); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function expectedModule(raw) {
  const m = String(raw || '').match(/\d\s*-\s*\d(?:\s*-\s*\d){0,2}/);
  return m ? m[0].replace(/\s+/g, '') : String(raw || '').trim();
}
function moduleParts(module) { return String(module || '').split('-').map((x) => Number(x)).filter(Boolean); }
function expectedCounts(module) {
  const p = moduleParts(module);
  if (p.length === 3) return { defense: p[0], midfield: p[1], attack: p[2] };
  if (p.length === 4) return { defense: p[0], midfield: p[1], attackingMidfield: p[2], attack: p[3] };
  return null;
}
function countLines(items) {
  const out = {};
  for (const x of items || []) out[x.formationLine || ''] = (out[x.formationLine || ''] || 0) + 1;
  return out;
}
function sideRank(pos, slot) {
  const p = String(pos || '').trim().toUpperCase();
  const fallback = Number.isFinite(Number(slot)) ? Number(slot) / 100 : 0;
  if (['DS', 'DCS', 'ES', 'CS', 'AS'].includes(p)) return 10 + fallback;
  if (['DD', 'DCD', 'ED', 'CD', 'AD'].includes(p)) return 90 + fallback;
  return 50 + fallback;
}
function sortedPositions(data, teamId, line) {
  return (data.formationsByTeam?.[teamId] || [])
    .filter((x) => x.formationLine === line)
    .slice()
    .sort((a, b) => sideRank(a.position, a.formationSlot) - sideRank(b.position, b.formationSlot) || Number(a.formationSlot ?? 99) - Number(b.formationSlot ?? 99))
    .map((x) => x.position)
    .join('-');
}

const css = 'static/fanta-engine/css/sudatori-section-v602.css';
const js = 'static/fanta-engine/js/sections/sudatori-section-v602.js';
const dataPath = 'static/fanta-engine/data/sudatori/current/sudatori-data.json';
const manifestPath = 'static/fanta-engine/data/sudatori/current/manifest.json';

ok('CSS V602 presente', exists(css), css);
ok('JS V602 presente', exists(js), js);
ok('Dati Sudatori presenti', exists(dataPath), dataPath);
ok('Manifest Sudatori presente', exists(manifestPath), manifestPath);

if (exists(js)) {
  const source = read(js);
  ok('Versione runtime V602', /const VERSION = 'V602'/.test(source), 'VERSION V602');
  ok('Render infortunati presente', /function\s+renderInjuries\s*\(/.test(source), 'renderInjuries');
  ok('Campetto usa formationsByTeam', /function\s+getFormation\s*\(/.test(source) && /getFormation\(team\.id\)/.test(source), 'getFormation');
  ok('Campetto nasconde OK e usa solo segnalazioni', /physicalPitchBadgeFromText/.test(source) && /hasPhysicalSignal/.test(source), 'physicalPitchBadgeFromText');
  ok('Campo ordina sinistra-centro-destra', /sortPitchLine/.test(source) && /pitchSideRank/.test(source), 'sortPitchLine');
  ok('Badge Probabile XI rimosso dalla tabella', !/Probabile XI/.test(source), 'no Probabile XI');
  ok('V602: helper market signal presente', /function\s+renderMarketSignal\s*\(/.test(source), 'renderMarketSignal');
  ok('V602: marketStatus In rosa non blocca note mercato', /isNeutralMarketStatus/.test(source) && /marketNotesFor\(player\)\.forEach/.test(source), 'neutral status + notes');
  ok('V602: badge Transfermarkt in colonna Mercato', /isTransfermarktMarketNote/.test(source) && /sourceLabel:\s*fromTransfermarkt \? 'TM'/.test(source), 'TM badge');
  ok('V602: colonna Mercato renderizza HTML badge', /<td>\$\{mercato\}<\/td>/.test(source), 'mercato HTML');
}
if (exists(css)) {
  const source = read(css);
  ok('CSS infortunati presente', /sudatori-injuries-v602/.test(source), 'sudatori-injuries-v602');
  ok('CSS badge segnalazione campo rosso', /is-field-alert/.test(source), 'is-field-alert');
  ok('CSS V602 badge mercato presente', /sudatori-market-flag-v602/.test(source), 'sudatori-market-flag-v602');
  ok('CSS V602 badge Transfermarkt presente', /is-transfermarkt/.test(source), 'is-transfermarkt');
}
if (exists(manifestPath)) {
  const manifest = JSON.parse(read(manifestPath));
  ok('Manifest V602', manifest.version === 'V602', manifest.version);
  ok('Manifest aggiornato 11/07', manifest.updatedAt === '2026-07-11', manifest.updatedAt);
  ok('Amichevoli aggiornate', Number(manifest.friendlies || 0) >= 89, String(manifest.friendlies));
  ok('Rumors Transfermarkt dichiarati', Number(manifest.transfermarktRumors || 0) >= 25, String(manifest.transfermarktRumors));
  ok('Trattative squadra aggiornate', Number(manifest.teamTransferTalks || 0) >= 132, String(manifest.teamTransferTalks));
}
if (exists(dataPath)) {
  const data = JSON.parse(read(dataPath));
  ok('Meta V602', data.meta?.version === 'V602', data.meta?.version);
  ok('Dati aggiornati 11/07', data.meta?.updatedAt === '2026-07-11', data.meta?.updatedAt);
  ok('20 squadre', (data.teams || []).length === 20, String((data.teams || []).length));
  ok('Rose complete', Number(data.meta?.players || 0) >= 724, String(data.meta?.players));
  ok('Nessun giocatore fuori rosa nelle formazioni', Number(data.meta?.formationMissingPlayers || 0) === 0, String(data.meta?.formationMissingPlayers));
  ok('Infortunati caricati', Object.values(data.injuriesByTeam || {}).flat().length >= 6, String(Object.values(data.injuriesByTeam || {}).flat().length));

  let shapeOk = true;
  let shapeDetail = [];
  for (const team of data.teams || []) {
    const items = data.formationsByTeam?.[team.id] || [];
    const module = team.formationModule || expectedModule(team.module);
    const exp = expectedCounts(module);
    const got = countLines(items);
    if (!items.length || !exp || got.goalkeeper !== 1 || Object.entries(exp).some(([k, v]) => got[k] !== v)) {
      shapeOk = false;
      shapeDetail.push(`${team.name}:${module}:${JSON.stringify(got)}`);
    }
    if (items.some((x) => x.moduleUsed !== module)) {
      shapeOk = false;
      shapeDetail.push(`${team.name}:moduleUsed mismatch`);
    }
  }
  ok('Tutti i campetti rispettano il modulo usato', shapeOk, shapeDetail.slice(0, 4).join(' | '));
  ok('Campo: Lazio difesa DS a sinistra e DD a destra', sortedPositions(data, 'lazio', 'defense') === 'DS-DC-DC-DD', sortedPositions(data, 'lazio', 'defense'));
  ok('Campo: Milan esterni ES a sinistra ed ED a destra', sortedPositions(data, 'milan', 'midfield') === 'ES-CC-CC-ED', sortedPositions(data, 'milan', 'midfield'));
  ok('Campo: Atalanta attacco AS a sinistra e AD a destra', sortedPositions(data, 'atalanta', 'attack') === 'AS-PC-AD', sortedPositions(data, 'atalanta', 'attack'));

  ok('V602: Atalanta-Atalanta Under 23 presente', (data.friendliesByTeam?.atalanta || []).some((f) => /under 23/i.test(f.event || '')), (data.friendliesByTeam?.atalanta || []).map((f) => f.event).join(', '));
  ok('V602: Real Madrid-Fiorentina presente', (data.friendliesByTeam?.fiorentina || []).some((f) => /real madrid/i.test(f.event || '')), (data.friendliesByTeam?.fiorentina || []).map((f) => f.event).join(', '));
  ok('V602: Burnley-Torino presente', (data.friendliesByTeam?.torino || []).some((f) => /burnley/i.test(f.event || '')), (data.friendliesByTeam?.torino || []).map((f) => f.event).join(', '));
  ok('V602: Lecce ha 4 amichevoli aggiornate', (data.friendliesByTeam?.lecce || []).length === 4, (data.friendliesByTeam?.lecce || []).map((f) => f.event).join(', '));
  ok('V602: Udinese senza amichevoli ma ritiro Lienz', (data.friendliesByTeam?.udinese || []).length === 0 && /lienz/i.test((data.teams || []).find((t) => t.id === 'udinese')?.retreatPlace || ''), JSON.stringify({ friendlies: data.friendliesByTeam?.udinese, team: (data.teams || []).find((t) => t.id === 'udinese') }));

  const rumors = data.transfermarktRumors || [];
  const rumorNames = rumors.map((x) => `${x.teamName}:${x.playerName}:${x.type}`).join(' | ');
  ok('V602: 25 rumors Transfermarkt caricati', rumors.length >= 25, String(rumors.length));
  ok('V602: Ederson rumor uscita Atalanta', rumors.some((x) => /atalanta/i.test(x.teamName || '') && /ederson/i.test(x.playerName || '') && /uscita/i.test(x.type || '')), rumorNames);
  ok('V602: Davinson Sanchez rumor Como', rumors.some((x) => /como/i.test(x.teamName || '') && /davinson/i.test(x.playerName || '')), rumorNames);
  ok('V602: Sergi Dominguez rumor Lazio', rumors.some((x) => /lazio/i.test(x.teamName || '') && /sergi/i.test(x.playerName || '')), rumorNames);
  const noteFor = (name) => data.marketNotesByPlayer?.[String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()] || [];
  ok('V602: Bremer ha rumor Transfermarkt anche se stato base puo essere In rosa', noteFor('Bremer').some((x) => /transfermarkt/i.test(`${x.source || ''} ${x.note || ''}`) && /uscita/i.test(x.status || x.type || '')), JSON.stringify(noteFor('Bremer')));
  ok('V602: Dodo ha rumor Transfermarkt nella lista note giocatore', noteFor('Dodo').some((x) => /transfermarkt/i.test(`${x.source || ''} ${x.note || ''}`) && /uscita/i.test(x.status || x.type || '')), JSON.stringify(noteFor('Dodo')));

  ok('V602: Ederson nella card trattative Atalanta', (data.teamTransferTalksByTeam?.atalanta || []).some((x) => /ederson/i.test(x.target || '')), (data.teamTransferTalksByTeam?.atalanta || []).map((x) => x.target).join(', '));
  ok('V602: Davinson Sanchez nella card trattative Como', (data.teamTransferTalksByTeam?.como || []).some((x) => /davinson/i.test(x.target || '')), (data.teamTransferTalksByTeam?.como || []).map((x) => x.target).join(', '));
  ok('V602: Ben Nelson nella card trattative Torino', (data.teamTransferTalksByTeam?.torino || []).some((x) => /ben nelson/i.test(x.target || '')), (data.teamTransferTalksByTeam?.torino || []).map((x) => x.target).join(', '));

  const fiorentinaPlayers = data.playersByTeam?.fiorentina || [];
  const milanPlayers = data.playersByTeam?.milan || [];
  const cagliariPlayers = data.playersByTeam?.cagliari || [];
  ok('V602: Atta resta in rosa Fiorentina', fiorentinaPlayers.some((p) => /atta/i.test(p.playerName || '')), fiorentinaPlayers.map((p) => p.playerName).filter((n) => /atta/i.test(n)).join(', '));
  ok('V602: Gila resta in rosa Milan', milanPlayers.some((p) => /^gila$/i.test(p.playerName || '')), milanPlayers.map((p) => p.playerName).filter((n) => /gila/i.test(n)).join(', '));
  ok('V602: Luvumbo non in Cagliari', !cagliariPlayers.some((p) => /luvumbo/i.test(p.playerName || '')), cagliariPlayers.map((p) => p.playerName).filter((n) => /luvumbo/i.test(n)).join(', '));
}

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = `static/${league}/index.html`;
  if (exists(index)) {
    const html = read(index);
    ok(`${league}: CSS Sudatori V602 referenziato`, html.includes('sudatori-section-v602.css?v=602'), index);
    ok(`${league}: JS Sudatori V602 referenziato`, html.includes('sudatori-section-v602.js?v=602'), index);
  }
  const cfg = `static/${league}/assets/league-config.json`;
  if (exists(cfg)) {
    const config = JSON.parse(read(cfg));
    ok(`${league}: currentVersion V602`, String(config.currentVersion) === '602', config.currentVersion);
    ok(`${league}: feature Sudatori V602`, config.features?.sudatoriStandaloneSectionVersion === 'V602', config.features?.sudatoriStandaloneSectionVersion);
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) console.log(`${c.pass ? 'OK' : 'FAIL'} - ${c.name}${c.detail ? ` (${c.detail})` : ''}`);
if (failed.length) {
  console.error(`\nAudit V602 fallito: ${failed.length} errori.`);
  process.exit(1);
}
console.log('\nAudit V602 superato.');
