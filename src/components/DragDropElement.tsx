import * as React from "react";
import { PositionAbsolute } from "./PositionAbsolute";
import { ElementProps } from "../types/props";
import { DragDropContext, OnDropCallback, DragDropContextData } from "./contexts/DragDropContext";
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
    position: Point;
    onDropped: (position: Point) => void;
    children: DragDropElementChildren;
} & ElementProps<HTMLDivElement>;

// TODO [RM]: move DragDrop... into separate project/package

export class DragDropElement extends React.PureComponent<DragDropElementProps, {}> {
    private static nextElementId = 0;

    private elementId: string;

    constructor(props: DragDropElementProps) {
        super(props);

        this.elementId = (DragDropElement.nextElementId++).toString();
    }

    public render() {
        // TODO [RM]: inline arrow function here due to problem with using curry
        // TODO [RM]: When there is need to pass a lot of properties down
        // TODO [RM]: (In this case whole props should go down).
        // TODO [RM]: Investigate.

        // TODO [RM]: Possible solution is ContextWithTopics - Extended React Context API,
        // TODO [RM]: that allow more dynamic consumer subscribtion based on topics.
        // TODO [RM]: Something like `observedBits` but more extended and dynamic.
        // TODO [RM]: Invesitgate.

        return (
            <DragDropContext.Consumer>
                {this.renderInner}
            </DragDropContext.Consumer>
        );
    }

    private renderInner = (context: DragDropContextData) => {
        const { ref, children, ...rest } = this.props;

        console.log(`DragDropContext.Consumer (for id = ${this.elementId}) children();`);

        return (
            <DragDropInnerElement
                {...rest}
                elementId={this.elementId}
                isDragged={!!context.dragged && context.dragged.id === this.elementId}
                setOnDropCallback={context.setOnDropCallback}
                onElementDragStart={context.onElementDragStart}
                onElementDragEnd={context.onElementDragEnd}
            >
                {children}
            </DragDropInnerElement>
        );
    }
}

type SetOnDropCallbackFunc = (id: string, callback: OnDropCallback | null) => void;
type ElementDragStartFunc = (id: string, dragPosition: Point, elementSize: Size) => void;
type ElementDragEndFunc = () => void;

type DragDropInnerElementProps = {
    elementId: string;
    isDragged: boolean;
    setOnDropCallback: SetOnDropCallbackFunc;
    onElementDragStart: ElementDragStartFunc;
    onElementDragEnd: ElementDragEndFunc;
} & DragDropElementProps;

type DragDropInnerElementState = {
    //
};

// tslint:disable-next-line:max-classes-per-file
class DragDropInnerElement extends React.PureComponent<DragDropInnerElementProps, DragDropInnerElementState> {
    private box: HTMLDivElement | null;

    constructor(props: DragDropInnerElementProps) {
        super(props);

        this.box = null;
    }

    public componentDidMount() {
        const { elementId, setOnDropCallback, onDropped } = this.props;

        setOnDropCallback(elementId, onDropped);
    }

    public componentWillUnmount() {
        const { elementId, setOnDropCallback } = this.props;

        setOnDropCallback(elementId, null);
    }

    public render() {
        const {
            elementId,
            isDragged,
            onElementDragStart,
            onElementDragEnd,
            setOnDropCallback,
            onDropped,
            children,
            ...rest } = this.props; // TODO [RM]: ugly; temp to satisfy linter

        let content: React.ReactNode;
        if (typeof children === "function") {
            content = children({
                isDragged: isDragged,
            });
        } else {
            content = children;
        }

        return (
            <PositionAbsolute
                {...rest}
                boxRef={this.setBox}
                draggable={true}
                onDragStart={this.onDragStart(onElementDragStart)}
                onDragEnd={this.onDragEnd(onElementDragEnd)}
            >
                {content}
            </PositionAbsolute>
        );
    }

    private setBox = (box: HTMLDivElement) => {
        this.box = box;
    }

    private onDragStart = curry((onElementDragStart: ElementDragStartFunc) => (e: React.DragEvent<HTMLDivElement>) => {
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

        onElementDragStart(elementId, dragPosition, elementSize);
    });

    private onDragEnd = curry((onElementDragEnd: ElementDragEndFunc) => () => {
        onElementDragEnd();
    });
}
