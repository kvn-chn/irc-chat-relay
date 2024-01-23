import React, { useState } from "react";
import Input from "./Input";

import socketIO from "socket.io-client";

const Home = () => {
  const username = localStorage.getItem("username");

  return (
    <div>
      <Input />
      <h1>Greetings {username}</h1>
      <div className="msghistory"></div>
      <div className="channelblock"></div>
      <div className="userblock"></div>
      <div className="channeltitle">EMPLACEMENT</div>
    </div>
  );
};

export default Home;
