/* eslint-disable @typescript-eslint/no-explicit-any */
// firebaseService.tsx
import { database } from "./firebaseConfig";
import { ref, get, set, push, onValue } from "firebase/database";

/**
 * Funzione per leggere un dato da un percorso specifico nel database.
 * @param path - Il percorso da cui leggere il dato.
 * @returns Il valore letto, oppure null se il dato non esiste.
 */
export const getData = async (path: string): Promise<any> => {
  const dbRef = ref(database, path);
  const snapshot = await get(dbRef);
  return snapshot.exists() ? snapshot.val() : null;
};

/**
 * Funzione per scrivere (o aggiornare) un valore in un percorso specifico.
 * @param path - Il percorso nel database dove scrivere il dato.
 * @param value - Il valore da salvare.
 * @returns Una Promise che si risolve quando l'operazione è completata.
 */
export const writeData = (path: string, value: any): Promise<void> => {
  return set(ref(database, path), value);
};

/**
 * Funzione per aggiungere un nuovo elemento in una lista nel database.
 * Utilizza `push` per generare una chiave univoca.
 * @param path - Il percorso della lista nel database.
 * @param value - Il valore da aggiungere alla lista.
 * @returns Una Promise che si risolve quando l'operazione è completata.
 */
export const addData = (path: string, value: any): Promise<void> => {
  const newRef = push(ref(database, path));
  return set(newRef, value);
};

/**
 * Funzione per ascoltare i cambiamenti in un percorso specifico del database.
 * @param path - Il percorso nel database da cui ascoltare i dati.
 * @param callback - Funzione da eseguire ogni volta che il dato cambia.
 * @returns Una funzione di unsubscribe per fermare l'ascolto.
 */
export const listenToData = (
  path: string,
  callback: (data: any) => void
): (() => void) => {
  const dbRef = ref(database, path);
  const unsubscribe = onValue(dbRef, (snapshot) => {
    callback(snapshot.val());
  });
  return unsubscribe;
};