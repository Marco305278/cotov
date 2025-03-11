// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Configurazione di Firebase (sostituisci con le tue credenziali)
const firebaseConfig = {
  apiKey: "AIzaSyD6yH5SK3cZ53zUKy9o8JDUA8E6M2ciS8w",
  authDomain: "python---app.firebaseapp.com",
  databaseURL: "https://python---app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "python---app",
  storageBucket: "python---app.firebasestorage.app",
  messagingSenderId: "935345912292",
  appId: "1:935345912292:web:148df16e83db170c086ff1"
};

// Inizializzazione dell'app Firebase
const app = initializeApp(firebaseConfig);

// Inizializzazione del database
export const database = getDatabase(app);