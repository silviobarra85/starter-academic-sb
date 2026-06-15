// V447 - Firebase disabled sandbox adapter for FantaPetilloMantraManager.
// This clone must not read from or write to the ZonaOrientale Firebase project.

export const db = null;
export const auth = { currentUser: null };

function makeSnapshot(docs = []) {
  return {
    docs,
    empty: docs.length === 0,
    forEach(callback) { docs.forEach(callback); }
  };
}

function makeDocumentSnapshot(id = '') {
  return {
    id,
    exists() { return false; },
    data() { return null; }
  };
}

function sandboxError(action) {
  return new Error(`${action} non disponibile: Firebase e' disabilitato nel clone sandbox FantaPetilloMantraManager.`);
}

export function collection(_db, name) { return { sandbox: true, name: String(name || '') }; }
export function doc(_db, name, id) { return { sandbox: true, name: String(name || ''), id: String(id || '') }; }
export async function getDoc(ref) { return makeDocumentSnapshot(ref?.id || ''); }
export async function getDocs() { return makeSnapshot([]); }
export async function setDoc() { throw sandboxError('setDoc'); }
export async function addDoc() { throw sandboxError('addDoc'); }
export async function updateDoc() { throw sandboxError('updateDoc'); }
export async function deleteDoc() { throw sandboxError('deleteDoc'); }
export function query(source) { return source || { sandbox: true }; }
export function where(field, operator, value) { return { sandbox: true, field, operator, value }; }
export function serverTimestamp() { return new Date().toISOString(); }
export async function createUserWithEmailAndPassword() { throw sandboxError('createUserWithEmailAndPassword'); }
export async function sendEmailVerification() { throw sandboxError('sendEmailVerification'); }
export async function updateProfile() { throw sandboxError('updateProfile'); }
export class GoogleAuthProvider {}
export async function signInWithPopup() { throw sandboxError('signInWithPopup'); }
export async function signInWithEmailAndPassword() { throw sandboxError('signInWithEmailAndPassword'); }
export async function signOut() { return null; }
export function onAuthStateChanged(_auth, callback) {
  window.setTimeout(() => callback(null), 0);
  return () => {};
}

if (typeof window !== 'undefined') {
  window.FantaPetilloFirebaseSandboxV447 = Object.freeze({
    version: 'V447',
    firebaseDisabled: true,
    protectsZonaOrientaleFirebase: true
  });
}
