import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Channel = () => {
  const [channels, setChannels] = useState([]);
  const [newChannel, setNewChannel] = useState('');

  const handleJoinChannel = () => {
    const channelName = newChannel.trim();

    if (channelName === '') {
      toast.error('Please enter a channel name');
    } else if (channels.includes(channelName)) {
      toast.error(`${channelName} already exists`);
    } else {
      setChannels([...channels, channelName]);
      setNewChannel('');
    }
  };

  const handleChannelNameChange = (e) => {
    setNewChannel(e.target.value);
  };

  return (
    <div className='flex flex-col'>
      <div className='flex justify-center text-3xl font-bold'>Channels</div>
      <input
        className="mt-7 w-full p-2 border border-gray-300 rounded"
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
      {channels.length > 0 && (
        <div className='p-3'>
          <h2>Channels Created:</h2>
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