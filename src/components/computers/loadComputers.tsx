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
      if (isFirstRender.current && Object.keys(pcs).length > 0) {
        setSelectedComputer(1);
        isFirstRender.current = false;
      }
    };

    const unsubscribePCs = listenToData(updateConnectedPCs);

    const ensureSlotsExist = async () => {
      for (let i = 1; i <= 10; i++) {
        const pcNameKey = `pcname${i}`;
        const dateKey = `date${i}`;
        try {
          const pcData = await getData(pcNameKey);
          if (pcData === null) {
            await writeData(pcNameKey, `Computer${i}`);
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
          dates[dateKey] = data[dateKey]!;
        }
      }
      setPcDates(dates);
    };

    const unsubscribeDates = listenToData(updatePcDates);

    return () => {
      unsubscribeDates();
    };
  }, [connectedPCs]);

  const handleClick = (pcNameKey: string) => {
    if (connectedPCs[pcNameKey]) {
      setSelectedComputer(parseInt(pcNameKey.replace('pcname', '')));
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ''; // Restituisce una stringa vuota se la data non è valida
    }
    const giorno = date.getDate().toString().padStart(2, '0');
    const ore = date.getHours().toString().padStart(2, '0');
    const minuti = date.getMinutes().toString().padStart(2, '0');
    const secondi = date.getSeconds().toString().padStart(2, '0');
    return `${giorno}, ${ore}:${minuti}:${secondi}`;
  };

  return (
    <div className='flex'>
      {Array.from({ length: 10 }, (_, index) => {
        const pcNameKey = `pcname${index + 1}`;
        const pcName = connectedPCs[pcNameKey] || pcNameKey;
        const isFull = Boolean(connectedPCs[pcNameKey]);
        const isSelected = selectedComputer === index + 1;
        const dateKey = `date${index + 1}`;
        const pcDate = pcDates[dateKey] || '';
        const formattedDate = pcDate ? formatDate(pcDate) : '';
        return (
          <div
            key={pcNameKey}
            onClick={() => handleClick(pcNameKey)}
            className={`${isFull ? 'flex' : 'hidden'} ${isSelected ? 'selected' : 'notselected'} transition cursor-pointer p-2 px-4 my-4 mx-2`}
          >
            <div>{pcName}</div>
            <div className='text-gray-400! text-[10px] flex items-end ml-1'>{formattedDate || ''}</div>
          </div>
        );
      })}
    </div>
  );
};

export default LoadComputers;
