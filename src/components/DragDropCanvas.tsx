import * as React from "react";
import { ElementProps } from "../types/props";
import { DragDropContext, DragDropContextData, DragDropContextElements } from "./contexts/DragDropContext";
import { Point } from "../types/Point";
import { Size } from "../types/Size";
import { curry } from "@radoslaw-medryk/react-curry";

export type DragDropCanvasProps = {
    initElements?: DragDropContextElements;
} & ElementProps<HTMLDivElement>;

export type DragDropCanvasState = {
    dragged: { id: string, dragPosition: Point, elementSize: Size } | null;
};

export class DragDropCanvas extends React.Component<DragDropCanvasProps, DragDropCanvasState> {
    private box: HTMLDivElement | null;

    constructor(props: DragDropCanvasProps) {
        super(props);

        this.state = {
            dragged: null,
        };
    }

    public render() {
        const { initElements, children, ...rest } = this.props;

        return (
            <DragDropContext.Provider
                initElements={initElements}
                onElementDragStart={this.onElementDragStart}
            >
                <DragDropContext.Consumer>
                    {context => <>
                        <div
                            {...rest}
                            ref={this.setBox}
                            onDragOver={this.preventDefaultHandler}
                            onDragEnter={this.preventDefaultHandler}
                            onDragLeave={this.preventDefaultHandler}
                            onDrop={this.onDrop(context)}
                        >
                            {children}
                        </div>
                    </>}
                </DragDropContext.Consumer>
            </DragDropContext.Provider>
        );
    }

    private setBox = (box: HTMLDivElement | null) => {
        this.box = box;
    }

    private onElementDragStart = (id: string, dragPosition: Point, elementSize: Size) => {
        this.setState({
            dragged: { id: id, dragPosition: dragPosition, elementSize: elementSize },
        });
    }

    private onDrop = curry((context: DragDropContextData) => (e: React.DragEvent<HTMLDivElement>) => {
        if (!this.box) {
            throw new Error("!this.box");
        }

        const { dragged } = this.state;
        if (!dragged) {
            throw new Error("!dragged");
        }

        // TODO [RM]: check / get dragged element from event?

        const dragPosition = dragged.dragPosition;
        const size = dragged.elementSize;

        const rect = this.box.getBoundingClientRect();
        const x = e.clientX - dragPosition.x - rect.left;
        const y = e.clientY - dragPosition.y - rect.top;

        if (x < 0 || x + size.width > rect.width
            || y < 0 || y + size.height > rect.height) {
            // out of boundaries
            return;
        }

        context.updateElements({
            [dragged.id]: {
                position: {x: x, y: y},
            },
        });
    });

    private preventDefaultHandler = (e: React.SyntheticEvent) => e.preventDefault();
}
