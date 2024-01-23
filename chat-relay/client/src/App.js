import './App.css';
import { useState } from 'react';
import socketIO from 'socket.io-client';

import Home from './components/Home';

function App() {

  const [username, setUsername] = useState('');
  const [connected , setConnected] = useState(false);

    const handleConnect = async () => {
        if (username) {
            localStorage.setItem('username', username);
            const socket = socketIO.connect('http://localhost:4000');
            await socket.on('connect', () => {
              socket.emit('newUser', username);
              setConnected(true);
          });
        } else {
            alert('Please enter a username');
        }
    };

  return (
    <div>
      {!connected && (
        <div>
        <h1>Chat Relay</h1>
        <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleConnect}>Connect</button>
        </div>
      )}
      {connected && <Home />}
    </div>
  );
}

export default App;
