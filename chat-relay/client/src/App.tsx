import "./App.css";
import { useState } from "react";
import { connect, getSocket } from "./socket";

import Home from "./components/Home";

function App() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    if (username) {
      localStorage.setItem("username", username);
      connect();
      const socket = getSocket();
      socket.on("connect", () => {
        socket.emit("newUser", username);
        setConnected(true);
      });
    } else {
      alert("Please enter a username");
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
