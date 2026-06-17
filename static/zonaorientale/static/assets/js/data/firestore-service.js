import { db, collection, getDocs } from "../../firebase.js";

export async function loadCollection(name) {
  try {
    const snapshot = await getDocs(collection(db, name));
    return snapshot.docs.map((documentSnapshot) => ({
      id: documentSnapshot.id,
      ...documentSnapshot.data()
    }));
  } catch (error) {
    const code = error?.code ? `${error.code}: ` : "";
    error.message = `Errore lettura raccolta ${name}. ${code}${error.message || error}`;
    throw error;
  }
}
