import { SocketServerHandler } from "../SocketRouter";

const handler: SocketServerHandler = (socket, data, fn) => {
    fn({
        code: 0,
        data: {},
        message: "Nothing.",
    });
};

export default handler;
