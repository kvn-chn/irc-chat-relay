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

  socket.on('newUser', (username: string) => {
    console.log(`user ${username} just connected!`);

    activeUsers.set(socket.id, username);
    socket.broadcast.emit('userJoined', username );
    console.log('Current users:', activeUsers);
    socket.broadcast.emit('activeUsers', activeUsers.get(socket.id));
  });

  socket.on('message', (msg: { id: string, message: string }) => {
    console.log('Message received:', msg);

    if (msg.message[0] === "/") { 
      const command = msg.message.split(' ')[0];

      switch (command) {
        case '/nick':
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
    else socket.broadcast.emit('message', msg);
  });

  socket.on('typing', (username: string) => {
    socket.broadcast.emit('typing', username);
  })


  socket.on('stopTyping', (username: string) => {
    socket.broadcast.emit('stopTyping', username);
  })
  
  socket.on('disconnect', () => {
    const username = activeUsers.get(socket.id);
    console.log(`user ${username} disconnected`);

    activeUsers.delete(socket.id);
    console.log('Current users:', activeUsers);

    socket.broadcast.emit('userLeft', username );
  });
  
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});