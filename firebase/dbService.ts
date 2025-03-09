// dbService.ts
import { ref, get, onValue, update } from "firebase/database";
import { db } from "./firebase";

export const leggiDati = async (path: string): Promise<any> => {
  const dbRef = ref(db, path);
  const snapshot = await get(dbRef);
  return snapshot.exists() ? snapshot.val() : null;
};

export const ascoltaDati = (path: string, callback: (data: any) => void): () => void => {
  const dbRef = ref(db, path);
  const unsubscribe = onValue(dbRef, (snapshot) => {
    callback(snapshot.val());
  });
  return unsubscribe;
};

export const aggiornaDati = async (path: string, data: any): Promise<void> => {
  const dbRef = ref(db, path);
  await update(dbRef, data);
};