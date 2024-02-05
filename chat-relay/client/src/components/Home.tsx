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
  const [currentChannel, setCurrentChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [mockMessages, setMockMessages] = useState({
    'channel1': ['Hello', 'Hi', 'How are you?'],
  });

  const sendMessage = (message: string) => {
  if (!message || message.trim() === "") return;

  setMessages((prevMessages) => [...prevMessages, message]);

  // Check if the current channel exists in mockMessages
  if (!mockMessages[currentChannel]) {
    // If it doesn't, create a new array for that channel
    setMockMessages(prevMockMessages => ({
      ...prevMockMessages,
      [currentChannel]: [],
    }));
  }

  // Add the new message to the current channel's messages
  setMockMessages(prevMockMessages => ({
    ...prevMockMessages,
    [currentChannel]: [...prevMockMessages[currentChannel], message],
  }));

  const socket = getSocket();
  socket.emit("message", { id: socket.id, message: message });
}

  useEffect(() => {
    if (currentChannel) {
      // replace fetchMessages with your API call function
      /* fetchMessages(currentChannel).then((newMessages) => {
        setMessages(newMessages);
      }); */
      console.log("Current Channel:", mockMessages[currentChannel]);
      if (mockMessages[currentChannel]) {
      setMessages(mockMessages[currentChannel]);
    } else {
      // If there are no messages, set messages to an empty array
      setMessages([]);
    }

    }
    const socket = getSocket();

    if (!isConnected()) {
      logOut();
      socket.emit("disconnect");
    }

      socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
  }, [currentChannel]);

  const handleChannelClick = (channel) => {
    setCurrentChannel(channel);
    console.log("Current Channel:", currentChannel);
  };

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
<<<<<<< Updated upstream
          <div className="w-1/5 m-2 bg-white rounded flex flex-col justify-center">
            <Channel />
=======
          <div className="w-1/5 m-2 text-black dark:text-[#09ebe3] dark:bg-[#03252b] bg-white rounded flex flex-col justify-center">
            <Channel onChannelClick={handleChannelClick}/>
>>>>>>> Stashed changes
          </div>

          <div className="w-3/5 my-2 flex flex-col bg-white rounded justify-center items-start">
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold text-black">
                Welcome {username}
              </h1>

              <button
                className="p-2 bg-red-500 hover:bg-red-700 text-white rounded"
                onClick={logOut}
              >
                Logout
              </button>
            </div>

            <div className="mt-2 flex flex-col w-full">
              <ChatBody messages={messages} setMessages={setMessages} />

              <div className="mt-2 p-2">
                <Input sendMessage={sendMessage}/>
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