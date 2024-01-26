import { useState, useEffect } from "react";
import { getSocket } from "../socket";

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
    <div className="h-64 overflow-y-auto bg-white">
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
};

export default ChatBody;