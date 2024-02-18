import { useState } from "react";
import { getSocket, connect, isConnected } from "./socket";
import App from "./App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { login } from "./apiCalls";
import StarCanvas from "./components/Stars";

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
        <div className="flex flex-col justify-center items-center h-[100vh] ">
          <div className="flex flex-col bg-[#05323a] rounded-lg py-20 px-20 shadow-md">
            <h1 className="text-5xl font-bold text-white text-center mb-10">
              Login
            </h1>

            
            <input
              className="mb-8 p-2 pr-10 border-b border-gray-300 rounded-t-none rounded-l-none rounded-r-none bg-[#05323a] bg-none outline-none text-white focus:ring-0 focus:border-b focus:border-[#09ebe3]"
              type="text"
              placeholder="Enter your username"
              value={username}
              onKeyDown={handleKeyPress}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            
            <input
              className="mb-8 p-2 border-b border-gray-300 rounded-t-none rounded-l-none rounded-r-none bg-[#05323a] bg-none outline-none text-white focus:ring-0 focus:border-b focus:border-[#09ebe3]"
              type="password"
              placeholder="Enter your password"
              value={password}
              onKeyDown={handleKeyPress}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex justify-center">
              <button
                className="p-2 px-12 bg-gray-300 hover:bg-gray-100 font-bold text-black rounded-full mb-12"
                onClick={handleConnect}
              >
                Log In
              </button>
            </div>

            <p
              className="hover:cursor-pointer hover:underline hover:underline-offset-2 text-center"
              onClick={navigateToRegister}
            >
              Don't have an account?
            </p>
          </div>
        </div>
      ) : (
        <App />
      )}
    </>
  );
};

export default Login;
