import {
  Rooms,
  ServerSocketHandler,
  SocketResponseParams,
  ClientProps,
} from "../SocketRouter";

const handler: ServerSocketHandler = ({ fn, server }) => {
  const room = server.sockets.adapter.rooms[Rooms.Client];
  if (!room) {
    fn({
      code: 0,
      data: {
        sockets: [],
      },
      message: "Success.",
    });
    return;
  }

  let clients: ClientProps[] = [];
  const sockets = room.sockets;

  for (let key in sockets) {
    clients.push({
      id: key,
    });
  }

  fn({
    code: 0,
    data: {
      sockets: clients,
    },
    message: "Success.",
  });

  clients = []; // clear
  for (let key in sockets) {
    server.sockets.sockets[key].emit(
      "get_client",
      {},
      (res: SocketResponseParams) => {
        const client = res.data.socket;
        if (client.id) {
          server.to(Rooms.Console).emit("put_client", { socket: client });
        }
      },
    );
  }
};

export default handler;
