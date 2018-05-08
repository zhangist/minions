import * as fs from "fs";
import * as path from "path";
import * as http from "http";
// import * as fse from "fs-extra";
import * as express from "express";
import * as multer from "multer";
import * as sio from "socket.io";

import "./config/env"; // set env
process.env.FILE_DIR = process.env.FILE_DIR || path.resolve(__dirname, "../files");

const app = express();
const server = http.createServer(app);
const socketServer = sio(server);
const port = process.env.PORT || 1992;
const upload = multer({ dest: path.resolve(__dirname, "../temp") });

app.set("views", path.resolve(__dirname, "../dist"));
app.set("view engine", "html");
app.use(express.static(path.resolve(__dirname, "../dist")));
app.post("/upload", upload.single("file"), async (req, res) => {
    console.log(req.file);
    if (!process.env.FILE_DIR) {
        res.send({
            code: 500,
            message: "Save file failed.",
        });
        return;
    }
    let saveFileError;
    try {
        fs.renameSync(req.file.path, path.resolve(process.env.FILE_DIR, req.file.originalname));
    } catch (e) {
        console.log(e);
        saveFileError = e;
    }
    if (saveFileError) {
        res.send({
            code: 500,
            message: "Save file failed.",
        });
        return;
    }
    res.send({
        code: 0,
        message: "Upload file success.",
    });
});
app.get("/files", (req, res) => {
    if (process.env.FILE_DIR) {
        res.send({
            code: 500,
            data: fs.readdirSync(process.env.FILE_DIR || ""),
        });
    } else {
        res.send({
            code: 500,
            message: "Read files failed.",
        });
    }
});

socketServer.on("connection", (socket) => {
    console.log("connection: " + socket.id);

    socket.on("disconnect", () => {
        console.log("disconnect: " + socket.id);
    });

    /**
     * get list of clients
     */
    socket.on("console_get_clients", (fn: (data: any) => any) => {
        const clients = [];
        for (let key in socketServer.sockets.sockets) {
            clients.push({
                id: key,
            });
        }
        fn(clients);
    });

    /**
     * post sound data to client from console(web)
     */
    socket.on("console_post_sound", (fn: (data: any) => any) => {
        const clients = [];
        for (let key in socketServer.sockets.sockets) {
            clients.push({
                id: key,
            });
        }
        fn(clients);
    });
});

server.listen(port, () => {
    console.log("Server listening on port " + port);
});
