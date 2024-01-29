const express = require('express');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const socketIO = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

const activeUsers = new Map<string, string>();

socketIO.on('connection', (socket) => {
  const command = (cmd) => {

  }

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

  socket.on('message', (data: { id: string, sender?: string, receiver?: string, message: string, time: string }) => {
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

        case '/list':
        case '/delete':
        case '/join':
        case '/quit':
        case '/users':
        case '/msg':
        case '/help':
        default:
      }
    }
    else {
      const currentTime = new Date();
      
      const hours = currentTime.getHours() < 10 ? `0${currentTime.getHours()}` : currentTime.getHours(); 
      const minutes = currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes();

      data.time = `${hours}h${minutes}`; 
      data.sender = activeUsers.get(data.id);

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

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});