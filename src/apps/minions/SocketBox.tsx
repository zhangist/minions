import * as React from "react";
import * as io from "socket.io-client";
import AppWindow from "../../components/AppWindow";

enum ConnectionState {
  Unconnected = "Unconnected",
  Connecting = "Connecting",
  Connected = "Connected",
  ConnectError = "ConnectError",
  ConnectTimeout = "ConnectTimeout",
  Disconnect = "Disconnect",
}

interface ISocketBoxState {
  showConnectionBox: boolean;
  connectionState: ConnectionState;
  socketUrl: string;
  clients: { id: string }[];
  windows: any[];
}

export default class SocketBox extends AppWindow<{}, ISocketBoxState> {
  private socket: SocketIOClient.Socket;
  public state: ISocketBoxState = {
    showConnectionBox: false,
    connectionState: ConnectionState.Unconnected,
    socketUrl: "http://localhost:1992",
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
              onChange={this.handleSocketUrlChange}
            />
            <button onClick={() => this.connect()}>Connect</button>
          </div>
        ) : null}
        {this.state.clients.length > 0 ? (
          <div className="c-box">
            {this.state.clients.map(client => {
              return <div key={client.id}>{client.id}</div>;
            })}
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
        this.socket.on("connect", () => {
          this.setState(
            {
              connectionState: ConnectionState.Connected,
              openConnectionBox: false,
            },
            () => {
              this.socket.emit("get_clients", (res: any) => {
                if (res.code === 0) {
                  this.setState({
                    clients: res.data.clients,
                  });
                }
              });
            },
          );
        });
      },
    );
  }

  private handleSocketUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      socketUrl: e.target.value,
    });
  };
}
