import { useState, useEffect } from "react";
import { getSocket } from "../socket";

const ActiveUser = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    socket.on("activeUsers", (data) => {
      setActiveUsers(data); // Update the state with the received active users
      console.log('activeUsers', activeUsers);
    });
    // Clean up the socket listener when the component is unmounted
    return () => {
      socket.off("activeUsers");
    };
  }, []);

  return (
    <div>
      <div className="text-3xl font-bold">Active Users</div>
    </div>
  );
};

export default ActiveUser;
