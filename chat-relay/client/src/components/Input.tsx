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
    <div className="flex justify-center">
      <input
        type="text"
        className="msgbox m-4 p-2 border border-gray-300 rounded"
        placeholder="Type here"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          socket.emit("typing", socket.id);
        }}
      ></input>
      <button
        className="sendbtn m-4 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default Input;
