import * as React from "react";
import { Point } from "../../types/Point";

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
    onElementDragEnd: (id: string, clientPosition: Point) => void;
    replaceElements: (elements: DragDropContextElements) => void;
    updateElements: (elements: DragDropContextElements) => void;
};

export type DragDropContextProps = {
    initElements?: DragDropContextElements;
    onElementDragEnd?: (context: DragDropContextData, id: string, clientPosition: Point) => void;
};

export type DragDropContextState = DragDropContextData;

const Context = React.createContext<DragDropContextData>({
    elements: {},
    onElementDragEnd: () => null,
    replaceElements: () => null,
    updateElements: () => null,
});

export class DragDropContextProvider extends React.Component<DragDropContextProps, DragDropContextState> {
    constructor(props: DragDropContextProps) {
        super(props);

        this.state = {
            elements: { ...this.props.initElements },

            onElementDragEnd: this.onElementDragEnd,
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

    private onElementDragEnd = (id: string, clientPosition: Point) => {
        if (this.props.onElementDragEnd) {
            this.props.onElementDragEnd(this.state, id, clientPosition);
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
