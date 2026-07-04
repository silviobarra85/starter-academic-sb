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
  "apiKey": "AIzaSyB7YQM3bNHwAqhJAUP3hOeYudwyTzioLFM",
  "authDomain": "zonaorientale-d07af.firebaseapp.com",
  "projectId": "zonaorientale-d07af",
  "storageBucket": "zonaorientale-d07af.firebasestorage.app",
  "messagingSenderId": "201153044685",
  "appId": "1:201153044685:web:b9ed4739aa94eb9029c984",
  "measurementId": "G-LCP0FE4R1B"
};

export const firebaseLeagueRuntimeV499 = createFirebaseLeagueRuntimeV499({
  leagueId: 'zonaorientale',
  seasonId: '2026-2027',
  displayName: 'ZonaOrientale Salerno',
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
