import * as fse from "fs-extra";
import * as path from "path";
import * as http from "http";
import * as express from "express";
import * as sio from "socket.io";
import * as multer from "multer";

// set env
import "./config/env";
process.env.FILES_DIR = process.env.FILES_DIR || path.resolve(__dirname, "../files");
process.env.TEMP_DIR = process.env.TEMP_DIR || path.resolve(__dirname, "../temp");
if (!fse.pathExistsSync(process.env.FILES_DIR)) {
    try {
        fse.mkdirsSync(process.env.FILES_DIR);
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

// api
import routesApi from "./routes/api";
// socket server
import routesSocketServer from "./routes/socketServer";

const app = express();
const server = http.createServer(app);
const socketServer = sio(server);
const port = process.env.PORT || 1992;
const upload = multer({ dest: process.env.TEMP_DIR });

// view
app.set("views", path.resolve(__dirname, "../dist"));
app.set("view engine", "html");
// static
app.use(express.static(path.resolve(__dirname, "../dist")));
// upload file
app.use(upload.single("file"));
// api
app.use(routesApi);
// socket server
routesSocketServer(socketServer);

server.listen(port, () => {
    console.log("Server listening on port " + port);
});
