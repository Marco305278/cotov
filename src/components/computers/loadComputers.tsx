import React, { useEffect, useState, useRef } from 'react';
import { getData, writeData, listenToData } from './../../firebase/firebaseService';

interface PcSlotsData {
  [key: string]: string | null;
}

const LoadComputers: React.FC = () => {
  const [connectedPCs, setConnectedPCs] = useState<{ [key: string]: string }>({});
  const [selectedComputer, setSelectedComputer] = useState<number | null>(null);
  const isFirstRender = useRef(true); // Riferimento per verificare il primo render

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
      // Imposta il primo PC connesso come selezionato, se presente, solo al primo render
      if (isFirstRender.current && Object.keys(pcs).length > 0) {
        setSelectedComputer(1); // Imposta il primo PC come selezionato
        isFirstRender.current = false; // Imposta a false dopo il primo render
      }
    };

    // Sottoscrizione ai dati in tempo reale
    const unsubscribe = listenToData(updateConnectedPCs);

    const ensureSlotsExist = async () => {
      for (let i = 1; i <= 10; i++) {
        const pcNameKey = `pcname${i}`;
        const data = await getData(pcNameKey);
        if (data === null) {
          await writeData(pcNameKey, `Computer${i}`); // Imposta un nome predefinito
        }
      }
    };

    ensureSlotsExist();

    return () => {
      unsubscribe();
    };
  }, []);

  const handleClick = (pcNameKey: string) => {
    if (connectedPCs[pcNameKey]) {
      setSelectedComputer(parseInt(pcNameKey.replace('pcname', '')));
    }
  };

  return (
    <div className='flex'>
      {Array.from({ length: 10 }, (_, index) => {
        const pcNameKey = `pcname${index + 1}`;
        const pcName = connectedPCs[pcNameKey] || pcNameKey;
        const isFull = Boolean(connectedPCs[pcNameKey]);
        const isSelected = selectedComputer === index + 1;
        return (
          <div
            onClick={() => handleClick(pcNameKey)}
            className={`${isFull ? 'flex' : 'hidden'} ${isSelected ? 'selected' : 'notselected'} transition cursor-pointer p-2 px-4 my-4 mx-2`}
          >
            {pcName}
          </div>
        );
      })}
    </div>
  );
};

export default LoadComputers;