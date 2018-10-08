import * as React from "react";
import { OperationBox } from "./OperationBox";
import { SelectionData } from "../../cpus/SelectionCpu";

const styles = require("./OperationsChart.scss");

export type OperationsChartProps = {
    selection: SelectionData;
};

export type OperationsChartState = {
    //
};

export class OperationsChart extends React.Component<OperationsChartProps, OperationsChartState> {
    constructor(props: OperationsChartProps) {
        super(props);
    }

    public render() {
        const { selection } = this.props;

        if (!selection.branch) {
            return null;
        }

        const { operations } = selection.branch;

        const isSelected = (id: string) => !!selection.operation && selection.operation.position === id;

        return (
            <div className={styles.box}>
                {operations.map(q => (
                    <OperationBox
                        key={q.position}
                        data={q}
                        isSelected={isSelected(q.position)}
                    />
                ))}
            </div>
        );
    }
}
