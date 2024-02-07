import { useEffect, useState, useContext } from "react";
import { getSocket, disconnect, isConnected } from "./socket";
import Input from "./components/Input";
import App from "./App";
import { toast } from "react-toastify";
import ChatBody from "./components/ChatBody";
import ActiveUser from "./components/ActiveUser";
import Channel from "./components/Channel";
import ThemeButton from "./components/ThemeButton";
import axios from "axios";
import { UserContext } from "./components/UserContext";

const ChatRooms = () => {
  const [connected, setConnected] = useState(isConnected());
  //const username = localStorage.getItem("username");
  const { username, id, setId, setUsername } = useContext(UserContext);

  useEffect(() => {
    const socket = getSocket();

    if (!isConnected()) {
      logOut();
      socket.emit("disconnect");
    }

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
  }, []);

  const logOut = () => {
    disconnect();
    toast.success("Logged out");
    localStorage.removeItem("username");
    setConnected(isConnected());
    axios.post("/logout").then(() => {
      setId(null);
      setUsername(null);
    });
  };

  return (
    <div className="scrollbar-thin dark:scrollbar-track-[#09ebe42a] dark:scrollbar-thumb-[#09ebe3]">
      {connected ? (
        <div className="flex flex-row bg-black h-[100vh]">
          <div className="w-1/5 m-2 text-black dark:text-[#09ebe3] dark:bg-[#03252b] bg-white rounded flex flex-col justify-center">
            <Channel />
          </div>

          <div className="w-3/5 my-2 flex flex-col text-black dark:text-[#09ebe3] dark:bg-[#05323a] bg-white rounded justify-center items-start">
            <div className="flex justify-between w-full px-2">
              <h1 className="text-3xl font-bold text-black dark:text-[#09ebe3]">
                Welcome {username}
              </h1>

              <div>
                <ThemeButton />

                <button
                  className="p-2 bg-red-500 hover:bg-red-700 text-white rounded"
                  onClick={logOut}
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="mt-2 flex flex-col w-full">
              <ChatBody />

              <div className="mt-2 p-2">
                <Input />
              </div>
            </div>
          </div>
          <div className="w-1/5 m-2 text-black dark:text-[#09ebe3] dark:bg-[#03252b] bg-white rounded flex justify-center">
            <ActiveUser />
          </div>
        </div>
      ) : (
        <App />
      )}
    </div>
  );
};

export default ChatRooms;
