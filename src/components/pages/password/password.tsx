import { useState, ChangeEvent, FormEvent } from 'react';
import { getData } from './../../../firebase/firebaseService';
import './../../../css/basic.css';
import './password.css';

interface PasswordProps {
  onPasswordValid: () => void;
}

function Password({ onPasswordValid }: PasswordProps) {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setIsError(false); // Reset dell'errore quando l'utente modifica l'input
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const storedPassword = await getData('consolepassword');
      if (password === storedPassword) {
        setIsError(false);
        onPasswordValid();
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Errore nel recupero della password da Firebase:', error);
      setIsError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className='flex items-center mb-5'><div className='bg-white h-[10px] w-[10px] rounded-full'></div><p className="text-center ml-2">Password</p></div>
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handleInputChange}
            className={`w-full ${ isError ? 'border-red-500! bg-red-900/30!' : '' }`}
          />
          <button type="submit" className="hover:cursor-pointer hover:bg-white hover:text-black w-[55px] border border-white">
            &gt;
          </button>
        </div>
      </form>

    </div>
  );
}

export default Password;
