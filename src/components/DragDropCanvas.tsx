import * as React from "react";
import classNames from "classnames";
import { ElementProps } from "../types/props";
import { DragDropContext, DragDropContextData, DragDropContextElements } from "./contexts/DragDropContext";
import { Point } from "../types/Point";

const styles = require("./DragDropCanvas.scss");

export type DragDropCanvasProps = {
    initElements?: DragDropContextElements;
} & ElementProps<HTMLDivElement>;

export type DragDropCanvasState = {
    //
};

export class DragDropCanvas extends React.Component<DragDropCanvasProps, DragDropCanvasState> {
    private box: HTMLDivElement | null;

    constructor(props: DragDropCanvasProps) {
        super(props);
    }

    public componentDidMount() {
        const box = this.box;
        if (box === null) {
            throw new Error("box === null");
        }

        box.addEventListener("dragover", this.preventDefaultHandler);
        box.addEventListener("dragenter", this.preventDefaultHandler);
        box.addEventListener("dragleave", this.preventDefaultHandler);
        box.addEventListener("drag", this.onDrag);
        box.addEventListener("drop", this.onDrop);
    }

    public componentWillUnmount() {
        const box = this.box;
        if (box === null) {
            throw new Error("box === null");
        }

        box.removeEventListener("dragover", this.preventDefaultHandler);
        box.removeEventListener("dragenter", this.preventDefaultHandler);
        box.removeEventListener("dragleave", this.preventDefaultHandler);
        box.removeEventListener("drag", this.onDrag);
        box.removeEventListener("drop", this.onDrop);
    }

    public render() {
        // tslint:disable-next-line:prefer-const
        let { initElements, className, ref, children, ...rest } = this.props;
        className = classNames(styles.box, className);

        return (
            <DragDropContext.Provider
                initElements={initElements}
                onElementDragEnd={this.onElementDragEnd}
            >
                <div
                    ref={this.setBox}
                    className={className}
                    {...rest}
                >
                    {children}
                </div>
            </DragDropContext.Provider>
        );
    }

    private setBox = (box: HTMLDivElement | null) => {
        this.box = box;
    }

    private onElementDragEnd = (context: DragDropContextData, id: string, clientPosition: Point) => {
        if (!this.box) {
            throw new Error("!this.box");
        }

        const rect = this.box.getBoundingClientRect();
        const x = clientPosition.x - rect.left;
        const y = clientPosition.y - rect.top;

        if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
            // out of boundaries
            return;
        }

        // TODO [RM]: check if in range

        context.updateElements({
            [id]: {
                position: {x: x, y: y},
            },
        });

    }

    private onDrag = (e: DragEvent) => {
        //
    }

    private onDrop = (e: DragEvent) => {
        //
    }

    private preventDefaultHandler = (e: Event) => e.preventDefault();

}
