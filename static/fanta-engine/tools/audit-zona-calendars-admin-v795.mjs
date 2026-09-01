import fs from 'fs';
import path from 'path';

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const readText = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const readJson = (rel) => JSON.parse(readText(rel));
const checks = [];
const check = (name, condition, details='') => checks.push({name, ok:Boolean(condition), details});

const snap = readJson('static/zonaorientale/assets/snapshots/seasons/2026-2027.json');
const manifest = readJson('static/zonaorientale/assets/competitions/manifest.json');
const app = readText('static/zonaorientale/assets/app.js');
const index = readText('static/zonaorientale/index.html');
const release = readJson('static/zonaorientale/release.json');
const leagueConfig = readJson('static/zonaorientale/assets/league-config.json');
const teamIds = new Set((snap.seasonTeams || []).map(t => t.id));

const currentEntries = (manifest.competitions || []).filter(e => e.seasonId === '2026-2027');
const byCompetition = new Map(currentEntries.map(e => [e.competitionId, e]));
check('Manifest contiene Campionato 2026-2027', byCompetition.has('2026-2027_campionato'));
check('Manifest contiene Coppa Italia 2026-2027', byCompetition.has('2026-2027_coppa_italia'));
check("Manifest contiene Champion's League 2026-2027", byCompetition.has('2026-2027_champions'));

function loadEntry(id) {
  const entry = byCompetition.get(id);
  if (!entry) return {entry:null,payload:null};
  return {entry, payload:readJson(`static/zonaorientale/assets/competitions/${entry.file}`)};
}
const camp = loadEntry('2026-2027_campionato');
const coppa = loadEntry('2026-2027_coppa_italia');
const champions = loadEntry('2026-2027_champions');

check('Campionato: 180 partite', camp.payload?.matches?.length === 180, String(camp.payload?.matches?.length));
check('Campionato: 10 partite giocate (giornate 1-2)', camp.payload?.matches?.filter(m => m.status === 'GIOCATA').length === 10);
check('Campionato: 170 partite da giocare', camp.payload?.matches?.filter(m => m.status === 'DA_GIOCARE').length === 170);
check('Campionato: 36 giornate lega', new Set(camp.payload?.matches?.map(m => m.leagueMatchday)).size === 36);
check('Campionato live non blocca classifica con results statici', !Object.prototype.hasOwnProperty.call(camp.payload || {}, 'results'));

const expectedPlayed = new Map([
  ['1|Afc Severgas Baronissi|Beetlejuice','1-0|70|61.5'],
  ['1|Ac Milan|Prestige Worldwide','4-0|87|61.5'],
  ['1|River Plaid|real mappine','1-2|67.5|72'],
  ['1|FC DueFratelli2005|As Paperopoli','1-2|66.5|76.5'],
  ['1|Real Pisistrius|Olympic Salerno FC','3-2|79|75'],
  ['2|Prestige Worldwide|Afc Severgas Baronissi','1-2|71|72.5'],
  ['2|As Paperopoli|Real Pisistrius','1-3|67|81'],
  ['2|real mappine|FC DueFratelli2005','1-2|66.5|74'],
  ['2|Beetlejuice|River Plaid','1-0|67.5|63.5'],
  ['2|Olympic Salerno FC|Ac Milan','2-1|77.5|71.5'],
]);
let playedOk = true;
for (const m of camp.payload?.matches || []) {
  if (m.status !== 'GIOCATA') continue;
  const key = `${m.leagueMatchday}|${m.homeTeamName}|${m.awayTeamName}`;
  const got = `${m.homeGoals}-${m.awayGoals}|${Number(m.homeScore)}|${Number(m.awayScore)}`;
  if (expectedPlayed.get(key) !== got) playedOk = false;
}
check('Campionato: risultati giornate 1-2 coerenti con Excel', playedOk && expectedPlayed.size === 10);

check('Coppa Italia: 180 partite', coppa.payload?.matches?.length === 180);
check('Coppa Italia: 4 giornate x 45 confronti', [1,2,3,4].every(md => coppa.payload?.matches?.filter(m => m.leagueMatchday === md).length === 45));
const coppaSerieA = [...new Set((coppa.payload?.matches || []).map(m => m.serieAMatchday))].sort((a,b)=>a-b);
check('Coppa Italia: giornate Serie A 8/17/24/26', JSON.stringify(coppaSerieA) === JSON.stringify([8,17,24,26]), JSON.stringify(coppaSerieA));
check('Coppa Italia: formula 1 Vs Tutti', coppa.payload?.competition?.format === 'UNO_VS_TUTTI');
check('Coppa Italia: tutte da giocare', coppa.payload?.matches?.every(m => m.status === 'DA_GIOCARE' && m.homeGoals == null && m.awayGoals == null && m.homeScore == null && m.awayScore == null));

check("Champion's: 8 partite quarti", champions.payload?.matches?.length === 8);
check("Champion's: 4 andata + 4 ritorno", champions.payload?.matches?.filter(m => m.matchday === 'QF - Andata').length === 4 && champions.payload?.matches?.filter(m => m.matchday === 'QF - Ritorno').length === 4);
const champSerieA = [...new Set((champions.payload?.matches || []).map(m => m.serieAMatchday))].sort((a,b)=>a-b);
check("Champion's: giornate Serie A 7/9", JSON.stringify(champSerieA) === JSON.stringify([7,9]));
check("Champion's: tutte da giocare", champions.payload?.matches?.every(m => m.status === 'DA_GIOCARE'));

