// V499 - FantaEngine Firebase adapter comune.
// Centralizza inizializzazione Firebase e helper multi-lega senza migrare dati o path Firestore.
// I firebaseConfig, projectId e policy operative restano nei wrapper assets/firebase.js delle singole leghe.

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

export const FIREBASE_ADAPTER_VERSION_V499 = 'V499';
export const FIREBASE_DATA_MODEL_MODE_V499 = 'flat-collections-preserved';

function cleanStringV499(value) {
  return String(value ?? '').trim();
}

function freezePlainV499(value) {
  if (!value || typeof value !== 'object') return value;
  return Object.freeze({ ...value });
}

export function normalizeFirebaseLeagueConfigV499(config = {}) {
  const firebaseConfig = config.firebaseConfig || config.config || {};
  const leagueId = cleanStringV499(config.leagueId || config.id || firebaseConfig.projectId || 'unknown-league');
  const seasonId = cleanStringV499(config.seasonId || config.season || 'current');
  const displayName = cleanStringV499(config.displayName || config.name || leagueId);
  return Object.freeze({
    version: FIREBASE_ADAPTER_VERSION_V499,
    leagueId,
    seasonId,
    displayName,
    firebaseConfig: freezePlainV499(firebaseConfig),
    dataModelMode: FIREBASE_DATA_MODEL_MODE_V499,
    migrateToLeagueScopedPaths: false,
    useFlatCollections: true,
    collectionPrefix: cleanStringV499(config.collectionPrefix || ''),
    collectionAliases: freezePlainV499(config.collectionAliases || {}),
    roleCollections: freezePlainV499(config.roleCollections || {}),
    notes: cleanStringV499(config.notes || 'Adapter comune senza migrazione dati.')
  });
}

export function resolveFirebaseCollectionNameV499(runtimeOrConfig, collectionName) {
  const normalized = runtimeOrConfig?.version === FIREBASE_ADAPTER_VERSION_V499
    ? runtimeOrConfig
    : normalizeFirebaseLeagueConfigV499(runtimeOrConfig || {});
  const raw = cleanStringV499(collectionName);
  const aliases = normalized.collectionAliases || {};
  const resolved = cleanStringV499(aliases[raw] || raw);
  if (!resolved) throw new Error('Nome collection Firebase mancante.');
  // V499 preserva i nomi flat: niente path league-scoped qui.
  return normalized.collectionPrefix ? `${normalized.collectionPrefix}${resolved}` : resolved;
}

export function createFirebaseLeagueRuntimeV499(config = {}) {
  const normalized = normalizeFirebaseLeagueConfigV499(config);
  const app = initializeApp(normalized.firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  function collectionRef(collectionName) {
    return collection(db, resolveFirebaseCollectionNameV499(normalized, collectionName));
  }
  function docRef(collectionName, documentId) {
    return doc(db, resolveFirebaseCollectionNameV499(normalized, collectionName), cleanStringV499(documentId));
  }
  function leagueWhere(fieldName = 'leagueId') {
    return where(fieldName, '==', normalized.leagueId);
  }
  function seasonWhere(fieldName = 'seasonId') {
    return where(fieldName, '==', normalized.seasonId);
  }
  function withLeagueMetadata(data = {}) {
    return {
      ...data,
      leagueId: data.leagueId || normalized.leagueId,
      seasonId: data.seasonId || normalized.seasonId
    };
  }
  function runtimeInfo() {
    return Object.freeze({
      version: FIREBASE_ADAPTER_VERSION_V499,
      leagueId: normalized.leagueId,
      seasonId: normalized.seasonId,
      displayName: normalized.displayName,
      projectId: normalized.firebaseConfig.projectId || '',
      authDomain: normalized.firebaseConfig.authDomain || '',
      dataModelMode: normalized.dataModelMode,
      migrateToLeagueScopedPaths: false,
      useFlatCollections: true
    });
  }
  return Object.freeze({
    version: FIREBASE_ADAPTER_VERSION_V499,
    config: normalized,
    app,
    db,
    auth,
    collectionRef,
    docRef,
    leagueWhere,
    seasonWhere,
    withLeagueMetadata,
    runtimeInfo
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

if (typeof window !== 'undefined') {
  window.FantaEngineFirebaseAdapterV499 = Object.freeze({
    version: FIREBASE_ADAPTER_VERSION_V499,
    dataModelMode: FIREBASE_DATA_MODEL_MODE_V499,
    normalizeFirebaseLeagueConfigV499,
    resolveFirebaseCollectionNameV499,
    createFirebaseLeagueRuntimeV499
  });
}
