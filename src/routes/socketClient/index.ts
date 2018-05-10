import { withSocketClient } from "../SocketRouter";

import postFile from "./postFile";

export default (socketClient: SocketIOClient.Socket) => {
    socketClient.on("connect", () => {
        // log on connect
        console.log("connected");
    });
    socketClient.on("post_file", withSocketClient(socketClient, postFile));
}
