import * as sio from "socket.io";
import * as url from "url";
import {
  withServerSocket,
  Rooms,
  PostClientData,
  PostConsoleData,
} from "../SocketRouter";
import getClients from "./getClients";
import postFiles from "./postFiles";
import postPlayFile from "./postPlayFile";
import postPlayStart from "./postPlayStart";

export default (server: sio.Server) => {
  server.on("connection", socket => {
    // log on client/console connect to server
    console.log("connection: " + socket.id);

    // join room
    const urlObj = url.parse(socket.handshake.url, true);
    let room = Rooms.Client;
    if (urlObj.query.room && urlObj.query.room === Rooms.Console) {
      room = Rooms.Console;
    }
    socket.join(room, () => {
      const socketObj = {
        id: socket.id,
      };
      // broadcast
      if (room === Rooms.Console) {
        server
          .to(Rooms.Console)
          .emit("post_console", { console: socketObj } as PostConsoleData);
      } else {
        server
          .to(Rooms.Console)
          .emit("post_client", { client: socketObj } as PostClientData);
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnect: " + socket.id);

      const socketObj = {
        id: socket.id,
      };
      // broadcast
      server.to(Rooms.Console).emit("delete_socket", { socket: socketObj });
    });

    // from console
    socket.on("get_clients", withServerSocket(server, socket, getClients));
    socket.on("post_files", withServerSocket(server, socket, postFiles));
    socket.on("post_play_file", withServerSocket(server, socket, postPlayFile));
    socket.on("post_play_start", withServerSocket(server, socket, postPlayStart));
    socket.on(
      "get_rooms",
      withServerSocket(server, socket, ctx => {
        console.log(ctx.socket.rooms);
      }),
    );

    // from client
    socket.on(
      "put_client",
      withServerSocket(server, socket, ctx => {
        // broadcast
        server
          .to(Rooms.Console)
          .emit("put_client", { socket: ctx.data.socket });
      }),
    );
  });
};
