import * as React from "react";
import * as io from "socket.io-client";
import Checkbox from "@material-ui/core/Checkbox";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Audiotrack from "@material-ui/icons/Audiotrack";
import PlayArrow from "@material-ui/icons/PlayArrow";
import { Button } from "../../../components/app";
import AppWindow from "../../../components/AppWindow";
import { SocketHandler, Client, PostClientData } from "../SocketRouter";

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

interface MyClient extends Client {
  isOpenDetail?: boolean;
  isSelected?: boolean;
}

interface SocketBoxState {
  showConnectionBox: boolean;
  connectionState: ConnectionState;
  socketUrl: string;
  socketEmitEvent: string;
  socketEmitData: string;
  actionTabIndex: number;
  files: any[];
  clients: MyClient[];
  windows: any[];
}

export default class SocketBox extends AppWindow<{}, SocketBoxState> {
  private socket: SocketIOClient.Socket;
  public state: SocketBoxState = {
    showConnectionBox: false,
    connectionState: ConnectionState.Unconnected,
    socketUrl: "http://localhost:1992?room=console",
    socketEmitEvent: "",
    socketEmitData: "",
    actionTabIndex: 0,
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
      {
        id: "2",
        name: "test2",
        files: [
          {
            filename: "2.mp3",
          },
        ],
      },
    ],
    windows: [],
  };

  public render() {
    const {
      clients,
      connectionState,
      showConnectionBox,
      socketUrl,
      socketEmitEvent,
      socketEmitData,
      actionTabIndex,
    } = this.state;
    return (
      <div>
        <button
          onClick={() =>
            this.setState({ showConnectionBox: !showConnectionBox })
          }
        >
          Open Connection Box
        </button>
        <span>{connectionState}</span>
        {showConnectionBox ? (
          <div>
            <input
              type="text"
              value={socketUrl}
              onChange={e => this.handleFieldChange(e, "socketUrl")}
            />
            <button onClick={() => this.connect()}>Connect</button>
          </div>
        ) : null}
        {connectionState === ConnectionState.Connected ? (
          <div>
            <input
              type="text"
              value={socketEmitEvent}
              onChange={e => this.handleFieldChange(e, "socketEmitEvent")}
            />
            <input
              type="text"
              value={socketEmitData}
              onChange={e => this.handleFieldChange(e, "socketEmitData")}
              style={{ width: "300px" }}
            />
            <button onClick={this.emit}>Emit</button>
          </div>
        ) : null}
        <div>
          {clients.map(client => {
            return (
              <div key={client.id}>
                <Checkbox
                  onChange={e => this.handleClientSelect(e, client)}
                  checked={client.isSelected}
                />
                <span>
                  {client.name || ""} - {client.id}
                </span>
                <Button onClick={() => this.openClientDetail(client)}>
                  Detail
                </Button>
                {client.isOpenDetail ? <div>files: test.mp3</div> : null}
              </div>
            );
          })}
        </div>
        <Tabs value={actionTabIndex} onChange={this.handleActionTabChange}>
          <Tab icon={<Audiotrack />} />
          <Tab icon={<PlayArrow />} />
        </Tabs>
        <div style={{ padding: "10px", backgroundColor: "#fff" }}>
          {actionTabIndex === 0 && <div>Send Files</div>}
          {actionTabIndex === 1 && <div>Play</div>}
        </div>
        <br />
        <div style={{ wordBreak: "break-all" }}>
          <div>emit event:</div>
          <div
          >{`post_files: { "clients": [{ "id": "socket_id" }], "files": [{ "filename": "filename.mp3" }] }`}</div>
          <div
          >{`post_play_file: { "clients": [{ "id": "socket_id" }], "file": [{ "filename": "filename.mp3" }] }`}</div>
          <div>{`post_play_start: { "clients": [{ "id": "socket_id" }] }`}</div>
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

  private openClientDetail = (client: MyClient) => {
    client.isOpenDetail = !client.isOpenDetail;
    this.setState({});
  };

  private handleActionTabChange = (e: any, value: number) => {
    this.setState({ actionTabIndex: value });
  };

  private handleClientSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    client: MyClient,
  ) => {
    client.isSelected = e.target.checked;
    this.setState({});
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
    this.socket.on("post_client", (data: PostClientData) => {
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
    });
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
