import { Socket } from 'socket.io';
import { Server as HttpServer, get } from 'http';
const { getUser } = require('./routes/user');
const Message = require('./models/messageModel');
const Channel = require('./models/channelModel');
const { getChannel } = require('./routes/channel');

interface Data {
  id: string;
  sender?: string;
  receiver?: string;
  message: string;
  time: string;
  isPrivate: boolean;
  channel:string;
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
              const userId = data.id;
              const newUsername = data.message.split(' ')[1];
              const activeUsersArray = Array.from(activeUsers.values());
    
              activeUsers.set(userId, newUsername);
    
              socket.emit('serverResponse', 'Username updated');
              socket.broadcast.emit('activeUsers', activeUsersArray);
              break;
    
            case '/list':
            case '/delete':
            case '/join':
            case '/quit':
            case '/users':
            case '/msg':
              const receiverUsername = data.message.split(' ')[1];

              const senderUsername = activeUsers.get(data.id);
              const receiverSocketId = Array.from(activeUsers.entries()).find(([id, username]) => username === receiverUsername)?.[0];
            
              if (receiverSocketId) {
                const receiverSocket = socketIO.sockets.sockets.get(receiverSocketId);
                const privateMessage = data.message.split(' ').slice(2).join(' ');
            
                if (receiverSocket) {
                  const time = `${hours}:${minutes}`;
                  const message: Data = { id: data.id, sender: senderUsername, message: privateMessage, receiver: receiverUsername, time ,isPrivate: true };
                  socket.emit('message', message);

                  receiverSocket.emit('message', message);


                  const receiverId = await getUser(receiverUsername);
                  const senderId = await getUser(senderUsername);

                  await Message.create({
                    senderId,
                    receiverId,
                    message:privateMessage,
                    isPrivate:true,
                  })

                } else {
                  socket.emit('serverResponse', 'User not found or offline');
                }
              } else {
                socket.emit('serverResponse', 'User not found');
              }
              break;
    
            case '/help':
            default:
              socket.emit('serverResponse', "Command doesn't exist");
          }
        }
        else {
          const currentTime = new Date();
          
          const hours = currentTime.getHours() < 10 ? `0${currentTime.getHours()}` : currentTime.getHours(); 
          const minutes = currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes();
    
          data.time = `${hours}:${minutes}`; 
          data.sender = activeUsers.get(data.id);
          data.isPrivate = false;

          console.log('typeOf :',typeof(data.id));
          
          const senderId = await getUser(data.sender);
          console.log('userId : ', senderId._id);
          console.log('data.channel : ', data.channel);
          const channelId = await getChannel(data.channel);
          console.log('channelId : ', channelId._id);

          const newData = await Message.create({
              senderId:senderId._id,
              message:data.message,
              isPrivate:data.isPrivate,
              channel:channelId._id,
          });

          console.log('newData :',newData);
    
          socket.emit('message', data);
          socket.broadcast.emit('message', data);
        }
      });
    
      socket.on('typing', (username: string) => {
        socket.broadcast.emit('typing', username);
      })
    
      socket.on('stopTyping', (username: string) => {
        socket.broadcast.emit('stopTyping', username);
      })
      
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