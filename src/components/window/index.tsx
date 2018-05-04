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
    isActive: boolean;
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
    private mouseX = 0;
    private mouseY = 0;
    private windowX = 0;
    private windowY = 0;
    private windowWidth = 0;
    private windowHeight = 0;
    private isMoving = false;
    private isResizing = false;
    private resizeType = ResizeType.Right;

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
        if (this.props.isActive) {
            windowClassNameArr.push("window-active");
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
                <div className="window-resize window-resize-left" onMouseDown={(e) => this.handleMouseDown(e, ResizeType.Left)} />
                <div className="window-resize window-resize-right" onMouseDown={(e) => this.handleMouseDown(e, ResizeType.Right)} />
                <div className="window-resize window-resize-bottom" onMouseDown={(e) => this.handleMouseDown(e, ResizeType.Bottom)} />
                <div className="window-resize window-resize-left-bottom" onMouseDown={(e) => this.handleMouseDown(e, ResizeType.LeftBottom)} />
                <div className="window-resize window-resize-right-bottom" onMouseDown={(e) => this.handleMouseDown(e, ResizeType.RightBottom)} />
            </div>
        );
    }

    private handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, type: "move" | ResizeType) => {
        this.bodyUserSelect = document.body.style.userSelect || "";
        document.body.style.userSelect = "none";

        this.mouseX = e.pageX || e.clientX;
        this.mouseY = e.pageY || e.clientY;
        this.windowX = this.props.left;
        this.windowY = this.props.top;
        this.windowWidth = this.props.width;
        this.windowHeight = this.props.height;

        if (type === "move") {
            this.isMoving = true;
        } else if ((Object as any).values(ResizeType).includes(type)) { // type in ResizeType
            this.isResizing = true;
            this.resizeType = type;
        }
    }

    private handleMouseMove = (e: MouseEvent) => {
        const mouseX = e.pageX || e.clientX;
        const mouseY = e.pageY || e.clientY;
        const diffX = mouseX - this.mouseX;
        const diffY = mouseY - this.mouseY;

        if (this.isMoving) {
            let top = diffY + this.windowY;
            let left = diffX + this.windowX;

            if (top < 0) {
                top = 0;
            } else if (top > document.body.clientHeight - 20) {
                top = document.body.clientHeight - 20;
            }

            if (left < -this.props.width/2) {
                left = -this.props.width/2;
            } else if (left > document.body.clientWidth - this.props.width/2){
                left = document.body.clientWidth - this.props.width/2;
            }

            this.props.update({
                top,
                left,
            });
        } else if (this.isResizing) {
            // let width = mouseX - this.windowX;
            // let height = mouseY - this.windowY;
            let width = this.windowWidth;
            let height = this.windowHeight;
            let left = this.windowX;

            if (this.resizeType === ResizeType.Right) {
                width = width + diffX;
            } else if (this.resizeType === ResizeType.Bottom) {
                height = height + diffY;
            } else if (this.resizeType === ResizeType.Left) {
                width = width - diffX;
                left = left + diffX;
            } else if (this.resizeType === ResizeType.RightBottom) {
                width = width + diffX;
                height = height + diffY;
            } else if (this.resizeType === ResizeType.LeftBottom) {
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

            this.props.update({
                width,
                height,
                left,
            });
        }
    }

    private handleMouseUp = (e: MouseEvent) => {
        if (this.isMoving || this.isResizing) {
            document.body.style.userSelect = this.bodyUserSelect;
            this.isMoving = false;
            this.isResizing = false;
        }
    }
}
