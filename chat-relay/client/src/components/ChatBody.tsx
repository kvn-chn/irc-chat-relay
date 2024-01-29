import { useState, useEffect } from "react";
import { getSocket } from "../socket";
import Typing from "./Typing";

interface Data {
  id: string;
  sender: string;
  message: string;
}


const ChatBody = () => {
  const [messages, setMessages] = useState<Data[]>([]);
  const socket = getSocket();

  useEffect(() => {
    //localStorage.getItem("username");
    socket.on("message", (data: Data) => {
      console.log(data.id == socket.id);
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log('username', data);
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
                <div key={index} className="w-[40%] flex flex-col mt-4">
                  <label className="ml-6 text-sm">{data.sender}</label>
                  <p className="text-lg hyphens-auto overflow-hidden border my-2 ml-3 p-2 mt-[-2px] border-blue-300 rounded-3xl bg-blue-200">
                    {data.message}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div key={index} className="w-[40%] flex flex-wrap justify-end">
                  <p className="text-lg hyphens-auto overflow-hidden border my-2 mr-3 p-3 border-blue-300 rounded-[22px] bg-blue-200">
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
