import React, { useState } from 'react';
import Homepage from './../pages/homepage/homepage';
import Terminal from './../pages/terminal/terminal';
import MicWeb from './../pages/micweb/micweb';

const NavBar: React.FC = () => {
  // Stato per tenere traccia della pagina selezionata; di default 'desktop'
  const [selectedPage, setSelectedPage] = useState('desktop');

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