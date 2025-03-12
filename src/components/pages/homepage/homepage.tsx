import './../../../css/basic.css';
import './homepage.css';
import LoadComputers from './../../computers/loadComputers';
import syncAdvice from '../../computers/advise/syncAdvise';

function Homepage() {
  const handleConnect = () => {
    // Add your connect logic here
    console.log('Connecting to PC...');
  };

  const handleStop = () => {
    // Add your stop logic here
    console.log('Stopping connection...');
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <LoadComputers />
      <div className="w-full h-screen flex flex-col items-center justify-center">
          <div className="w-85 flex flex-col">
            <h2 className='mb-3 -mx-3'>- Controllo schermo</h2>
            <div className="w-85 flex justify-between">
              <button
                onClick={handleStop}
                className="button-destructive bg-stone-500/20 bg-blur border-1 border-stone-500/40 rounded-lg" >
                Chiudi
              </button>
              <button onClick={handleConnect} className='bg-stone-500/20 bg-blur border-1 border-stone-500/40 rounded-lg'>
                Connettiti
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}

export default Homepage;
