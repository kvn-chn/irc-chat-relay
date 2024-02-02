import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getSocket } from "../socket";
import Typing from "./Typing";

interface Data {
  id: string;
  sender: string;
  receiver?: string;
  message: string;
  time: string;
  isPrivate: boolean;
}

const ChatBody = () => {
  const [messages, setMessages] = useState<Data[]>([]);
  const socket = getSocket();

  useEffect(() => {
    //localStorage.getItem("username");
    socket.on("message", (data: Data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      console.log(data.isPrivate);
    });

    socket.on("serverResponse", (message) => {
      toast.success(message);
    });

    return () => {
      socket.off("message");
      socket.off("serverResponse");
    };
  });

  return (
    <>
      <div className="h-[85vh] w-full bg-neutral-200 text-black dark:text-[#09ebe3] dark:bg-[#043a44] border border-y-black flex flex-col-reverse overflow-x-scroll">
        <div>
          {messages.map((data, index) =>
            data.id !== socket.id ? (
              <div key={index} className="w-[70%] flex flex-col mt-4 mb-2">
                <label className="ml-6 text-sm mb-[2px]">{data.sender}</label>
                <div className="flex flex-wrap">
                  <p
                    className={`text-lg overflow-hidden break-words border my-1 ml-3 p-3 mt-[-2px] ${
                      data.isPrivate ? "italic" : "not-italic"
                    } border-[#0a2b03] rounded-[22px] bg-[#2f941a] text-white`}
                  >
                    {data.message}
                  </p>
                </div>
                <label className="ml-6 mt[-2px] text-sm">{data.time}</label>
              </div>
            ) : (
              <div key={index} className="flex justify-end mt-6 mb-2">
                <div className="w-[70%] justify-end">
                  <div className="flex flex-wrap justify-end">
                    <p className="text-lg overflow-hidden break-words border my-2 mr-3 p-3 border-[#03252b] rounded-[22px] bg-[#1356bb] text-white">
                      {data.message}
                    </p>
                  </div>

                  <div className="flex justify-end mr-5 mt[-2px] ml-6">
                    <label className="text-sm">{data.time}</label>
                  </div>
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
