import * as fse from "fs-extra";
import * as path from "path";
import * as http from "http";
import * as express from "express";
import * as sio from "socket.io";
import * as multer from "multer";

// set env
import "./config/env";
process.env.SERVER_FILES_DIR = process.env.SERVER_FILES_DIR || path.resolve(__dirname, "../files/server");
process.env.TEMP_DIR = process.env.TEMP_DIR || path.resolve(__dirname, "../temp");
if (!fse.pathExistsSync(process.env.SERVER_FILES_DIR)) {
    try {
        fse.mkdirsSync(process.env.SERVER_FILES_DIR);
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
const upload = multer({ dest: process.env.TEMP_DIR });

// view
app.set("views", path.resolve(__dirname, "../dist"));
app.set("view engine", "html");
// static
app.use(express.static(path.resolve(__dirname, "../dist")));
// Access-Control-Allow-Origin
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// upload file
app.use(upload.single("file"));
// api
app.use(routesApi);
// socket server
routesSocketServer(socketServer);

server.listen(process.env.SERVER_PORT, () => {
    console.log("Server listening on port " + process.env.SERVER_PORT);
});
