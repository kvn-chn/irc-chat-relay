import { useState, useEffect } from "react";
import { getSocket } from "../socket";

const ActiveUser = () => {
  const [activeUsers, setActiveUsers] = useState([]);
  const socket = getSocket();

  const colors = [
    "bg-red-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-yellow-200",
    "bg-indigo-200",
    "bg-pink-200",
    "bg-purple-200",
    "bg-gray-200",
  ];

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  useEffect(() => {
    socket.on("activeUsers", (activeUsersArray) => {
      // Map each user to an object containing their name and a random color
      const usersWithColors = activeUsersArray.map((user) => {
        // Check if the user already exists in the state
        const existingUser = activeUsers.find((u) => u.name === user);

        // If the user exists, keep their color, otherwise assign a new color
        const color = existingUser ? existingUser.color : getRandomColor();

        return {
          name: user,
          color: color,
        };
      });

      setActiveUsers(usersWithColors); // Update the state with the received active users array
    });

    return () => {
      socket.off("activeUsers");
    };
  }, [socket, activeUsers]); // Include socket and activeUsers in the dependency array

  return (
    <div className="flex flex-col text-center">
      <h2 className="text-3xl font-bold">Active Users</h2>

      {activeUsers.map((user, index) => (
        <div className="border-b border-gray-100 p-2 flex items-center gap-2">
          <div
            className={"w-8 h-8 rounded-full flex items-center " + user.color}
          >
            <div className="text-center w-full text-black uppercase">
              {user.name[0]}
            </div>
          </div>
          <span key={index}>{user.name}</span>
        </div>
      ))}
    </div>
  );
};

export default ActiveUser;
