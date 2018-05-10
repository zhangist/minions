import * as fse from "fs-extra";
import * as path from "path";
import * as sioClient from "socket.io-client";

// set env
import "./config/env";
process.env.CLIENT_FILES_DIR = process.env.CLIENT_FILES_DIR || path.resolve(__dirname, "../files/client");
process.env.TEMP_DIR = process.env.TEMP_DIR || path.resolve(__dirname, "../temp");
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

import routesSocketClient from "./routes/socketClient";

const socketClient = sioClient(process.env.SERVER_URL + ":" + process.env.SERVER_PORT);
routesSocketClient(socketClient);
