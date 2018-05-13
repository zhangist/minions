import { SocketHandler } from "../SocketRouter";

const handler: SocketHandler = ({ fn }) => {
  fn({
    code: 0,
    data: {},
    message: "Nothing.",
  });
};

export default handler;
