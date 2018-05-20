import * as React from "react";
import * as io from "socket.io-client";
import AppWindow from "../../../components/AppWindow";
import { SocketHandler, Client, PostClientHandler } from "../SocketRouter";
import SendFilesWindow from "./SendFilesWindow";

function isJSON(str: string) {
  if (typeof str == "string") {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == "object" && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log("error：" + str + "!!!" + e);
      return false;
    }
  }
  return false;
}

enum ConnectionState {
  Unconnected = "Unconnected",
  Connecting = "Connecting",
  Connected = "Connected",
  ConnectError = "ConnectError",
  ConnectTimeout = "ConnectTimeout",
  Error = "Error",
  Disconnect = "Disconnect",
  Reconnect = "Reconnect",
  ReconnectAttempt = "ReconnectAttempt",
  Reconnecting = "Reconnecting",
  ReconnectError = "ReconnectError",
  ReconnectFailed = "ReconnectFailed",
  Ping = "Ping",
  Pong = "Pong",
}

interface ISocketBoxState {
  showConnectionBox: boolean;
  connectionState: ConnectionState;
  socketUrl: string;
  socketEmitEvent: string;
  socketEmitData: string;
  files: any[];
  clients: Client[];
  windows: any[];
}

export default class SocketBox extends AppWindow<{}, ISocketBoxState> {
  private socket: SocketIOClient.Socket;
  public state: ISocketBoxState = {
    showConnectionBox: false,
    connectionState: ConnectionState.Unconnected,
    socketUrl: "http://localhost:1992?room=console",
    socketEmitEvent: "",
    socketEmitData: "",
    files: [],
    clients: [
      {
        id: "1",
        name: "test",
        files: [
          {
            filename: "1.mp3",
          },
        ],
      },
    ],
    windows: [],
  };

  public render() {
    return (
      <div>
        <button
          onClick={() =>
            this.setState({ showConnectionBox: !this.state.showConnectionBox })
          }
        >
          Open Connection Box
        </button>
        <span>{this.state.connectionState}</span>
        {this.state.showConnectionBox ? (
          <div>
            <input
              type="text"
              value={this.state.socketUrl}
              onChange={e => this.handleFieldChange(e, "socketUrl")}
            />
            <button onClick={() => this.connect()}>Connect</button>
          </div>
        ) : null}
        {this.state.connectionState === ConnectionState.Connected ? (
          <div>
            <input
              type="text"
              value={this.state.socketEmitEvent}
              onChange={e => this.handleFieldChange(e, "socketEmitEvent")}
            />
            <input
              type="text"
              value={this.state.socketEmitData}
              onChange={e => this.handleFieldChange(e, "socketEmitData")}
            />
            <button onClick={this.emit}>Emit</button>
          </div>
        ) : null}
        {this.state.clients.length > 0
          ? this.state.clients.map(client => {
              return (
                <div key={client.id}>
                  {client.name || client.id}
                  <button
                    onClick={() =>
                      this.openWindows([
                        {
                          name: "Send Files - " + (client.name || client.id),
                          component: <SendFilesWindow clients={[client]} />,
                          width: 500,
                          height: 300,
                        },
                      ])
                    }
                  >
                    Send Files
                  </button>
                </div>
              );
            })
          : null}
        <div style={{ wordBreak: "break-all" }}>
          <div>emit event:</div>
          <div
          >{`post_files: { "to": [{ "id": "socket_id" }], "files": [{ "filename": "filename.mp3" }] }`}</div>
        </div>
        {this.renderWindows()}
      </div>
    );
  }

  private connect() {
    if (this.socket) {
      this.socket.close();
    }

    this.setState(
      {
        connectionState: ConnectionState.Connecting,
      },
      this.initSocketEvent,
    ); // init socket event
  }

