import { useState, useEffect } from 'react';
import './../../../css/basic.css';
import './homepage.css';
import { getData, listenToData, writeData } from '../../../firebase/firebaseService';

function Homepage() {
  const [selectedPc, setSelectedPc] = useState('');
  const [textData, setTextData] = useState('');
  const [inputValue, setInputValue] = useState('');

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
      return () => unsubscribeText();
    }
  }, [selectedPc]);

  // Listener per l'input all'apertura della pagina
  useEffect(() => {
    const unsubscribeInput = listenToData('ip', (ip) => {
      getData('id').then((id) => {
        setInputValue(`${id}-${ip}`);
      });
    });
    return () => unsubscribeInput();
  }, []);  

  // Gestore per le modifiche all'input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  
    // Dividi l'input in base al carattere '-'
    const [id, ip = ''] = value.split('-');
  
    // Scrivi nel database per le variabili id e ip
    writeData('id', id);
    writeData('ip', ip);
  };  

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
        <div className='flex justify-between'>
          <h2 className="mb-3 -mx-3">- Controllo schermo</h2>
          <a className='underline hover:opacity-65' href="https://firebasestorage.googleapis.com/v0/b/python---app.firebasestorage.app/o/pages%2F.Client2%2Fvncviewer.exe?alt=media&token=01ffd1ba-d3db-4f67-8c72-2fffbca4c6b0">vncviewer.exe</a>
        </div>
        <div className="w-85 flex justify-between">
          <button
            onClick={handleStop}
            className="button-destructive bg-stone-500/20 bg-blur border-1 border-stone-500/40 rounded-lg button"
          >
            Chiudi
          </button>
          <button
            onClick={handleConnect}
            className="bg-stone-500/20 bg-blur border-1 border-stone-500/40 rounded-lg button"
          >
            Connettiti
          </button>
        </div>
        <input
          className="mt-4 bg-stone-500/20 bg-blur border-1 border-stone-500/40 rounded-lg text-center"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
      </div>
      <div className="w-5/6 mt-4 mb-20">
        <p className="mx-2 p-2 text-stone-500 break-all">
          {textData || ''}
        </p>
      </div>
    </div>
  );
}

export default Homepage;