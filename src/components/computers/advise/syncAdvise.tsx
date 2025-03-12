import React, { useState, useEffect } from 'react';
import { listenToData } from './../../../firebase/firebaseService';

type Text = {
    text: string;
  };  

function syncAdvice() {
    //EDIT: ListenToData
    listenToData(advice);

    return createAdvice
}

const createAdvice: React.FC<Text> = ({ text }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Aggiunge la classe quando il componente è montato
    setActive(true);

    // Rimuove la classe dopo 5 secondi
    const timer = setTimeout(() => {
      setActive(false);
    }, 5000);

    // Pulisce il timer se il componente viene smontato prima dei 5 secondi
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`absolute top-5 p-4 max-w-[400px] flex bg-stone-500/60 bg-blur border-1 border-stone-500/60 p-1 mt-3 rounded-md text-center drop-shadow duration-400 ease-in-out ${active ? '' : 'exit'}`}>
      <p>{text}</p>
    </div>
  );
};

export default syncAdvice;
