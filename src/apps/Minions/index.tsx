import * as React from "react";
import AppWindow from "../../components/AppWindow";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SocketBox from "./SocketBox";
import UploadBox from "./UploadBox";
import "./style.less";

interface MinionsState {
  tabIndex: number;
  windows: any[];
}

export default class Minions extends AppWindow<{}, MinionsState> {
  private socket: SocketIOClient.Socket;
  public state: MinionsState = {
    tabIndex: 0,
    windows: [],
  };

  public componentWillUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  }

  public render() {
    const { tabIndex } = this.state;

    return (
      <div
        className="minions"
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Tabs
          value={tabIndex}
          onChange={this.handleTabChange}
          style={{ flex: "none" }}
        >
          <Tab label="Clients" />
          <Tab label="Files" />
        </Tabs>
        <div style={{ flex: "auto", overflow: "auto" }}>
          <div
            className="c-box"
            style={{ display: tabIndex === 0 ? "block" : "none" }}
          >
            <SocketBox />
          </div>
          <div
            className="c-box"
            style={{ display: tabIndex === 1 ? "block" : "none" }}
          >
            <UploadBox />
          </div>
        </div>

        {/* <div className="c-box">
          <button
            onClick={() =>
              this.openWindows([
                { name: "socket window", component: <div>socket detail</div> },
              ])
            }
          >
            Open Detail Window
          </button>
        </div> */}
        {this.renderWindows()}
      </div>
    );
  }

  private handleTabChange = (e: any, value: number) => {
    this.setState({ tabIndex: value });
  };
}
