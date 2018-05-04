import * as React from "react";
import "./style.less";

export interface WindowProps {
    unique: symbol;
    title: string;
    width: number;
    height: number;
    top: number;
    left: number;
    zIndex: number;
    update: (diff: any) => void;
    onMouseDown: (e?: React.MouseEvent<HTMLDivElement>) => void;
    id?: string;
    className?: string;
    children?: React.ReactNode;
    closeBtn?: React.ReactNode;
    onClose?: () => void;
}

enum ResizeType {
    Right = "resize_right",
    RightBottom = "resize_right-bottom",
    Bottom = "resize_bottom",
    LeftBottom = "resize_left-bottom",
    Left = "resize_left",
}

export default class Window extends React.Component<WindowProps, {}> {
    private bodyUserSelect = "";

    public state = {
        isMoving: false,
        isResizing: false,
        resizeType: ResizeType.Right,
        lastX: 0,
        lastY: 0,
    }

    public componentDidMount() {
        document.addEventListener("mousemove", this.handleMouseMove);
        document.addEventListener("mouseup", this.handleMouseUp);
    }

    public componentWillUnmount() {
        document.removeEventListener("mousemove", this.handleMouseMove);
        document.removeEventListener("mouseup", this.handleMouseUp);
    }

    public render() {
        const windowStyle = {
            width: this.props.width,
            height: this.props.height,
            top: this.props.top,
            left: this.props.left,
            zIndex: this.props.zIndex,
        };

        const windowClassNameArr = ["window"];
        if (this.props.className) {
            windowClassNameArr.push(this.props.className);
        }

        return (
            <div
                id={this.props.id}
                className={windowClassNameArr.join(" ")}
                style={windowStyle}
                onMouseDown={(e) => this.props.onMouseDown(e)}
            >
                <div className="window-head">
                    <div className="window-head-action-left">
                        <button onClick={() => this.props.update({title: "1111"})}>
                            菜单
                        </button>
                    </div>
                    <div
                        className="window-head-title"
                        onMouseDown={(e) => this.handleMouseDown(e, "move")}
                    >{this.props.title}</div>
                    <div className="window-head-action-right">
                        {this.props.closeBtn ? this.props.closeBtn : (
                            <button onClick={() => this.props.onClose && this.props.onClose()}>
                                关闭
                            </button>
                        )}
                    </div>
                </div>
                <div className="window-body">{this.props.children}</div>
                <div className="window-resize window-resize-right" onMouseDown={(e) => this.handleMouseDown(e, ResizeType.Right)} />
                <div className="window-resize window-resize-right-bottom" onMouseDown={(e) => this.handleMouseDown(e, ResizeType.RightBottom)} />
                <div className="window-resize window-resize-bottom" onMouseDown={(e) => this.handleMouseDown(e, ResizeType.Bottom)} />
                <div className="window-resize window-resize-left" onMouseDown={(e) => this.handleMouseDown(e, ResizeType.Left)} />
                <div className="window-resize window-resize-left-bottom" onMouseDown={(e) => this.handleMouseDown(e, ResizeType.LeftBottom)} />
            </div>
        );
    }

    private handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: "move" | ResizeType) => {
        this.bodyUserSelect = document.body.style.userSelect || "";
        document.body.style.userSelect = "none";

        if (type === "move") {
            this.setState({
                isMoving: true,
                lastX: e.pageX || e.clientX,
                lastY: e.pageY || e.clientY,
            });
        } else if ((Object as any).values(ResizeType).includes(type)) { // type in ResizeType
            this.setState({
                isResizing: true,
                resizeType: type,
                lastX: e.pageX || e.clientX,
                lastY: e.pageY || e.clientY,
            });
        }
    }

    private handleMouseMove = (e: MouseEvent) => {
        const lastX = e.pageX || e.clientX;
        const lastY = e.pageY || e.clientY;
        const diffX = lastX - this.state.lastX;
        const diffY = lastY - this.state.lastY;

        if (this.state.isMoving) {
            let top = this.props.top + diffY;
            let left = this.props.left + diffX;

            if (top < 0) {
                top = 0;
            } else if (top > document.body.clientHeight - 10) {
                top = document.body.clientHeight - 10;
            }

            if (left < -this.props.width/2) {
                left = -this.props.width/2;
            } else if (left > document.body.clientWidth - this.props.width/2){
                left = document.body.clientWidth - this.props.width/2;
            }

            this.setState({
                lastX: e.pageX || e.clientX,
                lastY: e.pageY || e.clientY,
            }, () => {
                this.props.update({
                    top,
                    left,
                });
            });
        } else if (this.state.isResizing) {
            let width = this.props.width;
            let height = this.props.height;
            let left = this.props.left;

            if (this.state.resizeType === ResizeType.Right) {
                width = width + diffX;
            } else if (this.state.resizeType === ResizeType.Bottom) {
                height = height + diffY;
            } else if (this.state.resizeType === ResizeType.Left) {
                width = width - diffX;
                left = left + diffX;
            } else if (this.state.resizeType === ResizeType.RightBottom) {
                width = width + diffX;
                height = height + diffY;
            } else if (this.state.resizeType === ResizeType.LeftBottom) {
                width = width - diffX;
                height = height + diffY;
                left = left + diffX;
            }

            if (width < 128) {
                width = this.props.width;
                left = this.props.left;
            }

            if (height < 128) {
                height = this.props.height;
            }

            this.setState({
                lastX: e.pageX || e.clientX,
                lastY: e.pageY || e.clientY,
            }, () => {
                this.props.update({
                    width,
                    height,
                    left,
                });
            });
        }
    }

    private handleMouseUp = (e: MouseEvent) => {
        if (this.state.isMoving || this.state.isResizing) {
            document.body.style.userSelect = this.bodyUserSelect;
            this.setState({
                isMoving: false,
                isResizing: false,
            });
        }
    }
}
