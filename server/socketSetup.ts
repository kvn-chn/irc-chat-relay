import { Socket } from 'socket.io';
import { Server as HttpServer, get } from 'http';
const { getUser } = require('./routes/user');
const Message = require('./models/messageModel');
const Channel = require('./models/channelModel');
const { getChannel } = require('./routes/channel');

interface Data {
  sender?: string;
  receiver?: string | null;
  message: string;
  createdAt: string;
  channel: string;
}

const socketSetup = (server: HttpServer) => {
    const socketIO: Socket = require('socket.io')(server, {
      cors: {
        origin: '*',
      }
    });

    const activeUsers = new Map<string, string>();

    socketIO.on('connection', (socket: Socket) => {    
      socket.on('newUser', function (username) {
        console.log("user ".concat(username, " just connected!"));
        activeUsers.set(socket.id, username);
        socket.broadcast.emit('userJoined', username);
        console.log('Current users:', activeUsers);
    
        // Convert activeUsers map to an array and emit it to the client
        const activeUsersArray = Array.from(activeUsers.values());
        console.log('Active users array:', activeUsersArray);
        socket.emit('activeUsers', activeUsersArray);
        socket.broadcast.emit('activeUsers', activeUsersArray);
      });
    
      socket.on('message', async (data: Data) => {
        const currentTime = new Date();
          
        const hours = currentTime.getHours() < 10 ? `0${currentTime.getHours()}` : currentTime.getHours(); 
        const minutes = currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes();
    
        console.log('Message received:', data);
    
        if (data.message[0] === "/") { 
          const command = data.message.split(' ')[0];
    
          switch (command) {
            case '/nick':


              /* const userId = data.id;
              const newUsername = data.message.split(' ')[1];
              const activeUsersArray = Array.from(activeUsers.values());
    
              activeUsers.set(userId, newUsername);
    
              socket.emit('serverResponse', 'Username updated');
              socket.broadcast.emit('activeUsers', activeUsersArray); */
              break;
    
            case '/list':
            case '/delete':
            case '/join':
              const receiveChannel = data.message.split(' ')[1];
              
              socket.join(receiveChannel);
              console.log('user has joined');
              socket.emit('joinChannel', receiveChannel);
              break;

            case '/quit':
              const username = activeUsers.get(socket.id);
              const channelName = data.message.split(' ')[1] || data.channel;

              console.log(`User ${username} has quit.`);
              socket.leave(channelName);
              socket.emit('leaveChannel', channelName);
              break;

            case '/users':
              break;

            case '/msg':
              const receiverUsername = data.message.split(' ')[1];

              const senderUsername = data.sender;
              const receiverSocketId = Array.from(activeUsers.entries()).find(([id, username]) => username === receiverUsername)?.[0];
            
              if (receiverSocketId) {
                const receiverSocket = socketIO.sockets.sockets.get(receiverSocketId);
                const privateMessage = data.message.split(' ').slice(2).join(' ');
            
                if (receiverSocket) {
                  const message: Data = { sender: senderUsername, message: privateMessage, receiver: receiverUsername, createdAt: `${currentTime}`, channel: data.channel};
                  socket.emit('message', message);
                  receiverSocket.to(data.channel).emit('message', message);

                  const receiverId = await getUser(receiverUsername)._id;
                  const senderId = await getUser(senderUsername)._id;
                  const channelId = await getChannel(data.channel)._id;

                  await Message.create({
                    senderId,
                    receiverId,
                    message:privateMessage,
                    channelId
                  })

                } else {
                  socket.emit('serverResponse', 'User not found or offline');
                }
              } else {
                socket.emit('serverResponse', 'User not found');
              }
              break;
    
            case '/help':
              break;
              
            default:
              socket.emit('serverResponse', "Command doesn't exist");
          }
        }
        else {       
          const senderId = await getUser(data.sender);
          const channelId = await getChannel(data.channel);
          data.createdAt = `${currentTime}`;
          data.receiver = null;

          const newData = await Message.create({
              senderId: senderId._id,
              message:data.message,
              channelId: channelId._id
          });

          console.log('newData :',newData);

          socket.emit('message', data);
          socket.to(data.channel).emit('message', data);
          //socket.to(data.channel).broadcast.emit('message', data);
        }
      });
    
      socket.on('typing', (username: string) => {
        socket.broadcast.emit('typing', username);
      });
    
      socket.on('stopTyping', (username: string) => {
        socket.broadcast.emit('stopTyping', username);
      });
      
      socket.on('disconnect', function () {
        const username = activeUsers.get(socket.id);
        console.log("user ".concat(username, " disconnected"));
        activeUsers.delete(socket.id);
        console.log('Current users:', activeUsers);
        socket.emit('userLeft', username);
        const activeUsersArray = Array.from(activeUsers.values());
        socket.emit('activeUsers', activeUsersArray);
        socket.broadcast.emit('activeUsers', activeUsersArray);
      });
    });
}

module.exports = socketSetup;