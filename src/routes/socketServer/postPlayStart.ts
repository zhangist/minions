import {
  ServerSocketHandler,
  PostPlayStartData,
  PostPlayStartResponseParams,
} from "../SocketRouter";

const handler: ServerSocketHandler = ({ data, fn, server, socket }) => {
  const postPlayFileData: PostPlayStartData = data;
  const clients = postPlayFileData.clients;

  const result: PostPlayStartResponseParams[] = [];
  let count = 0;

  for (let i = 0; i < clients.length; i++) {
    const key = clients[i].id;
    const client = server.sockets.sockets[key];
    if (client) {
      client.emit("post_play_start", {}, (res: PostPlayStartResponseParams) => {
        count = count + 1;
        result.push(res);
        if (count === clients.length) {
          fn({
            code: 0,
            data: result,
            message: "Play start finished.",
          });
        }
      });
    } else {
      socket.emit("delete_client", { socket: { id: key } });
    }
  }
}

export default handler;
