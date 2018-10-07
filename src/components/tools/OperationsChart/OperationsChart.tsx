import * as React from "react";
import { OperationBox } from "./OperationBox";
import { AssemblyContextData } from "../../contexts/AssemblyContext";

const styles = require("./OperationsChart.scss");

export type OperationsChartProps = {
    context: AssemblyContextData;
};

export type OperationsChartState = {
    //
};

export class OperationsChart extends React.Component<OperationsChartProps, OperationsChartState> {
    constructor(props: OperationsChartProps) {
        super(props);
    }

    public render() {
        const { context } = this.props;
        const { selection } = context;

        if (!selection.branch) {
            return null;
        }

        const { operations } = selection.branch;

        return (
            <div className={styles.box}>
                {operations.map(q => (
                    <OperationBox
                        key={q.position}
                        data={q}
                        context={context}
                    />
                ))}
            </div>
        );
    }
}
