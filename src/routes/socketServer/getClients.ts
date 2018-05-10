import { SocketServerHandler } from "../SocketRouter";

const handler: SocketServerHandler = (socket, data, fn) => {
    const clients = [];
    for (let key in socket.sockets.sockets) {
        clients.push({
            id: key,
        });
    }
    fn({
        code: 0,
        data: clients,
        message: "Success.",
    });
};

export default handler;
