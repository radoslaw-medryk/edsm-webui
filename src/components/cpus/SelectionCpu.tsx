import * as React from "react";
import { BranchData } from "../../contracts/BranchData";
import { OperationData } from "../../contracts/OperationData";

export type SelectionData = {
    branch: BranchData | null;
    operation: OperationData | null;
};

export type SelectionActions = {
    setSelection: (value: SelectionData) => void;
    clearSelection: () => void;
};

export type SelectionContext = SelectionData & {
    actions: SelectionActions,
};

export type SelectionCpuProps = {
    children: (context: SelectionContext) => React.ReactNode;
};

export type SelectionCpuState = SelectionContext;

export class SelectionCpu extends React.PureComponent<SelectionCpuProps, SelectionCpuState> {
    constructor(props: SelectionCpuProps) {
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
        console.log("SelectionCpu render();");
        return this.props.children(this.state);
    }

    private setSelection = (value: SelectionData) => {
        console.log("setSelection branch: ", value.branch, "operation: ", value.operation);

        this.setState({ ...value });
    }

    private clearSelection = () => {
        this.setState({ branch: null, operation: null });
    }
}
