import React, { useEffect, useState } from "react";
import Img from "../assets/img.png";
import Attach from "../assets/attach.png";
import socketIO from "socket.io-client";

const Input = () => {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    // socket.emit("chat message", message);
    console.log(message);
    setMessage("");
  };

  return (
    <div>
      <input
        type="text"
        className="msgbox"
        placeholder="type here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></input>
      <button className="sendbtn" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default Input;
