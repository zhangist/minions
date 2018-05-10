import * as React from "react";
import AppWindow from "../../components/AppWindow";
import SocketBox from "./SocketBox";
import UploadBox from "./UploadBox";

import "./style.less";

interface MinionsState {
    windows: any[];
}

export default class Minions extends AppWindow<{}, MinionsState> {
    private socket: SocketIOClient.Socket;
    public state: MinionsState = {
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
                    <SocketBox />
                </div>
                <div className="c-box">
                    <UploadBox />
                </div>
                <div className="c-box">
                    <button onClick={() => this.openWindows([{name: "socket window", component: <div>socket detail</div>}])}>Open Detail Window</button>
                </div>
                {this.renderWindows()}
            </div>
        );
    }
}
