import socketIO, { Socket } from "socket.io-client";

let socket: Socket;

export const connect = () => {
    socket = socketIO.connect("http://localhost:4000");
};

export const getSocket = () => {
    return socket;
};