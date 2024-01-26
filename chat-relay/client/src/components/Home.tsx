import { useEffect, useState } from "react";
import { getSocket, disconnect, isConnected } from "../socket";
import Input from "./Input";
import App from "../App";
import { toast } from 'react-toastify';
import ChatBody from "./ChatBody";
import Typing from "./Typing";
import ActiveUser from "./ActiveUser";
import Channel from "./Channel";

const Home = () => {
  
  const [connected, setConnected] = useState(isConnected());
  const username = localStorage.getItem("username");

  const [socket, setSocket] = useState(null);
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

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

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
    });

    socket.on('userJoined', ({ channel, user }) => {
      setChat((prevChat) => [...prevChat, { text: `${user} joined ${channel}`, user: 'system' }]);
    });

    socket.on('userLeft', ({ channel, user }) => {
      setChat((prevChat) => [...prevChat, { text: `${user} left ${channel}`, user: 'system' }]);
    });

    socket.on('message', ({ channel, user, text }) => {
      setChat((prevChat) => [...prevChat, { text: `${user}: ${text}`, user }]);
    });

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
    <div>
      {connected ? (
        <div className="flex h-screen">
          <div className="w-1/5 m-2 bg-gray-800 rounded flex flex-col justify-center">
            <Channel />
          </div>
          <div className="w-3/5 flex m-2 bg-gray-800 rounded justify-center items-start">
            <h1 className="text-3xl font-bold">Welcome {username}</h1>
            <button className="flex mt-2 p-2 bg-blue-500 hover:bg-blue-700 text-white rounded" onClick={logOut}>Logout</button>
            <ChatBody />
            <Typing />
            <Input />
          </div>
          <div className="w-1/5 m-2 bg-gray-800 rounded flex justify-center">
            <ActiveUser />
          </div>
        </div>
      ) : (
        <App />
      )}
    </div>
  );
};

export default Home;
