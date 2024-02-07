import { useState, useEffect } from "react";
import { getSocket } from "../socket";

const Typing = () => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const socket = getSocket();

    socket.on("typing", (userId) => {
      
      if (userId !== socket.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
        console.log("Someone is typing...");
      }
    });

    return () => {
      socket.off("typing");
    };
  }, []);

  return <div>{isTyping ? "Someone is typing..." : " "}</div>;
};

export default Typing;
