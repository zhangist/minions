import * as React from "react";
import * as io from "socket.io-client";
import AppWindow from "../../components/AppWindow";
import appConfig from "../../config/app";

enum ConnectionState {
    Unconnected = "Unconnected",
    Connecting = "Connecting",
    Connected = "Connected",
    ConnectError = "ConnectError",
    ConnectTimeout = "ConnectTimeout",
    Disconnect = "Disconnect",
}

interface MinionsState {
    openConnectionBox: boolean;
    connectionState: ConnectionState;
    socketUrl: string;
    clients: {id: string}[];
    windows: any[];
}

export default class Minions extends AppWindow<{}, MinionsState> {
    private socket: SocketIOClient.Socket;
    public state: MinionsState = {
        openConnectionBox: false,
        connectionState: ConnectionState.Unconnected,
        socketUrl: appConfig.serverUrl,
        clients: [],
        windows: [],
    };

    public componentWillUnmount() {
        if (this.socket) {
            this.socket.close();
        }
    }

    public render() {
        return (
            <div>
                <div>
                    <button onClick={() => this.setState({ openConnectionBox: !this.state.openConnectionBox })}>Connection</button>
                    <span>{this.state.connectionState}</span>
                </div>
                <div>{this.state.clients.map(client => {
                    return (<div key={client.id}>{client.id}</div>);
                })}</div>
                {this.state.openConnectionBox ? <div>
                    <input type="text" value={this.state.socketUrl} onChange={(e) => this.handleSocketUrlChange(e)} />
                    <button onClick={() => this.connect()}>Connect</button>
                </div> : null}
                <div>
                    <button onClick={() => this.openWindows([{name: "socket window", component: <div>socket detail</div>}])}>open detail window</button>
                </div>
                {this.renderWindows()}
            </div>
        );
    }

    private connect() {
        if (this.socket) {
            this.socket.close();
        }

        this.setState({
            connectionState: ConnectionState.Connecting,
        }, () => {
            this.socket = io(this.state.socketUrl);
            this.socket.on("connect", () => {
                this.setState({
                    connectionState: ConnectionState.Connected,
                    openConnectionBox: false,
                });

                this.socket.emit("console_get_clients", (clients: SocketIOClient.Socket[]) => {
                    this.setState({
                        clients,
                    });
                });
            });
        });
    }

    private handleSocketUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            socketUrl: e.target.value,
        });
    }

}
