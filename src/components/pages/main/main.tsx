import LoadComputers from './../../computers/loadComputers';
import NavBar from './../../navbar/navbar';
import SyncAdvice from './../../advise/syncAdvice';

const App: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <LoadComputers />
            <SyncAdvice />
            <NavBar />
        </div>
    );
}

export default App;