import { useEffect } from "react";
import { getSocket } from "../socket";
import Input from "./Input";

const Home = () => {
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

  return (
    <>
      <div>
        <Input />
        <h1>Greetings {username}</h1>
        <div className="msghistory"></div>
        <div className="channelblock"></div>
        <div className="userblock"></div>
        <div className="channeltitle">EMPLACEMENT</div>
      </div>
    </>
  );
};

export default Home;
