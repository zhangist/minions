import * as React from "react";
import "./style.less";

export interface ClockProps {}

export default class Clock extends React.Component<ClockProps, {}> {
  private timer: any = null;

  public state = {
    time: this.format("hh:mm"),
  };

  public componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        time: this.format("hh:mm"),
      });
    }, 1000);
  }

  public componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  public render() {
    return <div>{this.state.time}</div>;
  }

  private format(format: string) {
    const _d = new Date();
    const o = {
      "M+": _d.getMonth() + 1, //month
      "d+": _d.getDate(), //day
      "h+": _d.getHours(), //hour
      "m+": _d.getMinutes(), //minute
      "s+": _d.getSeconds(), //second
      "q+": Math.floor((_d.getMonth() + 3) / 3), //quarter
      S: _d.getMilliseconds(), //millisecond
    };

    if (/(y+)/.test(format)) {
      format = format.replace(
        RegExp.$1,
        (_d.getFullYear() + "").substr(4 - RegExp.$1.length),
      );
    }

    for (let k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length),
        );
      }
    }

    return format;
  }
}
