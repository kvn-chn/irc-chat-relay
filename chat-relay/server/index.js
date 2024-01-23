const express = require('express');
const app = express();
const PORT = 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());

const socketIO = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});

const activeUsers = new Map(); // Create a Map to store the active users and their socket ids

socketIO.on('connection', (socket) => {
    socket.on('newUser', (username) => {
      console.log(`user ${username} just connected!`);
      // Store the username with the socket id in a Map
      activeUsers.set(socket.id, username);
      socket.broadcast.emit('userJoined', { [socket.id]: username } );
    });
  
    socket.on('disconnect', () => {
      const username = activeUsers.get(socket.id); // Retrieve the username associated with the socket id
      console.log(`user ${username} disconnected`);
      // Remove the username associated with the socket id when the user disconnects
      activeUsers.delete(socket.id);
    });
  });

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});