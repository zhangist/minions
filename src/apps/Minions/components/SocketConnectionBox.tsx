import * as React from "react";
import SocketConnectionState from "../SocketConnectionState";

export interface SocketConnectionBoxProps {
  connectionState: SocketConnectionState;
  url: string;
  connect: (url?: string) => void;
  emit: (event: string, data: string) => void;
}

interface State {
  isShowConnectionBox: boolean;
  url: string;
  emitEvent: string;
  emitData: string;
}

export default class SocketConnectionBox extends React.Component<
  SocketConnectionBoxProps,
  State
> {
  public state: State = {
    isShowConnectionBox: false,
    url: this.props.url,
    emitEvent: "",
    emitData: "",
  };

  public render() {
    const { connectionState, connect, emit } = this.props;
    const { isShowConnectionBox, url, emitEvent, emitData } = this.state;

    return (
      <div>
        <button
          onClick={() =>
            this.setState({ isShowConnectionBox: !isShowConnectionBox })
          }
        >
          Open Connection Box
        </button>
        <span>{connectionState}</span>
        {isShowConnectionBox ? (
          <div>
            <input
              type="text"
              value={url}
              onChange={e => this.setState({ url: e.target.value })}
            />
            <button onClick={() => connect(url)}>Connect</button>
          </div>
        ) : null}
        {connectionState === SocketConnectionState.Connected ? (
          <div>
            <input
              type="text"
              value={emitEvent}
              onChange={e => this.setState({ emitEvent: e.target.value })}
            />
            <input
              type="text"
              value={emitData}
              onChange={e => this.setState({ emitData: e.target.value })}
              style={{ width: "300px" }}
            />
            <button onClick={() => emit(emitEvent, emitData)}>Emit</button>
          </div>
        ) : null}
        <div style={{ wordBreak: "break-all" }}>
          <div>emit event:</div>
          <div
          >{`post_files: { "clients": [{ "id": "socket_id" }], "files": [{ "filename": "filename.mp3" }] }`}</div>
          <div
          >{`post_play_file: { "clients": [{ "id": "socket_id" }], "file": [{ "filename": "filename.mp3" }] }`}</div>
          <div>{`post_play_start: { "clients": [{ "id": "socket_id" }] }`}</div>
        </div>
      </div>
    );
  }
}