for (const [label, payload] of [['Campionato',camp.payload],['Coppa',coppa.payload],['Champions',champions.payload]]) {
  const keys = new Set(); let mapped = true; let dup = false;
  for (const m of payload?.matches || []) {
    mapped &&= teamIds.has(m.homeSeasonTeamId) && teamIds.has(m.awaySeasonTeamId);
    const key = [m.competitionId,m.matchday,m.serieAMatchday,m.homeSeasonTeamId,m.awaySeasonTeamId].join('|');
    if (keys.has(key)) dup = true; keys.add(key);
  }
  check(`${label}: tutte le squadre mappate su seasonTeamId`, mapped);
  check(`${label}: nessun duplicato di partita`, !dup);
}

const comps = new Map((snap.competitions || []).map(c => [c.id,c]));
check('Snapshot: Campionato ATTIVA/CLASSIFICA', comps.get('2026-2027_campionato')?.status === 'ATTIVA' && comps.get('2026-2027_campionato')?.format === 'CLASSIFICA');
check("Snapshot: Champion's PROGRAMMATA/GIRONI_KO", comps.get('2026-2027_champions')?.status === 'PROGRAMMATA' && comps.get('2026-2027_champions')?.type === 'CHAMPIONS_LEAGUE');
check('Snapshot: Coppa PROGRAMMATA/UNO_VS_TUTTI', comps.get('2026-2027_coppa_italia')?.status === 'PROGRAMMATA' && comps.get('2026-2027_coppa_italia')?.format === 'UNO_VS_TUTTI');
check('Snapshot V795', snap.snapshotVersion === 'V795');

check('Admin: saveCompetitionMatch collegato al submit', app.includes('competitionMatchesForm?.addEventListener("submit", saveCompetitionMatch)'));
check('Admin: saveCompetitionResult collegato al submit', app.includes('competitionResultsForm?.addEventListener("submit", saveCompetitionResults)'));
check('Admin: competizioni collegate al submit', app.includes('competitionForm?.addEventListener("submit", saveCompetition)'));
check('Admin: stagioni collegate al submit', app.includes('seasonForm?.addEventListener("submit", saveSeason)'));
check('Admin: squadre collegate al submit', app.includes('teamForm?.addEventListener("submit", saveTeam)'));
check('Admin: squadre stagione collegate al submit', app.includes('seasonTeamForm?.addEventListener("submit", saveSeasonTeam)'));
check('Admin: presidenti collegati al submit', app.includes('presidentForm?.addEventListener("submit", savePresident)'));
check('Admin: stadi collegati al submit', app.includes('stadiumForm?.addEventListener("submit", saveStadium)'));
check('Admin: FIFA ranking collegato al submit', app.includes('fifaRankingForm?.addEventListener("submit", saveFifaRanking)'));
check('Admin: convertitore listone collegato al submit', app.includes('listoneConverterForm?.addEventListener("submit", handleListoneConverterSubmit)'));
check('Admin: import calendario Excel collegato', app.includes('adminStaticCompetitionImportForm') && app.includes('handleStaticCompetitionImportPreviewV105'));
check('Admin: JSON calendario editabile con pulsante risultato', app.includes('data-admin-edit-match="${escapeHtml(row.staticMatch.id)}"') && app.includes('Inserisci risultato'));
check('Admin: fallback edit partita dal calendario statico', app.includes('editCompetitionMatchV795') && app.includes('state.competitionCalendars'));
check('Admin: salvataggio partita marcato Firebase override', app.includes('source: "firebase-admin-v795"') && app.includes('deleted: false'));
check('Admin: risultato Firebase prevale sul calendario JSON', app.includes('getCompetitionMatchesV795') && app.includes('{ ...staticMatch, ...override'));
check('Admin: FP statici non sovrascrivono Firebase', app.includes('mergeStaticValueV107(existingMatch, staticMatch, "homeScore");') && !app.includes('mergeStaticValueV107(existingMatch, staticMatch, "homeScore", { overwrite: true });'));
check('Admin: parser Excel considera - come DA_GIOCARE', app.includes('goals.homeGoals !== ""') && app.includes('status: played ? "GIOCATA" : "DA_GIOCARE"'));
check('Admin: parser Excel supporta calendari a giornate senza stage', app.includes('currentStage = { stage: "GIORNATE", label: "Giornate", code: "g" }'));
check('Classifica live calcolata dai risultati partita', app.includes('computeCompetitionStandingsFromMatchesV795') && app.includes('computed-from-matches-v795'));
check('Classifica tie-break usa fantapunti dopo punti', app.includes('(b.points - a.points) || (b.fantapoints - a.fantapoints)'));
check('Snapshot Admin competizioni/classifiche disponibile', app.includes('async function saveCompetitionDataSnapshotV116()') && app.includes('saveSeasonSnapshotByIdV34(seasonId)'));

check('Release V795', release.version === '795' && release.entrypoint === 'assets/app.js?v=795');
check('Home cache-bust V795', index.includes('assets/app.js?v=795') && index.includes('Fantacalcio - V795'));
check('League config ultimo overlay V795', String(leagueConfig.lastOverlay || '').startsWith('V795'));
check('ioSudo rimosso dalla root statica', !fs.existsSync(path.join(root,'static/iosudo')));

const ok = checks.filter(c=>c.ok).length;
for (const c of checks) console.log(`${c.ok?'OK':'ERRORE'} - ${c.name}${c.details?` (${c.details})`:''}`);
console.log(`Audit calendari/Admin V795: ${ok}/${checks.length} controlli superati.`);
if (ok !== checks.length) process.exit(1);
