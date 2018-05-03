import * as React from "react";
import * as io from "socket.io-client";
import appConfig from "../config/app";

import "./style.less";

let socket: SocketIOClient.Socket;

enum ConnectionState {
    Unconnected = "Unconnected",
    Connecting = "Connecting",
    Connected = "Connected",
    ConnectionFailed = "ConnectionFailed",
    ConnectError = "ConnectError",
    ConnectTimeout = "ConnectTimeout",
    Disconnect = "Disconnect",
}

export interface AppProps {}

export interface AppState {
    connectionState: ConnectionState;
    openConnecttionBox: boolean;
    socketUrl: string;
    clients: SocketIOClient.Socket[];
}

export default class App extends React.Component<AppProps, AppState> {
    public constructor(props: AppProps) {
        super(props);

        this.state = {
            connectionState: ConnectionState.Unconnected,
            openConnecttionBox: false,
            socketUrl: appConfig.serverUrl,
            clients: [],
        }
    }

    public componentWillUnmount() {
        if (socket) {
            socket.close();
        }
    }

    public render() {
        return (
            <div>
                <div>
                    <button onClick={() => this.setState({ openConnecttionBox: !this.state.openConnecttionBox })}>Connection</button>
                    <span>{this.state.connectionState}</span>
                </div>
                {this.state.openConnecttionBox ? <div>
                    <input type="text" value={this.state.socketUrl} onChange={(e) => this.handleSocketUrlChange(e)} />
                    <button onClick={() => this.connect()}>Connect</button>
                </div> : null}
                <div>{this.state.clients.map(client => {
                    return (<div key={client.id}>{client.id}</div>);
                })}</div>
            </div>
        );
    }

    private connect() {
        if (socket) {
            socket.close();
        }

        this.setState({
            connectionState: ConnectionState.Connecting,
        }, () => {
            socket = io(this.state.socketUrl);
            socket.on("connect", () => {
                this.setState({
                    connectionState: ConnectionState.Connected,
                    openConnecttionBox: false,
                });

                socket.emit("console_get_clients", (clients: SocketIOClient.Socket[]) => {
                    console.log(clients);
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
