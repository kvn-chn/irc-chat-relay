import { useState } from "react";
import { getSocket, connect, isConnected } from "../socket";
import App from "../App";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(isConnected());

  const handleConnect = () => {
    if (!connected && username.trim() !== "") {
      connect();

      const socket = getSocket();
      localStorage.setItem("username", username);

      socket.on("connect", () => {
        socket.emit("newUser", username);
        toast.success(`${username} connected to server`);

        socket.on("userJoined", (username) => {
          console.log(`${username} joined the chat`);
          toast.success(`${username} joined the chat`);
        });
      });
    } else toast.error("Please enter a username");

    setConnected(isConnected());
  };

  return (
    <>
      {!connected ? (
        <div className="flex flex-col justify-center items-center h-[100vh] bg-gray-100">
          <div className="flex flex-col bg-white rounded-sm p-10 shadow-md">
            <h1 className="text-3xl font-bold text-center mb-10">Chat Relay</h1>
            <label>Username:</label>
            <input
              className="p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="flex justify-center mt-3">
              <button
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                onClick={handleConnect}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      ) : (
        <App />
      )}
    </>
  );
};

export default Login;
