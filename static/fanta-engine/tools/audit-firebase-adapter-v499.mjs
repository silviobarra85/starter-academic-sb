#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd(); let ok = 0, fail = 0; const failures = [];
function abs(p){ return path.join(root,p); }
function exists(p){ return fs.existsSync(abs(p)); }
function read(p){ return fs.readFileSync(abs(p),'utf8'); }
function readJson(p){ return JSON.parse(read(p)); }
function check(c,l){ if(c){ ok++; console.log(`OK  - ${l}`); } else { fail++; failures.push(l); console.error(`FAIL - ${l}`); } }
const adapterPath = 'fanta-engine/js/firebase/firebase-adapter-v499.js';
check(exists(adapterPath), 'adapter Firebase V499 presente');
const adapter = read(adapterPath);
for (const token of ['FIREBASE_ADAPTER_VERSION_V499','FIREBASE_DATA_MODEL_MODE_V499','normalizeFirebaseLeagueConfigV499','resolveFirebaseCollectionNameV499','createFirebaseLeagueRuntimeV499','collectionRef','docRef','leagueWhere','seasonWhere','withLeagueMetadata','runtimeInfo','FantaEngineFirebaseAdapterV499']) check(adapter.includes(token), `adapter token ${token}`);
check(adapter.includes('flat-collections-preserved'), 'adapter preserva modello flat');
check(adapter.includes('migrateToLeagueScopedPaths: false'), 'adapter dichiara nessuna migrazione league-scoped');
check(!adapter.includes('/leagues/'), 'adapter non introduce path /leagues/');
check(!adapter.includes('zonaorientale-d07af'), 'adapter senza projectId Zona hardcoded');
check(!adapter.includes('fantapetillomantramanager.firebaseapp.com'), 'adapter senza projectId/domain FMM hardcoded');
for (const [league, projectId, authDomain, name] of [['zonaorientale','zonaorientale-d07af','zonaorientale-d07af.firebaseapp.com','ZonaOrientale'], ['fantapetillomantramanager','fantapetillomantramanager','fantapetillomantramanager.firebaseapp.com','FantaMantraManager']]) {
  const cfg = readJson(`${league}/assets/league-config.json`);
  check(cfg.currentVersion === 499, `${league} currentVersion V499`);
  check(cfg.features?.firebaseAdapter === true, `${league} feature firebaseAdapter attiva`);
  check(cfg.features?.firebaseAdapterVersion === 'V499', `${league} feature firebaseAdapterVersion V499`);
  check(cfg.firebaseAdapter?.version === 'V499', `${league} blocco firebaseAdapter V499`);
  check(cfg.firebaseAdapter?.dataModelMode === 'flat-collections-preserved', `${league} data model flat preservato`);
  check(cfg.firebaseAdapter?.migrateToLeagueScopedPaths === false, `${league} nessuna migrazione path`);
  check(cfg.firebaseAdapter?.rulesMigration === false, `${league} nessuna migrazione rules`);
  const file = `${league}/assets/firebase.js`;
  check(exists(file), `${league} firebase.js presente`);
  const text = read(file);
  check(text.includes('firebase-adapter-v499.js'), `${league} importa adapter comune`);
  check(text.includes('createFirebaseLeagueRuntimeV499'), `${league} usa runtime Firebase comune`);
  check(text.includes(projectId), `${league} conserva projectId specifico`);
  check(text.includes(authDomain), `${league} conserva authDomain specifico`);
  for (const exported of ['export const db','export const auth','collection','doc','getDoc','getDocs','setDoc','addDoc','updateDoc','deleteDoc','query','where','serverTimestamp','createUserWithEmailAndPassword','sendEmailVerification','updateProfile','GoogleAuthProvider','signInWithPopup','signInWithEmailAndPassword','signOut','onAuthStateChanged']) check(text.includes(exported), `${league} conserva export ${exported}`);
  check(text.includes('flat-collections-preserved'), `${league} wrapper dichiara flat collections`);
  check(!text.includes('/leagues/'), `${league} wrapper non introduce /leagues/`);
}
check(!read('zonaorientale/assets/firebase.js').includes('fantapetillomantramanager.firebaseapp.com'), 'Zona non usa Firebase FMM');
check(!read('fantapetillomantramanager/assets/firebase.js').includes('zonaorientale-d07af'), 'FMM non usa Firebase Zona');
const fmmApp = read('fantapetillomantramanager/assets/app.js');
check(fmmApp.includes('renderRuleProposalsPresidentSectionV479'), 'FMM Proposte regolamento preservate');
check(fmmApp.includes('ruleProposals'), 'FMM collection ruleProposals preservata');
check(fmmApp.includes('teamUsers'), 'FMM teamUsers preservato');
if(fail>0){ console.error(`\nAudit Firebase adapter V499 fallito: ${ok} OK, ${fail} FAIL`); failures.forEach(f=>console.error(` - ${f}`)); process.exit(1); }
console.log(`\nAudit Firebase adapter V499 completato: ${ok} OK, ${fail} FAIL`);
