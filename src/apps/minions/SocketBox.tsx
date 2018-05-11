import * as React from "react";
import * as io from "socket.io-client";
import AppWindow from "../../components/AppWindow";

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
  socketEvent: string;
  clients: { id: string }[];
  windows: any[];
}

export default class SocketBox extends AppWindow<{}, ISocketBoxState> {
  private socket: SocketIOClient.Socket;
  public state: ISocketBoxState = {
    showConnectionBox: false,
    connectionState: ConnectionState.Unconnected,
    socketUrl: "http://localhost:1992/console",
    socketEvent: "",
    clients: [],
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
        {this.state.clients && this.state.clients.length > 0 ? (
          <div>
            {this.state.clients.map(client => {
              return <div key={client.id}>{client.id}</div>;
            })}
          </div>
        ) : null}
        {this.state.connectionState === ConnectionState.Connected ? (
          <div>
            <input
              type="text"
              value={this.state.socketEvent}
              onChange={e => this.handleFieldChange(e, "socketEvent")}
            />
            <button onClick={this.emit}>Emit</button>
          </div>
        ) : null}
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
      () => {
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
      },
    );
  }

  private emit = () => {
    if (this.state.socketEvent && this.socket) {
      this.socket.emit(this.state.socketEvent, {}, (res: any) => {
        console.log(res);
      });
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
          clients: res.data,
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
  }

  private onSocketEventConnectError = () => {
    this.socket.on("connect_error", () => {
      this.setState({
        connectionState: ConnectionState.ConnectError,
      });
    });
  }

  private onSocketEventConnectTimeout = () => {
    this.socket.on("connect_timeout", () => {
      this.setState({
        connectionState: ConnectionState.ConnectTimeout,
      });
    });
  }

  private onSocketEventDisconnect = () => {
    this.socket.on("disconnect", () => {
      this.setState({
        connectionState: ConnectionState.Disconnect,
      });
    });
  }

  private onSocketEventReconnect = () => {
    this.socket.on("reconnect", () => {
      this.setState({
        connectionState: ConnectionState.Reconnect,
      });
    });
  }

  private onSocketEventReconnectAttempt = () => {
    this.socket.on("reconnect_attempt", () => {
      this.setState({
        connectionState: ConnectionState.ReconnectAttempt,
      });
    });
  }

  private onSocketEventReconnecting = () => {
    this.socket.on("reconnecting", () => {
      this.setState({
        connectionState: ConnectionState.Reconnecting,
      });
    });
  }

  private onSocketEventReconnectError = () => {
    this.socket.on("reconnect_error", () => {
      this.setState({
        connectionState: ConnectionState.ReconnectError,
      });
    });
  }

  private onSocketEventReconnectFailed = () => {
    this.socket.on("reconnect_failed", () => {
      this.setState({
        connectionState: ConnectionState.ReconnectFailed,
      });
    });
  }
}
