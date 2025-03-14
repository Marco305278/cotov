// App.tsx
import React, { JSX, useEffect, useState } from 'react';
import { getData } from './firebase/firebaseService';

import Main from './components/pages/main/main';
import Password from './components/pages/password/password';

const App: React.FC = () => {
  const [startPage, setStartPage] = useState<JSX.Element | null>(null);

  const getStartPages = async () => {
    try {
      // Recupera la variabile "consolepassword" dal database Firebase
      const consolepassword = await getData('consolepassword');
      if (!consolepassword) {
        // Se non c'è una password impostata, mostra direttamente la Homepage
        setStartPage(<Main />);
      } else {
        // Altrimenti, mostra la pagina di inserimento password
        setStartPage(
          <Password onPasswordValid={() => setStartPage(<Main />)} />
        );
      }
    } catch (error) {
      console.error("Errore nel recupero dei dati da Firebase: ", error);
      setStartPage(<div>Si è verificato un errore</div>);
    }
  };

  useEffect(() => {
    getStartPages();
  }, []);

  return <div>{startPage ? startPage : <div>Caricamento...</div>}</div>;
};

export default App;
