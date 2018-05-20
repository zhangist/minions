import * as sio from "socket.io";
import { AudioContext } from "web-audio-api";

export enum Rooms {
  Console = "console",
  Client = "client",
}

export interface File {
  filename: string;
  url?: string;
}

export interface Client {
  id: string;
  name?: string;
  files?: File[];
}

export interface Audio {
  context: AudioContext;
  bufferNode?: AudioBufferSourceNode;
}

export interface SocketResponseParams {
  code: number;
  data?: any;
  message?: string;
}

export type SocketResponse = (params: SocketResponseParams) => void;

export interface Context {
  socket: SocketIOClient.Socket;
  data: any;
  fn: SocketResponse;
  audio?: Audio;
}

export interface ServerContext {
  server: sio.Server;
  socket: sio.Socket;
  data: any;
  fn: SocketResponse;
}

export type SocketHandler = (ctx: Context) => void;

export type ServerSocketHandler = (ctx: ServerContext) => void;

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

export interface PostClientParams {
  client: Client;
}
export interface PostClientData {
  client: Client;
}
export type PostClientHandler = (
  data: PostClientData,
) => void;

export interface PostConsoleParams {
  console: Client;
}
export interface PostConsoleData {
  console: Client;
}
export type PostConsoleHandler = (
  data: PostConsoleData,
) => void;
