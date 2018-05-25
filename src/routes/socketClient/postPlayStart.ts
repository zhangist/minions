import * as fs from "fs";
import * as path from "path";
import { SocketHandler, PostPlayStartData } from "../SocketRouter";

const handler: SocketHandler = ({ audio, data, fn }) => {
  const postPlayStartData: PostPlayStartData = data;
  if (!audio) {
    fn({
      code: 1,
      data: {},
      message: "Audio context error.",
    });
    return;
  }

  if (!audio.bufferNode) {
    if (postPlayStartData.file) {
      if (!process.env.CLIENT_FILES_DIR) {
        fn({
          code: 1,
          data: {},
          message: "Files env dir is missing.",
        });
        return;
      }

      const filePath = path.resolve(
        process.env.CLIENT_FILES_DIR,
        data.file.filename,
      );
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
            audio.bufferNode.start(0);
            fn({
              code: 0,
              data: {
                filename: data.filename,
              },
              message: "Palying.",
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
    } else {
      fn({
        code: 1,
        data: {},
        message: "Audio buffer node error.",
      });
      return;
    }
  } else {
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
  }
};

export default handler;
