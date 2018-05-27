import * as fs from "fs";
import { ServerSocketHandler } from "../SocketRouter";

const handler: ServerSocketHandler = ({ fn, server }) => {
  if (process.env.SERVER_FILES_DIR) {
    let files;
    let readFilesError;
    try {
      files = fs.readdirSync(process.env.SERVER_FILES_DIR);
    } catch (e) {
      readFilesError = e;
    }

    if (readFilesError) {
      console.log(readFilesError);
      fn({
        code: 1,
        message: "Read files error.",
      });
    } else {
      fn({
        code: 0,
        data: {
          files,
        },
        message: "Success.",
      });
    }
  } else {
    fn({
      code: 1,
      message: "Files dir missing.",
    });
  }
};

export default handler;
