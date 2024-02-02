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

  };

  var home = document.getElementById('home');
  var theme=document.cookie
  var currentTheme=""
  if (theme=="theme=dark")
    {
    currentTheme="dark"
    }
  else(currentTheme="light")

  async function loadTheme(){
    home = document.getElementById('home')
    console.log(document.readyState)
  if (currentTheme=="dark")
    {
    // currentTheme="dark"
    home?.classList.add("dark")
    console.log("dark")
    }
    else
    {
      // currentTheme="light"
      home?.classList.remove("dark")
      console.log("light")
    }}


  function changeTheme()
  {
    home = document.getElementById('home');
    theme = document.cookie
    if (currentTheme=="dark")
    {
    document.cookie = "theme=light"
    currentTheme="light"
    home?.classList.remove("dark")
    }
    else
    {
      document.cookie="theme=dark"
      currentTheme="dark"
      home?.classList.add("dark")
    }
  }

document.addEventListener('keypress',loadTheme)

  return (

    <div id="home" onMouseEnter={loadTheme}>
      <div>
        {connected ? (
          <div className="flex flex-row bg-black h-[100vh]">
            <div className="w-1/5 m-2 text-black dark:text-[#09ebe3] dark:bg-[#03252b] bg-white rounded flex flex-col justify-center">
              <Channel />
            </div>

            <div className="w-3/5 my-2 flex flex-col text-black dark:text-[#09ebe3] dark:bg-[#05323a] bg-white rounded justify-center items-start">
              <div className="flex justify-between">
                <h1 className="text-3xl font-bold text-black">
                  Welcome {username}
                </h1>

                <button id="themetoggle" onClick={changeTheme} className="dark:bg-white dark:text-black bg-[#004449] text-[#09ebe3]">change theme</button>

                <button
                  className="p-2 bg-red-500 hover:bg-red-700 text-white rounded"
                  onClick={logOut}
                >
                  Logout
                </button>
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
    </div>
  );
};

export default Home;
