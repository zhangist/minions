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
    fn = fn || (() => {});
    route({ data, fn, socket });
  };
};

export const withAudioSocket = (
  audio: Audio,
  socket: SocketIOClient.Socket,
  route: SocketHandler,
) => {
  return (data: any, fn: SocketResponse) => {
    fn = fn || (() => {});
    route({ data, fn, socket, audio });
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

// post_files
export interface PostFilesResponseParams extends SocketResponseParams {}
export interface PostFilesData {
  clients: Client[];
  files: File[];
}

// post_client
export interface PostClientResponseParams extends SocketResponseParams {}
export interface PostClientData {
  client: Client;
}

// post_console
export interface PostConsoleResponseParams extends SocketResponseParams {}
export interface PostConsoleData {
  console: Client;
}

// post_play_file
export interface PostPlayFileResponseParams extends SocketResponseParams {}
export interface PostPlayFileData {
  clients: Client[];
  file: File;
}

// post_play_start
export interface PostPlayStartResponseParams extends SocketResponseParams {}
export interface PostPlayStartData {
  clients: Client[];
  file?: File;
}
