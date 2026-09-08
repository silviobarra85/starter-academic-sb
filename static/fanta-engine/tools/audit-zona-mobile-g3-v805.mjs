import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const read = (rel) => fs.readFileSync(path.join(root, 'static', rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));
const checks = [];
const check = (ok, label) => { checks.push([Boolean(ok), label]); console.log(`${ok ? 'OK' : 'ERRORE'} - ${label}`); };

const release = json('zonaorientale/release.json');
const app = read('zonaorientale/assets/app.js');
const detail = read('zonaorientale/competition.html');
const calendar = json('zonaorientale/assets/competitions/2026-2027/campionato-2026-2027.json');
const manifest = json('zonaorientale/assets/competitions/manifest.json');

check(release.version === '805', 'release shell V805');
check(release.entrypoint === 'assets/app.js?v=805', 'entrypoint cache-buster V805');
check(app.includes('ZonaOrientaleCompetitionMobileParityV805'), 'parita competizioni desktop/mobile installata');
check(app.includes('mobile.innerHTML = competitions.map((competition) => renderDesktopCompetitionCardV155(competition)).join("")'), 'mobile usa la card completa con classifica e giornate');
check(app.includes('params.set("v", "805")'), 'link competition.html usa cache-buster V805');
check(detail.includes('withCompetitionReleaseV805'), 'fetch dettaglio competizione cache-bust V805');
check(detail.includes('computeLeagueStandingsV805'), 'classifica dettaglio ricalcolata dalle partite');
check(detail.includes('getCompetitionResultTeamKeyV805'), 'deduplica risultati per identita squadra');

const matches = Array.isArray(calendar.matches) ? calendar.matches : [];
check(matches.length === 180, 'Campionato mantiene 180 partite');
const byDay = (day) => matches.filter((m) => Number(m.leagueMatchday) === day);
check(byDay(1).length === 5 && byDay(1).every((m) => m.matchDate === '2026-08-23'), 'Giornata 1 datata 23 agosto 2026');
check(byDay(2).length === 5 && byDay(2).every((m) => m.matchDate === '2026-08-30'), 'Giornata 2 datata 30 agosto 2026');
check(byDay(3).length === 5 && byDay(3).every((m) => m.matchDate === '2026-09-06'), 'Giornata 3 datata 6 settembre 2026');
check(byDay(3).every((m) => String(m.status).toUpperCase() === 'GIOCATA'), 'Giornata 3 visibile come conclusa');

const played = matches.filter((m) => String(m.status).toUpperCase() === 'GIOCATA');
check(played.length === 15, '15 partite giocate dopo tre giornate');
const results = Array.isArray(calendar.results) ? calendar.results : [];
const teamKeys = results.map((r) => String(r.seasonTeamId || r.teamName || '').trim().toLowerCase()).filter(Boolean);
check(results.length === 10 && new Set(teamKeys).size === 10, 'classifica statica ha 10 squadre uniche');
const realCount = results.filter((r) => String(r.teamName || '').toLowerCase() === 'real pisistrius').length;
check(realCount === 1, 'Real Pisistrius compare una sola volta nella classifica statica');
const entry = (manifest.competitions || []).find((e) => e.competitionId === '2026-2027_campionato');
check(entry?.playedMatches === 15, 'manifest Campionato allineato a 15 partite giocate');

const failed = checks.filter(([ok]) => !ok);
console.log(`Audit V805 mobile/G3: ${checks.length - failed.length}/${checks.length} controlli superati.`);
if (failed.length) process.exit(1);
