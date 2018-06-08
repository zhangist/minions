import * as React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { Client } from "../SocketRouter";

interface MyClient extends Client {
  isOpenDetail?: boolean;
  isSelected?: boolean;
}

export interface ClientListProps {
  clients: MyClient[];
  handleClientClick: (client: MyClient) => void;
  handleClientSelect: (client: MyClient) => void;
}

export default class ClientList extends React.Component<ClientListProps, {}> {
  public render() {
    const { clients, handleClientClick, handleClientSelect } = this.props;

    return (
      <List
        style={{
          flex: "auto",
          overflow: "auto",
          padding: "10px",
          backgroundColor: "#fff",
        }}
      >
        {clients.map(client => {
          return [
            <ListItem
              key={client.id}
              button
              disableRipple
              style={{ padding: "0 8px" }}
              onClick={() => handleClientClick(client)}
            >
              <Checkbox
                onClick={e => e.stopPropagation()}
                onChange={e => handleClientSelect(client)}
                checked={client.isSelected}
              />
              <ListItemText>
                {client.name || ""} - {client.id}
              </ListItemText>
              {client.isOpenDetail ? <ExpandLess /> : <ExpandMore />}
            </ListItem>,
            client.isOpenDetail ? (
              <List key={"detail" + client.id}>
                <ListItem>
                  <div>files: test.mp3</div>
                </ListItem>
              </List>
            ) : null,
          ];
        })}
      </List>
    );
  }
}
