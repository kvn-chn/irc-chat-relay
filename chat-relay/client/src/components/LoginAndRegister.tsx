import React, { useContext, useState } from 'react'
import axios from 'axios';
import { UserContext } from './UserContext';
import { getSocket, connect, isConnected } from "../socket";
import { toast } from "react-toastify";

const Register = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');

    const [connected, setConnected] = useState(isConnected());

    const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);

    async function handleSubmit(e) {
        e.preventDefault();
        if (username && password) {
            const url = isLoginOrRegister === 'register' ? '/register' : '/login';
            const {data} = await axios.post(url, {username, password});
            setLoggedInUsername(username);
            setId(data.id);

            if(!connected) {
                await connect();
                const socket = await getSocket();
                localStorage.setItem("username", username);
                socket.on("connect", () => {
                    socket.emit("newUser", username);
                    toast.success(`${username} connected to server`);
            
                    socket.on("userJoined", (username) => {
                    console.log(`${username} joined the chat`);
                    toast.info(`${username} joined the chat`);
                    });
                });
            }
            setConnected(isConnected());
        }
        else {
            toast.error('Please enter a username and password');
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key !== "Enter") return;
            handleSubmit(event);
        };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] bg-[#03252b]">
        <div className="flex flex-col bg-[#05323a] rounded-lg p-10 shadow-md">
        <form className='w-64 mx-auto mb-12' onSubmit={handleSubmit}>
            <input value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                type="text" 
                placeholder='username' 
                onKeyDown={handleKeyPress}
                className='block w-full rounded-sm p-2 mb-2 border'
            />
            <input value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                placeholder='password' 
                onKeyDown={handleKeyPress}
                className='block w-full rounded-sm p-2 mb-2 border'
            />
            <button className='bg-blue-500 text-white block w-full rounded-sm p-2'>
                {isLoginOrRegister === 'register' ? 'Register' : 'Login'}
            </button>
            <div className='text-center mt-2'>
                {isLoginOrRegister === 'register' && (
                    <div>
                        Already a member ? 
                        <button onClick={() => setIsLoginOrRegister('login')} className='bg-[#004449]'>
                            Login here
                        </button>
                    </div>
                )}
                {isLoginOrRegister === 'login' && (
                    <div>
                        Don't have an account ? 
                        <button onClick={() => setIsLoginOrRegister('register')} className='bg-[#004449]'>
                            Register here
                        </button>
                    </div>
                )}
            </div>
        </form>
    </div></div>
  )
}

export default Register