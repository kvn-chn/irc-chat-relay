import "./App.css";
import { connect, getSocket, isConnected } from "./socket";

import Home from "./components/Home";
import { useState } from "react";
import Login from "./components/Login";

function App() {
  const [connected, setConnected] = useState(isConnected());

  if (connected !== isConnected()) {
    setConnected(isConnected());
  }

  return (
    <>
      {connected ? <Home /> : <Login />}
    </>
  );
}

export default App;
