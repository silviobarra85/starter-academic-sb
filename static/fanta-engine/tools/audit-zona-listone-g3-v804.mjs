import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const readJson = (rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
let ok = 0;
let fail = 0;
const check = (cond, msg, detail='') => {
  if (cond) { ok += 1; console.log(`OK - ${msg}${detail ? ` (${detail})` : ''}`); }
  else { fail += 1; console.error(`FAIL - ${msg}${detail ? ` (${detail})` : ''}`); }
};

const release = readJson('static/zonaorientale/release.json');
const league = readJson('static/zonaorientale/assets/league-config.json');
const lm = readJson('static/fanta-engine/data/shared-assets/current/assets/listoni/manifest.json');
const latestEntry = [...(lm.listoni || [])].filter(x => x.seasonId === '2026-2027').sort((a,b)=>String(a.loadedAt).localeCompare(String(b.loadedAt))).at(-1);
const listone = readJson(`static/fanta-engine/data/shared-assets/current/assets/listoni/${latestEntry?.file || ''}`);
const cm = readJson('static/zonaorientale/assets/competitions/manifest.json');
const camp = readJson('static/zonaorientale/assets/competitions/2026-2027/campionato-2026-2027.json');
const g3 = (camp.matches || []).filter(m => Number(m.leagueMatchday) === 3);
const played = (camp.matches || []).filter(m => String(m.status).toUpperCase() === 'GIOCATA');
const standings = camp.results || [];
const fixture = (h,a) => g3.find(m => m.homeTeamName === h && m.awayTeamName === a);

check(release.version === '804', 'release shell V804', release.version);
check(release.entrypoint === 'assets/app.js?v=804', 'entrypoint cache-buster V804');
check(league.currentVersion === '804', 'league-config V804', league.currentVersion);
check(String(league.lastOverlay || '').startsWith('V804'), 'lastOverlay V804');
check(latestEntry?.id === '2026-09-08', 'ultimo listone stagione 2026-2027 = 8 settembre', latestEntry?.id || '');
check(listone.meta?.rows === 593 && (listone.players || []).length === 593, 'listone contiene 593 giocatori');
check(listone.meta?.activeRows === 531, '531 giocatori In listone');
check(listone.meta?.asteriskRows === 62, '62 giocatori Asteriscati');
check(new Set((listone.players || []).map(p => p.fantacalcioId)).size === 593, 'nessun ID Fantacalcio duplicato');
check(new Set((listone.players || []).map(p => String(p.playerName || '').trim().toLowerCase())).size === 593, 'nessun nome duplicato');
check((camp.matches || []).length === 180, 'Campionato conserva 180 partite');
check(played.length === 15, 'prime tre giornate concluse = 15 partite', String(played.length));
check(g3.length === 5 && g3.every(m => m.status === 'GIOCATA'), 'terza giornata completa con 5 partite');
check(g3.every(m => m.matchDate === '2026-09-06'), 'tutta la terza giornata ha data 2026-09-06');

const expected = [
  ['Afc Severgas Baronissi','Olympic Salerno FC',2,3,74.5,80],
  ['Ac Milan','As Paperopoli',1,2,68.5,75.5],
  ['River Plaid','Prestige Worldwide',3,3,78.5,81.5],
  ['Beetlejuice','real mappine',1,1,70.5,67.5],
  ['Real Pisistrius','FC DueFratelli2005',1,2,67.5,76.5],
];
for (const [h,a,hg,ag,hfp,afp] of expected) {
  const m = fixture(h,a);
  check(Boolean(m) && m.homeGoals === hg && m.awayGoals === ag && Number(m.homeScore) === hfp && Number(m.awayScore) === afp, `G3 ${h} - ${a} corretta`);
}
check(standings.length === 10, 'classifica statica V804 contiene 10 squadre');
check(standings[0]?.teamName === 'Olympic Salerno FC' && standings[0]?.points === 6, 'Olympic primo dopo tre giornate');
check(standings.every((r,i)=>r.position===i+1 && r.played===3), 'classifica posizioni 1-10 e PG=3');
const campEntry=(cm.competitions||[]).find(x=>x.competitionId==='2026-2027_campionato');
check(campEntry?.playedMatches === 15 && campEntry?.loadedAt === '2026-09-08', 'manifest competizioni allineato a G3');
check(fs.readFileSync(path.join(root,'static/zonaorientale/assets/app.js'),'utf8').includes('DEPLOY_EXPECTED_VERSION_V181 = "804"'), 'diagnostica deploy V804');
check(fs.readFileSync(path.join(root,'static/zonaorientale/assets/app.js'),'utf8').includes('ZonaOrientaleManualRostersV802'), 'gestione manuale rose Admin preservata');

console.log(`Audit V804 listone + G3: ${ok}/${ok+fail} controlli superati.`);
if (fail) process.exit(1);
