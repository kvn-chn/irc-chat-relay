import "./App.css";
import { isConnected } from "./socket";

import Home from "./components/Home";
import { useState } from "react";
import Login from "./components/Login";

function App() {
  const [connected, setConnected] = useState(isConnected());

  if (connected !== isConnected()) {
    setConnected(isConnected());
  }

  return <div>{connected ? <Home /> : <Login />}</div>;
}

export default App;
