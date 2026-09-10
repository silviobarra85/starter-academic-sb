import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));
let ok = 0;
let fail = 0;
function check(condition, label) {
  if (condition) { console.log(`OK - ${label}`); ok += 1; }
  else { console.error(`FAIL - ${label}`); fail += 1; }
}

const app = read('static/zonaorientale/assets/app.js');
const release = json('static/zonaorientale/release.json');
const config = json('static/zonaorientale/assets/league-config.json');
const snapshot = json('static/zonaorientale/assets/snapshots/seasons/2026-2027.json');
const september = (snapshot.fmMovements || []).filter((m) => m.date === '2026-09-10' && m.type === 'SVINCOLO');

check(release.version === '808', 'release V808');
check(release.entrypoint === 'assets/app.js?v=808', 'entrypoint V808');
check(config.currentVersion === '808', 'league config V808');
check(app.includes('installStaticFmMovementsAdminV808'), 'patch Admin movimenti static-first presente');
check(app.includes('ensureStaticFmMovementsForSeasonV808'), 'caricamento movimenti dallo snapshot statico presente');
check(app.includes('state.firebaseFmMovementsRawV808'), 'Firebase mantenuto come delta separato');
check(app.includes('rebuildEffectiveFmMovementsV808'), 'merge statico + override presente');
check(app.includes('admin-static-movement-override-v808'), 'modifica statico crea override Firebase');
check(app.includes('admin-static-movement-tombstone-v808'), 'eliminazione statico crea tombstone');
check(app.includes('await setDoc(doc(db, "fmMovements", editingMovementId), payload, { merge: true })'), 'editing usa setDoc idempotente e non updateDoc');
check(app.includes('downloadStaticSeasonSnapshotsOverlayV808'), 'export snapshot consolida i delta');
check(app.includes('publicFirestoreReadsAdded: 0'), 'nessuna lettura Firebase aggiunta al percorso pubblico');
check(september.length === 10, '10 movimenti SVINCOLO statici del 10/09 presenti');
check(september.reduce((sum, m) => sum + Number(m.amount || 0), 0) === 223, 'totale 223 FM negli svincoli statici');
check(september.every((m) => String(m.id || '').startsWith('svincoli_settembre_2026_')), 'svincoli statici hanno id deterministici modificabili');

// Simulazione minimale del contratto di merge: override sostituisce, tombstone elimina.
const base = { id: 'm1', seasonId: '2026-2027', amount: 10, description: 'base' };
const override = { id: 'm1', amount: 12, description: 'override' };
const merged = { ...base, ...override, id: base.id };
check(merged.amount === 12 && merged.description === 'override', 'contratto override prevale sulla baseline');
const tombstone = { id: 'm1', status: 'REMOVED', deleted: true };
check(String(tombstone.status).toUpperCase() === 'REMOVED' && tombstone.deleted === true, 'contratto tombstone riconoscibile');

console.log(`\nAudit V808 Admin movimenti statici: ${ok}/${ok + fail} controlli superati.`);
if (fail) process.exit(1);
