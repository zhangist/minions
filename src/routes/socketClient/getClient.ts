import { SocketHandler } from "../SocketRouter";

const handler: SocketHandler = ({ socket, fn }) => {
  fn({
    code: 0,
    data: {
      socket: {
        id: socket.id,
        name: process.env.CLIENT_NAME,
      },
    },
    message: "Success.",
  });
};

export default handler;
