import * as React from "react";
import * as io from "socket.io-client";
import appConfig from "../config/app";
import Window, { WindowProps } from "./window";

import "./style.less";

let socket: SocketIOClient.Socket;

enum ConnectionState {
    Unconnected = "Unconnected",
    Connecting = "Connecting",
    Connected = "Connected",
    ConnectError = "ConnectError",
    ConnectTimeout = "ConnectTimeout",
    Disconnect = "Disconnect",
}

export interface AppProps {}

interface AppState {
    connectionState: ConnectionState;
    openConnecttionBox: boolean;
    socketUrl: string;
    clients: SocketIOClient.Socket[];
    windows: any[];
}

export default class App extends React.Component<AppProps, AppState> {
    public constructor(props: AppProps) {
        super(props);

        this.state = {
            connectionState: ConnectionState.Unconnected,
            openConnecttionBox: false,
            socketUrl: appConfig.serverUrl,
            clients: [],
            windows: [{
                unique: Symbol(),
                id: "id",
                className: "class-name",
                title: "test window",
                width: 300,
                height: 200,
                top: 20,
                left: 20,
                zIndex: 0,
                children: (
                    <div>123<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />23</div>
                ),
            }, {
                unique: Symbol(),
                id: "id",
                className: "class-name",
                title: "test window 2",
                width: 300,
                height: 200,
                top: 40,
                left: 40,
                zIndex: 0,
                children: (
                    <div>123<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />23</div>
                ),
            }],
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
                {this.state.windows.map((windowProps, index) => {
                    return (
                        <Window
                            key={index}
                            update={(diff) => this.updateWindowProps(windowProps, diff)}
                            onClose={() => this.closeWindow(windowProps)}
                            onMouseDown={() => this.handleWindowActive(windowProps)}
                            {...windowProps}
                        />
                    );
                })}
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

    private handleWindowActive(windowProps: WindowProps) {
        const zIndex = windowProps.zIndex;
        for (let i = 0; i < this.state.windows.length; i++) {
            if (this.state.windows[i].unique === windowProps.unique) {
                this.state.windows[i].zIndex = this.state.windows.length;
            } else {
                if (this.state.windows[i].zIndex > zIndex) {
                    this.state.windows[i].zIndex = this.state.windows[i].zIndex - 1;
                }
            }
        }
        
        this.setState({
            windows: this.state.windows,
        });
    }

    private updateWindowProps(windowProps: WindowProps, diff: any) {
        for (let i = 0; i < this.state.windows.length; i++) {
            if (this.state.windows[i].unique === windowProps.unique) {
                this.state.windows[i] = Object.assign(windowProps, diff);
                this.setState({
                    windows: this.state.windows,
                });
                break;
            }
        }
    }

    private closeWindow(windowProps: WindowProps) {
        for (let i = 0; i < this.state.windows.length; i++) {
            if (this.state.windows[i].unique === windowProps.unique) {
                this.state.windows.splice(i, 1);
                this.setState({
                    windows: this.state.windows,
                });
                break;
            }
        }
    }
}
