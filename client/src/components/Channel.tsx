import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createChannel } from "../apiCalls";
import { getSocket } from "../socket";

const Channel = ({
  selectedChannel,
  setSelectedChannel,
}: {
  selectedChannel: string | null;
  setSelectedChannel: (channel: string | null) => void;
}) => {
  const [channels, setChannels] = useState<string[]>([]);
  const [newChannel, setNewChannel] = useState("");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const socket = getSocket();

  const handleJoinChannel = async () => {
    const channelName = newChannel.trim();

    if (channelName.trim() === "") toast.error("Please enter a channel name");
    else if (channels.includes(channelName))
      toast.error(`${channelName} already exists`);
    else {
      const data = {
        sender: username,
        message: "/join " + channelName,
      };

      socket.emit("message", data);
    }
  };

  const handleChannelNameChange = (e: { target: { value: string } }) => {
    setNewChannel(e.target.value);
  };

  function selectChannel(channel: string) {
    setSelectedChannel(channel);
    console.log("Selected channel:", channel);
    const data = {
      sender: username,
      message: "/users " + channel,
    };

    socket.emit("message", data);
  }

  const createChal = async (channelName: string) => {
    if (!userId) return;
    const { response, data } = await createChannel(channelName, userId);

    if (response.status === 201 || response.status === 400) {
      setChannels((prevchannels) => [...prevchannels, channelName]);
      setNewChannel("");
      toast.success(`Joined ${channelName}`);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    const joinChannel = (channelName: string) => {
      createChal(channelName);
    };

    const leaveChannel = (channelName: string) => {
      setChannels((prevChannels) =>
        prevChannels.filter((channel) => channel !== channelName)
      );
    };

    socket.on("joinChannel", joinChannel);
    socket.on("leaveChannel", leaveChannel);

    return () => {
      socket.off("joinChannel", joinChannel);
      socket.off("leaveChannel", leaveChannel);
    };
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    handleJoinChannel();
  };

  return (
    <div className="flex flex-col text-center gap-y-2">
      <div className="flex w-full px-2 gap-x-2 mt-4 items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 items-center min-w-8 min-h-8">
        <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
        <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
      </svg>
      <h2 className="text-3xl font-bold text-center">Channels</h2>
    </div>
      <div className="border-b border-gray-700 p-2 flex items-center"></div>
      <div className="flex flex-col items-center">
        <input
          className=" w-full mb-1 p-2 rounded bg-neutral-300 text-black dark:text-[#09ebe3] dark:bg-[#004449]"
          placeholder="Enter Channel Name"
          value={newChannel}
          onChange={handleChannelNameChange}
          onKeyDown={handleKeyPress}
        />
        <button
          className="flex mt-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleJoinChannel}
        >
          Create/Join a channel
        </button>
      </div>

      {channels.length > 0 && (
        <div className="">
          {channels.map((channel, index) => (
            <div
              key={index}
              className={`mx-1 my-0.5 border-gray-100 p-3.5 dark:border-gray-600 cursor-pointer rounded-lg text-left text-lg
                ${
                  selectedChannel === channel
                    ? "bg-blue-100 dark:bg-[#004449]"
                    : "hover:bg-blue-100 dark:hover:bg-[#004449] "
                }`}
              onClick={() => selectChannel(channel)}
            >
              {channel}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Channel;
