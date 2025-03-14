import React, { useState, useEffect } from 'react';
import './../../../css/basic.css';
import './homepage.css';
import { listenToData, writeData } from '../../../firebase/firebaseService';

function Homepage() {
  const [selectedPc, setSelectedPc] = useState('');
  const [textData, setTextData] = useState(''); // Stato per memorizzare il dato di texts

  // Listener per la variabile selectedPc
  useEffect(() => {
    const unsubscribeSelectedPc = listenToData('selectedPc', (data) => {
      setSelectedPc(data);
    });
    return () => unsubscribeSelectedPc();
  }, []);

  // Listener per la variabile texts${selectedPc}
  useEffect(() => {
    if (selectedPc) {
      const unsubscribeText = listenToData(`texts${selectedPc}`, (data) => {
        setTextData(data);
      });
      // Quando selectedPc cambia, viene effettuata la pulizia del precedente listener
      return () => unsubscribeText();
    }
  }, [selectedPc]);

  const handleConnect = () => {
    if (selectedPc) {
      writeData(`enabled_script${selectedPc}`, 'true');
    }
  };

  const handleStop = () => {
    if (selectedPc) {
      writeData(`enabled_close${selectedPc}`, 'true');
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-85 mt-100 flex flex-col">
        <h2 className="mb-3 -mx-3">- Controllo schermo</h2>
        <div className="w-85 flex justify-between">
          <button
            onClick={handleStop}
            className="button-destructive bg-stone-500/20 bg-blur border-1 border-stone-500/40 rounded-lg"
          >
            Chiudi
          </button>
          <button
            onClick={handleConnect}
            className="bg-stone-500/20 bg-blur border-1 border-stone-500/40 rounded-lg"
          >
            Connettiti
          </button>
        </div>
      </div>
      <div className="w-5/6 mt-4 mb-20 bg-blur">
          <p className="mx-2 p-2 text-stone-500 break-all">
            {textData ? textData : ''}
          </p>
      </div>
    </div>
  );
}

export default Homepage;