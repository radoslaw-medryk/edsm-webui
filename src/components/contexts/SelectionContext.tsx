import * as React from "react";
import { BranchData } from "../../contracts/BranchData";
import { OperationData } from "../../contracts/OperationData";
import { createPubSub } from "@radoslaw-medryk/react-pubsub";

export type SelectionData = {
    branch: BranchData | null;
    operation: OperationData | null;
};

export type SetSelectionFunc = (value: SelectionData) => void;
export type ClearSelectionFunc = () => void;

export type SelectionActions = {
    setSelection: SetSelectionFunc;
    clearSelection: ClearSelectionFunc;
};

export type SelectionContextData = SelectionData & {
    actions: SelectionActions,
};

const calculateChangedTopics = (prev: SelectionContextData, next: SelectionContextData) => {
    // TODO this logic seems to repeat between contexts; Make generic helper function?

    const prevId = prev.branch ? prev.branch.position : null;
    const nextId = next.branch ? next.branch.position : null;

    if (prevId === nextId) {
        return [];
    }

    if (prevId === null || nextId === null) {
        return [prevId !== null ? prevId : nextId as string];
    }

    return [prevId, nextId];
};

const Context = createPubSub<SelectionContextData>({
    branch: null,
    operation: null,
    actions: {
        setSelection: () => null,
        clearSelection: () => null,
    },
}, calculateChangedTopics);

export type SelectionContextProviderProps = {
    //
};

export type SelectionContextProviderState = SelectionContextData;

export class SelectionContextProvider
extends React.Component<SelectionContextProviderProps, SelectionContextProviderState> {
    constructor(props: SelectionContextProviderProps) {
        super(props);

        this.state = {
            branch: null,
            operation: null,

            actions: {
                setSelection: this.setSelection,
                clearSelection: this.clearSelection,
            },
        };
    }

    public render() {
        return (
            <Context.Provider value={this.state}>
                {this.props.children}
            </Context .Provider>
        );
    }

    private setSelection = (value: SelectionData) => {
        this.setState({ ...value });
    }

    private clearSelection = () => {
        this.setState({ branch: null, operation: null });
    }
}

export const SelectionContext = {
    Provider: SelectionContextProvider,
    Consumer: Context.Consumer,
};
