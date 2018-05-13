import * as sio from "socket.io";

export enum Rooms {
  Console = "console",
  Client = "client",
}

export interface FileProps {
  filename: string;
  url?: string;
}

export interface ClientProps {
  id: string;
  name?: string;
  files?: FileProps[];
}

export interface SocketResponseParams {
  code: number;
  data?: any;
  message?: string;
}

export type SocketResponse = (params: SocketResponseParams) => void;

export interface ContextProps {
  socket: SocketIOClient.Socket;
  data: any;
  fn: SocketResponse;
}

export interface ContextServerProps {
  server: sio.Server;
  socket: sio.Socket;
  data: any;
  fn: SocketResponse;
}

export type SocketHandler = (ctx: ContextProps) => void;

export type ServerSocketHandler = (ctx: ContextServerProps) => void;

export const withSocket = (
  socket: SocketIOClient.Socket,
  route: SocketHandler,
) => {
  return (data: any, fn: SocketResponse) => {
    route({ data, fn, socket });
  };
};

export const withServerSocket = (
  server: sio.Server,
  socket: sio.Socket,
  route: ServerSocketHandler,
) => {
  return (data: any, fn: SocketResponse) => {
    route({ data, fn, server, socket });
  };
};
