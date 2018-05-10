import * as React from "react";
import * as io from "socket.io-client";
import AppWindow from "../../components/AppWindow";

import "./style.less";

enum ConnectionState {
    Unconnected = "Unconnected",
    Connecting = "Connecting",
    Connected = "Connected",
    ConnectError = "ConnectError",
    ConnectTimeout = "ConnectTimeout",
    Disconnect = "Disconnect",
}

enum UploadState {
    Uploading = "Uploading",
    UploadSuccess = "UploadSuccess",
    UploadFailed = "UploadFailed",
}

interface MinionsState {
    showConnectionBox: boolean;
    connectionState: ConnectionState;
    socketUrl: string;
    showUploadBox: boolean;
    uploadState?: UploadState;
    uploadUrl: string;
    uploadFile: any;
    clients: {id: string}[];
    windows: any[];
}

export default class Minions extends AppWindow<{}, MinionsState> {
    private socket: SocketIOClient.Socket;
    public state: MinionsState = {
        showConnectionBox: false,
        connectionState: ConnectionState.Unconnected,
        socketUrl: "http://localhost:1992",
        showUploadBox: false,
        uploadState: undefined,
        uploadUrl: "http://localhost:1992/upload",
        uploadFile: null,
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
            <div className="minions">
                <div className="c-box">
                    <button onClick={() => this.setState({ showConnectionBox: !this.state.showConnectionBox })}>Open Connection Box</button>
                    <span>{this.state.connectionState}</span>
                    {this.state.showConnectionBox ? <div>
                        <input type="text" value={this.state.socketUrl} onChange={this.handleSocketUrlChange} />
                        <button onClick={() => this.connect()}>Connect</button>
                    </div> : null}
                </div>
                {this.state.clients.length > 0 ? <div className="c-box">
                    {this.state.clients.map(client => {
                        return (<div key={client.id}>{client.id}</div>);
                    })}
                </div> : null}
                <div className="c-box">
                    <button onClick={() => this.setState({ showUploadBox: !this.state.showUploadBox })}>Open Upload Box</button>
                    {this.state.showUploadBox ? <div>
                        <input value={this.state.uploadUrl} onChange={this.handleUploadUrlChange} />
                        <form method="post" action={this.state.uploadUrl} encType="multipart/form-data">
                            <input name="file" type="file" onChange={this.handleUploadFileChange} />
                            <input type="button" value="Submit" onClick={this.uploadSubmit} />
                        </form>
                        <span>{this.state.uploadState}</span>
                    </div> : null}
                </div>
                <div className="c-box">
                    <button onClick={() => this.openWindows([{name: "socket window", component: <div>socket detail</div>}])}>Open Detail Window</button>
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

    private uploadSubmit = () => {
        if (this.state.uploadFile) {
            this.setState({
                uploadState: UploadState.Uploading
            }, () => {
                const data = new FormData();
                data.append("file", this.state.uploadFile);
                const options: RequestInit = {
                    method: "post",
                    body: data,
                };
                fetch(this.state.uploadUrl, options)
                    .then((response) => {
                        console.log(response);
                        let uploadState: UploadState; 
                        if (response.ok) {
                            uploadState = UploadState.UploadSuccess;
                        } else {
                            uploadState = UploadState.UploadFailed;
                        }
                        this.setState({
                            uploadState,
                        });
                    });
            });
        }
    }

    private handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            uploadFile: e.target.files ? e.target.files[0] : null,
        });
    }

    private handleSocketUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            socketUrl: e.target.value,
        });
    }

    private handleUploadUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            uploadUrl: e.target.value,
        });
    }
}
