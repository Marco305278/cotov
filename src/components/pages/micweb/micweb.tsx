import React, { useRef, useState } from 'react';

const MicWeb: React.FC = () => {
  const [micActive, setMicActive] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [iframeClassActive, setIframeClassActive] = useState(false); // State for iframe class toggle
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const sendCommand = (command: string) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ command }, "*");
    }
  };

  const toggleMic = () => {
    if (micActive) {
      sendCommand("disableMicrophone");
    } else {
      sendCommand("enableMicrophone");
    }
    setMicActive(prev => !prev);
  };

  const toggleWebcam = () => {
    if (webcamActive) {
      sendCommand("disableWebcam");
    } else {
      sendCommand("enableWebcam");
    }
    setWebcamActive(prev => !prev);
  };

  const toggleIframeClass = () => {
    setIframeClassActive(prev => !prev);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-10 pb-15">
      <div className="w-85 mt-35 mb-5 flex flex-col">
        <h2 className="mb-3 -mx-3">- Controllo Mic/Web</h2>
        <div className="w-85 flex justify-between">
          <button
            onClick={toggleMic}
            className={`bg-stone-500/20 bg-blur border-1 border-stone-500/40 rounded-lg button ${micActive ? 'bg-white text-black' : ''}`}
          >
            Microfono
          </button>
          <button
            onClick={toggleWebcam}
            className={`bg-stone-500/20 bg-blur border-1 border-stone-500/40 rounded-lg button ${webcamActive ? 'bg-white text-black' : ''}`}
          >
            Webcam
          </button>
        </div>
      </div>
      <div className={ `w-full h-full ${iframeClassActive ? 'absolute top-0 p-0! w-screen h-screen bg-blur' : ''}`}>
        <div className="flex items-center justify-center h-full w-full">
          <div className={`max-w-full max-h-full h-full aspect-[4/3] rounded-xl flex items-center justify-center`}>
          <div className='w-full aspect-[4/3] rounded-xl object-contain bg-stone-500/20 backdrop-blur border border-stone-500/40 p-2'>
            <iframe
              ref={iframeRef}
              src="http://204.216.211.165:8000/embed"
              className={`w-full aspect-[4/3] rounded-md object-contain ${iframeClassActive ? 'absolute top-1/2 left-1/2 max-h-full max-w-full -translate-1/2' : ''}`}
              allow="autoplay; encrypted-media"
              title="Stream"
            ></iframe>
            <a onClick={toggleIframeClass} className="mb-4 transition absolute p-2 top-4 right-4 hover:bg-stone-500/40 rounded-full  cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" className="fill-stone-300" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 2 H14 V8 H12 V4 H8 Z"/>
              <path d="M8 14 H2 V8 H4 V12 H8 Z"/>
            </svg>
            </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MicWeb;
