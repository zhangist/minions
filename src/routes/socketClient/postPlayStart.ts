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

  if (!audio.bufferNode) {
    fn({
      code: 1,
      data: {},
      message: "Audio buffer node error.",
    });
    return;
  }

  let startError;
  try {
    audio.bufferNode.start(0);
    console.log("Playing...");
  } catch (e) {
    startError = e;
    fn({
      code: 1,
      data: {},
      message: "Start error.",
    });
  }

  if (!startError) {
    fn({
      code: 0,
      data: {},
      message: "Start.",
    });
  }
};

export default handler;
