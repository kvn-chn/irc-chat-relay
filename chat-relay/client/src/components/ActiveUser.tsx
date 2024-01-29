import { useState, useEffect } from "react";
import { getSocket } from "../socket";

const ActiveUser = () => {
  const [activeUsers, setActiveUsers] = useState([]); 

  useEffect(() => {
    const socket = getSocket();

    // Listen for the "activeUsers" event from the server
    socket.on("activeUsers", (activeUsersArray) => {
      setActiveUsers(activeUsersArray); // Update the state with the received active users array
    });

    return () => {
      socket.off("activeUsers");
    };
  }, []);

  return (
    <div>
      <div className="text-3xl font-bold">Active Users</div>
      <ul>
        {activeUsers.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUser;