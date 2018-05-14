import { withSocket } from "../SocketRouter";

import postFiles from "./postFiles";

export default (socket: SocketIOClient.Socket) => {
  socket.on("connect", () => {
    // log on connect
    console.log("connected");

    socket.emit("put_client", {
      socket: {
        id: socket.id,
        name: process.env.CLIENT_NAME,
      },
    });
  });
  socket.on("post_files", withSocket(socket, postFiles));
  socket.on(
    "get_client",
    withSocket(socket, ({ fn }) => {
      fn({
        code: 0,
        data: {
          socket: {
            id: socket.id,
            name: process.env.CLIENT_NAME,
          },
        },
      });
    }),
  );
};
