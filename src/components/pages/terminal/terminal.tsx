/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, JSX } from 'react';
import { writeData, listenToData } from './../../../firebase/firebaseService';

const Terminal: React.FC = () => {
  // Stato per il comando da inviare e per le righe visualizzate nella "terminal area"
  const [command, setCommand] = useState('');
  const [terminalLines, setTerminalLines] = useState<JSX.Element[]>([]);
  const [selectedPc, setSelectedPc] = useState('');

  // Listener per selectedPc
  useEffect(() => {
    const unsubscribe = listenToData('selectedPc', (data) => {
      setSelectedPc(data);
    });
    return () => unsubscribe();
  }, []);

  // Listener per output dinamico in base al selectedPc
  useEffect(() => {
    const unsubscribe = listenToData(`output${selectedPc}`, (output: any) => {
      if (output && output !== "") {
        let cleanOutput = output;
        // Se il valore inizia con "<p", rimuovo le parti specificate
        if (typeof output === 'string' && output.startsWith('<p')) {
          cleanOutput = output
            .replace('<p class="output" id="texts">', '')
            .replace('</p>', '');
        }
        // Dopo aver elaborato l'output, lo resetto nel database
        writeData(`output${selectedPc}`, "")
          .then(() => {
            console.log("Output resettato nel database");
          })
          .catch(err => {
            console.error("Errore nel resettare l'output:", err);
          });
        
        // Aggiungo la nuova riga di output alla lista
        setTerminalLines(prev => [
          ...prev,
          <p
            key={`output-${prev.length}`}
            className="mt-2 mb-6 text-stone-500"
            dangerouslySetInnerHTML={{ __html: cleanOutput }}
          />
        ]);        
      }
    });
    // Pulizia del listener quando il componente viene smontato
    return () => unsubscribe();
  }, [selectedPc]);

  // Funzione per inviare il comando (al click del bottone o al premere "Enter")
  const sendCommand = () => {
    if (command.trim() === '') return;
    
    // Aggiungo la riga del comando nel terminal (con simbolo ">" seguito dal testo)
    setTerminalLines(prev => [
      ...prev,
      <div key={`command-${prev.length}`}>
        <p className="-ml-3 mt-3 mb-3">&#62; {command}</p>
      </div>
    ]);

    // Scrivo il comando nella variabile "comands" nel database
    writeData(`comands${selectedPc}`, command)
      .then(() => {
        console.log("Comando scritto nel database");
      })
      .catch(err => {
        console.error("Errore nella scrittura del comando:", err);
      });
    
    // Pulisco il textarea
    setCommand('');
  };

  // Gestione del tasto "Enter" nel textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCommand();
    }
  };

  return (
    <div className="flex flex-col justify-center align-center m-18 w-full max-w-260 h-full">
      {/* Area terminal dove vengono aggiunte le righe di comando ed output */}
      <div className="bg-blur rounded-md px-5">
        {terminalLines.map((line, index) => (
          <React.Fragment key={index}>{line}</React.Fragment>
        ))}
      </div>

      {/* Sezione input: textarea e bottone */}
      <div className="flex w-full bg-stone-500/20 bg-blur border-1 border-stone-500/40 p-1 mt-3 rounded-xl">
        <textarea
          name="comand"
          rows={1}
          className="w-full px-3 pt-1 text-sm outline-none"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
        ></textarea>
        <button
          className="bg-stone-500/20 bg-blur border-1 border-stone-500/40 rounded-lg min-w-1! ml-1"
          onClick={sendCommand}
        >
          <p>&#62;</p>
        </button>
      </div>
    </div>
  );
};

export default Terminal;