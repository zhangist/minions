import {
  ServerSocketHandler,
  PostPlayFileData,
  PostPlayFileResponseParams,
} from "../SocketRouter";

const handler: ServerSocketHandler = ({ data, fn, server, socket }) => {
  const postPlayFileData: PostPlayFileData = data;
  const clients = postPlayFileData.clients;
  const file = postPlayFileData.file;

  const result: PostPlayFileResponseParams[] = [];
  let count = 0;

  for (let i = 0; i < clients.length; i++) {
    const key = clients[i].id;
    const client = server.sockets.sockets[key];
    if (client) {
      client.emit("post_play_file", { file }, (res: PostPlayFileResponseParams) => {
        count = count + 1;
        result.push(res);
        if (count === clients.length) {
          fn({
            code: 0,
            data: result,
            message: "Prepare file finished.",
          });
        }
      });
    } else {
      socket.emit("delete_client", { socket: { id: key } });
    }
  }
}

export default handler;
