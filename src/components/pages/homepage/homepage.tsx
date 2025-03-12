import './../../../css/basic.css';
import './homepage.css';
import LoadComputers from './../../computers/loadComputers'; // Importing LoadComputers

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
                className="button-destructive px-4 py-2" >
                Chiudi
              </button>
              <button onClick={handleConnect} >
                Connettiti ora
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}

export default Homepage;
