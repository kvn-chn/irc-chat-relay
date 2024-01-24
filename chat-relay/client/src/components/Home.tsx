import { useEffect, useState } from "react";
import { getSocket, disconnect, isConnected } from "../socket";
import Input from "./Input";
import App from "../App";
import { toast } from 'react-toastify';

const Home = () => {
  const [connected, setConnected] = useState(isConnected());
  const username = localStorage.getItem("username");

  useEffect(() => {
    const socket = getSocket();

    if (!isConnected()) {
      logOut();
    }

    const handleMessage = (msg: { id: string; message: string }) => {
      if (msg.id != socket.id) {
        console.log(msg);
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const logOut = () => {
    disconnect();
    toast.success("Logged out");
    localStorage.removeItem("username");
    setConnected(isConnected());
  };

  return (
    <>
      {connected ? (
        <div>
          <h1>Greetings {username}</h1>
          <div className="msghistory"></div>
          <div className="channelblock"></div>
          <div className="userblock"></div>
          <div className="channeltitle">EMPLACEMENT</div>
          <Input />

          <button className="logout" onClick={logOut}>
            Logout
          </button>
        </div>
      ) : (
        <App />
      )}
    </>
  );
};

export default Home;
