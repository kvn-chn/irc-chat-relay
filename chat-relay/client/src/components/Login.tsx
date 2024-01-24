import React, { useState } from 'react'
import { getSocket, connect, isConnected } from "../socket";
import App from '../App';

const Login = () => {

    const [username, setUsername] = useState("");
    const [connected, setConnected] = useState(isConnected());

    const handleConnect = () => {
        if (!connected && username.trim() !== "") {
          connect();
    
          const socket = getSocket();
          localStorage.setItem("username", username);
    
          socket.on("connect", () => {
            socket.emit("newUser", username);
          });
        } else alert("Please enter a username");
    
        setConnected(isConnected());
      };

  return (
    <>
        {!connected ? (
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
      ) : (
        <App />
      )}
    </>
  )
}

export default Login;