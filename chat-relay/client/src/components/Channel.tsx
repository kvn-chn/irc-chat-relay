import { useState } from "react";
import { toast } from "react-toastify";

const Channel = () => {
  const [channels, setChannels] = useState<string[]>([]);
  const [newChannel, setNewChannel] = useState("");

  const handleJoinChannel = () => {
    const channelName = newChannel.trim();

    if (channelName === "") {
      toast.error("Please enter a channel name");
    } else if (channels.includes(channelName)) {
      toast.error(`${channelName} already exists`);
    } else {
      setChannels([...channels, channelName]);
      setNewChannel("");
      toast.success(`Joined ${channelName}`);
    }
  };

  const handleChannelNameChange = (e: { target: { value: string } }) => {
    setNewChannel(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <h1 className="flex justify-center text-3xl font-bold">Channels</h1>
      <div className="flex flex-col items-center">
        <input
          className="mt-7 w-[90%] p-2 border border-gray-300 rounded bg-neutral-300 text-black dark:text-[#09ebe3] dark:bg-[#004449]"
          placeholder="Enter Channel Name"
          value={newChannel}
          onChange={handleChannelNameChange}
        />
        <button
          className="mt-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleJoinChannel}
        >
          Join Channel
        </button>
      </div>

      {channels.length > 0 && ( 
        <div className="p-3">
          <ul>
            {channels.map((channel, index) => (
              <li key={index}>{channel}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Channel;
