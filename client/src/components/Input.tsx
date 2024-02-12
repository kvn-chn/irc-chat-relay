import { useState } from "react";
import { getSocket } from "../socket";

const Input = ({ selectedChannel, setSelectedChannel, messages, setMessages }) => {
  const [message, setMessage] = useState("");
  const socket = getSocket();
  //const username = localStorage.getItem("username");

  const sendMessage = () => {
    if (message.trim() === "") return;

    socket.emit("message", { id: socket.id, message: message, channel: selectedChannel });
    setMessage("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    sendMessage();
  };

  return (
    <>
      {selectedChannel && (
        <div className="flex justify-center pl-1">
          <input
            type="text"
            onKeyDown={handleKeyPress}
            className="border border-black h-10 w-full rounded-md mr-2 pl-1 bg-neutral-300 text-black dark:text-[#09ebe3] dark:bg-[#004449]"
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
      )}
    </>
  );
}

export default Input;
