import { useState, useEffect } from "react";
import { getSocket } from "../socket";
import Typing from "./Typing";

interface Data {
  id: string;
  message: string;
}

const ChatBody = () => {
  const [messages, setMessages] = useState<Data[]>([]);
  const socket = getSocket();

  useEffect(() => {
    socket.on("message", (data: Data) => {
      console.log(data.id == socket.id);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  /* useEffect(() => {
    const handleMessage = (msg: { id: string; message: string }) => {
      console.log(msg);
      if (msg.id != socket.id) {
        console.log(msg);
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }); */

  return (
    <>
      <div className="h-[85vh] w-full bg-white border border-y-black flex flex-col-reverse overflow-scroll">
        <div>
          {messages.map((data, index) =>
            data.id != socket.id ? (
              <div>
                <div key={index} className="w-[30%] flex flex-wrap">
                  <p className="hyphens-auto overflow-hidden border my-1 ml-1 p-1 border-blue-300 rounded-lg bg-blue-200">
                    {data.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div key={index} className="w-[30%] flex flex-wrap justify-end">
                  <p className="hyphens-auto overflow-hidden border my-1 mr-1 p-1 border-blue-300 rounded-lg bg-blue-200">
                    {data.message}
                  </p>
                </div>
              </div>
            )
          )}
        </div>

        <Typing />
      </div>
    </>
  );
};

export default ChatBody;
