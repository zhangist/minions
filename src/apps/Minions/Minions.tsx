import * as React from "react";
import AppWindow from "../../components/AppWindow";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SignalCellular4Bar from "@material-ui/icons/SignalCellular4Bar";
import SignalWifiOff from "@material-ui/icons/SignalWifiOff";
import FileUpload from "@material-ui/icons/FileUpload";
import Audiotrack from "@material-ui/icons/Audiotrack";
import PlayArrow from "@material-ui/icons/PlayArrow";
import Backup from "@material-ui/icons/Backup";
import Help from "@material-ui/icons/Help";
import SocketConnectionState from "./SocketConnectionState";
import ClientList from "./components/ClientList";
import FileList from "./components/FileList";
import SocketConnectionBox from "./components/SocketConnectionBox";
import UploadFileBox from "./components/UploadFileBox";
import { SocketHandler, Client, File, PostClientData } from "./SocketRouter";

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

export interface MinionsState {
  connectionState: SocketConnectionState;
  tabIndex: number;
  clients: MyClient[];
  files: MyFile[];
  windows: any[];
}

export default class Minions extends AppWindow<{}, MinionsState> {
  private socket: SocketIOClient.Socket;
  private socketUrl = "http://localhost:1992?room=console";
  public state: MinionsState = {
    connectionState: SocketConnectionState["Unconnected"],
    tabIndex: 0,
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
    files: [
      { filename: "test.mp3" },
      { filename: "test2.mp3" },
      { filename: "test3.mp3" },
    ],
    windows: [],
  };

  public componentWillUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  }

  public render() {
    const { clients, files, connectionState, tabIndex } = this.state;

    return (
      <div
        className="minions"
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <ClientList
          clients={clients}
          handleClientSelect={(client) => {
            client.isSelected = !client.isSelected;
            this.setState({});
          }}
          handleClientClick={client => {
            client.isOpenDetail = !client.isOpenDetail;
            this.setState({});
          }}
        />
        <Tabs
          value={tabIndex}
          onChange={(e, value) => this.setState({ tabIndex: value })}
          style={{ flex: "none" }}
        >
          <Tab
            icon={
              connectionState === SocketConnectionState.Connected ? (
                <SignalCellular4Bar style={{ color: "#21b989" }} />
              ) : (
                <SignalWifiOff style={{ color: "#666" }} />
              )
            }
          />
          <Tab icon={<FileUpload />} />
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
          {tabIndex === 0 && (
            <SocketConnectionBox
              connectionState={connectionState}
              url={this.socketUrl}
              connect={this.socketConnect}
              emit={(event, data) => {}}
            />
          )}
          {tabIndex === 1 && <UploadFileBox />}
          {tabIndex === 2 && (
            <FileList
              files={files}
              handleFileSelect={file => {
                file.isSelected = !file.isSelected;
                this.setState({});
              }}
            />
          )}
          {tabIndex === 3 && <div>Play</div>}
          {tabIndex === 4 && (
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
                <Backup /> Send file/files.
              </div>
            </div>
          )}
        </div>
        {this.renderWindows()}
      </div>
    );
  }

  private getClients = () => {
    this.socket.emit("get_clients", {}, (res: any) => {
      if (res.code === 0) {
        this.setState({
          clients: res.data.sockets,
        });
      }
    });
  };

  private socketConnect = (url?: string) => {
    url = url || this.socketUrl;
    if (this.socket) {
      this.socket.close();
    }

    this.setState(
      {
        connectionState: SocketConnectionState.Connecting,
      },
      () => this.initSocketEvent(url),
    ); // init socket event
  };

  private initSocketEvent = (url?: string) => {
    url = url || this.socketUrl;
    this.socket = io(url);
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

  private onSocketEventConnect = () => {
    this.socket.on("connect", () => {
      this.setState(
        {
          connectionState: SocketConnectionState.Connected,
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
        connectionState: SocketConnectionState.ConnectError,
      });
    });
  };

  private onSocketEventConnectTimeout = () => {
    this.socket.on("connect_timeout", () => {
      this.setState({
        connectionState: SocketConnectionState.ConnectTimeout,
      });
    });
  };

  private onSocketEventDisconnect = () => {
    this.socket.on("disconnect", () => {
      this.setState({
        connectionState: SocketConnectionState.Disconnect,
      });
    });
  };

  private onSocketEventReconnect = () => {
    this.socket.on("reconnect", () => {
      this.setState({
        connectionState: SocketConnectionState.Reconnect,
      });
    });
  };

  private onSocketEventReconnectAttempt = () => {
    this.socket.on("reconnect_attempt", () => {
      this.setState({
        connectionState: SocketConnectionState.ReconnectAttempt,
      });
    });
  };

  private onSocketEventReconnecting = () => {
    this.socket.on("reconnecting", () => {
      this.setState({
        connectionState: SocketConnectionState.Reconnecting,
      });
    });
  };

  private onSocketEventReconnectError = () => {
    this.socket.on("reconnect_error", () => {
      this.setState({
        connectionState: SocketConnectionState.ReconnectError,
      });
    });
  };

  private onSocketEventReconnectFailed = () => {
    this.socket.on("reconnect_failed", () => {
      this.setState({
        connectionState: SocketConnectionState.ReconnectFailed,
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
