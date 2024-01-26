import "./App.css";
import { isConnected } from "./socket";

import Home from "./components/Home";
import { useState } from "react";
import Login from "./components/Login";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [connected, setConnected] = useState(isConnected());

  if (connected !== isConnected()) {
    setConnected(isConnected());
  }

  return (
    <div>
      {connected ? <Home /> : <Login />}
      <ToastContainer autoClose={2500} theme="colored" newestOnTop={true}/>
    </div>
  );
}

export default App;
