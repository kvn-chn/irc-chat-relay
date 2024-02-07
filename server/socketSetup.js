"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketSetup = function (server) {
    var socketIO = require('socket.io')(server, {
        cors: {
            origin: '*',
        }
    });
    var activeUsers = new Map();
    socketIO.on('connection', function (socket) {
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
                var command = data.message.split(' ')[0];
                switch (command) {
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
                var currentTime_1 = new Date();
                var hours_1 = currentTime_1.getHours() < 10 ? "0".concat(currentTime_1.getHours()) : currentTime_1.getHours();
                var minutes_1 = currentTime_1.getMinutes() < 10 ? "0".concat(currentTime_1.getMinutes()) : currentTime_1.getMinutes();
                data.time = "".concat(hours_1, ":").concat(minutes_1);
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
            console.log("user ".concat(username, " disconnected"));
            activeUsers.delete(socket.id);
            console.log('Current users:', activeUsers);
            socket.emit('userLeft', username);
            var activeUsersArray = Array.from(activeUsers.values());
            socket.emit('activeUsers', activeUsersArray);
            socket.broadcast.emit('activeUsers', activeUsersArray);
        });
    });
};
module.exports = socketSetup;
