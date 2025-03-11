import { useState, ChangeEvent, FormEvent } from 'react';
import { getData } from './../../../firebase/firebaseService';
import './../../../css/basic.css';
import './password.css';

interface PasswordProps {
  onPasswordValid: () => void;
}

function Password({ onPasswordValid }: PasswordProps) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
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
        setMessage('Password corretta!');
        setIsError(false);
        onPasswordValid();
      } else {
        setMessage('Password errata. Riprova.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Errore nel recupero della password da Firebase:', error);
      setMessage('Si è verificato un errore. Riprova più tardi.');
      setIsError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handleInputChange}
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none ${
              isError ? 'border-red-500 bg-red-100' : ''
            }`}
          />
          {isError && (
            <p className="text-red-500 text-xs italic mt-2">
              Password errata. Riprova.
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Invia
          </button>
        </div>
        {message && !isError && (
          <p className="text-green-500 text-xs italic mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}

export default Password;
