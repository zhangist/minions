import * as React from "react";
import "./style.less";

export interface ClockProps {
    
}

export default class Clock extends React.Component<ClockProps, {}> {
    private timer: any = null;

    public state = {
        time: new Date().getHours() + ":" + new Date().getMinutes(),
    }

    public componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                time: new Date().getHours() + ":" + new Date().getMinutes(),
            });
        }, 1000);
    }

    public componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    public render() {
        return (
            <div>{this.state.time}</div>
        );
    }
}
