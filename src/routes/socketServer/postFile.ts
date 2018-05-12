import { ServerSocketHandler } from "../SocketRouter";

const handler: ServerSocketHandler = (data, fn, server, socket) => {
  fn({
    code: 0,
    data: {},
    message: "Nothing.",
  });
};

export default handler;
