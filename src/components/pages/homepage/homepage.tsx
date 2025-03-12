import './../../../css/basic.css';
import './../../../css/buttons.css';
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
          <div className="w-100 flex flex-col">
            <div className="w-100 flex justify-between">
              <button
                onClick={handleStop}
                className="bg-red-500:hover px-4 py-2" >
                Ferma
              </button>
              <button onClick={handleConnect} >
                Connettiti
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Homepage;
