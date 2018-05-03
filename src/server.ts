import "./config/env"; // set env

import * as http from "http";
import * as socketServer from "socket.io";

const app = http.createServer();
const server = socketServer(app);

const port = process.env.PORT || 1992;

server.on("connection", (socket) => {
    console.log("connection: " + socket.id);

    socket.on("disconnect", () => {
        console.log("disconnect: " + socket.id);
    });

    /**
     * get list of clients
     */
    socket.on("console_get_clients", (fn: (data: any) => any) => {
        const clients = [];
        for (let key in server.sockets.sockets) {
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
        for (let key in server.sockets.sockets) {
            clients.push({
                id: key,
            });
        }
        fn(clients);
    });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
