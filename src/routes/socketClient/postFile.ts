import { SocketClientHandler } from "../SocketRouter";

const handler: SocketClientHandler = (socket, data, fn) => {
  fn({
    code: 0,
    data: {},
    message: "Nothing.",
  });
};

export default handler;
