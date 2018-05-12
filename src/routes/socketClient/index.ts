import { withSocket } from "../SocketRouter";

import postFile from "./postFile";

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
  socket.on("post_file", withSocket(socket, postFile));
  socket.on(
    "get_client",
    withSocket(socket, (data, fn) => {
      console.log(111);
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
