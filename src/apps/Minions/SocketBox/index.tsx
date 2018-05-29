import * as React from "react";
import * as io from "socket.io-client";
import Checkbox from "@material-ui/core/Checkbox";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import SignalCellular4Bar from "@material-ui/icons/SignalCellular4Bar";
import SignalWifiOff from "@material-ui/icons/SignalWifiOff";
import Audiotrack from "@material-ui/icons/Audiotrack";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Help from "@material-ui/icons/Help";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Publish from "@material-ui/icons/Publish";
import { IconButton } from "../../../components/app";
import AppWindow from "../../../components/AppWindow";
import { SocketHandler, Client, File, PostClientData } from "../SocketRouter";

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

interface MyFile extends File {
  isOpenDetail?: boolean;
  isSelected?: boolean;
  existSelectedClients?: Client[];
  nonExistSelectdClients?: Client[];
}

interface SocketBoxState {
  showConnectionBox: boolean;
  connectionState: ConnectionState;
  socketUrl: string;
  socketEmitEvent: string;
  socketEmitData: string;
  actionTabIndex: number;
  files: MyFile[];
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
    files: [
      { filename: "test.mp3" },
      { filename: "test2.mp3" },
      { filename: "test3.mp3" },
    ],
    clients: [
      {
        id: "1",
        name: "test",
        files: [
          {
            filename: "test.mp3",
          },
        ],
      },
      {
        id: "2",
        name: "test2",
        files: [
          {
            filename: "test2.mp3",
          },
        ],
      },
    ],
    windows: [],
  };

  public componentWillUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  }

  public render() {
    const {
      clients,
      files,
      connectionState,
      showConnectionBox,
      socketUrl,
      socketEmitEvent,
      socketEmitData,
      actionTabIndex,
    } = this.state;

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <List
          style={{
            flex: "auto",
            overflow: "auto",
            padding: "10px",
            backgroundColor: "#fff",
          }}
        >
          {clients.map(client => {
            return [
              <ListItem
                key={client.id}
                button
                disableRipple
                style={{ padding: "0 8px" }}
                onClick={() => this.openClientDetail(client)}
              >
                <Checkbox
                  onClick={e => e.stopPropagation()}
                  onChange={e => this.handleClientSelect(e, client)}
                  checked={client.isSelected}
                />
                <ListItemText>
                  {client.name || ""} - {client.id}
                </ListItemText>
                {client.isOpenDetail ? <ExpandLess /> : <ExpandMore />}
              </ListItem>,
              client.isOpenDetail ? (
                <List key={"detail" + client.id}>
                  <ListItem>
                    <div>files: test.mp3</div>
                  </ListItem>
                </List>
              ) : null,
            ];
          })}
        </List>
        <Tabs
          value={actionTabIndex}
          onChange={this.handleActionTabChange}
          style={{ flex: "none" }}
        >
          <Tab
            icon={
              connectionState === ConnectionState.Connected ? (
                <SignalCellular4Bar style={{ color: "#21b989" }} />
              ) : (
                <SignalWifiOff style={{ color: "#666" }} />
              )
            }
          />
          <Tab icon={<Audiotrack />} />
          <Tab icon={<PlayArrow />} />
          <Tab icon={<Help />} />
        </Tabs>
        <div
          style={{
            flex: "auto",
            overflow: "auto",
            padding: "10px",
            backgroundColor: "#fff",
          }}
        >
          {actionTabIndex === 0 && (
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
              <div style={{ wordBreak: "break-all" }}>
                <div>emit event:</div>
                <div
                >{`post_files: { "clients": [{ "id": "socket_id" }], "files": [{ "filename": "filename.mp3" }] }`}</div>
                <div
                >{`post_play_file: { "clients": [{ "id": "socket_id" }], "file": [{ "filename": "filename.mp3" }] }`}</div>
                <div
                >{`post_play_start: { "clients": [{ "id": "socket_id" }] }`}</div>
              </div>
            </div>
          )}
          {actionTabIndex === 1 && (
            <div>
              <div>
                <span>Send Files</span>
                <Tooltip title="Send all the selected">
                  <IconButton>
                    <Publish />
                  </IconButton>
                </Tooltip>
              </div>
              <List>
                {files.map(file => (
                  <ListItem
                    key={file.filename}
                    button
                    disableRipple
                    style={{ padding: "0 8px" }}
                  >
                    <Checkbox
                      onChange={e => this.handleFileSelect(e, file)}
                      checked={file.isSelected}
                    />
                    <ListItemText>{file.filename}</ListItemText>
                    <div style={{ margin: "0 10px" }}>
                      <Tooltip title={file.filename}>
                        <span>
                          {(file.existSelectedClients || []).length +
                            "/" +
                            ((file.existSelectedClients || []).length +
                              (file.nonExistSelectdClients || []).length)}
                        </span>
                      </Tooltip>
                    </div>
                    <Tooltip title="Send">
                      <IconButton>
                        <Publish />
                      </IconButton>
                    </Tooltip>
                  </ListItem>
                ))}
              </List>
            </div>
          )}
          {actionTabIndex === 2 && <div>Play</div>}
          {actionTabIndex === 3 && (
            <div>
              <h4>Workflow:</h4>
              <div>Step 1:</div>
              <div>
                <SignalWifiOff /> connect to server.
              </div>
              <div>Step 2:</div>
              <div>
                <Audiotrack /> send files to clients.
              </div>
              <div>Step 3:</div>
              <div>
                <PlayArrow /> Play.
              </div>
              <br />
              <h4>Icons:</h4>
              <div>
                <Publish /> Send file/files.
              </div>
            </div>
          )}
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
    const clients = this.state.clients;
    const files = this.state.files;
    for (const fkey in files) {
      const file = files[fkey];
      file.existSelectedClients = [];
      file.nonExistSelectdClients = [];
      for (const ckey in clients) {
        const client = clients[ckey];
        const cfiles = client.files || [];
        if (client.isSelected) {
          let isExist = false;
          for (const cfkey in cfiles) {
            const cfile = cfiles[cfkey];
            if (cfile.filename === file.filename) {
              file.existSelectedClients.push(client);
              isExist = true;
              break;
            }
          }
          if (!isExist) {
            file.nonExistSelectdClients.push(client);
          }
        }
      }
    }
    this.setState({});
  };

  private handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    file: MyFile,
  ) => {
    file.isSelected = e.target.checked;
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
