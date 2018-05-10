import * as sio from "socket.io";

export type SocketResponseFunctionParams = {
    code: number;
    data?: any;
    message?: string;
};
export type SocketResponseFunction = (params: SocketResponseFunctionParams) => void;
export type SocketClientHandler = (socket: SocketIOClient.Socket, data: any, fn: SocketResponseFunction) => void;
export type SocketServerHandler = (socket: sio.Server, data: any, fn: SocketResponseFunction) => void;
export const withSocketClient = (socket: SocketIOClient.Socket, route: SocketClientHandler) => {
    return (data: any, fn: SocketResponseFunction) => {
        route(socket, data, fn);
    }
};
export const withSocketServer = (socket: sio.Server, route: SocketServerHandler) => {
    return (data: any, fn: SocketResponseFunction) => {
        route(socket, data, fn);
    }
};
