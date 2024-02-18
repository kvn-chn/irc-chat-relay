"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var getUser = require('./routes/user').getUser;
var Message = require('./models/messageModel');
var Channel = require('./models/channelModel');
var getChannel = require('./routes/channel').getChannel;
var socketSetup = function (server) {
    var socketIO = require('socket.io')(server, {
        cors: {
            origin: '*',
        }
    });
    var activeUsers = new Map();
    var activeUsersOnChannels = new Map();
    socketIO.on('connection', function (socket) {
        socket.on('newUser', function (username) {
            console.log("user ".concat(username, " just connected!"));
            activeUsers.set(socket.id, username);
            activeUsersOnChannels.set(username, []);
            socket.broadcast.emit('userJoined', username);
            console.log('Current users:', activeUsers);
            // Convert activeUsers map to an array and emit it to the client
            var activeUsersArray = Array.from(activeUsers.values());
            console.log('Active users array:', activeUsersArray);
            socket.emit('activeUsers', activeUsersArray);
            socket.broadcast.emit('activeUsers', activeUsersArray);
        });
        socket.on('message', function (data) { return __awaiter(void 0, void 0, void 0, function () {
            var currentTime, hours, minutes, command, _a, userId, newUsername, activeUsersArray, channels, channelName, username, channels, channelName, username, channels, index, channel, users, receiverUsername_1, senderUsername, receiverSocketId, receiverSocket, privateMessage, message, receiverId, senderId, channelId, senderId, channelId, newData;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        currentTime = new Date();
                        hours = currentTime.getHours() < 10 ? "0".concat(currentTime.getHours()) : currentTime.getHours();
                        minutes = currentTime.getMinutes() < 10 ? "0".concat(currentTime.getMinutes()) : currentTime.getMinutes();
                        console.log('Message received:', data);
                        if (!(data.message[0] === "/")) return [3 /*break*/, 19];
                        command = data.message.split(' ')[0];
                        _a = command;
                        switch (_a) {
                            case '/nick': return [3 /*break*/, 1];
                            case '/list': return [3 /*break*/, 3];
                            case '/delete': return [3 /*break*/, 4];
                            case '/join': return [3 /*break*/, 4];
                            case '/quit': return [3 /*break*/, 5];
                            case '/users': return [3 /*break*/, 6];
                            case '/msg': return [3 /*break*/, 7];
                            case '/help': return [3 /*break*/, 16];
                        }
                        return [3 /*break*/, 17];
                    case 1: return [4 /*yield*/, getUser(data.sender)._id];
                    case 2:
                        userId = _c.sent();
                        newUsername = data.message.split(' ')[1];
                        activeUsersArray = Array.from(activeUsers.values());
                        activeUsers.set(socket.id, newUsername);
                        console.log('activeUsers : ', activeUsers);
                        socket.emit('serverResponse', 'Username updated');
                        socket.broadcast.emit('activeUsers', activeUsersArray);
                        return [3 /*break*/, 18];
                    case 3:
                        channels = Array.from(activeUsersOnChannels.keys());
                        socket.emit('serverResponse', "Channels: ".concat(channels.join(', ')));
                        return [3 /*break*/, 18];
                    case 4:
                        channelName = data.message.split(' ')[1];
                        username = activeUsers.get(socket.id);
                        channels = activeUsersOnChannels.get(username) || [];
                        channels.push(channelName);
                        activeUsersOnChannels.set(username, channels);
                        console.log('haaaaa : ', activeUsersOnChannels);
                        socket.join(channelName);
                        console.log('user has joined');
                        socket.emit('joinChannel', channelName);
                        return [3 /*break*/, 18];
                    case 5:
                        channelName = data.message.split(' ')[1] || data.channel;
                        username = activeUsers.get(socket.id);
                        channels = activeUsersOnChannels.get(username) || [];
                        index = channels.indexOf(channelName);
                        if (index !== -1) {
                            channels.splice(index, 1);
                        }
                        activeUsersOnChannels.set(username, channels);
                        console.log('hooooooo : ', activeUsersOnChannels);
                        console.log("User ".concat(username, " has quit."));
                        socket.leave(channelName);
                        socket.emit('leaveChannel', channelName);
                        return [3 /*break*/, 18];
                    case 6:
                        channel = data.message.split(' ')[1];
                        users = getUsersInChannel(channel);
                        console.log("Users in channel ".concat(channel, " :"), users);
                        socket.emit('activeUsersOnChannels', users);
                        return [3 /*break*/, 18];
                    case 7:
                        receiverUsername_1 = data.message.split(' ')[1];
                        senderUsername = data.sender;
                        receiverSocketId = (_b = Array.from(activeUsers.entries()).find(function (_a) {
                            var id = _a[0], username = _a[1];
                            return username === receiverUsername_1;
                        })) === null || _b === void 0 ? void 0 : _b[0];
                        if (!receiverSocketId) return [3 /*break*/, 14];
                        receiverSocket = socketIO.sockets.sockets.get(receiverSocketId);
                        privateMessage = data.message.split(' ').slice(2).join(' ');
                        if (!receiverSocket) return [3 /*break*/, 12];
                        message = { sender: senderUsername, message: privateMessage, receiver: receiverUsername_1, createdAt: "".concat(currentTime), channel: data.channel };
                        socket.emit('message', message);
                        receiverSocket.to(data.channel).emit('message', message);
                        return [4 /*yield*/, getUser(receiverUsername_1)];
                    case 8:
                        receiverId = _c.sent();
                        return [4 /*yield*/, getUser(data.sender)];
                    case 9:
                        senderId = _c.sent();
                        return [4 /*yield*/, getChannel(data.channel)];
                    case 10:
                        channelId = _c.sent();
                        return [4 /*yield*/, Message.create({
                                senderId: senderId._id,
                                receiverId: receiverId._id,
                                message: privateMessage,
                                channelId: channelId._id
                            })];
                    case 11:
                        _c.sent();
                        return [3 /*break*/, 13];
                    case 12:
                        socket.emit('serverResponse', 'User not found or offline');
                        _c.label = 13;
                    case 13: return [3 /*break*/, 15];
                    case 14:
                        socket.emit('serverResponse', 'User not found');
                        _c.label = 15;
                    case 15: return [3 /*break*/, 18];
                    case 16:
                        socket.emit('showCommands', 'Available commands: /nick, /list, /delete, /join, /quit, /users, /msg, /help');
                        return [3 /*break*/, 18];
                    case 17:
                        socket.emit('serverResponse', "Command doesn't exist");
                        _c.label = 18;
                    case 18: return [3 /*break*/, 23];
                    case 19: return [4 /*yield*/, getUser(data.sender)];
                    case 20:
                        senderId = _c.sent();
                        return [4 /*yield*/, getChannel(data.channel)];
                    case 21:
                        channelId = _c.sent();
                        data.createdAt = "".concat(currentTime);
                        data.receiver = null;
                        return [4 /*yield*/, Message.create({
                                senderId: senderId._id,
                                message: data.message,
                                channelId: channelId._id
                            })];
                    case 22:
                        newData = _c.sent();
                        console.log('newData :', newData);
                        socket.emit('message', data);
                        socket.to(data.channel).emit('message', data);
                        _c.label = 23;
                    case 23: return [2 /*return*/];
                }
            });
        }); });
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
            activeUsersOnChannels.delete(username);
            console.log('Active users array:', activeUsersOnChannels);
            socket.emit('activeUsers', activeUsersArray);
            socket.broadcast.emit('activeUsers', activeUsersArray);
            socket.emit('activeUsersOnChannels', activeUsersOnChannels);
            socket.broadcast.emit('activeUsersOnChannels', activeUsersOnChannels);
        });
    });
    function getUsersInChannel(channelName) {
        return Array.from(activeUsersOnChannels.entries())
            .filter(function (_a) {
            var username = _a[0], channels = _a[1];
            return channels.includes(channelName);
        })
            .map(function (_a) {
            var username = _a[0], channels = _a[1];
            return username;
        });
    }
};
module.exports = socketSetup;
