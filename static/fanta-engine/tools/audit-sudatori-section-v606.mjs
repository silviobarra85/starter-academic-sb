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

function normalizeName(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}
function neutralMarketText(value) {
  const text = String(value || '').trim();
  if (!text) return true;
  return /^(in rosa|confermato|nessuna segnalazione|nessuna voce|nessuna trattativa|nessun rumor|ok)$/i.test(text) || /nessuna\s+segnalazione/i.test(text);
}
function isOfficialNewMarket(value) {
  return /nuovo\s+acquisto|acquisto\s+ufficiale|ufficiale\/riscatto|arrivo\s+dal|titolo\s+definitivo|contratto\s+fino/i.test(String(value || ''));
}
function isRumorMarket(value) {
  const text = String(value || '');
  if (!text || neutralMarketText(text)) return false;
  return /rumor|trattativ|interess|uscita|entrata|cessione|prestito|transfermarkt|tmw|da\s+verificare|monitorare|sondaggio|offerta|richiest|piace|obiettivo|contatti|negoziat/i.test(text);
}
function testBadge(player, notes = []) {
  const signal = [player?.flag, player?.marketStatus, player?.marketNote].filter((x) => x && !neutralMarketText(x)).join(' ');
  const detail = neutralMarketText(player?.marketDetail) ? '' : String(player?.marketDetail || '');
  const noteText = (n) => `${n?.type || ''} ${n?.status || ''} ${n?.note || ''} ${n?.source || ''}`;
  if (player?.newAcquisition || isOfficialNewMarket(`${signal} ${detail}`) || notes.some((n) => isOfficialNewMarket(noteText(n)))) return 'NUOVO';
  if (isRumorMarket(`${signal} ${detail}`) || notes.some((n) => isRumorMarket(noteText(n)))) return 'RUMOR';
  return 'CONFERMATO';
}

const css = 'static/fanta-engine/css/sudatori-section-v606.css';
const js = 'static/fanta-engine/js/sections/sudatori-section-v606.js';
const dataPath = 'static/fanta-engine/data/sudatori/current/sudatori-data.json';
const manifestPath = 'static/fanta-engine/data/sudatori/current/manifest.json';

ok('CSS V606 presente', exists(css), css);
ok('JS V606 presente', exists(js), js);
ok('Dati Sudatori presenti', exists(dataPath), dataPath);
ok('Manifest Sudatori presente', exists(manifestPath), manifestPath);

