import * as fs from "fs";
import * as path from "path";
import { SocketHandler } from "../SocketRouter";

const handler: SocketHandler = ({ audio, data, fn }) => {
  if (!audio) {
    fn({
      code: 1,
      data: {},
      message: "AudioContext error.",
    });
    return;
  }

  if (!data.filename) {
    fn({
      code: 1,
      data: {},
      message: "Filename is required.",
    });
    return;
  }

  if (!process.env.CLIENT_FILES_DIR) {
    fn({
      code: 1,
      data: {},
      message: "Files env dir is missing.",
    });
    return;
  }

  const filePath = path.resolve(process.env.CLIENT_FILES_DIR, data.filename);
  if (!fs.existsSync(filePath)) {
    // file not found
    fn({
      code: 1,
      data: {},
      message: "File not found.",
    });
    return;
  }

  fs.readFile(filePath, (err, buffer) => {
    if (err) {
      // read file error
      fn({
        code: 1,
        data: {},
        message: "Can't load file.",
      });
      return;
    }

    audio.context.decodeAudioData(
      buffer,
      audioBuffer => {
        const bufferNode = audio.context.createBufferSource();
        bufferNode.connect(audio.context.destination);
        bufferNode.buffer = audioBuffer;
        bufferNode.loop = false;
        audio.bufferNode = bufferNode;
        // file prepare success
        fn({
          code: 0,
          data: {
            filename: data.filename,
          },
          message: "File is ready.",
        });
      },
      err => {
        if (err) {
          // error
          fn({
            code: 1,
            data: {},
            message: "Error.",
          });
          return;
        }
      },
    );
  });
};

export default handler;