  private initSocketEvent = () => {
    this.socket = io(this.state.socketUrl);
    this.onSocketEventConnect();
    this.onSocketEventConnectError();
    this.onSocketEventConnectTimeout();
    this.onSocketEventDisconnect();
    this.onSocketEventReconnect();
    this.onSocketEventReconnectAttempt();
    this.onSocketEventReconnecting();
    this.onSocketEventReconnectError();
    this.onSocketEventReconnectFailed();
    this.onSocketEventPostClient();
    this.onSocketEventDeleteSocket();
    this.onSocketEventPutClient();
  };

  private emit = () => {
    if (this.state.socketEmitEvent && this.socket) {
      const str = this.state.socketEmitData;
      this.socket.emit(
        this.state.socketEmitEvent,
        isJSON(str) ? JSON.parse(str) : {},
        (res: any) => {
          console.log(res);
        },
      );
    }
  };

  private handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    this.setState({
      [fieldName]: e.target.value,
    });
  };

  private getClients = () => {
    this.socket.emit("get_clients", {}, (res: any) => {
      if (res.code === 0) {
        this.setState({
          clients: res.data.sockets,
        });
      }
    });
  };

  private onSocketEventConnect = () => {
    this.socket.on("connect", () => {
      this.setState(
        {
          connectionState: ConnectionState.Connected,
          openConnectionBox: false,
        },
        () => {
          this.getClients();
        },
      );
    });
  };

  private onSocketEventConnectError = () => {
    this.socket.on("connect_error", () => {
      this.setState({
        connectionState: ConnectionState.ConnectError,
      });
    });
  };

  private onSocketEventConnectTimeout = () => {
    this.socket.on("connect_timeout", () => {
      this.setState({
        connectionState: ConnectionState.ConnectTimeout,
      });
    });
  };

  private onSocketEventDisconnect = () => {
    this.socket.on("disconnect", () => {
      this.setState({
        connectionState: ConnectionState.Disconnect,
      });
    });
  };

  private onSocketEventReconnect = () => {
    this.socket.on("reconnect", () => {
      this.setState({
        connectionState: ConnectionState.Reconnect,
      });
    });
  };

  private onSocketEventReconnectAttempt = () => {
    this.socket.on("reconnect_attempt", () => {
      this.setState({
        connectionState: ConnectionState.ReconnectAttempt,
      });
    });
  };

  private onSocketEventReconnecting = () => {
    this.socket.on("reconnecting", () => {
      this.setState({
        connectionState: ConnectionState.Reconnecting,
      });
    });
  };

  private onSocketEventReconnectError = () => {
    this.socket.on("reconnect_error", () => {
      this.setState({
        connectionState: ConnectionState.ReconnectError,
      });
    });
  };

  private onSocketEventReconnectFailed = () => {
    this.socket.on("reconnect_failed", () => {
      this.setState({
        connectionState: ConnectionState.ReconnectFailed,
      });
    });
  };

  private onSocketEventPostClient = () => {
    this.socket.on("post_client", ((data) => {
      let isExist = false;
      const client = data.client;
      const clients = this.state.clients;
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].id === client.id) {
          isExist = true;
          Object.assign(clients[i], client);
          break;
        }
      }
      if (!isExist) {
        this.state.clients.push(client);
      }
      this.setState({});
    }) as PostClientHandler);
  };

  private onSocketEventDeleteSocket = () => {
    this.socket.on("delete_socket", ((data: { socket: Client }) => {
      const clients = this.state.clients;
      for (let i = 0; i < clients.length; i++) {
        if (clients[i].id === data.socket.id) {
          clients.splice(i, 1);
          break;
        }
      }
      this.setState({});
    }) as SocketHandler);
  };

  private onSocketEventPutClient = () => {
    this.socket.on("put_client", ((data: { socket: Client }) => {
      const clients = this.state.clients;
      const socket = data.socket;
      for (let i = 0; i < clients.length; i++) {
        const client = clients[i];
        if (client.id === socket.id) {
          Object.assign(client, socket);
          break;
        }
      }
      this.setState({});
    }) as SocketHandler);
  };
}