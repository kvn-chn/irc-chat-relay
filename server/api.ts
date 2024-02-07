import { Socket } from 'socket.io';
import dotenv from "dotenv";

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();

dotenv.config();
const PORT = process.env.PORT;

const http = require('http').Server(app);
const cors = require('cors');

const User = require('./models/User');

const mongoURL = process.env.MONGO_URL;
const jwtSecret = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNjY0MTUzNSwiaWF0IjoxNzA2NjQxNTM1fQ.Mj7cixwuIdP6rCNQ_6riQWoXa6WkNPYhoXmXwo4ptVs';

mongoose.connect(mongoURL).then(function () {
  console.log('Connected to MongoDB');
});

app.use(express.json());

app.use(cors({
  origin: '*',
  credentials: true
}));

interface Data {
  id: string;
  sender?: string;
  receiver?: string;
  message: string;
  time: string;
  isPrivate: boolean;
}

const socketIO: Socket = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

const activeUsers = new Map<string, string>();

socketIO.on('connection', (socket: Socket) => {
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

  socket.on('message', (data: Data) => {
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
              const message: Data = { id: data.id, sender: senderUsername, message: privateMessage, receiver: receiverUsername, time: time, isPrivate: true };
              socket.emit('message', message);

              receiverSocket.emit('message', message);
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

app.post('/register',async (req, res) => {
  const { username, password } = req.body;
  try {
    const createdUser = await User.create({ username, password });
    jwt.sign({ userId: createdUser._id, username }, jwtSecret, {} ,(err, token) => {
    if (err) throw err;
    res.cookie('token', token).status(201).json({
      id: createdUser._id,
    });
  });
  } catch (err) {
    if (err) throw err;
    res.status(500).json({ error: 'Failed to create user' });
  }
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});