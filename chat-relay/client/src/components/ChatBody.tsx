import { useState, useEffect } from "react";
import { getSocket } from "../socket";
import Typing from "./Typing";

const ChatBody = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const socket = getSocket();

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  return (
    <>
      <div className="h-[85vh] w-full bg-white border border-b-black border-t-black">
        {messages.map((message, index) => (
          <p
            className="border w-[30%] my-1 ml-1 p-1 border-blue-300 rounded-lg bg-blue-200"
            key={index}
          >
            {message}
          </p>
        ))}

        <Typing />
      </div>
    </>
  );
};

export default ChatBody;
