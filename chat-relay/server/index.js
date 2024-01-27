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

const activeUsers = new Map();

socketIO.on('connection', (socket) => {
  const command = (cmd) => {

  }

  socket.on('newUser', (username) => {
    console.log(`user ${username} just connected!`);

    activeUsers.set(socket.id, username);
    socket.broadcast.emit('userJoined', username );
    console.log('Current users:', activeUsers);
    socket.broadcast.emit('activeUsers', activeUsers.get(socket.id, username));
  });

  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    if (msg.message[0] === "/") { 

    }
    else socket.broadcast.emit('message', msg);
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  })


  socket.on('stopTyping', (username) => {
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