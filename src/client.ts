import * as io from "socket.io-client";
import appConfig from "./config/app";

const socket = io(appConfig.serverUrl);

socket.on("connect", () => {
    console.log("connected");
});

socket.on("server_post_sound", (data: any) => {
    console.log(data);
});
