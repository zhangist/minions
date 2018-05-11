import * as sio from "socket.io";
import { withSocketServer } from "../SocketRouter";

import getClients from "./getClients";
import postFile from "./postFile";

export default (socketServer: sio.Server) => {
  socketServer.on("connection", socket => {
    // log on client/console connect to server
    console.log("connection: " + socket.id);

    socket.on("disconnect", () => {
      console.log("disconnect: " + socket.id);
    });
    socket.on("get_clients", withSocketServer(socketServer, getClients));
    socket.on("post_file", withSocketServer(socketServer, postFile));
  });
};
