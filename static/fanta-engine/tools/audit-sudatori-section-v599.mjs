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

const css = 'static/fanta-engine/css/sudatori-section-v599.css';
const js = 'static/fanta-engine/js/sections/sudatori-section-v599.js';
const dataPath = 'static/fanta-engine/data/sudatori/current/sudatori-data.json';
const manifestPath = 'static/fanta-engine/data/sudatori/current/manifest.json';

ok('CSS V599 presente', exists(css), css);
ok('JS V599 presente', exists(js), js);
ok('Dati Sudatori presenti', exists(dataPath), dataPath);
ok('Manifest Sudatori presente', exists(manifestPath), manifestPath);

if (exists(js)) {
  const source = read(js);
  ok('Versione runtime V599', /const VERSION = 'V599'/.test(source), 'VERSION V599');
  ok('Render infortunati presente', /function\s+renderInjuries\s*\(/.test(source), 'renderInjuries');
  ok('Campetto usa formationsByTeam', /function\s+getFormation\s*\(/.test(source) && /getFormation\(team\.id\)/.test(source), 'getFormation');
  ok('Badge fisico presente', /physicalBadgeFromText/.test(source), 'physicalBadgeFromText');
  ok('Campetto nasconde OK e usa solo segnalazioni', /physicalPitchBadgeFromText/.test(source) && /hasPhysicalSignal/.test(source), 'physicalPitchBadgeFromText');
  ok('Campetto ordina sinistra-centro-destra', /sortPitchLine/.test(source) && /pitchSideRank/.test(source), 'sortPitchLine');
  ok('Badge Probabile XI rimosso dalla tabella', !/Probabile XI/.test(source), 'no Probabile XI');
}
if (exists(css)) {
  const source = read(css);
  ok('CSS infortunati presente', /sudatori-injuries-v599/.test(source), 'sudatori-injuries-v599');
  ok('CSS stato fisico presente', /sudatori-physical-v599/.test(source), 'sudatori-physical-v599');
  ok('CSS badge segnalazione campo rosso', /is-field-alert/.test(source), 'is-field-alert');
}
if (exists(manifestPath)) {
  const manifest = JSON.parse(read(manifestPath));
  ok('Manifest V599', manifest.version === 'V599', manifest.version);
  ok('Infortuni dichiarati', Number(manifest.injuries || 0) >= 6, String(manifest.injuries));
}
if (exists(dataPath)) {
  const data = JSON.parse(read(dataPath));
  ok('Meta V599', data.meta?.version === 'V599', data.meta?.version);
  ok('Infortunati caricati', Number(data.meta?.injuries || 0) >= 6, String(data.meta?.injuries));
  ok('Infortuni by team presente', Object.values(data.injuriesByTeam || {}).flat().length >= 6, String(Object.values(data.injuriesByTeam || {}).flat().length));
  ok('Nessun giocatore fuori rosa nelle formazioni', Number(data.meta?.formationMissingPlayers || 0) === 0, String(data.meta?.formationMissingPlayers));
  const ata = data.formationsByTeam?.atalanta || [];
  ok('Atalanta: Kossounou in XI', ata.some((p) => /kossounou/i.test(p.playerName || '')), ata.map((p) => p.playerName).join(', '));
  ok('Atalanta: Gaetano in XI aggiornato', ata.some((p) => /^gaetano$/i.test(p.playerName || '')), ata.map((p) => p.playerName).join(', '));
  ok('Atalanta: Hien non in XI', !ata.some((p) => /^hien$/i.test(p.playerName || '')), ata.map((p) => p.playerName).join(', '));
  const laz = data.formationsByTeam?.lazio || [];
  ok('Lazio: Cancellieri in XI', laz.some((p) => /cancellieri/i.test(p.playerName || '')), laz.map((p) => p.playerName).join(', '));
  ok('Lazio: Isaksen non in XI', !laz.some((p) => /isaksen/i.test(p.playerName || '')), laz.map((p) => p.playerName).join(', '));
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
  ok('Tutti i campetti rispettano il modulo dichiarato', shapeOk, shapeDetail.slice(0, 4).join(' | '));
  function sideRank(pos, slot) {
    const p = String(pos || '').trim().toUpperCase();
    const fallback = Number.isFinite(Number(slot)) ? Number(slot) / 100 : 0;
    if (['DS', 'DCS', 'ES', 'CS', 'AS'].includes(p)) return 10 + fallback;
    if (['DD', 'DCD', 'ED', 'CD', 'AD'].includes(p)) return 90 + fallback;
    return 50 + fallback;
  }
  function sortedPositions(teamId, line) {
    return (data.formationsByTeam?.[teamId] || [])
      .filter((x) => x.formationLine === line)
      .slice()
      .sort((a, b) => sideRank(a.position, a.formationSlot) - sideRank(b.position, b.formationSlot) || Number(a.formationSlot ?? 99) - Number(b.formationSlot ?? 99))
      .map((x) => x.position)
      .join('-');
  }
  ok('Campo: Lazio difesa DS a sinistra e DD a destra', sortedPositions('lazio', 'defense') === 'DS-DC-DC-DD', sortedPositions('lazio', 'defense'));
  ok('Campo: Milan esterni ES a sinistra ed ED a destra', sortedPositions('milan', 'midfield') === 'ES-CC-CC-ED', sortedPositions('milan', 'midfield'));
  ok('Campo: Atalanta attacco AS a sinistra e AD a destra', sortedPositions('atalanta', 'attack') === 'AS-PC-AD', sortedPositions('atalanta', 'attack'));

  const fiorentinaPlayers = data.playersByTeam?.fiorentina || [];
  const udinesePlayers = data.playersByTeam?.udinese || [];
  const veneziaPlayers = data.playersByTeam?.venezia || [];
  ok('TMW: Atta in rosa Fiorentina', fiorentinaPlayers.some((p) => /atta/i.test(p.playerName || '')), fiorentinaPlayers.map((p) => p.playerName).filter((n) => /atta/i.test(n)).join(', '));
  ok('TMW: Atta non resta in Udinese', !udinesePlayers.some((p) => /atta/i.test(p.playerName || '')), udinesePlayers.map((p) => p.playerName).filter((n) => /atta/i.test(n)).join(', '));
  ok('TMW: Plizzari non in rosa Venezia', !veneziaPlayers.some((p) => /plizzari/i.test(p.playerName || '')), veneziaPlayers.map((p) => p.playerName).filter((n) => /plizzari/i.test(n)).join(', '));
  ok('TMW: news TMW caricate', Number(data.meta?.tmwMarketNews || 0) >= 7, String(data.meta?.tmwMarketNews));
  const tmwNames = (data.tmwMarketNews || []).map((x) => x.playerName || '').join(' | ');
  ok('TMW: Gila, Khalaili, Martinez, Akor Adams presenti', /gila/i.test(tmwNames) && /khalaili/i.test(tmwNames) && /martinez/i.test(tmwNames) && /akor/i.test(tmwNames), tmwNames);
  const milanNotes = data.marketNotesByPlayer?.pulisic || [];
  ok('TMW: nota Pulisic caricata', milanNotes.some((n) => /tmw|tuttomercato|nuovo stop/i.test(`${n.note || ''} ${n.source || ''}`)), JSON.stringify(milanNotes));
  const lazioXi = data.formationsByTeam?.lazio || [];
  ok('TMW: Lazio Gigot in XI', lazioXi.some((p) => /gigot/i.test(p.playerName || '')), lazioXi.map((p) => p.playerName).join(', '));
  ok('TMW: Lazio Gila fuori XI', !lazioXi.some((p) => /gila/i.test(p.playerName || '')), lazioXi.map((p) => p.playerName).join(', '));
  ok('TMW: trattativa Khalaili Inter', (data.teamTransferTalksByTeam?.inter || []).some((x) => /khalaili/i.test(x.target || '')), (data.teamTransferTalksByTeam?.inter || []).map((x) => x.target).join(', '));
  ok('TMW: trattativa Emiliano Martinez Juventus', (data.teamTransferTalksByTeam?.juventus || []).some((x) => /martinez/i.test(x.target || '')), (data.teamTransferTalksByTeam?.juventus || []).map((x) => x.target).join(', '));
  ok('TMW: trattativa Akor Adams Venezia', (data.teamTransferTalksByTeam?.venezia || []).some((x) => /akor/i.test(x.target || '')), (data.teamTransferTalksByTeam?.venezia || []).map((x) => x.target).join(', '));
}

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = `static/${league}/index.html`;
  if (exists(index)) {
    const html = read(index);
    ok(`${league}: CSS Sudatori V599 referenziato`, html.includes('sudatori-section-v599.css?v=599'), index);
    ok(`${league}: JS Sudatori V599 referenziato`, html.includes('sudatori-section-v599.js?v=599'), index);
  }
  const cfg = `static/${league}/assets/league-config.json`;
  if (exists(cfg)) {
    const config = JSON.parse(read(cfg));
    ok(`${league}: currentVersion V599`, String(config.currentVersion) === '599', config.currentVersion);
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) console.log(`${c.pass ? 'OK' : 'FAIL'} - ${c.name}${c.detail ? ` (${c.detail})` : ''}`);
if (failed.length) {
  console.error(`\nAudit V599 fallito: ${failed.length} errori.`);
  process.exit(1);
}
console.log('\nAudit V599 superato.');
