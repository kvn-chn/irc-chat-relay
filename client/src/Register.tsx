import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { register } from "./apiCalls";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    handleSubmit(event);
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] bg-[#03252b]">
      <div className="flex flex-col bg-[#05323a] rounded-lg p-8 shadow-md">
        <h1 className="text-center text-2xl text-white mb-6">Register</h1>

        <form className="w-64 mx-auto" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Username"
              onKeyDown={handleEnterKey}
              className="block w-full rounded p-2 border"
              required
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Create password"
              onKeyDown={handleEnterKey}
              className={`block w-full rounded p-2 border ${
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
              className={`block w-full rounded p-2 border ${
                password !== repeatPassword ? "border-red-500" : ""
              }`}
              required
            />
          </div>

          <p
            className="mb-6 hover:cursor-pointer hover:underline hover:underline-offset-2"
            onClick={navigateToLogin}
          >
            Already have an account?
          </p>

          <div className="flex justify-center mt-6">
            <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
