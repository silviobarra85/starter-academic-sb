import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// V450 - Firebase reale dedicato per FantaPetilloMantraManager.
// Non usare il progetto Firebase di ZonaOrientale in questo clone.
const firebaseConfig = {
  apiKey: "AIzaSyA8TbyIH-TD2gyxL4b5MP9NWkC46RN9k00",
  authDomain: "fantapetillomantramanager.firebaseapp.com",
  projectId: "fantapetillomantramanager",
  storageBucket: "fantapetillomantramanager.firebasestorage.app",
  messagingSenderId: "578603278263",
  appId: "1:578603278263:web:df2ba2739bc2b843ccd232",
  measurementId: "G-RT78QT84J4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

if (typeof window !== 'undefined') {
  window.FantaPetilloFirebaseConfigV449 = Object.freeze({
    version: 'V450',
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    dedicatedFirebaseProject: true,
    zonaOrientaleFirebasePresent: false,
    productionReady: false,
    requiresFirestoreRulesBeforeLiveUse: false,
    adminBootstrapEnabled: true,
    teamAreaStillGuarded: true,
    firestoreRulesVersion: 'V450'
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
