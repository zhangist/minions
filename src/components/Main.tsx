import * as React from "react";
import AppWindow from "./AppWindow";
import Clock from "./clock";
import entries from "../apps/entries";

import "./style.less";

export interface MainProps {}

interface MainState {
    showSystemMenu: boolean;
    windows: any[];
}

export default class Main extends AppWindow<MainProps, MainState> {
    public state: MainState = {
        showSystemMenu: false,
        windows: [],
    };

    public componentDidMount() {
        document.addEventListener("click", this.hideSystemMenu);
    }

    public componentWillUnmount() {
        document.removeEventListener("click", this.hideSystemMenu);
    }

    public render() {
        return (
            <div className="app">
                <div className="header">
                    <div style={{position: "relative",padding: "0 0.5em"}}>
                        <span onClick={this.handleSystemMenuClick} style={{cursor: "default"}}>Minions System</span>
                        {this.state.showSystemMenu ? <div className="system-menu">
                        {entries.map((app, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={(e) => this.handleAppMenuClick(e, app)}
                                    style={{padding: "0 1em"}}
                                >
                                    {app.name}
                                </div>
                            );
                        })}
                        </div> : null}
                    </div>
                    <div style={{flex: "auto"}} />
                    <div style={{padding: "0 0.5em"}}><Clock /></div>
                </div>
                <div className="content">
                {this.renderWindows()}
                </div>
            </div>
        );
    }

    private handleSystemMenuClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            showSystemMenu: !this.state.showSystemMenu,
        });
    }

    private handleAppMenuClick = (e: React.MouseEvent<HTMLDivElement>, app: any) => {
        e.nativeEvent.stopImmediatePropagation();
        this.openWindows([app]);
        this.setState({
            showSystemMenu: false,
        });
    }

    private hideSystemMenu = () => {
        this.setState({
            showSystemMenu: false,
        });
    }
}
