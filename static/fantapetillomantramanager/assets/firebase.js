import {
  createFirebaseLeagueRuntimeV499,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "../../fanta-engine/js/firebase/firebase-adapter-v499.js";

const firebaseConfig = {
  "apiKey": "AIzaSyA8TbyIH-TD2gyxL4b5MP9NWkC46RN9k00",
  "authDomain": "fantapetillomantramanager.firebaseapp.com",
  "projectId": "fantapetillomantramanager",
  "storageBucket": "fantapetillomantramanager.firebasestorage.app",
  "messagingSenderId": "578603278263",
  "appId": "1:578603278263:web:df2ba2739bc2b843ccd232",
  "measurementId": "G-RT78QT84J4"
};

export const firebaseLeagueRuntimeV499 = createFirebaseLeagueRuntimeV499({
  leagueId: 'fantapetillomantramanager',
  seasonId: '2026-2027',
  displayName: 'FantaMantraManager',
  firebaseConfig,
  dataModelMode: 'flat-collections-preserved',
  migrateToLeagueScopedPaths: false,
  useFlatCollections: true,
  notes: 'V499 centralizza init/helper Firebase senza cambiare path Firestore o rules.'
});

export const db = firebaseLeagueRuntimeV499.db;
export const auth = firebaseLeagueRuntimeV499.auth;
export const firebaseRuntimeInfoV499 = firebaseLeagueRuntimeV499.runtimeInfo();

if (typeof window !== 'undefined') {
  window.FantaLeagueFirebaseRuntimeV499 = firebaseRuntimeInfoV499;

  window.FantaPetilloFirebaseConfigV449 = Object.freeze({
    version: 'V499',
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    dedicatedFirebaseProject: true,
    zonaOrientaleFirebasePresent: false,
    productionReady: false,
    requiresFirestoreRulesBeforeLiveUse: false,
    adminBootstrapEnabled: true,
    teamAreaStillGuarded: false,
    firestoreRulesVersion: 'V479',
    firebaseAdapterVersion: 'V499',
    dataModelMode: 'flat-collections-preserved'
  });
}

export {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
