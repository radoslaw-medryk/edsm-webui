import * as React from "react";
import { Point } from "../../types/Point";
import { Size } from "../../types/Size";

export type DragDropContextElement = {
    position: Point;
};

export type DragDropContextElements = {
    [key: string]: DragDropContextElement | undefined;
};

export type DragDropContextData = {
    elements: DragDropContextElements;
} & DragDropContextFunctions;

export type DragDropContextFunctions = {
    onElementDragStart: (id: string, dragPosition: Point, elementSize: Size) => void;
    onElementDragEnd: (id: string, clientPosition: Point, elementSize: Size) => void;
    onDrop: (clientPosition: Point) => void;
    replaceElements: (elements: DragDropContextElements) => void;
    updateElements: (elements: DragDropContextElements) => void;
};

export type DragDropContextProps = {
    initElements?: DragDropContextElements;
    onElementDragStart?: (id: string, dragPosition: Point, elementSize: Size) => void;
    onElementDragEnd?: (context: DragDropContextData, id: string, clientPosition: Point, elementSize: Size) => void;
    onDrop?: (context: DragDropContextData, clientPosition: Point) => void;
};

export type DragDropContextState = DragDropContextData;

const Context = React.createContext<DragDropContextData>({
    elements: {},
    onElementDragStart: () => null,
    onElementDragEnd: () => null,
    onDrop: () => null,
    replaceElements: () => null,
    updateElements: () => null,
});

export class DragDropContextProvider extends React.Component<DragDropContextProps, DragDropContextState> {
    constructor(props: DragDropContextProps) {
        super(props);

        this.state = {
            elements: { ...this.props.initElements },

            onElementDragStart: this.onElementDragStart,
            onElementDragEnd: this.onElementDragEnd,
            onDrop: this.onDrop,
            replaceElements: this.replaceElements,
            updateElements: this.updateElements,
        };
    }

    public render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        );
    }

    private onElementDragStart = (id: string, dragPosition: Point, elementSize: Size) => {
        if (this.props.onElementDragStart) {
            this.props.onElementDragStart(id, dragPosition, elementSize);
        }
    }

    private onElementDragEnd = (id: string, clientPosition: Point, elementSize: Size) => {
        if (this.props.onElementDragEnd) {
            this.props.onElementDragEnd(this.state, id, clientPosition, elementSize);
        }
    }

    private onDrop = (clientPosition: Point) => {
        if (this.props.onDrop) {
            this.props.onDrop(this.state, clientPosition);
        }
    }

    private replaceElements = (elements: DragDropContextElements) => {
        this.setState({
            elements: { ...elements },
        });
    }

    private updateElements = (elements: DragDropContextElements) => {
        this.setState(state => ({
            elements: { ...state.elements, ...elements },
        }));
    }
}

export const DragDropContext = {
    Consumer: Context.Consumer,
    Provider: DragDropContextProvider,
};
