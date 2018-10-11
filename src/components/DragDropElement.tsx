import * as React from "react";
import { PositionAbsolute } from "./PositionAbsolute";
import { ElementProps } from "../types/props";
import classNames from "classnames";
import { DragDropContext, DragDropContextData } from "./contexts/DragDropContext";
import { curry } from "@radoslaw-medryk/react-curry";
import { Point } from "../types/Point";

const styles = require("./DragDropElement.scss");

export type DragDropElementProps = {
    id: string;
} & ElementProps<HTMLDivElement>;

export type DragDropElementState = {
    dragPosition: Point | null;
};

export class DragDropElement extends React.Component<DragDropElementProps, DragDropElementState> {
    private box: HTMLDivElement | null;

    constructor(props: DragDropElementProps) {
        super(props);

        this.state = {
            dragPosition: null,
        };

        this.box = null;
    }

    public render() {
        const { id, className, draggable, onDragStart, onDragEnd, ...rest } = this.props;

        const getPosition = (context: DragDropContextData, elementId: string) => {
            const element = context.elements[elementId];
            if (!element) {
                throw new Error(`!context.elements[${elementId}]`);
            }

            return element.position;
        };

        return (
            <DragDropContext.Consumer>
                {context => <>
                    <PositionAbsolute
                        boxRef={this.setBox}
                        id={id}
                        className={classNames(styles.box, className)}
                        draggable={true}
                        position={getPosition(context, id)}
                        onDragStart={this.onDragStart(context)}
                        onDragEnd={this.onDragEnd(context)}
                        {...rest}
                    >
                        {this.props.children}
                    </PositionAbsolute>
                </>}
            </DragDropContext.Consumer>
        );
    }

    private setBox = (box: HTMLDivElement) => {
        this.box = box;
    }

    private onDragStart = curry((context: DragDropContextData) => (e: React.DragEvent<HTMLDivElement>) => {
        if (!this.box) {
            throw new Error("!this.box");
        }

        const id = this.props.id;

        const rect = this.box.getBoundingClientRect();
        const dragPosition: Point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        this.setState({ dragPosition: dragPosition });
    });

    private onDragEnd = curry((context: DragDropContextData) => (e: React.DragEvent<HTMLDivElement>) => {
        const { id } = this.props;
        const { dragPosition } = this.state;

        if (!dragPosition) {
            throw new Error ("!dragPosition");
        }

        const clientPosition: Point = {
            x: e.clientX - dragPosition.x,
            y: e.clientY - dragPosition.y,
        };
        context.onElementDragEnd(id, clientPosition);
    });
}
