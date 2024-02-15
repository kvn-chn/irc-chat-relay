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

  return (
    <div className="flex flex-col p-2">
      <h1 className="flex justify-center text-3xl font-bold">Channels</h1>
      <div className="flex flex-col items-center">
        <input
          className="mt-7 w-[90%] mx-1 mb-1 p-1 border border-gray-300 rounded bg-neutral-300 text-black dark:text-[#09ebe3] dark:bg-[#004449]"
          placeholder="Enter Channel Name"
          value={newChannel}
          onChange={handleChannelNameChange}
        />
        <button
          className="mt-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleJoinChannel}
        >
          Create/Join Channel
        </button>
      </div>

      {channels.length > 0 && (
        <div className="px-4 pt-4">
          {channels.map((channel, index) => (
            <div
              key={index}
              className={`border-b my-2 border-gray-100 p-2 dark:border-gray-600 cursor-pointer rounded
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
