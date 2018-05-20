import * as React from "react";
import AppWindow from "../../../components/AppWindow";
import { Client } from "../SocketRouter";

export interface ISendFilesWindowProps {
  clients: Client[];
}

interface ISendFilesWindowState {
  files: any[];
  windows: any[];
}

export default class SendFilesWindow extends AppWindow<
  ISendFilesWindowProps,
  ISendFilesWindowState
> {
  public state: ISendFilesWindowState = {
    files: [],
    windows: [],
  };
  public render() {
    const { clients } = this.props;
    return (
      <div>
        {clients.map(client => {
          return (
            <div>
              {client.id}::{client.name || ""}
            </div>
          );
        })}
      </div>
    );
  }
}