if (exists(js)) {
  const source = read(js);
  ok('Versione runtime V606', /const VERSION = 'V606'/.test(source), 'VERSION V606');
  ok('Render infortunati presente', /function\s+renderInjuries\s*\(/.test(source), 'renderInjuries');
  ok('Campetto usa formationsByTeam', /function\s+getFormation\s*\(/.test(source) && /getFormation\(team\.id\)/.test(source), 'getFormation');
  ok('Campetto nasconde OK e usa solo segnalazioni', /physicalPitchBadgeFromText/.test(source) && /hasPhysicalSignal/.test(source), 'physicalPitchBadgeFromText');
  ok('Campo ordina sinistra-centro-destra', /sortPitchLine/.test(source) && /pitchSideRank/.test(source), 'sortPitchLine');
  ok('Badge Probabile XI rimosso dalla tabella', !/Probabile XI/.test(source), 'no Probabile XI');
  ok('V606: helper market signal presente', /function\s+renderMarketSignal\s*\(/.test(source), 'renderMarketSignal');
  ok('V606: marketNotesFor risolve note anche per nome esteso/team', /function\s+marketNotesFor\s*\(/.test(source) && /noteTeamMatchesPlayer/.test(source), 'marketNotesFor team-aware');
  ok('V606: badge unico NUOVO RUMOR CONFERMATO', /marketBadgeInfo/.test(source) && /label: 'NUOVO'/.test(source) && /label: 'RUMOR'/.test(source) && /label: 'CONFERMATO'/.test(source), 'marketBadgeInfo');
  ok('V606: testo neutro non genera RUMOR', /neutralMarketText/.test(source) && !/rumor\|trattativ\|mercato\|interess/.test(source), 'neutralMarketText + no keyword mercato');
  ok('V606: colonna Mercato renderizza HTML badge', /<td>\$\{mercato\}<\/td>/.test(source), 'mercato HTML');
}
if (exists(css)) {
  const source = read(css);
  ok('CSS infortunati presente', /sudatori-injuries-v606/.test(source), 'sudatori-injuries-v606');
  ok('CSS badge segnalazione campo rosso', /is-field-alert/.test(source), 'is-field-alert');
  ok('CSS V606 badge mercato presente', /sudatori-market-flag-v606/.test(source), 'sudatori-market-flag-v606');
  ok('CSS V606 badge NUOVO presente', /is-new/.test(source), 'is-new');
  ok('CSS V606 badge RUMOR presente', /is-rumor/.test(source), 'is-rumor');
  ok('CSS V606 badge CONFERMATO presente', /is-confirmed/.test(source), 'is-confirmed');
}
if (exists(manifestPath)) {
  const manifest = JSON.parse(read(manifestPath));
  ok('Manifest V606', manifest.version === 'V606', manifest.version);
  ok('Manifest aggiornato 11/07', manifest.updatedAt === '2026-07-11', manifest.updatedAt);
  ok('Amichevoli aggiornate', Number(manifest.friendlies || 0) >= 89, String(manifest.friendlies));
  ok('Rumors Transfermarkt dichiarati', Number(manifest.transfermarktRumors || 0) >= 45, String(manifest.transfermarktRumors));
  ok('Trattative squadra aggiornate', Number(manifest.teamTransferTalks || 0) >= 152, String(manifest.teamTransferTalks));
}
if (exists(dataPath)) {
  const data = JSON.parse(read(dataPath));
  ok('Meta V606', data.meta?.version === 'V606', data.meta?.version);
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

  ok('V606: Atalanta-Atalanta Under 23 presente', (data.friendliesByTeam?.atalanta || []).some((f) => /under 23/i.test(f.event || '')), (data.friendliesByTeam?.atalanta || []).map((f) => f.event).join(', '));
  ok('V606: Real Madrid-Fiorentina presente', (data.friendliesByTeam?.fiorentina || []).some((f) => /real madrid/i.test(f.event || '')), (data.friendliesByTeam?.fiorentina || []).map((f) => f.event).join(', '));
  ok('V606: Burnley-Torino presente', (data.friendliesByTeam?.torino || []).some((f) => /burnley/i.test(f.event || '')), (data.friendliesByTeam?.torino || []).map((f) => f.event).join(', '));
  ok('V606: Lecce ha 4 amichevoli aggiornate', (data.friendliesByTeam?.lecce || []).length === 4, (data.friendliesByTeam?.lecce || []).map((f) => f.event).join(', '));
  ok('V606: Udinese senza amichevoli ma ritiro Lienz', (data.friendliesByTeam?.udinese || []).length === 0 && /lienz/i.test((data.teams || []).find((t) => t.id === 'udinese')?.retreatPlace || ''), JSON.stringify({ friendlies: data.friendliesByTeam?.udinese, team: (data.teams || []).find((t) => t.id === 'udinese') }));

  const rumors = data.transfermarktRumors || [];
  const rumorNames = rumors.map((x) => `${x.teamName}:${x.playerName}:${x.type}`).join(' | ');
  ok('V606: almeno 45 rumors Transfermarkt pagine 1-20 caricati', rumors.length >= 45, String(rumors.length));
  ok('V606: pagine Transfermarkt 1-20 tracciate', (data.transfermarktRumorPages || []).length === 20, String((data.transfermarktRumorPages || []).length));
  ok('V606: Ederson rumor uscita Atalanta', rumors.some((x) => /atalanta/i.test(x.teamName || '') && /ederson/i.test(x.playerName || '') && /uscita/i.test(x.type || '')), rumorNames);
  ok('V606: Davinson Sanchez rumor Como', rumors.some((x) => /como/i.test(x.teamName || '') && /davinson/i.test(x.playerName || '')), rumorNames);
  ok('V606: Sergi Dominguez rumor Lazio', rumors.some((x) => /lazio/i.test(x.teamName || '') && /sergi/i.test(x.playerName || '')), rumorNames);
  const noteFor = (name) => data.marketNotesByPlayer?.[String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()] || [];
  ok('V606: Bremer ha rumor Transfermarkt anche se stato base puo essere In rosa', noteFor('Bremer').some((x) => /transfermarkt/i.test(`${x.source || ''} ${x.note || ''}`) && /uscita/i.test(x.status || x.type || '')), JSON.stringify(noteFor('Bremer')));
  ok('V606: Dodo ha rumor Transfermarkt nella lista note giocatore', noteFor('Dodo').some((x) => /transfermarkt/i.test(`${x.source || ''} ${x.note || ''}`) && /uscita/i.test(x.status || x.type || '')), JSON.stringify(noteFor('Dodo')));

  const atalantaPlayers = data.playersByTeam?.atalanta || [];
  const neutralPlayer = atalantaPlayers.find((p) => /^carnesecchi$/i.test(p.playerName || ''));
  const bremer = (data.playersByTeam?.juventus || []).find((p) => /^bremer$/i.test(p.playerName || ''));
  ok('V606: giocatore neutro mostra CONFERMATO, non RUMOR', !!neutralPlayer && testBadge(neutralPlayer, noteFor('Carnesecchi')) === 'CONFERMATO', JSON.stringify(neutralPlayer && { name: neutralPlayer.playerName, marketStatus: neutralPlayer.marketStatus, marketDetail: neutralPlayer.marketDetail, badge: testBadge(neutralPlayer, noteFor('Carnesecchi')) }));
  ok('V606: Bremer mostra RUMOR da Transfermarkt', !!bremer && testBadge(bremer, noteFor('Bremer')) === 'RUMOR', JSON.stringify(bremer && { name: bremer.playerName, marketStatus: bremer.marketStatus, badge: testBadge(bremer, noteFor('Bremer')), notes: noteFor('Bremer').slice(0, 2) }));

  const napoliPlayers = data.playersByTeam?.napoli || [];
  const gaetano = atalantaPlayers.find((p) => /^gaetano$/i.test(p.playerName || ''));
  const giovaneAtalanta = atalantaPlayers.find((p) => /giovane/i.test(p.playerName || ''));
  const giovaneNapoli = napoliPlayers.find((p) => /giovane/i.test(p.playerName || ''));
  ok('V606: Gaetano Atalanta marcato nuovo acquisto', !!gaetano && gaetano.newAcquisition === true && /acquisto/i.test(gaetano.marketStatus || ''), JSON.stringify(gaetano && { name: gaetano.playerName, status: gaetano.marketStatus, flag: gaetano.flag, newAcquisition: gaetano.newAcquisition }));
  ok('V606: nota mercato Gaetano risolta anche con chiave breve', noteFor('Gaetano').some((x) => /atalanta/i.test(x.team || '') && /arrivo/i.test(x.note || '')), JSON.stringify(noteFor('Gaetano')));
  ok('V606: Giovane Napoli assegnato a Real Pisistrius', !!giovaneNapoli && /real pisistrius/i.test(`${giovaneNapoli.fantasyRoster || ''} ${giovaneNapoli.listone?.fantasyRoster || ''}`), JSON.stringify(giovaneNapoli && { name: giovaneNapoli.playerName, fantasyRoster: giovaneNapoli.fantasyRoster, listone: giovaneNapoli.listone?.fantasyRoster, method: giovaneNapoli.listoneMatchMethod }));
  ok('V606: Giovane Atalanta non eredita Real Pisistrius', !!giovaneAtalanta && !/real pisistrius/i.test(`${giovaneAtalanta.fantasyRoster || ''} ${giovaneAtalanta.listone?.fantasyRoster || ''}`), JSON.stringify(giovaneAtalanta && { name: giovaneAtalanta.playerName, fantasyRoster: giovaneAtalanta.fantasyRoster, listone: giovaneAtalanta.listone?.fantasyRoster, method: giovaneAtalanta.listoneMatchMethod }));

  ok('V606: Ederson nella card trattative Atalanta', (data.teamTransferTalksByTeam?.atalanta || []).some((x) => /ederson/i.test(x.target || '')), (data.teamTransferTalksByTeam?.atalanta || []).map((x) => x.target).join(', '));
  ok('V606: Davinson Sanchez nella card trattative Como', (data.teamTransferTalksByTeam?.como || []).some((x) => /davinson/i.test(x.target || '')), (data.teamTransferTalksByTeam?.como || []).map((x) => x.target).join(', '));
  ok('V606: Ben Nelson nella card trattative Torino', (data.teamTransferTalksByTeam?.torino || []).some((x) => /ben nelson/i.test(x.target || '')), (data.teamTransferTalksByTeam?.torino || []).map((x) => x.target).join(', '));

  const fiorentinaPlayers = data.playersByTeam?.fiorentina || [];
  const milanPlayers = data.playersByTeam?.milan || [];
  const cagliariPlayers = data.playersByTeam?.cagliari || [];
  ok('V606: Atta resta in rosa Fiorentina', fiorentinaPlayers.some((p) => /atta/i.test(p.playerName || '')), fiorentinaPlayers.map((p) => p.playerName).filter((n) => /atta/i.test(n)).join(', '));
  ok('V606: Gila resta in rosa Milan', milanPlayers.some((p) => /^gila$/i.test(p.playerName || '')), milanPlayers.map((p) => p.playerName).filter((n) => /gila/i.test(n)).join(', '));
  ok('V606: Luvumbo non in Cagliari', !cagliariPlayers.some((p) => /luvumbo/i.test(p.playerName || '')), cagliariPlayers.map((p) => p.playerName).filter((n) => /luvumbo/i.test(n)).join(', '));
}

for (const league of ['zonaorientale', 'fantapetillomantramanager']) {
  const index = `static/${league}/index.html`;
  if (exists(index)) {
    const html = read(index);
    ok(`${league}: CSS Sudatori V606 referenziato`, html.includes('sudatori-section-v606.css?v=606'), index);
    ok(`${league}: JS Sudatori V606 referenziato`, html.includes('sudatori-section-v606.js?v=606'), index);
  }
  const cfg = `static/${league}/assets/league-config.json`;
  if (exists(cfg)) {
    const config = JSON.parse(read(cfg));
    ok(`${league}: currentVersion V606`, String(config.currentVersion) === '606', config.currentVersion);
    ok(`${league}: feature Sudatori V606`, config.features?.sudatoriStandaloneSectionVersion === 'V606', config.features?.sudatoriStandaloneSectionVersion);
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) console.log(`${c.pass ? 'OK' : 'FAIL'} - ${c.name}${c.detail ? ` (${c.detail})` : ''}`);
if (failed.length) {
  console.error(`\nAudit V606 fallito: ${failed.length} errori.`);
  process.exit(1);
}
console.log('\nAudit V606 superato.');
