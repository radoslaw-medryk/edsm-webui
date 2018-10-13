import * as React from "react";
import { PositionAbsolute } from "./PositionAbsolute";
import { ElementProps } from "../types/props";
import { DragDropContext, DragDropContextData } from "./contexts/DragDropContext";
import { curry } from "@radoslaw-medryk/react-curry";
import { Point } from "../types/Point";
import { Size } from "../types/Size";

export type DragDropElementDetails = {
    isDragged: boolean;
};

export type DragDropElementChildren =
    ((details: DragDropElementDetails) => React.ReactNode)
    | React.ReactNode;

export type DragDropElementProps = {
    elementId: string;
    position: Point;
    onDropped: (position: Point) => void;
    children: DragDropElementChildren;
} & ElementProps<HTMLDivElement>;

export const DragDropElement: React.SFC<DragDropElementProps> = ({ ref, ...rest }) => (
    <DragDropContext.Consumer>
        {context => <DragDropInnerElement context={context} {...rest} />}
    </DragDropContext.Consumer>
);

type DragDropInnerElementProps = {
    context: DragDropContextData;
} & DragDropElementProps;

type DragDropInnerElementState = {
    //
};

class DragDropInnerElement extends React.Component<DragDropInnerElementProps, DragDropInnerElementState> {
    private box: HTMLDivElement | null;

    constructor(props: DragDropInnerElementProps) {
        super(props);

        this.box = null;
    }

    public componentDidMount() {
        const { context, elementId, onDropped } = this.props;

        context.setOnDropCallback(elementId, onDropped);
    }

    public componentWillUnmount() {
        const { context, elementId } = this.props;

        context.setOnDropCallback(elementId, null);
    }

    public render() {
        const { context, elementId, onDropped, children, ...rest } = this.props;

        let content: React.ReactNode;
        if (typeof children === "function") {
            content = children({
                isDragged: !!context.dragged && context.dragged.id === elementId,
            });
        } else {
            content = children;
        }

        return (
            <PositionAbsolute
                {...rest}
                boxRef={this.setBox}
                draggable={true}
                onDragStart={this.onDragStart(context)}
                onDragEnd={this.onDragEnd(context)}
            >
                {content}
            </PositionAbsolute>
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

    private onDragEnd = curry((context: DragDropContextData) => () => {
        context.onElementDragEnd();
    });
}
