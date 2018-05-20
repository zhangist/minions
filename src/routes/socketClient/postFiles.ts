import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import { SocketHandler, File } from "../SocketRouter";

const handler: SocketHandler = ({ data, fn }) => {
  const files: File[] = data.files || [];
  const filesLength = files.length;
  const filesSuccess: File[] = [];
  const filesError: File[] = [];

  console.log(files);
  if (process.env.CLIENT_FILES_DIR) {
    for (let i = 0; i < filesLength; i++) {
      const file = files[i];
      const index = i;
      if (!file.url) {
        filesError.push(file);
      } else {
        const fileStream = fs.createWriteStream(
          path.resolve(process.env.CLIENT_FILES_DIR, file.filename),
        );
        const request = http.get(file.url, response => {
          response.pipe(fileStream);
          fileStream.on("close", () => {
            console.log("file stream close");
          });
          response.on("end", () => {
            console.log("response end");
            filesSuccess.push(file);
            if (index === filesLength) {
              fn({
                code: 0,
                data: { filesSuccess, filesError },
                message: "Files download finished.",
              });
            }
          });
        });
        request.on("error", e => {
          filesError.push(file);
          if (index === filesLength) {
            fn({
              code: 0,
              data: { filesSuccess, filesError },
              message: "Files download finished.",
            });
          }
        });
      }
    }
  } else {
    fn({
      code: 1,
      data: { filesSuccess, filesError: files },
      message: "Save path missing.",
    });
  }
};

export default handler;
