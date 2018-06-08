import * as React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import Backup from "@material-ui/icons/Backup";
import { IconButton } from "../../../components/app";
import { File, Client } from "../SocketRouter";

interface MyFile extends File {
  isOpenDetail?: boolean;
  isSelected?: boolean;
  existSelectedClients?: Client[];
  nonExistSelectdClients?: Client[];
}

export interface ClientListProps {
  files: MyFile[];
  handleFileSelect: (file: MyFile) => void;
}

export default class ClientList extends React.Component<ClientListProps, {}> {
  public render() {
    const { files, handleFileSelect } = this.props;

    return (
      <List>
        {files.map(file => (
          <ListItem
            key={file.filename}
            button
            disableRipple
            style={{ padding: "0 8px" }}
          >
            <Checkbox
              onChange={e => handleFileSelect(file)}
              checked={file.isSelected}
            />
            <ListItemText>{file.filename}</ListItemText>
            <div style={{ margin: "0 10px" }}>
              <Tooltip title={file.filename}>
                <span>
                  {(file.existSelectedClients || []).length +
                    "/" +
                    ((file.existSelectedClients || []).length +
                      (file.nonExistSelectdClients || []).length)}
                </span>
              </Tooltip>
            </div>
            <Tooltip title="Send" placement="top">
              <IconButton>
                <Backup />
              </IconButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    );
  }
}
