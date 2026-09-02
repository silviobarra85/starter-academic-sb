import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const json = (p) => JSON.parse(read(p));
const app = read('static/zonaorientale/assets/app.js');
const index = read('static/zonaorientale/index.html');
const release = json('static/zonaorientale/release.json');
const leagueConfig = json('static/zonaorientale/assets/league-config.json');
const configLoader = read('static/zonaorientale/assets/js/core/league-config-v443.js');
const rosterManifest = json('static/zonaorientale/assets/rose/manifest.json');
const rosterFile = 'static/zonaorientale/assets/rose/2026-2027-2026-09-02.json';
const rosters = json(rosterFile);
let pass = 0, fail = 0;
const check = (ok, label) => { if (ok) { pass++; console.log(`OK - ${label}`); } else { fail++; console.error(`FAIL - ${label}`); } };
const includes = (s) => app.includes(s);

check(release.version === '802' && release.entrypoint === 'assets/app.js?v=802', 'release V802 e entrypoint V802');
check(index.includes('Fantacalcio - V802 - Aggiornato al 02/09/2026') && index.includes('./assets/app.js?v=802'), 'home V802 allineata');
check(app.includes('version: "V802"') && app.includes('DEPLOY_EXPECTED_VERSION_V181 = "802"'), 'footer/diagnostica V802');
check(String(leagueConfig.currentVersion) === '802' && Number(leagueConfig?.branding?.footerVersion) === 802 && Number(leagueConfig?.ui?.footerVersion) === 802, 'league-config V802');
check(configLoader.includes("currentVersion: '802'") && configLoader.includes("league-config.json?v=802"), 'fallback league-config V802');
check(fs.existsSync(path.join(root, 'static/fanta-engine/js/core/roster-listone-sync-v787.js')), 'helper roster-listone V787 presente');

check(includes('renderAdminPanel("adminManualRosterPanelV802"') && includes('Modifica manualmente le rose'), 'pannello Admin gestione manuale rose');
check(includes('adminManualRosterSearchV802') && includes('findHistoricalRosterCandidatesV802'), 'ricerca nei listoni storici');
check(includes('data-admin-manual-roster-load-history-v802') && includes('loadHistoricalCandidateIntoFormV802'), 'caricamento candidato storico nel form');
check(includes('adminManualRosterPlayerNameV802') && includes('adminManualRosterFantacalcioIdV802') && includes('adminManualRosterRealTeamV802'), 'campi identita giocatore modificabili');
check(includes('adminManualRosterClassicRoleV802') && includes('adminManualRosterMantraRolesV802') && includes('adminManualRosterCostV802'), 'ruoli e costo modificabili');
check(includes('adminManualRosterQuotationCurrentV802') && includes('adminManualRosterQuotationInitialV802') && includes('adminManualRosterFvmV802'), 'quotazioni e FVM modificabili');
check(includes('saveManualRosterPlayerV802') && includes('source: "admin-manual-roster-v802"'), 'salvataggio manuale Firebase');
check(includes('writeManualRosterTombstoneV802') && includes('status: REMOVED'), 'eliminazione manuale tramite tombstone sicuro');
check(includes('findDuplicateEffectivePlayerV802'), 'protezione duplicati di rosa');
check(includes('buildEffectiveRosterMapV802') && includes('STATIC') && includes('FIREBASE'), 'merge baseline statica + overlay Firebase');
check(includes('applyRosterSideEffectForMovementV802') && includes('VENDITA') && includes('SVINCOLO'), 'svincoli/vendite creano override anche per giocatori statici');
check(includes('buildStaticRosterPayloadFromEffectiveV802'), 'generazione rose statiche dalla rosa effettiva');
check(includes('static/zonaorientale/assets/rose/manifest.json') && includes('zonaorientale_snapshot_stagioni_rose_'), 'overlay snapshot include assets/rose');
check(includes('assets/snapshots/seasons/manifest.json') && includes('assets/rose/manifest.json'), 'snapshot stagione e rose esportati insieme');
check(includes('getRosterPlayerQuotationCurrentV802') && includes('getPlayerReleaseQuotationFromListoniV261'), 'asteriscati mostrano ultima quotazione storica');

const latestRosterEntry = rosterManifest.rosters?.find((r) => r.id === '2026-2027-2026-09-02');
check(Boolean(latestRosterEntry), 'manifest rose include carryover 02/09');
const findPlayer = (teamName, playerName) => rosters.rosters?.find((r) => r.name === teamName)?.players?.find((p) => p.playerName === playerName);
const gosens = findPlayer('Beetlejuice', 'Gosens');
const maripan = findPlayer('River Plaid', 'Maripan');
check(gosens?.cost === 31 && gosens?.listoneStatusCode === 'ASTERISCATO' && Number(gosens?.quotationCurrent) === 11, 'Gosens Beetlejuice: costo 31, asteriscato, ultima Qt 11');
check(maripan?.cost === 1 && maripan?.listoneStatusCode === 'ASTERISCATO' && Number(maripan?.quotationCurrent) === 8, 'Maripan River Plaid: costo 1, asteriscato, ultima Qt 8');

// Simulazione minima della semantica overlay: tombstone rimuove baseline, ACTIVE la sostituisce/sposta.
const simulate = (baseline, overrides) => {
  const maps = new Map(Object.entries(baseline).map(([team, names]) => [team, new Map(names.map((n) => [n.toLowerCase(), n]))]));
  for (const row of overrides) {
    const key = row.playerName.toLowerCase();
    for (const bucket of maps.values()) bucket.delete(key);
    if (row.status !== 'REMOVED') {
      if (!maps.has(row.team)) maps.set(row.team, new Map());
      maps.get(row.team).set(key, row.playerName);
    }
  }
  return maps;
};
let sim = simulate({ A: ['Gosens'], B: [] }, [{ playerName: 'Gosens', team: 'A', status: 'REMOVED' }]);
check(!sim.get('A').has('gosens'), 'semantica tombstone rimuove un giocatore statico');
sim = simulate({ A: ['Gosens'], B: [] }, [{ playerName: 'Gosens', team: 'B', status: 'ACTIVE' }]);
check(!sim.get('A').has('gosens') && sim.get('B').has('gosens'), 'semantica ACTIVE consente spostamento manuale');

console.log(`Audit V802 Admin rose: ${pass}/${pass + fail} controlli superati.`);
if (fail) process.exit(1);
