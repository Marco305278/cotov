import React, { useEffect, useState, useRef } from 'react';
import { getData, writeData, listenToData } from './../../firebase/firebaseService';

interface PcSlotsData {
  [key: string]: string | null;
}

const LoadComputers: React.FC = () => {
  const [connectedPCs, setConnectedPCs] = useState<{ [key: string]: string }>({});
  const [pcDates, setPcDates] = useState<{ [key: string]: string }>({});
  const [selectedComputer, setSelectedComputer] = useState<number | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const updateConnectedPCs = (data: PcSlotsData) => {
      const pcs: { [key: string]: string } = {};
      for (let i = 1; i <= 10; i++) {
        const pcNameKey = `pcname${i}`;
        if (data?.[pcNameKey]?.trim()) {
          pcs[pcNameKey] = data[pcNameKey] as string;
        }
      }
      setConnectedPCs(pcs);
      if (isFirstRender.current) {
        (async () => {
          const data = await getData("selectedPc");
          const selectedPc = data || 1;
          setSelectedComputer(selectedPc);
        })();
        isFirstRender.current = false;
      }      
    };

    const unsubscribePCs = listenToData('/', updateConnectedPCs);

    const ensureSlotsExist = async () => {
      for (let i = 1; i <= 10; i++) {
        const pcNameKey = `pcname${i}`;
        const dateKey = `date${i}`;
        try {
          const pcData = await getData(pcNameKey);
          if (pcData === null) {
            await writeData(pcNameKey, '');
          }
          const dateData = await getData(dateKey);
          if (dateData === null) {
            await writeData(dateKey, '');
          }
        } catch (error) {
          console.error(`Errore durante l'accesso o la scrittura dei dati per ${pcNameKey} o ${dateKey}:`, error);
        }
      }
    };

    ensureSlotsExist();

    return () => {
      unsubscribePCs();
    };
  }, []);

  useEffect(() => {
    const updatePcDates = (data: { [key: string]: string }) => {
      const dates: { [key: string]: string } = {};
      for (let i = 1; i <= 10; i++) {
        const dateKey = `date${i}`;
        if (data?.[dateKey] !== undefined) {
          dates[dateKey] = data[dateKey];
        }
      }
      setPcDates(dates);
    };

    const unsubscribeDates = listenToData('/', updatePcDates);

    return () => {
      unsubscribeDates();
    };
  }, [connectedPCs]);

  // Effettua la selezione del computer al click sui box
  const handleClick = (pcNameKey: string) => {
    if (connectedPCs[pcNameKey]) {
      const pcSelectedId = parseInt(pcNameKey.replace('pcname', ''));
      setSelectedComputer(pcSelectedId);
      writeData('selectedPc', pcSelectedId);
    }
  };

  // Al click sull'icona si rimuove il computer selezionato
  const handleIconClick = () => {
    if (selectedComputer !== null) {
      removePC(selectedComputer);
    }
  };

  // Funzione per rimuovere il computer
  const removePC = (pc: number) => {
    writeData(`pcname${pc}`, "");
    writeData(`date${pc}`, "");
    writeData(`comands${pc}`, "");
    writeData(`output${pc}`, "");
    writeData(`texts${pc}`, "");
    writeData(`enabled_close${pc}`, "false");
    writeData(`enabled_script${pc}`, "false");
  };

  // UseEffect che controlla se il computer selezionato è stato rimosso.
  // In tal caso, seleziona il primo computer ancora presente.
  useEffect(() => {
    if (Object.keys(connectedPCs).length > 0) {
      // Se non c'è nessun computer selezionato o quello selezionato non è più presente
      if (selectedComputer === null || !connectedPCs[`pcname${selectedComputer}`]) {
        // Ordina i computer disponibili in base al numero e seleziona il primo
        const keysSorted = Object.keys(connectedPCs).sort((a, b) => {
          return parseInt(a.replace('pcname', '')) - parseInt(b.replace('pcname', ''));
        });
        if (keysSorted.length > 0) {
          const firstPcNumber = parseInt(keysSorted[0].replace('pcname', ''));
          setSelectedComputer(firstPcNumber);
          writeData('selectedPc', firstPcNumber);
        }
      }
    }
  }, [connectedPCs, selectedComputer]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }
    const giorno = date.getDate().toString().padStart(2, '0');
    const ore = date.getHours().toString().padStart(2, '0');
    const minuti = date.getMinutes().toString().padStart(2, '0');
    const secondi = date.getSeconds().toString().padStart(2, '0');
    return `${giorno}, ${ore}:${minuti}:${secondi}`;
  };

  return (
    <div className='flex w-screen justify-center'>
      <div className='flex fixed z-50 top-0 bg-stone-800/70 bg-blur border-1 border-stone-500/40 p-1 mt-3 rounded-xl'>
        {Array.from({ length: 10 }, (_, index) => {
          const pcNameKey = `pcname${index + 1}`;
          const pcName = connectedPCs[pcNameKey] || pcNameKey;
          const isFull = Boolean(connectedPCs[pcNameKey]);
          const isSelected = selectedComputer === index + 1;
          const dateKey = `date${index + 1}`;
          const pcDate = pcDates[dateKey] || '';
          const formattedDate = pcDate ? formatDate(pcDate) : '';

          // Calcola la differenza in secondi tra la data attuale e la data del PC
          const now = new Date();
          const pcDateObj = new Date(pcDate);
          const timeDifference = (now.getTime() - pcDateObj.getTime()) / 1000;
          const isConnected = timeDifference < 4;

          return (
            <div
              key={pcNameKey}
              onClick={() => handleClick(pcNameKey)}
              className={`${isFull ? 'flex' : 'hidden'} ${isSelected ? 'selected' : 'notselected'} ${isConnected ? 'connected' : ''} transition cursor-pointer p-1 px-3 m-1 rounded-md hover:opacity-65`}
            >
              <div>{pcName}</div>
              <div className='text-gray-400! text-[10px] flex items-end ml-1'>{formattedDate}</div>
            </div>
          );
        })}
      </div>
      <div className='fixed right-4 top-7' onClick={handleIconClick}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className='fill-stone-500/50 hover:fill-red-500 cursor-pointer' viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
        </svg>
      </div>
    </div>
  );
};

export default LoadComputers;
