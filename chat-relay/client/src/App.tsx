import "./App.css";
import { connect, getSocket, isConnected } from "./socket";

import Home from "./components/Home";
import { useState } from "react";

function App() {
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

  if (connected !== isConnected()) {
    setConnected(isConnected());
  }

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
        <Home />
      )}
    </>
  );
}

export default App;
