import { useState } from "react";
import { getSocket, connect, isConnected } from "./socket";
import App from "./App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { login } from "./apiCalls";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [connected, setConnected] = useState(isConnected());
  const navigate = useNavigate();

  const handleConnect = async () => {
    if (!connected && username.trim() !== "" && password.trim() !== "") {
      const { response, data } = await login(username, password);

      if (response.ok) {
        connect();

        const socket = getSocket();
        localStorage.setItem("username", username);

        socket.on("connect", () => {
          socket.emit("newUser", username);
          toast.success(`${username} connected to server`);

          socket.on("userJoined", (username) => {
            console.log(`${username} joined the chat`);
            toast.info(`${username} joined the chat`);
          });

         localStorage.setItem("userId", data.userId);
        });

        navigate("/chatrooms");
      } else toast.error(data.message);
    } else toast.error("Please enter a username");

    setConnected(isConnected());
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    handleConnect();
  };

  const navigateToRegister = () => {
    navigate("/register");
  };



  return (
    <>
      {!connected ? (
        <div className="flex flex-col justify-center items-center h-[100vh] bg-[#03252b]">
          <div className="flex flex-col bg-[#05323a] rounded-lg p-10 shadow-md">
            <h1 className="text-3xl font-bold text-white text-center mb-10">
              Login
            </h1>

            <label>Username:</label>
            <input
              className="mb-3 p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Enter your username"
              value={username}
              onKeyDown={handleKeyPress}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password:</label>
            <input
              className="p-2 border border-gray-300 rounded"
              type="password"
              placeholder="Enter your username"
              value={password}
              onKeyDown={handleKeyPress}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p
              className="mb-6 hover:cursor-pointer hover:underline hover:underline-offset-2"
              onClick={navigateToRegister}
            >
              Don't have an account?
            </p>

            <div className="flex justify-center">
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
