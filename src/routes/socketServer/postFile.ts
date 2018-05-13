import { ServerSocketHandler } from "../SocketRouter";

const handler: ServerSocketHandler = ({ fn }) => {
  fn({
    code: 0,
    data: {},
    message: "Nothing.",
  });
};

export default handler;
