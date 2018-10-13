import * as React from "react";
import { PositionAbsolute } from "./PositionAbsolute";
import { ElementProps } from "../types/props";
import { DragDropContext, DragDropContextData } from "./contexts/DragDropContext";
import { curry } from "@radoslaw-medryk/react-curry";
import { Point } from "../types/Point";
import { Size } from "../types/Size";

export type DragDropElementProps = {
    elementId: string;
} & ElementProps<HTMLDivElement>;

export type DragDropElementState = {
    //
};

export class DragDropElement extends React.Component<DragDropElementProps, DragDropElementState> {
    private box: HTMLDivElement | null;

    constructor(props: DragDropElementProps) {
        super(props);

        this.box = null;
    }

    public render() {
        const { elementId, onDragStart, children, ...rest } = this.props;

        const getPosition = (context: DragDropContextData, id: string) => {
            const element = context.elements[id];
            if (!element) {
                throw new Error(`!context.elements[${id}]`);
            }

            return element.position;
        };

        return (
            <DragDropContext.Consumer>
                {context => <>
                    <PositionAbsolute
                        {...rest}
                        boxRef={this.setBox}
                        draggable={true}
                        position={getPosition(context, elementId)}
                        onDragStart={this.onDragStart(context)}
                    >
                        {children}
                    </PositionAbsolute>
                </>}
            </DragDropContext.Consumer>
        );
    }

    private setBox = (box: HTMLDivElement) => {
        this.box = box;
    }

    private onDragStart = curry((context: DragDropContextData) => (e: React.DragEvent<HTMLDivElement>) => {
        const { elementId } = this.props;

        if (!this.box) {
            throw new Error("!this.box");
        }

        const rect = this.box.getBoundingClientRect();
        const dragPosition: Point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        const elementSize: Size = {
            width: rect.width,
            height: rect.height,
        };

        context.onElementDragStart(elementId, dragPosition, elementSize);
    });
}
