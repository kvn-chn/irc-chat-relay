import { useState } from "react";
import { getSocket } from "../socket";

const Input = () => {
  const [message, setMessage] = useState("");
  const socket = getSocket();

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("message", { id: socket.id, message: message });
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
