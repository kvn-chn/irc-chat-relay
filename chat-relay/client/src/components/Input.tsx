import { useState } from "react";
import { getSocket } from "../socket";
import attach from "../assets/attach.png";
import img from "../assets/img.png";

const Input = () => {
  const [message, setMessage] = useState("");
  const socket = getSocket();
  //const username = localStorage.getItem("username");

  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("message", { id: socket.id, message: message });
    setMessage("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    sendMessage();
  };

  return (
    <div className="flex justify-center pl-1">
      <input
        type="text"
        onKeyDown={handleKeyPress}
        className="border border-black h-10 w-full rounded-md mr-2 pl-1"
        placeholder="Type here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></input>
      <button
        className="p-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default Input;
