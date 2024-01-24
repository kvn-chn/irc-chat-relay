import { useEffect, useState } from "react";
import { getSocket, disconnect, isConnected } from "../socket";
import Input from "./Input";
import App from "../App";

const Home = () => {
  const [connected, setConnected] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const socket = getSocket();

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
    setConnected(false);
  };

  return (
    <>
      {isConnected() ? (
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
