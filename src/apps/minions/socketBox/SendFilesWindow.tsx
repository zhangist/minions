import * as React from "react";
import AppWindow from "../../../components/AppWindow";
import { ClientProps } from "../SocketRouter";

export interface ISendFilesWindowProps {
  client: ClientProps;
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
    const { client } = this.props;
    console.log(client);
    return (<div>
      <div>{client.id}::{client.name || ""}</div>
    </div>);
  }
}
