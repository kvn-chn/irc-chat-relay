import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { register } from "./apiCalls";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (username && password && repeatPassword && password === repeatPassword) {
      const { response, data } = await register(username, password);

      if (response.ok) {
        navigateToLogin();
      } else toast.error(data.message);
    } else {
      toast.error("Please enter a username and password");
    }
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;

    handleSubmit();
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh]">
      <div className="flex flex-col bg-[#05323a] rounded-lg py-20 px-20 shadow-md">
        <h1 className="text-center text-5xl font-bold text-white mb-8">Register</h1>

        <form className="" onSubmit={handleSubmit}>
          <div className="">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
              onKeyDown={handleEnterKey}
              className="flex flex-col mb-6 p-2 pr-10 border-b border-gray-300 rounded-t-none rounded-l-none rounded-r-none bg-[#05323a] bg-none outline-none text-white focus:ring-0 focus:border-b focus:border-[#09ebe3]"
              required
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Create password"
              onKeyDown={handleEnterKey}
              className={`flex flex-col mb-6 p-2 pr-10 border-b border-gray-300 rounded-t-none rounded-l-none rounded-r-none bg-[#05323a] bg-none outline-none text-white focus:ring-0 focus:border-b focus:border-[#09ebe3] ${
                password !== repeatPassword ? "border-red-500" : ""
              }`}
              required
            />

            <input
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              type="password"
              placeholder="Confirm password"
              onKeyDown={handleEnterKey}
              className={`flex flex-col mb-8 p-2 pr-10 border-b border-gray-300 rounded-t-none rounded-l-none rounded-r-none bg-[#05323a] bg-none outline-none text-white focus:ring-0 focus:border-b focus:border-[#09ebe3] ${
                password !== repeatPassword ? "border-red-500" : ""
              }`}
              required
            />
          </div>

          <div className="flex justify-center">
            <button className="p-2 px-12 bg-gray-300 hover:bg-gray-100 font-bold text-black rounded-full mb-12">
              Register
            </button>
          </div>

          <p
            className="hover:cursor-pointer hover:underline hover:underline-offset-2 text-center"
            onClick={navigateToLogin}
          >
            Already have an account?
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
