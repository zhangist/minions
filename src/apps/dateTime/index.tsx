import * as React from "react";

export default class DateTime extends React.Component {
    private timer: any;
    public state = {
        dateTime: new Date().toLocaleString(),
    }

    public componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                dateTime: new Date().toLocaleString(),
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
            <div>{this.state.dateTime}</div>
        );
    }
}
