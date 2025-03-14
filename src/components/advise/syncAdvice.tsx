import React, { useState, useEffect, useRef } from 'react';
import { listenToData } from '../../firebase/firebaseService';
import { ref, set } from 'firebase/database';
import { database } from '../../firebase/firebaseConfig';

const SyncAdvice: React.FC = () => {
  const [adviceMessage, setAdviceMessage] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  // Ref per memorizzare l'ID del timer attivo
  const timerRef = useRef<number | null>(null);
  // Ref per tracciare l'attuale selectedPc in modo da rilevare i cambiamenti
  const currentPcRef = useRef<number | null>(null);

  /**
   * Svuota la variabile advice nel database impostandola a stringa vuota.
   * @param adviceKey - La chiave della variabile advice (es. "advice1")
   */
  const clearAdviceInDatabase = (adviceKey: string): void => {
    set(ref(database, adviceKey), '');
  };

  useEffect(() => {
    // Ascolta le modifiche nell'intera radice del database
    const unsubscribe = listenToData('/', (data: Record<string, unknown>) => {
      // Leggi il valore di "selectedPc"
      const newPc = data['selectedPc'] as number | undefined;
      if (newPc === undefined) {
        console.error('Nessun computer selezionato trovato nel database.');
        return;
      }

      // Se il selectedPc è cambiato, cancella l'avviso corrente e il timer attivo
      if (currentPcRef.current !== newPc) {
        currentPcRef.current = newPc;
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setAdviceMessage('');
        setIsActive(false);
      }

      // Costruisci la chiave dell'advice in base al selectedPc aggiornato
      const adviceKey = `advice${newPc}`;
      const adviceValue = data[adviceKey] as string | undefined;

      if (adviceValue && adviceValue.trim() !== '') {
        // Aggiorna lo stato per mostrare il nuovo messaggio
        setAdviceMessage(adviceValue);
        setIsActive(true);
        // Cancella un eventuale timer precedente
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        // Imposta un timer per 5 secondi per nascondere il messaggio
        timerRef.current = window.setTimeout(() => {
          setAdviceMessage('');
          setIsActive(false);
          clearAdviceInDatabase(adviceKey);
          timerRef.current = null;
        }, 2000);
      }
    });

    // Cleanup: cancella il timer e rimuove il listener quando il componente viene smontato
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <div
      className={`fixed z-50 top-5 p-4 max-w-[400px] flex bg-stone-500/60 bg-blur border-1 border-stone-500/60 p-1 mt-3 rounded-md text-center drop-shadow duration-400 ease-in-out ${
        isActive ? '' : 'exit'
      }`}
    >
      <p>{adviceMessage}</p>
    </div>
  );
};

export default SyncAdvice;
