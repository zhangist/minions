import * as React from "react";
import Window, { WindowProps } from "../components/window";

interface State {
  windows: WindowProps[];
}

export default class AppWindow<
  p = {},
  s = State,
  ss = any
> extends React.Component {
  public state: State = {
    windows: [],
  };

  public openWindows(apps: any[]) {
    this.state.windows.map(windowProps => {
      windowProps.isActive = false;
    });
    apps.map((app, index) => {
      const unique = Symbol();
      this.state.windows.push({
        unique,
        id: app.id || null,
        className: app.className || null,
        title: app.name || "Untitled Window",
        width: app.width || 300,
        height: app.height || 200,
        top: (this.state.windows.length + 1) * 20,
        left: (this.state.windows.length + 1) * 20,
        zIndex: this.state.windows.length + 1,
        isActive: index + 1 === apps.length ? true : false,
        update: diff => this.updateWindowProps(unique, diff),
        onClose: () => this.closeWindow(unique),
        onMouseDown: () => this.handleWindowActive(unique),
        children: app.component || <div />,
      });
    });
    this.setState({});
  }

  public renderWindows() {
    return (
      <div>
        {this.state.windows.map((windowProps, index) => {
          return <Window key={index} {...windowProps} />;
        })}
      </div>
    );
  }

  private handleWindowActive(unique: symbol) {
    let zIndex = 0;
    for (let i = 0; i < this.state.windows.length; i++) {
      if (this.state.windows[i].unique === unique) {
        zIndex = this.state.windows[i].zIndex;
        break;
      }
    }
    for (let i = 0; i < this.state.windows.length; i++) {
      if (this.state.windows[i].unique === unique) {
        this.state.windows[i].zIndex = this.state.windows.length;
        this.state.windows[i].isActive = true;
      } else {
        if (this.state.windows[i].zIndex > zIndex) {
          this.state.windows[i].zIndex = this.state.windows[i].zIndex - 1;
          this.state.windows[i].isActive = false;
        }
      }
    }

    this.setState({
      windows: this.state.windows,
    });
  }

  private updateWindowProps(unique: symbol, diff: any) {
    for (let i = 0; i < this.state.windows.length; i++) {
      if (this.state.windows[i].unique === unique) {
        this.state.windows[i] = Object.assign(this.state.windows[i], diff);
        this.setState({
          windows: this.state.windows,
        });
        break;
      }
    }
  }

  private closeWindow(unique: symbol) {
    for (let i = 0; i < this.state.windows.length; i++) {
      if (this.state.windows[i].unique === unique) {
        this.state.windows.splice(i, 1);
        this.setState({
          windows: this.state.windows,
        });
        break;
      }
    }
  }
}
