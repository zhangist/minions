import * as fse from "fs-extra";
import * as path from "path";
import * as sioClient from "socket.io-client";
import socketClientRoutes from "./routes/socketClient";

// set env
import "./config/env";
process.env.CLIENT_FILES_DIR =
  process.env.CLIENT_FILES_DIR || path.resolve(__dirname, "../files/client");
process.env.TEMP_DIR =
  process.env.TEMP_DIR || path.resolve(__dirname, "../temp");

// init dir
if (!fse.pathExistsSync(process.env.CLIENT_FILES_DIR)) {
  try {
    fse.mkdirsSync(process.env.CLIENT_FILES_DIR);
  } catch (e) {
    console.log(e);
  }
}
if (!fse.pathExistsSync(process.env.TEMP_DIR)) {
  try {
    fse.mkdirsSync(process.env.TEMP_DIR);
  } catch (e) {
    console.log(e);
  }
}

const socketClient = sioClient(
  process.env.SERVER_HOST + ":" + process.env.SERVER_PORT + "?room=client",
);
socketClientRoutes(socketClient);
