import Speaker from "speaker";
import { AudioContext } from "web-audio-api";
import { withSocket, Audio, withAudioSocket } from "../SocketRouter";
import getClient from "./getClient";
import postFiles from "./postFiles";
import postPlayFile from "./postPlayFile";
import postPlayStart from "./postPlayStart";

const context = new AudioContext();
context.outStream = new Speaker({
  bitDepth: context.format.bitDepth,
  channels: context.format.numberOfChannels,
  sampleRate: context.format.sampleRate,
});
const audio: Audio = {
  context,
};

export default (socket: SocketIOClient.Socket) => {
  socket.on("connect", () => {
    // log on connect
    console.log("connected");

    socket.emit("put_client", {
      socket: {
        id: socket.id,
        name: process.env.CLIENT_NAME,
      },
    });
  });
  socket.on("post_files", withSocket(socket, postFiles));
  socket.on("get_client", withSocket(socket, getClient));
  socket.on("post_play_file", withAudioSocket(audio, socket, postPlayFile));
  socket.on("post_play_start", withAudioSocket(audio, socket, postPlayStart));
};
