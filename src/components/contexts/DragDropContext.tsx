import * as React from "react";
import { Point } from "../../types/Point";
import { Size } from "../../types/Size";

export type OnDropCallback = (position: Point) => void;

export type DragDropContextData = {
    onDropCallbacks: { [id: string]: OnDropCallback | undefined }; // TODO [RM]: hide?
} & DragDropContextFunctions;

export type DragDropContextFunctions = {
    onElementDragStart: (id: string, dragPosition: Point, elementSize: Size) => void;
    onDrop: (elementId: string, position: Point) => void;
    setOnDropCallback: (id: string, callback: OnDropCallback | null) => void;
};

export type DragDropContextProviderProps = {
    onElementDragStart?: (id: string, dragPosition: Point, elementSize: Size) => void;
};

export type DragDropContextProviderState = DragDropContextData;

const Context = React.createContext<DragDropContextData>({
    onDropCallbacks: {},

    onElementDragStart: () => null,
    onDrop: () => null,
    setOnDropCallback: () => null,
});

export class DragDropContextProvider
extends React.Component<DragDropContextProviderProps, DragDropContextProviderState> {
    constructor(props: DragDropContextProviderProps) {
        super(props);

        this.state = {
            onDropCallbacks: {},

            setOnDropCallback: this.setOnDropCallback,
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
        if (this.props.onElementDragStart) {
            this.props.onElementDragStart(id, dragPosition, elementSize);
        }
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
