import { SocketHandler } from "../SocketRouter";

const handler: SocketHandler = ({ audio, data, fn }) => {
  if (!audio) {
    fn({
      code: 1,
      data: {},
      message: "Audio context error.",
    });
    return;
  }
};

export default handler;
