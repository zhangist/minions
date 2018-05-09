import * as sio from "socket.io";

export default (socketServer: sio.Server) => {
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
}
