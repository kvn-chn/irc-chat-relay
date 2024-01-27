import React from "react";
import { useState, useEffect } from "react";
import { getSocket } from "../socket";

const Typing = () => {
  const [isTyping, setIsTyping] = useState(false);
  const socket = getSocket();

  useEffect(() => {
    socket.on("typing", (userId) => {
      // Check if the user typing is the current user
      if (userId !== socket.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000); // Reset typing indicator after 3 seconds
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
