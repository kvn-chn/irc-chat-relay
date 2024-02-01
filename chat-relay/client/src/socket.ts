import socketIO, { Socket } from "socket.io-client";

let socket: Socket;
let isConnect = false;

export const connect = () => {
    if (isConnect) return;

    socket = socketIO("http://localhost:4000");
    isConnect = true;
};

export const disconnect = () => {
    if (!isConnect || socket == undefined) return;
    socket.disconnect();
    isConnect = false;
}

export const getSocket = () => {
    return socket;
};

export const isConnected = () => {
    return isConnect;
}