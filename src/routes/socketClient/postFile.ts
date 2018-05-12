import { SocketHandler } from "../SocketRouter";

const handler: SocketHandler = (data, fn, socket) => {
  fn({
    code: 0,
    data: {},
    message: "Nothing.",
  });
};

export default handler;
