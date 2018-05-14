import * as fs from "fs";
import * as path from "path";
import {
  FileProps,
  ClientProps,
  ServerSocketHandler,
  SocketResponseParams,
} from "../SocketRouter";

const handler: ServerSocketHandler = ({ data, fn, server, socket }) => {
  const to: ClientProps[] = data.to || [];
  const files: FileProps[] = data.files || [];
  if (to.length === 0) {
    fn({
      code: 0,
      data: {},
      message: "Field 'to' is required.",
    });
    return;
  }

  if (files.length === 0) {
    fn({
      code: 0,
      data: {},
      message: "Field 'files' is required.",
    });
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.url) {
      if (
        fs.existsSync(
          path.resolve(process.env.SERVER_FILES_DIR || "", file.filename),
        )
      ) {
        file.url =
          process.env.SERVER_HOST +
          ":" +
          process.env.SERVER_PORT +
          "/file/" +
          encodeURIComponent(file.filename);
      }
    }
  }

  const result: SocketResponseParams[] = [];
  let count = 0;

  for (let i = 0; i < to.length; i++) {
    const key = to[i].id;
    const client = server.sockets.sockets[key];
    if (client) {
      client.emit("post_files", { files }, (res: SocketResponseParams) => {
        count = count + 1;
        result.push(res);
        if (count === to.length) {
          fn({
            code: 0,
            data: result,
            message: "Send files finished.",
          });
        }
      });
    } else {
      socket.emit("delete_client", { socket: { id: key } });
    }
  }
};

export default handler;
