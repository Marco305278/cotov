// App.tsx
import React, { useEffect, useState } from 'react';
import { getData } from './firebase/firebaseService';

const PageEmpty: React.FC = () => (
  <div>
    <h1>Pagina per variabile vuota</h1>
    <p>La variabile è vuota</p>
  </div>
);

const PageNotEmpty: React.FC = () => (
  <div>
    <h1>Pagina per variabile non vuota</h1>
    <p>La variabile contiene un valore</p>
  </div>
);

const App: React.FC = () => {
  const [startPage, setStartPage] = useState<JSX.Element | null>(null);

  const getStartPages = async () => {
    try {
      // Supponiamo che la variabile si trovi nel percorso "startPage" nel database Firebase
      const value = await getData('startPage');
      if (!value) {
        // Se la variabile è vuota, restituisci PageEmpty
        setStartPage(<PageEmpty />);
      } else {
        // Altrimenti, restituisci PageNotEmpty
        setStartPage(<PageNotEmpty />);
      }
    } catch (error) {
      console.error("Errore nel recupero dei dati da Firebase: ", error);
      // Puoi gestire l'errore impostando una pagina di errore
      setStartPage(<div>Si è verificato un errore</div>);
    }
  };

  useEffect(() => {
    getStartPages();
  }, []);

  return (
    <div>
      {startPage ? startPage : <div>Caricamento...</div>}
    </div>
  );
};

export default App;