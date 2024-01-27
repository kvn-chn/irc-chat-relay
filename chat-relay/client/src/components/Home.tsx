import { useEffect, useState } from "react";
import { getSocket, disconnect, isConnected } from "../socket";
import Input from "./Input";
import App from "../App";
import { toast } from "react-toastify";
import ChatBody from "./ChatBody";
import ActiveUser from "./ActiveUser";
import Channel from "./Channel";

const Home = () => {
  const [connected, setConnected] = useState(isConnected());
  const username = localStorage.getItem("username");
  const [chat, setChat] = useState<{ text: string; user: string }[]>([]);

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

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("userJoined", ({ channel, user }) => {
      setChat((prevChat) => [
        ...prevChat,
        { text: `${user} joined ${channel}`, user: "system" },
      ]);
    });

    socket.on("userLeft", ({ channel, user }) => {
      setChat((prevChat) => [
        ...prevChat,
        { text: `${user} left ${channel}`, user: "system" },
      ]);
    });

    socket.on("message", ({ user, text }) => {
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
        <div className="flex flex-row bg-black h-[100vh]">
          <div className="w-1/5 m-2 bg-white rounded flex flex-col justify-center">
            <Channel />
          </div>

          <div className="w-3/5 my-2 flex flex-col bg-white rounded justify-center items-start">
            <div className="flex flex-row items-center">
              <h1 className="text-3xl font-bold text-black">
                Welcome {username}
              </h1>

              <button
                className="mt-2 p-2 bg-red-500 hover:bg-red-700 text-white rounded"
                onClick={logOut}
              >
                Logout
              </button>
            </div>

            <div className="flex flex-col w-full">
              <ChatBody />

              <div>
                <Input />
              </div>
            </div>
          </div>
          <div className="w-1/5 m-2 bg-white rounded flex justify-center">
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
