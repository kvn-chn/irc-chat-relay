var express = require('express');
var app = express();
var PORT = 4000;
var http = require('http').Server(app);
var cors = require('cors');
app.use(cors());
var socketIO = require('socket.io')(http, {
    cors: {
        origin: '*',
    }
});
var activeUsers = new Map();

socketIO.on('connection', function (socket) {
    var command = function (cmd) {
    };

    socket.on('newUser', function (username) {
      console.log("user ".concat(username, " just connected!"));
      activeUsers.set(socket.id, username);
      socket.broadcast.emit('userJoined', username);
      console.log('Current users:', activeUsers);
      // Convert activeUsers map to an array and emit it to the client
      const activeUsersArray = Array.from(activeUsers.values());
      socket.emit('activeUsers', activeUsersArray);
      // Alternatively, if you want to broadcast to all clients including the sender
      // io.emit('activeUsers', activeUsersArray);
    });

    socket.on('message', function (data) {
        console.log('Message received:', data);
        if (data.message[0] === "/") {
            var command_1 = data.message.split(' ')[0];
            switch (command_1) {
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
        else {
            data.sender = activeUsers.get(data.id);

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
        console.log("user ".concat(username, " disconnected"));
        activeUsers.delete(socket.id);
        console.log('Current users:', activeUsers);
        socket.broadcast.emit('userLeft', username);
    });
});
http.listen(PORT, function () {
    console.log("Server listening on ".concat(PORT));
});
