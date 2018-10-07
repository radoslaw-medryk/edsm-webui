import * as React from "react";
import { AssemblyData } from "../../contracts/AssemblyData";
import { BranchData } from "../../contracts/BranchData";
import { OperationData } from "../../contracts/OperationData";

type SelectionData = {
    branch: BranchData | null;
    operation: OperationData | null;
};

export type AssemblyContextProviderProps = {
    data: AssemblyData;
};

export type AssemblyContextProviderState = {
    selection: SelectionData;
};

type AssemblyContextFunctions = {
    setSelection: (value: SelectionData) => void;
    clearSelection: () => void;
};

export type AssemblyContextData = AssemblyContextFunctions
    & AssemblyContextProviderProps
    & AssemblyContextProviderState;

const Context = React.createContext<AssemblyContextData>({
    data: {
        branches: [],
    },
    selection: {
        branch: null,
        operation: null,
    },
    setSelection: () => null,
    clearSelection: () => null,
});

export class AssemblyContextProvider
    extends React.Component<AssemblyContextProviderProps, AssemblyContextProviderState> {
    private functions: AssemblyContextFunctions;

    constructor(props: AssemblyContextProviderProps) {
        super(props);

        this.functions = {
            setSelection: this.setSelection,
            clearSelection: this.clearSelection,
        };

        this.state = {
            selection: { branch: null, operation: null },
        };
    }

    public componentDidMount() {
        this.clearSelection();
    }

    public componentDidUpdate(prevProps: AssemblyContextProviderProps) {
        if (this.props.data === prevProps.data) {
            return;
        }

        this.clearSelection();
    }

    public render() {
        const { children, ...rest } = this.props;

        return (
            <Context.Provider value={{ ...this.functions, ...rest, ...this.state }}>
                {children}
            </Context.Provider>
        );
    }

    private clearSelection = () => {
        this.setSelection({ branch: null, operation: null });
    }

    private setSelection = (value: SelectionData) => {
        this.setState({ selection: {...value} });
    }
}

export const AssemblyContext = {
    Consumer: Context.Consumer,
    Provider: AssemblyContextProvider,
};
