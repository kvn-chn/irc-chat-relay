"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 4000;

const http = require('http').Server(app);
const cors = require('cors');

const User = require('./models/User');

const mongoURL = "mongodb+srv://admin:admin@jsf-600-chatrelay.ndsyhzz.mongodb.net/?retryWrites=true&w=majority";
const jwtSecret = 'eyJhbGciOiJIUzI1NiJ9';

mongoose.connect(mongoURL).then(function () {
  console.log('Connected to MongoDB');
});

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json());

app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


const socketIO = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:5173',
  }
});

const activeUsers = new Map();
socketIO.on('connection', function (socket) {
    var command = function (cmd) {
    };
    socket.on('newUser', function (username) {
        console.log("user ".concat(username, " just connected!"));
        activeUsers.set(socket.id, username);
        socket.broadcast.emit('userJoined', username);
        console.log('Current users:', activeUsers);
        // Convert activeUsers map to an array and emit it to the client
        var activeUsersArray = Array.from(activeUsers.values());
        console.log('Active users array:', activeUsersArray);
        socket.emit('activeUsers', activeUsersArray);
        socket.broadcast.emit('activeUsers', activeUsersArray);
    });
    socket.on('message', function (data) {
        var _a;
        var currentTime = new Date();
        var hours = currentTime.getHours() < 10 ? "0".concat(currentTime.getHours()) : currentTime.getHours();
        var minutes = currentTime.getMinutes() < 10 ? "0".concat(currentTime.getMinutes()) : currentTime.getMinutes();
        console.log('Message received:', data);
        if (data.message[0] === "/") {
            var command_1 = data.message.split(' ')[0];
            switch (command_1) {
                case '/nick':
                    var userId = data.id;
                    var newUsername = data.message.split(' ')[1];
                    var activeUsersArray = Array.from(activeUsers.values());
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
                    var receiverUsername_1 = data.message.split(' ')[1];
                    var senderUsername = activeUsers.get(data.id);
                    var receiverSocketId = (_a = Array.from(activeUsers.entries()).find(function (_a) {
                        var id = _a[0], username = _a[1];
                        return username === receiverUsername_1;
                    })) === null || _a === void 0 ? void 0 : _a[0];
                    if (receiverSocketId) {
                        var receiverSocket = socketIO.sockets.sockets.get(receiverSocketId);
                        var privateMessage = data.message.split(' ').slice(2).join(' ');
                        if (receiverSocket) {
                            var time = "".concat(hours, ":").concat(minutes);
                            var message = { id: data.id, sender: senderUsername, message: privateMessage, receiver: receiverUsername_1, time: time, isPrivate: true };
                            socket.emit('message', message);
                            receiverSocket.emit('message', message);
                        }
                        else {
                            socket.emit('serverResponse', 'User not found or offline');
                        }
                    }
                    else {
                        socket.emit('serverResponse', 'User not found');
                    }
                    break;
                case '/help':
                default:
                    socket.emit('serverResponse', "Command doesn't exist");
            }
        }
        else {
            data.time = "".concat(hours, ":").concat(minutes);
            data.sender = activeUsers.get(data.id);
            data.isPrivate = false;
            socket.emit('message', data);
            socket.broadcast.emit('message', data);
        }
    });
    socket.on('typing', function (username) {
        socket.broadcast.emit('typing', username);
    });
    socket.on('stopTyping', function (username) {
        socket.broadcast.emit('stopTyping', username);
    });
    socket.on('disconnect', function () {
        var username = activeUsers.get(socket.id);
        if (username) {
            var activeUsersArray = Array.from(activeUsers.values());
            console.log("user ".concat(username, " disconnected"));
            activeUsers.delete(socket.id);
            console.log('Current users:', activeUsers);
            socket.emit('userLeft', username);
            socket.emit('activeUsers', activeUsersArray);
            socket.broadcast.emit('activeUsers', activeUsersArray);
        }
  });
});

app.get('/profile', (req,res) => {
  const token = req.cookies?.token;
  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json('no token');
  }
});

app.post('/register',async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, bcryptSalt);
    const createdUser = await User.create({ 
      username, 
      password: hashedPassword 
    });
    jwt.sign({ userId: createdUser._id, username }, jwtSecret, {} ,(err, token) => {
    if (err) throw err;
    res.cookie('token', token, {sameSite:'none', secure:true}).status(201).json({
      id: createdUser._id,
    });
  });
  } catch (err) {
    if (err) throw err;
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({username});
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      } else {
        jwt.sign({ userId: user._id, username }, jwtSecret, {}, (err, token) => {
          if (err) throw err;
          res.cookie('token', token, {sameSite:'none', secure:true}).status(200).json({
            id: user._id,
          });
        });
      }
    } else {
      res.status(401).json({ error: 'User not found' });
    }
  } catch (err) {
    if (err) throw err;
    res.status(500).json({ error: 'Failed to log in' });
  }
});

app.post('/logout', (req,res) => {
  res.cookie('token', '',{sameSite:'none', secure:true}).json('ok')
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});