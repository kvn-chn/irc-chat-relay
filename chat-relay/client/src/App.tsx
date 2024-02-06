import "./index.css";
import { isConnected } from "./socket";

import Home from "./components/Home";
import { useContext, useState } from "react";
import Login from "./components/Login";
import Register from "./components/LoginAndRegister";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import { UserContextProvider } from "./components/UserContext";
import Routes from "./components/Routes";

function App() {

  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:4000";

  /* const [connected, setConnected] = useState(isConnected());

  if (connected !== isConnected()) {
    setConnected(isConnected());
  }

  return (
    <>
      {connected ? <Home /> : <Register />}
      <ToastContainer autoClose={2500} theme="colored" newestOnTop={true} />
    </>
  ); */
  return (
    <UserContextProvider>
      <Routes />
      <ToastContainer autoClose={2500} theme="colored" newestOnTop={true} />
    </UserContextProvider>
  )
}

export default App;
