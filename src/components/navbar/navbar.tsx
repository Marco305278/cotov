import React, { useState, useEffect } from 'react';
import Homepage from './../pages/homepage/homepage';
import Terminal from './../pages/terminal/terminal';
import MicWeb from './../pages/micweb/micweb';

const NavBar: React.FC = () => {
  // Stato per tenere traccia della pagina selezionata; di default 'desktop'
  const [selectedPage, setSelectedPage] = useState('desktop');

  // Carica la pagina salvata da localStorage al mount del componente
  useEffect(() => {
    const savedPage = localStorage.getItem('selectedPage');
    if (savedPage) {
      setSelectedPage(savedPage);
    }
  }, []);

  // Salva la pagina selezionata in localStorage ogni volta che cambia
  useEffect(() => {
    localStorage.setItem('selectedPage', selectedPage);
  }, [selectedPage]);

  // Gestione degli eventi da tastiera per cambiare pagina con i tasti 1, 2 e 3
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case '1':
          setSelectedPage('desktop');
          break;
        case '2':
          setSelectedPage('terminale');
          break;
        case '3':
          setSelectedPage('mic-web');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Funzione per renderizzare la pagina in base allo stato
  const renderPage = () => {
    switch (selectedPage) {
      case 'desktop':
        return <Homepage />;
      case 'terminale':
        return <Terminal />;
      case 'mic-web':
        return <MicWeb />;
      default:
        return <Homepage />;
    }
  };

  return (
    <div className='flex items-center justify-center w-screen h-full'>
      <div className='flex items-center justify-center w-screen h-full'>
        {renderPage()}
      </div>
      <div className='flex px-[2px] mb-4 fixed bottom-0'>
        <p 
          onClick={() => setSelectedPage('desktop')}
          className={`py-1 px-3 mx-1 bg-blur rounded-md hover:opacity-65 cursor-pointer ${selectedPage === 'desktop' ? 'selected' : 'notselected'}`}>
          Desktop
        </p>
        <p 
          onClick={() => setSelectedPage('terminale')}
          className={`py-1 px-3 mx-1 bg-blur rounded-md hover:opacity-65 cursor-pointer ${selectedPage === 'terminale' ? 'selected' : 'notselected'}`}>
          Terminale
        </p>
        <p 
          onClick={() => setSelectedPage('mic-web')}
          className={`py-1 px-3 mx-1 bg-blur rounded-md hover:opacity-65 cursor-pointer ${selectedPage === 'mic-web' ? 'selected' : 'notselected'}`}>
          Mic/Webcam
        </p>
      </div>
    </div>
  );
};

export default NavBar;