import * as React from "react";
import { Point } from "../../types/Point";
import { Size } from "../../types/Size";

export type OnDropCallback = (position: Point) => void;
export type Dragged = { id: string, dragPosition: Point, elementSize: Size } | null;

export type DragDropContextData = {
    dragged: Dragged;
    onDropCallbacks: { [id: string]: OnDropCallback | undefined }; // TODO [RM]: hide?
} & DragDropContextFunctions;

export type DragDropContextFunctions = {
    onElementDragStart: (id: string, dragPosition: Point, elementSize: Size) => void;
    onElementDragEnd: () => void;
    onDrop: (elementId: string, position: Point) => void;
    setOnDropCallback: (id: string, callback: OnDropCallback | null) => void;
};

export type DragDropContextProviderProps = {
    //
};

export type DragDropContextProviderState = DragDropContextData;

const Context = React.createContext<DragDropContextData>({
    dragged: null,
    onDropCallbacks: {},

    onElementDragStart: () => null,
    onElementDragEnd: () => null,
    onDrop: () => null,
    setOnDropCallback: () => null,
});

export class DragDropContextProvider
extends React.Component<DragDropContextProviderProps, DragDropContextProviderState> {
    constructor(props: DragDropContextProviderProps) {
        super(props);

        this.state = {
            dragged: null,
            onDropCallbacks: {},

            setOnDropCallback: this.setOnDropCallback,
            onElementDragEnd: this.onElementDragEnd,
            onElementDragStart: this.onElementDragStart,
            onDrop: this.onDrop,
        };
    }

    public render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context.Provider>
        );
    }

    private setOnDropCallback = (id: string, callback: OnDropCallback | null) => {
        const newCallback = !!callback
            ? callback
            : undefined;

        this.setState(state => ({
            onDropCallbacks: { ...state.onDropCallbacks, [id]: newCallback },
        }));
    }

    private onElementDragStart = (id: string, dragPosition: Point, elementSize: Size) => {
        this.setState({
            dragged: {
                id: id,
                dragPosition: dragPosition,
                elementSize: elementSize,
            },
        });
    }

    private onElementDragEnd = () => {
        this.setState({
            dragged: null,
        });
    }

    private onDrop = (id: string, position: Point) => {
        const callback = this.state.onDropCallbacks[id];
        if (!callback) {
            return;
        }

        callback(position);
    }
}

export const DragDropContext = {
    Consumer: Context.Consumer,
    Provider: DragDropContextProvider,
};
